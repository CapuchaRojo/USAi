/*
  # Create USAi Agent Operating System Schema

  1. New Tables
    - `agents` - Core agent registry with vector fingerprints and skills
    - `conversations` - Threaded agent dialogues with metadata
    - `embeddings` - Vector memory storage for agent context
    - `commands` - Reusable agent behaviors and scripts
    - Enhanced `logs` table for comprehensive telemetry

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - User isolation via auth.uid()

  3. Performance
    - HNSW indexes for vector similarity search
    - Standard indexes for common query patterns
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;

-- Create agents table (core agent registry)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'agents' AND table_schema = 'public'
  ) THEN
    CREATE TABLE agents (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at timestamptz DEFAULT now(),
      agent_name text NOT NULL,
      user_id uuid NOT NULL,
      function_called text NOT NULL,
      status text DEFAULT 'pending' NOT NULL,
      
      -- USAi specific fields
      type text,
      vector_fingerprint vector(1536),
      skills jsonb DEFAULT '{}'::jsonb,
      current_state text DEFAULT 'idle'
    );
  ELSE
    -- Add USAi specific columns if they don't exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'agents' AND column_name = 'type'
    ) THEN
      ALTER TABLE agents ADD COLUMN type text;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'agents' AND column_name = 'vector_fingerprint'
    ) THEN
      ALTER TABLE agents ADD COLUMN vector_fingerprint vector(1536);
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'agents' AND column_name = 'skills'
    ) THEN
      ALTER TABLE agents ADD COLUMN skills jsonb DEFAULT '{}'::jsonb;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'agents' AND column_name = 'current_state'
    ) THEN
      ALTER TABLE agents ADD COLUMN current_state text DEFAULT 'idle';
    END IF;
  END IF;
END $$;

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  participant text NOT NULL,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  user_id uuid NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- Create embeddings table
CREATE TABLE IF NOT EXISTS embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  source text,
  content text NOT NULL,
  embedding vector(1536),
  metadata jsonb DEFAULT '{}'::jsonb,
  user_id uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create commands table
CREATE TABLE IF NOT EXISTS commands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  script text NOT NULL,
  owner_agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  metadata jsonb DEFAULT '{}'::jsonb,
  user_id uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enhance existing logs table if needed
DO $$
BEGIN
  -- Add user_id to logs if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'logs' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE logs ADD COLUMN user_id uuid NOT NULL DEFAULT auth.uid();
  END IF;
  
  -- Add level column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'logs' AND column_name = 'level'
  ) THEN
    ALTER TABLE logs ADD COLUMN level text DEFAULT 'info';
  END IF;
  
  -- Add detail column if it doesn't exist (rename message to detail for consistency)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'logs' AND column_name = 'detail'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'logs' AND column_name = 'message'
    ) THEN
      ALTER TABLE logs RENAME COLUMN message TO detail;
      ALTER TABLE logs ALTER COLUMN detail TYPE jsonb USING detail::jsonb;
    ELSE
      ALTER TABLE logs ADD COLUMN detail jsonb DEFAULT '{}'::jsonb;
    END IF;
  END IF;
END $$;

-- Create HNSW index on embeddings for vector similarity search
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
CREATE INDEX IF NOT EXISTS agents_status_idx ON agents(status);
CREATE INDEX IF NOT EXISTS conversations_agent_id_idx ON conversations(agent_id);
CREATE INDEX IF NOT EXISTS conversations_user_id_idx ON conversations(user_id);
CREATE INDEX IF NOT EXISTS embeddings_agent_id_idx ON embeddings(agent_id);
CREATE INDEX IF NOT EXISTS embeddings_user_id_idx ON embeddings(user_id);
CREATE INDEX IF NOT EXISTS commands_owner_agent_id_idx ON commands(owner_agent_id);
CREATE INDEX IF NOT EXISTS commands_user_id_idx ON commands(user_id);
CREATE INDEX IF NOT EXISTS logs_user_id_idx ON logs(user_id);
CREATE INDEX IF NOT EXISTS logs_agent_id_idx ON logs(agent_id);

-- Enable RLS on all tables
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can manage their own agents" ON agents;
DROP POLICY IF EXISTS "Users can manage their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can manage their own embeddings" ON embeddings;
DROP POLICY IF EXISTS "Users can manage their own commands" ON commands;
DROP POLICY IF EXISTS "Users can manage their own logs" ON logs;

-- Create comprehensive RLS policies for agents
CREATE POLICY "Users can manage their own agents"
  ON agents FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for conversations
CREATE POLICY "Users can manage their own conversations"
  ON conversations FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for embeddings
CREATE POLICY "Users can manage their own embeddings"
  ON embeddings FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for commands
CREATE POLICY "Users can manage their own commands"
  ON commands FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for logs
CREATE POLICY "Users can manage their own logs"
  ON logs FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create helper functions for agent management
CREATE OR REPLACE FUNCTION create_agent(
  p_agent_name text,
  p_type text DEFAULT 'general',
  p_function_called text DEFAULT 'initialize',
  p_skills jsonb DEFAULT '{}'::jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  agent_id uuid;
BEGIN
  INSERT INTO agents (agent_name, user_id, function_called, type, skills, status)
  VALUES (p_agent_name, auth.uid(), p_function_called, p_type, p_skills, 'active')
  RETURNING id INTO agent_id;
  
  -- Log agent creation
  INSERT INTO logs (agent_id, user_id, direction, detail)
  VALUES (agent_id, auth.uid(), 'system', jsonb_build_object(
    'event', 'agent_created',
    'agent_name', p_agent_name,
    'type', p_type
  ));
  
  RETURN agent_id;
END;
$$;

-- Create function to update agent status
CREATE OR REPLACE FUNCTION update_agent_status(
  p_agent_id uuid,
  p_status text,
  p_state text DEFAULT NULL
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE agents 
  SET 
    status = p_status,
    current_state = COALESCE(p_state, current_state)
  WHERE id = p_agent_id AND user_id = auth.uid();
  
  -- Log status change
  INSERT INTO logs (agent_id, user_id, direction, detail)
  VALUES (p_agent_id, auth.uid(), 'system', jsonb_build_object(
    'event', 'status_changed',
    'new_status', p_status,
    'new_state', p_state
  ));
  
  RETURN FOUND;
END;
$$;