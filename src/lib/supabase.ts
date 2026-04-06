import { createClient } from '@supabase/supabase-js';

// 1. Fetch directly from the environment file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Strict Check: If they are missing, throw a massive, unmissable error
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('xxxxx')) {
  throw new Error(
    "🚨 MISSING SUPABASE CREDENTIALS 🚨\n" +
    "You must create a .env.local file in the root of your project with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

// 3. Create the real, pure Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false, // Kept false to prevent the guest-checkout hanging bug!
    detectSessionInUrl: true,
    storage: window.localStorage,
  }
});