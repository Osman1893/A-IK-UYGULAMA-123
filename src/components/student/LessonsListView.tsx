import React, { useState } from 'react';
import { Unit, Lesson, UserProfile, CefrLevel } from '../../types';
import { 
  CheckCircle2, 
  ChevronRight, 
  Lock, 
  BookOpen, 
  HardDrive, 
  Check, 
  Wifi, 
  WifiOff, 
  Search, 
  Sparkles, 
  Play, 
  Filter,
  CheckCircle
} from 'lucide-react';
import { offlineCacheService } from '../../services/offlineCacheService';
import { DailyGoalProgressBar } from '../common/DailyGoalProgressBar';

interface LessonsListViewProps {
  units: Unit[];
  user: UserProfile;
  onSelectLesson: (unit: Unit, lesson: Lesson) => void;
  onSelectLevel: (level: CefrLevel) => void;
  onUpdateUser?: (updated: UserProfile) => void;
  onNavigateTab?: (tab: any) => void;
}

export const LessonsListView: React.FC<LessonsListViewProps> = ({
  units,
  user,
  onSelectLesson,
  onSelectLevel,
  onUpdateUser,
  onNavigateTab
}) => {
  const isTr = user.currentDirection === 'TR_TO_KZ';
  const isOnline = offlineCacheService.isOnline();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'remaining'>('all');

  const activeUnits = units.filter(
    u => u.level === user.currentLevel && (!u.direction || u.direction === user.currentDirection || u.direction === 'BOTH' || (u.direction as any) === 'TR_TO_KZ')
  );

  // Compute stats for current level
  const allLevelLessons: { unit: Unit; lesson: Lesson; isCompleted: boolean }[] = [];
  activeUnits.forEach(u => {
    u.lessons.forEach(l => {
      allLevelLessons.push({
        unit: u,
        lesson: l,
        isCompleted: user.completedLessonIds.includes(l.id)
      });
    });
  });

  const totalLessonsCount = allLevelLessons.length;
  const completedLessonsCount = allLevelLessons.filter(l => l.isCompleted).length;
  const remainingLessonsCount = totalLessonsCount - completedLessonsCount;
  const levelProgressPercent = totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;

  // Next unfinished lesson for quick resume
  const nextUnfinished = allLevelLessons.find(l => !l.isCompleted) || allLevelLessons[0];

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-12">
      
      {/* Header and Level Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <span>MÜFREDAT DERSLERİ</span>
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">
            CEFR {user.currentLevel} Seviyesi Eğitim Modülleri
          </p>
        </div>

        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
          {(['A1', 'A2', 'B1', 'B2', 'C1'] as CefrLevel[]).map(lvl => (
            <button
              key={lvl}
              onClick={() => onSelectLevel(lvl)}
              className={`px-2.5 py-1 rounded-lg transition ${
                user.currentLevel === lvl ? 'bg-teal-600 text-white shadow-2xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Goal Interactive Progress Bar in Lessons List */}
      <DailyGoalProgressBar
        user={user}
        onUpdateUser={onUpdateUser}
        onNavigateTab={onNavigateTab}
        title={isTr ? 'Bugünkü Hedefiniz' : 'Бүгінгі межеңіз'}
      />

      {/* Prominent Offline Ready Banner */}
      <div className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
        !isOnline 
          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
          : 'bg-emerald-50/80 border-emerald-200/90 text-emerald-950'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-xl ${
            !isOnline ? 'bg-slate-950 text-amber-400' : 'bg-emerald-600 text-white'
          }`}>
            {!isOnline ? <WifiOff className="w-4 h-4" /> : <HardDrive className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider">
                {!isOnline ? 'Çevrimdışı Mod Devrede' : 'Çevrimdışı Mod Destekli'}
              </span>
              <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                !isOnline ? 'bg-slate-950 text-amber-300' : 'bg-emerald-200/80 text-emerald-900'
              }`}>
                34/34 Önbellekte
              </span>
            </div>
            <p className="text-[11px] opacity-90 leading-tight">
              {!isOnline 
                ? 'İnternet bağlantınız yok ancak tüm dersler ve sesler cihazınızda kayıtlı.'
                : 'Tüm dersler, alıştırmalar ve 9 özel harf sesi internetsiz kullanıma hazırdır.'}
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl shrink-0 hidden sm:inline-flex items-center gap-1 ${
          !isOnline ? 'bg-slate-950 text-white' : 'bg-emerald-600 text-white shadow-2xs'
        }`}>
          <Check className="w-3 h-3" />
          <span>Önbellek Aktif</span>
        </span>
      </div>

      {/* A1 1. Konu: Kazak Alfabesi ve Ağız Şekilleri Promoted Banner */}
      {user.currentLevel === 'A1' && (
        <div 
          onClick={() => {
            const unit1 = activeUnits.find(u => u.unitNumber === 1) || activeUnits[0];
            const lesson1 = unit1?.lessons[0];
            if (unit1 && lesson1) onSelectLesson(unit1, lesson1);
          }}
          className="p-4 rounded-3xl bg-gradient-to-r from-teal-700 via-emerald-800 to-cyan-900 text-white shadow-md hover:shadow-lg cursor-pointer transition flex items-center justify-between border-2 border-emerald-400/50 group"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                ⭐ A1 • 1. TEMEL KONU
              </span>
              <span className="text-[9px] font-black bg-emerald-500/80 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-2.5 h-2.5" />
                <span>Çevrimdışı Hazır</span>
              </span>
            </div>
            <h3 className="text-sm font-black text-white group-hover:text-amber-200 transition">
              Kazak Alfabesi ve Ağız Şekilleri
            </h3>
            <p className="text-[11px] text-teal-100 max-w-xs">
              9 özel harf, dudak ve dil anatomisi görselleri, doğal Kazakça seslendirmesi.
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition shadow-inner">
            👄
          </div>
        </div>
      )}

      {/* Level Progress Overview & Quick Resume Card */}
      <div className="bg-white rounded-3xl p-4 border border-teal-100 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-black text-xs">
              {user.currentLevel}
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 leading-tight">
                {user.currentLevel} Seviye İlerlemeniz
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {completedLessonsCount} / {totalLessonsCount} ders tamamlandı (%{levelProgressPercent})
              </p>
            </div>
          </div>

          {nextUnfinished && (
            <button
              onClick={() => onSelectLesson(nextUnfinished.unit, nextUnfinished.lesson)}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{completedLessonsCount === 0 ? 'Derslere Başla' : 'Kaldığın Yerden Devam'}</span>
            </button>
          )}
        </div>

        {/* Level Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(levelProgressPercent > 0 ? 5 : 0, levelProgressPercent)}%` }}
          />
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ders başlığı veya konu ara (Örn: Alfabe, Selamlaşma)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-teal-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Tüm Dersler ({totalLessonsCount})
          </button>
          <button
            onClick={() => setStatusFilter('remaining')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              statusFilter === 'remaining'
                ? 'bg-teal-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Kalan Dersler ({remainingLessonsCount})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Tamamlananlar ({completedLessonsCount})
          </button>
        </div>
      </div>

      {/* Units & Lessons */}
      <div className="space-y-4">
        {activeUnits.map(unit => {
          // Filter unit lessons by search and status
          const filteredLessons = unit.lessons.filter(lesson => {
            const isCompleted = user.completedLessonIds.includes(lesson.id);
            if (statusFilter === 'completed' && !isCompleted) return false;
            if (statusFilter === 'remaining' && isCompleted) return false;

            if (searchQuery.trim()) {
              const query = searchQuery.toLowerCase();
              const matchTitle = (lesson.titleTr || '').toLowerCase().includes(query) || 
                                 (lesson.titleKz || '').toLowerCase().includes(query);
              const matchSummary = (lesson.summaryTr || '').toLowerCase().includes(query) || 
                                   (lesson.summaryKz || '').toLowerCase().includes(query);
              return matchTitle || matchSummary;
            }
            return true;
          });

          if (filteredLessons.length === 0) return null;

          return (
            <div key={unit.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="px-5 py-3.5 bg-gradient-to-r from-teal-50 to-white border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-teal-800 tracking-wider">
                    {unit.level} • Ünite {unit.unitNumber}
                  </span>
                  <h3 className="text-xs font-black text-slate-900 mt-0.5">
                    {isTr ? unit.titleTr : unit.titleKz}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Check className="w-2.5 h-2.5 text-emerald-600" />
                    <span>Çevrimdışı</span>
                  </span>
                  <span className="text-[11px] font-bold text-teal-700 bg-teal-100/70 px-2.5 py-0.5 rounded-full">
                    {filteredLessons.length} Ders
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredLessons.map(lesson => {
                  const isCompleted = user.completedLessonIds.includes(lesson.id);
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => onSelectLesson(unit, lesson)}
                      className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition active:bg-slate-100 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 ${
                          isCompleted ? 'bg-emerald-500 text-white shadow-xs' : 'bg-teal-100 text-teal-800'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : lesson.lessonNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-teal-700 transition">
                              {isTr ? lesson.titleTr : lesson.titleKz}
                            </h4>
                            {/* Distinct Cached Badge */}
                            <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/80 inline-flex items-center gap-0.5 shrink-0">
                              <Check className="w-2.5 h-2.5 text-emerald-600" />
                              <span>Çevrimdışı Hazır</span>
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            {isTr ? lesson.summaryTr : lesson.summaryKz}
                          </p>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition" />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Empty state when no lessons match filter */}
        {activeUnits.every(unit => unit.lessons.filter(lesson => {
          const isCompleted = user.completedLessonIds.includes(lesson.id);
          if (statusFilter === 'completed' && !isCompleted) return false;
          if (statusFilter === 'remaining' && isCompleted) return false;
          if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return (lesson.titleTr || '').toLowerCase().includes(query) || 
                   (lesson.titleKz || '').toLowerCase().includes(query) ||
                   (lesson.summaryTr || '').toLowerCase().includes(query) || 
                   (lesson.summaryKz || '').toLowerCase().includes(query);
          }
          return true;
        }).length === 0) && (
          <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto text-lg">
              🔍
            </div>
            <h4 className="text-xs font-black text-slate-800">
              Arama kriterinize uygun ders bulunamadı
            </h4>
            <p className="text-[11px] text-slate-500">
              Filtreleri sıfırlayarak tüm {user.currentLevel} seviye derslerini görüntüleyebilirsiniz.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="mt-2 px-3 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-xl hover:bg-teal-700 transition"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
