import React, { useState } from 'react';
import { 
  Target, 
  Sparkles, 
  Flame, 
  Check, 
  Zap, 
  Clock, 
  ChevronRight, 
  Sliders,
  Award
} from 'lucide-react';
import { UserProfile } from '../../types';
import { storageService } from '../../services/storageService';
import { audioService } from '../../services/audioService';

export interface DailyGoalProgressBarProps {
  user: UserProfile;
  onUpdateUser?: (updated: UserProfile) => void;
  onNavigateTab?: (tab: any) => void;
  onStartLesson?: () => void;
  title?: string;
  className?: string;
  variant?: 'card' | 'compact' | 'header';
}

export const DailyGoalProgressBar: React.FC<DailyGoalProgressBarProps> = ({
  user,
  onUpdateUser,
  onNavigateTab,
  onStartLesson,
  title,
  className = '',
  variant = 'card'
}) => {
  const isTr = user.currentDirection === 'TR_TO_KZ';
  const isMinuteGoal = user.dailyGoalType === 'minutes';
  const dailyTarget = isMinuteGoal ? (user.dailyGoalMinutes || 15) : (user.dailyXpTarget || 50);
  
  const todayEarnedXp = typeof user.todayEarnedXp === 'number' 
    ? user.todayEarnedXp 
    : Math.min(dailyTarget, user.xpPoints % 100);
  const todayProgress = isMinuteGoal ? (user.todayCompletedMinutes || 0) : todayEarnedXp;
  
  const isGoalReached = todayProgress >= dailyTarget;
  const progressRatio = Math.min(1, Math.max(0, todayProgress / dailyTarget));
  const progressPercent = Math.round(progressRatio * 100);
  const remainingValue = Math.max(0, dailyTarget - todayProgress);
  const unitLabel = isMinuteGoal ? 'Dk' : 'XP';

  const [showQuickSettings, setShowQuickSettings] = useState(false);

  const xpOptions = [30, 50, 100, 150];
  const minuteOptions = [10, 15, 30, 45];
  const activeOptions = isMinuteGoal ? minuteOptions : xpOptions;

  const handleSelectTarget = (val: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isMinuteGoal) {
      const updated = storageService.updateDailyLearningGoal(
        'minutes', 
        val, 
        user.notificationsEnabled !== false, 
        user.reminderTime || '20:00'
      );
      onUpdateUser?.(updated);
    } else {
      const updated = storageService.setDailyXpTarget(val);
      onUpdateUser?.(updated);
    }
    audioService.playFeedbackSound('click');
  };

  const getStatusMessage = () => {
    if (isGoalReached) {
      return {
        badge: isTr ? '🎉 Hedef Tamamlandı!' : '🎉 Меже орындалды!',
        text: isTr 
          ? `Tebrikler! Bugün ${todayProgress} ${unitLabel} topladınız. Harika bir tempo!` 
          : `Құттықтаймыз! Бүгін ${todayProgress} ${unitLabel} жинадыңыз. Керемет!`,
        tone: 'emerald'
      };
    }
    if (progressPercent >= 80) {
      return {
        badge: isTr ? `🔥 Son ${remainingValue} ${unitLabel} Kaldı!` : `🔥 Соңғы ${remainingValue} ${unitLabel} қалды!`,
        text: isTr 
          ? `Hedefe ramak kaldı! Bir kısa ders tamamlayarak serinizi taçlandırın.` 
          : `Межеге өте жақынсыз! Тағы бір қысқа сабақпен мақсатқа жетіңіз.`,
        tone: 'amber'
      };
    }
    if (progressPercent >= 50) {
      return {
        badge: isTr ? `⚡ Yarı Yol Geçildi (%${progressPercent})` : `⚡ Жартысы өтті (%${progressPercent})`,
        text: isTr 
          ? `Güzel ilerliyorsunuz. Kalan ${remainingValue} ${unitLabel} için öğrenmeye devam edin.` 
          : `Жақсы қарқын. Қалған ${remainingValue} ${unitLabel} үшін сабақты жалғастырыңыз.`,
        tone: 'teal'
      };
    }
    return {
      badge: isTr ? `🎯 Bugünkü Hedef: ${dailyTarget} ${unitLabel}` : `🎯 Бүгінгі меже: ${dailyTarget} ${unitLabel}`,
      text: isTr 
        ? `Günlük hedefinizi tamamlamak için dersleri ve flaş kartları keşfedin.` 
        : `Күндік межеге жету үшін сабақтар мен сөздіктерді оқыңыз.`,
      tone: 'slate'
    };
  };

  const status = getStatusMessage();

  // Compact Variant (e.g. for header bar or tight lists)
  if (variant === 'compact') {
    return (
      <div className={`bg-white/95 backdrop-blur-xs p-3 rounded-2xl border border-slate-200 shadow-2xs ${className}`}>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div className="flex items-center gap-1.5 font-black text-slate-800">
            <span className={`w-2 h-2 rounded-full ${
              isGoalReached ? 'bg-emerald-500 animate-pulse' : progressPercent >= 80 ? 'bg-amber-500 animate-pulse' : 'bg-teal-500'
            }`} />
            <span>{title || (isTr ? 'Günlük Hedef' : 'Күндік меже')}</span>
            <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
              isGoalReached 
                ? 'bg-emerald-100 text-emerald-800' 
                : progressPercent >= 80 
                ? 'bg-amber-100 text-amber-900' 
                : 'bg-teal-50 text-teal-800'
            }`}>
              {todayProgress}/{dailyTarget} {unitLabel}
            </span>
          </div>

          <span className="text-[11px] font-black font-mono text-slate-700">
            %{progressPercent}
          </span>
        </div>

        {/* Bar */}
        <div className="relative w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-200/80">
          <div 
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isGoalReached 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                : progressPercent >= 80 
                ? 'bg-gradient-to-r from-amber-500 to-orange-400' 
                : 'bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600'
            }`}
            style={{ width: `${Math.max(4, Math.min(100, progressPercent))}%` }}
          />
        </div>
      </div>
    );
  }

  // Full Rich Interactive Card Variant
  return (
    <div className={`bg-white p-4.5 rounded-3xl border border-slate-200/90 shadow-xs relative overflow-hidden transition-all hover:shadow-md ${className}`}>
      
      {/* Background ambient glow according to level */}
      <div className={`absolute -right-10 -bottom-10 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700 ${
        isGoalReached ? 'bg-emerald-500' : progressPercent >= 80 ? 'bg-amber-500' : 'bg-teal-600'
      }`} />

      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
              isGoalReached 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                : progressPercent >= 80 
                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                : 'bg-teal-50 text-teal-800 border border-teal-200'
            }`}>
              {isGoalReached ? (
                <Check className="w-3 h-3 stroke-[3]" />
              ) : progressPercent >= 80 ? (
                <Flame className="w-3 h-3 text-amber-600 animate-bounce" />
              ) : isMinuteGoal ? (
                <Clock className="w-3 h-3 text-teal-600" />
              ) : (
                <Target className="w-3 h-3 text-teal-600" />
              )}
              <span>{status.badge}</span>
            </span>

            {/* Live Progress Pill */}
            <span className="text-[10px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              {todayProgress} / {dailyTarget} {unitLabel}
            </span>
          </div>

          <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>{title || (isTr ? 'Günlük Öğrenme Hedefi' : 'Күндік оқу межесі')}</span>
            {isGoalReached && <span className="text-base">🏆</span>}
          </h3>

          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug max-w-md">
            {status.text}
          </p>
        </div>

        {/* Circular Ring or Percentage Badge */}
        <div className="text-right shrink-0">
          <div className={`px-2.5 py-1 rounded-2xl border text-center transition-all ${
            isGoalReached 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-200' 
              : progressPercent >= 80 
              ? 'bg-amber-50 border-amber-300 text-amber-800 ring-2 ring-amber-200' 
              : 'bg-teal-50 border-teal-200 text-teal-800'
          }`}>
            <span className="text-base font-black font-mono leading-none block">
              %{progressPercent}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider block opacity-80 mt-0.5">
              {isGoalReached ? 'TAMAM' : 'İlerleme'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Progress Track with Milestone Ticks */}
      <div className="mt-3.5 space-y-1.5 relative z-10">
        <div className="relative w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200/90 shadow-inner">
          <div 
            className={`h-full rounded-full transition-all duration-700 ease-out relative ${
              isGoalReached 
                ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-green-500 shadow-md shadow-emerald-500/30' 
                : progressPercent >= 80 
                ? 'bg-gradient-to-r from-amber-500 via-orange-400 to-emerald-500 shadow-md shadow-amber-500/30 animate-pulse' 
                : 'bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-500 shadow-sm'
            }`}
            style={{ width: `${Math.max(4, Math.min(100, progressPercent))}%` }}
          >
            {/* Shimmer light bar */}
            <div className="absolute inset-0 bg-white/20 skew-x-12 animate-shimmer" />
          </div>

          {/* Milestone markers at 25%, 50%, 75% */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-white/70 z-10" style={{ left: '25%' }} title="%25 Çeyrek Yol" />
          <div className="absolute top-0 bottom-0 w-0.5 bg-white/70 z-10" style={{ left: '50%' }} title="%50 Yarı Yol" />
          <div className="absolute top-0 bottom-0 w-0.5 bg-white/70 z-10" style={{ left: '75%' }} title="%75 Hedefe Yakın" />
        </div>

        {/* Milestone Labels Row */}
        <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 px-0.5">
          <span>0 {unitLabel}</span>
          <span className={progressPercent >= 25 ? 'text-teal-700 font-extrabold' : ''}>%25</span>
          <span className={progressPercent >= 50 ? 'text-teal-700 font-extrabold' : ''}>%50 Yarı Yol</span>
          <span className={progressPercent >= 75 ? 'text-amber-700 font-extrabold' : ''}>%75</span>
          <span className={isGoalReached ? 'text-emerald-700 font-extrabold' : ''}>{dailyTarget} {unitLabel} ★</span>
        </div>
      </div>

      {/* Interactive Controls & Quick Target Selector */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap relative z-10">
        
        {/* Quick Goal Target Switcher */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-extrabold text-slate-500 flex items-center gap-0.5 mr-0.5">
            <Zap className="w-3 h-3 text-amber-500" />
            <span>Hedef Seç:</span>
          </span>

          {activeOptions.map((val) => (
            <button
              key={val}
              type="button"
              onClick={(e) => handleSelectTarget(val, e)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                dailyTarget === val
                  ? 'bg-teal-600 text-white shadow-xs scale-105 ring-2 ring-teal-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {val} {unitLabel}
            </button>
          ))}
        </div>

        {/* Right CTA Links */}
        <div className="flex items-center gap-2 ml-auto">
          {onStartLesson && !isGoalReached && (
            <button
              onClick={onStartLesson}
              className="px-3 py-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <span>Ders Seç</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('profile')}
              className="text-[10px] font-extrabold text-teal-700 hover:text-teal-900 flex items-center gap-0.5 cursor-pointer p-1 rounded-lg hover:bg-teal-50 transition"
              title="Profil ayarlarından hedefi özelleştir"
            >
              <Sliders className="w-3 h-3" />
              <span>Ayarlar</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
