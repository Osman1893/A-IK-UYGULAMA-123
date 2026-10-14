import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  X, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Compass,
  AlertCircle,
  KeyRound,
  LogIn,
  UserPlus
} from 'lucide-react';
import { SUPER_ADMIN_EMAIL } from '../../services/storageService';
import { LanguageDirection, CefrLevel } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMandatory?: boolean; // When true, modal cannot be closed; forces registration/login
  initialTab?: 'login' | 'register' | 'admin';
  onLogin: (email: string, direction: LanguageDirection, level: CefrLevel, password?: string) => { success: boolean; error?: string } | void;
  onRegister: (email: string, name: string, direction: LanguageDirection, level: CefrLevel, nickname?: string, password?: string) => void;
  onAdminLogin: (password: string) => { success: boolean; error?: string };
  onOpenPlacementModal?: (callback: (lvl: CefrLevel) => void) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  isMandatory = false,
  initialTab = 'login',
  onLogin,
  onRegister,
  onAdminLogin,
  onOpenPlacementModal
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'admin'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
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
      setTab(initialTab);
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

    if (tab === 'admin') {
      const res = onAdminLogin(adminPassword);
      if (res && !res.success) {
        setErrorMessage(res.error || 'Hatalı yönetici şifresi!');
        return;
      }
      onClose();
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }

    if (tab === 'login') {
      const res = onLogin(email.trim(), selectedDirection, selectedLevel, password);
      if (res && !res.success) {
        setErrorMessage(res.error || 'Giriş yapılamadı.');
        return;
      }
      onClose();
    } else {
      try {
        const finalName = name.trim() || email.split('@')[0];
        onRegister(email.trim(), finalName, selectedDirection, selectedLevel, nickname.trim() || undefined, password);
        onClose();
      } catch (err: any) {
        setErrorMessage(err.message || 'Kayıt işlemi gerçekleştirilemedi.');
        return;
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Close Button - Only shown when not mandatory */}
        {!isMandatory && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Mandatory Membership Banner (Requirement 1: Misafir kullanımı yok, üyelik zorunlu) */}
        {isMandatory && (
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[11px] font-bold py-2 px-4 text-center flex items-center justify-center gap-1.5 shadow-xs shrink-0">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Misafir kullanımı kapalıdır. İlerlemenizin kaydedilmesi için üye girişi zorunludur.</span>
          </div>
        )}

        {/* Modal Header & Brand */}
        <div className="pt-6 pb-3 px-6 text-center bg-gradient-to-b from-teal-50 to-white shrink-0">
          <div className="w-13 h-13 mx-auto mb-2 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-600/30">
            <Globe className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            UZAKTAN TÜRKOLOG
          </h2>
          <p className="text-[11px] font-bold text-teal-800 tracking-wide uppercase mt-0.5">
            {tab === 'login' && 'ÜYE GİRİŞİ / КІРУ'}
            {tab === 'register' && 'YENİ HESAP OLUŞTUR / ТІРКЕЛУ'}
            {tab === 'admin' && 'YÖNETİCİ GİRİŞİ / ADMIN PANELİ'}
          </p>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto px-6 pb-6 space-y-4 flex-1">

          {/* Two Standard Tabs for Public Users, Admin tab ONLY if email is Osman Dadaş or admin mode requested */}
          <div className="flex border-b border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setTab('login'); setErrorMessage(null); }}
              className={`flex-1 py-2.5 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
                tab === 'login'
                  ? 'border-violet-600 text-violet-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Giriş Yap</span>
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setErrorMessage(null); }}
              className={`flex-1 py-2.5 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
                tab === 'register'
                  ? 'border-violet-600 text-violet-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Kayıt Ol</span>
            </button>
            {/* ADMIN TAB: VISIBLE WHEN ADMIN SELECTED OR FOR SUPER ADMIN EMAIL */}
            {(tab === 'admin' || email.toLowerCase().trim() === SUPER_ADMIN_EMAIL.toLowerCase() || initialTab === 'admin') && (
              <button
                type="button"
                onClick={() => { setTab('admin'); setErrorMessage(null); }}
                className={`py-2.5 px-3 text-center border-b-2 transition flex items-center justify-center gap-1 ${
                  tab === 'admin'
                    ? 'border-amber-500 text-amber-700 font-extrabold'
                    : 'border-transparent text-amber-600 hover:text-amber-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Yönetici</span>
              </button>
            )}
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ================= ADMIN TAB ================= */}
          {tab === 'admin' && (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-black text-xs">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>SİSTEM YÖNETİCİSİ DOĞRULAMASI</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Bu alan müfredat, sözlük, forum ve ayarları yönetmek üzere Baş Yönetici (Osman Dadaş) için ayrılmıştır. Normal kullanıcılar kendi üyelikleriyle giriş yapmalıdır.
                </p>
                <div className="pt-1 text-[11px] font-mono text-amber-950 font-bold">
                  Yönetici: {SUPER_ADMIN_EMAIL}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Yönetici Şifresi / Құпия сөз
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Yönetici şifrenizi giriniz"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition font-medium"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-600 inline" />
                  <span>Sistem baş yöneticisi güvenlik doğrulaması (SHA-256 şifreli koruma)</span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-black text-xs text-white bg-amber-500 hover:bg-amber-600 active:scale-[0.99] transition shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>YÖNETİCİ OLARAK GİRİŞ YAP</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-[11px] text-slate-500 hover:text-slate-700 font-semibold transition"
                >
                  ← Normal Öğrenci Girişine Dön
                </button>
              </div>
            </form>
          )}

          {/* ================= USER LOGIN / REGISTER FORM ================= */}
          {tab !== 'admin' && (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* TARGET LANGUAGE SELECTION */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-teal-600" />
                  <span>ÖĞRENMEK İSTEDİĞİNİZ DİL / ТІЛ БАҒЫТЫ:</span>
                </label>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDirection('TR_TO_KZ')}
                    className={`p-2.5 rounded-2xl border text-left transition flex items-center justify-between ${
                      selectedDirection === 'TR_TO_KZ'
                        ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🇹🇷 ➔ 🇰🇿</span>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">
                          Kazakça Öğrenmek İstiyorum
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Açıklamalar Türkçe, Hedef dil: Kazakça
                        </div>
                      </div>
                    </div>
                    {selectedDirection === 'TR_TO_KZ' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedDirection('KZ_TO_TR')}
                    className={`p-2.5 rounded-2xl border text-left transition flex items-center justify-between ${
                      selectedDirection === 'KZ_TO_TR'
                        ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🇰🇿 ➔ 🇹🇷</span>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">
                          Түрік тілін үйренгім келеді
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Түсіндірмелер қазақша, Мақсат: Түркия түрікшесі
                        </div>
                      </div>
                    </div>
                    {selectedDirection === 'KZ_TO_TR' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Target Level Picker - In both Login & Register (Requirement 2: Her üye girişte hedef dilini ve seviyesini seçsin, seçemiyorsa seviye testine tabii tut) */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>{tab === 'login' ? 'Mevcut / Hedef Seviyeniz:' : 'Başlangıç Seviyeniz:'}</span>
                  </label>
                  {onOpenPlacementModal && (
                    <button
                      type="button"
                      onClick={handleLaunchPlacement}
                      className="text-[10px] font-extrabold text-teal-800 hover:text-teal-950 flex items-center gap-1 bg-teal-100/90 px-2 py-0.5 rounded-lg border border-teal-300 transition"
                      title="10 soruluk seviye tespit sınavını başlat"
                    >
                      <span>🎯 Seviyemi Bilmiyorum (Test Yap)</span>
                    </button>
                  )}
                </div>

                {testedLevelBadge && (
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-bold flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Seviye tespit sınavı tamamlandı! Belirlenen seviyeniz: <strong>{testedLevelBadge}</strong></span>
                  </div>
                )}

                <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl border border-slate-200">
                  {(['A1', 'A2', 'B1', 'B2', 'C1'] as CefrLevel[]).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedLevel(lvl)}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold transition ${
                        selectedLevel === lvl
                          ? 'bg-teal-600 text-white shadow-xs font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 italic">
                  {selectedLevel === 'A1' && 'A1: Sıfırdan alfabe, tanışma ve temel kelimeler'}
                  {selectedLevel === 'A2' && 'A2: Temel dil bilgisi, zaman ekleri ve günlük konuşma'}
                  {selectedLevel === 'B1' && 'B1: Orta seviye, metin okuma ve birleşik fiiller'}
                  {selectedLevel === 'B2' && 'B2: İleri orta, edebi metinler ve deyimler'}
                  {selectedLevel === 'C1' && 'C1: Akademik Türkoloji ve uzmanlık'}
                </p>
              </div>

              {/* Register Specific Fields: Name & Nickname */}
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
                        placeholder="Örn: Ahmet Yılmaz"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Lakap / Nickname</span>
                      <span className="text-[10px] text-teal-600 font-normal">İsteğe bağlı</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-slate-400 font-black text-xs">@</span>
                      <input
                        type="text"
                        placeholder="Bozkir_Kartali"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value.replace(/[^a-zA-Z0-9_ğüşıöçĞÜŞİÖÇәіңғүұқөһӘІҢҒҮҰҚӨҺ]/g, ''))}
                        className="w-full pl-8 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition font-bold text-teal-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  E-posta Adresi / Электрондық пошта
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="ornek@ogrenci.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition"
                    required
                  />
                </div>
                {/* Recognized Super Admin Owner Notice */}
                {email.toLowerCase().trim() === SUPER_ADMIN_EMAIL.toLowerCase() && (
                  <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-1.5 font-bold">
                      <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Sistem Kurucusu & Baş Yönetici (Osman Dadaş)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setTab('admin'); setErrorMessage(null); }}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[11px] rounded-lg transition shadow-2xs"
                    >
                      Yönetici Şifresiyle Gir →
                    </button>
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Şifre / Құпия сөз
                  </label>
                  {tab === 'login' && (
                    <span className="text-[10px] text-slate-400">
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
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {tab === 'register' && (
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                    required
                  />
                  <span className="text-[11px] text-slate-600">
                    Kullanım koşullarını kabul ediyorum.
                  </span>
                </label>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-teal-600 hover:bg-teal-700 active:scale-[0.99] transition shadow-md shadow-teal-600/20"
              >
                {tab === 'login' ? 'KENDİ HESABIMLA GİRİŞ YAP' : 'ÜYELİĞİMİ OLUŞTUR VE BAŞLA'}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setTab('admin');
                    setEmail(SUPER_ADMIN_EMAIL);
                    setErrorMessage(null);
                  }}
                  className="text-[11px] font-bold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Sistem Sahibi / Yönetici (Admin) Girişi →</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
