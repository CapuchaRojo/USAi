/*
  # USAi Legion Database Schema Migration

  1. New Tables
    - `agents` - Core agent entities with skills and state management
    - `conversations` - Threaded dialogues between agents and users
    - `embeddings` - Vector knowledge storage with pgvector
    - `commands` - Reusable agent behaviors and scripts
    - `logs` - System telemetry and audit trails
    - `outputs` - Agent-generated content and results
    - `external_systems` - External system emulation configurations

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Set user_id defaults to auth.uid() for automatic user association

  3. Functions
    - create_agent: Spawn new agents with proper user association
    - update_agent_status: Modify agent state and status
    - match_embeddings: Vector similarity search for knowledge retrieval

  4. Performance
    - Add indexes for user_id, status, and vector operations
    - HNSW index for efficient vector similarity search
*/

-- Clean up existing functions and their dependencies to avoid conflicts
DROP FUNCTION IF EXISTS create_agent(text,text,text,jsonb) CASCADE;
DROP FUNCTION IF EXISTS update_agent_status(uuid,text) CASCADE;
DROP FUNCTION IF EXISTS update_agent_status(uuid,text,text) CASCADE;
DROP FUNCTION IF EXISTS match_embeddings(vector,double precision,integer) CASCADE;
DROP FUNCTION IF EXISTS match_embeddings(vector,float,int) CASCADE;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- Create agents table if not exists
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  agent_name text UNIQUE NOT NULL,
  user_id uuid DEFAULT auth.uid() NOT NULL,
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
  user_id uuid DEFAULT auth.uid() NOT NULL,
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
  user_id uuid DEFAULT auth.uid() NOT NULL,
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
  user_id uuid DEFAULT auth.uid() NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create logs table if not exists
CREATE TABLE IF NOT EXISTS logs (
  created_at timestamptz DEFAULT now(),
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT auth.uid() NOT NULL,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  direction text NOT NULL,
  detail jsonb NOT NULL,
  level text DEFAULT 'info'
);

-- Create outputs table if not exists
CREATE TABLE IF NOT EXISTS outputs (
  created_at timestamptz DEFAULT now(),
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT auth.uid() NOT NULL,
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
  user_id uuid DEFAULT auth.uid() NOT NULL
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
  -- Drop existing policies if they exist to avoid conflicts
  DROP POLICY IF EXISTS "Users can create their own agents" ON agents;
  DROP POLICY IF EXISTS "Users can view their own agents" ON agents;
  DROP POLICY IF EXISTS "Users can update their own agents" ON agents;
  DROP POLICY IF EXISTS "Users can delete their own agents" ON agents;
  DROP POLICY IF EXISTS "Users can manage their own agents" ON agents;

  -- Create agents table policies
  CREATE POLICY "Users can create their own agents" 
    ON agents FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can view their own agents" 
    ON agents FOR SELECT 
    TO authenticated 
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can update their own agents" 
    ON agents FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can delete their own agents" 
    ON agents FOR DELETE 
    TO authenticated 
    USING (auth.uid() = user_id);
END
$$;

DO $$ 
BEGIN
  -- Drop existing conversation policies
  DROP POLICY IF EXISTS "Users can manage their own conversations" ON conversations;
  
  -- Create conversations table policies
  CREATE POLICY "Users can manage their own conversations" 
    ON conversations FOR ALL 
    TO authenticated 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);
END
$$;

DO $$ 
BEGIN
  -- Drop existing embedding policies
  DROP POLICY IF EXISTS "Users can manage their own embeddings" ON embeddings;
  
  -- Create embeddings table policies
  CREATE POLICY "Users can manage their own embeddings" 
    ON embeddings FOR ALL 
    TO authenticated 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);
END
$$;

DO $$ 
BEGIN
  -- Drop existing command policies
  DROP POLICY IF EXISTS "Users can manage their own commands" ON commands;
  
  -- Create commands table policies
  CREATE POLICY "Users can manage their own commands" 
    ON commands FOR ALL 
    TO authenticated 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);
END
$$;

DO $$ 
BEGIN
  -- Drop existing log policies
  DROP POLICY IF EXISTS "Users can manage their own logs" ON logs;
  
  -- Create logs table policies
  CREATE POLICY "Users can manage their own logs" 
    ON logs FOR ALL 
    TO authenticated 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);
END
$$;

