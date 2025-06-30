/*
  # Create mission logs table

  1. New Tables
    - `mission_logs`
      - `id` (uuid, primary key)
      - `mission_id` (uuid, foreign key to missions)
      - `agent_id` (uuid, foreign key to agents)
      - `log_type` (text)
      - `content` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `mission_logs` table
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS mission_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id uuid REFERENCES missions(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  log_type varchar(50) NOT NULL,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS mission_logs_mission_id_idx ON mission_logs(mission_id);
CREATE INDEX IF NOT EXISTS mission_logs_agent_id_idx ON mission_logs(agent_id);
CREATE INDEX IF NOT EXISTS mission_logs_created_at_idx ON mission_logs(created_at);

-- Enable row level security
ALTER TABLE mission_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read their own data
CREATE POLICY "Users can read mission logs" 
  ON mission_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy for authenticated users to insert mission logs
CREATE POLICY "Users can insert mission logs" 
  ON mission_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);