'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useThemeMode } from '@/components/providers/theme-mode-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Users, Trophy, Sparkles, ArrowRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveQuizProjectorPage() {
  const router = useRouter();
  const params = useParams();
  const { themeMode } = useThemeMode();
  const isKids = themeMode === 'kids';

  const [gameState, setGameState] = useState<any>({
    state: 'LOBBY',
    participants: ['Sammy Star', 'Billy Comet'],
    code: 'SPACE6'
  });

  const [connected, setConnected] = useState(false);

  // Hook into our Server Sent Events route
  useEffect(() => {
    let eventSource: EventSource;

    const startStream = () => {
      eventSource = new EventSource('/api/live-quiz/events?code=SPACE6');
      
      eventSource.onopen = () => {
        setConnected(true);
      };

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setGameState(data);
      };

      eventSource.onerror = () => {
        setConnected(false);
        eventSource.close();
      };
    };

    // Delay slightly to allow server setup
    const timer = setTimeout(startStream, 1000);

    return () => {
      clearTimeout(timer);
      if (eventSource) eventSource.close();
    };
  }, []);

  return (
    <div className="flex-1 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white min-h-screen p-8 flex flex-col justify-between overflow-x-hidden">
      
      {/* HUD Header */}
      <header className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-brand-primary animate-pulse" />
          <span className="font-extrabold text-xl tracking-wider">Luminary Live Lobbies</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className={`h-2.5 w-2.5 rounded-full ${connected ? 'bg-brand-success animate-ping' : 'bg-brand-danger'}`}></div>
          <span className="opacity-60">{connected ? 'Live Sync Active' : 'Disconnected'}</span>
        </div>
      </header>

      {/* Dynamic Lobbies views */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          
          {/* LOBBY VIEW */}
          {gameState.state === 'LOBBY' && (
            <motion.div 
              key="lobby"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="text-center space-y-8 w-full"
            >
              <div className="space-y-3">
                <span className="text-xs uppercase font-extrabold tracking-widest text-brand-secondary">Join Code / PIN</span>
                <h1 className="text-6xl md:text-8xl font-black tracking-widest text-brand-primary animate-pulse">
                  {gameState.code}
                </h1>
                <p className="text-sm text-slate-300">Enter this code on your student dashboard to participate!</p>
              </div>

              {/* QR Mock */}
              <div className="w-36 h-36 bg-white p-3 rounded-2xl mx-auto border-4 border-brand-primary shadow-lg flex items-center justify-center">
                <span className="text-slate-800 text-[10px] font-extrabold uppercase text-center leading-tight">Mock Join<br />QR Code</span>
              </div>

              {/* Participants */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1.5">
                  <Users className="h-4.5 w-4.5" />
                  <span>Joined Players ({gameState.participants.length}):</span>
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {gameState.participants.map((player: string, idx: number) => (
                    <motion.span
                      key={idx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-4 py-2 bg-white/10 rounded-full border border-white/20 text-sm font-bold tracking-tight inline-block"
                    >
                      {player}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* QUESTION VIEW */}
          {gameState.state === 'QUESTION' && (
            <motion.div 
              key="question"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-center space-y-8 w-full"
            >
              <span className="text-xs uppercase font-extrabold tracking-wider text-brand-secondary">Active Live Question</span>
              <h2 className="text-3xl md:text-5xl font-black leading-snug">{gameState.text}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto w-full pt-4">
                {gameState.options.map((opt: string, idx: number) => (
                  <Card key={idx} className="bg-white/5 border-white/15 p-5 text-md font-bold rounded-2xl">
                    <span className="text-brand-secondary mr-2">Choice {idx + 1}:</span> {opt}
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* LEADERBOARD VIEW */}
          {gameState.state === 'LEADERBOARD' && (
            <motion.div 
              key="leaderboard"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full max-w-xl text-center space-y-6"
            >
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-brand-success">Question Results</span>
                <h2 className="text-2xl font-black mt-1">Standings</h2>
              </div>

              <div className="border border-white/10 rounded-3xl overflow-hidden bg-white/5 divide-y divide-white/10 text-left">
                {gameState.standings.map((player: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 text-sm font-bold">
                    <div className="flex items-center space-x-3">
                      <span className="opacity-50">#{idx + 1}</span>
                      <span>{player.name}</span>
                      {player.streak > 0 && <span className="text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-400">🔥 {player.streak} Streak</span>}
                    </div>
                    <span>{player.score} XP</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PODIUM VIEW */}
          {gameState.state === 'PODIUM' && (
            <motion.div 
              key="podium"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-8 w-full"
            >
              <div>
                <Trophy className="h-16 w-16 text-yellow-400 fill-yellow-400/20 mx-auto animate-bounce" />
                <h1 className="text-4xl md:text-6xl font-black mt-4 bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
                  Live Game Podium
                </h1>
              </div>

              {/* 3 Pedestals */}
              <div className="flex items-end justify-center gap-4 pt-12 h-64 max-w-md mx-auto w-full">
                {/* 2nd Place */}
                <div className="flex flex-col items-center flex-1">
                  <span className="text-xs font-bold truncate mb-2">{gameState.second}</span>
                  <div className="bg-slate-400/20 border border-slate-400/40 w-full h-24 rounded-t-xl flex items-center justify-center font-black text-2xl text-slate-300">2</div>
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center flex-1">
                  <span className="text-sm font-black truncate mb-2 text-yellow-400 flex items-center gap-1">
                    <Sparkles className="h-4 w-4" /> {gameState.first}
                  </span>
                  <div className="bg-yellow-400/20 border border-yellow-400/40 w-full h-36 rounded-t-xl flex items-center justify-center font-black text-4xl text-yellow-400 shadow-[0_0_20px_#f59e0b]">1</div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center flex-1">
                  <span className="text-xs font-bold truncate mb-2">{gameState.third}</span>
                  <div className="bg-amber-800/20 border border-amber-800/40 w-full h-16 rounded-t-xl flex items-center justify-center font-black text-xl text-amber-700">3</div>
                </div>
              </div>

              <Button onClick={() => router.push('/dashboard')} variant="outline" className="text-white border-white/20">
                Back to Dashboard
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs opacity-40 border-t border-white/10 pt-4">
        Powered by Next.js Server-Sent Events (SSE). Seamless serverless sync.
      </footer>
    </div>
  );
}
