'use client';

import React, { useState } from 'react';
import { StudentDashboard } from '@/components/dashboard/student-dashboard';
import { TeacherDashboard } from '@/components/dashboard/teacher-dashboard';
import { ParentDashboard } from '@/components/dashboard/parent-dashboard';
import { AdminDashboard } from '@/components/dashboard/admin-dashboard';
import { GraduationCap, ArrowLeft, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DemoPage() {
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'TEACHER' | 'PARENT' | 'SUPER_ADMIN'>('STUDENT');
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  const mockUsers = {
    STUDENT: { id: 'demo-student', name: 'Sammy Star (Demo)', email: 'student@luminary.com', role: 'STUDENT', language: lang },
    TEACHER: { id: 'demo-teacher', name: 'Professor Sarah (Demo)', email: 'teacher@luminary.com', role: 'TEACHER', language: lang },
    PARENT: { id: 'demo-parent', name: 'Pat Star (Demo)', email: 'parent@luminary.com', role: 'PARENT', language: lang },
    SUPER_ADMIN: { id: 'demo-admin', name: 'System Admin (Demo)', email: 'admin@luminary.com', role: 'SUPER_ADMIN', language: lang }
  };

  const renderDashboard = () => {
    switch (selectedRole) {
      case 'TEACHER':
        return <TeacherDashboard user={mockUsers.TEACHER} />;
      case 'PARENT':
        return <ParentDashboard user={mockUsers.PARENT} />;
      case 'SUPER_ADMIN':
        return <AdminDashboard user={mockUsers.SUPER_ADMIN} />;
      case 'STUDENT':
      default:
        return <StudentDashboard user={mockUsers.STUDENT} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-950 text-white">
      {/* Top Banner indicating it's a Demo */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-center py-2 text-xs font-bold tracking-wide">
        ✨ LUMINARY PUBLIC INTERACTIVE DEMO — Bypassing Login Wall for AI Auditors & Guests
      </div>

      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-lg px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4 gap-4 flex-wrap">
          <Link href="/">
            <Button variant="ghost" size="sm" className="px-2 text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-1 inline" />
              Exit Demo
            </Button>
          </Link>
          <span className="font-black text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Luminary
          </span>
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-0.5 rounded-xl flex-wrap">
            {(['STUDENT', 'TEACHER', 'PARENT', 'SUPER_ADMIN'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                  selectedRole === role
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {role === 'SUPER_ADMIN' ? 'ADMIN' : role}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium hidden sm:block">
          Logged in as: <strong className="text-white">{mockUsers[selectedRole].name}</strong>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {renderDashboard()}
      </main>
    </div>
  );
}
