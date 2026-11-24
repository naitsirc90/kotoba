#!/usr/bin/env python3
"""Build the 3.1.19 M3 example candidate from the exact audited baseline.
No editorial generation, no access to personal progress or to the private canon.
Only the 793 previously reviewed examples and their example provenance change.
The checkout is a disposable build tree, not the authoritative database.
"""
import copy, gzip, hashlib, json, pathlib

ROOT=pathlib.Path(__file__).resolve().parents[1]
PARTS=[ROOT/'assets/data'/('vocabulary-v318.gz.part%02d'%i) for i in range(1,9)]
PATCH=ROOT/'scripts/cm2-m3-examples-patch.json'
BASE_JSON='228eb559b7bdae108355268e76a973245754d031500e7011615857acc02e377a'
BASE_GZIP='aad2ed2c60737fde81a1d40a22ed69a29903dee1b78520f313f38133336283a5'
EX_FIELDS={'exampleJapanese','exampleItalian','exampleAuthorshipProvenance'}
def sha(b): return hashlib.sha256(b).hexdigest()
def compact(x): return json.dumps(x,ensure_ascii=False,separators=(',',':')).encode('utf-8')
def require(ok, msg):
    if not ok: raise ValueError(msg)
def replace_once(s,a,b):
    require(s.count(a)==1,'Documentation/build anchor absent or duplicated: '+a[:100])
    return s.replace(a,b)
