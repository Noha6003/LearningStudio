import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentName = searchParams.get('studentName') || 'Sammy Star';
  const courseTitle = searchParams.get('courseTitle') || 'Grade 6 Space & Planets';
  const grade = searchParams.get('grade') || '90%';
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const hash = Math.random().toString(36).substring(2, 10).toUpperCase();

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Certificate of Achievement - ${studentName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Montserrat:wght@400;600&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          background: #f8fafc;
          font-family: 'Montserrat', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        .certificate-container {
          width: 842px;
          height: 595px;
          background: #ffffff;
          border: 20px solid #0f172a;
          box-sizing: border-box;
          padding: 40px;
          position: relative;
          display: flex;
          flex-col: column;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }

        .border-inner {
          border: 4px double #d97706;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          padding: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
        }

        h1 {
          font-family: 'Cinzel', serif;
          color: #0f172a;
          font-size: 32px;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        h2 {
          font-family: 'Cinzel', serif;
          color: #d97706;
          font-size: 20px;
          margin: 10px 0;
          font-weight: 600;
        }

        .recipient-name {
          font-family: 'Cinzel', serif;
          font-size: 40px;
          font-weight: 800;
          color: #0f172a;
          margin: 15px 0;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 5px;
          width: 80%;
        }

        .description {
          font-size: 14px;
          color: #475569;
          max-width: 550px;
          line-height: 1.6;
          margin: 10px 0;
        }

        .footer-row {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 0 20px;
          margin-top: 15px;
        }

        .signature-block {
          border-top: 1px solid #94a3b8;
          width: 150px;
          padding-top: 5px;
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
        }

        .qr-code {
          border: 2px solid #e2e8f0;
          padding: 4px;
          border-radius: 8px;
          font-size: 8px;
          font-weight: 800;
          color: #64748b;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .qr-mock {
          width: 45px;
          height: 45px;
          background: #0f172a;
          color: white;
          font-size: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          line-height: 1.2;
        }

        @media print {
          body {
            background: none;
          }
          .certificate-container {
            box-shadow: none;
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="certificate-container">
        <div class="border-inner">
          <div>
            <h1>Luminary OS</h1>
            <h2>Certificate of Achievement</h2>
          </div>

          <div>
            <span style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">
              This is proudly presented to
            </span>
            <div class="recipient-name">${studentName}</div>
          </div>

          <p class="description">
            For successfully mastering the course module <strong>${courseTitle}</strong> with a final quiz outcome accuracy of <strong>${grade}</strong>. Issued on this day, fulfilling all curricular parameters.
          </p>

          <div class="footer-row">
            <div class="signature-block">
              Sarah Watson<br>
              <span style="font-weight: 400; font-size: 9px;">Classroom Instructor</span>
            </div>
            
            <div class="qr-code">
              <div class="qr-mock">QR<br>${hash}</div>
              <span>VERIFY</span>
            </div>

            <div class="signature-block">
              Luminary AI<br>
              <span style="font-weight: 400; font-size: 9px;">System Director</span>
            </div>
          </div>
        </div>
      </div>
      <script>
        // Trigger browser print dialog instantly if desired
        // window.print();
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    }
  });
}
