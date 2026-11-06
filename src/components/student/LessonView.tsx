import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Mic, 
  MicOff, 
  Award, 
  BookOpen, 
  Headphones, 
  FileText, 
  Sparkles,
  AlertCircle,
  Check,
  ChevronRight,
  Activity,
  HardDrive,
  WifiOff,
  Layers,
  Eye,
  EyeOff,
  RotateCw,
  Search,
  X,
  Volume1,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson, Unit, UserProfile, VocabItem, ExerciseItem } from '../../types';
import { 
  audioService, 
  KAZAKH_PHONETIC_ATLAS, 
  ALL_42_KAZAKH_LETTERS, 
  VOICE_PROFILES, 
  VoicePersona 
} from '../../services/audioService';
import { storageService } from '../../services/storageService';
import { offlineCacheService } from '../../services/offlineCacheService';
import { PhoneticMouthVisual } from '../common/PhoneticMouthVisual';
import { LETTER_MOUTH_MAP } from './KazakhAlphabetVoiceGuide';
import { AlageyikMascot } from '../common/AlageyikMascot';
import { NaturalVoiceGuideModal } from '../common/NaturalVoiceGuideModal';
import { FlashcardPracticeModal } from './FlashcardPracticeModal';

export interface LessonExerciseProgressBarProps {
  total: number;
  currentIndex: number;
  isAnswerSubmitted: boolean;
  isAnswerCorrect: boolean;
  quizScore: number;
  totalPoints: number;
  isTr: boolean;
}

