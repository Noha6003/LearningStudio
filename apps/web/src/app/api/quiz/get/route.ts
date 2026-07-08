import { NextResponse } from 'next/server';
import { db } from '@learningma/database';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Quiz ID is required.' }, { status: 400 });
    }

    const quiz = await db.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found.' }, { status: 404 });
    }

    return NextResponse.json({ quiz });
  } catch (error: any) {
    console.error('❌ Quiz Details Fetch Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
