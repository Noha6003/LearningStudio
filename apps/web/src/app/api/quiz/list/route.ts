import { NextResponse } from 'next/server';
import { db } from '@learningma/database';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const dbUser = await db.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!dbUser) {
      return NextResponse.json({ quizzes: [], attempts: [], streak: 0 });
    }

    // Get student profile
    const student = await db.studentProfile.findUnique({
      where: { userId: dbUser.id }
    });

    if (!student) {
      return NextResponse.json({ quizzes: [], attempts: [], streak: 0 });
    }

    // Fetch all quizzes in the database (since this is single user learning, we list all)
    const quizzes = await db.quiz.findMany({
      include: {
        questions: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Fetch all attempts for the student
    const attempts = await db.quizAttempt.findMany({
      where: {
        studentId: student.id
      },
      orderBy: {
        completedAt: 'desc'
      }
    });

    // Calculate actual day streak based on quiz attempts
    let streak = 0;
    if (attempts.length > 0) {
      const dates = attempts.map(a => new Date(a.completedAt).toDateString());
      const uniqueDates = Array.from(new Set(dates)); // list of unique days she played a quiz
      
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      
      // Streak continues if she completed a quiz today or yesterday
      if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
        streak = 1;
        let checkDate = new Date();
        // Go backwards day by day and check if she has attempts
        while (true) {
          checkDate.setDate(checkDate.getDate() - 1);
          const dateStr = checkDate.toDateString();
          if (uniqueDates.includes(dateStr)) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    return NextResponse.json({ quizzes, attempts, streak });
  } catch (error: any) {
    console.error('❌ Quiz List Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
