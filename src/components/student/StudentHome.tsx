import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Trophy, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  BookOpen, 
  Sparkles, 
  ArrowRight,
  Bookmark,
  Award,
  Search,
  Tv,
  GraduationCap,
  Users,
  MessageSquare,
  Map as MapIcon,
  Target,
  Check,
  Zap,
  TrendingUp,
  Bell,
  BellRing,
  Sliders,
  Calendar,
  CalendarDays,
  Layers,
  Shield,
  Dna,
  Star
} from 'lucide-react';
import { UserProfile, Unit, Lesson, CefrLevel } from '../../types';
import { MainStudentTab } from './BottomNavBar';
import { AlageyikMascot } from '../common/AlageyikMascot';
import { audioService } from '../../services/audioService';
import { storageService } from '../../services/storageService';
import { notificationService } from '../../services/notificationService';
import { FlashcardPracticeModal } from './FlashcardPracticeModal';
import { DailyGoalProgressBar } from '../common/DailyGoalProgressBar';
import { DailyQuestsCard } from '../common/DailyQuestsCard';
import { SuffixAnalyzerModal } from '../common/SuffixAnalyzerModal';
import { KazakhAlphabetVoiceGuide } from './KazakhAlphabetVoiceGuide';
import { AiSentenceExplainerModal } from '../common/AiSentenceExplainerModal';

