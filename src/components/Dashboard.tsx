import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Camera, 
  Sparkles, 
  BookOpen, 
  Settings, 
  LogOut, 
  HelpCircle, 
  Search, 
  GraduationCap, 
  TrendingUp, 
  Clock, 
  Award, 
  ChevronRight, 
  ChevronLeft,
  Book,
  Grid,
  Check,
  Loader2,
  BookMarked,
  Plus,
  Trash2,
  RotateCcw, 
  X,
  List,
  ShieldCheck,
  Brain,
  Layers,
  Trophy,
  Flame
} from 'lucide-react';
import { ClassLevel, SubjectName, StudyTask, Model3D, ChatMessage } from '../types';
import { NCERT_BOOKS, NcertChapter, NcertBook } from '../ncertData';
import Interactive3DViewer from './Interactive3DViewer';
import TaskPlanner from './TaskPlanner';
import ScanLearn from './ScanLearn';
import AITutor from './AITutor';
import Textbook2DReader from './Textbook2DReader';
import Bookshelf from './Bookshelf';
import AdminPanel from './AdminPanel';
import AIQuizGenerator from './AIQuizGenerator';
import AIFlashcards from './AIFlashcards';
import Leaderboard from './Leaderboard';

interface DashboardProps {
  userName: string;
  userEmail: string;
  classLevel: ClassLevel;
  onLogout: () => void;
  tasks: StudyTask[];
  onSaveTasks?: (newTasks: StudyTask[]) => void;
  onSaveModels?: (newModels: Model3D[]) => void;
  onAddTask: (title: string, description: string, type: StudyTask['type'], subjectOverride?: SubjectName, classOverride?: ClassLevel) => void;
  onImportChapterPlanner?: (
    chapterTitle: string,
    tasksToImport: Array<{ title: string; description: string; type: StudyTask['type'] }>,
    subject: SubjectName,
    grade: ClassLevel,
    replaceExisting: boolean
  ) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateStudyTime: (seconds: number) => void;
  totalStudyTime: number;
  models: Model3D[];
  onMasterModel: (id: string) => void;
  onAddScannedModel: (model: any) => void;
  chatHistory: ChatMessage[];
  onSendChatMessage: (
    text: string, 
    subjectOverride?: SubjectName, 
    classOverride?: ClassLevel, 
    currentTopic?: string,
    attachedFile?: { name: string; mimeType: string; base64: string }
  ) => Promise<void>;
  onImportTutorTasks: (tasks: Array<{ title: string; description: string }>) => void;
  onClearChat?: () => void;
  onRegenerateResponse?: () => void;
}

