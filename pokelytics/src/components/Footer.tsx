const references = [
  {
    author: "DarkMatterNet",
    date: "2026",
    title: "Ultimate Pokémon Dataset 2026",
    descriptor: "[Data set]",
    publisher: "Kaggle",
    url: "https://www.kaggle.com/datasets/darkmatternet/ultimate-pokmon-dataset-2025?fbclid=IwY2xjawVFkJdleHRuA2FlbQIxMABwZG9mAWJyaWQRMURRNU5YbTN3VzVjWGc3ZGlzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEe8DFZyNFohfIE7vuP5_VLsxsThdQsCjM4MxcRWfM86oW-_SRuJCR33fKlpUI_aem_yPA4hXsS1LCTWtV01sSwtg",
  },
  {
    author: "GeeksforGeeks",
    date: "2024, March 21",
    title: "Grid searching from scratch using Python",
    url: "https://www.geeksforgeeks.org/machine-learning/grid-searching-from-scratch-using-python/",
  },
  {
    author: "GeeksforGeeks",
    date: "2026a, March 30",
    title: "Evaluation metrics in machine learning",
    url: "https://www.geeksforgeeks.org/machine-learning/metrics-for-machine-learning-model/",
  },
  {
    author: "GeeksforGeeks",
    date: "2026b, May 29",
    title: "One hot encoding in machine learning",
    url: "https://www.geeksforgeeks.org/machine-learning/ml-one-hot-encoding/",
  },
  {
    author: "Kumar, S.",
    date: "2025, April 4",
    title: "Evaluation metrics for classification model",
    publisher: "Analytics Vidhya",
    url: "https://www.analyticsvidhya.com/blog/2021/07/metrics-to-evaluate-your-classification-model-to-take-the-right-decisions/",
  },
  {
    author: "PokéAPI",
    date: "n.d.",
    title: "PokéAPI",
    descriptor: "[Web API]",
    retrieved: "Retrieved November 18, 2026, from",
    url: "https://pokeapi.co/",
  },
];

export default function Footer() {
  return (
    <footer className="bg-poke-blue-dark px-20 py-10 text-white">
      <div className="mx-auto max-w-7xl font-poppins">
        <p className="font-luckiest text-2xl">Pokélytics</p>
        <p className="mt-2 text-sm text-white/80">
          University of the Philippines-Los Baños
        </p>

        <details className="mt-6">
          <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wider">
            References
          </summary>

          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/90">
            {references.map((r) => (
              <li key={r.title + r.date} className="-indent-8 pl-8">
                {r.author}. ({r.date}).{" "}
                <em>{r.title}</em>
                {r.descriptor && ` ${r.descriptor}`}.
                {r.publisher && ` ${r.publisher}.`}
                {r.retrieved && ` ${r.retrieved}`}{" "}
                {r.url && (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all underline hover:text-white"
                  >
                    {r.url}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </details>

        <p className="mt-8 text-xs text-white/60">
          Pokémon is a trademark of Nintendo, Creatures Inc., and GAME FREAK
          inc. This is a student project.
        </p>
      </div>
    </footer>
  );
}