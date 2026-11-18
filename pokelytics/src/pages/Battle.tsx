
import { useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const algorithms = [
  {
    name: "KNN",
    image: "knn_confusion_matrix.png",
    discussion: "KNN emerged as the best-performing algorithm, achieving an accuracy of 48.38% and an F1-score of 40.61%. Its performance suggests that Pokémon sharing similar attributes often belong to the same type. However, overlapping characteristics among different types still resulted in misclassifications.",
    matrixAnalysis: "Predictions were scattered across multiple Pokémon types. Eight Normal Pokémon were incorrectly classified as Rock, while eight Grass Pokémon were classified as Electric. This distribution suggests that feature-based clusters did not consistently align with actual Pokémon types.",
  },
  {
    name: "K-Means",
    image: "kmeans_confusion_matrix.png",
    discussion: "K-Means recorded the lowest performance, with an accuracy of 13.64% and an F1-score of 10.10%. As an unsupervised learning algorithm, it groups Pokémon according to feature similarity rather than predefined type labels. Consequently, the resulting clusters did not consistently correspond to actual Pokémon types.",
    matrixAnalysis: "Predictions were scattered across multiple Pokémon types. Eight Normal Pokémon were incorrectly classified as Rock, while eight Grass Pokémon were classified as Electric. This distribution suggests that feature-based clusters did not consistently align with actual Pokémon types.",
  },
  {
    name: "Naive Bayes",
    image: "naive_bayes_confusion_matrix.png",
    discussion: "Naive Bayes achieved an accuracy of 40.58% and an F1-score of 32.94%, placing second among the evaluated algorithms. Although it successfully identified several Pokémon types, its assumption of conditional independence between features may have limited its classification performance.",
    matrixAnalysis: "Naive Bayes correctly classified 24 Water, 19 Grass, and 16 Bug Pokémon. However, several misclassifications occurred, including five Electric Pokémon predicted as Steel. These results demonstrate its ability to distinguish some types while highlighting difficulties with overlapping attributes.",
  },
];

const resultsPath = `${import.meta.env.BASE_URL}results/`;

export default function Battle() {
  const [selected, setSelected] = useState(0);

  return (
    <>
      <NavBar />

      <main className="font-poppins bg-slate-50">

        {/* HERO SECTION */}
        <section className="bg-poke-red-dark-pale px-8 py-24 text-center text-white">

          <h1 className="font-luckiest text-6xl md:text-8xl">
            The Poké Battle Arena
          </h1>

          <p className="mt-4 text-xl">
            How well can three algorithms perform under one classification challenge?
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {algorithms.map((algorithm) => (
              <span
                key={algorithm.name}
                className="rounded-full bg-white/15 px-5 py-2 font-semibold"
              >
                {algorithm.name}
              </span>
            ))}
          </div>

        </section>

        {/* RESULTS SECTION */}
        <section className="mx-auto max-w-6xl px-8 py-16">

          <h2 className="font-luckiest text-5xl text-poke-red-pale">
            Battle Results
          </h2>

          <p className="mt-4 text-slate-600">
            Comparing the performance of KNN, K-Means,
            and Naive Bayes in predicting Pokémon types.
          </p>

          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

            <h3 className="text-2xl font-bold text-poke-blue-dark">
              Model Performance Comparison
            </h3>

            <img
              src={`${resultsPath}model_comparison.png`}
              alt="Accuracy, precision, recall, and F1 comparison"
              className="mx-auto mt-6 w-full object-contain"
            />

          </div>

        </section>

        {/* CONFUSION MATRICES */}
        <section className="mx-auto max-w-6xl px-8 py-12">

          <h2 className="font-luckiest text-5xl text-poke-red-pale">
            Confusion Matrices
          </h2>

          <p className="mt-4 text-slate-600">
            Explore how each algorithm classified the
            18 Pokémon types.
          </p>

          {/* Algorithm selector */}
          <div className="mt-8 flex flex-wrap gap-3">

            {algorithms.map((algorithm, index) => (

              <button
                key={algorithm.name}
                type="button"
                onClick={() => setSelected(index)}
                aria-pressed={selected === index}
                className={`cursor-pointer rounded-full px-6 py-3 font-semibold transition-colors ${
                  selected === index
                    ? "bg-poke-blue-dark text-white"
                    : "bg-white text-poke-blue-dark hover:bg-blue-100"
                }`}
              >
                {algorithm.name}
              </button>

            ))}

          </div>

          {/* Selected confusion matrix */}
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

            <h3 className="text-center text-2xl font-bold text-poke-blue-dark">
              {algorithms[selected].name}
            </h3>

            <img
              src={`${resultsPath}${algorithms[selected].image}`}
              alt={`${algorithms[selected].name} confusion matrix`}
              className="mx-auto mt-4 w-full max-w-4xl"
            />

            {/* Matrix Explanation */}
            <div className="mt-8 grid gap-6 md:grid-cols-2">

              {/* How to Read the Matrix */}
              <div className="rounded-xl bg-slate-100 p-6">

                <h4 className="text-lg font-bold text-poke-blue-dark">
                  How to Read the Matrix
                </h4>

                <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-slate-600">

                  <li>
                    <strong>Rows:</strong> Represent the actual Pokémon types.
                  </li>

                  <li>
                    <strong>Columns:</strong> Represent the predicted Pokémon types.
                  </li>

                  <li>
                    <strong>Diagonal cells:</strong> Represent correct classifications.
                  </li>

                  <li>
                    <strong>Off-diagonal cells:</strong> Represent incorrect classifications.
                  </li>

                  <li>
                    <strong>Color intensity:</strong> Darker blue indicates a higher number
                    of Pokémon within the displayed matrix.
                  </li>

                </ul>

              </div>

              {/* Understanding the Results */}
              <div className="rounded-xl bg-blue-50 p-6">

                <h4 className="text-lg font-bold text-poke-blue-dark">
                  Understanding the Results
                </h4>

                <p className="mt-2 text-sm font-semibold text-poke-blue-paler">
                  {algorithms[selected].name}
                </p>

                <p
                  aria-live="polite"
                  className="mt-4 text-sm leading-relaxed text-slate-600"
                >
                  {algorithms[selected].matrixAnalysis}
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* DISCUSSION SECTION */}
        <section className="mx-auto max-w-6xl px-8 py-16">

          <h2 className="font-luckiest text-5xl text-poke-red-pale">
            Discussion
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">

            {algorithms.map((algorithm) => (

              <article
                key={algorithm.name}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-poke-blue-dark">
                  {algorithm.name}
                </h3>

                <p className="mt-4 leading-relaxed text-slate-600">
                  {algorithm.discussion}
                </p>
              </article>

            ))}

          </div>

          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

            <h3 className="text-2xl font-bold text-poke-blue-dark">
              Limitations and Possible Improvements
            </h3>

            <p className="mt-4 leading-relaxed text-slate-600">
              The performance of the classifiers was limited by overlapping Pokémon characteristics, unequal representation of the 18 types, and the complexity of Pokémon type assignments. Attributes such as combat statistics and physical characteristics may not fully capture the elemental or thematic factors that determine a Pokémon's type. Future improvements could include more informative features, balanced training data, alternative distance measures, and additional hyperparameter optimization. Evaluating more advanced classification algorithms may also improve predictive performance.
            </p>

          </div>

           <div className="mt-8 rounded-2xl bg-blue-50 p-6 shadow-sm">

            <h3 className="text-2xl font-bold text-poke-blue-dark">
                            The Verdict

            </h3>

            <p className="mt-4 leading-relaxed text-slate-600">
              Among the three evaluated algorithms, KNN demonstrated the strongest classification performance, followed by Naive Bayes and K-Means. The results indicate that Pokémon types can be partially predicted using their measurable attributes, although these features alone are insufficient for consistently accurate classification. Ultimately, Pokélytics demonstrates the potential of machine learning in Pokémon classification while highlighting opportunities for further improvement.
            </p>

          </div>


        </section>

    


      </main>
      <Footer/>
    </>
  );
}
