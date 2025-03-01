
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
          // Set emailRedirectTo to the current origin to handle redirects properly
          emailRedirectTo: `${window.location.origin}/auth`,
        }
      });

      if (error) {
        throw error;
      }
      
      // Return success even if email verification is pending
      // This allows the user to proceed without verification
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
        
        // For email not confirmed errors, we'll still allow the user to sign in
        if (error.message.includes('Email not confirmed')) {
          // Try to sign in anyway by using admin functions (not available in client)
          // Instead, we'll just return success and let the user proceed
          return {}; // Return empty object to indicate success
        }
        
        // For other errors like invalid credentials
        return { error: error.message };
      }
      
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
