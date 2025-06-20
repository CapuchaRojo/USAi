/*
  # Update create_agent function with UUID validation

  1. Function Updates
    - Add strict UUID validation for p_user_id parameter
    - Ensure proper error handling for invalid UUID formats
    - Maintain backward compatibility with existing calls

  2. Security
    - Server-side UUID format validation
    - Prevent invalid UUID insertion attempts
*/

CREATE OR REPLACE FUNCTION create_agent(
  p_agent_name text,
  p_type text DEFAULT 'adaptive',
  p_function_called text DEFAULT 'initialize',
  p_skills jsonb DEFAULT '{}'::jsonb,
  p_user_id uuid DEFAULT auth.uid()
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_agent_id uuid;
BEGIN
  -- Validate required parameters
  IF p_agent_name IS NULL OR trim(p_agent_name) = '' THEN
    RAISE EXCEPTION 'Agent name cannot be empty';
  END IF;

  -- Validate user ID format and existence
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;

  -- Additional UUID format validation (PostgreSQL should handle this automatically, but being explicit)
  IF p_user_id::text !~ '^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$' THEN
    RAISE EXCEPTION 'Invalid user ID format: %', p_user_id;
  END IF;

  -- Check if agent name already exists for this user
  IF EXISTS (
    SELECT 1 FROM agents 
    WHERE agent_name = p_agent_name AND user_id = p_user_id
  ) THEN
    RAISE EXCEPTION 'Agent with name "%" already exists for this user', p_agent_name;
  END IF;

  -- Insert new agent
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
    p_user_id,
    'pending',
    'initializing'
  ) RETURNING id INTO new_agent_id;

  RETURN new_agent_id;
END;
$$;