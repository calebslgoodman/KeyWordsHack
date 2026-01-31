import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const useEmailAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase not configured. Use demo mode instead.');
      return { success: false };
    }

    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'mealswipe://auth/callback',
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user && !data.session) {
        // Email confirmation required
        setMessage('Check your email for a verification link!');
        return { success: true, needsVerification: true };
      }

      return { success: true, needsVerification: false };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase not configured. Use demo mode instead.');
      return { success: false };
    }

    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (email: string) => {
    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase not configured.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (resendError) {
        throw resendError;
      }

      setMessage('Verification email sent! Check your inbox.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase not configured.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'mealswipe://auth/reset-password',
      });

      if (resetError) {
        throw resetError;
      }

      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setMessage(null);
  };

  return {
    signUp,
    signIn,
    resendVerification,
    resetPassword,
    loading,
    error,
    message,
    clearMessages,
  };
};
