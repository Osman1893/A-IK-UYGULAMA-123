import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Volume2, 
  Star, 
  Gift, 
  Heart, 
  Flame, 
  Trophy, 
  ArrowLeft, 
  Check, 
  X, 
  RotateCcw,
  Play,
  ArrowRight,
  HelpCircle,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioService } from '../../services/audioService';
import { storageService } from '../../services/storageService';
import { UserProfile, Unit, Lesson } from '../../types';

interface StageQuestMapViewProps {
  user: UserProfile;
  units: Unit[];
  onSelectLesson: (unit: Unit, lesson: Lesson) => void;
  onOpenMatchGame: () => void;
  onNavigateTab: (tab: any) => void;
  onEarnXp: (xp: number) => void;
}

interface QuestStage {
  id: string;
  stageNumber: number;
  titleTr: string;
  titleKz: string;
  icon: string;
  stars: number; // 0, 1, 2, 3
  status: 'completed' | 'active' | 'locked';
  totalTasks: number;
  description: string;
  sentencePrompt: {
    kz: string;
    tr: string;
    audio: string;
    wordBank: string[];
    correctOrder: string[];
  };
}

const DEFAULT_STAGES: QuestStage[] = [
  {
    id: 'stage-1',
    stageNumber: 1,
    titleTr: 'Selamlaşma & Tanışma',
    titleKz: 'Сәлемдесу және Танысу',
    icon: '👋',
    stars: 3,
    status: 'completed',
    totalTasks: 5,
    description: 'Temel selamlaşmalar, hal hatır sorma ve kendini tanıtma.',
    sentencePrompt: {
      kz: 'Сәлеметсіз бе! Менің атым Айдос.',
      tr: 'Merhaba! Benim adım Aydos.',
      audio: 'Сәлеметсіз бе! Менің атым Айдос.',
      wordBank: ['Merhaba!', 'adım', 'Benim', 'Aydos.', 'Nasılsınız', 'arkadaş'],
      correctOrder: ['Merhaba!', 'Benim', 'adım', 'Aydos.']
    }
  },
  {
    id: 'stage-2',
    stageNumber: 2,
    titleTr: 'Sayılar & Alışveriş',
    titleKz: 'Сандар мен Сауда',
    icon: '🔢',
    stars: 2,
    status: 'active',
    totalTasks: 6,
    description: '1-100 arası sayılar, fiyat sorma ve pazar alışverişi.',
    sentencePrompt: {
      kz: 'Бұл кітап қанша тұрады?',
      tr: 'Bu kitap ne kadar?',
      audio: 'Бұл кітап қанша тұрады?',
      wordBank: ['Bu', 'kitap', 'ne', 'kadar?', 'fiyat', 'almak'],
      correctOrder: ['Bu', 'kitap', 'ne', 'kadar?']
    }
  },
  {
    id: 'stage-chest-1',
    stageNumber: 2.5,
    titleTr: '🎁 Hazine Sandığı (Kelime Oyunu)',
    titleKz: '🎁 Қазына сандығы',
    icon: '🎁',
    stars: 0,
    status: 'active',
    totalTasks: 1,
    description: 'Hızlı kelime eşleştirme görevi ve 50 bonus XP!',
    sentencePrompt: {
      kz: 'Достық — өмірдегі ең үлкен байлық.',
      tr: 'Dostluk hayattaki en büyük zenginliktir.',
      audio: 'Достық — өмірдегі ең үлкен байлық.',
      wordBank: ['Dostluk', 'hayattaki', 'en', 'büyük', 'zenginliktir.', 'güzel'],
      correctOrder: ['Dostluk', 'hayattaki', 'en', 'büyük', 'zenginliktir.']
    }
  },
  {
    id: 'stage-3',
    stageNumber: 3,
    titleTr: 'Aile & Akrabalık',
    titleKz: 'Отбасы мен Туыстар',
    icon: '👨‍👩‍👧‍👦',
    stars: 1,
    status: 'active',
    totalTasks: 5,
    description: 'Anne, baba, kardeşler ve Kazak akrabalık terimleri.',
    sentencePrompt: {
      kz: 'Менің үлкен отбасым бар.',
      tr: 'Benim büyük bir ailem var.',
      audio: 'Менің үлкен отбасым бар.',
      wordBank: ['Benim', 'büyük', 'bir', 'ailem', 'var.', 'küçük'],
      correctOrder: ['Benim', 'büyük', 'bir', 'ailem', 'var.']
    }
  },
  {
    id: 'stage-4',
    stageNumber: 4,
    titleTr: 'Kazak Mutfağı & Sofra',
    titleKz: 'Қазақ Асханасы мен Дастарқан',
    icon: '🍲',
    stars: 0,
    status: 'locked',
    totalTasks: 6,
    description: 'Beşbarmak, kımız, baursak ve sofra adabı.',
    sentencePrompt: {
      kz: 'Дастарқан басына қош келдіңіз!',
      tr: 'Sofraya hoş geldiniz!',
      audio: 'Дастарқан басына қош келдіңіз!',
      wordBank: ['Sofraya', 'hoş', 'geldiniz!', 'afiyet', 'olsun'],
      correctOrder: ['Sofraya', 'hoş', 'geldiniz!']
    }
  },
  {
    id: 'stage-5',
    stageNumber: 5,
    titleTr: 'Şehir, Ulaşım & Gezi',
    titleKz: 'Қала мен Саяхат',
    icon: '🏙️',
    stars: 0,
    status: 'locked',
    totalTasks: 6,
    description: 'Almatı, Astana seyahati, otobüs ve yön sorma.',
    sentencePrompt: {
      kz: 'Вокзалға қалай баруға болады?',
      tr: 'Gara nasıl gidebilirim?',
      audio: 'Вокзалға қалай баруға болады?',
      wordBank: ['Gara', 'nasıl', 'gidebilirim?', 'otobüs', 'nerede'],
      correctOrder: ['Gara', 'nasıl', 'gidebilirim?']
    }
  },
  {
    id: 'stage-6',
    stageNumber: 6,
    titleTr: 'Zaman, Saat & Günler',
    titleKz: 'Уақыт пен Мезгіл',
    icon: '⏰',
    stars: 0,
    status: 'locked',
    totalTasks: 5,
    description: 'Haftanın günleri, aylar, saat sorma ve randevular.',
    sentencePrompt: {
      kz: 'Қазір сағат неше болды?',
      tr: 'Şu an saat kaç oldu?',
      audio: 'Қазір сағат неше болды?',
      wordBank: ['Şu', 'an', 'saat', 'kaç', 'oldu?', 'erken'],
      correctOrder: ['Şu', 'an', 'saat', 'kaç', 'oldu?']
    }
  },
  {
    id: 'stage-7',
    stageNumber: 7,
    titleTr: 'Bozkır Kültürü & Edebiyat',
    titleKz: 'Дала Мәдениеті мен Әдебиет',
    icon: '🐎',
    stars: 0,
    status: 'locked',
    totalTasks: 8,
    description: 'Abay, atlı göçebeler ve Kıpçak destanları.',
    sentencePrompt: {
      kz: 'Абайдың сөзі — халықтың көзі.',
      tr: 'Abay\'ın sözü halkın gözüdür.',
      audio: 'Абайдың сөзі — халықтың көзі.',
      wordBank: ['Abay\'ın', 'sözü', 'halkın', 'gözüdür.', 'yoludur'],
      correctOrder: ['Abay\'ın', 'sözü', 'halkın', 'gözüdür.']
    }
  }
];

