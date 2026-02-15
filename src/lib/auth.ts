import { supabase } from './supabase';
import { User } from './types';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signUp(email: string, password: string, name: string, role: string = 'viewer') {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role, },
    },
  });
  if (authError) throw authError;
  if (authData.user?.id) {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  return authData;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  if (error && error.code === 'PGRST116') {
    return {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || '',
      role: user.user_metadata?.role || 'viewer',
      created_at: user.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
  if (error) throw error;
  return profile;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = await getCurrentUser();
      callback(user);
    } else {
      callback(null);
    }
  });
}