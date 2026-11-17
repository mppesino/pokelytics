import NavBar from "../components/NavBar";

export default function Training() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-white px-8 py-20">
        <div className="mx-auto max-w-6xl">
          <header className="mb-12">
            <p className="font-poppins text-sm font-semibold uppercase tracking-[0.25em] text-poke-blue-pale">
              Model documentation
            </p>
            <h1 className="mt-3 font-luckiest text-5xl text-poke-red-pale md:text-7xl">
              Training
            </h1>
            <p className="mt-4 max-w-3xl font-poppins text-lg leading-relaxed text-slate-700">
              Pokelytics compares three algorithms that predict a Pokemon&apos;s
              primary type from its recorded traits and statistics.
            </p>
          </header>

          <section aria-labelledby="methods-heading">
            <h2
              id="methods-heading"
              className="font-luckiest text-4xl text-poke-red-pale"
            >
              Methods
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <article className="rounded-2xl border-2 border-poke-red-paler bg-linear-to-br from-poke-red-pale to-poke-red-paler p-6 text-white">
                <h3 className="font-poppins text-2xl font-bold">
                  K-Nearest Neighbors
                </h3>
                <p className="mt-4 font-poppins leading-relaxed">
                  KNN compares a test Pokemon with every training Pokemon
                  using Minkowski distance. The predicted type is the most
                  common type among its nearest neighbors. Pokelytics uses the
                  one-hot ability, shape, and color features, with Manhattan
                  distance.
                </p>
                <p className="mt-4 font-poppins text-sm font-semibold">
                  Final settings: k = 1, p = 1
                </p>
              </article>

              <article className="rounded-2xl border-2 border-poke-blue-paler bg-linear-to-br from-poke-blue-pale to-poke-blue-paler p-6 text-white">
                <h3 className="font-poppins text-2xl font-bold">
                  Naive Bayes
                </h3>
                <p className="mt-4 font-poppins leading-relaxed">
                  Naive Bayes calculates the probability of each type from the
                  Pokemon&apos;s categorical traits. It combines the class prior
                  with the conditional probability of each observed trait, then
                  selects the type with the highest posterior probability.
                  Laplace smoothing prevents unseen traits from producing a
                  zero probability.
                </p>
                <p className="mt-4 font-poppins text-sm font-semibold">
                  Final setting: smoothing factor = 0.1
                </p>
              </article>

              <article className="rounded-2xl border-2 border-poke-red-paler bg-linear-to-br from-poke-red-paler to-poke-red-pale p-6 text-white">
                <h3 className="font-poppins text-2xl font-bold">K-Means</h3>
                <p className="mt-4 font-poppins leading-relaxed">
                  K-Means groups Pokemon by similarity in their numeric
                  features. It repeatedly assigns each Pokemon to the nearest
                  centroid and moves each centroid to its group&apos;s mean. Each
                  cluster receives the most common primary type among its
                  training members, which is then used for prediction.
                </p>
                <p className="mt-4 font-poppins text-sm font-semibold">
                  Final settings: k = 108 clusters, maximum 100 iterations
                </p>
              </article>
            </div>
          </section>

          <section
            aria-labelledby="setup-heading"
            className="mt-16 rounded-2xl bg-slate-50 p-6 md:p-8"
          >
            <h2
              id="setup-heading"
              className="font-luckiest text-4xl text-poke-red-pale"
            >
              Experimental Setup
            </h2>
            <div className="mt-6 grid gap-8 font-poppins text-slate-700 md:grid-cols-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Data and preprocessing
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
                  <li>The dataset is divided into 70% training and 30% testing data.</li>
                  <li>
                    Naive Bayes uses categorical trait values. KNN uses
                    one-hot encoded ability, shape, and color features.
                  </li>
                  <li>
                    K-Means uses numeric statistics and standardizes each
                    feature using training-set mean and standard deviation.
                  </li>
                  <li>Our target is to determine the the Pokemon&apos;s primary type given its features.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Tuning and evaluation
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
                  <li>
                    Hyperparameters are selected through five-fold validation
                    on the training data.
                  </li>
                  <li>
                    The tuning objective is the mean F1-score across the
                    validation folds.
                  </li>
                  <li>
                    Final models are evaluated on the held-out test set using
                    accuracy, mean precision, mean recall, and mean F1-score.
                  </li>
                  <li>
                    An 18 × 18 confusion matrix shows actual versus predicted
                    Pokemon types. K-Means also reports a training silhouette
                    score.
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

