"""Live evaluation results for the Battle page.

GET /results evaluates once per API process and caches the result.
POST /results/refresh forces reevaluation with the currently loaded Python code.
Restart the API after editing classifier source so Python imports the new code.
"""
from contextlib import redirect_stdout
from io import StringIO
from threading import Lock

from fastapi import APIRouter, HTTPException

from pipeline import Pipeline

router = APIRouter(prefix="/results", tags=["results"])

POKEMON_TYPES = [
    "Normal", "Fire", "Water", "Electric", "Grass", "Ice",
    "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug",
    "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy",
]

_lock = Lock()
_cached_result = None


def _evaluate():
    # No graphs/PNG copies: the website renders directly from these numbers.
    with redirect_stdout(StringIO()):
        pipeline = Pipeline()
        outputs = pipeline.run_best()

    models = []
    for name in ("KNN", "K-Means", "Naive Bayes"):
        result = outputs[name]
        with redirect_stdout(StringIO()):
            matrix = pipeline.ev.get_type_confusion_matrix(result["predictions"])

        models.append({
            "name": name,
            "accuracy": float(result["acc"]),       # evaluator returns 0..100
            "precision": float(result["p"]) * 100,  # evaluator returns 0..1
            "recall": float(result["r"]) * 100,
            "f1": float(result["f1"]) * 100,
            "correct": int(result["correct"]),
            "total": int(result["total"]),
            "matrix": matrix.astype(int).tolist(),
        })

    return {"types": POKEMON_TYPES, "models": models}


def _get_result(force=False):
    global _cached_result
    with _lock:
        if force or _cached_result is None:
            try:
                result = _evaluate()
            except Exception as exc:
                # Fail visibly instead of displaying old, misleading results.
                raise HTTPException(status_code=500, detail=f"Evaluation failed: {exc}") from exc
            _cached_result = result
        return _cached_result


@router.get("")
def get_results():
    return _get_result()


@router.post("/refresh")
def refresh_results():
    return _get_result(force=True)
