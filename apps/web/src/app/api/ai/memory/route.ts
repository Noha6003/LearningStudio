import { NextResponse } from 'next/server';
import { db } from '@learningma/database';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { correctTopics, wrongTopics, errors } = await req.json();

    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    // Get current AIMemory
    const memory = await db.aIMemory.findUnique({
      where: { userId }
    });

    if (!memory) {
      // Create one if it doesn't exist
      await db.aIMemory.create({
        data: {
          userId,
          weakTopics: JSON.stringify(wrongTopics || []),
          strongTopics: JSON.stringify(correctTopics || []),
          mistakeLog: JSON.stringify(errors || [])
        }
      });
    } else {
      // Merge topics
      const currentWeak = JSON.parse(memory.weakTopics) as string[];
      const currentStrong = JSON.parse(memory.strongTopics) as string[];
      const currentMistakes = JSON.parse(memory.mistakeLog) as any[];

      // Filter out new strong topics from weak list
      const updatedWeak = Array.from(new Set([
        ...currentWeak.filter(t => !correctTopics.includes(t)),
        ...(wrongTopics || [])
      ]));

      // Filter out new weak topics from strong list
      const updatedStrong = Array.from(new Set([
        ...currentStrong.filter(t => !wrongTopics.includes(t)),
        ...(correctTopics || [])
      ]));

      const updatedMistakes = [...currentMistakes, ...(errors || [])].slice(-20); // keep last 20 mistakes

      // Update in DB
      await db.aIMemory.update({
        where: { userId },
        data: {
          weakTopics: JSON.stringify(updatedWeak),
          strongTopics: JSON.stringify(updatedStrong),
          mistakeLog: JSON.stringify(updatedMistakes)
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Error updating AI Memory:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
