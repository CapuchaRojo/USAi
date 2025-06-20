-- Drop the old function to allow for signature changes
DROP FUNCTION IF EXISTS create_agent(text, text, jsonb, uuid);
DROP FUNCTION IF EXISTS create_agent(text, text, text, jsonb);

-- Create or replace the create_agent function with updated parameters and logic
CREATE OR REPLACE FUNCTION create_agent(
  p_agent_name text,
  p_agent_type text,
  p_function_called text,
  p_skills jsonb DEFAULT '{}'::jsonb
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
  
  -- Ensure we have a valid user ID
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to create agents';
  END IF;
  
  -- Allow nil UUID for preview mode, otherwise validate format
  IF current_user_id = '00000000-0000-0000-0000-000000000000'::uuid THEN
    -- Special handling for preview mode - proceed with creation
    NULL;
  ELSE
    -- Normal validation for real users (optional, can be handled by RLS or application logic)
    IF current_user_id::text !~ '^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$' THEN
      RAISE EXCEPTION 'Invalid user ID format';
    END IF;
  END IF;
  
  -- Check if agent with same name already exists for this user
  IF EXISTS (
    SELECT 1 FROM agents 
    WHERE agent_name = p_agent_name AND user_id = current_user_id
  ) THEN
    RAISE EXCEPTION 'Agent with name "%" already exists for this user', p_agent_name;
  END IF;

  -- Insert the new agent
  INSERT INTO public.agents (agent_name, type, function_called, skills, user_id, status, current_state)
  VALUES (p_agent_name, p_agent_type, p_function_called, p_skills, current_user_id, 'active', 'ready')
  RETURNING id INTO new_agent_id;
  
  -- Log the agent creation event
  INSERT INTO logs(user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id,
    new_agent_id,
    'system',
    jsonb_build_object(
      'event', 'agent_created',
      'agent_name', p_agent_name,
      'agent_type', p_agent_type,
      'function_called', p_function_called
    ),
    'info'
  );
  
  RETURN new_agent_id;
END;
$$;