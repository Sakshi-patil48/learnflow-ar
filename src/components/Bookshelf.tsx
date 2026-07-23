import React, { useState } from 'react';
import { 
  Book, 
  BookOpen, 
  Sparkles, 
  CheckCircle, 
  Brain, 
  HelpCircle, 
  List, 
  X, 
  Star, 
  Clock, 
  Play, 
  ChevronRight, 
  Compass, 
  Award,
  ChevronLeft,
  ArrowRight,
  Info,
  Upload,
  Trash2,
  FileText,
  Layers,
  AlertCircle,
  ExternalLink,
  LayoutGrid,
  Search,
  BookMarked,
  Users,
  Video,
  Maximize2,
  Download
} from 'lucide-react';
import { ClassLevel, SubjectName } from '../types';
import { NcertChapter, extractYouTubeId } from '../ncertData';
import { getChapterDetails, ChapterDetails } from '../chapterContentData';

interface BookshelfProps {
  classLevel: ClassLevel;
  subject: SubjectName;
  chapters: NcertChapter[];
  onExploreIn3D: (chapterTitle: string, nodes: string[]) => void;
  onAskAI: (
    chapterTitle: string,
    selectedConcept?: string,
    attachedFile?: { name: string; mimeType: string; base64: string }
  ) => void;
}

