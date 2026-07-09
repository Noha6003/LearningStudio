'use client';

import React, { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, ArrowRight, Globe, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');
    
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false
      });
      
      if (res?.error) {
        setError(lang === 'en' ? 'Invalid email or password.' : 'البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError(lang === 'en' ? 'An error occurred during login.' : 'حدث خطأ أثناء تسجيل الدخول.');
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = {
    title: { en: "English Study Studio", ar: "استوديو دراسة الإنجليزية" },
    subtitle: { en: "Bilingual English learning and vocabulary practice", ar: "منصة تعلم اللغة الإنجليزية وممارسة الكلمات ثنائية اللغة" },
    loginHeading: { en: "Sign In to Studio", ar: "الدخول إلى استوديو الدراسة" },
    loginDesc: { en: "Enter your email and passcode to begin your daily lessons.", ar: "أدخلي بريدكِ الإلكتروني ورمز المرور لبدء دروسكِ اليومية." },
    emailLabel: { en: "Email Address", ar: "البريد الإلكتروني" },
    passcodeLabel: { en: "Password / Passcode", ar: "كلمة المرور / الرمز" },
    signInBtn: { en: "Enter Study Deck", ar: "دخول منصة الدراسة" },
    loading: { en: "Logging in...", ar: "يجري تسجيل الدخول..." },
    welcomeUser: { en: "Welcome Back!", ar: "مرحباً بكِ مجدداً!" },
    welcomeDesc: { en: "You are logged in. Click below to open your daily vocabulary deck, quizzes, and lessons.", ar: "لقد قمتِ بتسجيل الدخول. اضغطي أدناه لفتح بطاقات الكلمات اليومية، الاختبارات، والدروس." },
    goDashboard: { en: "Go to Dashboard", ar: "الذهاب للوحة الدراسة" }
  };

  const isRtl = lang === 'ar';

  return (
    <div 
      className="flex-1 flex flex-col justify-between overflow-x-hidden min-h-screen bg-slate-950 text-white transition-all duration-300"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-lg px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2.5 gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/25">
            <GraduationCap className="h-5 w-5 text-indigo-400" />
          </div>
          <span className="font-black text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Luminary
          </span>
        </div>
        
        <Button 
          onClick={toggleLanguage} 
          variant="outline" 
          className="rounded-full px-4 py-2 border-white/10 hover:bg-white/5 font-extrabold text-xs flex items-center gap-1.5"
        >
          <Globe className="h-4 w-4" />
          <span>{lang === 'en' ? 'العربية' : 'English'}</span>
        </Button>
      </header>

      {/* Main Login / Entrance Card */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 max-w-lg mx-auto w-full z-10">
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <Card className="border-2 border-white/10 bg-slate-900 shadow-xl rounded-3xl p-6">
            
            {status === 'authenticated' ? (
              /* LOGGED IN HUD PANEL */
              <div className="text-center py-6 space-y-6">
                <div className="h-16 w-16 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center mx-auto text-indigo-400 animate-bounce">
                  <GraduationCap className="h-9 w-9" />
                </div>
                <div>
                  <h3 className="text-2xl font-black">{t.welcomeUser[lang]}</h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">{t.welcomeDesc[lang]}</p>
                </div>
                <Button 
                  onClick={() => router.push('/dashboard')} 
                  variant="primary" 
                  className="w-full text-md font-bold py-3.5 h-12 rounded-xl mt-4"
                >
                  <span>{t.goDashboard[lang]}</span>
                  <ArrowRight className={`h-4.5 w-4.5 ${isRtl ? 'rotate-180 mr-2' : 'ml-2'}`} />
                </Button>
              </div>
            ) : (
              /* REAL BILINGUAL LOGIN FORM */
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <CardHeader className="p-0 text-center space-y-2">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
                    <Lock className="h-5.5 w-5.5" />
                  </div>
                  <CardTitle className="text-2xl font-black tracking-tight">{t.loginHeading[lang]}</CardTitle>
                  <CardDescription className="text-slate-400 text-xs leading-relaxed">{t.loginDesc[lang]}</CardDescription>
                </CardHeader>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold p-3 rounded-xl text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  
                  {/* Email Input */}
                  <div className="space-y-1.5 text-right" dir={isRtl ? 'rtl' : 'ltr'}>
                    <label className="text-xs font-bold text-slate-300 block">{t.emailLabel[lang]}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@gmail.com"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-100"
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5 text-right" dir={isRtl ? 'rtl' : 'ltr'}>
                    <label className="text-xs font-bold text-slate-300 block">{t.passcodeLabel[lang]}</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-100"
                      required
                    />
                  </div>

                </div>

                <Button
                  type="submit"
                  disabled={loading || !email || !password}
                  variant="primary"
                  className="w-full text-md font-bold py-3.5 h-12 rounded-xl mt-4 cursor-pointer"
                >
                  {loading ? t.loading[lang] : t.signInBtn[lang]}
                </Button>
              </form>
            )}

          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-[10px] text-slate-500 bg-slate-950/20 z-10">
        <p>© 2026 Luminary Studio. Designed for English study and vocabulary practice.</p>
      </footer>
    </div>
  );
}
