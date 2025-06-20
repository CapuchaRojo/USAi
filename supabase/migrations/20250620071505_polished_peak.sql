/*
  # Legion Protocol Simulation Functions

  1. Functions
    - simulate_emulate_phase: Emulate system modules
    - simulate_condense_phase: Condense core utilities  
    - simulate_repurpose_phase: Repurpose as new tools
    - simulate_redeploy_phase: Redeploy optimized tools

  2. Security
    - User authentication required
    - Agent ownership verification
    - Comprehensive logging
*/

-- Function to simulate the EMULATE phase of Legion Protocol
CREATE OR REPLACE FUNCTION simulate_emulate_phase(
  p_agent_id uuid,
  p_module_name text,
  p_description text
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
    RAISE EXCEPTION 'User must be authenticated to simulate emulate phase';
  END IF;
  
  -- Verify agent ownership and get name
  SELECT agents.agent_name INTO agent_name
  FROM agents 
  WHERE agents.id = p_agent_id AND agents.user_id = current_user_id;
  
  IF agent_name IS NULL THEN
    RAISE EXCEPTION 'Agent not found or access denied';
  END IF;
  
  -- Update agent state to emulating
  UPDATE agents
  SET current_state = 'emulating'
  WHERE id = p_agent_id AND user_id = current_user_id;
  
  -- Log the emulation event
  INSERT INTO logs(user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id,
    p_agent_id,
    'legion_protocol',
    jsonb_build_object(
      'event', 'emulate_phase',
      'agent_name', agent_name,
      'module_name', p_module_name,
      'description', p_description,
      'phase', 'EMULATE'
    ),
    'info'
  );
  
  RETURN true;
END;
$$;

-- Function to simulate the CONDENSE phase of Legion Protocol
CREATE OR REPLACE FUNCTION simulate_condense_phase(
  p_agent_id uuid,
  p_utility_name text,
  p_description text
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
    RAISE EXCEPTION 'User must be authenticated to simulate condense phase';
  END IF;
  
  -- Verify agent ownership and get name
  SELECT agents.agent_name INTO agent_name
  FROM agents 
  WHERE agents.id = p_agent_id AND agents.user_id = current_user_id;
  
  IF agent_name IS NULL THEN
    RAISE EXCEPTION 'Agent not found or access denied';
  END IF;
  
  -- Update agent state to condensing
  UPDATE agents
  SET current_state = 'condensing'
  WHERE id = p_agent_id AND user_id = current_user_id;
  
  -- Log the condensation event
  INSERT INTO logs(user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id,
    p_agent_id,
    'legion_protocol',
    jsonb_build_object(
      'event', 'condense_phase',
      'agent_name', agent_name,
      'utility_name', p_utility_name,
      'description', p_description,
      'phase', 'CONDENSE'
    ),
    'info'
  );
  
  RETURN true;
END;
$$;

-- Function to simulate the REPURPOSE phase of Legion Protocol
CREATE OR REPLACE FUNCTION simulate_repurpose_phase(
  p_agent_id uuid,
  p_tool_name text,
  p_description text
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
    RAISE EXCEPTION 'User must be authenticated to simulate repurpose phase';
  END IF;
  
  -- Verify agent ownership and get name
  SELECT agents.agent_name INTO agent_name
  FROM agents 
  WHERE agents.id = p_agent_id AND agents.user_id = current_user_id;
  
  IF agent_name IS NULL THEN
    RAISE EXCEPTION 'Agent not found or access denied';
  END IF;
  
  -- Update agent state to repurposing
  UPDATE agents
  SET current_state = 'repurposing'
  WHERE id = p_agent_id AND user_id = current_user_id;
  
  -- Log the repurpose event
  INSERT INTO logs(user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id,
    p_agent_id,
    'legion_protocol',
    jsonb_build_object(
      'event', 'repurpose_phase',
      'agent_name', agent_name,
      'tool_name', p_tool_name,
      'description', p_description,
      'phase', 'REPURPOSE'
    ),
    'info'
  );
  
  RETURN true;
END;
$$;

-- Function to simulate the REDEPLOY phase of Legion Protocol
CREATE OR REPLACE FUNCTION simulate_redeploy_phase(
  p_agent_id uuid,
  p_tool_name text,
  p_description text
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
    RAISE EXCEPTION 'User must be authenticated to simulate redeploy phase';
  END IF;
  
  -- Verify agent ownership and get name
  SELECT agents.agent_name INTO agent_name
  FROM agents 
  WHERE agents.id = p_agent_id AND agents.user_id = current_user_id;
  
  IF agent_name IS NULL THEN
    RAISE EXCEPTION 'Agent not found or access denied';
  END IF;
  
  -- Update agent state to redeployed and status to active
  UPDATE agents
  SET 
    current_state = 'redeployed',
    status = 'active'
  WHERE id = p_agent_id AND user_id = current_user_id;
  
  -- Log the redeploy event
  INSERT INTO logs(user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id,
    p_agent_id,
    'legion_protocol',
    jsonb_build_object(
      'event', 'redeploy_phase',
      'agent_name', agent_name,
      'tool_name', p_tool_name,
      'description', p_description,
      'phase', 'REDEPLOY'
    ),
    'info'
  );
  
  RETURN true;
END;
$$;