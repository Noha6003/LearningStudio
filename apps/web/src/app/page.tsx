'use client';

import React from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useThemeMode } from '@/components/providers/theme-mode-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Gamepad2, GraduationCap, Compass, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { themeMode, themeColor, setThemeMode, setThemeColor } = useThemeMode();

  // If already logged in, show dashboard link
  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  const handleQuickLogin = async (email: string) => {
    await signIn('credentials', {
      email,
      password: 'password123',
      callbackUrl: '/dashboard'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex-1 flex flex-col justify-between overflow-x-hidden min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-brand-primary animate-bounce" />
          <span className="font-extrabold text-2xl tracking-wider bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            LearningMa
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          {status === 'authenticated' ? (
            <Button onClick={handleGoToDashboard} variant="primary" size="sm">
              Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => router.push('/login')} variant="outline" size="sm">
              Log In
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col items-center justify-center text-center space-y-12">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 max-w-3xl"
        >
          <div className="inline-flex items-center space-x-2 bg-brand-primary/10 border border-brand-primary/20 px-4 py-1.5 rounded-full text-xs font-semibold text-brand-primary uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>The Operating System for Education</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            As Fun as <span className="text-brand-secondary">Kahoot</span>,<br />
            As Simple as <span className="text-brand-primary">Classroom</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            An AI-first, adaptive learning platform custom-tailored for every student, featuring interactive game maps for kids and minimal workspaces for teachers.
          </p>
        </motion.div>

        {/* Global Style Sandbox Controls */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center space-y-4 bg-card/60 p-6 rounded-2xl border border-border/80 max-w-xl w-full"
        >
          <h2 className="text-sm font-semibold flex items-center space-x-2">
            <Compass className="h-4 w-4 text-brand-primary" />
            <span>Interactive Styling Sandbox (Test Themes)</span>
          </h2>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Button 
              variant={themeMode === 'kids' ? 'primary' : 'outline'} 
              size="sm" 
              onClick={() => setThemeMode('kids')}
            >
              👶 Kids Mode
            </Button>
            <Button 
              variant={themeMode === 'normal' ? 'primary' : 'outline'} 
              size="sm" 
              onClick={() => setThemeMode('normal')}
            >
              🎓 Normal Mode
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center border-t border-border/40 pt-4 w-full">
            {(['light', 'dark', 'neon', 'space', 'anime', 'minimal'] as const).map(color => (
              <button
                key={color}
                onClick={() => setThemeColor(color)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize border transition-all ${
                  themeColor === color 
                    ? 'bg-foreground text-background border-foreground shadow-sm'
                    : 'bg-transparent text-foreground border-border hover:bg-card'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Role Quick Logins */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full pt-6"
        >
          {/* Student */}
          <motion.div variants={itemVariants}>
            <Card hoverEffect className="h-full flex flex-col justify-between">
              <CardHeader>
                <div className="h-10 w-10 rounded-xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary mb-2 mx-auto">
                  <Gamepad2 className="h-5 w-5" />
                </div>
                <CardTitle>Sammy Star</CardTitle>
                <CardDescription>Role: Student Profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Play math maps, view streaks, level up, unlock cosmetics, and consult your Student AI Tutor.
                </p>
                <Button onClick={() => handleQuickLogin('student@learning.com')} variant="secondary" size="sm" className="w-full">
                  Sign in as Student
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Teacher */}
          <motion.div variants={itemVariants}>
            <Card hoverEffect className="h-full flex flex-col justify-between">
              <CardHeader>
                <div className="h-10 w-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-2 mx-auto">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <CardTitle>Professor Sarah</CardTitle>
                <CardDescription>Role: Teacher Profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Access 1-click quiz builds, rubrics grading dashboard, AI lesson authoring, and analytics reports.
                </p>
                <Button onClick={() => handleQuickLogin('teacher@learning.com')} variant="primary" size="sm" className="w-full">
                  Sign in as Teacher
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Parent */}
          <motion.div variants={itemVariants}>
            <Card hoverEffect className="h-full flex flex-col justify-between">
              <CardHeader>
                <div className="h-10 w-10 rounded-xl bg-brand-info/10 flex items-center justify-center text-brand-info mb-2 mx-auto">
                  <Heart className="h-5 w-5" />
                </div>
                <CardTitle>Helen Star</CardTitle>
                <CardDescription>Role: Parent Profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Monitor Sammy's homework, review weekly automated summaries, view attendance, and send chat notes.
                </p>
                <Button onClick={() => handleQuickLogin('parent@learning.com')} variant="info" size="sm" className="w-full">
                  Sign in as Parent
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Admin */}
          <motion.div variants={itemVariants}>
            <Card hoverEffect className="h-full flex flex-col justify-between">
              <CardHeader>
                <div className="h-10 w-10 rounded-xl bg-brand-success/10 flex items-center justify-center text-brand-success mb-2 mx-auto">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <CardTitle>System Admin</CardTitle>
                <CardDescription>Role: Admin Profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Access platform BI, cost sheets, API key generation, audit trails, and the AI Observatory tracker.
                </p>
                <Button onClick={() => handleQuickLogin('admin@learning.com')} variant="success" size="sm" className="w-full">
                  Sign in as Admin
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground bg-card/10">
        <p>© 2026 LearningMa Inc. Built on Next.js 15, Turborepo, Prisma, PostgreSQL, and Google Gemini.</p>
      </footer>
    </div>
  );
}
