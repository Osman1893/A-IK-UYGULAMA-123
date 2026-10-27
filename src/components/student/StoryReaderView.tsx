import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  Volume2, 
  Sparkles, 
  Check, 
  HelpCircle, 
  Bookmark, 
  Search, 
  ChevronRight, 
  RotateCcw, 
  Sliders, 
  Moon, 
  Sun, 
  FileText, 
  Type, 
  Plus, 
  CheckCircle2, 
  X,
  Mic,
  Share2,
  Tv
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { READING_STORIES, ReadingStory, StoryVocabItem, StoryQuestion } from '../../data/readingStories';
import { audioService, LUVVOICE_PERSONAS, LuvVoicePersona } from '../../services/audioService';
import { storageService } from '../../services/storageService';
import { AlageyikMascot } from '../common/AlageyikMascot';
import { UserProfile } from '../../types';

interface StoryReaderViewProps {
  user: UserProfile;
  onEarnXp?: (xp: number) => void;
  onNavigatePrompter?: () => void;
}

// Built-in contextual morphological dictionary for instant word lookup
const MORPHO_DICTIONARY: Record<string, { tr: string; root: string; pos: string; grammarTip?: string }> = {
  // Common Kazakh story words and roots
  'алматы': { tr: 'Almatı (Elmalı)', root: 'Алматы', pos: 'Özel İsim', grammarTip: 'Kazakistan\'ın tarihi ve kültürel başkenti' },
  'алматыда': { tr: 'Almatı\'da', root: 'Алматы', pos: 'İsim + Bulunma Hali (-da)', grammarTip: '-da/-de bulunma hali eki' },
  'алматының': { tr: 'Almatı\'nın', root: 'Алматы', pos: 'İsim + İlgi Hali (-ның)', grammarTip: '-ның/-нің iyelik ve tamlayan eki' },
  'алатау': { tr: 'Aladağlar', root: 'Алатау', pos: 'Özel İsim', grammarTip: 'Tiyanşan dağ silsilesi' },
  'медеу': { tr: 'Medeu zirvesi', root: 'Медеу', pos: 'Özel İsim', grammarTip: 'Dünyanın en yüksek açık hava buz pateni pisti' },
  'сәлеметсіз': { tr: 'Esen misiniz / Merhaba', root: 'Сәлемет', pos: 'Selamlaşma', grammarTip: 'Saygılı merhaba kalıbı' },
  'атым': { tr: 'Adım', root: 'Ат (Ad)', pos: 'İsim + 1. Tekil İyelik (-ым)', grammarTip: '-ım eki benim anlamına gelir' },
  'досым': { tr: 'Arkadaşım / Dostum', root: 'Дос (Dost)', pos: 'İsim + İyelik (-ым)', grammarTip: 'Kazakçada dost/arkadaş' },
  'бауырым': { tr: 'Kardeşim / Canım', root: 'Бауыр (Bağır/Kardeş)', pos: 'Hitap', grammarTip: 'Kazak kültüründe derin kardeşlik hitabı' },
  'қош': { tr: 'Hoş', root: 'Қош', pos: 'Zarf', grammarTip: 'Қош келдіңіз = Hoş geldiniz' },
  'келдіңіз': { tr: 'Geldiniz', root: 'Кел (Gelmek)', pos: 'Fiil + Geçmiş Zaman', grammarTip: '-діңіз saygılı geçmiş zaman eki' },
  'әдемі': { tr: 'Güzel / Zarif', root: 'Әдемі', pos: 'Sıfat', grammarTip: 'Kazakçada güzellik sıfatı' },
  'таза': { tr: 'Temiz / Saf', root: 'Таза', pos: 'Sıfat', grammarTip: 'Ortak Türk dili kelimesi' },
  'биік': { tr: 'Yüksek', root: 'Биік', pos: 'Sıfat', grammarTip: 'Türkiye Türkçesindeki «büyük/yüksek» kökteşi' },
  'таулар': { tr: 'Dağlar', root: 'Тау (Dağ)', pos: 'İsim + Çoğul (-лар)', grammarTip: 'Kıpçak ses değişimi: Dağ ➔ Taw' },
  'таудың': { tr: 'Dağın', root: 'Тау', pos: 'İsim + Tamlayan (-дың)', grammarTip: '-дың ilgi durumu eki' },
  'қар': { tr: 'Kar', root: 'Қар', pos: 'İsim', grammarTip: 'Ortak Türkçe' },
  'ауа': { tr: 'Hava', root: 'Ауа', pos: 'İsim', grammarTip: 'Arapça hewa kökenli' },
  'рахмет': { tr: 'Teşekkür ederim', root: 'Рахмет', pos: 'Nezaket sözü', grammarTip: 'Kazakçada teşekkür sözü' },
  'адамдар': { tr: 'İnsanlar', root: 'Адам', pos: 'İsim + Çoğul', grammarTip: 'İnsanlar topluluğu' },
  'қызықты': { tr: 'İlginç / Eğlenceli', root: 'Қызық', pos: 'Sıfat', grammarTip: '-ты eki sıfat yapım ekidir' },
  'базар': { tr: 'Pazar / Çarşı', root: 'Базар', pos: 'İsim', grammarTip: 'Alışveriş yeri' },
  'алма': { tr: 'Elma', root: 'Алма', pos: 'İsim', grammarTip: 'Almatı şehri adını elmadan almıştır' },
  'құрт': { tr: 'Kurut (Kurutulmuş yoğurt)', root: 'Құрт', pos: 'İsim', grammarTip: 'Geleneksel bozkır kalsiyum gıdası' },
  'бауырсақ': { tr: 'Bavursak (Kızarmış hamur)', root: 'Бауырсақ', pos: 'İsim', grammarTip: 'Kazak sofralarının bereketi' },
  'аңыз': { tr: 'Efsane / Destan', root: 'Аңыз', pos: 'İsim', grammarTip: 'Halk mitolojisi ve rivayet' },
  'киіз': { tr: 'Keçe', root: 'Киіз', pos: 'İsim', grammarTip: 'Bozkır çadırının ana yalıtım maddesi' },
  'үй': { tr: 'Ev / Çadır', root: 'Үй', pos: 'İsim', grammarTip: 'Kiyiz üy = Keçe çadır / Yurt' },
  'шаңырақ': { tr: 'Şanırak (Çadırın kubbe çemberi)', root: 'Шаңырақ', pos: 'Kutsal Sembol', grammarTip: 'Kazak bayrağında ve armasında yer alan birlik simgesi' },
  'қонақ': { tr: 'Misafir / Konuk', root: 'Қонақ', pos: 'İsim', grammarTip: 'Konakası = Misafire verilen ziyafet' },
  'қонақжай': { tr: 'Misafirperver', root: 'Қонақжай', pos: 'Sıfat', grammarTip: 'Kazak halkının en yüce erdemi' },
  'ақсақал': { tr: 'Aksakal / Bilge dede', root: 'Ақсақал', pos: 'İsim', grammarTip: 'Toplumun tecrübeli önderi' },
  'бәйге': { tr: 'Bozkır at yarışı', root: 'Бәйге', pos: 'Geleneksel Spor', grammarTip: 'Uzun mesafe at yarışı' },
  'көкпар': { tr: 'Kökbörü / Kökpar', root: 'Көкпар', pos: 'Atlı Spor', grammarTip: 'Oğlak kapmaca oyunu' },
  'домбыра': { tr: 'Dombra', root: 'Домбыра', pos: 'Müzik Aleti', grammarTip: 'Kazak ruhunun iki telli sazı' },
  'қобыз': { tr: 'Kopuz', root: 'Қобыз', pos: 'Kutsal Çalgı', grammarTip: 'Korkut Ata\'nın icat ettiği yaylı saz' },
  'күй': { tr: 'Küy (Dombra bestesi)', root: 'Күй', pos: 'Sanat', grammarTip: 'Sözsüz derin ezgi' },
  'алагеяк': { tr: 'Alageyik (Kutsal Geyik)', root: 'Алагеяк', pos: 'Mitolojik Varlık', grammarTip: 'Türk destanlarında yol gösterici varlık' },
  'сығын': { tr: 'Erkek geyik / Sıgun', root: 'Сығын', pos: 'İsim', grammarTip: 'Kutsal geyik motifi' },
  'марал': { tr: 'Dişi geyik / Maral', root: 'Марал', pos: 'İsim', grammarTip: 'Asalet ve zarafet simgesi' },
  'тәңір': { tr: 'Gök Tanrı / Tengri', root: 'Тәңір', pos: 'İnanç', grammarTip: 'Eski Türk inancı' },
  'батыр': { tr: 'Bahadır / Kahraman', root: 'Батыр', pos: 'Unvan', grammarTip: 'Yiğit savaşçı' },
  'дала': { tr: 'Bozkır / Ova', root: 'Дала', pos: 'Coğrafya', grammarTip: 'Ulı Dala = Ulu Bozkır' }
};

