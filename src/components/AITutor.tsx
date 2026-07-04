import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Cpu, CheckCircle2, ListPlus, Paperclip, X as XIcon, FileText, Image as ImageIcon, Upload, Copy, RotateCcw, Trash2 } from 'lucide-react';
import { ChatMessage, SubjectName, ClassLevel } from '../types';

interface AITutorProps {
  selectedSubject: SubjectName;
  classLevel: ClassLevel;
  chatHistory: ChatMessage[];
  onSendMessage: (
    text: string, 
    subjectOverride?: SubjectName, 
    classOverride?: ClassLevel, 
    currentTopic?: string,
    attachedFile?: { name: string; mimeType: string; base64: string }
  ) => Promise<void>;
  onImportTasks: (tasks: Array<{ title: string; description: string }>) => void;
  activeChapterTitle?: string;
  activeModelName?: string;
  selected3DNode?: string | null;
  activeAttachment?: { name: string; mimeType: string; base64: string } | null;
  setActiveAttachment?: (file: { name: string; mimeType: string; base64: string } | null) => void;
  onClearChat?: () => void;
  onRegenerateResponse?: () => void;
}

// Custom High-Fidelity Markdown & Math Parser Types
interface MarkdownBlock {
  type: 'paragraph' | 'code' | 'table' | 'math' | 'blockquote' | 'heading' | 'list';
  content: string;
  level?: number;
  items?: string[];
}

