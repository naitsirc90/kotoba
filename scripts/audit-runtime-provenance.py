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
print(json.dumps(result,ensure_ascii=False,indent=2))
