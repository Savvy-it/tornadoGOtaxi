import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User, UserRole } from '../types';

// IMPORTANT: Replace with your Supabase project URL and anon key.
// You can get these from your Supabase project settings > API.
// It's recommended to use environment variables for this in a real project.
const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-supabase-anon-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
  register: (fullName: string, email: string, phone: string, role: UserRole, password: string) => Promise<any>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) throw authError;
    if (!authData.user) throw new Error("Registration failed: no user returned.");
    
    // Insert user profile into 'users' table
    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      full_name: fullName,
      email,
      phone,
      role,
      rating: role === UserRole.DRIVER ? 5.0 : null,
    });

    if (profileError) {
      // Potentially delete the auth user if profile creation fails
      console.error("Error creating user profile:", profileError);
      throw profileError;
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
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
