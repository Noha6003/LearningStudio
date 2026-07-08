'use client';

import React, { useState } from 'react';
import { useThemeMode } from '../providers/theme-mode-provider';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { 
  Gamepad2, Compass, Award, Flame, Coins, Sparkles, BookOpen, Clock, 
  ChevronRight, Calendar, ArrowRight, UserCheck, MessageSquare, Play, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function StudentDashboard({ user }: { user: any }) {
  const { themeMode } = useThemeMode();
  const isKids = themeMode === 'kids';

  // State for kids map active zone
  const [activeIsland, setActiveIsland] = useState<string | null>(null);

  // Mock Student statistics
  const stats = {
    xp: 640,
    level: 4,
    coins: 380,
    streak: 5,
    pet: { name: 'Baby Dragon', level: 2, icon: '🐉' },
    avatar: '🤖',
    quests: [
      { id: 1, title: 'Solve a Math Quiz', progress: 0, target: 1, completed: false, reward: '50 XP' },
      { id: 2, title: 'Read Science Notes', progress: 1, target: 1, completed: true, reward: '30 Coins' }
    ]
  };

  const islands = [
    { id: 'math', name: 'Math Island', icon: '🧮', color: 'bg-amber-400 text-amber-950 border-amber-500', desc: 'Conquer fractions, equations and shapes!', tasks: ['Algebra Basics Quiz', 'Fractions Challenge'] },
    { id: 'science', name: 'Science Lab', icon: '🧪', color: 'bg-emerald-400 text-emerald-950 border-emerald-500', desc: 'Explore outer space, gravity and elements!', tasks: ['Inner Planets Lesson', 'Gravity Experiment Slides'] },
    { id: 'history', name: 'History Kingdom', icon: '🏰', color: 'bg-indigo-400 text-indigo-950 border-indigo-500', desc: 'Journey through medieval wars and empires!', tasks: ['Roman Republic Timeline', 'Ancient Egypt Open-Ended'] },
    { id: 'language', name: 'Language Forest', icon: '🌳', color: 'bg-purple-400 text-purple-950 border-purple-500', desc: 'Navigate grammar forests and word clouds!', tasks: ['Spelling Bee Brainstorm', 'Translate Practice'] }
  ];

  // KIDS MODE VIEW
  if (isKids) {
    return (
      <div className="flex-1 bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-200 p-6 flex flex-col space-y-6 md:space-y-8 select-none text-slate-800">
        
        {/* Kids Dashboard HUD Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white/70 backdrop-blur-md px-6 py-4 rounded-3xl border-4 border-slate-200 shadow-md">
          <div className="flex items-center space-x-3">
            <span className="text-3xl animate-bounce">{stats.avatar}</span>
            <div>
              <h2 className="font-extrabold text-lg tracking-tight">Sammy Star</h2>
              <div className="w-32 bg-slate-200 rounded-full h-3 border border-slate-300 overflow-hidden">
                <div className="bg-brand-primary h-full rounded-full" style={{ width: '60%' }}></div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">LVL {stats.level} • {stats.xp}/1000 XP</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 bg-amber-100 border-2 border-amber-400 px-3 py-1 rounded-2xl font-black text-amber-800 text-sm shadow-sm">
              <Coins className="h-4 w-4 text-amber-500 fill-amber-400" />
              <span>{stats.coins}</span>
            </div>
            
            <div className="flex items-center space-x-1.5 bg-orange-100 border-2 border-orange-400 px-3 py-1 rounded-2xl font-black text-orange-800 text-sm shadow-sm animate-pulse">
              <Flame className="h-4 w-4 text-orange-500 fill-orange-400" />
              <span>{stats.streak} DAYS</span>
            </div>

            <div className="flex items-center space-x-1 bg-violet-100 border-2 border-violet-400 px-3 py-1 rounded-2xl font-black text-violet-800 text-sm shadow-sm">
              <span className="text-lg">{stats.pet.icon}</span>
              <span className="text-xs uppercase tracking-wide">{stats.pet.name}</span>
            </div>
          </div>
        </div>

        {/* Learning Buddy Greeting */}
        <div className="bg-white/80 border-4 border-dashed border-brand-primary/60 rounded-[2rem] p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 shadow-sm">
          <span className="text-5xl animate-bounce">🦄</span>
          <div className="text-center md:text-left flex-1">
            <h3 className="text-lg font-black text-brand-primary">AI Buddy Sparkles says:</h3>
            <p className="text-sm font-semibold text-slate-700">
              Welcome back, champion! You are on a {stats.streak}-day learning streak. Today, I recommend sailing to <strong className="text-brand-secondary">Science Lab</strong> to learn about the Red Planet!
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm" onClick={() => setActiveIsland('science')}>
              Quick Start <Play className="ml-2 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Interactive Subject Map Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          {islands.map((island) => (
            <motion.div
              key={island.id}
              whileHover={{ scale: 1.02, y: -4 }}
              className="cursor-pointer"
              onClick={() => setActiveIsland(island.id)}
            >
              <Card className={`h-full border-4 ${island.color} transition-all`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-2xl font-black flex items-center space-x-2">
                    <span className="text-3xl">{island.icon}</span>
                    <span>{island.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xs font-bold leading-relaxed">{island.desc}</p>
                  <span className="text-[10px] font-extrabold uppercase bg-white/30 px-2 py-0.5 rounded-full inline-block">
                    {island.tasks.length} quests available
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Slide-over Panel for Island Tasks */}
        <AnimatePresence>
          {activeIsland && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center sm:items-center p-4">
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="bg-white border-4 border-slate-300 rounded-[2rem] max-w-lg w-full overflow-hidden shadow-2xl p-6 space-y-6"
              >
                {(() => {
                  const island = islands.find(i => i.id === activeIsland);
                  if (!island) return null;
                  return (
                    <>
                      <div className="flex items-center justify-between border-b-4 border-dashed border-slate-100 pb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-4xl">{island.icon}</span>
                          <div>
                            <h3 className="text-2xl font-black text-slate-800">{island.name}</h3>
                            <p className="text-xs font-semibold text-slate-500">{island.desc}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveIsland(null)}
                          className="text-slate-400 hover:text-slate-600 font-bold text-xl px-2"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Available Quests:</h4>
                        {island.tasks.map((task, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center justify-between bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 p-4 rounded-2xl transition-colors cursor-pointer"
                          >
                            <div className="flex items-center space-x-3">
                              <BookOpen className="h-5 w-5 text-brand-primary" />
                              <span className="font-extrabold text-sm text-slate-700">{task}</span>
                            </div>
                            <Button variant="secondary" size="sm" className="h-8">
                              Start <Play className="ml-1.5 h-3 w-3 fill-white" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // NORMAL MODE VIEW
  return (
    <div className="flex-1 bg-background text-foreground p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Student Workspace</h1>
          <p className="text-sm text-muted-foreground">Keep studying your path modules, checking assignments, and using the AI RAG notebook.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 border border-border px-3.5 py-1.5 rounded-full text-sm font-semibold">
            <Award className="h-4 w-4 text-brand-primary" />
            <span>LVL {stats.level} ({stats.xp} XP)</span>
          </div>
          <div className="flex items-center space-x-1.5 border border-border px-3.5 py-1.5 rounded-full text-sm font-semibold">
            <Coins className="h-4 w-4 text-brand-warning fill-brand-warning/20" />
            <span>{stats.coins} coins</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Work list */}
        <div className="lg:col-span-2 space-y-8">
          {/* Continue Learning */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Continue Learning</CardTitle>
                <CardDescription>Pick up right where you left off.</CardDescription>
              </div>
              <BookOpen className="h-5 w-5 text-brand-primary" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border hover:border-brand-primary/50 transition-colors gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold flex items-center gap-1.5">
                    <span className="text-emerald-500">🧪 Science</span>
                    <span>Lesson 1: The Red Planet (Mars)</span>
                  </h4>
                  <p className="text-xs text-muted-foreground">Course: Journey Through the Cosmos • Module 1</p>
                </div>
                <Button size="sm" variant="primary">
                  Resume Lesson <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Assignments</CardTitle>
                <CardDescription>Submit before deadlines to prevent streak breaks.</CardDescription>
              </div>
              <Calendar className="h-5 w-5 text-brand-primary" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border border-t border-border">
                <div className="flex items-center justify-between p-4 hover:bg-card/40 transition-colors">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded-full inline-block mb-1">Homework</span>
                    <h4 className="text-sm font-bold">Inner Planets Worksheet</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Due in 2 days (July 10, 2026)
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: AI Assistant & Quests */}
        <div className="space-y-8">
          {/* AI Copilot Student Panel */}
          <Card className="border-brand-primary/30 shadow-[0_0_15px_rgba(99,102,241,0.05)] bg-gradient-to-b from-card to-brand-primary/[0.02]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-brand-primary" />
                <span>AI Tutor Copilot</span>
              </CardTitle>
              <CardDescription>Your personal study assistant.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-card p-3 rounded-lg border border-border text-xs leading-relaxed text-muted-foreground">
                🧑‍🎓 <strong>Tutor AI:</strong> "I noticed you struggled with fractions in Math class yesterday. Would you like me to compile a 5-question review list or explain it like you are 10?"
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-xs py-1.5 h-auto text-left justify-start">
                  Explain like I'm 10
                </Button>
                <Button variant="outline" size="sm" className="text-xs py-1.5 h-auto text-left justify-start">
                  Make 5 Flashcards
                </Button>
              </div>
              <div className="border-t border-border/40 pt-4 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ask the AI Tutor..." 
                  className="flex-1 bg-card border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
                <Button size="sm" className="h-8 px-3">Ask</Button>
              </div>
            </CardContent>
          </Card>

          {/* Daily Quests */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Quests</CardTitle>
              <CardDescription>Earn coins and bonus XP.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.quests.map((quest) => (
                <div key={quest.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card/20">
                  <div className="space-y-1">
                    <span className={`text-xs font-extrabold ${quest.completed ? 'text-brand-success line-through' : 'text-foreground'}`}>
                      {quest.title}
                    </span>
                    <p className="text-[10px] text-muted-foreground">Reward: {quest.reward}</p>
                  </div>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                    quest.completed ? 'bg-brand-success/10 text-brand-success' : 'bg-foreground/10 text-foreground'
                  }`}>
                    {quest.completed ? 'Completed' : '0/1'}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
