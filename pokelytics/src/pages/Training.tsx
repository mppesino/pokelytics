
import NavBar from "../components/NavBar";

type Algorithm = {
  number: string;
  name: string;
  category: string;
  description: string;
  method: string;
  implementation: string;
  configuration: [string, string][];
  theme: string;
  border: string;
};

type MethodCardProps = {
  algorithm: Algorithm;
};

type ConfigurationCardProps = {
  algorithm: Algorithm;
};

const algorithms: Algorithm[] = [
  {
    number: "01",
    name: "K-Nearest Neighbors",
    category: "Supervised Learning · Classification",
    description:
      "KNN predicts a Pokémon's type by identifying the most similar Pokémon in the training dataset.",
    method:
      "It calculates the distance between a test Pokémon and the training samples using Minkowski distance. The k nearest neighbors are selected, and the most frequently occurring primary type among them becomes the prediction.",
    implementation:
      "Pokelytics represents Pokémon using one-hot encoded ability, shape, and color features. It calculates Minkowski distances between samples, selects the nearest neighbors, and uses majority voting to determine the predicted type.",
    configuration: [
      ["Number of neighbors (k)", "1"],
      ["Distance metric", "Minkowski"],
      ["Distance parameter (p)", "1 (Manhattan)"],
      ["Features", "Ability, Shape, Color"],
    ],
    theme:
      "bg-linear-to-br from-poke-red-pale to-poke-red-paler",
    border: "border-poke-red-paler",
  },
  {
    number: "02",
    name: "Naive Bayes",
    category: "Supervised Learning · Classification",
    description:
      "Naive Bayes predicts a Pokémon's type by estimating the probability of each possible class given its observed attributes.",
    method:
      "It applies Bayes' theorem to calculate the posterior probability of each Pokémon type. It assumes that the observed features are conditionally independent given the class. The class with the highest posterior probability is selected as the prediction.",
    implementation:
      "Pokelytics calculates the prior probability of each Pokémon type and the conditional probabilities of its categorical attributes. Laplace smoothing is applied to prevent unseen feature values from resulting in zero probabilities.",
    configuration: [
      ["Probability model", "Categorical Naive Bayes"],
      ["Smoothing method", "Laplace smoothing"],
      ["Smoothing factor (α)", "0.1"],
      ["Features", "Categorical attributes"],
    ],
    theme:
      "bg-linear-to-br from-poke-blue-pale to-poke-blue-paler",
    border: "border-poke-blue-paler",
  },
  {
    number: "03",
    name: "K-Means Clustering",
    category: "Unsupervised Learning · Clustering",
    description:
      "K-Means discovers groups of Pokémon by organizing samples according to similarities in their numerical attributes.",
    method:
      "It begins by initializing cluster centroids and assigning each Pokémon to its nearest centroid. The centroids are then recalculated using the mean of their assigned samples. This process repeats until the clusters converge or the maximum number of iterations is reached.",
    implementation:
      "Pokelytics standardizes numerical Pokémon statistics before clustering. Each sample is assigned to its nearest centroid, and the centroids are repeatedly updated. To generate type predictions for evaluation, each cluster is assigned the most common primary type among its training members.",
    configuration: [
      ["Number of clusters (k)", "108"],
      ["Maximum iterations", "100"],
      ["Features", "Numerical statistics"],
      ["Type assignment", "Majority type per cluster"],
    ],
    theme:
      "bg-linear-to-br from-poke-red-paler to-poke-red-pale",
    border: "border-poke-red-paler",
  },
];

// Method Card
function MethodCard({ algorithm }: MethodCardProps) {
  return (
    <article
      className={`flex flex-col rounded-2xl border-2 bg-white p-6 text-gray-800 shadow-md ${algorithm.border}`}
    >
      <div className="mb-5 flex min-h-8 items-center justify-between gap-3">
        <span className="rounded-full border border-gray-200 px-3 py-1 font-poppins text-xs font-bold tracking-wider text-gray-500">
          {algorithm.number}
        </span>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-right font-poppins text-xs font-semibold text-gray-600">
          {algorithm.category}
        </span>
      </div>

      <h3 className="font-poppins text-2xl font-bold md:text-3xl lg:min-h-[4.5rem]">
        {algorithm.name}
      </h3>

      <p className="mt-3 font-poppins text-sm font-medium leading-relaxed text-gray-600 lg:min-h-[4.5rem]">
        {algorithm.description}
      </p>

      <div className="mt-6 space-y-5 lg:flex lg:flex-1 lg:flex-col">
        <section className="lg:min-h-48">
          <h4 className="font-poppins text-lg font-bold text-gray-900">
            How It Works
          </h4>

          <p className="mt-2 font-poppins text-sm leading-relaxed text-gray-600">
            {algorithm.method}
          </p>
        </section>

        <section>
          <h4 className="font-poppins text-lg font-bold text-gray-900">
            Implementation in Pokelytics
          </h4>

          <p className="mt-2 font-poppins text-sm leading-relaxed text-gray-600">
            {algorithm.implementation}
          </p>
        </section>
      </div>
    </article>
  );
}

