import { create } from 'zustand';
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkUser: () => Promise<void>;
}

// Add rate limiting for authentication attempts
const rateLimitMap = new Map<string, { attempts: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email: string, password: string) => {
    // Check rate limiting
    const userAttempts = rateLimitMap.get(email) || { attempts: 0, lastAttempt: 0 };
    const now = Date.now();

    if (userAttempts.attempts >= MAX_ATTEMPTS && 
        now - userAttempts.lastAttempt < LOCKOUT_DURATION) {
      throw new Error('Too many login attempts. Please try again later.');
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        // Update rate limiting on failed attempts
        rateLimitMap.set(email, {
          attempts: userAttempts.attempts + 1,
          lastAttempt: now,
        });
        throw error;
      }

      // Reset rate limiting on successful login
      rateLimitMap.delete(email);
      set({ user: data.user });
    } catch (error) {
      throw error;
    }
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },
  checkUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      set({ user, loading: false });
    } catch (error) {
      set({ user: null, loading: false });
    }
  },
}));