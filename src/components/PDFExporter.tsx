import React from 'react';
import { Download, FileText, Printer, Sparkles, CheckCircle2 } from 'lucide-react';
import { NcertChapter } from '../ncertData';
import { ClassLevel, SubjectName } from '../types';

interface PDFExporterProps {
  chapter: NcertChapter;
  subject: SubjectName;
  classLevel: ClassLevel;
  customNotes?: string[];
}

export default function PDFExporter({
  chapter,
  subject,
  classLevel,
  customNotes = []
}: PDFExporterProps) {

  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>LearnFlow AR - ${subject} Class ${classLevel} - Chapter ${chapter.number}: ${chapter.title}</title>
        <style>
          body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.6;
          }
          .header {
            border-bottom: 3px solid #6366f1;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .logo {
            font-size: 24px;
            font-weight: 800;
            color: #4f46e5;
          }
          .badge {
            background: #e0e7ff;
            color: #4338ca;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }
          h1 {
            font-size: 26px;
            color: #0f172a;
            margin-top: 0;
          }
          .meta {
            color: #64748b;
            font-size: 14px;
            margin-bottom: 24px;
          }
          .section {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .section-title {
            font-size: 16px;
            font-weight: 700;
            color: #4338ca;
            margin-top: 0;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          ul {
            margin: 0;
            padding-left: 20px;
          }
          li {
            margin-bottom: 8px;
          }
          .footer {
            margin-top: 40px;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
          }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">LearnFlow AR 📚</div>
          <div class="badge">Class ${classLevel} ${subject}</div>
        </div>

        <h1>Chapter ${chapter.number}: ${chapter.title}</h1>
        <div class="meta">NCERT Curriculum Revision Summary & Formula Sheet</div>

        <div class="section">
          <div class="section-title">📌 Core Topics Covered</div>
          <ul>
            ${chapter.topics.map(t => `<li><strong>${t}</strong>: Essential concept tested in CBSE/NEET/JEE.</li>`).join('')}
          </ul>
        </div>

        <div class="section">
          <div class="section-title">💡 Academic Summary & High-Yield Notes</div>
          <p>
            Chapter <strong>"${chapter.title}"</strong> is a core foundation block for Class ${classLevel} ${subject}.
            Students should prioritize quantitative formulas, structural diagrams, and analytical derivations.
          </p>
        </div>

        ${customNotes.length > 0 ? `
          <div class="section">
            <div class="section-title">✏️ Your Personal Highlighted Notes</div>
            <ul>
              ${customNotes.map(n => `<li>${n}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="footer">
          Generated automatically by LearnFlow AR Academic Platform • www.learnflow.edu
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <button
      onClick={handlePrintPDF}
      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
      title="Export styled chapter summary as PDF"
    >
      <Printer className="w-4 h-4" />
      <span>Export PDF Summary</span>
    </button>
  );
}
