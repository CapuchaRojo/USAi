// âœ… File: lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("âŒ Missing Supabase environment variables. Check .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
