
import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallback to hardcoded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pyrqqruqvvhwmgkhlhed.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cnFxcnVxdnZod21na2hsaGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTE1MzMsImV4cCI6MjA3OTU2NzUzM30.0i_zHPfL7KYc9VaU3FVbx8H7NufOgcbFa2E39GGdVts';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
