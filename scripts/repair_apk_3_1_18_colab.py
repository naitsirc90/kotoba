#!/usr/bin/env python3
"""Diagnose and repair Kotoba 3.1.18 APK using OFFICIAL Android build-tools.

Run in Google Colab only, with user's personal Drive. Only the selected APK and
an original private JKS are read. All work is local in /content and ephemeral.
Nothing is uploaded to Drive/GitHub, and no installed app is uninstalled.
"""
from __future__ import annotations

import copy
import getpass
import hashlib
import json
import os
import pathlib
import re
import shutil
import subprocess
import tempfile
import zipfile
from datetime import datetime, timezone

EXPECTED_APK_SHA="49b58b1fc4742eccab1b68d0b8831b929f708ee7bde277a5a9cf776efac3174c"
EXPECTED_APK_SIZE=8676640
EXPECTED_KEYSTORE_SHA="2a3d85ad419b549bf950107b849d0a2016b3dbe107caff69c0d6f9b4e1143ad6"
EXPECTED_CERT_SHA="73572c936d8e8c105a928f36f4952dcbbc785893c713e507d79bbecb1e098870"
PERSONAL_EMAIL="naitsirc90@gmail.com"
OLD_APK_DRIVE_ID="149dqkosGYpen3NZWRCKZz_xV7yufusyA"
PROTECTED_KEYSTORE_ZIP_DRIVE_ID="1-I4a6MRGxkGNu_Y8gCZR3t8hCPzF5tZo"
PACKAGE="it.kotoba.offline.full"
VERSION_CODE=60
VERSION_NAME="3.1.18"
ALIAS="kotoba"
OUTPUT="/content/Kotoba-Offline-Full-3.1.18-JMdictV3-FIX-APKSIGNER.apk"
QA="/content/Kotoba-3.1.18-APK-APKSIGNER-QA.json"

def abort(message):
    raise RuntimeError(message)

def digest_file(path):
    h=hashlib.sha256()
    with open(path,"rb") as f:
        for chunk in iter(lambda:f.read(4*1024*1024),b""):
            h.update(chunk)
    return h.hexdigest()

def command(argv, *, env=None, required=True, quiet=False):
    p=subprocess.run(argv,stdin=subprocess.DEVNULL,
        stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,env=env)
    if required and p.returncode:
        raise RuntimeError("Comando non riuscito: "+str(argv[:3])+
                           "\n"+p.stdout[-3500:])
    if not quiet:
        print(" ".join(map(str,argv[:2]))+": "+("OK" if p.returncode==0 else "ERRORE"),flush=True)
    return p

def google_drive_personal():
    from google.colab import auth
    import google.auth
    from google.auth.transport.requests import Request
    from googleapiclient.discovery import build
    auth.authenticate_user()
    creds,_=google.auth.default(scopes=["https://www.googleapis.com/auth/drive.readonly"])
    if not creds.valid:creds.refresh(Request())
    api=build("drive","v3",credentials=creds,cache_discovery=False)
    current=api.about().get(fields="user(emailAddress)").execute()["user"]["emailAddress"].lower()
    if current!=PERSONAL_EMAIL:
        abort("Account errato: usa soltanto il Drive PERSONALE. Nessuna modifica eseguita.")
    return api

def download(api,file_id,target):
    from googleapiclient.http import MediaIoBaseDownload
    req=api.files().get_media(fileId=file_id)
    with open(target,"wb") as out:
        transfer=MediaIoBaseDownload(out,req,chunksize=4*1024*1024)
        done=False
        while not done:
            _,done=transfer.next_chunk(num_retries=4)
    return target

def android_tools():
    names=["apksigner","zipalign","aapt"]
    if not all(shutil.which(x) for x in names):
        print("Installazione strumenti Android da pacchetti di sistema...",flush=True)
        command(["apt-get","update","-qq"],quiet=True)
        command(["apt-get","install","-y","-qq",*names],quiet=True)
    paths={n:shutil.which(n) for n in names}
    if not all(paths.values()):abort("apksigner, zipalign o aapt non disponibili")
    print("Strumenti Android ufficiali disponibili.",flush=True)
    return paths

def zip_validate(path):
    with zipfile.ZipFile(path) as z:
        bad=z.testzip()
        if bad:abort("APK ZIP non valido, primo file corrotto: "+bad)
        names=z.namelist()
        if len(names)!=len(set(names)):abort("File APK duplicati")
        for needed in ("AndroidManifest.xml","classes.dex"):
            if needed not in names:abort("APK non contiene "+needed)
        return {x.filename:(x.CRC,x.file_size) for x in z.infolist()}

