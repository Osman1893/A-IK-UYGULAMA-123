import React, { useState } from 'react';
import { Bookmark, Volume2, CheckCircle2, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { UserProfile, VocabItem } from '../../types';
import { audioService } from '../../services/audioService';

interface SpacedRepetitionViewProps {
  user: UserProfile;
  vocabulary: VocabItem[];
  onToggleMastery: (wordId: string, mastered: boolean) => void;
  onBackToHome: () => void;
}

export const SpacedRepetitionView: React.FC<SpacedRepetitionViewProps> = ({
  user,
  vocabulary,
  onToggleMastery,
  onBackToHome
}) => {
  const isTr = user.currentDirection === 'TR_TO_KZ';
  const reviewWords = vocabulary.filter(w => user.reviewWordIds.includes(w.id));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentWord = reviewWords[currentIndex] || reviewWords[0];

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-12">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-emerald-600" />
            <span>ARALIKLI TEKRAR (SRS)</span>
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">
            {reviewWords.length > 0 
              ? `${reviewWords.length} kelime tekrar listesinde bekliyor` 
              : 'Tüm kelimeleri başarıyla pekiştirdiniz!'}
          </p>
        </div>
      </div>

      {reviewWords.length > 0 && currentWord ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md flex flex-col items-center text-center">
          
          <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-3">
            Kart {currentIndex + 1} / {reviewWords.length}
          </span>

          <h3 className="text-3xl font-black text-slate-900 mb-1">
            {currentWord.kazakhCyrillic}
          </h3>

          <p className="text-xs text-slate-400 font-mono mb-4">
            [{currentWord.phoneticGuide}]
          </p>

          <button
            onClick={() => audioService.speak(currentWord.kazakhCyrillic, 'kk')}
            className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md mb-6 transition active:scale-95"
          >
            <Volume2 className="w-6 h-6" />
          </button>

          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
            >
              Anlamı Göster (Көрсету)
            </button>
          ) : (
            <div className="w-full space-y-4 animate-in fade-in">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-[10px] text-emerald-800 font-bold block uppercase">Türkçe Karşılığı</span>
                <span className="text-xl font-black text-emerald-950">{currentWord.turkish}</span>
              </div>

              <div className="text-xs text-slate-600 text-left bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div>🇰🇿 {currentWord.exampleKazakh}</div>
                <div>🇹🇷 {currentWord.exampleTurkish}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowAnswer(false);
                    if (currentIndex + 1 < reviewWords.length) setCurrentIndex(prev => prev + 1);
                    else setCurrentIndex(0);
                  }}
                  className="py-2.5 px-3 rounded-xl border border-rose-200 text-rose-800 text-xs font-bold bg-rose-50"
                >
                  Yeniden Tekrarla
                </button>
                <button
                  onClick={() => {
                    onToggleMastery(currentWord.id, true);
                    audioService.playFeedbackSound('correct');
                    setShowAnswer(false);
                    if (currentIndex >= reviewWords.length - 1) setCurrentIndex(0);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700"
                >
                  Öğrendim ✓
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-slate-900">
            Harika! Tekrar Edilecek Kelime Yok
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Derslerde bilmediğiniz kelimeleri "Tekrar Etmeliyim" olarak işaretlediğinizde burada listelenecektir.
          </p>
          <button
            onClick={onBackToHome}
            className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Derslere Göz At
          </button>
        </div>
      )}

    </div>
  );
};