const renderChapterGraphic = (subject: SubjectName, chapterNumber: number, classLevel?: ClassLevel) => {
  const iconIndex = (chapterNumber - 1) % 6;
  const col = iconIndex % 2;
  const row = Math.floor(iconIndex / 2);

  if (subject === 'Mathematics' && (classLevel === '12th' || classLevel === '11th')) {
    return (
      <div className="w-full h-full relative overflow-hidden bg-white">
        <img 
          src={classLevel === '12th' ? "/maths 12.jpeg" : "/math11.jpeg"}
          onError={(e) => {
            const img = e.currentTarget;
            img.style.display = 'none';
            const parent = img.parentElement;
            if (parent) {
              if (!parent.querySelector('.fallback-label')) {
                const fallbackBg = document.createElement('div');
                fallbackBg.className = "fallback-label absolute inset-0 bg-gradient-to-br from-indigo-900 to-[#0c002c] opacity-80 flex items-center justify-center text-white/30 font-bold text-xs";
                fallbackBg.innerText = "Maths Ch " + chapterNumber;
                parent.appendChild(fallbackBg);
              }
            }
          }}
          alt={`Mathematics Class ${classLevel} Cover`} 
          className="w-full h-full object-cover transform scale-100 hover:scale-110 transition-transform duration-700" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  if (subject === 'Physics') {
    return (
      <div className="w-full h-full relative overflow-hidden bg-white">
        <img 
          src={classLevel === '12th' ? "/phy12.jpeg" : classLevel === '11th' ? "/11phy.jp.jpeg" : "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&auto=format&fit=crop&q=80"}
          onError={(e) => {
            const img = e.currentTarget;
            img.style.display = 'none';
            const parent = img.parentElement;
            if (parent) {
              if (!parent.querySelector('.fallback-label')) {
                const fallbackBg = document.createElement('div');
                fallbackBg.className = "fallback-label absolute inset-0 bg-gradient-to-br from-blue-900 to-[#00122c] opacity-80 flex items-center justify-center text-white/30 font-bold text-xs";
                fallbackBg.innerText = "Physics Ch " + chapterNumber;
                parent.appendChild(fallbackBg);
              }
            }
          }}
          alt="Physics Cover" 
          className="w-full h-full object-cover transform scale-100 hover:scale-110 transition-transform duration-700" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  if (subject === 'Biology') {
    return (
      <div className="w-full h-full relative overflow-hidden bg-white">
        <img 
          src={classLevel === '12th' ? "/bio12.jpeg" : classLevel === '11th' ? "/bio11.jpeg" : "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&auto=format&fit=crop&q=80"}
          onError={(e) => {
            const img = e.currentTarget;
            img.style.display = 'none';
            const parent = img.parentElement;
            if (parent) {
              if (!parent.querySelector('.fallback-label')) {
                const fallbackBg = document.createElement('div');
                fallbackBg.className = "fallback-label absolute inset-0 bg-gradient-to-br from-emerald-950 to-[#011a10] opacity-80 flex items-center justify-center text-white/30 font-bold text-xs";
                fallbackBg.innerText = "Biology Ch " + chapterNumber;
                parent.appendChild(fallbackBg);
              }
            }
          }}
          alt="Biology Cover" 
          className="w-full h-full object-cover transform scale-100 hover:scale-110 transition-transform duration-700" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  if (subject === 'Chemistry') {
    return (
      <div className="w-full h-full relative overflow-hidden bg-white">
        <img 
          src={classLevel === '12th' ? "/chem 12.jpeg" : classLevel === '11th' ? "/11chem.jpeg" : "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&auto=format&fit=crop&q=80"}
          onError={(e) => {
            const img = e.currentTarget;
            img.style.display = 'none';
            const parent = img.parentElement;
            if (parent) {
              if (!parent.querySelector('.fallback-label')) {
                const fallbackBg = document.createElement('div');
                fallbackBg.className = "fallback-label absolute inset-0 bg-gradient-to-br from-[#1f0b00] to-[#080300] opacity-80 flex items-center justify-center text-white/30 font-bold text-xs";
                fallbackBg.innerText = "Chemistry Ch " + chapterNumber;
                parent.appendChild(fallbackBg);
              }
            }
          }}
          alt="Chemistry Cover" 
          className="w-full h-full object-cover transform scale-100 hover:scale-110 transition-transform duration-700" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  switch (subject) {
    case 'Mathematics':
      return (
        <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#130f26] to-[#06040d]">
          <svg viewBox="0 0 400 240" className="w-full h-full object-cover rounded-t-xl opacity-80 transform hover:scale-110 transition-transform duration-700">
            <g stroke="#6366f1" strokeWidth="0.5" strokeOpacity="0.2">
              {Array.from({ length: 11 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * 40} y1="0" x2={i * 40} y2="240" />
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} />
              ))}
            </g>
            <path
              d={Array.from({ length: 41 }).map((_, i) => {
                const x = i * 10;
                const y = 120 + Math.sin(i * 0.3) * 45;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d={Array.from({ length: 41 }).map((_, i) => {
                const x = i * 10;
                const y = 120 + Math.cos(i * 0.3) * 35;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              fill="none"
              stroke="#ff7849"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeOpacity="0.7"
            />
            <polygon points="200,60 260,160 140,160" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx="200" cy="120" r="50" fill="none" stroke="#ff7849" strokeWidth="1" strokeOpacity="0.4" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      );
    default:
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 rounded-t-xl" />
      );
  }
};

export default function Bookshelf({
  classLevel,
  subject,
  chapters,
  onExploreIn3D,
  onAskAI
}: BookshelfProps) {
  const [selectedChapter, setSelectedChapter] = useState<NcertChapter | null>(null);
  const [activeTab, setActiveTab] = useState<'book' | 'notes' | 'formulas' | 'concepts' | 'diagrams' | 'objectives'>('book');
  const [chapterPdfs, setChapterPdfs] = useState<Record<string, { url: string; name: string; type?: string; base64?: string }>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleFileSelection = (file: File) => {
    if (!file || !selectedChapter) return;
    const isPdf = file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/');
    if (!isPdf && !isImage) {
      alert("Please upload a PDF document or an image file.");
      return;
    }
    const url = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      const base64 = base64Data.split(',')[1];
      setChapterPdfs(prev => ({
        ...prev,
        [selectedChapter.id]: {
          url,
          name: file.name,
          type: file.type,
          base64
        }
      }));
    };
    reader.readAsDataURL(file);
  };
  const [simulatedPage, setSimulatedPage] = useState(1);
  const [videoViewer, setVideoViewer] = useState<{
    title: string;
    embedId: string;
    chapterId: string;
    nodes3D?: string[];
  } | null>(null);

  const handleOpenVideo = (title: string, videoUrl: string, chapterId: string, nodes3D?: string[]) => {
    const embedId = extractYouTubeId(videoUrl);
    if (embedId) {
      setVideoViewer({
        title,
        embedId,
        chapterId,
        nodes3D
      });
    }
  };

  const [quizState, setQuizState] = useState<{
    isActive: boolean;
    currentQuestionIdx: number;
    selectedOptionIdx: number | null;
    isSubmitted: boolean;
    score: number;
    answers: number[]; // Store chosen indexes
  } | null>(null);

  // Load rich content details for selected chapter
  const details: ChapterDetails | null = selectedChapter 
    ? getChapterDetails(selectedChapter.id, selectedChapter.title, subject)
    : null;

  // Render book spine colors based on subjects
  const getSubjectColor = (sub: SubjectName) => {
    switch (sub) {
      case 'Biology': return { bg: 'from-emerald-600 to-emerald-800', border: 'border-emerald-500', text: 'text-emerald-50' };
      case 'Physics': return { bg: 'from-blue-600 to-blue-800', border: 'border-blue-500', text: 'text-blue-50' };
      case 'Chemistry': return { bg: 'from-orange-500 to-orange-700', border: 'border-orange-400', text: 'text-orange-50' };
      case 'Mathematics': return { bg: 'from-indigo-600 to-indigo-800', border: 'border-indigo-500', text: 'text-indigo-50' };
      default: return { bg: 'from-charcoal/70 to-charcoal/90', border: 'border-charcoal/50', text: 'text-white' };
    }
  };

  const colors = getSubjectColor(subject);

  const [completedChapters, setCompletedChapters] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ncert_completed_chapters');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const toggleChapterCompletion = (chapterId: string) => {
    setCompletedChapters(prev => {
      const next = prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId];
      try {
        localStorage.setItem('ncert_completed_chapters', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Simple progress metrics based on actual chapter completion state
  const completedCount = chapters.filter(c => completedChapters.includes(c.id)).length;
  const completionPercent = chapters.length > 0 ? Math.round((completedCount / chapters.length) * 100) : 0;

  // Handle Starting Quiz
  const handleStartQuiz = () => {
    setQuizState({
      isActive: true,
      currentQuestionIdx: 0,
      selectedOptionIdx: null,
      isSubmitted: false,
      score: 0,
      answers: []
    });
  };

  // Handle Option Click
  const handleSelectOption = (idx: number) => {
    if (quizState?.isSubmitted) return;
    setQuizState(prev => prev ? { ...prev, selectedOptionIdx: idx } : null);
  };

  // Submit Answer
  const handleSubmitAnswer = () => {
    if (!quizState || quizState.selectedOptionIdx === null || quizState.isSubmitted) return;
    
    const isCorrect = quizState.selectedOptionIdx === details?.quiz[quizState.currentQuestionIdx].answerIndex;
    setQuizState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        isSubmitted: true,
        score: isCorrect ? prev.score + 1 : prev.score,
        answers: [...prev.answers, prev.selectedOptionIdx!]
      };
    });
  };

  // Next Question
  const handleNextQuestion = () => {
    if (!quizState || !details) return;
    
    const nextIdx = quizState.currentQuestionIdx + 1;
    if (nextIdx >= details.quiz.length) {
      // Completed! Keep isActive true but currentQuestionIdx matches length (shows results)
      setQuizState(prev => prev ? { ...prev, currentQuestionIdx: nextIdx } : null);
    } else {
      setQuizState(prev => prev ? { 
        ...prev, 
        currentQuestionIdx: nextIdx,
        selectedOptionIdx: null,
        isSubmitted: false
      } : null);
    }
  };

  const filteredChapters = chapters.filter(chapter => 
    chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    `chapter ${chapter.number}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-slate-50/50 border border-slate-200/60 rounded-2xl p-4 md:p-8 shadow-sm space-y-8">
      
      {/* ==================== 1. HIGH-FIDELITY TRACKER HEADER ==================== */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase font-bold bg-[#fe6a34]/10 text-[#fe6a34] px-2.5 py-1 rounded-full border border-[#fe6a34]/15">
              Curriculum Core
            </span>
            <span className="text-xs text-slate-300 font-mono">•</span>
            <span className="text-xs text-slate-500 font-bold font-mono">Class {classLevel} NCERT Syllabus</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#001736] tracking-tight">
            {subject} 101
          </h2>
          <p className="text-xs text-slate-500 font-medium">Class {classLevel} - NCERT Comprehensive Curriculum</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 lg:w-[60%] max-w-2xl">
          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Syllabus Completed</span>
              <span className="text-2xl font-black text-[#fe6a34] font-mono leading-none">{completionPercent}%</span>
            </div>
            
            {/* High fidelity Orange/Slate progress bar */}
            <div className="w-full bg-slate-100 border border-slate-200/50 h-3 rounded-full overflow-hidden p-0.5">
              <div 
                className="bg-[#fe6a34] h-full rounded-full transition-all duration-700 shadow-sm" 
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold">
              <span>{completedCount} OF {chapters.length} CHAPTERS COMPLETE</span>
              <span>{chapters.length - completedCount} REMAINING</span>
            </div>
          </div>

          <button 
            onClick={() => {
              // Open Chapter 3 (In Progress) if it exists, otherwise the first chapter
              const resumeChapter = chapters.find(c => c.number === 3) || chapters[0];
              if (resumeChapter) {
                setSelectedChapter(resumeChapter);
                setActiveTab('book');
                setQuizState(null);
                setSimulatedPage(1);
              }
            }}
            className="bg-[#001736] hover:bg-[#00285d] text-white text-xs font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer hover:-translate-y-0.5 duration-200 active:translate-y-0"
            id="tracker_resume_btn"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white" />
            <span>Resume Learning</span>
          </button>
        </div>
      </div>

      {!selectedChapter ? (
        /* ==================== BOOKSHELF MAIN VIEW ==================== */
        <div className="space-y-8 animate-fade-in">
          
          {/* ==================== 2. FEATURED GRID & INSIGHTS BAR ==================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* FEATURED TEXTBOOK CARD (8 cols) */}
            <div className="lg:col-span-8 bg-[#001736] text-white border border-slate-800/20 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
              <div className="flex-1 flex flex-col justify-between h-full space-y-6 relative z-10">
                <div className="space-y-3">
                  <span className="inline-block bg-[#fe6a34] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/10">
                    Featured Textbook
                  </span>
                  <h3 className="text-xl md:text-2.5xl font-black tracking-tight leading-tight">
                    Mastering {subject}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-200/90 leading-relaxed max-w-md">
                    {subject === 'Chemistry' && "Dive deep into the microscopic world with high-fidelity 3D models and augmented reality experiments."}
                    {subject === 'Physics' && "Understand the core mechanics, electromagnetism, and optical phenomenon through interactive simulations."}
                    {subject === 'Biology' && "Explore the complex structures of life, genetics, and molecular physiology in vivid 3D space."}
                    {subject === 'Mathematics' && "Master calculus, algebra, and geometry through logical step-by-step visualizations."}
                  </p>
                  <p className="text-[11px] text-slate-300/75 leading-relaxed hidden md:block max-w-sm">
                    {subject === 'Chemistry' && "This interactive NCERT collection covers the foundations of Physical, Inorganic, and Organic Chemistry with step-by-step 3D visualizers."}
                    {subject === 'Physics' && "This textbook collection brings theoretical classical physics, wave optics, and modern quantum theories into immersive visual space."}
                    {subject === 'Biology' && "Examine live 3D models of human organs, plant cell anatomy, DNA double-helix replications, and ecosystems in an active sandbox."}
                    {subject === 'Mathematics' && "Translate complex algebraic equations and calculus functions into beautiful real-time 3D graphs and multi-dimensional matrices."}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (chapters.length > 0) {
                        setSelectedChapter(chapters[0]);
                        setActiveTab('book');
                        setQuizState(null);
                        setSimulatedPage(1);
                      }
                    }}
                    className="bg-white hover:bg-slate-100 text-[#001736] text-xs py-3 px-6 rounded-xl font-bold transition-all shadow-md cursor-pointer hover:-translate-y-0.5 duration-200"
                    id="featured_open_library_btn"
                  >
                    Open Library
                  </button>
                  
                  <button
                    className="bg-white/10 hover:bg-white/20 border border-white/10 text-white p-3 rounded-xl transition-all cursor-pointer hover:text-[#fe6a34]"
                    title="Bookmark Textbook"
                    id="featured_bookmark_btn"
                  >
                    <BookMarked className="w-4 h-4 text-blue-400" />
                  </button>
                </div>
              </div>

              {/* 3D Textbook Cover Graphic Panel */}
              <div className="w-full md:w-56 shrink-0 flex items-center justify-center relative z-10 p-2">
                {subject === 'Physics' && classLevel === '12th' ? (
                  <div className="relative group w-48 md:w-52 h-64 md:h-72 rounded-r-xl overflow-hidden shadow-2xl border border-gray-200/60 transform hover:-translate-y-2 hover:rotate-1 transition-all duration-300 bg-white">
                    <img 
                      src="/phy12.jpeg" 
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.style.display = 'none';
                      }}
                      alt="Physics Class 12 Cover" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/5 rounded-l-xs z-10" />
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100 z-10" />
                  </div>
                ) : subject === 'Physics' && classLevel === '11th' ? (
                  <div className="relative group w-48 md:w-52 h-64 md:h-72 rounded-r-xl overflow-hidden shadow-2xl border border-gray-200/60 transform hover:-translate-y-2 hover:rotate-1 transition-all duration-300 bg-white">
                    <img 
                      src="/11phy.jp.jpeg" 
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.style.display = 'none';
                      }}
                      alt="Physics Class 11 Cover" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/5 rounded-l-xs z-10" />
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100 z-10" />
                  </div>
                ) : subject === 'Physics' ? (
                  <div className="relative group w-48 md:w-52 h-64 md:h-72 rounded-r-xl overflow-hidden shadow-2xl border border-gray-200/60 transform hover:-translate-y-2 hover:rotate-1 transition-all duration-300 bg-white">
                    <img 
                      src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&auto=format&fit=crop&q=80" 
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.style.display = 'none';
                      }}
                      alt="Physics Cover" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/5 rounded-l-xs z-10" />
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100 z-10" />
                  </div>
                ) : subject === 'Biology' && classLevel === '12th' ? (
                  <div className="relative group w-48 md:w-52 h-64 md:h-72 rounded-r-xl overflow-hidden shadow-2xl border border-gray-200/60 transform hover:-translate-y-2 hover:rotate-1 transition-all duration-300 bg-white">
                    <img 
                      src="/bio12.jpeg" 
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.style.display = 'none';
                      }}
                      alt="Biology Class 12 Cover" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/5 rounded-l-xs z-10" />
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100 z-10" />
                  </div>
                ) : subject === 'Biology' && classLevel === '11th' ? (
                  <div className="relative group w-48 md:w-52 h-64 md:h-72 rounded-r-xl overflow-hidden shadow-2xl border border-gray-200/60 transform hover:-translate-y-2 hover:rotate-1 transition-all duration-300 bg-white">
                    <img 
                      src="/bio11.jpeg" 
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.style.display = 'none';
                      }}
                      alt="Biology Class 11 Cover" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/5 rounded-l-xs z-10" />
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100 z-10" />
                  </div>
                ) : subject === 'Biology' ? (
                  <div className="relative group w-48 md:w-52 h-64 md:h-72 rounded-r-xl overflow-hidden shadow-2xl border border-gray-200/60 transform hover:-translate-y-2 hover:rotate-1 transition-all duration-300 bg-white">
                    <img 
                      src="https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&auto=format&fit=crop&q=80" 
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.style.display = 'none';
                      }}
                      alt="Biology Cover" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/5 rounded-l-xs z-10" />
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100 z-10" />
                  </div>
                ) : subject === 'Chemistry' && classLevel === '12th' ? (
                  <div className="relative group w-48 md:w-52 h-64 md:h-72 rounded-r-xl overflow-hidden shadow-2xl border border-gray-200/60 transform hover:-translate-y-2 hover:rotate-1 transition-all duration-300 bg-white">
                    <img 
                      src="/chem 12.jpeg" 
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.style.display = 'none';
                      }}
                      alt="Chemistry Class 12 Cover" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/5 rounded-l-xs z-10" />
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100 z-10" />
                  </div>
                ) : subject === 'Chemistry' && classLevel === '11th' ? (
                  <div className="relative group w-48 md:w-52 h-64 md:h-72 rounded-r-xl overflow-hidden shadow-2xl border border-gray-200/60 transform hover:-translate-y-2 hover:rotate-1 transition-all duration-300 bg-white">
                    <img 
                      src="/11chem.jpeg" 
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.style.display = 'none';
                      }}
                      alt="Chemistry Class 11 Cover" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/5 rounded-l-xs z-10" />
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100 z-10" />
                  </div>
                ) : subject === 'Chemistry' ? (
                  <div className="relative group w-48 md:w-52 h-64 md:h-72 rounded-r-xl overflow-hidden shadow-2xl border border-gray-200/60 transform hover:-translate-y-2 hover:rotate-1 transition-all duration-300 bg-white">
                    <img 
                      src="https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&auto=format&fit=crop&q=80" 
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.style.display = 'none';
                      }}
                      alt="Chemistry Cover" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/5 rounded-l-xs z-10" />
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100 z-10" />
                  </div>
                ) : subject === 'Mathematics' && classLevel === '12th' ? (
                  <div className="relative group w-48 md:w-52 h-64 md:h-72 rounded-r-xl overflow-hidden shadow-2xl border border-gray-200/60 transform hover:-translate-y-2 hover:rotate-1 transition-all duration-300 bg-white">
                    <img 
                      src="/maths 12.jpeg" 
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.style.display = 'none';
                      }}
                      alt="Mathematics Class 12 Cover" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/5 rounded-l-xs z-10" />
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100 z-10" />
                  </div>
                ) : subject === 'Mathematics' && classLevel === '11th' ? (
                  <div className="relative group w-48 md:w-52 h-64 md:h-72 rounded-r-xl overflow-hidden shadow-2xl border border-gray-200/60 transform hover:-translate-y-2 hover:rotate-1 transition-all duration-300 bg-white">
                    <img 
                      src="/math11.jpeg" 
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.style.display = 'none';
                      }}
                      alt="Mathematics Class 11 Cover" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/5 rounded-l-xs z-10" />
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100 z-10" />
                  </div>
                ) : (
                  // Custom stunning 3D CSS rendering cover for Chemistry and Mathematics
                  <div className="transform hover:-translate-y-1 hover:rotate-1 transition-all duration-300">
                    {(() => {
                      let gradientClass = 'from-[#1f0b00] to-[#080300] border-orange-500/20';
                      let accentColor = '#ff7849';
                      let title = 'Mastering Chemistry';
                      let categoryText = 'PHYSICAL & INORGANIC';
                      let decoration = (
                        <div className="absolute inset-0 flex items-center justify-center opacity-10">
                          <svg className="w-24 h-24 stroke-white fill-none" viewBox="0 0 100 100">
                            <polygon points="50,15 90,35 90,75 50,95 10,75 10,35" strokeWidth="2" />
                            <circle cx="50" cy="55" r="15" />
                          </svg>
                        </div>
                      );

                      if (subject === 'Mathematics') {
                        gradientClass = 'from-[#130f26] to-[#06040d] border-indigo-500/20';
                        accentColor = '#6366f1';
                        title = 'Mastering Mathematics';
                        categoryText = 'CALCULUS & ALGEBRA';
                        decoration = (
                          <div className="absolute inset-0 flex items-center justify-center opacity-10">
                            <svg className="w-24 h-24 stroke-white fill-none" viewBox="0 0 100 100">
                              <line x1="10" y1="50" x2="90" y2="50" strokeWidth="2" />
                              <line x1="50" y1="10" x2="50" y2="90" strokeWidth="2" />
                              <circle cx="50" cy="50" r="30" strokeDasharray="4,4" />
                              <polygon points="50,10 90,50 50,90 10,50" />
                            </svg>
                          </div>
                        );
                      }

                      return (
                        <div className={`relative w-44 h-60 rounded-r-xl bg-gradient-to-br ${gradientClass} shadow-2xl p-5 flex flex-col justify-between text-white border-y border-r border-white/10 overflow-hidden`}>
                          <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/25 rounded-l-xs z-10" />
                          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-white/15 z-10" />
                          {decoration}
                          <div className="relative z-10 pl-2">
                            <span className="block text-[8px] font-mono tracking-widest text-[#fe6a34] uppercase font-bold">
                              {categoryText}
                            </span>
                            <h3 className="text-xs font-black font-sans leading-tight tracking-tight mt-1 uppercase line-clamp-3">
                              {title}
                            </h3>
                            <p className="text-[8px] text-white/50 font-mono mt-1">Class {classLevel} NCERT</p>
                          </div>
                          <div className="relative z-10 pl-2 pt-2.5 border-t border-white/10 flex justify-between items-end">
                            <div className="font-serif italic text-[10px] text-white/70 font-bold">VOL II</div>
                            <div className="text-[8px] font-mono bg-white/10 px-2 py-0.5 rounded border border-white/5 uppercase">
                              CBSE Elite
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Gradient Background Ambience */}
              <div className="absolute inset-0 bg-radial-gradient from-[#fe6a34]/5 to-transparent pointer-events-none" />
            </div>

            {/* AI STUDY INSIGHTS & TEAM STATS (4 cols) */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-6">
              
              {/* AI Study Insight Card */}
              <div className="bg-amber-50/60 border border-amber-200/50 p-5 rounded-3xl shadow-3xs flex flex-col justify-between h-full hover:border-amber-300 transition-all">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-100 rounded-lg">
                      <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                    </div>
                    <span className="text-xs font-black uppercase text-amber-800 tracking-wider font-mono">
                      AI Study Insight
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {subject === 'Chemistry' && (
                      <>Your strongest topic is <strong className="text-[#001736]">Solutions</strong>. Consider reviewing <strong className="text-[#fe6a34]">Chemical Kinetics</strong> today to maintain your weekly milestone streak.</>
                    )}
                    {subject === 'Physics' && (
                      <>Your strongest topic is <strong className="text-[#001736]">Electromagnetic Induction</strong>. Consider reviewing <strong className="text-[#fe6a34]">Ray Optics</strong> today to maintain your weekly milestone streak.</>
                    )}
                    {subject === 'Biology' && (
                      <>Your strongest topic is <strong className="text-[#001736]">Molecular Inheritance</strong>. Consider reviewing <strong className="text-[#fe6a34]">Biotechnology</strong> today to maintain your weekly milestone streak.</>
                    )}
                    {subject === 'Mathematics' && (
                      <>Your strongest topic is <strong className="text-[#001736]">Integrals</strong>. Consider reviewing <strong className="text-[#fe6a34]">Differential Equations</strong> today to maintain your weekly milestone streak.</>
                    )}
                  </p>
                </div>
                <div className="text-[10px] text-amber-700 font-bold font-mono mt-4 pt-3 border-t border-amber-200/40">
                  ⚡ SYLLABUS ALIGNED REC
                </div>
              </div>

              {/* Active Users Card */}
              <div className="bg-white border border-slate-200/85 p-5 rounded-3xl shadow-3xs flex items-center justify-between hover:shadow-xs transition-all">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    Active Studying
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2.5xl font-extrabold text-[#001736] font-mono">12.4k</span>
                    <span className="text-xs text-emerald-500 font-bold">● Live</span>
                  </div>
                </div>

                {/* Stacked avatars resembling screenshot */}
                <div className="flex items-center -space-x-2.5 overflow-hidden">
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80" alt="Student" className="h-full w-full object-cover" />
                  </div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&q=80" alt="Student" className="h-full w-full object-cover" />
                  </div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=80" alt="Student" className="h-full w-full object-cover" />
                  </div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#fe6a34] flex items-center justify-center text-[10px] text-white font-mono font-black">
                    +3k
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ==================== 3. ACADEMIC MODULES BAR ==================== */}
          <div className="border-t border-slate-200/60 pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-[#001736] tracking-tight">
                  Academic Modules
                </h3>
                <p className="text-xs text-slate-500 font-medium">Interactive chapters with immersive 3D content and practice sets.</p>
              </div>

              {/* SEARCH & TOGGLE COMBO BAR */}
              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                <div className="relative w-full sm:w-64">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-3.5 w-3.5 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chapters..."
                    className="block w-full pl-9 pr-8 py-2 text-xs border border-slate-200 rounded-xl bg-white text-[#001736] placeholder:text-slate-400 focus:outline-hidden focus:border-[#fe6a34] focus:ring-1 focus:ring-[#fe6a34] transition-all font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white text-[#001736] shadow-3xs'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-white text-[#001736] shadow-3xs'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Empty filter fallback */}
            {filteredChapters.length === 0 ? (
              <div className="bg-white border border-slate-200 p-12 text-center rounded-2xl">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-[#001736]">No Chapters Found</h4>
                <p className="text-xs text-slate-400 mt-1 font-medium">No chapters match your search query "{searchQuery}". Try typing another keyword.</p>
              </div>
            ) : viewMode === 'grid' ? (
              /* ==================== GRID VIEW (ALL UNLOCKED) ==================== */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChapters.map((chapter) => {
                  const bookDetails = getChapterDetails(chapter.id, chapter.title, subject);
                  const estimatedPages = Math.round(bookDetails.readTimeMins * 1.5 + 10);
                  const isCompleted = completedChapters.includes(chapter.id);
                  const inProgress = chapter.number === 3;

                  let cardBorderClass = 'border-slate-200/80 hover:border-[#fe6a34]/30';
                  let leftBorderIndicator = '';
                  let actionIcon = <ArrowRight className="w-4 h-4 text-slate-500" />;

                  if (inProgress) {
                    cardBorderClass = 'border-slate-200/90 hover:border-slate-300 shadow-md';
                    leftBorderIndicator = 'border-l-5 border-l-[#fe6a34] pl-3.5';
                    actionIcon = (
                      <div className="p-2 bg-[#fe6a34] text-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Play className="w-3.5 h-3.5 fill-white text-white" />
                      </div>
                    );
                  } else if (isCompleted) {
                    actionIcon = <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-50" />;
                  } else {
                    actionIcon = (
                      <div className="p-2 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center group-hover:bg-[#fe6a34] group-hover:text-white transition-colors">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    );
                  }

                  return (
                    <div
                      key={chapter.id}
                      onClick={() => {
                        setSelectedChapter(chapter);
                        setActiveTab('book');
                        setQuizState(null);
                        setSimulatedPage(1);
                      }}
                      className={`group bg-white border ${cardBorderClass} rounded-2xl overflow-hidden shadow-3xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer`}
                    >
                      {/* Card Cover Visual Area */}
                      <div className="relative h-44 w-full bg-slate-900 overflow-hidden border-b border-slate-100 shrink-0">
                        {renderChapterGraphic(subject, chapter.number, classLevel)}
                        
                        {/* Rating pill top-left */}
                        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                          <span className="text-[10px] font-bold text-white font-mono leading-none">
                            {(5.0 - (chapter.number % 3) * 0.1).toFixed(1)}
                          </span>
                        </div>

                        {/* HIGH FIDELITY UNLOCKED BADGES */}
                        <div className="absolute top-3 right-3">
                          {isCompleted ? (
                            <span className="bg-emerald-50/90 text-emerald-700 border border-emerald-200/40 backdrop-blur-md text-[9px] font-black px-2.5 py-1 rounded-full uppercase font-mono shadow-xs">
                              COMPLETED
                            </span>
                          ) : inProgress ? (
                            <span className="bg-[#fe6a34]/90 text-white border border-[#fe6a34]/30 backdrop-blur-md text-[9px] font-black px-2.5 py-1 rounded-full uppercase font-mono shadow-xs animate-pulse">
                              IN PROGRESS
                            </span>
                          ) : (
                            <span className="bg-blue-50/90 text-blue-700 border border-blue-200/40 backdrop-blur-md text-[9px] font-black px-2.5 py-1 rounded-full uppercase font-mono shadow-xs">
                              UNLOCKED
                            </span>
                          )}
                        </div>

                        {/* YOUTUBE ANIMATED VIDEO BADGE */}
                        {(chapter.youtubeVideoUrl || bookDetails?.youtubeVideoUrl) && (
                          <div className="absolute bottom-3 left-3 bg-red-600/90 text-white backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/20 shadow-md">
                            <Play className="w-3 h-3 fill-white text-white shrink-0" />
                            <span className="text-[9px] font-black font-mono uppercase tracking-wider">
                              Animated Video
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card Content Block */}
                      <div className={`p-5 flex-1 flex flex-col justify-between gap-4 ${leftBorderIndicator}`}>
                        <div className="space-y-1.5">
                          <span className="block text-[10px] font-black uppercase tracking-widest text-[#fe6a34] font-mono">
                            CHAPTER {chapter.number.toString().padStart(2, '0')}
                          </span>
                          <h4 className="text-sm font-extrabold text-[#001736] leading-snug group-hover:text-[#fe6a34] transition-colors line-clamp-2">
                            {chapter.title}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-bold font-mono">
                            {chapter.topics.length} Syllabus Topics • {Math.max(1, Math.round(chapter.topics.length / 3))} Labs
                          </span>
                        </div>

                        {/* Footer details */}
                        <div className="flex items-center justify-between border-t border-slate-50 pt-3.5">
                          <div className="flex items-center gap-3 text-xs text-slate-500 font-mono font-bold">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{bookDetails.readTimeMins}m read</span>
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-slate-400" />
                              <span>{estimatedPages} Pages</span>
                            </span>
                          </div>
                          
                          {actionIcon}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ==================== LIST VIEW (ALL UNLOCKED) ==================== */
              <div className="space-y-3">
                {filteredChapters.map((chapter) => {
                  const bookDetails = getChapterDetails(chapter.id, chapter.title, subject);
                  const estimatedPages = Math.round(bookDetails.readTimeMins * 1.5 + 10);
                  const isCompleted = completedChapters.includes(chapter.id);
                  const inProgress = chapter.number === 3;

                  let rowBorderClass = 'border-slate-200/80 hover:border-slate-300';
                  let leftIndicatorClass = '';

                  if (inProgress) {
                    rowBorderClass = 'border-[#fe6a34]/30 bg-orange-50/5 hover:border-[#fe6a34]/50';
                    leftIndicatorClass = 'border-l-4 border-l-[#fe6a34] pl-3.5';
                  }

                  return (
                    <div
                      key={chapter.id}
                      onClick={() => {
                        setSelectedChapter(chapter);
                        setActiveTab('book');
                        setQuizState(null);
                        setSimulatedPage(1);
                      }}
                      className={`group bg-white border ${rowBorderClass} rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-3xs hover:shadow-xs transition-all cursor-pointer ${leftIndicatorClass}`}
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        {/* Miniature thumbnail */}
                        <div className="w-16 h-12 bg-slate-900 rounded-xl overflow-hidden border border-slate-100 shrink-0 hidden sm:block">
                          {renderChapterGraphic(subject, chapter.number, classLevel)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase text-[#fe6a34] tracking-widest font-mono">
                              CHAPTER {chapter.number.toString().padStart(2, '0')}
                            </span>
                            
                            {isCompleted ? (
                              <span className="bg-emerald-50 text-emerald-600 text-[8px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 font-mono">
                                COMPLETED
                              </span>
                            ) : inProgress ? (
                              <span className="bg-orange-50 text-[#fe6a34] text-[8px] font-bold px-2 py-0.5 rounded-full border border-orange-100 font-mono animate-pulse">
                                IN PROGRESS
                              </span>
                            ) : (
                              <span className="bg-blue-50 text-blue-600 text-[8px] font-bold px-2 py-0.5 rounded-full border border-blue-100 font-mono">
                                UNLOCKED
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs sm:text-sm font-extrabold text-[#001736] group-hover:text-[#fe6a34] transition-colors line-clamp-1">
                            {chapter.title}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-50">
                        <div className="flex items-center gap-4 text-xs text-slate-500 font-mono font-bold">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{bookDetails.readTimeMins} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            <span>{estimatedPages} Pages</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                            <span className="text-[#001736] font-bold">
                              {(5.0 - (chapter.number % 3) * 0.1).toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <button className="bg-slate-50 group-hover:bg-[#fe6a34] text-slate-600 group-hover:text-white p-2.5 rounded-xl transition-all cursor-pointer">
                          {inProgress ? <Play className="w-3.5 h-3.5 fill-current" /> : <ArrowRight className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      ) : (
        /* ==================== REDESIGNED CHAPTER DETAIL PAGE (PIXEL MATCH REFERENCE) ==================== */
        <div className="space-y-8 animate-fade-in font-sans">
          
          {/* BACK TO BOOKSHELF BUTTON BAR */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => {
                setSelectedChapter(null);
                setQuizState(null);
              }}
              className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-700 hover:text-slate-900 transition-all cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-3xs hover:shadow-2xs"
              id="btn_back_to_bookshelf"
            >
              <ChevronLeft className="w-4 h-4 text-slate-500" />
              <span>← Back to My Library</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-slate-200/80 text-slate-700 px-3 py-1 rounded-full border border-slate-300/50">
                {subject} • Class {classLevel} NCERT
              </span>
            </div>
          </div>

          {/* 1. CHAPTER HEADER SECTION (REFERENCE IMAGE MATCH) */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-white/40 p-4 sm:p-6 rounded-3xl">
            {/* 3D Textbook Cover Graphic (Left) */}
            <div className="w-36 sm:w-44 h-52 sm:h-64 rounded-r-2xl rounded-l-md overflow-hidden shadow-2xl border-2 border-slate-200/80 shrink-0 relative transform hover:scale-[1.02] transition-transform duration-300 bg-white">
              {renderChapterGraphic(subject, selectedChapter.number, classLevel)}
            </div>

            {/* Metadata & Title (Right) */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <span className="bg-slate-200/80 text-slate-700 text-xs px-3.5 py-1 rounded-full font-bold">
                  {subject}
                </span>
                <span className="bg-slate-200/80 text-slate-700 text-xs px-3.5 py-1 rounded-full font-bold">
                  Class {classLevel}
                </span>
                <span className="bg-amber-100 text-amber-700 text-xs px-3.5 py-1 rounded-full font-bold">
                  Difficulty: {details?.difficultyStars && details.difficultyStars > 3 ? 'Advanced' : 'Medium'}
                </span>
              </div>

              {/* Big Chapter Title */}
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
                {selectedChapter.title}
              </h1>
            </div>
          </div>

          {/* MAIN DETAIL GRID (Desktop: 8 cols Left, 4 cols Right Sidebar) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ==================== LEFT COLUMN: MAIN CONTENT (8 cols) ==================== */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* 2. WATCH VIDEO LESSON CARD */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 font-sans">Watch Video Lesson</h3>
                  
                  <button
                    onClick={() => {
                      const videoUrl = details?.youtubeVideoUrl || selectedChapter.youtubeVideoUrl;
                      const embedId = extractYouTubeId(videoUrl);
                      if (embedId) {
                        handleOpenVideo(selectedChapter.title, videoUrl!, selectedChapter.id, details?.nodes3D);
                      }
                    }}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl transition-all"
                    id="btn_theater_mode"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Theater Mode</span>
                  </button>
                </div>

                {/* Video Player Area */}
                {(() => {
                  const videoUrl = details?.youtubeVideoUrl || selectedChapter.youtubeVideoUrl;
                  const embedId = extractYouTubeId(videoUrl);

                  if (embedId) {
                    return (
                      <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black relative shadow-md group">
                        <iframe
                          src={`https://www.youtube.com/embed/${embedId}?autoplay=0&rel=0`}
                          title={selectedChapter.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      </div>
                    );
                  }

                  return (
                    <div className="w-full aspect-video rounded-2xl bg-slate-300/80 flex flex-col items-center justify-center p-6 text-center space-y-3 relative overflow-hidden">
                      <button
                        onClick={() => onExploreIn3D(selectedChapter.title, details?.nodes3D || ['Concept'])}
                        className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 transform hover:scale-110 transition-transform cursor-pointer"
                        title="Play interactive 3D model"
                      >
                        <Play className="w-7 h-7 fill-white translate-x-0.5" />
                      </button>
                      <p className="text-xs font-bold text-slate-600">Video lesson coming soon for this chapter</p>
                    </div>
                  );
                })()}
              </div>

              {/* 4. COMPLETE CHAPTER PDF CARD */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-6">
                {/* Left PDF Visual */}
                <div className="w-28 h-36 bg-slate-100 rounded-2xl border border-slate-200 shrink-0 flex flex-col items-center justify-center p-3 text-slate-400 relative shadow-xs">
                  <div className="w-12 h-14 bg-slate-200/80 rounded-lg border border-slate-300 flex flex-col justify-between p-1.5">
                    <div className="w-6 h-1 bg-slate-400 rounded-full" />
                    <div className="w-8 h-1 bg-slate-300 rounded-full" />
                    <div className="w-7 h-1 bg-slate-300 rounded-full" />
                    <div className="w-4 h-4 bg-slate-300 rounded mx-auto flex items-center justify-center text-[7px] font-bold text-slate-600">
                      PDF
                    </div>
                  </div>
                </div>

                {/* Right Info & Actions */}
                <div className="flex-1 space-y-3 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-slate-900">Complete Chapter PDF</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xl font-medium">
                    Master the theoretical foundations with our comprehensive, AR-linked textbook chapter. Includes exclusive diagrams and interactive scan points.
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                    {selectedChapter.pdfUrl ? (
                      <a
                        href={selectedChapter.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#0a192f] hover:bg-[#112240] text-white px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                        id={`btn_complete_pdf_${selectedChapter.id}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open Full PDF</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => setActiveTab('book')}
                        className="bg-[#0a192f] hover:bg-[#112240] text-white px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                        id={`btn_complete_pdf_${selectedChapter.id}`}
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Open Digital Book</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (selectedChapter.pdfUrl) {
                          window.open(selectedChapter.pdfUrl, '_blank');
                        } else {
                          setActiveTab('book');
                        }
                      }}
                      className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                      id="btn_download_offline"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Offline</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 5. SHORT NOTES & LEARNING CONTENT CARD */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
                {/* TAB BAR HEADER */}
                <div className="border-b border-slate-100 flex flex-wrap gap-6 text-sm font-bold pb-2">
                  <button
                    onClick={() => { setActiveTab('notes'); setQuizState(null); }}
                    className={`pb-2 transition-all cursor-pointer ${
                      activeTab === 'notes' && !quizState?.isActive
                        ? 'border-b-2 border-orange-500 text-slate-900 font-extrabold'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    id="tab_btn_notes"
                  >
                    Short Notes
                  </button>

                  <button
                    onClick={() => { setActiveTab('formulas'); setQuizState(null); }}
                    className={`pb-2 transition-all cursor-pointer ${
                      activeTab === 'formulas' && !quizState?.isActive
                        ? 'border-b-2 border-orange-500 text-slate-900 font-extrabold'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    id="tab_btn_formulas"
                  >
                    Formula Sheet
                  </button>

                  <button
                    onClick={() => { setActiveTab('concepts'); setQuizState(null); }}
                    className={`pb-2 transition-all cursor-pointer ${
                      activeTab === 'concepts' && !quizState?.isActive
                        ? 'border-b-2 border-orange-500 text-slate-900 font-extrabold'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    id="tab_btn_concepts"
                  >
                    Key Concepts
                  </button>

                  <button
                    onClick={() => { setActiveTab('diagrams'); setQuizState(null); }}
                    className={`pb-2 transition-all cursor-pointer ${
                      activeTab === 'diagrams' && !quizState?.isActive
                        ? 'border-b-2 border-orange-500 text-slate-900 font-extrabold'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    id="tab_btn_diagrams"
                  >
                    Diagrams
                  </button>

                  <button
                    onClick={() => { setActiveTab('objectives'); setQuizState(null); }}
                    className={`pb-2 transition-all cursor-pointer ${
                      activeTab === 'objectives' && !quizState?.isActive
                        ? 'border-b-2 border-orange-500 text-slate-900 font-extrabold'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    id="tab_btn_objectives"
                  >
                    Objectives
                  </button>

                  <button
                    onClick={() => { setActiveTab('book'); setQuizState(null); }}
                    className={`pb-2 transition-all cursor-pointer ${
                      activeTab === 'book' && !quizState?.isActive
                        ? 'border-b-2 border-orange-500 text-slate-900 font-extrabold'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    id="tab_btn_book"
                  >
                    Digital PDF & Import
                  </button>
                </div>

                {/* DYNAMIC TAB BODY */}
                <div className="pt-2">
                  {quizState?.isActive ? (
                    /* ==================== ACTIVE QUIZ VIEW ==================== */
                    <div className="space-y-6">
                      {quizState.currentQuestionIdx >= (details?.quiz.length || 0) ? (
                        /* QUIZ RESULTS */
                        <div className="text-center space-y-4 py-6 animate-fade-in">
                          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                            <Award className="w-8 h-8 text-emerald-600 animate-bounce" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-900">Assessment Completed!</h3>
                            <p className="text-xs text-slate-500">Practice session for "{selectedChapter.title}"</p>
                          </div>

                          <div className="bg-slate-50 max-w-sm mx-auto p-4 rounded-xl border border-slate-200 space-y-3">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-500">Final Score:</span>
                              <span className="text-slate-900 font-mono text-sm">
                                {quizState.score} / {details?.quiz.length}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-500">Accuracy Rate:</span>
                              <span className="text-amber-600 font-mono text-sm">
                                {Math.round((quizState.score / (details?.quiz.length || 1)) * 100)}%
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-center gap-3 pt-2">
                            <button
                              onClick={handleStartQuiz}
                              className="bg-[#0a192f] hover:bg-[#112240] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-3xs"
                            >
                              Restart Quiz
                            </button>
                            <button
                              onClick={() => setQuizState(null)}
                              className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-3xs"
                            >
                              Return to Notes
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* ACTIVE QUESTION PLAYING */
                        <div className="space-y-5 animate-fade-in">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-widest">
                                CBSE Practice Quiz
                              </span>
                              <h3 className="text-sm font-extrabold text-slate-900">
                                Question {quizState.currentQuestionIdx + 1} of {details?.quiz.length}
                              </h3>
                            </div>
                            <button 
                              onClick={() => setQuizState(null)}
                              className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                              title="Quit quiz"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-xs font-extrabold text-slate-900 leading-relaxed bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                            {details?.quiz[quizState.currentQuestionIdx].question}
                          </p>

                          <div className="grid grid-cols-1 gap-2.5">
                            {details?.quiz[quizState.currentQuestionIdx].options.map((option, oIdx) => {
                              const isSelected = quizState.selectedOptionIdx === oIdx;
                              const isSubmitted = quizState.isSubmitted;
                              const correctIdx = details?.quiz[quizState.currentQuestionIdx].answerIndex;
                              const isCorrectOption = oIdx === correctIdx;

                              let optionStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';
                              if (isSelected) {
                                optionStyle = 'border-[#0a192f] bg-[#0a192f]/5 text-[#0a192f] ring-2 ring-[#0a192f]/10';
                              }
                              if (isSubmitted) {
                                if (isCorrectOption) {
                                  optionStyle = 'border-emerald-500 bg-emerald-50/50 text-emerald-700 ring-2 ring-emerald-100';
                                } else if (isSelected) {
                                  optionStyle = 'border-red-500 bg-red-50/50 text-red-700 ring-2 ring-red-100';
                                } else {
                                  optionStyle = 'border-slate-200 opacity-50 bg-white';
                                }
                              }

                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleSelectOption(oIdx)}
                                  disabled={isSubmitted}
                                  className={`text-left p-3.5 border rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-3 cursor-pointer ${optionStyle}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                      isSelected 
                                        ? 'bg-[#0a192f] text-white' 
                                        : 'bg-slate-100 text-slate-600'
                                    }`}>
                                      {String.fromCharCode(65 + oIdx)}
                                    </span>
                                    <span>{option}</span>
                                  </div>
                                  {isSubmitted && isCorrectOption && (
                                    <span className="text-xs text-emerald-600 font-extrabold font-mono">CORRECT</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {quizState.isSubmitted && (
                            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1.5 animate-fade-in text-[11px]">
                              <h4 className="font-extrabold text-slate-900 flex items-center gap-1">
                                <Info className="w-3.5 h-3.5 text-amber-600" />
                                <span>Academic Explanation:</span>
                              </h4>
                              <p className="text-slate-600 leading-relaxed font-sans">
                                {details?.quiz[quizState.currentQuestionIdx].explanation}
                              </p>
                            </div>
                          )}

                          <div className="flex justify-end gap-3 pt-2.5 border-t border-slate-100">
                            {!quizState.isSubmitted ? (
                              <button
                                onClick={handleSubmitAnswer}
                                disabled={quizState.selectedOptionIdx === null}
                                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-3xs cursor-pointer flex items-center gap-1"
                              >
                                <span>Submit Answer</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={handleNextQuestion}
                                className="bg-[#0a192f] hover:bg-[#112240] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-3xs cursor-pointer flex items-center gap-1"
                              >
                                <span>
                                  {quizState.currentQuestionIdx + 1 >= (details?.quiz.length || 0) ? 'Finish Quiz' : 'Next Question'}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* ==================== REGULAR TAB CONTENT ==================== */
                    <div className="space-y-4 animate-fade-in">
                      
                      {/* SHORT NOTES TAB (MATCHING REFERENCE IMAGE FORMAT) */}
                      {activeTab === 'notes' && (
                        <div className="space-y-5">
                          <p className="text-xs text-slate-600 leading-relaxed font-medium">
                            Newton's laws of motion are three physical laws that, together, laid the foundation for classical mechanics. They describe the relationship between a body and the forces acting upon it, and its motion in response to those forces.
                          </p>

                          <div className="space-y-4 pt-1">
                            {details?.shortNotes && details.shortNotes.length > 0 ? (
                              details.shortNotes.map((note, idx) => (
                                <div key={idx} className="flex gap-3 items-start">
                                  <span className="text-xs font-mono font-black text-amber-600 shrink-0 mt-0.5">
                                    {(idx + 1).toString().padStart(2, '0')}.
                                  </span>
                                  <p
                                    className="text-xs text-slate-700 leading-relaxed font-medium"
                                    dangerouslySetInnerHTML={{
                                      __html: note.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-bold">$1</strong>')
                                    }}
                                  />
                                </div>
                              ))
                            ) : (
                              <>
                                <div className="flex gap-3 items-start">
                                  <span className="text-xs font-mono font-black text-amber-600 shrink-0 mt-0.5">01.</span>
                                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                    <strong className="text-slate-900 font-bold">First Law (Law of Inertia):</strong> An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.
                                  </p>
                                </div>
                                <div className="flex gap-3 items-start">
                                  <span className="text-xs font-mono font-black text-amber-600 shrink-0 mt-0.5">02.</span>
                                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                    <strong className="text-slate-900 font-bold">Second Law (F=ma):</strong> The acceleration of an object as produced by a net force is directly proportional to the magnitude of the net force.
                                  </p>
                                </div>
                                <div className="flex gap-3 items-start">
                                  <span className="text-xs font-mono font-black text-amber-600 shrink-0 mt-0.5">03.</span>
                                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                    <strong className="text-slate-900 font-bold">Third Law (Action-Reaction):</strong> For every action, there is an equal and opposite reaction.
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* FORMULA TAB */}
                      {activeTab === 'formulas' && details && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-extrabold font-mono uppercase tracking-wider text-amber-600">
                            Important Formula Sheet
                          </h4>
                          <div className="grid grid-cols-1 gap-2.5">
                            {details.formulas.map((form, idx) => (
                              <div key={idx} className="border border-slate-200 rounded-xl bg-slate-50 p-3 flex items-center gap-3">
                                <span className="text-[10px] font-mono font-bold bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded border border-slate-300/50 shrink-0">
                                  EQ {idx + 1}
                                </span>
                                <p className="text-xs font-mono font-extrabold text-slate-900 bg-white p-2 border border-slate-200 rounded flex-1">
                                  {form}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* KEY CONCEPTS TAB */}
                      {activeTab === 'concepts' && details && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-extrabold font-mono uppercase tracking-wider text-amber-600">
                            Key Academic Concepts
                          </h4>
                          <div className="space-y-3">
                            {details.keyConcepts.map((concept, idx) => (
                              <div key={idx} className="border border-slate-200 rounded-2xl p-4 bg-white shadow-3xs hover:border-slate-400 transition-all">
                                <h5 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                  <span>{concept.title}</span>
                                </h5>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed pl-3 font-medium">
                                  {concept.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* DIAGRAMS TAB */}
                      {activeTab === 'diagrams' && details && (
                        <div className="space-y-4">
                          <h4 className="text-xs font-extrabold font-mono uppercase tracking-wider text-amber-600">
                            Important Curriculum Diagrams
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {details.diagrams.map((diag, idx) => (
                              <div key={idx} className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50 shadow-3xs flex flex-col justify-between">
                                <div className="space-y-1.5">
                                  <div className="border border-slate-200 bg-white rounded-xl aspect-video flex items-center justify-center p-3 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_0.8px,transparent_0.8px)] [background-size:10px_10px] opacity-60" />
                                    <div className="relative text-center p-2">
                                      <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">CBSE DIAGRAM {idx + 1}</span>
                                      <p className="text-xs font-extrabold text-slate-900 mt-2">{diag.title}</p>
                                    </div>
                                  </div>
                                  <h5 className="text-xs font-extrabold text-slate-900 mt-1.5">{diag.title}</h5>
                                  <p className="text-[11px] text-slate-500 leading-normal line-clamp-3">
                                    {diag.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* OBJECTIVES TAB */}
                      {activeTab === 'objectives' && details && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-extrabold font-mono uppercase tracking-wider text-amber-600">
                            Learning Objectives & Outcomes
                          </h4>
                          <div className="space-y-2.5">
                            {details.learningObjectives.map((obj, idx) => (
                              <div key={idx} className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                                  {obj}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* DIGITAL BOOK & UPLOADER TAB */}
                      {activeTab === 'book' && selectedChapter && (
                        <div className="space-y-4">
                          {chapterPdfs[selectedChapter.id] ? (
                            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-[#efebe9] h-[450px] shadow-sm flex flex-col justify-between">
                              <div className="bg-[#0a192f] text-white px-4 py-2.5 flex flex-wrap gap-2 items-center justify-between text-xs font-bold">
                                <div className="flex items-center gap-2 font-mono">
                                  <FileText className="w-4 h-4 text-amber-400" />
                                  <span className="font-extrabold truncate max-w-[200px] sm:max-w-md">
                                    {chapterPdfs[selectedChapter.id].name}
                                  </span>
                                </div>
                                <button 
                                  onClick={() => {
                                    try { URL.revokeObjectURL(chapterPdfs[selectedChapter.id].url); } catch(e){}
                                    setChapterPdfs(prev => {
                                      const copy = { ...prev };
                                      delete copy[selectedChapter.id];
                                      return copy;
                                    });
                                  }}
                                  className="text-red-300 hover:text-red-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Reset to Standard PDF</span>
                                </button>
                              </div>

                              <div className="flex-1 bg-white relative flex items-center justify-center overflow-auto p-4 min-h-0">
                                {chapterPdfs[selectedChapter.id].type?.startsWith('image/') ? (
                                  <img 
                                    src={chapterPdfs[selectedChapter.id].url} 
                                    alt={chapterPdfs[selectedChapter.id].name}
                                    className="max-w-full max-h-full object-contain rounded-lg border border-slate-200 shadow-xs"
                                  />
                                ) : (
                                  <div className="text-center space-y-3">
                                    <FileText className="w-12 h-12 text-slate-400 mx-auto" />
                                    <h4 className="text-xs font-bold text-slate-800">PDF Loaded Successfully</h4>
                                    <a
                                      href={chapterPdfs[selectedChapter.id].url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-block bg-[#0a192f] text-white text-xs font-bold px-4 py-2 rounded-xl"
                                    >
                                      Open PDF in New Window
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-6 text-center space-y-3">
                              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                              <div>
                                <h4 className="text-xs font-bold text-slate-800">Import Custom Chapter PDF or Image</h4>
                                <p className="text-[11px] text-slate-500">Drag and drop your chapter file here to study with AI Tutor</p>
                              </div>
                              <label className="inline-flex items-center gap-1.5 bg-[#0a192f] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer shadow-3xs">
                                <span>Select PDF / Image</span>
                                <input 
                                  type="file" 
                                  accept="application/pdf,image/*" 
                                  className="hidden" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileSelection(file);
                                  }}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* ==================== RIGHT COLUMN: AR INTERACTIVITY & SIDEBAR (4 cols) ==================== */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
              
              {/* 3. AR INTERACTIVITY CARD (MATCHING REFERENCE IMAGE) */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Dark Navy Header */}
                <div className="bg-[#0a192f] text-white p-5 space-y-1">
                  <h3 className="text-lg font-bold tracking-tight">AR Interactivity</h3>
                  <p className="text-xs text-slate-300 font-medium">
                    Experience the {subject.toLowerCase()} in real-time
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="p-4 space-y-3">
                  {/* EXPLORE IN 3D HERO BUTTON */}
                  <button
                    onClick={() => onExploreIn3D(selectedChapter.title, details?.nodes3D || ['Concept'])}
                    className="w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-white rounded-2xl p-5 text-center flex flex-col items-center justify-center space-y-1 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
                    id="btn_explore_3d_chapter"
                  >
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs mb-1">
                      <Compass className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-base font-extrabold tracking-wide">Explore in 3D</span>
                    <span className="text-[9px] font-mono tracking-widest text-white/90 uppercase font-extrabold">
                      AUGMENTED REALITY ENABLED
                    </span>
                  </button>

                  {/* ASK AI TUTOR BUTTON */}
                  <button
                    onClick={() => onAskAI(selectedChapter.title)}
                    className="w-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-3xs cursor-pointer transition-all"
                    id="btn_ask_ai_chapter"
                  >
                    <Brain className="w-4 h-4 text-slate-600" />
                    <span>Ask AI Tutor</span>
                  </button>

                  {/* PRACTICE QUIZ BUTTON */}
                  <button
                    onClick={handleStartQuiz}
                    className="w-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-3xs cursor-pointer transition-all"
                    id="btn_practice_quiz_chapter"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-600" />
                    <span>Practice Quiz</span>
                  </button>

                  {/* MARK AS COMPLETE BUTTON */}
                  <button
                    onClick={() => toggleChapterCompletion(selectedChapter.id)}
                    className={`w-full font-bold p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md cursor-pointer transition-all ${
                      completedChapters.includes(selectedChapter.id)
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-[#0a192f] hover:bg-[#112240] text-white'
                    }`}
                    id={`btn_complete_chapter_${selectedChapter.id}`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{completedChapters.includes(selectedChapter.id) ? 'Marked as Complete ✓' : 'Mark as Complete'}</span>
                  </button>
                </div>
              </div>

              {/* 6. CHAPTER PROGRESS CARD (MATCHING REFERENCE IMAGE) */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span className="uppercase tracking-wider font-mono text-[10px]">CHAPTER PROGRESS</span>
                  <span>{completedCount} / {chapters.length} Lessons</span>
                </div>

                <div className="text-2xl font-black text-slate-900 font-mono">
                  {completionPercent}%
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-orange-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>

              {/* 7. UP NEXT CARD (MATCHING REFERENCE IMAGE) */}
              {(() => {
                const nextChapter = chapters.find(c => c.number === selectedChapter.number + 1);
                if (!nextChapter) return null;

                return (
                  <div className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/60 space-y-3">
                    <h4 className="text-sm font-bold text-slate-800">Up Next</h4>

                    <div
                      onClick={() => {
                        setSelectedChapter(nextChapter);
                        setActiveTab('notes');
                        setQuizState(null);
                        setSimulatedPage(1);
                      }}
                      className="bg-white rounded-xl p-3 border border-slate-200 flex items-center gap-3 cursor-pointer shadow-xs hover:shadow-sm transition-all"
                      id="btn_open_next_chapter"
                    >
                      <div className="w-10 h-12 bg-slate-100 rounded-lg border border-slate-200 shrink-0 overflow-hidden relative">
                        {renderChapterGraphic(subject, nextChapter.number, classLevel)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 truncate">
                          {nextChapter.number}. {nextChapter.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 font-mono">
                          {details?.readTimeMins || 20} mins • Medium
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

            </div>

          </div>

        </div>
      )}
      {videoViewer && (
        <div className="fixed inset-0 bg-primary/95 backdrop-blur-md z-50 flex flex-col justify-between p-4 sm:p-6 animate-fade-in font-sans">
          {/* Top Control Bar */}
          <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-4 border-b border-white/10 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 border border-red-500/30 shrink-0">
                <Play className="w-5 h-5 fill-red-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest bg-red-950/80 border border-red-500/30 px-2 py-0.5 rounded">
                    Animated Educational Video Lesson
                  </span>
                  <span className="text-[10px] font-bold text-white/60">
                    {subject} • Class {classLevel}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                  {videoViewer.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://www.youtube.com/watch?v=${videoViewer.embedId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                id="btn_open_external_youtube"
              >
                <span>Watch on YouTube ↗</span>
              </a>

              <button
                onClick={() => setVideoViewer(null)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                id="btn_close_video_modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Responsive YouTube Embed Container */}
          <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col items-center justify-center py-4">
            <div className="w-full aspect-video max-h-[72vh] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black relative">
              <iframe
                src={`https://www.youtube.com/embed/${videoViewer.embedId}?autoplay=1&rel=0`}
                title={videoViewer.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          {/* Bottom Control Bar */}
          <div className="max-w-6xl mx-auto w-full flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 shrink-0">
            <div className="text-xs text-white/70">
              <span className="text-white font-bold">{videoViewer.title}</span> • Official YouTube Embedded Player
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              {videoViewer.nodes3D && videoViewer.nodes3D.length > 0 && (
                <button
                  onClick={() => {
                    const title = videoViewer.title;
                    const nodes = videoViewer.nodes3D!;
                    setVideoViewer(null);
                    onExploreIn3D(title, nodes);
                  }}
                  className="bg-primary-light hover:bg-primary-light/80 border border-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                  id="btn_switch_to_3d_from_video"
                >
                  <Compass className="w-4 h-4 text-secondary" />
                  <span>Launch 3D Model Explorer</span>
                </button>
              )}

              <button
                onClick={() => {
                  const title = videoViewer.title;
                  setVideoViewer(null);
                  onAskAI(title);
                }}
                className="bg-secondary hover:bg-secondary-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                id="btn_ask_ai_from_video"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Ask AI Tutor About Video</span>
              </button>

              <button
                onClick={() => setVideoViewer(null)}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
