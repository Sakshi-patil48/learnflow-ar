import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Flame, 
  Zap, 
  Sparkles, 
  Star, 
  Medal, 
  Users, 
  Clock, 
  CheckCircle2, 
  Search, 
  GraduationCap, 
  Crown,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ClassLevel, StudentUser } from '../types';

export interface AchievementBadge {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number; // 0 to 100
  unlockedAt?: string;
}

interface LeaderboardProps {
  currentUserName: string;
  currentUserEmail: string;
  currentClass: ClassLevel;
  totalXP: number;
  userLevel: number;
  streakDays: number;
  completedTasksCount: number;
  masteredModelsCount: number;
  totalStudyTimeSeconds: number;
}

export default function Leaderboard({
  currentUserName,
  currentUserEmail,
  currentClass,
  totalXP,
  userLevel,
  streakDays,
  completedTasksCount,
  masteredModelsCount,
  totalStudyTimeSeconds
}: LeaderboardProps) {
  const [selectedGradeTab, setSelectedGradeTab] = useState<'all' | ClassLevel>('all');
  const [activeSubTab, setActiveSubTab] = useState<'leaderboard' | 'badges'>('leaderboard');

  // Badges data state
  const badges: AchievementBadge[] = [
    {
      id: 'badge_ar_pioneer',
      title: 'AR Pioneer',
      category: '3D Exploration',
      description: 'Explore and master your first 3D interactive model.',
      icon: '🚀',
      unlocked: masteredModelsCount >= 1,
      progress: Math.min(100, (masteredModelsCount / 1) * 100),
      unlockedAt: masteredModelsCount >= 1 ? 'Unlocked' : undefined
    },
    {
      id: 'badge_quiz_wiz',
      title: 'Quiz Wizard',
      category: 'Assessment',
      description: 'Complete an AI Chapter Quiz with high accuracy.',
      icon: '⚡',
      unlocked: totalXP >= 150,
      progress: Math.min(100, (totalXP / 150) * 100),
      unlockedAt: totalXP >= 150 ? 'Unlocked' : undefined
    },
    {
      id: 'badge_study_titan',
      title: 'Study Titan',
      category: 'Diligence',
      description: 'Log over 30 minutes of cumulative study time.',
      icon: '🔥',
      unlocked: totalStudyTimeSeconds >= 1800,
      progress: Math.min(100, (totalStudyTimeSeconds / 1800) * 100),
      unlockedAt: totalStudyTimeSeconds >= 1800 ? 'Unlocked' : undefined
    },
    {
      id: 'badge_task_master',
      title: 'Curriculum Master',
      category: 'Syllabus',
      description: 'Finish 5 syllabus study tasks in the Task Planner.',
      icon: '🏆',
      unlocked: completedTasksCount >= 5,
      progress: Math.min(100, (completedTasksCount / 5) * 100),
      unlockedAt: completedTasksCount >= 5 ? 'Unlocked' : undefined
    },
    {
      id: 'badge_flashcard_hero',
      title: 'Memory Ninja',
      category: 'Recall',
      description: 'Master 3 revision flashcards in active recall decks.',
      icon: '🎴',
      unlocked: totalXP >= 250,
      progress: Math.min(100, (totalXP / 250) * 100),
      unlockedAt: totalXP >= 250 ? 'Unlocked' : undefined
    },
    {
      id: 'badge_academic_vanguard',
      title: 'Academic Vanguard',
      category: 'Excellence',
      description: 'Reach Level 3 and accumulate over 500 XP.',
      icon: '👑',
      unlocked: userLevel >= 3,
      progress: Math.min(100, (userLevel / 3) * 100),
      unlockedAt: userLevel >= 3 ? 'Unlocked' : undefined
    }
  ];

  // Leaderboard mock ranking entries including current user
  const leaderboardEntries = [
    {
      rank: 1,
      name: 'Aarav Sharma',
      classLevel: '12th' as ClassLevel,
      xp: 1450,
      level: 5,
      streak: 12,
      isCurrentUser: false,
      avatarBg: 'from-amber-500 to-orange-500'
    },
    {
      rank: 2,
      name: currentUserName || 'You',
      classLevel: currentClass,
      xp: totalXP,
      level: userLevel,
      streak: streakDays,
      isCurrentUser: true,
      avatarBg: 'from-indigo-500 to-purple-500'
    },
    {
      rank: 3,
      name: 'Ananya Patel',
      classLevel: '11th' as ClassLevel,
      xp: 920,
      level: 4,
      streak: 7,
      isCurrentUser: false,
      avatarBg: 'from-emerald-500 to-teal-500'
    },
    {
      rank: 4,
      name: 'Rohan Das',
      classLevel: '12th' as ClassLevel,
      xp: 680,
      level: 3,
      streak: 4,
      isCurrentUser: false,
      avatarBg: 'from-sky-500 to-blue-500'
    },
    {
      rank: 5,
      name: 'Priya Iyer',
      classLevel: '11th' as ClassLevel,
      xp: 510,
      level: 2,
      streak: 3,
      isCurrentUser: false,
      avatarBg: 'from-purple-500 to-pink-500'
    }
  ].sort((a, b) => b.xp - a.xp).map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  const filteredEntries = leaderboardEntries.filter(
    e => selectedGradeTab === 'all' || e.classLevel === selectedGradeTab
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Top Banner Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Trophy className="w-8 h-8 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">Student Leaderboard & Badges</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {streakDays} Day Streak!
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                Earn XP by completing quizzes, mastering 3D models, and maintaining daily study habits.
              </p>
            </div>
          </div>

          {/* Current User Quick Level Card */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 min-w-[200px] text-center shrink-0">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">Your Stats</span>
            <div className="text-xl font-extrabold text-white">Level {userLevel}</div>
            <div className="text-xs text-amber-400 font-mono font-semibold mt-0.5">{totalXP} Total XP</div>
          </div>
        </div>
      </div>

      {/* Sub Tabs: Leaderboard vs Badges */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('leaderboard')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'leaderboard'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Top Learners</span>
        </button>

        <button
          onClick={() => setActiveSubTab('badges')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'badges'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Achievement Badges ({badges.filter(b => b.unlocked).length}/{badges.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: LEADERBOARD RANKINGS */}
      {activeSubTab === 'leaderboard' && (
        <div className="space-y-6 animate-fade-in">
          {/* Grade Filter Bar */}
          <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-400">Filter Ranking:</span>
            <div className="flex gap-2">
              {(['all', '11th', '12th'] as const).map((grade) => (
                <button
                  key={grade}
                  onClick={() => setSelectedGradeTab(grade as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedGradeTab === grade
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {grade === 'all' ? 'All Grades' : `Class ${grade}`}
                </button>
              ))}
            </div>
          </div>

          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {filteredEntries.slice(0, 3).map((entry) => {
              const isFirst = entry.rank === 1;
              const isSecond = entry.rank === 2;
              const isThird = entry.rank === 3;

              return (
                <div
                  key={entry.name}
                  className={`bg-slate-900/90 border ${
                    isFirst
                      ? 'border-amber-500/60 shadow-amber-500/10'
                      : isSecond
                      ? 'border-slate-500/50'
                      : 'border-amber-700/40'
                  } rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between text-center group ${
                    entry.isCurrentUser ? 'ring-2 ring-indigo-500' : ''
                  }`}
                >
                  {/* Top Rank Badge */}
                  <div className="absolute top-4 right-4">
                    {isFirst && <Crown className="w-7 h-7 text-amber-400 animate-bounce" />}
                    {isSecond && <Medal className="w-6 h-6 text-slate-300" />}
                    {isThird && <Medal className="w-6 h-6 text-amber-600" />}
                  </div>

                  <div className="pt-2">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${entry.avatarBg} text-white font-extrabold flex items-center justify-center text-xl mx-auto shadow-lg shadow-indigo-500/20 mb-3`}>
                      {entry.name.charAt(0)}
                    </div>

                    <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-amber-400 mb-2">
                      Rank #{entry.rank}
                    </div>

                    <h4 className="text-lg font-bold text-white">
                      {entry.name} {entry.isCurrentUser && '(You)'}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">Class {entry.classLevel}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Level {entry.level}</span>
                    <span className="text-amber-400 font-extrabold">{entry.xp} XP</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Remaining Rankings Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-800/60 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Complete Leaderboard Standings
            </div>
            <div className="divide-y divide-slate-800/60">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.name}
                  className={`p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors ${
                    entry.isCurrentUser ? 'bg-indigo-950/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 font-mono text-xs font-bold flex items-center justify-center">
                      #{entry.rank}
                    </span>
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${entry.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow`}>
                      {entry.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm flex items-center gap-2">
                        {entry.name}
                        {entry.isCurrentUser && (
                          <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded text-[10px] font-bold">
                            YOU
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400">Class {entry.classLevel}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-sm font-bold text-amber-400 block font-mono">{entry.xp} XP</span>
                      <span className="text-xs text-slate-400">Level {entry.level}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ACHIEVEMENT BADGES */}
      {activeSubTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`bg-slate-900/90 border ${
                badge.unlocked ? 'border-amber-500/40 shadow-amber-500/10' : 'border-slate-800 opacity-75'
              } rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between transition-all group`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80">
                    {badge.icon}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    badge.unlocked
                      ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {badge.unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>

                <h4 className="text-lg font-bold text-white mb-1">{badge.title}</h4>
                <p className="text-xs text-amber-400 font-mono mb-2">{badge.category}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{badge.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mb-1.5">
                  <span>Progress</span>
                  <span className="font-bold text-slate-200">{badge.progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className={`h-full transition-all duration-300 ${
                      badge.unlocked ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 'bg-slate-600'
                    }`}
                    style={{ width: `${badge.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
