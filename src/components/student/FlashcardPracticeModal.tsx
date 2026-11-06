import React, { useState, useEffect } from 'react';
import { 
  X, 
  RotateCw, 
  Volume2, 
  Check, 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  ArrowLeft, 
  Shuffle, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  Flame, 
  AlertCircle,
  Eye,
  EyeOff,
  Layers,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VocabItem, LanguageDirection } from '../../types';
import { audioService } from '../../services/audioService';

interface FlashcardPracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  vocabulary: VocabItem[];
  lessonTitle?: string;
  userDirection?: LanguageDirection;
  onEarnXp?: (xp: number) => void;
  onToggleMastery?: (wordId: string, mastered: boolean) => void;
}

type PracticeMode = 'flip' | 'quiz';
type GuessDirection = 'KZ_TO_TR' | 'TR_TO_KZ';

export const FlashcardPracticeModal: React.FC<FlashcardPracticeModalProps> = ({
  isOpen,
  onClose,
  vocabulary,
  lessonTitle = 'Kelime Bilgi Kartları',
  userDirection = 'TR_TO_KZ',
  onEarnXp,
  onToggleMastery
}) => {
  // Deck state
  const [deck, setDeck] = useState<VocabItem[]>(() => (vocabulary && vocabulary.length > 0 ? [...vocabulary] : []));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [useLatin, setUseLatin] = useState(false);
  const [guessDirection, setGuessDirection] = useState<GuessDirection>(
    userDirection === 'KZ_TO_TR' ? 'TR_TO_KZ' : 'KZ_TO_TR'
  );
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('flip');
  const [showHint, setShowHint] = useState(false);

  // Quiz Mode states
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  // Session Results tracking
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [reviewIds, setReviewIds] = useState<Set<string>>(new Set());
  const [isFinished, setIsFinished] = useState(false);
  const [earnedSessionXp, setEarnedSessionXp] = useState(0);

  // Initialize deck on open or vocab change
  useEffect(() => {
    if (isOpen && vocabulary.length > 0) {
      setDeck([...vocabulary]);
      setCurrentIndex(0);
      setIsFlipped(false);
      setShowHint(false);
      setIsFinished(false);
      setMasteredIds(new Set());
      setReviewIds(new Set());
      setEarnedSessionXp(0);
    }
  }, [isOpen, vocabulary]);

  const currentWord = deck[currentIndex];

  // Generate 4 multiple-choice options for quiz mode
  useEffect(() => {
    if (!currentWord || practiceMode !== 'quiz') return;

    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);

    const correctAnswer = guessDirection === 'KZ_TO_TR' 
      ? currentWord.turkish 
      : currentWord.kazakhCyrillic;

    // Distractors from other words in vocabulary or initial pool
    const otherOptions = vocabulary
      .filter(v => v.id !== currentWord.id)
      .map(v => guessDirection === 'KZ_TO_TR' ? v.turkish : v.kazakhCyrillic);

    // Shuffle and pick 3 distractors
    const shuffledDistractors = otherOptions
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Combine and shuffle all 4 options
    const combined = [correctAnswer, ...shuffledDistractors].sort(() => Math.random() - 0.5);
    setQuizOptions(combined);
  }, [currentWord, practiceMode, guessDirection, vocabulary]);

  if (!isOpen || deck.length === 0) return null;

  // Handle Play Kazakh Audio
  const handlePlayAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentWord) return;
    audioService.speakWord(currentWord.kazakhCyrillic, 'kk');
  };

  // Flip card
  const handleFlipCard = () => {
    const nextState = !isFlipped;
    setIsFlipped(nextState);
    audioService.playFeedbackSound('click');
    if (nextState) {
      handlePlayAudio();
    }
  };

  // Mark word as Known / Mastered
  const handleMarkMastered = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentWord) return;

    const nextMastered = new Set(masteredIds);
    nextMastered.add(currentWord.id);
    setMasteredIds(nextMastered);

    if (onToggleMastery) {
      onToggleMastery(currentWord.id, true);
    }

    audioService.playFeedbackSound('correct');
    advanceToNextCard();
  };

  // Mark word as Needs Review
  const handleMarkReview = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentWord) return;

    const nextReview = new Set(reviewIds);
    nextReview.add(currentWord.id);
    setReviewIds(nextReview);

    audioService.playFeedbackSound('wrong');
    advanceToNextCard();
  };

  // Handle Quiz Option Select
  const handleSelectQuizOption = (option: string) => {
    if (isQuizSubmitted || !currentWord) return;
    setSelectedQuizOption(option);
    setIsQuizSubmitted(true);

    const correctAnswer = guessDirection === 'KZ_TO_TR' ? currentWord.turkish : currentWord.kazakhCyrillic;
    const isCorrect = option === correctAnswer;

    if (isCorrect) {
      audioService.playFeedbackSound('correct');
      const nextMastered = new Set(masteredIds);
      nextMastered.add(currentWord.id);
      setMasteredIds(nextMastered);
      if (onToggleMastery) onToggleMastery(currentWord.id, true);
    } else {
      audioService.playFeedbackSound('wrong');
      const nextReview = new Set(reviewIds);
      nextReview.add(currentWord.id);
      setReviewIds(nextReview);
    }

    // Auto flip card after a brief moment to show details
    setTimeout(() => {
      setIsFlipped(true);
      handlePlayAudio();
    }, 600);
  };

  // Advance to next card or finish deck
  const advanceToNextCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);

    if (currentIndex + 1 < deck.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed the deck!
      const totalEarned = 25;
      setEarnedSessionXp(totalEarned);
      if (onEarnXp) {
        onEarnXp(totalEarned);
      }
      setIsFinished(true);
      audioService.playFeedbackSound('complete');
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  // Restart deck
  const handleRestartDeck = (onlyMissed = false) => {
    if (onlyMissed && reviewIds.size > 0) {
      const filtered = vocabulary.filter(v => reviewIds.has(v.id));
      setDeck(filtered);
    } else {
      setDeck([...vocabulary]);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setIsFinished(false);
    setMasteredIds(new Set());
    setReviewIds(new Set());
  };

  // Shuffle deck
  const handleShuffleDeck = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    audioService.playFeedbackSound('click');
  };

  const progressPercent = Math.round(((currentIndex + 1) / deck.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-4 sm:p-6 text-slate-900 shadow-2xl relative my-auto flex flex-col min-h-[540px]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-100 text-teal-800 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                {lessonTitle}
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">
                Kelimelerin Türkçe - Kazakça Karşılıklarını Tahmin Et
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShuffleDeck}
              className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition"
              title="Kartları Karıştır"
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Deck Completed Result Screen */}
        {isFinished ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-4 animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-400 text-white flex items-center justify-center text-4xl shadow-xl ring-4 ring-amber-300/40">
              🏆
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 inline-block">
                Tebrikler • Жетістік!
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Flaş Kart Destesi Tamamlandı!
              </h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Tüm kelimeleri gözden geçirdiniz ve hafızanızı pekiştirdiniz.
              </p>
            </div>

            {/* Score Stats */}
            <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-bold block">Toplam</span>
                <span className="text-base font-black text-slate-800">{deck.length}</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-[10px] text-emerald-700 font-bold block">Ezberlenen</span>
                <span className="text-base font-black text-emerald-700">{masteredIds.size}</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                <span className="text-[10px] text-amber-700 font-bold block">Tekrar</span>
                <span className="text-base font-black text-amber-700">{reviewIds.size}</span>
              </div>
            </div>

            {/* Earned XP Reward */}
            <div className="p-3 bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-2xl w-full max-w-sm flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-300" />
                <span className="text-xs font-bold">Kazanılan Tecrübe</span>
              </div>
              <span className="text-sm font-black text-amber-300">+{earnedSessionXp} XP</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full max-w-sm pt-2">
              {reviewIds.size > 0 && (
                <button
                  onClick={() => handleRestartDeck(true)}
                  className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs transition"
                >
                  Tekrar Edilecekleri Çalış ({reviewIds.size})
                </button>
              )}
              <button
                onClick={() => handleRestartDeck(false)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
              >
                Tümünü Yeniden Çöz
              </button>
              <button
                onClick={onClose}
                className="py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow-md transition"
              >
                Dersi Tamamla
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Mode & Direction Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 bg-slate-50 p-2 rounded-2xl border border-slate-100 text-xs">
              {/* Direction Toggle */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setGuessDirection('KZ_TO_TR')}
                  className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1 ${
                    guessDirection === 'KZ_TO_TR'
                      ? 'bg-teal-600 text-white shadow-2xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🇰🇿 → 🇹🇷</span>
                  <span className="hidden sm:inline">Kazakça Sor</span>
                </button>
                <button
                  onClick={() => setGuessDirection('TR_TO_KZ')}
                  className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1 ${
                    guessDirection === 'TR_TO_KZ'
                      ? 'bg-teal-600 text-white shadow-2xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🇹🇷 → 🇰🇿</span>
                  <span className="hidden sm:inline">Türkçe Sor</span>
                </button>
              </div>

              {/* Mode Toggle: 3D Flip vs Quiz */}
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-slate-200 shadow-2xs">
                <button
                  onClick={() => {
                    setPracticeMode('flip');
                    setIsFlipped(false);
                  }}
                  className={`px-2 py-1 rounded-lg font-bold text-[11px] transition ${
                    practiceMode === 'flip'
                      ? 'bg-teal-100 text-teal-800 font-black'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Kartı Çevir
                </button>
                <button
                  onClick={() => {
                    setPracticeMode('quiz');
                    setIsFlipped(false);
                  }}
                  className={`px-2 py-1 rounded-lg font-bold text-[11px] transition ${
                    practiceMode === 'quiz'
                      ? 'bg-teal-100 text-teal-800 font-black'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  4 Şıklı Test
                </button>
              </div>
            </div>

            {/* Progress Bar & Counter */}
            <div className="space-y-1 mb-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>
                  Kelime {currentIndex + 1} / {deck.length}
                </span>
                <span className="text-teal-700 font-black">
                  %{progressPercent}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* THE MAIN INTERACTIVE FLASHCARD */}
            <div 
              onClick={() => {
                if (practiceMode === 'flip') {
                  handleFlipCard();
                }
              }}
              className={`flex-1 rounded-3xl p-5 sm:p-6 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between border-2 select-none shadow-md ${
                isFlipped
                  ? 'bg-gradient-to-br from-teal-50 via-white to-cyan-50/50 border-teal-300 shadow-teal-100'
                  : 'bg-gradient-to-br from-white via-slate-50 to-slate-100 border-slate-200/90 hover:border-teal-300'
              }`}
              style={{ minHeight: '280px' }}
            >
              {/* Card Top Strip: Category & Direction Badge */}
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200/80">
                  {currentWord?.category || 'Genel Kelime'}
                </span>

                <div className="flex items-center gap-2">
                  {/* Cyrillic / Latin toggle if Kazakh is shown */}
                  {(guessDirection === 'KZ_TO_TR' || isFlipped) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUseLatin(!useLatin);
                      }}
                      className="text-[9px] font-bold bg-white border border-slate-200 px-2 py-0.5 rounded-md hover:bg-slate-50 text-slate-600 transition"
                      title="Kiril / Latin Yazımını Değiştir"
                    >
                      {useLatin ? 'Latin' : 'Kiril'}
                    </button>
                  )}

                  {/* Audio Speaker */}
                  <button
                    onClick={handlePlayAudio}
                    className="p-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition active:scale-95"
                    title="Kazakça Telaffuzu Dinle"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CARD FRONT: GUESSING PROMPT */}
              {!isFlipped ? (
                <div className="my-auto text-center py-4 space-y-2">
                  <div className="text-[11px] font-bold text-teal-700 uppercase tracking-wider flex items-center justify-center gap-1">
                    <span>{guessDirection === 'KZ_TO_TR' ? '🇰🇿 KAZAKÇA KELİME' : '🇹🇷 TÜRKÇE KELİME'}</span>
                  </div>

                  {/* The Word */}
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {guessDirection === 'KZ_TO_TR'
                      ? (useLatin ? currentWord?.kazakhLatin : currentWord?.kazakhCyrillic)
                      : currentWord?.turkish
                    }
                  </h2>

                  {/* Subtitle / Phonetic helper */}
                  {guessDirection === 'KZ_TO_TR' && (
                    <p className="text-xs font-mono text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md inline-block">
                      [{currentWord?.phoneticGuide}]
                    </p>
                  )}

                  {/* Hint Toggle */}
                  <div className="pt-2">
                    {showHint ? (
                      <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 animate-in fade-in max-w-xs mx-auto">
                        <span className="font-bold">İpucu: </span>
                        {guessDirection === 'KZ_TO_TR' 
                          ? `İlk harf: "${currentWord?.turkish.charAt(0)}...", Kelime türü: ${currentWord?.partOfSpeech}`
                          : `İlk harf: "${currentWord?.kazakhCyrillic.charAt(0)}...", [${currentWord?.phoneticGuide}]`
                        }
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHint(true);
                        }}
                        className="text-[11px] font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>İpucu Göster</span>
                      </button>
                    )}
                  </div>

                  {practiceMode === 'flip' && (
                    <p className="text-[11px] text-slate-400 font-medium pt-2">
                      Çevirip anlamını görmek için karta dokunun 👆
                    </p>
                  )}
                </div>
              ) : (
                /* CARD BACK: REVEALED MEANING & FULL CONTEXT */
                <div className="my-auto text-center py-3 space-y-3 animate-in fade-in duration-200">
                  <div className="text-[10px] font-black text-emerald-700 uppercase tracking-wider bg-emerald-100/80 px-2.5 py-0.5 rounded-full inline-block">
                    ✓ KARŞILIĞI VE ANLAMI
                  </div>

                  {/* Answer Word */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {guessDirection === 'KZ_TO_TR'
                        ? currentWord?.turkish
                        : (useLatin ? currentWord?.kazakhLatin : currentWord?.kazakhCyrillic)
                      }
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {guessDirection === 'KZ_TO_TR'
                        ? (useLatin ? currentWord?.kazakhLatin : currentWord?.kazakhCyrillic)
                        : currentWord?.turkish
                      }
                    </p>
                  </div>

                  {/* Example Sentences */}
                  <div className="bg-white/80 p-3 rounded-2xl border border-teal-100 text-left text-xs space-y-1 shadow-2xs">
                    <div className="font-bold text-teal-950 flex items-center gap-1.5">
                      <span>🇰🇿</span>
                      <span>{currentWord?.exampleKazakh}</span>
                    </div>
                    <div className="font-medium text-slate-600 flex items-center gap-1.5 pl-5">
                      <span>🇹🇷</span>
                      <span>{currentWord?.exampleTurkish}</span>
                    </div>
                  </div>

                  {/* False Friend Warning */}
                  {currentWord?.falseFriendWarning && (
                    <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-[10px] text-amber-900 flex items-center gap-1.5 text-left">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{currentWord.falseFriendWarning}</span>
                    </div>
                  )}
                </div>
              )}

              {/* CARD FOOTER & QUIZ OPTIONS */}
              {practiceMode === 'quiz' && !isFlipped ? (
                <div className="grid grid-cols-2 gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                  {quizOptions.map((opt, idx) => {
                    let btnStyle = 'bg-white hover:bg-teal-50 border-slate-200 text-slate-800';
                    if (isQuizSubmitted) {
                      const correctAnswer = guessDirection === 'KZ_TO_TR' ? currentWord?.turkish : currentWord?.kazakhCyrillic;
                      if (opt === correctAnswer) {
                        btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-black';
                      } else if (opt === selectedQuizOption) {
                        btnStyle = 'bg-rose-600 text-white border-rose-600 font-black';
                      } else {
                        btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectQuizOption(opt)}
                        disabled={isQuizSubmitted}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition text-left truncate shadow-2xs ${btnStyle}`}
                      >
                        <span className="opacity-70 mr-1.5">{String.fromCharCode(65 + idx)})</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {/* Flip Button Prompt when not flipped in flip mode */}
              {practiceMode === 'flip' && !isFlipped && (
                <button
                  onClick={handleFlipCard}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 mt-2"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Cevabı Göster (Kartı Çevir)</span>
                </button>
              )}

              {/* Self-Rating Buttons when flipped */}
              {isFlipped && (
                <div className="grid grid-cols-2 gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={handleMarkReview}
                    className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Öğreniyorum (Tekrar Et)</span>
                  </button>

                  <button
                    onClick={handleMarkMastered}
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Biliyorum (Ezberledim)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Deck Summary Counter */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 px-1">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <Check className="w-3.5 h-3.5" />
                  <span>{masteredIds.size} Ezberlendi</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-700 font-bold">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{reviewIds.size} Tekrar</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (currentIndex > 0) {
                      setCurrentIndex(prev => prev - 1);
                      setIsFlipped(false);
                    }
                  }}
                  disabled={currentIndex === 0}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 disabled:opacity-30 transition"
                  title="Önceki Kart"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => advanceToNextCard()}
                  className="p-1.5 rounded-lg text-teal-700 hover:bg-teal-50 font-bold flex items-center gap-1 transition"
                  title="Sonraki Kart"
                >
                  <span className="text-[11px]">Sonraki</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
