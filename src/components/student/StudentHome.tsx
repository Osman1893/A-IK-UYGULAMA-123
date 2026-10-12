import React from 'react';
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
  MessageSquare
} from 'lucide-react';
import { UserProfile, Unit, Lesson, CefrLevel } from '../../types';
import { MainStudentTab } from './BottomNavBar';

interface StudentHomeProps {
  user: UserProfile;
  units: Unit[];
  onSelectLesson: (unit: Unit, lesson: Lesson) => void;
  onNavigateTab: (tab: MainStudentTab) => void;
  onSelectLevel: (level: CefrLevel) => void;
  onOpenMatchGame: () => void;
  onOpenPlacementTest: () => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  user,
  units,
  onSelectLesson,
  onNavigateTab,
  onSelectLevel,
  onOpenMatchGame,
  onOpenPlacementTest
}) => {
  const isTr = user.currentDirection === 'TR_TO_KZ';
  
  // Filter units for current level and direction
  const activeUnits = units.filter(
    u => u.level === user.currentLevel && u.direction === user.currentDirection
  );

  // Calculate total lessons and completed
  const totalLessons = activeUnits.reduce((acc, u) => acc + u.lessons.length, 0);
  const completedCount = activeUnits.reduce(
    (acc, u) => acc + u.lessons.filter(l => user.completedLessonIds.includes(l.id)).length, 
    0
  );
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const allLevels: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

  return (
    <div className="flex-1 flex flex-col pb-6 bg-slate-50/50">
      
      {/* Top Hero Banner (Lingua Violet Gradient) */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white px-5 pt-4 pb-6 rounded-b-3xl shadow-md">
        
        {/* App Title Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black tracking-wider uppercase text-violet-200">
              UZAKTAN TÜRKOLOG
            </span>
          </div>
          
          {/* CEFR Level Switcher (A1 to C1) */}
          <div className="flex items-center bg-black/25 p-0.5 rounded-xl border border-white/10 text-[10px] font-bold">
            {allLevels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => onSelectLevel(lvl)}
                className={`px-2 py-0.5 rounded-lg transition ${
                  user.currentLevel === lvl 
                    ? 'bg-white text-violet-900 font-black shadow-xs' 
                    : 'text-violet-100 hover:text-white'
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
                className="w-13 h-13 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-violet-300/30"
              />
              <span className="absolute -bottom-1 -right-1 text-xs">
                {isTr ? '🇰🇿' : '🇹🇷'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-lg font-black tracking-tight leading-tight">
                  {isTr ? `MERHABA, ${user.name.split(' ')[0].toUpperCase()}!` : `СӘЛЕМ, ${user.name.split(' ')[0].toUpperCase()}!`}
                </p>
                {user.nickname && (
                  <span className="text-[10px] font-bold bg-white/20 text-violet-100 px-1.5 py-0.2 rounded-md">
                    @{user.nickname}
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-violet-100/90 flex items-center gap-1 mt-0.5">
                <span>{user.customTitle || (isTr ? 'Genç Türkolog' : 'Жас Түркітанушы')}</span>
                <span className="w-1 h-1 rounded-full bg-violet-300" />
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
              <span className="block text-[8px] font-semibold text-violet-100 uppercase mt-0.5">Tamam</span>
            </div>
          </div>
        </div>

        {/* Streak, XP & Energy Stats Banner */}
        <div className="grid grid-cols-3 gap-1.5 mt-4 pt-3 border-t border-white/15">
          <div 
            onClick={() => onNavigateTab('leaderboard')}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 cursor-pointer px-2.5 py-2 rounded-xl backdrop-blur-xs transition"
          >
            <Flame className="w-4 h-4 text-amber-300 shrink-0" />
            <div className="truncate">
              <div className="text-xs font-black leading-tight">{user.streakDays} Gün</div>
              <div className="text-[9px] text-violet-100">Seri</div>
            </div>
          </div>
          <div 
            onClick={() => onNavigateTab('leaderboard')}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 cursor-pointer px-2.5 py-2 rounded-xl backdrop-blur-xs transition"
          >
            <Trophy className="w-4 h-4 text-yellow-300 shrink-0" />
            <div className="truncate">
              <div className="text-xs font-black leading-tight">{user.xpPoints} XP</div>
              <div className="text-[9px] text-violet-100">Puan</div>
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
              <div className="text-[9px] text-violet-100">
                {user.isPremium ? 'Sınırsız' : 'Enerji'}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Main Body Content */}
      <div className="px-4 py-4 space-y-4">
        
        {/* HERO PROMOTED CARD 1: ETAP ETAP OYUNLAR & YOL HARİTASI (Matches Screen 3 in image) */}
        <div 
          onClick={() => onNavigateTab('stages')}
          className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-4 rounded-3xl border border-violet-400/40 shadow-lg hover:shadow-xl cursor-pointer transition active:scale-[0.99] group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-white/20 text-white rounded-md">
                  ETAP ETAP OYUNLAR
                </span>
                <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Yıldızları Topla</span>
                </span>
              </div>
              <h4 className="text-base font-black text-white group-hover:text-violet-100 transition">
                {isTr ? 'Öğrenme Haritası & Etaplar' : 'Оқу картасы және кезеңдер'}
              </h4>
              <p className="text-[11px] text-violet-100 leading-relaxed max-w-xs">
                {isTr 
                  ? 'Cümle çevirisi, kelime bankası kutucukları ve hazine sandığı bonusları.' 
                  : 'Сөз құрастыру, аударма жаттығулары және сыйлық сандықтар.'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl group-hover:scale-105 transition shrink-0 ml-2 shadow-inner">
              🗺️
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-white/20 flex items-center justify-between text-[11px]">
            <span className="text-violet-200 font-medium">Etap 1 • Etap 2 • Hazine Sandığı</span>
            <span className="text-white font-black flex items-center gap-1">
              <span>Etapları Başlat</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </span>
          </div>
        </div>

        {/* HERO PROMOTED CARD 2: KONUŞMA & TELAFFUZ (Matches Screen 2 in image) */}
        <div 
          onClick={() => onNavigateTab('speak')}
          className="bg-gradient-to-r from-purple-700 via-indigo-700 to-violet-800 text-white p-4 rounded-3xl border border-indigo-400/30 shadow-md hover:shadow-lg cursor-pointer transition active:scale-[0.99] group"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-white/20 text-white rounded-md">
                  SES & TELAFFUZ
                </span>
                <span className="text-[10px] text-emerald-300 font-bold">
                  Akustik Formant Analizi
                </span>
              </div>
              <h4 className="text-sm font-black text-white group-hover:text-indigo-200 transition">
                {isTr ? 'Konuşma & Telaffuz Pratiği' : 'Дыбыстау және айту тәжірибесі'}
              </h4>
              <p className="text-[11px] text-indigo-100 leading-relaxed">
                {isTr 
                  ? 'Kazakça harfleri ve cümleleri mikrofona söyleyin, anında skor alın.' 
                  : 'Қазақ тіліндегі сөйлемдерді айтып, дауыс дәлдігін тексеріңіз.'}
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-2xl group-hover:scale-105 transition shrink-0 ml-2">
              🎙️
            </div>
          </div>
        </div>

        {/* Quick Hub Navigation Cards (5-column modern chips including Forum) */}
        <div className="grid grid-cols-5 gap-1.5">
          <button
            onClick={() => onNavigateTab('grammar')}
            className="flex flex-col items-center justify-center p-2 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-violet-400 hover:shadow-sm transition group"
          >
            <div className="w-7 h-7 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center mb-1 group-hover:scale-105 transition">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] font-bold text-slate-800 text-center leading-tight">Gramer</span>
          </button>

          <button
            onClick={() => onNavigateTab('prompter')}
            className="flex flex-col items-center justify-center p-2 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-violet-400 hover:shadow-sm transition group"
          >
            <div className="w-7 h-7 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center mb-1 group-hover:scale-105 transition">
              <Tv className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] font-bold text-slate-800 text-center leading-tight">Okuma</span>
          </button>

          <button
            onClick={() => onNavigateTab('forum')}
            className="flex flex-col items-center justify-center p-2 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-violet-400 hover:shadow-sm transition group relative"
          >
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-violet-600" />
            <div className="w-7 h-7 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center mb-1 group-hover:scale-105 transition">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] font-bold text-slate-800 text-center leading-tight">Forum</span>
          </button>

          <button
            onClick={() => onNavigateTab('dictionary')}
            className="flex flex-col items-center justify-center p-2 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-violet-400 hover:shadow-sm transition group"
          >
            <div className="w-7 h-7 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center mb-1 group-hover:scale-105 transition">
              <Search className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] font-bold text-slate-800 text-center leading-tight">Sözlük</span>
          </button>

          <button
            onClick={onOpenPlacementTest}
            className="flex flex-col items-center justify-center p-2 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-violet-400 hover:shadow-sm transition group"
          >
            <div className="w-7 h-7 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center mb-1 group-hover:scale-105 transition">
              <Award className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] font-bold text-slate-800 text-center leading-tight">10 Soru</span>
          </button>
        </div>


        {/* Guest Account Sign-in Banner */}
        {user.isGuest && (
          <div 
            onClick={() => onNavigateTab('profile')}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/5 border border-teal-500/30 flex items-center justify-between cursor-pointer hover:border-teal-500 transition shadow-2xs group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-600 text-white shrink-0 group-hover:scale-105 transition shadow-xs">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 group-hover:text-teal-700 transition">
                  {isTr ? 'Kendi Üyeliğinle Devam Et' : 'Жеке аккаунтыңызбен жалғастырыңыз'}
                </p>
                <p className="text-[10px] text-slate-500">
                  {isTr ? 'Özel lakap belirle, forumda paylaşım yap ve ilerlemeni kaydet.' : 'Өз лақап атыңды таңдап, форумда пікір алмасыңыз.'}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black text-teal-700 bg-white px-2.5 py-1 rounded-lg border border-teal-200 shrink-0 ml-2 shadow-2xs">
              Giriş Yap →
            </span>
          </div>
        )}

        {/* FORUM HERO CARD */}
        <div 
          onClick={() => onNavigateTab('forum')}
          className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-4 rounded-2xl border border-amber-400/40 shadow-md hover:border-amber-300 cursor-pointer transition active:scale-[0.99] group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-white/20 text-white rounded-md">
                  FORUM
                </span>
                <span className="text-[10px] text-amber-100 font-bold flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{user.nickname ? `@${user.nickname}` : 'Lakap Belirle'}</span>
                </span>
              </div>
              <h4 className="text-sm font-black text-white group-hover:text-amber-100 transition">
                {isTr ? 'Forum: Soru Sor, Tartış & Paylaş' : 'Форум: Сұрақ қою және Пікір алмасу'}
              </h4>
              <p className="text-[11px] text-amber-100 leading-relaxed">
                {isTr 
                  ? 'Kazakça dil bilgisi soruları, şiir incelemeleri ve deneyimleri tartışın.' 
                  : 'Қазақ тілі, грамматика және мәдениет туралы пікір алмасып, сұрақтарыңызды қойыңыз.'}
              </p>
            </div>
            <div className="p-2 bg-white/20 rounded-xl group-hover:scale-105 transition shrink-0 ml-2">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* PROMPTER & STORY READING STUDIO HERO CARD */}
        <div 
          onClick={() => onNavigateTab('prompter')}
          className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white p-4 rounded-2xl border border-slate-700/80 shadow-md hover:border-teal-400 cursor-pointer transition active:scale-[0.99] group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-teal-500/20 text-teal-300 rounded-md border border-teal-500/30">
                  A1 - C1 TÜM SEVİYELER
                </span>
                <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>20 Özgün Hikaye</span>
                </span>
              </div>
              <h4 className="text-sm font-black text-white group-hover:text-teal-300 transition">
                {isTr ? 'Kayan Metinli Okuma Stüdyosu & Hikayeler' : 'Мәтін оқу промптері және әңгімелер'}
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {isTr 
                  ? 'Abay\'ın Kara Sözleri, Korkut Ata, Dasturhan ve Bozkır Efsaneleri ile akıcı okuma pratiği yapın.' 
                  : 'Абайдың қарасөздері, Қорқыт ата және дала аңыздарымен еркін оқыңыз.'}
              </p>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-500/30 group-hover:bg-teal-500 group-hover:text-slate-950 transition">
              <Tv className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-medium">Hız ayarlı teleprompter • Sesli telaffuz • Çeviri</span>
            <span className="text-teal-400 font-black flex items-center gap-1">
              <span>Hemen Başla</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
            </span>
          </div>
        </div>

        {/* Section 1: ÖĞRENME YOLU / ОҚУ ЖОЛЫ */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>{isTr ? 'ÖĞRENME YOLU' : 'ОҚУ ЖОЛЫ'}</span>
              <span className="text-teal-600 font-bold">({user.currentLevel})</span>
            </h3>
            <button
              onClick={() => onNavigateTab('lessons')}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-0.5"
            >
              <span>{isTr ? 'Tüm Müfredat' : 'Барлығы'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Unit List */}
          <div className="space-y-3">
            {activeUnits.map((unit) => (
              <div 
                key={unit.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
              >
                {/* Unit Header Bar */}
                <div className="px-4 py-3 bg-gradient-to-r from-teal-50 to-white border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{unit.level === 'A1' ? '🌱' : unit.level === 'B2' ? '📚' : unit.level === 'C1' ? '👑' : '🇹🇷'}</span>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 leading-tight">
                        {isTr ? unit.titleTr : unit.titleKz}
                      </h4>
                      <p className="text-[10px] font-semibold text-teal-700">
                        {isTr ? unit.titleKz : unit.titleTr}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full">
                    {unit.lessons.length} Ders
                  </span>
                </div>

                {/* Lesson Items inside Unit */}
                <div className="divide-y divide-slate-100">
                  {unit.lessons.map((lesson) => {
                    const isCompleted = user.completedLessonIds.includes(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => onSelectLesson(unit, lesson)}
                        className="px-4 py-3 flex items-center justify-between hover:bg-teal-50/50 cursor-pointer transition active:bg-teal-100/40"
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
                            <div className="text-xs font-bold text-slate-800 leading-tight">
                              {isTr ? lesson.titleTr : lesson.titleKz}
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                              {isTr ? lesson.titleKz : lesson.titleTr}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-teal-600 font-bold text-xs">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {activeUnits.length === 0 && (
              <div className="p-6 bg-white rounded-2xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
                Bu seviye için içerikler müfredatta hazırlanmaktadır.
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Günlük Hedef / Күнделікті мақсат */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">
                  {isTr ? 'Günlük Hedef' : 'Күнделікті мақсат'}
                </h4>
                <p className="text-[10px] text-slate-600 font-medium">
                  {user.todayCompletedMinutes} / {user.dailyGoalMinutes} dk (мин)
                </p>
              </div>
            </div>
            <span className="text-xs font-black text-amber-800">
              {Math.min(100, Math.round((user.todayCompletedMinutes / user.dailyGoalMinutes) * 100))}%
            </span>
          </div>

          <div className="w-full bg-amber-200/60 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((user.todayCompletedMinutes / user.dailyGoalMinutes) * 100))}%` }}
            />
          </div>
        </div>

        {/* Section 3: Hızlı Pratik Kartı */}
        <div className="grid grid-cols-2 gap-2.5">
          <div 
            onClick={onOpenMatchGame}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400 cursor-pointer transition active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-black text-slate-900 leading-tight">
              {isTr ? 'Hızlı Eşleştirme' : 'Жұптарды табу'}
            </h4>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {isTr ? 'Duolingo Stili Oyun' : 'Ойынмен қайталау'}
            </p>
          </div>

          <div 
            onClick={() => onNavigateTab('review')}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-teal-400 cursor-pointer transition active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-2.5">
              <Bookmark className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-black text-slate-900 leading-tight">
              {isTr ? 'Aralıklı Tekrar (SRS)' : 'Аралық қайталау'}
            </h4>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {user.reviewWordIds.length} {isTr ? 'kelime sırada' : 'сөз кезекте'}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
