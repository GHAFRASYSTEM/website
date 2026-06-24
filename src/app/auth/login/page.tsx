'use client';
import { useAuth } from '../../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/interview');
    }
  }, [user, router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);

    try {
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      // Redirect handled by useEffect
    } catch (err: any) {
      let message = 'Invalid email or password';

      if (err.message?.includes('Invalid login credentials')) {
        message = 'Account not found. Please contact GH AFRA executives to create your account.';
      }

      setLocalError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/interview`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setLocalError(err.message || 'Google sign-in failed');
    }
  };

  const handleAppleSignIn = async () => {
    setLocalError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/interview`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setLocalError(err.message || 'Apple sign-in failed');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div style={{ maxWidth: 420, margin: '80px auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 28, textAlign: 'center', marginBottom: 32 }}>
        Lecture Transcript
      </h1>

      {/* Social Logins */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        <button
          onClick={handleGoogleSignIn}
          style={{
            padding: '12px 16px',
            background: '#fff',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" alt="Google" width={20} height={20} />
          Continue with Google
        </button>

        <button
          onClick={handleAppleSignIn}
          style={{
            padding: '12px 16px',
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 20 }}></span>
          Continue with Apple
        </button>
      </div>

      <div style={{ textAlign: 'center', color: '#888', margin: '16px 0' }}>— or —</div>

      {/* Email/Password Form */}
      <form onSubmit={handleEmailSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            style={inputStyle()}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            style={inputStyle()}
          />
        </div>

        {localError && (
          <div style={{ padding: 12, background: '#fef2f2', color: '#991b1b', borderRadius: 6, fontSize: 14 }}>
            {localError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !email || !password}
          style={{
            padding: '12px',
            background: isSubmitting ? '#9ca3af' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 16,
            fontWeight: 500,
            cursor: isSubmitting ? 'default' : 'pointer',
            marginTop: 8,
          }}
        >
          {isSubmitting ? 'Signing in...' : 'Sign In with Email'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 32, color: '#6b7280', fontSize: 14 }}>
        Don't have an account? Contact GH AFRA executives.
      </p>
    </div>
  );
}

function inputStyle(): React.CSSProperties {
  return {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 15,
  };
}