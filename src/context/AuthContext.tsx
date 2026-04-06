import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: 'admin' | 'customer' | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<'admin' | 'customer' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        console.log('🔍 AuthContext: Checking initial session...');
        const { data: { session: authSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ AuthContext: getSession error:', error.message);
          throw error;
        }

        if (authSession) {
          console.log('✅ AuthContext: Session found for user:', authSession.user.email);
          setSession(authSession);
          setUser(authSession.user);
          
          // Fetch user role from users table
          console.log('🔍 AuthContext: Fetching role for user:', authSession.user.id);
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', authSession.user.id)
            .single();
          
          if (userData) {
            console.log('✅ AuthContext: Role found:', userData.role);
            setRole(userData.role as 'admin' | 'customer');
          } else {
            console.warn('⚠️ AuthContext: No role found in users table, defaulting to customer');
          }
        } else {
          console.log('ℹ️ AuthContext: No active session found');
        }
      } catch (error) {
        console.error('❌ AuthContext: Fatal initialization error:', error);
      } finally {
        console.log('🏁 AuthContext: Initialization complete, setting loading=false');
        setLoading(false);
      }
    };

    checkSession();

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, authSession) => {
      setSession(authSession);
      setUser(authSession?.user || null);

      if (authSession?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', authSession.user.id)
          .single();
        
        setRole(userData?.role as 'admin' | 'customer' || 'customer');
      } else {
        setRole(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 AuthContext: Attempting sign in with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('❌ AuthContext: Supabase auth error:', error.message);
        throw error;
      }
      
      console.log('✅ AuthContext: Sign in successful, user:', data.user?.email);
    } catch (error) {
      console.error('❌ AuthContext: Sign in failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
    setRole(null);
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // Create user record in users table
    if (authData.user) {
      const { error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email,
            full_name: fullName,
            role: 'customer',
          },
        ]);

      if (userError) throw userError;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
