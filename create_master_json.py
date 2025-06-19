import csv
import json
import sys
from pathlib import Path

# Usage: python create_master_json.py data/raw_table.tsv
if len(sys.argv) < 2:
    print('Usage: python create_master_json.py <input_tsv>')
    sys.exit(1)

inp = Path(sys.argv[1])
rows = []
with inp.open(newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter='\t')
    for row in reader:
        rows.append({k.strip(): v.strip() for k, v in row.items()})

out_path = inp.with_suffix('.json')
with out_path.open('w', encoding='utf-8') as f:
    json.dump(rows, f, indent=2, ensure_ascii=False)

print(f'Wrote {len(rows)} records to {out_path}')
