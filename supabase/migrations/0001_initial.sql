create table agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  vector_fingerprint vector(1536), -- identity fingerprint
  skills jsonb default '{}'::jsonb,
  current_state text,
  created_at timestamptz default now()
);

create table conversations (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agents(id),
  participant text,
  content text,
  metadata jsonb,
  timestamp timestamptz default now()
);

create table embeddings (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agents(id),
  source text,
  content text,
  embedding vector(1536), -- Ada-002 or similar
  metadata jsonb,
  created_at timestamptz default now()
);

create index on embeddings using hnsw (embedding vector_ip_ops)
  with (m = 16, ef_construction = 64);

create table commands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  script text,
  owner_agent_id uuid references agents(id),
  metadata jsonb,
  created_at timestamptz default now()
);

create table logs (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agents(id),
  event text not null,
  detail jsonb,
  level text default 'info',
  created_at timestamptz default now()
);
