import React, { useState } from 'react';
import { Play, Pause, Sparkles, Volume2 } from 'lucide-react';
import { audioService } from '../../services/audioService';

export type ArticulatoryCategory = 
  | 'rounded_front'   // Yuvarlak Ön Damak: Ө, Ү
  | 'rounded_back'    // Yuvarlak Arka Damak: Ұ, О, У
  | 'unrounded_open'  // Açık Yayvan: Ә, А
  | 'unrounded_close' // Dar Kapalı: І, Ы, И, Е
  | 'uvular_stop'     // Boğaz / Küçük Dil Patlamalı: Қ
  | 'uvular_fricative'// Boğaz / Küçük Dil Sızıcı: Ғ
  | 'nasal_velar'     // Geniz Nesi (Sağır Kâf): Ң
  | 'glottal_breath'  // Gırtlaksıl Yumuşak H: Һ
  | 'bilabial'        // Çift Dudak: Б, П, М
  | 'labiodental'     // Diş-Dudak: В, Ф
  | 'dental_stop';    // Dişeti Patlamalı: Д, Т, Н

interface PhoneticMouthVisualProps {
  category: ArticulatoryCategory;
  letter: string;
  nameTr: string;
  className?: string;
  showLabels?: boolean;
}

export const PhoneticMouthVisual: React.FC<PhoneticMouthVisualProps> = ({
  category,
  letter,
  nameTr,
  className = '',
  showLabels = true
}) => {
  const [isAnimated, setIsAnimated] = useState(true);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const handlePlayLetter = async () => {
    setIsPlayingSound(true);
    await audioService.speakKazakhLetterComplete(letter);
    setIsPlayingSound(false);
  };

  // Description and coordinates based on category
  const getMouthDetails = () => {
    switch (category) {
      case 'rounded_front': // Ө, Ү
        return {
          lipShape: 'Yuvarlak & İleri Uzatılmış (Büzük Dudak)',
          tonguePos: 'Dil Ön Damağa Yükselmiş (İnce Ses)',
          jaw: 'Orta-Dar Çene Açıklığı',
          tip: 'Dudaklarınızı «O/U» der gibi büzün, ancak «E/İ» sesi çıkarmaya çalışın.',
          frontLipSvg: (
            <g className={isAnimated ? 'animate-[pulse_1.8s_ease-in-out_infinite]' : ''}>
              {/* Face silhouette */}
              <ellipse cx="60" cy="50" rx="42" ry="40" fill="#FDF2E9" stroke="#E2E8F0" strokeWidth="2" />
              
              {/* Outer Lips with puckering dynamic motion */}
              <ellipse 
                cx="60" 
                cy="52" 
                rx={isAnimated ? "20" : "19"} 
                ry={isAnimated ? "18" : "17"} 
                fill="#E11D48" 
                opacity="0.88" 
              />
              
              {/* Inner Lip Puckered Opening */}
              <ellipse cx="60" cy="52" rx="8" ry="7.5" fill="#4C0519" />
              
              {/* Sound waves radiating forward */}
              {isAnimated && (
                <g stroke="#0D9488" strokeWidth="1.8" fill="none" opacity="0.85">
                  <path d="M 75 48 A 6 6 0 0 1 75 56" className="animate-ping" style={{ transformOrigin: '75px 52px' }} />
                  <path d="M 82 45 A 10 10 0 0 1 82 59" />
                </g>
              )}

              {/* Light reflection */}
              <path d="M 54 44 Q 60 41 66 44" stroke="#FFE4E6" strokeWidth="2" strokeLinecap="round" fill="none" />
              {/* Circular Lip Tension ring */}
              <circle cx="60" cy="52" r="23" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
            </g>
          ),
          crossSectionSvg: (
            <g>
              {/* Hard & Soft Palate */}
              <path d="M 25 30 Q 50 25 75 32 Q 90 40 95 50" stroke="#64748B" strokeWidth="3" fill="none" />
              {/* High Front Tongue (breathing vertically) */}
              <path 
                d={isAnimated ? "M 30 75 Q 45 38 65 37 Q 80 48 90 75 Z" : "M 30 75 Q 45 42 65 40 Q 80 50 90 75 Z"} 
                fill="#FDA4AF" 
                stroke="#E11D48" 
                strokeWidth="2"
                className="transition-all duration-700" 
              />
              {/* Lips Puckered Outward */}
              <path d="M 22 46 Q 13 50 22 54" stroke="#E11D48" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M 22 56 Q 13 60 22 64" stroke="#E11D48" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              {/* Tongue Focus Resonance Marker */}
              <circle cx="55" cy="38" r="4.5" fill="#0D9488" className="animate-pulse" />
            </g>
          )
        };

      case 'rounded_back': // Ұ, О, У
        return {
          lipShape: 'Yuvarlak & Derin Büzük Dudaklar',
          tonguePos: 'Dil Kökü Arka Damağa Çekilmiş (Kalın)',
          jaw: 'Geniş/Orta Boğaz Açıklığı',
          tip: 'Dudaklarınızı yuvarlayın, dilinizin arkasını boğazınıza doğru hafifçe çekin.',
          frontLipSvg: (
            <g className={isAnimated ? 'animate-[pulse_1.9s_ease-in-out_infinite]' : ''}>
              <ellipse cx="60" cy="50" rx="42" ry="40" fill="#FDF2E9" stroke="#E2E8F0" strokeWidth="2" />
              <ellipse cx="60" cy="52" rx="21" ry="19" fill="#E11D48" opacity="0.88" />
              <ellipse cx="60" cy="52" rx="12" ry="10" fill="#310E18" />
              <circle cx="60" cy="52" r="25" stroke="#D97706" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
              {/* Forward air rings */}
              {isAnimated && (
                <circle cx="60" cy="52" r="16" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 2" fill="none" className="animate-ping" style={{ transformOrigin: '60px 52px' }} />
              )}
            </g>
          ),
          crossSectionSvg: (
            <g>
              <path d="M 25 30 Q 50 25 75 32 Q 90 40 95 50" stroke="#64748B" strokeWidth="3" fill="none" />
              {/* Tongue Pulled Back High */}
              <path 
                d={isAnimated ? "M 30 75 Q 40 62 55 56 Q 76 39 90 75 Z" : "M 30 75 Q 40 60 55 58 Q 75 42 90 75 Z"} 
                fill="#FDA4AF" 
                stroke="#E11D48" 
                strokeWidth="2" 
              />
              <path d="M 20 46 Q 11 50 20 54" stroke="#E11D48" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 20 56 Q 11 60 20 64" stroke="#E11D48" strokeWidth="4" strokeLinecap="round" fill="none" />
              <circle cx="76" cy="42" r="5" fill="#F59E0B" className="animate-pulse" />
            </g>
          )
        };

      case 'unrounded_open': // Ә, А
        return {
          lipShape: 'Yayvan & Geniş Açık Dudaklar',
          tonguePos: letter === 'Ә' ? 'Dil Düz ve İleri (Ön Damak)' : 'Dil Tabanı Aşağıda (Geniş Ağız)',
          jaw: 'Tam Açık Çene (Açık Boğaz)',
          tip: letter === 'Ә' ? 'Çenenizi iyice açıp güler gibi dudakları yana yayın, açık «E/Ä» sesi çıkarın.' : 'Ağzınızı rahatça açın, dilinizi alt çene tabanında tutun.',
          frontLipSvg: (
            <g className={isAnimated ? 'animate-[pulse_1.7s_ease-in-out_infinite]' : ''}>
              <ellipse cx="60" cy="50" rx="42" ry="40" fill="#FDF2E9" stroke="#E2E8F0" strokeWidth="2" />
              {/* Wide Smiling Open Lips */}
              <path 
                d={isAnimated ? "M 30 49 Q 60 38 90 49 Q 60 78 30 49 Z" : "M 32 50 Q 60 40 88 50 Q 60 76 32 50 Z"} 
                fill="#E11D48" 
                opacity="0.9" 
              />
              <path 
                d={isAnimated ? "M 36 50 Q 60 43 84 50 Q 60 71 36 50 Z" : "M 38 51 Q 60 45 82 51 Q 60 68 38 51 Z"} 
                fill="#4C0519" 
              />
              {/* Upper & Lower Teeth */}
              <rect x="42" y="47" width="36" height="4.5" rx="2" fill="#FFFFFF" />
              <rect x="45" y={isAnimated ? "61" : "58"} width="30" height="3.5" rx="1.5" fill="#FFFFFF" opacity="0.85" />
            </g>
          ),
          crossSectionSvg: (
            <g>
              <path d="M 25 30 Q 50 25 75 32 Q 90 40 95 50" stroke="#64748B" strokeWidth="3" fill="none" />
              {/* Low Tongue, Wide Jaw Open */}
              <path 
                d={isAnimated ? "M 30 75 Q 45 64 65 62 Q 80 64 90 75 Z" : "M 30 75 Q 45 62 65 60 Q 80 62 90 75 Z"} 
                fill="#FDA4AF" 
                stroke="#E11D48" 
                strokeWidth="2" 
              />
              <path d="M 25 40 Q 17 44 25 48" stroke="#E11D48" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d={isAnimated ? "M 25 66 Q 16 71 25 75" : "M 25 64 Q 18 68 25 72"} stroke="#E11D48" strokeWidth="4" strokeLinecap="round" fill="none" />
              <circle cx="50" cy="61" r="5" fill="#10B981" className="animate-pulse" />
            </g>
          )
        };

      case 'unrounded_close': // І, Ы, И, Е
        return {
          lipShape: 'Düz, Yayvan & Yarı Kapalı Dudaklar',
          tonguePos: letter === 'І' ? 'Dil Ucu Ön Dişlere Yakın (Çok Kısa Kapalı İ)' : 'Dil Kökü Kalın ve Düz (I)',
          jaw: 'Dar Çene Açıklığı (Dişler Neredeyse Temasta)',
          tip: letter === 'І' ? 'Türkçe «İ» sesinden çok daha kısa ve kapalıdır. Çenenizi kımıldatmadan anında kesin.' : 'Dudaklarınızı yuvarlamadan geriye doğru çekip kalın ses verin.',
          frontLipSvg: (
            <g className={isAnimated ? 'animate-[pulse_1.5s_ease-in-out_infinite]' : ''}>
              <ellipse cx="60" cy="50" rx="42" ry="40" fill="#FDF2E9" stroke="#E2E8F0" strokeWidth="2" />
              {/* Narrow horizontal slit lips */}
              <path d="M 28 52 Q 60 45 92 52 Q 60 63 28 52 Z" fill="#E11D48" />
              <path d="M 34 52 Q 60 47 86 52 Q 60 59 34 52 Z" fill="#310E18" />
              <rect x="38" y="49" width="44" height="3" rx="1.5" fill="#FFFFFF" />
            </g>
          ),
          crossSectionSvg: (
            <g>
              <path d="M 25 30 Q 50 25 75 32 Q 90 40 95 50" stroke="#64748B" strokeWidth="3" fill="none" />
              {/* Close High Tongue */}
              <path 
                d={isAnimated ? "M 30 75 Q 45 40 65 38 Q 80 50 90 75 Z" : "M 30 75 Q 45 42 65 40 Q 80 52 90 75 Z"} 
                fill="#FDA4AF" 
                stroke="#E11D48" 
                strokeWidth="2" 
              />
              <path d="M 24 47 Q 17 50 24 53" stroke="#E11D48" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 24 54 Q 17 57 24 60" stroke="#E11D48" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <circle cx="58" cy="39" r="4.5" fill="#0D9488" className="animate-pulse" />
            </g>
          )
        };

      case 'uvular_stop': // Қ (Kaf)
        return {
          lipShape: 'Nötr / Açık Ağız',
          tonguePos: 'Dil Kökü Küçük Dile (Uvula) Tam Temasta',
          jaw: 'Hava Basıncı Küçük Dilde Patlar',
          tip: 'Normal K sesinden farklıdır. Dilinizin en arkasını küçük dilinize (boğaz köküne) vurdurarak patlatın.',
          frontLipSvg: (
            <g>
              <ellipse cx="60" cy="50" rx="42" ry="40" fill="#FDF2E9" stroke="#E2E8F0" strokeWidth="2" />
              <ellipse cx="60" cy="52" rx="24" ry="16" fill="#E11D48" />
              <ellipse cx="60" cy="52" rx="16" ry="9" fill="#1E293B" />
              {/* Uvula dancing */}
              <path 
                d={isAnimated ? "M 58 44 Q 60 54 62 44" : "M 58 45 Q 60 52 62 45"} 
                stroke="#F43F5E" 
                strokeWidth="3.5" 
                fill="#FB7185"
                className={isAnimated ? 'animate-[bounce_1.4s_infinite]' : ''} 
              />
            </g>
          ),
          crossSectionSvg: (
            <g>
              <path d="M 25 30 Q 50 25 75 32 Q 90 40 95 50" stroke="#64748B" strokeWidth="3" fill="none" />
              <circle cx="88" cy="44" r="3.5" fill="#E11D48" />
              {/* Tongue Back Rising to Uvula */}
              <path 
                d={isAnimated ? "M 30 75 Q 45 64 60 60 Q 86 42 90 75 Z" : "M 30 75 Q 45 65 60 62 Q 85 44 90 75 Z"} 
                fill="#FDA4AF" 
                stroke="#E11D48" 
                strokeWidth="2" 
              />
              <circle cx="86" cy="43" r="5.5" fill="#EF4444" className="animate-ping" style={{ animationDuration: '1.2s' }} />
            </g>
          )
        };

      case 'uvular_fricative': // Ғ (Gayn)
        return {
          lipShape: 'Nötr / Hafif Açık',
          tonguePos: 'Dil Kökü Küçük Dile Yaklaşır (Hırıltısız Sızıcı)',
          jaw: 'Boğazdan Titreşimli Kesintisiz Hava Akımı',
          tip: 'Fransızca r veya Arapça gayn gibi; boğazdan yumuşak ve ötümlü olarak sızarak çıkar.',
          frontLipSvg: (
            <g>
              <ellipse cx="60" cy="50" rx="42" ry="40" fill="#FDF2E9" stroke="#E2E8F0" strokeWidth="2" />
              <ellipse cx="60" cy="52" rx="22" ry="14" fill="#E11D48" />
              <ellipse cx="60" cy="52" rx="14" ry="8" fill="#1E293B" />
              {/* Airflow waves */}
              <path d="M 52 52 Q 60 47 68 52" stroke="#38BDF8" strokeWidth="2.5" fill="none" className={isAnimated ? 'animate-pulse' : ''} />
            </g>
          ),
          crossSectionSvg: (
            <g>
              <path d="M 25 30 Q 50 25 75 32 Q 90 40 95 50" stroke="#64748B" strokeWidth="3" fill="none" />
              <circle cx="88" cy="44" r="3" fill="#E11D48" />
              {/* Narrow gap at uvula */}
              <path d="M 30 75 Q 45 65 60 62 Q 83 48 90 75 Z" fill="#FDA4AF" stroke="#E11D48" strokeWidth="2" />
              {/* Continuous wave stream */}
              <path d="M 78 43 Q 85 46 92 43" stroke="#0284C7" strokeWidth="2.5" strokeDasharray="3 2" fill="none" className={isAnimated ? 'animate-[dash_1s_linear_infinite]' : ''} />
            </g>
          )
        };

      case 'nasal_velar': // Ң (Geniz N'si)
        return {
          lipShape: 'Açık Ağız & Geniz Yolu',
          tonguePos: 'Dil Sırtı Art Damağa Tam Yapışık',
          jaw: 'Hava Ağızdan Değil, Tamamen Burundan Çıkar',
          tip: 'Ağzınız açıkken «N» sesi çıkarmaya çalışın; ses damağınızın arkasından genzinize dolar.',
          frontLipSvg: (
            <g>
              <ellipse cx="60" cy="50" rx="42" ry="40" fill="#FDF2E9" stroke="#E2E8F0" strokeWidth="2" />
              <ellipse cx="60" cy="52" rx="22" ry="15" fill="#E11D48" />
              <ellipse cx="60" cy="52" rx="14" ry="8" fill="#1E293B" />
              {/* Nose glow & resonance pulses */}
              <ellipse cx="60" cy="36" rx="9" ry="6" fill="#0D9488" opacity={isAnimated ? "0.45" : "0.25"} className={isAnimated ? 'animate-pulse' : ''} />
              <circle cx="56" cy="37" r="1.8" fill="#0F766E" />
              <circle cx="64" cy="37" r="1.8" fill="#0F766E" />
              {isAnimated && (
                <path d="M 54 30 Q 60 25 66 30" stroke="#0D9488" strokeWidth="2" fill="none" className="animate-ping" style={{ transformOrigin: '60px 28px' }} />
              )}
            </g>
          ),
          crossSectionSvg: (
            <g>
              {/* Palate with lowered soft palate to open nasal cavity */}
              <path d="M 25 30 Q 50 25 70 30 Q 80 38 82 45" stroke="#64748B" strokeWidth="3" fill="none" />
              {/* Nasal Cavity Arrow */}
              <path d="M 75 18 Q 85 22 92 30" stroke="#0D9488" strokeWidth="2.5" strokeDasharray="3 2" fill="none" />
              {/* Tongue Sealed to Soft Palate */}
              <path d="M 30 75 Q 45 60 65 50 Q 78 40 90 75 Z" fill="#FDA4AF" stroke="#E11D48" strokeWidth="2" />
              <circle cx="78" cy="40" r="5" fill="#0D9488" className="animate-pulse" />
            </g>
          )
        };

      default:
        return {
          lipShape: 'Standart Ağız Konumu',
          tonguePos: 'Doğal Damak Teması',
          jaw: 'Normal Çene Açıklığı',
          tip: 'Sesin doğal çıkış noktasına dikkat edin.',
          frontLipSvg: (
            <g className={isAnimated ? 'animate-[pulse_1.8s_ease-in-out_infinite]' : ''}>
              <ellipse cx="60" cy="50" rx="42" ry="40" fill="#FDF2E9" stroke="#E2E8F0" strokeWidth="2" />
              <ellipse cx="60" cy="52" rx="20" ry="12" fill="#E11D48" />
              <ellipse cx="60" cy="52" rx="12" ry="6" fill="#1E293B" />
            </g>
          ),
          crossSectionSvg: (
            <g>
              <path d="M 25 30 Q 50 25 75 32 Q 90 40 95 50" stroke="#64748B" strokeWidth="3" fill="none" />
              <path d="M 30 75 Q 45 55 65 52 Q 80 58 90 75 Z" fill="#FDA4AF" stroke="#E11D48" strokeWidth="2" />
            </g>
          )
        };
    }
  };

  const details = getMouthDetails();

  return (
    <div className={`p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm ${className}`}>
      
      {/* Visual Header */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-600 text-white font-black flex items-center justify-center text-base shadow-xs">
            {letter}
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 leading-tight">
              {nameTr}
            </h4>
            <p className="text-[10px] text-teal-700 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Canlı Fonetik Ağız & Dudak Anatomisi</span>
            </p>
          </div>
        </div>

        {/* Animation & Sound Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsAnimated(!isAnimated)}
            className={`px-2 py-1 rounded-lg text-[10px] font-black border transition flex items-center gap-1 ${
              isAnimated 
                ? 'bg-teal-50 text-teal-800 border-teal-300' 
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title="Ağız ve dil hareket animasyonunu aç/kapat"
          >
            {isAnimated ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isAnimated ? 'Canlı Hareket' : 'Durduruldu'}</span>
          </button>

          <button
            onClick={handlePlayLetter}
            disabled={isPlayingSound}
            className="p-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition active:scale-95 disabled:opacity-60 cursor-pointer"
            title="Harfin Doğal Telaffuzunu Dinle"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dual Animated SVG Diagrams: Front Lip Shape & Sagittal Cross Section */}
      <div className="grid grid-cols-2 gap-3 items-center justify-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
        
        {/* 1. Önden Dudak Şekli (Frontal Lip Shape) */}
        <div className="text-center relative">
          <svg viewBox="0 0 120 100" className="w-full max-w-[130px] h-24 mx-auto drop-shadow-xs">
            {details.frontLipSvg}
          </svg>
          <span className="block text-[10px] font-black text-slate-800 mt-1">
            Önden Dudak Hareketi
          </span>
          <span className="block text-[9px] text-slate-500 leading-tight">
            {details.lipShape.split('(')[0]}
          </span>
        </div>

        {/* 2. Yandan Dil & Damak Kesiti (Sagittal Cross Section) */}
        <div className="text-center border-l border-slate-200 pl-3 relative">
          <svg viewBox="0 0 120 100" className="w-full max-w-[130px] h-24 mx-auto drop-shadow-xs">
            {details.crossSectionSvg}
          </svg>
          <span className="block text-[10px] font-black text-slate-800 mt-1">
            Yandan Dil & Boğaz Kesiti
          </span>
          <span className="block text-[9px] text-slate-500 leading-tight">
            {details.tonguePos.split('(')[0]}
          </span>
        </div>

      </div>

      {/* Articulatory Instructions & Pro-Tip */}
      {showLabels && (
        <div className="mt-3 space-y-1.5 text-[11px] text-slate-600">
          <div className="flex items-start gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
            <p>
              <strong className="text-slate-800">Çene & Dudak:</strong> {details.lipShape}
            </p>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
            <p>
              <strong className="text-slate-800">Dil Pozisyonu:</strong> {details.tonguePos}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 font-medium text-[10px] leading-relaxed mt-2 flex items-start gap-1.5">
            <span className="text-amber-600 text-sm leading-none shrink-0">💡</span>
            <div>
              <strong className="text-amber-950 font-black">Telaffuz İpucu:</strong> {details.tip}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
