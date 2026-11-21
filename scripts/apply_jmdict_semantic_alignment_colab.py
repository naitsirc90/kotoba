#!/usr/bin/env python3
"""Apply Kotoba JMdict V3 editorial mapping to the existing canonical ZIP on personal Drive.

Conservative, resumable, in-place update:
- 18 verified SOURCE_INDEX mappings; 5 preserved historical LEGACY_UNLINKED meanings.
- No mutation of k_sense, senses, translations, examples, user progress or runtime.
- Existing k_jmdict_semantic_alignment rows gain explicit final_* columns.
- All existing rows/columns and other database tables are compared before upload.
- The ZIP's existing JMdict report and canonical manifest are revised in place.
- No persistent backup, checkpoint or second cloud copy is created.
- If post-upload verification fails, attempt rollback using a local temporary copy.
"""
from __future__ import annotations

import copy
import datetime as dt
import hashlib
import json
import pathlib
import shutil
import sqlite3
import sys
import tempfile
import zipfile

from collections import Counter

CANONICAL_FILE_ID="1vpNZ6SgkF5SWk5EnrXgyYDSfJwM8Hde0"
PERSONAL_EMAIL="naitsirc90@gmail.com"
FOLDER_ID="18o6iSyolP84_I_IjvklBqOpyvS0YIJlW"
PINNED_ORIGINAL_SHA="fcfb07c89d8de0d8c6160072c0fb576f289a98b73a53dd7baf10f285348d026c"
PINNED_ORIGINAL_BYTES=516819484
FROZEN_XML_SHA="02c51639a138cfd874683b368f651d2d5a4108bf0054712c63913f3b25eef2a0"
DB_MEMBER="KOTOBA-CANONICO/01-DATABASE/KOTOBA-DATABASE-CANONICO.sqlite"
REPORT_MEMBER="KOTOBA-CANONICO/04-DOCUMENTAZIONE/JMDICT-92-RAPPORTO-REVISIONE-CORRENTE.json"
MANIFEST_MEMBER="KOTOBA-CANONICO/04-DOCUMENTAZIONE/MANIFEST-CANONICO.json"
STATUS_MAPPED="SOURCE_INDEX_VERIFIED"
STATUS_LEGACY="LEGACY_UNLINKED_AND_PRESERVED"
EDIT_VERSION="JMDICT_SEMANTIC_ALIGNMENT_V3_20261121"

# Exactly the 23 IDs and source indices reviewed against the pinned JMdict XML
# in the successful 2026-11-21 Colab report. None of these are replacements
# for the stable Kotoba sense IDs.
FINAL={
 "jmdict-1050590-2":3,
 "jmdict-1050590-3":4,
 "jmdict-1077060-1":3,
 "jmdict-1098360-2":None,
 "jmdict-1249930-3":5,
 "jmdict-1251120-2":2,
 "jmdict-1251120-3":3,
 "jmdict-1284460-3":None,
 "jmdict-1284460-4":5,
 "jmdict-1284460-5":None,
 "jmdict-1284460-6":3,
 "jmdict-1284460-7":4,
 "jmdict-1284460-8":7,
 "jmdict-1284480-3":None,
 "jmdict-1284480-4":5,
 "jmdict-1284480-5":None,
 "jmdict-1284480-6":3,
 "jmdict-1284480-7":4,
 "jmdict-1284480-8":7,
 "jmdict-1362640-8":8,
 "jmdict-1385900-4":4,
 "jmdict-1385900-5":5,
 "jmdict-1397620-2":2
}
ASSERT_JAPANESE={
 "1050590":"コピー","1077060":"ダッシュ","1098360":"バザー",
 "1249930":"兄貴","1251120":"経緯","1284460":"合わす",
 "1284480":"合わせる","1362640":"深い","1385900":"折り返す","1397620":"組合"
}
EXPECTED_ITALIAN={
 "jmdict-1077060-1":"scatto",
 "jmdict-1098360-2":"vendita speciale",
 "jmdict-1284460-3":"mettere di fronte",
 "jmdict-1284460-5":"far subire",
 "jmdict-1284460-7":"mescolare",
 "jmdict-1284480-3":"mettere di fronte",
 "jmdict-1284480-5":"far incontrare",
 "jmdict-1284480-7":"mescolare",
 "jmdict-1362640-8":"scuro"
}
REASONS={
 "jmdict-1077060-1":"Scatto e movimento rapido: indice 3, non tratto tipografico (indice 1).",
 "jmdict-1284460-7":"Mescolare/materiali: indice 4, non unire organizzazioni (indice 2).",
 "jmdict-1284480-7":"Mescolare/materiali: indice 4, non unire organizzazioni (indice 2).",
 "jmdict-1362640-8":"Colore scuro/intenso: indice 8, non le altre accezioni di deep.",
 "jmdict-1098360-2":"Vendita speciale dei grandi magazzini: senso storico non autonomo nella fonte attuale.",
 "jmdict-1284460-3":"Mettere di fronte: accezione storica priva di indice specifico attuale.",
 "jmdict-1284480-3":"Mettere di fronte: accezione storica priva di indice specifico attuale.",
 "jmdict-1284460-5":"Far incontrare una sorte spiacevole: accezione storica non autonoma nella fonte attuale.",
 "jmdict-1284480-5":"Far incontrare una sorte spiacevole: accezione storica non autonoma nella fonte attuale."
}

