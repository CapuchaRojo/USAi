/*
  # Create Command Management System

  1. New Functions
    - `create_command` - Register new agent capabilities as callable commands
    - `get_agent_commands` - Retrieve commands for specific agents
    - `execute_command` - Log command execution events

  2. Security
    - Enable RLS on commands table
    - Add policies for authenticated users to manage their own commands
    - Log all command operations for audit trail

  3. Integration
    - Commands table links to agents table via owner_agent_id
    - Comprehensive logging for all command operations
    - Support for dynamic function registration
*/

-- Create function to register new commands from agent capabilities
CREATE OR REPLACE FUNCTION create_command(
  p_name text,
  p_description text DEFAULT NULL,
  p_script jsonb DEFAULT '{}'::jsonb,
  p_owner_agent_id uuid DEFAULT NULL,
  p_user_id uuid DEFAULT auth.uid()
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_command_id uuid;
  current_user_id uuid;
  agent_name text;
BEGIN
  -- Get the current authenticated user ID
  current_user_id := auth.uid();
  
  -- Ensure we have a valid user ID
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to create commands';
  END IF;
  
  -- Validate that user can only create commands for themselves
  IF current_user_id != p_user_id THEN
    RAISE EXCEPTION 'User can only create commands for themselves';
  END IF;
  
  -- If owner_agent_id is provided, verify the agent belongs to the user
  IF p_owner_agent_id IS NOT NULL THEN
    SELECT agents.agent_name INTO agent_name
    FROM agents 
    WHERE agents.id = p_owner_agent_id AND agents.user_id = current_user_id;
    
    IF agent_name IS NULL THEN
      RAISE EXCEPTION 'Agent not found or access denied';
    END IF;
  END IF;
  
  -- Check if command with same name already exists for this user
  IF EXISTS (
    SELECT 1 FROM commands 
    WHERE name = p_name AND user_id = current_user_id
  ) THEN
    RAISE EXCEPTION 'Command with name "%" already exists for this user', p_name;
  END IF;
  
  -- Insert the new command
  INSERT INTO commands (
    name,
    description,
    script,
    owner_agent_id,
    user_id,
    status
  ) VALUES (
    p_name,
    p_description,
    p_script,
    p_owner_agent_id,
    current_user_id,
    'active'
  ) RETURNING id INTO new_command_id;
  
  -- Log the command creation event
  INSERT INTO logs(user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id,
    p_owner_agent_id,
    'system',
    jsonb_build_object(
      'event', 'command_created',
      'command_name', p_name,
      'command_id', new_command_id,
      'agent_name', agent_name,
      'legion_phase', 'redeploy'
    ),
    'info'
  );
  
  RETURN new_command_id;
END;
$$;

-- Create function to get commands for a specific agent
CREATE OR REPLACE FUNCTION get_agent_commands(
  p_agent_id uuid
) RETURNS TABLE (
  command_id uuid,
  command_name text,
  command_description text,
  command_script jsonb,
  command_status text,
  created_at timestamptz
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
    RAISE EXCEPTION 'User must be authenticated to view commands';
  END IF;
  
  RETURN QUERY
  SELECT
    commands.id,
    commands.name,
    commands.description,
    commands.script,
    commands.status,
    commands.created_at
  FROM commands
  WHERE commands.owner_agent_id = p_agent_id
    AND commands.user_id = current_user_id
  ORDER BY commands.created_at DESC;
END;
$$;

-- Create function to log command execution
CREATE OR REPLACE FUNCTION execute_command(
  p_command_id uuid,
  p_execution_context jsonb DEFAULT '{}'::jsonb
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
  command_name text;
  agent_id uuid;
BEGIN
  -- Get the current authenticated user ID
  current_user_id := auth.uid();
  
  -- Ensure we have a valid user ID
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to execute commands';
  END IF;
  
  -- Get command details and verify ownership
  SELECT commands.name, commands.owner_agent_id
  INTO command_name, agent_id
  FROM commands 
  WHERE commands.id = p_command_id AND commands.user_id = current_user_id;
  
  IF command_name IS NULL THEN
    RAISE EXCEPTION 'Command not found or access denied';
  END IF;
  
  -- Log the command execution
  INSERT INTO logs(user_id, agent_id, direction, detail, level)
  VALUES (
    current_user_id,
    agent_id,
    'system',
    jsonb_build_object(
      'event', 'command_executed',
      'command_name', command_name,
      'command_id', p_command_id,
      'execution_context', p_execution_context,
      'legion_phase', 'execute'
    ),
    'info'
  );
  
  RETURN true;
END;
$$;

-- Ensure RLS is enabled on commands table
ALTER TABLE commands ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for commands
DROP POLICY IF EXISTS "Users can manage their own commands" ON commands;

CREATE POLICY "Users can manage their own commands"
ON commands
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);