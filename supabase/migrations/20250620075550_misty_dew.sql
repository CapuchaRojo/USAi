@@ .. @@
+-- Drop existing functions before recreating them to allow return type changes
+DROP FUNCTION IF EXISTS simulate_emulate_phase(uuid,text,text);
+DROP FUNCTION IF EXISTS simulate_condense_phase(uuid,text,text);
+DROP FUNCTION IF EXISTS simulate_repurpose_phase(uuid,text,text);
+DROP FUNCTION IF EXISTS simulate_redeploy_phase(uuid,text,text);
+
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