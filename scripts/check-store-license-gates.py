#!/usr/bin/env python3
"""Strict store licensing gate, independently of the technical/offline PWA preflight.
This tool reads exact distributable vocabulary bytes and never changes records.
Do not relax historical prohibitions by deleting fields or changing study flags:
resolve them against the canonical source/provenance evidence instead.
"""
import gzip, hashlib, json, pathlib, sys
ROOT=pathlib.Path(__file__).resolve().parent.parent
parts=[ROOT/'assets'/'data'/('vocabulary-v318.gz.part%02d'%i) for i in range(1,9)]
d=json.loads(gzip.decompress(b''.join(p.read_bytes() for p in parts)))
entries=d.get('entries',[])
if len(entries)!=24538 or len({e['id'] for e in entries})!=24538:
    raise SystemExit('FAIL: unexpected corpus count or duplicate IDs')
blocked=[e for e in entries if e.get('m2LicenseGate')=='ATTRIBUTION_PREPARED_RELEASE_NOT_AUTHORIZED']
not_authorized=[e for e in entries if e.get('m2ReleaseAuthorized') is False]
trial=[e for e in entries if e.get('m2OperationalProjection')=='TRIAL_NOT_RELEASED']
pending_quiz=[e for e in entries if e.get('m2QuizGate')=='PENDING_DIRECTIONAL_M3']
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
# Exact later M016 pair evidence; historical SOL1 status alone is not the latest review.
# These checks record provenance only, never authorize release or certify independent authorship.
m016_pair_sha256={
 'jmdict-1002520-2':'819c7cbcb38f6ecf3d53293e2923431ebcf9b5341150123d079750d69e1e4551',
 'jmdict-1008490-14':'46ccf592a41db8a991fd1f2dbbf6832e96cc50002eef5f31f29508f6721f7cf7',
 'jmdict-1012730-2':'e7e129bd3b341d15bb1f8731870b2ce8051a82b76c069ca167d4e0acaa232f24',
}
def pair_sha(e):
    return hashlib.sha256(json.dumps([e.get('exampleJapanese'),e.get('exampleItalian')],ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
m016_matched=[e for e in unresolved if m016_pair_sha256.get(e['id'])==pair_sha(e)]
summary={
 'store_license_gate':'BLOCKED' if blocked or not_authorized or trial or pending_quiz or unresolved else 'REQUIRES_FINAL_MANUAL_REVIEW',
 'exact_runtime_entries':len(entries),
 'old_c_m2_release_not_authorized':len(blocked),
 'old_c_m2_study_enabled':sum(e.get('studyEnabled') is True for e in blocked),
 'm2_release_authorized_explicitly_false':len(not_authorized),
 'm2_operational_trial_not_released':len(trial),
 'm2_directional_m3_pending':len(pending_quiz),
 'historic_unresolved_study_enabled':len(unresolved),
 'historic_unresolved_with_exact_later_m016_pair_evidence':len(m016_matched),
 'historic_unresolved_without_matching_later_pair_evidence':len(unresolved)-len(m016_matched),
 'm016_note':'Documented later editorial review; independent authorship and final canonical release decision not certified',
 'historic_unresolved_published':sum(i in byid for i in unknown),
 'requires':'Validated canonical provenance/rights and new signed APK with embedded offline notices; EDRDG updates actually applied to distributed data',
 'non_goals':'No automatic deletion, semantic rewrites, ID/progress changes or bypass of source gates'
}
print(json.dumps(summary,ensure_ascii=False,indent=2))
if blocked or not_authorized or trial or pending_quiz or unresolved:
    sys.exit('STORE RELEASE BLOCKED. Do not publish; close C-M2 and unresolved licensing gates in canonical data with source evidence, then rebuild/test.')
