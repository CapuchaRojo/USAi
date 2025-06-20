/*
  # Agent Skill Management Functions

  1. New Functions
    - `update_agent_skill` - Allows agents to acquire new skills dynamically
    - `get_agent_skill_history` - Retrieves skill evolution history for an agent
    - `evolve_agent_skills` - Simulates skill evolution based on Legion Protocol

  2. Security
    - All functions use SECURITY DEFINER with proper user authentication
    - Row-level security enforced through user_id checks
    - Comprehensive logging of all skill changes

  3. Legion Protocol Integration
    - Skills acquisition logged as 'repurpose' phase
    - Skills evolution logged as 'redeploy' phase
    - Event tracking for audit and analysis
*/

-- Create the update_agent_skill function for dynamic skill acquisition
CREATE OR REPLACE FUNCTION update_agent_skill(
  agent_uuid UUID,
  skill_name TEXT,
  skill_value DOUBLE PRECISION
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_skills JSONB;
  current_user_id UUID;
  agent_name TEXT;
BEGIN
  -- Get the current authenticated user ID
  current_user_id := auth.uid();
  
  -- Ensure we have a valid user ID
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to update agent skills';
  END IF;
  
  -- Verify the agent belongs to the current user and get agent name
  SELECT agents.agent_name INTO agent_name
  FROM agents 
  WHERE agents.id = agent_uuid AND agents.user_id = current_user_id;
  
  IF agent_name IS NULL THEN
    RAISE EXCEPTION 'Agent not found or access denied';
  END IF;
  
  -- Update the agent's skills
  UPDATE agents
  SET skills = jsonb_set(
    COALESCE(skills, '{}'::jsonb), 
    ARRAY[skill_name], 
    to_jsonb(skill_value), 
    true
  )
  WHERE id = agent_uuid AND user_id = current_user_id
  RETURNING skills INTO updated_skills;
  
  -- Log the skill acquisition event
  INSERT INTO logs(user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id,
    agent_uuid, 
    'system', 
    jsonb_build_object(
      'event', 'skill_acquired',
      'agent_name', agent_name,
      'skill_name', skill_name,
      'skill_value', skill_value,
      'legion_phase', 'repurpose'
    ),
    'info'
  );
  
  RETURN updated_skills;
END;
$$;

-- Create function to get agent skill evolution history
CREATE OR REPLACE FUNCTION get_agent_skill_history(
  agent_uuid UUID,
  filter_skill_name TEXT DEFAULT NULL
) RETURNS TABLE (
  event_time TIMESTAMPTZ,
  skill_name TEXT,
  skill_value DOUBLE PRECISION,
  event_detail JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get the current authenticated user ID
  current_user_id := auth.uid();
  
  -- Ensure we have a valid user ID
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to view skill history';
  END IF;
  
  RETURN QUERY
  SELECT
    logs.created_at,
    (logs.detail->>'skill_name')::TEXT,
    (logs.detail->>'skill_value')::DOUBLE PRECISION,
    logs.detail
  FROM logs
  WHERE logs.user_id = current_user_id
    AND logs.agent_id = agent_uuid
    AND logs.detail->>'event' = 'skill_acquired'
    AND (filter_skill_name IS NULL OR logs.detail->>'skill_name' = filter_skill_name)
  ORDER BY logs.created_at DESC;
END;
$$;

-- Create function to simulate skill evolution based on Legion Protocol
CREATE OR REPLACE FUNCTION evolve_agent_skills(
  agent_uuid UUID,
  evolution_factor DOUBLE PRECISION DEFAULT 0.1
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_skills JSONB;
  evolved_skills JSONB := '{}'::jsonb;
  skill_key TEXT;
  skill_value DOUBLE PRECISION;
  new_value DOUBLE PRECISION;
  current_user_id UUID;
  agent_name TEXT;
BEGIN
  -- Get the current authenticated user ID
  current_user_id := auth.uid();
  
  -- Ensure we have a valid user ID
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to evolve agent skills';
  END IF;
  
  -- Get current skills and agent name
  SELECT agents.skills, agents.agent_name 
  INTO current_skills, agent_name
  FROM agents 
  WHERE agents.id = agent_uuid AND agents.user_id = current_user_id;
  
  IF agent_name IS NULL THEN
    RAISE EXCEPTION 'Agent not found or access denied';
  END IF;
  
  -- Evolve each skill
  FOR skill_key, skill_value IN SELECT * FROM jsonb_each_text(current_skills)
  LOOP
    -- Calculate evolved value (with some randomness)
    new_value := LEAST(1.0, (skill_value::DOUBLE PRECISION) + (random() * evolution_factor));
    evolved_skills := jsonb_set(evolved_skills, ARRAY[skill_key], to_jsonb(new_value), true);
  END LOOP;
  
  -- Update agent with evolved skills
  UPDATE agents
  SET skills = evolved_skills
  WHERE id = agent_uuid AND user_id = current_user_id;
  
  -- Log the evolution event
  INSERT INTO logs(user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id,
    agent_uuid,
    'system',
    jsonb_build_object(
      'event', 'skills_evolved',
      'agent_name', agent_name,
      'evolution_factor', evolution_factor,
      'previous_skills', current_skills,
      'evolved_skills', evolved_skills,
      'legion_phase', 'redeploy'
    ),
    'info'
  );
  
  RETURN evolved_skills;
END;
$$;