'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { 
  Sparkles, BookOpen, Brain, Play, Mic, Globe, 
  Clock, Award, HelpCircle, CheckCircle, Upload, Flame, ChevronRight, X, GraduationCap 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VocabWord {
  word: string;
  definition: string;
  definitionAr: string;
  exampleEn: string;
  exampleAr: string;
}

export function StudentDashboard({ user }: { user: any }) {
  // Global Bilingual States
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [theme, setTheme] = useState<'light' | 'dark' | 'purple'>('dark');

  // Sub-screens: 'home' | 'quiz' | 'doc' | 'flashcards' | 'pronounce'
  const [activeScreen, setActiveScreen] = useState<'home' | 'quiz' | 'doc' | 'flashcards' | 'pronounce'>('home');

  // Database State counters
  const [dueCardsCount, setDueCardsCount] = useState(0);
  const [quizzesList, setQuizzesList] = useState<any[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);

  // Load user language preference and initial DB counts
  useEffect(() => {
    // Determine language setting from DB (fallback to en)
    if (user?.language) setLang(user.language as 'en' | 'ar');
    fetchDashboardStats();
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      // 1. Fetch due flashcards count
      const cardRes = await fetch('/api/flashcards/stats');
      if (cardRes.ok) {
        const cardData = await cardRes.json();
        setDueCardsCount(cardData.dueCount || 0);
      }

      // 2. Fetch created quizzes
      const quizRes = await fetch('/api/quiz/list');
      if (quizRes.ok) {
        const quizData = await quizRes.json();
        setQuizzesList(quizData.quizzes || []);
        setQuizAttempts(quizData.attempts || []);
        setStreak(quizData.streak || 0);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  const toggleLanguage = async () => {
    const nextLang = lang === 'en' ? 'ar' : 'en';
    setLang(nextLang);
    // Persist to user profile in DB
    try {
      await fetch('/api/user/language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: nextLang })
      });
    } catch (err) {}
  };

  // Translations Dictionary
  const t = {
    welcome: { en: "Welcome back, Noha!", ar: "مرحباً بكِ مجدداً، نهى!" },
    playQuiz: { en: "Play a Quiz", ar: "العب اختباراً" },
    playQuizDesc: { en: "Practice vocabulary with multiple-choice questions.", ar: "تمرّني على المفردات باستخدام أسئلة الاختيار من متعدد." },
    uploadLesson: { en: "Upload a Lesson", ar: "دراسة مستند" },
    uploadLessonDesc: { en: "Summarize text and extract key vocabulary words.", ar: "لخّصي النصوص واستخرجي المفردات الأساسية." },
    reviewVocab: { en: "Review Vocabulary", ar: "مراجعة المفردات" },
    reviewVocabDesc: { en: "SM-2 Spaced Repetition flashcard deck.", ar: "مجموعة بطاقات المراجعة الذكية المتباعدة." },
    pronounce: { en: "Pronunciation Practice", ar: "ممارسة النطق" },
    pronounceDesc: { en: "Read sentences aloud and check your accuracy score.", ar: "اقرئي الجمل بصوت عالٍ وتحققي من دقة نطقكِ." },
    dueToday: { en: "Cards due today", ar: "البطاقات المستحقة اليوم" },
    streakLabel: { en: "Day Streak", ar: "أيام متتالية" },
    back: { en: "Back to Home", ar: "العودة للرئيسية" },
    startBtn: { en: "Start Activity", ar: "بدء النشاط" },
    noQuizzes: { en: "No quizzes created yet. Enter a topic below to generate your first quiz!", ar: "لا توجد اختبارات بعد. أدخلي موضوعاً لإنشاء اختباركِ الأول!" },
    generateQuiz: { en: "Generate New Quiz", ar: "إنشاء اختبار جديد" },
    topicPlaceholder: { en: "E.g. Travel, Kitchen words, Past tense verbs...", ar: "مثال: السفر، كلمات المطبخ، أفعال الماضي..." },
    generating: { en: "AI is creating your quiz...", ar: "يقوم الذكاء الاصطناعي بإنشاء اختباركِ..." }
  };

  const isRtl = lang === 'ar';

  return (
    <div 
      className="flex-1 bg-background text-foreground py-8 px-6 max-w-7xl mx-auto w-full transition-all"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      
      {/* Header Panel */}
      <header className="flex flex-col sm:flex-row items-center justify-between border-b border-border/30 pb-6 mb-8 gap-4">
        <div className="flex items-center space-x-3 gap-3">
          <div className="h-12 w-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 shrink-0">
            <GraduationCap className="h-7 w-7 text-brand-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">{t.welcome[lang]}</h1>
            <p className="text-sm text-slate-400">
              {dueCardsCount > 0 
                ? (lang === 'en' ? `You have ${dueCardsCount} words to review today!` : `لديكِ ${dueCardsCount} كلمات للمراجعة اليوم!`)
                : (lang === 'en' ? "Great job! All cards completed for today." : "عمل رائع! تم إكمال جميع البطاقات اليوم.")
              }
            </p>
          </div>
        </div>

        {/* HUD Stats & Lang Toggle */}
        <div className="flex items-center space-x-4 gap-4 flex-wrap">
          <div className="flex items-center space-x-1.5 gap-1.5 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full text-orange-600 font-bold text-sm">
            <Flame className="h-5 w-5 fill-orange-500 text-orange-600 animate-pulse" />
            <span>{streak} {t.streakLabel[lang]}</span>
          </div>

          <Button 
            onClick={toggleLanguage} 
            variant="outline" 
            className="rounded-full px-5 py-2.5 font-extrabold flex items-center gap-2 text-sm"
          >
            <Globe className="h-4.5 w-4.5 text-brand-primary" />
            <span>{lang === 'en' ? 'العربية' : 'English'}</span>
          </Button>
        </div>
      </header>

      {/* Primary Navigation Router */}
      <AnimatePresence mode="wait">
        {activeScreen === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full"
          >
            
            {/* Play a Quiz Card */}
            <Card hoverEffect className="p-8 border-2 border-border/60 hover:border-brand-primary/40 flex flex-col justify-between h-72">
              <CardHeader className="p-0">
                <div className="h-14 w-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-4 border border-brand-primary/15">
                  <Play className="h-7 w-7" />
                </div>
                <CardTitle className="text-xl font-black">{t.playQuiz[lang]}</CardTitle>
                <CardDescription className="text-sm pt-2 leading-relaxed text-slate-400">{t.playQuizDesc[lang]}</CardDescription>
              </CardHeader>
              <Button 
                onClick={() => setActiveScreen('quiz')} 
                variant="primary" 
                className="w-full text-md font-bold py-3 mt-4 h-12"
              >
                {t.startBtn[lang]}
              </Button>
            </Card>

            {/* Document Helper Card */}
            <Card hoverEffect className="p-8 border-2 border-border/60 hover:border-brand-primary/40 flex flex-col justify-between h-72">
              <CardHeader className="p-0">
                <div className="h-14 w-14 rounded-2xl bg-brand-info/10 flex items-center justify-center text-brand-info mb-4 border border-brand-info/15">
                  <Upload className="h-7 w-7" />
                </div>
                <CardTitle className="text-xl font-black">{t.uploadLesson[lang]}</CardTitle>
                <CardDescription className="text-sm pt-2 leading-relaxed text-slate-400">{t.uploadLessonDesc[lang]}</CardDescription>
              </CardHeader>
              <Button 
                onClick={() => setActiveScreen('doc')} 
                variant="info" 
                className="w-full text-md font-bold py-3 mt-4 h-12"
              >
                {t.startBtn[lang]}
              </Button>
            </Card>

            {/* Vocabulary Spaced Repetition Card */}
            <Card hoverEffect className="p-8 border-2 border-border/60 hover:border-brand-primary/40 flex flex-col justify-between h-72">
              <CardHeader className="p-0">
                <div className="h-14 w-14 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary mb-4 border border-brand-secondary/15">
                  <Brain className="h-7 w-7" />
                </div>
                <CardTitle className="text-xl font-black">{t.reviewVocab[lang]}</CardTitle>
                <CardDescription className="text-sm pt-2 leading-relaxed text-slate-400">
                  {t.reviewVocabDesc[lang]} ({dueCardsCount} {t.dueToday[lang]})
                </CardDescription>
              </CardHeader>
              <Button 
                onClick={() => setActiveScreen('flashcards')} 
                variant="secondary" 
                className="w-full text-md font-bold py-3 mt-4 h-12"
              >
                {t.startBtn[lang]}
              </Button>
            </Card>

            {/* Pronunciation Practice Card */}
            <Card hoverEffect className="p-8 border-2 border-border/60 hover:border-brand-primary/40 flex flex-col justify-between h-72">
              <CardHeader className="p-0">
                <div className="h-14 w-14 rounded-2xl bg-brand-success/10 flex items-center justify-center text-brand-success mb-4 border border-brand-success/15">
                  <Mic className="h-7 w-7" />
                </div>
                <CardTitle className="text-xl font-black">{t.pronounce[lang]}</CardTitle>
                <CardDescription className="text-sm pt-2 leading-relaxed text-slate-400">{t.pronounceDesc[lang]}</CardDescription>
              </CardHeader>
              <Button 
                onClick={() => setActiveScreen('pronounce')} 
                variant="success" 
                className="w-full text-md font-bold py-3 mt-4 h-12"
              >
                {t.startBtn[lang]}
              </Button>
            </Card>

          </motion.div>
        )}

        {/* SCREEN: QUIZ BUILDER & PLAY */}
        {activeScreen === 'quiz' && (
          <QuizSubScreen lang={lang} onBack={() => { setActiveScreen('home'); fetchDashboardStats(); }} />
        )}

        {/* SCREEN: DOCUMENT HELPER */}
        {activeScreen === 'doc' && (
          <DocSubScreen lang={lang} onBack={() => { setActiveScreen('home'); fetchDashboardStats(); }} />
        )}

        {/* SCREEN: FLASHCARDS DECK */}
        {activeScreen === 'flashcards' && (
          <FlashcardSubScreen lang={lang} onBack={() => { setActiveScreen('home'); fetchDashboardStats(); }} />
        )}

        {/* SCREEN: PRONUNCIATION */}
        {activeScreen === 'pronounce' && (
          <PronunciationSubScreen lang={lang} onBack={() => { setActiveScreen('home'); fetchDashboardStats(); }} />
        )}
      </AnimatePresence>
    </div>
  );
}

// -------------------------------------------------------------
// SUB-SCREEN 1: QUIZ SUB SCREEN (Create and Play Quizzes)
// -------------------------------------------------------------
function QuizSubScreen({ lang, onBack }: { lang: 'en' | 'ar'; onBack: () => void }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  // Play State
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [quizTimeLeft, setQuizTimeLeft] = useState(30);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (activeQuizId === null || showResults || submitted) return;
    if (quizTimeLeft <= 0) {
      handleOptionSubmit(null);
      return;
    }
    const timer = setTimeout(() => setQuizTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [quizTimeLeft, activeQuizId, showResults, submitted]);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch('/api/quiz/list');
      if (res.ok) {
        const data = await res.json();
        setQuizzes(data.quizzes || []);
      }
    } catch (err) {}
  };

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicOrWords: topic })
      });
      if (res.ok) {
        setTopic('');
        await fetchQuizzes();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayQuiz = async (quizId: string) => {
    try {
      const res = await fetch(`/api/quiz/get?id=${quizId}`);
      if (res.ok) {
        const data = await res.json();
        setQuizQuestions(data.quiz.questions || []);
        setActiveQuizId(quizId);
        setCurrentIdx(0);
        setScore(0);
        setSelectedOpt(null);
        setSubmitted(false);
        setQuizTimeLeft(30);
        setShowResults(false);
      }
    } catch (err) {}
  };

  const handleOptionSubmit = (opt: string | null) => {
    setSelectedOpt(opt);
    setSubmitted(true);
    const q = quizQuestions[currentIdx];
    const correctOpt = q.options.find((o: any) => o.isCorrect);
    
    if (opt === correctOpt?.text) {
      setScore(prev => prev + 1000);
    }
  };

  const handleNextQuestion = async () => {
    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
      setSubmitted(false);
      setQuizTimeLeft(30);
    } else {
      setShowResults(true);
      // Save attempt in DB
      try {
        await fetch('/api/quiz/attempt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quizId: activeQuizId,
            score,
            timeSpent: 120
          })
        });
      } catch (err) {}
    }
  };

  const t = {
    back: { en: "Back to Home", ar: "العودة للرئيسية" },
    create: { en: "Generate New Quiz", ar: "إنشاء اختبار جديد" },
    topicPlaceholder: { en: "E.g. Travel, Kitchen words, Past tense verbs...", ar: "مثال: السفر، كلمات المطبخ، أفعال الماضي..." },
    generating: { en: "AI is creating your quiz...", ar: "يقوم الذكاء الاصطناعي بإنشاء اختباركِ..." },
    noQuizzes: { en: "No quizzes created yet. Enter a topic above to generate your first quiz!", ar: "لا توجد اختبارات بعد. أدخلي موضوعاً لإنشاء اختباركِ الأول!" },
    play: { en: "Play Quiz", ar: "العب الاختبار" },
    myQuizzes: { en: "Your English Quizzes", ar: "اختباراتكِ في اللغة الإنجليزية" },
    score: { en: "Score", ar: "النقاط" },
    results: { en: "Quiz Results", ar: "نتائج الاختبار" },
    finalScore: { en: "Your Final Score:", ar: "نقاطكِ النهائية:" },
    closeBtn: { en: "Close Quiz", ar: "إغلاق الاختبار" }
  };

  const isRtl = lang === 'ar';

  return (
    <div className="space-y-6">
      
      {/* Back bar */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline" size="sm">
          {t.back[lang]}
        </Button>
        <h2 className="text-xl font-black">{t.myQuizzes[lang]}</h2>
      </div>

      {activeQuizId === null ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Quiz card */}
          <Card className="p-6 border-2 border-border/40 bg-card/25 h-fit lg:col-span-1">
            <h3 className="text-md font-bold mb-4">{t.create[lang]}</h3>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t.topicPlaceholder[lang]}
              className="w-full bg-background border border-border/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary resize-none h-24 font-bold text-slate-800"
            />
            <Button 
              onClick={handleGenerate} 
              disabled={loading || !topic}
              variant="primary" 
              className="w-full mt-4 h-11 text-sm font-bold"
            >
              {loading ? t.generating[lang] : t.create[lang]}
            </Button>
          </Card>

          {/* List Quizzes */}
          <div className="lg:col-span-2 space-y-4">
            {quizzes.length === 0 ? (
              <p className="text-sm text-slate-400 bg-card/30 p-8 rounded-2xl border text-center font-semibold">
                {t.noQuizzes[lang]}
              </p>
            ) : (
              quizzes.map((quiz: any) => (
                <Card key={quiz.id} className="p-5 border-2 flex items-center justify-between bg-card/40">
                  <div>
                    <h4 className="font-extrabold text-md text-slate-800">{quiz.title}</h4>
                    <p className="text-xs text-slate-400 pt-1 font-medium">{quiz.description}</p>
                    <span className="text-[10px] uppercase font-bold text-slate-400 mt-2 inline-block">
                      {quiz.questions.length} {lang === 'en' ? 'Questions' : 'أسئلة'}
                    </span>
                  </div>
                  <Button onClick={() => handlePlayQuiz(quiz.id)} variant="outline" size="sm">
                    {t.play[lang]}
                  </Button>
                </Card>
              ))
            )}
          </div>

        </div>
      ) : (
        /* PLAY MODE HUD PANEL */
        <Card className="max-w-2xl mx-auto p-8 border-2 bg-card relative overflow-hidden">
          
          {!showResults ? (
            <div className="space-y-6">
              
              {/* Question HUD */}
              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-xs font-black text-brand-primary uppercase">
                  Question {currentIdx + 1} of {quizQuestions.length}
                </span>
                <div className="flex items-center space-x-1 gap-1 text-xs font-bold text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{quizTimeLeft}s</span>
                </div>
              </div>

              {/* Question Text */}
              <h3 className="text-xl font-extrabold text-slate-800 leading-snug">
                {quizQuestions[currentIdx]?.text}
              </h3>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-3 pt-4">
                {quizQuestions[currentIdx]?.options.map((opt: any) => {
                  const isSelected = opt.text === selectedOpt;
                  let borderStyle = "border-border";
                  let bgStyle = "bg-white hover:bg-slate-50";

                  if (submitted) {
                    if (opt.isCorrect) {
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
                      key={opt.id}
                      disabled={submitted}
                      onClick={() => handleOptionSubmit(opt.text)}
                      className={`p-4 text-left font-bold transition-all border-2 text-sm rounded-xl cursor-pointer ${borderStyle} ${bgStyle}`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Action bar */}
              {submitted && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="bg-slate-50 border p-4 rounded-xl text-xs leading-relaxed text-slate-600">
                    <strong className="block text-slate-700 font-bold mb-1">Explanation:</strong>
                    {quizQuestions[currentIdx]?.answerExplanation}
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleNextQuestion} variant="primary" size="sm">
                      {currentIdx === quizQuestions.length - 1 ? 'Finish Results' : 'Next Question'}
                    </Button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* RESULTS PAGE */
            <div className="text-center space-y-6 py-6">
              <div className="h-16 w-16 bg-brand-success/10 rounded-full flex items-center justify-center text-brand-success mx-auto">
                <Award className="h-9 w-9" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">{t.results[lang]}</h3>
                <p className="text-sm text-slate-400 mt-1">{t.finalScore[lang]}</p>
                <div className="text-4xl font-black text-brand-success mt-3">{score} XP</div>
              </div>

              <div className="pt-6">
                <Button onClick={() => setActiveQuizId(null)} variant="outline" className="w-full">
                  {t.closeBtn[lang]}
                </Button>
              </div>
            </div>
          )}

        </Card>
      )}

    </div>
  );
}

// -------------------------------------------------------------
// SUB-SCREEN 2: DOCUMENT HELPER SUB SCREEN (Summaries & Vocab)
// -------------------------------------------------------------
function DocSubScreen({ lang, onBack }: { lang: 'en' | 'ar'; onBack: () => void }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [vocab, setVocab] = useState<VocabWord[]>([]);
  const [notebookId, setNotebookId] = useState<string | null>(null);
  const [imported, setImported] = useState(false);

  // Chat parameters
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const handleProcess = async () => {
    if (!content) return;
    setLoading(true);
    setSummary('');
    setVocab([]);
    setImported(false);
    setChatMessages([]);

    try {
      const res = await fetch('/api/document/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title: `Document Study: ${new Date().toLocaleDateString()}` })
      });
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary || '');
        setVocab(data.vocabulary || []);
        setNotebookId(data.notebookId || null);
      }
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  const handleImportVocab = async () => {
    if (vocab.length === 0 || !notebookId) return;
    try {
      const res = await fetch('/api/flashcards/add-vocab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vocabulary: vocab, notebookId })
      });
      if (res.ok) {
        setImported(true);
      }
    } catch (err) {}
  };

  const handleChatSend = async () => {
    if (!chatInput || !summary) return;
    setChatLoading(true);
    const userMsg = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    try {
      const prompt = `Based on this document summary:\n"${summary}"\n\nAnswer this student question: "${chatInput}". Ground your answer in the document summary where possible.`;
      
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'STUDENT', prompt })
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [...prev, { role: 'model', content: data.reply }]);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'model', content: 'Could not fetch response.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const t = {
    back: { en: "Back to Home", ar: "العودة للرئيسية" },
    title: { en: "Study a Document", ar: "دراسة مستند" },
    desc: { en: "Paste an article, lesson text, or vocab lists here.", ar: "ألصقي مقالاً، نص الدرس، أو قوائم الكلمات هنا." },
    processBtn: { en: "Analyze Document", ar: "تحليل المستند" },
    processing: { en: "Analyzing text...", ar: "يجري تحليل النص..." },
    summary: { en: "Summary", ar: "الملخص" },
    vocab: { en: "Extracted Vocabulary", ar: "المفردات المستخرجة" },
    addDeck: { en: "Add Words to Vocabulary Deck", ar: "إضافة الكلمات لمجموعة البطاقات" },
    added: { en: "Success! Words added to your review deck.", ar: "تم بنجاح! تمت إضافة الكلمات لمجموعتكِ الدراسية." },
    askTutor: { en: "Ask Document AI Helper", ar: "اسألي مساعد الذكاء الاصطناعي" },
    askTutorPlaceholder: { en: "Ask a question about this article...", ar: "اسألي سؤالاً حول هذا المقال..." }
  };

  const isRtl = lang === 'ar';

  return (
    <div className="space-y-6">
      
      {/* Back bar */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline" size="sm">
          {t.back[lang]}
        </Button>
        <h2 className="text-xl font-black">{t.title[lang]}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Paste content */}
        <div className="space-y-4 lg:col-span-1">
          <Card className="p-6 border-2 border-border/40 bg-card/25">
            <h3 className="text-md font-bold mb-1 text-slate-800">{t.title[lang]}</h3>
            <p className="text-xs text-slate-400 mb-4">{t.desc[lang]}</p>
            
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste English content here..."
              className="w-full bg-background border border-border/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary resize-none h-48 font-semibold text-slate-800"
            />

            <Button 
              onClick={handleProcess}
              disabled={loading || !content}
              variant="info" 
              className="w-full mt-4 h-11 text-sm font-bold"
            >
              {loading ? t.processing[lang] : t.processBtn[lang]}
            </Button>
          </Card>
        </div>

        {/* Right Side: Analysis Display */}
        <div className="lg:col-span-2 space-y-6">
          {summary ? (
            <div className="space-y-6">
              
              {/* Summary Block */}
              <Card className="p-6 border-2 border-border/40 bg-card/45">
                <h3 className="text-md font-extrabold mb-2 text-slate-800">{t.summary[lang]}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-semibold">{summary}</p>
              </Card>

              {/* Vocab List */}
              {vocab.length > 0 && (
                <Card className="p-6 border-2 border-border/40 bg-card/45">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <h3 className="text-md font-extrabold text-slate-800">{t.vocab[lang]}</h3>
                    {!imported ? (
                      <Button onClick={handleImportVocab} variant="success" size="sm">
                        {t.addDeck[lang]}
                      </Button>
                    ) : (
                      <span className="text-xs font-bold text-brand-success bg-brand-success/10 px-3 py-1 rounded-full">
                        {t.added[lang]}
                      </span>
                    )}
                  </div>

                  <div className="divide-y divide-border">
                    {vocab.map((v, idx) => (
                      <div key={idx} className="py-4 text-sm font-semibold first:pt-0 last:pb-0">
                        <div className="flex items-center space-x-2 gap-2">
                          <strong className="text-brand-primary text-md">{v.word}</strong>
                          <span className="text-xs text-slate-400">({v.definitionAr})</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Definition: {v.definition}</p>
                        
                        <div className="mt-2 pl-3 border-l-2 border-brand-primary/20 text-xs text-slate-600 space-y-1">
                          <p>Example: "{v.exampleEn}"</p>
                          <p className="opacity-80">مثال: "{v.exampleAr}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Scoped Chat Box */}
              <Card className="p-6 border-2 border-border/40 bg-slate-900 text-white rounded-2xl">
                <h3 className="text-sm font-extrabold mb-3 text-slate-300 flex items-center gap-1.5">
                  <Brain className="h-4.5 w-4.5 text-brand-primary" />
                  <span>{t.askTutor[lang]}</span>
                </h3>

                <div className="h-40 overflow-y-auto mb-4 border border-white/5 bg-black/30 rounded-xl p-3 space-y-2 text-xs">
                  {chatMessages.length === 0 ? (
                    <p className="text-white/40 text-center pt-10">Ask any questions about this document summary.</p>
                  ) : (
                    chatMessages.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`p-2.5 rounded-xl max-w-[80%] ${
                          msg.role === 'user' 
                            ? 'bg-brand-primary text-white ml-auto text-right' 
                            : 'bg-white/10 text-slate-200'
                        }`}
                      >
                        {msg.content}
                      </div>
                    ))
                  )}
                  {chatLoading && <p className="text-white/40 animate-pulse text-center">Tutor AI is processing question...</p>}
                </div>

                <div className="flex gap-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={t.askTutorPlaceholder[lang]}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                  <Button onClick={handleChatSend} disabled={chatLoading} variant="primary" size="sm">
                    Send
                  </Button>
                </div>
              </Card>

            </div>
          ) : (
            <div className="h-64 border-2 border-dashed rounded-3xl flex items-center justify-center bg-card/20">
              <p className="text-sm text-slate-400 font-semibold">Enter your text and click Analyze to begin.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

// -------------------------------------------------------------
// SUB-SCREEN 3: FLASHCARDS STUDY SCREEN (SM-2 Spaced Repetition)
// -------------------------------------------------------------
function FlashcardSubScreen({ lang, onBack }: { lang: 'en' | 'ar'; onBack: () => void }) {
  const [cards, setCards] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    fetchDueCards();
  }, []);

  const fetchDueCards = async () => {
    try {
      const res = await fetch('/api/flashcards/due');
      if (res.ok) {
        const data = await res.json();
        setCards(data.cards || []);
        setCurrentIdx(0);
        setRevealed(false);
        setComplete(false);
      }
    } catch (err) {}
  };

  const handleRateCard = async (rating: number) => {
    const card = cards[currentIdx];
    try {
      const res = await fetch('/api/flashcards/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: card.id, rating })
      });
      if (res.ok) {
        // Go to next card
        if (currentIdx < cards.length - 1) {
          setCurrentIdx(prev => prev + 1);
          setRevealed(false);
        } else {
          setComplete(true);
        }
      }
    } catch (err) {}
  };

  const t = {
    back: { en: "Back to Home", ar: "العودة للرئيسية" },
    title: { en: "Review Vocabulary", ar: "مراجعة المفردات" },
    cardsDue: { en: "Cards to study today:", ar: "البطاقات المتبقية للمراجعة اليوم:" },
    revealBtn: { en: "Reveal Card Answer", ar: "كشف إجابة البطاقة" },
    difficultyHeading: { en: "How hard was this word?", ar: "ما مدى صعوبة هذه الكلمة؟" },
    easy: { en: "Easy", ar: "سهل" },
    medium: { en: "Medium", ar: "متوسط" },
    hard: { en: "Hard", ar: "صعب" },
    completeTitle: { en: "Great Job, Noha!", ar: "عمل رائع، نهى!" },
    completeDesc: { en: "You have reviewed all due vocabulary words for today.", ar: "لقد راجعتِ جميع الكلمات المستحقة لليوم." },
    noCards: { en: "No vocabulary due today! Master more words by uploading lessons.", ar: "لا توجد كلمات مستحقة اليوم! تعلّمي كلمات جديدة برفع مستندات للدرس." }
  };

  const isRtl = lang === 'ar';

  return (
    <div className="space-y-6">
      
      {/* Back bar */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline" size="sm">
          {t.back[lang]}
        </Button>
        <h2 className="text-xl font-black">{t.title[lang]}</h2>
      </div>

      {cards.length === 0 ? (
        <Card className="max-w-xl mx-auto p-12 border-2 text-center bg-card/40 space-y-4">
          <CheckCircle className="h-14 w-14 text-brand-success mx-auto" />
          <h3 className="text-xl font-black text-slate-800">{t.completeTitle[lang]}</h3>
          <p className="text-sm text-slate-500 font-semibold">{t.noCards[lang]}</p>
        </Card>
      ) : !complete ? (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center text-xs font-bold text-slate-400 uppercase">
            Card {currentIdx + 1} of {cards.length}
          </div>

          <Card className="border-3 p-12 text-center bg-white min-h-[300px] flex flex-col justify-between shadow-sm rounded-3xl">
            
            {/* FRONT SIDE (Word) */}
            <div className="my-auto space-y-6">
              <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Vocabulary Word</span>
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
                {cards[currentIdx]?.front}
              </h1>
            </div>

            {/* REVEALED BACK SIDE (Definitions) */}
            <AnimatePresence>
              {revealed && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="border-t pt-6 text-left space-y-3 mt-6 text-xs text-slate-600 font-semibold whitespace-pre-wrap leading-relaxed"
                >
                  {cards[currentIdx]?.back}
                </motion.div>
              )}
            </AnimatePresence>

            {!revealed ? (
              <Button 
                onClick={() => setRevealed(true)} 
                variant="primary" 
                className="w-full text-md font-bold h-12 mt-6"
              >
                {t.revealBtn[lang]}
              </Button>
            ) : (
              <div className="mt-8 space-y-4">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">{t.difficultyHeading[lang]}</span>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button onClick={() => handleRateCard(5)} variant="success" size="sm" className="h-10 text-xs font-bold">
                    {t.easy[lang]} (5)
                  </Button>
                  <Button onClick={() => handleRateCard(3)} variant="outline" size="sm" className="h-10 text-xs font-bold">
                    {t.medium[lang]} (3)
                  </Button>
                  <Button onClick={() => handleRateCard(1)} variant="info" size="sm" className="h-10 text-xs font-bold border-brand-danger text-brand-danger hover:bg-brand-danger/5">
                    {t.hard[lang]} (1)
                  </Button>
                </div>
              </div>
            )}

          </Card>
        </div>
      ) : (
        /* COMPLETED DECK PAGE */
        <Card className="max-w-xl mx-auto p-12 border-2 text-center bg-card/40 space-y-4">
          <CheckCircle className="h-14 w-14 text-brand-success mx-auto animate-bounce" />
          <h3 className="text-xl font-black text-slate-800">{t.completeTitle[lang]}</h3>
          <p className="text-sm text-slate-500 font-semibold">{t.completeDesc[lang]}</p>
          <Button onClick={onBack} variant="primary" className="mt-4">
            {t.back[lang]}
          </Button>
        </Card>
      )}

    </div>
  );
}

// -------------------------------------------------------------
// SUB-SCREEN 4: PRONUNCIATION PRACTICE (Web Speech API)
// -------------------------------------------------------------
function PronunciationSubScreen({ lang, onBack }: { lang: 'en' | 'ar'; onBack: () => void }) {
  const practiceSentences = [
    "I would like to book a flight to London.",
    "Could you please explain this grammar rule to me?",
    "Learning English vocabulary is fun and rewarding.",
    "She went to the marketplace to buy fresh apples."
  ];

  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [matchScore, setMatchScore] = useState<number | null>(null);

  const startVoiceCapture = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser speech recognition not supported. Try using Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setMatchScore(null);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      setTranscript(resultText);
      
      // Calculate match score
      const target = practiceSentences[sentenceIdx].toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
      const spoken = resultText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");

      const targetWords = target.split(' ');
      const spokenWords = spoken.split(' ');

      // Find intersection count of words
      const intersect = targetWords.filter((w: string) => spokenWords.includes(w));
      const score = Math.round((intersect.length / targetWords.length) * 100);
      setMatchScore(score);
    };

    recognition.start();
  };

  const handleNextSentence = () => {
    if (sentenceIdx < practiceSentences.length - 1) {
      setSentenceIdx(prev => prev + 1);
      setTranscript('');
      setMatchScore(null);
    } else {
      setSentenceIdx(0);
      setTranscript('');
      setMatchScore(null);
    }
  };

  const t = {
    back: { en: "Back to Home", ar: "العودة للرئيسية" },
    title: { en: "Pronunciation Practice", ar: "ممارسة النطق" },
    practiceHeader: { en: "Read the target sentence aloud:", ar: "اقرئي الجملة التالية بصوت عالٍ:" },
    listenBtn: { en: "Tap and Start Speaking", ar: "اضغطي وابدئي التحدث" },
    listening: { en: "Listening...", ar: "يجري الاستماع..." },
    said: { en: "You said:", ar: "قلتِ:" },
    accuracy: { en: "Accuracy Score:", ar: "نسبة الدقة:" },
    next: { en: "Next Sentence", ar: "الجملة التالية" }
  };

  return (
    <div className="space-y-6">
      
      {/* Back bar */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline" size="sm">
          {t.back[lang]}
        </Button>
        <h2 className="text-xl font-black">{t.title[lang]}</h2>
      </div>

      <Card className="max-w-xl mx-auto p-8 border-2 bg-card space-y-6 text-center">
        
        {/* Target sentence display */}
        <div className="space-y-2">
          <span className="text-[10px] font-black text-brand-primary uppercase tracking-wider">{t.practiceHeader[lang]}</span>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 leading-snug">
            "{practiceSentences[sentenceIdx]}"
          </h2>
        </div>

        {/* Mic Toggle Button */}
        <div className="pt-6">
          <Button
            onClick={startVoiceCapture}
            disabled={isListening}
            variant="success"
            className={`rounded-full h-16 w-16 flex items-center justify-center mx-auto shadow-md ${
              isListening ? 'bg-brand-danger border-brand-danger animate-pulse text-white' : ''
            }`}
          >
            <Mic className="h-8 w-8" />
          </Button>
          <span className="text-xs font-bold text-slate-400 mt-3 block">
            {isListening ? t.listening[lang] : t.listenBtn[lang]}
          </span>
        </div>

        {/* Speech result feedback */}
        {transcript && (
          <div className="border-t pt-6 space-y-4 text-left font-semibold">
            <div className="text-sm">
              <span className="text-slate-400 block text-xs font-bold uppercase mb-1">{t.said[lang]}</span>
              <p className="text-slate-700 font-mono text-sm">"{transcript}"</p>
            </div>

            {matchScore !== null && (
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-xs font-bold text-slate-400">{t.accuracy[lang]}</span>
                <span className={`text-md font-black ${matchScore >= 80 ? 'text-brand-success' : 'text-brand-danger'}`}>
                  {matchScore}% Match
                </span>
              </div>
            )}

            <Button onClick={handleNextSentence} variant="primary" className="w-full mt-4 h-11 text-sm font-bold">
              {t.next[lang]}
            </Button>
          </div>
        )}

      </Card>

    </div>
  );
}
