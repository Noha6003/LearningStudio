'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useThemeMode } from '@/components/providers/theme-mode-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AdvancedOptions } from '@/components/ui/advanced-options';
import { 
  ArrowLeft, Plus, Trash2, Settings, HelpCircle, 
  Sparkles, Save, Eye, Layout, Sliders, Type, MapPin 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface QuestionSlide {
  id: string;
  type: string;
  text: string;
  options: string[];
  correctAnswer?: string;
  timeLimit: number;
  points: number;
}

export default function QuizBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const { themeMode } = useThemeMode();
  const isKids = themeMode === 'kids';

  const [slides, setSlides] = useState<QuestionSlide[]>([
    { id: '1', type: 'QUIZ', text: 'What planet is known as the Red Planet?', options: ['Earth', 'Mars', 'Jupiter', 'Venus'], correctAnswer: 'Mars', timeLimit: 30, points: 1000 },
    { id: '2', type: 'TRUE_FALSE', text: 'Mars has liquid water oceans on its surface today.', options: ['True', 'False'], correctAnswer: 'False', timeLimit: 20, points: 1000 }
  ]);

  const [activeSlideId, setActiveSlideId] = useState<string>('1');

  // Find currently active slide
  const activeSlide = slides.find(s => s.id === activeSlideId) || slides[0];

  const questionTypes = {
    Knowledge: [
      { id: 'QUIZ', label: '✅ Quiz (Multiple Choice)' },
      { id: 'TRUE_FALSE', label: '✅ True or False' },
      { id: 'TYPE_ANSWER', label: '✅ Type Answer' },
      { id: 'SLIDER', label: '✅ Numeric Slider' },
      { id: 'PIN_ANSWER', label: '✅ Pin Answer' },
      { id: 'PUZZLE', label: '✅ Puzzle (Order)' },
      { id: 'MATCHING', label: '✅ Matching Pairs' },
      { id: 'FILL_IN_BLANK', label: '✅ Fill in the Blank' }
    ],
    Opinion: [
      { id: 'POLL', label: '📊 Poll' },
      { id: 'SCALE', label: '📊 Scale (1-10)' },
      { id: 'NPS_SCALE', label: '📊 NPS Scale' },
      { id: 'DROP_PIN', label: '📊 Drop Pin (Heatmap)' },
      { id: 'WORD_CLOUD', label: '📊 Word Cloud' },
      { id: 'OPEN_ENDED', label: '📊 Open Ended' },
      { id: 'BRAINSTORM', label: '📊 Brainstorm Card Wall' }
    ],
    MediaSlides: [
      { id: 'CLASSIC_SLIDE', label: '📺 Classic Slide' },
      { id: 'BIG_TITLE', label: '📺 Big Title Slide' },
      { id: 'TITLE_TEXT', label: '📺 Title + Text' },
      { id: 'BULLET_POINTS', label: '📺 Bullet Points' },
      { id: 'QUOTE', label: '📺 Quote Slide' },
      { id: 'BIG_MEDIA', label: '📺 Big Media Focus' }
    ]
  };

  const handleUpdateSlide = (updated: Partial<QuestionSlide>) => {
    setSlides(prev => prev.map(s => s.id === activeSlideId ? { ...s, ...updated } : s));
  };

  const handleAddSlide = () => {
    const newId = String(Date.now());
    const newSlide: QuestionSlide = {
      id: newId,
      type: 'QUIZ',
      text: 'New Question...',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A',
      timeLimit: 30,
      points: 1000
    };
    setSlides(prev => [...prev, newSlide]);
    setActiveSlideId(newId);
  };

  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter(s => s.id !== id);
    setSlides(newSlides);
    if (activeSlideId === id) {
      setActiveSlideId(newSlides[0].id);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50">
      
      {/* Top action bar */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button onClick={() => router.push('/dashboard')} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Exit
          </Button>
          <span className="font-bold text-sm text-muted-foreground border-l pl-3">
            Quiz Builder: Grade 6 Astronomy
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1.5" /> Preview
          </Button>
          <Button variant="primary" size="sm">
            <Save className="h-4 w-4 mr-1.5" /> Save Changes
          </Button>
        </div>
      </header>

      {/* Editor Layout split panel */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Slide Timeline list */}
        <div className="w-56 border-r border-border bg-background p-4 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Slides Timeline</h3>
            <div className="space-y-2">
              {slides.map((slide, index) => (
                <div 
                  key={slide.id}
                  onClick={() => setActiveSlideId(slide.id)}
                  className={`group relative p-3 rounded-xl border-2 text-left cursor-pointer transition-all ${
                    activeSlideId === slide.id 
                      ? 'border-brand-primary bg-brand-primary/[0.03]' 
                      : 'border-border bg-card/40 hover:bg-card'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black text-brand-primary">SLIDE {index + 1}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteSlide(slide.id); }}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-brand-danger transition-opacity h-3.5 w-3.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-relaxed">{slide.text}</p>
                  <span className="text-[9px] mt-1 bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-medium inline-block uppercase">
                    {slide.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleAddSlide} variant="outline" className="w-full mt-4">
            <Plus className="h-4 w-4 mr-1" /> Add Slide
          </Button>
        </div>

        {/* Center: Slide Editor Canvas */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-6 max-w-4xl mx-auto w-full">
            
            {/* Input for active slide question/content text */}
            <Card className="p-6 border-2 border-border bg-background">
              <div className="space-y-1 mb-4">
                <span className="text-[10px] font-black text-brand-primary uppercase tracking-wider">Slide Question / Title</span>
              </div>
              <textarea
                value={activeSlide.text}
                onChange={(e) => handleUpdateSlide({ text: e.target.value })}
                placeholder="E.g. Type your question here..."
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-md font-bold focus:outline-none focus:ring-1 focus:ring-brand-primary resize-none h-24"
              />
            </Card>

            {/* Render options inputs based on question type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* IF MULTIPLE CHOICE */}
              {activeSlide.type === 'QUIZ' && activeSlide.options.map((opt, idx) => (
                <Card key={idx} className={`p-4 border-2 ${
                  opt === activeSlide.correctAnswer 
                    ? 'border-brand-success bg-brand-success/[0.02]' 
                    : 'border-border'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase text-slate-400">Option {idx + 1}</span>
                    <input 
                      type="radio" 
                      name="correctAnswer"
                      checked={opt === activeSlide.correctAnswer}
                      onChange={() => handleUpdateSlide({ correctAnswer: opt })}
                      className="h-3.5 w-3.5 text-brand-success focus:ring-brand-success"
                    />
                  </div>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...activeSlide.options];
                      newOpts[idx] = e.target.value;
                      handleUpdateSlide({ options: newOpts });
                    }}
                    className="w-full bg-transparent border-none text-sm font-bold text-slate-800 focus:outline-none"
                  />
                </Card>
              ))}

              {/* IF TRUE OR FALSE */}
              {activeSlide.type === 'TRUE_FALSE' && ['True', 'False'].map((opt, idx) => (
                <Card key={idx} className={`p-4 border-2 ${
                  opt === activeSlide.correctAnswer 
                    ? 'border-brand-success bg-brand-success/[0.02]' 
                    : 'border-border'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-800">{opt}</span>
                    <input 
                      type="radio" 
                      name="correctAnswer"
                      checked={opt === activeSlide.correctAnswer}
                      onChange={() => handleUpdateSlide({ correctAnswer: opt, options: ['True', 'False'] })}
                      className="h-4 w-4 text-brand-success"
                    />
                  </div>
                </Card>
              ))}

              {/* IF SLIDER (Numeric input) */}
              {activeSlide.type === 'SLIDER' && (
                <Card className="p-6 border-2 border-border md:col-span-2 space-y-4">
                  <span className="text-[10px] font-black uppercase text-slate-400">Numeric Slider Settings</span>
                  <div className="flex items-center space-x-4">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      defaultValue="50" 
                      className="flex-1 accent-brand-primary" 
                    />
                    <span className="font-extrabold text-md border px-3 py-1 rounded">50</span>
                  </div>
                </Card>
              )}

              {/* IF OPEN ENDED OR SLIDES */}
              {['OPEN_ENDED', 'CLASSIC_SLIDE', 'BIG_TITLE'].includes(activeSlide.type) && (
                <Card className="p-6 border-2 border-border md:col-span-2 flex items-center justify-center bg-slate-50/50">
                  <p className="text-xs text-muted-foreground text-center">
                    This slide type does not require response option blocks. Focus on completing your question prompt text above.
                  </p>
                </Card>
              )}

            </div>
          </div>
        </div>

        {/* Right Side: Options & Type Settings */}
        <div className="w-64 border-l border-border bg-background p-4 overflow-y-auto space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Layout className="h-3.5 w-3.5 text-brand-primary" />
              <span>Slide Type</span>
            </h3>
            
            <div className="space-y-4">
              {/* Organised selectors */}
              {Object.entries(questionTypes).map(([category, types]) => (
                <div key={category} className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">{category}</span>
                  <select 
                    value={activeSlide.type}
                    onChange={(e) => handleUpdateSlide({ type: e.target.value })}
                    className="w-full bg-card border border-border rounded-lg p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  >
                    {types.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border/40 pt-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Sliders className="h-3.5 w-3.5 text-brand-primary" />
              <span>Basic Settings</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Timer (Sec)</label>
                <select
                  value={activeSlide.timeLimit}
                  onChange={(e) => handleUpdateSlide({ timeLimit: Number(e.target.value) })}
                  className="bg-card border border-border rounded p-1.5 text-xs font-semibold"
                >
                  <option value="10">10s</option>
                  <option value="20">20s</option>
                  <option value="30">30s</option>
                  <option value="60">60s</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Points</label>
                <select
                  value={activeSlide.points}
                  onChange={(e) => handleUpdateSlide({ points: Number(e.target.value) })}
                  className="bg-card border border-border rounded p-1.5 text-xs font-semibold"
                >
                  <option value="500">500 XP</option>
                  <option value="1000">1000 XP</option>
                  <option value="2000">2000 XP</option>
                </select>
              </div>
            </div>
          </div>

          <AdvancedOptions title="Advanced Settings">
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="randomizeOpt" className="rounded" />
                <label htmlFor="randomizeOpt" className="text-xs font-semibold text-slate-600">Randomize answer order</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="allowExplain" className="rounded" />
                <label htmlFor="allowExplain" className="text-xs font-semibold text-slate-600">Add explanation drawer</label>
              </div>
            </div>
          </AdvancedOptions>
        </div>

      </div>
    </div>
  );
}