def badging(path,tools):
    p=command([tools["aapt"],"dump","badging",str(path)],quiet=True)
    out=p.stdout
    pattern=r"package:\s+name='([^']+)'\s+versionCode='([^']+)'\s+versionName='([^']+)'"
    m=re.search(pattern,out)
    if not m:abort("Impossibile leggere i dati Android del pacchetto")
    result={"package":m.group(1),"versionCode":int(m.group(2)),"versionName":m.group(3)}
    for key in ("sdkVersion","targetSdkVersion"):
        hit=re.search(r"(?m)^"+key+r":'(\d+)'",out)
        result[key]=int(hit.group(1)) if hit else None
    return result

def verify(path,tools):
    p=command([tools["apksigner"],"verify","--verbose","--print-certs",str(path)],
              required=False,quiet=True)
    output=p.stdout
    pattern=r"(?im)^Signer #1 certificate SHA-256 digest:\s*([0-9a-f:]+)"
    match=re.search(pattern,output)
    digest=match.group(1).replace(":","").lower() if match else None
    return {"passed":p.returncode==0,"certificate_sha256":digest,
            "diagnostic":output[-3500:],
            "v1":bool(re.search(r"Verified using v1 scheme.*:\s*true",output,re.I)),
            "v2":bool(re.search(r"Verified using v2 scheme.*:\s*true",output,re.I)),
            "v3":bool(re.search(r"Verified using v3 scheme.*:\s*true",output,re.I))}

def clean_unsigned(signed,output):
    # Only JAR signing metadata is dropped; all app payload files are preserved.
    pattern=re.compile(r"^META-INF/(MANIFEST\.MF|[^/]+\.(SF|RSA|DSA|EC))$",re.I)
    with zipfile.ZipFile(signed,"r") as source,zipfile.ZipFile(output,"w",allowZip64=True) as dest:
        for info in source.infolist():
            if info.is_dir() or pattern.match(info.filename):
                continue
            original=copy.copy(info)
            # zipalign recalculates local entry offsets. Drop APK-specific zip
            # alignment extra headers to avoid reusing stale offsets.
            original.extra=b""
            original.flag_bits=info.flag_bits & ~0x0001
            with source.open(info) as read, dest.open(original,"w",force_zip64=True) as write:
                shutil.copyfileobj(read,write,length=1024*1024)

def same_payload(source,fixed):
    def contents(path):
        with zipfile.ZipFile(path) as z:
            return {i.filename:hashlib.sha256(z.read(i.filename)).hexdigest()
                for i in z.infolist()
                if not i.is_dir() and not i.filename.upper().startswith("META-INF/")}
    a,b=contents(source),contents(fixed)
    if a!=b:
        differences=sorted(n for n in set(a)|set(b) if a.get(n)!=b.get(n))
        abort("Contenuto applicativo cambiato durante la firma: "+str(differences[:10]))
    return len(a)

def extract_keystore(archive,directory):
    with zipfile.ZipFile(archive) as z:
        bad=z.testzip()
        if bad:abort("ZIP privato della chiave corrotto")
        keys=[i for i in z.infolist() if not i.is_dir() and i.filename.lower().endswith((".jks",".keystore"))]
        if len(keys)!=1:
            abort("Nello ZIP protetto serve esattamente un file JKS")
        out=directory/"original.jks"
        out.write_bytes(z.read(keys[0]))
    digest=digest_file(out)
    if digest!=EXPECTED_KEYSTORE_SHA:
        abort("SHA-256 della chiave differente: non usare questa chiave")
    return out

def user_file():
    from google.colab import files
    print("Seleziona dal telefono/computer l'APK 3.1.18 che non si installa.",flush=True)
    uploaded=files.upload()
    if len(uploaded)!=1:
        abort("Carica esattamente un APK")
    name,content=next(iter(uploaded.items()))
    if not name.lower().endswith(".apk"):
        abort("Il file selezionato non e' un APK")
    path=pathlib.Path("/content")/name
    if not path.exists():path.write_bytes(content)
    if path.stat().st_size!=EXPECTED_APK_SIZE or digest_file(path)!=EXPECTED_APK_SHA:
        abort("L'APK scaricato NON coincide con la release 3.1.18 originale. "
              "Potrebbe essere incompleto o alterato. Non installarlo.")
    return path

def sign_with_original_key(unsigned,aligned,key,target,tools):
    command([tools["zipalign"],"-p","-f","4",str(unsigned),str(aligned)],quiet=True)
    command([tools["zipalign"],"-c","-p","4",str(aligned)],quiet=True)
    password=getpass.getpass("Password keystore storico Kotoba (non viene salvata): ")
    if not password:abort("Password mancante")
    env=os.environ.copy()
    env["KOTOBA_SIGN_PASSWORD"]=password
    try:
        result=command(
          [tools["apksigner"],"sign","--ks",str(key),"--ks-type","JKS",
           "--ks-key-alias",ALIAS,
           "--ks-pass","env:KOTOBA_SIGN_PASSWORD",
           "--key-pass","env:KOTOBA_SIGN_PASSWORD",
           "--v1-signing-enabled","true","--v2-signing-enabled","true",
           "--v3-signing-enabled","true",
           "--out",str(target),str(aligned)],
          env=env,quiet=True)
    finally:
        env.pop("KOTOBA_SIGN_PASSWORD",None)
        password=None
    return result.returncode==0

