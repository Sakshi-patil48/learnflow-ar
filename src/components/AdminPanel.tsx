import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Users, 
  BookOpen, 
  Box, 
  Sliders, 
  Download, 
  Upload, 
  Trash2, 
  Plus, 
  Edit3, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Key, 
  Sparkles, 
  Cpu, 
  Clock, 
  Award, 
  RefreshCw, 
  Save, 
  FileText, 
  Eye, 
  Check, 
  X,
  Layers,
  GraduationCap,
  Database,
  BarChart2,
  ChevronRight,
  UserPlus,
  RotateCcw
} from 'lucide-react';
import { ClassLevel, SubjectName, StudyTask, Model3D, StudentUser, AdminSettings } from '../types';
import { NcertBook, NcertChapter } from '../ncertData';

interface AdminPanelProps {
  userName: string;
  userEmail: string;
  classLevel: ClassLevel;
  tasks: StudyTask[];
  models: Model3D[];
  totalStudyTime: number;
  booksData: Record<ClassLevel, Record<SubjectName, NcertBook>>;
  onSaveBooksData: (newData: Record<ClassLevel, Record<SubjectName, NcertBook>>) => void;
  onSaveModels: (newModels: Model3D[]) => void;
  onSaveTasks: (newTasks: StudyTask[]) => void;
}

const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  systemPrompt: "You are LearnFlow AI, an expert, encouraging, and highly interactive STEM tutor for Indian high school students (Classes 11th & 12th CBSE/NEET/JEE). Provide clear, step-by-step explanations with analogies, key formulas, and practical real-world examples.",
  geminiModel: "gemini-2.5-flash",
  temperature: 0.7,
  maxTokens: 2048,
  adminPin: "9822725265",
  enableAiTutor: true,
  enableArScanner: true,
  enableGuestRegistration: true,
  targetExamsList: ["CBSE Board Exams", "NEET UG", "JEE Mains", "JEE Advanced", "CUET"]
};

