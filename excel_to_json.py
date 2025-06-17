# excel_to_json.py
import pandas as pd
import json
import pathlib
import sys

# Usage: python excel_to_json.py "Ayodhya Nagari Belhe.xlsx"
xlsx_path = sys.argv[1]
xl = pd.ExcelFile(xlsx_path)

for sheet in xl.sheet_names:
    # read only the first two columns (A=plot, B=status), adjust header if needed
    df = xl.parse(sheet, usecols=[0,1], header=0)
    df.columns = ["plot", "status"]

    # drop any rows where plot number is missing
    df = df.dropna(subset=["plot"])

    # normalize plot IDs (string, uppercase, no spaces)
    df["plot"] = (
        df["plot"]
        .astype(str)
        .str.upper()
        .str.replace(r"\s+", "", regex=True)
    )

    # drop rows where status is missing
    df = df.dropna(subset=["status"])

    # normalize status to lowercase strings
    df["status"] = df["status"].astype(str).str.lower()

    # now build the dict
    out_dict = df.set_index("plot")["status"].to_dict()

    # write it
    out_path = pathlib.Path(f"{sheet}.json")
    out_path.write_text(json.dumps(out_dict, indent=2))

    print(f"Wrote {len(out_dict)} entries to {out_path}")
