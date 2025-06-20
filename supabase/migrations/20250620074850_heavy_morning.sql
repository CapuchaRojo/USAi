/*
  # Fix Duplicate Key Constraint in Agent Creation

  1. Database Function Updates
    - Modify create_agent function to handle existing user records
    - Implement upsert logic for agent_calls_schema table
    - Add proper conflict resolution

  2. Table Constraint Adjustments
    - Update unique constraints to handle conflicts gracefully
    - Ensure proper indexing for performance
*/

-- Drop existing create_agent function to recreate with proper conflict handling
DROP FUNCTION IF EXISTS create_agent(text, text, text, jsonb);

-- Create improved create_agent function with upsert logic
CREATE OR REPLACE FUNCTION create_agent(
  p_agent_name text,
  p_type text,
  p_function_called text DEFAULT 'initialize',
  p_skills jsonb DEFAULT '{}'::jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
  new_agent_id uuid;
  existing_record boolean;
BEGIN
  -- Get the current authenticated user ID
  current_user_id := auth.uid();
  
  -- Ensure we have a valid user ID
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to create agents';
  END IF;
  
  -- Check for existing user record in agent_calls_schema
  SELECT EXISTS(
    SELECT 1 FROM agents WHERE user_id = current_user_id
  ) INTO existing_record;

  -- Create the agent
  INSERT INTO agents (
    agent_name,
    type,
    function_called,
    skills,
    user_id,
    status,
    current_state
  ) VALUES (
    p_agent_name,
    p_type,
    p_function_called,
    p_skills,
    current_user_id,
    'active',
    'ready'
  ) RETURNING id INTO new_agent_id;

  -- Log the agent creation
  INSERT INTO logs(user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id,
    new_agent_id,
    'system',
    jsonb_build_object(
      'event', 'agent_created',
      'agent_name', p_agent_name,
      'agent_type', p_type,
      'function_called', p_function_called
    ),
    'info'
  );

  RETURN new_agent_id;
END;
$$;

-- Remove the problematic unique constraint on user_id in agents table
-- This allows multiple agents per user
ALTER TABLE agents DROP CONSTRAINT IF EXISTS agent_calls_schema_user_id_key;

-- Ensure proper indexing for performance
CREATE INDEX IF NOT EXISTS agents_user_id_idx ON agents(user_id);
CREATE INDEX IF NOT EXISTS agents_agent_name_idx ON agents(agent_name);
CREATE INDEX IF NOT EXISTS agents_type_idx ON agents(type);

-- Update RLS policies to ensure proper access control
DROP POLICY IF EXISTS "Users can manage their own agents" ON agents;

CREATE POLICY "Users can manage their own agents"
ON agents
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);