# ayodhya.github.io

This repo contains a small demo for visualising plots of land. Data for each plot can be stored in a TSV file and converted to a single JSON file. Use `create_master_json.py` to convert the raw table into `data/raw_table.json`.

```bash
python create_master_json.py data/raw_table.tsv
```

The generated JSON can then be fetched by the web frontend or other tools.
