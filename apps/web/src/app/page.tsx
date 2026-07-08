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
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="flex-1 flex flex-col justify-between overflow-x-hidden min-h-screen bg-gradient-to-br from-background via-card/10 to-background">
      
      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-brand-secondary/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/30 bg-background/60 backdrop-blur-lg px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2.5">
          <div className="h-9 w-9 rounded-xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
            <GraduationCap className="h-5 w-5 text-brand-primary" />
          </div>
          <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-brand-primary via-indigo-400 to-brand-secondary bg-clip-text text-transparent">
            Luminary
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 flex flex-col items-center justify-center text-center space-y-12 z-10">
        <motion.div 
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="space-y-6 max-w-3xl"
        >
          <div className="inline-flex items-center space-x-2 bg-brand-primary/10 border border-brand-primary/25 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-primary shadow-sm">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>The Operating System for Education</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none text-foreground">
            As Fun as <span className="bg-gradient-to-r from-brand-secondary to-pink-500 bg-clip-text text-transparent">Kahoot</span>,<br />
            As Simple as <span className="bg-gradient-to-r from-brand-primary to-indigo-400 bg-clip-text text-transparent">Classroom</span>
          </h1>

          <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Luminary combines Socratic AI tutoring, dynamic quest world maps, and infinite canvas whiteboards into a premium, clean workspace for classrooms.
          </p>
        </motion.div>

        {/* Interactive Style Sandbox Controls */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col items-center space-y-4 bg-card/45 backdrop-blur-md p-6 rounded-[2rem] border border-border/80 shadow-lg max-w-xl w-full"
        >
          <h2 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 text-foreground/80">
            <Compass className="h-4 w-4 text-brand-primary animate-spin-slow" />
            <span>Interactive Styling Sandbox (Test Themes)</span>
          </h2>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Button 
              variant={themeMode === 'kids' ? 'primary' : 'outline'} 
              size="sm" 
              onClick={() => setThemeMode('kids')}
              className="h-9"
            >
              👶 Kids Mode
            </Button>
            <Button 
              variant={themeMode === 'normal' ? 'primary' : 'outline'} 
              size="sm" 
              onClick={() => setThemeMode('normal')}
              className="h-9"
            >
              🎓 Normal Mode
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5 justify-center border-t border-border/40 pt-4 w-full">
            {(['light', 'dark', 'purple'] as const).map(color => (
              <button
                key={color}
                onClick={() => setThemeColor(color)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize border transition-all ${
                  themeColor === color 
                    ? 'bg-foreground text-background border-foreground shadow-md scale-105'
                    : 'bg-transparent text-foreground/60 border-border/80 hover:border-border hover:bg-card/40'
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full pt-4"
        >
          {/* Student */}
          <motion.div variants={itemVariants}>
            <Card hoverEffect className="h-full flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-secondary opacity-80" />
              <CardHeader className="text-center pt-8">
                <div className="h-12 w-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary mb-3 mx-auto border border-brand-secondary/15">
                  <Gamepad2 className="h-5.5 w-5.5" />
                </div>
                <CardTitle className="font-extrabold">Sammy Star</CardTitle>
                <CardDescription className="text-xs uppercase tracking-wider font-bold text-slate-400">Student Account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 text-center pb-8">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Sail Math Islands, earn coin points, consult the Socratic AI buddy, and use infinite drawing whiteboards.
                </p>
                <Button onClick={() => handleQuickLogin('student@learning.com')} variant="secondary" size="sm" className="w-full h-9">
                  Test Student Dashboard
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Teacher */}
          <motion.div variants={itemVariants}>
            <Card hoverEffect className="h-full flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-primary opacity-80" />
              <CardHeader className="text-center pt-8">
                <div className="h-12 w-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-3 mx-auto border border-brand-primary/15">
                  <GraduationCap className="h-5.5 w-5.5" />
                </div>
                <CardTitle className="font-extrabold">Professor Sarah</CardTitle>
                <CardDescription className="text-xs uppercase tracking-wider font-bold text-slate-400">Teacher Account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 text-center pb-8">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Draft AI quizzes in 1 click, auto-grade essay rubrics, build schedules, and inspect intervention analytics.
                </p>
                <Button onClick={() => handleQuickLogin('teacher@learning.com')} variant="primary" size="sm" className="w-full h-9">
                  Test Teacher Dashboard
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Parent */}
          <motion.div variants={itemVariants}>
            <Card hoverEffect className="h-full flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-info opacity-80" />
              <CardHeader className="text-center pt-8">
                <div className="h-12 w-12 rounded-2xl bg-brand-info/10 flex items-center justify-center text-brand-info mb-3 mx-auto border border-brand-info/15">
                  <Heart className="h-5.5 w-5.5" />
                </div>
                <CardTitle className="font-extrabold">Helen Star</CardTitle>
                <CardDescription className="text-xs uppercase tracking-wider font-bold text-slate-400">Parent Account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 text-center pb-8">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Track streaks, review weekly child progress reports, read notifications, and chat with supervisors.
                </p>
                <Button onClick={() => handleQuickLogin('parent@learning.com')} variant="info" size="sm" className="w-full h-9">
                  Test Parent Dashboard
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Admin */}
          <motion.div variants={itemVariants}>
            <Card hoverEffect className="h-full flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-success opacity-80" />
              <CardHeader className="text-center pt-8">
                <div className="h-12 w-12 rounded-2xl bg-brand-success/10 flex items-center justify-center text-brand-success mb-3 mx-auto border border-brand-success/15">
                  <ShieldCheck className="h-5.5 w-5.5" />
                </div>
                <CardTitle className="font-extrabold">System Admin</CardTitle>
                <CardDescription className="text-xs uppercase tracking-wider font-bold text-slate-400">Admin Account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 text-center pb-8">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Review token costs, query prompts, log analytics, database capacities, and teacher approval flags.
                </p>
                <Button onClick={() => handleQuickLogin('admin@learning.com')} variant="success" size="sm" className="w-full h-9">
                  Test Admin Dashboard
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-6 text-center text-[10px] text-muted-foreground bg-card/5 z-10">
        <p>© 2026 Luminary Platform. Built on Next.js 15, Turborepo, Prisma, PostgreSQL, and Google Gemini.</p>
      </footer>
    </div>
  );
}
