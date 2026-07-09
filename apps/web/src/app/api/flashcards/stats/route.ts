import { NextResponse } from 'next/server';
import { db } from '@learningma/database';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    // Get user from database
    const dbUser = await db.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!dbUser) {
      return NextResponse.json({ dueCount: 0 });
    }

    // Get student profile
    const student = await db.studentProfile.findUnique({
      where: { userId: dbUser.id }
    });

    if (!student) {
      return NextResponse.json({ dueCount: 0 });
    }

    // Find Student's AINotebook
    const notebook = await db.aINotebook.findFirst({
      where: { studentId: student.id }
    });

    if (!notebook) {
      return NextResponse.json({ dueCount: 0 });
    }

    // Count due flashcards where nextReviewDate <= now
    const dueCount = await db.flashcard.count({
      where: {
        notebookId: notebook.id,
        nextReviewDate: {
          lte: now
        }
      }
    });

    return NextResponse.json({ dueCount });
  } catch (error: any) {
    console.error('❌ Flashcards Stats Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
