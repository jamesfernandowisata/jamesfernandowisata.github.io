# Portfolio OS Backend

This folder is a small PostgreSQL backend you can host separately from GitHub
Pages. GitHub Pages serves the portfolio frontend only, so API routes need a
backend host such as Render, Railway, Neon, Supabase, Fly, or another Node host.

## Setup

1. Create a PostgreSQL database.
2. Copy `.env.example` to `.env` and set `DATABASE_URL`.
3. Create the tables:

```bash
psql "$DATABASE_URL" -f schema.sql
```

4. Install and run:

```bash
npm install
npm run dev
```

Use `npm start` on the host.

## Environment

- `DATABASE_URL`: PostgreSQL connection string.
- `PORT`: API port. Defaults to `4000`.
- `CORS_ORIGIN`: Comma-separated frontend origins allowed to call the API.
- `PGSSL`: Set to `true` if your hosted database requires SSL.

## Endpoints

- `GET /health`: checks the database connection.
- `GET /api/games`: lists games from SQL.
- `POST /api/games`: creates or updates a game.
- `GET /api/backgrounds`: lists enabled backgrounds from SQL.
- `POST /api/backgrounds`: creates or updates a background.
