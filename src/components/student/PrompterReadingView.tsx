import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Type, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  HelpCircle,
  Tv,
  Eye,
  Sliders,
  AlignLeft,
  ChevronDown
} from 'lucide-react';
import { audioService } from '../../services/audioService';
import { READING_STORIES, ReadingStory } from '../../data/readingStories';

export const PrompterReadingView: React.FC = () => {
  const [selectedStoryId, setSelectedStoryId] = useState<string>('story-a1-1');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'prompter' | 'story'>('prompter');

  // Prompter Play & Scroll states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(2); // 1 = yavaş, 2 = normal, 3 = hızlı, 4 = çok hızlı
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [showTurkish, setShowTurkish] = useState<boolean>(true);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeSpeakingLine, setActiveSpeakingLine] = useState<number | null>(null);

  // Comprehension quiz states in Story mode
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizChecked, setQuizChecked] = useState<boolean>(false);

  const prompterRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(isPlaying);
  const speedRef = useRef<number>(scrollSpeed);

  isPlayingRef.current = isPlaying;
  speedRef.current = scrollSpeed;

  const filteredStories = READING_STORIES.filter(s => 
    selectedLevelFilter === 'all' || s.level === selectedLevelFilter
  );

  const currentStory = READING_STORIES.find(s => s.id === selectedStoryId) || READING_STORIES[0];

  // High-Performance requestAnimationFrame Scroll Engine (Fixes scrolling bug)
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const scrollLoop = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlayingRef.current && prompterRef.current) {
        // Speed scaling in pixels per second:
        // 1: 30 px/s, 2: 60 px/s, 3: 100 px/s, 4: 155 px/s
        const speedMap: Record<number, number> = { 1: 30, 2: 60, 3: 100, 4: 155 };
        const pxPerSec = speedMap[speedRef.current] || 60;

        scrollPosRef.current += pxPerSec * delta;
        prompterRef.current.scrollTop = Math.floor(scrollPosRef.current);

        // Update progress bar
        const maxScroll = prompterRef.current.scrollHeight - prompterRef.current.clientHeight;
        if (maxScroll > 0) {
          const progress = Math.min(100, Math.round((prompterRef.current.scrollTop / maxScroll) * 100));
          setScrollProgress(progress);
        }

        // Auto stop at the very end
        if (prompterRef.current.scrollTop >= maxScroll - 4 && maxScroll > 10) {
          setIsPlaying(false);
        }
      }

      animationFrameId = requestAnimationFrame(scrollLoop);
    };

    animationFrameId = requestAnimationFrame(scrollLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Sync scrollPosRef when user manually scrolls or touches the container
  const handleUserScroll = () => {
    if (prompterRef.current) {
      scrollPosRef.current = prompterRef.current.scrollTop;
      const maxScroll = prompterRef.current.scrollHeight - prompterRef.current.clientHeight;
      if (maxScroll > 0) {
        setScrollProgress(Math.min(100, Math.round((prompterRef.current.scrollTop / maxScroll) * 100)));
      }
    }
  };

  const handleTogglePlay = () => {
    if (!isPlaying && prompterRef.current) {
      // If at end, loop back to start
      const maxScroll = prompterRef.current.scrollHeight - prompterRef.current.clientHeight;
      if (prompterRef.current.scrollTop >= maxScroll - 5) {
        prompterRef.current.scrollTop = 0;
        scrollPosRef.current = 0;
      } else {
        scrollPosRef.current = prompterRef.current.scrollTop;
      }
    }
    setIsPlaying(!isPlaying);
    audioService.playFeedbackSound('click');
  };

  const handleReset = () => {
    setIsPlaying(false);
    if (prompterRef.current) {
      prompterRef.current.scrollTop = 0;
      scrollPosRef.current = 0;
      setScrollProgress(0);
    }
    audioService.playFeedbackSound('click');
  };

  const handlePlayVoice = (text?: string, lineIdx?: number) => {
    const textToRead = text || currentStory.contentKz;
    if (lineIdx !== undefined) setActiveSpeakingLine(lineIdx);
    audioService.speak(textToRead, 'kk', 0.84);
  };

  const handleSelectStory = (id: string) => {
    setSelectedStoryId(id);
    handleReset();
    setQuizAnswers({});
    setQuizChecked(false);
  };

  const handleAnswerQuiz = (qIdx: number, opt: string) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: opt }));
  };

  const paragraphsKz = currentStory.contentKz.split('\n\n').filter(Boolean);
  const paragraphsTr = currentStory.contentTr.split('\n\n').filter(Boolean);

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-white min-h-full pb-14">
      
      {/* Top Header Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 shrink-0 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                <span>KAYAN METİN & OKUMA STÜDYOSU</span>
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              </h2>
              <p className="text-[10px] text-slate-400">
                A1-C1 Zengin Hikaye Kütüphanesi & Teleprompter Eğitmeni
              </p>
            </div>
          </div>

          {/* Mode Switcher: Prompter vs Story Book */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-xs font-bold">
            <button
              onClick={() => {
                setViewMode('prompter');
                handleReset();
              }}
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'prompter'
                  ? 'bg-teal-600 text-white shadow-xs font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Prompter</span>
            </button>
            <button
              onClick={() => {
                setViewMode('story');
                setIsPlaying(false);
              }}
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'story'
                  ? 'bg-teal-600 text-white shadow-xs font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Hikaye</span>
            </button>
          </div>
        </div>

        {/* Level Filters (A1, A2, B1, B2, C1) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {['all', 'A1', 'A2', 'B1', 'B2', 'C1'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedLevelFilter(lvl)}
              className={`px-2.5 py-1 text-[10px] font-black rounded-lg transition shrink-0 ${
                selectedLevelFilter === lvl
                  ? 'bg-teal-500 text-slate-950 font-black shadow-xs'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {lvl === 'all' ? 'Tüm Hikayeler (20)' : `${lvl} Seviyesi`}
            </button>
          ))}
        </div>
      </div>

      {/* Story Selector Dropdown Bar */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1">
          {filteredStories.map(story => (
            <button
              key={story.id}
              onClick={() => handleSelectStory(story.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition border shrink-0 text-left ${
                selectedStoryId === story.id
                  ? 'bg-teal-500/20 border-teal-500 text-teal-300 ring-1 ring-teal-500/30'
                  : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-[10px] font-mono text-teal-400 mr-1.5 font-black">[{story.level}]</span>
              <span>{story.titleTr}</span>
            </button>
          ))}
        </div>
      </div>

      {/* PROMPTER MODE */}
      {viewMode === 'prompter' ? (
        <div className="flex-1 flex flex-col p-3 sm:p-4 gap-3 max-w-3xl mx-auto w-full">
          
          {/* Prompter Control Toolbar */}
          <div className="bg-slate-800/90 border border-slate-700/80 p-2.5 rounded-2xl flex items-center justify-between gap-2 shadow-lg shrink-0">
            
            {/* Play, Pause, Rewind, Audio */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePlay}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 font-black text-xs transition shadow-md active:scale-95 ${
                  isPlaying
                    ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 animate-pulse'
                    : 'bg-teal-500 hover:bg-teal-600 text-white'
                }`}
                title={isPlaying ? 'Durdur' : 'Yazıyı Akıt (Başlat)'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'DURAKLAT' : 'AKITMAYI BAŞLAT'}</span>
              </button>

              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition"
                title="Başa Dön"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => handlePlayVoice()}
                className="p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-teal-400 transition"
                title="Sesli Dinle"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Scroll Speed Controls (1, 2, 3, 4) */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 pl-1.5 font-bold hidden sm:inline">Hız:</span>
              {[
                { s: 1, label: '1x' },
                { s: 2, label: '2x' },
                { s: 3, label: '3x' },
                { s: 4, label: '4x' }
              ].map(({ s, label }) => (
                <button
                  key={s}
                  onClick={() => {
                    setScrollSpeed(s);
                    audioService.playFeedbackSound('click');
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                    scrollSpeed === s 
                      ? 'bg-teal-500 text-slate-950 font-black' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Font Size & Turkish Toggle */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFontSize(fontSize === 'sm' ? 'md' : fontSize === 'md' ? 'lg' : 'sm')}
                className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-xs font-bold transition"
                title="Yazı Boyutu"
              >
                <Type className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowTurkish(!showTurkish)}
                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black border transition ${
                  showTurkish
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                    : 'bg-slate-700 text-slate-400 border-transparent hover:text-white'
                }`}
              >
                Çeviri
              </button>
            </div>

          </div>

          {/* Live Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-teal-400 h-1.5 transition-all duration-200"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>

          {/* TELEPROMPTER VIEWPORT (Guaranteed Scroll with Bounded Height) */}
          <div className="relative bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6 flex flex-col h-[460px] sm:h-[520px]">
            
            {/* Center Guided Focus Laser Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-teal-500/35 z-20 pointer-events-none flex items-center justify-between px-3">
              <span className="text-[9px] font-mono text-teal-300 uppercase tracking-widest bg-slate-900/95 px-2 py-0.5 rounded border border-teal-500/30">
                ▶ OKUMA ODAK ÇİZGİSİ
              </span>
              <span className="text-[9px] font-mono text-slate-400 bg-slate-900/90 px-1.5 py-0.5 rounded">
                %{scrollProgress}
              </span>
            </div>

            {/* Active Scrolling Container (scrollBehavior: auto guarantees no animation blockage) */}
            <div
              ref={prompterRef}
              onScroll={handleUserScroll}
              className="h-full overflow-y-scroll space-y-10 py-36 select-none no-scrollbar"
              style={{ scrollBehavior: 'auto' }}
            >
              {/* Story Header Banner */}
              <div className="text-center space-y-2 pb-4 border-b border-slate-800">
                <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-[10px] font-black uppercase rounded-full border border-teal-500/30">
                  {currentStory.levelLabel} • {currentStory.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
                  {currentStory.titleKz}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {currentStory.titleTr}
                </p>
                <p className="text-[11px] text-teal-300/80 italic">
                  « {currentStory.subtitle} »
                </p>
              </div>

              {/* Story Paragraphs in Prompter */}
              {paragraphsKz.map((paraKz, pIdx) => {
                const paraTr = paragraphsTr[pIdx] || '';
                return (
                  <div key={pIdx} className="space-y-3 text-center">
                    <p
                      className={`font-bold tracking-wide leading-relaxed text-slate-100 hover:text-teal-300 transition ${
                        fontSize === 'sm' ? 'text-base' : fontSize === 'md' ? 'text-xl' : 'text-2xl'
                      }`}
                    >
                      {paraKz}
                    </p>

                    {showTurkish && paraTr && (
                      <p className="text-slate-400 text-xs italic leading-relaxed max-w-xl mx-auto pt-1 border-t border-slate-900">
                        🇹🇷 {paraTr}
                      </p>
                    )}
                  </div>
                );
              })}

              {/* End of Text Spacer */}
              <div className="h-32 flex flex-col items-center justify-center space-y-2 border-t border-slate-900">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <span className="text-xs font-mono text-slate-500">
                  • Metin Başarıyla Tamamlandı • Мәтін аяқталды •
                </span>
                <button
                  onClick={handleReset}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition"
                >
                  Başa Sar ve Tekrar Oku
                </button>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* STORY BOOK & READING COMPREHENSION MODE */
        <div className="flex-1 p-4 max-w-3xl mx-auto w-full space-y-6 overflow-y-auto">
          
          {/* Story Title & Meta Card */}
          <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-lg border border-teal-500/20">
                {currentStory.levelLabel}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {currentStory.wordCount} Kelime • ~{currentStory.readingMinutes} dk okuma
              </span>
            </div>

            <h2 className="text-xl font-black text-amber-400 tracking-tight">
              {currentStory.titleKz}
            </h2>
            <p className="text-sm font-semibold text-slate-300 mt-0.5">
              {currentStory.titleTr}
            </p>
            <p className="text-xs text-teal-200/80 mt-1">
              {currentStory.subtitle}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between">
              <button
                onClick={() => handlePlayVoice()}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm"
              >
                <Volume2 className="w-4 h-4" />
                <span>Hikayeyi Baştan Sona Sesli Dinle</span>
              </button>

              <button
                onClick={() => {
                  setViewMode('prompter');
                  setIsPlaying(true);
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition"
              >
                <Tv className="w-4 h-4 text-teal-400" />
                <span>Prompterda Oku</span>
              </button>
            </div>
          </div>

          {/* Bilingual Paragraphs */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              HİKAYE METNİ VE CÜMLE ÇÖZÜMLEMELERİ
            </h3>

            {paragraphsKz.map((paraKz, pIdx) => {
              const paraTr = paragraphsTr[pIdx] || '';
              return (
                <div 
                  key={pIdx} 
                  className="bg-slate-800/60 border border-slate-700/70 p-4 rounded-2xl space-y-2 hover:border-teal-500/40 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-base font-bold text-slate-100 leading-relaxed">
                      {paraKz}
                    </p>
                    <button
                      onClick={() => handlePlayVoice(paraKz, pIdx)}
                      className="p-1.5 rounded-lg bg-slate-700 hover:bg-teal-600 text-teal-300 hover:text-white transition shrink-0"
                      title="Bu paragrafı dinle"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-700/50">
                    🇹🇷 {paraTr}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Key Vocabulary Chips */}
          {currentStory.vocabulary.length > 0 && (
            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>HİKAYEDE GEÇEN ÖNEMLİ KELİMELER & KELİME DAĞARCIĞI</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentStory.vocabulary.map((vocab, vIdx) => (
                  <div key={vIdx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black text-amber-300">{vocab.kz}</div>
                      <div className="text-[11px] text-slate-300 font-medium">{vocab.tr}</div>
                      {vocab.note && <div className="text-[9px] text-teal-400/80 italic">{vocab.note}</div>}
                    </div>
                    <button
                      onClick={() => audioService.speak(vocab.kz, 'kk', 0.85)}
                      className="p-1 text-slate-500 hover:text-teal-400 transition"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reading Comprehension Questions */}
          {currentStory.questions.length > 0 && (
            <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>OKUDUĞUNU ANLAMA ALIŞTIRMALARI (СҰРАҚ-ЖАУАП)</span>
              </h3>

              <div className="space-y-4">
                {currentStory.questions.map((q, qIdx) => {
                  const selected = quizAnswers[qIdx];
                  const isAnswered = Boolean(selected);
                  const isCorrect = selected === q.correctAnswer;

                  return (
                    <div key={qIdx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                      <p className="text-xs font-bold text-slate-100">
                        {qIdx + 1}. {q.question}
                      </p>

                      <div className="space-y-1.5">
                        {q.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => handleAnswerQuiz(qIdx, opt)}
                            className={`w-full p-2.5 rounded-xl text-left text-xs font-medium transition flex items-center justify-between ${
                              selected === opt
                                ? 'bg-teal-600 text-white font-bold ring-2 ring-teal-400'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            }`}
                          >
                            <span>{opt}</span>
                            {selected === opt && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </button>
                        ))}
                      </div>

                      {quizChecked && isAnswered && (
                        <div className={`p-2.5 rounded-xl text-xs font-medium ${
                          isCorrect ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' : 'bg-rose-950/80 text-rose-300 border border-rose-800'
                        }`}>
                          <p className="font-bold">{isCorrect ? '✓ Doğru Cevap!' : '✗ Yanlış Cevap'}</p>
                          <p className="text-[11px] mt-0.5">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setQuizChecked(true);
                    audioService.playFeedbackSound('complete');
                  }}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition"
                >
                  Cevapları Kontrol Et
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
