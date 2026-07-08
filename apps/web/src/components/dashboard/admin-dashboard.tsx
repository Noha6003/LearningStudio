'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Shield, Key, Database, RefreshCw, Terminal, CheckCircle2, XCircle } from 'lucide-react';

export function AdminDashboard({ user }: { user: any }) {
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Check actual database connection by querying a test endpoint
    const checkDb = async () => {
      try {
        const res = await fetch('/api/ai/memory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correctTopics: [], wrongTopics: [], errors: [] })
        });
        if (res.ok) {
          setDbStatus('connected');
          addLog('System: Database connection established successfully.');
        } else {
          setDbStatus('error');
          addLog('System Error: Database returned a non-200 status code.');
        }
      } catch (err) {
        setDbStatus('error');
        addLog('System Error: Database connection failed (DATABASE_URL invalid or offline).');
      }
    };

    checkDb();
    addLog(`System: Admin Console initialized for user: ${user?.email}`);
  }, [user]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`].slice(-8));
  };

  const handleTestPing = async () => {
    addLog('AdminAction: Triggering system self-diagnostic test...');
    try {
      const start = Date.now();
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'STUDENT', prompt: 'Ping' })
      });
      const latency = Date.now() - start;
      if (res.ok) {
        addLog(`DiagSuccess: API Gateway latency is ${latency}ms.`);
      } else {
        addLog('DiagError: API Gateway returned an error response.');
      }
    } catch (err) {
      addLog('DiagError: Failed to fetch API gateway router.');
    }
  };

  return (
    <div className="flex-1 bg-background text-foreground max-w-7xl mx-auto w-full p-6 md:p-8 flex flex-col md:flex-row gap-8">
      {/* Side menu */}
      <div className="md:w-64 flex flex-col space-y-2 border-r border-border/40 pr-0 md:pr-6">
        <div className="pb-4 hidden md:block">
          <h2 className="font-extrabold text-lg tracking-tight">System Control</h2>
          <p className="text-xs text-muted-foreground">Diagnose backend status & logs.</p>
        </div>

        <div className="p-4 bg-card rounded-2xl border border-border/40 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">Database connection:</span>
            {dbStatus === 'checking' && <span className="text-slate-400">Checking...</span>}
            {dbStatus === 'connected' && <span className="text-brand-success font-bold flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Connected</span>}
            {dbStatus === 'error' && <span className="text-brand-danger font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> Offline</span>}
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 min-w-0 space-y-6">
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-brand-primary" />
              <span>Admin Console</span>
            </CardTitle>
            <CardDescription>
              Real-time workspace diagnostic center. Run diagnostics or inspect configuration parameters.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleTestPing} variant="primary" size="sm" className="flex items-center gap-1">
                <RefreshCw className="h-3.5 w-3.5" /> Run Self-Diagnostic
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Real logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Terminal className="h-4.5 w-4.5 text-brand-primary" />
              <span>Console Logs</span>
            </CardTitle>
            <CardDescription>Real system logs captured during the active dashboard session.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-slate-950 text-slate-100 p-4 font-mono text-xs rounded-b-2xl h-56 overflow-y-auto space-y-1.5 leading-relaxed border-t border-white/5">
              {logs.map((log, idx) => (
                <div key={idx} className={log.includes('Error') ? 'text-brand-danger' : 'text-slate-300'}>
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
