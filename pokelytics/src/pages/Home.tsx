import NavBar from "../components/NavBar";
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
const methods = ["KNN", "Naive Bayes", "K-Means"];

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
            Problem Statement
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {/* Problem */}
            <div className="min-h-64 rounded-2xl border-2 border-dashed border-poke-red-dark-pale/30 p-6">
              <h3 className="font-poppins text-2xl font-bold text-poke-red-dark-pale">
                The problem
              </h3>
              {/* TODO: add problem statement */}
            </div>

            {/* Motivation */}
            <div className="min-h-64 rounded-2xl border-2 border-dashed border-poke-red-dark-pale/30 p-6">
              <h3 className="font-poppins text-2xl font-bold text-poke-red-dark-pale">
                Our motivation
              </h3>
              {/* TODO: add motivation */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}