interface StudentHomeProps {
  user: UserProfile;
  units: Unit[];
  onSelectLesson: (unit: Unit, lesson: Lesson) => void;
  onNavigateTab: (tab: MainStudentTab) => void;
  onSelectLevel: (level: CefrLevel) => void;
  onOpenMatchGame: () => void;
  onOpenPlacementTest: () => void;
  onUpdateUser?: (updated: UserProfile) => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  user,
  units,
  onSelectLesson,
  onNavigateTab,
  onSelectLevel,
  onOpenMatchGame,
  onOpenPlacementTest,
  onUpdateUser
}) => {
  const isTr = user.currentDirection === 'TR_TO_KZ';
  
  // Filter units for current level (supports bidirectional learning: TR_TO_KZ & KZ_TO_TR)
  const activeUnits = units.filter(
    u => u.level === user.currentLevel && (!u.direction || u.direction === user.currentDirection || u.direction === 'BOTH' || (u.direction as any) === 'TR_TO_KZ')
  );

  // Calculate total lessons and completed
  const totalLessons = activeUnits.reduce((acc, u) => acc + u.lessons.length, 0);
  const completedCount = activeUnits.reduce(
    (acc, u) => acc + u.lessons.filter(l => user.completedLessonIds.includes(l.id)).length, 
    0
  );
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const allLevels: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

  // Daily Goal (Supports XP or Minutes based on user preference)
  const isMinuteGoal = user.dailyGoalType === 'minutes';
  const dailyTarget = isMinuteGoal ? (user.dailyGoalMinutes || 15) : (user.dailyXpTarget || 50);
  const todayEarnedXp = typeof user.todayEarnedXp === 'number' 
    ? user.todayEarnedXp 
    : Math.min(dailyTarget, user.xpPoints % 100);
  const todayProgress = isMinuteGoal ? (user.todayCompletedMinutes || 0) : todayEarnedXp;
  const isGoalReached = todayProgress >= dailyTarget;
  const dailyProgressRatio = Math.min(1, Math.max(0, todayProgress / dailyTarget));
  const dailyProgressPercent = Math.round(dailyProgressRatio * 100);
  const remainingValue = Math.max(0, dailyTarget - todayProgress);
  const unitLabel = isMinuteGoal ? 'Dk' : 'XP';

  // Milestone Notification & Celebration Toast State
  const [milestoneCelebration, setMilestoneCelebration] = useState<{
    title: string;
    message: string;
    milestone: number;
  } | null>(null);

  // Weekly Goal (Haftalık Hedef) Metrics & Day Calculation
  const now = new Date();
  // Monday = 1, Tuesday = 2, ..., Sunday = 7
  const currentDayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
  const remainingDaysInWeek = 7 - currentDayOfWeek;
  const weeklyTargetDays = user.weeklyGoalDays || 5;
  const weeklyCompletedDays = user.weeklyCompletedDays ?? Math.min(weeklyTargetDays, Math.min(currentDayOfWeek, Math.max(1, user.streakDays % 7 || 3)));
  const weeklyGoalPercent = Math.min(100, Math.round((weeklyCompletedDays / weeklyTargetDays) * 100));
  const isWeeklyGoalReached = weeklyCompletedDays >= weeklyTargetDays;
  const remainingGoalDaysNeeded = Math.max(0, weeklyTargetDays - weeklyCompletedDays);

  const weekDayLabelsTr = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const weekDayLabelsKz = ['Дүй', 'Сей', 'Сәр', 'Бей', 'Жұм', 'Сен', 'Жек'];
  const weekDays = isTr ? weekDayLabelsTr : weekDayLabelsKz;

  const [learningHubTab, setLearningHubTab] = useState<'daily' | 'quests' | 'weekly'>('daily');
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false);
  const [isSuffixAnalyzerOpen, setIsSuffixAnalyzerOpen] = useState(false);
  const [analyzerInitialWord, setAnalyzerInitialWord] = useState<string | undefined>(undefined);
  const [isFavoritePracticeOpen, setIsFavoritePracticeOpen] = useState(false);
  const [isAlphabetGuideOpen, setIsAlphabetGuideOpen] = useState(false);
  const [isSentenceExplainerOpen, setIsSentenceExplainerOpen] = useState(false);

  // Compute next lesson to focus on
  let nextLessonToFocus: { unit: Unit; lesson: Lesson } | null = null;
  for (const u of activeUnits) {
    for (const l of u.lessons) {
      if (!user.completedLessonIds.includes(l.id)) {
        nextLessonToFocus = { unit: u, lesson: l };
        break;
      }
    }
    if (nextLessonToFocus) break;
  }
  if (!nextLessonToFocus && activeUnits.length > 0 && activeUnits[0].lessons.length > 0) {
    nextLessonToFocus = { unit: activeUnits[0], lesson: activeUnits[0].lessons[0] };
  }

  const dailyQuestsList = storageService.getDailyQuests();
  const completedQuestsCount = dailyQuestsList.filter(q => q.isCompleted).length;

  const handleSelectWeeklyTarget = (days: number) => {
    const updated = storageService.updateWeeklyLearningGoal(days, 'days');
    if (onUpdateUser) onUpdateUser(updated);
    audioService.playFeedbackSound('click');
  };

  useEffect(() => {
    // Check if current progress triggers a milestone (50%, 80%, 100%)
    const event = notificationService.checkProgressMilestone(
      todayProgress,
      dailyTarget,
      isMinuteGoal ? 'minutes' : 'xp',
      user.notificationsEnabled !== false
    );
    if (event) {
      setMilestoneCelebration({
        title: event.title,
        message: event.message,
        milestone: event.milestone
      });
      if (event.milestone === 100) {
        audioService.playFeedbackSound('complete');
      } else {
        audioService.playFeedbackSound('correct');
      }
      setTimeout(() => setMilestoneCelebration(null), 6000);
    }
  }, [todayProgress, dailyTarget, isMinuteGoal, user.notificationsEnabled]);

  // SVG circular ring metrics (Radius 38 -> Circumference ~238.76)
  const ringRadius = 38;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringStrokeDashoffset = ringCircumference * (1 - dailyProgressRatio);

  const handleSelectDailyTarget = (newTarget: number) => {
    if (isMinuteGoal) {
      const updated = storageService.updateDailyLearningGoal('minutes', newTarget, user.notificationsEnabled, user.reminderTime);
      onUpdateUser?.(updated);
    } else {
      const updated = storageService.setDailyXpTarget(newTarget);
      onUpdateUser?.(updated);
    }
    audioService.playFeedbackSound('click');
  };

  return (
    <div className="flex-1 flex flex-col pb-6 bg-slate-50/50">
      
      {/* Top Hero Banner (Kazakh Turquoise & Cyan Gradient) */}
      <div className="bg-gradient-to-br from-teal-600 via-cyan-600 to-teal-800 text-white px-5 pt-4 pb-6 rounded-b-3xl shadow-md">
        
        {/* App Title Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black tracking-wider uppercase text-cyan-100">
              UZAKTAN TÜRKOLOG
            </span>
          </div>
          
          {/* CEFR Level Switcher (A1 to C1) */}
          <div className="flex items-center bg-black/25 p-0.5 rounded-xl border border-white/10 text-[10px] font-bold">
            {allLevels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => onSelectLevel(lvl)}
                className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${
                  user.currentLevel === lvl 
                    ? 'bg-white text-teal-900 font-black shadow-xs' 
                    : 'text-cyan-100 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* User Greeting & Circular Progress Ring */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-3">
            <div 
              onClick={() => onNavigateTab('profile')} 
              className="relative cursor-pointer hover:opacity-90 transition group"
            >
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                alt={user.name}
                className="w-13 h-13 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-cyan-300/40"
              />
              <span className="absolute -bottom-1 -right-1 text-xs">
                {isTr ? '🇰🇿' : '🇹🇷'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-lg font-black tracking-tight leading-tight">
                  {isTr ? `MERHABA, ${(user?.name || 'ÖĞRENCİ').split(' ')[0].toUpperCase()}!` : `СӘЛЕМ, ${(user?.name || 'ОҚУШЫ').split(' ')[0].toUpperCase()}!`}
                </p>
                {user.nickname && (
                  <span className="text-[10px] font-bold bg-white/20 text-cyan-100 px-1.5 py-0.2 rounded-md">
                    @{user.nickname}
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-cyan-100/95 flex items-center gap-1 mt-0.5">
                <span>{user.customTitle || (isTr ? 'Genç Türkolog' : 'Жас Түркітанушы')}</span>
                <span className="w-1 h-1 rounded-full bg-cyan-300" />
                <span className="font-bold bg-white/20 px-1.5 py-0.2 rounded text-[10px]">
                  {user.currentLevel} {isTr ? 'Seviyesi' : 'Деңгейі'}
                </span>
              </p>
            </div>
          </div>

          {/* Progress Circular Badge */}
          <div className="relative flex items-center justify-center w-14 h-14 bg-white/15 backdrop-blur-xs rounded-full border-2 border-white/30 shadow-inner">
            <div className="text-center">
              <span className="text-sm font-black leading-none">{progressPercent}%</span>
              <span className="block text-[8px] font-semibold text-cyan-100 uppercase mt-0.5">Tamam</span>
            </div>
          </div>
        </div>

        {/* Streak, XP & Energy Stats Banner */}
        <div className="grid grid-cols-3 gap-1.5 mt-4 pt-3 border-t border-white/15">
          <div 
            onClick={() => onNavigateTab('leaderboard')}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 cursor-pointer px-2.5 py-2 rounded-xl backdrop-blur-xs transition"
            title={`Günlük Seri: ${user.streakDays} Gün | Seri Kalkanı: ${user.streakShields ?? 1} Adet Koruma`}
          >
            <Flame className="w-4 h-4 text-amber-300 shrink-0" />
            <div className="truncate">
              <div className="text-xs font-black leading-tight flex items-center gap-1">
                <span>{user.streakDays} Gün</span>
                <span className="text-[10px] font-extrabold text-cyan-200 flex items-center" title="Seri Kalkanı">
                  🛡️{user.streakShields ?? 1}
                </span>
              </div>
              <div className="text-[9px] text-cyan-100 flex items-center gap-1">
                <span>Seri</span>
                <span>•</span>
                <span className="text-cyan-200 font-bold">Korumalı</span>
              </div>
            </div>
          </div>
          <div 
            onClick={() => onNavigateTab('leaderboard')}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 cursor-pointer px-2.5 py-2 rounded-xl backdrop-blur-xs transition"
          >
            <Trophy className="w-4 h-4 text-yellow-300 shrink-0" />
            <div className="truncate">
              <div className="text-xs font-black leading-tight">{user.xpPoints} XP</div>
              <div className="text-[9px] text-cyan-100">Puan</div>
            </div>
          </div>
          <div 
            onClick={() => onNavigateTab('profile')}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 cursor-pointer px-2.5 py-2 rounded-xl backdrop-blur-xs transition"
            title={user.isPremium ? 'Sınırsız Enerji (PRO)' : `Günlük Enerji: ${user.energy !== undefined ? user.energy : 100}/100. 8 saatte bir yenilenir.`}
          >
            <span className="text-amber-300 text-sm font-black shrink-0">⚡</span>
            <div className="truncate">
              <div className="text-xs font-black leading-tight">
                {user.isPremium ? '∞ PRO' : `${user.energy !== undefined ? user.energy : 100}`}
              </div>
              <div className="text-[9px] text-cyan-100">
                {user.isPremium ? 'Sınırsız' : 'Enerji'}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Main Body Content */}
      <div className="px-4 py-4 space-y-4">
        
        {/* MILESTONE CELEBRATION TOAST NOTIFICATION (50%, 80%, 100%) */}
        {milestoneCelebration && (
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 p-4 rounded-3xl shadow-xl flex items-center justify-between gap-3 animate-in slide-in-from-top-4 border-2 border-white">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/30 backdrop-blur-xs flex items-center justify-center text-xl shrink-0">
                {milestoneCelebration.milestone === 100 ? '🏆' : milestoneCelebration.milestone === 80 ? '🔥' : '🎯'}
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider">
                  {milestoneCelebration.title}
                </h4>
                <p className="text-[11px] font-bold text-slate-900 leading-snug">
                  {milestoneCelebration.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => setMilestoneCelebration(null)}
              className="p-1 rounded-full hover:bg-black/10 transition text-slate-900 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. TERTİPLİ ÖĞRENME MASASI (Segmented Hub: Günlük Hedef | Görevler | Haftalık) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Segmented Control Header */}
          <div className="p-2 bg-slate-50/90 border-b border-slate-200/80 flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setLearningHubTab('daily')}
              className={`flex-1 min-w-[110px] py-2 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                learningHubTab === 'daily'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>{isTr ? 'Günlük Hedef' : 'Күндік меже'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                learningHubTab === 'daily' ? 'bg-teal-700/80 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                %{dailyProgressPercent}
              </span>
            </button>

            <button
              onClick={() => setLearningHubTab('quests')}
              className={`flex-1 min-w-[110px] py-2 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                learningHubTab === 'quests'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isTr ? 'Günlük Görevler' : 'Тапсырмалар'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                learningHubTab === 'quests' ? 'bg-teal-700/80 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {completedQuestsCount}/3
              </span>
            </button>

            <button
              onClick={() => setLearningHubTab('weekly')}
              className={`flex-1 min-w-[110px] py-2 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                learningHubTab === 'weekly'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{isTr ? 'Haftalık Plan' : 'Апталық'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                learningHubTab === 'weekly' ? 'bg-teal-700/80 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {weeklyCompletedDays}/{weeklyTargetDays}G
              </span>
            </button>
          </div>

          {/* Hub Content View */}
          <div>
            {learningHubTab === 'daily' && (
              <DailyGoalProgressBar
                user={user}
                onUpdateUser={onUpdateUser}
                onNavigateTab={onNavigateTab}
                onStartLesson={() => onNavigateTab('lessons')}
                className="border-0 shadow-none p-4"
              />
            )}

            {learningHubTab === 'quests' && (
              <div className="p-3">
                <DailyQuestsCard
                  user={user}
                  onUpdateUser={onUpdateUser}
                  onNavigateTab={onNavigateTab}
                  onOpenPracticeGame={() => setIsFlashcardModalOpen(true)}
                />
              </div>
            )}

            {learningHubTab === 'weekly' && (
              <div className="p-4.5 space-y-3.5">
                {/* Header Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-cyan-50 text-cyan-800 rounded-2xl shadow-2xs">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-wider text-cyan-900 bg-cyan-100/80 px-2 py-0.5 rounded-full">
                          {isTr ? 'HAFTALIK HEDEF' : 'АПТАЛЫҚ МЕЖЕ'}
                        </span>
                        {isWeeklyGoalReached ? (
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>{isTr ? 'Hedefe Ulaşıldı!' : 'Меже орындалды!'}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {weeklyCompletedDays} / {weeklyTargetDays} {isTr ? 'Gün' : 'Күн'}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-black text-slate-900 mt-0.5">
                        {isWeeklyGoalReached 
                          ? (isTr ? 'Tebrikler! Bu Haftaki Hedefinizi Tamamladınız 🎉' : 'Құттықтаймыз! Апталық межеге жеттіңіз 🎉')
                          : (isTr ? `Haftada ${weeklyTargetDays} Gün Öğrenme Hedefi` : `Аптасына ${weeklyTargetDays} күн оқу межесі`)
                        }
                      </h3>
                    </div>
                  </div>

                  {/* Target Selector Buttons */}
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
                    {[3, 4, 5, 6, 7].map((days) => (
                      <button
                        key={days}
                        onClick={() => handleSelectWeeklyTarget(days)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition cursor-pointer ${
                          weeklyTargetDays === days
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title={`${days} gün hedefi seç`}
                      >
                        {days}G
                      </button>
                    ))}
                  </div>
                </div>

                {/* 7 Days of the Week Visual Pills */}
                <div className="grid grid-cols-7 gap-1.5 pt-1">
                  {weekDays.map((dayLabel, idx) => {
                    const dayNum = idx + 1;
                    const isToday = dayNum === currentDayOfWeek;
                    const isDone = dayNum <= weeklyCompletedDays;

                    return (
                      <div
                        key={idx}
                        className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all text-center ${
                          isDone
                            ? 'bg-gradient-to-b from-emerald-500 to-teal-600 text-white border-emerald-400 shadow-xs'
                            : isToday
                            ? 'bg-cyan-50 border-cyan-400 text-cyan-950 ring-2 ring-cyan-300/50'
                            : 'bg-slate-50 border-slate-200/80 text-slate-400'
                        }`}
                      >
                        <span className={`text-[9px] font-bold ${isDone ? 'text-emerald-100' : isToday ? 'text-cyan-800' : 'text-slate-400'}`}>
                          {dayLabel}
                        </span>
                        <div className="mt-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">
                          {isDone ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : isToday ? (
                            <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          )}
                        </div>
                        {isToday && (
                          <span className="text-[8px] font-black text-teal-700 mt-0.5 leading-none">
                            Bugün
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Linear Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-700 flex items-center gap-1">
                      <span>Haftalık İlerleme:</span>
                      <span className="font-black text-teal-700">{weeklyCompletedDays} / {weeklyTargetDays} Gün</span>
                    </span>
                    <span className="font-mono font-black text-teal-600">%{weeklyGoalPercent}</span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/70 p-0.5">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ease-out shadow-xs ${
                        isWeeklyGoalReached
                          ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-green-500'
                          : 'bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-600'
                      }`}
                      style={{ width: `${Math.max(5, Math.min(100, weeklyGoalPercent))}%` }}
                    />
                  </div>
                </div>

                {/* Kalan Gün Sayısı & Motivasyon Şeridi */}
                <div className="p-3 bg-gradient-to-r from-slate-50 via-cyan-50/50 to-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-cyan-100 text-cyan-800 rounded-xl">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                          {isTr ? 'Kalan Gün Sayısı:' : 'Қалған күндер:'}
                        </span>
                        <span className="font-black text-cyan-900 text-xs px-2 py-0.2 bg-cyan-100 rounded-md">
                          {remainingDaysInWeek === 0 ? (isTr ? 'Bugün Son Gün!' : 'Бүгін соңғы күн!') : `${remainingDaysInWeek} ${isTr ? 'Gün Kaldı' : 'Күн қалды'}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsFlashcardModalOpen(true)}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-[11px] rounded-xl shadow-xs transition shrink-0 flex items-center gap-1 active:scale-98 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{isTr ? 'Flaş Kart Çöz' : 'Карточкалар'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. BUGÜNKÜ ODAK DERSİNİZ (Spotlight Lesson Card) */}
        {nextLessonToFocus && (
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-teal-700 via-teal-800 to-cyan-900 text-white shadow-md border border-teal-500/40 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  🎯 {isTr ? 'GÜNÜN ODAK DERSİ' : 'БҮГІНГІ БАСТЫ САБАҚ'}
                </span>
                <span className="text-[10px] font-bold text-teal-200">
                  {user.currentLevel} • {isTr ? nextLessonToFocus.unit.titleTr : nextLessonToFocus.unit.titleKz}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black leading-tight text-white">
                {isTr ? nextLessonToFocus.lesson.titleTr : nextLessonToFocus.lesson.titleKz}
              </h3>
              <p className="text-xs text-teal-100 max-w-md line-clamp-1 font-medium">
                {isTr ? nextLessonToFocus.lesson.summaryTr : nextLessonToFocus.lesson.summaryKz}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 z-10">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] text-teal-200 font-bold">Kazanım</span>
                <span className="text-xs font-black text-amber-300">+15 XP</span>
              </div>
              <button
                onClick={() => onSelectLesson(nextLessonToFocus.unit, nextLessonToFocus.lesson)}
                className="w-full sm:w-auto px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-2xl shadow-sm transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{user.completedLessonIds.includes(nextLessonToFocus.lesson.id) ? 'Ders Tekrarı' : 'Derse Başla'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Subtle decorative background watermarks */}
            <div className="absolute -right-4 -bottom-6 text-7xl opacity-10 select-none pointer-events-none">
              🇰🇿
            </div>
          </div>
        )}

        {/* 3. TERTİPLİ AKILLI AI VE PRATİK MASASI */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-0.5">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>{isTr ? 'YAPAY ZEKA & PRATİK ARAÇLARI' : 'ЖАСАНДЫ ИНТЕЛЛЕКТ ЖӘНЕ ЖАТТЫҒУ'}</span>
            </h3>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              4 Akıllı Modül
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Tool 1: AI Cümle & Morfoloji Tahlilcisi */}
            <div
              onClick={() => setIsSentenceExplainerOpen(true)}
              className="p-3.5 bg-white hover:bg-teal-50/50 rounded-2xl border border-slate-200/90 hover:border-teal-400 shadow-2xs hover:shadow-xs cursor-pointer transition active:scale-[0.98] group flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-black group-hover:scale-105 transition mb-2">
                <Dna className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <span className="text-[8px] font-black uppercase text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded inline-block mb-0.5">
                  GEMINI AI
                </span>
                <h4 className="text-xs font-black text-slate-900 leading-tight">
                  {isTr ? 'Cümle Tahlili' : 'Сөйлем талдау'}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {isTr ? 'Morfoloji & Kök' : 'Сөз құрылымы'}
                </p>
              </div>
            </div>

            {/* Tool 2: Canlı AI Sohbet Odası */}
            <div
              onClick={() => onNavigateTab('sohbet')}
              className="p-3.5 bg-white hover:bg-cyan-50/50 rounded-2xl border border-slate-200/90 hover:border-cyan-400 shadow-2xs hover:shadow-xs cursor-pointer transition active:scale-[0.98] group flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-black group-hover:scale-105 transition mb-2">
                <MessageSquare className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <span className="text-[8px] font-black uppercase text-cyan-700 bg-cyan-50 px-1.5 py-0.2 rounded inline-block mb-0.5">
                  CANLI SOHBET
                </span>
                <h4 className="text-xs font-black text-slate-900 leading-tight">
                  {isTr ? 'AI Sohbet & Rol' : 'AI Сұхбат'}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {isTr ? 'Bilingual Pratik' : 'Еркін сөйлесу'}
                </p>
              </div>
            </div>

            {/* Tool 3: Flaş Kartlar */}
            <div
              onClick={() => setIsFlashcardModalOpen(true)}
              className="p-3.5 bg-white hover:bg-emerald-50/50 rounded-2xl border border-slate-200/90 hover:border-emerald-400 shadow-2xs hover:shadow-xs cursor-pointer transition active:scale-[0.98] group flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black group-hover:scale-105 transition mb-2">
                <Layers className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <span className="text-[8px] font-black uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded inline-block mb-0.5">
                  HAFIZA
                </span>
                <h4 className="text-xs font-black text-slate-900 leading-tight">
                  {isTr ? 'Flaş Kartlar' : 'Флеш-карталар'}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {isTr ? 'Kelime Ezberi' : 'Сөз жаттау'}
                </p>
              </div>
            </div>

            {/* Tool 4: Hızlı Eşleştirme Oyunu */}
            <div
              onClick={onOpenMatchGame}
              className="p-3.5 bg-white hover:bg-amber-50/50 rounded-2xl border border-slate-200/90 hover:border-amber-400 shadow-2xs hover:shadow-xs cursor-pointer transition active:scale-[0.98] group flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black group-hover:scale-105 transition mb-2">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
              </div>
              <div>
                <span className="text-[8px] font-black uppercase text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded inline-block mb-0.5">
                  HIZ TESTİ
                </span>
                <h4 className="text-xs font-black text-slate-900 leading-tight">
                  {isTr ? 'Hızlı Eşleştirme' : 'Жұптарды табу'}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {isTr ? 'Kelime Oyunu' : 'Ойын жаттығуы'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Sub-Pills (9 Harf, Zor Kelimeler, Prompter) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setIsAlphabetGuideOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-xs font-bold text-slate-700 hover:text-teal-800 transition flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              <span>👄</span>
              <span>{isTr ? '9 Özel Ses & Dudak Atlası' : '9 төл дыбыс атласы'}</span>
            </button>

            <button
              onClick={() => {
                const favs = storageService.getFavoriteVocabulary();
                if (favs.length === 0) {
                  onNavigateTab('dictionary');
                } else {
                  setIsFavoritePracticeOpen(true);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-xs font-bold text-slate-700 hover:text-amber-800 transition flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{isTr ? 'Zorlandığım Kelimeler' : 'Қиын сөздер'}</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full font-black">
                {user.favoriteWordIds?.length || 0}
              </span>
            </button>

            <button
              onClick={() => onNavigateTab('prompter')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 text-xs font-bold text-slate-700 hover:text-cyan-800 transition flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-600" />
              <span>{isTr ? 'Hikaye Stüdyosu & Prompter' : 'Интеррактивті оқу'}</span>
            </button>
          </div>
        </div>

        {/* 4. MÜFREDAT VE ÖĞRENME YOLU ÖZETİ (Derli Toplu ve Net) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-0.5">
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                <span>{isTr ? 'MÜFREDAT DERSLERİ' : 'ОҚУ БАҒДАРЛАМАСЫ'}</span>
                <span className="text-teal-700 font-bold">({user.currentLevel})</span>
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">
                {completedCount} / {totalLessons} ders tamamlandı (%{progressPercent})
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('lessons')}
              className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl transition flex items-center gap-1 border border-teal-200/80 cursor-pointer"
            >
              <span>{isTr ? 'Tüm Müfredatı Gör' : 'Барлығын көру'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Render Preview of Active Unit */}
          {activeUnits.slice(0, 1).map((unit) => (
            <div 
              key={unit.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden"
            >
              <div className="px-4 py-3 bg-gradient-to-r from-teal-50 to-white border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-teal-800 tracking-wider">
                    {unit.level} • Ünite {unit.unitNumber}
                  </span>
                  <h4 className="text-xs font-black text-slate-900 mt-0.5">
                    {isTr ? unit.titleTr : unit.titleKz}
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                  {unit.lessons.length} Ders
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {unit.lessons.slice(0, 3).map((lesson) => {
                  const isCompleted = user.completedLessonIds.includes(lesson.id);
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => onSelectLesson(unit, lesson)}
                      className="px-4 py-3 flex items-center justify-between hover:bg-teal-50/50 cursor-pointer transition active:bg-teal-100/40 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isCompleted 
                            ? 'bg-emerald-500 text-white shadow-2xs' 
                            : 'bg-teal-100 text-teal-800'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : lesson.lessonNumber}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 leading-tight group-hover:text-teal-700 transition">
                            {isTr ? lesson.titleTr : lesson.titleKz}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                            {isTr ? lesson.summaryTr : lesson.summaryKz}
                          </div>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition" />
                    </div>
                  );
                })}
              </div>

              {unit.lessons.length > 3 && (
                <div 
                  onClick={() => onNavigateTab('lessons')}
                  className="p-3 text-center bg-slate-50 hover:bg-teal-50 text-xs font-bold text-teal-700 cursor-pointer transition border-t border-slate-100"
                >
                  +{unit.lessons.length - 3} ders daha var • Müfredat Sayfasında Görüntüle →
                </div>
              )}
            </div>
          ))}

          {activeUnits.length === 0 && (
            <div className="p-6 bg-white rounded-3xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
              Bu seviye için içerikler müfredatta hazırlanmaktadır.
            </div>
          )}
        </div>

      </div>

      {/* AI Linguistic Sentence & Morpheme Explainer Modal */}
      <AiSentenceExplainerModal
        isOpen={isSentenceExplainerOpen}
        onClose={() => setIsSentenceExplainerOpen(false)}
        userLevel={user.currentLevel}
      />

      {/* Interactive Guessing Flashcard Practice Modal (All curriculum words) */}
      <FlashcardPracticeModal
        isOpen={isFlashcardModalOpen}
        onClose={() => setIsFlashcardModalOpen(false)}
        vocabulary={storageService.getAllVocabulary()}
        lessonTitle={isTr ? 'Müfredat Kelime Flaş Kartları' : 'Сөздік флеш-карталары'}
        userDirection={user.currentDirection}
        onEarnXp={(xp) => {
          const updated = storageService.addXp(xp);
          if (onUpdateUser) onUpdateUser(updated);
        }}
        onToggleMastery={(wordId, mastered) => {
          const updated = storageService.toggleWordMastery(wordId, mastered);
          if (onUpdateUser) onUpdateUser(updated);
        }}
      />

      {/* Favori & Zor Kelimeler Pratik Modu (Duolingo Mistake/Starred Practice) */}
      <FlashcardPracticeModal
        isOpen={isFavoritePracticeOpen}
        onClose={() => setIsFavoritePracticeOpen(false)}
        vocabulary={storageService.getFavoriteVocabulary()}
        lessonTitle={isTr ? '⭐ Zorlandığım Kelimeler Pratiği' : '⭐ Қиын сөздер жаттығуы'}
        userDirection={user.currentDirection}
        onEarnXp={(xp) => {
          const updated = storageService.addXp(xp);
          if (onUpdateUser) onUpdateUser(updated);
        }}
        onToggleMastery={(wordId, mastered) => {
          const updated = storageService.toggleWordMastery(wordId, mastered);
          if (onUpdateUser) onUpdateUser(updated);
        }}
      />

      {/* Bozkır Morfolojisi: Ek & Kök Çözümleyici Modalı */}
      <SuffixAnalyzerModal
        isOpen={isSuffixAnalyzerOpen}
        onClose={() => setIsSuffixAnalyzerOpen(false)}
        initialWord={analyzerInitialWord}
        onEarnXp={(xp: number) => {
          const updated = storageService.addXp(xp);
          if (onUpdateUser) onUpdateUser(updated);
        }}
      />

      {/* Kazak Alfabesi & 9 Özel Ses Atlası Modalı */}
      <KazakhAlphabetVoiceGuide
        isOpen={isAlphabetGuideOpen}
        onClose={() => setIsAlphabetGuideOpen(false)}
      />

    </div>
  );
};
