import React, { useState } from 'react';
import { Sparkles, BookOpen, Heart, X, Award, Info, ChevronRight, Volume2 } from 'lucide-react';
import { audioService } from '../../services/audioService';
import duoDeerMascotImg from '../../assets/images/duo_style_deer_mascot_1793124498058.jpg';

export type AlageyikPose = 
  | 'guide'        // Bilge Yol Gösterici
  | 'celebrating'  // Zafer ve Kutlama
  | 'thinking'     // Düşünceli / Meraklı
  | 'encouraging'  // Destekleyici / Teselli
  | 'studying'     // Kitap Okuyan / Çalışkan
  | 'mythology';   // Efsanevi / Kutsal Altay Duruşu

interface AlageyikMascotProps {
  pose?: AlageyikPose;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  subMessage?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  showLoreButton?: boolean;
  className?: string;
}

export const AlageyikMascot: React.FC<AlageyikMascotProps> = ({
  pose = 'guide',
  size = 'md',
  message,
  subMessage,
  actionButton,
  showLoreButton = true,
  className = ''
}) => {
  const [isLoreModalOpen, setIsLoreModalOpen] = useState(false);

  const sizeDimensions = {
    sm: { box: 'w-16 h-16', img: 'w-14 h-14' },
    md: { box: 'w-24 h-24', img: 'w-22 h-22' },
    lg: { box: 'w-36 h-36', img: 'w-32 h-32' },
    xl: { box: 'w-48 h-48', img: 'w-44 h-44' },
  }[size];

  // Play mythological wisdom sound
  const handlePlayWisdom = () => {
    audioService.playFeedbackSound('click');
    if (message) {
      audioService.speak(message, 'tr', 1.0);
    }
  };

  return (
    <div className={`relative flex items-center gap-3.5 ${className}`}>
      
      {/* Duolingo-Style Alageyik Mascot Emblem Container */}
      <div 
        onClick={() => setIsLoreModalOpen(true)}
        title="Alageyik: Türk Mitolojisinin Kutsal Bilgelik Maskotu (Tıkla ve Efsaneyi Oku)"
        className={`relative ${sizeDimensions.box} flex items-center justify-center shrink-0 cursor-pointer group transition-transform hover:scale-105 active:scale-95`}
      >
        {/* Glow / Aura Behind Alageyik */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400/30 via-teal-400/30 to-emerald-500/30 blur-md group-hover:blur-lg transition-all animate-pulse" />

        {/* Official Duolingo-Style Circular Emblem Badge */}
        <div className={`${sizeDimensions.img} relative rounded-full p-1 bg-gradient-to-br from-amber-400 via-teal-500 to-emerald-600 shadow-lg shadow-teal-500/25 border-2 border-white/90 overflow-hidden flex items-center justify-center z-10 transition-transform group-hover:-translate-y-0.5`}>
          <img 
            src={duoDeerMascotImg} 
            alt="Alageyik Duolingo Tarzı Resmi Maskot" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Mascot Name / Pose Badge under character */}
        <span className="absolute -bottom-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-xs border border-amber-300 z-20">
          {pose === 'celebrating' ? '🎉 Kutlama' : pose === 'studying' ? '📖 Bilge' : 'Alageyik'}
        </span>
      </div>


      {/* Speech Bubble / Message Content */}
      {(message || subMessage) && (
        <div className="flex-1 bg-white p-3 sm:p-3.5 rounded-2xl border border-amber-200/80 shadow-md relative before:content-[''] before:absolute before:top-5 before:-left-2 before:w-3 before:h-3 before:bg-white before:border-l before:border-b before:border-amber-200/80 before:rotate-45">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Bilge Alageyik'in Rehberliği</span>
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold">
                  {pose === 'celebrating' ? '🎉 Zafer' : pose === 'encouraging' ? '💪 Destek' : '📖 İpucu'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-black text-slate-800 leading-snug">
                {message}
              </p>
              {subMessage && (
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {subMessage}
                </p>
              )}
            </div>

            <button
              onClick={handlePlayWisdom}
              title="Mesajı Seslendir"
              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition shrink-0"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {actionButton && (
            <div className="mt-2.5 pt-2 border-t border-amber-100 flex items-center justify-end">
              <button
                onClick={actionButton.onClick}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition shadow-xs flex items-center gap-1 active:scale-95"
              >
                <span>{actionButton.label}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Cultural Lore Modal (Türk Mitolojisinde Geyik) */}
      {isLoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-2xl bg-white/15 text-amber-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight">
                    Türk Mitolojisinde Alageyik (Sıgun & Maral)
                  </h3>
                  <p className="text-[11px] text-amber-200">
                    Bozkırın Kutsal Rehberi ve Aydınlığın Simgesi
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsLoreModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
              
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xl shrink-0 shadow-md shadow-amber-500/20">
                  🦌
                </div>
                <div>
                  <h4 className="font-black text-amber-950 text-xs">Neden Uygulamanın Maskotu Alageyik?</h4>
                  <p className="text-[11px] text-amber-900 mt-0.5">
                    Türk ve Kazak kültüründe geyik (Alageyik, Sıgun, Maral); yolunu kaybeden kahramanlara kılavuzluk eden, bilgeliği ve tükenmeyen azmi temsil eden kutsal bir motiftir.
                  </p>
                </div>
              </div>

              <div>
                <h5 className="font-extrabold text-slate-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>1. Altay ve Göktürk Efsanelerinde Yol Gösterici</span>
                </h5>
                <p>
                  Eski Türk destanlarında avcılar veya kağanlar sarp dağlarda, dondurucu kar fırtınalarında yolunu şaşırdığında, gök yüzünden inen altın boynuzlu bir Alageyik belirir ve onlara selamet yolunu gösterir. Uygulamamızda da dil öğrenme yolculuğunuzda Alageyik sizin kişisel rehberinizdir.
                </p>
              </div>

              <div>
                <h5 className="font-extrabold text-slate-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>2. Kaya Resimleri ve Geyik Taşları (Bugut & Yenisey)</span>
                </h5>
                <p>
                  Moğolistan, Kazakistan ve Altay bozkırlarındaki binlerce yıllık dikili "Geyik Taşları"nda (Deer Stones), göğe doğru kanatlanan geyik figürleri resmedilmiştir. Bu taşlar, ruhun aydınlanmasını ve ilme yükselişini simgeler.
                </p>
              </div>

              <div>
                <h5 className="font-extrabold text-slate-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>3. Kazak Kültüründe "Maral" ve Doğaya Saygı</span>
                </h5>
                <p>
                  Kazak bozkırında marallara (dişi geyik) ve buğulara (erkek geyik) asla sebepsiz zarar verilmez. Kazak halk edebiyatında «Maralday керілген» (Maral gibi asil ve zarif) deyişi yüksek erdemi ifade eder.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px]">
                <span className="font-bold text-slate-900">Alageyik'in Öğrenciye Mesajı:</span>
                <p className="italic text-slate-600 mt-1">
                  «Bozkırın dili köklerimizdir. Her kelimede dedelerimizin nefesi saklıdır. Yılmadan çalış, her gün bir adım at; Alageyik sana daima rehberlik edecektir!»
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsLoreModalOpen(false)}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-black rounded-xl hover:bg-amber-600 transition shadow-xs text-xs"
              >
                Anladım, Teşekkürler! ✓
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
