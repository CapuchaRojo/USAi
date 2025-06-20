/*
  # Fix create_agent RPC function signature

  1. Updates
    - Add user_id parameter to create_agent function
    - Ensure proper user association for all agent creation
    - Maintain database integrity constraints

  2. Security
    - Enable RLS enforcement
    - Add user authentication checks
    - Ensure agents are properly owned by users
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS create_agent(text, text, text, jsonb);

-- Create updated create_agent function with user_id parameter
CREATE OR REPLACE FUNCTION create_agent(
  p_agent_name text,
  p_type text,
  p_function_called text,
  p_skills jsonb,
  p_user_id uuid
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_agent_id uuid;
  current_user_id uuid;
BEGIN
  -- Get the current authenticated user ID
  current_user_id := auth.uid();
  
  -- Ensure we have a valid user ID and it matches the provided user_id
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to create agents';
  END IF;
  
  IF current_user_id != p_user_id THEN
    RAISE EXCEPTION 'User can only create agents for themselves';
  END IF;
  
  -- Insert the new agent
  -- Update existing create_agent function with UUID validation
CREATE OR REPLACE FUNCTION create_agent(
  p_agent_name text,
  p_type text,
  p_function_called text,
  p_skills jsonb,
  p_user_id uuid
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_agent_id uuid;
  current_user_id uuid;
BEGIN
  -- Get the current authenticated user ID
  current_user_id := auth.uid();
  
  -- Ensure we have a valid user ID and it matches the provided user_id
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to create agents';
  END IF;
  
  IF current_user_id != p_user_id THEN
    RAISE EXCEPTION 'User can only create agents for themselves';
  END IF;

  -- Add UUID format validation here
  IF p_user_id::text !~ '^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$' THEN
    RAISE EXCEPTION 'Invalid user ID format';
  END IF;
  
  -- Insert the new agent
  INSERT INTO agents(
    agent_name, 
    type, 
    function_called, 
    skills, 
    user_id,
    status,
    current_state
  )
  VALUES (
    p_agent_name,
    p_type,
    p_function_called,
    COALESCE(p_skills, '{}'::jsonb),
    p_user_id,
    'idle',
    'initialized'
  )
  RETURNING id INTO new_agent_id;
  
  -- Log the agent creation event
  INSERT INTO logs(user_id, agent_id, direction, detail, level)
  VALUES (
    p_user_id,
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

-- Create function to update agent status
CREATE OR REPLACE FUNCTION update_agent_status(
  p_agent_id uuid,
  p_status text,
  p_state text DEFAULT NULL
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
  agent_name text;
BEGIN
  -- Get the current authenticated user ID
  current_user_id := auth.uid();
  
  -- Ensure we have a valid user ID
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to update agent status';
  END IF;
  
  -- Get agent name and verify ownership
  SELECT agents.agent_name INTO agent_name
  FROM agents 
  WHERE agents.id = p_agent_id AND agents.user_id = current_user_id;
  
  IF agent_name IS NULL THEN
    RAISE EXCEPTION 'Agent not found or access denied';
  END IF;
  
  -- Update the agent status
  UPDATE agents
  SET 
    status = p_status,
    current_state = COALESCE(p_state, current_state)
  WHERE id = p_agent_id AND user_id = current_user_id;
  
  -- Log the status change
  INSERT INTO logs(user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id,
    p_agent_id,
    'system',
    jsonb_build_object(
      'event', 'status_changed',
      'agent_name', agent_name,
      'new_status', p_status,
      'new_state', p_state
    ),
    'info'
  );
  
  RETURN true;
END;
$$;