export default function Dashboard({
  userName,
  userEmail,
  classLevel,
  onLogout,
  tasks,
  onSaveTasks,
  onSaveModels,
  onAddTask,
  onImportChapterPlanner,
  onToggleTask,
  onDeleteTask,
  onUpdateStudyTime,
  totalStudyTime,
  models,
  onMasterModel,
  onAddScannedModel,
  chatHistory,
  onSendChatMessage,
  onImportTutorTasks,
  onClearChat,
  onRegenerateResponse,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'library' | 'scan' | 'tutor' | 'planner' | 'settings' | 'admin' | 'quiz' | 'flashcards' | 'leaderboard'>('overview');
  
  // Calculate dynamic XP and Level
  const totalCompletedTasks = tasks.filter(t => t.completed).length;
  const totalMasteredModels = models.filter(m => m.mastered).length;
  const userXP = 120 + (totalCompletedTasks * 50) + (totalMasteredModels * 75) + Math.floor((totalStudyTime / 600) * 30);
  const userLevel = Math.floor(userXP / 200) + 1;
  const [selectedSubject, setSelectedSubject] = useState<SubjectName | null>(null);
  const [activeModelId, setActiveModelId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAttachment, setActiveAttachment] = useState<{ name: string; mimeType: string; base64: string } | null>(null);

  // Interactive Cursor Position State for Welcome Banner Particles
  const [bannerMousePos, setBannerMousePos] = useState({ x: 0, y: 0 });

  const handleBannerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const mouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setBannerMousePos({ x: mouseX, y: mouseY });
  };

  const handleBannerMouseLeave = () => {
    setBannerMousePos({ x: 0, y: 0 });
  };

  // CBSE NCERT Chapter & Topic states
  const [booksData, setBooksData] = useState<Record<ClassLevel, Record<SubjectName, NcertBook>>>(() => {
    const saved = localStorage.getItem('cbse_custom_books');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse custom books", e);
      }
    }
    return NCERT_BOOKS;
  });

  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);
  const [active2DChapter, setActive2DChapter] = useState<NcertChapter | null>(null);
  const [isGenerating3D, setIsGenerating3D] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState('');
  const [lastGeneratedTopic, setLastGeneratedTopic] = useState<string | null>(null);
  const [libraryViewState, setLibraryViewState] = useState<'bookshelf' | 'viewer'>('bookshelf');
  const [selected3DNode, setSelected3DNode] = useState<string | null>(null);

  // States for adding custom chapters/topics
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterNumber, setNewChapterNumber] = useState('');
  const [addingTopicChapterId, setAddingTopicChapterId] = useState<string | null>(null);
  const [newTopicName, setNewTopicName] = useState('');

  // Save utility
  const saveBooksData = (newData: Record<ClassLevel, Record<SubjectName, NcertBook>>) => {
    setBooksData(newData);
    localStorage.setItem('cbse_custom_books', JSON.stringify(newData));
  };

  const handleAddChapter = () => {
    if (!selectedSubject || !newChapterTitle.trim()) return;
    const num = parseInt(newChapterNumber) || 1;
    const newChap: NcertChapter = {
      id: `custom_chap_${Date.now()}`,
      number: num,
      title: newChapterTitle.trim(),
      topics: [],
    };

    const updated = { ...booksData };
    if (!updated[classLevel]) updated[classLevel] = {} as any;
    if (!updated[classLevel][selectedSubject]) {
      updated[classLevel][selectedSubject] = {
        title: `Science - Class ${classLevel} (${selectedSubject})`,
        publisher: 'CBSE Custom',
        chapters: [],
      };
    }

    updated[classLevel][selectedSubject].chapters.push(newChap);
    // Sort chapters by chapter number
    updated[classLevel][selectedSubject].chapters.sort((a, b) => a.number - b.number);

    saveBooksData(updated);
    setNewChapterTitle('');
    setNewChapterNumber('');
    setIsAddingChapter(false);
    setExpandedChapterId(newChap.id);
  };

  const handleAddTopicToChapter = (chapterId: string) => {
    if (!selectedSubject || !newTopicName.trim()) return;
    
    const updated = { ...booksData };
    const chapters = updated[classLevel]?.[selectedSubject]?.chapters || [];
    const targetChap = chapters.find(c => c.id === chapterId);
    
    if (targetChap) {
      if (!targetChap.topics.includes(newTopicName.trim())) {
        targetChap.topics.push(newTopicName.trim());
        saveBooksData(updated);
      }
    }
    setNewTopicName('');
    setAddingTopicChapterId(null);
  };

  const handleDeleteTopicFromChapter = (chapterId: string, topicIndex: number) => {
    if (!selectedSubject) return;
    const updated = { ...booksData };
    const chapters = updated[classLevel]?.[selectedSubject]?.chapters || [];
    const targetChap = chapters.find(c => c.id === chapterId);
    
    if (targetChap) {
      targetChap.topics.splice(topicIndex, 1);
      saveBooksData(updated);
    }
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (!selectedSubject) return;
    const updated = { ...booksData };
    const book = updated[classLevel]?.[selectedSubject];
    if (book) {
      book.chapters = book.chapters.filter(c => c.id !== chapterId);
      saveBooksData(updated);
    }
  };

  const handleResetToStandardCurriculum = () => {
    if (window.confirm("Are you sure you want to restore the standard CBSE NCERT textbook syllabus? This will discard your custom chapters and topics.")) {
      saveBooksData(NCERT_BOOKS);
    }
  };

  const handleSearchSubmit = () => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return;

    // 1. Search currently selected subject chapters first
    if (selectedSubject) {
      const currentBook = booksData[classLevel]?.[selectedSubject];
      if (currentBook) {
        const match = currentBook.chapters.find(ch => 
          ch.title.toLowerCase().includes(term) ||
          ch.topics.some(t => t.toLowerCase().includes(term))
        );
        if (match) {
          setExpandedChapterId(match.id);
          if (activeTab !== 'library') {
            setActiveTab('library');
          }
          return;
        }
      }
    }

    // 2. Search across ALL subjects for a matching chapter/topic
    for (const sub of subjects) {
      const book = booksData[classLevel]?.[sub];
      if (book) {
        const match = book.chapters.find(ch => 
          ch.title.toLowerCase().includes(term) ||
          ch.topics.some(t => t.toLowerCase().includes(term))
        );
        if (match) {
          setSelectedSubject(sub);
          setExpandedChapterId(match.id);
          setActiveTab('library');
          return;
        }
      }
    }

    // 3. Search across all interactive 3D models
    const matchingModel = models.find(m => 
      m.classLevel === classLevel &&
      (m.name.toLowerCase().includes(term) || m.category.toLowerCase().includes(term))
    );
    if (matchingModel) {
      setSelectedSubject(matchingModel.subject);
      setActiveModelId(matchingModel.id);
      setActiveTab('library');
      return;
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Auto-select newly generated 3D models
  useEffect(() => {
    if (lastGeneratedTopic && !isGenerating3D) {
      const match = models.find(
        m => m.name.toLowerCase() === lastGeneratedTopic.toLowerCase() &&
             m.subject === (selectedSubject || 'Biology') &&
             m.classLevel === classLevel
      );
      if (match) {
        setActiveModelId(match.id);
        setLastGeneratedTopic(null);
      }
    }
  }, [models, lastGeneratedTopic, isGenerating3D, selectedSubject, classLevel]);

  // Define subjects
  const subjects: SubjectName[] = ['Biology', 'Physics', 'Chemistry', 'Mathematics'];

  // Handle subject selection
  const handleSelectSubject = (subject: SubjectName) => {
    setSelectedSubject(subject);
    setLibraryViewState('bookshelf');
    setSelected3DNode(null);
    // Expand the first chapter of the new book by default
    const matchingBook = booksData[classLevel]?.[subject];
    if (matchingBook && matchingBook.chapters.length > 0) {
      setExpandedChapterId(matchingBook.chapters[0].id);
    } else {
      setExpandedChapterId(null);
    }
    
    // Find the first model in this subject to make it active in library
    const subjectModels = models.filter(m => m.subject === subject && m.classLevel === classLevel);
    if (subjectModels.length > 0) {
      setActiveModelId(subjectModels[0].id);
    } else {
      setActiveModelId(null);
    }
  };

  const handleGenerateModelForTopic = async (topicName: string, chapterTitle: string) => {
    // Check if model already exists
    const existingModel = models.find(
      m => m.name.toLowerCase() === topicName.toLowerCase() && 
           m.subject === (selectedSubject || 'Biology') &&
           m.classLevel === classLevel
    );

    if (existingModel) {
      setActiveModelId(existingModel.id);
      return;
    }

    // Start loading & API generation
    setIsGenerating3D(true);
    setGenerationProgress(5);
    setGenerationStatus('Connecting to Gemini AI...');
    setLastGeneratedTopic(topicName);

    const progressInterval = setInterval(() => {
      setGenerationProgress(p => {
        if (p >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return p + Math.floor(Math.random() * 8) + 3;
      });
    }, 2000);

    const statusUpdates = [
      'Reading NCERT syllabus chapter context...',
      'Structuring 3D nodes & visual boundaries...',
      'Synthesizing interactive double-tap annotations...',
      'Generating study checklist recommended by CBSE...'
    ];

    let currentStatusIndex = 0;
    const statusInterval = setInterval(() => {
      if (currentStatusIndex < statusUpdates.length) {
        setGenerationStatus(statusUpdates[currentStatusIndex]);
        currentStatusIndex++;
      }
    }, 2200);

    try {
      const response = await fetch('/api/scan/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageDescription: `Detailed 3D structure, labels, components, and educational explanation of: "${topicName}" from NCERT Chapter: "${chapterTitle}" in ${selectedSubject} for Class ${classLevel} of CBSE curriculum.`,
          selectedClass: classLevel,
          selectedSubject: selectedSubject || 'Biology',
        }),
      });

      const data = await response.json();
      
      clearInterval(progressInterval);
      clearInterval(statusInterval);
      setGenerationProgress(100);
      setGenerationStatus('Rendering 3D model vertices...');

      setTimeout(() => {
        const enrichedModel = {
          ...data.model,
          subject: selectedSubject || 'Biology',
          category: chapterTitle,
        };
        
        onAddScannedModel(enrichedModel);
        setIsGenerating3D(false);
        setGenerationProgress(0);
        setGenerationStatus('');
      }, 1000);

    } catch (e) {
      console.error("Failed to generate model:", e);
      clearInterval(progressInterval);
      clearInterval(statusInterval);
      setIsGenerating3D(false);
      alert("Model generation failed. Please check your internet connection and verify your API key.");
    }
  };

  // Switch classLevel helper (simulated inside settings tab)
  const [currentClass, setCurrentClass] = useState<ClassLevel>(classLevel);

  // Statistics calculation that is actively run!
  // Mapped on the current selected subject + classLevel, or global averages if no subject is selected
  const activeSubjectTasks = tasks.filter(
    t => (selectedSubject ? t.subject === selectedSubject : true) && t.classLevel === classLevel
  );

  const completedTasksCount = activeSubjectTasks.filter(t => t.completed).length;
  const totalTasksCount = activeSubjectTasks.length;
  const rawPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
  
  // Actively running progress completion rate
  const completionRate = selectedSubject ? rawPercentage : 78; // 78 is average across all

  const studyTimeHours = selectedSubject 
    ? (totalStudyTime / 3600).toFixed(2)
    : (120 + totalStudyTime / 3600).toFixed(2); // Mock baseline plus actual study timer additions

  const masteredCount = selectedSubject
    ? models.filter(m => m.subject === selectedSubject && m.classLevel === classLevel && m.mastered).length
    : models.filter(m => m.mastered).length + 42; // baseline

  // Filter models based on search query and subject
  const filteredModels = models.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject ? m.subject === selectedSubject : true;
    const matchesClass = m.classLevel === classLevel;
    return matchesSearch && matchesSubject && matchesClass;
  });

  const activeModel = models.find((m) => m.id === activeModelId) || filteredModels[0] || null;

  return (
    <div className="min-h-screen bg-[#fafafc] flex flex-col md:flex-row animate-fade-in font-sans text-primary">
      
      {/* LEFT SIDEBAR - Replicates Image 2 Sidebar */}
      <aside className="w-full md:w-64 border-r border-card-border bg-white p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Platform Name */}
          <div className="flex flex-col gap-1.5 mb-6">
            <img 
              src="/learnflow-logo.png" 
              alt="LearnFlow AR Logo" 
              className="h-10 w-auto object-contain self-start rounded-lg"
              referrerPolicy="no-referrer"
            />
            <span className="text-[10px] font-mono font-bold text-charcoal/40 tracking-wider block uppercase pl-0.5">
              Academic Authority
            </span>
          </div>

          {/* New Scan Orange Button */}
          <button
            onClick={() => {
              if (!selectedSubject) handleSelectSubject('Biology');
              setActiveTab('scan');
            }}
            className="w-full bg-[#fe6a34] hover:bg-secondary-dark text-white font-bold py-3 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm mb-6"
            id="sidebar_btn_new_scan"
          >
            <Camera className="w-4 h-4" />
            <span>New Scan</span>
          </button>

          {/* Main Navigation Menu */}
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-primary/5 text-primary border-l-4 border-primary pl-2'
                  : 'text-charcoal/60 hover:bg-surface-container hover:text-primary'
              }`}
              id="sidebar_nav_overview"
            >
              <Grid className="w-4 h-4 shrink-0" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => {
                if (!selectedSubject) handleSelectSubject('Biology');
                setActiveTab('library');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'library'
                  ? 'bg-primary/5 text-primary border-l-4 border-primary pl-2'
                  : 'text-charcoal/60 hover:bg-surface-container hover:text-primary'
              }`}
              id="sidebar_nav_library"
            >
              <Book className="w-4 h-4 shrink-0" />
              <span>My Library</span>
            </button>

            <button
              onClick={() => {
                if (!selectedSubject) handleSelectSubject('Biology');
                setActiveTab('planner');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'planner'
                  ? 'bg-primary/5 text-primary border-l-4 border-primary pl-2'
                  : 'text-charcoal/60 hover:bg-surface-container hover:text-primary'
              }`}
              id="sidebar_nav_planner"
            >
              <List className="w-4 h-4 shrink-0" />
              <span>Task Planner</span>
            </button>

            <button
              onClick={() => {
                if (!selectedSubject) handleSelectSubject('Biology');
                setActiveTab('scan');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'scan'
                  ? 'bg-primary/5 text-primary border-l-4 border-primary pl-2'
                  : 'text-charcoal/60 hover:bg-surface-container hover:text-primary'
              }`}
              id="sidebar_nav_scan"
            >
              <Camera className="w-4 h-4 shrink-0" />
              <span>Scan & Learn</span>
            </button>

            <button
              onClick={() => {
                if (!selectedSubject) handleSelectSubject('Biology');
                setActiveTab('tutor');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'tutor'
                  ? 'bg-primary/5 text-primary border-l-4 border-primary pl-2'
                  : 'text-charcoal/60 hover:bg-surface-container hover:text-primary'
              }`}
              id="sidebar_nav_tutor"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>AI Tutor</span>
            </button>

            <button
              onClick={() => {
                if (!selectedSubject) handleSelectSubject('Biology');
                setActiveTab('quiz');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-primary/5 text-primary border-l-4 border-primary pl-2'
                  : 'text-charcoal/60 hover:bg-surface-container hover:text-primary'
              }`}
              id="sidebar_nav_quiz"
            >
              <Brain className="w-4 h-4 shrink-0 text-purple-600" />
              <span>AI Quizzes</span>
            </button>

            <button
              onClick={() => {
                if (!selectedSubject) handleSelectSubject('Biology');
                setActiveTab('flashcards');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'flashcards'
                  ? 'bg-primary/5 text-primary border-l-4 border-primary pl-2'
                  : 'text-charcoal/60 hover:bg-surface-container hover:text-primary'
              }`}
              id="sidebar_nav_flashcards"
            >
              <Layers className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Revision Cards</span>
            </button>

            <button
              onClick={() => {
                if (!selectedSubject) handleSelectSubject('Biology');
                setActiveTab('leaderboard');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'leaderboard'
                  ? 'bg-primary/5 text-primary border-l-4 border-primary pl-2'
                  : 'text-charcoal/60 hover:bg-surface-container hover:text-primary'
              }`}
              id="sidebar_nav_leaderboard"
            >
              <Trophy className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-primary/5 text-primary border-l-4 border-primary pl-2'
                  : 'text-charcoal/60 hover:bg-surface-container hover:text-primary'
              }`}
              id="sidebar_nav_settings"
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer mt-2 ${
                activeTab === 'admin'
                  ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 pl-2 font-bold'
                  : 'text-indigo-600/80 hover:bg-indigo-50/50 hover:text-indigo-700'
              }`}
              id="sidebar_nav_admin"
            >
              <ShieldCheck className="w-4 h-4 shrink-0 text-indigo-600" />
              <span className="font-bold">Admin Console</span>
            </button>
          </div>
        </div>

        {/* Bottom utility triggers */}
        <div className="border-t border-card-border pt-4 mt-6 space-y-1">
          <div className="px-3 py-2 text-[10.5px] text-charcoal/40 font-mono leading-relaxed bg-surface-container-low rounded-lg p-2 border mb-2">
            <div>User: {userName}</div>
            <div>Grade: Class {classLevel}</div>
          </div>
          
          <button
            onClick={() => {
              alert("LearnFlow Help Desk: Speak with your course coordinators or check standard curriculum mapping.");
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-charcoal/60 hover:bg-surface-container hover:text-primary cursor-pointer transition-all"
            id="sidebar_btn_help"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help Desk</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer transition-all"
            id="sidebar_btn_logout"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* TOP BAR: Header & Subject Selection */}
        <header className="border-b border-card-border bg-white py-4 px-6 md:px-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sticky top-0 z-10 shadow-3xs">
          
          {/* Welcome academic banner */}
          <div className="flex-1 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-secondary shrink-0" />
            <h1 className="text-sm font-extrabold text-primary">
              Welcome back, <span className="text-secondary">{userName}</span>
            </h1>
          </div>

          {/* Subject Selector & Active Grade details */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-primary font-mono hidden lg:inline uppercase tracking-wider">
              Selected Subject:
            </span>
            <div className="flex bg-surface-container-low p-1 rounded-lg border border-card-border shrink-0">
              {subjects.map((sub) => (
                <button
                  key={sub}
                  onClick={() => handleSelectSubject(sub)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    selectedSubject === sub
                      ? 'bg-[#001736] text-white shadow-xs'
                      : 'text-charcoal/60 hover:text-primary'
                  }`}
                  id={`subject_pill_${sub}`}
                >
                  {sub}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg px-2.5 py-1.5 text-xs font-bold">
              <GraduationCap className="w-4 h-4" />
              <span>{classLevel}</span>
            </div>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className="flex items-center gap-1.5 bg-amber-500/10 text-amber-600 border border-amber-500/30 rounded-lg px-2.5 py-1.5 text-xs font-extrabold font-mono hover:bg-amber-500/20 transition-all cursor-pointer shadow-3xs"
              title="View Leaderboard & Badges"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{userXP} XP (Lvl {userLevel})</span>
            </button>
          </div>

        </header>

        {/* CONTAINER WORKSPACE FOR TABS */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">

          {/* Fallback Screen: Subject NOT Selected Gate */}
          {(!selectedSubject && activeTab !== 'admin' && activeTab !== 'settings' && activeTab !== 'quiz' && activeTab !== 'flashcards' && activeTab !== 'leaderboard') ? (
            <div className="relative rounded-2xl border border-card-border/80 shadow-xl max-w-4xl mx-auto my-6 overflow-hidden bg-white animate-fade-in aspect-[16/9] min-h-[360px] sm:min-h-[440px] md:min-h-[500px] flex items-center justify-center">
              {/* Full Background Image - Contained Aspect Ratio Fit */}
              <img 
                src="/dashboard-welcome-bg.png" 
                alt="Welcome Background Frame" 
                className="absolute inset-0 w-full h-full object-contain object-center pointer-events-none"
              />

              {/* Dedicated Content Area Positioned PRECISELY Inside the White Board Area */}
              <div className="absolute top-[16%] bottom-[16%] left-[22%] right-[20%] z-10 flex flex-col items-center justify-center text-center p-2 sm:p-4 md:p-6 overflow-y-auto">
                <div className="my-auto space-y-2 sm:space-y-3 w-full">
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-secondary mx-auto animate-bounce filter drop-shadow-xs" style={{ animationDuration: '3s' }} />
                  
                  <h2 className="text-sm sm:text-lg md:text-2xl font-extrabold text-[#001736] tracking-tight leading-tight">
                    Welcome to the Academic Excellence Platform
                  </h2>
                  
                  <p className="text-[10px] sm:text-xs md:text-sm text-charcoal/80 font-medium max-w-md mx-auto leading-relaxed">
                    You are registered in <strong className="text-primary font-bold">Class {classLevel}</strong>. Select a subject below to load your curated 3D diagrams, live task checklists, and AI tutor models!
                  </p>

                  <div className="pt-2 sm:pt-3 w-full">
                    <p className="text-[9px] sm:text-[10px] md:text-xs font-extrabold text-primary uppercase tracking-widest font-mono mb-2">
                      Select a core subject to start:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2.5 max-w-md mx-auto">
                      {subjects.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => handleSelectSubject(sub)}
                          className="bg-slate-100/90 hover:bg-secondary/15 hover:border-[#fe6a34] border border-slate-200/90 py-1.5 sm:py-2 px-2.5 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs text-primary shadow-2xs hover:shadow-xs transition-all cursor-pointer transform hover:scale-[1.02] active:scale-95"
                          id={`gateway_pill_${sub}`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ACTIVE WORKSPACE (Visible only when subject is selected) */
            <div className="space-y-8">
              
              {/* TABS SELECTOR LOGIC */}

              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* Top Welcome Banner Card */}
                  <div 
                    onMouseMove={handleBannerMouseMove}
                    onMouseLeave={handleBannerMouseLeave}
                    className="relative text-white border border-primary-light/60 p-6 md:p-10 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 overflow-hidden bg-[#001736] group cursor-default"
                  >
                    {/* Full Edge-to-Edge Background Image Layer */}
                    <img 
                      src="/dashboard-welcome-banner-bg.png" 
                      alt="Welcome Banner Background" 
                      className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-75"
                    />

                    {/* 1. Gentle Flowing Light Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#001736]/90 via-[#002b5b]/60 to-[#004f7a]/40 bg-[length:200%_200%] animate-banner-gradient pointer-events-none" />

                    {/* 2. Abstract Network / Grid Line Pattern Overlay (Parallax Shift on Cursor) */}
                    <div 
                      className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1.2px,transparent_1.2px)] [background-size:24px_24px] animate-banner-grid transition-transform duration-700 ease-out" 
                      style={{ transform: `translate(${bannerMousePos.x * 12}px, ${bannerMousePos.y * 12}px)` }}
                    />

                    {/* 3. Soft Futuristic AI-Learning Glow Orbs (Move with Parallax on Cursor) */}
                    <div 
                      className="absolute -right-16 -top-16 w-96 h-96 bg-cyan-400/25 rounded-full blur-3xl pointer-events-none animate-ai-orb transition-transform duration-500 ease-out"
                      style={{ transform: `translate(${bannerMousePos.x * -30}px, ${bannerMousePos.y * -30}px)` }}
                    />
                    <div 
                      className="absolute right-1/3 -bottom-20 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none animate-particle-active-2 transition-transform duration-700 ease-out"
                      style={{ transform: `translate(${bannerMousePos.x * 35}px, ${bannerMousePos.y * 35}px)` }}
                    />
                    <div 
                      className="absolute left-1/4 -top-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none animate-particle-active-3 transition-transform duration-500 ease-out"
                      style={{ transform: `translate(${bannerMousePos.x * 20}px, ${bannerMousePos.y * 20}px)` }}
                    />

                    {/* 4. Active Glowing Floating Balls / Particles (Cursor Reacting Physics & Continuous Motion) */}
                    {/* Orb 1: Cyan Glowing Ball */}
                    <div 
                      className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(56,189,248,0.9)] pointer-events-none animate-particle-active-1 transition-transform duration-300 ease-out"
                      style={{ transform: `translate(${bannerMousePos.x * 45}px, ${bannerMousePos.y * 45}px)` }}
                    />
                    
                    {/* Orb 2: Teal Glowing Ball */}
                    <div 
                      className="absolute top-2/3 left-1/5 w-3.5 h-3.5 rounded-full bg-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.9)] pointer-events-none animate-particle-active-2 transition-transform duration-500 ease-out"
                      style={{ transform: `translate(${bannerMousePos.x * -35}px, ${bannerMousePos.y * -35}px)` }}
                    />

                    {/* Orb 3: Blue Glowing Ball */}
                    <div 
                      className="absolute top-1/3 right-1/3 w-5 h-5 rounded-full bg-blue-300 shadow-[0_0_16px_rgba(147,197,253,0.95)] pointer-events-none animate-particle-active-3 transition-transform duration-300 ease-out"
                      style={{ transform: `translate(${bannerMousePos.x * 55}px, ${bannerMousePos.y * 55}px)` }}
                    />

                    {/* Orb 4: Soft Orange AI Accent Ball */}
                    <div 
                      className="absolute bottom-1/4 right-1/5 w-4 h-4 rounded-full bg-[#fe6a34]/80 shadow-[0_0_14px_rgba(254,106,52,0.9)] pointer-events-none animate-particle-active-1 transition-transform duration-400 ease-out"
                      style={{ transform: `translate(${bannerMousePos.x * -50}px, ${bannerMousePos.y * -50}px)` }}
                    />

                    {/* Orb 5: Light Cyan Particle */}
                    <div 
                      className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-cyan-200 shadow-[0_0_10px_rgba(165,243,252,0.95)] pointer-events-none animate-particle-active-2 transition-transform duration-600 ease-out"
                      style={{ transform: `translate(${bannerMousePos.x * 35}px, ${bannerMousePos.y * -25}px)` }}
                    />

                    {/* Orb 6: Bright Teal Micro-Orb */}
                    <div 
                      className="absolute top-1/5 right-1/4 w-2.5 h-2.5 rounded-full bg-emerald-300 shadow-[0_0_9px_rgba(110,231,183,0.9)] pointer-events-none animate-particle-active-3 transition-transform duration-400 ease-out"
                      style={{ transform: `translate(${bannerMousePos.x * -30}px, ${bannerMousePos.y * 40}px)` }}
                    />

                    {/* Orb 7: Bottom Left Particle */}
                    <div 
                      className="absolute bottom-1/3 left-1/3 w-3.5 h-3.5 rounded-full bg-sky-300 shadow-[0_0_12px_rgba(125,211,252,0.9)] pointer-events-none animate-particle-active-1 transition-transform duration-500 ease-out"
                      style={{ transform: `translate(${bannerMousePos.x * 40}px, ${bannerMousePos.y * -40}px)` }}
                    />

                    {/* Contrast Layer for Maximum Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />

                    {/* Banner Foreground Content */}
                    <div className="space-y-3 relative z-10 max-w-2xl">
                      <h3 className="text-xl md:text-3xl font-extrabold tracking-tight drop-shadow-sm">
                        Welcome back, {userName}!
                      </h3>
                      <p className="text-xs md:text-sm text-white/90 font-medium leading-relaxed max-w-xl drop-shadow-xs">
                        Ready to dive back into <strong className="text-secondary font-bold">{selectedSubject}</strong>? Your AI Tutor has prepared 3 new interactive models based on your last scan.
                      </p>
                      
                      <div className="pt-2">
                        <button
                          onClick={() => setActiveTab('scan')}
                          className="bg-[#fe6a34] hover:bg-secondary-dark text-white text-xs md:text-sm py-2.5 px-5 rounded-xl font-extrabold flex items-center gap-2 cursor-pointer transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                          id="overview_banner_scan_btn"
                        >
                          <Camera className="w-4 h-4" />
                          <span>New Scan & Learn</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Learning Progress Panel (All Bars are Actively Run!) */}
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-4">Learning Progress</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Completion Rate card with dynamic bar & Image 1 */}
                      <div className="bg-white border border-card-border p-5 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-charcoal/50 uppercase tracking-wider font-mono">
                              Completion Rate
                            </span>
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                          </div>
                          <h4 className="text-3xl font-extrabold font-mono text-primary mt-1.5">{completionRate}%</h4>
                        </div>
                        
                        {/* Image 1: Full Cover Background */}
                        <div className="my-3 h-32 w-full rounded-lg overflow-hidden border border-card-border/60 relative shadow-2xs">
                          <img 
                            src="/progress-completion-rate.png" 
                            alt="Completion Rate Growth Graph" 
                            className="w-full h-full object-cover object-center"
                          />
                        </div>

                        <div>
                          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-full transition-all duration-500"
                              style={{ width: `${completionRate}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-charcoal/50 mt-1.5 font-semibold">
                            Based on core syllabus tasks finished
                          </p>
                        </div>
                      </div>

                      {/* Study Time card & Image 2 */}
                      <div className="bg-white border border-card-border p-5 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-charcoal/50 uppercase tracking-wider font-mono">
                              Study Time
                            </span>
                            <Clock className="w-5 h-5 text-secondary animate-pulse" />
                          </div>
                          <h4 className="text-3xl font-extrabold font-mono text-primary mt-1.5">{studyTimeHours}h</h4>
                        </div>

                        {/* Image 2: Full Cover Background */}
                        <div className="my-3 h-32 w-full rounded-lg overflow-hidden border border-card-border/60 relative shadow-2xs">
                          <img 
                            src="/progress-study-time.png" 
                            alt="Study Time Books Illustration" 
                            className="w-full h-full object-cover object-center"
                          />
                        </div>

                        <div>
                          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-secondary h-full transition-all duration-300"
                              style={{ width: `${Math.min(100, (parseFloat(studyTimeHours) / 150) * 100)}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-charcoal/50 mt-1.5 font-semibold">
                            Total minutes recorded inside study sessions
                          </p>
                        </div>
                      </div>

                      {/* Concepts Mastered card & Image 3 */}
                      <div className="bg-white border border-card-border p-5 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-charcoal/50 uppercase tracking-wider font-mono">
                              Concepts Mastered
                            </span>
                            <Award className="w-5 h-5 text-primary" />
                          </div>
                          <h4 className="text-3xl font-extrabold font-mono text-primary mt-1.5">{masteredCount}+</h4>
                        </div>

                        {/* Image 3: Full Cover Background */}
                        <div className="my-3 h-32 w-full rounded-lg overflow-hidden border border-card-border/60 relative shadow-2xs">
                          <img 
                            src="/progress-concepts-mastered.png" 
                            alt="Concepts Mastered Graduation Cap" 
                            className="w-full h-full object-cover object-center"
                          />
                        </div>

                        <div>
                          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-primary h-full transition-all duration-300"
                              style={{ width: `${Math.min(100, (masteredCount / 60) * 100)}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-charcoal/50 mt-1.5 font-semibold">
                            Models verified as mastered with exam annotations
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Recent 3D Models (Filtered by active subject) */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-primary">Recent 3D Models</h3>
                      <button 
                        onClick={() => setActiveTab('library')}
                        className="text-xs font-bold text-secondary flex items-center gap-1 hover:underline cursor-pointer"
                        id="overview_view_all_models"
                      >
                        <span>View All</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {filteredModels.slice(0, 3).map((model) => (
                        <div
                          key={model.id}
                          onClick={() => {
                            setActiveModelId(model.id);
                            setActiveTab('library');
                          }}
                          className="bg-white border border-card-border rounded-xl overflow-hidden hover:border-secondary/40 shadow-2xs hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between group"
                          id={`recent_model_card_${model.id}`}
                        >
                          <div className="p-4 bg-surface-container-low min-h-32 flex items-center justify-center relative">
                            <span className="absolute top-2 left-2 bg-primary/10 text-primary text-[9px] font-mono px-2 py-0.5 rounded font-semibold border border-primary/15">
                              {model.category}
                            </span>
                            
                            {/* Rotating geometric visual helper in miniature */}
                            <Compass className="w-10 h-10 text-secondary/30 group-hover:rotate-45 group-hover:scale-110 transition-transform duration-500" />
                          </div>

                          <div className="p-4 border-t border-card-border">
                            <h4 className="font-bold text-sm text-primary group-hover:text-secondary transition-colors">
                              {model.name}
                            </h4>
                            <p className="text-xs text-charcoal/50 mt-1 line-clamp-2 leading-relaxed">
                              {model.description}
                            </p>
                            
                            <div className="mt-3 pt-3 border-t border-card-border flex items-center justify-between text-[10px] text-charcoal/40 font-mono">
                              <span>Scanned: {model.scannedAt}</span>
                              <span className={model.mastered ? 'text-emerald-600 font-bold' : 'text-amber-600'}>
                                {model.mastered ? '• Mastered' : '• In Progress'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {filteredModels.length === 0 && (
                        <div className="col-span-1 md:col-span-3 text-center py-10 bg-white border border-card-border rounded-xl">
                          <p className="text-xs text-charcoal/50">
                            No models unlocked for {selectedSubject} yet. Scan a page in **Scan & Learn** to add your first interactive 3D model!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: LIBRARY (Interactive 3D model screen and NCERT Explorer) */}
              {activeTab === 'library' && (
                <div className="space-y-6 animate-fade-in">
                  {!selectedSubject ? (
                    /* SUBJECT SELECTOR PLACEHOLDER FOR LIBRARY */
                    <div className="bg-white border border-card-border p-12 text-center rounded-xl space-y-6">
                      <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                        <BookMarked className="w-8 h-8 text-secondary" />
                      </div>
                      <div className="max-w-md mx-auto">
                        <h3 className="text-lg font-bold text-primary">No Subject Selected</h3>
                        <p className="text-xs text-charcoal/60 mt-2">
                          Please select a curriculum subject from the top navigation bar or choose one below to view CBSE books and generate 3D models.
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-3">
                        {subjects.map((subject) => (
                          <button
                            key={subject}
                            onClick={() => handleSelectSubject(subject)}
                            className="bg-surface-container hover:bg-secondary/10 hover:text-secondary border border-card-border px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            {subject}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : libraryViewState === 'bookshelf' ? (
                    /* BOOKSHELF VIEW OF CHAPTERS */
                    <Bookshelf
                      classLevel={classLevel}
                      subject={selectedSubject}
                      chapters={booksData[classLevel]?.[selectedSubject]?.chapters || []}
                      onExploreIn3D={(chapterTitle, nodes3D) => {
                        setLibraryViewState('viewer');
                        setSelected3DNode(null);
                        
                        // Try to find if a model for this chapter already exists
                        const existingModel = models.find(
                          m => m.category === chapterTitle && m.subject === selectedSubject && m.classLevel === classLevel
                        );
                        if (existingModel) {
                          setActiveModelId(existingModel.id);
                        } else {
                          // Create and add a simulated model with these precise nodes
                          const generatedModel = {
                            name: chapterTitle,
                            category: chapterTitle,
                            description: `3D concept schematic mapping out the key nodes of "${chapterTitle}" for Class ${classLevel} ${selectedSubject}.`,
                            nodes: nodes3D,
                            subject: selectedSubject || 'Biology',
                          };
                          onAddScannedModel(generatedModel);
                        }
                      }}
                      onAskAI={(chapterTitle, selectedConcept, attachedFile) => {
                        setActiveTab('tutor');
                        if (attachedFile) {
                          setActiveAttachment(attachedFile);
                          const promptText = `Hello! I have uploaded "${attachedFile.name}" as context. Can you help me review this and answer my doubts about it?`;
                          onSendChatMessage(promptText, selectedSubject, classLevel, chapterTitle, attachedFile);
                        } else {
                          const promptText = `Hello! I am currently studying the Class ${classLevel} ${selectedSubject} chapter on "${chapterTitle}". Could you give me an academic overview and recommend some study questions?`;
                          onSendChatMessage(promptText, selectedSubject, classLevel, chapterTitle);
                        }
                      }}
                    />
                  ) : (
                    /* TWO PANEL SPLIT VIEW: NCERT EXPLORER & 3D VIEWER */
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-surface-container-low/60 border border-card-border p-3 rounded-xl">
                        <button
                          onClick={() => {
                            setLibraryViewState('bookshelf');
                            setSelected3DNode(null);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-primary transition-all cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-card-border shadow-3xs"
                          id="btn_back_to_shelf_from_viewer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Return to Book Collection</span>
                        </button>
                        <span className="text-xs font-mono font-bold text-charcoal/50 bg-white/60 border border-card-border/50 px-2.5 py-1 rounded-md">
                          MODE: INTERACTIVE 3D PLATFORM
                        </span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      
                      {/* LEFT COLUMN: CBSE NCERT BOOK EXPLORER (5 cols) */}
                      <div className="lg:col-span-5 bg-white border border-card-border rounded-xl p-4 shadow-2xs space-y-4">
                        {/* Textbook Cover Header */}
                        {(() => {
                          const currentBook = booksData[classLevel]?.[selectedSubject];
                          return currentBook ? (
                            <div className="space-y-3">
                              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-lg p-4 flex gap-3.5 items-center justify-between">
                                <div className="flex gap-3.5 items-center">
                                  <div className="w-12 h-16 bg-primary text-white flex flex-col justify-between p-2 rounded-md shadow-xs font-serif text-[8px] font-bold shrink-0">
                                    <span>CBSE</span>
                                    <span className="text-[7px] text-secondary">CLASS {classLevel}</span>
                                    <span className="text-[5px] uppercase font-sans tracking-wide leading-tight mt-1">{selectedSubject}</span>
                                  </div>
                                  <div>
                                    <h3 className="text-xs font-bold text-primary line-clamp-1">{currentBook.title}</h3>
                                    <p className="text-[10px] text-charcoal/50 font-mono mt-0.5">Publisher: {currentBook.publisher}</p>
                                    <span className="inline-block bg-secondary/15 text-secondary text-[9px] font-mono px-2 py-0.5 rounded-full mt-1.5 font-bold">
                                      {currentBook.chapters.length} NCERT Chapters
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Curriculum control bar */}
                              <div className="flex justify-between items-center gap-2">
                                <button
                                  onClick={() => setIsAddingChapter(!isAddingChapter)}
                                  className="flex-1 bg-primary text-white text-[10px] font-bold px-2.5 py-1.5 rounded-md hover:bg-primary-light transition-all flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Add Custom Chapter</span>
                                </button>
                                <button
                                  onClick={handleResetToStandardCurriculum}
                                  title="Reset syllabus to default CBSE NCERT"
                                  className="bg-surface-container hover:bg-red-50 hover:text-red-500 text-charcoal/60 border border-card-border p-1.5 rounded-md transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span className="text-[10px] font-bold hidden sm:inline">Reset Standard</span>
                                </button>
                              </div>

                              {/* Inline New Chapter Form */}
                              {isAddingChapter && (
                                <div className="bg-surface-container-low border border-card-border rounded-lg p-3 space-y-2.5 animate-fade-in">
                                  <div className="text-[10px] font-bold text-primary uppercase font-mono">Create Custom CBSE Chapter</div>
                                  <div className="grid grid-cols-4 gap-2">
                                    <input
                                      type="number"
                                      placeholder="Ch No."
                                      value={newChapterNumber}
                                      onChange={(e) => setNewChapterNumber(e.target.value)}
                                      className="col-span-1 text-xs border border-card-border p-2 rounded bg-white font-mono"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Chapter Title (e.g., Quantum Physics)"
                                      value={newChapterTitle}
                                      onChange={(e) => setNewChapterTitle(e.target.value)}
                                      className="col-span-3 text-xs border border-card-border p-2 rounded bg-white"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-1.5">
                                    <button
                                      onClick={() => {
                                        setIsAddingChapter(false);
                                        setNewChapterTitle('');
                                        setNewChapterNumber('');
                                      }}
                                      className="text-[10px] text-charcoal/50 hover:text-charcoal px-2 py-1 cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={handleAddChapter}
                                      disabled={!newChapterTitle.trim()}
                                      className="bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded disabled:opacity-40 cursor-pointer"
                                    >
                                      Add Chapter
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-charcoal/50 italic p-4 text-center">
                              No CBSE book records mapped for Class {classLevel} {selectedSubject}.
                            </div>
                          );
                        })()}

                        {/* Chapters & Topics Accordion */}
                        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                          {(() => {
                            const currentBook = booksData[classLevel]?.[selectedSubject];
                            if (!currentBook) return null;

                            const searchLower = searchQuery.trim().toLowerCase();
                            const filteredChapters = currentBook.chapters.filter((chapter) => {
                              if (!searchLower) return true;
                              const titleMatches = chapter.title.toLowerCase().includes(searchLower);
                              const topicsMatch = chapter.topics.some(topic => topic.toLowerCase().includes(searchLower));
                              return titleMatches || topicsMatch;
                            });

                            if (filteredChapters.length === 0) {
                              return (
                                <div className="text-center py-8 text-charcoal/50 text-xs italic bg-surface-container-low border border-dashed border-card-border rounded-xl">
                                  No chapters or syllabus topics match "{searchQuery}" in Class {classLevel} {selectedSubject}.
                                </div>
                              );
                            }

                            return (
                              <>
                                {searchQuery && (
                                  <div className="bg-secondary/10 border border-secondary/20 rounded-lg px-3 py-2 text-[11px] text-primary flex items-center justify-between mb-2 font-semibold">
                                    <span>Found {filteredChapters.length} chapter(s) matching "{searchQuery}"</span>
                                    <button 
                                      onClick={handleClearSearch} 
                                      className="text-secondary font-bold hover:underline cursor-pointer text-[10px]"
                                    >
                                      Clear
                                    </button>
                                  </div>
                                )}
                                {filteredChapters.map((chapter) => {
                                  const isExpanded = expandedChapterId === chapter.id || 
                                    (!!searchLower && (
                                      chapter.title.toLowerCase().includes(searchLower) || 
                                      chapter.topics.some(t => t.toLowerCase().includes(searchLower))
                                    ));
                                  return (
                                    <div key={chapter.id} className="border border-card-border rounded-lg overflow-hidden bg-white shadow-3xs">
                                  {/* Chapter Header Toggle Button */}
                                  <div className="flex items-center justify-between bg-surface-container-low border-b border-card-border pr-2">
                                    <button
                                      onClick={() => setExpandedChapterId(isExpanded ? null : chapter.id)}
                                      className={`flex-1 text-left p-3 flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                                        isExpanded 
                                          ? 'text-secondary font-extrabold' 
                                          : 'text-primary hover:bg-surface-container'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono text-[10px] bg-primary/5 text-primary px-1.5 py-0.5 rounded">CH-{chapter.number}</span>
                                        <span className="line-clamp-1">{chapter.title}</span>
                                      </div>
                                      <span className="text-[10px] opacity-70 font-mono">
                                        {isExpanded ? '▼' : '►'}
                                      </span>
                                    </button>

                                    {/* Action to visit 2D book pages */}
                                    <button
                                      onClick={() => setActive2DChapter(chapter)}
                                      className="p-1.5 text-primary hover:text-secondary rounded hover:bg-white transition-all cursor-pointer flex items-center gap-1 shrink-0 border border-card-border/50 bg-white/40 mr-1.5 shadow-3xs"
                                      title="Read 2D textbook pages of this chapter"
                                      id={`btn_visit_2d_chapter_${chapter.id}`}
                                    >
                                      <BookOpen className="w-3.5 h-3.5 text-secondary shrink-0" />
                                      <span className="text-[9px] font-bold text-primary font-mono hidden sm:inline">2D Pages</span>
                                    </button>

                                    {/* Action to delete the custom chapter if it's user-added */}
                                    {chapter.id.startsWith('custom_chap_') && (
                                      <button
                                        onClick={() => {
                                          if (window.confirm(`Delete chapter "${chapter.title}" and all its topics?`)) {
                                            handleDeleteChapter(chapter.id);
                                          }
                                        }}
                                        className="p-1 text-charcoal/40 hover:text-red-500 rounded transition-all cursor-pointer"
                                        title="Delete custom chapter"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>

                                  {/* Chapter Topics List */}
                                  {isExpanded && (
                                    <div className="bg-[#fafafc] p-3 space-y-2.5">
                                      <div className="divide-y divide-card-border/40">
                                        {chapter.topics.map((topic, tIdx) => {
                                          // Find if we already have an unlocked model with this exact name
                                          const matchingModel = models.find(
                                            m => m.name.toLowerCase() === topic.toLowerCase() &&
                                                 m.subject === selectedSubject &&
                                                 m.classLevel === classLevel
                                          );
                                          const isCurrentActive = matchingModel && activeModelId === matchingModel.id;

                                          return (
                                            <div 
                                              key={tIdx} 
                                              className={`py-2.5 first:pt-0 flex items-center justify-between gap-2.5 text-xs ${
                                                isCurrentActive ? 'border-l-2 border-secondary pl-2 bg-secondary/3' : ''
                                              }`}
                                            >
                                              <div className="flex-1 min-w-0">
                                                <p className={`font-semibold truncate ${isCurrentActive ? 'text-secondary font-bold' : 'text-primary'}`}>
                                                  {topic}
                                                </p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                  <span className="text-[9px] text-charcoal/40 font-mono">CBSE Syllabus</span>
                                                  {chapter.id.startsWith('custom_chap_') && (
                                                    <span className="text-[8px] bg-amber-100 text-amber-700 font-mono px-1 rounded font-bold">Custom</span>
                                                  )}
                                                </div>
                                              </div>

                                              <div className="flex items-center gap-1.5 shrink-0">
                                                {matchingModel ? (
                                                  /* ALREADY UNLOCKED MODEL */
                                                  <button
                                                    onClick={() => {
                                                      setActiveModelId(matchingModel.id);
                                                      setActiveTab('library');
                                                    }}
                                                    disabled={isGenerating3D}
                                                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                                      isCurrentActive
                                                        ? 'bg-secondary text-white font-black shadow-2xs'
                                                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-150'
                                                    }`}
                                                  >
                                                    {isCurrentActive ? (
                                                      <>
                                                        <Check className="w-3.5 h-3.5" />
                                                        <span>Active</span>
                                                      </>
                                                    ) : (
                                                      <span>View 3D</span>
                                                    )}
                                                  </button>
                                                ) : (
                                                  /* NOT YET GENERATED MODEL - AI TRIGGER BUTTON */
                                                  <button
                                                    onClick={() => handleGenerateModelForTopic(topic, chapter.title)}
                                                    disabled={isGenerating3D}
                                                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all border shadow-3xs cursor-pointer ${
                                                      isGenerating3D
                                                        ? 'bg-surface-container text-charcoal/30 border-card-border cursor-not-allowed'
                                                        : 'bg-primary hover:bg-primary-light text-white border-primary/20 hover:shadow-xs'
                                                    }`}
                                                  >
                                                    <Sparkles className="w-3 h-3 text-secondary" />
                                                    <span>Generate</span>
                                                  </button>
                                                )}

                                                {/* Allow deleting custom/added topics inside chapters */}
                                                <button
                                                  onClick={() => handleDeleteTopicFromChapter(chapter.id, tIdx)}
                                                  className="p-1 text-charcoal/20 hover:text-red-500 rounded transition-all cursor-pointer"
                                                  title="Delete topic from syllabus"
                                                >
                                                  <Trash2 className="w-3 h-3" />
                                                </button>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>

                                      {/* Add Topic Inline Input */}
                                      {addingTopicChapterId === chapter.id ? (
                                        <div className="bg-white border border-card-border rounded-lg p-2 flex gap-1.5 items-center mt-2">
                                          <input
                                            type="text"
                                            placeholder="Topic name (e.g., DNA replication)"
                                            value={newTopicName}
                                            onChange={(e) => setNewTopicName(e.target.value)}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') handleAddTopicToChapter(chapter.id);
                                            }}
                                            className="text-xs border border-card-border rounded p-1.5 flex-1 bg-[#fafafc] focus:outline-hidden focus:border-primary"
                                          />
                                          <button
                                            onClick={() => handleAddTopicToChapter(chapter.id)}
                                            disabled={!newTopicName.trim()}
                                            className="bg-secondary text-white text-[10px] font-bold px-2.5 py-1.5 rounded disabled:opacity-50 cursor-pointer shrink-0"
                                          >
                                            Add
                                          </button>
                                          <button
                                            onClick={() => {
                                              setAddingTopicChapterId(null);
                                              setNewTopicName('');
                                            }}
                                            className="text-[10px] text-charcoal/40 hover:text-charcoal px-1 cursor-pointer"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => setAddingTopicChapterId(chapter.id)}
                                          className="w-full text-center border border-dashed border-card-border rounded-lg py-2 text-[10px] font-bold text-primary/60 hover:text-primary hover:bg-white transition-all mt-2 flex items-center justify-center gap-1 cursor-pointer"
                                        >
                                          <Plus className="w-3 h-3" />
                                          <span>Add Custom Syllabus Topic</span>
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </>
                        );
                      })()}
                        </div>
                      </div>

                      {/* RIGHT COLUMN: 3D CANVAS & VIEWER (7 cols) */}
                      <div className="lg:col-span-7 space-y-6">
                        
                        {/* THE VIEWER CONTAINER */}
                        {isGenerating3D ? (
                          /* HIGH TECH AI 3D GENERATOR LOADER */
                          <div className="bg-primary/95 text-white border border-primary rounded-xl h-[520px] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-lg animate-pulse">
                            {/* Abstract technical scanning lines */}
                            <div className="absolute inset-0 bg-[radial-gradient(#fe6a34_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-10" />
                            <div className="absolute top-0 left-0 w-full h-1 bg-secondary shadow-[0_0_15px_#fe6a34] animate-bounce" />

                            <div className="relative z-10 space-y-6 max-w-sm">
                              {/* Spinning 3D mesh simulator ring */}
                              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                                <Loader2 className="w-16 h-16 text-secondary animate-spin" />
                                <Compass className="absolute w-8 h-8 text-white/50 animate-pulse" />
                              </div>

                              <div>
                                <h3 className="text-lg font-bold text-white uppercase tracking-wider">AI 3D Synthesis</h3>
                                <p className="text-xs text-secondary font-bold font-mono mt-1">CLASS {classLevel} • {selectedSubject}</p>
                              </div>

                              <p className="text-xs text-white/75 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/10 font-mono">
                                Generating: &ldquo;{lastGeneratedTopic}&rdquo;
                              </p>

                              {/* Progress Slider */}
                              <div className="space-y-2">
                                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden border border-white/15">
                                  <div 
                                    className="bg-secondary h-full transition-all duration-300 shadow-[0_0_8px_#fe6a34]"
                                    style={{ width: `${generationProgress}%` }}
                                  />
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-mono text-white/50">
                                  <span>{generationStatus}</span>
                                  <span className="font-bold text-secondary">{generationProgress}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : activeModel ? (
                          /* RENDER THE INTERACTIVE 3D VIEWER */
                          <div className="h-[520px]">
                            <Interactive3DViewer
                              modelName={activeModel.name}
                              nodes={activeModel.nodes}
                              category={activeModel.category}
                              isMastered={activeModel.mastered}
                              onMasterModel={() => onMasterModel(activeModel.id)}
                              onSelectNode={setSelected3DNode}
                            />
                          </div>
                        ) : (
                          /* EMPTY STATE FOR VIEWER */
                          <div className="bg-white border border-card-border p-16 text-center rounded-xl h-[520px] flex flex-col items-center justify-center shadow-2xs">
                            <Compass className="w-16 h-16 text-charcoal/20 animate-spin" style={{ animationDuration: '12s' }} />
                            <h3 className="text-base font-bold text-primary mt-6">Interactive 3D Stage</h3>
                            <p className="text-xs text-charcoal/50 mt-2 max-w-sm leading-relaxed">
                              Select any chapter topic on the left CBSE menu. If the model hasn&apos;t been rendered yet, our Gemini model will synthesize the 3D structures, labels, and study tasks in real-time.
                            </p>
                          </div>
                        )}

                        {/* Complete list of cards inside Library at bottom */}
                        <div>
                          <h3 className="text-xs font-bold font-mono tracking-wider text-primary mb-3.5 uppercase flex items-center gap-2">
                            <span>Your Personal 3D Shelf ({filteredModels.length})</span>
                            <span className="h-px bg-card-border flex-1" />
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {filteredModels.map((model) => (
                              <button
                                key={model.id}
                                onClick={() => {
                                  setActiveModelId(model.id);
                                  // Find the chapter ID that maps to this model's category to expand it
                                  const matchingBook = booksData[classLevel]?.[selectedSubject];
                                  if (matchingBook) {
                                    const matchChap = matchingBook.chapters.find(c => c.title.toLowerCase() === model.category.toLowerCase());
                                    if (matchChap) setExpandedChapterId(matchChap.id);
                                  }
                                }}
                                className={`text-left p-3 border rounded-lg transition-all cursor-pointer ${
                                  activeModelId === model.id
                                    ? 'border-secondary bg-[#fe6a34]/5 ring-2 ring-secondary/15'
                                    : 'border-card-border bg-white hover:border-primary/40'
                                }`}
                                id={`lib_card_select_${model.id}`}
                              >
                                <h4 className="text-xs font-bold text-primary truncate">{model.name}</h4>
                                <span className="text-[10px] text-charcoal/50 block mt-0.5 truncate">{model.category}</span>
                                <div className="mt-2 flex items-center justify-between">
                                  <span className={`text-[9px] font-mono ${model.mastered ? 'text-emerald-600 font-bold' : 'text-charcoal/40'}`}>
                                    {model.mastered ? '✓ Mastered' : '• In Progress'}
                                  </span>
                                  {model.scannedAt === 'Just Now' && (
                                    <span className="bg-secondary/20 text-secondary text-[8px] font-bold px-1 rounded animate-pulse">NEW AI</span>
                                  )}
                                </div>
                              </button>
                            ))}

                            {filteredModels.length === 0 && (
                              <div className="col-span-2 sm:col-span-3 text-center py-8 bg-[#fafafc] border border-dashed border-card-border rounded-lg">
                                <p className="text-[11px] text-charcoal/50">
                                  No interactive models downloaded. Click on any standard CBSE syllabus topic on the left to generate your first 3D asset!
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                  )}

                </div>
              )}

              {/* TAB 3: PLANNER (Active task planner widget) */}
              {activeTab === 'planner' && (
                <div className="space-y-6 animate-fade-in">
                  <TaskPlanner
                    tasks={tasks}
                    selectedSubject={selectedSubject || 'Biology'}
                    classLevel={classLevel}
                    chapters={booksData[classLevel]?.[selectedSubject || 'Biology']?.chapters || []}
                    onAddTask={onAddTask}
                    onImportChapterPlanner={onImportChapterPlanner}
                    onToggleTask={onToggleTask}
                    onDeleteTask={onDeleteTask}
                    onUpdateStudyTime={onUpdateStudyTime}
                    totalStudyTime={totalStudyTime}
                    onAskTutor={(query) => {
                      onSendChatMessage(query, selectedSubject, classLevel);
                      setActiveTab('tutor');
                    }}
                  />
                </div>
              )}

              {/* TAB 4: SCAN & LEARN (Syllabus AI Scanner) */}
              {activeTab === 'scan' && (
                <div className="space-y-6 animate-fade-in">
                  <ScanLearn
                    selectedSubject={selectedSubject || 'Biology'}
                    classLevel={classLevel}
                    onScanComplete={(model) => {
                      onAddScannedModel(model);
                      setActiveTab('library');
                    }}
                    onAskAIAboutBook={(file, customPrompt) => {
                      setActiveTab('tutor');
                      setActiveAttachment(file);
                      onSendChatMessage(
                        customPrompt || `Hello! I have uploaded this study book: "${file.name}". Please analyze this file and help explain the key concepts.`,
                        selectedSubject || 'Biology',
                        classLevel,
                        file.name,
                        file
                      );
                    }}
                  />
                </div>
              )}

              {/* TAB 5: AI TUTOR (Real Chat with Gemini) */}
              {activeTab === 'tutor' && (
                <div className="space-y-6 animate-fade-in">
                  <AITutor
                    selectedSubject={selectedSubject || 'Biology'}
                    classLevel={classLevel}
                    chatHistory={chatHistory}
                    onSendMessage={onSendChatMessage}
                    onImportTasks={(tasksToImport) => {
                      onImportTutorTasks(tasksToImport);
                      setActiveTab('planner');
                    }}
                    activeModelName={activeModel ? activeModel.name : undefined}
                    activeChapterTitle={activeModel ? activeModel.category : undefined}
                    selected3DNode={selected3DNode}
                    activeAttachment={activeAttachment}
                    setActiveAttachment={setActiveAttachment}
                    onClearChat={onClearChat}
                    onRegenerateResponse={onRegenerateResponse}
                  />
                </div>
              )}

              {/* TAB 6: SETTINGS (Curriculum Control) */}
              {activeTab === 'settings' && (
                <div className="bg-white border border-card-border p-6 rounded-xl max-w-xl animate-fade-in space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-primary">Academy Settings</h3>
                    <p className="text-xs text-charcoal/60 mt-0.5">
                      Configure your curriculum grade level, subject profiles, and diagnostic logs.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-2 font-mono uppercase tracking-wider">
                        Registered Curriculum Grade
                      </label>
                      <select
                        value={currentClass}
                        onChange={(e) => {
                          const val = e.target.value as ClassLevel;
                          setCurrentClass(val);
                          alert(`Curriculum Grade updated to Class ${val}! All syllabus task guides have been synchronized.`);
                          // Trigger reload or parent state update if desired, but let's persist local
                          window.location.reload(); // Quick refresh to re-bootstrap
                        }}
                        className="w-full text-xs border border-card-border p-3 rounded-lg bg-[#fafafc] font-bold"
                        id="settings_select_class"
                      >
                        <option value="11th">Class 11th</option>
                        <option value="12th">Class 12th</option>
                      </select>
                      <p className="text-[10px] text-charcoal/50 mt-1.5 leading-relaxed">
                        Changing your Class Level will recalibrate the syllabus checklists inside the **Task Planner** and bootstrap matching educational models automatically.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-card-border">
                      <h4 className="text-xs font-bold text-primary mb-2">Registered Student Details</h4>
                      <div className="bg-surface-container-low p-4 rounded-lg text-xs font-mono text-primary space-y-2 border">
                        <div>• Full Name: {userName}</div>
                        <div>• Email Profile: {userEmail}</div>
                        <div>• Role: Authorized Student Ingress</div>
                        <div>• Authority: LearnFlow AR Academic Integrity</div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 7: AI QUIZ GENERATOR */}
              {activeTab === 'quiz' && (
                <AIQuizGenerator
                  selectedSubject={selectedSubject || 'Biology'}
                  classLevel={classLevel}
                  onAskAI={(query) => {
                    onSendChatMessage(query, selectedSubject || 'Biology', classLevel);
                    setActiveTab('tutor');
                  }}
                />
              )}

              {/* TAB 8: REVISION FLASHCARDS */}
              {activeTab === 'flashcards' && (
                <AIFlashcards
                  selectedSubject={selectedSubject || 'Biology'}
                  classLevel={classLevel}
                  onAskAI={(query) => {
                    onSendChatMessage(query, selectedSubject || 'Biology', classLevel);
                    setActiveTab('tutor');
                  }}
                />
              )}

              {/* TAB 9: LEADERBOARD & BADGES */}
              {activeTab === 'leaderboard' && (
                <Leaderboard
                  currentUserName={userName}
                  currentUserEmail={userEmail}
                  currentClass={classLevel}
                  totalXP={userXP}
                  userLevel={userLevel}
                  streakDays={1}
                  completedTasksCount={totalCompletedTasks}
                  masteredModelsCount={totalMasteredModels}
                  totalStudyTimeSeconds={totalStudyTime}
                />
              )}

              {/* TAB 10: ADMIN CONSOLE */}
              {activeTab === 'admin' && (
                <AdminPanel
                  userName={userName}
                  userEmail={userEmail}
                  classLevel={classLevel}
                  tasks={tasks}
                  models={models}
                  totalStudyTime={totalStudyTime}
                  booksData={booksData}
                  onSaveBooksData={saveBooksData}
                  onSaveModels={(newModels) => {
                    if (onSaveModels) onSaveModels(newModels);
                  }}
                  onSaveTasks={(newTasks) => {
                    if (onSaveTasks) onSaveTasks(newTasks);
                  }}
                />
              )}

            </div>
          )}

        </div>

      </main>

      {active2DChapter && selectedSubject && (
        <Textbook2DReader
          chapter={active2DChapter}
          subject={selectedSubject}
          classLevel={classLevel}
          onClose={() => setActive2DChapter(null)}
        />
      )}

    </div>
  );
}
