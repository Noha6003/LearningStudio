'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Heart, Calendar, BookOpen, Clock, MessageSquare, 
  TrendingUp, CheckCircle, AlertCircle, Mail 
} from 'lucide-react';

export function ParentDashboard({ user }: { user: any }) {
  // Mock child data mapping to student profile Sammy Star
  const child = {
    name: 'Sammy Star',
    grade: 'Grade 6',
    xp: 640,
    level: 4,
    coins: 380,
    streak: 5,
    studyHours: '14.5 hrs',
    improvement: '27%',
    attendance: { present: 18, absent: 1, late: 1 },
    grades: [
      { name: 'Inner Planets Quiz', score: '90%', date: 'July 6, 2026', status: 'Excellent' },
      { name: 'Algebra Introduction', score: '65%', date: 'July 2, 2026', status: 'Needs Review' }
    ],
    messages: [
      { sender: 'Professor Sarah', content: 'Sammy did fantastic in the astronomy quiz today, but had some questions regarding Kepler orbits. Recommended reviewing planets before Friday.', date: 'July 6, 2026' }
    ],
    aiSummary: "Sammy is showing great engagement, with a 27% increase in study hours. Weak areas detected: Fractions and Orbit physics. Strong areas: Solar planets and additions. Recommend checking Math Island tomorrow!"
  };

  return (
    <div className="flex-1 bg-background text-foreground max-w-7xl mx-auto w-full p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center space-x-2">
            <Heart className="h-7 w-7 text-brand-secondary fill-brand-secondary/20" />
            <span>Parent Portal</span>
          </h1>
          <p className="text-sm text-muted-foreground">Monitor progress, view logs, and read advisor reviews for {child.name}.</p>
        </div>
        <div className="flex items-center space-x-2 bg-card border border-border px-4 py-2 rounded-xl text-sm font-semibold">
          <span>Child: <strong>{child.name}</strong> ({child.grade})</span>
        </div>
      </div>

      {/* Stats Summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Study Time (Month)</span>
              <p className="text-2xl font-black text-brand-primary">{child.studyHours}</p>
            </div>
            <div className="bg-brand-primary/10 p-3 rounded-full text-brand-primary">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Improvement</span>
              <p className="text-2xl font-black text-brand-success">+{child.improvement}</p>
            </div>
            <div className="bg-brand-success/10 p-3 rounded-full text-brand-success">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Attendance (Days)</span>
              <p className="text-2xl font-black text-slate-800">{child.attendance.present} / 20</p>
            </div>
            <div className="bg-slate-100 p-3 rounded-full text-slate-500">
              <Calendar className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Current Streak</span>
              <p className="text-2xl font-black text-brand-secondary">{child.streak} Days</p>
            </div>
            <div className="bg-brand-secondary/10 p-3 rounded-full text-brand-secondary">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Grades and Attendance */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Grades */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Quiz & Homework Scores</CardTitle>
                <CardDescription>Review score evaluations and marks.</CardDescription>
              </div>
              <BookOpen className="h-5 w-5 text-brand-primary" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border border-t border-border">
                {child.grades.map((grade, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 text-sm">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800">{grade.name}</h4>
                      <p className="text-xs text-muted-foreground">Submitted on {grade.date}</p>
                    </div>
                    <div className="flex items-center space-x-6">
                      <span className="font-black text-brand-primary">{grade.score}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        grade.status === 'Excellent' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-warning/10 text-brand-warning'
                      }`}>{grade.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Teacher Messages */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Teacher Notifications & Notes</CardTitle>
                <CardDescription>Direct alerts from Sammy's course supervisors.</CardDescription>
              </div>
              <MessageSquare className="h-5 w-5 text-brand-primary" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border border-t border-border">
                {child.messages.map((msg, idx) => (
                  <div key={idx} className="p-4 space-y-2 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-800">{msg.sender}</span>
                      <span className="text-muted-foreground">{msg.date}</span>
                    </div>
                    <p className="leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-lg border">{msg.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: AI Reports */}
        <div className="space-y-8">
          {/* Parent AI Assistant Advisor */}
          <Card className="border-brand-secondary/30 bg-gradient-to-b from-card to-brand-secondary/[0.02]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-brand-secondary" />
                <span>Parent AI Advisor</span>
              </CardTitle>
              <CardDescription>Weekly automated synthesis of child progress.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-card border p-4 rounded-xl text-xs leading-relaxed text-slate-700 space-y-2">
                <div className="flex items-center space-x-1.5 font-bold text-brand-secondary">
                  <CheckCircle className="h-4 w-4" />
                  <span>AI Summary: Progress Up 27%</span>
                </div>
                <p>{child.aiSummary}</p>
              </div>

              <Button variant="outline" size="sm" className="w-full flex items-center justify-center">
                <Mail className="h-4 w-4 mr-2" /> Subscribe to Weekly Email Reports
              </Button>
            </CardContent>
          </Card>

          {/* Attendance breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Log</CardTitle>
              <CardDescription>Total days in active semester.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2 text-xs">
                <span className="font-medium text-slate-500">Present</span>
                <span className="font-bold text-brand-success">{child.attendance.present} Days</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2 text-xs">
                <span className="font-medium text-slate-500">Late</span>
                <span className="font-bold text-brand-warning">{child.attendance.late} Days</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">Absent</span>
                <span className="font-bold text-brand-danger">{child.attendance.absent} Day</span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
