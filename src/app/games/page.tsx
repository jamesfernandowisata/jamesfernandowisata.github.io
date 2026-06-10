import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";

const games = [
  {
    title: "Ping Pong",
    href: "/games/ping-pong/index.html",
    status: "Playable",
    copy: "A simple canvas paddle game you can use as the first file-based game.",
  },
];

export default function GamesPage() {
  return (
    <main className="games-page">
      <section className="games-shell" aria-labelledby="games-title">
        <div className="games-topbar">
          <Link className="back-link" href="/">
            Back to desktop
          </Link>
          <ThemeToggle />
        </div>

        <div className="games-heading">
          <p className="eyebrow">Game shelf</p>
          <h1 id="games-title">Games</h1>
          <p>A shelf for small experiments and file-based games.</p>
        </div>

        <div className="game-card-grid">
          {games.map((game) => (
            <a className="game-card" href={game.href} key={game.title}>
              <span>{game.status}</span>
              <h2>{game.title}</h2>
              <p>{game.copy}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
