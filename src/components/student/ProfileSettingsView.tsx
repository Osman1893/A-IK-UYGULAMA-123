import React, { useState, useRef } from 'react';
import { 
  User, 
  Flame, 
  Trophy, 
  Award, 
  Settings, 
  Crown, 
  ShieldCheck, 
  LogOut, 
  BookOpen,
  Edit3,
  Check,
  Sparkles,
  MessageSquare,
  Palette,
  Target,
  Image as ImageIcon,
  Camera,
  Upload,
  RefreshCw,
  Trash2,
  FileText,
  X
} from 'lucide-react';
import { UserProfile, LanguageDirection } from '../../types';
import { storageService } from '../../services/storageService';
import { audioService } from '../../services/audioService';

interface ProfileSettingsViewProps {
  user: UserProfile;
  onUpdateUser?: (updated: UserProfile) => void;
  onDirectionChange: (direction: LanguageDirection) => void;
  onOpenAdmin: () => void;
  onOpenAuth?: (tab?: 'login' | 'register' | 'admin') => void;
  onLogout: () => void;
  onNavigateTab?: (tab: any) => void;
}

// Preset Avatars representing Turkology, Nomadic heritage, and modern scholars
const PRESET_AVATARS = [
  {
    name: 'Türkolog Hoca',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Bozkır Kaşifi',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Altay Bilgini',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Alatau Gezgini',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Genç Türkolog',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Avatar - Mor',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=LinguaQazaq'
  },
  {
    name: 'Avatar - Mavi',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=TurkologMavi'
  },
  {
    name: 'Avatar - Altın',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AltinOrda'
  }
];

const PRESET_NICKNAMES = [
  'Bozkır Kartalı',
  'Kıpçak Bilgini',
  'Altay Kaşifi',
  'Sözlük Kurdu',
  'Genç Türkolog',
  'Alatau Yolcusu',
  'Orhun Kaşifi',
  'Dombıra Ustası',
  'Bozkırın Sesi'
];

const PRESET_TITLES = [
  'Genç Türkolog',
  'Kıpçak Gramercisi',
  'Bozkırın Sesi',
  'Dilbilim Meraklısı',
  'Orhun Kaşifi',
  'Kazak Edebiyatı Sevdalısı',
  'Sözlük Ustası',
  'Baş Türkolog & Kurucu'
];