export default function AdminPanel({
  userName,
  userEmail,
  classLevel,
  tasks,
  models,
  totalStudyTime,
  booksData,
  onSaveBooksData,
  onSaveModels,
  onSaveTasks
}: AdminPanelProps) {
  // Lock / Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('learnflow_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active Admin Sub-tab
  const [adminTab, setAdminTab] = useState<'overview' | 'students' | 'curriculum' | 'models3d' | 'ai_settings' | 'backup'>('overview');

  // Admin Settings State
  const [settings, setSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('learnflow_admin_settings');
    if (saved) {
      try {
        return { ...DEFAULT_ADMIN_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        console.error("Failed to parse admin settings", e);
      }
    }
    return DEFAULT_ADMIN_SETTINGS;
  });

  // Toast feedback state
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Student Users list state
  const [students, setStudents] = useState<StudentUser[]>(() => {
    const saved = localStorage.getItem('learnflow_students_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse students list", e);
      }
    }
    // Bootstrap initial active user + mock users
    return [
      {
        id: 'usr_current',
        name: userName || 'Student User',
        email: userEmail || 'student@learnflow.edu',
        classLevel: classLevel,
        registeredAt: new Date().toLocaleDateString(),
        totalStudyTimeSeconds: totalStudyTime,
        completedTasksCount: tasks.filter(t => t.completed).length,
        masteredModelsCount: models.filter(m => m.mastered).length,
        targetExam: 'CBSE Board & NEET',
        status: 'active'
      },
      {
        id: 'usr_demo_1',
        name: 'Aarav Sharma',
        email: 'aarav.s@school.edu',
        classLevel: '12th',
        registeredAt: '2026-07-15',
        totalStudyTimeSeconds: 14200,
        completedTasksCount: 18,
        masteredModelsCount: 4,
        targetExam: 'JEE Mains',
        status: 'active'
      },
      {
        id: 'usr_demo_2',
        name: 'Ananya Patel',
        email: 'ananya.p@school.edu',
        classLevel: '11th',
        registeredAt: '2026-07-20',
        totalStudyTimeSeconds: 8400,
        completedTasksCount: 9,
        masteredModelsCount: 2,
        targetExam: 'NEET UG',
        status: 'active'
      }
    ];
  });

  // Save student list helper
  const saveStudentsList = (updated: StudentUser[]) => {
    setStudents(updated);
    localStorage.setItem('learnflow_students_list', JSON.stringify(updated));
  };

  // Search & Filter state
  const [studentSearch, setStudentSearch] = useState('');
  const [studentGradeFilter, setStudentGradeFilter] = useState<'all' | ClassLevel>('all');

  // Add Student Modal State
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState<ClassLevel>('11th');
  const [newStudentExam, setNewStudentExam] = useState('CBSE Board');

  // Curriculum Editor States
  const [selectedCurriculumClass, setSelectedCurriculumClass] = useState<ClassLevel>('11th');
  const [selectedCurriculumSubject, setSelectedCurriculumSubject] = useState<SubjectName>('Biology');
  const [curriculumSearch, setCurriculumSearch] = useState('');
  const [isAddChapterOpen, setIsAddChapterOpen] = useState(false);
  const [newChapterNum, setNewChapterNum] = useState('');
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterTopics, setNewChapterTopics] = useState('');
  const [newChapterPdf, setNewChapterPdf] = useState('');
  const [newChapterYoutube, setNewChapterYoutube] = useState('');

  // Edit Chapter Modal State
  const [editingChapter, setEditingChapter] = useState<NcertChapter | null>(null);
  const [editChapterTitle, setEditChapterTitle] = useState('');
  const [editChapterTopics, setEditChapterTopics] = useState('');
  const [editChapterPdf, setEditChapterPdf] = useState('');
  const [editChapterYoutube, setEditChapterYoutube] = useState('');

  // 3D Model Editor States
  const [modelSearch, setModelSearch] = useState('');
  const [modelSubjectFilter, setModelSubjectFilter] = useState<'all' | SubjectName>('all');
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);
  const [newModelName, setNewModelName] = useState('');
  const [newModelCategory, setNewModelCategory] = useState('');
  const [newModelDescription, setNewModelDescription] = useState('');
  const [newModelNodes, setNewModelNodes] = useState('');
  const [newModelSubject, setNewModelSubject] = useState<SubjectName>('Biology');
  const [newModelGrade, setNewModelGrade] = useState<ClassLevel>('11th');

  // Authentication Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === settings.adminPin || pinInput === 'admin' || pinInput === '9822725265') {
      setIsAuthenticated(true);
      localStorage.setItem('learnflow_admin_auth', 'true');
      setPinError('');
      showToast('Admin Console unlocked successfully', 'success');
    } else {
      setPinError('Invalid Admin PIN or Password. Use default "admin" or "9822725265"');
    }
  };

  const handleLogoutAdmin = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('learnflow_admin_auth');
    showToast('Admin Console locked', 'info');
  };

  // Save Settings Handler
  const handleSaveSettings = () => {
    localStorage.setItem('learnflow_admin_settings', JSON.stringify(settings));
    showToast('AI & Admin settings saved successfully', 'success');
  };

  // Student Actions
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentEmail.trim()) return;

    const newUsr: StudentUser = {
      id: `usr_${Date.now()}`,
      name: newStudentName.trim(),
      email: newStudentEmail.trim(),
      classLevel: newStudentGrade,
      registeredAt: new Date().toLocaleDateString(),
      totalStudyTimeSeconds: 0,
      completedTasksCount: 0,
      masteredModelsCount: 0,
      targetExam: newStudentExam,
      status: 'active'
    };

    saveStudentsList([newUsr, ...students]);
    setIsAddStudentOpen(false);
    setNewStudentName('');
    setNewStudentEmail('');
    showToast(`Added student account for ${newUsr.name}`, 'success');
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove student "${name}"?`)) {
      const updated = students.filter(s => s.id !== id);
      saveStudentsList(updated);
      showToast(`Removed student "${name}"`, 'info');
    }
  };

  const handleResetStudentStats = (id: string, name: string) => {
    const updated = students.map(s => {
      if (s.id === id) {
        return {
          ...s,
          totalStudyTimeSeconds: 0,
          completedTasksCount: 0,
          masteredModelsCount: 0
        };
      }
      return s;
    });
    saveStudentsList(updated);
    showToast(`Reset study stats for ${name}`, 'success');
  };

  // Curriculum Actions
  const handleAddChapterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;

    const topicArr = newChapterTopics
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const existingChapters = booksData[selectedCurriculumClass]?.[selectedCurriculumSubject]?.chapters || [];
    const nextNum = parseInt(newChapterNum, 10) || existingChapters.length + 1;

    const newChap: NcertChapter = {
      id: `chap_${selectedCurriculumClass}_${selectedCurriculumSubject.toLowerCase()}_${Date.now()}`,
      number: nextNum,
      title: newChapterTitle.trim(),
      topics: topicArr.length > 0 ? topicArr : ['Overview & Basic Definitions'],
      pdfUrl: newChapterPdf.trim() || undefined,
      youtubeVideoUrl: newChapterYoutube.trim() || undefined
    };

    const updatedBooks = JSON.parse(JSON.stringify(booksData));
    if (!updatedBooks[selectedCurriculumClass]) updatedBooks[selectedCurriculumClass] = {};
    if (!updatedBooks[selectedCurriculumClass][selectedCurriculumSubject]) {
      updatedBooks[selectedCurriculumClass][selectedCurriculumSubject] = {
        title: `${selectedCurriculumSubject} Class ${selectedCurriculumClass}`,
        publisher: 'NCERT',
        chapters: []
      };
    }

    updatedBooks[selectedCurriculumClass][selectedCurriculumSubject].chapters.push(newChap);
    onSaveBooksData(updatedBooks);

    setIsAddChapterOpen(false);
    setNewChapterTitle('');
    setNewChapterTopics('');
    setNewChapterPdf('');
    setNewChapterYoutube('');
    setNewChapterNum('');
    showToast(`Added Chapter "${newChap.title}" to ${selectedCurriculumSubject} (${selectedCurriculumClass})`, 'success');
  };

  const handleDeleteChapter = (chapterId: string, title: string) => {
    if (confirm(`Are you sure you want to delete chapter "${title}"?`)) {
      const updatedBooks = JSON.parse(JSON.stringify(booksData));
      if (updatedBooks[selectedCurriculumClass]?.[selectedCurriculumSubject]) {
        updatedBooks[selectedCurriculumClass][selectedCurriculumSubject].chapters = 
          updatedBooks[selectedCurriculumClass][selectedCurriculumSubject].chapters.filter((c: NcertChapter) => c.id !== chapterId);
        onSaveBooksData(updatedBooks);
        showToast(`Deleted chapter "${title}"`, 'info');
      }
    }
  };

  const handleOpenEditChapter = (chap: NcertChapter) => {
    setEditingChapter(chap);
    setEditChapterTitle(chap.title);
    setEditChapterTopics(chap.topics.join(', '));
    setEditChapterPdf(chap.pdfUrl || '');
    setEditChapterYoutube(chap.youtubeVideoUrl || '');
  };

  const handleSaveEditedChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChapter || !editChapterTitle.trim()) return;

    const topicArr = editChapterTopics
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const updatedBooks = JSON.parse(JSON.stringify(booksData));
    const chapList: NcertChapter[] = updatedBooks[selectedCurriculumClass]?.[selectedCurriculumSubject]?.chapters || [];
    
    const idx = chapList.findIndex(c => c.id === editingChapter.id);
    if (idx !== -1) {
      chapList[idx] = {
        ...chapList[idx],
        title: editChapterTitle.trim(),
        topics: topicArr.length > 0 ? topicArr : chapList[idx].topics,
        pdfUrl: editChapterPdf.trim() || undefined,
        youtubeVideoUrl: editChapterYoutube.trim() || undefined
      };
      onSaveBooksData(updatedBooks);
      showToast(`Updated chapter "${editChapterTitle.trim()}"`, 'success');
    }
    setEditingChapter(null);
  };

  // 3D Model Actions
  const handleAddModelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelName.trim()) return;

    const nodesArr = newModelNodes.split(',').map(n => n.trim()).filter(n => n.length > 0);
    const newM: Model3D = {
      id: `model_admin_${Date.now()}`,
      name: newModelName.trim(),
      category: newModelCategory.trim() || 'General Science',
      description: newModelDescription.trim() || 'Interactive 3D model visualizer.',
      nodes: nodesArr.length > 0 ? nodesArr : ['Core Component A', 'Structural Node B'],
      subject: newModelSubject,
      classLevel: newModelGrade,
      scannedAt: 'Added by Admin',
      mastered: false
    };

    onSaveModels([newM, ...models]);
    setIsAddModelOpen(false);
    setNewModelName('');
    setNewModelCategory('');
    setNewModelDescription('');
    setNewModelNodes('');
    showToast(`Created 3D model "${newM.name}"`, 'success');
  };

  const handleDeleteModel = (modelId: string, name: string) => {
    if (confirm(`Are you sure you want to delete 3D model "${name}"?`)) {
      onSaveModels(models.filter(m => m.id !== modelId));
      showToast(`Deleted 3D model "${name}"`, 'info');
    }
  };

  // Backup & Restore Handlers
  const handleExportBackup = () => {
    const backupData = {
      app: 'LearnFlow AR',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      adminSettings: settings,
      studentsList: students,
      booksData: booksData,
      models: models,
      tasks: tasks
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learnflow_ar_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported system backup JSON file', 'success');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.booksData) onSaveBooksData(parsed.booksData);
        if (parsed.models) onSaveModels(parsed.models);
        if (parsed.tasks) onSaveTasks(parsed.tasks);
        if (parsed.studentsList) saveStudentsList(parsed.studentsList);
        if (parsed.adminSettings) {
          setSettings(parsed.adminSettings);
          localStorage.setItem('learnflow_admin_settings', JSON.stringify(parsed.adminSettings));
        }
        showToast('Successfully imported system backup data!', 'success');
      } catch (err) {
        showToast('Failed to parse invalid backup JSON file', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleFactoryReset = () => {
    if (confirm('⚠️ WARNING: This will reset all custom curriculum, students, and 3D models to factory defaults. Proceed?')) {
      localStorage.removeItem('cbse_custom_books');
      localStorage.removeItem('learnflow_admin_settings');
      localStorage.removeItem('learnflow_students_list');
      localStorage.removeItem('learnflow_models');
      localStorage.removeItem('learnflow_tasks');
      showToast('Reset system to factory defaults. Please refresh page.', 'info');
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  // Lock Screen view
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/95 border border-indigo-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 mb-6 shadow-lg shadow-indigo-500/10">
              <ShieldCheck className="w-10 h-10 animate-pulse" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">LearnFlow Admin Console</h2>
            <p className="text-slate-400 text-sm mb-6">
              Enter your Security PIN or Password to access system administration tools.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <div className="relative">
                  <Key className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Enter Admin PIN or Password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all font-mono tracking-widest text-center text-lg"
                    autoFocus
                  />
                </div>
                {pinError && (
                  <p className="text-rose-400 text-xs mt-2 text-left flex items-center gap-1 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {pinError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Unlock Admin Console
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
              <span>LearnFlow AR v2.0</span>
              <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400">PIN: 9822725265 / admin</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                          s.email.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesGrade = studentGradeFilter === 'all' || s.classLevel === studentGradeFilter;
    return matchesSearch && matchesGrade;
  });

  // Filtered 3D Models
  const filteredModels = models.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
                          m.category.toLowerCase().includes(modelSearch.toLowerCase());
    const matchesSubj = modelSubjectFilter === 'all' || m.subject === modelSubjectFilter;
    return matchesSearch && matchesSubj;
  });

  // Active Curriculum Chapters
  const currentChapters: NcertChapter[] = booksData[selectedCurriculumClass]?.[selectedCurriculumSubject]?.chapters || [];
  const filteredChapters = currentChapters.filter(c => 
    c.title.toLowerCase().includes(curriculumSearch.toLowerCase()) ||
    c.topics.some(t => t.toLowerCase().includes(curriculumSearch.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 relative">
      {/* Toast Feedback Notification */}
      {toastMsg && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 animate-slide-in backdrop-blur-xl ${
          toastMsg.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' 
            : toastMsg.type === 'error'
            ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
            : 'bg-indigo-950/90 border-indigo-500/50 text-indigo-200'
        }`}>
          {toastMsg.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {toastMsg.type === 'error' && <XCircle className="w-5 h-5 text-rose-400" />}
          {toastMsg.type === 'info' && <Sparkles className="w-5 h-5 text-indigo-400" />}
          <span className="text-sm font-medium">{toastMsg.text}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">System Admin Console</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Authenticated
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-0.5">
              Manage students, curriculum books, 3D AR models, Gemini AI parameters, and platform settings.
            </p>
          </div>
        </div>

        <button
          onClick={handleLogoutAdmin}
          className="self-start md:self-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-sm font-medium border border-slate-700 transition-all flex items-center gap-2 shadow-sm"
        >
          <Lock className="w-4 h-4 text-slate-400" />
          Lock Console
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-slate-800 no-scrollbar">
        {[
          { id: 'overview', label: 'Overview & Stats', icon: BarChart2 },
          { id: 'students', label: `Students (${students.length})`, icon: Users },
          { id: 'curriculum', label: 'Curriculum & Books', icon: BookOpen },
          { id: 'models3d', label: `3D Models (${models.length})`, icon: Box },
          { id: 'ai_settings', label: 'AI & System Tuning', icon: Sliders },
          { id: 'backup', label: 'Backup & Restore', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2.5 whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & METRICS */}
      {adminTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl text-indigo-400">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Active
                </span>
              </div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Registered Students</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{students.length}</h3>
              <p className="text-slate-500 text-xs mt-2">Classes 11th & 12th enrolled</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-purple-500/40 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-600/20 border border-purple-500/30 rounded-2xl text-purple-400">
                  <Clock className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                  Total Hours
                </span>
              </div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Cumulative Study Time</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">
                {(students.reduce((acc, s) => acc + s.totalStudyTimeSeconds, totalStudyTime) / 3600).toFixed(1)} hrs
              </h3>
              <p className="text-slate-500 text-xs mt-2">Logged across all active sessions</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-sky-500/40 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-sky-600/20 border border-sky-500/30 rounded-2xl text-sky-400">
                  <Box className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
                  AR Ready
                </span>
              </div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">3D/AR Library</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{models.length} Models</h3>
              <p className="text-slate-500 text-xs mt-2">Biology, Physics, Chemistry, Math</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl text-emerald-400">
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Online
                </span>
              </div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Gemini AI Tutor</p>
              <h3 className="text-xl font-bold text-white mt-1 truncate">{settings.geminiModel}</h3>
              <p className="text-slate-500 text-xs mt-2">Temp: {settings.temperature} | Max: {settings.maxTokens}</p>
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              onClick={() => setAdminTab('students')}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/50 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform">
                  <UserPlus className="w-6 h-6" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="text-lg font-bold text-white mb-1">Student Account Management</h4>
              <p className="text-slate-400 text-sm">Add new student profiles, view study hours, reset task progress, or remove accounts.</p>
            </div>

            <div 
              onClick={() => setAdminTab('curriculum')}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 hover:border-purple-500/50 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="text-lg font-bold text-white mb-1">Curriculum & Chapter Manager</h4>
              <p className="text-slate-400 text-sm">Add NCERT chapters, topics, PDF reference links, and YouTube study videos dynamically.</p>
            </div>

            <div 
              onClick={() => setAdminTab('models3d')}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 hover:border-sky-500/50 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-sky-500/10 text-sky-400 rounded-2xl group-hover:scale-110 transition-transform">
                  <Box className="w-6 h-6" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="text-lg font-bold text-white mb-1">3D / AR Asset Library</h4>
              <p className="text-slate-400 text-sm">Upload GLB/GLTF models, configure interactive node labels, and attach to subjects.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENTS MANAGEMENT */}
      {adminTab === 'students' && (
        <div className="space-y-6 animate-fade-in">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search students by name or email..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <select
                value={studentGradeFilter}
                onChange={(e) => setStudentGradeFilter(e.target.value as any)}
                className="px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Grades</option>
                <option value="11th">Class 11th</option>
                <option value="12th">Class 12th</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddStudentOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              Add Student
            </button>
          </div>

          {/* Student Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/60 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-6">Student Name</th>
                    <th className="py-4 px-6">Grade</th>
                    <th className="py-4 px-6">Target Exam</th>
                    <th className="py-4 px-6">Study Time</th>
                    <th className="py-4 px-6">Tasks Done</th>
                    <th className="py-4 px-6">3D Models Mastered</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No students found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center text-sm shadow">
                              {st.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{st.name}</p>
                              <p className="text-xs text-slate-400">{st.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-lg font-medium text-xs">
                            Class {st.classLevel}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-300">
                          {st.targetExam || 'CBSE Board'}
                        </td>
                        <td className="py-4 px-6 text-slate-300 font-mono">
                          {(st.totalStudyTimeSeconds / 60).toFixed(0)} mins
                        </td>
                        <td className="py-4 px-6 text-slate-300">
                          <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-semibold">
                            {st.completedTasksCount} completed
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-300">
                          <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-lg text-xs font-semibold">
                            {st.masteredModelsCount} mastered
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleResetStudentStats(st.id, st.name)}
                              title="Reset study stats"
                              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 rounded-lg transition-colors"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(st.id, st.name)}
                              title="Delete user"
                              className="p-2 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CURRICULUM MANAGEMENT */}
      {adminTab === 'curriculum' && (
        <div className="space-y-6 animate-fade-in">
          {/* Class & Subject Selector Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-3xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Class selector */}
              <div className="flex p-1 bg-slate-800 rounded-xl border border-slate-700">
                {(['11th', '12th'] as ClassLevel[]).map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setSelectedCurriculumClass(grade)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                      selectedCurriculumClass === grade
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Class {grade}
                  </button>
                ))}
              </div>

              {/* Subject selector */}
              <div className="flex flex-wrap gap-1.5">
                {(['Biology', 'Physics', 'Chemistry', 'Mathematics'] as SubjectName[]).map((subj) => (
                  <button
                    key={subj}
                    onClick={() => setSelectedCurriculumSubject(subj)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                      selectedCurriculumSubject === subj
                        ? 'bg-purple-600 text-white font-semibold shadow'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter chapters..."
                  value={curriculumSearch}
                  onChange={(e) => setCurriculumSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                onClick={() => setIsAddChapterOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5 whitespace-nowrap shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add Chapter
              </button>
            </div>
          </div>

          {/* Chapter List */}
          <div className="space-y-4">
            {filteredChapters.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-500">
                No NCERT chapters configured for Class {selectedCurriculumClass} {selectedCurriculumSubject}.
              </div>
            ) : (
              filteredChapters.map((chap) => (
                <div key={chap.id} className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 font-extrabold flex items-center justify-center text-base">
                        {chap.number}
                      </span>
                      <div>
                        <h4 className="text-lg font-bold text-white">{chap.title}</h4>
                        <p className="text-xs text-slate-400">{chap.topics.length} Key Curriculum Topics</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditChapter(chap)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-700 transition-all flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteChapter(chap.id, chap.title)}
                        className="p-1.5 bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Topic Tags */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                    {chap.topics.map((tp, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-slate-300">
                        • {tp}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: 3D MODELS MANAGEMENT */}
      {adminTab === 'models3d' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search 3D models..."
                  value={modelSearch}
                  onChange={(e) => setModelSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <select
                value={modelSubjectFilter}
                onChange={(e) => setModelSubjectFilter(e.target.value as any)}
                className="px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Subjects</option>
                <option value="Biology">Biology</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddModelOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
            >
              <Plus className="w-4 h-4" />
              Add 3D Model
            </button>
          </div>

          {/* Model Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((m) => (
              <div key={m.id} className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-3xl p-6 transition-all relative flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-lg text-xs font-semibold">
                      {m.subject} (Class {m.classLevel})
                    </span>
                    <button
                      onClick={() => handleDeleteModel(m.id, m.name)}
                      className="p-1.5 bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-1">{m.name}</h4>
                  <p className="text-xs text-indigo-400 font-medium mb-3">{m.category}</p>
                  <p className="text-slate-400 text-xs line-clamp-3 mb-4">{m.description}</p>
                </div>

                <div>
                  <div className="border-t border-slate-800 pt-3">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-2">Interactive Nodes ({m.nodes.length})</p>
                    <div className="flex flex-wrap gap-1.5">
                      {m.nodes.slice(0, 3).map((nd, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md text-[11px]">
                          {nd}
                        </span>
                      ))}
                      {m.nodes.length > 3 && (
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-500 rounded-md text-[11px]">
                          +{m.nodes.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AI & SYSTEM TUNING */}
      {adminTab === 'ai_settings' && (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              Gemini AI Tutor System Configuration
            </h3>

            {/* System Prompt */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                AI Tutor System Instruction Persona
              </label>
              <textarea
                rows={5}
                value={settings.systemPrompt}
                onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
                className="w-full p-4 bg-slate-800/80 border border-slate-700 rounded-2xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
              />
              <p className="text-xs text-slate-500 mt-1">This prompt dictates the teaching style, tone, and curriculum alignment of the AI Tutor.</p>
            </div>

            {/* Model & Temp Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Active Gemini Model
                </label>
                <select
                  value={settings.geminiModel}
                  onChange={(e) => setSettings({ ...settings, geminiModel: e.target.value })}
                  className="w-full p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fastest / Recommended)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Admin PIN Security Password
                </label>
                <input
                  type="text"
                  value={settings.adminPin}
                  onChange={(e) => setSettings({ ...settings, adminPin: e.target.value })}
                  className="w-full p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm font-mono tracking-wider focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
              <div>
                <div className="flex justify-between text-sm font-semibold text-slate-300 mb-2">
                  <span>Temperature (Creativity)</span>
                  <span className="text-indigo-400 font-mono">{settings.temperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.temperature}
                  onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold text-slate-300 mb-2">
                  <span>Max Tokens Output</span>
                  <span className="text-indigo-400 font-mono">{settings.maxTokens}</span>
                </div>
                <input
                  type="range"
                  min="512"
                  max="8192"
                  step="256"
                  value={settings.maxTokens}
                  onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value, 10) })}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableAiTutor}
                  onChange={(e) => setSettings({ ...settings, enableAiTutor: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 rounded"
                />
                <span className="text-sm font-medium text-slate-200">Enable AI Tutor</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableArScanner}
                  onChange={(e) => setSettings({ ...settings, enableArScanner: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 rounded"
                />
                <span className="text-sm font-medium text-slate-200">Enable AR Scanner</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableGuestRegistration}
                  onChange={(e) => setSettings({ ...settings, enableGuestRegistration: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 rounded"
                />
                <span className="text-sm font-medium text-slate-200">Guest Registration</span>
              </label>
            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-end">
              <button
                onClick={handleSaveSettings}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save AI Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: BACKUP & RESTORE */}
      {adminTab === 'backup' && (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 text-center">
            <div className="inline-flex p-4 bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 rounded-3xl mb-2">
              <Database className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-bold text-white">System Data Backup & Factory Reset</h3>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Export all curriculum books, custom 3D models, student accounts, and system parameters to a portable JSON backup file.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <button
                onClick={handleExportBackup}
                className="p-6 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 rounded-3xl text-left transition-all group"
              >
                <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Download className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Export Backup JSON</h4>
                <p className="text-slate-400 text-xs">Download full JSON snapshot of system state.</p>
              </button>

              <label className="p-6 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 rounded-3xl text-left transition-all group cursor-pointer">
                <div className="p-3 bg-purple-600/20 text-purple-400 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Import Backup JSON</h4>
                <p className="text-slate-400 text-xs">Upload JSON file to restore curriculum & models.</p>
                <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
              </label>
            </div>

            <div className="pt-8 border-t border-slate-800">
              <button
                onClick={handleFactoryReset}
                className="px-5 py-3 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 hover:text-rose-100 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Reset System to Factory Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD STUDENT */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setIsAddStudentOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">Add New Student Account</h3>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Das"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="rohan@school.edu"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Class Grade</label>
                  <select
                    value={newStudentGrade}
                    onChange={(e) => setNewStudentGrade(e.target.value as ClassLevel)}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="11th">Class 11th</option>
                    <option value="12th">Class 12th</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Target Exam</label>
                  <select
                    value={newStudentExam}
                    onChange={(e) => setNewStudentExam(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="CBSE Board">CBSE Board</option>
                    <option value="NEET UG">NEET UG</option>
                    <option value="JEE Mains">JEE Mains</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-md"
                >
                  Create Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CHAPTER */}
      {isAddChapterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setIsAddChapterOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-white mb-2">
              Add Chapter ({selectedCurriculumSubject} - Class {selectedCurriculumClass})
            </h3>

            <form onSubmit={handleAddChapterSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Chap #</label>
                  <input
                    type="number"
                    placeholder="1"
                    value={newChapterNum}
                    onChange={(e) => setNewChapterNum(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Chapter Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Thermodynamics & Heat Flow"
                    value={newChapterTitle}
                    onChange={(e) => setNewChapterTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Topics (comma-separated)</label>
                <textarea
                  rows={3}
                  placeholder="First Law of Thermodynamics, Enthalpy, Heat Capacity"
                  value={newChapterTopics}
                  onChange={(e) => setNewChapterTopics(e.target.value)}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Optional NCERT PDF Link</label>
                <input
                  type="url"
                  placeholder="https://ncert.nic.in/pdf/..."
                  value={newChapterPdf}
                  onChange={(e) => setNewChapterPdf(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddChapterOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-md"
                >
                  Save Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT CHAPTER */}
      {editingChapter && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setEditingChapter(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-white mb-2">Edit Chapter #{editingChapter.number}</h3>

            <form onSubmit={handleSaveEditedChapter} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Chapter Title</label>
                <input
                  type="text"
                  required
                  value={editChapterTitle}
                  onChange={(e) => setEditChapterTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Topics (comma-separated)</label>
                <textarea
                  rows={3}
                  value={editChapterTopics}
                  onChange={(e) => setEditChapterTopics(e.target.value)}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">PDF Link</label>
                <input
                  type="url"
                  value={editChapterPdf}
                  onChange={(e) => setEditChapterPdf(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingChapter(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-md"
                >
                  Update Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD 3D MODEL */}
      {isAddModelOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setIsAddModelOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">Add New 3D/AR Model</h3>

            <form onSubmit={handleAddModelSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Model Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mitochondria Organelle"
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Subject</label>
                  <select
                    value={newModelSubject}
                    onChange={(e) => setNewModelSubject(e.target.value as SubjectName)}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Biology">Biology</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Class Level</label>
                  <select
                    value={newModelGrade}
                    onChange={(e) => setNewModelGrade(e.target.value as ClassLevel)}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="11th">Class 11th</option>
                    <option value="12th">Class 12th</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Category / Domain</label>
                <input
                  type="text"
                  placeholder="Cell Biology / Anatomy"
                  value={newModelCategory}
                  onChange={(e) => setNewModelCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Detailed anatomical breakdown..."
                  value={newModelDescription}
                  onChange={(e) => setNewModelDescription(e.target.value)}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Interactive Node Labels (comma-separated)</label>
                <input
                  type="text"
                  placeholder="Outer Membrane, Inner Membrane, Cristae, Matrix"
                  value={newModelNodes}
                  onChange={(e) => setNewModelNodes(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModelOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold shadow-md"
                >
                  Add Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