def die(msg):
    raise RuntimeError(msg)

def sha_file(path):
    h=hashlib.sha256()
    with open(path,"rb") as src:
        for chunk in iter(lambda:src.read(8*1024*1024),b""):
            h.update(chunk)
    return h.hexdigest()

def sha_bytes(blob):
    return hashlib.sha256(blob).hexdigest()

def now():
    return dt.datetime.now(dt.timezone.utc).isoformat()

def quoted(name):
    return '"'+str(name).replace('"','""')+'"'

def source_service():
    from google.colab import auth
    import google.auth
    from google.auth.transport.requests import Request
    from googleapiclient.discovery import build
    auth.authenticate_user()
    creds,_=google.auth.default(scopes=["https://www.googleapis.com/auth/drive"])
    if not creds.valid:
        creds.refresh(Request())
    api=build("drive","v3",credentials=creds,cache_discovery=False)
    account=api.about().get(fields="user(emailAddress)").execute()["user"]["emailAddress"].lower()
    if account!=PERSONAL_EMAIL:
        die("Accesso errato: usare esclusivamente il Google Drive personale")
    return api

def metadata(api):
    item=api.files().get(
        fileId=CANONICAL_FILE_ID,
        fields="id,name,mimeType,size,parents,version,md5Checksum,modifiedTime"
    ).execute()
    if item.get("name")!="KOTOBA-CANONICO-CORRENTE.zip":
        die("Il file ID non corrisponde al canonico nominato")
    if FOLDER_ID not in item.get("parents",[]):
        die("Il canonico non risiede nella cartella privata prevista")
    return item

def download(api,path):
    from googleapiclient.http import MediaIoBaseDownload
    request=api.files().get_media(fileId=CANONICAL_FILE_ID)
    with path.open("wb") as f:
        loader=MediaIoBaseDownload(f,request,chunksize=8*1024*1024)
        done=False
        while not done:
            _,done=loader.next_chunk(num_retries=4)

def upload_in_place(api,path):
    from googleapiclient.http import MediaFileUpload
    media=MediaFileUpload(
        str(path),mimetype="application/x-zip-compressed",
        resumable=True,chunksize=8*1024*1024
    )
    request=api.files().update(
        fileId=CANONICAL_FILE_ID,media_body=media,
        fields="id,name,size,md5Checksum,modifiedTime,version"
    )
    result=None
    while result is None:
        _,result=request.next_chunk(num_retries=4)
    if result.get("id")!=CANONICAL_FILE_ID:
        die("L'upload non ha mantenuto l'ID canonico")
    return result

