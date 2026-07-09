'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { GraduationCap, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError('Invalid email or password. Hint: Use student@learning.com / password123');
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-b from-background to-card/20">
      <Button 
        onClick={() => router.push('/')} 
        variant="ghost" 
        size="sm" 
        className="absolute top-6 left-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
      </Button>

      <Card className="max-w-md w-full border-border/80 shadow-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <GraduationCap className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-black">Welcome Back</CardTitle>
          <CardDescription>Log in using credentials or go back to quick-login.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@learning.com"
                required
                className="bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>

            {error && (
              <p className="text-xs font-bold text-brand-danger bg-brand-danger/10 p-2.5 rounded-lg">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 'Log In'}
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-border/40 text-center text-xs text-muted-foreground">
            <p>
              Hint: You can use the quick login buttons directly on the{' '}
              <button 
                onClick={() => router.push('/')} 
                className="text-brand-primary font-bold hover:underline cursor-pointer"
              >
                Home Page
              </button>{' '}
              to test different roles instantly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
