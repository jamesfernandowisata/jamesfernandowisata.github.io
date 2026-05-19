"use client";

import { useMemo, useState } from "react";

type WindowId = "profile" | "projects" | "games" | "notes";

type LauncherItem = {
  id: WindowId;
  label: string;
  shortcut: string;
};

const launcherItems: LauncherItem[] = [
  { id: "profile", label: "Profile", shortcut: "JF" },
  { id: "projects", label: "Projects", shortcut: "PX" },
  { id: "games", label: "Games", shortcut: "GM" },
  { id: "notes", label: "Notes", shortcut: "NT" },
];

const projects = [
  {
    title: "Portfolio OS",
    type: "Site",
    status: "Main",
    copy: "A desktop-style home for experiments, links, and tiny playable things.",
  },
  {
    title: "Birthday Gift",
    type: "Archive",
    status: "Saved",
    copy: "An older web toy kept as a little time capsule for future polish.",
  },
  {
    title: "Project Slot",
    type: "Template",
    status: "Ready",
    copy: "Drop the next mini app here and wire it into the launcher list.",
  },
];

const notes = [
  "Keep the homepage as the menu.",
  "Add experiments as apps, not separate lonely pages.",
  "Make every project feel touchable within two clicks.",
];

function nextTarget(current: number) {
  return (current * 7 + 5) % 16;
}

export default function Desktop() {
  const [activeWindow, setActiveWindow] = useState<WindowId>("profile");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(6);

  const activeItem = useMemo(
    () => launcherItems.find((item) => item.id === activeWindow),
    [activeWindow],
  );

  function openWindow(id: WindowId) {
    setActiveWindow(id);
    setIsMenuOpen(false);
  }

  function hitTarget(index: number) {
    if (index !== target) {
      return;
    }

    setScore((currentScore) => currentScore + 1);
    setTarget((currentTarget) => nextTarget(currentTarget));
  }

  return (
    <main className="desktop-shell" aria-label="James Fernando portfolio desktop">
      <section className="desktop-canvas" aria-label="Portfolio launcher">
        <div className="desktop-status">
          <span>James Fernando</span>
          <span>Portfolio OS</span>
        </div>

        <div className="desktop-icons" aria-label="Desktop shortcuts">
          {launcherItems.map((item) => (
            <button
              className="desktop-icon"
              key={item.id}
              onClick={() => openWindow(item.id)}
              type="button"
            >
              <span>{item.shortcut}</span>
              {item.label}
            </button>
          ))}
        </div>

        <article className={`desktop-window window-${activeWindow}`}>
          <header className="window-titlebar">
            <div>
              <span className="traffic-dot" />
              <span className="window-title">{activeItem?.label}</span>
            </div>
            <button
              aria-label="Close window"
              className="window-close"
              onClick={() => setActiveWindow("profile")}
              type="button"
            >
              X
            </button>
          </header>

          {activeWindow === "profile" && (
            <div className="window-body profile-window">
              <p className="eyebrow">Developer / creative web</p>
              <h1>James Fernando</h1>
              <p className="profile-lede">
                A small personal desktop for portfolio pieces, experiments, and
                games that deserve to be opened like little apps.
              </p>
              <div className="profile-actions">
                <button className="button-primary" onClick={() => openWindow("projects")} type="button">
                  Open projects
                </button>
                <button className="button-secondary" onClick={() => openWindow("games")} type="button">
                  Try game
                </button>
              </div>
            </div>
          )}

          {activeWindow === "projects" && (
            <div className="window-body projects-window">
              <div className="window-heading">
                <p className="eyebrow">Directory</p>
                <h2>Projects to open, remix, and expand.</h2>
              </div>
              <div className="project-grid">
                {projects.map((project) => (
                  <section className="project-tile" key={project.title}>
                    <div className="project-meta">
                      <span>{project.type}</span>
                      <span>{project.status}</span>
                    </div>
                    <h3>{project.title}</h3>
                    <p>{project.copy}</p>
                  </section>
                ))}
              </div>
            </div>
          )}

          {activeWindow === "games" && (
            <div className="window-body games-window">
              <div className="window-heading">
                <p className="eyebrow">Mini game</p>
                <h2>Signal grid</h2>
              </div>
              <div className="game-panel">
                <div className="game-controls">
                  <div className="game-score">
                    <span>Score</span>
                    <strong>{score.toString().padStart(2, "0")}</strong>
                  </div>
                  <button
                    className="button-secondary"
                    onClick={() => {
                      setScore(0);
                      setTarget(6);
                    }}
                    type="button"
                  >
                    Reset
                  </button>
                </div>
                <div className="signal-grid" aria-label="Signal grid game">
                  {Array.from({ length: 16 }, (_, index) => (
                    <button
                      aria-label={`Signal cell ${index + 1}`}
                      className={index === target ? "is-target" : ""}
                      key={index}
                      onClick={() => hitTarget(index)}
                      type="button"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeWindow === "notes" && (
            <div className="window-body notes-window">
              <p className="eyebrow">Build notes</p>
              <h2>How new apps fit in.</h2>
              <ul>
                {notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </article>

        <div className="dock" role="toolbar" aria-label="Desktop dock">
          <button
            aria-expanded={isMenuOpen}
            className="start-button"
            onClick={() => setIsMenuOpen((current) => !current)}
            type="button"
          >
            Menu
          </button>
          <div className="dock-apps">
            {launcherItems.map((item) => (
              <button
                className={item.id === activeWindow ? "is-active" : ""}
                key={item.id}
                onClick={() => openWindow(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {isMenuOpen && (
          <div className="start-menu">
            <p>Launch</p>
            {launcherItems.map((item) => (
              <button key={item.id} onClick={() => openWindow(item.id)} type="button">
                <span>{item.shortcut}</span>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
