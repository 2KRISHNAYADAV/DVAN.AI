
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextProps {
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, metadata: { full_name: string; profession: string; gender: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error?: string; needsEmailVerification?: boolean }>;
  signOut: () => Promise<void>;
  user: any;
  error: string | null;
  resetError: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Reset error helper function
  const resetError = () => setError(null);

  useEffect(() => {
    // Initialize session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata: { full_name: string; profession: string; gender: string }) => {
    try {
      setError(null);
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth`,
        }
      });

      if (error) {
        throw error;
      }
      
      // Auto login after signup
      if (data && data.user) {
        await signIn(email, password);
      }
    } catch (error: any) {
      setError(error.message);
      console.error('Error signing up:', error.message);
      throw error;
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        
        // Ignore email confirmation errors and proceed with login
        if (error.message.includes('Email not confirmed')) {
          // Try to sign in anyway
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (signInError) {
            return { error: signInError.message };
          }
          
          // If we get here, the sign-in was successful despite the email not being confirmed
          navigate('/');
          return {};
        }
        
        return { error: error.message };
      }
      
      // Successfully signed in, navigate to homepage
      navigate('/');
      return {}; // Success case, no errors
    } catch (error: any) {
      setError(error.message);
      console.error('Error signing in:', error);
      return { error: error.message };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      navigate('/auth');
    } catch (error: any) {
      setError(error.message);
      console.error('Error signing out:', error.message);
    }
  };

  const value = {
    session,
    user,
    isLoading,
    signUp,
    signIn,
    signOut,
    error,
    resetError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
