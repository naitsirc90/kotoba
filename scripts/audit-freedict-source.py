#!/usr/bin/env python3
"""Audit the exact FreeDict/WikDict ita-jpn source, its TEI header, and official SHA512.
Read-only: prints one JSON result and never alters the application corpus.
"""
import argparse, hashlib, io, json, re, tarfile, urllib.request
V='2025.11.23'
NAME='freedict-ita-jpn-'+V+'.src.tar.xz'
URL='https://download.freedict.org/dictionaries/ita-jpn/'+V+'/'+NAME

def download(url):
    req=urllib.request.Request(url,headers={'User-Agent':'Kotoba-License-Audit/1.0'})
    with urllib.request.urlopen(req,timeout=60) as r:
        if r.status!=200:raise RuntimeError('HTTP '+str(r.status))
        return r.read()

def audit(raw,official=True):
    sha256=hashlib.sha256(raw).hexdigest()
    sha512=hashlib.sha512(raw).hexdigest()
    if official and sha512.lower() not in download(URL+'.sha512').decode('utf-8','replace').lower():
        raise RuntimeError('Official SHA512 mismatch; refusing to assert license')
    headers=[]
    with tarfile.open(fileobj=io.BytesIO(raw),mode='r:xz') as t:
        items=[m for m in t.getmembers() if m.isfile() and m.size<50000000 and m.name.lower().endswith(('.tei','.tei.xml','.xml'))]
        for m in items:
            content=t.extractfile(m).read(220000).decode('utf-8','replace')
            match=re.search(r'<(?:\w+:)?teiHeader\b.*?</(?:\w+:)?teiHeader>',content,re.I|re.S)
            if not match:continue
            head=match.group(0);plain=re.sub(r'\s+',' ',re.sub(r'<[^>]*>',' ',head)).strip()
            low=(plain+' '+head).lower()
            valid=('creative commons' in low and 'attribution-sharealike' in low and '3.0' in low) or 'creativecommons.org/licenses/by-sa/3.0/' in low
            statements=re.findall(r'<(?:\w+:)?licen[cs]e\b.*?</(?:\w+:)?licen[cs]e>',head,re.I|re.S)
            notes=[re.sub(r'\s+',' ',re.sub(r'<[^>]*>',' ',x)).strip()[:750] for x in statements]
            if not notes:
                notes=[plain[max(0,m.start()-120):m.end()+180] for m in re.finditer(r'license|licence|creative commons',plain,re.I)][:8]
            headers.append({'path':m.name,'confirms_cc_by_sa_3_0':valid,'license_statements':notes[:10],
                            'karl_bartel_named':'karl bartel' in low,
                            'wikdict_named':'wikdict' in low,'dbnary_named':'dbnary' in low})
    if not headers:raise RuntimeError('No TEI license header found')
    if not any(h['confirms_cc_by_sa_3_0'] for h in headers):
        raise RuntimeError('Original TEI does not prove the declared CC BY-SA 3.0: '+json.dumps(headers,ensure_ascii=False))
    return {'result':'PASS','source':URL,'bytes':len(raw),'sha256':sha256,'sha512':sha512,
            'official_sha512_verified':official,'headers':headers}

if __name__=='__main__':
    a=argparse.ArgumentParser()
    a.add_argument('--source',help='Local original tarball (does not validate online SHA512)')
    p=a.parse_args()
    data=open(p.source,'rb').read() if p.source else download(URL)
    print(json.dumps(audit(data,not bool(p.source)),ensure_ascii=False,indent=2))
