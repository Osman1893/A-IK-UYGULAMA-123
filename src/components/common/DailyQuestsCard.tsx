import React, { useState } from 'react';
import { 
  Target, 
  BookOpen, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  Gift, 
  ShieldCheck, 
  Flame, 
  ChevronRight,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, DailyQuestItem } from '../../types';
import { storageService } from '../../services/storageService';
import { audioService } from '../../services/audioService';

interface DailyQuestsCardProps {
  user: UserProfile;
  onUpdateUser?: (updated: UserProfile) => void;
  onNavigateTab?: (tab: any) => void;
  onOpenPracticeGame?: () => void;
}

export const DailyQuestsCard: React.FC<DailyQuestsCardProps> = ({
  user,
  onUpdateUser,
  onNavigateTab,
  onOpenPracticeGame
}) => {
  const isTr = user.currentDirection === 'TR_TO_KZ';
  const quests = storageService.getDailyQuests();
  const shields = user.streakShields !== undefined ? user.streakShields : 1;

  const [claimedToast, setClaimedToast] = useState<string | null>(null);
  const [chestOpened, setChestOpened] = useState<boolean>(false);

  const completedCount = quests.filter(q => q.isCompleted).length;
  const allCompleted = quests.length > 0 && quests.every(q => q.isCompleted);
  const allClaimed = quests.length > 0 && quests.every(q => q.isClaimed);

  // Claim individual quest reward
  const handleClaim = (questId: string) => {
    const { user: updated, earnedXp } = storageService.claimDailyQuest(questId);
    if (onUpdateUser) onUpdateUser(updated);
    audioService.playFeedbackSound('complete');
    setClaimedToast(`+${earnedXp} XP Hesabınıza Eklendi! 🎉`);
    setTimeout(() => setClaimedToast(null), 3000);
  };

  // Claim Grand Champion Chest
  const handleOpenGrandChest = () => {
    if (!allCompleted || chestOpened) return;
    const { user: updated, earnedXp, streakShieldAdded } = storageService.claimDailyGrandChest();
    if (onUpdateUser) onUpdateUser(updated);
    setChestOpened(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setClaimedToast(
      streakShieldAdded 
        ? `🎁 ŞAMPİYON SANDIĞI AÇILDI! +${earnedXp} XP ve +1 Seri Kalkanı 🛡️ kazandınız!` 
        : `🎁 ŞAMPİYON SANDIĞI AÇILDI! +${earnedXp} XP kazandınız!`
    );
    setTimeout(() => setClaimedToast(null), 4500);
  };

  // Buy Streak Shield with XP
  const handleBuyShield = () => {
    const res = storageService.buyStreakShieldWithXp(100);
    if (res.success) {
      if (onUpdateUser) onUpdateUser(res.user);
      setClaimedToast('🛡️ Seri Kalkanı Aktif Edildi! Olası gün kaybında seriniz korunur.');
    } else {
      setClaimedToast(res.error || 'İşlem başarısız.');
    }
    setTimeout(() => setClaimedToast(null), 3500);
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden transition-all hover:shadow-md space-y-4">
      {/* Toast Notification */}
      {claimedToast && (
        <div className="p-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-xs font-bold rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{claimedToast}</span>
          </div>
          <button onClick={() => setClaimedToast(null)} className="text-white/80 hover:text-white font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Header Row: Title & Streak Shield Indicator */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shadow-2xs shrink-0">
            <Target className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                {isTr ? 'GÜNLÜK 3 GÖREV' : 'КҮНДЕЛІКТІ 3 ТАПСЫРМА'}
              </h3>
              <span className={`text-[10px] font-black px-2 py-0.2 rounded-full border ${
                allCompleted 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {completedCount} / 3 {isTr ? 'Tamamlandı' : 'Орындалды'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {isTr 
                ? 'Görevleri tamamlayarak ekstra XP toplayın ve Şampiyon Sandığını açın.' 
                : 'Тапсырмаларды орындап, қосымша XP және сыйлық сандығын алыңыз.'}
            </p>
          </div>
        </div>

        {/* Streak Shield Status Pill */}
        <div 
          onClick={handleBuyShield}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-xl cursor-pointer hover:border-amber-400 transition shrink-0 group"
          title="Seri Kalkanı (Streak Freeze) - Gün atlamasında serinizi korur. Tıklayarak 100 XP ile edinebilirsiniz."
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition" />
          <div className="text-right">
            <span className="text-[10px] font-black text-amber-950 block leading-none">
              {shields} {isTr ? 'Kalkan' : 'Қалқан'}
            </span>
            <span className="text-[8px] font-bold text-amber-700">
              {isTr ? '+Al (100 XP)' : '+Алу'}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Daily Quests List */}
      <div className="space-y-2.5">
        {quests.map((quest) => {
          const ratio = Math.min(1, quest.progress / quest.target);
          const percent = Math.round(ratio * 100);

          return (
            <div 
              key={quest.id}
              className={`p-3 rounded-2xl border transition-all ${
                quest.isCompleted
                  ? 'bg-gradient-to-r from-emerald-50/60 via-white to-teal-50/40 border-emerald-200'
                  : 'bg-slate-50/80 border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    quest.isCompleted
                      ? 'bg-emerald-500 text-white shadow-2xs'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {quest.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    ) : quest.type === 'lesson' ? (
                      <Target className="w-4 h-4" />
                    ) : quest.type === 'vocab' ? (
                      <BookOpen className="w-4 h-4" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-slate-900 truncate">
                        {isTr ? quest.titleTr : quest.titleKz}
                      </h4>
                      <span className="text-[10px] font-black text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded shrink-0">
                        +{quest.xpReward} XP
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">
                      {isTr ? quest.descriptionTr : quest.descriptionKz}
                    </p>
                  </div>
                </div>

                {/* Right Action: Progress vs Claim */}
                <div className="shrink-0">
                  {quest.isClaimed ? (
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-xl">
                      ✓ Alındı
                    </span>
                  ) : quest.isCompleted ? (
                    <button
                      onClick={() => handleClaim(quest.id)}
                      className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-[10px] font-black rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>{isTr ? 'Ödülü Al' : 'Алу'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (quest.type === 'lesson' && onNavigateTab) {
                          onNavigateTab('lessons');
                        } else if (quest.type === 'vocab' && onNavigateTab) {
                          onNavigateTab('dictionary');
                        } else if (quest.type === 'game' && onOpenPracticeGame) {
                          onOpenPracticeGame();
                        }
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold rounded-xl transition flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{quest.progress}/{quest.target}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-2 w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    quest.isCompleted ? 'bg-emerald-500' : 'bg-teal-600'
                  }`}
                  style={{ width: `${Math.max(6, percent)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* GRAND CHAMPION CHEST (GÜNÜN ŞAMPİYONU SANDIĞI) */}
      <div className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
        allCompleted
          ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/10 border-amber-300 shadow-xs'
          : 'bg-slate-50 border-slate-200/80 opacity-80'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-2xs shrink-0 ${
            allCompleted 
              ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white ring-2 ring-amber-300' 
              : 'bg-slate-200 text-slate-400'
          }`}>
            🎁
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-900">
                {isTr ? 'Günün Şampiyonu Sandığı' : 'Күннің Батыры Сандығы'}
              </span>
              <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-md">
                +50 XP & 🛡️ Kalkan
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {allCompleted
                ? (isTr ? 'Tebrikler! 3 görevi tamamladınız, sandığınızı açın!' : 'Құттықтаймыз! Сандықты ашыңыз!')
                : (isTr ? `3 görevi de tamamlayarak büyük sandığı açın (${completedCount}/3)` : `3 тапсырманы орындаңыз (${completedCount}/3)`)}
            </p>
          </div>
        </div>

        <div>
          {chestOpened ? (
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl">
              ✓ Açıldı
            </span>
          ) : (
            <button
              onClick={handleOpenGrandChest}
              disabled={!allCompleted}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md active:scale-95 ${
                allCompleted
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 cursor-pointer animate-pulse'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>{isTr ? 'Sandığı Aç' : 'Ашу'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
