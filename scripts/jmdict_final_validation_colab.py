#!/usr/bin/env python3
"""Kotoba: definitive READ-ONLY JMdict/source/canonical/backup audit in Google Colab.

This audit NEVER writes to Google Drive, changes canonical word IDs or translations,
changes study flags, or deletes backups. It emits a single temporary JSON report.
Run in the notebook kernel using %run (so Colab authentication works).
"""
from __future__ import annotations

import argparse
import datetime as dt
import gzip
import hashlib
import html
import io
import json
import pathlib
import re
import shutil
import sqlite3
import subprocess
import tempfile
import zipfile
from collections import Counter

COMMIT = "6007eb00dfec749bc8aedd5e0aaa9cd7edee561d"
XML_SHA256 = "02c51639a138cfd874683b368f651d2d5a4108bf0054712c63913f3b25eef2a0"
EXPECTED_ENTRIES = 219148
EXPECTED_CASES = 92
EXPECTED_LINKED_SENSES = 26967
EXPECTED_CANON_SIZE = 516819484
ZIP_DB = "KOTOBA-CANONICO/01-DATABASE/KOTOBA-DATABASE-CANONICO.sqlite"
ARCHIVE_URL = "https://github.com/Jitendex/edrdg-dictionary-archive.git"

def fail(message):
    raise RuntimeError(message)

def sha256_path(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8 * 1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def download(service, file_id, path):
    from googleapiclient.http import MediaIoBaseDownload
    req = service.files().get_media(fileId=file_id)
    with open(path, "wb") as dest:
        obj = MediaIoBaseDownload(dest, req, chunksize=8 * 1024 * 1024)
        done = False
        while not done:
            _, done = obj.next_chunk(num_retries=3)
    return sha256_path(path)

def personal_drive_service(expected_email):
    from google.colab import auth
    import google.auth
    from google.auth.transport.requests import Request
    from googleapiclient.discovery import build
    auth.authenticate_user()
    creds, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/drive.readonly"])
    if not creds.valid:
        creds.refresh(Request())
    service = build("drive", "v3", credentials=creds, cache_discovery=False)
    email = service.about().get(fields="user(emailAddress)").execute()["user"]["emailAddress"].lower()
    if email != expected_email.lower():
        fail("Account errato: serve esclusivamente il Drive personale configurato")
    return service

def check_zip(path):
    with zipfile.ZipFile(path) as z:
        problem = z.testzip()
        if problem:
            fail("CRC ZIP non valido: " + problem)
        return {m.filename: {"size":m.file_size,"crc32":m.CRC} for m in z.infolist()}

def extract_db(archive, path):
    with zipfile.ZipFile(archive) as z:
        if ZIP_DB not in z.namelist():
            fail("SQLite canonico non trovato nel percorso registrato")
        with z.open(ZIP_DB) as src, path.open("wb") as dst:
            shutil.copyfileobj(src, dst, length=8*1024*1024)

def sqlite_checks(path, require_jmdict=True):
    connection = sqlite3.connect("file:" + str(path) + "?mode=ro", uri=True)
    try:
        integrity = connection.execute("PRAGMA integrity_check").fetchone()[0]
        if integrity != "ok":
            fail("SQLite integrity_check: " + str(integrity))
        fk_violations = connection.execute("PRAGMA foreign_key_check").fetchall()
        if fk_violations:
            fail("SQLite foreign_key_check: " + str(fk_violations[:5]))
        tables = {row[0] for row in connection.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
        )}
        counts = {}
        if require_jmdict:
            for table, expected in (("k_jmdict_change",92),("k_jmdict_current_sense",26967)):
                if table not in tables:
                    fail("Tabella mancante: "+table)
                n = connection.execute('SELECT COUNT(*) FROM "'+table+'"').fetchone()[0]
                if n != expected:
                    fail(table+": conteggio "+str(n)+" != "+str(expected))
                counts[table]=n
        return {"integrity_check":"ok","foreign_key_violations":0,
                "table_count":len(tables),"counts":counts,"tables":sorted(tables)}
    finally:
        connection.close()

