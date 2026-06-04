# jamesfernandowisata.github.io

Personal portfolio and web-experiments site for James Fernando, built as a
small desktop launcher.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

```bash
npm run lint
npm run build
```

The site is configured for static export so it can be deployed cleanly to GitHub Pages.

## Project Notes

- `src/app/page.tsx` mounts the portfolio desktop.
- `src/components/desktop.tsx` contains the launcher, windows, and project menu.
- Edit `stickerPool` in `src/components/desktop.tsx` to change the random draggable desktop pictures/words and their targets.
- `src/app/games/page.tsx` contains the `/games` shelf.
- `src/app/globals.css` contains the desktop visual system and responsive layout.
- `public/backgrounds/list.json` controls the backgrounds that are picked on first open.
- Add standalone games under `public/games/<game-name>/index.html`, then link them from `src/app/games/page.tsx`.
- `backend/` contains a PostgreSQL API starter for hosting dynamic games and backgrounds outside GitHub Pages.
