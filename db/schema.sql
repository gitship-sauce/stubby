create table if not exists links (
  code text primary key,
  url text not null,
  clicks integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists users (
  id bigint generated always as identity primary key,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

-- Only a hash of each token is stored, so a copy of the database can't log anyone in.
create table if not exists sessions (
  token_hash text primary key,
  user_id bigint not null references users (id) on delete cascade,
  expires_at timestamptz not null
);

create table if not exists password_resets (
  token_hash text primary key,
  user_id bigint not null references users (id) on delete cascade,
  expires_at timestamptz not null,
  used_at timestamptz
);

alter table links add column if not exists user_id bigint references users (id) on delete set null;
create index if not exists links_user_id on links (user_id);

-- One row per forgot-password request, so a stranger can't try thousands of emails.
create table if not exists reset_tries (
  key text not null,
  at timestamptz not null default now()
);
create index if not exists reset_tries_key_at on reset_tries (key, at);

-- A sign-up waiting for its email link. The password is already hashed; the account is made when the link is used.
create table if not exists signup_tokens (
  token_hash text primary key,
  email text not null,
  password_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz
);
