#!/usr/bin/env python3
"""Inspect official JMdict and (optionally) compare exact ent_seq content to a frozen base.
READ ONLY. Never change editorial decisions, stable Kotoba IDs or progress.
Output is a compact report to stdout, not an archive/checkpoint.
"""
import argparse, collections, datetime, gzip, hashlib, json, pathlib, re, urllib.request

URL="https://ftp.edrdg.org/pub/Nihongo/JMdict_e.gz"
# Pinned historical source from existing repository notice, NOT a current update certificate.
REFERENCE_SHA="7c235a7c6a2439c7c80d0a272d22d687ecac3451d24e49fe08f62fe778dc1ea4"
ENTRY=re.compile(rb"<entry>.*?</entry>",re.S)
SEQ=re.compile(rb"<ent_seq>\s*(\d+)\s*</ent_seq>")
KOTOBA_ID=re.compile(r"^jmdict-(\d+)-(\d+)$")
def digest(blob):return hashlib.sha256(blob).hexdigest()
def inventory(gz_blob):
    raw=gzip.decompress(gz_blob)
    indexed={}
    for m in ENTRY.finditer(raw):
        e=m.group(0)
        s=SEQ.search(e)
        if not s:raise RuntimeError("JMdict entry without ent_seq")
        uid=int(s.group(1))
        if uid in indexed:raise RuntimeError("Duplicate ent_seq %s" % uid)
        normalized=re.sub(rb">\s+<",b"><",e)
        indexed[uid]=digest(normalized)
    if len(indexed)<100000:raise RuntimeError("JMdict entries unexpectedly few: %s" % len(indexed))
    return indexed, raw[:2048]
def fetch():
    req=urllib.request.Request(URL,headers={"User-Agent":"Kotoba/1.0 (JMdict monthly integrity preflight)"})
    with urllib.request.urlopen(req,timeout=90) as resp:
        if resp.status!=200:raise RuntimeError("HTTP "+str(resp.status))
        return resp.read()
def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--previous-gz",help="Optional frozen old JMdict_e.gz for exact entry comparisons")
    parser.add_argument("--current-gz",help="Optional official JMdict_e.gz for offline inspections")
    parser.add_argument("--public-vocabulary",default="assets/data/vocabulary.json")
    parser.add_argument("--fail-on-upstream-change",action="store_true")
    args=parser.parse_args()
    new_bytes=pathlib.Path(args.current_gz).read_bytes() if args.current_gz else fetch()
    new_sha=digest(new_bytes)
    new,head=inventory(new_bytes)
    report={"check_utc":datetime.datetime.now(datetime.timezone.utc).isoformat(),
       "official_source":URL,"official_download_bytes":len(new_bytes),
       "official_sha256":new_sha,"historical_reference_sha256":REFERENCE_SHA,
       "upstream_sha_differs_from_historical_reference":new_sha!=REFERENCE_SHA,
       "new_jmdict_entry_count":len(new),"first_header_bytes":head[:200].decode("utf-8","replace"),
       "applied_to_kotoba":False}
    if args.previous_gz:
        old_bytes=pathlib.Path(args.previous_gz).read_bytes()
        old,_=inventory(old_bytes)
        before=set(old);after=set(new)
        modified=[uid for uid in before&after if old[uid]!=new[uid]]
        report["delta"]={"previous_sha256":digest(old_bytes),
           "previous_entry_count":len(old),"unchanged":len(before&after)-len(modified),
           "modified":len(modified),"added":len(after-before),"removed":len(before-after),
           "matching_method":"ent_seq + whitespace-normalized entry XML",
           "requires_canonical_mapping_review":True}
    p=pathlib.Path(args.public_vocabulary)
    if p.exists():
        vocab=json.loads(p.read_text(encoding="utf-8"))
        entries=vocab.get("entries",[])
        src=collections.Counter()
        matches=set()
        for e in entries:
            v=KOTOBA_ID.fullmatch(str(e.get("id","")))
            if not v:continue
            uid=int(v.group(1));matches.add(uid)
            src["jmdict_senses"]+=1
            if uid not in new:src["source_entries_missing"]+=1
        report["public_corpus"]={"senses":len(entries),"jmdict_senses":src["jmdict_senses"],
           "unique_jmdict_ent_seq":len(matches),"ent_seq_not_in_current_jmdict":src["source_entries_missing"],
           "NOTE":"Reference-only coverage: cannot certify translation equality or apply updated senses."}
    print(json.dumps(report,ensure_ascii=False,indent=2,sort_keys=True))
    if args.fail_on_upstream_change and new_sha!=REFERENCE_SHA:
        raise SystemExit("JMdict changed: canonical differential update required before release")
if __name__=="__main__":main()
