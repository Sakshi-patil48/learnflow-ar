import React, { useState } from 'react';
import { Play, BookOpen, Brain, Layers, Cpu, Compass, Activity, ArrowRight, User, Mail, GraduationCap } from 'lucide-react';
import { ClassLevel } from '../types';

interface LandingPageProps {
  onRegister: (name: string, email: string, classLevel: ClassLevel) => void;
}

export default function LandingPage({ onRegister }: LandingPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel>('11th');
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onRegister(name.trim(), email.trim(), classLevel);
  };

  return (
    <div className="min-h-screen bg-[#fafafc] flex flex-col justify-between animate-fade-in">
      
      {/* 1. Header Bar */}
      <header className="border-b border-card-border bg-white py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img 
            src="/learnflow.jpeg" 
            alt="LearnFlow" 
            className="h-10 w-auto object-contain rounded"
            referrerPolicy="no-referrer"
          />
        </div>

        <nav className="flex items-center gap-6">
          <a href="#choose-us" className="text-sm font-semibold text-charcoal/70 hover:text-primary transition-all">
            Courses
          </a>
          <a href="#understanding" className="text-sm font-semibold text-charcoal/70 hover:text-primary transition-all">
            About
          </a>
          <a 
            href="#register-today" 
            className="hidden sm:inline-block bg-[#001736] hover:bg-primary-light text-white text-xs py-2 px-4 rounded-md font-bold transition-all"
          >
            Get Enrolled
          </a>
        </nav>
      </header>

      {/* 2. Hero Section */}
      <section className="py-12 md:py-20 px-6 md:px-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Info Text */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#001736] tracking-tight leading-tight">
            Make your learning <br className="hidden md:inline" />
            <span className="text-secondary">easy</span>
          </h1>
          <p className="text-lg md:text-xl text-charcoal/60 font-medium">
            See, Explore & Understand Every Concept in 3D
          </p>
          
          <div className="flex flex-wrap gap-3">
            <a
              href="#register-today"
              className="bg-[#001736] hover:bg-primary-light text-white px-6 py-3 rounded-lg text-sm font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 text-secondary" />
            </a>
            <button
              onClick={() => setDemoModalOpen(true)}
              className="border border-card-border hover:bg-surface-container text-primary px-6 py-3 rounded-lg text-sm font-bold shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
              id="btn_play_demo"
            >
              <Play className="w-4 h-4 fill-primary" />
              <span>Watch 60-sec Demo</span>
            </button>
          </div>
        </div>

        {/* Right Animated Schematic Model */}
        <div className="bg-white border border-card-border p-6 md:p-10 rounded-2xl shadow-sm relative overflow-hidden flex flex-col items-center">
          <span className="text-[10px] font-mono font-extrabold tracking-widest text-primary/40 uppercase">
            AI-Enhanced Educational Transformation
          </span>

          <div className="mt-8 flex flex-col md:flex-row items-center gap-6 md:gap-4 w-full justify-between relative">
            
            {/* Box 1: Traditional Learning Materials */}
            <div className="flex-1 flex flex-col items-center p-4 border border-card-border bg-surface-bg rounded-xl text-center w-full shadow-2xs">
              <div className="w-12 h-12 bg-[#001736]/5 text-[#001736] rounded-full flex items-center justify-center mb-2.5">
                <BookOpen className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-primary">Traditional Materials</p>
              <p className="text-[10px] text-charcoal/50 mt-1">Flat diagrams & static book chapters</p>
            </div>

            {/* Connecting Arrow 1 */}
            <div className="hidden md:block text-secondary animate-pulse shrink-0">
              <ArrowRight className="w-5 h-5" />
            </div>

            {/* Box 2: AI Processing */}
            <div className="flex-1 flex flex-col items-center p-4 border border-[#fe6a34]/20 bg-[#fe6a34]/5 rounded-xl text-center w-full shadow-2xs relative">
              <div className="absolute -top-2 -right-2 bg-secondary text-white text-[8px] font-mono px-2 py-0.5 rounded-full font-bold animate-pulse">
                LIVE
              </div>
              <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center mb-2.5 shadow-md">
                <Brain className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-primary">AI Processing</p>
              <p className="text-[10px] text-charcoal/50 mt-1">Parsing syllabus text & structure</p>
            </div>

            {/* Connecting Arrow 2 */}
            <div className="hidden md:block text-secondary animate-pulse shrink-0">
              <ArrowRight className="w-5 h-5" />
            </div>

            {/* Box 3: Interactive 3D Hologram */}
            <div className="flex-1 flex flex-col items-center p-4 border border-card-border bg-[#001736] text-white rounded-xl text-center w-full shadow-md">
              <div className="w-12 h-12 bg-white/10 text-secondary rounded-full flex items-center justify-center mb-2.5 animate-bounce" style={{ animationDuration: '3s' }}>
                <Layers className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-white">Interactive Hologram</p>
              <p className="text-[10px] text-white/50 mt-1">Dynamic 3D spatial models to explore</p>
            </div>

          </div>

          {/* Dotted lines background animation grid */}
          <div className="absolute inset-0 border border-primary/5 pointer-events-none rounded-2xl" />
        </div>
      </section>

      {/* 3. Stats Bar */}
      <section className="bg-[#001736] text-white py-10 px-6 border-y border-primary-light">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div>
            <h3 className="text-4xl font-extrabold text-secondary font-mono tracking-tight">500+</h3>
            <p className="text-xs font-bold text-white/60 tracking-wider uppercase mt-1">Interactive 3D Courses</p>
          </div>
          <div className="pt-6 md:pt-0">
            <h3 className="text-4xl font-extrabold text-white font-mono tracking-tight">120k+</h3>
            <p className="text-xs font-bold text-white/60 tracking-wider uppercase mt-1">Active High-Schoolers</p>
          </div>
          <div className="pt-6 md:pt-0">
            <h3 className="text-4xl font-extrabold text-secondary font-mono tracking-tight">95%</h3>
            <p className="text-xs font-bold text-white/60 tracking-wider uppercase mt-1">Syllabus Completion Rate</p>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us Section */}
      <section id="choose-us" className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-primary text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white border border-card-border p-5 rounded-xl hover:border-[#fe6a34]/40 transition-all shadow-2xs group hover:-translate-y-1">
            <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-primary">Scan & Learn</h3>
            <p className="text-xs text-charcoal/60 mt-2 leading-relaxed">
              Upload a textbook page and instantly generate an interactive learning model of any topic.
            </p>
          </div>

          <div className="bg-white border border-card-border p-5 rounded-xl hover:border-primary/40 transition-all shadow-2xs group hover:-translate-y-1">
            <div className="w-10 h-10 bg-[#001736]/10 text-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-primary">Context-Aware AI Tutor</h3>
            <p className="text-xs text-charcoal/60 mt-2 leading-relaxed">
              Ask questions while exploring a concept and receive explanations tailored to the selected topic.
            </p>
          </div>

          <div className="bg-white border border-card-border p-5 rounded-xl hover:border-[#fe6a34]/40 transition-all shadow-2xs group hover:-translate-y-1">
            <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-primary">Explore Every Detail</h3>
            <p className="text-xs text-charcoal/60 mt-2 leading-relaxed">
              Rotate, zoom, and inspect every node to understand concepts from every angle.
            </p>
          </div>

          <div className="bg-white border border-card-border p-5 rounded-xl hover:border-primary/40 transition-all shadow-2xs group hover:-translate-y-1">
            <div className="w-10 h-10 bg-[#001736]/10 text-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-primary">Learn Smarter</h3>
            <p className="text-xs text-charcoal/60 mt-2 leading-relaxed">
              Interactive learning improves comprehension, engagement, and long-term retention.
            </p>
          </div>

        </div>
      </section>

      {/* 5. Built for Better Understanding Section */}
      <section id="understanding" className="py-16 bg-[#001736]/5 border-y border-card-border px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Graphic representation */}
          <div className="bg-white border border-card-border p-6 rounded-2xl shadow-sm relative overflow-hidden flex flex-col items-center">
            {/* Simulation of student exploring DNA helix */}
            <div className="w-full h-64 bg-[#001736] rounded-xl relative flex items-center justify-center overflow-hidden">
              {/* Helix visual effect */}
              <div className="absolute inset-0 bg-radial-gradient from-secondary/10 to-transparent pointer-events-none" />
              <div className="relative z-10 text-center text-white p-4">
                <div className="w-16 h-16 mx-auto bg-white/10 border border-[#fe6a34]/40 rounded-full flex items-center justify-center mb-3 animate-spin" style={{ animationDuration: '8s' }}>
                  <Layers className="w-8 h-8 text-secondary" />
                </div>
                <h4 className="text-sm font-mono font-bold tracking-widest text-secondary uppercase">
                  Spatial DNA Helix Simulator
                </h4>
                <p className="text-[10px] text-white/50 mt-1 max-w-xs mx-auto">
                  Interactive real-time 3D model active on students tablet device.
                </p>
              </div>

              {/* Glowing decorative nodes */}
              <div className="absolute top-8 left-10 w-3 h-3 bg-secondary rounded-full animate-pulse shadow-[0_0_8px_#fe6a34]" />
              <div className="absolute bottom-10 right-12 w-4 h-4 bg-blue-400 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
            </div>
          </div>

          {/* Right: Pitch copy */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary">Built for Better Understanding</h2>
            <p className="text-base text-charcoal/70 leading-relaxed italic border-l-4 border-secondary pl-4 py-1 bg-white p-4 rounded-r-xl border border-card-border">
              "Learning isn't about memorizing diagrams—it's about exploring concepts. SpatialStudy transforms textbook content into interactive 3D experiences, helping students visualize, understand, and retain knowledge more effectively."
            </p>
            <p className="text-xs text-charcoal/50 leading-relaxed">
              Our unique combination of textbook scanning, high-fidelity 3D model projection, and context-aware AI Tutoring is mapped directly onto national high-school curriculums for Grades 11 and 12.
            </p>
          </div>

        </div>
      </section>

      {/* 6. Form Section */}
      <section id="register-today" className="py-16 px-6 max-w-4xl mx-auto w-full">
        <div className="bg-white border border-card-border rounded-2xl p-8 md:p-12 shadow-sm">
          <div className="text-center max-w-md mx-auto mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary">Start Your Journey Today</h2>
            <p className="text-xs text-charcoal/60 mt-2">
              Enroll in LearnFlow AR Academic Excellence Platform to unlock real-time 3D modules and smart study checklists.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full text-xs border border-card-border p-3 rounded-lg focus:border-primary focus:outline-hidden bg-surface-container-low focus:bg-white transition-all"
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
                className="w-full text-xs border border-card-border p-3 rounded-lg focus:border-primary focus:outline-hidden bg-surface-container-low focus:bg-white transition-all"
                id="input_email"
              />
            </div>

            {/* Class Selector Requirement: add the class for 9,10,11,12th .. in first dashboard then only he will select for a specific subject */}
            <div>
              <label className="text-xs font-bold text-primary flex items-center gap-1.5 mb-2 font-mono uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5 text-secondary" />
                <span>Select Grade/Class Level</span>
              </label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value as ClassLevel)}
                className="w-full text-xs border border-card-border p-3 rounded-lg focus:border-primary focus:outline-hidden bg-surface-container-low focus:bg-white transition-all font-semibold"
                id="select_grade"
              >
                <option value="11th">Class 11th (Higher Secondary)</option>
                <option value="12th">Class 12th (Final Boards & Advanced)</option>
              </select>
              <p className="text-[10px] text-charcoal/50 mt-1.5 italic">
                * Mapped to National STEM Core Curriculum & Syllabus guidelines.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#fe6a34] hover:bg-secondary-dark text-white py-3.5 px-4 rounded-lg font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
              id="btn_submit_landing_form"
            >
              <span>Submit Application & Enter Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* 60-second interactive Demo Modal */}
      {demoModalOpen && (
        <div className="fixed inset-0 bg-primary/80 flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="bg-white border border-card-border rounded-xl p-6 max-w-lg w-full shadow-lg relative">
            <h3 className="text-base font-bold text-primary mb-2">Simulated Interactive 3D Video Demo</h3>
            <p className="text-xs text-charcoal/60 mb-4">
              Watch how our spatial transformation matches page contents to interactive 3D structures.
            </p>

            <div className="w-full h-48 bg-[#001736] rounded-lg relative flex items-center justify-center overflow-hidden mb-4">
              <div className="absolute top-0 left-0 bg-secondary/80 text-white font-mono text-[9px] px-2 py-0.5 rounded-br font-semibold animate-pulse">
                PROTOTYPE DEMO PLAYING
              </div>
              <Compass className="w-12 h-12 text-secondary animate-spin" style={{ animationDuration: '4s' }} />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setDemoModalOpen(false)}
                className="bg-primary hover:bg-primary-light text-white text-xs px-4 py-2 rounded-lg font-bold cursor-pointer transition-all"
                id="btn_close_demo"
              >
                Close Demo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Footer Bar */}
      <footer className="border-t border-card-border bg-[#001736] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <img 
                src="/learnflow.jpeg" 
                alt="LearnFlow" 
                className="h-8 w-auto object-contain rounded bg-white p-0.5"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-[11px] text-white/40">
              © 2026 LearnFlow AR Professional Education. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/60">
            <span className="hover:text-white transition-colors cursor-pointer">Contact Us</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">LinkedIn</span>
            <span className="hover:text-white transition-colors cursor-pointer">YouTube</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
