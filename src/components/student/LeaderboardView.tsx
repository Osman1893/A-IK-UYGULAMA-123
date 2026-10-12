import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Award, 
  Calendar, 
  Clock, 
  Medal, 
  Crown, 
  Sparkles, 
  CheckCircle2, 
  Lock,
  ChevronRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { UserProfile, LeaderboardPeriod, LeaderboardEntry } from '../../types';
import { storageService } from '../../services/storageService';

interface LeaderboardViewProps {
  user: UserProfile;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ user }) => {
  const isTr = user.currentDirection === 'TR_TO_KZ';
  const [subTab, setSubTab] = useState<'leaderboard' | 'achievements'>('leaderboard');
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly');

  const leaderboardEntries = storageService.getLeaderboard(period);
  const achievements = storageService.getAchievementsProgress();

  const topThree = leaderboardEntries.slice(0, 3);
  const remaining = leaderboardEntries.slice(3);
  const currentUserEntry = leaderboardEntries.find(e => e.isCurrentUser);

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-14 bg-violet-50/20">
      
      {/* Top Segmented Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 text-violet-600" />
            <span>LİDERLİK TABLOSU</span>
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">
            Haftalık lig sıralaması ve başarılar
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-violet-100/70 p-0.5 rounded-2xl border border-violet-200 text-xs font-bold">
          <button
            onClick={() => setSubTab('leaderboard')}
            className={`px-3 py-1 rounded-xl transition ${
              subTab === 'leaderboard' ? 'bg-violet-600 text-white font-black shadow-xs' : 'text-violet-800'
            }`}
          >
            Liderlik
          </button>
          <button
            onClick={() => setSubTab('achievements')}
            className={`px-3 py-1 rounded-xl transition ${
              subTab === 'achievements' ? 'bg-violet-600 text-white font-black shadow-xs' : 'text-violet-800'
            }`}
          >
            Rozetler
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. LİDERLİK TABLOSU (LEADERBOARD - Lingua Style) */}
      {/* ========================================================= */}
      {subTab === 'leaderboard' && (
        <div className="space-y-4">
          
          {/* League Hero Banner (Lingua Emerald / Diamond League) */}
          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 text-white p-4 rounded-3xl shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner border border-white/20">
                  💎
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-violet-200">
                    HAFTALIK LİG
                  </span>
                  <h3 className="text-sm font-black leading-tight text-white">
                    Elmas Lig (Алмаз Лигасы)
                  </h3>
                  <p className="text-[10px] text-violet-200 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Sıfırlanmaya 3 gün 14 saat kaldı</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 bg-amber-400 text-slate-950 font-black text-[10px] rounded-full shadow-xs">
                  İlk 3 Terfi Eder ⬆
                </span>
              </div>
            </div>
          </div>

          {/* Period Filter (Günlük / Haftalık / Aylık) */}
          <div className="flex items-center justify-center gap-1 bg-slate-200/70 p-1 rounded-2xl">
            <button
              onClick={() => setPeriod('daily')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 ${
                period === 'daily'
                  ? 'bg-white text-violet-900 font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-violet-500" />
              <span>Günlük</span>
            </button>

            <button
              onClick={() => setPeriod('weekly')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 ${
                period === 'weekly'
                  ? 'bg-white text-violet-900 font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-violet-600" />
              <span>Haftalık</span>
            </button>

            <button
              onClick={() => setPeriod('monthly')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 ${
                period === 'monthly'
                  ? 'bg-white text-violet-900 font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>Tüm Zamanlar</span>
            </button>
          </div>

          {/* TOP 3 PODIUM - Lingua Gamified Podium (Handles clean production user count) */}
          {topThree.length > 1 ? (
            <div className="grid grid-cols-3 gap-2 items-end pt-5 pb-2">
              {/* Rank 2 (Silver) */}
              {topThree[1] ? (
                <div className="bg-white rounded-3xl p-3 border border-slate-200 shadow-sm flex flex-col items-center text-center relative">
                  <span className="absolute -top-3 px-2.5 py-0.5 bg-slate-200 text-slate-800 text-[10px] font-black rounded-full shadow-xs border border-white">
                    🥈 2.
                  </span>
                  <img
                    src={topThree[1].avatarUrl}
                    alt={topThree[1].name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-300 mt-2 mb-1 shadow-xs"
                  />
                  <h4 className="text-xs font-black text-slate-900 truncate w-full">
                    {topThree[1].name.split(' ')[0]}
                  </h4>
                  <span className="text-[10px] font-extrabold text-violet-700">
                    {topThree[1].xp} XP
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold">
                    {topThree[1].level}
                  </span>
                </div>
              ) : <div />}

              {/* Rank 1 (Gold - Center higher with crown) */}
              {topThree[0] && (
                <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl p-3.5 border-2 border-amber-300 shadow-md flex flex-col items-center text-center relative -mt-4">
                  <span className="absolute -top-3.5 px-3 py-0.5 bg-amber-400 text-slate-950 text-xs font-black rounded-full shadow-xs flex items-center gap-0.5 border border-white">
                    👑 1.
                  </span>
                  <img
                    src={topThree[0].avatarUrl}
                    alt={topThree[0].name}
                    className="w-14 h-14 rounded-full object-cover border-3 border-amber-400 mt-2 mb-1 shadow-md"
                  />
                  <h4 className="text-xs font-black text-slate-900 truncate w-full">
                    {topThree[0].name.split(' ')[0]}
                  </h4>
                  <span className="text-xs font-black text-amber-600">
                    {topThree[0].xp} XP
                  </span>
                  <span className="text-[10px] text-violet-700 font-bold">
                    {topThree[0].level}
                  </span>
                </div>
              )}

              {/* Rank 3 (Bronze) */}
              {topThree[2] ? (
                <div className="bg-white rounded-3xl p-3 border border-slate-200 shadow-sm flex flex-col items-center text-center relative">
                  <span className="absolute -top-3 px-2.5 py-0.5 bg-amber-700/20 text-amber-900 text-[10px] font-black rounded-full shadow-xs border border-white">
                    🥉 3.
                  </span>
                  <img
                    src={topThree[2].avatarUrl}
                    alt={topThree[2].name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-600/40 mt-2 mb-1 shadow-xs"
                  />
                  <h4 className="text-xs font-black text-slate-900 truncate w-full">
                    {topThree[2].name.split(' ')[0]}
                  </h4>
                  <span className="text-[10px] font-extrabold text-violet-700">
                    {topThree[2].xp} XP
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold">
                    {topThree[2].level}
                  </span>
                </div>
              ) : <div />}
            </div>
          ) : topThree.length === 1 ? (
            <div className="flex justify-center pt-5 pb-2">
              <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl p-4 border-2 border-amber-300 shadow-md flex flex-col items-center text-center relative max-w-xs w-full">
                <span className="absolute -top-3.5 px-3 py-0.5 bg-amber-400 text-slate-950 text-xs font-black rounded-full shadow-xs flex items-center gap-0.5 border border-white">
                  👑 1. LİDER
                </span>
                <img
                  src={topThree[0].avatarUrl}
                  alt={topThree[0].name}
                  className="w-16 h-16 rounded-full object-cover border-3 border-amber-400 mt-2 mb-1 shadow-md"
                />
                <h4 className="text-sm font-black text-slate-900 truncate w-full">
                  {topThree[0].name}
                </h4>
                <span className="text-xs font-black text-amber-600">
                  {topThree[0].xp} XP
                </span>
                <span className="text-[10px] text-violet-700 font-bold">
                  {topThree[0].level} Seviye
                </span>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">
                  Lig liderisiniz! Diğer öğrenciler katıldıkça kürsü dolacaktır.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center space-y-2">
              <Trophy className="w-8 h-8 text-violet-400 mx-auto" />
              <h4 className="text-xs font-black text-slate-800">Yeni Lig Sezonu Başladı</h4>
              <p className="text-[11px] text-slate-500">Dersleri tamamlayıp XP kazandıkça sıralamada ilk sıraya yerleşeceksiniz.</p>
            </div>
          )}

          {/* Current User Live Standing Banner (Always shows user's actual photo!) */}
          {currentUserEntry && (
            <div className="p-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl shadow-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={user.avatarUrl || currentUserEntry.avatarUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[10px]">
                    #{currentUserEntry.rank}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-black leading-tight flex items-center gap-1.5">
                    <span>{user.name}</span>
                    <span className="px-1.5 py-0.2 bg-white/20 text-[9px] font-bold rounded">SEN</span>
                  </div>
                  <div className="text-[10px] text-violet-100 flex items-center gap-1.5 mt-0.5">
                    <span>{currentUserEntry.xp} XP</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Flame className="w-3 h-3 text-amber-300" />
                      {user.streakDays} gün seri
                    </span>
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-white/20 rounded-xl text-[10px] font-bold">
                {period === 'daily' ? 'Bugün' : period === 'weekly' ? 'Bu Hafta' : 'Tüm Zamanlar'}
              </span>
            </div>
          )}

          {/* Rankings List */}
          <div className="bg-white rounded-3xl border border-violet-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {leaderboardEntries.map((entry) => (
              <div
                key={entry.userId}
                className={`px-4 py-3 flex items-center justify-between transition ${
                  entry.isCurrentUser ? 'bg-violet-50/80 font-bold ring-1 ring-violet-300' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 text-center text-xs font-black ${
                    entry.rank <= 3 ? 'text-amber-500' : 'text-slate-400'
                  }`}>
                    {entry.rank}
                  </span>

                  <img
                    src={entry.isCurrentUser ? (user.avatarUrl || entry.avatarUrl) : entry.avatarUrl}
                    alt={entry.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />

                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <span>{entry.name}</span>
                      {entry.isCurrentUser && (
                        <span className="px-1.5 py-0.2 bg-violet-600 text-white text-[9px] rounded font-black">
                          SEN
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {entry.badgeTitle} • {entry.level}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-violet-700">
                    {entry.xp} XP
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold flex items-center justify-end gap-0.5">
                    <Flame className="w-3 h-3 text-amber-500" />
                    <span>{entry.streak} gün</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 2. BAŞARILAR VE ROZETLER (ACHIEVEMENTS) */}
      {/* ========================================================= */}
      {subTab === 'achievements' && (
        <div className="space-y-3">
          
          <div className="p-3 bg-violet-50 border border-violet-200 rounded-2xl text-xs text-violet-900 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-600 shrink-0" />
            <span>
              {isTr 
                ? 'Dersleri tamamlayarak, kelime ezberleyerek ve seri yaparak yeni rozetlerin kilidini açın!' 
                : 'Сабақтарды орындап, сөз жаттап, жаңа марапаттарға қол жеткізіңіз!'}
            </span>
          </div>

          <div className="space-y-3">
            {achievements.map((item) => (
              <div
                key={item.badge.id}
                className={`p-4 rounded-3xl border transition ${
                  item.isUnlocked
                    ? 'bg-white border-violet-300 shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs shrink-0 ${
                      item.isUnlocked ? 'bg-amber-100' : 'bg-slate-200 grayscale'
                    }`}>
                      {item.badge.id === 'badge-1' ? '🏆' :
                       item.badge.id === 'badge-2' ? '📚' :
                       item.badge.id === 'badge-3' ? '🔥' :
                       item.badge.id === 'badge-4' ? '🎙️' :
                       item.badge.id === 'badge-5' ? '⚡' : '👑'}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-black text-slate-900">
                          {isTr ? item.badge.titleTr : item.badge.titleKz}
                        </h4>
                        {item.isUnlocked ? (
                          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded">
                            Açıldı ✓
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 bg-slate-200 text-slate-600 text-[9px] font-black rounded flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> Kilitli
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {isTr ? item.badge.descriptionTr : item.badge.descriptionKz}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>İlerleme:</span>
                    <span>{Math.min(item.max, item.progress)} / {item.max}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        item.isUnlocked ? 'bg-violet-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, (item.progress / item.max) * 100)}%` }}
                    />
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};