const PRESET_GOALS = [
  'Kazakistan\'da Üniversite & Yüksek Lisans',
  'Kıpçak ve Türk Dünyası Edebiyatı Araştırmaları',
  'Kazakça Konuşan Dostlarla Akıcı İletişim',
  'İş, Ticaret ve Resmi Diplomatik İlişkiler',
  'Kültürel Merak ve Ata Yurdu Dillerini Öğrenme'
];

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  user,
  onUpdateUser,
  onDirectionChange,
  onOpenAdmin,
  onOpenAuth,
  onLogout,
  onNavigateTab
}) => {
  const isTr = user.currentDirection === 'TR_TO_KZ';

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Hidden File input ref for uploading user's personal photo
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState(user.name);
  const [nickname, setNickname] = useState(user.nickname || '');
  const [customTitle, setCustomTitle] = useState(user.customTitle || 'Genç Türkolog');
  const [bio, setBio] = useState(user.bio || '');
  const [targetGoal, setTargetGoal] = useState(user.targetGoal || 'Ata Yurdu dillerini akıcı konuşmak');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || PRESET_AVATARS[0].url);
  const [themeColor, setThemeColor] = useState(user.themeColor || 'violet');

  // Handle local file photo upload (from gallery or computer)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (warn if > 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Lütfen 10MB\'dan küçük bir görsel seçiniz.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress and resize image using Canvas for smooth localStorage
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          
          setAvatarUrl(compressedDataUrl);

          // If not currently in full form edit mode, immediately persist to user profile!
          const updated = storageService.updateUserProfile({
            avatarUrl: compressedDataUrl
          });

          if (onUpdateUser) {
            onUpdateUser(updated);
          }

          audioService.playFeedbackSound('complete');
          setSavedToast(true);
          setTimeout(() => setSavedToast(false), 3000);
        }
        setIsUploading(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Handle Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storageService.updateUserProfile({
      name: name.trim() || user.name,
      nickname: nickname.trim() || undefined,
      customTitle: customTitle.trim() || undefined,
      bio: bio.trim() || undefined,
      targetGoal: targetGoal.trim() || undefined,
      avatarUrl: avatarUrl.trim() || user.avatarUrl,
      themeColor
    });

    if (onUpdateUser) {
      onUpdateUser(updated);
    }

    audioService.playFeedbackSound('complete');
    setIsEditing(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-14 bg-violet-50/30">
      
      {/* Hidden file input for photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Success Notification */}
      {savedToast && (
        <div className="p-3 bg-violet-600 text-white text-xs font-bold rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Profil fotoğrafınız ve bilgileriniz başarıyla güncellendi!</span>
          </div>
        </div>
      )}

      {/* Top Super Admin Control Hub Banner */}
      {user.isSuperAdmin && (
        <div 
          onClick={onOpenAdmin}
          className="bg-gradient-to-r from-amber-500 via-amber-400 to-orange-400 text-slate-950 p-4 rounded-3xl shadow-md cursor-pointer hover:brightness-105 transition flex items-center justify-between border border-amber-300"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-950 text-amber-400 rounded-2xl shadow-inner font-black">
              <ShieldCheck className="w-5 h-5 stroke-[2.3]" />
            </div>
            <div>
              <h3 className="text-xs font-black tracking-tight text-slate-950">
                BAŞ YÖNETİCİ KONTROL PANELİ
              </h3>
              <p className="text-[11px] font-bold text-amber-950/90">
                Müfredat, dersler, sözlük ve veritabanını düzenleyin
              </p>
            </div>
          </div>
          <span className="px-3.5 py-1.5 bg-slate-950 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1">
            <span>Yönet</span>
            <span>→</span>
          </span>
        </div>
      )}

      {/* Main Profile Showcase Card (Lingua Violet Style) */}
      <div className="bg-white p-5 rounded-3xl border border-violet-100 shadow-sm relative overflow-hidden">
        {/* Decorative background banner */}
        <div className="absolute top-0 left-0 right-0 h-22 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
        
        <div className="relative pt-6 flex flex-col items-center text-center">
          {/* Avatar with Camera upload button and level badge */}
          <div className="relative mb-2 group">
            <img
              src={user.avatarUrl || PRESET_AVATARS[0].url}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-violet-500/20"
            />

            {/* Quick 1-tap Camera Upload button on Avatar */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer backdrop-blur-2xs"
              title="Kendi Profil Fotoğrafınızı Yükleyin"
            >
              <Camera className="w-6 h-6 mb-0.5" />
              <span className="text-[9px] font-black tracking-tight">Fotoğraf Yükle</span>
            </button>

            {/* Camera Floating Badge */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute top-0 right-0 p-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-full shadow-md border-2 border-white transition hover:scale-110"
              title="Fotoğraf Değiştir"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>

            {user.isSuperAdmin ? (
              <span className="absolute bottom-0 right-0 p-1.5 bg-amber-500 text-white rounded-full shadow-md border-2 border-white" title="Super Admin">
                <Crown className="w-4 h-4" />
              </span>
            ) : (
              <span className="absolute bottom-0 right-0 px-2 py-0.5 bg-violet-700 text-white font-extrabold text-[10px] rounded-full shadow-sm border-2 border-white">
                {user.currentLevel}
              </span>
            )}
          </div>

          {/* Quick upload text button under avatar */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-1 rounded-full border border-violet-200 transition"
          >
            <Upload className="w-3 h-3 text-violet-600" />
            <span>{isUploading ? 'Yükleniyor...' : 'Kendi Fotoğrafını Yükle'}</span>
          </button>

          {/* User Nickname (Lakap) Highlight */}
          {user.nickname ? (
            <div className="mb-1 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-violet-50 text-violet-800 border border-violet-200 text-xs font-black tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              <span>@{user.nickname}</span>
            </div>
          ) : (
            <div className="mb-1 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">
              Henüz lakap belirlemediniz
            </div>
          )}

          {/* User Full Name */}
          <h2 className="text-lg font-black text-slate-900 tracking-tight">{user.name}</h2>
          
          {/* Custom Title / Unvan */}
          <p className="text-xs font-bold text-violet-700 mt-0.5">
            {user.customTitle || (user.isSuperAdmin ? 'Baş Türkolog & Kurucu' : 'Genç Türkolog')}
          </p>

          <p className="text-[11px] text-slate-400 font-medium">{user.email}</p>

          {/* Bio (Kişiselleştirilmiş Biyografi) */}
          {user.bio ? (
            <p className="mt-2 text-xs text-slate-600 max-w-sm font-normal leading-relaxed italic bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              "{user.bio}"
            </p>
          ) : (
            <p className="mt-1.5 text-[11px] text-slate-400">
              {isTr ? 'Kendinizi tanıtan kısa bir biyografi ekleyebilirsiniz.' : 'Өзіңіз туралы қысқаша мәлімет қоса аласыз.'}
            </p>
          )}

          {/* Goal pill */}
          {user.targetGoal && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-lg">
              <Target className="w-3 h-3 text-violet-600" />
              <span>Hedef: {user.targetGoal}</span>
            </div>
          )}

          {/* Personalize Button */}
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              setName(user.name);
              setNickname(user.nickname || '');
              setCustomTitle(user.customTitle || 'Genç Türkolog');
              setBio(user.bio || '');
              setTargetGoal(user.targetGoal || 'Ata Yurdu dillerini akıcı konuşmak');
              setAvatarUrl(user.avatarUrl || PRESET_AVATARS[0].url);
            }}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-violet-600 hover:bg-violet-700 active:scale-98 text-white font-black text-xs shadow-md shadow-violet-600/20 transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Düzenlemeyi Kapat' : 'Profili & Bilgileri Düzenle'}</span>
          </button>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-4 border-t border-slate-100">
            <div className="p-2.5 bg-violet-50/60 rounded-2xl border border-violet-100/80">
              <span className="block text-base font-black text-violet-900">{user.streakDays}</span>
              <span className="text-[10px] font-semibold text-violet-600">Gün Seri</span>
            </div>
            <div className="p-2.5 bg-violet-50/60 rounded-2xl border border-violet-100/80">
              <span className="block text-base font-black text-violet-900">{user.completedLessonIds.length}</span>
              <span className="text-[10px] font-semibold text-violet-600">Ders</span>
            </div>
            <div className="p-2.5 bg-amber-50/60 rounded-2xl border border-amber-100/80">
              <span className="block text-base font-black text-amber-700">{user.xpPoints}</span>
              <span className="text-[10px] font-semibold text-amber-600">XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Energy & Pro Status Card (Requirement 3: 100 energy, 8h refill or Pro unlimited) */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-3xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-lg font-black shadow-xs shrink-0">
              ⚡
            </div>
            <div>
              <h4 className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <span>{user.isPremium ? 'Sınırsız Enerji (PRO Sürüm)' : 'Günlük Enerji'}</span>
                {user.isPremium && (
                  <span className="text-[9px] bg-amber-200 px-1.5 py-0.5 rounded font-black text-amber-950">AKTİF</span>
                )}
              </h4>
              <p className="text-[10px] text-amber-800 font-medium">
                {user.isPremium 
                  ? 'PRO kullanıcı olarak tüm aktiviteler ve oyunlarda sınırsız enerjiniz var.' 
                  : `Mevcut: ${user.energy !== undefined ? user.energy : 100}/100 • 8 saatte bir yenilenir.`}
              </p>
            </div>
          </div>
          
          {!user.isPremium && (
            <button
              onClick={() => {
                const updated = storageService.upgradeToPro();
                if (onUpdateUser) onUpdateUser(updated);
                audioService.playFeedbackSound('complete');
                setSavedToast(true);
                setTimeout(() => setSavedToast(false), 3000);
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-md shadow-amber-500/20 transition active:scale-95 flex items-center gap-1 shrink-0"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>PRO'ya Geç</span>
            </button>
          )}
        </div>
        
        {!user.isPremium && (
          <div className="w-full bg-amber-200/70 rounded-full h-2 mt-2">
            <div 
              className="bg-amber-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.round(((user.energy !== undefined ? user.energy : 100) / 100) * 100))}%` }}
            />
          </div>
        )}
      </div>

      {/* Profile Customization Form Accordion */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-white p-5 rounded-3xl border border-violet-200 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span>Profil Kişiselleştirme & Fotoğraf</span>
            </h3>
            <span className="text-[10px] text-violet-700 font-bold bg-violet-50 px-2 py-0.5 rounded-md">
              Topluluk & Forumda Görünür
            </span>
          </div>

          {/* Direct Photo Upload Card inside Edit Mode */}
          <div className="p-3.5 bg-violet-50/50 rounded-2xl border border-violet-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt="Seçili Fotoğraf"
                className="w-12 h-12 rounded-full object-cover border-2 border-violet-500 shadow-sm"
              />
              <div>
                <p className="text-xs font-black text-slate-900">Kendi Profil Fotoğrafınızı Ekleyin</p>
                <p className="text-[10px] text-slate-500">Galeriden veya bilgisayarınızdan resim yükleyin</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Yükle</span>
            </button>
          </div>

          {/* 1. Lakap (Nickname) Field */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Lakap / Takma Ad (Nickname):
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">@</span>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value.replace(/[^a-zA-Z0-9_ğüşıöçĞÜŞİÖÇәіңғүұқөһӘІҢҒҮҰҚӨҺ]/g, ''))}
                placeholder="Örn: Bozkir_Kartali, DadasHoca"
                maxLength={24}
                className="w-full pl-7 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-hidden font-bold text-slate-800"
              />
            </div>
            {/* Quick nickname chips */}
            <div className="mt-1.5 flex flex-wrap gap-1">
              <span className="text-[10px] text-slate-400 font-medium mr-1">Öneriler:</span>
              {PRESET_NICKNAMES.slice(0, 5).map((nick) => (
                <button
                  type="button"
                  key={nick}
                  onClick={() => setNickname(nick.replace(/\s+/g, '_'))}
                  className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 hover:bg-violet-50 hover:text-violet-700 rounded-md text-slate-600 transition"
                >
                  +{nick}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Full Name Field */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Ad Soyad:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-hidden text-slate-800 font-medium"
            />
          </div>

          {/* 3. Custom Title / Unvan */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Topluluk Unvanı / Rütbe:
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Örn: Bozkır Kartalı, Kıpçak Gramercisi"
              maxLength={30}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-hidden text-slate-800 font-semibold"
            />
            <div className="mt-1.5 flex flex-wrap gap-1">
              {PRESET_TITLES.slice(0, 4).map((tit) => (
                <button
                  type="button"
                  key={tit}
                  onClick={() => setCustomTitle(tit)}
                  className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 hover:bg-violet-50 hover:text-violet-700 rounded-md text-slate-600 transition"
                >
                  {tit}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Bio / Biyografi */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Hakkında / Biyografi:
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Kendinizi, Kazakça öğrenme amacınızı veya ilgi alanlarınızı anlatın..."
              rows={2}
              maxLength={160}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-hidden text-slate-800 font-normal leading-relaxed"
            />
            <div className="text-right text-[10px] text-slate-400">
              {bio.length}/160 karakter
            </div>
          </div>

          {/* 5. Target Learning Goal */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Öğrenme Hedefi:
            </label>
            <select
              value={targetGoal}
              onChange={(e) => setTargetGoal(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-hidden text-slate-800 font-medium bg-white"
            >
              {PRESET_GOALS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* 6. Ready Avatars Palette */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
              <span>Alternatif Hazır Avatarlar:</span>
              <span className="text-[10px] font-normal text-slate-400">Tıklayarak seçebilirsiniz</span>
            </label>
            
            <div className="grid grid-cols-4 gap-2">
              {PRESET_AVATARS.map((av, idx) => {
                const isSelected = avatarUrl === av.url;
                return (
                  <div
                    key={idx}
                    onClick={() => setAvatarUrl(av.url)}
                    className={`p-1.5 rounded-2xl border-2 cursor-pointer flex flex-col items-center transition ${
                      isSelected 
                        ? 'border-violet-600 bg-violet-50/50 shadow-sm' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <img
                      src={av.url}
                      alt={av.name}
                      className="w-12 h-12 rounded-full object-cover mb-1"
                    />
                    <span className="text-[9px] font-bold text-slate-700 text-center leading-tight truncate w-full">
                      {av.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white text-xs font-black rounded-xl shadow-md shadow-violet-600/20 transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Değişiklikleri Kaydet</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              Vazgeç
            </button>
          </div>
        </form>
      )}

      {/* Community & Forum Activity Card */}
      <div 
        onClick={() => onNavigateTab && onNavigateTab('forum')}
        className="bg-gradient-to-r from-violet-600 to-purple-700 text-white p-4 rounded-3xl shadow-sm hover:shadow-md cursor-pointer transition flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-2xl group-hover:scale-105 transition">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-xs font-black leading-tight">Forum & Topluluk Paylaşımları</h4>
            <p className="text-[10px] text-violet-100 mt-0.5">
              {user.nickname ? `@${user.nickname} olarak soru sor ve yanıtla` : 'Lakabınla topluluğa katıl'}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black bg-white/20 px-2.5 py-1 rounded-xl">
          Forum'a Git →
        </span>
      </div>

      {/* Badges and Trophies Showcase */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Kazanılan Başarı Rozetleri</span>
          </h3>
          <button 
            onClick={() => onNavigateTab && onNavigateTab('leaderboard')}
            className="text-[10px] font-bold text-violet-600 hover:text-violet-700"
          >
            Tümünü Gör →
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {user.badges.slice(0, 3).map((badge) => (
            <div 
              key={badge.id}
              className="p-3 bg-violet-50/40 rounded-2xl border border-violet-100 flex flex-col items-center text-center"
            >
              <span className="text-2xl mb-1">{badge.icon}</span>
              <span className="text-xs font-black text-slate-900 leading-tight">
                {isTr ? badge.titleTr : badge.titleKz}
              </span>
              <span className="text-[9px] text-violet-600 font-semibold mt-0.5 line-clamp-1">
                {isTr ? badge.descriptionTr : badge.descriptionKz}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Account Settings & Auth / Logout */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {/* Switch Learning Direction */}
        <div 
          onClick={() => onDirectionChange(isTr ? 'KZ_TO_TR' : 'TR_TO_KZ')}
          className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-50 text-violet-600 rounded-xl">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Öğrenme Yönü</span>
              <span className="text-[10px] text-slate-500">
                {isTr ? 'Türkçe → Kazakça (Қазақ тілін үйрену)' : 'Kazakça → Türkçe (Түрік тілін үйрену)'}
              </span>
            </div>
          </div>
          <span className="text-xs font-black text-violet-600 bg-violet-50 px-2 py-0.5 rounded-lg">
            Değiştir
          </span>
        </div>

        {/* Guest or Logged in status */}
        {user.isGuest ? (
          <div 
            onClick={() => onOpenAuth && onOpenAuth('login')}
            className="p-3.5 flex items-center justify-between hover:bg-violet-50/50 cursor-pointer transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 text-violet-700 rounded-xl">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Kendi Hesabınla Giriş Yap</span>
                <span className="text-[10px] text-slate-500">
                  Giriş yaparak tüm cihazlarda ilerlemeni eşitle
                </span>
              </div>
            </div>
            <span className="text-xs font-black text-violet-700 bg-violet-50 px-2.5 py-1 rounded-xl border border-violet-200">
              Giriş Yap
            </span>
          </div>
        ) : (
          <div 
            onClick={onLogout}
            className="p-3.5 flex items-center justify-between hover:bg-rose-50 cursor-pointer transition text-rose-600"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 rounded-xl">
                <LogOut className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold block">Oturumu Kapat</span>
                <span className="text-[10px] text-rose-400">
                  Misafir öğrenci moduna geç
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-600">Çıkış</span>
          </div>
        )}

        {/* Admin Dashboard shortcut if Super Admin */}
        {user.isSuperAdmin && (
          <div 
            onClick={onOpenAdmin}
            className="p-3.5 flex items-center justify-between hover:bg-amber-50 cursor-pointer transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-900 block">Super Admin Paneline Git</span>
                <span className="text-[10px] text-amber-600">Müfredat ve veritabanı yönetimi</span>
              </div>
            </div>
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg">
              Yönetici Paneli →
            </span>
          </div>
        )}

        {/* Delete Account (Apple App Store Guideline 5.1.1(v) Compliant) */}
        {!user.isGuest && !user.isSuperAdmin && (
          <div 
            onClick={() => {
              if (confirm('Hesabınızı ve tüm ilerleme kayıtlarınızı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
                storageService.deleteAccount(user.id);
                onLogout();
              }
            }}
            className="p-3.5 flex items-center justify-between hover:bg-rose-50 cursor-pointer transition text-rose-500"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 text-rose-500 rounded-xl">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold block">Hesabımı ve Verilerimi Sil</span>
                <span className="text-[10px] text-rose-400">
                  Kişisel verileri cihazdan kalıcı olarak kaldır
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-500">Sil</span>
          </div>
        )}
      </div>

      {/* Store Compliance Legal Footer */}
      <div className="pt-2 pb-6 text-center text-[10px] text-slate-400 flex items-center justify-center gap-3">
        <button onClick={() => setShowPrivacyModal(true)} className="hover:text-slate-600 underline">
          Gizlilik Politikası
        </button>
        <span>•</span>
        <button onClick={() => setShowTermsModal(true)} className="hover:text-slate-600 underline">
          Kullanım Koşulları
        </button>
        <span>•</span>
        <span>Uzaktan Türkolog v1.0 Pro</span>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto text-xs text-slate-700">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-black text-slate-900">Gizlilik Politikası (Privacy Policy)</h3>
              <button onClick={() => setShowPrivacyModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 leading-relaxed">
              <p className="font-bold text-slate-900">1. Veri Sorumlusu ve Kapsam</p>
              <p>Uzaktan Türkolog ("Uygulama"), kullanıcı gizliliğine azami riayet eder. Uygulama yalnızca eğitim ilerlemenizi (tamamlanan dersler, XP puanları, kelime ustalıkları) cihazınızda yerel olarak saklar.</p>
              <p className="font-bold text-slate-900">2. Toplanan Bilgiler</p>
              <p>Kayıt sırasında girilen e-posta adresi, ad ve seçilen kullanıcı lakabı yalnızca profilinizi kişiselleştirmek ve liderlik tablosunda göstermek amacıyla kullanılır. Üçüncü taraflara satılmaz veya paylaşılmaz.</p>
              <p className="font-bold text-slate-900">3. Hesap ve Veri Silme</p>
              <p>Apple App Store ve Google Play Store gereksinimleri uyarınca, kullanıcılar istedikleri zaman profil ayarlarından "Hesabımı ve Verilerimi Sil" seçeneğini kullanarak tüm verilerini anında silebilirler.</p>
              <p className="font-bold text-slate-900">4. İletişim</p>
              <p>Sorularınız için: dadasosman2525@gmail.com</p>
            </div>
            <div className="pt-2 text-right">
              <button onClick={() => setShowPrivacyModal(false)} className="px-4 py-2 bg-violet-600 text-white font-bold rounded-xl text-xs">
                Anladım
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto text-xs text-slate-700">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-black text-slate-900">Kullanım Koşulları (Terms of Service)</h3>
              <button onClick={() => setShowTermsModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 leading-relaxed">
              <p className="font-bold text-slate-900">1. Hizmetin Niteliği</p>
              <p>Uzaktan Türkolog, Türkiye Türkçesi ve Kazak Türkçesi arasında karşılıklı dil eğitimi sunan akademik ve interaktif bir platformdur.</p>
              <p className="font-bold text-slate-900">2. Kullanıcı Yükümlülükleri</p>
              <p>Kullanıcılar forum ve topluluk alanlarında saygılı, yapıcı ve Türk Dünyası kardeşlik hukukuna uygun bir dil kullanmayı taahhüt eder. Zararlı veya yasa dışı içerik paylaşımı yasaktır.</p>
              <p className="font-bold text-slate-900">3. Fikri Mülkiyet</p>
              <p>Müfredat, seslendirmeler, telaffuz atlası ve alıştırmalar Uzaktan Türkolog ekibine aittir.</p>
            </div>
            <div className="pt-2 text-right">
              <button onClick={() => setShowTermsModal(false)} className="px-4 py-2 bg-violet-600 text-white font-bold rounded-xl text-xs">
                Kabul Ediyorum
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

