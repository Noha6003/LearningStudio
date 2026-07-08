'use client';

import React, { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useThemeMode } from '@/components/providers/theme-mode-provider';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogOut, ArrowLeft, Gamepad2, Settings } from 'lucide-react';

// Import Dashboards
import { StudentDashboard } from '@/components/dashboard/student-dashboard';
import { TeacherDashboard } from '@/components/dashboard/teacher-dashboard';
import { ParentDashboard } from '@/components/dashboard/parent-dashboard';
import { AdminDashboard } from '@/components/dashboard/admin-dashboard';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { themeMode, toggleThemeMode } = useThemeMode();
  
  // Protect page client-side
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen space-y-4">
        <GraduationCap className="h-12 w-12 text-brand-primary animate-pulse" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading dashboard session...</p>
      </div>
    );
  }

  if (!session) return null;

  const role = (session.user as any)?.role;
  const userName = session.user?.name || 'User';

  const renderDashboard = () => {
    switch (role) {
      case 'SUPER_ADMIN':
      case 'ORG_ADMIN':
        return <AdminDashboard user={session.user} />;
      case 'TEACHER':
        return <TeacherDashboard user={session.user} />;
      case 'PARENT':
        return <ParentDashboard user={session.user} />;
      case 'STUDENT':
      default:
        return <StudentDashboard user={session.user} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Dashboard Top Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.push('/')} variant="ghost" size="sm" className="px-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
          </Button>
          <span className="font-extrabold text-lg bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            LearningMa OS
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-foreground/10 text-foreground font-semibold uppercase tracking-wider">
            {role?.replace('SUPER_ADMIN', 'ADMIN')}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-foreground/80 hidden sm:inline">
            Hello, <strong className="text-foreground">{userName}</strong>
          </span>

          <Button 
            onClick={toggleThemeMode} 
            variant="outline" 
            size="sm"
            className="flex items-center space-x-1"
          >
            {themeMode === 'kids' ? <Settings className="h-3.5 w-3.5" /> : <Gamepad2 className="h-3.5 w-3.5" />}
            <span className="text-xs">{themeMode === 'kids' ? 'Normal Mode' : 'Kids Mode'}</span>
          </Button>

          <Button onClick={() => signOut({ callbackUrl: '/' })} variant="ghost" size="sm" className="px-2 hover:text-brand-danger">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Render Active Dashboard Panel */}
      <main className="flex-1 flex flex-col">
        {renderDashboard()}
      </main>
    </div>
  );
}
