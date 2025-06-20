/*
  # Legion Protocol Phase Simulation Functions

  1. New Functions
    - `simulate_emulate_phase` - Log emulation activities
    - `simulate_condense_phase` - Log condensation activities  
    - `simulate_repurpose_phase` - Log repurposing activities
    - `simulate_redeploy_phase` - Log redeployment activities

  2. Enhanced Logging
    - All phases log to the logs table with legion_phase metadata
    - Detailed tracking of ECRR cycle progression
    - Agent state updates during each phase

  3. Integration
    - Functions work with existing agent and logging infrastructure
    - Support for the full Legion Protocol workflow
*/

-- Create function to simulate the EMULATE phase
CREATE OR REPLACE FUNCTION simulate_emulate_phase(
  p_agent_id uuid,
  p_module_name text,
  p_description text DEFAULT NULL
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
  
  -- Verify the agent belongs to the current user and get agent name
  SELECT agents.agent_name INTO agent_name
  FROM agents 
  WHERE agents.id = p_agent_id AND agents.user_id = current_user_id;
  
  IF agent_name IS NULL THEN
    RAISE EXCEPTION 'Agent not found or access denied';
  END IF;
  
  -- Update agent state to reflect emulation phase
  UPDATE agents
  SET current_state = 'emulating_' || p_module_name,
      status = 'working'
  WHERE id = p_agent_id AND user_id = current_user_id;
  
  -- Log the emulation event
  INSERT INTO logs(user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id,
    p_agent_id,
    'system',
    jsonb_build_object(
      'event', 'emulate_phase',
      'agent_name', agent_name,
      'module_name', p_module_name,
      'description', p_description,
      'legion_phase', 'emulate',
      'phase_order', 1
    ),
    'info'
  );
  
  RETURN true;
END;
$$;

-- Create function to simulate the CONDENSE phase
CREATE OR REPLACE FUNCTION simulate_condense_phase(
  p_agent_id uuid,
  p_utility_name text,
  p_description text DEFAULT NULL
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
  
  -- Verify the agent belongs to the current user and get agent name
  SELECT agents.agent_name INTO agent_name
  FROM agents 
  WHERE agents.id = p_agent_id AND agents.user_id = current_user_id;
  
  IF agent_name IS NULL THEN
    RAISE EXCEPTION 'Agent not found or access denied';
  END IF;
  
  -- Update agent state to reflect condensation phase
  UPDATE agents
  SET current_state = 'condensing_' || p_utility_name,
      status = 'working'
  WHERE id = p_agent_id AND user_id = current_user_id;
  
  -- Log the condensation event
  INSERT INTO logs(user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id,
    p_agent_id,
    'system',
    jsonb_build_object(
      'event', 'condense_phase',
      'agent_name', agent_name,
      'utility_name', p_utility_name,
      'description', p_description,
      'legion_phase', 'condense',
      'phase_order', 2
    ),
    'info'
  );
  
  RETURN true;
END;
$$;

-- Create function to simulate the REPURPOSE phase
CREATE OR REPLACE FUNCTION simulate_repurpose_phase(
  p_agent_id uuid,
  p_tool_name text,
  p_description text DEFAULT NULL
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
  
  -- Verify the agent belongs to the current user and get agent name
  SELECT agents.agent_name INTO agent_name
  FROM agents 
  WHERE agents.id = p_agent_id AND agents.user_id = current_user_id;
  
  IF agent_name IS NULL THEN
    RAISE EXCEPTION 'Agent not found or access denied';
  END IF;
  
  -- Update agent state to reflect repurposing phase
  UPDATE agents
  SET current_state = 'repurposing_' || p_tool_name,
      status = 'working'
  WHERE id = p_agent_id AND user_id = current_user_id;
  
  -- Log the repurposing event
  INSERT INTO logs(user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id,
    p_agent_id,
    'system',
    jsonb_build_object(
      'event', 'repurpose_phase',
      'agent_name', agent_name,
      'tool_name', p_tool_name,
      'description', p_description,
      'legion_phase', 'repurpose',
      'phase_order', 3
    ),
    'info'
  );
  
  RETURN true;
END;
$$;

-- Create function to simulate the REDEPLOY phase
CREATE OR REPLACE FUNCTION simulate_redeploy_phase(
  p_agent_id uuid,
  p_tool_name text,
  p_description text DEFAULT NULL
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
  
  -- Verify the agent belongs to the current user and get agent name
  SELECT agents.agent_name INTO agent_name
  FROM agents 
  WHERE agents.id = p_agent_id AND agents.user_id = current_user_id;
  
  IF agent_name IS NULL THEN
    RAISE EXCEPTION 'Agent not found or access denied';
  END IF;
  
  -- Update agent state to reflect redeployment phase (back to active)
  UPDATE agents
  SET current_state = 'deployed_' || p_tool_name,
      status = 'active'
  WHERE id = p_agent_id AND user_id = current_user_id;
  
  -- Log the redeployment event
  INSERT INTO logs(user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id,
    p_agent_id,
    'system',
    jsonb_build_object(
      'event', 'redeploy_phase',
      'agent_name', agent_name,
      'tool_name', p_tool_name,
      'description', p_description,
      'legion_phase', 'redeploy',
      'phase_order', 4
    ),
    'info'
  );
  
  RETURN true;
END;
$$;

-- Create function to get Legion Protocol phase history for an agent
CREATE OR REPLACE FUNCTION get_legion_phase_history(
  p_agent_id uuid,
  p_limit integer DEFAULT 50
) RETURNS TABLE (
  phase_time timestamptz,
  legion_phase text,
  phase_order integer,
  event_detail jsonb
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
    RAISE EXCEPTION 'User must be authenticated to view phase history';
  END IF;
  
  RETURN QUERY
  SELECT
    logs.created_at,
    (logs.detail->>'legion_phase')::text,
    (logs.detail->>'phase_order')::integer,
    logs.detail
  FROM logs
  WHERE logs.user_id = current_user_id
    AND logs.agent_id = p_agent_id
    AND logs.detail ? 'legion_phase'
  ORDER BY logs.created_at DESC
  LIMIT p_limit;
END;
$$;