#!/usr/bin/env python3
"""Read-only audit of fields actually published in Kotoba's current corpus.
Print aggregate stats only. Does not certify copyrighted text provenance.
"""
import collections,gzip,json,pathlib
root=pathlib.Path(__file__).resolve().parent.parent
parts=[root/'assets'/'data'/('vocabulary-v318.gz.part%02d'%i) for i in range(1,9)]
# Auditing the EXACT runtime payload, not the retained legacy vocabulary.json.
d=json.loads(gzip.decompress(b''.join(p.read_bytes() for p in parts)));entries=d['entries']
if len(entries)!=24538:raise SystemExit('Unexpected published corpus count')
ids=[x['id'] for x in entries]
if len(set(ids))!=len(ids):raise SystemExit('Duplicate published IDs')
key_counts=collections.Counter(); nested_keys=collections.Counter(); source_value_counts=collections.Counter()
candidate_fields=('source','origin','license','attribution','provenance','example','sentence','jmdict','wordnet','wiktionary')
for e in entries:
    key_counts.update(e.keys())
    for k,v in e.items():
        if isinstance(v,dict) and any(w in k.lower() for w in candidate_fields):
            nested_keys.update(f'{k}.{n}' for n in v.keys())
        if isinstance(v,str) and any(w in k.lower() for w in ('origin','license','sourcefamily')):
            source_value_counts[(k,v[:70])]+=1
result={'published_entries':len(entries),'unique_ids':len(ids),
        'published_field_counts':key_counts.most_common(60),
        'relevant_nested_fields':nested_keys.most_common(60),
        'source_markers':[(k,v,n) for ((k,v),n) in source_value_counts.most_common(35)],
        'audit_scope':'Inventory only; compare with private provenance register before store approval'};
# Targeted, non-destructive release gates, derived from the EXACT public runtime.
unresolved_ids=[
'jmdict-1002520-2','jmdict-1002570-2','jmdict-1002590-3','jmdict-1002980-17',
'jmdict-1003090-4','jmdict-1003450-5','jmdict-1004590-3','jmdict-1005190-2',
'jmdict-1008490-14','jmdict-1009550-3','jmdict-1012730-2','jmdict-1012980-5',
'jmdict-1036780-2','jmdict-1099580-1','jmdict-1115100-1','jmdict-1132570-2',
'jmdict-1153670-2','jmdict-1240825-2','jmdict-1312070-3','jmdict-1339280-3',
'jmdict-1365670-2','jmdict-1394080-2']
byid={e['id']:e for e in entries}
gates=collections.Counter(str(e.get('m2LicenseGate','')) for e in entries if e.get('m2LicenseGate'))
blocked=[e for e in entries if e.get('m2LicenseGate')=='ATTRIBUTION_PREPARED_RELEASE_NOT_AUTHORIZED']
published_unresolved=[byid[i] for i in unresolved_ids if i in byid]
origins=collections.Counter(str(e.get('source',''))[:80] for e in entries)
authorship=collections.Counter(str(e.get('exampleAuthorshipProvenance',{}).get('newOriginalCompositionClaimed','')) for e in entries if isinstance(e.get('exampleAuthorshipProvenance'),dict))
def group_counts(xs):
    return {'count':len(xs),'study_enabled_true':sum(x.get('studyEnabled') is True for x in xs),
      'study_enabled_false':sum(x.get('studyEnabled') is False for x in xs),
      'has_examples':sum(bool(x.get('exampleJapanese') or x.get('exampleItalian')) for x in xs)}
result['source_counts']=origins.most_common(20)
result['m2_license_gate_counts']=gates.most_common(12)
result['release_not_authorized_gate']=group_counts(blocked)
result['historical_22_unresolved_in_runtime']=group_counts(published_unresolved)
result['unresolved_ids_not_in_runtime']=[i for i in unresolved_ids if i not in byid]
result['example_claims']=authorship.most_common(20)
result['any_exact_tatoeba_omw_italwordnet_source']=sum(any(n in str(x.get('source','')).lower() for n in ('tatoeba','italwordnet','open multilingual','omw')) for x in entries)
result['verification_note']='Release gate status may be historical; requires field-specific rights/provenance review.'
print(json.dumps(result,ensure_ascii=False,indent=2))
