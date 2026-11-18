import { useEffect, useRef, useState } from "react";
import NavBar from "../components/NavBar";

// Pokedex - Dataset
// Dataset description: source, size, features, target, and preprocessing steps
//
// The tables are served by the FastAPI backend (api/routes/datasets.py):
//   GET /datasets          -> metadata of the three CSV files
//   GET /datasets/{key}    -> one page of rows (search + type filter supported)
// Start it with `uvicorn api:app` inside /api, or point VITE_API_URL somewhere else.

const API_URL: string = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

type Cell = string | number;

type DatasetMeta = {
  key: string;
  label: string;
  filename: string;
  rows: number;
  columns: number;
};

type DatasetPage = {
  key: string;
  label: string;
  columns: string[];
  rows: Cell[][];
  row_types: (string | null)[];
  total: number;
  dataset_rows: number;
  page: number;
  page_size: number;
  pages: number;
};

type Result = {
  requestId: string;
  data: DatasetPage | null;
  error: string | null;
};

// Buttons are always rendered (even if the API is down); sizes are filled in from the API.
const tabs = [
  { key: "categorical", label: "Pokemon_Categorical", rows: 1025, columns: 17 },
  { key: "onehot_keep_type", label: "Pokemon_Onehot (Keep Type)", rows: 1025, columns: 177 },
];

const features = [
  "pokedex_id",
  "name",
  "type_1",
  "hp",
  "attack",
  "defense",
  "sp_attack",
  "sp_defense",
  "speed",
  "height_m",
  "weight_kg",
  "base_experience",
  "ability_1",
  "hidden_ability",
  "color",
  "shape",
  "capture_rate",
];

const preprocessing = [
  "One-hot encoding of categorical features (dummy variables)",
  "Binning of less frequent categories (fewer than 5 Pokémon) into \"Other\"",
  "Shuffling of rows for randomness",
  "Splitting of data (70% Train, 30% Test)",
];

const pageSizes = [25, 50, 100];

// Colors for the Type (type_1) pills and the type filter chips.
// `dark` colors get white text so they stay readable.
const typeStyles: Record<string, { bg: string; dark?: boolean }> = {
  normal: { bg: "#E3E3E3" }, // light grey
  fire: { bg: "#F7A3A3" }, // light red
  water: { bg: "#A5CFF5" }, // light blue
  electric: { bg: "#FBF3B0" }, // pale yellow
  grass: { bg: "#B4E8AE" }, // light green
  ice: { bg: "#87CEEB" }, // sky blue
  fighting: { bg: "#DCC59A" }, // tan
  poison: { bg: "#D8B4EA" }, // light purple
  ground: { bg: "#BF9F7A" }, // light brown
  flying: { bg: "#FFFFFF" }, // white
  psychic: { bg: "#C3C6F5" }, // periwinkle
  bug: { bg: "#70C9B0" }, // tourmaline
  rock: { bg: "#8B5E3C", dark: true }, // brown
  ghost: { bg: "#7B4FA3", dark: true }, // purple
  dragon: { bg: "#706D25", dark: true },
  dark: { bg: "#1F2A5C", dark: true }, // navy blue
  steel: { bg: "#B8BEC6" }, // silver
  fairy: { bg: "#F8C8DC" }, // light pink
};

const typeOrder = Object.keys(typeStyles);

// Friendly names for the plain (non one-hot) columns
const columnLabels: Record<string, string> = {
  pokedex_id: "PokeID",
  name: "Name",
  type_1: "Type",
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  sp_attack: "SP-ATK",
  sp_defense: "SP-DEF",
  speed: "SPD",
  height_m: "Height (m)",
  weight_kg: "Weight (kg)",
  base_experience: "Base-EXP",
  ability_1: "ABI",
  hidden_ability: "H-ABI",
  color: "Color",
  shape: "Shape",
  capture_rate: "%Capture",
};

