'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  ShieldAlert, Activity, Cpu, DollarSign, Database, 
  Users, CheckCircle2, XCircle, Search, Terminal, AlertTriangle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminDashboard({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<'bi' | 'observatory' | 'users'>('bi');

  // Mock pending teachers data
  const [teachers, setTeachers] = useState([
    { id: 1, name: 'Dr. David Watson', school: 'Lincoln High', approved: false },
    { id: 2, name: 'Professor Sarah', school: 'Global Primary', approved: true },
    { id: 3, name: 'Miss Emily Chen', school: 'Science Academy', approved: false }
  ]);

  const handleApprove = (id: number) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, approved: !t.approved } : t));
  };

  // Mock Observatory logs
  const observatoryLogs = [
    { id: 1, action: 'Quiz Generator', tokens: 1420, cost: '$0.00142', latency: '410ms', prompt: 'Create Grade 6 Planets Quiz...' },
    { id: 2, action: 'Student Tutor', tokens: 820, cost: '$0.00082', latency: '350ms', prompt: 'Explain question 5 (Mars gravity)...' },
    { id: 3, action: 'Grader Engine', tokens: 2840, cost: '$0.00284', latency: '680ms', prompt: 'Grade essay comparing Mercury/Venus...' }
  ];

  return (
    <div className="flex-1 bg-background text-foreground max-w-7xl mx-auto w-full p-6 md:p-8 flex flex-col md:flex-row gap-8">
      {/* Side menu */}
      <div className="md:w-64 flex flex-col space-y-2 border-r border-border/40 pr-0 md:pr-6">
        <div className="pb-4 hidden md:block">
          <h2 className="font-extrabold text-lg tracking-tight">Admin Console</h2>
          <p className="text-xs text-muted-foreground">Manage users & view observability.</p>
        </div>

        <Button 
          variant={activeTab === 'bi' ? 'primary' : 'outline'} 
          className="justify-start" 
          onClick={() => setActiveTab('bi')}
        >
          <Activity className="mr-2 h-4 w-4" /> Platform BI
        </Button>
        <Button 
          variant={activeTab === 'observatory' ? 'primary' : 'outline'} 
          className="justify-start" 
          onClick={() => setActiveTab('observatory')}
        >
          <Cpu className="mr-2 h-4 w-4" /> AI Observatory
        </Button>
        <Button 
          variant={activeTab === 'users' ? 'primary' : 'outline'} 
          className="justify-start" 
          onClick={() => setActiveTab('users')}
        >
          <Users className="mr-2 h-4 w-4" /> Teacher Approvals
        </Button>
      </div>

      {/* Main Panel */}
      <div className="flex-1 min-w-0">
        
        {/* PLATFORM BI TAB */}
        {activeTab === 'bi' && (
          <div className="space-y-6">
            <Card className="border-brand-danger/30 bg-brand-danger/[0.01]">
              <CardContent className="pt-6 flex items-start space-x-3 text-xs leading-relaxed text-slate-700">
                <ShieldAlert className="h-5 w-5 text-brand-danger shrink-0 mt-0.5" />
                <div>
                  <strong className="text-brand-danger">Proactive System Alert:</strong>
                  <p className="pt-0.5">Database storage limits will exceed the current package allocations in 17 days due to high file uploads in NotebookLM spaces. Recommend cleaning temporary caches or upgrading the Supabase plan.</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Daily Active Users</CardDescription>
                  <CardTitle className="text-3xl font-black">12.4k</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Monthly Active Users</CardDescription>
                  <CardTitle className="text-3xl font-black">45.2k</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Quiz Runs</CardDescription>
                  <CardTitle className="text-3xl font-black">148.6k</CardTitle>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Performance Metrics</CardTitle>
                <CardDescription>Server nodes status and file bandwidth checks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2 text-xs">
                  <span className="font-semibold text-slate-600">Web App Server (Vercel Edge)</span>
                  <span className="text-brand-success font-bold flex items-center"><CheckCircle2 className="h-3 w-3 mr-1" /> Healthy (99.9% Uptime)</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2 text-xs">
                  <span className="font-semibold text-slate-600">Database Engine (PostgreSQL)</span>
                  <span className="text-brand-success font-bold flex items-center"><CheckCircle2 className="h-3 w-3 mr-1" /> Healthy (15ms Latency)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">File Storage CDN</span>
                  <span className="text-brand-success font-bold flex items-center"><CheckCircle2 className="h-3 w-3 mr-1" /> Healthy</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI OBSERVATORY */}
        {activeTab === 'observatory' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardDescription>AI Costs (This Week)</CardDescription>
                  <DollarSign className="h-4 w-4 text-brand-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black">$14.22</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardDescription>Average Latency</CardDescription>
                  <Cpu className="h-4 w-4 text-brand-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black">420ms</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardDescription>Tokens Processed</CardDescription>
                  <Database className="h-4 w-4 text-brand-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black">9.8M</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Terminal className="h-5 w-5 text-brand-primary animate-pulse" />
                  <span>Real-Time Gemini Request Logs</span>
                </CardTitle>
                <CardDescription>Observed system prompt token volumes and generation latencies.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs divide-y divide-border border-t">
                    <thead>
                      <tr className="text-muted-foreground uppercase font-bold bg-slate-50/50">
                        <th className="p-3">Action</th>
                        <th className="p-3">Prompt Excerpt</th>
                        <th className="p-3">Tokens</th>
                        <th className="p-3">Latency</th>
                        <th className="p-3">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {observatoryLogs.map(log => (
                        <tr key={log.id} className="hover:bg-card/30">
                          <td className="p-3 font-semibold text-slate-800">{log.action}</td>
                          <td className="p-3 font-mono text-muted-foreground truncate max-w-[200px]">{log.prompt}</td>
                          <td className="p-3">{log.tokens}</td>
                          <td className="p-3">{log.latency}</td>
                          <td className="p-3 text-brand-success font-semibold">{log.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TEACHER APPROVALS */}
        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <CardTitle>Teacher Credentials Management</CardTitle>
              <CardDescription>Approve educator profiles to allow classroom creations.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {teachers.map(teacher => (
                  <div key={teacher.id} className="flex items-center justify-between py-4 text-sm">
                    <div>
                      <h4 className="font-bold text-slate-800">{teacher.name}</h4>
                      <p className="text-xs text-muted-foreground">Campus: {teacher.school}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider",
                        teacher.approved ? "bg-brand-success/10 text-brand-success" : "bg-brand-warning/10 text-brand-warning"
                      )}>
                        {teacher.approved ? 'Approved' : 'Pending'}
                      </span>
                      <Button 
                        onClick={() => handleApprove(teacher.id)} 
                        variant={teacher.approved ? 'outline' : 'success'} 
                        size="sm"
                      >
                        {teacher.approved ? 'Revoke Approval' : 'Approve Teacher'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
