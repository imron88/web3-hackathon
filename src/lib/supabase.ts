import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Frontend (Vite) must use import.meta.env VITE_* variables.
// Do NOT import or use `dotenv` here — that runs at build/runtime and will throw in browsers.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables for frontend. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined in your .env (and prefixed with VITE_).'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);