export const StoryReaderView: React.FC<StoryReaderViewProps> = ({
  user,
  onEarnXp,
  onNavigatePrompter
}) => {
  const [selectedStoryId, setSelectedStoryId] = useState<string>('story-mytho-alageyik');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Reading Mode Customizations
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'sepia'>('sepia');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [translationDisplay, setTranslationDisplay] = useState<'hidden' | 'parallel' | 'interlinear'>('parallel');
  
  // Interactive Word Popup Modal
  const [activeWordPopup, setActiveWordPopup] = useState<{
    cleanWord: string;
    rawWord: string;
    translation: string;
    root: string;
    pos: string;
    grammarTip?: string;
    latin: string;
  } | null>(null);

  // Audio Playback
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<LuvVoicePersona>(audioService.getKazakhPersona());
  const [savedWords, setSavedWords] = useState<string[]>([]);
  
  // Reading Comprehension Quiz States
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Filtered stories
  const filteredStories = READING_STORIES.filter(s => {
    const matchLevel = levelFilter === 'all' || s.level === levelFilter;
    const matchCat = categoryFilter === 'all' || s.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchSearch = searchQuery === '' || 
      s.titleTr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.titleKz.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contentKz.toLowerCase().includes(searchQuery.toLowerCase());
    return matchLevel && matchCat && matchSearch;
  });

  const currentStory: ReadingStory = 
    READING_STORIES.find(s => s.id === selectedStoryId) || 
    READING_STORIES[0];

  // Clean word helper
  const cleanWordForLookup = (word: string): string => {
    return word
      .toLowerCase()
      .replace(/[«»„“"'.:,!?;()—–\-]/g, '')
      .trim();
  };

  // Handle word click/tap: Displays instant morphological card
  const handleWordClick = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const clean = cleanWordForLookup(word);
    if (!clean) return;

    audioService.playFeedbackSound('click');

    // Look up in dictionary or story vocabulary
    const dictMatch = MORPHO_DICTIONARY[clean];
    const storyMatch = currentStory.vocabulary.find(v => cleanWordForLookup(v.kz) === clean);

    let translation = 'Çeviri aranıyor...';
    let root = clean;
    let pos = 'Kelime';
    let grammarTip: string | undefined = undefined;

    if (dictMatch) {
      translation = dictMatch.tr;
      root = dictMatch.root;
      pos = dictMatch.pos;
      grammarTip = dictMatch.grammarTip;
    } else if (storyMatch) {
      translation = storyMatch.tr;
      root = storyMatch.kz;
      pos = 'Hikaye Sözlüğü';
      grammarTip = storyMatch.note;
    } else {
      // Basic morphological suffix decomposition heuristics
      if (clean.endsWith('да') || clean.endsWith('де') || clean.endsWith('та') || clean.endsWith('те')) {
        translation = `${clean.slice(0, -2)} içinde / yerinde`;
        grammarTip = 'Bulunma durumu eki (-da/-de, -ta/-te)';
        pos = 'İsim + Bulunma Hali';
      } else if (clean.endsWith('ға') || clean.endsWith('ге') || clean.endsWith('қа') || clean.endsWith('ке')) {
        translation = `${clean.slice(0, -2)} yönüne / -e/-a`;
        grammarTip = 'Yönelme durumu eki (-ğa/-ge, -qa/-ke)';
        pos = 'İsim + Yönelme Hali';
      } else if (clean.endsWith('ның') || clean.endsWith('нің') || clean.endsWith('дың') || clean.endsWith('дің')) {
        translation = `${clean.slice(0, -3)} aitliği / -ın/-in`;
        grammarTip = 'İlgi durumu eki (Genitif)';
        pos = 'İsim + İlgi Hali';
      } else if (clean.endsWith('лар') || clean.endsWith('лер') || clean.endsWith('дар') || clean.endsWith('дер')) {
        translation = `${clean.slice(0, -3)} (Çoğul)`;
        grammarTip = 'Çoğul eki (-lar/-ler)';
        pos = 'Çoğul İsim';
      } else {
        translation = `${word} (Bağlam tercümesi)`;
        pos = 'Öğrenilen Kelime';
      }
    }

    // Latin script conversion
    const latin = clean
      .replace(/ә/g, 'ä').replace(/і/g, 'i').replace(/ң/g, 'ñ')
      .replace(/ғ/g, 'ğ').replace(/ү/g, 'ü').replace(/ұ/g, 'u')
      .replace(/қ/g, 'q').replace(/ө/g, 'ö').replace(/һ/g, 'h');

    setActiveWordPopup({
      cleanWord: clean,
      rawWord: word,
      translation,
      root,
      pos,
      grammarTip,
      latin
    });

    // Pronounce the word with LuvVoice Daulet/Aigul
    audioService.speak(clean, 'kk', 0.85);
  };

  // Add word to user vocabulary
  const handleSaveWord = () => {
    if (!activeWordPopup) return;
    const newSaved = [...savedWords, activeWordPopup.cleanWord];
    setSavedWords(newSaved);
    audioService.playFeedbackSound('complete');
    
    // Add XP for learning a new word
    if (onEarnXp) {
      onEarnXp(5);
    }
  };

  // Play full paragraph or sentence
  const handlePlayParagraph = async (text: string, index: number) => {
    setIsPlayingAudio(true);
    setActiveSentenceIndex(index);
    audioService.playFeedbackSound('click');
    await audioService.speak(text, 'kk', 0.86);
    setIsPlayingAudio(false);
    setActiveSentenceIndex(null);
  };

  // Voice Persona Changer
  const handleVoicePersonaChange = (persona: LuvVoicePersona) => {
    setSelectedVoice(persona);
    audioService.setKazakhPersona(persona);
    audioService.playFeedbackSound('click');
    const p = LUVVOICE_PERSONAS.find(x => x.id === persona);
    audioService.speakWithPersona(`Сәлем! Мен ${p?.name.split(' ')[0]} дауысымын. Оқуға дайынбыз!`, persona);
  };

  // Check Reading Comprehension Quiz
  const handleCheckQuiz = () => {
    if (!currentStory.questions || currentStory.questions.length === 0) return;
    
    let correct = 0;
    currentStory.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / currentStory.questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);

    if (score >= 70) {
      audioService.playFeedbackSound('complete');
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      if (onEarnXp) {
        onEarnXp(25);
      }
    } else {
      audioService.playFeedbackSound('wrong');
    }
  };

  // Reset quiz when story changes
  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setActiveWordPopup(null);
  }, [selectedStoryId]);

  // Theme styles
  const themeClasses = {
    light: 'bg-white text-slate-900 border-slate-200',
    dark: 'bg-slate-950 text-slate-100 border-slate-800',
    sepia: 'bg-[#FBF0D9] text-[#433422] border-[#E8D7B8]'
  }[themeMode];

  const fontClasses = {
    sm: 'text-sm leading-relaxed',
    md: 'text-base sm:text-lg leading-loose',
    lg: 'text-lg sm:text-xl leading-loose',
    xl: 'text-xl sm:text-2xl leading-loose'
  }[fontSize];

  // Split story into paragraphs
  const paragraphsKz = currentStory.contentKz.split('\n\n').filter(p => p.trim());
  const paragraphsTr = currentStory.contentTr.split('\n\n').filter(p => p.trim());

  return (
    <div className="min-h-screen bg-slate-100/70 pb-20">
      
      {/* Top Reading Room Header */}
      <div className="bg-slate-900 text-white px-4 py-3.5 sticky top-0 z-30 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xl shadow-md">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-white">
                  KİTAPLIK & İNTERAKTİF OKUMA
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  Kelimeye Dokun & Çevir
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Metindeki her kelimeye dokunarak anında anlamını ve okunuşunu öğrenin
              </p>
            </div>
          </div>

          {/* Quick Prompter Link & Voice Controls */}
          <div className="flex items-center gap-2">
            {onNavigatePrompter && (
              <button
                onClick={onNavigatePrompter}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 transition"
                title="Kayan Prompter Moduna Geç"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Prompter Modu</span>
              </button>
            )}

            {/* LuvVoice Selector Dropdown Button */}
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-xl border border-slate-700 text-xs">
              <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">Ses:</span>
              <select
                value={selectedVoice}
                onChange={(e) => handleVoicePersonaChange(e.target.value as LuvVoicePersona)}
                className="bg-transparent text-amber-400 font-black text-xs outline-none cursor-pointer"
              >
                <option value="kk-Daulet" className="bg-slate-900 text-white">👨 Daulet (Doğal Bozkır)</option>
                <option value="kk-Aigul" className="bg-slate-900 text-white">👩 Aigul (Zarif Aksan)</option>
                <option value="tr-Ahmet" className="bg-slate-900 text-white">👨 Ahmet (Türkçe)</option>
                <option value="tr-Emel" className="bg-slate-900 text-white">👩 Emel (Türkçe)</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto p-3 sm:p-4 space-y-4">
        
        {/* Alageyik Mascot Reading Guide */}
        <div className="p-3.5 bg-gradient-to-r from-amber-50 via-white to-teal-50 border border-amber-200/80 rounded-3xl shadow-sm">
          <AlageyikMascot
            pose="studying"
            size="sm"
            message="Kelimelerin üzerine dokunarak anında kök ve ek tahlilini gör!"
            subMessage="Bozkırın hikayelerini okurken bilmediğin kelimelere tıkla; LuvVoice aksanı ile dinle ve kelime defterine kaydet."
          />
        </div>

        {/* Story Selector Carousel & Filter Bar */}
        <div className="bg-white p-3.5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-violet-600" />
              <span>Hikaye Koleksiyonu ({filteredStories.length} Eser)</span>
            </h2>

            {/* Level Selector */}
            <div className="flex items-center gap-1 text-[11px] font-bold">
              {['all', 'A1', 'A2', 'B1', 'B2', 'C1'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl)}
                  className={`px-2 py-0.5 rounded-lg transition ${
                    levelFilter === lvl
                      ? 'bg-violet-600 text-white font-black'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lvl === 'all' ? 'Tümü' : lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Hikaye, yazar, efsane veya kelime ara..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Story Card Horizontal Slider */}
          <div className="flex gap-2.5 overflow-x-auto pb-1 pt-1 select-none">
            {filteredStories.map((story) => (
              <button
                key={story.id}
                onClick={() => setSelectedStoryId(story.id)}
                className={`p-3 rounded-2xl border text-left transition shrink-0 w-60 sm:w-64 flex flex-col justify-between shadow-2xs ${
                  selectedStoryId === story.id
                    ? 'border-violet-600 bg-violet-50/80 ring-2 ring-violet-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="px-2 py-0.2 rounded-md bg-violet-100 text-violet-800 text-[10px] font-black">
                      {story.level}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      ⏱ {story.readingMinutes} dk • {story.wordCount} kelime
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900 line-clamp-1">
                    {story.titleTr}
                  </h4>
                  <p className="text-[10px] text-teal-800 font-bold line-clamp-1 mt-0.5">
                    {story.titleKz}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{story.category}</span>
                  {selectedStoryId === story.id && (
                    <span className="text-violet-700 font-black flex items-center gap-0.5">
                      <span>Açık</span>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

        </div>

        {/* Story Reading Toolbar (Font Size, Theme, Parallel Display) */}
        <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Display Mode Toggle */}
          <div className="flex items-center gap-1.5 font-bold">
            <span className="text-[11px] text-slate-500">Görünüm:</span>
            <button
              onClick={() => setTranslationDisplay('parallel')}
              className={`px-2.5 py-1 rounded-xl text-[11px] transition ${
                translationDisplay === 'parallel'
                  ? 'bg-violet-600 text-white font-black'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              İki Dilli (Paragraf)
            </button>
            <button
              onClick={() => setTranslationDisplay('hidden')}
              className={`px-2.5 py-1 rounded-xl text-[11px] transition ${
                translationDisplay === 'hidden'
                  ? 'bg-violet-600 text-white font-black'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Sadece Kazakça
            </button>
          </div>

          {/* Theme & Font Size Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
              <button
                onClick={() => setThemeMode('light')}
                className={`p-1.5 rounded-lg transition ${themeMode === 'light' ? 'bg-white text-amber-600 shadow-xs' : 'text-slate-500'}`}
                title="Açık Mod"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setThemeMode('sepia')}
                className={`p-1.5 rounded-lg transition ${themeMode === 'sepia' ? 'bg-[#EBD5B3] text-[#5C3D10] font-black shadow-xs' : 'text-slate-500'}`}
                title="Sepya Kitap Kağıdı"
              >
                <span className="text-[11px] font-bold">Sepya</span>
              </button>
              <button
                onClick={() => setThemeMode('dark')}
                className={`p-1.5 rounded-lg transition ${themeMode === 'dark' ? 'bg-slate-900 text-amber-300 shadow-xs' : 'text-slate-500'}`}
                title="Koyu Gece Modu"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Font Size Toggle */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
              <span className="text-slate-400">Yazı:</span>
              {(['sm', 'md', 'lg', 'xl'] as const).map(sz => (
                <button
                  key={sz}
                  onClick={() => setFontSize(sz)}
                  className={`w-6 h-6 rounded-lg transition ${fontSize === sz ? 'bg-slate-900 text-white font-black' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  {sz === 'sm' ? 'S' : sz === 'md' ? 'M' : sz === 'lg' ? 'L' : 'XL'}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Active Story Book Paper Container */}
        <div className={`p-5 sm:p-8 rounded-3xl border shadow-lg transition-colors duration-200 ${themeClasses}`}>
          
          {/* Story Title & Meta */}
          <div className="border-b border-black/10 pb-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-violet-600 text-white text-[10px] font-extrabold uppercase tracking-wide">
                {currentStory.levelLabel}
              </span>
              <span className="text-xs font-semibold opacity-70">
                {currentStory.category} • {currentStory.readingMinutes} dk okuma
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
              {currentStory.titleKz}
            </h1>
            <h2 className="text-base sm:text-lg font-bold opacity-80 mt-1">
              {currentStory.titleTr}
            </h2>
            <p className="text-xs opacity-60 italic mt-1">
              «{currentStory.subtitle}»
            </p>
          </div>

          {/* Interactive Paragraphs with Word-by-Word Tap Tokens */}
          <div className={`space-y-6 ${fontClasses}`}>
            {paragraphsKz.map((paragraph, pIdx) => {
              const words = paragraph.split(/\s+/).filter(Boolean);
              const trParagraph = paragraphsTr[pIdx];

              return (
                <div key={pIdx} className="space-y-2.5 p-3 rounded-2xl hover:bg-black/5 transition">
                  
                  {/* Kazakh Paragraph with Clickable Words */}
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => handlePlayParagraph(paragraph, pIdx)}
                      className="p-1.5 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 text-violet-700 transition shrink-0 mt-1"
                      title="Bu paragrafı LuvVoice ile dinle"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <div className="flex-1 flex flex-wrap gap-x-1.5 gap-y-1 items-baseline">
                      {words.map((word, wIdx) => {
                        const clean = cleanWordForLookup(word);
                        const isSaved = savedWords.includes(clean);

                        return (
                          <span
                            key={wIdx}
                            onClick={(e) => handleWordClick(word, e)}
                            className={`cursor-pointer px-1 py-0.5 rounded-lg transition border border-transparent hover:border-violet-400 hover:bg-violet-100/60 active:scale-95 ${
                              isSaved ? 'underline decoration-amber-500 decoration-2 font-bold' : ''
                            }`}
                            title="Tercümesini ve sesletimini görmek için tıkla"
                          >
                            {word}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Parallel Turkish Translation */}
                  {translationDisplay === 'parallel' && trParagraph && (
                    <div className="pl-8 pt-1 text-xs sm:text-sm opacity-75 font-medium border-l-2 border-amber-400/60 italic leading-relaxed">
                      {trParagraph}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* Story Vocabulary Highlights List */}
          {currentStory.vocabulary && currentStory.vocabulary.length > 0 && (
            <div className="mt-8 pt-6 border-t border-black/10">
              <h3 className="text-xs font-black uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Bu Hikayedeki Önemli Kelimeler & Deyimler</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentStory.vocabulary.map((vocab, idx) => (
                  <div 
                    key={idx}
                    onClick={() => audioService.speak(vocab.kz, 'kk')}
                    className="p-2.5 rounded-xl bg-black/5 hover:bg-black/10 cursor-pointer transition flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-black">{vocab.kz}</span>
                      <span className="mx-1.5 opacity-60">➔</span>
                      <span className="font-semibold">{vocab.tr}</span>
                      {vocab.note && (
                        <p className="text-[10px] opacity-60 italic">{vocab.note}</p>
                      )}
                    </div>
                    <Volume2 className="w-3.5 h-3.5 opacity-60 hover:opacity-100 shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reading Comprehension Quiz Section */}
          {currentStory.questions && currentStory.questions.length > 0 && (
            <div className="mt-10 pt-6 border-t-2 border-dashed border-black/15">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-violet-600 text-white font-black flex items-center justify-center text-sm">
                    ?
                  </div>
                  <div>
                    <h3 className="text-sm font-black">
                      Okuduğunu Anlama Değerlendirmesi
                    </h3>
                    <p className="text-[11px] opacity-70">
                      Hikayeyi ne kadar anladınız? Cevaplayarak +25 XP kazanın.
                    </p>
                  </div>
                </div>

                {quizScore !== null && (
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${
                    quizScore >= 70 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                  }`}>
                    Skor: %{quizScore}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {currentStory.questions.map((q, qIdx) => (
                  <div key={qIdx} className="p-4 rounded-2xl bg-black/5 space-y-2.5 text-xs">
                    <p className="font-black text-slate-900 leading-snug">
                      {qIdx + 1}. {q.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => {
                        const isChosen = quizAnswers[qIdx] === opt;
                        const isCorrect = opt === q.correctAnswer;

                        let btnStyle = 'bg-white/80 border-slate-200 text-slate-800';
                        if (isChosen && !quizSubmitted) {
                          btnStyle = 'bg-violet-600 text-white font-bold';
                        } else if (quizSubmitted) {
                          if (isCorrect) {
                            btnStyle = 'bg-emerald-600 text-white font-bold';
                          } else if (isChosen && !isCorrect) {
                            btnStyle = 'bg-rose-600 text-white font-bold';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={quizSubmitted}
                            onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: opt }))}
                            className={`p-2.5 rounded-xl border text-left transition font-medium ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <p className="text-[11px] opacity-80 pt-1 italic font-medium">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                ))}

                {!quizSubmitted ? (
                  <button
                    disabled={Object.keys(quizAnswers).length < currentStory.questions.length}
                    onClick={handleCheckQuiz}
                    className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white font-black text-xs rounded-xl shadow-md transition"
                  >
                    Testi Tamamla ve Puanı Al
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                      setQuizScore(null);
                    }}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Soruları Yeniden Çöz</span>
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Instant Word-by-Word Translation Popover Modal */}
      {activeWordPopup && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-4">
            
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-violet-700 to-indigo-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase">
                  {activeWordPopup.pos}
                </span>
                <span className="text-[10px] text-violet-200 font-semibold">
                  Latin: {activeWordPopup.latin}
                </span>
              </div>
              <button 
                onClick={() => setActiveWordPopup(null)}
                className="p-1 rounded-full hover:bg-white/20 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Word Content */}
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    {activeWordPopup.cleanWord}
                  </h3>
                  <p className="text-base font-bold text-violet-700 mt-0.5">
                    {activeWordPopup.translation}
                  </p>
                </div>

                <button
                  onClick={() => audioService.speak(activeWordPopup.cleanWord, 'kk', 0.85)}
                  className="p-3 rounded-2xl bg-violet-100 hover:bg-violet-200 text-violet-700 transition shadow-xs"
                  title="Doğal Aksanla Dinle"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {activeWordPopup.grammarTip && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium leading-relaxed">
                  💡 <span className="font-bold">Gramer Analizi:</span> {activeWordPopup.grammarTip}
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  onClick={handleSaveWord}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-black text-xs transition shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Kelime Defterime Ekle</span>
                </button>
                <button
                  onClick={() => setActiveWordPopup(null)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  Kapat
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
