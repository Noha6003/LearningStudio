'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useThemeMode } from '@/components/providers/theme-mode-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, Volume2, Mic, Sparkles, Clock, 
  HelpCircle, ChevronRight, CheckCircle, XCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function QuizPlayPage() {
  const router = useRouter();
  const params = useParams();
  const { themeMode } = useThemeMode();
  const isKids = themeMode === 'kids';

  // Mock quiz questions
  const quiz = {
    title: 'Solar System Exploration',
    questions: [
      { id: '1', text: 'What is the closest planet to the Sun?', options: ['Mercury', 'Venus', 'Earth', 'Mars'], correct: 'Mercury', explanation: 'Mercury is the closest planet, orbiting at a distance of about 58 million kilometers.' },
      { id: '2', text: 'Is Mars bigger than the planet Earth?', options: ['True', 'False'], correct: 'False', explanation: 'Mars is about half the size of Earth, making it the second-smallest planet in the Solar System.' }
    ]
  };

  const [activeQIdx, setActiveQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  
  // AI Tutor States
  const [showTutor, setShowTutor] = useState(false);
  const [tutorReply, setTutorReply] = useState('');
  const [isTutorLoading, setIsTutorLoading] = useState(false);

  // Text to Speech Narrator (Web Speech API)
  const speakQuestion = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const text = `${quiz.questions[activeQIdx].text}. Your choices are: ${quiz.questions[activeQIdx].options.join(', ')}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speech to Text Voice input
  const [isListening, setIsListening] = useState(false);
  const startVoiceInput = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;
      
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        console.log('Voice recognized: ', resultText);
        // Find closest match in options
        const match = quiz.questions[activeQIdx].options.find(opt => 
          opt.toLowerCase().includes(resultText.toLowerCase()) || 
          resultText.toLowerCase().includes(opt.toLowerCase())
        );
        if (match) {
          setSelectedOpt(match);
        }
      };
      recognition.start();
    }
  };

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || hasSubmitted) return;
    const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, hasSubmitted]);

  const activeQuestion = quiz.questions[activeQIdx];

  const handleSubmit = () => {
    if (!selectedOpt) return;
    setHasSubmitted(true);
  };

  const handleNext = () => {
    if (activeQIdx < quiz.questions.length - 1) {
      setActiveQIdx(prev => prev + 1);
      setSelectedOpt(null);
      setHasSubmitted(false);
      setTimeLeft(30);
      setTutorReply('');
    } else {
      router.push('/dashboard');
    }
  };

  // Ask AI Tutor Socratic helper
  const handleAskTutor = async (promptType: string) => {
    setIsTutorLoading(true);
    setTutorReply('');
    
    try {
      const prompt = promptType === 'explain'
        ? `Explain question: "${activeQuestion.text}" and why the correct answer is "${activeQuestion.correct}". Do not give the answer away directly, use Socratic hints.`
        : `Explain question: "${activeQuestion.text}" and concept in a very simple way suitable for a 10 year old child.`;

      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'STUDENT', prompt })
      });
      const data = await res.json();
      setTutorReply(data.reply || 'AI could not respond.');
    } catch (err) {
      setTutorReply('Tutor AI offline. Focus on the options!');
    } finally {
      setIsTutorLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50">
      
      {/* Top HUD */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background px-6 py-4 flex items-center justify-between">
        <Button onClick={() => router.push('/dashboard')} variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" /> Quit
        </Button>
        <span className="font-extrabold text-sm text-slate-800">{quiz.title}</span>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={speakQuestion}>
            <Volume2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={startVoiceInput} 
            className={isListening ? 'bg-brand-danger/10 border-brand-danger text-brand-danger animate-pulse' : ''}
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Playing Interface */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-6 flex flex-col md:flex-row gap-8 justify-center items-center md:items-stretch">
        
        {/* Left Side: Game Canvas */}
        <div className="flex-1 flex flex-col justify-between space-y-6 w-full">
          
          {/* Question Box */}
          <Card className={cn("p-8 text-center relative", isKids ? "border-4 rounded-[2rem] bg-white" : "border")}>
            
            {/* Timer circle badge */}
            <div className="absolute top-4 right-4 flex items-center space-x-1 text-xs font-bold text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              <span>{timeLeft}s</span>
            </div>

            <span className="text-[10px] font-black text-brand-primary uppercase tracking-wider">
              Question {activeQIdx + 1} of {quiz.questions.length}
            </span>
            
            <h2 className={cn("mt-4 leading-snug", isKids ? "text-2xl md:text-3xl font-black text-slate-800" : "text-xl font-bold")}>
              {activeQuestion.text}
            </h2>
          </Card>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {activeQuestion.options.map((opt) => {
              const isSelected = opt === selectedOpt;
              const isCorrect = opt === activeQuestion.correct;
              
              let borderStyle = "border-border";
              let bgStyle = "bg-white hover:bg-slate-50";

              if (hasSubmitted) {
                if (isCorrect) {
                  borderStyle = "border-brand-success bg-brand-success/[0.04] text-brand-success";
                } else if (isSelected) {
                  borderStyle = "border-brand-danger bg-brand-danger/[0.04] text-brand-danger";
                } else {
                  borderStyle = "border-border opacity-50";
                }
              } else if (isSelected) {
                borderStyle = "border-brand-primary bg-brand-primary/[0.02]";
              }

              return (
                <button
                  key={opt}
                  disabled={hasSubmitted}
                  onClick={() => setSelectedOpt(opt)}
                  className={cn(
                    "p-5 text-left font-bold transition-all border-2 text-sm cursor-pointer select-none",
                    isKids ? "rounded-3xl border-3 text-md" : "rounded-xl",
                    borderStyle,
                    bgStyle
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {hasSubmitted && isCorrect && <CheckCircle className="h-5 w-5 text-brand-success shrink-0" />}
                    {hasSubmitted && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-brand-danger shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between">
            <Button 
              onClick={() => setShowTutor(!showTutor)} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1.5"
            >
              <HelpCircle className="h-4 w-4 text-brand-primary" />
              <span>Ask AI Tutor</span>
            </Button>

            {!hasSubmitted ? (
              <Button onClick={handleSubmit} disabled={!selectedOpt} variant="primary">
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNext} variant="primary" className="flex items-center gap-1.5">
                <span>{activeQIdx === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Right Side: AI Tutor Side drawer */}
        <AnimatePresence>
          {showTutor && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="w-full md:w-80 shrink-0 border border-border rounded-2xl bg-card p-6 flex flex-col justify-between space-y-4 shadow-md overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b mb-4">
                  <h3 className="font-extrabold text-sm flex items-center space-x-1.5 text-brand-primary">
                    <Sparkles className="h-4.5 w-4.5" />
                    <span>AI Tutor Assistance</span>
                  </h3>
                  <button onClick={() => setShowTutor(false)} className="text-xs text-muted-foreground hover:text-foreground">
                    Hide
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      onClick={() => handleAskTutor('explain')} 
                      disabled={isTutorLoading} 
                      variant="outline" 
                      size="sm"
                      className="text-xs font-semibold justify-start"
                    >
                      💡 Socratic Explanation (Hint)
                    </Button>
                    <Button 
                      onClick={() => handleAskTutor('kids')} 
                      disabled={isTutorLoading} 
                      variant="outline" 
                      size="sm"
                      className="text-xs font-semibold justify-start"
                    >
                      🦄 Explain like I'm 10
                    </Button>
                  </div>

                  {isTutorLoading && (
                    <p className="text-xs text-muted-foreground animate-pulse text-center pt-4">Tutor AI is writing response...</p>
                  )}

                  {tutorReply && (
                    <div className="bg-background border p-4 rounded-xl text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                      {tutorReply}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
