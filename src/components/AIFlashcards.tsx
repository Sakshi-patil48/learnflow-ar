import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Volume2, 
  BookOpen, 
  Layers, 
  Brain,
  Lightbulb,
  Award,
  RefreshCcw,
  Zap,
  Check
} from 'lucide-react';
import { ClassLevel, SubjectName } from '../types';
import VoiceAssistant from './VoiceAssistant';

export interface Flashcard {
  id: string;
  subject: SubjectName;
  classLevel: ClassLevel;
  chapterTitle: string;
  concept: string;
  category: string;
  frontQuestion: string;
  backAnswer: string;
  formulaOrEquation?: string;
  memoryTrick?: string;
  examTip?: string;
  mastered?: boolean;
}

interface AIFlashcardsProps {
  selectedSubject: SubjectName;
  classLevel: ClassLevel;
  onAskAI?: (prompt: string) => void;
}

const PRESET_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc_bio_1',
    subject: 'Biology',
    classLevel: '11th',
    chapterTitle: 'Biological Classification',
    concept: 'Five Kingdom Classification',
    category: 'Taxonomy',
    frontQuestion: 'Who proposed the Five Kingdom Classification and what are the 5 kingdoms?',
    backAnswer: 'R.H. Whittaker (1969). The five kingdoms are Monera, Protista, Fungi, Plantae, and Animalia based on cell structure, thallus organization, and mode of nutrition.',
    memoryTrick: 'Remember "My Poor Friend Plays Accordion" (Monera, Protista, Fungi, Plantae, Animalia)',
    examTip: 'Whittaker did not include Viruses, Viroids, and Lichens in his 5 Kingdom classification.'
  },
  {
    id: 'fc_bio_2',
    subject: 'Biology',
    classLevel: '12th',
    chapterTitle: 'Molecular Basis of Inheritance',
    concept: 'DNA Double Helix',
    category: 'Genetics',
    frontQuestion: 'What are the key structural features of the B-DNA double helix model?',
    backAnswer: 'Two polynucleotide chains spiraled right-handed. Pitch = 3.4 nm (10 base pairs per turn), distance between base pairs = 0.34 nm. Adenine pairs with Thymine (2 H-bonds) and Guanine pairs with Cytosine (3 H-bonds).',
    formulaOrEquation: 'A + G = T + C (Chargaff\'s Rule: Purines = Pyrimidines)',
    examTip: 'Always state hydrogen bond counts: A=T has 2, G≡C has 3 bonds.'
  },
  {
    id: 'fc_phy_1',
    subject: 'Physics',
    classLevel: '11th',
    chapterTitle: 'Laws of Motion',
    concept: 'Newton\'s Second Law',
    category: 'Mechanics',
    frontQuestion: 'State Newton\'s Second Law of Motion and its mathematical vector form.',
    backAnswer: 'The rate of change of linear momentum of a body is directly proportional to the applied net external force and takes place in the direction of the force.',
    formulaOrEquation: 'F_net = d(p)/dt = m · a',
    memoryTrick: 'Force equals Mass times Acceleration (F = ma)',
    examTip: 'F = ma only holds true when mass m remains constant.'
  },
  {
    id: 'fc_phy_2',
    subject: 'Physics',
    classLevel: '12th',
    chapterTitle: 'Electrostatics',
    concept: 'Coulomb\'s Law',
    category: 'Electromagnetism',
    frontQuestion: 'What is Coulomb\'s Law for the electrostatic force between two point charges?',
    backAnswer: 'The electrostatic force between two stationary point charges is directly proportional to the product of their charges and inversely proportional to the square of the distance between them.',
    formulaOrEquation: 'F = (1 / 4πε₀) · (|q₁ · q₂| / r²)',
    memoryTrick: 'Like charges repel, opposite charges attract with inverse square distance.',
    examTip: 'Value of k = 1/(4πε₀) ≈ 8.99 × 10⁹ N·m²/C² in vacuum.'
  },
  {
    id: 'fc_chem_1',
    subject: 'Chemistry',
    classLevel: '11th',
    chapterTitle: 'Structure of Atom',
    concept: 'Bohr Radius Formula',
    category: 'Quantum Chemistry',
    frontQuestion: 'What is the formula for the radius of the nth orbit of a hydrogenic atom according to Bohr?',
    backAnswer: 'The radius of the nth stationary orbit is directly proportional to n² and inversely proportional to the atomic number Z.',
    formulaOrEquation: 'r_n = 0.529 · (n² / Z) Å  (or 52.9 pm · n²/Z)',
    memoryTrick: 'First orbit radius of Hydrogen (n=1, Z=1) is 0.529 Å (52.9 pm).',
    examTip: 'Remember that velocity v_n ∝ Z/n while radius r_n ∝ n²/Z.'
  },
  {
    id: 'fc_chem_2',
    subject: 'Chemistry',
    classLevel: '12th',
    chapterTitle: 'Organic Chemistry',
    concept: 'Tetrahedral Carbon',
    category: 'Stereochemistry',
    frontQuestion: 'Explain the hybridization and geometry of methane (CH₄).',
    backAnswer: 'The central carbon undergoes sp³ hybridization, forming four equivalent hybrid orbitals pointing towards the corners of a regular tetrahedron with 109.5° bond angles.',
    formulaOrEquation: 'sp³ Hybridization | Bond Angle = 109.5°',
    memoryTrick: 'Four single sigma bonds = sp³ = 109.5° tetrahedral.',
    examTip: 'Double bond carbon is sp² (120°), triple bond carbon is sp (180°).'
  },
  {
    id: 'fc_math_1',
    subject: 'Mathematics',
    classLevel: '11th',
    chapterTitle: 'Trigonometry',
    concept: 'Pythagorean Identities',
    category: 'Trigonometric Ratios',
    frontQuestion: 'What are the 3 fundamental Pythagorean trigonometric identities?',
    backAnswer: '1) sin²(θ) + cos²(θ) = 1\n2) 1 + tan²(θ) = sec²(θ)\n3) 1 + cot²(θ) = cosec²(θ)',
    formulaOrEquation: 'sin²θ + cos²θ = 1',
    examTip: 'Identity 2 holds for θ ≠ (2n+1)π/2 where tan(θ) is defined.'
  }
];

