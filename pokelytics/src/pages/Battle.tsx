import { useCallback, useEffect, useMemo, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

// All numerical values come from the evaluation API. There are no fixed scores or PNGs.
type Metric = "accuracy" | "precision" | "recall" | "f1";
type ModelName = "KNN" | "K-Means" | "Naive Bayes";
type ModelResult = {
  name: ModelName;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  correct: number;
  total: number;
  matrix: number[][];
};
type Results = { types: string[]; models: ModelResult[] };

const API_URL = (import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");
const metrics: { key: Metric; label: string; meaning: string }[] = [
  { key: "accuracy", label: "Accuracy", meaning: "Percentage of all Pokémon correctly classified." },
  { key: "precision", label: "Precision", meaning: "Mean reliability of predicted types across all 18 classes." },
  { key: "recall", label: "Recall", meaning: "Mean proportion of each actual type correctly identified." },
  { key: "f1", label: "F1-score", meaning: "Mean per-type harmonic balance between precision and recall." },
];
const methodDescriptions: Record<ModelName, string> = {
  KNN: "K-Nearest Neighbors identifies Pokémon by comparing their attributes with those of labeled Pokémon in the training data.",
  "K-Means": "K-Means groups Pokémon by feature similarity without using type labels during clustering; clusters are subsequently assigned labels for evaluation.",
  "Naive Bayes": "Naive Bayes estimates type probabilities using observed attributes and a conditional-independence assumption.",
};
const barColor: Record<ModelName, string> = {
  KNN: "bg-[#4C78A8]",
  "K-Means": "bg-[#F58518]",
  "Naive Bayes": "bg-[#54A24B]",
};
const pct = (n: number) => `${n.toFixed(2)}%`;

// Validate before rendering so malformed API responses cannot silently mislabel charts.
function validateResults(payload: unknown): Results {
  if (!payload || typeof payload !== "object") throw new Error("Invalid results response.");
  const data = payload as Partial<Results>;
  if (!Array.isArray(data.types) || data.types.length !== 18 || !Array.isArray(data.models) || data.models.length !== 3)
    throw new Error("Expected three models and 18 Pokémon types.");
  if (!data.models.every((m) =>
    ["KNN", "K-Means", "Naive Bayes"].includes(m.name) &&
    [m.accuracy, m.precision, m.recall, m.f1].every((v) => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 100) &&
    Array.isArray(m.matrix) && m.matrix.length === 18 &&
    m.matrix.every((row) => Array.isArray(row) && row.length === 18 && row.every((n) => Number.isInteger(n) && n >= 0))
  )) throw new Error("Incomplete model metrics or confusion matrices.");
  return data as Results;
}

function insights(model: ModelResult, types: string[]) {
  const diagonal = types.map((type, i) => ({ type, count: model.matrix[i][i] }));
  const best = diagonal.sort((a, b) => b.count - a.count).filter((x) => x.count > 0).slice(0, 3);
  const mistakes = model.matrix.flatMap((row, i) => row.flatMap((count, j) => i !== j && count > 0
    ? [{ actual: types[i], predicted: types[j], count }] : []));
  const worst = mistakes.sort((a, b) => b.count - a.count).slice(0, 2);
  const strengths = best.length ? `Highest correct-type counts: ${best.map((x) => `${x.type} (${x.count})`).join(", ")}.` : "No correct classifications were recorded.";
  const errors = worst.length ? `Largest confusions: ${worst.map((x) => `${x.actual} → ${x.predicted} (${x.count})`).join("; ")}.` : "No incorrect classifications were recorded.";
  return `${strengths} ${errors}`;
}

function MetricGraph({ metric, models }: { metric: (typeof metrics)[number]; models: ModelResult[] }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5">
      <h4 className="text-center text-lg font-bold text-poke-blue-dark">{metric.label}</h4>
      <div className="mt-5 space-y-4" role="img" aria-label={`${metric.label} performance: ${models.map((m) => `${m.name} ${pct(m[metric.key])}`).join(", ")}`}>
        {models.map((model) => (
          <div key={model.name}>
            <div className="mb-1 flex justify-between gap-2 text-sm">
              <span className="font-semibold text-slate-700">{model.name}</span>
              <span className="font-bold tabular-nums text-slate-700">{pct(model[metric.key])}</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full transition-[width] duration-500 ${barColor[model.name]}`} style={{ width: `${model[metric.key]}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-xs text-slate-400"><span>0%</span><span>100%</span></div>
    </div>
  );
}

function ConfusionMatrix({ model, types, expanded = false }: { model: ModelResult; types: string[]; expanded?: boolean }) {
  const maxCount = Math.max(1, ...model.matrix.flat());
  const cellWidth = expanded ? "minmax(37px, 1fr)" : "minmax(32px, 1fr)";
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white p-3" aria-label={`${model.name} actual type by predicted type confusion matrix`}>
      <div style={{ minWidth: expanded ? 940 : 790 }}>
        <p className="mb-3 text-center text-sm font-semibold text-slate-600">Predicted Pokémon Type →</p>
        <div className="grid gap-[2px]" style={{ gridTemplateColumns: `94px repeat(18, ${cellWidth})` }}>
          <div className="flex items-end justify-end pr-2 pb-1 text-[10px] text-slate-500">Actual ↓</div>
          {types.map((type) => <div key={type} className="flex h-20 items-end justify-center overflow-hidden pb-1 text-[10px] font-medium text-slate-600" title={`Predicted: ${type}`}><span className="-rotate-60 whitespace-nowrap">{type}</span></div>)}
          {model.matrix.map((row, i) => (
            <div key={types[i]} className="contents">
              <div className="flex items-center justify-end pr-2 text-[11px] font-semibold text-slate-700">{types[i]}</div>
              {row.map((count, j) => {
                const strength = count / maxCount;
                const bg = `rgba(30, 95, 173, ${0.06 + strength * 0.94})`;
                return (
                  <div key={`${i}-${j}`} title={`Actual ${types[i]} • Predicted ${types[j]} • ${count} Pokémon${i === j ? " • Correct" : ""}`} className={`flex aspect-square min-h-8 items-center justify-center rounded-[2px] text-[10px] font-semibold tabular-nums ${strength > 0.48 ? "text-white" : "text-slate-900"} ${i === j ? "ring-1 ring-inset ring-blue-400/40" : ""}`} style={{ backgroundColor: bg }}>
                    {count}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-end gap-2 text-xs text-slate-500">
          <span>Fewer</span><div className="h-3 w-28 rounded bg-linear-to-r from-[#eff5fb] to-[#1e5fad]"/><span>More</span>
        </div>
      </div>
    </div>
  );
}

export default function Battle() {
  const [results, setResults] = useState<Results | null>(null);
  const [selected, setSelected] = useState<ModelName>("KNN");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [largeMatrix, setLargeMatrix] = useState(false);

  const load = useCallback(async (refresh: boolean, signal?: AbortSignal) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/results${refresh ? "/refresh" : ""}`, {
        method: refresh ? "POST" : "GET",
        cache: "no-store",
        signal,
      });
      if (!response.ok) {
        const body: unknown = await response.json().catch(() => null);
        const msg = body && typeof body === "object" && "detail" in body ? String(body.detail) : `HTTP ${response.status}`;
        throw new Error(msg);
      }
      const next = validateResults(await response.json());
      if (!signal?.aborted) setResults(next);
    } catch (err) {
      if (!signal?.aborted) setError(err instanceof Error ? err.message : "Unable to load model results.");
    } finally {
      if (!signal?.aborted) { setLoading(false); setRefreshing(false); }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void load(false, controller.signal);
    return () => controller.abort();
  }, [load]);

  // Quietly fetch the current evaluation periodically. When the Python API
  // restarts after source edits, its cache is cleared and fresh values appear.
  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const response = await fetch(`${API_URL}/results`, { cache: "no-store" });
        if (!response.ok) return;
        const fresh = validateResults(await response.json());
        if (active) { setResults(fresh); setError(null); }
      } catch { /* Keep the last good result if API is temporarily restarting. */ }
    };
    const interval = window.setInterval(() => { void poll(); }, 15000);
    return () => { active = false; window.clearInterval(interval); };
  }, []);

  const models = results?.models ?? [];
  const current = models.find((m) => m.name === selected) ?? models[0];
  const leaderboard = useMemo(() => [...models].sort((a, b) => b.f1 - a.f1), [models]);
  const winner = leaderboard[0];

  return (
    <>
      <NavBar />
      <main className="bg-slate-50 font-poppins">
        {/* Original hero design */}
        <section className="bg-poke-red-dark-pale px-6 py-20 text-center text-white md:px-8 md:py-24">
          <h1 className="font-luckiest text-5xl md:text-8xl">The Poké Battle Arena</h1>
          <p className="mt-4 text-lg md:text-xl">How well can three algorithms perform under one classification challenge?</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {["KNN", "K-Means", "Naive Bayes"].map((name) => <span key={name} className="rounded-full bg-white/15 px-5 py-2 font-semibold">{name}</span>)}
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm" role="status">
            <div>
              <p className="font-bold text-poke-blue-dark">Evaluation Results</p>
              <p className="text-sm text-slate-600">{loading ? "Evaluating the three classifiers..." : refreshing ? "Reevaluating models..." : results ? "Results from the Python evaluation pipeline" : "Results unavailable"}</p>
            </div>
            <button type="button" onClick={() => void load(true)} disabled={loading || refreshing} className="cursor-pointer rounded-full bg-poke-blue-dark px-5 py-2 text-sm font-semibold text-white hover:bg-poke-blue disabled:cursor-wait disabled:opacity-60">
              {loading || refreshing ? "Evaluating..." : "Reevaluate models"}
            </button>
          </div>
          {error && <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"><strong>Could not load results:</strong> {error}. Check that FastAPI is running at {API_URL}.</div>}
        </div>

        {results && (
          <>
            {/* RESULTS: four charts replace static model_comparison.png */}
            <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:px-8">
              <h2 className="font-luckiest text-4xl text-poke-red-pale md:text-5xl">Battle Results</h2>
              <p className="mt-4 text-slate-600">Comparing the performance of KNN, K-Means, and Naive Bayes in predicting Pokémon types.</p>
              <div className="mt-8 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
                <h3 className="text-2xl font-bold text-poke-blue-dark">Model Performance Comparison</h3>
                <div className="mt-6 grid gap-4 md:grid-cols-2">{metrics.map((metric) => <MetricGraph key={metric.key} metric={metric} models={models} />)}</div>
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl bg-slate-100 p-6">
                    <h4 className="text-lg font-bold text-poke-blue-dark">How to Read the Graph</h4>
                    <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-slate-600">
                      {metrics.map((m) => <li key={m.key}><strong>{m.label}:</strong> {m.meaning}</li>)}
                      <li><strong>Bar length:</strong> A longer bar represents a higher percentage for that metric.</li>
                    </ul>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-6">
                    <h4 className="text-lg font-bold text-poke-blue-dark">Understanding the Results</h4>
                    {winner && <p className="mt-4 text-sm leading-relaxed text-slate-600"><strong>{winner.name}</strong> achieved the highest macro F1-score at <strong>{pct(winner.f1)}</strong> and an accuracy of <strong>{pct(winner.accuracy)}</strong>. {leaderboard.slice(1).map((m) => `${m.name} (${pct(m.f1)} F1)`).join(" and ")} followed in the F1 ranking. These values are recalculated whenever the models are reevaluated.</p>}
                  </div>
                </div>
              </div>
            </section>

            {/* CONFUSION MATRICES: original selector and explanation cards */}
            <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:px-8">
              <h2 className="font-luckiest text-4xl text-poke-red-pale md:text-5xl">Confusion Matrices</h2>
              <p className="mt-4 text-slate-600">Explore how each algorithm classified the 18 Pokémon types.</p>
              <div className="mt-8 flex flex-wrap gap-3" aria-label="Select confusion matrix">
                {models.map((model) => <button key={model.name} type="button" onClick={() => setSelected(model.name)} aria-pressed={current?.name === model.name} className={`cursor-pointer rounded-full px-6 py-3 font-semibold transition-colors ${current?.name === model.name ? "bg-poke-blue-dark text-white" : "bg-white text-poke-blue-dark hover:bg-blue-100"}`}>{model.name}</button>)}
              </div>
              {current && <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
                <h3 className="text-center text-2xl font-bold text-poke-blue-dark">{current.name}</h3>
                <p className="mt-2 text-center text-sm text-slate-500">{current.correct} correct out of {current.total} predictions ({pct(current.accuracy)} accuracy)</p>
                <div className="mt-4"><ConfusionMatrix model={current} types={results.types}/></div>
                <div className="mt-4 flex justify-center"><button type="button" onClick={() => setLargeMatrix(true)} className="cursor-pointer rounded-full bg-poke-blue-dark px-6 py-3 font-semibold text-white hover:bg-poke-blue">Enlarge Confusion Matrix</button></div>
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl bg-slate-100 p-6">
                    <h4 className="text-lg font-bold text-poke-blue-dark">How to Read the Matrix</h4>
                    <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-slate-600">
                      <li><strong>Rows:</strong> Actual Pokémon types.</li>
                      <li><strong>Columns:</strong> Predicted Pokémon types.</li>
                      <li><strong>Diagonal cells:</strong> Correct classifications.</li>
                      <li><strong>Off-diagonal cells:</strong> Incorrect classifications.</li>
                      <li><strong>Darker blue:</strong> Higher Pokémon count within this matrix.</li>
                    </ul>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-6" aria-live="polite">
                    <h4 className="text-lg font-bold text-poke-blue-dark">Understanding the Results</h4>
                    <p className="mt-2 text-sm font-semibold text-poke-blue-paler">{current.name}</p>
                    <p className="mt-4 text-sm leading-relaxed text-slate-600">{insights(current, results.types)}</p>
                  </div>
                </div>
              </div>}
            </section>

            {/* DISCUSSION: prose remains explanatory, all numerical claims computed */}
            <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:px-8">
              <h2 className="font-luckiest text-4xl text-poke-red-pale md:text-5xl">Discussion</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {models.map((model) => <article key={model.name} className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-poke-blue-dark">{model.name}</h3>
                  <p className="mt-3 text-sm font-semibold text-slate-500">Accuracy {pct(model.accuracy)} · Macro F1 {pct(model.f1)}</p>
                  <p className="mt-4 leading-relaxed text-slate-600">{methodDescriptions[model.name]}</p>
                  <p className="mt-4 leading-relaxed text-slate-600">{insights(model, results.types)}</p>
                </article>)}
              </div>
              <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-bold text-poke-blue-dark">Limitations and Possible Improvements</h3>
                <p className="mt-4 leading-relaxed text-slate-600">Pokémon types share overlapping attributes, and the 18 types are not equally represented. Physical and combat characteristics may not fully describe a Pokémon's elemental theme. Future experiments could explore more informative features, class balancing, alternative distance measures, and additional tuning. Comparisons should account for the different assumptions of supervised classification and unsupervised clustering.</p>
              </div>
              <div className="mt-8 rounded-2xl bg-blue-50 p-6 shadow-sm">
                <h3 className="text-2xl font-bold text-poke-blue-dark">The Verdict</h3>
                <p className="mt-4 leading-relaxed text-slate-600">{winner ? `${winner.name} achieved the highest macro F1-score (${pct(winner.f1)}) among the evaluated methods. ${leaderboard.map((m, i) => `${i + 1}. ${m.name}: ${pct(m.f1)}`).join("; ")}. These results demonstrate how well the current feature sets and algorithms distinguish primary Pokémon types, while also showing opportunities for improvement.` : "No results available."}</p>
              </div>
            </section>
          </>
        )}
        {!results && !loading && <div className="mx-auto max-w-6xl px-8 py-16 text-center text-slate-600">No evaluation data to display. Start FastAPI and try again.</div>}
      </main>
      {largeMatrix && current && results && <div role="presentation" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3" onMouseDown={(e) => { if (e.target === e.currentTarget) setLargeMatrix(false); }}>
        <div role="dialog" aria-modal="true" aria-label={`${current.name} enlarged confusion matrix`} className="max-h-[95vh] w-full max-w-6xl overflow-auto rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-bold text-poke-blue-dark">{current.name} — Confusion Matrix</h2><button type="button" autoFocus onClick={() => setLargeMatrix(false)} className="cursor-pointer rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">Close ✕</button></div>
          <ConfusionMatrix model={current} types={results.types} expanded/>
        </div>
      </div>}
      <Footer />
    </>
  );
}