def old_backup(service, parent_id, manifest_id, folder):
    manifest_path = folder/"old-parts-manifest.json"
    download(service, manifest_id, manifest_path)
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if len(manifest.get("parts",[])) != 6 or manifest.get("size_bytes")!=515000330:
        fail("Manifest vecchio backup inatteso: interrompere prima di eliminare")
    previous = folder/"KOTOBA-CANONICO-VERIFICA-PRECEDENTE.zip"
    with previous.open("wb") as out:
        for entry in manifest["parts"]:
            filename = entry["name"].replace("'","\\'")
            q = "'" + parent_id + "' in parents and name = '" + filename + "' and trashed = false"
            result = service.files().list(q=q,fields="files(id,name,size),nextPageToken",
                                         pageSize=10).execute().get("files",[])
            if len(result)!=1:
                fail("Parte backup assente o duplicata: "+entry["name"])
            path=folder/("temp-part-"+str(len(list(folder.glob("temp-part-*")))+1))
            actual_sha=download(service,result[0]["id"],path)
            if actual_sha!=entry["sha256"] or path.stat().st_size!=entry["bytes"]:
                fail("Parte backup non corrisponde al manifest: "+entry["name"])
            with path.open("rb") as src:
                shutil.copyfileobj(src,out,length=8*1024*1024)
            path.unlink()
            print("Backup verificato:", entry["name"], flush=True)
    digest=sha256_path(previous)
    if previous.stat().st_size!=manifest["size_bytes"] or digest!=manifest["sha256"]:
        fail("SHA-256 dell'archivio precedente non valido")
    return previous, manifest

def report_from_zip(new_zip, fallback_id, service, folder):
    with zipfile.ZipFile(new_zip) as z:
        found=[n for n in z.namelist() if "JMDICT-92-RAPPORTO" in n.upper()
               and n.lower().endswith(".json")]
        for name in sorted(found, reverse=True):
            try:
                data=json.loads(z.read(name))
                if data.get("actual_cases")==92 and "semantic_review_summary" in data:
                    return data, "canonico ZIP: "+name
            except Exception:
                continue
    if fallback_id:
        p=folder/"temp-editorial-report.json"
        download(service,fallback_id,p)
        data=json.loads(p.read_text(encoding="utf-8"))
        if data.get("actual_cases")==92 and "semantic_review_summary" in data:
            return data,"report da Drive personale"
    fail("Rapporto semantico dei 92 casi non trovato nel canonico. "
         "Usare --review-file-id con il rapporto originale da Drive personale.")