def validate_zip(path):
    with zipfile.ZipFile(path,"r") as z:
        problem=z.testzip()
        if problem is not None:
            die("ZIP CRC error: "+problem)
        names=z.namelist()
        if len(names)!=len(set(names)):
            die("Duplicated ZIP member names")
        for wanted in (DB_MEMBER, REPORT_MEMBER, MANIFEST_MEMBER):
            if wanted not in names:
                die("Manca il file canonico richiesto: "+wanted)
        return {i.filename:(i.file_size,i.CRC) for i in z.infolist()}

def extract_db(archive,output):
    with zipfile.ZipFile(archive,"r") as z:
        with z.open(DB_MEMBER) as inp,output.open("wb") as dst:
            shutil.copyfileobj(inp,dst,length=8*1024*1024)

def connection(path):
    c=sqlite3.connect(str(path))
    c.execute("PRAGMA foreign_keys=ON")
    return c

def schema(c,table):
    return [tuple(x) for x in c.execute("PRAGMA table_info("+quoted(table)+")")]

def table_names(c):
    return {x[0] for x in c.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")}

def robust_table_digest(c,table,columns=None):
    # Order-independent multiset fingerprint; exact row content is processed.
    if columns:
        expr=", ".join(quoted(x) for x in columns)
    else:
        expr="*"
    xorval=0
    sumval=0
    count=0
    for row in c.execute("SELECT "+expr+" FROM "+quoted(table)):
        values=[]
        for v in row:
            if isinstance(v,bytes):
                values.append(["blob",len(v),sha_bytes(v)])
            else:
                values.append(v)
        h=int.from_bytes(hashlib.sha256(
            json.dumps(values,ensure_ascii=False,
                       separators=(",",":"),default=str).encode("utf-8")
        ).digest(),"big")
        xorval^=h
        sumval=(sumval+h)%(1<<256)
        count+=1
    return (count,xorval,sumval)

def assertions_before_edit(c,report):
    if len(FINAL)!=23 or sum(v is not None for v in FINAL.values())!=18:
        die("Sono attese 18 mappature e 5 accezioni storiche")
    if report.get("source_sha256")!=FROZEN_XML_SHA or report.get("actual_cases")!=92:
        die("Rapporto JMdict non corrisponde al sorgente verificato")
    table_list=table_names(c)
    required={"k_jmdict_semantic_alignment","k_jmdict_italian_revision",
              "k_jmdict_current_entry","k_jmdict_revision","k_sense","senses","k_project_update"}
    if not required<=table_list:
        die("Tabelle necessarie assenti: "+repr(sorted(required-table_list)))
    if c.execute("PRAGMA quick_check").fetchone()[0]!="ok":
        die("SQLite di partenza non valido")
    if c.execute("PRAGMA foreign_key_check").fetchall():
        die("Violazioni di chiavi esterne nel SQLite di partenza")
    if c.execute("SELECT count(*) FROM k_jmdict_change").fetchone()[0]!=92:
        die("Numero casi cambiati JMdict inatteso")
    orig_cases={x.get("canonical_id"):x for x in report["cases"]}
    if len(orig_cases)!=92 or not set(FINAL)<=set(orig_cases):
        die("Manca qualche voce in rapporto editoriale")
    for sid,index in FINAL.items():
        case=orig_cases[sid]
        ks=c.execute("SELECT japanese FROM k_sense WHERE id=?",(sid,)).fetchone()
        if not ks:
            die("Identità Kotoba mancante: "+sid)
        entry=sid.split("-")[1]
        if ks[0]!=ASSERT_JAPANESE[entry]:
            die("Grafia Kotoba inattesa per "+sid)
        it=(case.get("semantic_review",{}).get("reference_meanings",{}).get("italian_current") or [])
        if sid in EXPECTED_ITALIAN and EXPECTED_ITALIAN[sid] not in it:
            die("Significato italiano cambiato nel rapporto: "+sid)
        if index is not None:
            row=c.execute("SELECT current_sense_count FROM k_jmdict_current_entry WHERE ent_seq=?",
                          (entry,)).fetchone()
            if not row or row[0]<index:
                die("Indice fonte fuori campo: "+sid+" -> "+str(index))
    return orig_cases

def choose_key_column(c):
    columns=[r[1] for r in schema(c,"k_jmdict_semantic_alignment")]
    candidates=[n for n in ("sense_id","canonical_id","id","original_sense_id") if n in columns]
    if not candidates:
        die("Schema tabella editoriale inatteso: "+repr(columns))
    placeholders=",".join("?" for _ in FINAL)
    for candidate in candidates:
        sql="SELECT "+quoted(candidate)+",COUNT(*) FROM k_jmdict_semantic_alignment WHERE "+quoted(candidate)+" IN ("+placeholders+") GROUP BY "+quoted(candidate)
        rows=c.execute(sql,tuple(FINAL)).fetchall()
        if len(rows)==23 and all(n==1 for _,n in rows):
            return candidate
    die("Impossibile associare univocamente i 23 ID alle righe editoriali: "+repr(columns))

def apply_editorial_mapping(c,report):
    cases=assertions_before_edit(c,report)
    key=choose_key_column(c)
    names=[x[1] for x in schema(c,"k_jmdict_semantic_alignment")]
    # The V2 columns remain as historical editorial evidence. The final_* columns
    # are the *authoritative* source linkage after this migration.
    newcols={
      "final_source_index":"INTEGER",
      "final_resolution_status":"TEXT",
      "final_resolution_json":"TEXT"
    }
    for col,type_ in newcols.items():
        if col not in names:
            c.execute("ALTER TABLE k_jmdict_semantic_alignment ADD COLUMN "+
                      quoted(col)+" "+type_)
    c.execute("CREATE INDEX IF NOT EXISTS idx_jmdict_semantic_final_state ON "
              "k_jmdict_semantic_alignment(final_resolution_status)")
    for sid,idx in FINAL.items():
        case=cases[sid]
        status=STATUS_MAPPED if idx is not None else STATUS_LEGACY
        reason=REASONS.get(sid,"Exact JMdict frozen-XML sense match verified in 2026-11-21 Colab audit")
        resolution={
            "schema":"KOTOBA_JMDICT_FINAL_MAPPING_V3",
            "source_xml_sha256":FROZEN_XML_SHA,
            "stable_sense_id":sid,
            "source_entry_id":sid.split("-")[1],
            "source_index":idx,
            "status":status,
            "japanese":ASSERT_JAPANESE[sid.split("-")[1]],
            "legacy_italian":case.get("semantic_review",{}).get("reference_meanings",{}).get("italian_current"),
            "reason":reason,
            "retain_legacy_identity":True,
            "retain_original_italian_and_examples":True,
            "keep_study_flags_unchanged":True,
            "runtime_unchanged":True
        }
        # This writes ONLY the semantic overlay, never original word/sense rows.
        c.execute("UPDATE k_jmdict_semantic_alignment SET final_source_index=?, "
                  "final_resolution_status=?, final_resolution_json=? WHERE "+
                  quoted(key)+"=?",(
                  idx,status,json.dumps(resolution,ensure_ascii=False,sort_keys=True),sid
                  ))
        if c.execute("SELECT changes()").fetchone()[0]!=1:
            die("Risultato UPDATE non univoco: "+sid)
        case.setdefault("semantic_review",{})["final_resolution"]=resolution
    n=c.execute("SELECT COUNT(*) FROM k_jmdict_semantic_alignment WHERE final_resolution_status=?",
                (STATUS_MAPPED,)).fetchone()[0]
    m=c.execute("SELECT COUNT(*) FROM k_jmdict_semantic_alignment WHERE final_resolution_status=?",
                (STATUS_LEGACY,)).fetchone()[0]
    if (n,m)!=(18,5):
        die("Conteggio esiti finali inesperato: "+repr((n,m)))
    report["editorial_alignment_v3"]={
       "status":EDIT_VERSION,
       "source_xml_sha256":FROZEN_XML_SHA,
       "verified_source_indices":18,
       "legacy_unlinked_preserved":5,
       "pending":0,
       "original_identity_translation_example_study_records_modified":False,
       "validated_utc":now()
    }
    prior=c.execute("SELECT value_json FROM k_project_update WHERE name=?",
                    ("jmdict-semantic-review-v3-current",)).fetchone()
    if prior is not None:
        die("Allineamento V3 già registrato: non ripetere un update di dati non più attuali")
    value={
      "schema":"KOTOBA_JMDICT_V3_EDITORIAL_ALIGNMENT",
      "validated_utc":now(),
      "source_xml_sha256":FROZEN_XML_SHA,
      "sense_ids":list(FINAL),
      "source_mapped":18,"legacy_preserved_without_source_index":5,
      "pending":0,
      "authoritative_table":"k_jmdict_semantic_alignment",
      "authoritative_columns":list(newcols),
      "changed_tables":["k_jmdict_semantic_alignment","k_project_update"],
      "unchanged_runtime_and_progress":True,
      "old_v2_status_preserved_as_historical_audit":True
    }
    c.execute("INSERT INTO k_project_update(name,value_json) VALUES (?,?)",(
        "jmdict-semantic-review-v3-current",
        json.dumps(value,ensure_ascii=False,sort_keys=True)
    ))
    return {"status":"PASS","key_column":key,"mapped":18,"legacy":5,"pending":0}

def update_file_manifest(manifest,db_bytes,report_bytes):
    info={
       DB_MEMBER:{"sha256":sha_bytes(db_bytes),"size":len(db_bytes)},
       REPORT_MEMBER:{"sha256":sha_bytes(report_bytes),"size":len(report_bytes)}
    }
    # Some manifests may use root-relative paths, so basename matching is
    # permitted ONLY if exactly one record resolves to each known member.
    files=manifest.get("files")
    if not isinstance(files,(list,dict)):
        die("Schema del campo files nel manifest non riconosciuto")
    found=Counter()
    def match(name):
        name=str(name).replace("\\","/")
        for path in info:
            if name==path or path.endswith("/"+name) or name.endswith("/"+path):
                return path
            if name==path.rsplit("/",1)[-1]:
                return path
        return None
    def set_record(rec,path):
        found[path]+=1
        if not isinstance(rec,dict):
            die("Manifest files non contiene record dizionario")
        sha_keys=[k for k in rec if k.lower().replace("-","_") in (
            "sha256","content_sha256","sha_256","file_sha256")]
        size_keys=[k for k in rec if k.lower().replace("-","_") in (
            "bytes","size","size_bytes","uncompressed_size","file_bytes")]
        if not sha_keys or not size_keys:
            die("Manifest file senza campi sha256/size: "+repr(rec))
        for k in sha_keys: rec[k]=info[path]["sha256"]
        for k in size_keys: rec[k]=info[path]["size"]
    if isinstance(files,list):
        for rec in files:
            if not isinstance(rec,dict):continue
            for k in ("path","name","member_path","file_path","filename","relative_path"):
                if k in rec:
                    target=match(rec[k])
                    if target:
                        set_record(rec,target)
                        break
    else:
        for key,rec in files.items():
            target=match(key)
            if target: set_record(rec,target)
    if any(found[path]!=1 for path in info):
        die("Manifest: DB e rapporto non individuati una sola volta: "+str(dict(found)))
    old=manifest.get("jm_dict_current")
    if not isinstance(old,dict):
        die("Manifest jm_dict_current non e' un oggetto")
    old.update({
     "semantic_review_v3_verified_mapping":18,
     "semantic_review_v3_historical_unlinked_preserved":5,
     "semantic_review_v3_pending_mapping":0,
     "semantic_review_v3_source_xml_sha256":FROZEN_XML_SHA
    })
    # V2 counts are historical and retained without alteration.
    manifest["status"]="JMdict_20261121_SEMANTIC_V3_ALIGNED_RUNTIME_UNCHANGED"
    manifest["generated_utc"]=now()
    return manifest

def check_all_unmodified(old_db,new_db):
    a=sqlite3.connect(str(old_db))
    b=sqlite3.connect(str(new_db))
    excluded={"k_jmdict_semantic_alignment","k_project_update"}
    try:
        old_tables=table_names(a)
        new_tables=table_names(b)
        if old_tables!=new_tables:
            die("Numero o nomi delle tabelle modificati in modo inatteso")
        preserved=0
        for t in sorted(old_tables-excluded):
            if schema(a,t)!=schema(b,t):
                die("Schema precedente cambiato nella tabella "+t)
            if robust_table_digest(a,t)!=robust_table_digest(b,t):
                die("Record precedenti cambiati nella tabella "+t)
            preserved+=1
        # Check all original columns and values of the edited editorial overlay.
        old_cols=[c[1] for c in schema(a,"k_jmdict_semantic_alignment")]
        if robust_table_digest(a,"k_jmdict_semantic_alignment",old_cols)!=robust_table_digest(b,"k_jmdict_semantic_alignment",old_cols):
            die("Qualche campo V2 esistente e' stato alterato")
        # Check all original journal records are unchanged (new V3 record allowed).
        arows=dict(a.execute("SELECT name,value_json FROM k_project_update"))
        brows=dict(b.execute("SELECT name,value_json FROM k_project_update"))
        if not all(brows.get(k)==v for k,v in arows.items()):
            die("La cronologia del registro operativo e' cambiata")
        added=set(brows)-set(arows)
        if added!={"jmdict-semantic-review-v3-current"}:
            die("Registrazioni operative inattese: "+str(added))
        if b.execute("PRAGMA integrity_check").fetchone()[0]!="ok":
            die("SQLite finale non integro")
        if b.execute("PRAGMA foreign_key_check").fetchall():
            die("Relazioni SQLite finali compromesse")
        return {"protected_tables_identical":preserved,
                "existing_editorial_columns_unchanged":True,
                "original_project_updates_unchanged":True,
                "only_new_project_update":"jmdict-semantic-review-v3-current"}
    finally:
        a.close(); b.close()

def create_updated_zip(previous,updated_db,target):
    with zipfile.ZipFile(previous,"r") as original:
        report=json.loads(original.read(REPORT_MEMBER))
        if report.get("source_sha256")!=FROZEN_XML_SHA:
            die("XML SHA del rapporto non corrisponde al pin")
        with connection(updated_db) as c:
            c.execute("BEGIN IMMEDIATE")
            overlay=apply_editorial_mapping(c,report)
            c.commit()
        db_blob=updated_db.read_bytes()
        report_blob=(json.dumps(report,ensure_ascii=False,indent=2)+"\n").encode("utf-8")
        manifest=json.loads(original.read(MANIFEST_MEMBER))
        manifest=update_file_manifest(manifest,db_blob,report_blob)
        manifest_blob=(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n").encode("utf-8")
        replacements={DB_MEMBER:db_blob,REPORT_MEMBER:report_blob,MANIFEST_MEMBER:manifest_blob}
        with zipfile.ZipFile(target,"w",allowZip64=True) as out:
            for item in original.infolist():
                info=copy.copy(item)
                if item.filename in replacements:
                    out.writestr(info,replacements[item.filename])
                else:
                    with original.open(item) as src, out.open(info,"w",force_zip64=True) as dst:
                        shutil.copyfileobj(src,dst,length=8*1024*1024)
        return overlay,manifest

def verify_zip_members(original,new):
    a=validate_zip(original)
    b=validate_zip(new)
    if set(a)!=set(b):
        die("Membri dell'archivio cambiati")
    changed={DB_MEMBER,REPORT_MEMBER,MANIFEST_MEMBER}
    for n in a:
        if n not in changed and a[n]!=b[n]:
            die("Un file non pertinente e' cambiato: "+n)
    return {"member_count":len(a),"only_changed_members":sorted(changed)}

def main():
    if len(FINAL)!=23 or list(FINAL.values()).count(None)!=5:
        die("Configurazione dei 23 ID non valida")
    api=source_service()
    prior_meta=metadata(api)
    if int(prior_meta.get("size",0))!=PINNED_ORIGINAL_BYTES:
        die("Dimensione canonico diversa dal rapporto di validazione")
    with tempfile.TemporaryDirectory(prefix="kotoba_editorial_v3_") as scratch:
        root=pathlib.Path(scratch)
        old_zip=root/"original.zip"
        print("Download canonico esistente dal Drive personale...",flush=True)
        download(api,old_zip)
        old_sha=sha_file(old_zip)
        if old_sha!=PINNED_ORIGINAL_SHA:
            die("Il canonico e' stato aggiornato rispetto al rapporto: ABORT, nessuna modifica")
        validate_zip(old_zip)
        old_db=root/"original.sqlite"
        new_db=root/"editorial.sqlite"
        extract_db(old_zip,old_db)
        shutil.copy2(old_db,new_db)
        new_zip=root/"updated.zip"
        print("Applicazione delle sole 23 decisioni editoriali...",flush=True)
        overlay,man=create_updated_zip(old_zip,new_db,new_zip)
        print("Verifica integrale di conservazione dei dati...",flush=True)
        audit=check_all_unmodified(old_db,new_db)
        zip_audit=verify_zip_members(old_zip,new_zip)
        new_sha=sha_file(new_zip)
        if new_sha==old_sha:
            die("ZIP aggiornato identico all'originale: nessun cambiamento applicato")
        latest=metadata(api)
        if latest.get("version")!=prior_meta.get("version") or latest.get("modifiedTime")!=prior_meta.get("modifiedTime"):
            die("Il canonico remoto e' cambiato durante la verifica; nessun upload")
        print("Verifiche locali PASS. Aggiornamento in-place dello stesso file Drive...",flush=True)
        replacement_committed=False
        try:
            upload_in_place(api,new_zip)
            replacement_committed=True
            readback=root/"remote-verified.zip"
            download(api,readback)
            if sha_file(readback)!=new_sha:
                die("SHA-256 della copia riletta da Drive non corrisponde all'aggiornamento")
            validate_zip(readback)
            remote_meta=metadata(api)
            if int(remote_meta.get("size",0))!=new_zip.stat().st_size:
                die("Dimensione remota non corretta")
        except Exception:
            # Local original ZIP is ephemeral, not another permanent backup.
            if replacement_committed:
                print("Verifica fallita dopo upload: ripristino in corso...",flush=True)
                upload_in_place(api,old_zip)
                rollback=root/"rollback-verified.zip"
                download(api,rollback)
                if sha_file(rollback)!=old_sha:
                    die("ROLLBACK NON CERTIFICATO: non utilizzare questo canonico finche non risolto")
                print("Rollback dell'originale verificato.",flush=True)
            raise
        result={
            "schema":"KOTOBA_JMDICT_EDITORIAL_V3_COMPLETION",
            "completed_utc":now(),
            "canonical_drive_file_id":CANONICAL_FILE_ID,
            "source_xml_sha256":FROZEN_XML_SHA,
            "source_before_zip_sha256":old_sha,
            "new_zip_sha256":new_sha,
            "new_zip_bytes":new_zip.stat().st_size,
            "remote_readback_sha256":sha_file(readback),
            "remote_verification":"PASS",
            "editorial_counts":overlay,
            "preservation":audit,
            "zip_members":zip_audit,
            "progress_and_historical_senses_modified":False,
            "runtime_modified":False,
            "persistent_backup_or_checkpoint_created":False
        }
        filename="/content/KOTOBA-ALLINEAMENTO-EDITORIALE-ESITO.json"
        pathlib.Path(filename).write_text(json.dumps(result,ensure_ascii=False,indent=2),
                                          encoding="utf-8")
        print("PASS: stesso canonico Drive aggiornato e verificato",flush=True)
        print(json.dumps(result,ensure_ascii=False,indent=2),flush=True)
        try:
            from google.colab import files
            files.download(filename)
        except Exception:
            print("Il rapporto e' disponibile in "+filename)

if __name__=="__main__":
    main()
