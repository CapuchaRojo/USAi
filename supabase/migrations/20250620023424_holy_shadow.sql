/*
  # Fix RLS Policy Syntax and Add user_id Default

  1. Database Schema Fixes
    - Fix RLS policy creation syntax using DO blocks
    - Add default value for user_id columns
    - Ensure proper authentication integration

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Use auth.uid() for user identification

  3. Core Tables
    - agents: AI agent instances with proper user association
    - conversations: threaded dialogues
    - embeddings: vector memory storage
    - commands: reusable agent behaviors
    - logs: system telemetry and audit trails
    - outputs: agent-generated content
    - external_systems: emulated system definitions
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- Create agents table if not exists
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  agent_name text UNIQUE NOT NULL,
  user_id uuid DEFAULT auth.uid(),
  function_called text NOT NULL,
  status text DEFAULT 'pending',
  type text,
  vector_fingerprint vector(1536),
  skills jsonb DEFAULT '{}',
  current_state text DEFAULT 'idle'
);

-- Create conversations table if not exists
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  participant text NOT NULL,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  user_id uuid DEFAULT auth.uid(),
  timestamp timestamptz DEFAULT now()
);

-- Create embeddings table if not exists
CREATE TABLE IF NOT EXISTS embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  source text,
  content text NOT NULL,
  embedding vector(1536),
  metadata jsonb DEFAULT '{}',
  user_id uuid DEFAULT auth.uid(),
  created_at timestamptz DEFAULT now()
);

-- Create commands table if not exists
CREATE TABLE IF NOT EXISTS commands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  script text NOT NULL,
  owner_agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  metadata jsonb DEFAULT '{}',
  user_id uuid DEFAULT auth.uid(),
  created_at timestamptz DEFAULT now()
);

-- Create logs table if not exists
CREATE TABLE IF NOT EXISTS logs (
  created_at timestamptz DEFAULT now(),
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT auth.uid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  direction text NOT NULL,
  detail jsonb NOT NULL,
  level text DEFAULT 'info'
);

-- Create outputs table if not exists
CREATE TABLE IF NOT EXISTS outputs (
  created_at timestamptz DEFAULT now(),
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT auth.uid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  type text NOT NULL,
  content text NOT NULL
);

-- Create external_systems table if not exists
CREATE TABLE IF NOT EXISTS external_systems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  emulate_as text NOT NULL,
  functions text,
  complexity text DEFAULT 'moderate',
  warning_threshold integer NOT NULL,
  requires_token boolean DEFAULT false,
  status text DEFAULT 'scanned',
  user_id uuid DEFAULT auth.uid()
);

-- Enable RLS on all tables
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_systems ENABLE ROW LEVEL SECURITY;

-- Create RLS policies using DO blocks to avoid syntax errors
DO $$ 
BEGIN
  -- Agents table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'agents' 
    AND policyname = 'Users can create their own agents'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can create their own agents" ON agents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'agents' 
    AND policyname = 'Users can view their own agents'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can view their own agents" ON agents FOR SELECT TO authenticated USING (auth.uid() = user_id);';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'agents' 
    AND policyname = 'Users can update their own agents'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can update their own agents" ON agents FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'agents' 
    AND policyname = 'Users can delete their own agents'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can delete their own agents" ON agents FOR DELETE TO authenticated USING (auth.uid() = user_id);';
  END IF;
END
$$;

DO $$ 
BEGIN
  -- Conversations table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'conversations' 
    AND policyname = 'Users can manage their own conversations'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can manage their own conversations" ON conversations FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);';
  END IF;
END
$$;

DO $$ 
BEGIN
  -- Embeddings table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'embeddings' 
    AND policyname = 'Users can manage their own embeddings'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can manage their own embeddings" ON embeddings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);';
  END IF;
END
$$;

DO $$ 
BEGIN
  -- Commands table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'commands' 
    AND policyname = 'Users can manage their own commands'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can manage their own commands" ON commands FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);';
  END IF;
END
$$;

DO $$ 
BEGIN
  -- Logs table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'logs' 
    AND policyname = 'Users can manage their own logs'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can manage their own logs" ON logs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);';
  END IF;
END
$$;

DO $$ 
BEGIN
  -- Outputs table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'outputs' 
    AND policyname = 'Users can manage their own outputs'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can manage their own outputs" ON outputs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);';
  END IF;
END
$$;

DO $$ 
BEGIN
  -- External systems table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'external_systems' 
    AND policyname = 'Users can manage their own external systems'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can manage their own external systems" ON external_systems FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);';
  END IF;
END
$$;

-- Create helper functions for agent management
CREATE OR REPLACE FUNCTION create_agent(
  p_agent_name text,
  p_type text,
  p_function_called text,
  p_skills jsonb DEFAULT '{}'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  agent_id uuid;
BEGIN
  INSERT INTO agents (agent_name, type, function_called, skills, user_id, status, current_state)
  VALUES (p_agent_name, p_type, p_function_called, p_skills, auth.uid(), 'active', 'ready')
  RETURNING id INTO agent_id;
  
  RETURN agent_id;
END;
$$;

CREATE OR REPLACE FUNCTION update_agent_status(
  p_agent_id uuid,
  p_status text,
  p_state text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE agents 
  SET 
    status = p_status,
    current_state = COALESCE(p_state, current_state)
  WHERE id = p_agent_id AND user_id = auth.uid();
  
  RETURN FOUND;
END;
$$;

-- Create vector similarity search function
CREATE OR REPLACE FUNCTION match_embeddings(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.1,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    embeddings.id,
    embeddings.content,
    embeddings.metadata,
    1 - (embeddings.embedding <=> query_embedding) AS similarity
  FROM embeddings
  WHERE embeddings.user_id = auth.uid()
    AND 1 - (embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS agents_user_id_idx ON agents(user_id);
CREATE INDEX IF NOT EXISTS agents_status_idx ON agents(status);
CREATE INDEX IF NOT EXISTS agents_type_idx ON agents(type);
CREATE INDEX IF NOT EXISTS conversations_agent_id_idx ON conversations(agent_id);
CREATE INDEX IF NOT EXISTS conversations_user_id_idx ON conversations(user_id);
CREATE INDEX IF NOT EXISTS embeddings_agent_id_idx ON embeddings(agent_id);
CREATE INDEX IF NOT EXISTS embeddings_user_id_idx ON embeddings(user_id);
CREATE INDEX IF NOT EXISTS embeddings_embedding_idx ON embeddings USING hnsw (embedding vector_ip_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX IF NOT EXISTS commands_owner_agent_id_idx ON commands(owner_agent_id);
CREATE INDEX IF NOT EXISTS commands_user_id_idx ON commands(user_id);
CREATE INDEX IF NOT EXISTS logs_agent_id_idx ON logs(agent_id);
CREATE INDEX IF NOT EXISTS logs_user_id_idx ON logs(user_id);