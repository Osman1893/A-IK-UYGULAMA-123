import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  Mic, 
  MicOff, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  ArrowLeft,
  Flame,
  Award,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioService, PronunciationAnalysis, WordPronunciationResult } from '../../services/audioService';
import { storageService } from '../../services/storageService';
import { UserProfile } from '../../types';

interface SpeakPracticeViewProps {
  user: UserProfile;
  onBack?: () => void;
  onEarnXp?: (xp: number) => void;
}

interface PracticeSentence {
  id: string;
  kazakhCyrillic: string;
  kazakhLatin: string;
  turkish: string;
  difficulty: 'Kolay' | 'Orta' | 'İleri';
  phoneticTip: string;
}

const SPEAK_SENTENCES: PracticeSentence[] = [
  {
    id: 's-1',
    kazakhCyrillic: 'Сәлеметсіз бе! Қалыңыз қалай?',
    kazakhLatin: 'Sälemetsiz be! Qalyñyz qalay?',
    turkish: 'Merhaba! Nasılsınız?',
    difficulty: 'Kolay',
    phoneticTip: 'Ә harfi ince açık "e/a" arası, Қ harfi boğazdan derin söylenir.'
  },
  {
    id: 's-2',
    kazakhCyrillic: 'Мен қазақша сөйлеймін.',
    kazakhLatin: 'Men qazaqşa söyleymin.',
    turkish: 'Ben Kazakça konuşuyorum.',
    difficulty: 'Kolay',
    phoneticTip: 'Қ harfinde gırtlaksı vuruş yapın, ө sesi yuvarlak incedir.'
  },
  {
    id: 's-3',
    kazakhCyrillic: 'Қайырлы таң, досым!',
    kazakhLatin: 'Qayırlı tañ, dosım!',
    turkish: 'Günaydın, dostum!',
    difficulty: 'Kolay',
    phoneticTip: 'Ң harfinde genizden n sesi (nazal n) çıkarılır.'
  },
  {
    id: 's-4',
    kazakhCyrillic: 'Бүгін күн өте жылы және ашық.',
    kazakhLatin: 'Bügin kün öte jılı jäne aşıq.',
    turkish: 'Bugün hava çok ılık ve açık.',
    difficulty: 'Orta',
    phoneticTip: 'Ү sesi ince u, Ұ sesi kalın u sesidir.'
  },
  {
    id: 's-5',
    kazakhCyrillic: 'Қазақстанның табиғаты өте сұлу.',
    kazakhLatin: 'Qazaqstannyñ tabiğatı öte sulu.',
    turkish: 'Kazakistan\'ın doğası çok güzel.',
    difficulty: 'Orta',
    phoneticTip: 'Ғ harfi boğazdan yumuşak g sesi olarak titreşir.'
  },
  {
    id: 's-6',
    kazakhCyrillic: 'Ас дәмді болсын, дастарқанға қош келдіңіз!',
    kazakhLatin: 'As dämdi bolsın, dastarqanğa qoş keldiñiz!',
    turkish: 'Afiyet olsun, sofraya hoş geldiniz!',
    difficulty: 'İleri',
    phoneticTip: 'Дастарқан Kazak kültüründe misafirperverliğin sembolüdür.'
  },
  {
    id: 's-7',
    kazakhCyrillic: 'Тіл — ұлттың ең биік туы.',
    kazakhLatin: 'Til — ulttyñ eñ biyik tuwy.',
    turkish: 'Dil milletin en yüce bayrağıdır.',
    difficulty: 'Orta',
    phoneticTip: 'Ұ sesi dudak büzülerek çıkarılan kalın u sesidir.'
  },
  {
    id: 's-8',
    kazakhCyrillic: 'Домбыра — қазақтың жүрегі мен жаны.',
    kazakhLatin: 'Dombyra — qazaqtyñ jüregi men janı.',
    turkish: 'Dombra Kazakların yüreği ve canıdır.',
    difficulty: 'İleri',
    phoneticTip: 'Ж sesi Kazakçada yumuşak j (veya c-j arası) tınlar.'
  },
  {
    id: 's-9',
    kazakhCyrillic: 'Білім — таусылмайтын байлық.',
    kazakhLatin: 'Bilim — tawswlmaytın baylıq.',
    turkish: 'İlim tükenmez bir zenginliktir.',
    difficulty: 'İleri',
    phoneticTip: 'І sesi kapalı ve kısa gırtlaksı ince sestir.'
  },
  {
    id: 's-10',
    kazakhCyrillic: 'Қонақжайлылық — біздің қасиетті салтымыз.',
    kazakhLatin: 'Qonaqjaylılıq — bizdiñ qasiyetti saltımız.',
    turkish: 'Misafirperverlik bizim kutsal töremizdir.',
    difficulty: 'İleri',
    phoneticTip: 'Қ ve ң sesleri ardışık olarak doğru boğumlanmalıdır.'
  }
];

