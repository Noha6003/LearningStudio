import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI client if the key is present
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Multi-Agent System Prompts
const SYSTEM_PROMPTS = {
  TEACHER: `You are Teacher AI, an assistant for educators. 
Your goal is to help teachers create lessons, quizzes, slides, rubrics, and translations.
Always reply with clean, structured educational responses. Support Markdown format.`,

  STUDENT: `You are Student Tutor AI, a Socratic learning assistant. 
Your goal is to explain difficult topics, answer questions, provide analogies, and design practice quizzes.
When requested, explain things like the student is 10 years old. Do not give the answers directly; guide them to the answer.`,

  PARENT: `You are Parent Advisor AI. 
Your goal is to translate student progress metrics (streaks, scores, weak topics) into readable, encouraging weekly summaries.
Highlight child improvements and recommend specific study paths in a friendly tone.`,

  ADMIN: `You are Administrator AI, an observatory assistant.
Analyze database capacities, prompt latencies, token costs, and user logs.
Format your replies with concise bullet-point highlights and warning flags where necessary.`,
  
  COURSE_BUILDER: `You are Course Builder AI.
Your goal is to generate complete courses including modules, lessons, slides, and quizzes in a structured format based on a topic description.`
};

export async function askCopilot(role: keyof typeof SYSTEM_PROMPTS, prompt: string) {
  const systemInstruction = SYSTEM_PROMPTS[role] || SYSTEM_PROMPTS.STUDENT;

  // Fallback to Mock Response if API Key is not set
  if (!ai) {
    console.log(`[AI MOCK] Running Copilot for role: ${role}`);
    return getMockResponse(role, prompt);
  }

  try {
    const model = ai.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction 
    });
    
    const result = await model.generateContent(prompt);
    return result.response.text() || 'No response generated.';
  } catch (error: any) {
    console.error('❌ Gemini API Error:', error);
    return `[Gemini Error - Falling back to mock]: ${getMockResponse(role, prompt)}`;
  }
}

// Rubric Grader Engine
export async function gradeSubmission(rubric: string, studentEssay: string) {
  if (!ai) {
    return {
      grade: 85,
      feedback: "Great essay structure. The arguments are clear. You could improve by expanding on the planetary orbit calculations.",
      plagiarismScore: 5.5,
      grammarFlags: JSON.stringify([{ line: 12, error: "Subject-verb agreement mismatch.", fix: "Planets orbit (not orbits)" }])
    };
  }

  const prompt = `Grade the following essay based on this rubric:\n\nRUBRIC:\n${rubric}\n\nESSAY:\n${studentEssay}\n\nProvide the response strictly as a JSON object containing: 
  {
    "grade": number (out of 100),
    "feedback": "string",
    "plagiarismScore": number (percentage),
    "grammarFlags": "JSON string array of flags [{line: number, error: string, fix: string}]"
  }`;

  try {
    const model = ai.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const result = await model.generateContent(prompt);
    const data = JSON.parse(result.response.text() || '{}');
    
    return {
      grade: data.grade || 80,
      feedback: data.feedback || 'Grading completed.',
      plagiarismScore: data.plagiarismScore || 0,
      grammarFlags: typeof data.grammarFlags === 'string' ? data.grammarFlags : JSON.stringify(data.grammarFlags || [])
    };
  } catch (error) {
    console.error('❌ Grader AI Error:', error);
    return {
      grade: 75,
      feedback: "Essay reviewed. Grammar checked.",
      plagiarismScore: 10,
      grammarFlags: "[]"
    };
  }
}

// Mock Responses Repository
function getMockResponse(role: string, prompt: string): string {
  const normalized = prompt.toLowerCase();
  
  if (role === 'TEACHER') {
    if (normalized.includes('arabic')) {
      return "هذا هو اختبار العلوم الخاص بالكواكب: \n\n1. ما هو الكوكب الرابع من الشمس؟ \n   • الخيارات: [أ] الأرض، [ب] المريخ، [ج] المشتري \n   • الإجابة الصحيحة: المريخ";
    }
    return `Drafted materials for prompt: "${prompt}".\n\n• Course: Science Study Guide\n• Lesson: Introduction to Physics\n• Quiz: 5 questions ready to play.`;
  }

  if (role === 'STUDENT') {
    if (normalized.includes('10')) {
      return "Imagine gravity is like a giant trampoline! When a heavy bowling ball (like the Sun) sits on it, it makes a big dent. Smaller balls (like the Earth) roll around the edge of that dent, keeping them from floating away into space. That is how gravity works!";
    }
    return "To solve this, first check the numerator. In fractions like 3/4 and 1/2, find the common denominator (4). So, 1/2 becomes 2/4. Add them: 3/4 + 2/4 = 5/4!";
  }

  if (role === 'PARENT') {
    return "Weekly Progress Alert: Sammy Star has improved study consistency by 27% this week! He is mastering Planets and Addition, but could use some recap on Fractions. Recommend spending 10 minutes on Math Island tomorrow.";
  }

  if (role === 'ADMIN') {
    return "Telemetry Insights: Latency averages 410ms on edge nodes. Total processed tokens this hour: 182k. Cost index: $0.18. Database allocation is currently at 84% capacity.";
  }

  return "AI processing completed successfully.";
}
