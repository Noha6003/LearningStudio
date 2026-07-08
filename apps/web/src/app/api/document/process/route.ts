import { NextResponse } from 'next/server';
import { db } from '@learningma/database';
import { auth } from '@/lib/auth';
import { processDocumentContent } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, title } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Document content is required.' }, { status: 400 });
    }

    // Get user from database
    let dbUser = await db.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!dbUser) {
      dbUser = await db.user.create({
        data: {
          name: session.user.name,
          email: session.user.email!,
          role: 'STUDENT'
        }
      });
    }

    // Get student profile
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

    // Find or create Noha's AINotebook
    let notebook = await db.aINotebook.findFirst({
      where: { studentId: student.id }
    });

    if (!notebook) {
      notebook = await db.aINotebook.create({
        data: {
          studentId: student.id,
          name: 'My English Learning Studio'
        }
      });
    }

    // Process content using Gemini
    const result = await processDocumentContent(content);

    // Save Document record
    const doc = await db.document.create({
      data: {
        notebookId: notebook.id,
        title: title || `Lesson: ${new Date().toLocaleDateString()}`,
        fileUrl: '',
        fileType: 'TXT',
        content,
        summary: result.summary || ''
      }
    });

    return NextResponse.json({
      documentId: doc.id,
      summary: result.summary,
      vocabulary: result.vocabulary,
      notebookId: notebook.id
    });
  } catch (error: any) {
    console.error('❌ Document Processing Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
