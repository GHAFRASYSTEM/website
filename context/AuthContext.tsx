'use client';
import { createContext, useContext, useCallback, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email!,
          });
          setAccessToken(data.session.access_token);
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
        });
        setAccessToken(session.access_token);
      } else {
        setUser(null);
        setAccessToken(null);
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    setError(null);
    const { error: err } = await supabase.auth.signUp({ email, password });
    if (err) throw err;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) throw err;
    if (data.session?.user) {
      setUser({ id: data.session.user.id, email: data.session.user.email! });
      setAccessToken(data.session.access_token);
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAccessToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, error, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}