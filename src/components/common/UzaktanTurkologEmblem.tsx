import React from 'react';

interface UzaktanTurkologEmblemProps {
  className?: string;
  size?: number | string;
  withGlow?: boolean;
}

/**
 * Uzaktan Türkolog Resmi Kültür & Dil Akademisi Amblemi
 * Motifler:
 * - Kutsal Alageyik Boynuzları & Silüeti (Göktürk & Kazak Bozkır Kılavuzu)
 * - Kazakistan Şaňırak & Güneş Işınları (Birlik ve Bilgelik)
 * - Açık Bilim & Türkolog Kitabı (Türkiye - Kazakistan Kardeşlik Köprüsü)
 * - Bozkır Turkuazı & Altın Sarısı Işıltı
 */
export const UzaktanTurkologEmblem: React.FC<UzaktanTurkologEmblemProps> = ({
  className = '',
  size = 44,
  withGlow = true
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${withGlow ? 'filter drop-shadow-[0_2px_8px_rgba(13,148,136,0.35)]' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transform transition-transform duration-300 hover:scale-105"
      >
        <defs>
          {/* Bozkır Turkuazı Dairesel Gradyan */}
          <linearGradient id="emblemBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F766E" />
            <stop offset="50%" stopColor="#115E59" />
            <stop offset="100%" stopColor="#042F2E" />
          </linearGradient>

          {/* Altın Işıltı Gradyanı */}
          <linearGradient id="goldGleam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Halka Bordür Gradyanı */}
          <linearGradient id="ringGold" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#FDE047" />
          </linearGradient>

          {/* Hafif İç Gölge */}
          <radialGradient id="innerLight" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#042F2E" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Dış Koruyucu Medalyon */}
        <circle cx="50" cy="50" r="48" fill="url(#emblemBg)" />
        <circle cx="50" cy="50" r="48" fill="url(#innerLight)" />
        <circle cx="50" cy="50" r="46.5" stroke="url(#ringGold)" strokeWidth="2.5" strokeDasharray="98 2" />

        {/* Göksel Şaňırak / Güneş Işınları Çelengi */}
        <g opacity="0.45" stroke="#FBBF24" strokeWidth="1.2">
          <line x1="50" y1="6" x2="50" y2="16" />
          <line x1="50" y1="84" x2="50" y2="94" />
          <line x1="6" y1="50" x2="16" y2="50" />
          <line x1="84" y1="50" x2="94" y2="50" />
          <line x1="19" y1="19" x2="26" y2="26" />
          <line x1="74" y1="74" x2="81" y2="81" />
          <line x1="81" y1="19" x2="74" y2="26" />
          <line x1="19" y1="81" x2="26" y2="74" />
        </g>

        {/* Üst Şaňırak Kemeri (Birlik ve Bilgelik Kubbesi) */}
        <path
          d="M 36 28 C 42 22 58 22 64 28"
          stroke="url(#goldGleam)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="50" cy="20" r="2.8" fill="#FDE047" />

        {/* Kutsal Alageyik Altın Boynuzları (Sanatsal & Zarif) */}
        <g stroke="url(#goldGleam)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Sol Boynuz */}
          <path d="M 46 44 C 42 36 34 32 26 31 C 28 35 32 37 36 38" />
          <path d="M 33 33 C 31 27 24 26 21 27" />
          <path d="M 39 37 C 38 31 34 26 30 25" />

          {/* Sağ Boynuz */}
          <path d="M 54 44 C 58 36 66 32 74 31 C 72 35 68 37 64 38" />
          <path d="M 67 33 C 69 27 76 26 79 27" />
          <path d="M 61 37 C 62 31 66 26 70 25" />
        </g>

        {/* Alageyik Asil Başı & Silüeti */}
        <path
          d="M 50 37 C 46 39 44 43 45 48 C 46 54 49 59 50 63 C 51 59 54 54 55 48 C 56 43 54 39 50 37 Z"
          fill="url(#goldGleam)"
        />

        {/* Alageyik Kulakları */}
        <path d="M 43 41 C 37 42 35 44 38 46 C 41 47 43 45 44 43 Z" fill="#FBBF24" />
        <path d="M 57 41 C 63 42 65 44 62 46 C 59 47 57 45 56 43 Z" fill="#FBBF24" />

        {/* Alageyik Alın Yıldızı (Türkistan Çolpan Yıldızı) */}
        <circle cx="50" cy="45" r="1.8" fill="#FFFFFF" />

        {/* Alt Kısım: Açık Türkolog Kitabı (Türkiye - Kazakistan Köprüsü) */}
        <g stroke="url(#goldGleam)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Sol Sayfa */}
          <path d="M 50 69 C 42 67 32 68 24 72 C 24 75 34 74 50 75 Z" fill="#0D9488" fillOpacity="0.6" />
          {/* Sağ Sayfa */}
          <path d="M 50 69 C 58 67 68 68 76 72 C 76 75 66 74 50 75 Z" fill="#0D9488" fillOpacity="0.6" />
          {/* Kitap Omurgası */}
          <line x1="50" y1="67" x2="50" y2="76" stroke="#FDE047" strokeWidth="2" />
        </g>

        {/* Sayfa Satırları / Bilgelik Işıltısı */}
        <line x1="30" y1="71" x2="44" y2="70" stroke="#FDE047" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
        <line x1="56" y1="70" x2="70" y2="71" stroke="#FDE047" strokeWidth="1" strokeLinecap="round" opacity="0.8" />

        {/* Alt Merkez Elmas Parıltısı */}
        <polygon points="50,79 52,82 50,85 48,82" fill="#FDE047" />
      </svg>
    </div>
  );
};
