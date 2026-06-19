create table if not exists games (
  id text primary key,
  title text not null,
  href text not null,
  status text not null default 'Playable',
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists backgrounds (
  id text primary key,
  label text not null,
  image_url text not null,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

insert into games (id, title, href, status, description, sort_order)
values (
  'ping-pong',
  'Ping Pong',
  '/games/ping-pong/index.html',
  'Playable',
  'A simple canvas paddle game.',
  10
)
on conflict (id) do nothing;
insert into games (id, title, href, status, description, sort_order)
values (
  'maze',
  'maze',
  '/games/mazeindex.html',
  'Playable',
  'Maze Maxxing.',
  10
)
on conflict (id) do nothing;

insert into backgrounds (id, label, image_url, sort_order)
values
  ('bg-contents', 'Sketch contents', '/backgrounds/bg-contents.jpg', 10),
  ('bg-wallpaper', 'Wallpaper', '/backgrounds/bg-wallpaper.jpg', 20)
on conflict (id) do nothing;
