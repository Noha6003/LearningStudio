import React from 'react';
import type { Metadata } from 'next';
import LandingClient from '@/components/auth/landing-client';

export const metadata: Metadata = {
  title: "Luminary Study Studio - Gamified Vocabulary & English Lessons",
  description: "Sign in to Luminary Study Studio to access your daily bilingual English vocabulary practice, interactive lessons, and gamified quizzes designed to accelerate language learning.",
  keywords: ["English learning", "vocabulary cards", "gamified study decks", "Luminary Studio", "bilingual study app"],
  openGraph: {
    title: "Luminary Study Studio - Gamified Vocabulary & English Lessons",
    description: "Access your daily English study deck, interactive quizzes, and personalized vocabulary tools.",
    type: "website",
  }
};

export default function Page() {
  return <LandingClient />;
}
