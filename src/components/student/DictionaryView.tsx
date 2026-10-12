import React, { useState } from 'react';
import { 
  Search, 
  Volume2, 
  Check, 
  Bookmark, 
  Flag, 
  AlertCircle,
  Filter,
  BookOpen
} from 'lucide-react';
import { VocabItem, UserProfile } from '../../types';
import { audioService } from '../../services/audioService';

interface DictionaryViewProps {
  vocabulary: VocabItem[];
  user: UserProfile;
  onToggleMastery: (wordId: string, mastered: boolean) => void;
  onReportError: (word: VocabItem) => void;
}

export const DictionaryView: React.FC<DictionaryViewProps> = ({
  vocabulary,
  user,
  onToggleMastery,
  onReportError
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [useLatinScript, setUseLatinScript] = useState(false);

  const categories = ['all', ...Array.from(new Set(vocabulary.map(v => v.category)))];

  const filteredWords = vocabulary.filter(w => {
    const matchesCategory = selectedCategory === 'all' || w.category === selectedCategory;
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      w.kazakhCyrillic.toLowerCase().includes(term) ||
      w.kazakhLatin.toLowerCase().includes(term) ||
      w.turkish.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-12">
      
      {/* Title & Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <span>SÖZLÜK VE KELİME DAĞARCIĞI</span>
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">
            Сөздік және лексикалық қор ({vocabulary.length} kelime kayıtlı)
          </p>
        </div>

        {/* Latin / Cyrillic Toggle */}
        <button
          onClick={() => setUseLatinScript(!useLatinScript)}
          className="text-xs font-bold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
        >
          {useLatinScript ? 'Latin (Latyn)' : 'Kiril (Кирилл)'}
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Kazakça veya Türkçe kelime ara... / Сөз іздеу..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 select-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 text-xs font-bold rounded-xl whitespace-nowrap transition ${
              selectedCategory === cat 
                ? 'bg-teal-600 text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat === 'all' ? 'Tümü / Барлығы' : cat}
          </button>
        ))}
      </div>

      {/* Word Cards List */}
      <div className="space-y-3">
        {filteredWords.map((word) => {
          const isMastered = user.masteredWordIds.includes(word.id);
          return (
            <div
              key={word.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">
                      {useLatinScript ? word.kazakhLatin : word.kazakhCyrillic}
                    </h3>
                    <button
                      onClick={() => audioService.speak(word.kazakhCyrillic, 'kk')}
                      className="p-1 rounded-lg text-teal-600 hover:bg-teal-50 transition"
                      title="Dinle"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs font-bold text-teal-700 mt-0.5">
                    {word.turkish}
                  </p>
                </div>

                {/* Badges and Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onReportError(word)}
                    className="p-1 text-slate-300 hover:text-rose-500 rounded-md transition"
                    title="Hatalı Çeviri Bildir"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onToggleMastery(word.id, !isMastered)}
                    className={`p-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
                      isMastered 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {isMastered ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Example sentences */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] space-y-0.5 text-slate-600">
                <div className="font-semibold text-slate-800">🇰🇿 {word.exampleKazakh}</div>
                <div>🇹🇷 {word.exampleTurkish}</div>
              </div>

              {/* False friend warning */}
              {word.falseFriendWarning && (
                <div className="mt-2 p-2 bg-amber-50 rounded-xl border border-amber-200 text-[10px] text-amber-900 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{word.falseFriendWarning}</span>
                </div>
              )}
            </div>
          );
        })}

        {filteredWords.length === 0 && (
          <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-slate-300 text-xs text-slate-500">
            Aranan kriterlere uygun kelime bulunamadı.
          </div>
        )}
      </div>

    </div>
  );
};
