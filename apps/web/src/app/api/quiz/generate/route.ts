import { NextResponse } from 'next/server';
import { db } from '@learningma/database';
import { auth } from '@/lib/auth';
import { generateQuizFromText } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { topicOrWords } = await req.json();
    if (!topicOrWords) {
      return NextResponse.json({ error: 'Topic or words list is required.' }, { status: 400 });
    }

    // Generate quiz via Gemini
    const quizData = await generateQuizFromText(topicOrWords);

    // Find the first TeacherProfile in the database to link as creator
    let teacher = await db.teacherProfile.findFirst();
    if (!teacher) {
      // Create a default one if it doesn't exist
      const user = await db.user.findFirst({ where: { role: 'TEACHER' } });
      if (user) {
        teacher = await db.teacherProfile.create({
          data: {
            userId: user.id,
            bio: 'System Educator'
          }
        });
      } else {
        // Fallback to active session user
        const sessionUser = await db.user.findFirst();
        if (sessionUser) {
          teacher = await db.teacherProfile.create({
            data: {
              userId: sessionUser.id,
              bio: 'System Educator'
            }
          });
        } else {
          return NextResponse.json({ error: 'System teacher profile could not be initialized.' }, { status: 500 });
        }
      }
    }

    // Save Quiz to database
    const createdQuiz = await db.quiz.create({
      data: {
        teacherId: teacher.id,
        title: quizData.title || `Quiz: ${topicOrWords.slice(0, 20)}`,
        description: `Vocabulary practice on: ${topicOrWords.slice(0, 100)}`,
        questions: {
          create: quizData.questions.map((q: any, qIdx: number) => ({
            type: 'QUIZ',
            text: q.text,
            timeLimit: q.timeLimit || 30,
            points: q.points || 1000,
            answerExplanation: q.explanation || '',
            order: qIdx,
            options: {
              create: q.options.map((opt: string, optIdx: number) => ({
                text: opt,
                isCorrect: opt === q.correctAnswer,
                order: optIdx
              }))
            }
          }))
        }
      },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });

    return NextResponse.json({ quizId: createdQuiz.id });
  } catch (error: any) {
    console.error('❌ AI Quiz Creation Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