export const LessonExerciseProgressBar: React.FC<LessonExerciseProgressBarProps> = ({
  total,
  currentIndex,
  isAnswerSubmitted,
  isAnswerCorrect,
  quizScore,
  totalPoints,
  isTr
}) => {
  const completedCount = currentIndex + (isAnswerSubmitted && isAnswerCorrect ? 1 : 0);
  const percent = total > 0 ? Math.min(100, Math.round((completedCount / total) * 100)) : 0;

  return (
    <div className="bg-slate-50/95 border border-slate-200/90 rounded-2xl p-3.5 mb-4 shadow-2xs space-y-2.5">
      {/* Top Meta Row */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span>
              {isTr 
                ? `Alıştırma ${currentIndex + 1} / ${total}` 
                : `Жаттығу ${currentIndex + 1} / ${total}`
              }
            </span>
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-100 text-teal-800">
            %{percent} {isTr ? 'Tamamlandı' : 'Аяқталды'}
          </span>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-black text-xs shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>{quizScore} XP</span>
        </div>
      </div>

      {/* Main Dynamic Gradient Progress Bar */}
      <div className="w-full bg-slate-200/80 rounded-full h-3 p-0.5 overflow-hidden shadow-inner relative">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-500 via-emerald-500 to-amber-400 transition-all duration-500 ease-out shadow-xs relative"
          style={{ width: `${Math.max(4, percent)}%` }}
        >
          {/* Subtle light shimmer overlay */}
          <div className="absolute inset-0 bg-white/25 rounded-full animate-pulse pointer-events-none" />
        </div>
      </div>

      {/* Segmented Step Indicator Pills */}
      <div className="flex items-center justify-between gap-1 pt-0.5">
        {Array.from({ length: total }).map((_, idx) => {
          const isDone = idx < currentIndex || (idx === currentIndex && isAnswerSubmitted && isAnswerCorrect);
          const isCurrent = idx === currentIndex && !(isAnswerSubmitted && isAnswerCorrect);

          let pillClass = 'bg-slate-200 text-slate-400 border border-slate-300/60';
          if (isDone) {
            pillClass = 'bg-emerald-500 text-white border border-emerald-600 shadow-2xs scale-105';
          } else if (isCurrent) {
            pillClass = 'bg-teal-600 text-white ring-2 ring-teal-400 ring-offset-1 font-black shadow-xs';
          }

          return (
            <div
              key={idx}
              className={`flex-1 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${pillClass}`}
              title={isTr ? `Alıştırma ${idx + 1}` : `Жаттығу ${idx + 1}`}
            >
              {isDone ? (
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              ) : (
                <span>{idx + 1}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface LessonViewProps {
  unit: Unit;
  lesson: Lesson;
  user: UserProfile;
  onBack: () => void;
  onCompleteLesson: (lessonId: string, xpEarned: number) => void;
  onToggleMastery: (wordId: string, mastered: boolean) => void;
  onToggleFavorite?: (wordId: string) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  unit,
  lesson,
  user,
  onBack,
  onCompleteLesson,
  onToggleMastery,
  onToggleFavorite
}) => {
  const isTr = user.currentDirection === 'TR_TO_KZ';
  const isAlphabetLesson = unit.id === 'unit-a1-1' || lesson.id.includes('a1-1') || lesson.titleTr.toLowerCase().includes('harf') || lesson.titleTr.toLowerCase().includes('alfabe');
  const [activeTab, setActiveTab] = useState<'alphabet' | 'vocab' | 'dialogue' | 'grammar' | 'speaking' | 'quiz'>(
    isAlphabetLesson ? 'alphabet' : 'vocab'
  );

  // Lesson Overall Progress Tracking
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set([isAlphabetLesson ? 'alphabet' : 'vocab']));
  const [maxWordReached, setMaxWordReached] = useState<number>(1);
  const [hasPlayedDialogue, setHasPlayedDialogue] = useState<boolean>(false);

  useEffect(() => {
    setVisitedTabs(prev => new Set([...prev, activeTab]));
  }, [activeTab]);

  // Favorite Words State ('Favori Kelimelerim' / Zorlandığım Kelimeler)
  const [favoriteWordIds, setFavoriteWordIds] = useState<string[]>(user.favoriteWordIds || []);

  useEffect(() => {
    if (user.favoriteWordIds) {
      setFavoriteWordIds(user.favoriteWordIds);
    }
  }, [user.favoriteWordIds]);

  const handleToggleFavoriteWord = (wordId: string) => {
    const isFav = favoriteWordIds.includes(wordId);
    const updated = isFav 
      ? favoriteWordIds.filter(id => id !== wordId)
      : [...favoriteWordIds, wordId];
    setFavoriteWordIds(updated);
    audioService.playFeedbackSound('click');
    if (onToggleFavorite) {
      onToggleFavorite(wordId);
    } else {
      storageService.toggleFavoriteWord(wordId);
    }
  };

  const isWordFavorited = (wordId: string) => favoriteWordIds.includes(wordId);

  // Phonetic Alphabet & Mouth Shape Visual Studio State
  const [selectedLetter, setSelectedLetter] = useState<string>('Ә');
  const [alphabetViewMode, setAlphabetViewMode] = useState<'special9' | 'all42'>('special9');
  const [selectedPersona, setSelectedPersona] = useState<VoicePersona>(audioService.getKazakhPersona());
  const [isVoiceGuideOpen, setIsVoiceGuideOpen] = useState(false);

  // Audio Playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(0.9);
  const [activeSpeakingLine, setActiveSpeakingLine] = useState<number | null>(null);

  // Vocabulary Flashcards State
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [useLatinScript, setUseLatinScript] = useState(false);
  const [isLessonFlashcardsOpen, setIsLessonFlashcardsOpen] = useState(false);
  const [isMeaningRevealed, setIsMeaningRevealed] = useState(false);

  // Exercise / Quiz State
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  // Speaking Pronunciation State
  const [isListeningMicrophone, setIsListeningMicrophone] = useState(false);
  const [speechRecognizedText, setSpeechRecognizedText] = useState('');
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const [speechFeedbackText, setSpeechFeedbackText] = useState<string>('');

  const currentWord = lesson.vocabulary[currentWordIndex] || lesson.vocabulary[0];
  const currentExercise = lesson.exercises[currentExerciseIndex] || lesson.exercises[0];

  // Scramble / Shuffle Exercise options so correct answer is NEVER in predictable position
  useEffect(() => {
    if (currentExercise?.options) {
      const opts = [...currentExercise.options];
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
      }
      setShuffledOptions(opts);
    } else {
      setShuffledOptions([]);
    }
  }, [currentExerciseIndex, currentExercise, lesson.id]);

  // Play audio for a word
  const handlePlayWord = (word: VocabItem) => {
    audioService.playFeedbackSound('click');
    audioService.speak(word.kazakhCyrillic, 'kk', audioSpeed);
  };

  // Sesli Sözlük & Word Tap Pronunciation States
  const [isAudioDictOpen, setIsAudioDictOpen] = useState(false);
  const [audioDictSearch, setAudioDictSearch] = useState('');
  const [audioDictFilter, setAudioDictFilter] = useState<'lesson' | 'favorites' | 'all'>('lesson');
  const [clickedWordPopup, setClickedWordPopup] = useState<{
    word: string;
    wordId?: string;
    translation?: string;
    phonetic?: string;
    latin?: string;
    example?: string;
  } | null>(null);

  // Sesli Sözlük: Click any word to hear instant pronunciation & lookup translation
  const handleWordClick = (rawWord: string) => {
    const cleanWord = rawWord.replace(/[.,!?:;«»"'\(\)\[\]\{\}\/\\—–\-]/g, '').trim();
    if (!cleanWord || cleanWord.length < 1) return;

    // Instant vocal playback
    audioService.speak(cleanWord, 'kk', audioSpeed);

    // Look up matching vocabulary in current lesson first
    const lower = cleanWord.toLowerCase();
    const lessonMatch = lesson.vocabulary.find(v => 
      v.kazakhCyrillic.toLowerCase() === lower ||
      v.kazakhLatin.toLowerCase() === lower ||
      v.kazakhCyrillic.toLowerCase().includes(lower) ||
      lower.includes(v.kazakhCyrillic.toLowerCase())
    );

    const allVocab = storageService.getAllVocabulary();
    const globalMatch = !lessonMatch ? allVocab.find(v =>
      v.kazakhCyrillic.toLowerCase() === lower ||
      v.kazakhLatin.toLowerCase() === lower ||
      v.kazakhCyrillic.toLowerCase().includes(lower) ||
      lower.includes(v.kazakhCyrillic.toLowerCase())
    ) : null;

    const matched = lessonMatch || globalMatch;

    setClickedWordPopup({
      word: cleanWord,
      wordId: matched?.id,
      translation: matched ? matched.turkish : 'Kazakça kelime okunuşu',
      phonetic: matched?.phoneticGuide,
      latin: matched?.kazakhLatin,
      example: matched?.exampleKazakh
    });
  };

  // Helper to render interactive clickable text where each word can be clicked to vocalize
  const renderClickableKazakhText = (text: string, customClass: string = '') => {
    if (!text) return null;
    const tokens = text.split(/(\s+)/);
    return (
      <span className={customClass}>
        {tokens.map((token, i) => {
          if (/^\s+$/.test(token)) {
            return <span key={i}>{token}</span>;
          }
          const clean = token.replace(/[.,!?:;«»"'\(\)\[\]\{\}\/\\—–\-]/g, '').trim();
          const isSelected = clickedWordPopup?.word.toLowerCase() === clean.toLowerCase();
          return (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleWordClick(token);
              }}
              className={`inline-block rounded-md px-1 py-0.2 mx-0.5 transition cursor-pointer text-left font-inherit ${
                isSelected 
                  ? 'bg-amber-300 text-slate-950 font-black shadow-xs ring-2 ring-amber-400 scale-105' 
                  : 'hover:bg-teal-100 hover:text-teal-900 active:scale-95 text-slate-900 font-bold underline decoration-dotted decoration-teal-300 underline-offset-3'
              }`}
              title={`«${clean}» kelimesini seslendir ve sözlükte gör`}
            >
              {token}
            </button>
          );
        })}
      </span>
    );
  };

  // Play dialogue line
  const handlePlayDialogueLine = (text: string, index: number) => {
    setActiveSpeakingLine(index);
    setHasPlayedDialogue(true);
    audioService.speak(text, 'kk', audioSpeed).then(() => {
      setActiveSpeakingLine(null);
    });
  };

  const tabsList = isAlphabetLesson ? [
    { id: 'alphabet' as const, label: '1. Alfabe', icon: Activity },
    { id: 'vocab' as const, label: '2. Kelimeler', icon: BookOpen },
    { id: 'dialogue' as const, label: '3. Dinleme', icon: Headphones },
    { id: 'grammar' as const, label: '4. Gramer', icon: FileText },
    { id: 'speaking' as const, label: '5. Konuşma', icon: Mic },
    { id: 'quiz' as const, label: '6. Sınav', icon: Award }
  ] : [
    { id: 'vocab' as const, label: '1. Kelimeler', icon: BookOpen },
    { id: 'dialogue' as const, label: '2. Dinleme', icon: Headphones },
    { id: 'grammar' as const, label: '3. Gramer', icon: FileText },
    { id: 'speaking' as const, label: '4. Konuşma', icon: Mic },
    { id: 'quiz' as const, label: '5. Sınav', icon: Award }
  ];

  // Calculate composite lesson progress percentage (0 - 100%)
  const calculateLessonProgress = (): number => {
    if (quizFinished) return 100;

    const totalWords = Math.max(1, lesson.vocabulary.length);
    const totalExercises = Math.max(1, lesson.exercises.length);

    const vocabWeight = isAlphabetLesson ? 22 : 30;
    const alphabetWeight = isAlphabetLesson ? 15 : 0;
    const dialogueWeight = 18;
    const grammarWeight = 15;
    const speakingWeight = 12;
    const quizWeight = isAlphabetLesson ? 18 : 25;

    let score = 0;

    if (isAlphabetLesson && visitedTabs.has('alphabet')) {
      score += alphabetWeight;
    }

    const wordProgressRatio = Math.min(1, maxWordReached / totalWords);
    score += wordProgressRatio * vocabWeight;

    if (visitedTabs.has('dialogue')) {
      score += hasPlayedDialogue ? dialogueWeight : dialogueWeight * 0.6;
    }

    if (visitedTabs.has('grammar')) {
      score += grammarWeight;
    }

    if (visitedTabs.has('speaking')) {
      score += pronunciationScore !== null ? speakingWeight : speakingWeight * 0.6;
    }

    const quizAnsweredRatio = (currentExerciseIndex + (isAnswerSubmitted ? 1 : 0)) / totalExercises;
    score += quizAnsweredRatio * quizWeight;

    return Math.min(100, Math.max(6, Math.round(score)));
  };

  const lessonProgressPercent = calculateLessonProgress();

  // Check Quiz Answer
  const handleCheckAnswer = () => {
    if (!selectedOption || !currentExercise) return;

    let correct = false;
    if (Array.isArray(currentExercise.correctAnswer)) {
      correct = currentExercise.correctAnswer.join(' ') === selectedOption;
    } else {
      correct = selectedOption.trim().toLowerCase() === currentExercise.correctAnswer.trim().toLowerCase();
    }

    setIsAnswerCorrect(correct);
    setIsAnswerSubmitted(true);

    if (correct) {
      audioService.playFeedbackSound('correct');
      setQuizScore(prev => prev + (currentExercise.points || 10));
    } else {
      audioService.playFeedbackSound('wrong');
    }
  };

  // Next Question
  const handleNextExercise = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsAnswerCorrect(false);

    if (currentExerciseIndex + 1 < lesson.exercises.length) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
      audioService.playLessonCompleteSound();
      confetti({
        particleCount: 100,
        spread: 75,
        origin: { y: 0.6 }
      });
      const totalEarned = quizScore + 20;
      onCompleteLesson(lesson.id, totalEarned);
    }
  };

  // Speech Recognition Simulation / Web API for Speaking Tab
  // Speech Recognition & Strict Phonetic Pronunciation Analysis
  const handleToggleMicrophone = () => {
    if (isListeningMicrophone) {
      setIsListeningMicrophone(false);
      return;
    }

    setIsListeningMicrophone(true);
    setPronunciationScore(null);
    setSpeechFeedbackText('');

    const targetPhrase = lesson.vocabulary[0]?.kazakhCyrillic || 'Сәлеметсіз бе!';

    // Check if browser SpeechRecognition is available
    const SpeechRecognitionClass = 
      (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition || 
      (window as unknown as { webkitSpeechRecognition: unknown }).webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      try {
        const recognition = new (SpeechRecognitionClass as any)();
        recognition.lang = 'kk-KZ';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0]?.[0]?.transcript || '';
          setSpeechRecognizedText(transcript);
          
          const analysis = audioService.analyzePronunciation(transcript, targetPhrase);
          setPronunciationScore(analysis.overallScore);
          setSpeechFeedbackText(analysis.feedbackMessage);
          setIsListeningMicrophone(false);

          if (analysis.isPassed) {
            audioService.playFeedbackSound('correct');
          } else {
            audioService.playFeedbackSound('wrong');
          }
        };

        recognition.onerror = () => {
          setIsListeningMicrophone(false);
          const analysis = audioService.analyzePronunciation('', targetPhrase);
          setPronunciationScore(analysis.overallScore);
          setSpeechFeedbackText('Mikrofondan ses tespit edilemedi veya izin verilmedi. Lütfen mikrofona izin verip tekrar deneyin.');
          audioService.playFeedbackSound('wrong');
        };

        recognition.onend = () => {
          setIsListeningMicrophone(false);
        };

        recognition.start();
        return;
      } catch {
        // Fallback
      }
    }

    // High fidelity fallback for environments where microphone speech recognition isn't allowed
    setTimeout(() => {
      setIsListeningMicrophone(false);
      const analysis = audioService.analyzePronunciation('', targetPhrase);
      setPronunciationScore(analysis.overallScore);
      setSpeechFeedbackText('Tarayıcınız ses algılayamadı. Lütfen mikrofona izin verip cümlenin okunuşunu net şekilde seslendirin.');
      audioService.playFeedbackSound('wrong');
    }, 2500);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-full">
      
      {/* Top Header Bar */}
      <div className="bg-teal-700 text-white px-4 py-3 sticky top-0 z-20 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl hover:bg-white/10 active:bg-white/20 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-[10px] font-bold text-teal-200 uppercase tracking-wider">
              {unit.level} • {isTr ? unit.titleTr : unit.titleKz}
            </div>
            <h2 className="text-sm font-black leading-tight truncate max-w-[220px]">
              {isTr ? lesson.titleTr : lesson.titleKz}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sesli Sözlük Quick Access Button */}
          <button
            onClick={() => {
              setIsAudioDictOpen(true);
              audioService.playFeedbackSound('click');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-800 hover:bg-teal-900 active:scale-95 text-teal-100 hover:text-white border border-teal-500/60 text-xs font-bold transition shadow-xs cursor-pointer"
            title="Ders İçi Sesli Sözlüğü Aç (Kelimeleri dinleyin & arayın)"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Sesli Sözlük</span>
            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
              {lesson.vocabulary.length}
            </span>
          </button>

          {/* Speed Adjustment Pill */}
          <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-xl text-[11px] font-bold">
            <span className="text-teal-200">Hız:</span>
            <button
              onClick={() => setAudioSpeed(audioSpeed === 0.9 ? 0.7 : 0.9)}
              className="hover:text-teal-300 font-extrabold cursor-pointer"
            >
              {audioSpeed === 0.9 ? '1x' : '0.7x'}
            </button>
          </div>
        </div>
      </div>

      {/* Offline Mode Banner when offline */}
      {!offlineCacheService.isOnline() && (
        <div className="bg-amber-600 text-white px-3 py-1.5 text-[11px] font-bold flex items-center justify-between border-b border-amber-700 shadow-inner">
          <div className="flex items-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5 text-amber-200" />
            <span>Çevrimdışı Ders Modu • Yerel önbellekten çalıştırılıyor</span>
          </div>
          <span className="text-[9px] bg-amber-900/60 px-1.5 py-0.5 rounded text-amber-200 font-extrabold flex items-center gap-1">
            <Check className="w-2.5 h-2.5" /> Önbellekte
          </span>
        </div>
      )}

      {/* ==================================================== */}
      {/* CURRENT LESSON OVERALL PROGRESS BAR (İLERLEME ÇUBUĞU) */}
      {/* ==================================================== */}
      <div className="bg-white/95 backdrop-blur-xs border-b border-teal-100 px-4 py-2.5 shadow-2xs">
        <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-800 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse ring-2 ring-teal-200" />
              <span>Ders İlerlemesi</span>
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200 shadow-2xs">
              %{lessonProgressPercent} {isTr ? 'Tamamlandı' : 'Орындалды'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-600">
            {quizFinished ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 text-[10px] font-black shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ders Başarıyla Tamamlandı!</span>
              </span>
            ) : (
              <span className="text-slate-500 text-[10px] font-bold">
                {visitedTabs.size} / {tabsList.length} Bölüm Keşfedildi
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Gradient Bar with animated width */}
        <div className="w-full bg-slate-200/80 rounded-full h-2.5 p-0.5 overflow-hidden shadow-inner border border-slate-200/70 relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 via-emerald-500 to-amber-400 transition-all duration-500 ease-out shadow-xs relative"
            style={{ width: `${Math.max(5, lessonProgressPercent)}%` }}
          />
        </div>

        {/* Quick Micro Step Nodes */}
        <div className="flex items-center justify-between gap-1 mt-1.5 pt-0.5">
          {tabsList.map((t, idx) => {
            const isCompleted = visitedTabs.has(t.id);
            const isCurrent = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className="flex items-center gap-1 text-[10px] font-bold cursor-pointer hover:opacity-90 transition group"
                title={`${t.label} bölümü`}
              >
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black transition ${
                  isCurrent 
                    ? 'bg-teal-600 text-white ring-2 ring-teal-300 ring-offset-1 scale-110 shadow-xs' 
                    : isCompleted 
                      ? 'bg-emerald-500 text-white shadow-2xs' 
                      : 'bg-slate-200 text-slate-500'
                }`}>
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span className={`hidden sm:inline ${
                  isCurrent ? 'text-teal-900 font-black' : isCompleted ? 'text-emerald-800' : 'text-slate-400'
                }`}>
                  {t.label.replace(/^\d+\.\s*/, '')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Segmented Navigation with Alfabe & Ağız Şekilleri */}
      <div className="bg-white border-b border-slate-200 px-2 py-2 flex items-center justify-between gap-1 overflow-x-auto select-none">
        {isAlphabetLesson && (
          <button
            onClick={() => setActiveTab('alphabet')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              activeTab === 'alphabet' 
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-xs font-black' 
                : 'text-teal-800 bg-teal-50 hover:bg-teal-100 font-bold border border-teal-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>👄 Ağız Şekli & Alfabe</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('vocab')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'vocab' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isAlphabetLesson ? '2. Kelimeler' : '1. Kelimeler'}</span>
        </button>

        <button
          onClick={() => setActiveTab('dialogue')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'dialogue' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>{isAlphabetLesson ? '3. Dinleme' : '2. Dinleme'}</span>
        </button>

        <button
          onClick={() => setActiveTab('grammar')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'grammar' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{isAlphabetLesson ? '4. Gramer' : '3. Gramer'}</span>
        </button>

        <button
          onClick={() => setActiveTab('speaking')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'speaking' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>{isAlphabetLesson ? '5. Konuşma' : '4. Konuşma'}</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'quiz' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-800 hover:bg-amber-50 font-extrabold'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>{isAlphabetLesson ? '6. Sınav' : '5. Sınav'}</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        
        {/* ==================================================== */}
        {/* TAB 0: ALFABE VE AĞIZ ŞEKİLLERİ (FONETİK ATÖLYESİ) */}
        {/* ==================================================== */}
        {activeTab === 'alphabet' && (
          <div className="space-y-4">
            
            {/* Mascot Banner */}
            <div className="p-3 bg-gradient-to-r from-amber-50 via-teal-50 to-emerald-50 border border-teal-200/80 rounded-2xl shadow-xs">
              <AlageyikMascot
                pose="studying"
                size="sm"
                message="Dudak ve dil hareketlerini görerek tekrarla!"
                subMessage="Kazakçanın 9 özel sesi için dudakların yuvarlaklığı ve dilin damağa göre konumu çok önemlidir. Her harfe dokunup ağız şeklini incele ve sesi dinle."
                showLoreButton={false}
              />
            </div>

            {/* Persona Accent Selector */}
            <div className="flex items-center justify-between p-2.5 bg-slate-900 text-white rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">
                  🎙️ Kazakça Ses:
                </span>
                <div className="flex items-center gap-1">
                  {VOICE_PROFILES.filter(p => p.lang === 'kk').map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPersona(p.id);
                        audioService.setKazakhPersona(p.id);
                        audioService.playFeedbackSound('click');
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition flex items-center gap-1 ${
                        selectedPersona === p.id 
                          ? 'bg-amber-500 text-slate-950 font-black shadow-xs' 
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span>{p.gender === 'male' ? '👨 Erkek Sesi' : '👩 Kadın Sesi'}</span>
                      {selectedPersona === p.id && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setIsVoiceGuideOpen(true)}
                className="text-[10px] text-amber-300 hover:text-white font-bold underline flex items-center gap-1 transition"
                title="Ses kalitesi ve doğal insan sesi çözüm rehberi"
              >
                <span>💡 Ses Robotik Çıkıyorsa Çözüm</span>
              </button>
            </div>

            {/* 9 Özel Harf Seçim Bandı */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Harfi Seç ve Ağız Şeklini İncele:</span>
                </span>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                  <button
                    onClick={() => setAlphabetViewMode('special9')}
                    className={`px-2 py-0.5 rounded-md transition ${
                      alphabetViewMode === 'special9' ? 'bg-white text-teal-800 shadow-2xs font-black' : 'text-slate-600'
                    }`}
                  >
                    9 Özel Harf
                  </button>
                  <button
                    onClick={() => setAlphabetViewMode('all42')}
                    className={`px-2 py-0.5 rounded-md transition ${
                      alphabetViewMode === 'all42' ? 'bg-white text-teal-800 shadow-2xs font-black' : 'text-slate-600'
                    }`}
                  >
                    42 Harf
                  </button>
                </div>
              </div>

              {alphabetViewMode === 'special9' ? (
                <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5">
                  {KAZAKH_PHONETIC_ATLAS.map((p) => {
                    const isSelected = selectedLetter === p.letter;
                    return (
                      <button
                        key={p.letter}
                        onClick={() => {
                          setSelectedLetter(p.letter);
                          audioService.playFeedbackSound('click');
                          audioService.speakKazakhLetterComplete(p.letter);
                        }}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition border ${
                          isSelected
                            ? 'bg-gradient-to-b from-teal-600 to-cyan-700 text-white border-teal-500 shadow-md scale-105 ring-2 ring-teal-400/40'
                            : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-teal-300 hover:bg-teal-50/50'
                        }`}
                      >
                        <span className="text-lg font-black leading-none">{p.letter}</span>
                        <span className={`text-[9px] mt-0.5 font-bold ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                          {p.latin}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-7 sm:grid-cols-11 gap-1 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-xl">
                  {ALL_42_KAZAKH_LETTERS.map((l) => {
                    const isSelected = selectedLetter === l.char;
                    return (
                      <button
                        key={l.char}
                        onClick={() => {
                          setSelectedLetter(l.char);
                          audioService.playFeedbackSound('click');
                          audioService.speakKazakhLetterComplete(l.char);
                        }}
                        className={`p-1.5 rounded-lg text-center font-black text-xs transition border ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-xs scale-105'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-teal-300'
                        }`}
                      >
                        {l.char}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Büyük Ağız Şekli Görsel Kartı (PhoneticMouthVisual) */}
            <div className="bg-white rounded-3xl border border-teal-200 shadow-lg p-4">
              <PhoneticMouthVisual
                category={LETTER_MOUTH_MAP[selectedLetter] || 'unrounded_open'}
                letter={selectedLetter}
                nameTr={
                  KAZAKH_PHONETIC_ATLAS.find(x => x.letter === selectedLetter)?.nameTr ||
                  ALL_42_KAZAKH_LETTERS.find(x => x.char === selectedLetter)?.nameTr ||
                  `${selectedLetter} Harfi`
                }
                showLabels={true}
              />

              {/* Ses ve Kelime Butonları */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-teal-800 font-bold px-1">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>Gemini AI Stüdyo Kazakça Seslendirmesi</span>
                  </span>
                  <span className="text-[10px] bg-teal-50 text-teal-900 border border-teal-200 px-2 py-0.5 rounded-full font-semibold">
                    Doğal Fonetik Vurgu
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => audioService.speakKazakhLetterComplete(selectedLetter)}
                    className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-xs shadow-md shadow-teal-500/20 transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>🔊 Doğru Kazakça Telaffuzu Dinle ({selectedLetter})</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold ml-1">
                      ✨ Gemini AI
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      const atlasItem = KAZAKH_PHONETIC_ATLAS.find(x => x.letter === selectedLetter);
                      const item = ALL_42_KAZAKH_LETTERS.find(l => l.char === selectedLetter);
                      const firstWord = atlasItem?.exampleKz?.split(' ')[0] || item?.exampleKz?.split(' ')[0] || selectedLetter;
                      audioService.speak(`${selectedLetter}. ${firstWord}.`, 'kk', 0.85);
                    }}
                    className="py-3 px-3.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-bold text-xs transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                    title="Örnek kelime ve net telaffuz"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Örnek Kelime ile Dinle</span>
                  </button>
                </div>
              </div>

              {/* Örnek Kelimeler */}
              {KAZAKH_PHONETIC_ATLAS.find(x => x.letter === selectedLetter) && (
                <div className="mt-3 p-3 bg-teal-50/70 border border-teal-200 rounded-2xl">
                  <span className="text-[10px] font-black uppercase text-teal-800 tracking-wider block mb-1.5">
                    Örnek Kazakça Kelimeler & Sesler:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {KAZAKH_PHONETIC_ATLAS.find(x => x.letter === selectedLetter)?.exampleKz.split(', ').map((wordItem, idx) => (
                      <button
                        key={idx}
                        onClick={() => audioService.speak(wordItem.split(' ')[0], 'kk')}
                        className="px-2.5 py-1 rounded-xl bg-white border border-teal-300 text-teal-950 font-bold text-xs hover:bg-teal-600 hover:text-white transition shadow-2xs flex items-center gap-1"
                      >
                        <Volume2 className="w-3 h-3 text-teal-600" />
                        <span>{wordItem}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* İlerleme / Sonraki Adıma Geç Butonu */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveTab('vocab')}
                className="py-2.5 px-5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs shadow-md transition flex items-center gap-1.5"
              >
                <span>Kelimeler Bölümüne Geç</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 1: KELİMELER (СӨЗДІК) FLASHCARDS */}
        {/* ==================================================== */}
        {activeTab === 'vocab' && (
          <div className="space-y-4">
            
            {/* Flashcard Guessing Exercise Mode Banner */}
            <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-cyan-800 text-white p-3.5 rounded-2xl shadow-sm flex items-center justify-between gap-2 border border-teal-500/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Layers className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                    <span>Flaş Kart Alıştırma Arayüzü</span>
                    <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded">
                      YENİ
                    </span>
                  </h4>
                  <p className="text-[10px] text-teal-100">
                    Kelimeleri 3D kart çevirme ve 4 şıklı tahmin testiyle ezberleyin
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsLessonFlashcardsOpen(true)}
                className="py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition shrink-0 active:scale-95"
              >
                Kartları Başlat →
              </button>
            </div>

            {/* Cyrillic / Latin Orthography Switcher */}
            <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-xl">
              <span className="text-xs font-bold text-slate-700 pl-2">Kazakça Yazım:</span>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg shadow-2xs">
                <button
                  onClick={() => setUseLatinScript(false)}
                  className={`px-2 py-0.5 text-xs font-bold rounded-md transition ${
                    !useLatinScript ? 'bg-teal-600 text-white' : 'text-slate-600'
                  }`}
                >
                  Kiril (Кирилл)
                </button>
                <button
                  onClick={() => setUseLatinScript(true)}
                  className={`px-2 py-0.5 text-xs font-bold rounded-md transition ${
                    useLatinScript ? 'bg-teal-600 text-white' : 'text-slate-600'
                  }`}
                >
                  Latin (Latyn)
                </button>
              </div>
            </div>

            {/* Flashcard Item */}
            {currentWord && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-md relative overflow-hidden flex flex-col items-center text-center">
                
                {/* Category Badge & Star Button */}
                <div className="w-full flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                      {currentWord.category}
                    </span>

                    {/* Star / Favorite Word Toggle Button */}
                    <button
                      onClick={() => handleToggleFavoriteWord(currentWord.id)}
                      className={`px-2.5 py-1 rounded-full border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                        isWordFavorited(currentWord.id)
                          ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-2xs ring-1 ring-amber-300'
                          : 'bg-slate-50 hover:bg-amber-50 text-slate-500 hover:text-amber-600 border-slate-200'
                      }`}
                      title={isWordFavorited(currentWord.id) ? "Favori Kelimelerimden Çıkar" : "Zorlandığım Kelime / Favorilere Ekle"}
                    >
                      <Star className={`w-3.5 h-3.5 ${isWordFavorited(currentWord.id) ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
                      <span className="text-[10px] font-black">
                        {isWordFavorited(currentWord.id) ? 'Favorilerimde ★' : 'Yıldızla'}
                      </span>
                    </button>
                  </div>

                  <span className="text-xs font-bold text-slate-400">
                    {currentWordIndex + 1} / {lesson.vocabulary.length}
                  </span>
                </div>

                {/* Big Target Word */}
                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
                  {useLatinScript ? currentWord.kazakhLatin : currentWord.kazakhCyrillic}
                </h3>

                {/* Subtitle Latin / Cyrillic counterpart */}
                <p className="text-xs font-medium text-slate-500 mb-2">
                  {!useLatinScript ? currentWord.kazakhLatin : currentWord.kazakhCyrillic}
                </p>

                {/* Phonetic Pronunciation helper */}
                <span className="text-[11px] font-mono text-teal-700 bg-teal-50/70 px-2.5 py-0.5 rounded-md mb-4">
                  [{currentWord.phoneticGuide}]
                </span>

                {/* Audio Pronounce Button */}
                <button
                  onClick={() => handlePlayWord(currentWord)}
                  className="w-14 h-14 rounded-full bg-teal-600 hover:bg-teal-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-teal-600/30 transition mb-5"
                  title="Seslendir / Дыбыстау"
                >
                  <Volume2 className="w-7 h-7" />
                </button>

                {/* Meaning in Turkish - Guessing Toggle */}
                {!isMeaningRevealed ? (
                  <div 
                    onClick={() => {
                      setIsMeaningRevealed(true);
                      audioService.playFeedbackSound('click');
                    }}
                    className="w-full py-4 px-4 bg-teal-50/90 hover:bg-teal-100 rounded-2xl border-2 border-dashed border-teal-300 mb-3 cursor-pointer transition text-center group active:scale-[0.99]"
                  >
                    <span className="text-xs font-black text-teal-900 flex items-center justify-center gap-1.5 group-hover:scale-105 transition">
                      <Eye className="w-4 h-4 text-teal-600" />
                      <span>Türkçe Anlamını Tahmin Et & Göster</span>
                    </span>
                    <span className="text-[10px] text-teal-600 font-medium block mt-1">
                      Önce aklınızdan tahmin edin, ardından dokunarak kontrol edin
                    </span>
                  </div>
                ) : (
                  <div className="w-full py-3 px-4 bg-emerald-50/90 rounded-2xl border border-emerald-200 mb-3 animate-in fade-in">
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold text-emerald-700 mb-0.5">
                      <span>✓ Türkçe Anlamı:</span>
                      <button 
                        onClick={() => setIsMeaningRevealed(false)}
                        className="text-slate-400 hover:text-slate-600 lowercase text-[9px] flex items-center gap-0.5"
                      >
                        <EyeOff className="w-3 h-3" /> gizle
                      </button>
                    </div>
                    <div className="text-base font-extrabold text-slate-900">
                      {currentWord.turkish}
                    </div>
                  </div>
                )}

                {/* Example sentence with tap-to-listen words */}
                <div className="w-full text-left p-3.5 bg-cyan-50/50 rounded-2xl border border-cyan-100 text-xs space-y-1 mb-2">
                  <div className="font-bold text-cyan-950 flex items-center gap-1 flex-wrap">
                    <span>🇰🇿</span>
                    {renderClickableKazakhText(currentWord.exampleKazakh)}
                  </div>
                  <div className="font-medium text-slate-600 flex items-center gap-1">
                    <span>🇹🇷</span> {currentWord.exampleTurkish}
                  </div>
                  <div className="text-[10px] text-teal-600 font-semibold pt-0.5">
                    💡 İpucu: Kelimelere dokunarak doğru Kazakça telaffuzlarını anında dinleyin
                  </div>
                </div>

                {/* False Friend Alert Box */}
                {currentWord.falseFriendWarning && (
                  <div className="w-full text-left p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Dil Bilimsel Uyarı: </span>
                      {currentWord.falseFriendWarning}
                    </div>
                  </div>
                )}

                {/* Mastery Toggles */}
                <div className="w-full grid grid-cols-2 gap-2 mt-5">
                  <button
                    onClick={() => {
                      onToggleMastery(currentWord.id, false);
                      audioService.playFeedbackSound('click');
                      setIsMeaningRevealed(false);
                      if (currentWordIndex + 1 < lesson.vocabulary.length) setCurrentWordIndex(prev => prev + 1);
                    }}
                    className="py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold transition"
                  >
                    Tekrar Etmeliyim
                  </button>
                  <button
                    onClick={() => {
                      onToggleMastery(currentWord.id, true);
                      audioService.playFeedbackSound('correct');
                      setIsMeaningRevealed(false);
                      if (currentWordIndex + 1 < lesson.vocabulary.length) setCurrentWordIndex(prev => prev + 1);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs"
                  >
                    Biliyorum ✓
                  </button>
                </div>

              </div>
            )}

            {/* Flashcard Next/Prev Controls */}
            <div className="flex items-center justify-between px-2">
              <button
                disabled={currentWordIndex === 0}
                onClick={() => {
                  setIsMeaningRevealed(false);
                  setCurrentWordIndex(prev => prev - 1);
                }}
                className="text-xs font-bold text-teal-700 disabled:opacity-30 p-2 hover:bg-slate-200/50 rounded-xl"
              >
                ← Önceki Kelime
              </button>
              <button
                disabled={currentWordIndex === lesson.vocabulary.length - 1}
                onClick={() => {
                  setIsMeaningRevealed(false);
                  setCurrentWordIndex(prev => prev + 1);
                }}
                className="text-xs font-bold text-teal-700 disabled:opacity-30 p-2 hover:bg-slate-200/50 rounded-xl"
              >
                Sonraki Kelime →
              </button>
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: DİNLEME VE DİYALOG (ТЫҢДАЛЫМ) */}
        {/* ==================================================== */}
        {activeTab === 'dialogue' && (
          <div className="space-y-4">
            
            {/* Audio Wave Header Card (matches screenshot Market Chat!) */}
            <div className="bg-gradient-to-r from-teal-700 to-cyan-800 text-white p-5 rounded-3xl shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-200">
                  {isTr ? 'Dinleme Pratiği' : 'Тыңдалым жаттығуы'}
                </span>
                <span className="text-xs font-mono font-bold bg-black/20 px-2 py-0.5 rounded">
                  2:15
                </span>
              </div>
              <h3 className="text-lg font-black">{lesson.dialogue.titleTr}</h3>
              <p className="text-xs text-teal-100 mt-0.5">{lesson.dialogue.contextTr}</p>

              {/* Animated Waveform Visualization */}
              <div className="my-4 h-10 flex items-center justify-center gap-1">
                {[40, 65, 30, 90, 75, 50, 85, 35, 95, 60, 45, 80, 55, 30, 70, 90, 40].map((height, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-teal-200 rounded-full transition-all duration-300"
                    style={{
                      height: activeSpeakingLine !== null ? `${Math.max(15, Math.round(height * Math.random()))}%` : `${height * 0.4}%`,
                      opacity: activeSpeakingLine !== null ? 0.9 : 0.4
                    }}
                  />
                ))}
              </div>

              {/* Master Play Button */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    const firstLine = lesson.dialogue.lines[0];
                    if (firstLine) handlePlayDialogueLine(firstLine.kazakh, 0);
                  }}
                  className="w-12 h-12 rounded-full bg-white text-teal-800 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition"
                >
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </button>
              </div>
            </div>

            {/* Line by line dialogue conversation bubbles */}
            <div className="space-y-3 pt-2">
              {lesson.dialogue.lines.map((line, idx) => (
                <div
                  key={line.id}
                  onClick={() => handlePlayDialogueLine(line.kazakh, idx)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                    activeSpeakingLine === idx
                      ? 'bg-teal-50 border-teal-400 shadow-sm'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{line.avatar}</span>
                      <span className="text-xs font-extrabold text-slate-800">
                        {line.speaker}
                      </span>
                    </div>
                    <button 
                      className={`p-1 rounded-lg ${
                        activeSpeakingLine === idx ? 'text-teal-700 bg-teal-100' : 'text-slate-400'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-sm font-bold text-slate-900 leading-snug flex flex-wrap items-center">
                    {renderClickableKazakhText(line.kazakh)}
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {line.turkish}
                  </p>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: DİL BİLGİSİ (ГРАММАТИКА) */}
        {/* ==================================================== */}
        {activeTab === 'grammar' && (
          <div className="space-y-4">
            
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-black uppercase text-teal-700 tracking-wider">
                Karşılaştırmalı Dil Bilgisi
              </span>
              <h3 className="text-base font-black text-slate-900 mt-1">
                {lesson.grammar.titleTr}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {lesson.grammar.explanationTr}
              </p>

              {/* Comparative Rule Cards */}
              <div className="mt-4 space-y-3">
                {lesson.grammar.rules.map(rule => (
                  <div key={rule.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <h4 className="font-extrabold text-slate-900 mb-2">
                      {rule.titleTr}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="p-2 bg-white rounded-xl border border-slate-100">
                        <span className="block text-[10px] font-bold text-slate-400">🇹🇷 Türkçe Şablon</span>
                        <span className="font-bold text-teal-800">{rule.trPattern}</span>
                      </div>
                      <div className="p-2 bg-white rounded-xl border border-slate-100">
                        <span className="block text-[10px] font-bold text-slate-400">🇰🇿 Kazakça Şablon</span>
                        <span className="font-bold text-sky-800">{rule.kzPattern}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      {rule.explanationTr}
                    </p>
                  </div>
                ))}
              </div>

              {/* Grammar Examples breakdown */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-800 mb-2">
                  Örnek Cümle Çözümlemeleri:
                </h4>
                {lesson.grammar.examples.map((ex, i) => (
                  <div key={i} className="mb-2 p-3 bg-teal-50/60 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-slate-900">🇰🇿 {ex.kazakh}</div>
                    <div className="text-slate-600">🇹🇷 {ex.turkish}</div>
                    <div className="text-[10px] font-mono text-teal-800 mt-1">
                      🔍 {ex.breakdown}
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: KONUŞMA VE TELAFFUZ (АЙТЫЛЫМ) */}
        {/* ==================================================== */}
        {activeTab === 'speaking' && (
          <div className="space-y-4">
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md text-center flex flex-col items-center">
              <span className="text-[10px] font-black uppercase text-teal-700 tracking-wider bg-teal-50 px-2.5 py-0.5 rounded-full mb-3">
                {isTr ? 'Telaffuz Değerlendirme' : 'Дыбыстауды тексеру'}
              </span>

              <h3 className="text-xs font-bold text-slate-500 mb-1">
                Lütfen aşağıdaki Kazakça cümleyi sesli olarak okuyunuz:
              </h3>
              
              <div className="my-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 w-full">
                <p className="text-xl font-black text-slate-900">
                  {currentWord ? currentWord.exampleKazakh : 'Сәлеметсіз бе! Менің атым Жан.'}
                </p>
                <button
                  onClick={() => audioService.speak(currentWord ? currentWord.exampleKazakh : 'Сәлеметсіз бе! Менің атым Жан.', 'kk')}
                  className="mt-2 text-xs font-bold text-teal-700 flex items-center justify-center gap-1 mx-auto"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Örnek Telaffuzu Dinle</span>
                </button>
              </div>

              {/* Animated Microphone Action Button */}
              <div className="my-6 relative flex items-center justify-center">
                {isListeningMicrophone && (
                  <div className="absolute w-28 h-28 rounded-full bg-teal-400/30 animate-ping" />
                )}
                <button
                  onClick={handleToggleMicrophone}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-95 z-10 ${
                    isListeningMicrophone
                      ? 'bg-rose-500 hover:bg-rose-600 ring-4 ring-rose-200'
                      : 'bg-teal-600 hover:bg-teal-700'
                  }`}
                >
                  {isListeningMicrophone ? (
                    <Mic className="w-10 h-10 animate-bounce" />
                  ) : (
                    <Mic className="w-10 h-10" />
                  )}
                </button>
              </div>

              <p className="text-xs font-bold text-slate-700">
                {isListeningMicrophone ? 'Dinleniyor... Lütfen konuşunuz' : 'Mikrofona basarak konuşun'}
              </p>

              {/* Pronunciation Score Feedback Badge (Requirement 2: Enforce passing only if pronunciation >= 85) */}
              {pronunciationScore !== null && (
                <div className={`mt-5 w-full p-4 rounded-2xl border animate-in fade-in ${
                  pronunciationScore >= 85 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-rose-50 border-rose-300'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-black ${pronunciationScore >= 85 ? 'text-emerald-900' : 'text-rose-900'}`}>
                      {pronunciationScore >= 85 ? 'Telaffuz Onaylandı ✓' : 'Hata Tespit Edildi (Yetersiz Doğruluk)'}
                    </span>
                    <span className={`text-base font-black ${pronunciationScore >= 85 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      %{pronunciationScore}
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-2 mb-2 ${pronunciationScore >= 85 ? 'bg-emerald-200' : 'bg-rose-200'}`}>
                    <div
                      className={`h-2 rounded-full transition-all ${pronunciationScore >= 85 ? 'bg-emerald-600' : 'bg-rose-600'}`}
                      style={{ width: `${pronunciationScore}%` }}
                    />
                  </div>
                  <p className={`text-[11px] font-medium leading-relaxed ${pronunciationScore >= 85 ? 'text-emerald-800' : 'text-rose-800'}`}>
                    {pronunciationScore >= 85 
                      ? 'Harika! (Өте жақсы!) Kazakça fonetik tonlama ve harf vurguları doğru telaffuz edildi.' 
                      : 'Hata tespit edildi! Kazakça telaffuz kuralı gereği doğru söyleyene kadar bu adımı geçemezsiniz. Lütfen mikrofona tekrar dokunup cümleyi okuyunuz.'}
                  </p>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 5: ALIŞTIRMALAR VE SINAV (ЖАТТЫҒУЛАР) */}
        {/* ==================================================== */}
        {activeTab === 'quiz' && (
          <div className="space-y-4">
            
            {!quizFinished ? (
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md">
                
                {/* Dynamic Visual Progress Bar Component */}
                <LessonExerciseProgressBar
                  total={lesson.exercises.length}
                  currentIndex={currentExerciseIndex}
                  isAnswerSubmitted={isAnswerSubmitted}
                  isAnswerCorrect={isAnswerCorrect}
                  quizScore={quizScore}
                  totalPoints={lesson.exercises.reduce((sum, e) => sum + (e.points || 10), 0)}
                  isTr={isTr}
                />

                {/* Question Title */}
                <h3 className="text-sm font-black text-slate-900 mb-2">
                  {isTr ? currentExercise.questionTr : currentExercise.questionKz}
                </h3>

                {/* Image if question is image_choice (Matches mockup apple / alma!) */}
                {currentExercise.imageUrl && (
                  <div className="my-3 flex justify-center">
                    <img
                      src={currentExercise.imageUrl}
                      alt="Question Item"
                      className="w-36 h-36 object-cover rounded-2xl shadow-md border-2 border-slate-100"
                    />
                  </div>
                )}

                {/* Multiple Options List (Randomly Shuffled) */}
                <div className="space-y-2.5 my-4">
                  {(shuffledOptions.length > 0 ? shuffledOptions : currentExercise.options || []).map((option, idx) => {
                    const isSelected = selectedOption === option;
                    let style = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';

                    if (isAnswerSubmitted) {
                      const isCorrect = Array.isArray(currentExercise.correctAnswer)
                        ? currentExercise.correctAnswer.includes(option)
                        : currentExercise.correctAnswer === option;

                      if (isCorrect) {
                        style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-extrabold ring-1 ring-emerald-400';
                      } else if (isSelected && !isCorrect) {
                        style = 'bg-rose-50 border-rose-500 text-rose-900 font-extrabold ring-1 ring-rose-400';
                      }
                    } else if (isSelected) {
                      style = 'bg-teal-50 border-teal-600 text-teal-900 font-bold ring-2 ring-teal-500/20';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswerSubmitted}
                        onClick={() => setSelectedOption(option)}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs font-bold transition flex items-center justify-between ${style}`}
                      >
                        <span>{option}</span>
                        {isSelected && !isAnswerSubmitted && (
                          <span className="w-2 h-2 rounded-full bg-teal-600" />
                        )}
                        {isAnswerSubmitted && Array.isArray(currentExercise.correctAnswer) ? (
                          currentExercise.correctAnswer.includes(option) && <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          currentExercise.correctAnswer === option && isAnswerSubmitted && <Check className="w-4 h-4 text-emerald-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Celebration Box (Matches mockup: DOĞRU! / ДҰРЫС! DEVAM ET!) */}
                {isAnswerSubmitted && (
                  <div className={`p-4 rounded-2xl mb-4 animate-in fade-in ${
                    isAnswerCorrect 
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-950' 
                      : 'bg-rose-50 border border-rose-200 text-rose-950'
                  }`}>
                    <div className="flex items-center gap-2 font-black text-sm mb-1">
                      {isAnswerCorrect ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>DOĞRU! / ДҰРЫС!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-rose-600" />
                          <span>TEKRAR DENE / ҚАЙТА КӨРІҢІЗ</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs font-medium">
                      {isTr ? currentExercise.explanationTr : currentExercise.explanationKz}
                    </p>
                  </div>
                )}

                {/* Action Button (Requirement 2: If student makes a mistake, block proceeding until correct!) */}
                {!isAnswerSubmitted ? (
                  <button
                    disabled={!selectedOption}
                    onClick={handleCheckAnswer}
                    className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow-md transition"
                  >
                    CEVABI KONTROL ET / ТЕКСЕРУ
                  </button>
                ) : isAnswerCorrect ? (
                  <button
                    onClick={handleNextExercise}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>DOĞRU! SIRADAKİ SORUYA GEÇ / ЖАЛҒАСТЫРУ</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedOption(null);
                      setIsAnswerSubmitted(false);
                      setIsAnswerCorrect(false);
                      audioService.playFeedbackSound('click');
                    }}
                    className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                    <span>HATA TESPİT EDİLDİ • TEKRAR DENE (DOĞRU CEVAPLAYANA KADAR GEÇİLEMEZ)</span>
                  </button>
                )}

              </div>
            ) : (
              /* Quiz Completed State */
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Tebrikler! Dersi Tamamladınız!
                </h3>
                <p className="text-xs text-slate-600">
                  Құттықтаймыз! Сабақ сәтті аяқталды және ұпайларыңыз есептелді.
                </p>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-bold text-amber-900">
                  +{quizScore + 20} XP Kazanıldı! 🔥 Seri Devam Ediyor
                </div>

                <button
                  onClick={onBack}
                  className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow-md transition"
                >
                  Ana Sayfaya Dön / Басты бетке қайту
                </button>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Natural Voice Quality Diagnostic & Solution Modal */}
      <NaturalVoiceGuideModal
        isOpen={isVoiceGuideOpen}
        onClose={() => setIsVoiceGuideOpen(false)}
      />

      {/* Interactive Guessing Flashcard Practice Modal for Current Lesson */}
      <FlashcardPracticeModal
        isOpen={isLessonFlashcardsOpen}
        onClose={() => setIsLessonFlashcardsOpen(false)}
        vocabulary={lesson.vocabulary}
        lessonTitle={`${isTr ? lesson.titleTr : lesson.titleKz} • Bilgi Kartları`}
        userDirection={user.currentDirection}
        onToggleMastery={onToggleMastery}
        onEarnXp={(xp) => onCompleteLesson(lesson.id, xp)}
      />

      {/* Floating Word Audio & Definition Snack-Card (When tapping any word in lesson) */}
      {clickedWordPopup && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-slate-950/95 text-white p-3.5 rounded-2xl shadow-2xl border border-teal-500/50 backdrop-blur-md z-40 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                onClick={() => {
                  audioService.playFeedbackSound('click');
                  audioService.speak(clickedWordPopup.word, 'kk', audioSpeed);
                }}
                className="w-10 h-10 rounded-xl bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center shrink-0 shadow-md active:scale-95 transition cursor-pointer"
                title="Kelimeyi Tekrar Seslendir"
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-amber-300 truncate">
                    {clickedWordPopup.word}
                  </span>
                  {clickedWordPopup.phonetic && (
                    <span className="text-[10px] font-mono text-teal-300 bg-teal-900/60 px-1.5 py-0.2 rounded">
                      [{clickedWordPopup.phonetic}]
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-200 font-bold truncate">
                  🇹🇷 {clickedWordPopup.translation}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {clickedWordPopup.wordId && (
                <button
                  onClick={() => handleToggleFavoriteWord(clickedWordPopup.wordId!)}
                  className={`p-2 rounded-xl border text-xs font-bold transition flex items-center justify-center cursor-pointer active:scale-95 ${
                    isWordFavorited(clickedWordPopup.wordId)
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-2xs'
                      : 'bg-white/10 hover:bg-white/20 text-slate-300 border-white/20'
                  }`}
                  title={isWordFavorited(clickedWordPopup.wordId) ? 'Favori Kelimelerimden Çıkar' : 'Favorilere Ekle (Zor Kelime)'}
                >
                  <Star className={`w-3.5 h-3.5 ${isWordFavorited(clickedWordPopup.wordId) ? 'fill-slate-950 text-slate-950' : 'text-slate-300'}`} />
                </button>
              )}
              <button
                onClick={() => {
                  setAudioDictSearch(clickedWordPopup.word);
                  setIsAudioDictOpen(true);
                  setClickedWordPopup(null);
                }}
                className="px-2.5 py-1.5 bg-teal-800 hover:bg-teal-700 text-teal-200 hover:text-white rounded-xl text-[11px] font-black transition cursor-pointer"
              >
                Sözlükte Gör
              </button>
              <button
                onClick={() => setClickedWordPopup(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
                title="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* SESLİ SÖZLÜK MODAL / DRAWER (DERS VE TÜM KELİMELER)  */}
      {/* ==================================================== */}
      {isAudioDictOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white w-full sm:max-w-xl max-h-[88vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in slide-in-from-bottom duration-200">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-900 text-white p-4 flex items-center justify-between border-b border-teal-600/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black flex items-center gap-1.5">
                    <span>Sesli Sözlük (Дыбыстық Сөздік)</span>
                    <span className="text-[9px] bg-teal-600 text-teal-100 font-bold px-1.5 py-0.2 rounded-full border border-teal-400">
                      Gemini AI Ses
                    </span>
                  </h3>
                  <p className="text-[11px] text-teal-200 font-medium">
                    Kelimelere dokunun, doğru Kazakça telaffuzlarını anında dinleyin
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAudioDictOpen(false)}
                className="p-2 rounded-xl text-teal-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={audioDictSearch}
                  onChange={(e) => setAudioDictSearch(e.target.value)}
                  placeholder="Kazakça veya Türkçe kelime ara..."
                  className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                />
                {audioDictSearch && (
                  <button
                    onClick={() => setAudioDictSearch('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Tabs / Filter Selection */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-xl">
                  <button
                    onClick={() => setAudioDictFilter('lesson')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      audioDictFilter === 'lesson'
                        ? 'bg-white text-teal-800 shadow-2xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Bu Ders ({lesson.vocabulary.length})
                  </button>
                  <button
                    onClick={() => setAudioDictFilter('favorites')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                      audioDictFilter === 'favorites'
                        ? 'bg-amber-400 text-slate-950 shadow-2xs font-black'
                        : 'text-amber-800 hover:text-amber-950'
                    }`}
                  >
                    <Star className={`w-3 h-3 ${audioDictFilter === 'favorites' ? 'fill-slate-950 text-slate-950' : 'fill-amber-400 text-amber-500'}`} />
                    <span>Favorilerim ({favoriteWordIds.length})</span>
                  </button>
                  <button
                    onClick={() => setAudioDictFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      audioDictFilter === 'all'
                        ? 'bg-white text-teal-800 shadow-2xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tümü ({storageService.getAllVocabulary().length})
                  </button>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                  <span>Hız:</span>
                  <button
                    onClick={() => setAudioSpeed(audioSpeed === 0.9 ? 0.7 : 0.9)}
                    className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition"
                  >
                    {audioSpeed === 0.9 ? '1.0x Normal' : '0.7x Yavaş'}
                  </button>
                </div>
              </div>
            </div>

            {/* Word List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-slate-100">
              {(() => {
                const sourceList = audioDictFilter === 'lesson' 
                  ? lesson.vocabulary 
                  : audioDictFilter === 'favorites'
                    ? storageService.getAllVocabulary().filter(v => favoriteWordIds.includes(v.id))
                    : storageService.getAllVocabulary();

                const filtered = sourceList.filter(item => {
                  if (!audioDictSearch.trim()) return true;
                  const query = audioDictSearch.toLowerCase().trim();
                  return (
                    item.kazakhCyrillic.toLowerCase().includes(query) ||
                    item.kazakhLatin.toLowerCase().includes(query) ||
                    item.turkish.toLowerCase().includes(query)
                  );
                });

                if (filtered.length === 0) {
                  return (
                    <div className="py-12 text-center text-slate-400">
                      {audioDictFilter === 'favorites' ? (
                        <>
                          <Star className="w-8 h-8 mx-auto mb-2 text-amber-400 fill-amber-300 opacity-60" />
                          <p className="text-xs font-bold text-slate-700">Favori kelime bulunamadı</p>
                          <p className="text-[11px] mt-1 text-slate-500 max-w-xs mx-auto">
                            Zorlandığınız kelimelerin yanındaki yıldız butonuna basarak favorilere ekleyebilirsiniz.
                          </p>
                        </>
                      ) : (
                        <>
                          <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
                          <p className="text-xs font-bold">Aradığınız kelime bulunamadı</p>
                          <p className="text-[11px] mt-1">«{audioDictSearch}» için eşleşme yok.</p>
                        </>
                      )}
                    </div>
                  );
                }

                return filtered.map((w) => {
                  const isFav = isWordFavorited(w.id);
                  return (
                    <div
                      key={w.id}
                      className="pt-2 first:pt-0 flex items-start justify-between gap-3 p-2 rounded-2xl hover:bg-slate-50 transition group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-black text-slate-900">
                            {w.kazakhCyrillic}
                          </span>
                          <span className="text-xs text-slate-500 font-bold">
                            ({w.kazakhLatin})
                          </span>
                          {w.phoneticGuide && (
                            <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.2 rounded-md border border-teal-200">
                              [{w.phoneticGuide}]
                            </span>
                          )}
                          <span className="text-[9px] font-bold text-slate-400 uppercase">
                            {w.category}
                          </span>
                          {isFav && (
                            <span className="text-[9px] font-black bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full border border-amber-200 flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-600" />
                              <span>Zor</span>
                            </span>
                          )}
                        </div>

                        <div className="text-xs font-bold text-teal-800 mt-1">
                          🇹🇷 {w.turkish}
                        </div>

                        {w.exampleKazakh && (
                          <div className="text-[11px] text-slate-600 mt-1 bg-slate-100/70 p-2 rounded-xl border border-slate-200/60 flex flex-col gap-0.5">
                            <span className="font-semibold text-slate-800">🇰🇿 {w.exampleKazakh}</span>
                            <span className="text-slate-500">🇹🇷 {w.exampleTurkish}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Star Favorite Button */}
                        <button
                          onClick={() => handleToggleFavoriteWord(w.id)}
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition active:scale-95 cursor-pointer ${
                            isFav
                              ? 'bg-amber-50 border-amber-300 text-amber-600 shadow-2xs'
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-200 hover:bg-amber-50/50'
                          }`}
                          title={isFav ? "Favori Kelimelerimden Çıkar" : "Favori Kelimelerime Ekle (Zor Kelime)"}
                        >
                          <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
                        </button>

                        <button
                          onClick={() => {
                            audioService.playFeedbackSound('click');
                            audioService.speak(w.kazakhCyrillic, 'kk', audioSpeed);
                          }}
                          className="w-9 h-9 rounded-xl bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white border border-teal-200 hover:border-teal-600 flex items-center justify-center shrink-0 transition active:scale-95 shadow-2xs group-hover:bg-teal-600 group-hover:text-white cursor-pointer"
                          title="Kazakça Doğru Telaffuzu Dinle"
                        >
                          <Volume2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Footer with Hint */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 font-medium">
              ✨ Ders ekranında gördüğünüz herhangi bir kelimeye dokunarak da telaffuzunu anında dinleyebilirsiniz.
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