def main():
    tools=android_tools()
    input_file=user_file()
    zip_validate(input_file)
    original_package=badging(input_file,tools)
    before_verify=verify(input_file,tools)
    print("Esito firma della precedente 3.1.18 (verifica ufficiale):",
          "PASS" if before_verify["passed"] else "NON VALIDA",flush=True)
    if not before_verify["passed"]:
        print(before_verify["diagnostic"][-1400:],flush=True)
    if (original_package["package"]!=PACKAGE or
        original_package["versionCode"]!=VERSION_CODE or
        original_package["versionName"]!=VERSION_NAME):
        abort("Identita o versione dell'APK 3.1.18 non attese")

    api=google_drive_personal()
    with tempfile.TemporaryDirectory(prefix="kotoba_fix_apk_") as td:
        temp=pathlib.Path(td)
        previous=temp/"previous-signed.apk"
        key_zip=temp/"private-key.zip"
        print("Confronto con l'APK 3.1.17 e la firma originale...",flush=True)
        download(api,OLD_APK_DRIVE_ID,previous)
        download(api,PROTECTED_KEYSTORE_ZIP_DRIVE_ID,key_zip)
        key=extract_keystore(key_zip,temp)
        older_package=badging(previous,tools)
        prior_verify=verify(previous,tools)
        if older_package["package"]!=PACKAGE or older_package["versionCode"]>=VERSION_CODE:
            abort("La versione 3.1.17 di riferimento non corrisponde al pacchetto previsto")
        old_min=older_package["sdkVersion"]
        new_min=original_package["sdkVersion"]
        if old_min is not None and new_min is not None and new_min>old_min:
            abort("La 3.1.18 aumenta minSdkVersion: non posso garantirne la compatibilita'")
        if prior_verify["certificate_sha256"] not in (None,EXPECTED_CERT_SHA):
            abort("L'APK 3.1.17 del Drive usa un certificato diverso: aggiornamento bloccato")

        unsigned=temp/"repacked-unsigned.apk"
        aligned=temp/"repacked-aligned.apk"
        fixed=pathlib.Path(OUTPUT)
        clean_unsigned(input_file,unsigned)
        sign_with_original_key(unsigned,aligned,key,fixed,tools)
        after=verify(fixed,tools)
        fixedmeta=badging(fixed,tools)
        fixedfiles=zip_validate(fixed)
        n_files=same_payload(input_file,fixed)
        if not after["passed"]:
            abort("Anche il pacchetto con firma ufficiale non passa apksigner: "+
                  after["diagnostic"][-900:])
        if after["certificate_sha256"]!=EXPECTED_CERT_SHA:
            abort("Certificato di firma non identico alle release precedenti")
        if fixedmeta!=original_package:
            abort("Manifest Android alterato durante la riparazione")
        if not after["v2"] or not after["v3"]:
            abort("Manca la firma Android v2 o v3")
        report={
          "schema":"KOTOBA_3_1_18_APK_SIGNING_REPAIR_V1",
          "utc":datetime.now(timezone.utc).isoformat(),
          "source_original_sha256":EXPECTED_APK_SHA,
          "source_verified_by_official_apksigner":before_verify,
          "source_metadata":original_package,
          "previous_3_1_17_metadata":older_package,
          "previous_3_1_17_official_verifier":prior_verify,
          "fixed_sha256":digest_file(fixed),
          "fixed_bytes":fixed.stat().st_size,
          "fixed_official_verifier":after,
          "payload_files_sha256_preserved":n_files,
          "package_identifier_and_version_unchanged":True,
          "certificate_matches_previous_expected":True,
          "drive_files_changed":False,
          "local_progress_changed":False,
          "installation_on_device":"NOT_TESTED"
        }
        pathlib.Path(QA).write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",
                                      encoding="utf-8")
        print("\nRISULTATO: APK 3.1.18 firmato e verificato con apksigner ufficiale.",flush=True)
        print("File:",fixed.name,flush=True)
        print("SHA-256:",report["fixed_sha256"],flush=True)
        print("Compatibilita firmatario, package, versionCode: PASS",flush=True)
        from google.colab import files
        files.download(str(fixed))
        print("Rapporto disponibile in",QA,flush=True)
        print("NON disinstallare la versione attuale prima di testare l'aggiornamento.",flush=True)

if __name__=="__main__":
    main()
