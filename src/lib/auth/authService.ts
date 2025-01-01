import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../database.types';

class AuthService {
  private supabase: SupabaseClient<Database>;

  constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password: password.trim(),
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  async getCurrentUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser();
    if (error) {
      throw new Error(error.message);
    }
    return user;
  }
}

export const authService = new AuthService();