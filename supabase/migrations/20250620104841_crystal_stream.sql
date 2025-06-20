/*
  # Fix UUID validation for preview mode

  1. Updates
    - Modify create_agent function to accept nil UUID for preview mode
    - Allow 00000000-0000-0000-0000-000000000000 as valid user ID
    - Maintain strict validation for real users

  2. Security
    - Preview mode handling only for specific nil UUID
    - Normal validation for all other user IDs
*/

-- Drop existing function to avoid conflicts
DROP FUNCTION IF EXISTS create_agent(text, text, text, jsonb);

-- Create updated function that handles preview mode UUID
CREATE OR REPLACE FUNCTION create_agent(
  p_agent_name text,
  p_type text,
  p_function_called text,
  p_skills jsonb DEFAULT '{}'::jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
  new_agent_id uuid;
  is_preview_user boolean := false;
BEGIN
  -- Get the current authenticated user ID
  current_user_id := auth.uid();
  
  -- Check if this is the preview mode nil UUID
  IF current_user_id = '00000000-0000-0000-0000-000000000000'::uuid THEN
    is_preview_user := true;
  END IF;
  
  -- Validate user ID (skip validation for preview mode)
  IF NOT is_preview_user THEN
    IF current_user_id IS NULL THEN
      RAISE EXCEPTION 'User must be authenticated to create agents';
    END IF;
    
    -- Validate UUID format for real users
    IF current_user_id::text !~ '^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$' THEN
      RAISE EXCEPTION 'Invalid user ID format: %', current_user_id;
    END IF;
  END IF;
  
  -- Validate input parameters
  IF p_agent_name IS NULL OR trim(p_agent_name) = '' THEN
    RAISE EXCEPTION 'Agent name cannot be empty';
  END IF;
  
  IF p_type IS NULL OR trim(p_type) = '' THEN
    RAISE EXCEPTION 'Agent type cannot be empty';
  END IF;
  
  -- Check for duplicate agent names for this user
  IF EXISTS (
    SELECT 1 FROM agents 
    WHERE agent_name = p_agent_name 
    AND user_id = current_user_id
  ) THEN
    RAISE EXCEPTION 'Agent with name "%" already exists for this user', p_agent_name;
  END IF;
  
  -- Create the agent
  INSERT INTO agents (
    agent_name,
    user_id,
    type,
    function_called,
    status,
    skills,
    current_state
  ) VALUES (
    p_agent_name,
    current_user_id,
    p_type,
    p_function_called,
    'pending',
    p_skills,
    'idle'
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
      'function_called', p_function_called,
      'is_preview_mode', is_preview_user
    ),
    'info'
  );
  
  RETURN new_agent_id;
END;
$$;