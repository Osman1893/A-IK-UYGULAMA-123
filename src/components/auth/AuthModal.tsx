import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  X, 
  Mail, 
  Lock, 
  User, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Compass,
  AlertCircle,
  LogIn,
  UserPlus
} from 'lucide-react';
import { LanguageDirection, CefrLevel } from '../../types';
import { UzaktanTurkologEmblem } from '../common/UzaktanTurkologEmblem';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMandatory?: boolean;
  initialTab?: 'login' | 'register';
  onLogin: (email: string, direction: LanguageDirection, level: CefrLevel, password?: string) => { success: boolean; error?: string } | void;
  onRegister: (email: string, name: string, direction: LanguageDirection, level: CefrLevel, nickname?: string, password?: string) => void;
  onAdminLogin?: (password: string) => { success: boolean; error?: string };
  onOpenPlacementModal?: (callback: (lvl: CefrLevel) => void) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  isMandatory = false,
  initialTab = 'login',
  onLogin,
  onRegister,
  onOpenPlacementModal
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [selectedDirection, setSelectedDirection] = useState<LanguageDirection>('TR_TO_KZ');
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel>('A1');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [testedLevelBadge, setTestedLevelBadge] = useState<CefrLevel | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab === 'register' ? 'register' : 'login');
      setErrorMessage(null);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleLaunchPlacement = () => {
    if (onOpenPlacementModal) {
      onOpenPlacementModal((lvl: CefrLevel) => {
        setSelectedLevel(lvl);
        setTestedLevelBadge(lvl);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }

    if (tab === 'login') {
      const res = onLogin(cleanEmail, selectedDirection, selectedLevel, password);
      if (res && !res.success) {
        setErrorMessage(res.error || 'E-posta veya şifre hatalı. Lütfen tekrar deneyiniz.');
        return;
      }
      onClose();
    } else {
      try {
        const finalName = name.trim() || cleanEmail.split('@')[0];
        onRegister(cleanEmail, finalName, selectedDirection, selectedLevel, nickname.trim() || undefined, password);
        onClose();
      } catch (err: any) {
        setErrorMessage(err.message || 'Kayıt işlemi gerçekleştirilemedi. Lütfen bilgilerinizi kontrol ediniz.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {!isMandatory && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Brand Header */}
        <div className="pt-6 pb-3 px-6 text-center bg-gradient-to-b from-teal-50/70 via-slate-50/40 to-white shrink-0">
          <div className="flex justify-center mb-2">
            <UzaktanTurkologEmblem size="sm" showGlow={false} />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            UZAKTAN TÜRKOLOG
          </h2>
          <p className="text-[11px] font-semibold text-teal-800 tracking-wide mt-0.5">
            Çift Yönlü Türkçe - Kazakça Dil ve Kültür Platformu
          </p>
        </div>

        {/* Sleek Segmented Switcher (Giriş Yap / Kayıt Ol) */}
        <div className="px-6 pt-1 pb-3 shrink-0">
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setTab('login'); setErrorMessage(null); }}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                tab === 'login'
                  ? 'bg-white text-teal-800 font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Giriş Yap</span>
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setErrorMessage(null); }}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                tab === 'register'
                  ? 'bg-white text-teal-800 font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Kayıt Ol</span>
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto px-6 pb-6 space-y-4 flex-1">
          
          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Target Language Selection (Sleek Two-Card Toggle) */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-teal-600" />
                <span>Öğrenmek İstediğiniz Dil / Тіл бағыты:</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDirection('TR_TO_KZ')}
                  className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    selectedDirection === 'TR_TO_KZ'
                      ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">🇹🇷 ➔ 🇰🇿</span>
                    {selectedDirection === 'TR_TO_KZ' && (
                      <span className="w-2 h-2 rounded-full bg-teal-600" />
                    )}
                  </div>
                  <div className="mt-1">
                    <div className="text-xs font-black text-slate-900 leading-tight">
                      Kazakça Öğren
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Türkçe anlatımlı
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDirection('KZ_TO_TR')}
                  className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    selectedDirection === 'KZ_TO_TR'
                      ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">🇰🇿 ➔ 🇹🇷</span>
                    {selectedDirection === 'KZ_TO_TR' && (
                      <span className="w-2 h-2 rounded-full bg-teal-600" />
                    )}
                  </div>
                  <div className="mt-1">
                    <div className="text-xs font-black text-slate-900 leading-tight">
                      Түрікше үйрен
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Қазақша түсіндірме
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Target Level Picker */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Hedef Seviyeniz:</span>
                </label>
                {onOpenPlacementModal && (
                  <button
                    type="button"
                    onClick={handleLaunchPlacement}
                    className="text-[10px] font-bold text-teal-800 hover:text-teal-900 flex items-center gap-1 bg-teal-100/80 px-2 py-0.5 rounded-lg border border-teal-200 transition cursor-pointer"
                  >
                    <span>🎯 Seviyeni Test Et</span>
                  </button>
                )}
              </div>

              {testedLevelBadge && (
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-bold flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Test sonucu belirlenen seviyeniz: <strong>{testedLevelBadge}</strong></span>
                </div>
              )}

              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                {(['A1', 'A2', 'B1', 'B2', 'C1'] as CefrLevel[]).map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedLevel(lvl)}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      selectedLevel === lvl
                        ? 'bg-teal-600 text-white shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Register Fields: Name & Optional Nickname */}
            {tab === 'register' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ad Soyad / Аты-жөні
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Adınız ve Soyadınız"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Kullanıcı Adı</span>
                    <span className="text-[10px] text-teal-600 font-normal">İsteğe bağlı</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-black text-xs">@</span>
                    <input
                      type="text"
                      placeholder="kullanici_adi"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value.replace(/[^a-zA-Z0-9_ğüşıöçĞÜŞİÖÇәіңғүұқөһӘІҢҒҮҰҚӨҺ]/g, ''))}
                      className="w-full pl-8 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition font-bold text-teal-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="ornek@eposta.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition font-medium"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Şifre
                </label>
                {tab === 'login' && (
                  <span className="text-[10px] text-slate-400 font-medium">
                    (İlk giriş için boş bırakabilirsiniz)
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {tab === 'register' && (
              <label className="flex items-center gap-2 cursor-pointer pt-0.5">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  required
                />
                <span className="text-[11px] text-slate-600">
                  Kullanım koşullarını ve gizlilik politikasını kabul ediyorum.
                </span>
              </label>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl font-black text-xs text-white bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 hover:opacity-95 active:scale-[0.99] transition shadow-md shadow-teal-600/20 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <span>{tab === 'login' ? 'Giriş Yap' : 'Hesap Oluştur ve Başla'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Modal Footer */}
        <div className="py-2.5 px-6 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400 font-medium shrink-0">
          Uzaktan Türkolog • Türk Dünyası Çift Yönlü Dil Platformu
        </div>

      </div>
    </div>
  );
};