export const StageQuestMapView: React.FC<StageQuestMapViewProps> = ({
  user,
  units,
  onSelectLesson,
  onOpenMatchGame,
  onNavigateTab,
  onEarnXp
}) => {
  const [stages, setStages] = useState<QuestStage[]>(DEFAULT_STAGES);
  const [selectedStage, setSelectedStage] = useState<QuestStage | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [lives, setLives] = useState(5);

  // Translation Game State (Matches Screen 1 in user's image)
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  // Chest Modal State
  const [isChestOpen, setIsChestOpen] = useState(false);
  const [chestClaimed, setChestClaimed] = useState(false);

  // Start Stage Quest
  const [energyError, setEnergyError] = useState<string | null>(null);

  const handleStageClick = (stage: QuestStage) => {
    if (stage.status === 'locked') {
      audioService.playFeedbackSound('wrong');
      return;
    }

    if (stage.id === 'stage-chest-1') {
      setIsChestOpen(true);
      audioService.playFeedbackSound('click');
      return;
    }

    setEnergyError(null);

    // Consume 10 energy for Stage Quest (Requirement 3)
    const energyRes = storageService.consumeEnergy(10);
    if (!energyRes.success) {
      setEnergyError(energyRes.error || 'Yetersiz enerji!');
      audioService.playFeedbackSound('wrong');
      return;
    }

    setSelectedStage(stage);
    setPlacedWords([]);
    setAvailableWords([...stage.sentencePrompt.wordBank]);
    setIsAnswerChecked(false);
    setIsAnswerCorrect(false);
    setIsGameActive(true);
    audioService.playFeedbackSound('click');
  };

  // Play sentence audio in translation modal
  const handlePlayPromptAudio = (text: string) => {
    audioService.playFeedbackSound('click');
    audioService.speak(text, 'kk', 0.85);
  };

  // Add word from word bank to placed slots
  const handleSelectWord = (word: string, index: number) => {
    if (isAnswerChecked) return;
    audioService.playFeedbackSound('click');
    setPlacedWords(prev => [...prev, word]);
    setAvailableWords(prev => prev.filter((_, i) => i !== index));
  };

  // Remove word from placed slots back to bank
  const handleRemoveWord = (word: string, index: number) => {
    if (isAnswerChecked) return;
    audioService.playFeedbackSound('click');
    setPlacedWords(prev => prev.filter((_, i) => i !== index));
    setAvailableWords(prev => [...prev, word]);
  };

  // Check Answer (Big purple Check button from Screen 1 in image)
  const handleCheckAnswer = () => {
    if (!selectedStage || placedWords.length === 0) return;

    const target = selectedStage.sentencePrompt.correctOrder.join(' ');
    const attempt = placedWords.join(' ');
    const correct = attempt.trim().toLowerCase() === target.trim().toLowerCase();

    setIsAnswerCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      audioService.playFeedbackSound('correct');
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
      onEarnXp(25);
    } else {
      audioService.playFeedbackSound('wrong');
      setLives(prev => Math.max(0, prev - 1));
    }
  };

  // Continue to next question or complete stage (only allowed when answer is correct!)
  const handleContinue = () => {
    if (isAnswerCorrect && selectedStage) {
      // Mark stage as completed and unlock next
      setStages(prev => prev.map(s => {
        if (s.id === selectedStage.id) {
          return { ...s, status: 'completed', stars: 3 };
        }
        if (s.stageNumber === selectedStage.stageNumber + 1) {
          return { ...s, status: 'active' };
        }
        return s;
      }));
    }

    setIsGameActive(false);
    setSelectedStage(null);
  };

  // Requirement 2: Strict error detection! Student CANNOT pass until correct.
  // Resets words and gives them another attempt on the current question.
  const handleRetry = () => {
    if (!selectedStage) return;
    setPlacedWords([]);
    setAvailableWords([...selectedStage.sentencePrompt.wordBank]);
    setIsAnswerChecked(false);
    setIsAnswerCorrect(false);
    audioService.playFeedbackSound('click');
  };

  // Open Chest reward
  const handleClaimChest = () => {
    audioService.playFeedbackSound('complete');
    confetti({ particleCount: 100, spread: 80 });
    onEarnXp(50);
    setChestClaimed(true);
    setTimeout(() => {
      setIsChestOpen(false);
      onOpenMatchGame();
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-full pb-14">
      
      {/* Top Bar with Hearts, XP and Streak (Matches Lingua aesthetic) */}
      <div className="bg-white/95 backdrop-blur-md border-b border-violet-100 px-4 py-2.5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        
        {/* Streak */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-xs font-black text-amber-900">{user.streakDays}</span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-violet-50 rounded-full border border-violet-200">
          <Trophy className="w-4 h-4 text-violet-600" />
          <span className="text-xs font-black text-violet-900">{user.xpPoints} XP</span>
        </div>

        {/* Lives / Hearts */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 rounded-full border border-rose-200">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span className="text-xs font-black text-rose-900">{lives}</span>
        </div>
      </div>

      {/* Hero Banner for Stage Learning Path */}
      <div className="px-5 pt-4 pb-2">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-4 text-white shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-violet-200 bg-white/20 px-2.5 py-0.5 rounded-full">
              KAZAKÇA ETAP YOLU
            </span>
            <h2 className="text-base font-black text-white mt-1 leading-tight">
              Etap Etap Görevler & Oyunlar
            </h2>
            <p className="text-[11px] text-violet-100 mt-0.5">
              Etapları tamamla, yıldızları topla ve yeni bölümlerin kilidini aç!
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
            🗺️
          </div>
        </div>
      </div>

      {/* Gamified Winding Roadmap (Matches Screen 3 in user's image) */}
      <div className="flex-1 px-4 py-4 max-w-md mx-auto w-full relative">
        
        {/* Stages Stepped Path */}
        <div className="space-y-6 relative py-4">
          {stages.map((stage, idx) => {
            const isLeft = idx % 2 === 1;
            const isCompleted = stage.status === 'completed';
            const isActive = stage.status === 'active';
            const isLocked = stage.status === 'locked';
            const isChest = stage.id.includes('chest');

            return (
              <div 
                key={stage.id} 
                className={`flex flex-col items-center transition relative ${
                  isLeft ? '-translate-x-6' : 'translate-x-6'
                }`}
              >
                {/* Node Button */}
                <div className="relative group">
                  {/* Pulsing ring for active current stage */}
                  {isActive && (
                    <div className="absolute -inset-2 rounded-full bg-violet-500/25 animate-ping duration-1000" />
                  )}

                  <button
                    onClick={() => handleStageClick(stage)}
                    disabled={isLocked}
                    className={`relative z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all shadow-lg active:scale-95 ${
                      isCompleted 
                        ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/30' 
                        : isActive
                        ? isChest
                          ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-white shadow-amber-500/30 ring-4 ring-amber-200 animate-bounce'
                          : 'bg-gradient-to-tr from-violet-600 to-purple-500 text-white shadow-violet-600/30 ring-4 ring-violet-200'
                        : 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed border-2 border-slate-300'
                    }`}
                  >
                    {isLocked ? (
                      <Lock className="w-7 h-7 text-slate-400" />
                    ) : isCompleted ? (
                      <Check className="w-8 h-8 stroke-[3]" />
                    ) : (
                      <span className="text-2xl">{stage.icon}</span>
                    )}

                    {/* Stage number pill */}
                    {!isChest && (
                      <span className={`text-[10px] font-black mt-0.5 ${
                        isLocked ? 'text-slate-400' : 'text-white'
                      }`}>
                        Etap {stage.stageNumber}
                      </span>
                    )}
                  </button>

                  {/* Stars Pill underneath */}
                  {!isLocked && !isChest && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-white px-2 py-0.5 rounded-full shadow-xs border border-slate-200 z-10">
                      {[1, 2, 3].map((starIdx) => (
                        <Star 
                          key={starIdx} 
                          className={`w-3 h-3 ${
                            starIdx <= stage.stars 
                              ? 'text-amber-400 fill-amber-400' 
                              : 'text-slate-200'
                          }`} 
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Stage Label */}
                <div className="text-center mt-3 max-w-[170px]">
                  <h4 className={`text-xs font-black leading-tight ${
                    isLocked ? 'text-slate-400' : 'text-slate-900'
                  }`}>
                    {stage.titleTr}
                  </h4>
                  <p className={`text-[10px] font-semibold mt-0.5 truncate ${
                    isLocked ? 'text-slate-400' : 'text-violet-600'
                  }`}>
                    {stage.titleKz}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* ======================================================== */}
      {/* SCREEN 1 INTERACTIVE MODAL: "Translate this sentence" */}
      {/* ======================================================== */}
      {isGameActive && selectedStage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
            
            {/* Modal Top Bar (Matches Screen 1 in user's image) */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setIsGameActive(false)}
                className="p-1 rounded-xl text-slate-500 hover:bg-slate-100 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="text-center">
                <span className="text-[10px] font-black uppercase text-violet-600 tracking-wider">
                  Etap {selectedStage.stageNumber} Görevi
                </span>
                <h3 className="text-xs font-black text-slate-900">
                  {selectedStage.titleTr}
                </h3>
              </div>

              <div className="flex items-center gap-1 text-rose-500 font-bold text-xs">
                <Heart className="w-4 h-4 fill-rose-500" />
                <span>{lives}</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              
              {/* Task Title */}
              <h2 className="text-sm font-black text-slate-800">
                Bu cümleyi Türkçeye çevirin:
              </h2>

              {/* Character Avatar with Speech Bubble (Matches Screen 1 in image) */}
              <div className="flex items-start gap-3">
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover border-2 border-violet-500 shadow-sm shrink-0"
                />

                {/* Speech Bubble with Kazakh audio button */}
                <div className="bg-violet-50 border border-violet-200 rounded-2xl rounded-tl-none p-3 shadow-xs flex-1 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-black text-slate-900">
                      {selectedStage.sentencePrompt.kz}
                    </p>
                    <p className="text-[10px] text-violet-600 font-medium">
                      Kazakça sesli okunuş için hoparlöre dokunun
                    </p>
                  </div>
                  <button
                    onClick={() => handlePlayPromptAudio(selectedStage.sentencePrompt.kz)}
                    className="p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-xs transition shrink-0 ml-2"
                    title="Sesli Dinle"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Answer Slot Area (where placed words appear) */}
              <div className="min-h-[70px] p-3 rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/30 flex flex-wrap gap-2 items-center">
                {placedWords.length === 0 ? (
                  <span className="text-xs text-slate-400 italic font-medium w-full text-center">
                    Aşağıdaki kelimelere dokunarak cümleyi oluşturun...
                  </span>
                ) : (
                  placedWords.map((word, index) => (
                    <button
                      key={index}
                      onClick={() => handleRemoveWord(word, index)}
                      className="px-3 py-1.5 bg-violet-600 hover:bg-rose-500 text-white text-xs font-black rounded-xl shadow-sm transition hover:scale-95"
                      title="Geri Çıkar"
                    >
                      {word}
                    </button>
                  ))
                )}
              </div>

              {/* Word Bank Chips (Matches Screen 1 in user's image) */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 block mb-2">
                  Kelime Havuzu:
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableWords.map((word, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectWord(word, index)}
                      className="px-3.5 py-2 bg-white hover:bg-violet-50 text-slate-800 border-2 border-slate-200 hover:border-violet-400 text-xs font-extrabold rounded-2xl shadow-xs transition active:scale-95"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Action / Feedback Drawer (Matches Screen 1 in user's image) */}
            <div className={`p-4 border-t transition-all ${
              isAnswerChecked 
                ? isAnswerCorrect 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : 'bg-rose-50 border-rose-200'
                : 'bg-white border-slate-100'
            }`}>
              {isAnswerChecked ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {isAnswerCorrect ? (
                      <div className="p-1.5 bg-emerald-500 text-white rounded-full">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="p-1.5 bg-rose-500 text-white rounded-full">
                        <X className="w-5 h-5 stroke-[3]" />
                      </div>
                    )}
                    <div>
                      <h4 className={`text-sm font-black ${
                        isAnswerCorrect ? 'text-emerald-900' : 'text-rose-900'
                      }`}>
                        {isAnswerCorrect ? 'HARİKA! DOĞRU CEVAP' : 'HATA TESPİT EDİLDİ (DOĞRU YAPILANA KADAR GEÇİLEMEZ)'}
                      </h4>
                      <p className="text-[11px] font-medium text-slate-700">
                        {isAnswerCorrect 
                          ? `Doğru sıralama: ${selectedStage.sentencePrompt.correctOrder.join(' ')}`
                          : 'Cümle sıralaması hatalı. Kural gereği doğru sıralayana kadar sonraki aşamaya geçemezsiniz. Lütfen tekrar deneyin.'}
                      </p>
                    </div>
                  </div>

                  {isAnswerCorrect ? (
                    <button
                      onClick={handleContinue}
                      className="w-full py-3.5 rounded-2xl text-xs font-black text-white shadow-md transition active:scale-98 bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>DOĞRU! ETABI TAMAMLA & DEVAM ET →</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleRetry}
                      className="w-full py-3.5 rounded-2xl text-xs font-black text-white shadow-md transition active:scale-98 bg-rose-600 hover:bg-rose-700 flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                      <span>TEKRAR DENE (DOĞRU SIRALAYANA KADAR GEÇİLEMEZ)</span>
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleCheckAnswer}
                  disabled={placedWords.length === 0}
                  className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-2xl text-xs font-black shadow-md shadow-violet-600/25 transition active:scale-98"
                >
                  KONTROL ET (CHECK)
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Bonus Chest Modal */}
      {isChestOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-4xl mx-auto shadow-inner border border-amber-200 animate-bounce">
              🎁
            </div>

            <h3 className="text-base font-black text-slate-900">
              Hazine Sandığı Ödülü!
            </h3>
            <p className="text-xs text-slate-500">
              Bu etaptaki başarıların için 50 bonus XP ve hızlı eşleştirme oyunu kazandın.
            </p>

            <button
              onClick={handleClaimChest}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl text-xs shadow-md transition"
            >
              Sandığı Aç & +50 XP Al!
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
