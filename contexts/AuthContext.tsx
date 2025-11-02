import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, UserRole } from '../types';

// IMPORTANT: Replace these placeholders with your actual Supabase project URL and Anon Key.
// You can find these in your Supabase project's API settings.
// Fix: Explicitly type constants as string to prevent TypeScript from inferring a too-specific literal type, which causes a comparison error below.
const SUPABASE_URL: string = "https://yuijroicdcookfymaaoj.supabase.co";
const SUPABASE_ANON_KEY: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1aWpyb2ljZGNvb2tmeW1hYW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNDUyNzcsImV4cCI6MjA3NzYyMTI3N30.KLAMgtLT5QuOJT_7vK63ti__S4hQhqMzYQtaKX3pWuQ";

let supabase: SupabaseClient;
let supabaseInitializationError = false;

if (SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL !== "https://your-project-url.supabase.co") {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.error("Supabase URL or Anon Key is missing or using placeholder values. Please set the actual SUPABASE_URL and SUPABASE_ANON_KEY in contexts/AuthContext.tsx.");
  supabaseInitializationError = true;
  // Provide a dummy client to avoid crashing on import, but the UI will be blocked.
  supabase = {} as SupabaseClient;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
  register: (fullName: string, email: string, phone: string, role: UserRole, password: string) => Promise<any>;
  resendConfirmationEmail: (email: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  if (supabaseInitializationError) {
    return (
      <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto bg-brand-dark-light rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Configuration Error</h1>
          <p className="text-brand-text-secondary">Supabase URL and Anon Key are not configured correctly.</p>
          <p className="text-brand-text-secondary mt-4 text-sm">Please update the placeholder values in <code className="bg-brand-dark px-1 py-0.5 rounded">contexts/AuthContext.tsx</code> with your actual Supabase credentials.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: userProfile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
        } else {
          setUser(userProfile as User);
        }
      }
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: userProfile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (error) console.error('Error fetching user profile:', error);
        else setUser(userProfile as User);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };
  
  const register = async (fullName: string, email: string, phone: string, role: UserRole, password: string) => {
    // The original implementation attempted a client-side insert into the 'users' table
    // immediately after sign-up. This is prone to failures from restrictive Row Level
    // Security (RLS) policies or race conditions with database triggers.
    //
    // This updated implementation follows a more robust, standard Supabase pattern:
    // It passes the user's profile data (full name, phone, role) within the `signUp` call
    // itself, using the `options.data` field. This delegates the responsibility of profile
    // creation to a server-side database trigger that listens for new users in `auth.users`.
    // This approach is more reliable, secure, and transactional, resolving the root cause
    // of the "Error creating user profile" error.
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          role,
        },
      },
    });

    if (authError) {
        console.error("Error during sign up:", authError);
        throw authError;
    }

    if (!authData.user) {
        throw new Error("Registration failed: no user returned from Supabase.");
    }
  };
  
  const resendConfirmationEmail = async (email: string) => {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) throw error;
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, register, resendConfirmationEmail, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export supabase client to be used in other contexts/pages
export { supabase };