import React, { useState } from 'react';
import { Volume2, Sparkles, X, Activity, BookOpen, Search, Check } from 'lucide-react';
import { 
  audioService, 
  KAZAKH_PHONETIC_ATLAS, 
  ALL_42_KAZAKH_LETTERS,
  FullAlphabetLetter,
  KazakhPhoneticData
} from '../../services/audioService';

interface KazakhAlphabetVoiceGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KazakhAlphabetVoiceGuide: React.FC<KazakhAlphabetVoiceGuideProps> = ({
  isOpen,
  onClose
}) => {
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [tab, setTab] = useState<'special9' | 'all42'>('special9');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handlePlayLetter = async (char: string) => {
    setActiveLetter(char);
    audioService.playFeedbackSound('click');
    await audioService.speakKazakhLetterComplete(char);
    setActiveLetter(null);
  };

  const handlePlayAcousticFormant = async (char: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveLetter(char);
    await audioService.playAcousticPhoneme(char);
    setActiveLetter(null);
  };

  const filtered42Letters = ALL_42_KAZAKH_LETTERS.filter(l => 
    l.char.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.nameTr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.exampleKz.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-teal-200">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight">
                Akademik Kazakça Alfabe & Fonetik Seslendirici
              </h3>
              <p className="text-[10px] text-teal-200 font-medium">
                Doğru Harf Okunuşları, IPA Çözümlemesi ve Akustik Formant Sentezi
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle: 9 Özel Ses vs 42 Harf */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 shrink-0">
          <button
            onClick={() => setTab('special9')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              tab === 'special9'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>9 Özel Kazakça Harf (Ә, І, Ң, Ғ, Ү, Ұ, Қ, Ө, Һ)</span>
          </button>

          <button
            onClick={() => setTab('all42')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              tab === 'all42'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>42 Harfli Tam Alfabe</span>
          </button>
        </div>

        {/* Search for 42 letters */}
        {tab === 'all42' && (
          <div className="px-4 pt-3 pb-1 bg-white border-b border-slate-100 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Harf veya örnek kelime ara..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-slate-50/50">
          
          {tab === 'special9' ? (
            <div className="space-y-3">
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3 text-[11px] text-teal-900 leading-relaxed">
                <span className="font-bold">💡 Fonetik Kılavuz:</span> Kazak Türkçesinde Türkiye Türkçesinden farklı 9 özel ses bulunur. Harf kartına tıklayarak hem doğru telaffuzunu hem de örnek kelimesini dinleyebilirsiniz.
              </div>

              {KAZAKH_PHONETIC_ATLAS.map((item: KazakhPhoneticData) => (
                <div
                  key={item.letter}
                  onClick={() => handlePlayLetter(item.letter)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer bg-white hover:border-teal-400 shadow-2xs ${
                    activeLetter === item.letter 
                      ? 'border-teal-500 ring-2 ring-teal-500/20' 
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {/* Big Letter Tile */}
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-700 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-xs">
                        {item.letter}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-slate-900">
                            {item.nameTr}
                          </h4>
                          <span className="font-mono text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.2 rounded">
                            IPA: {item.ipa}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold">
                            Latin: {item.latin}
                          </span>
                        </div>

                        <p className="text-[11px] text-teal-700 font-semibold mt-0.5">
                          {item.nameKz}
                        </p>

                        <p className="text-[10px] text-slate-600 mt-1">
                          <span className="font-bold">Açıklama:</span> {item.articulatoryType}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                            Örnek: {item.exampleKz}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            ({item.exampleTr})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-1.5 shrink-0 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayLetter(item.letter);
                        }}
                        className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 transition"
                        title="Sesli Oku"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handlePlayAcousticFormant(item.letter, e)}
                        className="text-[9px] font-bold text-teal-600 hover:text-teal-800 px-1 py-0.5 rounded bg-slate-100"
                        title="Ham Formant Frekansı"
                      >
                        Akustik
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 42-Letter Complete Grid */
            <div className="space-y-3">
              <div className="text-[11px] text-slate-600 px-1">
                Kazak alfabesindeki 42 harfin tamamı. Tıklayarak harfi ve örnek kelimesini dinleyin:
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filtered42Letters.map((item: FullAlphabetLetter) => {
                  const isSpecial = ['Ә', 'І', 'Ң', 'Ғ', 'Ү', 'Ұ', 'Қ', 'Ө', 'Һ'].includes(item.char);
                  return (
                    <div
                      key={item.char}
                      onClick={() => handlePlayLetter(item.char)}
                      className={`p-2.5 rounded-2xl border transition cursor-pointer bg-white hover:border-teal-400 shadow-2xs flex items-center justify-between ${
                        activeLetter === item.char 
                          ? 'border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/40' 
                          : isSpecial 
                            ? 'border-teal-200 bg-teal-50/20' 
                            : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-base shrink-0 ${
                          isSpecial 
                            ? 'bg-teal-600 text-white shadow-xs' 
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {item.char}
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-xs font-black text-slate-900 flex items-center gap-1">
                            <span>{item.nameKz}</span>
                            {isSpecial && <span className="text-[8px] bg-amber-100 text-amber-800 px-1 rounded font-bold">ÖZEL</span>}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {item.exampleKz.split(' ')[0]}
                          </div>
                        </div>
                      </div>

                      <Volume2 className="w-4 h-4 text-slate-400 hover:text-teal-600 shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span className="font-semibold">
            {tab === 'special9' ? '9 Özel Harf Listelendi' : `${filtered42Letters.length} Harf Listelendi`}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition text-xs"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
