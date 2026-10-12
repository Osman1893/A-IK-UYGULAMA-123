import React, { useState, useEffect } from 'react';
import { X, Sparkles, Trophy, RotateCcw, Clock, Zap, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VocabItem } from '../../types';
import { audioService } from '../../services/audioService';
import { storageService } from '../../services/storageService';

interface WordMatchingGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  vocabulary: VocabItem[];
}

export const WordMatchingGameModal: React.FC<WordMatchingGameModalProps> = ({
  isOpen,
  onClose,
  vocabulary
}) => {
  const [kazakhItems, setKazakhItems] = useState<{ id: string; text: string; matched: boolean }[]>([]);
  const [turkishItems, setTurkishItems] = useState<{ id: string; text: string; matched: boolean }[]>([]);
  const [selectedKazakhId, setSelectedKazakhId] = useState<string | null>(null);
  const [selectedTurkishId, setSelectedTurkishId] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<boolean>(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [energyError, setEnergyError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    initGame();
  }, [isOpen, vocabulary]);

  const initGame = () => {
    // Consume 5 energy for matching game activity (Requirement 3)
    const energyRes = storageService.consumeEnergy(5);
    if (!energyRes.success) {
      setEnergyError(energyRes.error || 'Yetersiz enerji!');
      return;
    }
    setEnergyError(null);

    // Pick 6 random vocabulary items
    const sample = [...vocabulary].sort(() => 0.5 - Math.random()).slice(0, 6);
    
    setKazakhItems(
      sample.map(v => ({ id: v.id, text: v.kazakhCyrillic, matched: false }))
        .sort(() => 0.5 - Math.random())
    );

    setTurkishItems(
      sample.map(v => ({ id: v.id, text: v.turkish, matched: false }))
        .sort(() => 0.5 - Math.random())
    );

    setSelectedKazakhId(null);
    setSelectedTurkishId(null);
    setWrongPair(false);
    setScore(0);
    setCombo(1);
    setIsCompleted(false);
  };

  const handleUpgradeToPro = () => {
    storageService.upgradeToPro();
    setEnergyError(null);
    initGame();
  };

  const handleSelectKazakh = (id: string) => {
    audioService.playFeedbackSound('click');
    const item = kazakhItems.find(k => k.id === id);
    if (item) audioService.speak(item.text, 'kk');
    setSelectedKazakhId(id);
    if (selectedTurkishId) {
      checkMatch(id, selectedTurkishId);
    }
  };

  const handleSelectTurkish = (id: string) => {
    audioService.playFeedbackSound('click');
    setSelectedTurkishId(id);
    if (selectedKazakhId) {
      checkMatch(selectedKazakhId, id);
    }
  };

  const checkMatch = (kId: string, tId: string) => {
    if (kId === tId) {
      // Match found!
      audioService.playFeedbackSound('correct');
      setScore(prev => prev + (10 * combo));
      setCombo(prev => prev + 1);

      setKazakhItems(prev => prev.map(item => item.id === kId ? { ...item, matched: true } : item));
      setTurkishItems(prev => prev.map(item => item.id === tId ? { ...item, matched: true } : item));

      setSelectedKazakhId(null);
      setSelectedTurkishId(null);

      // Check if all matched
      const remainingUnmatched = kazakhItems.filter(item => item.id !== kId && !item.matched);
      if (remainingUnmatched.length === 0) {
        setIsCompleted(true);
        audioService.playFeedbackSound('complete');
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }
    } else {
      // Wrong pair!
      audioService.playFeedbackSound('wrong');
      setWrongPair(true);
      setCombo(1);
      setTimeout(() => {
        setSelectedKazakhId(null);
        setSelectedTurkishId(null);
        setWrongPair(false);
      }, 700);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col p-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            <div>
              <h3 className="text-sm font-black text-slate-900 leading-tight">
                Hızlı Eşleştirme (Duolingo Stili)
              </h3>
              <p className="text-[10px] text-slate-500">
                Kazakça ve Türkçe karşılıklarını eşleştirin
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score & Combo Banner */}
        <div className="flex items-center justify-between bg-amber-50 p-3 rounded-2xl border border-amber-200 mb-4 text-xs font-bold text-amber-950">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Puan: {score} XP</span>
          </div>
          {combo > 1 && (
            <span className="px-2 py-0.5 bg-amber-500 text-slate-950 rounded-full font-black text-[10px] animate-bounce">
              {combo}x Kombo!
            </span>
          )}
        </div>

        {/* Energy Error Warning / PRO Upgrade Card */}
        {energyError ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-amber-50/60 rounded-3xl border border-amber-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl text-amber-600">
              ⚡
            </div>
            <h4 className="text-sm font-black text-amber-950">
              Enerjiniz Tükendi!
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed max-w-xs">
              {energyError} Enerjiniz 8 saatte bir otomatik olarak 100'e yenilenir veya sınırsız oynamak için PRO sürüme geçebilirsiniz.
            </p>
            <button
              onClick={handleUpgradeToPro}
              className="py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Crown className="w-4 h-4" />
              <span>PRO Sürüme Yükselt (Sınırsız Enerji)</span>
            </button>
          </div>
        ) : !isCompleted ? (
          <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto py-1">
            
            {/* Left: Kazakh Column */}
            <div className="space-y-2">
              <span className="block text-[10px] font-black uppercase text-teal-800 tracking-wider pl-1">
                🇰🇿 Kazakça
              </span>
              {kazakhItems.map(item => {
                const isSelected = selectedKazakhId === item.id;
                return (
                  <button
                    key={item.id}
                    disabled={item.matched}
                    onClick={() => handleSelectKazakh(item.id)}
                    className={`w-full p-3 rounded-2xl border text-xs font-bold transition text-left flex items-center justify-between ${
                      item.matched
                        ? 'opacity-25 bg-slate-100 border-slate-200 line-through text-slate-400'
                        : wrongPair && isSelected
                        ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-400'
                        : isSelected
                        ? 'bg-teal-50 border-teal-500 text-teal-900 ring-2 ring-teal-400 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <span>{item.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Right: Turkish Column */}
            <div className="space-y-2">
              <span className="block text-[10px] font-black uppercase text-teal-800 tracking-wider pl-1">
                🇹🇷 Türkçe
              </span>
              {turkishItems.map(item => {
                const isSelected = selectedTurkishId === item.id;
                return (
                  <button
                    key={item.id}
                    disabled={item.matched}
                    onClick={() => handleSelectTurkish(item.id)}
                    className={`w-full p-3 rounded-2xl border text-xs font-bold transition text-left flex items-center justify-between ${
                      item.matched
                        ? 'opacity-25 bg-slate-100 border-slate-200 line-through text-slate-400'
                        : wrongPair && isSelected
                        ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-400'
                        : isSelected
                        ? 'bg-teal-50 border-teal-500 text-teal-900 ring-2 ring-teal-400 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <span>{item.text}</span>
                  </button>
                );
              })}
            </div>

          </div>
        ) : (
          /* Victory Screen */
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
              🎉
            </div>
            <h4 className="text-base font-black text-slate-900">
              Tebrikler! Tüm Kelimeleri Eşleştirdiniz!
            </h4>
            <p className="text-xs text-slate-500">
              Toplam Kazanılan: +{score} XP
            </p>
            <button
              onClick={initGame}
              className="mt-4 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Yeniden Oyna
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
