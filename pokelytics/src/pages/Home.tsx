import NavBar from "../components/NavBar";

const methods = ["KNN", "Naive Bayes", "K-Means"];

// Pokémon shown in the carousel (id = Pokédex number)
const showcase = [
  { id: 25, name: "Pikachu" },
  { id: 1, name: "Bulbasaur" },
  { id: 4, name: "Charmander" },
  { id: 7, name: "Squirtle" },
  { id: 39, name: "Jigglypuff" },
  { id: 94, name: "Gengar" },
  { id: 133, name: "Eevee" },
  { id: 143, name: "Snorlax" },
  { id: 150, name: "Mewtwo" },
  { id: 448, name: "Lucario" },
  { id: 658, name: "Greninja" },
];

const artwork = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export default function Home() {
  const scrollToProblem = () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    document.getElementById("problem")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <>
      <NavBar />

      {/* Banner: stays pinned under the navbar while the next section slides over it */}
      <section className="sticky top-16 z-0 flex h-[calc(100vh-4rem)] w-full items-center overflow-hidden">
        {/* Full-color image fills the whole banner */}
        <img
          src={`${import.meta.env.BASE_URL}pokelytics.gif`}
          alt="Pokémon plush animation"
          className="absolute inset-0 h-full w-full object-cover object-center saturate-125"
        />

        {/* Red scrim: keeps the text readable on any frame of the GIF */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-poke-red-dark-pale/75 md:bg-transparent md:bg-linear-to-r md:from-poke-red-dark-pale/95 md:via-poke-red-dark-pale/55 md:to-transparent"
        />

        {/* Text sits on top */}
        <div className="relative z-10 mx-8 md:mx-30">
          <h1 className="font-luckiest text-6xl leading-none text-white [text-shadow:0_6px_0_rgb(0_0_0/0.25)] md:text-9xl">
            Pokélytics
          </h1>

          <p className="mt-4 font-poppins text-xl font-medium text-white md:text-3xl">
            State-of-the-art AI Pokédex,
            <br />
            built by trainers for trainers!
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3 font-poppins">
            <span className="text-base font-medium text-white md:text-lg">
              Powered by
            </span>

            <ul className="flex flex-wrap gap-3" aria-label="Algorithms used">
              {methods.map((method) => (
                <li
                  key={method}
                  className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white ring-1 ring-white/40 backdrop-blur-sm md:text-base"
                >
                  {method}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Scroll cue */}
        <button
          type="button"
          onClick={scrollToProblem}
          aria-label="Scroll to problem statement"
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce cursor-pointer text-white motion-reduce:animate-none"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </section>

      {/* Problem statement: scrolls up and covers the banner */}
      <section
        id="problem"
        className="relative z-10 min-h-screen scroll-mt-16 rounded-t-3xl bg-white px-8 py-20 shadow-[0_-16px_40px_rgba(0,0,0,0.25)]"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="font-luckiest text-5xl text-poke-red-pale md:text-6xl">
            Why Pokelytics?
          </h2>

   {/* Pokémon carousel*/}

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {/* Problem */}
                <div className="min-h-64 rounded-2xl border-2 border-poke-red-paler bg-linear-to-br from-poke-red-pale to-poke-red-paler p-6">
                    <h3 className="font-poppins text-2xl font-bold text-white">
                The Problem Statement
                </h3>
                <p className="mt-4 font-poppins text-base leading-relaxed text-white">
                Labeling something from its measurable traits is a problem far bigger
                than Pokémon. Biologists do it when classifying a newly found species,
                and Pokémon game developers may struggle with deciding a Pokémon’s type
                despite having decided on their attributes. Can an algorithm predict a
                Pokémon’s type from its stats and traits, and can it uncover patterns
                that may give insights to how a Pokémon is designed?
                </p>
            </div>


            {/* Motivation */}
            <div className="min-h-64 rounded-2xl border-2 border-poke-red-paler bg-linear-to-br from-poke-red-pale to-poke-red-paler p-6">
              <h3 className="font-poppins text-2xl font-bold text-white">
                Our Motivation
              </h3>
              <p className="mt-4 font-poppins text-base leading-relaxed text-white">
                We believe that all Pokémon matter, and yet every newly discovered
                Pokémon raises the same question: what type is it? Type decides how a
                Pokémon fights, which attacks it resists, and which rivals it should
                avoid, so a wrong guess can cost a trainer the match. Meanwhile, the
                Pokédex keeps growing, and sorting it by hand gets harder with every
                new entry. We hope that Pokélytics will be able to solve the classification
                needs of modern Pokémon trainers!
              </p>
            </div>

        <div
            className="md:col-span-2 overflow-hidden py-4 motion-reduce:overflow-x-auto mask-[linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]"
            aria-label="Pokémon showcase"
          >
            <ul className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
              {[...showcase, ...showcase].map((pokemon, i) => {
                const isCopy = i >= showcase.length;
                return (
                  <li
                    key={`${pokemon.id}-${i}`}
                    aria-hidden={isCopy}
                    className={`mx-3 flex w-40 shrink-0 flex-col items-center bg-white px-3 pt-3 pb-4 transition-transform duration-300 ease-out hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100 ${
                      isCopy ? "motion-reduce:hidden" : ""
                    }`}
                  >
                    <img
                      src={artwork(pokemon.id)}
                      alt={isCopy ? "" : pokemon.name}
                      width={475}
                      height={475}
                      decoding="async"
                      className="h-24 w-24 object-contain"
                    />

                  </li>
                );
              })}
            </ul>
          </div>
 

            {/* Objectives */}
            <div className="md:col-span-2 min-h-64 rounded-2xl border-2 border-poke-blue-paler bg-linear-to-br from-poke-blue-pale to-poke-blue-paler p-6">
              <h3 className="font-poppins text-2xl font-bold text-white">
                Objectives
              </h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 font-poppins text-base leading-relaxed text-white">
                <li>
                  Gather a comprehensive Pokémon dataset with the features necessary for training.
                </li>
                <li>
                  Train Naive Bayes, K-Nearest Neighbors, and K-Means Clustering (with most common type labeling) to predict Pokémon type.
                </li>
                <li>
                  Compare the methods using Accuracy, F1 score, and Confusion Matrix.
                </li>
              </ul>
            </div>
          </div>

      


        </div>
      </section>
    </>
  );
}