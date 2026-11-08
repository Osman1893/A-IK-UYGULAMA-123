import React from 'react';
import { 
  Globe, 
  Smartphone, 
  Monitor, 
  ShieldCheck, 
  User, 
  ArrowLeftRight, 
  LogOut,
  Sparkles,
  LogIn
} from 'lucide-react';
import { UserProfile, LanguageDirection } from '../../types';
import { UzaktanTurkologEmblem } from '../common/UzaktanTurkologEmblem';
import { audioService, AudioPlaybackSpeed } from '../../services/audioService';

interface NavbarProps {
  user: UserProfile;
  viewMode: 'mobile' | 'web' | 'admin';
  setViewMode: (mode: 'mobile' | 'web' | 'admin') => void;
  onDirectionChange: (direction: LanguageDirection) => void;
  onOpenAuth: (tab?: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  viewMode,
  setViewMode,
  onDirectionChange,
  onOpenAuth,
  onLogout
}) => {
  const isTrToKz = user.currentDirection === 'TR_TO_KZ';
  const isGuest = user.isGuest || user.email === 'misafir@uzaktanturkolog.com';
  const [audioSpeed, setAudioSpeed] = React.useState<AudioPlaybackSpeed>(audioService.getAudioSpeed());

  const handleCycleSpeed = () => {
    let next: AudioPlaybackSpeed = 1.0;
    if (audioSpeed === 0.75) next = 1.0;
    else if (audioSpeed === 1.0) next = 1.25;
    else if (audioSpeed === 1.25) next = 1.5;
    else next = 0.75;

    audioService.setAudioSpeed(next);
    setAudioSpeed(next);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name with Memorable Emblem */}
        <div className="flex items-center gap-3">
          <UzaktanTurkologEmblem size={44} withGlow={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                UZAKTAN TÜRKOLOG
              </span>
              <span 
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider select-none flex items-center gap-1"
                title="Kutsal Alageyik Kılavuzluğunda"
              >
                <span>🦌 Alageyik</span>
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
              {isTrToKz ? 'Çift Yönlü Türkçe - Kazakça Dil ve Kültür Platformu' : 'Түрікше - Қазақша екіжақты тіл үйрену платформасы'}
            </p>
          </div>
        </div>

        {/* Center: Language Direction & Mode Switches */}
        <div className="flex items-center gap-2">
          {/* Audio Speed Global Switch (0.75x, 1.0x, 1.25x, 1.5x) */}
          <button
            onClick={handleCycleSpeed}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-black transition-all shadow-2xs cursor-pointer ${
              audioSpeed !== 1.0
                ? 'bg-amber-100 text-amber-950 border-amber-300 ring-1 ring-amber-300'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="Seslendirme Hızı (0.75x, 1.0x, 1.25x, 1.5x)"
          >
            <span>⚡ {audioSpeed}x</span>
            <span className="text-[10px] text-slate-500 font-bold hidden lg:inline">
              {audioSpeed === 0.75 ? 'Yavaş' : audioSpeed === 1.0 ? 'Normal' : audioSpeed === 1.25 ? 'Hızlı' : 'Çok Hızlı'}
            </span>
          </button>

          {/* Language Direction Toggle */}
          <button
            onClick={() => onDirectionChange(isTrToKz ? 'KZ_TO_TR' : 'TR_TO_KZ')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-all shadow-2xs cursor-pointer"
            title="Öğrenme Yönünü Değiştir / Оқу бағытын өзгерту"
          >
            {isTrToKz ? (
              <>
                <span className="flex items-center gap-1 font-bold text-teal-700">🇹🇷 Türkçe</span>
                <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="flex items-center gap-1 font-bold text-cyan-700">🇰🇿 Kazakça</span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1 font-bold text-cyan-700">🇰🇿 Қазақша</span>
                <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="flex items-center gap-1 font-bold text-teal-700">🇹🇷 Түрікше</span>
              </>
            )}
          </button>

          {/* View Mode Segmented Control */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'mobile'
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobil Önizleme</span>
            </button>
            <button
              onClick={() => setViewMode('web')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'web'
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Geniş Web Görünümü</span>
            </button>
            {/* ONLY VISIBLE TO VERIFIED SUPER ADMIN */}
            {user.isSuperAdmin && (
              <button
                onClick={() => setViewMode('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'admin'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-amber-800 hover:text-amber-950 font-extrabold bg-amber-50 border border-amber-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Super Admin Paneli</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            )}
          </div>
        </div>

        {/* Right: User Authentication, Energy & Profile Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Energy Pill (Requirement 3: 100 energy, 8h refill or Pro unlimited) */}
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-xs font-black shadow-2xs"
            title={user.isPremium ? 'Sınırsız Enerji (PRO Sürüm)' : `Günlük Enerji: ${user.energy || 100}/100. 8 saatte bir yenilenir.`}
          >
            <span className="text-amber-500 text-sm">⚡</span>
            {user.isPremium ? (
              <span className="text-amber-900 flex items-center gap-1 text-[11px]">
                <span>∞</span>
                <span className="text-[9px] bg-amber-200 px-1 rounded font-black text-amber-950">PRO</span>
              </span>
            ) : (
              <span className="text-amber-900 text-[11px]">
                {user.energy !== undefined ? user.energy : 100}<span className="text-[9px] text-amber-600 font-bold">/100</span>
              </span>
            )}
          </div>

          {/* If verified Super Admin */}
          {user.isSuperAdmin ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'admin' ? 'mobile' : 'admin')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition active:scale-95"
                title="Yönetici Paneline Geç / Düzenle"
              >
                <ShieldCheck className="w-4 h-4 stroke-[2.3]" />
                <span>{viewMode === 'admin' ? 'Öğrenci Modu' : 'Yönetici Paneli'}</span>
              </button>

              <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs">
                <span className="font-extrabold">{(user?.name || 'Admin').split(' ')[0]}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition"
                title="Yönetici Oturumunu Kapat"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Çıkış</span>
              </button>
            </div>
          ) : isGuest ? (
            /* Guest / Unregistered Visitor: Only show standard login/register */
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-sm transition cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Giriş Yap / Üye Ol</span>
              </button>
            </div>
          ) : (
            /* Registered Regular Student Member */
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition text-xs font-semibold text-slate-800 shadow-2xs cursor-pointer"
                title="Hesap Ayarları"
              >
                <img
                  src={user.avatarUrl || 'https://api.dicebear.com/7.x/adventurer/svg?seed=user'}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-teal-500"
                />
                <div className="hidden sm:flex flex-col text-left leading-none">
                  <span className="font-bold text-slate-900 max-w-[110px] truncate">
                    {user.name}
                  </span>
                  {user.nickname && (
                    <span className="text-[10px] text-teal-700 font-extrabold truncate">
                      @{user.nickname}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={onLogout}
                className="p-1.5 sm:px-2 sm:py-1.5 rounded-xl border border-slate-200 hover:border-rose-300 text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition text-xs font-bold"
                title="Oturumu Kapat"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Mobile Bottom Mode Selector Bar */}
      <div className="md:hidden flex items-center justify-around bg-slate-100 border-t border-slate-200 py-1.5 px-2">
        <button
          onClick={() => setViewMode('mobile')}
          className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md ${
            viewMode === 'mobile' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobil</span>
        </button>
        <button
          onClick={() => setViewMode('web')}
          className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md ${
            viewMode === 'web' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Web</span>
        </button>
        {/* ONLY SHOWN TO VERIFIED SUPER ADMIN */}
        {user.isSuperAdmin && (
          <button
            onClick={() => setViewMode('admin')}
            className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md ${
              viewMode === 'admin' ? 'bg-amber-500 text-white' : 'text-amber-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        )}
      </div>
    </header>
  );
};
