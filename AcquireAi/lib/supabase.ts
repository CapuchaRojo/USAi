import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hlskbmcsrcjobvknrrhj.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsc2tibWNzcmNqb2J2a25ycmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3NTQ3MjcsImV4cCI6MjA2NDMzMDcyN30.S3ejjjORIEeo2ssh0N_DSYXEbBNg-4CMJN6q98Ooa4w';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});