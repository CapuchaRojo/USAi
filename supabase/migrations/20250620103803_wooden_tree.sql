-- Drop existing functions first to avoid conflicts
DROP FUNCTION IF EXISTS simulate_emulate_phase(uuid, text, text);
DROP FUNCTION IF EXISTS simulate_condense_phase(uuid, text, text);
DROP FUNCTION IF EXISTS simulate_repurpose_phase(uuid, text, text);
DROP FUNCTION IF EXISTS simulate_redeploy_phase(uuid, text, text);
DROP FUNCTION IF EXISTS get_legion_phase_history(uuid, integer);

-- Create function to simulate the EMULATE phase
CREATE OR REPLACE FUNCTION simulate_emulate_phase(
  p_agent_id uuid,
  p_module_name text,
  p_description text DEFAULT NULL
) RETURNS TABLE (
  status_code integer,
  result jsonb
)
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
    RETURN QUERY SELECT 401, jsonb_build_object('error', 'User must be authenticated to simulate emulate phase');
    RETURN;
  END IF;
  
  -- Validate inputs
  IF p_agent_id IS NULL OR p_module_name IS NULL THEN
    RETURN QUERY SELECT 400, jsonb_build_object('error', 'Missing required parameters: agent_id and module_name');
    RETURN;
  END IF;
  
  -- Verify the agent belongs to the current user and get agent name
  SELECT agents.agent_name INTO agent_name
  FROM agents 
  WHERE agents.id = p_agent_id AND agents.user_id = current_user_id;
  
  IF agent_name IS NULL THEN
    RETURN QUERY SELECT 404, jsonb_build_object('error', 'Agent not found or access denied');
    RETURN;
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
      'description', COALESCE(p_description, 'Emulating ' || p_module_name || ' module'),
      'legion_phase', 'emulate',
      'phase_order', 1,
      'timestamp', NOW()
    ),
    'info'
  );
  
  -- Return success response
  RETURN QUERY SELECT 
    200, 
    jsonb_build_object(
      'status', 'success',
      'agent_id', p_agent_id,
      'agent_name', agent_name,
      'phase', 'emulate',
      'module_name', p_module_name,
      'description', COALESCE(p_description, 'Emulating ' || p_module_name || ' module'),
      'new_state', 'emulating_' || p_module_name,
      'timestamp', NOW()
    );

EXCEPTION WHEN OTHERS THEN
  RETURN QUERY SELECT 500, jsonb_build_object('error', SQLERRM, 'detail', 'Internal server error during emulation phase');
END;
$$;

-- Create function to simulate the CONDENSE phase
CREATE OR REPLACE FUNCTION simulate_condense_phase(
  p_agent_id uuid,
  p_utility_name text,
  p_description text DEFAULT NULL
) RETURNS TABLE (
  status_code integer,
  result jsonb
)
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
    RETURN QUERY SELECT 401, jsonb_build_object('error', 'User must be authenticated to simulate condense phase');
    RETURN;
  END IF;
  
  -- Validate inputs
  IF p_agent_id IS NULL OR p_utility_name IS NULL THEN
    RETURN QUERY SELECT 400, jsonb_build_object('error', 'Missing required parameters: agent_id and utility_name');
    RETURN;
  END IF;
  
  -- Verify the agent belongs to the current user and get agent name
  SELECT agents.agent_name INTO agent_name
  FROM agents 
  WHERE agents.id = p_agent_id AND agents.user_id = current_user_id;
  
  IF agent_name IS NULL THEN
    RETURN QUERY SELECT 404, jsonb_build_object('error', 'Agent not found or access denied');
    RETURN;
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
      'description', COALESCE(p_description, 'Condensing ' || p_utility_name || ' utility'),
      'legion_phase', 'condense',
      'phase_order', 2,
      'timestamp', NOW()
    ),
    'info'
  );
  
  -- Return success response
  RETURN QUERY SELECT 
    200, 
    jsonb_build_object(
      'status', 'success',
      'agent_id', p_agent_id,
      'agent_name', agent_name,
      'phase', 'condense',
      'utility_name', p_utility_name,
      'description', COALESCE(p_description, 'Condensing ' || p_utility_name || ' utility'),
      'new_state', 'condensing_' || p_utility_name,
      'timestamp', NOW()
    );

