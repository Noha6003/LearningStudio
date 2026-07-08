import { NextResponse } from 'next/server';
import { gradeSubmission } from '@/lib/gemini';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    // Protect grading route (Only Teachers can run essay evaluations)
    if (!session || !session.user || (session.user as any).role !== 'TEACHER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { rubric, studentEssay } = await req.json();

    if (!rubric || !studentEssay) {
      return NextResponse.json({ error: 'Rubric and essay are required.' }, { status: 400 });
    }

    const report = await gradeSubmission(rubric, studentEssay);
    return NextResponse.json(report);
  } catch (error: any) {
    console.error('❌ AI Grader API Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
