import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  Clock, 
  RotateCw, 
  HelpCircle, 
  ChevronRight, 
  Sparkles, 
  BarChart2, 
  BookOpen, 
  Flame, 
  Zap, 
  Check, 
  X,
  Play,
  RotateCcw
} from 'lucide-react';
import { ClassLevel, SubjectName } from '../types';
import VoiceAssistant from './VoiceAssistant';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
}

export interface QuizResult {
  id: string;
  subject: SubjectName;
  classLevel: ClassLevel;
  chapterTitle: string;
  score: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  completedAt: string;
}

interface AIQuizGeneratorProps {
  selectedSubject: SubjectName;
  classLevel: ClassLevel;
  onAskAI?: (prompt: string) => void;
}

const DEFAULT_QUIZZES: Record<SubjectName, QuizQuestion[]> = {
  'Biology': [
    {
      id: 'q_bio_1',
      question: 'Which of the following cellular organelles is known as the "Powerhouse of the Cell"?',
      options: ['Ribosome', 'Mitochondria', 'Golgi Apparatus', 'Endoplasmic Reticulum'],
      correctAnswer: 1,
      explanation: 'Mitochondria produce ATP through cellular respiration, supplying energy for cellular activities.'
    },
    {
      id: 'q_bio_2',
      question: 'In the DNA double helix model, which nitrogenous base pairs with Adenine (A)?',
      options: ['Cytosine (C)', 'Guanine (G)', 'Thymine (T)', 'Uracil (U)'],
      correctAnswer: 2,
      explanation: 'Adenine pairs specifically with Thymine via 2 hydrogen bonds in DNA (or Uracil in RNA).'
    },
    {
      id: 'q_bio_3',
      question: 'Which Whittaker Kingdom includes unicellular prokaryotic organisms like bacteria?',
      options: ['Monera', 'Protista', 'Fungi', 'Plantae'],
      correctAnswer: 0,
      explanation: 'Monera comprises all prokaryotes including bacteria, cyanobacteria, and archaebacteria.'
    }
  ],
  'Physics': [
    {
      id: 'q_phy_1',
      question: 'According to Newton\'s Second Law of Motion, Force is equal to:',
      options: ['Mass × Velocity', 'Rate of change of linear momentum', 'Work done / Time', 'Mass / Acceleration'],
      correctAnswer: 1,
      explanation: 'Force F = dp/dt. When mass is constant, F = m × a.'
    },
    {
      id: 'q_phy_2',
      question: 'What is the SI unit of Electric Charge?',
      options: ['Ampere', 'Volt', 'Coulomb', 'Ohm'],
      correctAnswer: 2,
      explanation: 'The SI unit of electric charge is the Coulomb (C), where 1 C = 1 Ampere · Second.'
    },
    {
      id: 'q_phy_3',
      question: 'In simple harmonic motion (SHM), acceleration is maximum at:',
      options: ['Mean position', 'Extreme positions', 'Midway between mean and extreme', 'Velocity is zero everywhere'],
      correctAnswer: 1,
      explanation: 'In SHM, acceleration a = -ω²x, which reaches maximum magnitude at extreme displacement x = A.'
    }
  ],
  'Chemistry': [
    {
      id: 'q_chem_1',
      question: 'What is the bond angle in a methane (CH₄) molecule with sp³ hybridization?',
      options: ['90°', '120°', '109.5°', '180°'],
      correctAnswer: 2,
      explanation: 'The four sp³ hybrid orbitals of carbon form a regular tetrahedron with 109.5° bond angles.'
    },
    {
      id: 'q_chem_2',
      question: 'Which subatomic particle was discovered by J.J. Thomson using cathode ray tubes?',
      options: ['Proton', 'Neutron', 'Electron', 'Positron'],
      correctAnswer: 2,
      explanation: 'J.J. Thomson discovered the electron in 1897 through his cathode ray experiment.'
    },
    {
      id: 'q_chem_3',
      question: 'What is the oxidation state of Chromium in K₂Cr₂O₇?',
      options: ['+3', '+5', '+6', '+7'],
      correctAnswer: 2,
      explanation: 'In K₂Cr₂O₇: 2(+1) + 2(Cr) + 7(-2) = 0 => 2Cr - 12 = 0 => Cr = +6.'
    }
  ],
  'Mathematics': [
    {
      id: 'q_math_1',
      question: 'What is the value of sin²(θ) + cos²(θ) for any real angle θ?',
      options: ['0', '1', '2', 'tan(θ)'],
      correctAnswer: 1,
      explanation: 'sin²(θ) + cos²(θ) = 1 is the fundamental Pythagorean identity of trigonometry.'
    },
    {
      id: 'q_math_2',
      question: 'The derivative of e^(2x) with respect to x is:',
      options: ['e^(2x)', '2 · e^(2x)', 'x · e^(2x)', '2x · e^(2x)'],
      correctAnswer: 1,
      explanation: 'By the chain rule: d/dx [e^(2x)] = e^(2x) · d/dx[2x] = 2e^(2x).'
    },
    {
      id: 'q_math_3',
      question: 'If a matrix A has determinant |A| = 0, then matrix A is:',
      options: ['Identity Matrix', 'Singular Matrix', 'Orthogonal Matrix', 'Symmetric Matrix'],
      correctAnswer: 1,
      explanation: 'A matrix with zero determinant is singular and does not have an inverse.'
    }
  ]
};

