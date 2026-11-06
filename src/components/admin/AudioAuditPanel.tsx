import React, { useState, useEffect, useMemo } from 'react';
import { 
  Volume2, 
  Sparkles, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Play, 
  Loader2, 
  Mic, 
  Check, 
  BookOpen, 
  Activity, 
  Layers,
  ChevronDown,
  ChevronUp,
  DownloadCloud,
  FileAudio
} from 'lucide-react';
import { Unit, VocabItem, CefrLevel } from '../../types';
import { audioService, KAZAKH_PHONETIC_ATLAS } from '../../services/audioService';

export interface AudioAuditItem {
  id: string;
  type: 'special_letter' | 'alphabet' | 'vocab' | 'dialogue';
  level: CefrLevel | 'SPECIAL';
  kazakhText: string;
  latinText?: string;
  turkishText: string;
  category: string;
  unitTitle?: string;
  lessonTitle?: string;
  ipa?: string;
  code?: number;
}

interface AudioAuditPanelProps {
  units: Unit[];
}

export const AudioAuditPanel: React.FC<AudioAuditPanelProps> = ({ units }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedVoice, setSelectedVoice] = useState<'female' | 'male'>('female');

  // Inventory cache status from server: { [id]: { isAvailable: boolean, source: string, size: number } }
  const [inventory, setInventory] = useState<Record<string, { isAvailable: boolean; source: string; size: number }>>({});
  const [isCheckingInventory, setIsCheckingInventory] = useState(false);

  // Playback state
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Individual synthesis state
  const [synthesizingId, setSynthesizingId] = useState<string | null>(null);

  // Batch synthesis state
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; currentItem?: string }>({ current: 0, total: 0 });
  const [batchMessage, setBatchMessage] = useState<string | null>(null);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Compile all audio items across the entire platform
  const allAuditItems: AudioAuditItem[] = useMemo(() => {
    const items: AudioAuditItem[] = [];

    // 1. 9 Special Kazakh Letters
    KAZAKH_PHONETIC_ATLAS.forEach((item) => {
      items.push({
        id: `special-${item.letter}`,
        type: 'special_letter',
        level: 'SPECIAL',
        kazakhText: item.letter,
        latinText: item.latin,
        turkishText: `${item.nameTr} (${item.exampleTr})`,
        category: '9 Özel Harf',
        ipa: item.ipa,
        code: item.letter.charCodeAt(0)
      });
    });

    // 2. Vocabulary Items from all units & lessons
    units.forEach((unit) => {
      unit.lessons.forEach((lesson) => {
        lesson.vocabulary.forEach((v) => {
          items.push({
            id: `vocab-${v.id}`,
            type: 'vocab',
            level: unit.level,
            kazakhText: v.kazakhCyrillic,
            latinText: v.kazakhLatin,
            turkishText: v.turkish,
            category: v.category || 'Sözlük',
            unitTitle: `${unit.level} • ${unit.titleTr}`,
            lessonTitle: lesson.titleTr,
            ipa: v.phoneticGuide
          });
        });

        // 3. Dialogue lines
        if (lesson.dialogue && lesson.dialogue.lines) {
          lesson.dialogue.lines.forEach((line, idx) => {
            items.push({
              id: `dialogue-${lesson.id}-${idx}`,
              type: 'dialogue',
              level: unit.level,
              kazakhText: line.kazakh,
              turkishText: line.turkish,
              category: 'Ders Diyaloğu',
              unitTitle: `${unit.level} • ${unit.titleTr}`,
              lessonTitle: `${lesson.titleTr} (${line.speaker})`
            });
          });
        }
      });
    });

    return items;
  }, [units]);

  // Check audio inventory on mount or when units change
  const refreshInventory = async () => {
    setIsCheckingInventory(true);
    try {
      const itemsPayload = allAuditItems.map(item => ({
        id: item.id,
        text: item.kazakhText,
        lang: 'kk',
        voice: selectedVoice,
        code: item.code
      }));

      // Check in batches of 100 to avoid payload limit
      const batches = [];
      for (let i = 0; i < itemsPayload.length; i += 100) {
        batches.push(itemsPayload.slice(i, i + 100));
      }

      const mergedInventory: Record<string, { isAvailable: boolean; source: string; size: number }> = {};

      for (const batch of batches) {
        const res = await fetch('/api/admin/check-audio-inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: batch })
        });
        if (res.ok) {
          const data = await res.json();
          Object.assign(mergedInventory, data.inventory);
        }
      }

      setInventory(mergedInventory);
    } catch (err: any) {
      console.error('Inventory fetch failed:', err);
    } finally {
      setIsCheckingInventory(false);
    }
  };

  useEffect(() => {
    refreshInventory();
  }, [allAuditItems.length, selectedVoice]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return allAuditItems.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchKz = item.kazakhText.toLowerCase().includes(q);
        const matchTr = item.turkishText.toLowerCase().includes(q);
        const matchLatin = item.latinText?.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        if (!matchKz && !matchTr && !matchLatin && !matchCat) return false;
      }

      // Level
      if (levelFilter !== 'all') {
        if (item.level !== levelFilter) return false;
      }

      // Type
      if (typeFilter !== 'all') {
        if (item.type !== typeFilter) return false;
      }

      // Status
      if (statusFilter !== 'all') {
        const inv = inventory[item.id];
        const isReady = inv && inv.isAvailable;
        if (statusFilter === 'ready' && !isReady) return false;
        if (statusFilter === 'missing' && isReady) return false;
      }

      return true;
    });
  }, [allAuditItems, searchQuery, levelFilter, typeFilter, statusFilter, inventory]);

  // Statistics
  const totalCount = allAuditItems.length;
  const readyCount = allAuditItems.filter(i => inventory[i.id]?.isAvailable).length;
  const missingCount = totalCount - readyCount;
  const readyPercent = totalCount > 0 ? Math.round((readyCount / totalCount) * 100) : 0;

  // Play an item
  const handlePlayAudio = async (item: AudioAuditItem) => {
    setPlayingId(item.id);
    audioService.playFeedbackSound('click');
    try {
      if (item.type === 'special_letter') {
        await audioService.speakKazakhLetterComplete(item.kazakhText);
      } else {
        await audioService.speak(item.kazakhText, 'kk', 0.85);
      }
    } catch {
      // ignore
    } finally {
      setPlayingId(null);
    }
  };

  // Synthesize single item via Gemini API
  const handleSynthesizeSingle = async (item: AudioAuditItem) => {
    setSynthesizingId(item.id);
    setToastMessage({ text: `«${item.kazakhText}» için Gemini AI seslendirmesi üretiliyor...` });

    try {
      const res = await fetch('/api/admin/synthesize-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: item.kazakhText,
          lang: 'kk',
          voice: selectedVoice,
          code: item.code
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Seslendirme başarısız');
      }

      const result = await res.json();

      // Update local inventory immediately
      setInventory(prev => ({
        ...prev,
        [item.id]: {
          isAvailable: true,
          source: 'disk',
          size: result.sizeBytes
        }
      }));

      setToastMessage({ text: `✓ «${item.kazakhText}» Gemini AI stüdyo sesi başarıyla kaydedildi! (${result.sizeBytes} bayt)` });
      setTimeout(() => setToastMessage(null), 3500);

      // Immediately play the freshly generated audio
      await handlePlayAudio(item);
    } catch (err: any) {
      setToastMessage({ text: `Hata: ${err.message}`, isError: true });
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setSynthesizingId(null);
    }
  };

  // Batch Synthesize All Missing Items
  const handleBatchSynthesize = async () => {
    const missingItems = filteredItems.filter(i => !inventory[i.id]?.isAvailable);
    if (missingItems.length === 0) {
      alert('Seçili filtrelerde eksik ses dosyası bulunmuyor!');
      return;
    }

    if (!confirm(`${missingItems.length} adet eksik içerik Gemini AI ile arka planda seslendirilecek. Devam etmek istiyor musunuz?`)) {
      return;
    }

    setIsBatchRunning(true);
    setBatchProgress({ current: 0, total: missingItems.length });
    setBatchMessage('Toplu seslendirme başlatıldı...');

    for (let i = 0; i < missingItems.length; i++) {
      const item = missingItems[i];
      setBatchProgress({ current: i + 1, total: missingItems.length, currentItem: item.kazakhText });

      try {
        const res = await fetch('/api/admin/synthesize-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: item.kazakhText,
            lang: 'kk',
            voice: selectedVoice,
            code: item.code
          })
        });

        if (res.ok) {
          const result = await res.json();
          setInventory(prev => ({
            ...prev,
            [item.id]: {
              isAvailable: true,
              source: 'disk',
              size: result.sizeBytes
            }
          }));
        }

        // Wait 21s between calls to prevent rate limit (3 RPM limit)
        if (i < missingItems.length - 1) {
          setBatchMessage(`Bekleniyor (Kota Koruması): ${i + 1}/${missingItems.length}...`);
          await new Promise(r => setTimeout(r, 21000));
        }
      } catch (err: any) {
        console.warn(`Item ${item.kazakhText} failed in batch:`, err.message);
      }
    }

    setIsBatchRunning(false);
    setBatchMessage('Toplu seslendirme başarıyla tamamlandı!');
    setTimeout(() => setBatchMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`p-3.5 rounded-2xl text-xs font-bold shadow-xl border flex items-center justify-between transition animate-in fade-in ${
          toastMessage.isError 
            ? 'bg-rose-950/90 text-rose-200 border-rose-800' 
            : 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
        }`}>
          <span>{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="text-white opacity-70 hover:opacity-100 ml-3">✕</button>
        </div>
      )}

      {/* Header Banner & Stats */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-500/30 p-6 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center text-2xl shadow-inner shrink-0">
              🎙️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Seslendirme Denetim & Fonetik Paneli
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3 text-slate-950 fill-slate-950" />
                  <span>GEMINI AI TTS</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Müfredattaki tüm harf, sözlük ve diyalog seslendirmelerini denetleyin, Gemini AI ile özgün Kazakça stüdyo sesleri oluşturup güncelleyin.
              </p>
            </div>
          </div>

          {/* Voice Selector */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700 shrink-0">
            <span className="text-[11px] font-bold text-slate-400 pl-2 flex items-center gap-1">
              <Mic className="w-3.5 h-3.5 text-teal-400" />
              <span>Ses Modeli:</span>
            </span>
            <button
              onClick={() => setSelectedVoice('female')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                selectedVoice === 'female'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>👩 Kore (Kadın)</span>
              {selectedVoice === 'female' && <Check className="w-3 h-3 stroke-[3]" />}
            </button>
            <button
              onClick={() => setSelectedVoice('male')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                selectedVoice === 'male'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>👨 Puck (Erkek)</span>
              {selectedVoice === 'male' && <Check className="w-3 h-3 stroke-[3]" />}
            </button>
          </div>
        </div>

        {/* Inventory KPI Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
          <div className="bg-slate-800/50 border border-slate-700/60 p-3 rounded-2xl">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Toplam İçerik</span>
            <span className="text-xl font-black text-white mt-0.5 block">{totalCount} Öğe</span>
            <span className="text-[10px] text-teal-300 font-medium">Harf, Sözlük ve Cümleler</span>
          </div>

          <div className="bg-slate-800/50 border border-emerald-500/30 p-3 rounded-2xl">
            <span className="text-[10px] font-extrabold uppercase text-emerald-400 block">Stüdyo Sesi Hazır</span>
            <span className="text-xl font-black text-emerald-300 mt-0.5 block">{readyCount} Adet</span>
            <span className="text-[10px] text-emerald-400 font-medium">Disk & Önbellek Kayıtlı</span>
          </div>

          <div className="bg-slate-800/50 border border-amber-500/30 p-3 rounded-2xl">
            <span className="text-[10px] font-extrabold uppercase text-amber-400 block">Eksik / İncelenecek</span>
            <span className="text-xl font-black text-amber-300 mt-0.5 block">{missingCount} Adet</span>
            <span className="text-[10px] text-amber-400 font-medium">Gemini ile Üretilebilir</span>
          </div>

          <div className="bg-slate-800/50 border border-teal-500/30 p-3 rounded-2xl">
            <span className="text-[10px] font-extrabold uppercase text-teal-400 block">Kapsama Oranı</span>
            <span className="text-xl font-black text-teal-300 mt-0.5 block">%{readyPercent}</span>
            <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${readyPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Batch Synthesis Progress Bar (when active) */}
      {isBatchRunning && (
        <div className="bg-slate-800 border border-amber-500/40 p-4 rounded-2xl shadow-lg space-y-2.5 animate-pulse">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-amber-300 flex items-center gap-1.5">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Toplu Gemini AI Seslendirme İşleniyor: {batchProgress.currentItem}</span>
            </span>
            <span className="text-white font-mono">{batchProgress.current} / {batchProgress.total}</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-700">
            <div 
              className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.round((batchProgress.current / batchProgress.total) * 100)}%` }}
            />
          </div>
          {batchMessage && (
            <p className="text-[11px] text-slate-300 italic">{batchMessage}</p>
          )}
        </div>
      )}

      {/* Control Bar: Filters, Search & Bulk Actions */}
      <div className="bg-slate-850 p-4 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kazakça kelime, Türkçe çeviri veya fonetik ara..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={refreshInventory}
              disabled={isCheckingInventory}
              className="py-2.5 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
              title="Ses dosyası mevcudiyet durumlarını sunucudan tara"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingInventory ? 'animate-spin text-teal-400' : ''}`} />
              <span>{isCheckingInventory ? 'Taranıyor...' : 'Durumu Yenile'}</span>
            </button>

            <button
              onClick={handleBatchSynthesize}
              disabled={isBatchRunning || missingCount === 0}
              className="py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-2xl text-xs shadow-md transition active:scale-95 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>Eksikleri Gemini ile Seslendir ({missingCount})</span>
            </button>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60 text-xs">
          {/* Level Filter */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold px-1.5">Seviye:</span>
            {['all', 'SPECIAL', 'A1', 'A2', 'B1', 'B2', 'C1'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                  levelFilter === lvl
                    ? 'bg-teal-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl === 'all' ? 'Tümü' : lvl === 'SPECIAL' ? '9 Özel Harf' : lvl}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold px-1.5">Tür:</span>
            {[
              { id: 'all', label: 'Tümü' },
              { id: 'special_letter', label: 'Özel Fonem' },
              { id: 'vocab', label: 'Sözlük' },
              { id: 'dialogue', label: 'Diyalog' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTypeFilter(t.id)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                  typeFilter === t.id
                    ? 'bg-teal-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold px-1.5">Durum:</span>
            {[
              { id: 'all', label: 'Tümü' },
              { id: 'ready', label: '✓ Hazır' },
              { id: 'missing', label: '⚠ Eksik' }
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                  statusFilter === s.id
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="ml-auto text-[11px] text-slate-400 font-bold">
            Gösterilen: <span className="text-white font-black">{filteredItems.length}</span> / {totalCount}
          </div>
        </div>
      </div>

      {/* Main List Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-black uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Kazakça İçerik</th>
                <th className="py-3 px-4">Türkçe Çevirisi</th>
                <th className="py-3 px-4">Kategori & Konum</th>
                <th className="py-3 px-3 text-center">Ses Durumu</th>
                <th className="py-3 px-4 text-right">İşlemler (Gemini AI)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    Arama kriterine uygun seslendirme öğesi bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const inv = inventory[item.id];
                  const isAvailable = inv?.isAvailable;
                  const isPlaying = playingId === item.id;
                  const isSynth = synthesizingId === item.id;

                  return (
                    <tr 
                      key={item.id}
                      className="hover:bg-slate-800/50 transition group"
                    >
                      {/* Kazakh Text & Latin */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {item.type === 'special_letter' ? (
                            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-slate-950 font-black text-lg flex items-center justify-center shrink-0 shadow-xs">
                              {item.kazakhText}
                            </span>
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
                          )}
                          <div>
                            <span className="font-black text-sm text-white group-hover:text-amber-300 transition block">
                              {item.kazakhText}
                            </span>
                            {item.latinText && (
                              <span className="text-[10px] text-teal-300/80 font-semibold font-mono block">
                                Latin: {item.latinText}
                              </span>
                            )}
                            {item.ipa && (
                              <span className="text-[9px] text-slate-500 font-mono">
                                IPA: {item.ipa}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Turkish Meaning */}
                      <td className="py-3 px-4 text-slate-300 font-medium">
                        {item.turkishText}
                      </td>

                      {/* Location & Category */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700">
                          {item.category}
                        </span>
                        {item.unitTitle && (
                          <span className="block text-[9px] text-slate-400 mt-0.5 truncate max-w-xs">
                            {item.unitTitle}
                          </span>
                        )}
                      </td>

                      {/* Audio Status */}
                      <td className="py-3 px-3 text-center">
                        {isAvailable ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Hazır</span>
                            {inv?.size ? <span className="text-[9px] text-emerald-300 font-mono">({Math.round(inv.size / 1024)}k)</span> : null}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                            <AlertCircle className="w-3 h-3 text-amber-400" />
                            <span>Eksik</span>
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Play Button */}
                          <button
                            onClick={() => handlePlayAudio(item)}
                            disabled={isPlaying}
                            className={`p-2 rounded-xl transition flex items-center justify-center ${
                              isPlaying 
                                ? 'bg-amber-400 text-slate-950 animate-pulse' 
                                : 'bg-slate-800 hover:bg-slate-700 text-teal-400 hover:text-white border border-slate-700'
                            }`}
                            title="Doğal sesle önizle / dinle"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>

                          {/* Synthesize / Update via Gemini */}
                          <button
                            onClick={() => handleSynthesizeSingle(item)}
                            disabled={isSynth}
                            className="py-1.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 active:scale-95 text-white font-black text-xs transition shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                            title="Gemini AI ile doğru Kazakça fonetik ses oluştur ve diske kaydet"
                          >
                            {isSynth ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Üretiliyor...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                                <span>Gemini ile Yenile</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
