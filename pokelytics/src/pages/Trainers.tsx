import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

const trainers = [
  {
    name: "Bealyn Olan",
    gif: "/pokelytics/gifs/squirtle.gif",
    gifAlt: "Squirtle",
    bio: "“Hey guys, did you know that in terms of human companionship, Squirtle is objectively the most huggable Pokémon? While their shell is likely too hard for most, they are capable of withdrawing into it, so they can set themselves to the perfect level of squishy for you.”",
    tasks: ["K-Nearest Neighbors Algorithm", "F1-Score", "Recall", "Precision", "Training Page"],
    favoriteType: "Water",
    favoritePokemon: "Squirtle",
  },
  {
    name: "Nathan Pabico",
    gif: "/pokelytics/gifs/aggron.gif",
    gifAlt: "Aggron",
    bio: "“Pokemon is not a cartoon. Did you really just go there? Pokémon? A \"cartoon\"? Cartoons are for kids. Things like Barney and Teletubbies. And don't try to tell me that Western cartoons can be made for adults. Pokémon (ポケットモンスター) is an anime (アニメ). Anime (Japanese for immersive visual storytelling) has better art, better writing, better plots, and is MUCH more complicated.”",
    tasks: ["Naive-Bayes Algorithm", "Confusion Matrices", "Pokédex Page"],
    favoriteType: "Steel",
    favoritePokemon: "Aggron",
  },
  {
    name: "Mark Erwin Pesino",
    gif: "/pokelytics/gifs/mudkip.gif",
    gifAlt: "Mudkip",
    bio: "“ I started the game on my GBA and when I picked my first pokemon, I chose Mudkip, but when I had to help the professor and fight off the zigzagoon, my mudkip was purple, not blue. Was this a glitch? I restarted the game and got a blue one but I'm just wondering if this has happened to anyone else.”",
    tasks: [
      "Data Preprocessing",
      "Algorithm and Data Pipeline",
      "Evaluation Framework",
      "Grid Search",
      "Home Page",
      "Team Page",
      "References",
    ],
    favoriteType: "Fairy",
    favoritePokemon: "Mudkip",
  },
  {
    name: "Juan Pablo Regala",
    gif: "/pokelytics/gifs/mimikyu.gif",
    gifAlt: "Mimikyu",
    bio: "“If Pokémon has a million fans, then I am one of them. If Pokémon has only one fan, then that is me. If Pokémon has no fans, then that means I am no longer on earth. If the world is against Pokémon, then I am against the world.”",
    tasks: ["K-Means Algorithm", "Results Visualization", "Confusion Matrix Visualization", "Battle Page"],
    favoriteType: "Ghost",
    favoritePokemon: "Mimikyu",
  },
];

export default function Trainers() {
  return (
    <>
      <NavBar color="poke-blue-dark"/>
      <main className="min-h-screen bg-white px-20 py-20">
        <div className="mx-auto max-w-7xl">
          <header className="mb-12">
            <h1 className="mt-3 font-luckiest text-5xl text-poke-blue md:text-7xl">
              The Trainers of Elite Four
            </h1>
            <p className="mt-4 max-w-5xl font-poppins text-lg leading-relaxed text-slate-700">
              Meet the Pokémon experts behind Pokélytics. Students from the
              University of the Philippines-Los Baños...
              <br /> and renowned members of the Elite Four.
            </p>
          </header>

          <section>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {trainers.map((t) => (
                <article
                  key={t.name}
                  className="rounded-2xl border-2 border-poke-blue-paler bg-linear-to-br from-poke-blue-pale to-poke-blue-paler p-6 text-white"
                >
                  <h3 className="font-poppins text-2xl font-bold">{t.name}</h3>

                  {t.gif && (
                    <div className="mt-4 flex h-48 items-center justify-center overflow-hidden rounded-xl">
                      <img
                        src={t.gif}
                        alt={t.gifAlt}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}

                  <p className="mt-4 font-poppins leading-relaxed">{t.bio}</p>

                  <div className="mt-4 font-poppins">
                    <h2 className="text-md font-semibold uppercase tracking-wider text-white">
                      Tasks Assigned
                    </h2>
                    <ul className="mt-2.5 flex flex-wrap gap-2">
                      {t.tasks.map((task) => (
                        <li
                          key={task}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-md font-medium text-slate-700"
                        >
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <ul className="mt-4 font-poppins text-md">
                    <li className="flex items-center justify-between py-2.5">
                      <span className="font-medium text-white">
                        Favorite Pokémon
                      </span>
                      <span className="font-semibold text-white">
                        {t.favoritePokemon}
                      </span>
                    </li>
                    <li className="flex items-center justify-between py-2.5">
                      <span className="font-medium text-white">
                        Favorite Type
                      </span>
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-md font-semibold text-poke-blue-dark">
                        {t.favoriteType}
                      </span>
                    </li>
                  </ul>
                </article>
              ))}
            </div>
          </section>
        </div>
        
      </main>
      <Footer/>

    </>
  );
}