import React, { useState } from 'react';
import { 
  Play, 
  ArrowRight, 
  User, 
  Mail, 
  GraduationCap, 
  Sparkles, 
  Brain, 
  Box, 
  Bot, 
  Compass, 
  Upload, 
  Layers, 
  CheckCircle, 
  FlaskConical,
  Check,
  ArrowLeft
} from 'lucide-react';
import { ClassLevel } from '../types';

const heroReferenceImage = '/hero-elearning.jpg';
const aiTutorImage = '/ai-tutor-student.jpg';

interface LandingPageProps {
  onRegister: (name: string, email: string, classLevel: ClassLevel) => void;
}

export default function LandingPage({ onRegister }: LandingPageProps) {
  const [showRegisterPage, setShowRegisterPage] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel>('11th');
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onRegister(name.trim(), email.trim(), classLevel);
  };

  const handleOpenRegister = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setShowRegisterPage(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setShowRegisterPage(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dedicated Registration Page View
  if (showRegisterPage) {
    return (
      <div className="min-h-screen bg-surface-bg text-charcoal flex flex-col justify-between animate-fade-in font-sans selection:bg-cyan-100 selection:text-cyan-900">
        
        {/* Header Bar with Back Button */}
        <header className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-card-border/60 shadow-xs">
          <div className="flex justify-between items-center px-6 md:px-12 h-20 max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <img 
                src="/learnflow-logo.png" 
                alt="LearnFlow AR Logo" 
                className="h-10 w-auto object-contain rounded-lg shadow-2xs"
                referrerPolicy="no-referrer"
              />
              <span className="text-xl md:text-2xl font-extrabold font-display tracking-tight text-primary">
                LearnFlow <span className="text-[#00696f]">AR</span>
              </span>
            </div>

            <button
              onClick={handleBackToHome}
              className="inline-flex items-center gap-2 text-xs font-bold text-charcoal/70 hover:text-primary transition-colors py-2 px-4 rounded-full border border-card-border hover:bg-surface-container-low cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </header>

        {/* Dedicated Registration Form Card */}
        <main className="flex-1 flex items-center justify-center py-12 md:py-20 px-6 max-w-3xl mx-auto w-full animate-slide-up">
          <div className="bg-white border border-card-border/90 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden w-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="text-center max-w-md mx-auto mb-10 space-y-2">
              <h1 className="text-2xl md:text-3xl font-extrabold font-display text-primary">
                Start Your Journey Today
              </h1>
              <p className="text-xs md:text-sm text-charcoal/65 leading-relaxed">
                Enroll in LearnFlow AR Academic Excellence Platform to unlock real-time 3D modules and smart study checklists.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
              <div>
                <label className="text-xs font-bold text-primary flex items-center gap-1.5 mb-2 font-mono uppercase tracking-wider">
                  <User className="w-3.5 h-3.5 text-secondary" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs border border-card-border p-3.5 rounded-xl focus:border-primary focus:outline-hidden bg-surface-container-low focus:bg-white transition-all font-medium"
                  id="input_fullname"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-primary flex items-center gap-1.5 mb-2 font-mono uppercase tracking-wider">
                  <Mail className="w-3.5 h-3.5 text-secondary" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs border border-card-border p-3.5 rounded-xl focus:border-primary focus:outline-hidden bg-surface-container-low focus:bg-white transition-all font-medium"
                  id="input_email"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-primary flex items-center gap-1.5 mb-2 font-mono uppercase tracking-wider">
                  <GraduationCap className="w-3.5 h-3.5 text-secondary" />
                  <span>Select Grade/Class Level</span>
                </label>
                <select
                  value={classLevel}
                  onChange={(e) => setClassLevel(e.target.value as ClassLevel)}
                  className="w-full text-xs border border-card-border p-3.5 rounded-xl focus:border-primary focus:outline-hidden bg-surface-container-low focus:bg-white transition-all font-semibold"
                  id="select_grade"
                >
                  <option value="11th">Class 11th (Higher Secondary)</option>
                  <option value="12th">Class 12th (Final Boards & Advanced)</option>
                </select>
                <p className="text-[10px] text-charcoal/50 mt-2 italic">
                  * Mapped to National STEM Core Curriculum & Syllabus guidelines.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#fe6a34] hover:bg-[#e05623] text-white py-4 px-6 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#fe6a34]/25 hover:shadow-xl transition-all cursor-pointer transform hover:scale-[1.01] active:scale-95"
                id="btn_submit_landing_form"
              >
                <span>Submit Application & Enter Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </main>

        {/* Dedicated Page Footer */}
        <footer className="border-t border-card-border/60 bg-primary text-white py-8 px-6 md:px-12 text-center text-xs text-white/50">
          © 2026 LearnFlow AR Professional Education. All rights reserved.
        </footer>
      </div>
    );
  }

  // Standard Landing Page View
  return (
    <div className="min-h-screen bg-surface-bg text-charcoal flex flex-col justify-between animate-fade-in font-sans selection:bg-cyan-100 selection:text-cyan-900">
      
      {/* 1. Sticky Navigation Header */}
      <header className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-card-border/60 shadow-xs transition-all">
        <div className="flex justify-between items-center px-6 md:px-12 h-20 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <img 
              src="/learnflow-logo.png" 
              alt="LearnFlow AR Logo" 
              className="h-10 w-auto object-contain rounded-lg shadow-2xs"
              referrerPolicy="no-referrer"
            />
            <span className="text-xl md:text-2xl font-extrabold font-display tracking-tight text-primary">
              LearnFlow <span className="text-[#00696f]">AR</span>
            </span>
          </div>

          <nav className="hidden md:flex gap-8 items-center">
            <a href="#home" className="text-sm font-semibold text-charcoal/80 hover:text-[#00696f] transition-colors py-1">
              Home
            </a>
            <a href="#features" className="text-sm font-semibold text-charcoal/70 hover:text-[#00696f] transition-colors py-1">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-semibold text-charcoal/70 hover:text-[#00696f] transition-colors py-1">
              How It Works
            </a>
            <a href="#demo" className="text-sm font-semibold text-charcoal/70 hover:text-[#00696f] transition-colors py-1">
              Demo
            </a>
            <button 
              onClick={handleOpenRegister} 
              className="text-sm font-semibold text-charcoal/70 hover:text-[#00696f] transition-colors py-1 cursor-pointer"
            >
              Get Enrolled
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenRegister}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 text-xs font-bold text-primary hover:bg-primary/5 transition-all cursor-pointer"
            >
              Log In
            </button>
            <button 
              onClick={handleOpenRegister}
              className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-light text-white text-xs font-bold shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section id="home" className="pt-8 md:pt-16 pb-16 md:pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-1/2 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Left Hero Content */}
          <div className="flex-1 space-y-6 text-center lg:text-left animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-surface border border-cyan-200 text-[#00696f] text-xs font-bold tracking-wide ai-glow shadow-xs">
              <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
              <span>AI Powered Learning Revolution</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-primary leading-[1.15] tracking-tight">
              See Your Textbooks <br className="hidden sm:inline" />
              <span className="gradient-text">Come to Life</span>
            </h1>

            <p className="text-base md:text-lg text-charcoal/70 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Stop reading about the universe—step inside it. LearnFlow AR uses advanced spatial computing to transform any physical textbook into a living, breathing 3D laboratory.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={handleOpenRegister}
                className="px-8 py-3.5 rounded-full bg-primary hover:bg-primary-light text-white font-bold text-sm shadow-lg shadow-primary/25 hover:shadow-xl transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 text-secondary" />
              </button>

              <button
                onClick={() => setDemoModalOpen(true)}
                className="px-8 py-3.5 rounded-full glass-surface border border-card-border hover:bg-white text-primary font-bold text-sm shadow-xs transition-all flex items-center gap-2 hover:shadow-md cursor-pointer"
                id="btn_play_demo"
              >
                <Play className="w-4 h-4 fill-primary text-primary" />
                <span>Live Demo</span>
              </button>
            </div>

            {/* Feature Highlights Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-6 text-xs font-bold text-charcoal/65 border-t border-card-border/60">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00696f]" />
                <span>AI Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-[#00696f]" />
                <span>Interactive 3D</span>
              </div>
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#00696f]" />
                <span>Smart Tutor</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Container */}
          <div className="flex-1 w-full relative animate-slide-up">
            {/* Background glowing aura */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#00696f]/20 via-cyan-300/30 to-[#fe6a34]/15 blur-2xl animate-hero-glow pointer-events-none" />

            {/* Floating Frame */}
            <div className="relative rounded-2xl glass-surface p-3 sm:p-4 shadow-2xl transition-all duration-500 animate-float-slow hover:scale-[1.025] hover:shadow-[0_28px_65px_rgba(0,23,54,0.18)] group">
              <div className="overflow-hidden rounded-xl bg-white border border-white/80">
                <img
                  src={heroReferenceImage}
                  alt="LearnFlow AR E-learning environment with laptop and interactive 3D books"
                  className="w-full h-auto max-h-[520px] object-cover object-center transform transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>

              {/* Floating Badge Overlay */}
              <div className="absolute -bottom-4 -left-4 sm:left-4 glass-surface border border-white/90 bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-lg flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#00696f]/10 flex items-center justify-center text-[#00696f]">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Spatial Study Active</p>
                  <p className="text-xs font-bold text-primary">Scan. Explore. Master.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. AI Capability Highlight Section */}
        <section id="features" className="py-20 px-6 md:px-12 bg-white border-y border-card-border/60 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold font-display text-primary">
                Learning That Truly Understands You
              </h2>
              <p className="text-sm md:text-base text-charcoal/65 leading-relaxed">
                Our core engine combines neural networking with spatial mapping to create seamless educational overlays.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="glass-surface p-7 rounded-2xl border border-card-border/80 hover:border-[#00696f]/40 transition-all duration-300 shadow-xs hover:-translate-y-2 hover:shadow-xl group">
                <div className="w-12 h-12 rounded-xl bg-[#00696f]/10 text-[#00696f] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">AI Concept Understanding</h3>
                <p className="text-xs text-charcoal/65 leading-relaxed">
                  Advanced NLP deciphers complex scientific principles from static pages instantly.
                </p>
              </div>

              {/* Card 2 */}
              <div className="glass-surface p-7 rounded-2xl border border-card-border/80 hover:border-secondary/40 transition-all duration-300 shadow-xs hover:-translate-y-2 hover:shadow-xl group">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">Real-Time Visual Generation</h3>
                <p className="text-xs text-charcoal/65 leading-relaxed">
                  Generative AI constructs hyper-accurate 3D models based on text descriptions.
                </p>
              </div>

              {/* Card 3 */}
              <div className="glass-surface p-7 rounded-2xl border border-card-border/80 hover:border-[#00696f]/40 transition-all duration-300 shadow-xs hover:-translate-y-2 hover:shadow-xl group">
                <div className="w-12 h-12 rounded-xl bg-[#00696f]/10 text-[#00696f] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">Intelligent AI Tutor</h3>
                <p className="text-xs text-charcoal/65 leading-relaxed">
                  Your 24/7 personal professor answering questions and guiding explorations.
                </p>
              </div>

              {/* Card 4 */}
              <div className="glass-surface p-7 rounded-2xl border border-card-border/80 hover:border-secondary/40 transition-all duration-300 shadow-xs hover:-translate-y-2 hover:shadow-xl group">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">AR Based Exploration</h3>
                <p className="text-xs text-charcoal/65 leading-relaxed">
                  Interact with models using gesture controls for a truly immersive experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Architecture Pipeline Section */}
        <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="glass-surface rounded-3xl border border-card-border/80 p-8 md:p-14 shadow-lg text-center space-y-8">
            <div className="max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold font-display text-primary">
                How Your Study Session Transforms
              </h2>
              <p className="text-xs md:text-sm text-charcoal/65">
                Witness the seamless transformation from physical ink to digital life through our proprietary AR stack.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <div className="bg-white p-5 rounded-xl border border-card-border/70 shadow-2xs space-y-3">
                <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  1
                </div>
                <h4 className="text-sm font-bold text-primary">Textbook Scanning</h4>
                <p className="text-xs text-charcoal/60 leading-relaxed">
                  Upload or scan any page from Class 11 or 12 STEM textbooks.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-card-border/70 shadow-2xs space-y-3">
                <div className="w-8 h-8 rounded-full bg-[#00696f] text-white text-xs font-bold flex items-center justify-center">
                  2
                </div>
                <h4 className="text-sm font-bold text-primary">AI Neural Analysis</h4>
                <p className="text-xs text-charcoal/60 leading-relaxed">
                  Gemini AI extracts concepts, terms, and key structural parameters.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-card-border/70 shadow-2xs space-y-3">
                <div className="w-8 h-8 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">
                  3
                </div>
                <h4 className="text-sm font-bold text-primary">3D Model Generation</h4>
                <p className="text-xs text-charcoal/60 leading-relaxed">
                  Interactive spatial 3D models render instantly in full detail.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-card-border/70 shadow-2xs space-y-3">
                <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  4
                </div>
                <h4 className="text-sm font-bold text-primary">Interactive Mastery</h4>
                <p className="text-xs text-charcoal/60 leading-relaxed">
                  Ask AI Tutor questions while dissecting the model in real time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. How It Works Steps */}
        <section id="how-it-works" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold font-display text-primary">Four Steps to Spatial Mastery</h2>
            <p className="text-sm text-charcoal/65">Experience learning designed around curiosity and intuition.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border border-card-border/80 flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform">
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  1
                </span>
                <Upload className="w-8 h-8 text-[#00696f]" />
              </div>
              <h4 className="text-base font-bold text-primary mb-2">Upload Content</h4>
              <p className="text-xs text-charcoal/65 leading-relaxed">
                Snap a photo of any page or select a chapter from your syllabus.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border border-card-border/80 flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform">
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#00696f] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  2
                </span>
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-base font-bold text-primary mb-2">AI Understands</h4>
              <p className="text-xs text-charcoal/65 leading-relaxed">
                Our neural engine extracts key concepts and relationships.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border border-card-border/80 flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform">
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  3
                </span>
                <Box className="w-8 h-8 text-secondary" />
              </div>
              <h4 className="text-base font-bold text-primary mb-2">Generate Visuals</h4>
              <p className="text-xs text-charcoal/65 leading-relaxed">
                Custom 3D environments are rendered in your spatial view.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border border-card-border/80 flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform">
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  4
                </span>
                <GraduationCap className="w-8 h-8 text-[#00696f]" />
              </div>
              <h4 className="text-base font-bold text-primary mb-2">Explore & Learn</h4>
              <p className="text-xs text-charcoal/65 leading-relaxed">
                Interact with the content as if it were physically present.
              </p>
            </div>
          </div>
        </section>

        {/* 6. AI Companion Showcase */}
        <section className="py-20 px-6 md:px-12 bg-surface-container-low border-y border-card-border/60">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold font-display text-primary leading-tight">
                Your Personal <span className="gradient-text">AI Learning</span> Companion
              </h2>
              <p className="text-sm text-charcoal/70 leading-relaxed">
                Never get stuck again. Our integrated AI Tutor doesn't just give answers—it creates tailored visual analogies and step-by-step interactive breakdowns based on your unique learning style.
              </p>

              <ul className="space-y-3 pt-2">
                <li className="flex items-start gap-3 text-xs md:text-sm font-semibold text-charcoal">
                  <Check className="w-5 h-5 text-[#00696f] shrink-0 mt-0.5" />
                  <span>Adaptive explanations based on Class 11 & 12 curriculum</span>
                </li>
                <li className="flex items-start gap-3 text-xs md:text-sm font-semibold text-charcoal">
                  <Check className="w-5 h-5 text-[#00696f] shrink-0 mt-0.5" />
                  <span>On-demand visual demonstrations for any STEM query</span>
                </li>
                <li className="flex items-start gap-3 text-xs md:text-sm font-semibold text-charcoal">
                  <Check className="w-5 h-5 text-[#00696f] shrink-0 mt-0.5" />
                  <span>Real-time voice and text interaction built right in</span>
                </li>
              </ul>
            </div>

            <div className="flex-1 w-full relative animate-slide-up">
              <div className="p-3 sm:p-4 glass-surface rounded-3xl shadow-xl border border-white relative group animate-float-slow hover:scale-[1.02] transition-all duration-500">
                <div className="overflow-hidden rounded-2xl bg-white border border-white/80 shadow-md relative">
                  <img
                    src={aiTutorImage}
                    alt="Student with headphones learning with LearnFlow AI Tutor"
                    className="w-full h-auto max-h-[480px] object-cover object-center transform transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  {/* Floating AI Speech Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/80 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-semibold text-primary">
                      “Hey! Need help with this physics or chemistry concept?”
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Success Stories Section */}
        <section id="demo" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold font-display text-primary">Real Success, Real Impact</h2>
            <p className="text-sm text-charcoal/65">
              Don't just observe; engage. Our interactive simulations bring complex theories to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-surface p-7 rounded-2xl border border-card-border/80 shadow-xs relative overflow-hidden space-y-4 hover:-translate-y-1 transition-all">
              <span className="inline-block px-3 py-1 rounded-full bg-[#00696f]/10 text-[#00696f] text-[10px] font-extrabold uppercase">
                Score: 98/100
              </span>
              <h3 className="text-base font-bold text-primary">Mastering Organic Chemistry</h3>
              <p className="text-xs text-charcoal/65 leading-relaxed">
                "Ananya transformed her exam prep by visualizing complex molecular bonds in 3D. It was like the textbook finally spoke my language."
              </p>
            </div>

            <div className="glass-surface p-7 rounded-2xl border border-card-border/80 shadow-xs relative overflow-hidden space-y-4 hover:-translate-y-1 transition-all">
              <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-extrabold uppercase">
                30% Faster Learning
              </span>
              <h3 className="text-base font-bold text-primary">Conquering Physics Finals</h3>
              <p className="text-xs text-charcoal/65 leading-relaxed">
                "Rahul used the AI Tutor to break down electromagnetism. The step-by-step 3D visualizations made the hardest concepts feel simple."
              </p>
            </div>

            <div className="glass-surface p-7 rounded-2xl border border-card-border/80 shadow-xs relative overflow-hidden space-y-4 hover:-translate-y-1 transition-all">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase">
                Top of Class
              </span>
              <h3 className="text-base font-bold text-primary">Biology Breakthrough</h3>
              <p className="text-xs text-charcoal/65 leading-relaxed">
                "Sara's study group used AR to explore the human circulatory system together. We stopped memorizing and started seeing how it works."
              </p>
            </div>
          </div>
        </section>

        {/* 8. Final CTA Banner */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="gradient-bg rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight">
              Ready to Transform The Way You Learn?
            </h2>
            <p className="text-sm text-white/80 max-w-xl mx-auto">
              Join thousands of students experiencing interactive 3D STEM lessons and smart AI tutoring today.
            </p>
            <div className="pt-2">
              <button
                onClick={handleOpenRegister}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-primary font-extrabold text-sm hover:bg-cyan-50 transition-colors shadow-lg cursor-pointer"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4 text-secondary" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 60-Second Demo Modal */}
      {demoModalOpen && (
        <div className="fixed inset-0 bg-primary/80 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="bg-white border border-card-border rounded-2xl p-6 max-w-lg w-full shadow-2xl relative space-y-4">
            <h3 className="text-lg font-bold text-primary font-display">Simulated Interactive 3D Video Demo</h3>
            <p className="text-xs text-charcoal/65 leading-relaxed">
              Watch how our spatial transformation matches page contents to interactive 3D structures.
            </p>

            <div className="w-full h-52 bg-primary rounded-xl relative flex items-center justify-center overflow-hidden">
              <div className="absolute top-2 left-2 bg-secondary text-white font-mono text-[9px] px-2 py-0.5 rounded font-semibold animate-pulse">
                PROTOTYPE DEMO PLAYING
              </div>
              <Compass className="w-12 h-12 text-secondary animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setDemoModalOpen(false)}
                className="bg-primary hover:bg-primary-light text-white text-xs px-5 py-2.5 rounded-xl font-bold cursor-pointer transition-all shadow-xs"
                id="btn_close_demo"
              >
                Close Demo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-card-border/60 bg-primary text-white py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <img 
                src="/learnflow-logo.png" 
                alt="LearnFlow AR" 
                className="h-8 w-auto object-contain rounded-lg bg-white/95 p-0.5"
                referrerPolicy="no-referrer"
              />
              <span className="font-bold text-white font-display text-base">LearnFlow AR</span>
            </div>
            <p className="text-[11px] text-white/50">
              © 2026 LearnFlow AR Professional Education. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/70">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <button onClick={handleOpenRegister} className="hover:text-white transition-colors cursor-pointer">Get Enrolled</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