DO $$ 
BEGIN
  -- Drop existing output policies
  DROP POLICY IF EXISTS "Users can manage their own outputs" ON outputs;
  
  -- Create outputs table policies
  CREATE POLICY "Users can manage their own outputs" 
    ON outputs FOR ALL 
    TO authenticated 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);
END
$$;

DO $$ 
BEGIN
  -- Drop existing external system policies
  DROP POLICY IF EXISTS "Users can manage their own external systems" ON external_systems;
  
  -- Create external systems table policies
  CREATE POLICY "Users can manage their own external systems" 
    ON external_systems FOR ALL 
    TO authenticated 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);
END
$$;

-- Create helper functions for agent management
CREATE OR REPLACE FUNCTION create_agent(
  p_agent_name text,
  p_type text,
  p_function_called text,
  p_skills jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  agent_id uuid;
  current_user_id uuid;
BEGIN
  -- Get the current authenticated user ID
  current_user_id := auth.uid();
  
  -- Ensure we have a valid user ID
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to create agents';
  END IF;
  
  -- Insert the new agent
  INSERT INTO agents (agent_name, type, function_called, skills, user_id, status, current_state)
  VALUES (p_agent_name, p_type, p_function_called, p_skills, current_user_id, 'active', 'ready')
  RETURNING id INTO agent_id;
  
  -- Log the agent creation
  INSERT INTO logs (user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id, 
    agent_id, 
    'system', 
    jsonb_build_object(
      'event', 'agent_created',
      'agent_name', p_agent_name,
      'agent_type', p_type,
      'function_called', p_function_called
    ),
    'info'
  );
  
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
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
  updated_rows integer;
BEGIN
  -- Get the current authenticated user ID
  current_user_id := auth.uid();
  
  -- Ensure we have a valid user ID
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to update agents';
  END IF;
  
  -- Update the agent
  UPDATE agents 
  SET 
    status = p_status,
    current_state = COALESCE(p_state, current_state)
  WHERE id = p_agent_id AND user_id = current_user_id;
  
  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  
  -- Log the status update if successful
  IF updated_rows > 0 THEN
    INSERT INTO logs (user_id, agent_id, direction, detail, level)
    VALUES (
      current_user_id,
      p_agent_id,
      'system',
      jsonb_build_object(
        'event', 'agent_status_updated',
        'new_status', p_status,
        'new_state', p_state
      ),
      'info'
    );
  END IF;
  
  RETURN updated_rows > 0;
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
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Get the current authenticated user ID
  current_user_id := auth.uid();
  
  -- Ensure we have a valid user ID
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to search embeddings';
  END IF;
  
  RETURN QUERY
  SELECT
    embeddings.id,
    embeddings.content,
    embeddings.metadata,
    1 - (embeddings.embedding <=> query_embedding) AS similarity
  FROM embeddings
  WHERE embeddings.user_id = current_user_id
    AND 1 - (embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS agents_user_id_idx ON agents(user_id);
CREATE INDEX IF NOT EXISTS agents_status_idx ON agents(status);
CREATE INDEX IF NOT EXISTS agents_type_idx ON agents(type);
CREATE INDEX IF NOT EXISTS agents_agent_name_idx ON agents(agent_name);

CREATE INDEX IF NOT EXISTS conversations_agent_id_idx ON conversations(agent_id);
CREATE INDEX IF NOT EXISTS conversations_user_id_idx ON conversations(user_id);

CREATE INDEX IF NOT EXISTS embeddings_agent_id_idx ON embeddings(agent_id);
CREATE INDEX IF NOT EXISTS embeddings_user_id_idx ON embeddings(user_id);
CREATE INDEX IF NOT EXISTS embeddings_embedding_idx ON embeddings USING hnsw (embedding vector_ip_ops) WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS commands_owner_agent_id_idx ON commands(owner_agent_id);
CREATE INDEX IF NOT EXISTS commands_user_id_idx ON commands(user_id);

CREATE INDEX IF NOT EXISTS logs_agent_id_idx ON logs(agent_id);
CREATE INDEX IF NOT EXISTS logs_user_id_idx ON logs(user_id);
CREATE INDEX IF NOT EXISTS logs_created_at_idx ON logs(created_at);

CREATE INDEX IF NOT EXISTS outputs_agent_id_idx ON outputs(agent_id);
CREATE INDEX IF NOT EXISTS outputs_user_id_idx ON outputs(user_id);

CREATE INDEX IF NOT EXISTS external_systems_user_id_idx ON external_systems(user_id);
CREATE INDEX IF NOT EXISTS external_systems_status_idx ON external_systems(status);