export default function AIFlashcards({
  selectedSubject,
  classLevel,
  onAskAI
}: AIFlashcardsProps) {
  // Active cards state
  const [cards, setCards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem('learnflow_flashcards');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse flashcards", e);
      }
    }
    return PRESET_FLASHCARDS;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Filter cards by active subject and grade
  const subjectCards = cards.filter(
    c => c.subject === selectedSubject && c.classLevel === classLevel
  );

  const currentCard = subjectCards[currentIndex] || subjectCards[0] || cards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % Math.max(subjectCards.length, 1));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + subjectCards.length) % Math.max(subjectCards.length, 1));
  };

  const handleMastered = (id: string) => {
    const updated = cards.map(c => {
      if (c.id === id) {
        return { ...c, mastered: !c.mastered };
      }
      return c;
    });
    setCards(updated);
    localStorage.setItem('learnflow_flashcards', JSON.stringify(updated));
    handleNext();
  };

  const handleGenerateDeck = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Generate 3 high-yield exam revision flashcards for Class ${classLevel} ${selectedSubject}. Format as clear short Q&A.`
          }],
          selectedClass: classLevel,
          selectedSubject: selectedSubject
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newCard: Flashcard = {
          id: `fc_ai_${Date.now()}`,
          subject: selectedSubject,
          classLevel: classLevel,
          chapterTitle: 'AI Generated Revision',
          concept: `High-Yield ${selectedSubject} Concept`,
          category: 'AI Revision',
          frontQuestion: `Key Revision Question on ${selectedSubject} (Class ${classLevel})`,
          backAnswer: data.reply || 'Detailed AI revision breakdown.',
          memoryTrick: 'Review regularly before your examination!'
        };

        const updated = [newCard, ...cards];
        setCards(updated);
        localStorage.setItem('learnflow_flashcards', JSON.stringify(updated));
        setCurrentIndex(0);
        setIsFlipped(false);
      }
    } catch (e) {
      console.error("Flashcard deck generation failed", e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Top Header & Deck Info */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-semibold">
              Class {classLevel} {selectedSubject} Deck
            </span>
            <span className="text-slate-400 text-xs font-mono">
              Card {currentIndex + 1} of {subjectCards.length}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Smart Revision Flashcards</h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Click to flip cards and test your active recall. Narration available via Text-to-Speech.
          </p>
        </div>

        <button
          onClick={handleGenerateDeck}
          disabled={isGenerating}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-2xl text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 cursor-pointer"
        >
          {isGenerating ? (
            <RotateCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>Generate AI Deck</span>
        </button>
      </div>

      {/* Interactive 3D Flip Card */}
      {currentCard ? (
        <div className="perspective-1000 min-h-[380px] sm:min-h-[420px] flex flex-col justify-between">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`w-full min-h-[340px] sm:min-h-[380px] bg-slate-900/95 border ${
              isFlipped ? 'border-purple-500/50 shadow-purple-500/10' : 'border-indigo-500/40 shadow-indigo-500/10'
            } rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl cursor-pointer transition-all duration-500 relative flex flex-col justify-between overflow-hidden group`}
          >
            {/* Ambient Background Glow */}
            <div className={`absolute -top-24 -right-24 w-56 h-56 ${isFlipped ? 'bg-purple-500/10' : 'bg-indigo-500/10'} rounded-full blur-3xl transition-all duration-500`}></div>

            {/* Top Card Bar */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-slate-800 border border-slate-700 text-indigo-400 rounded-xl">
                  <Brain className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">{currentCard.chapterTitle}</h4>
                  <p className="text-[11px] text-indigo-400 font-mono">{currentCard.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <VoiceAssistant textToSpeak={isFlipped ? currentCard.backAnswer : currentCard.frontQuestion} />
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                  <RotateCw className="w-3 h-3" />
                  {isFlipped ? 'Answer (Back)' : 'Question (Front)'}
                </span>
              </div>
            </div>

            {/* Middle Card Content */}
            <div className="my-auto py-6 relative z-10">
              {!isFlipped ? (
                /* FRONT VIEW: QUESTION */
                <div className="space-y-4 text-center max-w-2xl mx-auto">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                    {currentCard.concept}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-relaxed">
                    {currentCard.frontQuestion}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Click anywhere on card to reveal answer
                  </p>
                </div>
              ) : (
                /* BACK VIEW: DETAILED ANSWER */
                <div className="space-y-4 max-w-2xl mx-auto animate-fade-in">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                    Solution & Explanation
                  </span>

                  <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed whitespace-pre-line">
                    {currentCard.backAnswer}
                  </p>

                  {currentCard.formulaOrEquation && (
                    <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-2xl text-purple-200 font-mono text-sm">
                      <strong className="text-purple-400 text-xs block mb-1">Key Equation / Rule:</strong>
                      {currentCard.formulaOrEquation}
                    </div>
                  )}

                  {currentCard.memoryTrick && (
                    <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl text-indigo-200 text-xs flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-indigo-300 font-semibold">Memory Mnemonic:</strong> {currentCard.memoryTrick}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Card Controls */}
            <div className="flex items-center justify-between relative z-10 border-t border-slate-800/80 pt-4">
              <span className="text-xs text-slate-500">
                {currentCard.mastered ? '✓ Marked Mastered' : '• Review Pending'}
              </span>

              <span className="text-xs text-purple-400 font-semibold group-hover:underline flex items-center gap-1">
                Flip to {isFlipped ? 'Question' : 'Answer'}
                <RotateCw className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Navigation & Spaced Repetition Controls */}
          <div className="flex items-center justify-between gap-4 mt-6">
            <button
              onClick={handlePrev}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-2xl border border-slate-800 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleMastered(currentCard.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                  currentCard.mastered
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-slate-800 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{currentCard.mastered ? 'Mastered!' : 'Mark Got It'}</span>
              </button>

              {onAskAI && (
                <button
                  onClick={() => onAskAI(`Can you explain "${currentCard.concept}" from ${currentCard.chapterTitle} in simple terms with examples?`)}
                  className="px-4 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-2xl text-xs font-semibold border border-indigo-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ask AI Tutor</span>
                </button>
              )}
            </div>

            <button
              onClick={handleNext}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-2xl border border-slate-800 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-500">
          No flashcards available for Class {classLevel} {selectedSubject}. Click "Generate AI Deck" to create instant cards!
        </div>
      )}
    </div>
  );
}
