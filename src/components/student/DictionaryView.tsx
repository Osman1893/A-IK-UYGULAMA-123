import React, { useState } from 'react';
import { 
  Search, 
  Volume2, 
  Check, 
  Bookmark, 
  Flag, 
  AlertCircle,
  Filter,
  BookOpen,
  Star,
  Dna,
  Zap
} from 'lucide-react';
import { VocabItem, UserProfile } from '../../types';
import { audioService, AudioPlaybackSpeed } from '../../services/audioService';
import { storageService } from '../../services/storageService';
import { SuffixAnalyzerModal } from '../common/SuffixAnalyzerModal';
import { FlashcardPracticeModal } from './FlashcardPracticeModal';

interface DictionaryViewProps {
  vocabulary: VocabItem[];
  user: UserProfile;
  onToggleMastery: (wordId: string, mastered: boolean) => void;
  onToggleFavorite?: (wordId: string) => void;
  onReportError: (word: VocabItem) => void;
}

export const DictionaryView: React.FC<DictionaryViewProps> = ({
  vocabulary,
  user,
  onToggleMastery,
  onToggleFavorite,
  onReportError
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [useLatinScript, setUseLatinScript] = useState(false);
  const [audioSpeed, setAudioSpeedState] = useState<AudioPlaybackSpeed>(audioService.getAudioSpeed());
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);
  const [selectedWordForAnalysis, setSelectedWordForAnalysis] = useState<string | undefined>(undefined);
  const [isFavoriteQuizOpen, setIsFavoriteQuizOpen] = useState(false);

  const handleCycleSpeed = () => {
    let next: AudioPlaybackSpeed = 1.0;
    if (audioSpeed === 0.75) next = 1.0;
    else if (audioSpeed === 1.0) next = 1.25;
    else if (audioSpeed === 1.25) next = 1.5;
    else next = 0.75;

    audioService.setAudioSpeed(next);
    setAudioSpeedState(next);
  };

  const favoriteIds = user.favoriteWordIds || [];
  const favoriteCount = favoriteIds.length;

  const categories = ['all', 'favorites', ...Array.from(new Set(vocabulary.map(v => v.category)))];

  const filteredWords = vocabulary.filter(w => {
    let matchesCategory = true;
    if (selectedCategory === 'favorites') {
      matchesCategory = favoriteIds.includes(w.id);
    } else if (selectedCategory !== 'all') {
      matchesCategory = w.category === selectedCategory;
    }

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

        <div className="flex items-center gap-1.5">
          {/* Audio Speed Toggle (0.75x, 1.0x, 1.25x, 1.5x) */}
          <button
            onClick={handleCycleSpeed}
            className={`text-xs font-bold px-2.5 py-1 rounded-xl transition flex items-center gap-1 cursor-pointer ${
              audioSpeed !== 1.0
                ? 'bg-amber-100 text-amber-900 border border-amber-300 font-black shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Seslendirme hızı (0.75x, 1.0x, 1.25x, 1.5x)"
          >
            <span>⚡ {audioSpeed}x</span>
            <span className="hidden sm:inline text-[10px]">
              {audioSpeed === 0.75 ? 'Yavaş' : audioSpeed === 1.0 ? 'Normal' : audioSpeed === 1.25 ? 'Hızlı' : 'Çok Hızlı'}
            </span>
          </button>

          {/* Latin / Cyrillic Toggle */}
          <button
            onClick={() => setUseLatinScript(!useLatinScript)}
            className="text-xs font-bold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
          >
            {useLatinScript ? 'Latin (Latyn)' : 'Kiril (Кирилл)'}
          </button>
        </div>
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

      {/* Favori & Zor Kelimeler Pratik Başlatıcı Kartı */}
      {favoriteCount > 0 && (
        <div className="p-3 bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-teal-500/10 border border-amber-300/80 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs shrink-0">
              <Star className="w-4 h-4 fill-slate-950" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">
                Zorlandığım Kelimeler ({favoriteCount})
              </h4>
              <p className="text-[10px] text-slate-600">
                Yıldızladığınız bu kelimeleri unutmamak için hemen flaş kart testi yapın.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFavoriteQuizOpen(true)}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-xs transition shrink-0 flex items-center gap-1 active:scale-95 cursor-pointer"
          >
            <span>Pratik Yap</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 select-none">
        {categories.map(cat => {
          const isFavTab = cat === 'favorites';
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                isSelected 
                  ? isFavTab 
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-black' 
                    : 'bg-teal-600 text-white shadow-xs' 
                  : isFavTab
                    ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 font-extrabold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isFavTab ? (
                <>
                  <Star className={`w-3.5 h-3.5 ${isSelected ? 'fill-slate-950 text-slate-950' : 'fill-amber-400 text-amber-500'}`} />
                  <span>Favori Kelimelerim</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? 'bg-slate-950 text-amber-300' : 'bg-amber-200 text-amber-900'
                  }`}>
                    {favoriteCount}
                  </span>
                </>
              ) : cat === 'all' ? (
                'Tümü / Барлығы'
              ) : (
                cat
              )}
            </button>
          );
        })}
      </div>

      {/* Word Cards List */}
      <div className="space-y-3">
        {filteredWords.map((word) => {
          const isMastered = user.masteredWordIds.includes(word.id);
          const isFavorite = favoriteIds.includes(word.id);

          return (
            <div
              key={word.id}
              className={`bg-white p-4 rounded-2xl border transition ${
                isFavorite 
                  ? 'border-amber-300 shadow-xs ring-1 ring-amber-200/50' 
                  : 'border-slate-200 shadow-2xs hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">
                      {useLatinScript ? word.kazakhLatin : word.kazakhCyrillic}
                    </h3>
                    <button
                      onClick={() => audioService.speak(word.kazakhCyrillic, 'kk')}
                      className="p-1 rounded-lg text-teal-600 hover:bg-teal-50 transition cursor-pointer"
                      title="Dinle"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    {isFavorite && (
                      <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-200">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
                        <span>Zor Kelime</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-xs font-bold text-teal-700">
                      {word.turkish}
                    </p>
                    <button
                      onClick={() => audioService.speak(word.turkish, 'tr')}
                      className="p-1 rounded text-slate-400 hover:text-teal-700 hover:bg-teal-50 transition cursor-pointer"
                      title="Türkçe Telaffuzu Dinle"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Badges and Actions */}
                <div className="flex items-center gap-1">
                  {/* Suffix Analyzer Quick Trigger */}
                  <button
                    onClick={() => {
                      setSelectedWordForAnalysis(word.kazakhCyrillic);
                      setIsAnalyzerOpen(true);
                      audioService.playFeedbackSound('click');
                    }}
                    className="p-1.5 rounded-xl border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    title="Bozkır Morfolojisi: Ek ve Kök Tahlili Yap"
                  >
                    <Dna className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[10px]">Ek Tahlili</span>
                  </button>

                  {/* Star / Favorite Button */}
                  <button
                    onClick={() => {
                      if (onToggleFavorite) {
                        onToggleFavorite(word.id);
                      } else {
                        storageService.toggleFavoriteWord(word.id);
                      }
                      audioService.playFeedbackSound('click');
                    }}
                    className={`p-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      isFavorite
                        ? 'bg-amber-50 border-amber-300 text-amber-600 hover:bg-amber-100 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-200 hover:bg-amber-50/50'
                    }`}
                    title={isFavorite ? 'Favori Kelimelerimden Çıkar' : 'Favori Kelimelerime Ekle (Zorlandığım Kelime)'}
                  >
                    <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                  </button>

                  <button
                    onClick={() => onReportError(word)}
                    className="p-1 text-slate-300 hover:text-rose-500 rounded-md transition cursor-pointer"
                    title="Hatalı Çeviri Bildir"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onToggleMastery(word.id, !isMastered)}
                    className={`p-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      isMastered 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                    title={isMastered ? 'Öğrenildi olarak işaretli' : 'Öğrenildi olarak işaretle'}
                  >
                    {isMastered ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Example sentences with authentic native pronunciation */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] space-y-1 text-slate-600">
                <div className="font-semibold text-slate-800 flex items-center justify-between">
                  <span>🇰🇿 {word.exampleKazakh}</span>
                  <button 
                    onClick={() => audioService.speak(word.exampleKazakh, 'kk')}
                    className="p-1 text-teal-600 hover:text-teal-800 transition cursor-pointer"
                    title="Kazakça Cümleyi Dinle"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>🇹🇷 {word.exampleTurkish}</span>
                  <button 
                    onClick={() => audioService.speak(word.exampleTurkish, 'tr')}
                    className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                    title="Türkçe Cümleyi Dinle"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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
          selectedCategory === 'favorites' ? (
            <div className="text-center py-10 px-4 bg-white rounded-3xl border border-dashed border-amber-200 shadow-2xs space-y-2.5">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shadow-xs">
                <Star className="w-6 h-6 fill-amber-300" />
              </div>
              <h4 className="text-sm font-black text-slate-800">Henüz Favori Kelime Eklenmedi</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Zorlandığınız veya pekiştirmek istediğiniz kelimelerin yanındaki yıldız (<span className="text-amber-500 font-bold">★</span>) butonuna basarak bu listeye ekleyebilir, dilediğiniz an pratik yapabilirsiniz.
              </p>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-slate-300 text-xs text-slate-500">
              Aranan kriterlere uygun kelime bulunamadı.
            </div>
          )
        )}
      </div>

      {/* Suffix Analyzer Modal */}
      <SuffixAnalyzerModal
        isOpen={isAnalyzerOpen}
        onClose={() => setIsAnalyzerOpen(false)}
        initialWord={selectedWordForAnalysis}
        onEarnXp={(xp: number) => {
          storageService.addXp(xp);
        }}
      />

      {/* Favorite Words Practice Modal */}
      <FlashcardPracticeModal
        isOpen={isFavoriteQuizOpen}
        onClose={() => setIsFavoriteQuizOpen(false)}
        vocabulary={storageService.getFavoriteVocabulary()}
        lessonTitle="⭐ Zorlandığım Kelimeler Alıştırması"
        userDirection={user.currentDirection}
        onEarnXp={(xp: number) => {
          storageService.addXp(xp);
        }}
        onToggleMastery={onToggleMastery}
      />

    </div>
  );
};
