/*
  # Legion Protocol Simulation Functions

  1. New Features
    - Add status column to commands table
    - Create simulation functions for each Legion Protocol phase
    - Enable Emulate → Condense → Repurpose → Redeploy workflow

  2. Security
    - All functions use SECURITY DEFINER with auth.uid() checks
    - RLS policies ensure user isolation
*/

-- Add status column to commands table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'commands' AND column_name = 'status'
  ) THEN
    ALTER TABLE commands ADD COLUMN status text DEFAULT 'pending';
  END IF;
END $$;

-- Create skill management functions
CREATE OR REPLACE FUNCTION update_agent_skill(
  agent_uuid uuid,
  skill_name text,
  skill_value float
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
  current_skills jsonb;
  updated_skills jsonb;
BEGIN
  -- Get the current authenticated user ID
  current_user_id := auth.uid();
  
  -- Ensure we have a valid user ID
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to update agent skills';
  END IF;
  
  -- Validate skill value
  IF skill_value < 0 OR skill_value > 1 THEN
    RAISE EXCEPTION 'Skill value must be between 0 and 1';
  END IF;
  
  -- Get current skills
  SELECT skills INTO current_skills 
  FROM agents 
  WHERE id = agent_uuid AND user_id = current_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Agent not found or access denied';
  END IF;
  
  -- Update skills
  updated_skills := COALESCE(current_skills, '{}'::jsonb) || jsonb_build_object(skill_name, skill_value);
  
  -- Update agent
  UPDATE agents 
  SET skills = updated_skills
  WHERE id = agent_uuid AND user_id = current_user_id;
  
  -- Log the skill acquisition
  INSERT INTO logs (user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id,
    agent_uuid,
    'system',
    jsonb_build_object(
      'event', 'skill_acquired',
      'skill_name', skill_name,
      'skill_value', skill_value,
      'previous_skills', current_skills,
      'updated_skills', updated_skills
    ),
    'info'
  );
  
  RETURN updated_skills;
END;
$$;

CREATE OR REPLACE FUNCTION evolve_agent_skills(
  agent_uuid uuid,
  evolution_factor float DEFAULT 0.1
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
  current_skills jsonb;
  evolved_skills jsonb := '{}'::jsonb;
  skill_key text;
  skill_value float;
  new_value float;
BEGIN
  -- Get the current authenticated user ID
  current_user_id := auth.uid();
  
  -- Ensure we have a valid user ID
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to evolve agent skills';
  END IF;
  
  -- Validate evolution factor
  IF evolution_factor < 0 OR evolution_factor > 1 THEN
    RAISE EXCEPTION 'Evolution factor must be between 0 and 1';
  END IF;
  
  -- Get current skills
  SELECT skills INTO current_skills 
  FROM agents 
  WHERE id = agent_uuid AND user_id = current_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Agent not found or access denied';
  END IF;
  
  -- Evolve each skill
  FOR skill_key, skill_value IN SELECT * FROM jsonb_each_text(current_skills)
  LOOP
    -- Only evolve numeric skills
    IF skill_value ~ '^[0-9]*\.?[0-9]+$' THEN
      new_value := LEAST(1.0, skill_value::float + (random() * evolution_factor));
      evolved_skills := evolved_skills || jsonb_build_object(skill_key, new_value);
    ELSE
      -- Keep non-numeric skills as-is
      evolved_skills := evolved_skills || jsonb_build_object(skill_key, skill_value);
    END IF;
  END LOOP;
  
  -- Update agent
  UPDATE agents 
  SET skills = evolved_skills
  WHERE id = agent_uuid AND user_id = current_user_id;
  
  -- Log the evolution
  INSERT INTO logs (user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id,
    agent_uuid,
    'system',
    jsonb_build_object(
      'event', 'skills_evolved',
      'evolution_factor', evolution_factor,
      'previous_skills', current_skills,
      'evolved_skills', evolved_skills
    ),
    'info'
  );
  
  RETURN evolved_skills;
END;
$$;

-- Legion Protocol Phase 1: Emulate
CREATE OR REPLACE FUNCTION simulate_emulate_phase(
  p_agent_id uuid,
  p_module_name text,
  p_description text
)
RETURNS void
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
    RAISE EXCEPTION 'User must be authenticated to simulate emulate phase';
  END IF;
  
  -- Update agent state
  UPDATE agents 
  SET current_state = 'emulating ' || p_module_name
  WHERE id = p_agent_id AND user_id = current_user_id;
  
  -- Log the emulation
  INSERT INTO logs (user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id,
    p_agent_id,
    'system',
    jsonb_build_object(
      'event', 'emulate_phase',
      'module', p_module_name,
      'description', p_description,
      'phase', 'emulate'
    ),
    'info'
  );
END;
$$;

-- Legion Protocol Phase 2: Condense
CREATE OR REPLACE FUNCTION simulate_condense_phase(
  p_agent_id uuid,
  p_utility_name text,
  p_description text
)
RETURNS void
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
    RAISE EXCEPTION 'User must be authenticated to simulate condense phase';
  END IF;
  
  -- Update agent state
  UPDATE agents 
  SET current_state = 'condensing ' || p_utility_name
  WHERE id = p_agent_id AND user_id = current_user_id;
  
  -- Log the condensation
  INSERT INTO logs (user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id,
    p_agent_id,
    'system',
    jsonb_build_object(
      'event', 'condense_phase',
      'utility', p_utility_name,
      'description', p_description,
      'phase', 'condense'
    ),
    'info'
  );
END;
$$;

-- Legion Protocol Phase 3: Repurpose
CREATE OR REPLACE FUNCTION simulate_repurpose_phase(
  p_agent_id uuid,
  p_tool_name text,
  p_description text
)
RETURNS void
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
    RAISE EXCEPTION 'User must be authenticated to simulate repurpose phase';
  END IF;
  
  -- Update agent state
  UPDATE agents 
  SET current_state = 'repurposing ' || p_tool_name
  WHERE id = p_agent_id AND user_id = current_user_id;
  
  -- Create new command/tool
  INSERT INTO commands (name, description, script, owner_agent_id, user_id, status)
  VALUES (
    p_tool_name, 
    p_description, 
    'Generated tool from Legion Protocol repurpose phase',
    p_agent_id, 
    current_user_id,
    'pending'
  );
  
  -- Log the repurposing
  INSERT INTO logs (user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id,
    p_agent_id,
    'system',
    jsonb_build_object(
      'event', 'repurpose_phase',
      'tool', p_tool_name,
      'description', p_description,
      'phase', 'repurpose'
    ),
    'info'
  );
END;
$$;

-- Legion Protocol Phase 4: Redeploy
CREATE OR REPLACE FUNCTION simulate_redeploy_phase(
  p_agent_id uuid,
  p_tool_name text,
  p_description text
)
RETURNS void
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
    RAISE EXCEPTION 'User must be authenticated to simulate redeploy phase';
  END IF;
  
  -- Update agent state
  UPDATE agents 
  SET current_state = 'redeploying ' || p_tool_name
  WHERE id = p_agent_id AND user_id = current_user_id;
  
  -- Activate the tool
  UPDATE commands 
  SET status = 'active'
  WHERE name = p_tool_name AND owner_agent_id = p_agent_id AND user_id = current_user_id;
  
  -- Log the redeployment
  INSERT INTO logs (user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id,
    p_agent_id,
    'system',
    jsonb_build_object(
      'event', 'redeploy_phase',
      'tool', p_tool_name,
      'description', p_description,
      'phase', 'redeploy'
    ),
    'info'
  );
END;
$$;