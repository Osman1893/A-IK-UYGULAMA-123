import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Volume2, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Loader2,
  HelpCircle,
  Lightbulb,
  Share2
} from 'lucide-react';
import { audioService } from '../../services/audioService';

interface WordAnalysis {
  word: string;
  root: string;
  rootMeaning: string;
  suffixes: string;
  notes: string;
}

interface SentenceAnalysis {
  original: string;
  turkishNatural: string;
  phoneticGuide: string;
  vowelHarmony: string;
  words: WordAnalysis[];
  turkologyNote: string;
  culturalInsight: string;
}

interface AiSentenceExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSentence?: string;
  userLevel?: string;
}

export const AiSentenceExplainerModal: React.FC<AiSentenceExplainerModalProps> = ({
  isOpen,
  onClose,
  initialSentence = 'Астананың ауасы таза.',
  userLevel = 'A1'
}) => {
  const [inputSentence, setInputSentence] = useState(initialSentence);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SentenceAnalysis | null>(null);

  const presets = [
    { kz: 'Астананың ауасы таза.', tr: 'Astana\'nın havası temizdir.' },
    { kz: 'Балалар мектепке бірге барады.', tr: 'Çocuklar okula birlikte gidiyorlar.' },
    { kz: 'Мен қазақ тілін жақсы көремін.', tr: 'Ben Kazak dilini çok seviyorum.' },
    { kz: 'Қонақ келсе — құт келер.', tr: 'Misafir gelirse bereket gelir (Kazak Atasözü).' },
    { kz: 'Бүгін ауа райы қандай?', tr: 'Bugün hava durumu nasıl?' }
  ];

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = (textToAnalyze || inputSentence).trim();
    if (!text || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, userLevel })
      });
      const data = await response.json();
      if (data && data.analysis) {
        setAnalysis(data.analysis);
        audioService.playFeedbackSound('correct');
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    audioService.speak(text, 'kk', 0.85);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-teal-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-amber-300 shadow-inner">
              <Sparkles className="w-5 h-5 fill-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.2 rounded-full bg-amber-400 text-slate-950">
                  GEMINI AI DİL UZMANI
                </span>
                <span className="text-xs text-teal-200 font-bold">
                  CEFR {userLevel}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black leading-tight mt-0.5">
                Cümle & Morfoloji Tahlilcisi
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Input & Preset Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Tahlil Edilecek Kazakça Cümle:</span>
              <span className="text-[10px] text-teal-700 font-semibold">İster yazın, ister örnek seçin</span>
            </label>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputSentence}
                onChange={(e) => setInputSentence(e.target.value)}
                placeholder="Örn: Астананың ауасы таза..."
                className="flex-1 px-4 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 shadow-2xs"
              />
              <button
                onClick={() => handleAnalyze()}
                disabled={isLoading || !inputSentence.trim()}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs rounded-2xl transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 shrink-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Tahlil Ediliyor...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300" />
                    <span>AI ile Tahlil Et</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-[10px] font-bold text-slate-400 shrink-0">Örnekler:</span>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputSentence(p.kz);
                    handleAnalyze(p.kz);
                  }}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 transition whitespace-nowrap cursor-pointer"
                >
                  {p.kz}
                </button>
              ))}
            </div>
          </div>

          {/* Analysis Results Display */}
          {analysis && (
            <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in duration-300">
              
              {/* Main Sentence Card with Speech */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-teal-50 to-white border border-teal-200 shadow-2xs flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                      🇰🇿 Kazakça Orijinal
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {analysis.phoneticGuide}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-slate-900 leading-tight">
                    {analysis.original}
                  </h4>
                  <p className="text-xs font-bold text-teal-800 mt-1">
                    🇹🇷 {analysis.turkishNatural}
                  </p>
                </div>

                <button
                  onClick={() => handleSpeak(analysis.original)}
                  className="w-11 h-11 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition cursor-pointer"
                  title="Kazakça Doğal Sesle Dinle"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Vowel Harmony & Singarmonizm Badge */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-black text-[11px] uppercase tracking-wide text-amber-900">
                    Bozkır Ses Uyumu (Үндестік заңы) ve Ek Kuralı:
                  </h5>
                  <p className="text-[11px] font-medium leading-relaxed mt-0.5">
                    {analysis.vowelHarmony}
                  </p>
                </div>
              </div>

              {/* Morpheme Word Breakdown Cards */}
              <div className="space-y-2">
                <h5 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-teal-600" />
                  <span>Kelime Kelime Morfolojik Ayrıştırma:</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {analysis.words.map((w, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 shadow-2xs space-y-1.5 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-slate-900 font-mono">
                            {w.word}
                          </span>
                          <button
                            onClick={() => handleSpeak(w.word)}
                            className="text-teal-600 hover:text-teal-800"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                          Kök: {w.root}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600">
                        <span className="font-bold text-slate-800">Kök Anlamı: </span>
                        <span>{w.rootMeaning}</span>
                      </div>

                      <div className="text-[10px] text-teal-800 font-mono bg-teal-50/50 p-1.5 rounded-lg border border-teal-100/60">
                        <span className="font-bold">Ekler: </span>
                        <span>{w.suffixes}</span>
                      </div>

                      {w.notes && (
                        <p className="text-[10px] text-slate-500 leading-tight">
                          💡 {w.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparative Turkology & Cultural Insight Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 rounded-2xl bg-cyan-50/70 border border-cyan-200 text-xs text-cyan-950 space-y-1">
                  <span className="text-[9px] font-black uppercase text-cyan-800 tracking-wider">
                    🏛️ Kıpçak - Oğuz Türkoloji Notu
                  </span>
                  <p className="text-[11px] leading-snug">
                    {analysis.turkologyNote}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs text-teal-950 space-y-1">
                  <span className="text-[9px] font-black uppercase text-teal-800 tracking-wider">
                    🇰🇿 Kültürel Bağlam & Gelenek
                  </span>
                  <p className="text-[11px] leading-snug">
                    {analysis.culturalInsight}
                  </p>
                </div>
              </div>

            </div>
          )}

          {!analysis && !isLoading && (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto text-2xl">
                🧠
              </div>
              <h4 className="text-xs font-black text-slate-800">
                Kazakça cümlenizi yapay zeka ile derinlemesine tahlil edin
              </h4>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Yukarıdaki alana bir cümle yazıp "AI ile Tahlil Et" butonuna basarak kök, ek, ses uyumu ve fonetik çözümlemesini anında görün.
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="text-[11px] font-medium">
            Uzaktan Türkolog • Yapay Zeka Destekli Morfoloji Çözümleyicisi
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
