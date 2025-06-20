/*
  # USAi Core Schema Migration

  1. New Tables (if not exists)
    - `agents` - Core agent registry with vector fingerprints and skills
    - `conversations` - Threaded dialogues with metadata
    - `embeddings` - Vector storage with HNSW indexing for semantic search
    - `commands` - Reusable agent behaviors and scripts
    - `logs` - System telemetry and audit trails

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to manage their own data

  3. Indexes
    - HNSW vector index on embeddings for fast similarity search
    - Standard indexes on foreign keys and timestamps
*/

-- Enable pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Create agents table if it doesn't exist
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  vector_fingerprint vector(1536), -- identity fingerprint
  skills jsonb DEFAULT '{}'::jsonb,
  current_state text DEFAULT 'idle',
  user_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz DEFAULT now()
);

-- Create conversations table if it doesn't exist
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  participant text NOT NULL,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  timestamp timestamptz DEFAULT now()
);

-- Create embeddings table if it doesn't exist
CREATE TABLE IF NOT EXISTS embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  source text,
  content text NOT NULL,
  embedding vector(1536), -- Ada-002 or similar
  metadata jsonb DEFAULT '{}'::jsonb,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz DEFAULT now()
);

-- Create commands table if it doesn't exist
CREATE TABLE IF NOT EXISTS commands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  script text NOT NULL,
  owner_agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  metadata jsonb DEFAULT '{}'::jsonb,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz DEFAULT now()
);

-- Create logs table if it doesn't exist (but check if it conflicts with existing)
DO $$
BEGIN
  -- Check if logs table exists and has different structure
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'logs' AND table_schema = 'public'
  ) THEN
    CREATE TABLE logs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
      event text NOT NULL,
      detail jsonb DEFAULT '{}'::jsonb,
      level text DEFAULT 'info',
      user_id uuid NOT NULL DEFAULT auth.uid(),
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Add user_id column to existing tables if they don't have it
DO $$
BEGIN
  -- Add user_id to agents if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agents' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE agents ADD COLUMN user_id uuid NOT NULL DEFAULT auth.uid();
  END IF;

  -- Add user_id to conversations if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'conversations' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE conversations ADD COLUMN user_id uuid NOT NULL DEFAULT auth.uid();
  END IF;

  -- Add user_id to embeddings if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'embeddings' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE embeddings ADD COLUMN user_id uuid NOT NULL DEFAULT auth.uid();
  END IF;

  -- Add user_id to commands if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'commands' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE commands ADD COLUMN user_id uuid NOT NULL DEFAULT auth.uid();
  END IF;
END $$;

-- Create HNSW index on embeddings if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'embeddings' AND indexname = 'embeddings_embedding_idx'
  ) THEN
    CREATE INDEX embeddings_embedding_idx ON embeddings 
    USING hnsw (embedding vector_ip_ops) WITH (m = 16, ef_construction = 64);
  END IF;
END $$;

-- Create additional useful indexes
CREATE INDEX IF NOT EXISTS agents_user_id_idx ON agents(user_id);
CREATE INDEX IF NOT EXISTS agents_type_idx ON agents(type);
CREATE INDEX IF NOT EXISTS conversations_agent_id_idx ON conversations(agent_id);
CREATE INDEX IF NOT EXISTS conversations_user_id_idx ON conversations(user_id);
CREATE INDEX IF NOT EXISTS embeddings_agent_id_idx ON embeddings(agent_id);
CREATE INDEX IF NOT EXISTS embeddings_user_id_idx ON embeddings(user_id);
CREATE INDEX IF NOT EXISTS commands_owner_agent_id_idx ON commands(owner_agent_id);
CREATE INDEX IF NOT EXISTS commands_user_id_idx ON commands(user_id);

-- Enable RLS on all tables
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE commands ENABLE ROW LEVEL SECURITY;

-- Only enable RLS on logs if we created it
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'logs' AND table_schema = 'public'
  ) THEN
    ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create RLS policies for agents
CREATE POLICY IF NOT EXISTS "Users can manage their own agents"
  ON agents FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for conversations
CREATE POLICY IF NOT EXISTS "Users can manage their own conversations"
  ON conversations FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for embeddings
CREATE POLICY IF NOT EXISTS "Users can manage their own embeddings"
  ON embeddings FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for commands
CREATE POLICY IF NOT EXISTS "Users can manage their own commands"
  ON commands FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for logs (if table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'logs' AND table_schema = 'public'
  ) THEN
    EXECUTE 'CREATE POLICY IF NOT EXISTS "Users can manage their own logs"
      ON logs FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id)';
  END IF;
END $$;