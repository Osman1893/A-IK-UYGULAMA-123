import React, { useState } from 'react';
import { Sparkles, BookOpen, Heart, X, Award, Info, ChevronRight, Volume2 } from 'lucide-react';
import { audioService } from '../../services/audioService';

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
    sm: { box: 'w-16 h-16', svg: 'w-14 h-14' },
    md: { box: 'w-24 h-24', svg: 'w-22 h-22' },
    lg: { box: 'w-36 h-36', svg: 'w-32 h-32' },
    xl: { box: 'w-48 h-48', svg: 'w-44 h-44' },
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
      
      {/* Mascot SVG Character Container */}
      <div 
        onClick={() => setIsLoreModalOpen(true)}
        title="Alageyik: Türk Mitolojisinin Kutsal Bilgelik Maskotu (Tıkla ve Efsaneyi Oku)"
        className={`relative ${sizeDimensions.box} flex items-center justify-center shrink-0 cursor-pointer group transition-transform hover:scale-105 active:scale-95`}
      >
        {/* Glow / Aura Behind Alageyik */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400/20 via-teal-400/20 to-violet-500/25 blur-md group-hover:blur-lg transition-all animate-pulse" />

        {/* Master Vector Art for Alageyik */}
        <svg 
          viewBox="0 0 120 120" 
          className={`${sizeDimensions.svg} relative drop-shadow-md z-10 transition-transform group-hover:-translate-y-1`}
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Celestial Stars around antlers */}
          <circle cx="28" cy="18" r="2.2" fill="#FBBF24" className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle cx="92" cy="18" r="2" fill="#38BDF8" className="animate-ping" style={{ animationDuration: '2.5s' }} />
          <polygon points="60,6 62,11 67,11 63,14 65,19 60,16 55,19 57,14 53,11 58,11" fill="#F59E0B" opacity="0.9" />

          {/* Golden Antlers (Altın Boynuzlar - Sacred Branching) */}
          <g stroke="#D97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            {/* Left Antler Main Stem */}
            <path d="M 48 38 C 42 28 32 20 24 16" fill="none" stroke="#F59E0B" strokeWidth="3.5" />
            <path d="M 40 30 C 35 24 33 16 35 12" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
            <path d="M 33 22 C 26 21 21 25 18 28" fill="none" stroke="#F59E0B" strokeWidth="2" />
            <path d="M 44 34 C 40 33 37 36 34 39" fill="none" stroke="#F59E0B" strokeWidth="2" />

            {/* Right Antler Main Stem */}
            <path d="M 72 38 C 78 28 88 20 96 16" fill="none" stroke="#F59E0B" strokeWidth="3.5" />
            <path d="M 80 30 C 85 24 87 16 85 12" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
            <path d="M 87 22 C 94 21 99 25 102 28" fill="none" stroke="#F59E0B" strokeWidth="2" />
            <path d="M 76 34 C 80 33 83 36 86 39" fill="none" stroke="#F59E0B" strokeWidth="2" />
          </g>

          {/* Antler Tips Glow */}
          <circle cx="24" cy="16" r="3" fill="#FDE68A" />
          <circle cx="35" cy="12" r="2.5" fill="#FDE68A" />
          <circle cx="96" cy="16" r="3" fill="#FDE68A" />
          <circle cx="85" cy="12" r="2.5" fill="#FDE68A" />

          {/* Deer Ears (Sevimli Kulaklar) */}
          <path d="M 36 44 C 22 42 18 52 28 58 C 34 56 36 50 38 46 Z" fill="#D97706" />
          <path d="M 34 46 C 26 45 22 51 28 55 C 32 54 34 49 35 47 Z" fill="#FDE68A" />

          <path d="M 84 44 C 98 42 102 52 92 58 C 86 56 84 50 82 46 Z" fill="#D97706" />
          <path d="M 86 46 C 94 45 98 51 92 55 C 88 54 86 49 85 47 Z" fill="#FDE68A" />

          {/* Deer Head Shape (Zarif Baş Yapısı) */}
          <path 
            d="M 44 42 C 40 50 42 66 45 78 C 47 88 52 94 60 94 C 68 94 73 88 75 78 C 78 66 80 50 76 42 C 70 38 50 38 44 42 Z" 
            fill="#F59E0B" 
          />

          {/* Cheek & Muzzle (Açık Renkli Yüz & Burun Bölgesi) */}
          <ellipse cx="60" cy="78" rx="15" ry="12" fill="#FEF3C7" />

          {/* Sacred White Spots (Alageyik Kutsal Benekleri) */}
          <circle cx="49" cy="52" r="1.8" fill="#FFFBEB" opacity="0.9" />
          <circle cx="46" cy="60" r="1.5" fill="#FFFBEB" opacity="0.9" />
          <circle cx="71" cy="52" r="1.8" fill="#FFFBEB" opacity="0.9" />
          <circle cx="74" cy="60" r="1.5" fill="#FFFBEB" opacity="0.9" />
          <circle cx="60" cy="48" r="2.2" fill="#FFFBEB" opacity="0.9" />

          {/* Eyes (Bilge ve Parlak Gözler) */}
          {pose === 'celebrating' ? (
            /* Joyful Closed Eyes */
            <g stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round">
              <path d="M 47 60 Q 52 54 57 60" fill="none" />
              <path d="M 63 60 Q 68 54 73 60" fill="none" />
            </g>
          ) : (
            /* Wise Open Eyes with Sparkle */
            <g>
              <ellipse cx="51" cy="61" rx="4.5" ry="5.5" fill="#1E293B" />
              <circle cx="49.5" cy="59" r="2" fill="#FFFFFF" />
              <circle cx="53" cy="63" r="0.8" fill="#FFFFFF" />

              <ellipse cx="69" cy="61" rx="4.5" ry="5.5" fill="#1E293B" />
              <circle cx="67.5" cy="59" r="2" fill="#FFFFFF" />
              <circle cx="71" cy="63" r="0.8" fill="#FFFFFF" />
            </g>
          )}

          {/* Rosy Cheeks (Sevimli Yanaklar) */}
          <circle cx="44" cy="70" r="3.5" fill="#F87171" opacity="0.45" />
          <circle cx="76" cy="70" r="3.5" fill="#F87171" opacity="0.45" />

          {/* Nose & Smile */}
          <path d="M 57 74 C 57 73 63 73 63 74 C 63 76 61 78 60 78 C 59 78 57 76 57 74 Z" fill="#92400E" />
          <path d="M 60 78 L 60 82" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
          {pose === 'encouraging' ? (
            /* Gentle Comforting Mouth */
            <path d="M 55 83 Q 60 87 65 83" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          ) : (
            /* Warm Big Smile */
            <path d="M 54 82 Q 60 88 66 82" stroke="#92400E" strokeWidth="2" strokeLinecap="round" fill="none" />
          )}

          {/* Traditional Turkic Turquoise Talisman Pendant (Kutsal Turkuaz Kolye) */}
          <path d="M 48 94 C 54 102 66 102 72 94" stroke="#D97706" strokeWidth="2.5" fill="none" />
          <circle cx="60" cy="102" r="5" fill="#0D9488" stroke="#FDE68A" strokeWidth="1.5" />
          <circle cx="60" cy="102" r="2" fill="#FDE68A" />

          {/* Pose Accessories */}
          {pose === 'studying' && (
            /* Little Scholar Glasses & Scroll */
            <g stroke="#0369A1" strokeWidth="1.6" fill="none">
              <circle cx="51" cy="61" r="7" />
              <circle cx="69" cy="61" r="7" />
              <path d="M 58 61 L 62 61" />
            </g>
          )}

          {pose === 'celebrating' && (
            /* Victory Laurel / Stars */
            <g fill="#F59E0B">
              <polygon points="20,40 22,43 25,43 23,45 24,48 21,46 18,48 19,45 17,43 20,43" />
              <polygon points="100,40 102,43 105,43 103,45 104,48 101,46 98,48 99,45 97,43 100,43" />
            </g>
          )}
        </svg>

        {/* Mascot Name Badge under character */}
        <span className="absolute -bottom-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-xs border border-amber-300">
          Alageyik
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
