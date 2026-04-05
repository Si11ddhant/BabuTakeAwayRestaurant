import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Security: Only log presence, not the full values in non-dev environments
if (import.meta.env.DEV) {
  console.log('🔧 Supabase Connection:', {
    url: supabaseUrl ? 'Configured' : 'MISSING',
    key: supabaseAnonKey ? 'Configured' : 'MISSING',
  });
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env.local file.'
  );
}

// Ensure URL is valid to prevent silent failures
try {
  new URL(supabaseUrl);
} catch (e) {
  throw new Error('Invalid VITE_SUPABASE_URL. It must be a full URL (e.g., https://xyz.supabase.co)');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    // Explicitly set the lock timeout to avoid the error when multiple tabs are open
    // or when the lock is stolen by another request
    storageKey: `sb-${new URL(supabaseUrl).hostname}-auth-token`,
  }
});
