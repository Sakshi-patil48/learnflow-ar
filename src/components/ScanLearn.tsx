import React, { useState, useEffect } from 'react';
import { 
  Upload, Camera, Cpu, Sparkles, CheckCircle, ArrowRight, Trash2, 
  FileText, MessageSquare, ExternalLink, ZoomIn, ZoomOut, RotateCcw, 
  BookOpen, Award, FileSpreadsheet, HelpCircle, AlertTriangle, 
  ChevronRight, ChevronDown, Check, X, Compass, Lightbulb, GraduationCap
} from 'lucide-react';
import { SubjectName, ClassLevel } from '../types';

interface ScanLearnProps {
  selectedSubject: SubjectName;
  classLevel: ClassLevel;
  onScanComplete: (model: {
    name: string;
    category: string;
    description: string;
    nodes: string[];
    tasks: Array<{ title: string; description: string }>;
  }) => void;
  onAskAIAboutBook?: (file: { name: string; mimeType: string; base64: string }, customPrompt?: string) => void;
}

type TabType = 'revision' | 'concepts' | 'formulas' | 'memory' | 'practice' | 'diagrams' | '3d';

export default function ScanLearn({ selectedSubject, classLevel, onScanComplete, onAskAIAboutBook }: ScanLearnProps) {
  const [pageDescription, setPageDescription] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState(0);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; mimeType: string; base64: string; url: string } | null>(null);
  const [askAIPrompt, setAskAIPrompt] = useState('');

  // Active workspace state
  const [activeTab, setActiveTab] = useState<TabType>('revision');
  
  // Tab 2 Concept card reveals
  const [revealedTerms, setRevealedTerms] = useState<Record<string, boolean>>({});
  
  // Tab 5 Practice Arena MCQ answers & reveals
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  // Tab 6 Diagrams interaction
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedDiagramIndex, setSelectedDiagramIndex] = useState(0);
  const [activeDiagramLabel, setActiveDiagramLabel] = useState<string | null>(null);

  // Loading steps text list
  const loadingSteps = [
    { label: "Uploading & registering document", range: [0, 25] },
    { label: "Running high-fidelity OCR parser", range: [25, 50] },
    { label: "Analyzing academic context & standards", range: [50, 75] },
    { label: "Synthesizing comprehensive study workspace", range: [75, 100] }
  ];

  // Auto transition loading steps based on progress
  useEffect(() => {
    if (isScanning) {
      const currentStep = loadingSteps.findIndex(
        step => scanProgress >= step.range[0] && scanProgress <= step.range[1]
      );
      if (currentStep !== -1) {
        setScanStep(currentStep);
      }
    }
  }, [scanProgress, isScanning]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    const isPdf = file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/');
    if (!isPdf && !isImage) {
      alert("Please upload a PDF document or study image file.");
      return;
    }
    
    const url = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      const base64 = base64Data.split(',')[1];
      setUploadedFile({
        name: file.name,
        mimeType: file.type,
        base64,
        url
      });
      setPageDescription(`Study book/notes file: ${file.name.replace(/\.[^/.]+$/, "")}`);
    };
    reader.readAsDataURL(file);
  };

  const handleAskAITutor = () => {
    if (!uploadedFile || !onAskAIAboutBook) return;
    const promptText = askAIPrompt.trim() || `Hello! I have uploaded this study book: "${uploadedFile.name}". Can you analyze this chapter/notes and provide study guidance on its core concepts?`;
    onAskAIAboutBook(
      {
        name: uploadedFile.name,
        mimeType: uploadedFile.mimeType,
        base64: uploadedFile.base64
      },
      promptText
    );
  };

  const triggerScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setScanProgress(0);
    setScanResult(null);
    setScanError(null);
    setMcqAnswers({});
    setRevealedAnswers({});
    setRevealedTerms({});
    setActiveDiagramLabel(null);
    setZoomLevel(1);

    // Smooth simulated progress bar showing multi-step feedback
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 120);

    try {
      const response = await fetch('/api/scan/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageDescription: pageDescription.trim() || `Chapter overview on advanced ${selectedSubject}`,
          selectedClass: classLevel,
          selectedSubject: selectedSubject,
          attachedFile: uploadedFile ? {
            name: uploadedFile.name,
            mimeType: uploadedFile.mimeType,
            base64: uploadedFile.base64
          } : null
        }),
      });

      const data = await response.json();
      
      // Keep loading on screen slightly so user enjoys the transition
      setTimeout(() => {
        clearInterval(interval);
        setScanProgress(100);
        
        if (data.error) {
          setScanError(data.error);
        } else {
          setScanResult(data.workspace);
          setActiveTab('revision');
          if (data.workspace.diagrams && data.workspace.diagrams.length > 0) {
            setSelectedDiagramIndex(0);
            if (data.workspace.diagrams[0].labels && data.workspace.diagrams[0].labels.length > 0) {
              setActiveDiagramLabel(data.workspace.diagrams[0].labels[0]);
            }
          }
        }
        setIsScanning(false);
      }, 2500);

    } catch (err: any) {
      console.error("Workspace creation failed:", err);
      clearInterval(interval);
      setScanProgress(100);
      setScanError("Failed to communicate with document analyzer. Please try again or verify your API configuration.");
      setIsScanning(false);
    }
  };

  const handleAddResultToLibrary = () => {
    if (scanResult && scanResult.model) {
      // Package model correctly for onScanComplete
      const modelPayload = {
        name: scanResult.model.name || scanResult.title,
        category: scanResult.model.category || selectedSubject,
        description: scanResult.model.description || scanResult.summary,
        nodes: scanResult.model.nodes || (scanResult.keyConcepts ? scanResult.keyConcepts.map((k: any) => k.concept) : []),
        tasks: scanResult.model.tasks || (scanResult.importantPoints ? scanResult.importantPoints.map((p: string) => ({ title: p, description: `Study detail for ${p}` })) : [])
      };
      onScanComplete(modelPayload);
      setScanResult(null);
      setPageDescription('');
      setUploadedFile(null);
    }
  };

  const handleResetFile = () => {
    if (uploadedFile) {
      try { URL.revokeObjectURL(uploadedFile.url); } catch (e) {}
    }
    setUploadedFile(null);
    setPageDescription('');
  };

  // Simple Markdown inline formatter for revision notes
  const renderRevisionNotes = (notesText: string) => {
    if (!notesText) return null;
    return notesText.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('###')) {
        return <h4 key={idx} className="text-sm font-bold text-primary mt-4 mb-2 font-mono uppercase tracking-wide">{trimmed.replace(/^###\s*/, '')}</h4>;
      }
      if (trimmed.startsWith('##')) {
        return <h3 key={idx} className="text-base font-black text-primary mt-6 mb-3 border-b border-card-border pb-1 font-sans">{trimmed.replace(/^##\s*/, '')}</h3>;
      }
      if (trimmed.startsWith('#')) {
        return <h2 key={idx} className="text-lg font-black text-[#fe6a34] mt-8 mb-4 font-sans">{trimmed.replace(/^#\s*/, '')}</h2>;
      }
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        return <li key={idx} className="text-xs text-charcoal/80 list-disc ml-5 mb-1.5 leading-relaxed">{trimmed.replace(/^[-*]\s*/, '')}</li>;
      }
      // Replace bold **text**
      const parts = line.split(/\*\*(.*?)\*\*/g);
      const renderedLine = parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-primary font-bold">{part}</strong> : part);
      return <p key={idx} className="text-xs text-charcoal/70 mb-2 leading-relaxed">{renderedLine}</p>;
    });
  };

  // Draw subject-specific dynamic SVG vector diagram
  const renderDynamicSvg = () => {
    const isBiology = selectedSubject === 'Biology' || scanResult?.title?.toLowerCase().includes('cell') || scanResult?.title?.toLowerCase().includes('heart');
    const isChemistry = selectedSubject === 'Chemistry' || scanResult?.title?.toLowerCase().includes('bond') || scanResult?.title?.toLowerCase().includes('atom');
    const isPhysics = selectedSubject === 'Physics' || scanResult?.title?.toLowerCase().includes('force') || scanResult?.title?.toLowerCase().includes('magnetic') || scanResult?.title?.toLowerCase().includes('orbit');

    const labels = scanResult?.diagrams?.[selectedDiagramIndex]?.labels || ["Part A", "Part B", "Part C", "Part D"];

    if (isBiology) {
      // Cell or anatomical structures
      return (
        <svg viewBox="0 0 400 400" className="w-full h-full max-h-[340px]" style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s' }}>
          {/* Hexagonal Outer Wall */}
          <polygon points="200,30 340,110 340,290 200,370 60,290 60,110" fill="#f1fcf5" stroke="#16a34a" strokeWidth="8" strokeLinejoin="round" />
          <polygon points="200,42 325,115 325,285 200,358 75,285 75,115" fill="none" stroke="#4ade80" strokeWidth="3" />
          
          {/* Vacuole */}
          <path d="M110,130 Q170,110 210,150 T160,280 Q100,260 110,130" fill="#e0f2fe" stroke="#0284c7" strokeWidth="3" className="cursor-pointer hover:fill-[#bae6fd] transition-all" onClick={() => setActiveDiagramLabel(labels[0] || 'Vacuole')} />
          
          {/* Nucleus */}
          <circle cx="270" cy="230" r="45" fill="#f3e8ff" stroke="#7e22ce" strokeWidth="4" className="cursor-pointer hover:fill-[#e9d5ff] transition-all" onClick={() => setActiveDiagramLabel(labels[1] || 'Nucleus')} />
          <circle cx="270" cy="230" r="15" fill="#a855f7" />

          {/* Mitochondria 1 */}
          <g className="cursor-pointer" onClick={() => setActiveDiagramLabel(labels[2] || 'Mitochondria')}>
            <ellipse cx="140" cy="290" rx="25" ry="12" transform="rotate(-15 140 290)" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
            <path d="M125,290 Q140,285 155,292" fill="none" stroke="#d97706" strokeWidth="2" />
          </g>

          {/* Chloroplast 1 */}
          <g className="cursor-pointer" onClick={() => setActiveDiagramLabel(labels[3] || 'Chloroplast')}>
            <ellipse cx="250" cy="90" rx="28" ry="14" transform="rotate(20 250 90)" fill="#dcfce7" stroke="#15803d" strokeWidth="2" />
            <line x1="230" y1="90" x2="270" y2="90" stroke="#15803d" strokeWidth="1.5" />
            <line x1="240" y1="83" x2="260" y2="97" stroke="#15803d" strokeWidth="1.5" />
          </g>

          {/* Hotspots Indicator circles linked to active part */}
          <circle cx="110" cy="180" r="8" fill={activeDiagramLabel === labels[0] ? '#ef4444' : '#0284c7'} className="animate-pulse" stroke="#fff" strokeWidth="2" />
          <circle cx="270" cy="230" r="8" fill={activeDiagramLabel === labels[1] ? '#ef4444' : '#7e22ce'} className="animate-pulse" stroke="#fff" strokeWidth="2" />
          <circle cx="140" cy="290" r="8" fill={activeDiagramLabel === labels[2] ? '#ef4444' : '#d97706'} className="animate-pulse" stroke="#fff" strokeWidth="2" />
          <circle cx="250" cy="90" r="8" fill={activeDiagramLabel === labels[3] ? '#ef4444' : '#15803d'} className="animate-pulse" stroke="#fff" strokeWidth="2" />
        </svg>
      );
    } else if (isPhysics) {
      // Solenoid field or Kepler orbit drawing
      return (
        <svg viewBox="0 0 400 400" className="w-full h-full max-h-[340px]" style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s' }}>
          {/* Elliptical field lines */}
          <ellipse cx="200" cy="200" rx="160" ry="80" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="5,5" />
          <ellipse cx="200" cy="200" rx="140" ry="50" fill="none" stroke="#60a5fa" strokeWidth="2" />
          <ellipse cx="200" cy="200" rx="110" ry="25" fill="none" stroke="#2563eb" strokeWidth="2.5" />

          {/* Iron Core Cylinder */}
          <rect x="110" y="185" width="180" height="30" rx="5" fill="#64748b" stroke="#334155" strokeWidth="2" />
          
          {/* Coils winding around the core */}
          <path d="M120,180 C125,160 135,160 140,185 L140,215 C135,235 125,235 120,215 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveDiagramLabel(labels[0] || 'Winding Coil')} />
          <path d="M150,180 C155,160 165,160 170,185 L170,215 C165,235 155,235 150,215 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveDiagramLabel(labels[0] || 'Winding Coil')} />
          <path d="M180,180 C185,160 195,160 200,185 L200,215 C195,235 185,235 180,215 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveDiagramLabel(labels[1] || 'Magnetic Core')} />
          <path d="M210,180 C215,160 225,160 230,185 L230,215 C225,235 215,235 210,215 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveDiagramLabel(labels[2] || 'Solenoid Axis')} />
          <path d="M240,180 C245,160 255,160 260,185 L260,215 C255,235 245,235 240,215 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveDiagramLabel(labels[3] || 'Field Vectors')} />

          {/* Current Source Lines */}
          <line x1="120" y1="215" x2="120" y2="280" stroke="#475569" strokeWidth="3" />
          <line x1="260" y1="215" x2="260" y2="280" stroke="#475569" strokeWidth="3" />
          
          {/* Battery */}
          <rect x="160" y="270" width="60" height="20" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
          <line x1="120" y1="280" x2="160" y2="280" stroke="#475569" strokeWidth="3" />
          <line x1="220" y1="280" x2="260" y2="280" stroke="#475569" strokeWidth="3" />
          <text x="180" y="284" fontSize="10" className="font-mono" fontWeight="bold" fill="#475569">V_0</text>

          {/* Directional Arrows */}
          <path d="M350,195 L360,200 L350,205 Z" fill="#2563eb" />
          <path d="M50,205 L40,200 L50,195 Z" fill="#2563eb" />

          {/* Hotspot Circles */}
          <circle cx="150" cy="185" r="8" fill={activeDiagramLabel === labels[0] ? '#ef4444' : '#b45309'} className="animate-pulse" stroke="#fff" strokeWidth="2" />
          <circle cx="200" cy="200" r="8" fill={activeDiagramLabel === labels[1] ? '#ef4444' : '#64748b'} className="animate-pulse" stroke="#fff" strokeWidth="2" />
          <circle cx="200" cy="140" r="8" fill={activeDiagramLabel === labels[2] ? '#ef4444' : '#2563eb'} className="animate-pulse" stroke="#fff" strokeWidth="2" />
        </svg>
      );
    } else {
      // Chemistry tetrahedral bonds / molecular node view
      return (
        <svg viewBox="0 0 400 400" className="w-full h-full max-h-[340px]" style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s' }}>
          {/* Bond linkages */}
          <line x1="200" y1="200" x2="200" y2="70" stroke="#94a3b8" strokeWidth="6" />
          <line x1="200" y1="200" x2="310" y2="280" stroke="#94a3b8" strokeWidth="6" />
          <line x1="200" y1="200" x2="90" y2="280" stroke="#94a3b8" strokeWidth="6" />
          <line x1="200" y1="200" x2="260" y2="160" stroke="#94a3b8" strokeWidth="4" strokeDasharray="3,3" />

          {/* Central Atom (Carbon) */}
          <circle cx="200" cy="200" r="30" fill="#1e293b" stroke="#0f172a" strokeWidth="3" className="cursor-pointer" onClick={() => setActiveDiagramLabel(labels[0] || 'Central Nucleus')} />
          <text x="193" y="206" fill="#fff" fontSize="18" fontWeight="black" className="font-sans">C</text>

          {/* Outer Atoms */}
          <g className="cursor-pointer" onClick={() => setActiveDiagramLabel(labels[1] || 'Covalent Bond')}>
            <circle cx="200" cy="70" r="20" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
            <text x="195" y="75" fill="#fff" fontSize="13" fontWeight="bold">H</text>
          </g>

          <g className="cursor-pointer" onClick={() => setActiveDiagramLabel(labels[2] || 'Hydrogen Node')}>
            <circle cx="310" cy="280" r="20" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
            <text x="305" y="285" fill="#fff" fontSize="13" fontWeight="bold">H</text>
          </g>

          <g className="cursor-pointer" onClick={() => setActiveDiagramLabel(labels[3] || 'Electron Cloud')}>
            <circle cx="90" cy="280" r="20" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
            <text x="85" y="285" fill="#fff" fontSize="13" fontWeight="bold">H</text>
          </g>

          {/* Hotspot Circles */}
          <circle cx="200" cy="200" r="8" fill={activeDiagramLabel === labels[0] ? '#ef4444' : '#1e293b'} className="animate-pulse" stroke="#fff" strokeWidth="2" />
          <circle cx="200" cy="110" r="8" fill={activeDiagramLabel === labels[1] ? '#ef4444' : '#0284c7'} className="animate-pulse" stroke="#fff" strokeWidth="2" />
          <circle cx="255" cy="240" r="8" fill={activeDiagramLabel === labels[2] ? '#ef4444' : '#475569'} className="animate-pulse" stroke="#fff" strokeWidth="2" />
        </svg>
      );
    }
  };

  return (
    <div className="bg-white border border-card-border rounded-xl p-6 shadow-sm min-h-[550px]" id="scan_learn_container">
      {/* Banner / Title Header */}
      {!scanResult && (
        <div className="border-b border-card-border pb-4 mb-6">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#fe6a34] animate-pulse" />
            <span>Scan & Learn (Textbook & Notes AI Scanner)</span>
          </h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Drag and drop your exam files, homework PDFs, or book scans. Our multithreaded AI engine builds a comprehensive revision center.
          </p>
        </div>
      )}

      {/* ERROR MESSAGE DISPLAY */}
      {scanError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-xl mb-6 animate-fade-in flex flex-col sm:flex-row items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-red-900">Curricular Compliance Alert</h4>
            <p className="text-xs text-red-700 leading-relaxed">{scanError}</p>
            <button 
              onClick={() => { setScanError(null); setUploadedFile(null); }}
              className="bg-white hover:bg-red-100 border border-red-300 text-red-700 font-bold px-3 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer"
            >
              Reset and Try Again
            </button>
          </div>
        </div>
      )}

      {/* CORE DISPLAY CONTROLLER */}
      {!isScanning && !scanResult ? (
        <div className="space-y-6">
          {uploadedFile ? (
            <div className="border border-[#fe6a34]/20 rounded-xl p-5 bg-[#fe6a34]/5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#fe6a34]/15">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shadow-2xs">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-black text-primary font-mono uppercase tracking-wider truncate max-w-[240px] sm:max-w-md">
                      {uploadedFile.name}
                    </h3>
                    <p className="text-[10px] text-charcoal/50 font-semibold uppercase mt-0.5">
                      Type: {uploadedFile.mimeType.startsWith('image/') ? 'Image OCR Capture' : 'PDF Study Document'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={uploadedFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white border border-card-border hover:bg-surface-container text-primary text-[10.5px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-3xs transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open File</span>
                  </a>
                  <button
                    onClick={handleResetFile}
                    className="bg-red-50 hover:bg-red-100 text-red-600 text-[10.5px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer border border-red-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* ACTION SELECTOR TILES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                {/* Action Tile 1: Discussion */}
                <div className="bg-white border border-card-border rounded-xl p-4 flex flex-col justify-between shadow-3xs hover:border-emerald-500/30 transition-all">
                  <div>
                    <div className="flex items-center gap-2 text-primary font-bold text-xs mb-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                      <span className="font-mono uppercase tracking-wider text-emerald-700">Discuss with AI Tutor</span>
                    </div>
                    <p className="text-[11px] text-charcoal/60 leading-normal mb-3">
                      Initiate a focused study chat about this file with your Gemini powered academic pilot. Discuss homework questions or extract notes.
                    </p>
                    <label className="block text-[10px] font-bold text-primary/70 mb-1.5 uppercase font-mono">
                      Your Question or Prompt (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Please explain the major formula from this sheet, or summarize main concepts..."
                      value={askAIPrompt}
                      onChange={(e) => setAskAIPrompt(e.target.value)}
                      className="w-full text-xs border border-card-border p-2.5 rounded-lg focus:border-emerald-500 focus:outline-hidden transition-all bg-[#fafafc] mb-3"
                    />
                  </div>
                  <button
                    onClick={handleAskAITutor}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Connect to AI Chat</span>
                  </button>
                </div>

                {/* Action Tile 2: Workspace Creator */}
                <div className="bg-white border border-card-border rounded-xl p-4 flex flex-col justify-between shadow-3xs hover:border-secondary/30 transition-all">
                  <div>
                    <div className="flex items-center gap-2 text-primary font-bold text-xs mb-2">
                      <Cpu className="w-4 h-4 text-secondary animate-pulse" />
                      <span className="font-mono uppercase tracking-wider text-secondary">Premium Workspace Creator</span>
                    </div>
                    <p className="text-[11px] text-charcoal/60 leading-normal mb-3">
                      Generate a complete workspace comprising interactive quizzes, memory tricks, formulas, custom vector diagrams, and downloadable 3D models.
                    </p>
                    <div className="p-3 bg-surface-container-low rounded-lg border border-card-border mb-3 text-[11px] text-charcoal/70">
                      <strong>Alignment:</strong> CBSE Curriculum, Class {classLevel} {selectedSubject}
                    </div>
                  </div>
                  <button
                    onClick={triggerScan}
                    className="w-full bg-secondary hover:bg-secondary-dark text-white font-extrabold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Cpu className="w-4 h-4" />
                    <span>Assemble Interactive Workspace</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* UPLOADER / SIMULATOR EMPTY VIEW */
            <form onSubmit={triggerScan} className="space-y-5">
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  dragActive 
                    ? 'border-secondary bg-secondary/5 ring-2 ring-secondary/20' 
                    : 'border-card-border hover:border-[#fe6a34]/40 bg-surface-container-low'
                } relative`}
                onClick={() => {
                  const inputEl = document.getElementById('file_upload_scan');
                  if (inputEl) inputEl.click();
                }}
              >
                <input 
                  type="file"
                  id="file_upload_scan"
                  accept="application/pdf,image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileSelection(file);
                    }
                  }}
                />
                <Upload className="w-10 h-10 mx-auto text-[#fe6a34] mb-3 animate-bounce" />
                <h3 className="text-sm font-black text-primary font-mono uppercase tracking-wider">
                  Drag and drop study book PDF or notes image
                </h3>
                <p className="text-xs text-charcoal/50 mt-1 max-w-sm mx-auto">
                  Accepts PDF files and images (PNG, JPG, WEBP). Select manually by tapping this box.
                </p>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-xs">
                  <span className="h-px w-10 bg-card-border" />
                  <span className="text-charcoal/40 font-mono text-[10px] tracking-wider uppercase">OR SIMULATE CHAPTER SCAN</span>
                  <span className="h-px w-10 bg-card-border" />
                </div>
                <p className="text-[10.5px] text-charcoal/60 mt-1.5 max-w-md mx-auto">
                  Type the textbook topic, diagram descriptions, or school syllabus chapters below to build a simulated workspace.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-wider font-mono">
                  Textbook Chapter, Syllabus Topic, or Diagram Paragraph
                </label>
                <textarea
                  rows={3}
                  placeholder={`E.g. Light reflection and mirrors, spherical coordinate systems for class ${classLevel} ${selectedSubject}...`}
                  value={pageDescription}
                  onChange={(e) => setPageDescription(e.target.value)}
                  className="w-full text-xs border border-card-border p-3 rounded-lg focus:border-primary focus:outline-hidden transition-all bg-[#fafafc]"
                  id="textarea_scan_prompt"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary-dark text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                id="btn_submit_scan"
              >
                <Cpu className="w-4 h-4 animate-pulse" />
                <span>Process & Parse Study Document</span>
              </button>
            </form>
          )}
        </div>
      ) : isScanning ? (
        /* STEPPED PROCESS LOADING STATE */
        <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-in">
          <div className="relative w-44 h-44 border-4 border-primary/10 rounded-2xl overflow-hidden bg-surface-container flex items-center justify-center shadow-md">
            {uploadedFile ? (
              <FileText className="w-14 h-14 text-secondary animate-pulse" />
            ) : (
              <Camera className="w-14 h-14 text-primary/30 animate-pulse" />
            )}
            
            {/* The laser scan horizontal line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-secondary shadow-[0_0_12px_#fe6a34] animate-bounce" style={{ animationDuration: '2.5s' }} />
          </div>

          <h3 className="text-base font-bold text-primary mt-6">Stepping AI Document Scanner...</h3>
          <p className="text-xs text-charcoal/60 mt-1 max-w-sm">
            Please wait while we perform OCR, check curriculum frameworks, and generate active workspace tools.
          </p>

          {/* Stepped progress indicators */}
          <div className="mt-6 w-full max-w-md bg-white border border-card-border rounded-xl p-4 text-left space-y-2.5">
            {loadingSteps.map((step, idx) => {
              const isDone = scanProgress > step.range[1];
              const isActive = scanProgress >= step.range[0] && scanProgress <= step.range[1];
              return (
                <div key={idx} className="flex items-center gap-2.5 text-xs">
                  {isDone ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-200">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : isActive ? (
                    <div className="w-5 h-5 rounded-full bg-secondary/15 flex items-center justify-center text-secondary shrink-0 border border-secondary animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-surface-container-high shrink-0 border border-card-border" />
                  )}
                  <span className={`font-semibold ${isActive ? 'text-primary font-bold' : isDone ? 'text-charcoal/60 line-through' : 'text-charcoal/40'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="w-full max-w-md bg-surface-container mt-6 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-secondary h-full transition-all duration-150"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
          <span className="text-xs font-mono text-secondary mt-2 font-black">{scanProgress}%</span>
        </div>
      ) : (
        /* PREMIUM STUDY WORKSPACE VIEW */
        <div className="space-y-6 animate-fade-in" id="study_workspace_view">
          
          {/* Workspace Header */}
          <div className="bg-[#001736] text-white p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm border border-white/5">
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-secondary/25 border border-secondary/35 text-secondary text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  Class {classLevel} • {selectedSubject}
                </span>
                <span className="bg-white/10 border border-white/10 text-white/80 text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  AI Synthesized Workspace
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight line-clamp-1 text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-secondary shrink-0" />
                <span>{scanResult.title}</span>
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {onAskAIAboutBook && uploadedFile && (
                <button
                  onClick={handleAskAITutor}
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-secondary" />
                  <span>Discuss File</span>
                </button>
              )}
              {scanResult.model && (
                <button
                  onClick={handleAddResultToLibrary}
                  className="bg-secondary hover:bg-secondary-dark text-white text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Compass className="w-3.5 h-3.5 text-white" />
                  <span>Unlock 3D & Add Tasks</span>
                </button>
              )}
              <button
                onClick={() => { setScanResult(null); setUploadedFile(null); }}
                className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer border border-white/5"
              >
                Scan Again
              </button>
            </div>
          </div>

          {/* Workspace Tab Bar Navigation */}
          <div className="flex overflow-x-auto gap-1 border-b border-card-border pb-1 shrink-0 no-scrollbar">
            <button
              onClick={() => setActiveTab('revision')}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap border ${
                activeTab === 'revision' 
                  ? 'bg-primary text-white border-primary shadow-2xs' 
                  : 'bg-white text-charcoal/60 hover:text-primary border-transparent hover:bg-surface-container-low'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Revision Desk</span>
            </button>
            <button
              onClick={() => setActiveTab('concepts')}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap border ${
                activeTab === 'concepts' 
                  ? 'bg-primary text-white border-primary shadow-2xs' 
                  : 'bg-white text-charcoal/60 hover:text-primary border-transparent hover:bg-surface-container-low'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Concept Cards</span>
            </button>
            {scanResult.formulas && scanResult.formulas.length > 0 && (
              <button
                onClick={() => setActiveTab('formulas')}
                className={`flex items-center gap-1.5 py-2.5 px-3.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap border ${
                  activeTab === 'formulas' 
                    ? 'bg-primary text-white border-primary shadow-2xs' 
                    : 'bg-white text-charcoal/60 hover:text-primary border-transparent hover:bg-surface-container-low'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Formula Sheet</span>
              </button>
            )}
            {scanResult.memoryTricks && scanResult.memoryTricks.length > 0 && (
              <button
                onClick={() => setActiveTab('memory')}
                className={`flex items-center gap-1.5 py-2.5 px-3.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap border ${
                  activeTab === 'memory' 
                    ? 'bg-primary text-white border-primary shadow-2xs' 
                    : 'bg-white text-charcoal/60 hover:text-primary border-transparent hover:bg-surface-container-low'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                <span>Memory Palace</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('practice')}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap border ${
                activeTab === 'practice' 
                  ? 'bg-primary text-white border-primary shadow-2xs' 
                  : 'bg-white text-charcoal/60 hover:text-primary border-transparent hover:bg-surface-container-low'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Practice Arena</span>
            </button>
            {scanResult.diagrams && scanResult.diagrams.length > 0 && (
              <button
                onClick={() => setActiveTab('diagrams')}
                className={`flex items-center gap-1.5 py-2.5 px-3.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap border ${
                  activeTab === 'diagrams' 
                    ? 'bg-primary text-white border-primary shadow-2xs' 
                    : 'bg-white text-charcoal/60 hover:text-primary border-transparent hover:bg-surface-container-low'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Active Diagrams</span>
              </button>
            )}
            {scanResult.model && (
              <button
                onClick={() => setActiveTab('3d')}
                className={`flex items-center gap-1.5 py-2.5 px-3.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap border ${
                  activeTab === '3d' 
                    ? 'bg-primary text-white border-primary shadow-2xs' 
                    : 'bg-white text-charcoal/60 hover:text-primary border-transparent hover:bg-surface-container-low'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>3D Exploration</span>
              </button>
            )}
          </div>

          {/* TAB 1: REVISION DESK */}
          {activeTab === 'revision' && (
            <div className="space-y-6 animate-fade-in text-left">
              {/* Summary Block */}
              <div className="bg-surface-container-low border border-card-border rounded-xl p-5 shadow-2xs">
                <h3 className="text-xs font-black text-primary font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#fe6a34]" />
                  <span>Topic Overview Summary</span>
                </h3>
                <p className="text-xs text-charcoal/80 leading-relaxed italic border-l-2 border-[#fe6a34]/30 pl-3.5">
                  "{scanResult.summary}"
                </p>
              </div>

              {/* Key Notes & Exam Tips split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Detailed Notes */}
                  <div className="bg-white border border-card-border rounded-xl p-5 shadow-2xs">
                    <h3 className="text-xs font-black text-primary font-mono uppercase tracking-wider mb-4 border-b border-card-border pb-2">
                      📝 Full Revision Study Guide
                    </h3>
                    <div className="prose prose-sm max-w-none">
                      {renderRevisionNotes(scanResult.revisionNotes)}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* High Scoring Exam Tips */}
                  {scanResult.examTips && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-950 rounded-xl p-4 shadow-3xs">
                      <h4 className="text-xs font-black text-amber-900 font-mono uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-700 animate-pulse" />
                        <span>💡 High-Scoring Exam Tips</span>
                      </h4>
                      <div className="space-y-2.5">
                        {scanResult.examTips.map((tip: string, idx: number) => (
                          <div key={idx} className="text-xs flex gap-2">
                            <span className="font-bold text-amber-700 font-mono">#{idx+1}</span>
                            <span className="leading-relaxed text-amber-900/85">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Syllabus Checklist Tasks */}
                  {scanResult.importantPoints && (
                    <div className="bg-white border border-card-border rounded-xl p-4 shadow-3xs">
                      <h4 className="text-xs font-black text-primary font-mono uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-[#fe6a34]" />
                        <span>📌 Key Syllabus Checkpoints</span>
                      </h4>
                      <div className="space-y-2">
                        {scanResult.importantPoints.map((pt: string, idx: number) => (
                          <div key={idx} className="flex gap-2 text-xs text-charcoal/80 items-start">
                            <span className="text-secondary font-mono mt-0.5 font-bold">✓</span>
                            <span className="leading-relaxed">{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONCEPT CARDS */}
          {activeTab === 'concepts' && (
            <div className="space-y-6 animate-fade-in text-left">
              {/* Definitions reveal desk */}
              <div>
                <h3 className="text-xs font-black text-primary font-mono uppercase tracking-wider mb-3">
                  🧩 Interactive Glossary (Tap to Reveal Definition)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scanResult.definitions?.map((def: any, idx: number) => {
                    const isRevealed = revealedTerms[def.term];
                    return (
                      <div 
                        key={idx}
                        onClick={() => setRevealedTerms(p => ({ ...p, [def.term]: !p[def.term] }))}
                        className={`border rounded-xl p-4 cursor-pointer select-none min-h-[110px] flex flex-col justify-between transition-all duration-300 shadow-3xs ${
                          isRevealed 
                            ? 'bg-[#fe6a34]/5 border-secondary/40 ring-1 ring-secondary/20' 
                            : 'bg-white border-card-border hover:border-secondary/30 hover:bg-surface-container-low'
                        }`}
                      >
                        <div>
                          <span className="text-[10px] font-mono font-bold text-secondary uppercase tracking-widest block mb-1">Concept Definition</span>
                          <strong className="text-xs text-primary font-extrabold uppercase font-mono tracking-wide">{def.term}</strong>
                        </div>
                        <div className="mt-2.5">
                          {isRevealed ? (
                            <p className="text-[11px] text-charcoal/80 leading-relaxed font-medium animate-fade-in">
                              {def.definition}
                            </p>
                          ) : (
                            <div className="text-[10.5px] text-secondary font-bold flex items-center gap-1">
                              <span>Reveal Definition</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Advanced Key Concepts list */}
              {scanResult.keyConcepts && (
                <div className="bg-white border border-card-border rounded-xl p-5 shadow-2xs mt-6">
                  <h3 className="text-xs font-black text-primary font-mono uppercase tracking-wider mb-4 border-b border-card-border pb-2">
                    📚 Detailed Curricular Concepts Explained
                  </h3>
                  <div className="space-y-4">
                    {scanResult.keyConcepts.map((item: any, idx: number) => (
                      <div key={idx} className="pb-4 border-b border-card-border last:border-0 last:pb-0">
                        <h4 className="text-xs font-bold text-primary flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-[9px] font-mono">{idx+1}</span>
                          <span className="uppercase font-mono tracking-wide">{item.concept}</span>
                        </h4>
                        <p className="text-xs text-charcoal/70 mt-1.5 ml-6 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FORMULA SHEET */}
          {activeTab === 'formulas' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="bg-white border border-card-border rounded-xl p-5 shadow-2xs">
                <h3 className="text-xs font-black text-primary font-mono uppercase tracking-wider mb-4 border-b border-card-border pb-2 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-secondary" />
                  <span>📐 Physics & Mathematics Formula Cheat Sheet</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {scanResult.formulas?.map((frm: any, idx: number) => (
                    <div key={idx} className="bg-surface-container-low border border-card-border rounded-xl p-4 space-y-3 shadow-3xs">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-[#fe6a34] uppercase tracking-widest block mb-0.5">Physical Equation</span>
                        <h4 className="text-xs font-bold text-primary font-sans">{frm.name}</h4>
                      </div>

                      <div className="bg-white border border-card-border p-3 rounded-lg text-center font-mono font-extrabold text-sm text-primary shadow-3xs">
                        {frm.equation}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-bold text-charcoal/40 uppercase tracking-widest block">Scientific Derivation & Variables</span>
                        <p className="text-[10.5px] text-charcoal/60 leading-relaxed font-medium">
                          {frm.derivation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MEMORY PALACE */}
          {activeTab === 'memory' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="bg-white border border-card-border rounded-xl p-5 shadow-2xs">
                <h3 className="text-xs font-black text-primary font-mono uppercase tracking-wider mb-4 border-b border-card-border pb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-[#fe6a34]" />
                  <span>💡 Academic Memory Mnemonics & Tricks</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scanResult.memoryTricks?.map((trick: any, idx: number) => (
                    <div key={idx} className="border border-secondary/20 rounded-xl p-4 bg-[#fe6a34]/5 shadow-3xs flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#fe6a34]/10 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                        <Lightbulb className="w-4.5 h-4.5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold text-primary uppercase font-mono tracking-wide">{trick.concept}</h4>
                        <div className="bg-white border border-card-border p-2.5 rounded-lg text-xs font-extrabold text-[#fe6a34] font-mono tracking-wide my-1.5 shadow-3xs">
                          💡 {trick.trick}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PRACTICE ARENA */}
          {activeTab === 'practice' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Interactive MCQs on Left */}
                <div className="lg:col-span-2 bg-white border border-card-border rounded-xl p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-black text-primary font-mono uppercase tracking-wider border-b border-card-border pb-2">
                    🏆 Syllabus Interactive MCQ Self-Evaluation
                  </h3>

                  <div className="space-y-6">
                    {scanResult.mcqs?.map((mcq: any, mcqIdx: number) => {
                      const userAns = mcqAnswers[mcqIdx];
                      const isCorrect = userAns === mcq.answer;
                      return (
                        <div key={mcqIdx} className="space-y-2.5 border-b border-card-border/50 pb-5 last:border-0 last:pb-0">
                          <p className="text-xs font-bold text-primary flex gap-2">
                            <span className="font-mono text-secondary">Q{mcqIdx+1}.</span>
                            <span>{mcq.question}</span>
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {mcq.options.map((opt: string, optIdx: number) => {
                              const isSelected = userAns === opt;
                              const isThisCorrect = opt === mcq.answer;
                              
                              let btnClass = 'bg-white border-card-border text-charcoal/80 hover:bg-surface-container-low';
                              if (userAns) {
                                if (isThisCorrect) {
                                  btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-semibold';
                                } else if (isSelected) {
                                  btnClass = 'bg-red-50 border-red-400 text-red-800';
                                } else {
                                  btnClass = 'bg-white border-card-border text-charcoal/40 opacity-70';
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  disabled={!!userAns}
                                  onClick={() => setMcqAnswers(p => ({ ...p, [mcqIdx]: opt }))}
                                  className={`text-left text-xs p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${btnClass}`}
                                >
                                  <span>{opt}</span>
                                  {userAns && isThisCorrect && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />}
                                  {userAns && isSelected && !isThisCorrect && <X className="w-4 h-4 text-red-600 shrink-0 ml-1" />}
                                </button>
                              );
                            })}
                          </div>

                          {userAns && (
                            <div className={`p-3 rounded-lg text-[11px] leading-relaxed border ${isCorrect ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950' : 'bg-red-50/40 border-red-200 text-red-950'}`}>
                              <strong className="block mb-0.5">{isCorrect ? '✓ Correct Answer!' : `✗ Incorrect (Correct Answer: ${mcq.answer})`}</strong>
                              <span>{mcq.explanation}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Collapsible Questions on Right */}
                <div className="space-y-4">
                  <div className="bg-surface-container-low border border-card-border rounded-xl p-4 shadow-3xs">
                    <h3 className="text-xs font-black text-primary font-mono uppercase tracking-wider mb-3">
                      ✍️ Exam Q&A Self-Testing Desk
                    </h3>
                    
                    <div className="space-y-2">
                      {/* FAQs */}
                      <div className="border border-card-border rounded-lg overflow-hidden bg-white">
                        <button 
                          onClick={() => setRevealedAnswers(p => ({ ...p, section_faq: !p.section_faq }))}
                          className="w-full flex items-center justify-between p-3 text-xs font-bold text-primary cursor-pointer hover:bg-surface-container-low"
                        >
                          <span>Exam FAQs ({scanResult.faqs?.length || 0})</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${revealedAnswers.section_faq ? 'rotate-180' : ''}`} />
                        </button>
                        {revealedAnswers.section_faq && (
                          <div className="p-3 border-t border-card-border bg-white space-y-3.5 max-h-[300px] overflow-y-auto">
                            {scanResult.faqs?.map((faq: any, idx: number) => (
                              <div key={idx} className="space-y-1 text-xs">
                                <strong className="text-primary block font-sans">Q: {faq.question}</strong>
                                <span className="text-charcoal/60 leading-relaxed block pl-2 font-medium">A: {faq.answer}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Viva Questions */}
                      <div className="border border-card-border rounded-lg overflow-hidden bg-white">
                        <button 
                          onClick={() => setRevealedAnswers(p => ({ ...p, section_viva: !p.section_viva }))}
                          className="w-full flex items-center justify-between p-3 text-xs font-bold text-primary cursor-pointer hover:bg-surface-container-low"
                        >
                          <span>Oral / Viva Questions ({scanResult.vivaQuestions?.length || 0})</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${revealedAnswers.section_viva ? 'rotate-180' : ''}`} />
                        </button>
                        {revealedAnswers.section_viva && (
                          <div className="p-3 border-t border-card-border bg-white space-y-3.5 max-h-[300px] overflow-y-auto">
                            {scanResult.vivaQuestions?.map((viva: any, idx: number) => (
                              <div key={idx} className="space-y-1 text-xs">
                                <strong className="text-primary block font-sans">Q: {viva.question}</strong>
                                <span className="text-charcoal/60 leading-relaxed block pl-2 font-medium">A: {viva.answer}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Short Answers */}
                      <div className="border border-card-border rounded-lg overflow-hidden bg-white">
                        <button 
                          onClick={() => setRevealedAnswers(p => ({ ...p, section_short: !p.section_short }))}
                          className="w-full flex items-center justify-between p-3 text-xs font-bold text-primary cursor-pointer hover:bg-surface-container-low"
                        >
                          <span>Short Answer Questions ({scanResult.shortAnswers?.length || 0})</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${revealedAnswers.section_short ? 'rotate-180' : ''}`} />
                        </button>
                        {revealedAnswers.section_short && (
                          <div className="p-3 border-t border-card-border bg-white space-y-3.5 max-h-[300px] overflow-y-auto">
                            {scanResult.shortAnswers?.map((sa: any, idx: number) => (
                              <div key={idx} className="space-y-1 text-xs">
                                <strong className="text-primary block font-sans">Q: {sa.question}</strong>
                                <span className="text-charcoal/60 leading-relaxed block pl-2 font-medium">A: {sa.answer}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Long Answers */}
                      <div className="border border-card-border rounded-lg overflow-hidden bg-white">
                        <button 
                          onClick={() => setRevealedAnswers(p => ({ ...p, section_long: !p.section_long }))}
                          className="w-full flex items-center justify-between p-3 text-xs font-bold text-primary cursor-pointer hover:bg-surface-container-low"
                        >
                          <span>Long Essay Questions ({scanResult.longAnswers?.length || 0})</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${revealedAnswers.section_long ? 'rotate-180' : ''}`} />
                        </button>
                        {revealedAnswers.section_long && (
                          <div className="p-3 border-t border-card-border bg-white space-y-3.5 max-h-[300px] overflow-y-auto">
                            {scanResult.longAnswers?.map((la: any, idx: number) => (
                              <div key={idx} className="space-y-1 text-xs">
                                <strong className="text-primary block font-sans">Q: {la.question}</strong>
                                <span className="text-charcoal/60 leading-relaxed block pl-2 font-medium">A: {la.answer}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ACTIVE DIAGRAMS */}
          {activeTab === 'diagrams' && (
            <div className="space-y-6 animate-fade-in text-left">
              {/* Diagram Selection Header */}
              {scanResult.diagrams && scanResult.diagrams.length > 1 && (
                <div className="flex gap-2">
                  {scanResult.diagrams.map((diag: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => { setSelectedDiagramIndex(idx); setActiveDiagramLabel(diag.labels?.[0] || null); }}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        selectedDiagramIndex === idx 
                          ? 'bg-secondary text-white border-secondary' 
                          : 'bg-white text-primary border-card-border hover:bg-surface-container-low'
                      }`}
                    >
                      {diag.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Diagram Main Workspace split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* SVG Canvas Container */}
                <div className="lg:col-span-2 bg-white border border-card-border rounded-xl p-5 shadow-2xs flex flex-col justify-between min-h-[380px] relative overflow-hidden">
                  
                  {/* Floating Controller buttons */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
                    <button 
                      onClick={() => setZoomLevel(p => Math.min(2, p + 0.15))}
                      className="bg-white/95 border border-card-border p-2 rounded-lg text-primary hover:bg-surface-container shadow-2xs cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setZoomLevel(p => Math.max(0.7, p - 0.15))}
                      className="bg-white/95 border border-card-border p-2 rounded-lg text-primary hover:bg-surface-container shadow-2xs cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setZoomLevel(1)}
                      className="bg-white/95 border border-card-border p-2 rounded-lg text-primary hover:bg-surface-container shadow-2xs cursor-pointer"
                      title="Reset Zoom"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Canvas SVG render area */}
                  <div className="flex-1 flex items-center justify-center p-4 overflow-hidden border border-dashed border-card-border/70 rounded-lg bg-slate-50/50">
                    {renderDynamicSvg()}
                  </div>

                  {/* Diagram title */}
                  <div className="mt-4 border-t border-card-border/50 pt-3">
                    <h4 className="text-xs font-black text-primary font-mono uppercase tracking-wider">
                      🖼️ Dynamic Vector: {scanResult.diagrams?.[selectedDiagramIndex]?.title || "Academic Diagram"}
                    </h4>
                    <p className="text-[10.5px] text-charcoal/60 leading-relaxed mt-1">
                      {scanResult.diagrams?.[selectedDiagramIndex]?.description}
                    </p>
                  </div>
                </div>

                {/* Hotspot & Details list */}
                <div className="space-y-4">
                  <div className="bg-surface-container-low border border-card-border rounded-xl p-4 shadow-3xs space-y-4">
                    <h3 className="text-xs font-black text-primary font-mono uppercase tracking-wider">
                      🎯 Active Labeled Part Highlights
                    </h3>

                    <div className="space-y-1.5">
                      {scanResult.diagrams?.[selectedDiagramIndex]?.labels?.map((label: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setActiveDiagramLabel(label)}
                          className={`w-full text-left text-xs p-2.5 rounded-lg border flex items-center justify-between transition-all cursor-pointer ${
                            activeDiagramLabel === label 
                              ? 'bg-secondary/10 border-secondary text-secondary font-bold ring-1 ring-secondary/20' 
                              : 'bg-white border-card-border text-charcoal/70 hover:bg-surface-container-low'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-secondary" />
                            <span>{label}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-charcoal/40" />
                        </button>
                      ))}
                    </div>

                    {activeDiagramLabel && (
                      <div className="bg-white border border-secondary/20 rounded-xl p-3.5 space-y-1.5 shadow-3xs animate-fade-in">
                        <span className="text-[9px] font-mono font-bold text-secondary uppercase tracking-widest block">Detailed Annotation</span>
                        <h4 className="text-xs font-extrabold text-primary font-mono uppercase tracking-wide">{activeDiagramLabel}</h4>
                        <p className="text-[10.5px] text-charcoal/60 leading-relaxed font-medium">
                          The **{activeDiagramLabel}** represents a vital functional component detected within the scanned document. It directly aligns with the Class {classLevel} syllabus parameters for core molecular and physical entities.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: 3D EXPLORATION PREVIEW */}
          {activeTab === '3d' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="bg-white border border-card-border rounded-xl p-5 shadow-2xs max-w-2xl mx-auto">
                <div className="text-center pb-4 border-b border-card-border space-y-1">
                  <span className="text-[9px] font-mono font-bold text-secondary uppercase tracking-widest bg-secondary/10 px-2.5 py-0.5 rounded-full">3D Entity Model Ready</span>
                  <h3 className="text-lg font-black text-primary font-sans">{scanResult.model.name}</h3>
                  <p className="text-xs text-charcoal/50 font-mono">Category: {scanResult.model.category}</p>
                </div>

                <div className="py-6 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="w-28 h-28 rounded-2xl bg-[#001736] flex items-center justify-center text-white border border-white/10 relative shadow-md">
                    <Compass className="w-12 h-12 text-secondary animate-spin" style={{ animationDuration: '6s' }} />
                    <div className="absolute inset-0 border-2 border-[#fe6a34]/30 rounded-2xl animate-pulse" />
                  </div>
                  
                  <p className="text-xs text-charcoal/70 leading-relaxed max-w-md">
                    {scanResult.model.description}
                  </p>

                  <div className="border border-card-border rounded-lg p-3 bg-[#fafafc] w-full max-w-sm text-left">
                    <span className="text-[9px] font-mono font-bold text-charcoal/40 uppercase tracking-widest block mb-1">Detected Sub-Nodes:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {scanResult.model.nodes?.map((nd: string, idx: number) => (
                        <span key={idx} className="bg-white border border-card-border text-primary text-[10.5px] font-mono font-semibold px-2 py-0.5 rounded shadow-3xs">
                          {nd}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-card-border flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddResultToLibrary}
                    className="flex-1 bg-primary hover:bg-primary-light text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                    id="btn_unlock_3d_material"
                  >
                    <span>Import Model & Study Tasks</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setScanResult(null); setUploadedFile(null); }}
                    className="bg-white border border-card-border hover:bg-surface-container text-primary font-bold py-3 px-4 rounded-xl text-xs cursor-pointer transition-all"
                  >
                    Discard Scan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