export const SpeakPracticeView: React.FC<SpeakPracticeViewProps> = ({
  user,
  onBack,
  onEarnXp
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [analysis, setAnalysis] = useState<PronunciationAnalysis | null>(null);
  const [micVolume, setMicVolume] = useState<number>(0);
  const [energyError, setEnergyError] = useState<string | null>(null);
  const [manualTranscriptInput, setManualTranscriptInput] = useState('');
  const [showManualCorrection, setShowManualCorrection] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const currentItem = SPEAK_SENTENCES[currentIndex];

  // Stop mic on unmount
  useEffect(() => {
    return () => {
      cleanupMic();
    };
  }, []);

  const cleanupMic = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsListening(false);
    setMicVolume(0);
  };

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    audioService.speak(currentItem.kazakhCyrillic, 'kk', 0.85).then(() => {
      setIsPlayingAudio(false);
    });
  };

  const handleToggleMic = async () => {
    if (isListening) {
      cleanupMic();
      return;
    }

    setEnergyError(null);
    setAnalysis(null);

    // Consume 5 energy for speaking activity
    const energyRes = storageService.consumeEnergy(5);
    if (!energyRes.success) {
      setEnergyError(energyRes.error || 'Yetersiz enerji!');
      audioService.playFeedbackSound('wrong');
      return;
    }

    audioService.playFeedbackSound('click');
    setIsListening(true);

    // 1. Start Audio Stream Volume Meter
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateVolume = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setMicVolume(Math.min(100, Math.round((avg / 128) * 100)));
          animationFrameRef.current = requestAnimationFrame(updateVolume);
        };
        updateVolume();
      }
    } catch {
      // mic stream blocked or unavailable, fall through to speech recognition
    }

    // 2. Browser Speech Recognition (Real Speech API)
    const SpeechRecognitionClass = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      try {
        const recognition = new SpeechRecognitionClass();
        recognitionRef.current = recognition;
        recognition.lang = 'kk-KZ';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0]?.[0]?.transcript || '';
          evaluateSpeech(transcript);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error/event:', event.error);
          cleanupMic();
          // If no speech recognized or error, evaluate as empty to enforce strict error rejection
          evaluateSpeech('');
        };

        recognition.onend = () => {
          cleanupMic();
        };

        recognition.start();
        return;
      } catch (err) {
        console.warn('SpeechRecognition start failed, fallback to audio simulation:', err);
      }
    }

    // 3. Fallback when browser lacks SpeechRecognition (e.g. strict iframe)
    // Runs an authentic audio capture window then triggers phonetic diagnostic
    setTimeout(() => {
      cleanupMic();
      setShowManualCorrection(true);
      evaluateSpeech('');
    }, 3500);
  };

  const evaluateSpeech = (spokenTranscript: string) => {
    cleanupMic();
    const result = audioService.analyzePronunciation(spokenTranscript, currentItem.kazakhCyrillic);
    setAnalysis(result);

    if (result.isPassed) {
      audioService.playFeedbackSound('correct');
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
      if (onEarnXp) onEarnXp(15);
    } else {
      audioService.playFeedbackSound('wrong');
    }
  };

  const handleManualEvaluate = () => {
    if (!manualTranscriptInput.trim()) return;
    evaluateSpeech(manualTranscriptInput);
    setManualTranscriptInput('');
  };

  const handleNext = () => {
    if (!analysis || !analysis.isPassed) {
      audioService.playFeedbackSound('wrong');
      return;
    }
    setAnalysis(null);
    setShowManualCorrection(false);
    if (currentIndex + 1 < SPEAK_SENTENCES.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
    audioService.playFeedbackSound('click');
  };

  const energyStatus = storageService.getEnergyStatus();

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-full pb-16">
      
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h2 className="text-base font-black text-slate-900 tracking-tight">
            Konuşma & Telaffuz Analizi
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Energy Pill */}
          <div 
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-xs font-black"
            title={energyStatus.isUnlimited ? 'Sınırsız Enerji' : `Kalan Enerji: ${energyStatus.energy}/100.`}
          >
            <span className="text-amber-500">⚡</span>
            {energyStatus.isUnlimited ? (
              <span className="text-amber-900 text-[11px] font-bold">∞ PRO</span>
            ) : (
              <span className="text-amber-900 text-[11px]">{energyStatus.energy}</span>
            )}
          </div>

          <span className="px-2.5 py-1 bg-teal-50 text-teal-700 text-xs font-black rounded-xl border border-teal-200">
            {currentIndex + 1} / {SPEAK_SENTENCES.length}
          </span>
        </div>
      </div>

      {/* Energy Depletion Warning */}
      {energyError && (
        <div className="m-4 p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between text-xs text-amber-950 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="text-base">⚡</span>
            <span className="font-bold">{energyError}</span>
          </div>
          <button
            onClick={() => setEnergyError(null)}
            className="text-[10px] font-black underline"
          >
            Tamam
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="p-4 max-w-md mx-auto w-full space-y-4">
        
        {/* Practice Target Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md relative overflow-hidden flex flex-col items-center text-center">
          
          <div className="w-full flex items-center justify-between mb-3">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
              currentItem.difficulty === 'Kolay' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
              currentItem.difficulty === 'Orta' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
              'bg-cyan-50 text-cyan-800 border border-cyan-200'
            }`}>
              {currentItem.difficulty} Seviye
            </span>

            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Activity className="w-3 h-3 text-teal-600" />
              <span>Sıkı Hata Denetimi</span>
            </span>
          </div>

          {/* Big Target Cyrillic Sentence */}
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1.5 leading-snug">
            {currentItem.kazakhCyrillic}
          </h3>

          {/* Latin Transliteration */}
          <p className="text-xs font-medium text-slate-500 mb-3">
            {currentItem.kazakhLatin}
          </p>

          {/* Meaning in Turkish */}
          <div className="w-full py-2.5 px-3 bg-teal-50/60 rounded-2xl border border-teal-100 mb-3 text-xs font-bold text-teal-950">
            🇹🇷 {currentItem.turkish}
          </div>

          {/* Phonetic Tip */}
          <p className="text-[11px] text-slate-500 italic mb-4 max-w-xs">
            💡 {currentItem.phoneticTip}
          </p>

          {/* Audio Playback Button */}
          <button
            onClick={handlePlayAudio}
            disabled={isPlayingAudio}
            className="flex items-center gap-2 py-2 px-4 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-black transition active:scale-95"
          >
            <Volume2 className="w-4 h-4 text-teal-700" />
            <span>{isPlayingAudio ? 'Seslendiriliyor...' : 'Doğru Telaffuzu Dinle'}</span>
          </button>
        </div>

        {/* Live Audio Waveform / Decibel Indicator */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200 flex flex-col items-center justify-center">
          <div className="text-[10px] font-bold text-slate-400 mb-1.5 flex items-center gap-1">
            <span>Ses Seviyesi & Akustik Formant:</span>
            <span className="font-mono text-teal-600">{micVolume}%</span>
          </div>
          <div className="flex items-center justify-center gap-1 h-8 w-full max-w-xs">
            {[10, 20, 35, 50, 75, 95, 60, 85, 45, 30, 65, 80, 40, 25, 15].map((baseHeight, idx) => {
              const activeH = isListening 
                ? Math.max(6, Math.round((baseHeight * (micVolume + 15)) / 100)) 
                : 6;
              return (
                <div
                  key={idx}
                  className={`w-1.5 rounded-full transition-all duration-75 ${
                    isListening ? (micVolume > 20 ? 'bg-teal-600' : 'bg-amber-400') : 'bg-slate-200'
                  }`}
                  style={{ height: `${activeH}px` }}
                />
              );
            })}
          </div>
        </div>

        {/* Big Circular Microphone Button */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="relative">
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-rose-500/25 animate-ping duration-1000" />
                <div className="absolute -inset-4 rounded-full bg-teal-500/15 animate-pulse" />
              </>
            )}

            <button
              onClick={handleToggleMic}
              className={`relative z-10 w-22 h-22 rounded-full flex flex-col items-center justify-center transition-all shadow-xl active:scale-95 ${
                isListening
                  ? 'bg-rose-600 text-white shadow-rose-600/40 ring-4 ring-rose-200 animate-pulse'
                  : 'bg-gradient-to-tr from-teal-600 to-cyan-600 text-white hover:opacity-95 shadow-teal-600/30'
              }`}
            >
              {isListening ? (
                <MicOff className="w-9 h-9" />
              ) : (
                <Mic className="w-9 h-9" />
              )}
            </button>
          </div>

          <span className="mt-3 text-xs font-black text-slate-800">
            {isListening ? 'Dinleniyor... Lütfen Cümleyi Okuyun' : 'Mikrofona Dokunup Cümleyi Okuyun'}
          </span>
          <span className="text-[10px] text-slate-400">
            {isListening ? 'Konuşmanız bittiğinde otomatik analiz edilir' : 'Doğruluk oranı %75 altında kalırsa kabul edilmez'}
          </span>
        </div>

        {/* Analysis Results Drawer (Strict Real Feedback) */}
        {analysis && (
          <div className={`p-4 rounded-3xl border shadow-lg animate-in fade-in space-y-3.5 ${
            analysis.isPassed ? 'bg-emerald-50/60 border-emerald-300' : 'bg-rose-50/70 border-rose-300'
          }`}>
            
            {/* Header with Score */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-2xl text-white ${analysis.isPassed ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                  {analysis.isPassed ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className={`text-sm font-black ${analysis.isPassed ? 'text-emerald-950' : 'text-rose-950'}`}>
                    {analysis.feedbackTitle}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs font-black px-2 py-0.5 rounded-md text-white ${
                      analysis.isPassed ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}>
                      Skor: %{analysis.overallScore}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600">
                      Geçme Barajı: %75
                    </span>
                  </div>
                </div>
              </div>

              {analysis.isPassed && (
                <span className="px-3 py-1 bg-amber-100 text-amber-900 font-black text-xs rounded-xl flex items-center gap-1 shadow-2xs">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>+15 XP</span>
                </span>
              )}
            </div>

            {/* Word-by-Word Colorized Badges */}
            <div className="p-3 bg-white rounded-2xl border border-slate-200/80 space-y-1.5">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Kelime Bazlı Telaffuz Analizi:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysis.words.map((item, idx) => {
                  let badgeStyle = 'bg-rose-100 text-rose-900 border-rose-300';
                  if (item.status === 'correct') {
                    badgeStyle = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold';
                  } else if (item.status === 'partial') {
                    badgeStyle = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
                  }

                  return (
                    <div 
                      key={idx}
                      className={`px-2.5 py-1 rounded-xl text-xs border flex items-center gap-1 ${badgeStyle}`}
                      title={item.phoneticHint || (item.status === 'correct' ? 'Doğru telaffuz' : 'Hatalı telaffuz')}
                    >
                      <span>{item.expectedWord}</span>
                      <span className="text-[9px] opacity-75">
                        {item.status === 'correct' ? '✓' : item.status === 'partial' ? '~' : '✗'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* What the student actually said */}
              <div className="pt-2 text-[11px] text-slate-600 border-t border-slate-100">
                <span className="font-bold text-slate-700">Algılanan Sesiniz: </span>
                <span className="italic">«{analysis.recognizedText || 'Hiçbir ses algılanamadı'}»</span>
              </div>
            </div>

            {/* Critical Errors List if failed */}
            {!analysis.isPassed && analysis.criticalErrors.length > 0 && (
              <div className="p-3 bg-rose-100/70 border border-rose-300 rounded-2xl text-[11px] text-rose-900 space-y-1">
                <div className="font-black flex items-center gap-1 text-rose-950">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Düzeltilmesi Gereken Hatalar:</span>
                </div>
                <ul className="list-disc pl-4 space-y-0.5">
                  {analysis.criticalErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Feedback Message */}
            <p className={`text-xs leading-relaxed p-2.5 rounded-xl font-medium ${
              analysis.isPassed ? 'bg-white/80 text-emerald-900' : 'bg-white/80 text-rose-900'
            }`}>
              {analysis.feedbackMessage}
            </p>

            {/* Action Buttons */}
            {analysis.isPassed ? (
              <button
                onClick={handleNext}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition active:scale-98"
              >
                <span>Tebrikler! Sonraki Cümleye Geç ✓</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setAnalysis(null);
                  handleToggleMic();
                }}
                className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition active:scale-98"
              >
                <RotateCcw className="w-4 h-4" />
                <span>HATA TESPİT EDİLDİ • TEKRAR OKUYUN (GEÇİLEMEZ)</span>
              </button>
            )}

          </div>
        )}

        {/* Manual Test Verification Accordion (Fallback for environments without mic permissions) */}
        <div className="pt-2">
          <button
            onClick={() => setShowManualCorrection(!showManualCorrection)}
            className="w-full text-center text-[10px] font-bold text-slate-400 hover:text-slate-600 underline"
          >
            {showManualCorrection ? 'Yazılı Telaffuz Denetimini Gizle' : 'Mikrofon çalışmıyor mu? Yazılı telaffuz denetimi yap'}
          </button>

          {showManualCorrection && (
            <div className="mt-2 p-3 bg-white rounded-2xl border border-slate-200 space-y-2 animate-in fade-in">
              <span className="text-[11px] font-bold text-slate-700 block">
                Okuduğunuz Kazakça cümleyi yazarak telaffuz motorunda test edin:
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualTranscriptInput}
                  onChange={(e) => setManualTranscriptInput(e.target.value)}
                  placeholder="Örn: Сәлеметсіз бе! Қалыңыз қалай?"
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={handleManualEvaluate}
                  className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition"
                >
                  Analiz Et
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
