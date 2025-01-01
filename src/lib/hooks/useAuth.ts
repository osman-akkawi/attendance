import { create } from 'zustand';
import { authService } from '../auth/authService';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { user } = await authService.signIn(email, password);
      if (!user) throw new Error('Authentication failed');
      set({ user, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      await authService.signOut();
      set({ user: null, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  checkUser: async () => {
    try {
      set({ loading: true, error: null });
      const user = await authService.getCurrentUser();
      set({ user, loading: false });
    } catch (error: any) {
      set({ error: error.message, user: null, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));