def main():
    patch=json.loads(PATCH.read_text('utf-8'))
    require(patch['schema']=='KOTOBA_CM2_M3_EXAMPLES_PATCH_V1','Patch schema')
    require(patch['baselineJsonSha256']==BASE_JSON and patch['baselineGzipSha256']==BASE_GZIP,'Wrong patch baseline')
    rows=patch['records']; targets={r['id']:r for r in rows}
    require(len(rows)==len(targets)==793,'Expected precisely 793 unique IDs')
    gz=b''.join(p.read_bytes() for p in PARTS)
    require(sha(gz)==BASE_GZIP,'Baseline gzip differs; refusing to apply')
    raw=gzip.decompress(gz)
    require(sha(raw)==BASE_JSON,'Baseline JSON differs; refusing to apply')
    before=json.loads(raw); data=copy.deepcopy(before)
    entries=data['entries']; ids=[e['id'] for e in entries]
    require(len(entries)==len(set(ids))==24538,'Corpus ID/count mismatch')
    expected={e['id'] for e in entries if e.get('m2QuizGate')=='PENDING_DIRECTIONAL_M3' and e.get('m2LicenseGate')=='ATTRIBUTION_PREPARED_RELEASE_NOT_AUTHORIZED'}
    require(expected==set(targets),'C-M2 population mismatch')
    existing_jp={e['exampleJapanese'] for e in entries if e.get('exampleJapanese')}
    existing_it={e['exampleItalian'] for e in entries if e.get('exampleItalian')}
    new_jp=set(); new_it=set()
    prior_count=sum(bool(e.get('exampleJapanese') and e.get('exampleItalian')) for e in entries)
    require(prior_count==20217,'Unexpected prior example count')
    for e in entries:
        if e['id'] not in targets: continue
        r=targets[e['id']]; p=r['exampleProvenance']; j=r['exampleJapanese']; i=r['exampleItalian']
        require(not e.get('exampleJapanese') and not e.get('exampleItalian'),'Existing current pair at '+e['id'])
        require(not e.get('exampleAuthorshipProvenance'),'Existing current example provenance '+e['id'])
        matched=[k for k,v in e.items() if 'decision' in k.lower() and 'sha' in k.lower() and v==r['decisionSHA256']]
        require(bool(matched),'Decision SHA mismatch '+e['id'])
        require(p['schema']=='KOTOBA_CM2_M3_NEW_EXAMPLE_V1' and p['origin']=='NEW_AI_ASSISTED_EDITORIAL_COMPOSITION_FOR_KOTOBA' and p['sourceExternalTextIncorporated'] is False,'Example provenance mismatch '+e['id'])
        require(p['senseDecisionSHA256']==r['decisionSHA256'],'Provenance decision mismatch '+e['id'])
        require(p['pairSHA256']==sha(compact([j,i])),'Reviewed pair SHA mismatch '+e['id'])
        require(p['pairSHA256']!=p['historicalPairSHA256'],'Historical pair would be copied '+e['id'])
        require(j and i and j not in existing_jp and i not in existing_it and j not in new_jp and i not in new_it,'Duplicate example '+e['id'])
        new_jp.add(j);new_it.add(i)
        e['exampleJapanese']=j;e['exampleItalian']=i;e['exampleAuthorshipProvenance']=p
    require(len(new_jp)==len(new_it)==793,'Pair coverage mismatch')
    for old,new in zip(before['entries'],entries):
        require(old['id']==new['id'],'ID/order changed')
        if old['id'] not in targets:
            require(old==new,'Non-target record changed '+old['id'])
        else:
            require({k:v for k,v in old.items() if k not in EX_FIELDS}=={k:v for k,v in new.items() if k not in EX_FIELDS},'Protected field changed '+old['id'])
    require(before['meta']==data['meta'],'Corpus metadata changed')
    require(sum(bool(e.get('exampleJapanese') and e.get('exampleItalian')) for e in entries)==21010,'Unexpected resulting example count')
    protected=['app.js','bootstrap.js','assets/data/learning-priority.json','assets/data/legacy-compat.json','assets/data/operational-eligibility.json']
    protected_hashes={n:sha((ROOT/n).read_bytes()) for n in protected}
    new_raw=compact(data); new_gz=gzip.compress(new_raw,compresslevel=9,mtime=0)
    # Verify all notices before any write in the disposable checkout.
    notice=(ROOT/'README-LICENSES.txt').read_text('utf-8')
    notice=replace_once(notice,"Nessuna delle 793 contiene esempi nel runtime.","Nella baseline precedente nessuna delle 793 conteneva esempi nel runtime; questa candidata include le 793 nuove coppie editoriali documentate nella sezione 6c.")
    notice=replace_once(notice,"\n7. SHAREALIKE: ADATTAMENTI DEI DATI","\n6c. NUOVI ESEMPI C-M2/M3 (24/11/2026)\nLe 793 coppie storiche senza prova sufficiente di origine restano escluse. Sono state sostituite, nella presente candidata di collaudo, con 793 coppie JP/IT composte per Kotoba con assistenza IA e revisione editoriale di senso e traduzione. Non sono estratti intenzionali da testi esterni; non si certifica una revisione indipendente o di madrelingua. Ogni coppia reca nel record la provenienza, SHA-256 della coppia e riferimento alla decisione originaria. Per i diritti effettivamente detenuti sui contributi originali si applica CC BY-SA 4.0; non si rivendicano diritti ulteriori su opere di terzi. Il corpus contiene 21.010 coppie di esempi. La validazione del canonico corrente e il gate store rimangono aperti.\n\n7. SHAREALIKE: ADATTAMENTI DEI DATI")
    notice=notice.replace("Nessun cambiamento dell'algoritmo, del corpus, degli ID, dello schema progressi o dei 68 blocchi esistenti.","Nessun cambiamento dell'algoritmo, degli ID, delle traduzioni, dello schema progressi o dei 68 blocchi esistenti; il successivo intervento sulle 793 coppie e' descritto nella sezione 6c.")
    notice=notice.replace("la provenienza specifica delle frasi non e' dimostrata per 775","la provenienza specifica delle frasi storiche non e' sufficientemente dimostrata per il loro riutilizzo")
    notice=notice.replace("La QA tecnica direzionale e' conclusa per il perimetro testato; la chiusura complessiva M3 e i metadati di rilascio nel canonico corrente restano sospesi.","La QA tecnica direzionale e' conclusa per il perimetro testato; le 793 nuove coppie sono redatte e integrate nella candidata generata, non nel canonico corrente. I metadati di rilascio nel canonico corrente restano sospesi.")
    notice=notice.replace("nessuna modifica ai dati lessicali della 3.1.18","stessi ID, traducenti e livelli della 3.1.18; 793 nuovi esempi M3")
    readme=(ROOT/'README.md').read_text('utf-8')
    readme=replace_once(readme,"La PWA 3.1.19 mantiene **esattamente lo stesso corpus verificato della versione Android 3.1.18**, senza modifica a dati, ID, esercizi o progressi.","La candidata PWA 3.1.19 conserva i 24.538 identificativi, traducenti, livelli e progressi della 3.1.18 e integra 793 nuove coppie di esempi JP/IT con provenienza editoriale documentata.")
    readme=replace_once(readme,"Il corpus rimane identico.","Le sole modifiche al corpus sono le 793 nuove coppie e la loro provenienza (21.010 coppie complessive); tutte le altre 23.745 schede restano identiche.")
    readme=readme.replace("Gli esempi storici non distribuiti non sono autorizzati al reinserimento;","Gli esempi storici non sono stati reintrodotti;")
    sw=replace_once((ROOT/'sw.js').read_text('utf-8'),"3.1.19-licenses-20261124-m3","3.1.19-licenses-20261124-m3-examples")
    # Balanced split, preserving all eight tracked URL names and unchanged bootstrap.
    size=(len(new_gz)+7)//8
    for i,p in enumerate(PARTS): p.write_bytes(new_gz[i*size:(i+1)*size])
    require(b''.join(p.read_bytes() for p in PARTS)==new_gz and gzip.decompress(new_gz)==new_raw,'Reassembly failure')
    (ROOT/'README-LICENSES.txt').write_text(notice,'utf-8')
    (ROOT/'README.md').write_text(readme,'utf-8')
    (ROOT/'sw.js').write_text(sw,'utf-8')
    require({n:sha((ROOT/n).read_bytes()) for n in protected}==protected_hashes,'Protected runtime asset changed')
    result={'baseline_json_sha256':BASE_JSON,'baseline_gzip_sha256':BASE_GZIP,'candidate_json_sha256':sha(new_raw),'candidate_gzip_sha256':sha(new_gz),'patch_sha256':sha(PATCH.read_bytes()),'records':793,'examples_before':20217,'examples_after':21010,'unchanged_non_target_entries':23745,'all_non_example_fields_preserved':True,'protected_assets':protected_hashes,'previous_local_candidate_json_sha256':patch['previousLocalCandidateJsonSha256'],'canonical_current_updated':False,'store_release_authorized':False}
    (ROOT/'.cm2-candidate-build.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n','utf-8')
    print('PASS EXACT REVIEWED EXAMPLES: '+json.dumps(result,ensure_ascii=False))
if __name__=='__main__': main()
