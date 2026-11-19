#!/usr/bin/env bash
set -euo pipefail
# Repeatable EDRDG archival fallback. Requires git, brotli, patch, gzip.
# Uses temporary working files only. No credentials, no persistent snapshot.
out_dir="${1:?Destination directory required}"
mkdir -p "$out_dir"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
git clone --depth 1 --quiet https://github.com/Jitendex/edrdg-dictionary-archive.git "$tmp/archive"
commit="$(git -C "$tmp/archive" rev-parse HEAD)"
brotli -d -c "$tmp/archive/JMdict_e/JMdict_e.br" > "$tmp/JMdict_e"
count=0
while IFS= read -r path; do
  brotli -d -c "$path" | patch --silent --batch "$tmp/JMdict_e"
  count=$((count+1))
done < <(find "$tmp/archive/JMdict_e/patches" -name '*.patch.br' -type f | LC_ALL=C sort)
if [ "$count" -lt 300 ]; then echo "Incomplete patch archive: $count" >&2; exit 1; fi
gzip -n -9 -c "$tmp/JMdict_e" > "$out_dir/JMdict_e.gz"
python3 - "$tmp/JMdict_e" "$out_dir/JMdict_e.gz" "$commit" "$count" "$out_dir/JMdict-source-manifest.json" <<'PY'
import datetime, gzip, hashlib, json, pathlib, re, sys
xml=pathlib.Path(sys.argv[1]); zipped=pathlib.Path(sys.argv[2])
raw=xml.read_bytes()
entries=re.findall(rb'<ent_seq>\s*(\d+)\s*</ent_seq>',raw)
if len(entries)<200000 or len(set(entries))!=len(entries):
    raise SystemExit('Corrupted or incomplete JMdict reconstructed archive')
assert gzip.decompress(zipped.read_bytes())==raw
report={'archive_commit':sys.argv[3],'patches_applied':int(sys.argv[4]),'xml_sha256':hashlib.sha256(raw).hexdigest(),
        'gzip_sha256':hashlib.sha256(zipped.read_bytes()).hexdigest(),
        'xml_bytes':len(raw),'entry_count':len(entries),
        'source':'https://github.com/Jitendex/edrdg-dictionary-archive',
        'fetched_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'format':'JMdict_e legacy XML','is_original_EDRDG_gzip':False,
        'disclaimer':'Archive reconstructed from public daily patches; not a byte-identical copy of official FTP gzip.'}
pathlib.Path(sys.argv[5]).write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
PY
