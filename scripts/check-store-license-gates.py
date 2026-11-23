#!/usr/bin/env python3
"""Strict store licensing gate, independently of the technical/offline PWA preflight.
This tool reads exact distributable vocabulary bytes and never changes records.
Do not relax historical prohibitions by deleting fields or changing study flags:
resolve them against the canonical source/provenance evidence instead.
"""
import gzip, json, pathlib, sys
ROOT=pathlib.Path(__file__).resolve().parent.parent
parts=[ROOT/'assets'/'data'/('vocabulary-v318.gz.part%02d'%i) for i in range(1,9)]
d=json.loads(gzip.decompress(b''.join(p.read_bytes() for p in parts)))
entries=d.get('entries',[])
if len(entries)!=24538 or len({e['id'] for e in entries})!=24538:
    raise SystemExit('FAIL: unexpected corpus count or duplicate IDs')
blocked=[e for e in entries if e.get('m2LicenseGate')=='ATTRIBUTION_PREPARED_RELEASE_NOT_AUTHORIZED']
unknown=[
'jmdict-1002520-2','jmdict-1002570-2','jmdict-1002590-3','jmdict-1002980-17',
'jmdict-1003090-4','jmdict-1003450-5','jmdict-1004590-3','jmdict-1005190-2',
'jmdict-1008490-14','jmdict-1009550-3','jmdict-1012730-2','jmdict-1012980-5',
'jmdict-1036780-2','jmdict-1099580-1','jmdict-1115100-1','jmdict-1132570-2',
'jmdict-1153670-2','jmdict-1240825-2','jmdict-1312070-3','jmdict-1339280-3',
'jmdict-1365670-2','jmdict-1394080-2'
]
byid={e['id']:e for e in entries}
unresolved=[byid[i] for i in unknown if i in byid and byid[i].get('studyEnabled') is True]
summary={
 'store_license_gate':'BLOCKED' if blocked or unresolved else 'REQUIRES_FINAL_MANUAL_REVIEW',
 'exact_runtime_entries':len(entries),
 'old_c_m2_release_not_authorized':len(blocked),
 'old_c_m2_study_enabled':sum(e.get('studyEnabled') is True for e in blocked),
 'historic_unresolved_study_enabled':len(unresolved),
 'historic_unresolved_published':sum(i in byid for i in unknown),
 'requires':'Validated canonical provenance/rights and new signed APK with embedded offline notices; EDRDG updates actually applied to distributed data',
 'non_goals':'No automatic deletion, semantic rewrites, ID/progress changes or bypass of source gates'
}
print(json.dumps(summary,ensure_ascii=False,indent=2))
if blocked or unresolved:
    sys.exit('STORE RELEASE BLOCKED. Do not publish; close C-M2 and unresolved licensing gates in canonical data with source evidence, then rebuild/test.')
