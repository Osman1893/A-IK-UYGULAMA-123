import React, { useState } from 'react';
import { X, Flag, Send, CheckCircle2 } from 'lucide-react';
import { VocabItem } from '../../types';

interface ReportErrorModalProps {
  isOpen: boolean;
  word: VocabItem | null;
  onClose: () => void;
  onSubmit: (word: string, currentVal: string, correction: string, explanation: string) => void;
}

export const ReportErrorModal: React.FC<ReportErrorModalProps> = ({
  isOpen,
  word,
  onClose,
  onSubmit
}) => {
  const [correction, setCorrection] = useState('');
  const [explanation, setExplanation] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !word) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(word.kazakhCyrillic, word.turkish, correction, explanation);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setCorrection('');
      setExplanation('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-3 text-rose-600 font-extrabold text-sm">
          <Flag className="w-4 h-4" />
          <span>Hatalı Çeviri Bildirimi</span>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Bu kelime veya anlamında bir hata olduğunu düşünüyorsanız lütfen düzeltmenizi iletiniz. Super Admin ekibimiz tarafından incelenecektir.
        </p>

        {submitted ? (
          <div className="py-8 text-center text-emerald-600 font-bold text-xs space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto" />
            <p>Bildiriminiz Başarıyla Super Admin Paneline İletildi!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">Seçili Kelime:</span>
              <span className="font-black text-slate-800">{word.kazakhCyrillic}</span>
              <span className="text-slate-500"> = {word.turkish}</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Önerdiğiniz Doğru Karşılık / Түзету:
              </label>
              <input
                type="text"
                placeholder="Doğru çeviriyi yazınız..."
                value={correction}
                onChange={(e) => setCorrection(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Açıklama / Kaynak (İsteğe bağlı):
              </label>
              <textarea
                rows={2}
                placeholder="Neden hatalı olduğunu belirtiniz..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Admin İncelemesine Gönder</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
