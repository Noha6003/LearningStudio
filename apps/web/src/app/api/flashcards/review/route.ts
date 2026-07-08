import { NextResponse } from 'next/server';
import { db } from '@learningma/database';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cardId, rating } = await req.json();

    if (!cardId || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Valid cardId and rating (1-5) are required.' }, { status: 400 });
    }

    // Fetch the flashcard
    const card = await db.flashcard.findUnique({
      where: { id: cardId }
    });

    if (!card) {
      return NextResponse.json({ error: 'Flashcard not found.' }, { status: 404 });
    }

    let nextInterval = card.interval;
    let nextRepCount = card.repetitionCount;
    let nextEase = card.easeFactor;

    const q = rating;

    // SM-2 Algorithm computation
    if (q < 3) {
      // Forgot / incorrect response
      nextRepCount = 0;
      nextInterval = 1;
    } else {
      // Correct response
      if (nextRepCount === 0) {
        nextInterval = 1;
      } else if (nextRepCount === 1) {
        nextInterval = 6;
      } else {
        nextInterval = Math.round(nextInterval * nextEase);
      }
      nextRepCount += 1;
    }

    // Calculate new Ease Factor (EF)
    nextEase = nextEase + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (nextEase < 1.3) {
      nextEase = 1.3;
    }

    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

    // Save changes to database
    await db.flashcard.update({
      where: { id: cardId },
      data: {
        interval: nextInterval,
        repetitionCount: nextRepCount,
        easeFactor: nextEase,
        nextReviewDate
      }
    });

    return NextResponse.json({
      success: true,
      nextInterval,
      nextReviewDate: nextReviewDate.toISOString(),
      easeFactor: nextEase,
      repetitionCount: nextRepCount
    });
  } catch (error: any) {
    console.error('❌ Flashcard Review Save Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