EXCEPTION WHEN OTHERS THEN
  RETURN QUERY SELECT 500, jsonb_build_object('error', SQLERRM, 'detail', 'Internal server error during condensation phase');
END;
$$;

-- Create function to simulate the REPURPOSE phase
CREATE OR REPLACE FUNCTION simulate_repurpose_phase(
  p_agent_id uuid,
  p_tool_name text,
  p_description text DEFAULT NULL
) RETURNS TABLE (
  status_code integer,
  result jsonb
)
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
    RETURN QUERY SELECT 401, jsonb_build_object('error', 'User must be authenticated to simulate repurpose phase');
    RETURN;
  END IF;
  
  -- Validate inputs
  IF p_agent_id IS NULL OR p_tool_name IS NULL THEN
    RETURN QUERY SELECT 400, jsonb_build_object('error', 'Missing required parameters: agent_id and tool_name');
    RETURN;
  END IF;
  
  -- Verify the agent belongs to the current user and get agent name
  SELECT agents.agent_name INTO agent_name
  FROM agents 
  WHERE agents.id = p_agent_id AND agents.user_id = current_user_id;
  
  IF agent_name IS NULL THEN
    RETURN QUERY SELECT 404, jsonb_build_object('error', 'Agent not found or access denied');
    RETURN;
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
      'description', COALESCE(p_description, 'Repurposing as ' || p_tool_name || ' tool'),
      'legion_phase', 'repurpose',
      'phase_order', 3,
      'timestamp', NOW()
    ),
    'info'
  );
  
  -- Return success response
  RETURN QUERY SELECT 
    200, 
    jsonb_build_object(
      'status', 'success',
      'agent_id', p_agent_id,
      'agent_name', agent_name,
      'phase', 'repurpose',
      'tool_name', p_tool_name,
      'description', COALESCE(p_description, 'Repurposing as ' || p_tool_name || ' tool'),
      'new_state', 'repurposing_' || p_tool_name,
      'timestamp', NOW()
    );

EXCEPTION WHEN OTHERS THEN
  RETURN QUERY SELECT 500, jsonb_build_object('error', SQLERRM, 'detail', 'Internal server error during repurpose phase');
END;
$$;

-- Create function to simulate the REDEPLOY phase
CREATE OR REPLACE FUNCTION simulate_redeploy_phase(
  p_agent_id uuid,
  p_tool_name text,
  p_description text DEFAULT NULL
) RETURNS TABLE (
  status_code integer,
  result jsonb
)
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
    RETURN QUERY SELECT 401, jsonb_build_object('error', 'User must be authenticated to simulate redeploy phase');
    RETURN;
  END IF;
  
  -- Validate inputs
  IF p_agent_id IS NULL OR p_tool_name IS NULL THEN
    RETURN QUERY SELECT 400, jsonb_build_object('error', 'Missing required parameters: agent_id and tool_name');
    RETURN;
  END IF;
  
  -- Verify the agent belongs to the current user and get agent name
  SELECT agents.agent_name INTO agent_name
  FROM agents 
  WHERE agents.id = p_agent_id AND agents.user_id = current_user_id;
  
  IF agent_name IS NULL THEN
    RETURN QUERY SELECT 404, jsonb_build_object('error', 'Agent not found or access denied');
    RETURN;
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
      'description', COALESCE(p_description, 'Redeploying ' || p_tool_name || ' tool'),
      'legion_phase', 'redeploy',
      'phase_order', 4,
      'timestamp', NOW()
    ),
    'info'
  );
  
  -- Return success response
  RETURN QUERY SELECT 
    200, 
    jsonb_build_object(
      'status', 'success',
      'agent_id', p_agent_id,
      'agent_name', agent_name,
      'phase', 'redeploy',
      'tool_name', p_tool_name,
      'description', COALESCE(p_description, 'Redeploying ' || p_tool_name || ' tool'),
      'new_state', 'deployed_' || p_tool_name,
      'timestamp', NOW()
    );

