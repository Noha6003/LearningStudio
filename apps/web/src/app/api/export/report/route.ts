import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    // Protect grades export (Only Teachers can run CSV grades downloads)
    if (!session || !session.user || (session.user as any).role !== 'TEACHER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Mock CSV content
    const headers = 'Student Name,Quiz Title,Score,Time Spent,Date,Status\n';
    const rows = [
      'Sammy Star,Space Planets Quiz,90%,14 mins,July 6 2026,Passed',
      'Billy Comet,Space Planets Quiz,55%,22 mins,July 6 2026,Struggling',
      'Astronaut Alex,Space Planets Quiz,85%,18 mins,July 6 2026,Passed'
    ].join('\n');

    const csvContent = headers + rows;

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="classroom_report_space6.csv"',
      }
    });
  } catch (error: any) {
    console.error('❌ CSV Report Export Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
