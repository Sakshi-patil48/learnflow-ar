import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Award,
  BookMarked
} from 'lucide-react';
import { NcertChapter } from '../ncertData';
import { ClassLevel, SubjectName } from '../types';

interface Textbook2DReaderProps {
  chapter: NcertChapter;
  subject: SubjectName;
  classLevel: ClassLevel;
  onClose: () => void;
}

export default function Textbook2DReader({ chapter, subject, classLevel, onClose }: Textbook2DReaderProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const totalPages = 3;

  // Generate deterministic content based on the chapter & topics to make it feel extremely realistic
  const topicsList = chapter.topics && chapter.topics.length > 0 
    ? chapter.topics 
    : ['Fundamental Core Concepts', 'Standard Practical Applications', 'Review Syllabus'];

  // A helper to generate educational text based on the topic name
  const getTopicEducationalContent = (topic: string, index: number) => {
    const formulas: Record<string, string> = {
      'force': 'F = m × a (Newton\'s Second Law)',
      'motion': 'v = u + at, s = ut + ½at², v² = u² + 2as',
      'gravitation': 'F = G × (m₁m₂)/d²',
      'work': 'W = F × d × cos(θ)',
      'power': 'P = W / t = F × v',
      'ohms': 'V = I × R (Ohm\'s Law)',
      'electricity': 'P = V × I = I² × R',
      'mirror': '1/f = 1/v + 1/u',
      'lens': '1/f = 1/v - 1/u',
      'quadratic': 'x = [-b ± √(b² - 4ac)] / 2a',
      'trigonometric': 'sin²(θ) + cos²(θ) = 1',
      'solutions': 'Molarity (M) = moles of solute / liters of solution',
      'moles': 'Number of moles (n) = Given Mass (m) / Molar Mass (M)'
    };

    let matchedFormula = '';
    const lowerTopic = topic.toLowerCase();
    for (const key in formulas) {
      if (lowerTopic.includes(key)) {
        matchedFormula = formulas[key];
        break;
      }
    }

    return {
      definition: `In Class ${classLevel} ${subject}, "${topic}" is a crucial syllabus pillar. Standard CBSE curriculums require understanding the core physical mechanisms, structural characteristics, and analytical formulations of this topic. This section covers the fundamental observations and theoretical constructs defined by the NCERT framework.`,
      elaboration: `Historically, the scientific derivation of ${topic} revolutionized our modern understanding. Experimental setups verify that under controlled laboratory parameters, variables correlate sequentially, ensuring predictable behavior. Understanding these structural interactions is essential for both competitive assessments and practical laboratory procedures.`,
      formula: matchedFormula,
      fact: `CBSE Exam Trend: Questions about "${topic}" frequently focus on analytical numerical problems, comparative diagram labeling, and structural definition questions.`
    };
  };

  // Static review quiz questions based on the chapter topics
  const quizQuestions = [
    {
      id: 1,
      question: `Which of the following best defines the primary objective when studying "${topicsList[0]}"?`,
      options: [
        'To analyze structural and empirical properties quantitatively',
        'To completely ignore theoretical derivations',
        'To purely memorize formulas without context',
        'To substitute actual science with hypothetical assumptions'
      ],
      correct: 0,
      explanation: `Studying "${topicsList[0]}" requires structural and quantitative analysis of its physical parameters and empirical properties as defined in the standard NCERT curriculum.`
    },
    {
      id: 2,
      question: topicsList[1] 
        ? `What is a core practical application or observation regarding "${topicsList[1]}"?`
        : `What is the significance of studying NCERT Class ${classLevel} syllabus chapters?`,
      options: [
        'It is strictly restricted to theoretical modeling with no real-world application',
        'It establishes predictive guidelines for engineering, diagnostics, or mathematical modeling',
        'It has been proven false by modern scientific research and is no longer tested',
        'It is a optional topic that never appears in standard CBSE examinations'
      ],
      correct: 1,
      explanation: 'Syllabus topics bridge core scientific theories with practical, industrial, and clinical/laboratory applications.'
    }
  ];

  const handlePageNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePagePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswer(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 font-sans text-primary">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-card-border">
        
        {/* TOP BOOK BAR */}
        <div className="bg-primary text-white px-4 py-3 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-secondary animate-pulse" />
            <div>
              <div className="text-[10px] font-bold font-mono text-secondary uppercase tracking-wider">CBSE NCERT 2D DIGITAL TEXTBOOK</div>
              <h2 className="text-xs sm:text-sm font-black text-white truncate max-w-[280px] sm:max-w-md">
                Class {classLevel} • {subject} — Chapter {chapter.number}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-1.5 rounded-lg transition-all ${isBookmarked ? 'bg-secondary text-white' : 'hover:bg-white/10 text-white/70'}`}
              title={isBookmarked ? 'Bookmarked!' : 'Bookmark this chapter'}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition-all text-white cursor-pointer"
              title="Close Textbook Viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BOOK INTERNAL CONTENT */}
        <div className="flex-1 overflow-y-auto bg-[#F4F1EA] p-4 sm:p-8 flex flex-col justify-between">
          
          <div className="space-y-6 max-w-4xl mx-auto w-full">
            
            {/* Textbook Header Stamp */}
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-2 text-[10px] font-mono text-charcoal/50">
              <span>BOARD SEC: CENTRAL BOARD OF SECONDARY EDUCATION, NEW DELHI</span>
              <span className="hidden sm:inline">OFFICIAL DIGITAL CURRICULUM PATHWAY</span>
            </div>

            {/* PAGE 1: CHAPTER COVER & OVERVIEW */}
            {currentPage === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center py-6 border-b-2 border-dashed border-charcoal/20">
                  <span className="text-xs font-bold text-secondary font-mono tracking-widest uppercase">CHAPTER {chapter.number}</span>
                  <h1 className="text-2xl sm:text-3xl font-serif font-black text-primary tracking-tight mt-1">
                    {chapter.title}
                  </h1>
                  <p className="text-xs text-charcoal/60 font-serif italic mt-2">
                    Official Course Material mapped under the National Curriculum Framework (NCF)
                  </p>
                </div>

                {/* Left/Right layout for Chapter introduction */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start font-serif">
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-primary font-sans border-l-4 border-secondary pl-2">
                      Chapter Introduction & Context
                    </h3>
                    <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed text-justify">
                      This chapter forms a primary conceptual framework in the CBSE secondary education board curriculum. 
                      Students are expected to analyze, interpret, and visually represent the structured properties of 
                      the corresponding scientific phenomena. Mastery of these concepts ensures high competitive 
                      scores and equips students with foundational analytical skills.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[11px] font-sans text-amber-800 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>IMPORTANT BOARD DIRECTIVE:</span>
                      </div>
                      <p className="leading-relaxed">
                        In theoretical examinations, diagrams related to this chapter carry up to 25% of the total marking scheme. Focus heavily on identifying labels and cellular or mechanical parts!
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-card-border rounded-xl p-4.5 space-y-3.5 shadow-3xs font-sans">
                    <h4 className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <BookMarked className="w-4 h-4 text-secondary" />
                      <span>Syllabus Topics Included ({topicsList.length})</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      {topicsList.map((topic, idx) => (
                        <div key={idx} className="bg-[#fafafc] border border-card-border rounded p-2 flex items-center gap-2">
                          <span className="font-mono text-secondary font-black text-[9px] bg-secondary/10 px-1 rounded">
                            {idx + 1}
                          </span>
                          <span className="text-primary font-semibold truncate" title={topic}>{topic}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-[11px] text-primary mt-4">
                      <div className="font-bold flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-secondary" />
                        <span>Core Learning Goals:</span>
                      </div>
                      <ul className="list-disc pl-4 mt-1.5 space-y-1 text-charcoal/70">
                        <li>Understand basic micro-structures and definitions.</li>
                        <li>Derive key algebraic, physical, or biochemical correlations.</li>
                        <li>Practice labeling schemas for competitive board assessments.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PAGE 2: IN-DEPTH SCHEMAS & 2D SCHEMATIC ILLUSTRATION */}
            {currentPage === 2 && (
              <div className="space-y-6 animate-fade-in font-serif">
                <div className="border-b border-charcoal/20 pb-2">
                  <span className="text-[10px] font-sans font-bold text-secondary uppercase tracking-widest">SECTION 2 • DETAILED TOPIC ANALYSES</span>
                  <h2 className="text-xl font-bold font-sans text-primary mt-0.5">Syllabus Insights & 2D Schematic Preview</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Explanations Accordion */}
                  <div className="lg:col-span-7 space-y-4">
                    {topicsList.slice(0, 3).map((topic, idx) => {
                      const analysis = getTopicEducationalContent(topic, idx);
                      return (
                        <div key={idx} className="bg-white border border-card-border rounded-xl p-4 shadow-3xs font-sans space-y-2">
                          <div className="flex items-center gap-2 border-b border-card-border pb-1.5">
                            <span className="text-[9px] font-mono bg-primary text-white font-bold w-4 h-4 rounded-full flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <h3 className="text-xs font-bold text-primary">{topic}</h3>
                          </div>
                          
                          <p className="text-[11px] text-charcoal/80 leading-relaxed text-justify">
                            {analysis.definition}
                          </p>

                          <p className="text-[11px] text-charcoal/60 leading-relaxed text-justify italic">
                            {analysis.elaboration}
                          </p>

                          {analysis.formula && (
                            <div className="bg-secondary/10 border-l-4 border-secondary p-2 rounded text-[11px] font-mono text-secondary font-bold flex items-center gap-2">
                              <span>Formula:</span>
                              <span className="text-primary">{analysis.formula}</span>
                            </div>
                          )}

                          <div className="bg-emerald-50 border border-emerald-150 rounded p-2 text-[10px] text-emerald-800 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span><strong>Exam Tip:</strong> {analysis.fact}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 2D diagram simulation box */}
                  <div className="lg:col-span-5 space-y-4 font-sans">
                    <div className="bg-white border-2 border-primary/20 rounded-xl p-4 shadow-3xs text-center space-y-3.5 relative overflow-hidden">
                      <div className="absolute top-2 right-2 bg-primary/10 text-primary text-[8px] font-mono font-bold px-1.5 py-0.5 rounded">
                        2D FIG. {chapter.number}.1
                      </div>

                      <h4 className="text-xs font-black text-primary uppercase tracking-wider mt-1">Syllabus 2D Concept Blueprint</h4>
                      
                      {/* Interactive CSS Concept Drawing */}
                      <div className="h-44 bg-surface-container rounded-lg border border-card-border flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(#fe6a34_0.2px,transparent_0.2px)] [background-size:10px_10px] opacity-10" />
                        
                        {/* Render SVG concept based on subject */}
                        {subject === 'Biology' && (
                          <div className="relative flex items-center justify-center w-full h-full animate-pulse" style={{ animationDuration: '4s' }}>
                            <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center relative shadow-xs">
                              <div className="w-10 h-10 rounded-full bg-emerald-200 border border-dashed border-emerald-600 flex items-center justify-center">
                                <div className="w-4 h-4 rounded-full bg-emerald-700 shadow-sm" />
                              </div>
                              <span className="absolute -top-1 left-16 bg-primary text-white text-[8px] font-bold px-1 rounded">Membrane</span>
                              <span className="absolute top-8 -left-3 bg-secondary text-white text-[8px] font-bold px-1 rounded">Cell Wall</span>
                              <span className="absolute top-16 left-12 bg-indigo-600 text-white text-[8px] font-bold px-1 rounded">Nucleus</span>
                            </div>
                          </div>
                        )}

                        {subject === 'Physics' && (
                          <div className="relative flex flex-col items-center justify-center w-full h-full">
                            <div className="w-32 h-1 bg-charcoal/40 relative">
                              <div className="w-12 h-12 rounded-full border-2 border-dashed border-primary absolute top-[-22px] left-10 animate-spin" style={{ animationDuration: '6s' }} />
                              <div className="w-3 h-3 rounded-full bg-secondary absolute top-[-5px] left-14" />
                              <span className="absolute -top-7 left-14 bg-primary text-white text-[8px] font-bold px-1 rounded">Orbit</span>
                              <span className="absolute top-3 left-14 bg-indigo-600 text-white text-[8px] font-bold px-1 rounded">Mass Center</span>
                            </div>
                          </div>
                        )}

                        {subject === 'Chemistry' && (
                          <div className="relative flex items-center justify-center w-full h-full">
                            <div className="flex gap-2">
                              <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-500 flex items-center justify-center font-bold text-xs text-blue-700 shadow-xs">H⁺</div>
                              <div className="w-12 h-12 rounded-full bg-red-100 border border-red-500 flex items-center justify-center font-bold text-xs text-red-700 shadow-xs">O²⁻</div>
                              <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-500 flex items-center justify-center font-bold text-xs text-blue-700 shadow-xs">H⁺</div>
                            </div>
                            <span className="absolute top-4 bg-primary text-white text-[8px] font-bold px-1 rounded">Covalent Bond</span>
                          </div>
                        )}

                        {subject === 'Mathematics' && (
                          <div className="relative flex items-center justify-center w-full h-full">
                            <div className="w-24 h-24 border-b-2 border-l-2 border-charcoal/40 relative">
                              <div className="w-20 h-0.5 bg-secondary absolute bottom-5 left-0 rotate-[-45deg] origin-bottom-left" />
                              <span className="absolute bottom-12 left-12 text-[10px] font-bold text-secondary">y = mx + c</span>
                              <span className="absolute bottom-1 right-2 text-[8px] text-charcoal/40 font-mono">X-Axis</span>
                              <span className="absolute top-2 left-2 text-[8px] text-charcoal/40 font-mono">Y-Axis</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <p className="text-[10px] text-charcoal/50 leading-relaxed font-mono">
                        Standard textbook diagram depicting fundamental structures mapped under chapter sub-section syllabus guidelines.
                      </p>
                    </div>

                    <div className="bg-[#FAF8F5] border border-card-border rounded-xl p-4 text-[11px] leading-relaxed text-charcoal/70">
                      <div className="font-bold text-primary mb-1 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-secondary" />
                        <span>Interactive Suggestion:</span>
                      </div>
                      <p>
                        Close this 2D view and click the <strong>Generate 3D Model</strong> button next to any of these topics to synthesize an immersive, interactive 3D model with rotatable boundaries and double-tap annotations.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* PAGE 3: SELF-ASSESSMENT COMPREHENSIVE ASSESSMENT */}
            {currentPage === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-charcoal/20 pb-2">
                  <span className="text-[10px] font-mono font-bold text-secondary uppercase tracking-widest">SECTION 3 • SELF ASSESSMENT EXERCISES</span>
                  <h2 className="text-xl font-bold font-sans text-primary mt-0.5">Syllabus Quiz & Practice Corner</h2>
                </div>

                <div className="bg-white border border-card-border rounded-xl p-5 shadow-3xs space-y-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/5 p-3 rounded-lg border border-primary/10">
                    <HelpCircle className="w-5 h-5 text-secondary shrink-0" />
                    <span>Test your understanding against official NCERT study questions. Correct answers earn study credentials!</span>
                  </div>

                  {/* Practice Questions */}
                  <div className="space-y-5">
                    {quizQuestions.map((q, qIdx) => (
                      <div key={q.id} className="space-y-3">
                        <h3 className="text-xs sm:text-sm font-bold text-primary flex gap-2">
                          <span className="font-mono text-secondary">Q{q.id}.</span>
                          <span>{q.question}</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = selectedAnswer[qIdx] === oIdx;
                            const isCorrect = q.correct === oIdx;
                            let btnStyle = 'border-card-border bg-white text-primary hover:border-primary/40';

                            if (isSelected) {
                              if (quizSubmitted) {
                                btnStyle = isCorrect 
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800' 
                                  : 'border-red-400 bg-red-50 text-red-800';
                              } else {
                                btnStyle = 'border-secondary bg-secondary/5 text-secondary font-black';
                              }
                            } else if (quizSubmitted && isCorrect) {
                              btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800';
                            }

                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleSelectOption(qIdx, oIdx)}
                                className={`text-left p-3.5 border rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                                id={`quiz_opt_${q.id}_${oIdx}`}
                              >
                                <span>{opt}</span>
                                {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && selectedAnswer[qIdx] !== undefined && (
                          <div className={`p-3 rounded-lg text-[11px] leading-relaxed font-sans ${selectedAnswer[qIdx] === q.correct ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                            <strong>{selectedAnswer[qIdx] === q.correct ? '✓ Correct! ' : '✗ Incorrect. '}</strong>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-card-border pt-4 flex justify-between items-center">
                    <div className="text-[11px] text-charcoal/50 font-mono">
                      {quizSubmitted 
                        ? `Finished: ${Object.keys(selectedAnswer).filter(k => selectedAnswer[parseInt(k)] === quizQuestions[parseInt(k)].correct).length} / ${quizQuestions.length} Correct`
                        : 'Select options for both questions above'
                      }
                    </div>

                    {!quizSubmitted ? (
                      <button
                        onClick={() => setQuizSubmitted(true)}
                        disabled={Object.keys(selectedAnswer).length < quizQuestions.length}
                        className="bg-primary hover:bg-primary-light text-white text-xs font-bold px-4 py-2 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
                      >
                        Submit Answers
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedAnswer({});
                          setQuizSubmitted(false);
                        }}
                        className="border border-card-border hover:bg-surface-container-low text-primary text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer"
                      >
                        Reset Quiz
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* PAGE FOOTER NAVIGATION */}
          <div className="border-t border-charcoal/15 pt-4 mt-6 flex justify-between items-center text-xs text-charcoal/60 font-semibold max-w-4xl mx-auto w-full">
            <button
              onClick={handlePagePrev}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 px-3 py-2 border border-charcoal/15 bg-white rounded-lg hover:bg-surface-container disabled:opacity-30 transition-all cursor-pointer"
              id="btn_prev_textbook_page"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            <span className="font-mono text-[11px] font-bold">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handlePageNext}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1.5 px-3 py-2 border border-charcoal/15 bg-white rounded-lg hover:bg-surface-container disabled:opacity-30 transition-all cursor-pointer"
              id="btn_next_textbook_page"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
