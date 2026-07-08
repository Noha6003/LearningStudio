import { NextResponse } from 'next/server';
import { db } from '@learningma/database';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { language } = await req.json();

    if (language !== 'en' && language !== 'ar') {
      return NextResponse.json({ error: 'Invalid language preference.' }, { status: 400 });
    }

    // Save language to user in DB
    await db.user.update({
      where: { email: session.user.email! },
      data: { language }
    });

    return NextResponse.json({ success: true, language });
  } catch (error: any) {
    console.error('❌ User Language Update Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
