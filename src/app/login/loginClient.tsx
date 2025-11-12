// src/app/login/LoginClient.tsx
'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = getSupabaseBrowserClient();

  const redirectTo = searchParams.get('redirectTo') ?? '/habits';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    console.log('[Login] submitting for', email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('[Login] signIn result', { data, error });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    console.log('[Login] navigating to', redirectTo);
    router.push(redirectTo);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-primary px-4">
      <div className="w-full max-w-md rounded-lg bg-foreground2 shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-serif mb-2">Log in to Lattivo</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Enter the email and password you created in Supabase.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm mb-1 text-dark">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full p-2 border rounded bg-foreground1 text-dark"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1 text-dark">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full p-2 border rounded bg-foreground1 text-dark"
            />
          </div>

          {error && (
            <p className="text-error text-sm" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-accent text-light font-semibold hover:bg-accent/90 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}
