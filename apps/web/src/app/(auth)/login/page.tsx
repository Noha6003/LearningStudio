import React from 'react';
import type { Metadata } from 'next';
import LoginClient from '@/components/auth/login-client';

export const metadata: Metadata = {
  title: "Login - Luminary Study Studio",
  description: "Sign in to your Luminary account to access your gamified educational dashboard, daily lessons, and practice tools.",
  keywords: ["login", "Luminary Studio account", "sign in", "education portal"],
};

export default function Page() {
  return <LoginClient />;
}
