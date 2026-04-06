import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
const PLACEHOLDER_URL = 'https://xxxxx.supabase.co';

// Security: Only log presence, not the full values in non-dev environments
if (import.meta.env.DEV) {
  console.log('🔧 Supabase Connection:', {
    url: supabaseUrl ? 'Configured' : 'MISSING',
    key: supabaseAnonKey ? 'Configured' : 'MISSING',
  });
}

const isValidSupabaseUrl = (value: string) => {
  if (!value || value === PLACEHOLDER_URL) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && parsed.hostname.length > 0;
  } catch {
    return false;
  }
};

// Check if Supabase is properly configured
const isConfigured = Boolean(supabaseAnonKey) && isValidSupabaseUrl(supabaseUrl);

if (!isConfigured) {
  console.error(
    '\n🚨 SUPABASE CONNECTION ERROR 🚨\n' +
    'The application cannot connect to Supabase because the environment variables are missing or invalid.\n' +
    'Please check your .env.local file. You need:\n' +
    'VITE_SUPABASE_URL=...\n' +
    'VITE_SUPABASE_ANON_KEY=...\n' +
    'The app is forcibly switching to Fallback/Mock Mode!\n'
  );
}

const createDummyClient = () => {
  const result = Promise.resolve({ data: null, error: new Error('Supabase not configured') });
  const builder: any = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    upsert: () => builder,
    eq: () => builder,
    neq: () => builder,
    gt: () => builder,
    gte: () => builder,
    lt: () => builder,
    lte: () => builder,
    like: () => builder,
    ilike: () => builder,
    in: () => builder,
    contains: () => builder,
    order: () => builder,
    limit: () => builder,
    maybeSingle: () => result,
    single: () => result,
    then: result.then.bind(result),
    catch: result.catch.bind(result),
    finally: result.finally.bind(result),
  };

  return {
    from: () => builder,
    channel: () => ({
      on: function () { return this; },
      subscribe: () => ({ unsubscribe: () => undefined }),
    }),
    removeChannel: () => undefined,
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => undefined } } }),
      signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
      signOut: async () => ({ error: null }),
    },
  };
};

export const supabase = isConfigured ? (() => {
  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
        storageKey: `sb-${new URL(supabaseUrl).hostname}-auth-token`,
      }
    });
  } catch (error) {
    console.warn('🔧 Failed to create Supabase client, using fallback-safe client', error);
    return createDummyClient();
  }
})() : createDummyClient();