EXCEPTION WHEN OTHERS THEN
  RETURN QUERY SELECT 500, jsonb_build_object('error', SQLERRM, 'detail', 'Internal server error during redeploy phase');
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

-- Create function to execute full Legion Protocol cycle
CREATE OR REPLACE FUNCTION execute_legion_cycle(
  p_agent_id uuid,
  p_module_name text,
  p_utility_name text DEFAULT NULL,
  p_tool_name text DEFAULT NULL,
  p_description text DEFAULT NULL
) RETURNS TABLE (
  phase text,
  status_code integer,
  result jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
  agent_name text;
  emulate_result record;
  condense_result record;
  repurpose_result record;
  redeploy_result record;
BEGIN
  -- Get the current authenticated user ID
  current_user_id := auth.uid();
  
  -- Ensure we have a valid user ID
  IF current_user_id IS NULL THEN
    RETURN QUERY SELECT 'error'::text, 401, jsonb_build_object('error', 'User must be authenticated');
    RETURN;
  END IF;
  
  -- Validate inputs
  IF p_agent_id IS NULL OR p_module_name IS NULL THEN
    RETURN QUERY SELECT 'error'::text, 400, jsonb_build_object('error', 'Missing required parameters');
    RETURN;
  END IF;
  
  -- Set defaults
  p_utility_name := COALESCE(p_utility_name, p_module_name || '_utility');
  p_tool_name := COALESCE(p_tool_name, p_module_name || '_tool');
  
  -- Execute EMULATE phase
  SELECT * INTO emulate_result FROM simulate_emulate_phase(p_agent_id, p_module_name, p_description);
  RETURN QUERY SELECT 'emulate'::text, emulate_result.status_code, emulate_result.result;
  
  -- If emulate failed, stop here
  IF emulate_result.status_code != 200 THEN
    RETURN;
  END IF;
  
  -- Execute CONDENSE phase
  SELECT * INTO condense_result FROM simulate_condense_phase(p_agent_id, p_utility_name, p_description);
  RETURN QUERY SELECT 'condense'::text, condense_result.status_code, condense_result.result;
  
  -- If condense failed, stop here
  IF condense_result.status_code != 200 THEN
    RETURN;
  END IF;
  
  -- Execute REPURPOSE phase
  SELECT * INTO repurpose_result FROM simulate_repurpose_phase(p_agent_id, p_tool_name, p_description);
  RETURN QUERY SELECT 'repurpose'::text, repurpose_result.status_code, repurpose_result.result;
  
  -- If repurpose failed, stop here
  IF repurpose_result.status_code != 200 THEN
    RETURN;
  END IF;
  
  -- Execute REDEPLOY phase
  SELECT * INTO redeploy_result FROM simulate_redeploy_phase(p_agent_id, p_tool_name, p_description);
  RETURN QUERY SELECT 'redeploy'::text, redeploy_result.status_code, redeploy_result.result;
  
  -- Log completion of full cycle
  INSERT INTO logs(user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id,
    p_agent_id,
    'system',
    jsonb_build_object(
      'event', 'legion_cycle_complete',
      'module_name', p_module_name,
      'utility_name', p_utility_name,
      'tool_name', p_tool_name,
      'description', p_description,
      'timestamp', NOW()
    ),
    'info'
  );

EXCEPTION WHEN OTHERS THEN
  RETURN QUERY SELECT 'error'::text, 500, jsonb_build_object('error', SQLERRM, 'detail', 'Internal server error during Legion cycle');
END;
$$;