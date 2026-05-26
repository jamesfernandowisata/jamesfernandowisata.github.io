"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type WindowId = "profile" | "projects" | "notes";
type LauncherId = WindowId | "games";
type StickerKind = "picture" | "word";
type StickerTarget =
  | { type: "launcher"; id: LauncherId }
  | { type: "route"; href: string };

type LauncherItem = {
  id: LauncherId;
  label: string;
  shortcut: string;
};

type StickerTemplate = {
  id: string;
  kind: StickerKind;
  label: string;
  caption: string;
  target: StickerTarget;
  image?: string;
};

type DesktopSticker = StickerTemplate & {
  x: number;
  y: number;
};

type DragState =
  | {
      id: "window";
      moved: boolean;
      originX: number;
      originY: number;
      pointerId: number;
      startX: number;
      startY: number;
    }
  | {
      id: string;
      moved: boolean;
      originX: number;
      originY: number;
      pointerId: number;
      startX: number;
      startY: number;
    };

const launcherItems: LauncherItem[] = [
  { id: "profile", label: "Profile", shortcut: "JF" },
  { id: "projects", label: "Projects", shortcut: "PX" },
  { id: "games", label: "Games", shortcut: "GM" },
  { id: "notes", label: "Notes", shortcut: "NT" },
];

const stickerPool: StickerTemplate[] = [
  {
    id: "ping-pong-picture",
    kind: "picture",
    label: "Ping Pong",
    caption: "Open games",
    image: "/bg_contents_pc.jpg",
    target: { type: "route", href: "/games/" },
  },
  {
    id: "games-word",
    kind: "word",
    label: "PLAY",
    caption: "Game shelf",
    target: { type: "launcher", id: "games" },
  },
  {
    id: "projects-word",
    kind: "word",
    label: "BUILD",
    caption: "Projects",
    target: { type: "launcher", id: "projects" },
  },
  {
    id: "notes-picture",
    kind: "picture",
    label: "Notes",
    caption: "Open notes",
    target: { type: "launcher", id: "notes" },
  },
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

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function randomBetween(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

export default function Desktop() {
  const router = useRouter();
  const canvasRef = useRef<HTMLElement>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const [activeWindow, setActiveWindow] = useState<WindowId>("profile");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [stickers, setStickers] = useState<DesktopSticker[]>([]);
  const [windowOffset, setWindowOffset] = useState({ x: 0, y: 0 });

  const activeItem = useMemo(
    () => launcherItems.find((item) => item.id === activeWindow),
    [activeWindow],
  );

  useEffect(() => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const width = rect?.width ?? window.innerWidth;
    const height = rect?.height ?? window.innerHeight;
    const count = randomBetween(1, 3);
    const shuffled = [...stickerPool].sort(() => Math.random() - 0.5);

    setStickers(
      shuffled.slice(0, count).map((sticker, index) => ({
        ...sticker,
        x: randomBetween(132, Math.max(160, width - 210)),
        y: randomBetween(74 + index * 38, Math.max(150, height - 190)),
      })),
    );
  }, []);

  function openLauncher(id: LauncherId) {
    setIsMenuOpen(false);

    if (id === "games") {
      router.push("/games/");
      return;
    }

    setActiveWindow(id);
  }

  function openSticker(sticker: DesktopSticker) {
    if (sticker.target.type === "route") {
      router.push(sticker.target.href);
      return;
    }

    openLauncher(sticker.target.id);
  }

  function beginWindowDrag(event: React.PointerEvent<HTMLElement>) {
    if (event.button !== 0) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      id: "window",
      moved: false,
      originX: windowOffset.x,
      originY: windowOffset.y,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };
  }

  function beginStickerDrag(
    event: React.PointerEvent<HTMLButtonElement>,
    sticker: DesktopSticker,
  ) {
    if (event.button !== 0) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      id: sticker.id,
      moved: false,
      originX: sticker.x,
      originY: sticker.y,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };
  }

  function moveDrag(event: React.PointerEvent<HTMLElement>) {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;
    const moved = Math.abs(deltaX) + Math.abs(deltaY) > 4;
    dragState.moved = dragState.moved || moved;

    if (dragState.id === "window") {
      setWindowOffset({
        x: dragState.originX + deltaX,
        y: dragState.originY + deltaY,
      });
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    const maxX = Math.max(24, (rect?.width ?? window.innerWidth) - 160);
    const maxY = Math.max(64, (rect?.height ?? window.innerHeight) - 150);

    setStickers((currentStickers) =>
      currentStickers.map((sticker) =>
        sticker.id === dragState.id
          ? {
              ...sticker,
              x: clamp(dragState.originX + deltaX, 12, maxX),
              y: clamp(dragState.originY + deltaY, 52, maxY),
            }
          : sticker,
      ),
    );
  }

  function endDrag(event: React.PointerEvent<HTMLElement>) {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    suppressClickRef.current = dragState.moved;
    dragStateRef.current = null;

    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  }

  return (
    <main className="desktop-shell" aria-label="James Fernando portfolio desktop">
      <section
        className="desktop-canvas"
        ref={canvasRef}
        aria-label="Portfolio launcher"
        onPointerCancel={endDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
      >
        <div className="desktop-status">
          <span>James Fernando</span>
          <span>Portfolio OS</span>
        </div>

        <div className="desktop-icons" aria-label="Desktop shortcuts">
          {launcherItems.map((item) => (
            <button
              className="desktop-icon"
              key={item.id}
              onClick={() => openLauncher(item.id)}
              type="button"
            >
              <span>{item.shortcut}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="desktop-sticker-layer" aria-label="Random desktop links">
          {stickers.map((sticker) => (
            <button
              className={`desktop-sticker is-${sticker.kind}`}
              key={sticker.id}
              onClick={() => {
                if (suppressClickRef.current) {
                  return;
                }

                openSticker(sticker);
              }}
              onPointerCancel={endDrag}
              onPointerDown={(event) => beginStickerDrag(event, sticker)}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              style={{ left: sticker.x, top: sticker.y }}
              type="button"
            >
              {sticker.kind === "picture" && (
                <span
                  className="sticker-picture"
                  style={{
                    backgroundImage: sticker.image
                      ? `url(${sticker.image})`
                      : undefined,
                  }}
                />
              )}
              <strong>{sticker.label}</strong>
              <small>{sticker.caption}</small>
            </button>
          ))}
        </div>

        <article
          className={`desktop-window window-${activeWindow}`}
          style={{
            transform: `translate(${windowOffset.x}px, ${windowOffset.y}px)`,
          }}
        >
          <header
            className="window-titlebar"
            onPointerCancel={endDrag}
            onPointerDown={beginWindowDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
          >
            <div>
              <span className="traffic-dot" />
              <span className="window-title">{activeItem?.label}</span>
            </div>
            <button
              aria-label="Close window"
              className="window-close"
              onClick={() => setActiveWindow("profile")}
              onPointerDown={(event) => event.stopPropagation()}
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
                <button
                  className="button-primary"
                  onClick={() => openLauncher("projects")}
                  type="button"
                >
                  Open projects
                </button>
                <button
                  className="button-secondary"
                  onClick={() => openLauncher("games")}
                  type="button"
                >
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
                onClick={() => openLauncher(item.id)}
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
              <button
                key={item.id}
                onClick={() => openLauncher(item.id)}
                type="button"
              >
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
