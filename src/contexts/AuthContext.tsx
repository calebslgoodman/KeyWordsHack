import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { hasCompletedOnboarding } from '../lib/api';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  hasOnboarded: boolean;
  signOut: () => Promise<void>;
  setDemoUser: () => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isConfigured: false,
  hasOnboarded: false,
  signOut: async () => {},
  setDemoUser: () => {},
  completeOnboarding: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  const checkOnboardingStatus = async (userId: string) => {
    const completed = await hasCompletedOnboarding(userId);
    setHasOnboarded(completed);
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      // Demo mode - no Supabase configured
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await checkOnboardingStatus(session.user.id);
      }

      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await checkOnboardingStatus(session.user.id);
        } else {
          setHasOnboarded(false);
        }

        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setHasOnboarded(false);
  };

  // Demo mode: set a fake user for testing UI
  const setDemoUser = () => {
    setUser({
      id: 'demo-user',
      email: 'demo@mealswipe.app',
      app_metadata: {},
      user_metadata: { name: 'Demo User' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User);
    // Demo users haven't onboarded
    setHasOnboarded(false);
  };

  const completeOnboarding = () => {
    setHasOnboarded(true);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isConfigured: isSupabaseConfigured,
      hasOnboarded,
      signOut,
      setDemoUser,
      completeOnboarding,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
