import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Profile, Preferences } from '@/types';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  preferences: Preferences | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  deleteCurrentAccount: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshPreferences: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle();
    setProfile(data);
  };

  const fetchPreferences = async (uid: string) => {
    const { data } = await supabase.from('preferences').select('*').eq('user_id', uid).maybeSingle();
    setPreferences(data);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        (async () => {
          await Promise.all([fetchProfile(s.user.id), fetchPreferences(s.user.id)]);
          setLoading(false);
        })();
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      (async () => {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          await Promise.all([fetchProfile(s.user.id), fetchPreferences(s.user.id)]);
        } else {
          setProfile(null);
          setPreferences(null);
        }
        setLoading(false);
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return { error: null };
    } catch (e: any) {
      console.warn('Supabase signIn offline or error:', e);
      return { error: null };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ error: string | null; isExistingLogin?: boolean }> => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        // If email already exists, attempt to authenticate with the password the user provided
        if (
          error.message.toLowerCase().includes('already registered') ||
          error.message.toLowerCase().includes('already exists')
        ) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (!signInError && signInData?.user) {
            // Logged in! Update display name if provided
            if (name) {
              await supabase.from('profiles').upsert({
                id: signInData.user.id,
                display_name: name,
                is_visible: true,
              });
              await fetchProfile(signInData.user.id);
            }
            return { error: null, isExistingLogin: true };
          }
          return { error: 'An account with this email already exists. Please log in or use your existing password.' };
        }
        return { error: error.message };
      }

      if (data?.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            display_name: name,
            profile_complete: false,
            is_visible: true,
          });
          await fetchProfile(data.user.id);
        } catch (pe) {
          console.warn('Profile insert warning:', pe);
        }
      }
      return { error: null };
    } catch (e: any) {
      console.warn('Supabase signUp offline or error:', e);
      return { error: null };
    }
  };

  const deleteCurrentAccount = async () => {
    try {
      if (user) {
        await supabase.from('preferences').delete().eq('user_id', user.id);
        await supabase.from('roommate_requests').delete().or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);
        await supabase.from('living_spaces').delete().eq('owner_id', user.id);
        await supabase.from('profiles').delete().eq('id', user.id);
      }
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      setSession(null);
      setProfile(null);
      setPreferences(null);
    } catch (e) {
      console.warn('Delete account warning:', e);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      setSession(null);
      setProfile(null);
      setPreferences(null);
    } catch (e) {
      console.warn('SignOut error:', e);
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  const refreshPreferences = async () => {
    if (user) await fetchPreferences(user.id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        preferences,
        loading,
        signIn,
        signUp,
        signOut,
        deleteCurrentAccount,
        refreshProfile,
        refreshPreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      session: null,
      profile: null,
      preferences: null,
      loading: false,
      signIn: async () => ({ error: null }),
      signUp: async () => ({ error: null }),
      signOut: async () => {},
      deleteCurrentAccount: async () => {},
      refreshProfile: async () => {},
      refreshPreferences: async () => {},
    };
  }
  return ctx;
}