export default function AIQuizGenerator({
  selectedSubject,
  classLevel,
  onAskAI
}: AIQuizGeneratorProps) {
  // Quiz state
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => {
    return DEFAULT_QUIZZES[selectedSubject] || DEFAULT_QUIZZES['Biology'];
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Sync questions when selected subject changes
  useEffect(() => {
    const list = DEFAULT_QUIZZES[selectedSubject] || DEFAULT_QUIZZES['Biology'];
    setQuestions(list);
    resetQuiz();
  }, [selectedSubject, classLevel]);

  // Quiz Timer
  useEffect(() => {
    if (quizFinished) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [quizFinished]);

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
    setTimerSeconds(0);
  };

  const handleOptionSelect = (index: number) => {
    if (!isSubmitted) {
      setSelectedOption(index);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted) return;

    setIsSubmitted(true);
    if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
      // Save quiz result to localStorage
      const newResult: QuizResult = {
        id: `res_${Date.now()}`,
        subject: selectedSubject,
        classLevel: classLevel,
        chapterTitle: `Class ${classLevel} ${selectedSubject} Practice Quiz`,
        score: score + (selectedOption === questions[currentQuestionIndex].correctAnswer ? 1 : 0),
        totalQuestions: questions.length,
        timeSpentSeconds: timerSeconds,
        completedAt: new Date().toLocaleDateString()
      };

      const savedHistory = localStorage.getItem('learnflow_quiz_history');
      const historyArr = savedHistory ? JSON.parse(savedHistory) : [];
      localStorage.setItem('learnflow_quiz_history', JSON.stringify([newResult, ...historyArr]));
    }
  };

  const handleGenerateNewQuiz = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Generate a 3-question MCQ quiz for Class ${classLevel} ${selectedSubject}. Include 4 options and the correct answer index.`
          }],
          selectedClass: classLevel,
          selectedSubject: selectedSubject
        })
      });

      if (response.ok) {
        resetQuiz();
      }
    } catch (e) {
      console.error("Failed to generate AI quiz", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Top Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-semibold">
              Class {classLevel} {selectedSubject}
            </span>
            <span className="text-slate-400 text-xs font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              {(timerSeconds / 60).toFixed(0)}m {timerSeconds % 60}s
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">AI Chapter Assessment Quiz</h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Test your concept mastery with instant score evaluation & AI explanations.
          </p>
        </div>

        <button
          onClick={handleGenerateNewQuiz}
          disabled={isGenerating}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-2xl text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 cursor-pointer"
        >
          {isGenerating ? <RotateCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Generate New AI Quiz</span>
        </button>
      </div>

      {!quizFinished ? (
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span className="font-mono text-indigo-400 font-semibold">
                Score: {score} / {questions.length}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
              <div
                className="bg-indigo-500 h-full transition-all duration-300 shadow-[0_0_8px_#6366f1]"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Display */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                {currentQ.question}
              </h3>
              <VoiceAssistant textToSpeak={currentQ.question} />
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctAnswer;
                
                let optionStyle = "bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600";
                if (isSelected) {
                  optionStyle = "bg-indigo-600/20 border-indigo-500 text-white font-semibold";
                }
                if (isSubmitted) {
                  if (isCorrect) {
                    optionStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold shadow-emerald-500/20 shadow-lg";
                  } else if (isSelected) {
                    optionStyle = "bg-rose-950/80 border-rose-500 text-rose-200 font-semibold";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isSubmitted}
                    onClick={() => handleOptionSelect(idx)}
                    className={`w-full text-left p-4 rounded-2xl border text-sm transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation Box */}
          {isSubmitted && (
            <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                AI Explanation
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
            {!isSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 ml-auto cursor-pointer"
              >
                <span>Check Answer</span>
                <Check className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 ml-auto cursor-pointer"
              >
                <span>{currentQuestionIndex + 1 < questions.length ? 'Next Question' : 'Finish Quiz'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* QUIZ SUMMARY RESULTS CARD */
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center space-y-6 animate-fade-in">
          <div className="inline-flex p-4 bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 rounded-3xl mb-2">
            <Award className="w-12 h-12 animate-bounce" />
          </div>

          <h3 className="text-2xl font-bold text-white">Quiz Complete!</h3>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <span className="text-xs text-slate-400 font-medium block">Score</span>
              <span className="text-2xl font-extrabold text-indigo-400">{score} / {questions.length}</span>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <span className="text-xs text-slate-400 font-medium block">Accuracy</span>
              <span className="text-2xl font-extrabold text-emerald-400">
                {((score / questions.length) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <span className="text-xs text-slate-400 font-medium block">Time</span>
              <span className="text-2xl font-extrabold text-purple-400">{(timerSeconds / 60).toFixed(0)}m {timerSeconds % 60}s</span>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-2 border border-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>

            {onAskAI && (
              <button
                onClick={() => onAskAI(`I just completed a ${selectedSubject} quiz for Class ${classLevel} and scored ${score}/${questions.length}. Could you give me study recommendations?`)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Review Doubts with AI</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
