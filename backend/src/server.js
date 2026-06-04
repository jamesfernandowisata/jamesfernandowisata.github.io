import "dotenv/config";

import cors from "cors";
import express from "express";
import pg from "pg";

const { Pool } = pg;
const app = express();
const port = Number(process.env.PORT ?? 4000);
const allowedOrigins = (
  process.env.CORS_ORIGIN ??
  "http://localhost:3000,https://jamesfernandowisata.github.io"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : false,
});

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed by CORS"));
    },
  }),
);
app.use(express.json({ limit: "64kb" }));

function asText(value, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function asSortOrder(value) {
  const sortOrder = Number(value ?? 0);
  return Number.isFinite(sortOrder) ? sortOrder : 0;
}

function asBoolean(value, fallback = true) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return fallback;
}

function requireText(body, key) {
  const value = asText(body[key]);

  if (!value) {
    throw new Error(`${key} is required`);
  }

  return value;
}

function asyncRoute(handler) {
  return async (request, response, next) => {
    try {
      await handler(request, response);
    } catch (error) {
      next(error);
    }
  };
}

app.get(
  "/health",
  asyncRoute(async (_request, response) => {
    await pool.query("select 1");
    response.json({ database: "connected", ok: true });
  }),
);

app.get(
  "/api/games",
  asyncRoute(async (_request, response) => {
    const { rows } = await pool.query(`
      select
        id,
        title,
        href,
        status,
        description,
        sort_order as "sortOrder",
        created_at as "createdAt"
      from games
      order by sort_order asc, title asc
    `);

    response.json({ games: rows });
  }),
);

app.post(
  "/api/games",
  asyncRoute(async (request, response) => {
    const game = {
      description: asText(request.body.description),
      href: requireText(request.body, "href"),
      id: requireText(request.body, "id"),
      sortOrder: asSortOrder(request.body.sortOrder),
      status: asText(request.body.status, "Playable"),
      title: requireText(request.body, "title"),
    };

    const { rows } = await pool.query(
      `
        insert into games (id, title, href, status, description, sort_order)
        values ($1, $2, $3, $4, $5, $6)
        on conflict (id) do update set
          title = excluded.title,
          href = excluded.href,
          status = excluded.status,
          description = excluded.description,
          sort_order = excluded.sort_order
        returning
          id,
          title,
          href,
          status,
          description,
          sort_order as "sortOrder",
          created_at as "createdAt"
      `,
      [
        game.id,
        game.title,
        game.href,
        game.status,
        game.description,
        game.sortOrder,
      ],
    );

    response.status(201).json({ game: rows[0] });
  }),
);

app.get(
  "/api/backgrounds",
  asyncRoute(async (_request, response) => {
    const { rows } = await pool.query(`
      select
        id,
        label,
        image_url as "imageUrl",
        enabled,
        sort_order as "sortOrder",
        created_at as "createdAt"
      from backgrounds
      where enabled = true
      order by sort_order asc, label asc
    `);

    response.json({ backgrounds: rows });
  }),
);

app.post(
  "/api/backgrounds",
  asyncRoute(async (request, response) => {
    const background = {
      enabled: asBoolean(request.body.enabled),
      id: requireText(request.body, "id"),
      imageUrl: requireText(request.body, "imageUrl"),
      label: requireText(request.body, "label"),
      sortOrder: asSortOrder(request.body.sortOrder),
    };

    const { rows } = await pool.query(
      `
        insert into backgrounds (id, label, image_url, enabled, sort_order)
        values ($1, $2, $3, $4, $5)
        on conflict (id) do update set
          label = excluded.label,
          image_url = excluded.image_url,
          enabled = excluded.enabled,
          sort_order = excluded.sort_order
        returning
          id,
          label,
          image_url as "imageUrl",
          enabled,
          sort_order as "sortOrder",
          created_at as "createdAt"
      `,
      [
        background.id,
        background.label,
        background.imageUrl,
        background.enabled,
        background.sortOrder,
      ],
    );

    response.status(201).json({ background: rows[0] });
  }),
);

app.use((error, _request, response, _next) => {
  const message = error instanceof Error ? error.message : "Unexpected error";
  const status = message.endsWith("is required") ? 400 : 500;

  response.status(status).json({ error: message });
});

app.listen(port, () => {
  console.log(`Portfolio OS backend listening on port ${port}`);
});
