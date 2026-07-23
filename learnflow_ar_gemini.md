# LearnFlow AR - Project Context & Memory

## Project Overview
LearnFlow AR is an AI-powered interactive learning and AR textbook platform built with React 19, Vite, TypeScript, Tailwind CSS, Express, Mongoose, and Google Gemini API (`@google/genai`).

## Project Details
- **Root Directory**: `C:\Users\sanke\learnflow-ar-main\learnflow-ar-main`
- **Tech Stack**: 
  - Frontend: React 19, TypeScript, Vite 6, Tailwind CSS v4, Motion, Lucide icons
  - Backend / Server: Express (`server.ts`) running with `tsx` in dev mode
  - Database: MongoDB Atlas (`sanketbhende0_db_user` on `cluster1.xnt7uvf.mongodb.net/learnflow`)
  - AI Integration: `@google/genai` (Google Gemini SDK)

## Live Deployment & Connectivity
- **Live URL**: [https://learn-flow.pages.dev](https://learn-flow.pages.dev)
- **Direct Preview URL**: [https://50e25046.learn-flow.pages.dev](https://50e25046.learn-flow.pages.dev)
- **Local Dev Server**: `http://localhost:7676` (Launch via `start.bat`)
- **MongoDB Status**: 100% Connected & Verified (`students`, `chapters`, `model3ditems` collections active).
- **Working MongoDB URI**: Configured via `MONGODB_URI` environment variable in `.env`

## Project Structure
- `src/App.tsx`: Main entry app component managing navigation & views
- `src/components/`:
  - `LandingPage.tsx`: Product introduction & landing interface
  - `Dashboard.tsx`: Main student dashboard overview with live XP badge, Level counter, and navigation tabs.
  - `AdminPanel.tsx`: Admin Management Console with PIN lock screen, student manager, curriculum editor, 3D asset library manager, AI tuning, and backup/restore.
  - `Interactive3DViewer.tsx`: WebXR Real Camera AR View, Exploded View Assembly Slider, X-Ray Wireframe Mode, Interactive Hotspots, and PNG Snapshot Downloader.
  - `AIQuizGenerator.tsx`: Interactive MCQ quiz engine with live timer, instant answer verification, AI explanation, and score history.
  - `AIFlashcards.tsx`: 3D flip-card revision deck with spaced repetition ("Got It" / "Review Later"), audio narration, and AI deck generator.
  - `VoiceAssistant.tsx`: Text-to-Speech (TTS) narration engine and Speech-to-Text (STT) voice dictation hooks.
  - `Leaderboard.tsx`: Student rankings, XP level progression, daily streaks, and achievement badges ("AR Pioneer", "Quiz Wizard", etc.).
  - `PDFExporter.tsx`: High-fidelity printable PDF chapter summary & formula sheet generator.
  - `Bookshelf.tsx`: NCERT / subject textbook library & subject selector
  - `ScanLearn.tsx`: AR image / textbook scanner & interactive visualizer
  - `AITutor.tsx`: Interactive AI study companion powered by Gemini
  - `TaskPlanner.tsx`: Daily study tasks & schedule manager
  - `Textbook2DReader.tsx`: Chapter reading view with interactive notes/AI assist & PDF Exporter.
- `src/ncertData.ts`: NCERT curriculum & chapter metadata
- `src/chapterContentData.ts`: Detailed chapter content & 3D scene data
- `server.ts`: Express backend server setup with Mongoose models & API endpoints

## Completed Feature Roadmap Progress
1. ✅ **Module 1: Admin Management Panel (`/admin`) & Auth Guard**
   - Admin Security PIN/Password guard (Default PINs: `admin` or `9822725265`).
   - Student Account Management, Curriculum Editor, 3D Asset Manager, AI Tuning, and Backup/Restore.
2. ✅ **Module 2: AI Quizzes, Revision Flashcards & Voice Assistant**
   - MCQ Quiz Generator (`AIQuizGenerator.tsx`), Flashcards (`AIFlashcards.tsx`), and Voice Assistant (`VoiceAssistant.tsx`).
3. ✅ **Module 3: WebXR / AR Camera View & 3D Interactive Hotspots**
   - Real-World WebXR Camera AR Feed (`navigator.mediaDevices.getUserMedia`).
   - Exploded View Assembly Slider (1.0x to 2.5x spacing expansion).
   - X-Ray Wireframe orbital mesh rendering mode.
   - Interactive 3D Hotspot Popover cards with Voice Audio & AI Doubt resolution.
   - PNG 3D Snapshot Downloader.
4. ✅ **Module 4: Gamification, XP, Badges & Student Leaderboard**
   - XP Points system, dynamic Leveling, daily study streaks, top student rankings (`Leaderboard.tsx`), and unlockable achievement badges.
5. ✅ **Module 5: Smart Notes & PDF Chapter Summary Exporter**
   - Printable styled PDF summary sheet exporter (`PDFExporter.tsx`) for NCERT chapters.
6. ✅ **Module 6: Cloudflare Pages Deployment & MongoDB Atlas Integration**
   - Deployed on Cloudflare Pages (`learn-flow.pages.dev`).
   - Connected to MongoDB Atlas cluster (`students`, `chapters`, `model3ditems`).

## Commands & Scripts
- Local Server: `start.bat` (runs on http://localhost:7676)
- Build: `npm run build`
- Cloudflare Deploy: `npx wrangler pages deploy dist --project-name=learn-flow --branch=main`
