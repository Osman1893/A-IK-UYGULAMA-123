import React, { useState, useMemo } from 'react';
import { Sparkles, Volume2, ChevronDown, ChevronUp, Check, RotateCcw } from 'lucide-react';
import { audioService } from '../../services/audioService';

interface SuffixResult {
  title: string;
  kzTitle: string;
  suffix: string;
  fullWord: string;
  ruleExplanation: string;
  exampleMeaning: string;
}

export const KazakhVowelHarmonySimulator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [inputWord, setInputWord] = useState('Бала');

  const presets = [
    { word: 'Бала', tr: 'Çocuk' },
    { word: 'Мектеп', tr: 'Okul' },
    { word: 'Үй', tr: 'Ev' },
    { word: 'Кітап', tr: 'Kitap' },
    { word: 'Дос', tr: 'Arkadaş' },
    { word: 'Қала', tr: 'Şehir' },
    { word: 'Көз', tr: 'Göz' },
    { word: 'Жұмыс', tr: 'İş' },
    { word: 'Ұстаз', tr: 'Öğretmen' },
    { word: 'Аспан', tr: 'Gökyüzü' }
  ];

  // Phonetic analysis
  const analysis = useMemo(() => {
    const clean = inputWord.trim();
    if (!clean) return null;

    const lower = clean.toLowerCase();
    
    // Vowels
    const hardVowels = ['а', 'о', 'ұ', 'ы', 'я']; // Жуан
    const softVowels = ['ә', 'ө', 'ү', 'і', 'е', 'и', 'э']; // Жіңішке
    
    // Find last vowel
    let lastVowel = '';
    let isHard = true;
    for (let i = lower.length - 1; i >= 0; i--) {
      const char = lower[i];
      if (hardVowels.includes(char)) {
        lastVowel = char;
        isHard = true;
        break;
      }
      if (softVowels.includes(char)) {
        lastVowel = char;
        isHard = false;
        break;
      }
    }

    // Default if no vowel found (fallback)
    if (!lastVowel) {
      lastVowel = 'а';
      isHard = true;
    }

    const lastChar = lower[lower.length - 1];
    const isVowelEnding = [...hardVowels, ...softVowels].includes(lastChar);
    
    // Consonant categories
    const voiceless = ['п', 'ф', 'к', 'қ', 'т', 'с', 'ш', 'щ', 'х', 'ц', 'ч']; // Қатаң
    const voiced = ['б', 'в', 'г', 'ғ', 'д', 'ж', 'з']; // Ұяң
    const sonor = ['л', 'м', 'н', 'ң', 'р', 'й', 'у']; // Үнді
    const nasals = ['м', 'н', 'ң'];

    let consonantType: 'vowel' | 'voiceless' | 'voiced' | 'sonor' = 'vowel';
    if (!isVowelEnding) {
      if (voiceless.includes(lastChar)) {
        consonantType = 'voiceless';
      } else if (voiced.includes(lastChar)) {
        consonantType = 'voiced';
      } else {
        consonantType = 'sonor';
      }
    }

    // Calculate suffixes
    // 1. Plural (Көптік)
    let pluralSuffix = '';
    if (isVowelEnding || lastChar === 'р' || lastChar === 'й' || lastChar === 'у') {
      pluralSuffix = isHard ? 'лар' : 'лер';
    } else if (lastChar === 'ж' || lastChar === 'з' || nasals.includes(lastChar)) {
      pluralSuffix = isHard ? 'дар' : 'дер';
    } else {
      pluralSuffix = isHard ? 'тар' : 'тер';
    }

    // 2. Dative (Барыс - Yönelme)
    let dativeSuffix = '';
    if (consonantType === 'voiceless') {
      dativeSuffix = isHard ? 'қа' : 'ке';
    } else {
      dativeSuffix = isHard ? 'ға' : 'ге';
    }

    // 3. Locative (Жатыс - Bulunma)
    let locativeSuffix = '';
    if (consonantType === 'voiceless') {
      locativeSuffix = isHard ? 'та' : 'те';
    } else {
      locativeSuffix = isHard ? 'да' : 'де';
    }

    // 4. Ablative (Шығыс - Ayrılma)
    let ablativeSuffix = '';
    if (nasals.includes(lastChar)) {
      ablativeSuffix = isHard ? 'нан' : 'нен';
    } else if (consonantType === 'voiceless') {
      ablativeSuffix = isHard ? 'тан' : 'тен';
    } else {
      ablativeSuffix = isHard ? 'дан' : 'ден';
    }

    // 5. Genitive (Ілік - İlgi)
    let genitiveSuffix = '';
    if (isVowelEnding) {
      genitiveSuffix = isHard ? 'ның' : 'нің';
    } else if (consonantType === 'voiceless') {
      genitiveSuffix = isHard ? 'тың' : 'тің';
    } else {
      genitiveSuffix = isHard ? 'дың' : 'дің';
    }

    // 6. Question Particle (Сұраулық шылау)
    let questionSuffix = '';
    if (isVowelEnding || nasals.includes(lastChar)) {
      questionSuffix = isHard ? 'ма' : 'ме';
    } else if (consonantType === 'voiceless') {
      questionSuffix = isHard ? 'па' : 'пе';
    } else {
      questionSuffix = isHard ? 'ба' : 'бе';
    }

    const suffixes: SuffixResult[] = [
      {
        title: 'Çoğul Eki (Көптік)',
        kzTitle: 'Көптік жалғау',
        suffix: `-${pluralSuffix}`,
        fullWord: `${clean}-${pluralSuffix}`,
        ruleExplanation: isHard ? 'Kalın ses uyumu (Жуан)' : 'İnce ses uyumu (Жіңішке)',
        exampleMeaning: 'Çoğul biçimi'
      },
      {
        title: 'Yönelme Hâli (Барыс)',
        kzTitle: 'Барыс септік (-a/-e)',
        suffix: `-${dativeSuffix}`,
        fullWord: `${clean}-${dativeSuffix}`,
        ruleExplanation: consonantType === 'voiceless' ? 'Sert ünsüzden sonra sert ek (-қа/-ке)' : 'Ötümlü veya ünlüden sonra (-ға/-ге)',
        exampleMeaning: '...e doğru / yönelme'
      },
      {
        title: 'Bulunma Hâli (Жатыс)',
        kzTitle: 'Жатыс септік (-de/-da)',
        suffix: `-${locativeSuffix}`,
        fullWord: `${clean}-${locativeSuffix}`,
        ruleExplanation: consonantType === 'voiceless' ? 'Sert ünsüzden sonra (-та/-те)' : 'Yumuşak veya ünlüden sonra (-да/-де)',
        exampleMeaning: '...de / üzerinde'
      },
      {
        title: 'Ayrılma Hâli (Шығыс)',
        kzTitle: 'Шығыс септік (-den/-dan)',
        suffix: `-${ablativeSuffix}`,
        fullWord: `${clean}-${ablativeSuffix}`,
        ruleExplanation: nasals.includes(lastChar) ? 'Geniz sesinden sonra (-нан/-нен)' : consonantType === 'voiceless' ? 'Sert ünsüzden sonra (-тан/-тен)' : 'Yumuşak/ünlüden sonra (-дан/-ден)',
        exampleMeaning: '...den / ayrılma'
      },
      {
        title: 'İlgi Hâli (Ілік)',
        kzTitle: 'Ілік септік (-in/-ın)',
        suffix: `-${genitiveSuffix}`,
        fullWord: `${clean}-${genitiveSuffix}`,
        ruleExplanation: isVowelEnding ? 'Ünlüden sonra (-ның/-нің)' : consonantType === 'voiceless' ? 'Sert ünsüzden sonra (-тың/-тің)' : 'Ötümlü ünsüzden sonra (-дың/-дің)',
        exampleMeaning: '...in / tamlayan'
      },
      {
        title: 'Soru Edatı (Сұраулық)',
        kzTitle: 'Сұраулық шылау (mı/mi)',
        suffix: questionSuffix,
        fullWord: `${clean} ${questionSuffix}?`,
        ruleExplanation: isVowelEnding || nasals.includes(lastChar) ? 'Ünlü ve geniz sonrası (ма/ме)' : consonantType === 'voiceless' ? 'Sert ünsüz sonrası (па/пе)' : 'Ötümlü ünsüz sonrası (ба/бе)',
        exampleMeaning: 'Soru biçimi'
      }
    ];

    return {
      word: clean,
      lastVowel,
      isHard,
      lastChar,
      isVowelEnding,
      consonantType,
      suffixes
    };
  }, [inputWord]);

  const handleSpeak = (text: string) => {
    // Strip hyphens and question marks for natural speech
    const cleanForSpeech = text.replace(/-/g, '').replace(/\?/g, '');
    audioService.speak(cleanForSpeech, 'kk', 0.85);
  };

  return (
    <div className="bg-white rounded-3xl border border-teal-200/90 shadow-2xs overflow-hidden">
      {/* Top Banner Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="px-5 py-3.5 bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-900 text-white flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-amber-300 font-black text-sm shrink-0">
            <Sparkles className="w-4 h-4 fill-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.2 rounded-full bg-amber-400 text-slate-950">
                İNTERAKTİF ARAÇ
              </span>
              <span className="text-xs font-black text-white">
                Bozkır Ünlü Uyumu & Ek Sihirbazı
              </span>
            </div>
            <p className="text-[11px] text-teal-200 font-medium">
              Үндестік заңы • Kazakça kelimelerin doğru hâl, çoğul ve soru eklerini anında türetin
            </p>
          </div>
        </div>

        <div className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-teal-200">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Expandable Simulator Body */}
      {isOpen && (
        <div className="p-4 space-y-4">
          
          {/* Preset Buttons & Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
              <span>Kelime Yazın veya Örnek Seçin:</span>
              <span className="text-[10px] text-teal-700 font-semibold">Kiril veya Türkçe karakter destekli</span>
            </label>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                placeholder="Örn: Бала, Мектеп, Үй, Дос..."
                className="flex-1 px-3.5 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
              />
              <button
                onClick={() => setInputWord('Бала')}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition"
                title="Sıfırla"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-[10px] font-bold text-slate-400 shrink-0">Hızlı Örnekler:</span>
              {presets.map((p) => (
                <button
                  key={p.word}
                  onClick={() => setInputWord(p.word)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    inputWord.trim().toLowerCase() === p.word.toLowerCase()
                      ? 'bg-teal-600 text-white shadow-2xs'
                      : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80'
                  }`}
                >
                  <span>{p.word}</span>
                  <span className="text-[9px] opacity-70 ml-1">({p.tr})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Phonetic Breakdown Indicator */}
          {analysis && (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-slate-800">
                  Kök: <span className="text-teal-700 font-mono text-sm">{analysis.word}</span>
                </span>
                
                {/* Vowel Harmony Tag */}
                <span className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                  analysis.isHard
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-teal-100 text-teal-900 border border-teal-300'
                }`}>
                  {analysis.isHard ? '🐪 Жуан (Kalın Ünlü): ' : '🌿 Жіңішке (İnce Ünlü): '} 
                  <span className="uppercase underline ml-0.5">{analysis.lastVowel}</span>
                </span>

                {/* Ending Sound Tag */}
                <span className="px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-800 font-bold text-[10px]">
                  Son Harf: <span className="font-mono">{analysis.lastChar}</span> ({
                    analysis.isVowelEnding 
                      ? 'Ünlü' 
                      : analysis.consonantType === 'voiceless' 
                        ? 'Sert Ünsüz' 
                        : 'Yumuşak/Ötümlü'
                  })
                </span>
              </div>

              <button
                onClick={() => handleSpeak(analysis.word)}
                className="px-2.5 py-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold flex items-center gap-1 transition shadow-2xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Kökü Dinle</span>
              </button>
            </div>
          )}

          {/* Generated Suffix Grid */}
          {analysis && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
              {analysis.suffixes.map((s, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-white border border-teal-100/90 hover:border-teal-400 hover:shadow-xs transition space-y-2 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-black uppercase text-teal-700 tracking-wider">
                        {s.title}
                      </span>
                      <h4 className="text-xs font-bold text-slate-700">
                        {s.kzTitle}
                      </h4>
                    </div>
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-black bg-amber-100 text-amber-900">
                      {s.suffix}
                    </span>
                  </div>

                  {/* Derived Full Word with Audio */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-teal-50/70 border border-teal-100/80">
                    <div>
                      <div className="text-sm font-black text-slate-900 font-mono tracking-tight group-hover:text-teal-700 transition">
                        {s.fullWord}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {s.exampleMeaning}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSpeak(s.fullWord)}
                      className="p-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-2xs active:scale-95 transition"
                      title="Seslendir"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-tight">
                    💡 {s.ruleExplanation}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
};
