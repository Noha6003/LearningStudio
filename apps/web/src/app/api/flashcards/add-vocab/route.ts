import { NextResponse } from 'next/server';
import { db } from '@learningma/database';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { vocabulary, notebookId } = await req.json();

    if (!vocabulary || !Array.isArray(vocabulary) || !notebookId) {
      return NextResponse.json({ error: 'Vocabulary array and notebook ID are required.' }, { status: 400 });
    }

    // Save each vocabulary card in the database
    const createdFlashcards = await Promise.all(
      vocabulary.map((item: any) => {
        const backContent = [
          `Definition: ${item.definition}`,
          `الترجمة: ${item.definitionAr || ''}`,
          `Example: ${item.exampleEn || ''}`,
          `مثال: ${item.exampleAr || ''}`
        ].join('\n');

        return db.flashcard.create({
          data: {
            notebookId,
            front: item.word,
            back: backContent,
            interval: 1,
            repetitionCount: 0,
            easeFactor: 2.5,
            nextReviewDate: new Date() // Due immediately for initial study
          }
        });
      })
    );

    return NextResponse.json({ success: true, count: createdFlashcards.length });
  } catch (error: any) {
    console.error('❌ Flashcard Import Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
