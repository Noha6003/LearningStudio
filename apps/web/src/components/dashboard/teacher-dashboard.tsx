'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { AdvancedOptions } from '../ui/advanced-options';
import { 
  Sparkles, BookOpen, Users, BarChart3, HelpCircle, 
  Plus, Play, AlertCircle, FileSpreadsheet, Download, HelpCircleIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function TeacherDashboard({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<'quiz' | 'lesson' | 'classes' | 'reports' | 'assistant'>('quiz');

  // Create Quiz States
  const [quizTitle, setQuizTitle] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(30);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  // Create Lesson States
  const [lessonTopic, setLessonTopic] = useState('');
  const [isBuildingLesson, setIsBuildingLesson] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState<any | null>(null);

  // AI Assistant States
  const [assistantPrompt, setAssistantPrompt] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);

  // Mock Reports Data
  const reportData = {
    class: 'Grade 6 Science - Space & Planets',
    avgScore: '78%',
    completion: '92%',
    hardestQuestion: 'Question 6 (Fractions of Orbit)',
    aiRecommendation: '15 students struggled with Keplerian orbits. I recommend assigning a 5-minute review lesson on planetary cycles before the next exam.',
    students: [
      { name: 'Sammy Star', score: '90%', time: '14 mins', status: 'Passed' },
      { name: 'Billy Comet', score: '55%', time: '22 mins', status: 'Struggling' }
    ]
  };

  const handleGenerateQuiz = () => {
    if (!quizTitle && !aiPrompt) return;
    setIsGenerating(true);
    setGeneratedQuestions([]);
    
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedQuestions([
        { q: 'Which is the fourth planet from the Sun?', options: ['Earth', 'Mars', 'Jupiter', 'Venus'], correct: 'Mars' },
        { q: 'Is Mars bigger than Earth?', options: ['True', 'False'], correct: 'False' }
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleBuildLesson = () => {
    if (!lessonTopic) return;
    setIsBuildingLesson(true);
    setGeneratedLesson(null);

    setTimeout(() => {
      setGeneratedLesson({
        title: `Introduction to ${lessonTopic}`,
        modules: [
          { title: '1. Core Concepts', bullets: ['Key vocabulary definitions', 'Historical context summary'] },
          { title: '2. Interactive Exercises', bullets: ['Pair-share brainstorms', 'Quick multiple-choice check'] }
        ]
      });
      setIsBuildingLesson(false);
    }, 2000);
  };

  const handleAskAssistant = () => {
    if (!assistantPrompt) return;
    setIsAssistantLoading(true);
    setAssistantResponse('');

    setTimeout(() => {
      setAssistantResponse(
        `Here is an algebra quiz suggestion for Grade 8 fractions:\n\n` +
        `1. (Multiple Choice) Solve: 3/4 + 1/2. \n` +
        `   • Options: [A] 5/4, [B] 4/6, [C] 1/2, [D] 3/8\n` +
        `   • Answer: [A] 5/4\n\n` +
        `2. (True/False) The reciprocal of 2/3 is -2/3.\n` +
        `   • Answer: False`
      );
      setIsAssistantLoading(false);
    }, 1500);
  };

  return (
    <div className="flex-1 bg-background text-foreground max-w-7xl mx-auto w-full p-6 md:p-8 flex flex-col md:flex-row gap-8">
      {/* Teacher Clutter-Free Side menu */}
      <div className="md:w-64 flex flex-col space-y-2 border-r border-border/40 pr-0 md:pr-6">
        <div className="pb-4 hidden md:block">
          <h2 className="font-extrabold text-lg tracking-tight">Sarah's Classroom</h2>
          <p className="text-xs text-muted-foreground">Manage your classroom tools.</p>
        </div>

        <Button 
          variant={activeTab === 'quiz' ? 'primary' : 'outline'} 
          className="justify-start" 
          onClick={() => setActiveTab('quiz')}
        >
          <Plus className="mr-2 h-4 w-4" /> Create Quiz
        </Button>
        <Button 
          variant={activeTab === 'lesson' ? 'primary' : 'outline'} 
          className="justify-start" 
          onClick={() => setActiveTab('lesson')}
        >
          <BookOpen className="mr-2 h-4 w-4" /> Create Lesson
        </Button>
        <Button 
          variant={activeTab === 'classes' ? 'primary' : 'outline'} 
          className="justify-start" 
          onClick={() => setActiveTab('classes')}
        >
          <Users className="mr-2 h-4 w-4" /> Classes
        </Button>
        <Button 
          variant={activeTab === 'reports' ? 'primary' : 'outline'} 
          className="justify-start" 
          onClick={() => setActiveTab('reports')}
        >
          <BarChart3 className="mr-2 h-4 w-4" /> Reports
        </Button>
        <Button 
          variant={activeTab === 'assistant' ? 'primary' : 'outline'} 
          className="justify-start" 
          onClick={() => setActiveTab('assistant')}
        >
          <Sparkles className="mr-2 h-4 w-4" /> AI Assistant
        </Button>
      </div>

      {/* Teacher Main Actions Pane */}
      <div className="flex-1 min-w-0">
        
        {/* CREATE QUIZ PANEL */}
        {activeTab === 'quiz' && (
          <Card>
            <CardHeader>
              <CardTitle>Create Quiz</CardTitle>
              <CardDescription>Setup a quiz manually or automatically using AI.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quiz Title</label>
                  <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="E.g. Grade 6 Planetary Science"
                    className="bg-card border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1">
                    <Sparkles className="h-3 w-3 text-brand-secondary fill-brand-secondary/20" />
                    <span>Generate questions with AI (Optional)</span>
                  </label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="E.g. Create a quiz about gravity and planets suitable for 11 year olds..."
                    className="bg-card border border-border rounded-lg px-4 py-2.5 text-sm h-20 resize-none focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>

                {/* Progressive Disclosure: Advanced Settings hidden by default */}
                <AdvancedOptions title="Advanced Settings (Attempts, Timers)">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="flex flex-col space-y-1">
                      <label className="font-semibold">Question Count</label>
                      <input 
                        type="number" 
                        value={questionCount} 
                        onChange={(e) => setQuestionCount(Number(e.target.value))}
                        className="bg-card border border-border rounded px-2.5 py-1 text-xs" 
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="font-semibold">Seconds per Question</label>
                      <input 
                        type="number" 
                        value={timeLimit} 
                        onChange={(e) => setTimeLimit(Number(e.target.value))}
                        className="bg-card border border-border rounded px-2.5 py-1 text-xs" 
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-4">
                      <input 
                        type="checkbox" 
                        id="multipleAttempts"
                        checked={allowMultiple}
                        onChange={(e) => setAllowMultiple(e.target.checked)}
                        className="rounded border-border"
                      />
                      <label htmlFor="multipleAttempts" className="font-semibold">Allow multiple attempts</label>
                    </div>
                  </div>
                </AdvancedOptions>

                <Button 
                  onClick={handleGenerateQuiz} 
                  disabled={isGenerating || (!quizTitle && !aiPrompt)}
                  variant="primary"
                  className="w-full"
                >
                  {isGenerating ? 'AI is generating questions...' : 'Create & Publish Quiz'}
                </Button>
              </div>

              {/* Show generated preview */}
              {generatedQuestions.length > 0 && (
                <div className="border-t border-border/40 pt-6 space-y-4">
                  <h4 className="text-sm font-bold text-slate-700 flex items-center space-x-1.5">
                    <Sparkles className="h-4 w-4 text-brand-secondary" />
                    <span>AI Generated Questions (Preview)</span>
                  </h4>
                  <div className="space-y-3">
                    {generatedQuestions.map((q, idx) => (
                      <div key={idx} className="bg-card border border-border p-4 rounded-xl space-y-2">
                        <span className="text-xs font-bold text-brand-primary">Q{idx + 1}: {q.q}</span>
                        <div className="grid grid-cols-2 gap-2">
                          {q.options.map((opt: string, oIdx: number) => (
                            <span 
                              key={oIdx} 
                              className={cn(
                                "text-xs px-2.5 py-1.5 rounded-lg border",
                                opt === q.correct ? "bg-brand-success/10 border-brand-success text-brand-success font-bold" : "border-border text-muted-foreground"
                              )}
                            >
                              {opt}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* CREATE LESSON PANEL */}
        {activeTab === 'lesson' && (
          <Card>
            <CardHeader>
              <CardTitle>Create Lesson</CardTitle>
              <CardDescription>Enter a topic and let AI draft modules, summaries, and lecture notes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={lessonTopic}
                  onChange={(e) => setLessonTopic(e.target.value)}
                  placeholder="E.g. Photosynthesis in plants"
                  className="flex-1 bg-card border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
                <Button onClick={handleBuildLesson} disabled={isBuildingLesson || !lessonTopic}>
                  {isBuildingLesson ? 'Building...' : 'AI Generate'}
                </Button>
              </div>

              {generatedLesson && (
                <div className="border-t border-border/40 pt-6 space-y-4">
                  <h3 className="font-extrabold text-lg text-brand-primary">{generatedLesson.title}</h3>
                  <div className="space-y-4">
                    {generatedLesson.modules.map((m: any, idx: number) => (
                      <div key={idx} className="space-y-2">
                        <h4 className="font-bold text-sm text-foreground">{m.title}</h4>
                        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
                          {m.bullets.map((b: string, bIdx: number) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* CLASSES PANEL */}
        {activeTab === 'classes' && (
          <Card>
            <CardHeader>
              <CardTitle>My Classrooms</CardTitle>
              <CardDescription>View enrolled students and class join codes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm divide-y divide-border">
                  <thead>
                    <tr className="text-muted-foreground text-xs uppercase font-bold">
                      <th className="pb-3">Class Name</th>
                      <th className="pb-3">Join Code</th>
                      <th className="pb-3">Students</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="py-3 font-semibold text-slate-800">Grade 6 Science - Space & Planets</td>
                      <td className="py-3"><span className="bg-brand-primary/10 text-brand-primary font-bold px-2 py-0.5 rounded text-xs">SPACE6</span></td>
                      <td className="py-3">15 students</td>
                      <td className="py-3">
                        <Button size="sm" variant="outline">View List</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* REPORTS PANEL */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Quiz Aggregations & Analytics</CardTitle>
                  <CardDescription>Classroom: {reportData.class}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Export CSV</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 border-b border-border/40 pb-6 text-center">
                  <div>
                    <span className="text-xs text-muted-foreground">Average Score</span>
                    <p className="text-2xl font-black text-brand-primary">{reportData.avgScore}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Completion Rate</span>
                    <p className="text-2xl font-black text-brand-success">{reportData.completion}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Hardest Question</span>
                    <p className="text-xs font-bold text-brand-danger truncate pt-1">{reportData.hardestQuestion}</p>
                  </div>
                </div>

                {/* AI Intervention alert */}
                <div className="bg-brand-primary/10 border border-brand-primary/20 p-4 rounded-xl flex items-start space-x-3 text-xs leading-relaxed text-slate-700">
                  <AlertCircle className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-brand-primary">AI Teaching Suggestion:</strong>
                    <p className="pt-1">{reportData.aiRecommendation}</p>
                  </div>
                </div>

                {/* Student Ranks list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Standings:</h4>
                  <div className="divide-y divide-border border rounded-xl overflow-hidden bg-card/25">
                    {reportData.students.map((student, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 text-xs">
                        <div className="font-semibold text-slate-800">{student.name}</div>
                        <div className="flex items-center space-x-6">
                          <span>Time spent: {student.time}</span>
                          <span className="font-bold">Score: {student.score}</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full font-bold",
                            student.status === 'Passed' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-danger/10 text-brand-danger'
                          )}>{student.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI ASSISTANT PANEL */}
        {activeTab === 'assistant' && (
          <Card>
            <CardHeader>
              <CardTitle>AI Teacher Assistant</CardTitle>
              <CardDescription>Ask the assistant to write study guides, simplify math concepts, or translate content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <textarea
                  value={assistantPrompt}
                  onChange={(e) => setAssistantPrompt(e.target.value)}
                  placeholder="E.g. Draft 2 harder multiple choice questions about Jupiter's moons..."
                  className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm h-24 resize-none focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    onClick={() => {
                      setAssistantPrompt("Translate my space quiz to Arabic");
                    }} 
                    variant="outline" 
                    size="sm"
                  >
                    Translate to Arabic
                  </Button>
                  <Button onClick={handleAskAssistant} disabled={isAssistantLoading || !assistantPrompt}>
                    {isAssistantLoading ? 'Analyzing...' : 'Ask AI'}
                  </Button>
                </div>
              </div>

              {assistantResponse && (
                <div className="border-t border-border/40 pt-6 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Response:</h4>
                  <pre className="bg-card border border-border p-4 rounded-xl text-xs overflow-x-auto leading-relaxed text-slate-700 font-mono whitespace-pre-wrap">
                    {assistantResponse}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
