import React, { useState, useEffect } from 'react';
import { StudyTask, SubjectName, ClassLevel } from '../types';
import { NcertChapter } from '../ncertData';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Clock, 
  Play, 
  Pause, 
  Sparkles, 
  BookOpen, 
  CheckCircle,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  GraduationCap,
  Send,
  Lightbulb
} from 'lucide-react';

interface TaskPlannerProps {
  tasks: StudyTask[];
  selectedSubject: SubjectName;
  classLevel: ClassLevel;
  chapters: NcertChapter[];
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
  onAskTutor?: (query: string) => void;
}

export default function TaskPlanner({
  tasks,
  selectedSubject,
  classLevel,
  chapters,
  onAddTask,
  onImportChapterPlanner,
  onToggleTask,
  onDeleteTask,
  onUpdateStudyTime,
  totalStudyTime,
  onAskTutor,
}: TaskPlannerProps) {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'custom' | 'ai' | 'guide'>('syllabus');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [instantDoubtText, setInstantDoubtText] = useState('');

  // Expanded concept states for the Study Guide accordion
  const [expandedConceptIdx, setExpandedConceptIdx] = useState<number | null>(null);
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState<number | null>(null);

  const [studyGuide, setStudyGuide] = useState<any>(() => {
    try {
      const saved = localStorage.getItem(`planner_guide_${classLevel}_${selectedSubject}`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Chapter-wise Pop up planner state
  const [showChapterPopup, setShowChapterPopup] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [replaceExisting, setReplaceExisting] = useState(true);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [genPlanError, setGenPlanError] = useState('');

  // Active Chapter Name state
  const [activeChapterName, setActiveChapterName] = useState<string>(() => {
    return localStorage.getItem(`planner_active_chap_${classLevel}_${selectedSubject}`) || '';
  });

  // Track subject/classLevel changes and auto-open chapter selector popup if none set
  useEffect(() => {
    const saved = localStorage.getItem(`planner_active_chap_${classLevel}_${selectedSubject}`);
    setActiveChapterName(saved || '');
    
    try {
      const savedGuide = localStorage.getItem(`planner_guide_${classLevel}_${selectedSubject}`);
      setStudyGuide(savedGuide ? JSON.parse(savedGuide) : null);
    } catch {
      setStudyGuide(null);
    }

    if (!saved) {
      setShowChapterPopup(true);
    }
  }, [selectedSubject, classLevel]);

  // Timer state
  const [timerTaskId, setTimerTaskId] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Filter tasks based on subject and classLevel
  const subjectTasks = tasks.filter(
    (t) => t.subject === selectedSubject && t.classLevel === classLevel
  );

  const syllabusTasks = subjectTasks.filter((t) => t.type === 'syllabus');
  const customTasks = subjectTasks.filter((t) => t.type === 'custom' || t.type === 'scanned');
  const aiTasks = subjectTasks.filter((t) => t.type === 'ai-generated');

  // Set default selected chapter in dropdown
  useEffect(() => {
    if (chapters && chapters.length > 0) {
      setSelectedChapterId(chapters[0].id);
    } else {
      setSelectedChapterId('');
    }
  }, [chapters]);

  const handleGenerateChapterPlan = async () => {
    const targetChapter = chapters.find(c => c.id === selectedChapterId);
    if (!targetChapter) return;

    setIsGeneratingPlan(true);
    setGenPlanError('');

    try {
      const response = await fetch('/api/planner/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classLevel,
          subject: selectedSubject,
          chapterNumber: targetChapter.number,
          chapterTitle: targetChapter.title,
          topics: targetChapter.topics || []
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Failed with status ${response.status}`);
      }

      const data = await response.json();
      const generatedTasksList: Array<{ title: string; description: string; type: StudyTask['type'] }> = data.tasks || [];
      const guideData = data.studyGuide || null;

      const chapterName = `Chapter ${targetChapter.number}: ${targetChapter.title}`;
      localStorage.setItem(`planner_active_chap_${classLevel}_${selectedSubject}`, chapterName);
      setActiveChapterName(chapterName);

      if (guideData) {
        localStorage.setItem(`planner_guide_${classLevel}_${selectedSubject}`, JSON.stringify(guideData));
        setStudyGuide(guideData);
      } else {
        localStorage.removeItem(`planner_guide_${classLevel}_${selectedSubject}`);
        setStudyGuide(null);
      }

      // Reset accordion state on new generation
      setExpandedConceptIdx(null);
      setExpandedQuestionIdx(null);

      if (onImportChapterPlanner) {
        onImportChapterPlanner(chapterName, generatedTasksList, selectedSubject, classLevel, replaceExisting);
      }

      // Automatically switch to the "Study Guide & Solutions" tab so they can see the generated answers immediately!
      setActiveTab('guide');

      setShowChapterPopup(false);
    } catch (err: any) {
      console.error("Gemini study plan generation error:", err);
      setGenPlanError(err.message || 'An error occurred while generating study plan.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Timer ticking effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerTaskId) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerTaskId]);

  const handleStartTimer = (taskId: string) => {
    if (timerTaskId === taskId) {
      setIsTimerRunning(true);
    } else {
      // Save any existing timer progress before switching
      if (timerTaskId && timerSeconds > 0) {
        onUpdateStudyTime(timerSeconds);
      }
      setTimerTaskId(taskId);
      setTimerSeconds(0);
      setIsTimerRunning(true);
    }
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
    if (timerSeconds > 0) {
      onUpdateStudyTime(timerSeconds);
      setTimerSeconds(0);
    }
  };

  const handleStopTimer = () => {
    setIsTimerRunning(false);
    if (timerSeconds > 0) {
      onUpdateStudyTime(timerSeconds);
    }
    setTimerTaskId(null);
    setTimerSeconds(0);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle.trim(), newTaskDesc.trim(), 'custom');
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Find active task details
  const activeTask = tasks.find((t) => t.id === timerTaskId);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Column: Tasks Manager */}
      <div className="lg:col-span-2 bg-white border border-card-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-4 mb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-secondary" />
                  <span>Syllabus & Task Planner</span>
                </h2>
                <button
                  onClick={() => setShowChapterPopup(true)}
                  className="px-2.5 py-1 text-[10px] font-bold bg-secondary/15 text-secondary hover:bg-secondary/25 hover:scale-[1.02] active:scale-[0.98] rounded-md flex items-center gap-1 transition-all cursor-pointer"
                  title="Generate chapter-specific task plan"
                  id="btn_open_chapter_planner"
                >
                  <Sparkles className="w-3 h-3 text-secondary animate-pulse" />
                  <span>Generate Chapter Plan</span>
                </button>
              </div>
              <p className="text-xs text-charcoal/60 mt-0.5">
                Class {classLevel} • {selectedSubject} Curricular Goals
              </p>
            </div>

            {/* Sub-tabs */}
            <div className="flex bg-surface-container-low p-1 rounded-lg self-start sm:self-auto border border-card-border">
              <button
                onClick={() => setActiveTab('syllabus')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'syllabus'
                    ? 'bg-white text-primary shadow-2xs'
                    : 'text-charcoal/60 hover:text-primary'
                }`}
                id="tab_syllabus"
              >
                Curriculum
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'custom'
                    ? 'bg-white text-primary shadow-2xs'
                    : 'text-charcoal/60 hover:text-primary'
                }`}
                id="tab_custom"
              >
                My Tasks
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'ai'
                    ? 'bg-white text-primary shadow-2xs'
                    : 'text-charcoal/60 hover:text-primary'
                }`}
                id="tab_ai_tasks"
              >
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                <span>AI Generated</span>
              </button>
              <button
                onClick={() => setActiveTab('guide')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'guide'
                    ? 'bg-white text-primary shadow-2xs'
                    : 'text-charcoal/60 hover:text-primary'
                }`}
                id="tab_study_guide"
              >
                <BookOpen className="w-3.5 h-3.5 text-secondary" />
                <span>Study Guide & Solutions</span>
              </button>
            </div>
          </div>

          {/* Task Lists Rendering */}
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {activeTab === 'syllabus' && (
              <>
                {/* Active Chapter Task Manager Bar */}
                <div className="mb-4 bg-slate-50 border border-card-border rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-3xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 bg-primary/5 rounded-lg shrink-0">
                      <BookOpen className="w-4 h-4 text-secondary" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Active Target Chapter</span>
                      <h4 className="text-xs font-bold text-primary truncate">
                        {activeChapterName ? activeChapterName : 'None Selected'}
                      </h4>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowChapterPopup(true)}
                    className="w-full sm:w-auto px-3.5 py-1.5 bg-[#001736] hover:bg-[#00275c] text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    id="task_bar_select_chapter"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
                    <span>{activeChapterName ? 'Change Chapter' : 'Select Chapter & Proceed'}</span>
                  </button>
                </div>

                {syllabusTasks.length === 0 ? (
                  <div className="text-center py-12 text-charcoal/40 text-sm">No curriculum syllabus items loaded.</div>
                ) : (
                  syllabusTasks.map((task) => (
                    <div 
                      key={task.id}
                      className={`flex items-start justify-between p-3.5 border rounded-lg transition-all ${
                        task.completed 
                          ? 'bg-emerald-50/40 border-emerald-100 opacity-80' 
                          : 'bg-white border-card-border hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <button 
                          onClick={() => onToggleTask(task.id)}
                          className="mt-0.5 text-primary hover:text-secondary transition-colors shrink-0 cursor-pointer"
                        >
                          {task.completed ? (
                            <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                          ) : (
                            <Square className="w-5 h-5 text-charcoal/30 hover:text-primary" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <h4 className={`text-sm font-semibold text-primary truncate ${task.completed ? 'line-through text-charcoal/40' : ''}`}>
                            {task.title}
                          </h4>
                          <p className="text-xs text-charcoal/60 mt-0.5 line-clamp-1">{task.description}</p>
                        </div>
                      </div>

                      {/* Timer triggers */}
                      {!task.completed && (
                        <div className="flex items-center gap-2 ml-4 shrink-0">
                          {timerTaskId === task.id && isTimerRunning ? (
                            <button
                              onClick={handlePauseTimer}
                              className="p-1 bg-amber-500 text-white rounded-md hover:bg-amber-600 shadow-xs transition-colors"
                              title="Pause Study Timer"
                              id={`pause_btn_${task.id}`}
                            >
                              <Pause className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartTimer(task.id)}
                              className="p-1 bg-primary text-white rounded-md hover:bg-primary-light shadow-xs transition-colors"
                              title="Start Live Study Session"
                              id={`start_btn_${task.id}`}
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </>
            )}

            {activeTab === 'custom' && (
              <>
                {customTasks.length === 0 ? (
                  <div className="text-center py-12 text-charcoal/40 text-sm">
                    No custom tasks created yet. Create one below to organize your studies!
                  </div>
                ) : (
                  customTasks.map((task) => (
                    <div 
                      key={task.id}
                      className={`flex items-start justify-between p-3.5 border rounded-lg transition-all ${
                        task.completed 
                          ? 'bg-emerald-50/40 border-emerald-100 opacity-80' 
                          : 'bg-white border-card-border hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <button 
                          onClick={() => onToggleTask(task.id)}
                          className="mt-0.5 text-primary hover:text-secondary transition-colors shrink-0 cursor-pointer"
                        >
                          {task.completed ? (
                            <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                          ) : (
                            <Square className="w-5 h-5 text-charcoal/30 hover:text-primary" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <h4 className={`text-sm font-semibold text-primary truncate ${task.completed ? 'line-through text-charcoal/40' : ''}`}>
                            {task.title}
                          </h4>
                          <p className="text-xs text-charcoal/60 mt-0.5 line-clamp-1">{task.description}</p>
                          {task.type === 'scanned' && (
                            <span className="inline-block mt-1 text-[10px] bg-secondary/10 text-secondary font-mono font-semibold px-2 py-0.5 rounded-full">
                              Scanned Model Task
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4 shrink-0">
                        {!task.completed && (
                          timerTaskId === task.id && isTimerRunning ? (
                            <button
                              onClick={handlePauseTimer}
                              className="p-1 bg-amber-500 text-white rounded-md hover:bg-amber-600 shadow-xs transition-colors"
                              title="Pause Study Timer"
                              id={`pause_custom_${task.id}`}
                            >
                              <Pause className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartTimer(task.id)}
                              className="p-1 bg-primary text-white rounded-md hover:bg-primary-light shadow-xs transition-colors"
                              title="Start Live Study Session"
                              id={`start_custom_${task.id}`}
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          )
                        )}
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1 text-charcoal/40 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete Task"
                          id={`del_custom_${task.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {activeTab === 'ai' && (
              <>
                {aiTasks.length === 0 ? (
                  <div className="text-center py-8 text-charcoal/40 text-sm px-6">
                    <AlertCircle className="w-8 h-8 mx-auto text-charcoal/30 mb-2" />
                    <p className="font-semibold text-primary">No AI generated study checklists loaded.</p>
                    <p className="text-xs text-charcoal/60 mt-1">
                      Navigate to the **AI Tutor** tab in the sidebar and ask questions about difficult concepts. The AI will provide custom study tasks you can import directly!
                    </p>
                  </div>
                ) : (
                  aiTasks.map((task) => (
                    <div 
                      key={task.id}
                      className={`flex items-start justify-between p-3.5 border rounded-lg transition-all ${
                        task.completed 
                          ? 'bg-emerald-50/40 border-emerald-100 opacity-80' 
                          : 'bg-white border-card-border hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <button 
                          onClick={() => onToggleTask(task.id)}
                          className="mt-0.5 text-primary hover:text-secondary transition-colors shrink-0 cursor-pointer"
                        >
                          {task.completed ? (
                            <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                          ) : (
                            <Square className="w-5 h-5 text-charcoal/30 hover:text-primary" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <h4 className={`text-sm font-semibold text-primary truncate ${task.completed ? 'line-through text-charcoal/40' : ''}`}>
                            {task.title}
                          </h4>
                          <p className="text-xs text-charcoal/60 mt-0.5 line-clamp-1">{task.description}</p>
                          <span className="inline-block mt-1 text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 font-mono font-semibold px-2 py-0.5 rounded-full">
                            Tutor Recommended
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4 shrink-0">
                        {!task.completed && (
                          timerTaskId === task.id && isTimerRunning ? (
                            <button
                              onClick={handlePauseTimer}
                              className="p-1 bg-amber-500 text-white rounded-md hover:bg-amber-600 shadow-xs transition-colors"
                              title="Pause Study Timer"
                              id={`pause_ai_${task.id}`}
                            >
                              <Pause className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartTimer(task.id)}
                              className="p-1 bg-primary text-white rounded-md hover:bg-primary-light shadow-xs transition-colors"
                              title="Start Live Study Session"
                              id={`start_ai_${task.id}`}
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          )
                        )}
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1 text-charcoal/40 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete Task"
                          id={`del_ai_${task.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {activeTab === 'guide' && (
              <>
                {!studyGuide ? (
                  <div className="text-center py-12 text-charcoal/40 text-sm px-4">
                    <BookOpen className="w-12 h-12 mx-auto text-charcoal/20 mb-3" />
                    <p className="font-bold text-primary">No Study Guide Loaded yet</p>
                    <p className="text-xs text-charcoal/60 mt-1 max-w-sm mx-auto">
                      Click <span className="text-secondary font-bold">"Generate Chapter Plan"</span> at the top, select your NCERT chapter, and hit "Generate" to construct custom checklists along with detailed solutions from Gemini!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Intro Overview Card */}
                    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-secondary/15 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-secondary mb-1.5">
                        <GraduationCap className="w-4 h-4" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider">AI Comprehensive Study Guide & Answers</span>
                      </div>
                      <p className="text-xs text-charcoal/80 leading-relaxed font-medium">
                        {studyGuide.introduction || `Study resources and verified NCERT solutions for your curriculum.`}
                      </p>
                    </div>

                    {/* Section 1: Concept Deeper Dives */}
                    {studyGuide.keyConcepts && studyGuide.keyConcepts.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-secondary" />
                          <span>Core Syllabus Explanations</span>
                        </h4>
                        <div className="space-y-2">
                          {studyGuide.keyConcepts.map((item: any, idx: number) => {
                            const isExpanded = expandedConceptIdx === idx;
                            return (
                              <div key={idx} className="border border-card-border rounded-lg bg-surface-container-low overflow-hidden transition-all">
                                <button
                                  onClick={() => setExpandedConceptIdx(isExpanded ? null : idx)}
                                  className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors font-semibold text-xs text-primary"
                                >
                                  <span className="truncate">{item.concept}</span>
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-charcoal/50 shrink-0" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-charcoal/50 shrink-0" />
                                  )}
                                </button>
                                {isExpanded && (
                                  <div className="p-3.5 pt-0 border-t border-card-border/60 bg-white text-xs text-charcoal/80 leading-relaxed space-y-2 animate-fade-in">
                                    <p dangerouslySetInnerHTML={{ __html: item.explanation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Section 2: Exemplar Textbook Q&A */}
                    {studyGuide.solvedQuestions && studyGuide.solvedQuestions.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
                          <span>NCERT Solved Exercises & Answers</span>
                        </h4>
                        <div className="space-y-2">
                          {studyGuide.solvedQuestions.map((item: any, idx: number) => {
                            const isExpanded = expandedQuestionIdx === idx;
                            return (
                              <div key={idx} className="border border-card-border rounded-lg bg-white overflow-hidden transition-all">
                                <button
                                  onClick={() => setExpandedQuestionIdx(isExpanded ? null : idx)}
                                  className="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-50/50 transition-colors text-xs font-bold text-primary"
                                >
                                  <span className="leading-snug pr-4">{item.question}</span>
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-charcoal/50 shrink-0" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-charcoal/50 shrink-0" />
                                  )}
                                </button>
                                {isExpanded && (
                                  <div className="p-4 pt-1.5 border-t border-card-border/60 bg-slate-50 text-xs text-charcoal/85 leading-relaxed space-y-2.5 animate-fade-in">
                                    <div className="flex items-start gap-1.5 bg-emerald-50/60 border border-emerald-100/50 p-2.5 rounded-lg">
                                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded uppercase font-mono tracking-wider mt-0.5 shrink-0">Model Solution</span>
                                      <p className="text-[11px] font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: item.answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Section 3: Exam Tips */}
                    {studyGuide.examTips && studyGuide.examTips.length > 0 && (
                      <div className="bg-amber-50/50 border border-amber-100/70 rounded-xl p-4 space-y-2">
                        <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>CBSE High-Yield Revision Tips</span>
                        </h4>
                        <ul className="list-disc list-inside space-y-1.5 pl-1">
                          {studyGuide.examTips.map((tip: string, idx: number) => (
                            <li key={idx} className="text-xs text-amber-950/80 leading-relaxed font-semibold">
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Portal Doubt Input */}
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4.5 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                          <Sparkles className="w-4 h-4 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-primary">Instant Chapter Doubt Solver</h4>
                          <p className="text-[10px] text-charcoal/60">Ask any custom questions or explanations directly to your AI Tutor.</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Explain visual structures, equations, or exam questions..."
                          value={instantDoubtText}
                          onChange={(e) => setInstantDoubtText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && instantDoubtText.trim() && onAskTutor) {
                              onAskTutor(instantDoubtText.trim());
                              setInstantDoubtText('');
                            }
                          }}
                          className="flex-1 text-xs border border-card-border p-2.5 rounded-lg focus:border-primary focus:outline-hidden bg-white shadow-3xs"
                        />
                        <button
                          onClick={() => {
                            if (instantDoubtText.trim() && onAskTutor) {
                              onAskTutor(instantDoubtText.trim());
                              setInstantDoubtText('');
                            }
                          }}
                          className="bg-primary hover:bg-primary-light text-white text-xs px-3 py-2.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Ask AI</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Task Creator Block (only visible under My Tasks) */}
        {activeTab === 'custom' && (
          <form onSubmit={handleCreateTask} className="mt-6 pt-4 border-t border-card-border">
            <h4 className="text-xs font-bold text-primary mb-3">Add Custom Study Task</h4>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Task title (e.g. Prepare notes for Chapter 2)"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full text-xs border border-card-border p-2.5 rounded-lg focus:border-primary focus:outline-hidden transition-all"
                id="input_new_task_title"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Short description (optional)"
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="flex-1 text-xs border border-card-border p-2.5 rounded-lg focus:border-primary focus:outline-hidden transition-all"
                  id="input_new_task_desc"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-light text-white text-xs px-4 py-2.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all shrink-0"
                  id="btn_add_task"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Right Column: Live Study Timer Widget */}
      <div className="bg-[#001736] text-white border border-primary-light rounded-xl p-6 shadow-md flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-mono font-bold tracking-wider text-secondary flex items-center gap-1.5 uppercase">
            <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
            <span>Active Study Timer</span>
          </h3>

          {activeTask ? (
            <div className="mt-4">
              <p className="text-xs text-white/60 font-mono">CURRENT TASK</p>
              <h4 className="text-base font-bold text-white mt-1 line-clamp-1">{activeTask.title}</h4>
              <p className="text-xs text-white/50 mt-1 line-clamp-2 italic">"{activeTask.description || 'No description provided'}"</p>

              <div className="my-8 text-center">
                <div className="font-mono text-4xl sm:text-5xl font-bold tracking-widest text-secondary drop-shadow-sm select-none">
                  {formatTime(timerSeconds)}
                </div>
                <p className="text-[10px] text-white/40 mt-1.5 font-mono uppercase tracking-wider">
                  Live session ticking
                </p>
              </div>
            </div>
          ) : (
            <div className="my-10 text-center py-6">
              <Clock className="w-12 h-12 mx-auto text-white/20 mb-3 animate-pulse" />
              <p className="text-sm font-semibold text-white/80">No Active Study Session</p>
              <p className="text-xs text-white/50 mt-1.5 px-4">
                Click the **Play** icon next to any study checklist task to launch a timed focus session and record study hours!
              </p>
            </div>
          )}
        </div>

        <div>
          {activeTask && (
            <div className="flex gap-2 pt-4 border-t border-white/10">
              {isTimerRunning ? (
                <button
                  onClick={handlePauseTimer}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-xs py-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  id="btn_timer_pause"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause Timer</span>
                </button>
              ) : (
                <button
                  onClick={() => handleStartTimer(activeTask.id)}
                  className="flex-1 bg-secondary hover:bg-secondary-dark text-white text-xs py-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  id="btn_timer_resume"
                >
                  <Play className="w-4 h-4" />
                  <span>Resume Timer</span>
                </button>
              )}
              <button
                onClick={handleStopTimer}
                className="bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-2.5 rounded-lg font-bold cursor-pointer transition-all"
                id="btn_timer_stop"
              >
                Stop & Save
              </button>
            </div>
          )}

          {/* Aggregate Stats Bar */}
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs font-mono">
            <span className="text-white/60">Total Tracked Today:</span>
            <span className="text-secondary font-bold">{formatTime(totalStudyTime + (isTimerRunning ? timerSeconds : 0))}</span>
          </div>
        </div>
      </div>

    </div>

      {/* CHAPTER PLANNER POPUP MODAL */}
      {showChapterPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in" id="chapter_planner_modal">
          <div className="bg-white rounded-xl border border-card-border shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100">
            {/* Header */}
            <div className="bg-[#001736] p-4 text-white flex justify-between items-center border-b border-[#00275c]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
                <div>
                  <h3 className="font-bold text-sm">Chapter-wise Study Planner</h3>
                  <p className="text-[10px] text-white/70">Class {classLevel} • {selectedSubject}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowChapterPopup(false)}
                disabled={isGeneratingPlan}
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-1 cursor-pointer transition-colors disabled:opacity-40"
                id="close_chapter_modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {genPlanError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs leading-relaxed flex items-start gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">Generation Failed</p>
                    <p className="text-[11px]">{genPlanError}</p>
                  </div>
                </div>
              )}

              {isGeneratingPlan ? (
                <div className="py-8 flex flex-col items-center justify-center space-y-3">
                  <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
                  <div className="text-center">
                    <p className="text-xs font-bold text-primary animate-pulse">Consulting Gemini AI...</p>
                    <p className="text-[10px] text-charcoal/60 mt-1">Designing personalized task milestones with topic deep-dives.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-primary block">Select textbook chapter:</label>
                    <select
                      value={selectedChapterId}
                      onChange={(e) => setSelectedChapterId(e.target.value)}
                      disabled={isGeneratingPlan}
                      className="w-full text-xs border border-card-border p-2.5 rounded-lg focus:border-primary focus:outline-hidden bg-surface-container-low transition-all font-semibold text-primary"
                      id="select_chapter_dropdown"
                    >
                      {chapters.map((chap) => (
                        <option key={chap.id} value={chap.id}>
                          Chapter {chap.number}: {chap.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Topics Preview Box */}
                  {chapters.find(c => c.id === selectedChapterId) && (
                    <div className="bg-slate-50 border border-card-border rounded-lg p-3 space-y-2">
                      <span className="text-[10px] font-mono font-bold text-secondary uppercase tracking-wider block">Syllabus Topics to Include:</span>
                      <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                        {chapters.find(c => c.id === selectedChapterId)?.topics.map((topic, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-charcoal/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 animate-pulse" />
                            <span className="truncate">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Option: Replace or Merge */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="replace_existing_checkbox"
                      checked={replaceExisting}
                      onChange={(e) => setReplaceExisting(e.target.checked)}
                      disabled={isGeneratingPlan}
                      className="rounded border-card-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="replace_existing_checkbox" className="text-xs font-semibold text-charcoal/80 cursor-pointer">
                      Replace current checklist with this chapter's tasks
                    </label>
                  </div>

                  <div className="text-[10px] text-charcoal/50 leading-relaxed bg-amber-50/50 border border-amber-100 p-2.5 rounded-md flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      This automatically creates a comprehensive study and revision tracker with milestone goals designed precisely around the selected CBSE syllabus structure.
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-50 p-4 border-t border-card-border flex justify-end gap-2.5">
              <button
                onClick={() => setShowChapterPopup(false)}
                disabled={isGeneratingPlan}
                className="text-xs font-bold text-charcoal/60 hover:text-primary px-3 py-2 rounded-md transition-colors cursor-pointer disabled:opacity-40"
                id="btn_cancel_chapter_planner"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateChapterPlan}
                disabled={!selectedChapterId || isGeneratingPlan}
                className="bg-primary hover:bg-primary-light disabled:opacity-50 text-white text-xs px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                id="btn_confirm_chapter_planner"
              >
                <Sparkles className="w-4 h-4 text-secondary" />
                <span>{isGeneratingPlan ? 'Generating...' : 'Generate Study Plan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
