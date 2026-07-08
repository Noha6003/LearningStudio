import { NextResponse } from 'next/server';
import { askCopilot } from '@/lib/gemini';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role, prompt } = await req.json();

    if (!role || !prompt) {
      return NextResponse.json({ error: 'Role and prompt are required.' }, { status: 400 });
    }

    const reply = await askCopilot(role, prompt);
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('❌ AI Copilot API Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
