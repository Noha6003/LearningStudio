'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useThemeMode } from '@/components/providers/theme-mode-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, Users, Trophy, Flame, Coins, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveQuizStudentLobby() {
  const router = useRouter();
  const params = useParams();
  const { themeMode } = useThemeMode();
  const isKids = themeMode === 'kids';

  const [gameState, setGameState] = useState<any>({
    state: 'LOBBY',
    participants: ['Sammy Star', 'Billy Comet'],
    code: params.code || 'SPACE6'
  });

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Hook into our Server Sent Events route
  useEffect(() => {
    let eventSource: EventSource;

    const startStream = () => {
      eventSource = new EventSource(`/api/live-quiz/events?code=${params.code || 'SPACE6'}`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setGameState(data);
        
        // Reset selections on new question
        if (data.state === 'QUESTION') {
          setSelectedOption(null);
          setFeedback(null);
        }

        // Apply feedback on leaderboard stage
        if (data.state === 'LEADERBOARD') {
          const myStats = data.standings.find((s: any) => s.name === 'Sammy Star');
          if (myStats) {
            setStreak(myStats.streak);
            setTotalXp(myStats.score);
            setFeedback(myStats.streak > 0 ? 'Correct Answer!' : 'Incorrect!');
          }
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
      };
    };

    const timer = setTimeout(startStream, 1000);

    return () => {
      clearTimeout(timer);
      if (eventSource) eventSource.close();
    };
  }, [params.code]);

  const handleSelectOption = (opt: string) => {
    setSelectedOption(opt);
    // Sound on click in kids mode
    if (isKids && typeof window !== 'undefined') {
      try {
        const audio = new Audio('/audio/click.mp3');
        audio.volume = 0.2;
        audio.play().catch(() => {});
      } catch (err) {}
    }
  };

  const optionColors = [
    'bg-red-500 hover:bg-red-600 border-red-600 active:border-b-0 shadow-red-500/20',
    'bg-blue-500 hover:bg-blue-600 border-blue-600 active:border-b-0 shadow-blue-500/20',
    'bg-green-500 hover:bg-green-600 border-green-600 active:border-b-0 shadow-green-500/20',
    'bg-yellow-500 hover:bg-yellow-600 border-yellow-600 active:border-b-0 shadow-yellow-500/20'
  ];

  return (
    <div className="flex-1 bg-gradient-to-b from-sky-100 to-sky-50 text-slate-800 min-h-screen p-6 flex flex-col justify-between overflow-x-hidden">
      
      {/* Student Lobbies HUD */}
      <header className="bg-white/80 backdrop-blur-sm border-2 border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          <Gamepad2 className="h-5 w-5 text-brand-primary" />
          <span className="font-extrabold text-sm text-slate-800">Lobby Code: {gameState.code}</span>
        </div>
        <div className="flex items-center space-x-3 text-xs font-bold">
          <div className="flex items-center space-x-1 bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-full text-orange-700">
            <Flame className="h-3 w-3 fill-orange-400 text-orange-500" />
            <span>{streak} Streak</span>
          </div>
          <div className="flex items-center space-x-1 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full text-amber-700">
            <Coins className="h-3 w-3 fill-amber-400 text-amber-500" />
            <span>{totalXp} XP</span>
          </div>
        </div>
      </header>

      {/* Controller Area */}
      <div className="flex-1 flex flex-col items-center justify-center py-10 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          
          {/* LOBBY VIEW: WAITING */}
          {gameState.state === 'LOBBY' && (
            <motion.div 
              key="lobby"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="text-center space-y-6 w-full"
            >
              <div className="animate-bounce text-6xl">🤖</div>
              <h2 className="text-2xl font-black text-slate-800">You are in, Sammy Star!</h2>
              <p className="text-sm text-slate-500">See your avatar card list synced on the Teacher's projector board. Waiting for other players...</p>
              
              <div className="bg-white border-2 border-slate-100 p-4 rounded-2xl flex items-center justify-center space-x-2">
                <Users className="h-4 w-4 text-brand-primary animate-pulse" />
                <span className="text-xs font-bold text-slate-500">Joined Players: {gameState.participants.join(', ')}</span>
              </div>
            </motion.div>
          )}

          {/* ACTIVE QUESTION: SELECT COLOUR BUTTON */}
          {gameState.state === 'QUESTION' && (
            <motion.div 
              key="question"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full space-y-6"
            >
              <div className="text-center">
                <span className="text-[10px] font-black text-brand-primary uppercase tracking-wider">Tap your choice color:</span>
              </div>

              {!selectedOption ? (
                <div className="grid grid-cols-2 gap-4 w-full h-80">
                  {gameState.options.map((opt: string, idx: number) => (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(opt)}
                      className={`text-white font-extrabold text-lg flex items-center justify-center border-b-4 transition-all rounded-3xl cursor-pointer ${
                        optionColors[idx % optionColors.length]
                      }`}
                    >
                      <span className="text-center">{idx + 1}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center space-y-4 py-12">
                  <div className="h-16 w-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mx-auto animate-pulse">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-black">Answer Locked!</h3>
                  <p className="text-xs text-slate-500">Check the Teacher's board to see if you got it right.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* LEADERBOARD VIEW: FEEDBACK */}
          {gameState.state === 'LEADERBOARD' && (
            <motion.div 
              key="leaderboard"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="text-center space-y-6 w-full"
            >
              {feedback === 'Correct Answer!' ? (
                <div className="space-y-4">
                  <div className="h-20 w-20 bg-brand-success/10 rounded-full flex items-center justify-center text-brand-success mx-auto">
                    <Trophy className="h-10 w-10 animate-bounce" />
                  </div>
                  <h2 className="text-2xl font-black text-brand-success">Awesome, correct!</h2>
                  <p className="text-xs text-slate-500">Streak: 🔥 {streak} questions correct in a row!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-20 w-20 bg-brand-danger/10 rounded-full flex items-center justify-center text-brand-danger mx-auto">
                    <XCircle className="h-10 w-10" />
                  </div>
                  <h2 className="text-2xl font-black text-brand-danger">Oops, incorrect!</h2>
                  <p className="text-xs text-slate-500">Keep your focus. You'll get the next one!</p>
                </div>
              )}
            </motion.div>
          )}

          {/* PODIUM VIEW: WIN */}
          {gameState.state === 'PODIUM' && (
            <motion.div 
              key="podium"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-6 w-full"
            >
              <div className="text-5xl animate-bounce">🏆</div>
              <h2 className="text-3xl font-black text-slate-800">Podium Finisher!</h2>
              <p className="text-sm text-slate-500">
                Congratulations! You finished on the podium. Great job studying Mars space modules!
              </p>
              
              <Button onClick={() => router.push('/dashboard')} variant="primary" className="w-full">
                Go to Dashboard
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="text-center text-[10px] opacity-40">
        Live connection: SPACE6
      </footer>
    </div>
  );
}
