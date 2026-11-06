import React from 'react';
import { 
  Home, 
  Map, 
  Mic, 
  Trophy, 
  Users, 
  User, 
  BookOpen, 
  GraduationCap, 
  Tv,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { LanguageDirection } from '../../types';

export type MainStudentTab = 
  | 'home' 
  | 'stages'
  | 'speak'
  | 'leaderboard'
  | 'profile'
  | 'lessons' 
  | 'grammar' 
  | 'prompter' 
  | 'sohbet' 
  | 'dictionary' 
  | 'review';

interface BottomNavBarProps {
  currentTab: MainStudentTab;
  direction: LanguageDirection;
  onTabChange: (tab: MainStudentTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  direction,
  onTabChange
}) => {
  const isTr = direction === 'TR_TO_KZ';

  return (
    <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-teal-100 px-2 py-1.5 flex items-center justify-around shadow-lg">
      
      {/* 1. Ana Sayfa (Öğren) */}
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center gap-0.5 transition px-2.5 py-1 rounded-2xl ${
          currentTab === 'home' 
            ? 'text-teal-700 bg-teal-50 font-black' 
            : 'text-slate-400 hover:text-slate-600 font-medium'
        }`}
      >
        <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[9px] leading-tight">{isTr ? 'Öğren' : 'Басты'}</span>
      </button>

      {/* 2. Etaplar & Yol Haritası (Oyunlar) */}
      <button
        onClick={() => onTabChange('stages')}
        className={`flex flex-col items-center gap-0.5 transition px-2.5 py-1 rounded-2xl ${
          currentTab === 'stages' 
            ? 'text-teal-700 bg-teal-50 font-black' 
            : 'text-slate-400 hover:text-slate-600 font-medium'
        }`}
      >
        <Map className={`w-5 h-5 ${currentTab === 'stages' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[9px] leading-tight">{isTr ? 'Etaplar' : 'Кезең'}</span>
      </button>

      {/* 3. Konuşma & Telaffuz (Speak Screen) */}
      <button
        onClick={() => onTabChange('speak')}
        className={`flex flex-col items-center gap-0.5 transition px-2.5 py-1 rounded-2xl ${
          currentTab === 'speak' 
            ? 'text-teal-700 bg-teal-50 font-black' 
            : 'text-slate-400 hover:text-slate-600 font-medium'
        }`}
      >
        <Mic className={`w-5 h-5 ${currentTab === 'speak' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[9px] leading-tight">{isTr ? 'Konuş' : 'Дыбыстау'}</span>
      </button>

      {/* 4. AI Sohbet (Gemini AI Chatbot) */}
      <button
        onClick={() => onTabChange('sohbet')}
        className={`flex flex-col items-center gap-0.5 transition px-2 py-1 rounded-2xl relative ${
          currentTab === 'sohbet' 
            ? 'text-teal-700 bg-teal-50 font-black' 
            : 'text-slate-400 hover:text-slate-600 font-medium'
        }`}
      >
        <span className="relative">
          <Sparkles className={`w-5 h-5 ${currentTab === 'sohbet' ? 'stroke-[2.5] text-teal-700' : 'stroke-2 text-teal-500'}`} />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-1 ring-white animate-pulse" />
        </span>
        <span className="text-[9px] leading-tight font-bold">{isTr ? 'AI Sohbet' : 'AI Сұхбат'}</span>
      </button>

      {/* 5. Liderlik Tablosu (Leaderboard Screen) */}
      <button
        onClick={() => onTabChange('leaderboard')}
        className={`flex flex-col items-center gap-0.5 transition px-2.5 py-1 rounded-2xl ${
          currentTab === 'leaderboard' 
            ? 'text-teal-700 bg-teal-50 font-black' 
            : 'text-slate-400 hover:text-slate-600 font-medium'
        }`}
      >
        <Trophy className={`w-5 h-5 ${currentTab === 'leaderboard' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[9px] leading-tight">{isTr ? 'Liderlik' : 'Рейтинг'}</span>
      </button>

      {/* 5. Profil */}
      <button
        onClick={() => onTabChange('profile')}
        className={`flex flex-col items-center gap-0.5 transition px-2.5 py-1 rounded-2xl ${
          currentTab === 'profile' 
            ? 'text-teal-700 bg-teal-50 font-black' 
            : 'text-slate-400 hover:text-slate-600 font-medium'
        }`}
      >
        <User className={`w-5 h-5 ${currentTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[9px] leading-tight">{isTr ? 'Profil' : 'Профиль'}</span>
      </button>

    </div>
  );
};

