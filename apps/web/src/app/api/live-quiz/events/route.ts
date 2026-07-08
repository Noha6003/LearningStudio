import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  const encoder = new TextEncoder();
  const customStream = new ReadableStream({
    start(controller) {
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // 1. Initial State: LOBBY
      sendEvent({ 
        state: 'LOBBY', 
        participants: ['Sammy Star', 'Billy Comet', 'Astronaut Alex'],
        code: code || 'SPACE6'
      });

      // 2. Simulate game progression steps
      let step = 0;
      const interval = setInterval(() => {
        step++;
        if (step === 2) {
          // Slide 1: Show Question
          sendEvent({ 
            state: 'QUESTION', 
            questionIdx: 0, 
            text: 'What is the closest planet to the Sun?', 
            options: ['Mercury', 'Venus', 'Earth', 'Mars'],
            timeLimit: 15
          });
        } else if (step === 4) {
          // Show answers stats & leaderboards
          sendEvent({ 
            state: 'LEADERBOARD', 
            questionIdx: 0,
            correctAnswer: 'Mercury',
            standings: [
              { name: 'Sammy Star', score: 980, streak: 1 },
              { name: 'Astronaut Alex', score: 890, streak: 1 },
              { name: 'Billy Comet', score: 0, streak: 0 }
            ]
          });
        } else if (step === 6) {
          // Slide 2: Show next question
          sendEvent({
            state: 'QUESTION',
            questionIdx: 1,
            text: 'Is Mars bigger than the planet Earth?',
            options: ['True', 'False'],
            timeLimit: 10
          });
        } else if (step === 8) {
          // Final Game Podium
          sendEvent({
            state: 'PODIUM',
            first: 'Sammy Star',
            second: 'Astronaut Alex',
            third: 'Billy Comet'
          });
          clearInterval(interval);
          controller.close();
        }
      }, 5000); // Trigger a transition state every 5 seconds

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
      });
    }
  });

  return new Response(customStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  });
}
