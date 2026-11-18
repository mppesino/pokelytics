'''
datasets.py
FastAPI endpoints that serve the preprocessed Pokemon CSV files to the Pokedex page.

    GET /datasets                -> metadata (label, rows, columns, ...) for every dataset
    GET /datasets/{key}          -> one page of rows (supports search + type filter)
'''

from functools import lru_cache
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from services.data import Data

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

# key used in the URL -> (button label, csv file)
DATASETS = {
    "categorical": ("Pokemon_Categorical", "pokemon_categorical_binning.csv"),
    "onehot_keep_type": ("Pokemon_Onehot (Keep Type)", "pokemon_onehot_keep_type.csv"),
    "onehot": ("Pokemon_Onehot", "pokemon_onehot.csv"),
}

TYPE_PREFIX = "is_type_1_"

router = APIRouter(prefix="/datasets", tags=["datasets"])


def _cast(value: str):
    '''CSV values are all strings: turn numbers back into int / float.'''
    try:
        return int(value)
    except ValueError:
        pass
    try:
        return float(value)
    except ValueError:
        return value


def _row_type(row: list, type_idx: Optional[int], onehot_type_idx: dict) -> Optional[str]:
    '''type_1 of a row. The fully one-hot file has no type_1 column, so read the is_type_1_* flags.'''
    if type_idx is not None:
        return str(row[type_idx]).lower()
    for type_name, idx in onehot_type_idx.items():
        if row[idx] == 1:
            return type_name
    return None


@lru_cache(maxsize=None)
def _load(key: str) -> dict:
    # The CSV files never change while the server runs, so each one is parsed once.
    _, filename = DATASETS[key]
    raw = Data().load_csv(str(DATA_DIR / filename))
    columns, body = raw[0], raw[1:]
    rows = [[_cast(v) for v in r] for r in body]

    lookup = Data().build_index_lookup(raw)
    type_idx = lookup.get("type_1")
    onehot_type_idx = {
        col[len(TYPE_PREFIX):]: i for i, col in enumerate(columns) if col.startswith(TYPE_PREFIX)
    }
    types = [_row_type(r, type_idx, onehot_type_idx) for r in rows]

    return {
        "columns": columns,
        "rows": rows,
        "types": types,
        "name_idx": lookup.get("name", 1),
        "id_idx": lookup.get("pokedex_id", 0),
    }


@router.get("")
def list_datasets():
    out = []
    for key, (label, filename) in DATASETS.items():
        data = _load(key)
        out.append({
            "key": key,
            "label": label,
            "filename": filename,
            "rows": len(data["rows"]),
            "columns": len(data["columns"]),
        })
    return out


@router.get("/{key}")
def get_dataset(
    key: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=200),
    search: str = "",
    type: str = "",
):
    if key not in DATASETS:
        raise HTTPException(status_code=404, detail=f"Unknown dataset '{key}'")

    data = _load(key)
    indices = range(len(data["rows"]))

    # Filter by primary type
    wanted_type = type.strip().lower()
    if wanted_type:
        indices = [i for i in indices if data["types"][i] == wanted_type]

    # Filter by name / pokedex id
    needle = search.strip().lower()
    if needle:
        indices = [
            i for i in indices
            if needle in str(data["rows"][i][data["name_idx"]]).lower()
            or needle == str(data["rows"][i][data["id_idx"]])
        ]

    total = len(indices)
    pages = max(1, -(-total // page_size))
    page = min(page, pages)
    start = (page - 1) * page_size
    chosen = list(indices)[start:start + page_size]

    return {
        "key": key,
        "label": DATASETS[key][0],
        "columns": data["columns"],
        "rows": [data["rows"][i] for i in chosen],
        "row_types": [data["types"][i] for i in chosen],
        "total": total,
        "dataset_rows": len(data["rows"]),
        "page": page,
        "page_size": page_size,
        "pages": pages,
    }
