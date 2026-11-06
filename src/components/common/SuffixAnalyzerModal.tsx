import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Search, 
  Sparkles, 
  Volume2, 
  ArrowRight, 
  BookOpen, 
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import { SuffixAnalysisResult } from '../../types';
import { storageService } from '../../services/storageService';
import { audioService } from '../../services/audioService';

interface SuffixAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWord?: string;
  onEarnXp?: (xp: number) => void;
}

const PRESET_EXAMPLES = [
  'Достарымызға',
  'Мектепте',
  'Балалардың',
  'Қазақша',
  'Достарым'
];

export const SuffixAnalyzerModal: React.FC<SuffixAnalyzerModalProps> = ({
  isOpen,
  onClose,
  initialWord = 'Достарымызға',
  onEarnXp
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(initialWord);
  const [analysis, setAnalysis] = useState<SuffixAnalysisResult>(() => 
    storageService.analyzeKazakhWord(initialWord)
  );

  if (!isOpen) return null;

  const handleAnalyze = (word: string) => {
    const clean = word.trim();
    if (!clean) return;
    setSearchTerm(clean);
    const res = storageService.analyzeKazakhWord(clean);
    setAnalysis(res);
    storageService.advanceDailyQuest('vocab', 1);
    if (onEarnXp) onEarnXp(5);
    audioService.playFeedbackSound('click');
  };

  const segmentColors: Record<string, { bg: string; text: string; border: string }> = {
    root: { bg: 'bg-teal-100', text: 'text-teal-950', border: 'border-teal-300' },
    plural: { bg: 'bg-emerald-100', text: 'text-emerald-900', border: 'border-emerald-300' },
    possessive: { bg: 'bg-amber-100', text: 'text-amber-900', border: 'border-amber-300' },
    case: { bg: 'bg-rose-100', text: 'text-rose-900', border: 'border-rose-300' },
    derivational: { bg: 'bg-cyan-100', text: 'text-cyan-900', border: 'border-cyan-300' },
    tense: { bg: 'bg-teal-50', text: 'text-teal-900', border: 'border-teal-300' },
    person: { bg: 'bg-sky-100', text: 'text-sky-900', border: 'border-sky-300' }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-teal-100 animate-in zoom-in-95 space-y-4 p-5 sm:p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-700 text-white flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.2 rounded-full border border-teal-200">
                  TÜRKOLOJİ MORFOLOJİ MERKEZİ
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900">
                Kazakça Ek & Kök Çözümleyici
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search / Input Box */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            Kelime Girin veya Örnek Seçin:
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze(searchTerm)}
                placeholder="Örn: Достарымызға, Мектепте..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-teal-500 focus:outline-none transition"
              />
            </div>
            <button
              onClick={() => handleAnalyze(searchTerm)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-black rounded-xl shadow-xs transition active:scale-95 shrink-0 cursor-pointer"
            >
              Çözümle
            </button>
          </div>

          {/* Preset Word Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] font-bold text-slate-400">Hazır Örnekler:</span>
            {PRESET_EXAMPLES.map((word) => (
              <button
                key={word}
                onClick={() => handleAnalyze(word)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition cursor-pointer ${
                  analysis.originalWord.toLowerCase() === word.toLowerCase()
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Morphological Breakdown Display */}
        <div className="p-4 bg-gradient-to-br from-slate-50 to-teal-50/30 rounded-2xl border border-teal-100 space-y-4">
          {/* Main Word Banner */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Tahlil Edilen Kelime
              </span>
              <div className="text-xl font-black text-slate-900 mt-0.5 flex items-center gap-2">
                <span>{analysis.originalWord}</span>
                <button
                  onClick={() => audioService.speak(analysis.originalWord, 'kk')}
                  className="p-1 rounded-full bg-teal-100 hover:bg-teal-200 text-teal-800 transition cursor-pointer"
                  title="Seslendir"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Türkçe Karşılığı
              </span>
              <span className="text-sm font-black text-teal-700">
                {analysis.comparativeTurkish}
              </span>
            </div>
          </div>

          {/* Visual Suffix Segments (Colored Blocks) */}
          <div className="space-y-2">
            <span className="text-xs font-black text-slate-800 block">
              Ek ve Kök Sıralaması (Aglutinatif Zincir):
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {analysis.segments.map((seg, idx) => {
                const colors = segmentColors[seg.type] || segmentColors.root;
                return (
                  <div
                    key={idx}
                    className={`px-3 py-2 rounded-xl border-2 ${colors.bg} ${colors.text} ${colors.border} shadow-2xs text-center flex-1 min-w-[70px]`}
                  >
                    <span className="text-xs font-black block">{seg.text}</span>
                    <span className="text-[9px] font-bold opacity-80 block truncate">
                      {seg.nameTr.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comparative Table: Root, Suffix, Function */}
          <div className="space-y-2 pt-2 border-t border-slate-200/60">
            <span className="text-xs font-black text-slate-800 block">
              Detaylı Morfolojik Açıklamalar:
            </span>
            <div className="space-y-2">
              {analysis.segments.map((seg, idx) => {
                const colors = segmentColors[seg.type] || segmentColors.root;
                return (
                  <div key={idx} className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs flex items-start gap-2.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black shrink-0 ${colors.bg} ${colors.text}`}>
                      {seg.text}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-900">{seg.nameTr} ({seg.nameKz})</span>
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                          TR: {seg.turkishEquivalent}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {seg.explanationTr}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Linguistic Rule Callout */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
            <div className="font-black flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Türkoloji Dil Kuralı (Bitişkenlik / Aglutinasyon):</span>
            </div>
            <p className="leading-relaxed">
              Kazakça ve Türkiye Türkçesi aynı ekleme dizilimine sahiptir: <br />
              <strong className="text-slate-900">KÖK + ÇOĞUL EKİ + İYELİK EKİ + HAL EKİ</strong> <br />
              (Örn: <em>Дос-тар-ымыз-ға</em> ↔ <em>Dost-lar-ımız-a</em>)
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl transition"
          >
            Tamam / Жабу
          </button>
        </div>

      </div>
    </div>
  );
};