// Final Configuration Card
function ConfigurationCard({
  algorithm,
}: ConfigurationCardProps) {
  return (
    <article
      className={`rounded-2xl border-2 bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${algorithm.border}`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl font-poppins font-bold text-white ${algorithm.theme}`}
        >
          {algorithm.number}
        </span>

        <div>
          <h3 className="font-poppins text-lg font-bold text-gray-800">
            {algorithm.name}
          </h3>

          <p className="font-poppins text-xs text-gray-500">
            {algorithm.category}
          </p>
        </div>
      </div>

      <dl className="mt-6 divide-y divide-gray-100">
        {algorithm.configuration.map(([label, value]) => (
          <div
            key={label}
            className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <dt className="font-poppins text-sm text-gray-500">
              {label}
            </dt>

            <dd className="text-right font-poppins text-sm font-semibold text-gray-800">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export default function Training() {
  return (
    <>
      <NavBar />

      {/* Hero Section */}
      <section className="sticky top-16 z-0 flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-poke-red-dark-pale px-8 text-center">
        <div className="max-w-6xl">
          <h1 className="font-luckiest text-6xl leading-none text-white [text-shadow:0_6px_0_rgb(0_0_0/0.25)] sm:text-7xl md:text-8xl">
            The Training Lab
          </h1>

          <p className="mt-6 font-poppins text-lg font-medium text-white md:text-2xl">
            Explore how KNN, K-Means, and Naive Bayes learn from Pokémon
            attributes and uncover patterns in Pokémon types.
          </p>

          <ul
            className="mt-8 flex flex-wrap justify-center gap-3 font-poppins"
            aria-label="Training algorithms"
          >
            {["KNN", "K-Means", "Naive Bayes"].map((method) => (
              <li
                key={method}
                className="rounded-full bg-white/15 px-5 py-2 text-sm font-semibold text-white ring-1 ring-white/30 md:text-base"
              >
                {method}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen rounded-t-3xl bg-white px-6 py-16 shadow-[0_-16px_40px_rgba(0,0,0,0.25)] md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">

          {/* Methods Section */}
          <section aria-labelledby="methods-heading">
            <div className="max-w-3xl">
              <h2
                id="methods-heading"
                className="font-luckiest text-4xl text-poke-red-pale md:text-5xl"
              >
                Methods
              </h2>

              <p className="mt-3 font-poppins leading-relaxed text-gray-600">
                Learn how each algorithm works and how it was implemented
                in Pokelytics to analyze Pokémon attributes.
              </p>
            </div>

            <div className="mt-8 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
              {algorithms.map((algorithm) => (
                <MethodCard
                  key={algorithm.number}
                  algorithm={algorithm}
                />
              ))}
            </div>
          </section>

          {/* Final Configurations Section */}
          <section
            aria-labelledby="configurations-heading"
            className="mt-20"
          >
            <div className="max-w-3xl">
              <h2
                id="configurations-heading"
                className="font-luckiest text-4xl text-poke-red-pale md:text-5xl"
              >
                Final Configurations
              </h2>

              <p className="mt-3 font-poppins leading-relaxed text-gray-600">
                The hyperparameters and feature configurations used
                in the final version of each algorithm.
              </p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {algorithms.map((algorithm) => (
                <ConfigurationCard
                  key={algorithm.number}
                  algorithm={algorithm}
                />
              ))}
            </div>
          </section>

          {/* Experimental Setup Section */}
          <section
            aria-labelledby="setup-heading"
            className="mt-20"
          >
            <div className="max-w-3xl">
              <h2
                id="setup-heading"
                className="font-luckiest text-4xl text-poke-red-pale md:text-5xl"
              >
                Experimental Setup
              </h2>

              <p className="mt-3 font-poppins leading-relaxed text-gray-600">
                An overview of the dataset splits, model configurations,
                and evaluation procedures used in our experiments.
              </p>
            </div>

            <div className="mt-8 grid gap-6 font-poppins md:grid-cols-2">

              {/* Data and Features */}
              <article className="rounded-2xl border-2 border-poke-red-paler bg-white p-6 text-gray-800 shadow-sm">
                <h3 className="text-xl font-bold">
                  Data and Features
                </h3>

                <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-gray-600">
                  <li>
                    The dataset is divided into 70% training data
                    (717 samples) and 30% testing data (308 samples).
                  </li>

                  <li>
                    Naive Bayes uses categorical attributes, while KNN
                    uses one-hot encoded ability, shape, and color features.
                  </li>

                  <li>
                    K-Means uses numerical Pokémon statistics,
                    standardized using training-set statistics.
                  </li>

                  <li>
                    The prediction target is each Pokémon's primary type.
                  </li>
                </ul>
              </article>

              {/* Tuning and Evaluation */}
              <article className="rounded-2xl border-2 border-poke-blue-paler bg-white p-6 text-gray-800 shadow-sm">
                <h3 className="text-xl font-bold">
                  Tuning and Evaluation
                </h3>

                <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-gray-600">
                  <li>
                    Hyperparameters are selected through five-fold
                    validation on the training data.
                  </li>

                  <li>
                    The tuning objective is the mean F1-score
                    across the validation folds.
                  </li>

                  <li>
                    Final models are evaluated on the held-out test
                    set using accuracy, mean precision, mean recall,
                    and mean F1-score.
                  </li>

                  <li>
                    An 18 × 18 confusion matrix compares actual
                    and predicted Pokémon types.
                  </li>

                  <li>
                    K-Means additionally reports a silhouette score
                    to assess cluster quality.
                  </li>
                </ul>
              </article>

            </div>
          </section>

        </div>
      </main>
      <Footer/>

    </>
  );
}
