import { Link, useLocation, useNavigate } from "react-router-dom";

type NavItem = {
  label: string;
  path: string;
};

const leftLinks: NavItem[] = [
  { label: "Pokédex", path: "/pokedex" },
  { label: "Training", path: "/training" },
  { label: "Battle", path: "/battle" },
];

const rightLinks: NavItem[] = [
  { label: "Trainers", path: "/trainers" },
];

const colorStyles = {
  "poke-red-dark-pale": {
    bg: "bg-poke-red-dark-pale",
    text: "text-poke-red-dark-pale",
  },
  "poke-blue-dark": {
    bg: "bg-poke-blue-dark",
    text: "text-poke-blue-dark",
  },
  // add the other colors you use
} as const;

type NavColor = keyof typeof colorStyles;

interface NavBarProps {
  color?: NavColor;
}

export default function NavBar({ color = "poke-red-dark-pale" }: NavBarProps) {
  const styles = colorStyles[color];
  const navigate = useNavigate();
  const { pathname } = useLocation();

const renderLink = (link: NavItem, extra = "") => {
  const active = pathname === link.path;

  return (
    <button
      key={link.path}
      type="button"
      onClick={() => navigate(link.path)}
      aria-current={active ? "page" : undefined}
      data-label={link.label}
      className={`cursor-pointer rounded-full px-4 py-1.5 text-base transition-all duration-200 ease-out after:invisible after:block after:h-0 after:overflow-hidden after:font-extrabold after:content-[attr(data-label)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none ${
        active
          ? `bg-white font-extrabold  ${styles.text} shadow-md`
          : "font-medium text-white/85 hover:bg-white/15 hover:text-white"
      } ${extra}`}
    >
      {link.label}
    </button>
  );
};

  return (
    <nav className={`sticky top-0 z-50 flex h-16 w-full items-center justify-between ${styles.bg} px-8 font-poppins`}>
      {/* Left side */}
      <div className="flex items-center gap-3 text-white">
        <Link
          to="/"
          aria-label="Home"
          className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white mr-5"
        >
          <img
            src={`${import.meta.env.BASE_URL}pokemon.svg`}
            alt=""
            className="h-7 w-7"
          />
        </Link>

        {leftLinks.map((link) => renderLink(link))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 text-white">
        {rightLinks.map((link) => renderLink(link, "font-bold"))}
      </div>
    </nav>
  );
}