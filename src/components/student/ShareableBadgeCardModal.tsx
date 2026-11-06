import React, { useEffect, useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Award, 
  Flame, 
  Trophy, 
  Zap, 
  BookOpen, 
  Crown, 
  Mic, 
  GraduationCap,
  Smartphone,
  Square
} from 'lucide-react';
import { UserBadge, UserProfile } from '../../types';

interface ShareableBadgeCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge: UserBadge | null;
  user: UserProfile;
  stats?: { progress: number; max: number; unit?: string };
}

type CardFormat = 'square' | 'story';
type CardTheme = 'steppe' | 'turquoise' | 'royal' | 'gold';

export const ShareableBadgeCardModal: React.FC<ShareableBadgeCardModalProps> = ({
  isOpen,
  onClose,
  badge,
  user,
  stats
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [format, setFormat] = useState<CardFormat>('square');
  const [theme, setTheme] = useState<CardTheme>('steppe');
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copiedState, setCopiedState] = useState<'idle' | 'image' | 'text'>('idle');
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);

  // Map badge icon to emoji/symbol
  const getBadgeEmoji = (iconName: string): string => {
    switch (iconName) {
      case 'Award': return '🏅';
      case 'Flame': return '🔥';
      case 'Trophy': return '🏆';
      case 'Zap': return '⚡';
      case 'BookOpen': return '📖';
      case 'Crown': return '👑';
      case 'Mic': return '🎙️';
      case 'GraduationCap': return '🎓';
      case 'Sparkles': return '✨';
      case 'Bookmark': return '🔖';
      default: return '⭐';
    }
  };

  // Safe roundRect helper for older browser/webview compatibility
  const drawSafeRoundRect = (
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    if (typeof c.roundRect === 'function') {
      c.roundRect(x, y, w, h, r);
    } else {
      c.moveTo(x + r, y);
      c.arcTo(x + w, y, x + w, y + h, r);
      c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r);
      c.arcTo(x, y, x + w, y, r);
      c.closePath();
    }
  };

  // Redraw canvas whenever badge, format, or theme changes
  useEffect(() => {
    if (!isOpen || !badge) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1080;
    const height = format === 'square' ? 1080 : 1920;
    canvas.width = width;
    canvas.height = height;

    // 1. Background Theme Gradients
    let bgGrad = ctx.createLinearGradient(0, 0, width, height);
    let primaryGold = '#F59E0B';
    let lightGold = '#FDE68A';
    let darkGold = '#B45309';
    let accentBorder = '#FBBF24';

    if (theme === 'steppe') {
      // Steppe Night (Navy / Deep Indigo)
      bgGrad.addColorStop(0, '#0F172A');
      bgGrad.addColorStop(0.5, '#1E1B4B');
      bgGrad.addColorStop(1, '#0B0F19');
    } else if (theme === 'turquoise') {
      // Kazakh Flag Turquoise
      bgGrad.addColorStop(0, '#042F2E');
      bgGrad.addColorStop(0.5, '#0E7490');
      bgGrad.addColorStop(1, '#083344');
      accentBorder = '#38BDF8';
    } else if (theme === 'royal') {
      // Hazar Bozkır Turkuazı & Zümrüt
      bgGrad.addColorStop(0, '#042F2E');
      bgGrad.addColorStop(0.5, '#0F766E');
      bgGrad.addColorStop(1, '#115E59');
      accentBorder = '#2DD4BF';
    } else {
      // Golden Steppe Amber
      bgGrad.addColorStop(0, '#451A03');
      bgGrad.addColorStop(0.5, '#78350F');
      bgGrad.addColorStop(1, '#1C1917');
    }

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle Kazakh Starfield / Geometrics
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < 40; i++) {
      const x = (i * 137) % width;
      const y = (i * 219) % height;
      const radius = ((i % 5) + 2);
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3. Traditional Kazakh Nomadic Border & Corner Ornaments (қошқар мүйіз)
    const margin = format === 'square' ? 60 : 80;
    ctx.strokeStyle = accentBorder;
    ctx.lineWidth = 4;
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

    // Inner thin border
    ctx.strokeStyle = 'rgba(253, 230, 138, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(margin + 16, margin + 16, width - (margin + 16) * 2, height - (margin + 16) * 2);

    // Decorative corner brackets
    const drawCornerOrnament = (cx: number, cy: number, flipX: number, flipY: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(flipX, flipY);
      ctx.strokeStyle = primaryGold;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.lineTo(0, 0);
      ctx.lineTo(40, 0);
      ctx.stroke();

      // Small spiral curl
      ctx.beginPath();
      ctx.arc(20, 20, 10, 0, Math.PI * 1.5, false);
      ctx.stroke();
      ctx.restore();
    };

    drawCornerOrnament(margin + 6, margin + 6, 1, 1);
    drawCornerOrnament(width - margin - 6, margin + 6, -1, 1);
    drawCornerOrnament(margin + 6, height - margin - 6, 1, -1);
    drawCornerOrnament(width - margin - 6, height - margin - 6, -1, -1);

    // 4. Header: Platform Identity & Nomad Sun Emblem
    const centerYOffset = format === 'story' ? 240 : 120;

    // Small pill badge
    ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
    const pillW = 460;
    const pillH = 46;
    const pillX = (width - pillW) / 2;
    const pillY = centerYOffset;
    ctx.beginPath();
    drawSafeRoundRect(ctx, pillX, pillY, pillW, pillH, 23);
    ctx.fill();
    ctx.strokeStyle = primaryGold;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = lightGold;
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⭐ UZAKTAN TÜRKOLOG • БАСТАУ ⭐', width / 2, pillY + 30);

    // Main Category Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('РЕСМИ БАСТЫ ЖЕТІСТІК • RESMİ BAŞARI ROZETİ', width / 2, pillY + 95);

    // 5. Central Badge Medallion (Sunburst / Laurel Circle)
    const medalY = format === 'story' ? height * 0.40 : height * 0.42;
    const medalRadius = 140;

    // Outer Glow
    const glowGrad = ctx.createRadialGradient(width / 2, medalY, medalRadius * 0.5, width / 2, medalY, medalRadius * 1.5);
    glowGrad.addColorStop(0, 'rgba(245, 158, 11, 0.4)');
    glowGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(width / 2, medalY, medalRadius * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Golden Sunburst Ring
    ctx.save();
    ctx.translate(width / 2, medalY);
    ctx.strokeStyle = primaryGold;
    ctx.lineWidth = 3;
    const rays = 24;
    for (let r = 0; r < rays; r++) {
      ctx.rotate((Math.PI * 2) / rays);
      ctx.beginPath();
      ctx.moveTo(0, medalRadius - 5);
      ctx.lineTo(0, medalRadius + 18);
      ctx.stroke();
    }
    ctx.restore();

    // Central Circle
    const innerGrad = ctx.createLinearGradient(width / 2 - medalRadius, medalY - medalRadius, width / 2 + medalRadius, medalY + medalRadius);
    innerGrad.addColorStop(0, '#78350F');
    innerGrad.addColorStop(0.5, '#451A03');
    innerGrad.addColorStop(1, '#1C1917');
    ctx.fillStyle = innerGrad;
    ctx.beginPath();
    ctx.arc(width / 2, medalY, medalRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = accentBorder;
    ctx.lineWidth = 6;
    ctx.stroke();

    // Inner gold ring
    ctx.strokeStyle = lightGold;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width / 2, medalY, medalRadius - 12, 0, Math.PI * 2);
    ctx.stroke();

    // Badge Emoji
    const emoji = getBadgeEmoji(badge.icon);
    ctx.font = '110px "Noto Color Emoji", "Apple Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, width / 2, medalY + 5);

    // 6. Badge Titles & Description
    const textStartY = format === 'story' ? medalY + medalRadius + 90 : medalY + medalRadius + 60;

    // Badge Title in Gold
    const titleGrad = ctx.createLinearGradient(width / 2 - 250, textStartY, width / 2 + 250, textStartY);
    titleGrad.addColorStop(0, '#FDE68A');
    titleGrad.addColorStop(0.5, '#F59E0B');
    titleGrad.addColorStop(1, '#FBBF24');
    ctx.fillStyle = titleGrad;
    ctx.font = '800 44px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(badge.titleTr, width / 2, textStartY);

    // Kazakh Subtitle
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`« ${badge.titleKz} »`, width / 2, textStartY + 45);

    // Description text
    ctx.fillStyle = '#94A3B8';
    ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(badge.descriptionTr, width / 2, textStartY + 88);

    // 7. Student Achievement Card Strip
    const studentCardY = format === 'story' ? height * 0.72 : height * 0.75;
    const cardW = width - (margin + 40) * 2;
    const cardH = 150;
    const cardX = (width - cardW) / 2;

    // Card background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.beginPath();
    drawSafeRoundRect(ctx, cardX, studentCardY, cardW, cardH, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(253, 230, 138, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Student Avatar circle
    const avatarX = cardX + 75;
    const avatarY = studentCardY + cardH / 2;
    ctx.fillStyle = primaryGold;
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, 44, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1E1B4B';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const initial = (user.name || user.nickname || 'T').charAt(0).toUpperCase();
    ctx.fillText(initial, avatarX, avatarY);

    // Student Names & Ranks
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(user.name || 'Öğrenci', cardX + 140, studentCardY + 55);

    ctx.fillStyle = lightGold;
    ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
    const rankTitle = user.nickname ? `${user.nickname} • Türkolog` : (user.customTitle || 'Тіл Жанашыры');
    ctx.fillText(rankTitle, cardX + 140, studentCardY + 88);

    // Level & XP chip
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Seviye: ${user.currentLevel}  |  ${user.xpPoints} XP  |  ${user.streakDays} Gün Seri 🔥`, cardX + 140, studentCardY + 118);

    // 8. Verification Footer
    const footerY = height - margin - 35;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`uzaktanturkolog.com  •  Resmi Doğrulama Kodu: ${badge.id.toUpperCase()}-${user.id.slice(-4).toUpperCase()}`, width / 2, footerY);

    // Generate Data URL for direct download and preview
    setDataUrl(canvas.toDataURL('image/png'));
  }, [isOpen, badge, format, theme, user]);

  if (!isOpen || !badge) return null;

  // Action: Download PNG
  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = `uzaktan-turkolog-${badge.id}-${format}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Action: Copy to Clipboard
  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        if (navigator.clipboard && window.ClipboardItem) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setCopiedState('image');
            setTimeout(() => setCopiedState('idle'), 3000);
            return;
          } catch {}
        }
        // Fallback: Copy share text
        await handleCopyText();
      });
    } catch {
      await handleCopyText();
    }
  };

  // Action: Copy share text caption
  const handleCopyText = async () => {
    const text = `🏆 Uzaktan Türkolog'da "${badge.titleTr}" (${badge.titleKz}) başarısını kazandım!\n\nSeviye: CEFR ${user.currentLevel} | Puan: ${user.xpPoints} XP | Seri: ${user.streakDays} Gün\n\nSen de çift yönlü Kazakça öğren: https://uzaktanturkolog.com\n#UzaktanTürkolog #Kazakça #Türkolog #QazaqTili`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedState('text');
      setTimeout(() => setCopiedState('idle'), 3000);
    } catch {}
  };

  // Action: Native Web Share API
  const handleShare = async () => {
    const canvas = canvasRef.current;
    const title = `Uzaktan Türkolog - ${badge.titleTr} Rozeti`;
    const text = `Uzaktan Türkolog platformunda "${badge.titleTr}" başarısını kazandım!`;

    if (canvas && navigator.canShare) {
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `turkolog-${badge.id}.png`, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                title,
                text,
                files: [file]
              });
              setShareSuccess(true);
              setTimeout(() => setShareSuccess(false), 3000);
              return;
            } catch {}
          }
        }
        // Fallback standard share without file
        try {
          await navigator.share({
            title,
            text,
            url: window.location.origin
          });
        } catch {}
      });
    } else if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: window.location.origin
        });
      } catch {}
    } else {
      // Direct download & copy text fallback
      handleDownload();
      handleCopyText();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-4 sm:p-6 text-white space-y-4 shadow-2xl relative my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">
                Başarı Rozeti Paylaşım Kartı
              </h3>
              <p className="text-[11px] text-slate-400">
                Sosyal medyada paylaşmak için yüksek çözünürlüklü görsel oluşturucu
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format & Theme Controls */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Format Toggle */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Görsel Formatı
            </label>
            <div className="flex gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
              <button
                onClick={() => setFormat('square')}
                className={`flex-1 py-1 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition ${
                  format === 'square'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Square className="w-3.5 h-3.5" />
                <span>Kare (1:1)</span>
              </button>
              <button
                onClick={() => setFormat('story')}
                className={`flex-1 py-1 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition ${
                  format === 'story'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Hikaye (9:16)</span>
              </button>
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Renk Teması
            </label>
            <div className="flex gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
              <button
                onClick={() => setTheme('steppe')}
                title="Bozkır Gece Mavisi"
                className={`flex-1 h-7 rounded-lg border-2 transition ${
                  theme === 'steppe' ? 'border-amber-400 scale-105' : 'border-transparent'
                } bg-gradient-to-r from-slate-950 to-teal-950`}
              />
              <button
                onClick={() => setTheme('turquoise')}
                title="Kazak Turkuazı"
                className={`flex-1 h-7 rounded-lg border-2 transition ${
                  theme === 'turquoise' ? 'border-cyan-300 scale-105' : 'border-transparent'
                } bg-gradient-to-r from-teal-800 to-cyan-700`}
              />
              <button
                onClick={() => setTheme('royal')}
                title="Hazar Zümrüdü & Derin Turkuaz"
                className={`flex-1 h-7 rounded-lg border-2 transition ${
                  theme === 'royal' ? 'border-teal-300 scale-105' : 'border-transparent'
                } bg-gradient-to-r from-teal-900 to-cyan-800`}
              />
              <button
                onClick={() => setTheme('gold')}
                title="Altın Orda"
                className={`flex-1 h-7 rounded-lg border-2 transition ${
                  theme === 'gold' ? 'border-amber-300 scale-105' : 'border-transparent'
                } bg-gradient-to-r from-amber-900 to-yellow-800`}
              />
            </div>
          </div>
        </div>

        {/* Hidden Canvas used for high-res generation */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Live Card Preview */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-inner flex items-center justify-center p-2">
          {dataUrl ? (
            <img 
              src={dataUrl} 
              alt={badge.titleTr}
              className={`rounded-xl shadow-lg object-contain transition-all duration-300 ${
                format === 'square' ? 'max-h-72 w-full aspect-square' : 'max-h-80 w-auto aspect-9/16'
              }`}
            />
          ) : (
            <div className="py-20 text-center text-slate-500 text-xs">
              Görsel kartı oluşturuluyor...
            </div>
          )}

          {/* Copied or Shared Toast */}
          {(copiedState !== 'idle' || shareSuccess) && (
            <div className="absolute top-4 bg-emerald-500 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in zoom-in">
              <Check className="w-4 h-4" />
              <span>
                {copiedState === 'image' && 'Görsel Panoya Kopyalandı!'}
                {copiedState === 'text' && 'Paylaşım Metni Panoya Kopyalandı!'}
                {shareSuccess && 'Sosyal Medyada Paylaşıldı!'}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Download PNG Button */}
          <button
            onClick={handleDownload}
            className="py-2.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>Görseli İndir (PNG)</span>
          </button>

          {/* Copy to Clipboard */}
          <button
            onClick={handleCopyImage}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 shadow-xs transition flex items-center justify-center gap-1.5 active:scale-98"
          >
            <Copy className="w-4 h-4 text-teal-400" />
            <span>
              {copiedState === 'image' ? 'Kopyalandı!' : 'Panoya Kopyala'}
            </span>
          </button>

          {/* Web Share API */}
          <button
            onClick={handleShare}
            className="py-2.5 px-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 active:scale-98"
          >
            <Share2 className="w-4 h-4 text-amber-300" />
            <span>Paylaş / Бөлісу</span>
          </button>
        </div>

        {/* Social Sharing Hint */}
        <div className="text-[10px] text-slate-400 bg-slate-800/50 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <span>Instagram Story, WhatsApp Durum, Telegram ve Twitter ile uyumlu.</span>
          <button
            onClick={handleCopyText}
            className="text-teal-400 hover:text-teal-300 font-bold underline shrink-0 ml-2"
          >
            Metni Kopyala
          </button>
        </div>

      </div>
    </div>
  );
};