// One-hot columns look like `is_ability_1_overgrow`: show the group small, the value big
const flagGroups: [prefix: string, group: string][] = [
  ["is_type_1_", "TYPE"],
  ["is_ability_1_", "ABILITY"],
  ["is_hidden_ability_", "HIDDEN ABI"],
  ["is_color_", "COLOR"],
  ["is_shape_", "SHAPE"],
];

function headerParts(column: string): { group?: string; label: string } {
  for (const [prefix, group] of flagGroups) {
    if (column.startsWith(prefix)) {
      return { group, label: column.slice(prefix.length) };
    }
  }
  return { label: columnLabels[column] ?? column };
}

const textColumns = new Set(["name", "type_1", "ability_1", "hidden_ability", "color", "shape"]);

const formatNumber = (n: number) => n.toLocaleString("en-US");

export default function Pokedex() {
  const [selected, setSelected] = useState(tabs[0].key);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizes[0]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [meta, setMeta] = useState<DatasetMeta[]>([]);
  const [result, setResult] = useState<Result>({
    requestId: "",
    data: null,
    error: null,
  });

  const tableScroll = useRef<HTMLDivElement>(null);

  // Dataset sizes (for the buttons and the description cards)
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/datasets`, { signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<DatasetMeta[]>) : []))
      .then(setMeta)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  // Wait a moment after typing before asking the API
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
    search,
    type: typeFilter,
  });
  const url = `${API_URL}/datasets/${selected}?${params}`;
  const requestId = `${url}#${reloadKey}`;

  // Load the visible page of the active dataset
  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`The server responded with ${res.status}`);
        return res.json() as Promise<DatasetPage>;
      })
      .then((data) => setResult({ requestId, data, error: null }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setResult((prev) => ({
          requestId,
          data: prev.data,
          error: err instanceof Error ? err.message : "Request failed",
        }));
      });
    return () => controller.abort();
  }, [url, requestId]);

  // Never show another dataset's columns while the new one is loading
  const shown = result.data && result.data.key === selected ? result.data : null;
  const loading = result.requestId !== requestId;
  const failed = !loading && result.error !== null;

  const tabInfo = tabs.map((tab) => {
    const info = meta.find((m) => m.key === tab.key);
    return { ...tab, rows: info?.rows ?? tab.rows, columns: info?.columns ?? tab.columns };
  });

  const selectDataset = (key: string) => {
    setSelected(key);
    setPage(1);
    tableScroll.current?.scrollTo({ top: 0, left: 0 });
  };

  const goToPage = (next: number) => {
    setPage(next);
    tableScroll.current?.scrollTo({ top: 0 });
  };

  const chooseType = (type: string) => {
    setTypeFilter((current) => (current === type ? "" : type));
    setPage(1);
  };

  const firstShown = shown && shown.rows.length > 0 ? (shown.page - 1) * shown.page_size + 1 : 0;
  const lastShown = shown ? firstShown + shown.rows.length - 1 : 0;

  return (
    <>
      <NavBar />

      {/* Banner: stays pinned under the navbar while the next sections slide over it */}
      <section className="sticky top-16 z-0 flex h-72 w-full items-center justify-center overflow-hidden px-8 text-center font-poppins text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-poke-red-dark-pale to-poke-red-dark"
        />

        <div className="relative z-10 pb-6">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <img
              src={`${import.meta.env.BASE_URL}pokemonlogo.png`}
              alt=""
              className="h-14 w-14 animate-[spin_14s_linear_infinite] drop-shadow-lg motion-reduce:animate-none md:h-24 md:w-24"
            />
            <h1 className="font-luckiest text-6xl leading-none [text-shadow:0_6px_0_rgb(0_0_0/0.25)] md:text-8xl">
              Pokédex
            </h1>
            <img
              src={`${import.meta.env.BASE_URL}pokemonlogo.png`}
              alt=""
              className="h-14 w-14 animate-[spin_14s_linear_infinite_reverse] drop-shadow-lg motion-reduce:animate-none md:h-24 md:w-24"
            />
          </div>

          <p className="mt-4 text-lg font-medium md:text-2xl">
            Every Pokémon. Every feature. Ready for training.
          </p>
        </div>
      </section>

      {/* Dataset explorer: scrolls up and covers the banner */}
      <section className="relative z-10 rounded-t-3xl bg-white px-8 pt-16 pb-24 shadow-[0_-16px_40px_rgba(0,0,0,0.25)]">
        <div className="mx-auto max-w-6xl font-poppins">
          <h2 className="font-luckiest text-5xl text-poke-red-pale md:text-6xl">
            Dataset Explorer
          </h2>
          <p className="mt-4 max-w-3xl text-slate-600">
            Browse the preprocessed datasets used to train the classifiers. Each Pokémon&apos;s
            primary type is color-coded in the Type column.
          </p>

          {/* Dataset selector */}
          <div className="mt-8 flex flex-wrap gap-3" role="group" aria-label="Dataset">
            {tabInfo.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => selectDataset(tab.key)}
                aria-pressed={selected === tab.key}
                className={`cursor-pointer rounded-full px-6 py-3 text-left font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-poke-blue-dark ${
                  selected === tab.key
                    ? "bg-poke-blue-dark text-white"
                    : "bg-slate-100 text-poke-blue-dark hover:bg-blue-100"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-3 text-xs font-medium ${
                    selected === tab.key ? "text-white/70" : "text-slate-500"
                  }`}
                >
                  {formatNumber(tab.rows)} × {tab.columns}
                </span>
              </button>
            ))}
          </div>

          {/* Search + page size */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <label className="relative block w-full sm:w-80">
              <span className="sr-only">Search by name or PokeID</span>
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </svg>
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name or PokeID"
                className="w-full rounded-full bg-slate-100 py-2.5 pr-4 pl-10 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-poke-blue-dark"
              />
            </label>

            <label className="ml-auto flex items-center gap-2 text-sm text-slate-600">
              Rows per page
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="cursor-pointer rounded-full bg-slate-100 px-3 py-2 font-semibold text-poke-blue-dark outline-none focus-visible:ring-2 focus-visible:ring-poke-blue-dark"
              >
                {pageSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Type legend (also works as a filter) */}
          <div
            className="mt-5 flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filter by type"
          >
            <button
              type="button"
              onClick={() => {
                setTypeFilter("");
                setPage(1);
              }}
              aria-pressed={typeFilter === ""}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                typeFilter === ""
                  ? "bg-poke-blue-dark text-white"
                  : "bg-slate-100 text-poke-blue-dark hover:bg-blue-100"
              }`}
            >
              All types
            </button>
            {typeOrder.map((type) => {
              const style = typeStyles[type];
              const active = typeFilter === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => chooseType(type)}
                  aria-pressed={active}
                  style={{ backgroundColor: style.bg }}
                  className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold capitalize transition-all hover:brightness-95 ${
                    style.dark ? "text-white" : "text-slate-900"
                  } ${
                    active
                      ? "border-poke-blue-dark ring-2 ring-poke-blue-dark ring-offset-2"
                      : "border-black/10"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>

          {/* Table */}
          <div className="mt-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
              <p aria-live="polite">
                {shown
                  ? shown.total === 0
                    ? "No Pokémon match your filters."
                    : `Showing ${formatNumber(firstShown)}–${formatNumber(lastShown)} of ${formatNumber(shown.total)} Pokémon${
                        shown.total !== shown.dataset_rows
                          ? ` (filtered from ${formatNumber(shown.dataset_rows)})`
                          : ""
                      }`
                  : "\u00A0"}
              </p>
              {shown && shown.columns.length > 20 && (
                <p className="text-xs text-slate-500">Scroll sideways to see every column →</p>
              )}
            </div>

            {failed && (
              <div className="rounded-2xl border-2 border-poke-red-paler bg-poke-red-paler/10 p-6 text-slate-700">
                <h3 className="text-xl font-bold text-poke-red-pale">
                  Couldn&apos;t reach the Pokélytics API
                </h3>
                <p className="mt-2 text-sm leading-relaxed">
                  {result.error}. Make sure the backend is running (
                  <code className="rounded bg-white px-1.5 py-0.5">uvicorn api:app</code> inside
                  the <code className="rounded bg-white px-1.5 py-0.5">api</code> folder) and that{" "}
                  <code className="rounded bg-white px-1.5 py-0.5">{API_URL}</code> is correct.
                </p>
                <button
                  type="button"
                  onClick={() => setReloadKey((k) => k + 1)}
                  className="mt-4 cursor-pointer rounded-full bg-poke-red-dark-pale px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-poke-red-dark"
                >
                  Try again
                </button>
              </div>
            )}

            {!failed && !shown && (
              <div className="flex h-64 items-center justify-center gap-3 rounded-2xl bg-slate-50 text-slate-500">
                <img
                  src={`${import.meta.env.BASE_URL}pokemonlogo.png`}
                  alt=""
                  className="h-8 w-8 animate-spin motion-reduce:animate-none"
                />
                Loading dataset…
              </div>
            )}

            {!failed && shown && (
              <div
                ref={tableScroll}
                aria-busy={loading}
                className={`max-h-[70vh] overflow-auto rounded-2xl border border-slate-200 shadow-sm transition-opacity ${
                  loading ? "opacity-60" : ""
                }`}
              >
                <table className="min-w-full border-separate border-spacing-0 text-sm">
                  <caption className="sr-only">{shown.label}</caption>
                  <thead>
                    <tr>
                      {shown.columns.map((column, c) => {
                        const { group, label } = headerParts(column);
                        const sticky =
                          c === 0
                            ? "left-0 z-30 w-20 min-w-20"
                            : c === 1
                              ? "left-20 z-30 shadow-[2px_0_4px_rgba(0,0,0,0.2)]"
                              : "z-20";
                        return (
                          <th
                            key={column}
                            scope="col"
                            title={column}
                            className={`sticky top-0 bg-poke-blue-dark px-3 py-3 text-center font-bold whitespace-nowrap text-white ${sticky}`}
                          >
                            {group && (
                              <span className="block text-[10px] font-semibold tracking-wider text-white/60">
                                {group}
                              </span>
                            )}
                            <span className="block capitalize">{label}</span>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  <tbody>
                    {shown.rows.map((row, r) => {
                      return (
                        <tr
                          key={`${row[0]}-${r}`}
                          className="bg-white text-slate-900 transition-colors hover:bg-slate-50"
                        >
                          {row.map((value, c) => {
                            const column = shown.columns[c];
                            const isFlag = column.startsWith("is_");
                            const sticky =
                              c === 0
                                ? "sticky left-0 z-10 w-20 min-w-20 bg-inherit"
                                : c === 1
                                  ? "sticky left-20 z-10 min-w-36 bg-inherit text-left shadow-[2px_0_4px_rgba(0,0,0,0.12)]"
                                  : "";
                            const look = isFlag
                              ? value === 1
                                ? "font-bold"
                                : "opacity-30"
                              : column === "name"
                                ? "font-semibold"
                                : "";
                            const text = textColumns.has(column) ? "capitalize" : "";
                            // The Type cell shows a colored pill; the cell itself stays white
                            const typeStyle =
                              column === "type_1"
                                ? typeStyles[String(value).toLowerCase()]
                                : undefined;
                            return (
                              <td
                                key={column}
                                className={`border-b border-black/10 px-3 py-2 text-center whitespace-nowrap tabular-nums ${sticky} ${look} ${text}`}
                              >
                                {typeStyle ? (
                                  <span
                                    style={{
                                      backgroundColor: typeStyle.bg,
                                      color: typeStyle.dark ? "#FFFFFF" : "#0F172A",
                                    }}
                                    className="inline-block min-w-20 rounded-full border border-black/15 px-3 py-0.5 text-xs font-semibold"
                                  >
                                    {value}
                                  </span>
                                ) : (
                                  value
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}

                    {shown.rows.length === 0 && (
                      <tr>
                        <td
                          colSpan={shown.columns.length}
                          className="px-3 py-16 text-center text-slate-500"
                        >
                          No Pokémon match your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {shown && shown.pages > 1 && (
              <nav
                className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm"
                aria-label="Pagination"
              >
                <PageButton
                  label="« First"
                  disabled={shown.page === 1}
                  onClick={() => goToPage(1)}
                />
                <PageButton
                  label="‹ Prev"
                  disabled={shown.page === 1}
                  onClick={() => goToPage(shown.page - 1)}
                />

                <span className="px-3 font-semibold text-poke-blue-dark">
                  Page {formatNumber(shown.page)} of {formatNumber(shown.pages)}
                </span>

                <PageButton
                  label="Next ›"
                  disabled={shown.page === shown.pages}
                  onClick={() => goToPage(shown.page + 1)}
                />
                <PageButton
                  label="Last »"
                  disabled={shown.page === shown.pages}
                  onClick={() => goToPage(shown.pages)}
                />
              </nav>
            )}
          </div>
        </div>
      </section>

      {/* Dataset descriptions: a second sheet that slides up over the explorer */}
      <section className="relative z-20 -mt-10 rounded-t-3xl bg-slate-50 px-8 py-20 shadow-[0_-16px_40px_rgba(0,0,0,0.25)]">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-luckiest text-5xl text-poke-red-pale md:text-6xl">
            Dataset Descriptions
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {/* Source */}
            <div className="rounded-2xl border-2 border-poke-red-paler bg-linear-to-br from-poke-red-pale to-poke-red-paler p-6">
              <h3 className="font-poppins text-2xl font-bold text-white">Source</h3>
              <p className="mt-4 font-poppins text-base leading-relaxed text-white">
                The{" "}
                <a
                  href="https://www.kaggle.com/datasets/darkmatternet/ultimate-pokmon-dataset-2025"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline underline-offset-4 hover:text-white/80"
                >
                  Ultimate Pokémon Dataset
                </a>{" "}
                from Kaggle. Features that were irrelevant to the classification goal were
                dropped before preprocessing.
              </p>
            </div>

            {/* Target */}
            <div className="rounded-2xl border-2 border-poke-red-paler bg-linear-to-br from-poke-red-pale to-poke-red-paler p-6">
              <h3 className="font-poppins text-2xl font-bold text-white">Target</h3>
              <p className="mt-4 font-poppins text-base leading-relaxed text-white">
                Determine the type of the Pokémon. Each Pokémon is labeled with its primary type
                (<code className="font-semibold">type_1</code>), which makes this an 18-class
                classification problem.
              </p>
            </div>

            {/* Size */}
            <div className="rounded-2xl border-2 border-poke-red-paler bg-linear-to-br from-poke-red-paler to-poke-red-pale p-6 md:col-span-2">
              <h3 className="font-poppins text-2xl font-bold text-white">Size</h3>
              <ul className="mt-4 grid gap-4 md:grid-cols-2">
                {tabInfo.map((tab) => (
                  <li key={tab.key} className="rounded-xl bg-white/15 p-4 font-poppins text-white">
                    <p className="text-sm font-semibold">{tab.label}</p>
                    <p className="mt-1 text-2xl font-bold">{formatNumber(tab.rows)} rows</p>
                    <p className="text-sm text-white/80">{tab.columns} columns</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features */}
            <div className="rounded-2xl border-2 border-poke-blue-paler bg-linear-to-br from-poke-blue-pale to-poke-blue-paler p-6">
              <h3 className="font-poppins text-2xl font-bold text-white">Features</h3>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Dataset features">
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="rounded-full bg-white/15 px-3 py-1 font-poppins text-sm font-semibold text-white ring-1 ring-white/40"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Preprocessing */}
            <div className="rounded-2xl border-2 border-poke-blue-paler bg-linear-to-br from-poke-blue-pale to-poke-blue-paler p-6">
              <h3 className="font-poppins text-2xl font-bold text-white">Preprocessing</h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 font-poppins text-base leading-relaxed text-white">
                {preprocessing.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PageButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="cursor-pointer rounded-full bg-slate-100 px-4 py-2 font-semibold text-poke-blue-dark transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-100"
    >
      {label}
    </button>
  );
}
