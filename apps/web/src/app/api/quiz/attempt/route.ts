import { NextResponse } from 'next/server';
import { db } from '@learningma/database';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { quizId, score, timeSpent, responses } = await req.json();

    if (!quizId) {
      return NextResponse.json({ error: 'Quiz ID is required.' }, { status: 400 });
    }

    // Get user from database to make sure they exist
    let dbUser = await db.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!dbUser) {
      // Create user if they logged in dynamically and don't exist in DB yet
      dbUser = await db.user.create({
        data: {
          name: session.user.name,
          email: session.user.email!,
          role: 'STUDENT'
        }
      });
    }

    // Retrieve or initialize StudentProfile for the user
    let student = await db.studentProfile.findUnique({
      where: { userId: dbUser.id }
    });

    if (!student) {
      student = await db.studentProfile.create({
        data: {
          userId: dbUser.id,
          xp: 0,
          coins: 0,
          level: 1
        }
      });
    }

    // Create the QuizAttempt
    const attempt = await db.quizAttempt.create({
      data: {
        quizId,
        studentId: student.id,
        score: score || 0,
        timeSpent: timeSpent || 0,
        responses: {
          create: (responses || []).map((r: any) => ({
            questionId: r.questionId,
            selectedOptionId: r.selectedOptionId || null,
            isCorrect: r.isCorrect || false,
            pointsEarned: r.pointsEarned || 0,
            timeSpent: r.timeSpent || 0
          }))
        }
      },
      include: {
        responses: true
      }
    });

    // Award XP and coins to the student profile
    await db.studentProfile.update({
      where: { id: student.id },
      data: {
        xp: { increment: score || 0 },
        coins: { increment: Math.floor((score || 0) / 10) }
      }
    });

    return NextResponse.json({ success: true, attemptId: attempt.id });
  } catch (error: any) {
    console.error('❌ Quiz Attempt Save Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
