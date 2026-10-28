create table if not exists links (
  code text primary key,
  url text not null,
  clicks integer not null default 0,
  created_at timestamptz not null default now()
);