export default function AITutor({
  selectedSubject,
  classLevel,
  chatHistory,
  onSendMessage,
  onImportTasks,
  activeChapterTitle,
  activeModelName,
  selected3DNode,
  activeAttachment,
  setActiveAttachment,
  onClearChat,
  onRegenerateResponse,
}: AITutorProps) {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isSending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !activeAttachment) || isSending) return;

    let textToSend = inputText;
    // If user says "explain this" or similar, and we have a selected node, make it explicit!
    if (textToSend.trim().toLowerCase() === 'explain this' && selected3DNode) {
      textToSend = `Please explain the concept of "${selected3DNode}" from the chapter "${activeChapterTitle || activeModelName || 'our curriculum'}" in detail.`;
    } else if (!textToSend.trim() && activeAttachment) {
      textToSend = `Please analyze the uploaded file "${activeAttachment.name}" and provide study guidance.`;
    }

    setInputText('');
    setIsSending(true);

    try {
      await onSendMessage(
        textToSend, 
        selectedSubject, 
        classLevel, 
        selected3DNode || activeChapterTitle || undefined,
        activeAttachment || undefined
      );
      if (setActiveAttachment) {
        setActiveAttachment(null);
      }
    } catch (err) {
      console.error("AI message send failed:", err);
    } finally {
      setIsSending(false);
    }
  };

  const subjectPills: Record<SubjectName, string[]> = {
    'Biology': [
      'Teach me photosynthesis',
      'Quiz me on cell structure',
      'Summarize digestive systems',
      'Explain molecular structure of DNA'
    ],
    'Physics': [
      'Teach me orbital gravity',
      'Quiz me on solenoid flux',
      'Summarize electrostatics',
      'Explain Kepler\'s gravity orbit model'
    ],
    'Chemistry': [
      'Teach me chemical bonding',
      'Quiz me on stoichiometry',
      'Summarize reaction kinetics',
      'What are carbon tetrahedral bonds?'
    ],
    'Mathematics': [
      'Teach me vector cross products',
      'Quiz me on matrices',
      'Summarize integration Riemann sum',
      'Explain 3D Paraboloid focal properties'
    ]
  };

  const currentPills = subjectPills[selectedSubject] || subjectPills['Biology'];

  const handlePillClick = async (pillText: string) => {
    if (isSending) return;
    setIsSending(true);
    try {
      await onSendMessage(
        pillText,
        selectedSubject,
        classLevel,
        selected3DNode || activeChapterTitle || undefined
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  // Helper to copy text to clipboard
  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Message content copied to clipboard!");
  };

  // Markdown parser & renderer
  const parseBlocks = (text: string): MarkdownBlock[] => {
    const blocks: MarkdownBlock[] = [];
    const lines = text.split('\n');
    
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      
      // Code block
      if (line.trim().startsWith('```')) {
        let codeContent = '';
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeContent += lines[i] + '\n';
          i++;
        }
        blocks.push({ type: 'code', content: codeContent.trim() });
        i++; // skip closing backticks
        continue;
      }
      
      // Block Math equation $$ ... $$
      if (line.trim().startsWith('$$')) {
        let mathContent = line.trim().substring(2);
        if (mathContent.endsWith('$$')) {
          mathContent = mathContent.substring(0, mathContent.length - 2);
          blocks.push({ type: 'math', content: mathContent.trim() });
          i++;
          continue;
        }
        i++;
        while (i < lines.length && !lines[i].trim().endsWith('$$')) {
          mathContent += '\n' + lines[i];
          i++;
        }
        if (i < lines.length) {
          const lastLine = lines[i].trim();
          mathContent += '\n' + lastLine.substring(0, lastLine.length - 2);
        }
        blocks.push({ type: 'math', content: mathContent.trim() });
        i++;
        continue;
      }
      
      // Blockquote
      if (line.trim().startsWith('>')) {
        let quoteContent = line.trim().substring(1).trim();
        i++;
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          quoteContent += '\n' + lines[i].trim().substring(1).trim();
          i++;
        }
        blocks.push({ type: 'blockquote', content: quoteContent });
        continue;
      }
      
      // Table
      if (line.trim().startsWith('|')) {
        const tableLines: string[] = [line];
        i++;
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          tableLines.push(lines[i]);
          i++;
        }
        blocks.push({ type: 'table', content: tableLines.join('\n') });
        continue;
      }
      
      // Headings
      if (line.trim().startsWith('#')) {
        const match = line.trim().match(/^(#{1,6})\s+(.*)$/);
        if (match) {
          const level = match[1].length;
          const headingText = match[2];
          blocks.push({ type: 'heading', content: headingText, level });
          i++;
          continue;
        }
      }
      
      // Unordered List Items
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ') || line.trim().startsWith('• ')) {
        const items: string[] = [line.trim().substring(2).trim()];
        i++;
        while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* ') || lines[i].trim().startsWith('• '))) {
          items.push(lines[i].trim().substring(2).trim());
          i++;
        }
        blocks.push({ type: 'list', content: 'unordered', items });
        continue;
      }

      // Numbered List Items
      if (/^\d+\.\s+/.test(line.trim())) {
        const firstItem = line.trim().replace(/^\d+\.\s+/, '').trim();
        const items: string[] = [firstItem];
        i++;
        while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
          items.push(lines[i].trim().replace(/^\d+\.\s+/, '').trim());
          i++;
        }
        blocks.push({ type: 'list', content: 'ordered', items });
        continue;
      }
      
      // Standard paragraph
      if (line.trim() !== '') {
        let paragraphContent = line;
        i++;
        while (i < lines.length && lines[i].trim() !== '' && 
               !lines[i].trim().startsWith('```') && 
               !lines[i].trim().startsWith('$$') && 
               !lines[i].trim().startsWith('>') && 
               !lines[i].trim().startsWith('|') && 
               !lines[i].trim().startsWith('#') && 
               !lines[i].trim().startsWith('- ') && 
               !lines[i].trim().startsWith('* ') && 
               !/^\d+\.\s+/.test(lines[i].trim())) {
          paragraphContent += '\n' + lines[i];
          i++;
        }
        blocks.push({ type: 'paragraph', content: paragraphContent });
        continue;
      }
      
      i++;
    }
    return blocks;
  };

  const renderInlineText = (text: string): React.ReactNode[] => {
    // Splits by $math$, **bold**, `code`, *italic*
    const regex = /(\$[^\$]+\$|\*\*[^\*]+\*\*|`[^`]+`|\*[^\*]+\*|_[^_]+_)/g;
    const parts = text.split(regex);
    
    return parts.map((part, idx) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.substring(1, part.length - 1);
        return (
          <span key={idx} className="font-serif italic bg-orange-50/70 border border-orange-100/50 px-1 py-0.5 rounded text-[#fe6a34] font-semibold text-[11.5px]">
            {math}
          </span>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.substring(2, part.length - 2);
        return <strong key={idx} className="font-extrabold text-primary">{boldText}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        const codeText = part.substring(1, part.length - 1);
        return <code key={idx} className="bg-slate-100 px-1.5 py-0.5 rounded text-rose-600 font-mono text-[10.5px] border border-slate-200/50">{codeText}</code>;
      }
      if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
        const italicText = part.substring(1, part.length - 1);
        return <em key={idx} className="italic text-charcoal/85">{italicText}</em>;
      }
      return part;
    });
  };

  const renderTableBlock = (tableText: string) => {
    const rows = tableText.split('\n').map(line => {
      const cols = line.split('|').map(c => c.trim());
      if (cols[0] === '') cols.shift();
      if (cols[cols.length - 1] === '') cols.pop();
      return cols;
    });
    
    // Filter header separators (e.g., |---|---|)
    const filteredRows = rows.filter(row => {
      if (row.length === 0) return false;
      return !row.every(cell => /^[-:\s]+$/.test(cell));
    });
    
    if (filteredRows.length === 0) return null;
    
    const headers = filteredRows[0];
    const bodyRows = filteredRows.slice(1);
    
    return (
      <div className="overflow-x-auto my-3 border border-card-border rounded-lg shadow-2xs">
        <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
          <thead className="bg-[#fe6a34]/5 text-primary font-bold uppercase tracking-wider text-[10px]">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-3.5 py-2.5 border-b border-card-border/60">
                  {renderInlineText(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-150 text-charcoal">
            {bodyRows.map((row, rIdx) => (
              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/30'}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-3.5 py-2 font-medium">
                    {renderInlineText(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const CodeBlockComponent = ({ code }: { code: string; key?: any }) => {
    const [copied, setCopied] = useState(false);
    
    const copyCodeToClipboard = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    
    return (
      <div className="my-3.5 rounded-lg overflow-hidden border border-slate-200 shadow-3xs font-mono text-[11px] bg-slate-950 text-slate-100">
        <div className="bg-slate-900 px-3.5 py-2 flex justify-between items-center border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
          <span className="flex items-center gap-1.5 text-secondary">
            <Cpu className="w-3.5 h-3.5" /> Code &amp; Derivations
          </span>
          <button 
            type="button"
            onClick={copyCodeToClipboard}
            className="hover:text-white transition-all bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded border border-slate-700 flex items-center gap-1 cursor-pointer font-sans"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="p-3.5 overflow-x-auto text-left leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    );
  };

  const renderContentBlocks = (text: string) => {
    const blocks = parseBlocks(text);
    return blocks.map((block, index) => {
      switch (block.type) {
        case 'code':
          return <CodeBlockComponent key={index} code={block.content} />;
        case 'math':
          return (
            <div key={index} className="my-4 p-4 bg-[#fe6a34]/5 border border-[#fe6a34]/20 rounded-lg flex flex-col items-center justify-center text-center shadow-3xs animate-fade-in">
              <span className="text-sm font-serif italic text-[#fe6a34] font-bold tracking-wide select-all">
                {block.content}
              </span>
              <span className="text-[8px] font-mono uppercase text-[#fe6a34]/70 mt-1.5 tracking-widest font-extrabold bg-[#fe6a34]/10 px-2 py-0.5 rounded">
                Formula / Math Equation
              </span>
            </div>
          );
        case 'blockquote':
          return (
            <blockquote key={index} className="border-l-4 border-[#fe6a34] pl-4 my-3 italic text-charcoal/70 bg-surface-container-low/40 p-3 rounded-r-lg">
              {renderInlineText(block.content)}
            </blockquote>
          );
        case 'table':
          return <React.Fragment key={index}>{renderTableBlock(block.content)}</React.Fragment>;
        case 'heading':
          const sizeClass = block.level === 1 ? 'text-base font-extrabold mt-4 mb-2 text-primary border-b border-gray-100 pb-1' : 
                            block.level === 2 ? 'text-sm font-bold mt-3 mb-1.5 text-primary' : 
                            'text-xs font-bold mt-2 mb-1 text-[#fe6a34]';
          return (
            <div key={index} className={sizeClass}>
              {renderInlineText(block.content)}
            </div>
          );
        case 'list':
          const ListTag = block.content === 'ordered' ? 'ol' : 'ul';
          const listClass = block.content === 'ordered' ? 'list-decimal pl-5 space-y-1 my-2.5' : 'list-disc pl-5 space-y-1 my-2.5';
          return (
            <ListTag key={index} className={listClass}>
              {block.items?.map((item, itemIdx) => (
                <li key={itemIdx} className="text-xs text-charcoal/90 font-medium">
                  {renderInlineText(item)}
                </li>
              ))}
            </ListTag>
          );
        case 'paragraph':
        default:
          return (
            <p key={index} className="mb-3 leading-relaxed text-xs text-charcoal/90 font-medium">
              {renderInlineText(block.content)}
            </p>
          );
      }
    });
  };

  // Find the last AI message in the history
  const lastAiMessageIndex = [...chatHistory].reverse().findIndex(m => m.sender === 'ai');
  const getIsLastAiMsg = (msg: ChatMessage) => {
    return lastAiMessageIndex !== -1 && chatHistory.indexOf(msg) === (chatHistory.length - 1 - lastAiMessageIndex);
  };

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
      onDragLeave={() => setIsDraggingFile(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingFile(false);
        const file = e.dataTransfer.files?.[0];
        if (file && setActiveAttachment) {
          const isPdf = file.type === 'application/pdf';
          const isImage = file.type.startsWith('image/');
          if (isPdf || isImage) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64Data = reader.result as string;
              const base64 = base64Data.split(',')[1];
              setActiveAttachment({
                name: file.name,
                mimeType: file.type,
                base64
              });
            };
            reader.readAsDataURL(file);
          } else {
            alert("Please upload a PDF or an image file.");
          }
        }
      }}
      className={`bg-white border border-card-border rounded-xl shadow-sm flex flex-col h-[580px] overflow-hidden relative transition-all ${
        isDraggingFile ? 'ring-2 ring-secondary bg-secondary/5' : ''
      }`}
    >
      {/* Drag & Drop Overlay */}
      {isDraggingFile && (
        <div className="absolute inset-0 bg-secondary/15 backdrop-blur-3xs border-2 border-dashed border-secondary flex flex-col items-center justify-center gap-3 z-50 animate-fade-in pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-secondary/25 flex items-center justify-center text-secondary animate-bounce">
            <Upload className="w-7 h-7" />
          </div>
          <p className="text-sm font-black text-primary font-mono uppercase tracking-wider">
            Drop PDF or Image here to analyze!
          </p>
        </div>
      )}

      {/* Header bar */}
      <div className="bg-primary text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold">Class {classLevel} AI Tutor ({selectedSubject})</h2>
            <p className="text-[10px] text-white/60 font-mono uppercase">Context-Aware Academic Explainer</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {chatHistory.length > 0 && onClearChat && (
            <button
              onClick={onClearChat}
              className="text-xs bg-white/10 hover:bg-white/20 hover:text-red-300 px-2.5 py-1.5 rounded-lg border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
              title="Clear all messages"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-bold">Clear Chat</span>
            </button>
          )}
          <div className="text-right text-[10px] bg-white/10 px-2.5 py-1.5 rounded-lg text-white/80 font-semibold border border-white/10">
            • Gemini Powered
          </div>
        </div>
      </div>

      {/* Sticky Active Concept Context Badge */}
      {(selected3DNode || activeChapterTitle || activeModelName) && (
        <div className="bg-[#fe6a34]/10 border-b border-[#fe6a34]/20 p-2.5 px-4 flex flex-col sm:flex-row items-center justify-between gap-2 animate-fade-in shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#fe6a34] rounded-full animate-ping shrink-0" />
            <span className="text-[10px] font-mono font-bold text-secondary uppercase tracking-wider shrink-0">Active Context:</span>
            <span className="text-xs font-extrabold text-primary line-clamp-1">
              {selected3DNode ? `Node "${selected3DNode}"` : activeChapterTitle || activeModelName}
            </span>
          </div>
          <button
            onClick={() => {
              const text = selected3DNode 
                ? `Please explain the concept of "${selected3DNode}" in the context of "${activeChapterTitle || activeModelName || 'our study'}" in detail.`
                : `Please give me a complete overview of the chapter "${activeChapterTitle || activeModelName}".`;
              handlePillClick(text);
            }}
            disabled={isSending}
            className="text-[10.5px] font-extrabold text-white bg-[#fe6a34] hover:bg-[#fe6a34]/95 px-2.5 py-1 rounded-md transition-all shadow-3xs cursor-pointer flex items-center gap-1 shrink-0 animate-pulse"
            id="btn_context_explain"
          >
            <Sparkles className="w-3 h-3 text-white" />
            <span>Explain This Concept</span>
          </button>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-container-low">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 animate-fade-in">
            <Sparkles className="w-10 h-10 text-secondary mb-3 animate-bounce" style={{ animationDuration: '3s' }} />
            <h3 className="text-base font-bold text-primary">Your Personal Study Co-Pilot</h3>
            <p className="text-xs text-charcoal/60 mt-1 max-w-sm">
              Ask any syllabus question about **{selectedSubject}** for Class **{classLevel}**. I will break it down and prepare study tasks you can import instantly!
            </p>

            <div className="mt-6 w-full max-w-md">
              <p className="text-[10px] font-mono font-bold text-primary/60 uppercase tracking-wider mb-2.5">
                Quick Start Curriculum Prompts:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentPills.map((pill, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePillClick(pill)}
                    className="text-left text-xs bg-white border border-card-border hover:border-secondary hover:bg-secondary/5 p-2.5 rounded-lg text-primary transition-all cursor-pointer shadow-2xs font-bold"
                    id={`tutor_pill_${idx}`}
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          chatHistory.map((msg) => {
            const isLastAi = getIsLastAiMsg(msg);
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-charcoal/40 font-mono mb-1 px-1">
                  {msg.sender === 'user' ? (
                    <>
                      <span>You</span>
                      <User className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      <Cpu className="w-3 h-3 text-secondary" />
                      <span>AI Academic Tutor</span>
                    </>
                  )}
                  <span>• {msg.timestamp}</span>
                </div>

                <div
                  className={`w-full max-w-[85%] rounded-xl p-3.5 text-xs shadow-2xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#001736] text-white rounded-tr-none ml-auto'
                      : 'bg-white text-primary border border-card-border rounded-tl-none mr-auto'
                  }`}
                >
                  {/* File Attachment indicator */}
                  {msg.attachedFile && (
                    <div className={`mb-2 py-1.5 px-2.5 rounded-lg border text-[10.5px] font-bold flex items-center gap-2 ${
                      msg.sender === 'user'
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'bg-[#fe6a34]/10 border-[#fe6a34]/20 text-[#fe6a34]'
                    }`}>
                      {msg.attachedFile.mimeType?.startsWith('image/') ? (
                        <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span className="truncate max-w-[180px]">{msg.attachedFile.name}</span>
                      <span className="text-[8px] font-mono uppercase opacity-80 ml-auto bg-black/10 px-1 py-0.5 rounded">
                        {msg.attachedFile.mimeType?.startsWith('image/') ? 'Image' : 'PDF'}
                      </span>
                    </div>
                  )}

                  {/* Message Content with Custom Markdown Blocks */}
                  {msg.sender === 'user' ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <div className="space-y-1">
                      {renderContentBlocks(msg.content)}
                    </div>
                  )}

                  {/* Task Checklist Import CTA */}
                  {msg.tasksToImport && msg.tasksToImport.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-card-border/15 bg-[#fe6a34]/5 p-3 rounded-lg border border-[#fe6a34]/25 animate-fade-in text-primary">
                      <p className="text-[11px] font-bold text-secondary flex items-center gap-1">
                        <ListPlus className="w-4 h-4" />
                        <span>Syllabus Checklist Tasks Detected:</span>
                      </p>
                      <div className="mt-1.5 space-y-1.5">
                        {msg.tasksToImport.map((task, idx) => (
                          <div key={idx} className="text-[10.5px]">
                            <strong>• {task.title}</strong>
                            <span className="block text-charcoal/60 pl-2">{task.description}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => onImportTasks(msg.tasksToImport!)}
                        className="mt-3 w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-1.5 rounded-md text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
                        id={`btn_import_tutor_tasks_${msg.id}`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Import Recommended Tasks to My Planner</span>
                      </button>
                    </div>
                  )}

                  {/* AI Tutor Actions Row */}
                  {msg.sender === 'ai' && (
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-card-border/10 text-[9.5px] text-charcoal/40 font-mono">
                      <span>Interactive Format</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.content)}
                          className="hover:text-primary transition-all flex items-center gap-1 bg-surface-container hover:bg-surface-container-high border border-card-border rounded px-2 py-1 cursor-pointer font-bold font-sans text-[10px] text-charcoal"
                        >
                          <Copy className="w-3 h-3 text-secondary" />
                          <span>Copy Message</span>
                        </button>
                        {isLastAi && onRegenerateResponse && (
                          <button
                            type="button"
                            onClick={onRegenerateResponse}
                            className="hover:text-primary transition-all flex items-center gap-1 bg-surface-container hover:bg-surface-container-high border border-card-border rounded px-2 py-1 cursor-pointer font-bold font-sans text-[10px] text-charcoal"
                            title="Regenerate the last answer"
                          >
                            <RotateCcw className="w-3 h-3 text-[#fe6a34]" />
                            <span>Regenerate</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {isSending && (
          <div className="flex flex-col items-start animate-pulse">
            <div className="flex items-center gap-1.5 text-[10px] text-charcoal/40 font-mono mb-1 px-1">
              <Cpu className="w-3 h-3 text-secondary animate-spin" />
              <span>AI Academic Tutor is thinking...</span>
            </div>
            <div className="bg-white border border-card-border text-primary rounded-xl rounded-tl-none p-3.5 shadow-2xs">
              <div className="flex gap-1.5 items-center justify-center py-1 px-3">
                <span className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Attached File Preview Bar */}
      {activeAttachment && (
        <div className="bg-[#fe6a34]/5 border-t border-card-border px-4 py-2.5 flex items-center justify-between gap-2 animate-fade-in text-xs shrink-0">
          <div className="flex items-center gap-2 text-primary font-semibold">
            {activeAttachment.mimeType.startsWith('image/') ? (
              <ImageIcon className="w-4 h-4 text-[#fe6a34] animate-pulse" />
            ) : (
              <FileText className="w-4 h-4 text-[#fe6a34] animate-pulse" />
            )}
            <span className="truncate max-w-[180px] sm:max-w-xs text-[11px]">
              Attached: {activeAttachment.name}
            </span>
            <span className="text-[8px] bg-secondary/20 text-secondary border border-secondary/30 px-1.5 py-0.5 rounded font-mono uppercase">
              {activeAttachment.mimeType.startsWith('image/') ? 'Image' : 'PDF'}
            </span>
          </div>
          {setActiveAttachment && (
            <button
              type="button"
              onClick={() => setActiveAttachment(null)}
              className="text-charcoal/40 hover:text-red-500 transition-all p-1 hover:bg-red-50 rounded cursor-pointer"
              title="Remove attachment"
            >
              <XIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-card-border flex gap-2 bg-white">
        {setActiveAttachment && (
          <label className="bg-surface-container border border-card-border hover:bg-surface-container-high text-primary p-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center shrink-0 shadow-3xs" title="Attach PDF or Image">
            <Paperclip className="w-4 h-4 text-[#fe6a34]" />
            <input 
              type="file" 
              accept="application/pdf,image/*" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const isPdf = file.type === 'application/pdf';
                  const isImage = file.type.startsWith('image/');
                  if (!isPdf && !isImage) {
                    alert("Please upload a PDF document or an image file.");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64Data = reader.result as string;
                    const base64 = base64Data.split(',')[1];
                    setActiveAttachment({
                      name: file.name,
                      mimeType: file.type,
                      base64
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        )}
        <input
          type="text"
          placeholder={activeAttachment ? `Ask a question about ${activeAttachment.name}...` : `Ask about ${selectedSubject}... (e.g., Explain cell walls vs cell membranes)`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isSending}
          className="flex-1 text-xs border border-card-border p-2.5 rounded-lg focus:border-primary focus:outline-hidden transition-all font-medium"
          id="input_tutor_msg"
        />
        <button
          type="submit"
          disabled={(!inputText.trim() && !activeAttachment) || isSending}
          className="bg-primary hover:bg-primary-light disabled:bg-primary/50 text-white p-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center shrink-0 shadow-xs"
          id="btn_send_tutor_msg"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