def reconstruct_xml(folder):
    repo=folder/"jmdict-pinned"
    repo.mkdir()
    cmds=[
        ["git","-C",str(repo),"init","-q"],
        ["git","-C",str(repo),"remote","add","origin",ARCHIVE_URL],
        ["git","-C",str(repo),"fetch","--quiet","--depth","1","origin",COMMIT],
        ["git","-C",str(repo),"checkout","--quiet","FETCH_HEAD"]
    ]
    for cmd in cmds:
        subprocess.run(cmd,check=True)
    git_commit=subprocess.check_output(["git","-C",str(repo),"rev-parse","HEAD"],text=True).strip()
    if git_commit!=COMMIT:
        fail("Commit dello specchio JMdict non corrisponde al pin")
    if shutil.which("brotli") is None or shutil.which("patch") is None:
        subprocess.run(["apt-get","update","-qq"],check=True)
        subprocess.run(["apt-get","install","-y","-qq","brotli","patch"],check=True)
    base=repo/"JMdict_e"/"JMdict_e.br"
    xml_path=folder/"JMdict_e_20261118.xml"
    with xml_path.open("wb") as output:
        subprocess.run(["brotli","-d","-c",str(base)],stdout=output,check=True)
    patches=sorted((repo/"JMdict_e"/"patches").rglob("*.patch.br"))
    if len(patches)<300:
        fail("Archivio patch incompleto: "+str(len(patches)))
    for patchfile in patches:
        delta=subprocess.check_output(["brotli","-d","-c",str(patchfile)])
        p=subprocess.run(["patch","--silent","--batch",str(xml_path)],
                         input=delta,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
        if p.returncode:
            fail("Patch JMdict non applicata: "+str(patchfile)+": "+p.stderr.decode(errors="replace")[:300])
    actual=sha256_path(xml_path)
    if actual!=XML_SHA256:
        fail("XML ricostruito non coincide con SHA-256 congelato del 18 novembre: "+actual)
    return xml_path,len(patches)

def xml_entry_senses(path, wanted):
    contents=path.read_bytes()
    entries=re.findall(rb"<ent_seq>\s*(\d+)\s*</ent_seq>",contents)
    if len(entries)!=EXPECTED_ENTRIES or len(set(entries))!=EXPECTED_ENTRIES:
        fail("Numero voci JMdict o unicita ent_seq non validi: "+str(len(entries)))
    result={}
    entry_re=re.compile(rb"<entry>.*?</entry>",re.S)
    ent_re=re.compile(rb"<ent_seq>\s*(\d+)\s*</ent_seq>")
    sense_re=re.compile(rb"<sense>(.*?)</sense>",re.S)
    def tags(blob,tag):
        rx=rb"<"+tag+rb"(?:\s+[^>]*)?>(.*?)</"+tag+rb">"
        return [html.unescape(x.decode("utf-8","replace").strip())
                for x in re.findall(rx,blob,re.S)]
    for m in entry_re.finditer(contents):
        hit=ent_re.search(m.group(0))
        if not hit:
            continue
        seq=hit.group(1).decode()
        if seq not in wanted:
            continue
        result[seq]=[
            {"index":i,"glosses":tags(s,b"gloss"),"stagr":tags(s,b"stagr"),
             "stagk":tags(s,b"stagk"),"pos":tags(s,b"pos")}
            for i,s in enumerate(sense_re.findall(m.group(0)),1)
        ]
    if set(result)!=wanted:
        fail("ent_seq assenti nello XML: "+repr(sorted(wanted-set(result))))
    return result, len(entries)

def normalize_gloss(s):
    s=html.unescape(s).casefold()
    s=re.sub(r"\([^)]*\)", " ",s)
    return " ".join(re.findall(r"[a-z0-9]+",s))

def semantic_cases(report, senses):
    results=[]
    for case in report["cases"]:
        review=case.get("semantic_review",{})
        if review.get("decision_class") not in {"SENSE_BLOCK","SOURCE_TRACE"}:
            continue
        sid=case["canonical_id"]
        ent=sid.split("-")[1]
        legacy=review.get("reference_meanings",{}).get("previous_english_gloss")
        if not legacy:
            legacy=review.get("reference_meanings",{}).get("current_english_gloss",[])
        source_senses=senses[ent]
        old_terms={normalize_gloss(t) for t in legacy if normalize_gloss(t)}
        strong=[]
        for cur in source_senses:
            current={normalize_gloss(x) for x in cur["glosses"]}
            if old_terms & current:
                strong.append(cur["index"])
        previous_candidate=(review.get("source_index_candidate") or {}).get("candidate_new_source_index")
        # A candidate is NOT accepted if the frozen XML contradicts its glosses.
        if len(strong)==1:
            status="UNIQUE_EXACT_GLOSS_MATCH"
            new_index=strong[0]
        elif len(strong)>1:
            status="AMBIGUOUS_MULTIPLE_GLOSS_MATCHES"
            new_index=None
        else:
            status="NO_EXACT_GLOSS_MATCH_PRESERVE_LEGACY"
            new_index=None
        # A grammatical split is not proven correct solely by the same English word.
        if sid=="jmdict-1077060-1" and status=="UNIQUE_EXACT_GLOSS_MATCH":
            status="GLOSS_MATCH_POS_AND_EXAMPLE_REVIEW_REQUIRED"
        # A changed reading restriction must include the corresponding Kotoba reading.
        changes=case.get("source_row",{}).get("changed_fields_json") or []
        if "stagr" in changes and new_index:
            kinfo=(case.get("canonical_context",{}).get("k_sense") or [{}])[0]
            word_reading=kinfo.get("kana")
            restrict=source_senses[new_index-1]["stagr"]
            if restrict and word_reading not in restrict:
                status="READING_RESTRICTION_MISMATCH"
        results.append({
            "stable_id":sid,
            "japanese":((case.get("canonical_context",{}).get("k_sense") or [{}])[0]).get("japanese"),
            "status":status,
            "candidate_from_previous_review":previous_candidate,
            "verified_current_index":new_index,
            "matching_indices":strong,
            "legacy_glosses":legacy,
            "italian":review.get("reference_meanings",{}).get("italian_current"),
            "source_senses":source_senses
        })
    if len(results)!=23:
        fail("Dovrebbero esserci 23 casi bloccanti, trovati "+str(len(results)))
    return results


# Editorial decisions on the *pinned source*, not automatic index renumbering.
# Legacy meanings absent in current JMdict remain distinct and unlinked.
FINAL_ADJUDICATIONS = {
 "jmdict-1077060-1":("MAP",3,"Scatto: rapid movement, not the punctuation dash."),
 "jmdict-1284460-7":("MAP",4,"Mescolare: to mix/to blend, not combine organizations."),
 "jmdict-1284480-7":("MAP",4,"Mescolare: to mix/to blend, not combine organizations."),
 "jmdict-1362640-8":("MAP",8,"Scuro: deep (color)/dark, not other senses of deep."),
 "jmdict-1098360-2":("LEGACY",None,"Historical department-store special sale not a separate current JMdict sense."),
 "jmdict-1284460-3":("LEGACY",None,"Historical to face/to be opposite no longer a separate source sense."),
 "jmdict-1284480-3":("LEGACY",None,"Historical to face/to be opposite no longer a separate source sense."),
 "jmdict-1284460-5":("LEGACY",None,"Historical to cause to meet an unpleasant fate no longer a separate source sense."),
 "jmdict-1284480-5":("LEGACY",None,"Historical to cause to meet an unpleasant fate no longer a separate source sense."),
}

def close_editorial_cases(cases):
    cnt=Counter()
    for c in cases:
        sid=c["stable_id"]
        decision=FINAL_ADJUDICATIONS.get(sid)
        if decision:
            action,idx,reason=decision
            if action=="MAP":
                if c["status"]!="AMBIGUOUS_MULTIPLE_GLOSS_MATCHES" or idx not in c["matching_indices"]:
                    fail("Mapping changed; manual review required: "+sid)
                gloss={x["index"]:x["glosses"] for x in c["source_senses"]}[idx]
                it=c.get("italian") or []
                if sid=="jmdict-1077060-1" and not ("rapid movement" in gloss and "scatto" in it):
                    fail("Scatto evidence mismatch")
                if sid.endswith("-7") and not ("to mix" in gloss and "mescolare" in it):
                    fail("Mescolare evidence mismatch")
                if sid=="jmdict-1362640-8" and not ("dark" in gloss and "deep (color)" in gloss and "scuro" in it):
                    fail("Scuro evidence mismatch")
                state="SOURCE_INDEX_VERIFIED"
            elif action=="LEGACY":
                if c["status"]!="NO_EXACT_GLOSS_MATCH_PRESERVE_LEGACY" or c["matching_indices"]:
                    fail("Legacy-only evidence mismatch: "+sid)
                state="LEGACY_UNLINKED_AND_PRESERVED"
            else:
                fail("Bad editorial action: "+sid)
        else:
            if c["status"]!="UNIQUE_EXACT_GLOSS_MATCH" or not isinstance(c["verified_current_index"],int):
                fail("No verified source mapping: "+sid)
            idx=c["verified_current_index"]
            state="SOURCE_INDEX_VERIFIED"
            reason="Unique current JMdict gloss, original stable ID preserved"
        c["editorial_resolution"]={"status":state,"source_index":idx,"reason":reason,
                                    "preserve_existing_id":True,"no_database_write":True}
        cnt[state]+=1
    if len(cases)!=23 or cnt["SOURCE_INDEX_VERIFIED"]!=18 or cnt["LEGACY_UNLINKED_AND_PRESERVED"]!=5:
        fail("Unexpected semantic case counts: "+str(cnt))
    return {"status":"ADJUDICATED_READ_ONLY","counts":dict(cnt),
            "no_source_index_invented":True,"canonical_data_changed":False}

def detailed_manifest_comparison(old_zip,new_zip):
    name="KOTOBA-CANONICO/04-DOCUMENTAZIONE/MANIFEST-CANONICO.json"
    def load(zpath):
        with zipfile.ZipFile(zpath) as z:
            contents=z.read(name)
        if len(contents)>5_000_000: fail("Manifest unexpectedly large")
        return json.loads(contents)
    a,b=load(old_zip),load(new_zip)
    changes=[]
    def walk(x,y,path=""):
        if len(changes)>120: return
        if isinstance(x,dict) and isinstance(y,dict):
            for k in sorted(set(x)|set(y)):
                here=path+"/"+str(k)
                if k not in x: changes.append({"path":here,"change":"added","new":y[k]})
                elif k not in y: changes.append({"path":here,"change":"removed","old":x[k]})
                else: walk(x[k],y[k],here)
        elif x!=y:
            xstr=json.dumps(x,ensure_ascii=False,default=str)
            ystr=json.dumps(y,ensure_ascii=False,default=str)
            changes.append({"path":path,"change":"modified",
                            "old":x if len(xstr)<1000 else {"length":len(xstr)},
                            "new":y if len(ystr)<1000 else {"length":len(ystr)}})
    walk(a,b)
    return {"both_json_valid":True,"changed_fields":changes,
            "field_count":len(changes),
            "review_required":bool(changes),
            "note":"Expected manifest delta must be reviewed, not accepted solely by file name."}


def tables_preserved(old_db, new_db):
    """Audit ALL tables without discarding diagnostic evidence on the first difference.

    Only a genuinely append-only operational k_project_update is provisionally
    acceptable; any modification/deletion, other changed table, or schema
    difference blocks backup removal until explicitly reviewed.
    """
    def open_ro(path):
        connection = sqlite3.connect("file:" + str(path) + "?mode=ro", uri=True)
        connection.row_factory = sqlite3.Row
        return connection

    def quoted(name):
        return '"' + name.replace('"', '""') + '"'

    def tables(c):
        return {r[0] for r in c.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
        )}

    def schema(c, name):
        return [tuple(row) for row in c.execute("PRAGMA table_info(" + quoted(name) + ")")]

    def digest_row(row):
        vals = []
        for x in row:
            if isinstance(x, bytes):
                vals.append(["blob", len(x), hashlib.sha256(x).hexdigest()])
            else:
                vals.append(x)
        encoded = json.dumps(vals, ensure_ascii=False,
                             separators=(",", ":"), default=str).encode("utf-8")
        return hashlib.sha256(encoded).hexdigest()

    def fingerprints(c, name):
        # Independent of SQLite row order and valid for duplicate rows.
        n, xorval, sumval = 0, 0, 0
        for row in c.execute("SELECT * FROM " + quoted(name)):
            val = int(digest_row(row), 16)
            n += 1
            xorval ^= val
            sumval = (sumval + val) % (1 << 256)
        return (n, xorval, sumval)

    def sample_value(v):
        if isinstance(v, bytes):
            return {"blob_bytes": len(v),
                    "sha256": hashlib.sha256(v).hexdigest()}
        if isinstance(v, str):
            return v[:200] + ("..." if len(v) > 200 else "")
        return v

    def diagnose(c_old, c_new, name):
        old_schema = schema(c_old, name)
        new_schema = schema(c_new, name)
        colnames = [r[1] for r in old_schema]
        old_count = c_old.execute("SELECT COUNT(*) FROM " + quoted(name)).fetchone()[0]
        new_count = c_new.execute("SELECT COUNT(*) FROM " + quoted(name)).fetchone()[0]
        out = {
            "table": name, "old_rows": old_count, "new_rows": new_count,
            "schema_equal": old_schema == new_schema, "columns": colnames,
            "primary_key": [], "added_count": None, "removed_count": None,
            "modified_count": None, "sample_added_keys": [],
            "sample_removed_keys": [], "sample_modified_rows": [],
            "append_only": False, "analysis_complete": False
        }
        if old_schema != new_schema:
            out["old_schema"] = old_schema
            out["new_schema"] = new_schema
            return out
        if max(old_count, new_count) > 250000:
            out["note"] = "Differenza troppo grande per diagnosi in memoria; backup protetti"
            return out

        pk_names = [r[1] for r in sorted(old_schema, key=lambda r: r[5])
                    if r[5] > 0]
        out["primary_key"] = pk_names
        if pk_names:
            def keyed_rows(c):
                result = {}
                for row in c.execute("SELECT * FROM " + quoted(name)):
                    k = tuple(row[col] for col in pk_names)
                    if k in result:
                        raise RuntimeError("Chiave duplicata in " + name)
                    result[k] = tuple(row)
                return result
            prev, nxt = keyed_rows(c_old), keyed_rows(c_new)
            added = set(nxt) - set(prev)
            removed = set(prev) - set(nxt)
            modified = [k for k in prev.keys() & nxt.keys()
                        if digest_row(prev[k]) != digest_row(nxt[k])]
            out["added_count"], out["removed_count"] = len(added), len(removed)
            out["modified_count"] = len(modified)
            out["sample_added_keys"] = [
                [sample_value(v) for v in k] for k in
                sorted(added, key=str)[:10]
            ]
            out["sample_removed_keys"] = [
                [sample_value(v) for v in k] for k in
                sorted(removed, key=str)[:10]
            ]
            for k in sorted(modified, key=str)[:10]:
                changed = []
                for col, before, after in zip(colnames, prev[k], nxt[k]):
                    if before != after:
                        changed.append({
                            "column": col,
                            "old": sample_value(before),
                            "new": sample_value(after)
                        })
                out["sample_modified_rows"].append({
                    "primary_key": [sample_value(v) for v in k],
                    "changed_fields": changed
                })
        else:
            # Tables without a primary key: compare a true multiset of row hashes,
            # not unstable ROWIDs (which may change after repacking SQLite).
            before = Counter(digest_row(row)
                             for row in c_old.execute("SELECT * FROM " + quoted(name)))
            after = Counter(digest_row(row)
                            for row in c_new.execute("SELECT * FROM " + quoted(name)))
            added = after - before
            removed = before - after
            out["added_count"] = sum(added.values())
            out["removed_count"] = sum(removed.values())
            out["modified_count"] = None  # No stable PK means edits are add/remove.
            out["sample_added_keys"] = list(added)[:10]
            out["sample_removed_keys"] = list(removed)[:10]
        out["analysis_complete"] = True
        out["append_only"] = (out["schema_equal"] and
                              out["removed_count"] == 0 and
                              out["added_count"] > 0 and
                              out["modified_count"] in (None, 0))
        return out

    old, new = open_ro(old_db), open_ro(new_db)
    try:
        old_tables, new_tables = tables(old), tables(new)
        missing = sorted(old_tables - new_tables)
        additions = sorted(new_tables - old_tables)
        identical = 0
        differences = []
        approved_append_only = []
        for table in sorted(old_tables & new_tables):
            before_schema = schema(old, table)
            after_schema = schema(new, table)
            before_hash = fingerprints(old, table)
            after_hash = fingerprints(new, table)
            if before_schema == after_schema and before_hash == after_hash:
                identical += 1
                print("Tabella invariata:", table, flush=True)
                continue
            diff = diagnose(old, new, table)
            # The operational journal is allowed to GROW, but never to rewrite
            # or remove existing rows. This is a structural, not semantic,
            # acceptance: record details for the subsequent editorial audit.
            is_expected_append = (table == "k_project_update" and
                                  diff["append_only"] and
                                  diff["analysis_complete"])
            diff["provisionally_accepted_append_only"] = is_expected_append
            differences.append(diff)
            if is_expected_append:
                approved_append_only.append(table)
                print("AGGIUNTE CONSERVATIVE nel registro:", table,
                      "(+%s righe)" % diff["added_count"], flush=True)
            else:
                print("DIFFERENZA DA VALUTARE:", table,
                      "precedente=%s, nuovo=%s" %
                      (diff["old_rows"], diff["new_rows"]), flush=True)
        unsafe = [d["table"] for d in differences
                  if not d["provisionally_accepted_append_only"]]
        return {
            "original_tables": len(old_tables),
            "original_tables_identical": identical,
            "new_tables": additions,
            "missing_tables": missing,
            "differences": differences,
            "approved_append_only_tables": approved_append_only,
            "unresolved_table_differences": unsafe,
            "all_original_tables_preserved":
                (not missing and not unsafe and
                 identical + len(approved_append_only) == len(old_tables)),
        }
    finally:
        old.close()
        new.close()

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--personal-email",required=True)
    parser.add_argument("--drive-zip-id",required=True)
    parser.add_argument("--old-manifest-id",required=True)
    parser.add_argument("--review-file-id",default="")
    parser.add_argument("--no-old-backup-check",action="store_true")
    args=parser.parse_args()
    service=personal_drive_service(args.personal_email)
    with tempfile.TemporaryDirectory(prefix="kotoba_jmdict_final_") as td:
        root=pathlib.Path(td)
        meta=service.files().get(fileId=args.drive_zip_id,fields="id,name,size,parents").execute()
        if meta.get("name")!="KOTOBA-CANONICO-CORRENTE.zip":
            fail("File canonico diverso da quello atteso")
        if int(meta.get("size","-1"))!=EXPECTED_CANON_SIZE:
            fail("Dimensione ZIP canonico inattesa, non eliminare backup")
        parent=(meta.get("parents") or [None])[0]
        if not parent:
            fail("Cartella Drive del canonico non identificabile")
        new_zip=root/"KOTOBA-CANONICO-CORRENTE.zip"
        print("Scaricamento canonico aggiornato",flush=True)
        new_sha=download(service,args.drive_zip_id,new_zip)
        new_members=check_zip(new_zip)
        new_db=root/"canonical-new.sqlite"
        extract_db(new_zip,new_db)
        new_sqlite=sqlite_checks(new_db)
        report,report_location=report_from_zip(new_zip,args.review_file_id,service,root)
        if report.get("source_sha256")!=XML_SHA256 or report.get("actual_cases")!=EXPECTED_CASES:
            fail("Rapporto 92 non corrisponde al sorgente congelato")
        print("Ricostruzione sorgente JMdict del 18 novembre",flush=True)
        xml,patchcount=reconstruct_xml(root)
        targets={c["canonical_id"].split("-")[1] for c in report["cases"]
                 if c.get("semantic_review",{}).get("decision_class") in {"SENSE_BLOCK","SOURCE_TRACE"}}
        entries,count=xml_entry_senses(xml,targets)
        cases=semantic_cases(report,entries)
        editorial=close_editorial_cases(cases)
        old_verification={"checked":False}
        if not args.no_old_backup_check:
            print("Verifica indipendente backup storico delle sei parti",flush=True)
            old_zip,old_manifest=old_backup(service,parent,args.old_manifest_id,root)
            manifest_diff=detailed_manifest_comparison(old_zip,new_zip)
            print('MANIFEST-CANONICO changed:',json.dumps(manifest_diff['changed_fields'],ensure_ascii=False)[:2500],flush=True)
            old_members=check_zip(old_zip)
            old_db=root/"canonical-old.sqlite"
            extract_db(old_zip,old_db)
            old_sqlite=sqlite_checks(old_db)
            preservation=tables_preserved(old_db,new_db)
            missing_members=sorted(set(old_members)-set(new_members))
            added_members=sorted(set(new_members)-set(old_members))
            changed_members=[name for name in old_members if name in new_members
                             and old_members[name]!=new_members[name]
                             and name!=ZIP_DB
                             and "JMDICT-" not in name.upper()]
            members_preserved = not missing_members and not changed_members
            if not members_preserved:
                print("DIFFERENZE NEI FILE ZIP:", len(missing_members),
                      "mancanti,", len(changed_members), "modificati", flush=True)
            old_verification={"checked":True,"zip_sha256":old_manifest["sha256"],
                "crc":"PASS","sqlite":old_sqlite,"table_preservation":preservation,
                "members_preserved":members_preserved,
                "missing_members":missing_members,
                "changed_members":changed_members,
                "added_members":added_members,"manifest_comparison":manifest_diff}
        blocked=[x['stable_id'] for x in cases if x['editorial_resolution']['status'] not in ('SOURCE_INDEX_VERIFIED','LEGACY_UNLINKED_AND_PRESERVED')]
        final={
            "schema":"KOTOBA_JMDICT_FINAL_AUDIT_READONLY_V1",
            "utc":dt.datetime.now(dt.timezone.utc).isoformat(),
            "mode":"READ_ONLY_NO_DELETIONS_NO_MODIFICATIONS",
            "canonical":{"drive_file_id":args.drive_zip_id,"sha256":new_sha,
                         "bytes":new_zip.stat().st_size,"crc":"PASS",
                         "sqlite":new_sqlite,"report_source":report_location},
            "source":{"pinned_commit":COMMIT,"xml_sha256":XML_SHA256,
                      "entries":count,"patches_applied":patchcount},
            "cases":{"total":23,"status_counts":dict(Counter(x["status"] for x in cases)),
                     "remaining_review_ids":blocked,"editorial_closure":editorial,"details":cases},
            "old_backup":old_verification,
            "safe_to_delete_backups":bool(
                not blocked
                and old_verification.get("checked")
                and old_verification.get("table_preservation",{}).get("all_original_tables_preserved")
                and old_verification.get("members_preserved")
                and not old_verification.get('manifest_comparison',{}).get('review_required',True)
            ),
            "technical_backup_integrity_pass":bool(old_verification.get("checked")),
            "structural_preservation_pass":bool(
                old_verification.get("table_preservation",{}).get("all_original_tables_preserved")
                and old_verification.get("members_preserved")
            ),
            "delete_performed":False,
            "safety_note":"Do not delete backup files until all open semantic mappings have been editorially resolved and source IDs verified. This audit never edits study flags, original translations, or personal progress."
        }
        output=pathlib.Path("/content/JMDICT-CHIUSURA-CONTROLLI.json")
        output.write_text(json.dumps(final,ensure_ascii=False,indent=2),encoding="utf-8")
        print("Audit completato. Eventuali differenze sono documentate, non ignorate.",flush=True)
        print(json.dumps({"result":"AUDIT_COMPLETE","zip_sha256":new_sha,
                          "source_sha256":XML_SHA256,"cases":23,
                          "status_counts":final["cases"]["status_counts"],
                          "editorial_closure":editorial,
                          "manifest_diff":old_verification.get('manifest_comparison',{}).get('changed_fields',[]),
                          "safe_to_delete_backups":final["safe_to_delete_backups"],
                          "table_differences":old_verification.get("table_preservation",{}).get("differences",[]),
                          "modified_zip_members":old_verification.get("changed_members",[]),
                          "output":str(output)},ensure_ascii=False,indent=2))
        try:
            from google.colab import files
            files.download(str(output))
        except Exception:
            print("Scaricare manualmente: "+str(output))

if __name__=="__main__":
    main()
