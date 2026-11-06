import React, { useState, useRef, useEffect } from 'react';
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
  X,
  BarChart2,
  TrendingUp,
  Calendar,
  Zap,
  Lock,
  Filter,
  CheckCircle2,
  Bell,
  BellRing,
  Clock,
  Sliders,
  Share2,
  Wifi,
  WifiOff,
  HardDriveDownload,
  Radio,
  GraduationCap,
  Bookmark
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell, 
  ReferenceLine 
} from 'recharts';
import { UserProfile, LanguageDirection, UserBadge } from '../../types';
import { storageService } from '../../services/storageService';
import { audioService } from '../../services/audioService';
import { notificationService } from '../../services/notificationService';
import { ShareableBadgeCardModal } from './ShareableBadgeCardModal';
import { offlineCacheService, OfflineCacheStats } from '../../services/offlineCacheService';

interface ProfileSettingsViewProps {
  user: UserProfile;
  onUpdateUser?: (updated: UserProfile) => void;
  onDirectionChange: (direction: LanguageDirection) => void;
  onOpenAdmin: () => void;
  onOpenAuth?: (tab?: 'login' | 'register') => void;
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
  const [themeColor, setThemeColor] = useState(user.themeColor || 'teal');

  // Hedef Takipçisi (Goal Tracker) States (Daily & Weekly)
  const [goalScope, setGoalScope] = useState<'daily' | 'weekly'>('daily');
  const [dailyMetric, setDailyMetric] = useState<'xp' | 'lessons'>(user.dailyGoalType === 'xp' ? 'xp' : 'xp');
  const [goalType, setGoalType] = useState<'xp' | 'minutes'>(user.dailyGoalType || 'xp');
  const [selectedXpTarget, setSelectedXpTarget] = useState<number>(user.dailyXpTarget || 50);
  const [selectedMinuteTarget, setSelectedMinuteTarget] = useState<number>(user.dailyGoalMinutes || 15);
  const [selectedDailyLessonsTarget, setSelectedDailyLessonsTarget] = useState<number>(2);

  // Weekly Goal Tracker States
  const [weeklyMetric, setWeeklyMetric] = useState<'days' | 'xp' | 'lessons'>(user.weeklyGoalType || 'xp');
  const [weeklyGoalDaysState, setWeeklyGoalDaysState] = useState<number>(user.weeklyGoalDays || 5);
  const [weeklyXpTargetState, setWeeklyXpTargetState] = useState<number>(user.weeklyXpTarget || 250);
  const [weeklyLessonsTargetState, setWeeklyLessonsTargetState] = useState<number>(user.weeklyLessonsTarget || 5);

  // Ders Hatırlatıcı (Daily Study Reminder) States
  const [notificationsActive, setNotificationsActive] = useState<boolean>(user.notificationsEnabled !== false);
  const [reminderTimeState, setReminderTimeState] = useState<string>(user.reminderTime || '20:00');
  const [goalSavedToast, setGoalSavedToast] = useState<string | null>(null);
  const [reminderToast, setReminderToast] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => notificationService.getPermission());

  const handleSaveGoalSettings = () => {
    // 1. Update Daily Goal
    storageService.updateDailyLearningGoal(
      goalType,
      goalType === 'xp' ? selectedXpTarget : selectedMinuteTarget,
      notificationsActive,
      reminderTimeState
    );

    // 2. Update Weekly Goal
    const updated = storageService.updateWeeklyLearningGoal(
      weeklyGoalDaysState,
      weeklyMetric,
      weeklyMetric === 'xp' ? weeklyXpTargetState : weeklyLessonsTargetState
    );

    if (onUpdateUser) onUpdateUser(updated);
    audioService.playLevelUpSound();
    setGoalSavedToast('✓ Hedef Takipçisi ve Ders Hatırlatıcı ayarları başarıyla kaydedildi!');
    setTimeout(() => setGoalSavedToast(null), 3500);
  };

  const handleTestReminder = () => {
    audioService.playFeedbackSound('click');
    const event = notificationService.triggerStudyReminderTest(reminderTimeState, user.streakDays || 1);
    setReminderToast(`⏰ Test Bildirimi Gönderildi! Saat ${reminderTimeState} için hatırlatıcı aktif.`);
    setTimeout(() => setReminderToast(null), 4000);
  };

  const handleTestNotification = () => {
    audioService.playFeedbackSound('click');
    const target = goalType === 'xp' ? selectedXpTarget : selectedMinuteTarget;
    notificationService.triggerTestNotification(goalType, target);
    setGoalSavedToast('🔔 Hedef aşama bildirimi test edildi! (Masaüstü ve uygulama içi)');
    setTimeout(() => setGoalSavedToast(null), 4000);
  };

  const handleRequestBrowserPermission = async () => {
    const res = await notificationService.requestPermission();
    setNotificationPermission(res);
    if (res === 'granted') {
      audioService.playFeedbackSound('correct');
      setReminderToast('✓ Tarayıcı bildirim izni başarıyla verildi! Günlük hatırlatıcılar iletilecektir.');
    } else {
      setReminderToast('Tarayıcı bildirimi izin verilmedi veya reddedildi.');
    }
    setTimeout(() => setReminderToast(null), 3500);
  };

  // Weekly XP Activity Calculation for past 7 days (Recharts visualization)
  const dailyTarget = user.dailyXpTarget || 50;
  const todayEarned = typeof user.todayEarnedXp === 'number' 
    ? user.todayEarnedXp 
    : Math.min(dailyTarget, user.xpPoints % 100);

  const dayNamesTr = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  const dayNamesKz = ['Жек', 'Дүй', 'Сей', 'Сәр', 'Бей', 'Жұм', 'Сен'];
  const monthNamesTr = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  const monthNamesKz = ['Қаң', 'Ақп', 'Нау', 'Сәу', 'Мам', 'Мау', 'Шіл', 'Там', 'Қыр', 'Қаз', 'Қар', 'Жел'];

  const now = new Date();
  const weeklyData = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dayOfWeek = d.getDay();
    const dayName = isTr ? dayNamesTr[dayOfWeek] : dayNamesKz[dayOfWeek];
    const monthName = isTr ? monthNamesTr[d.getMonth()] : monthNamesKz[d.getMonth()];
    const dateFormatted = `${d.getDate()} ${monthName}`;
    const isToday = i === 0;

    let xp = 0;
    if (isToday) {
      xp = todayEarned;
    } else if (i < (user.streakDays || 1)) {
      // Days within active streak achieved target + variance
      const variance = ((d.getDate() * 11 + (user.xpPoints || 10)) % 30);
      xp = Math.max(dailyTarget, dailyTarget + variance);
    } else {
      // Days prior to active streak
      const pastRatio = 0.35 + (((d.getDate() * 5) % 40) / 100);
      xp = Math.max(10, Math.round(dailyTarget * pastRatio));
    }

    weeklyData.push({
      day: dayName,
      fullDate: dateFormatted,
      xp,
      target: dailyTarget,
      isToday,
      metGoal: xp >= dailyTarget
    });
  }

  const totalWeeklyXp = weeklyData.reduce((acc, curr) => acc + curr.xp, 0);
  const avgDailyXp = Math.round(totalWeeklyXp / 7);
  const goalsMetCount = weeklyData.filter(d => d.metGoal).length;

  // Tab Switcher between Profile & Goals vs Dedicated Achievements Screen
  const [activeProfileTab, setActiveProfileTab] = useState<'profile' | 'achievements'>('profile');

  // Achievement Badges tracking & filtering
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [badgeCategoryFilter, setBadgeCategoryFilter] = useState<'all' | 'streak' | 'xp' | 'lesson' | 'vocab' | 'academic'>('all');
  const [selectedBadgeDetail, setSelectedBadgeDetail] = useState<any | null>(null);
  const [shareBadge, setShareBadge] = useState<UserBadge | null>(null);
  const [shareStats, setShareStats] = useState<{ progress: number; max: number; unit?: string } | undefined>(undefined);

  // Offline Mode & Cache Storage State
  const [isOnlineState, setIsOnlineState] = useState<boolean>(() => offlineCacheService.isOnline());
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(() => offlineCacheService.getSimulatedOffline());
  const [offlineStats, setOfflineStats] = useState<OfflineCacheStats | null>(null);
  const [isPreCaching, setIsPreCaching] = useState<boolean>(false);
  const [preCacheMessage, setPreCacheMessage] = useState<string | null>(null);
  const [preCachePercent, setPreCachePercent] = useState<number>(0);

  useEffect(() => {
    offlineCacheService.getCacheStats().then(setOfflineStats);
    const unsubscribe = offlineCacheService.subscribe((online) => {
      setIsOnlineState(online);
      setIsSimulatedOffline(offlineCacheService.getSimulatedOffline());
      offlineCacheService.getCacheStats().then(setOfflineStats);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleSimulatedOffline = () => {
    const nextVal = !isSimulatedOffline;
    offlineCacheService.setSimulatedOffline(nextVal);
    setIsSimulatedOffline(nextVal);
    setIsOnlineState(!nextVal);
    audioService.playFeedbackSound('click');
  };

  const handlePreCacheAllContent = async () => {
    setIsPreCaching(true);
    setPreCachePercent(5);
    setPreCacheMessage('Dersler ve sesler hazırlanıyor...');
    audioService.playFeedbackSound('click');

    const success = await offlineCacheService.preCacheAllContent((percent, msg) => {
      setPreCachePercent(percent);
      setPreCacheMessage(msg);
    });

    if (success) {
      audioService.playFeedbackSound('complete');
      const updated = await offlineCacheService.getCacheStats();
      setOfflineStats(updated);
    }
    setTimeout(() => {
      setIsPreCaching(false);
      setPreCacheMessage(null);
    }, 2500);
  };

  const achievements = storageService.getAchievementsProgress();
  const unlockedBadgesCount = achievements.filter(a => a.isUnlocked).length;
  const badgesCompletionPercent = achievements.length > 0
    ? Math.round((unlockedBadgesCount / achievements.length) * 100)
    : 0;
  
  // Total XP bonuses calculated from badge rewards
  const totalBadgeXpEarned = achievements
    .filter(a => a.isUnlocked)
    .reduce((sum, a) => sum + (a.xpReward || 100), 0);
  const totalPossibleBadgeXp = achievements
    .reduce((sum, a) => sum + (a.xpReward || 100), 0);

  // Next closest milestone to motivate the student
  const lockedBadges = achievements.filter(a => !a.isUnlocked);
  const nextClosestBadge = [...lockedBadges].sort((a, b) => {
    const ratioA = a.max > 0 ? (a.progress / a.max) : 0;
    const ratioB = b.max > 0 ? (b.progress / b.max) : 0;
    return ratioB - ratioA;
  })[0];

  // Category counts for quick filter pills
  const streakCount = achievements.filter(a => (a.category || a.badge.category) === 'streak').length;
  const xpCount = achievements.filter(a => (a.category || a.badge.category) === 'xp').length;
  const lessonCount = achievements.filter(a => (a.category || a.badge.category) === 'lesson').length;
  const vocabCount = achievements.filter(a => (a.category || a.badge.category) === 'vocab').length;
  const academicCount = achievements.filter(a => (a.category || a.badge.category) === 'academic').length;

  const filteredAchievements = achievements.filter(a => {
    if (badgeFilter === 'unlocked' && !a.isUnlocked) return false;
    if (badgeFilter === 'locked' && a.isUnlocked) return false;
    if (badgeCategoryFilter !== 'all') {
      const cat = a.category || a.badge.category;
      if (cat !== badgeCategoryFilter) return false;
    }
    return true;
  });

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
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-14 bg-teal-50/30">
      
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
        <div className="p-3 bg-teal-600 text-white text-xs font-bold rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
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

      {/* Top Segmented Navigation Tab Switcher: Profil & Hedefler vs. Başarılarım */}
      <div className="bg-white p-1.5 rounded-2xl border border-teal-100 shadow-xs flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            setActiveProfileTab('profile');
            audioService.playFeedbackSound('click');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
            activeProfileTab === 'profile'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{isTr ? 'Profil & Hedefler' : 'Профиль және мақсаттар'}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveProfileTab('achievements');
            audioService.playFeedbackSound('click');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
            activeProfileTab === 'achievements'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>{isTr ? 'Başarılarım' : 'Жетістіктерім'}</span>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
            activeProfileTab === 'achievements'
              ? 'bg-white/20 text-white'
              : 'bg-amber-100 text-amber-800'
          }`}>
            {unlockedBadgesCount} / {achievements.length}
          </span>
        </button>
      </div>

      {activeProfileTab === 'profile' ? (
        <>
          {/* Main Profile Showcase Card (Lingua Violet Style) */}
          <div className="bg-white p-5 rounded-3xl border border-teal-100 shadow-sm relative overflow-hidden">
        {/* Decorative background banner */}
        <div className="absolute top-0 left-0 right-0 h-22 bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-800" />
        
        <div className="relative pt-6 flex flex-col items-center text-center">
          {/* Avatar with Camera upload button and level badge */}
          <div className="relative mb-2 group">
            <img
              src={user.avatarUrl || PRESET_AVATARS[0].url}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-teal-500/20"
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
              className="absolute top-0 right-0 p-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-md border-2 border-white transition hover:scale-110"
              title="Fotoğraf Değiştir"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>

            {user.isSuperAdmin ? (
              <span className="absolute bottom-0 right-0 p-1.5 bg-amber-500 text-white rounded-full shadow-md border-2 border-white" title="Super Admin">
                <Crown className="w-4 h-4" />
              </span>
            ) : (
              <span className="absolute bottom-0 right-0 px-2 py-0.5 bg-teal-700 text-white font-extrabold text-[10px] rounded-full shadow-sm border-2 border-white">
                {user.currentLevel}
              </span>
            )}
          </div>

          {/* Quick upload text button under avatar */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-full border border-teal-200 transition"
          >
            <Upload className="w-3 h-3 text-teal-600" />
            <span>{isUploading ? 'Yükleniyor...' : 'Kendi Fotoğrafını Yükle'}</span>
          </button>

          {/* User Nickname (Lakap) Highlight */}
          {user.nickname ? (
            <div className="mb-1 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-black tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
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
          <p className="text-xs font-bold text-teal-700 mt-0.5">
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
              <Target className="w-3 h-3 text-teal-600" />
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
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-98 text-white font-black text-xs shadow-md shadow-teal-600/20 transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Düzenlemeyi Kapat' : 'Profili & Bilgileri Düzenle'}</span>
          </button>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-4 border-t border-slate-100">
            <div className="p-2.5 bg-teal-50/60 rounded-2xl border border-teal-100/80">
              <span className="block text-base font-black text-teal-900">{user.streakDays}</span>
              <span className="text-[10px] font-semibold text-teal-600">Gün Seri</span>
            </div>
            <div className="p-2.5 bg-teal-50/60 rounded-2xl border border-teal-100/80">
              <span className="block text-base font-black text-teal-900">{user.completedLessonIds.length}</span>
              <span className="text-[10px] font-semibold text-teal-600">Ders</span>
            </div>
            <div className="p-2.5 bg-amber-50/60 rounded-2xl border border-amber-100/80">
              <span className="block text-base font-black text-amber-700">{user.xpPoints}</span>
              <span className="text-[10px] font-semibold text-amber-600">XP</span>
            </div>
          </div>

          {/* Quick Clickable Achievements Banner inside Profile Card */}
          <div
            onClick={() => {
              setActiveProfileTab('achievements');
              audioService.playFeedbackSound('click');
            }}
            className="mt-3 w-full p-2.5 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/70 rounded-2xl border border-amber-200/90 flex items-center justify-between cursor-pointer hover:border-amber-400 hover:shadow-xs transition group"
          >
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition shrink-0">
                🏆
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-black text-amber-950">
                    {isTr ? 'Başarı Rozetleri & Kilometre Taşları' : 'Жетістік белгілері мен межелер'}
                  </span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 font-extrabold px-1.5 py-0.2 rounded-md">
                    {unlockedBadgesCount} / {achievements.length} {isTr ? 'Kazanıldı' : 'Ашылды'}
                  </span>
                </div>
                <p className="text-[10px] text-amber-800 font-medium">
                  {isTr ? 'Rozetleri incele, kartını paylaş ve XP bonuslarını topla' : 'Белгілерді қараңыз, картаны бөлісіңіз және XP жинаңыз'}
                </p>
              </div>
            </div>
            <span className="text-xs font-black text-amber-800 flex items-center gap-0.5 group-hover:translate-x-0.5 transition shrink-0 ml-1">
              <span>{isTr ? 'Rozetlerim' : 'Белгілер'}</span>
              <span>→</span>
            </span>
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

      {/* ==================================================== */}
      {/* 1. HEDEF TAKİPÇİSİ (GOAL TRACKER - GÜNLÜK & HAFTALIK) */}
      {/* ==================================================== */}
      <div className="bg-white p-5 rounded-3xl border border-teal-100 shadow-sm space-y-4 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-amber-400/15 via-teal-500/15 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-teal-500/20">
              <Target className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  {isTr ? 'Hedef Takipçisi' : 'Меже Бақылаушысы'}
                </h3>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  {goalScope === 'daily' 
                    ? (dailyMetric === 'xp' ? `${selectedXpTarget} XP / Gün` : `${selectedDailyLessonsTarget} Ders / Gün`)
                    : (weeklyMetric === 'xp' ? `${weeklyXpTargetState} XP / Hafta` : `${weeklyLessonsTargetState} Ders / Hafta`)
                  }
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {isTr 
                  ? 'Günlük ve haftalık dil öğrenme hedeflerinizi belirleyin, ilerlemenizi canlı takip edin.' 
                  : 'Күндік және апталық оқу межелеріңізді белгілеп, орындалуын қадағалаңыз.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleTestNotification}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition flex items-center gap-1 active:scale-95 cursor-pointer shrink-0"
            title="Hedef aşama bildirim mekanizmasını test edin"
          >
            <BellRing className="w-3.5 h-3.5 text-amber-500" />
            <span>Aşama Testi</span>
          </button>
        </div>

        {goalSavedToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in">
            <span>{goalSavedToast}</span>
            <button onClick={() => setGoalSavedToast(null)} className="text-emerald-900 ml-2 font-bold cursor-pointer">✕</button>
          </div>
        )}

        {/* Scope Switcher: Günlük vs Haftalık */}
        <div className="p-1 bg-slate-100 rounded-2xl flex items-center gap-1">
          <button
            onClick={() => {
              setGoalScope('daily');
              audioService.playFeedbackSound('click');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
              goalScope === 'daily'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>Günlük Hedefler</span>
          </button>

          <button
            onClick={() => {
              setGoalScope('weekly');
              audioService.playFeedbackSound('click');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
              goalScope === 'weekly'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
            <span>Haftalık Hedefler</span>
          </button>
        </div>

        {/* GÜNLÜK HEDEF GÖRÜNÜMÜ */}
        {goalScope === 'daily' && (
          <div className="space-y-3.5">
            {/* Metric Switcher: XP vs Tamamlanan Ders */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDailyMetric('xp')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                  dailyMetric === 'xp'
                    ? 'bg-teal-50/80 border-teal-400 text-teal-900 ring-2 ring-teal-200'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${dailyMetric === 'xp' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black">Günlük XP Hedefi</div>
                  <div className="text-[10px] text-slate-500">Puan kazanma odaklı</div>
                </div>
              </button>

              <button
                onClick={() => setDailyMetric('lessons')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                  dailyMetric === 'lessons'
                    ? 'bg-teal-50/80 border-teal-400 text-teal-900 ring-2 ring-teal-200'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${dailyMetric === 'lessons' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black">Tamamlanan Ders</div>
                  <div className="text-[10px] text-slate-500">Müfredat tamamlama</div>
                </div>
              </button>
            </div>

            {/* Target Value Selector */}
            {dailyMetric === 'xp' ? (
              <div className="space-y-1.5 bg-teal-50/50 border border-teal-100 p-3 rounded-2xl">
                <span className="text-[11px] font-bold text-teal-900 block">
                  Günlük XP Hedefinizi Seçin:
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {[30, 50, 100, 150, 250].map((val) => (
                    <button
                      key={val}
                      onClick={() => setSelectedXpTarget(val)}
                      className={`py-2 rounded-xl text-xs font-black transition flex flex-col items-center justify-center cursor-pointer ${
                        selectedXpTarget === val
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 scale-102 ring-2 ring-teal-300'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      <span>{val}</span>
                      <span className={`text-[9px] ${selectedXpTarget === val ? 'text-teal-200' : 'text-slate-400'}`}>XP</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 bg-teal-50/50 border border-teal-100 p-3 rounded-2xl">
                <span className="text-[11px] font-bold text-teal-900 block">
                  Günlük Tamamlanacak Ders Sayısını Seçin:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => setSelectedDailyLessonsTarget(val)}
                      className={`py-2 rounded-xl text-xs font-black transition flex flex-col items-center justify-center cursor-pointer ${
                        selectedDailyLessonsTarget === val
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 scale-102 ring-2 ring-teal-300'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      <span>{val} Ders</span>
                      <span className={`text-[9px] ${selectedDailyLessonsTarget === val ? 'text-teal-200' : 'text-slate-400'}`}>/ Gün</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Visual Daily Progress Ring & Tracker */}
            {(() => {
              const currentVal = dailyMetric === 'xp' 
                ? (typeof user.todayEarnedXp === 'number' ? user.todayEarnedXp : Math.min(selectedXpTarget, user.xpPoints % 100))
                : Math.min(selectedDailyLessonsTarget, user.completedLessonIds.length > 0 ? 1 : 0);
              const targetVal = dailyMetric === 'xp' ? selectedXpTarget : selectedDailyLessonsTarget;
              const unitStr = dailyMetric === 'xp' ? 'XP' : 'Ders';
              const percent = Math.min(100, Math.round((currentVal / (targetVal || 1)) * 100));
              const isGoalMet = percent >= 100;

              return (
                <div className="p-4 bg-gradient-to-r from-teal-50/70 via-cyan-50/60 to-teal-100/60 border border-teal-200/80 rounded-2xl flex items-center justify-between gap-4">
                  {/* Radial Progress Ring */}
                  <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
                    <svg className="w-18 h-18 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-200"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={isGoalMet ? 'text-emerald-500' : 'text-teal-600'}
                        strokeDasharray={`${percent}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-black text-slate-900 leading-none">%{percent}</span>
                      <span className="text-[8px] font-bold text-slate-400 mt-0.5">Bugün</span>
                    </div>
                  </div>

                  {/* Progress Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-slate-900">
                        {isGoalMet ? '🏆 Günlük Hedef Tamamlandı!' : 'Günlük İlerleme Durumu'}
                      </span>
                      <span className="text-xs font-black text-teal-700">
                        {currentVal} / {targetVal} {unitStr}
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          isGoalMet ? 'bg-emerald-500' : 'bg-gradient-to-r from-teal-600 to-cyan-600'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <p className="text-[10px] text-slate-500 mt-1.5 font-medium">
                      {isGoalMet 
                        ? 'Harika! Bugünkü hedefinize ulaştınız. Seriniz güvenle devam ediyor!'
                        : percent >= 50 
                          ? `Çok iyi gidiyorsun! Hedefe ulaşmaya ${targetVal - currentVal} ${unitStr} kaldı.`
                          : `Başlamak için şimdi bir ders seç ve ${targetVal - currentVal} ${unitStr} kazan.`}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* HAFTALIK HEDEF GÖRÜNÜMÜ */}
        {goalScope === 'weekly' && (
          <div className="space-y-3.5">
            {/* Metric Switcher: XP vs Ders Sayısı vs Aktif Gün */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setWeeklyMetric('xp')}
                className={`py-2 px-2 rounded-xl border text-center transition cursor-pointer ${
                  weeklyMetric === 'xp'
                    ? 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-200 font-black'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 font-bold'
                }`}
              >
                <div className="text-xs">Haftalık XP</div>
                <div className="text-[9px] text-slate-400">{weeklyXpTargetState} XP</div>
              </button>

              <button
                onClick={() => setWeeklyMetric('lessons')}
                className={`py-2 px-2 rounded-xl border text-center transition cursor-pointer ${
                  weeklyMetric === 'lessons'
                    ? 'bg-teal-50 border-teal-400 text-teal-900 ring-2 ring-teal-200 font-black'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 font-bold'
                }`}
              >
                <div className="text-xs">Haftalık Ders</div>
                <div className="text-[9px] text-slate-400">{weeklyLessonsTargetState} Ders</div>
              </button>

              <button
                onClick={() => setWeeklyMetric('days')}
                className={`py-2 px-2 rounded-xl border text-center transition cursor-pointer ${
                  weeklyMetric === 'days'
                    ? 'bg-teal-50 border-teal-400 text-teal-900 ring-2 ring-teal-200 font-black'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 font-bold'
                }`}
              >
                <div className="text-xs">Aktif Gün</div>
                <div className="text-[9px] text-slate-400">{weeklyGoalDaysState} Gün / Hafta</div>
              </button>
            </div>

            {/* Target Value Selector */}
            {weeklyMetric === 'xp' ? (
              <div className="space-y-1.5 bg-amber-50/50 border border-amber-100 p-3 rounded-2xl">
                <span className="text-[11px] font-bold text-amber-900 block">
                  Haftalık Toplam XP Hedefi:
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {[150, 250, 500, 750, 1000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setWeeklyXpTargetState(val)}
                      className={`py-2 rounded-xl text-xs font-black transition flex flex-col items-center justify-center cursor-pointer ${
                        weeklyXpTargetState === val
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-102 ring-2 ring-amber-300'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      <span>{val}</span>
                      <span className={`text-[9px] ${weeklyXpTargetState === val ? 'text-amber-100' : 'text-slate-400'}`}>XP</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : weeklyMetric === 'lessons' ? (
              <div className="space-y-1.5 bg-teal-50/50 border border-teal-100 p-3 rounded-2xl">
                <span className="text-[11px] font-bold text-teal-900 block">
                  Haftalık Tamamlanacak Ders Sayısı:
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {[3, 5, 7, 10, 14].map((val) => (
                    <button
                      key={val}
                      onClick={() => setWeeklyLessonsTargetState(val)}
                      className={`py-2 rounded-xl text-xs font-black transition flex flex-col items-center justify-center cursor-pointer ${
                        weeklyLessonsTargetState === val
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 scale-102 ring-2 ring-teal-300'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      <span>{val}</span>
                      <span className={`text-[9px] ${weeklyLessonsTargetState === val ? 'text-teal-200' : 'text-slate-400'}`}>Ders</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 bg-teal-50/50 border border-teal-100 p-3 rounded-2xl">
                <span className="text-[11px] font-bold text-teal-900 block">
                  Haftada Kaç Gün Kazakça Çalışmak İstiyorsunuz?
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {[3, 4, 5, 6, 7].map((val) => (
                    <button
                      key={val}
                      onClick={() => setWeeklyGoalDaysState(val)}
                      className={`py-2 rounded-xl text-xs font-black transition flex flex-col items-center justify-center cursor-pointer ${
                        weeklyGoalDaysState === val
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 scale-102 ring-2 ring-teal-300'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      <span>{val} Gün</span>
                      <span className={`text-[9px] ${weeklyGoalDaysState === val ? 'text-teal-200' : 'text-slate-400'}`}>/ Hafta</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Weekly 7-Day Visual Progress Pills */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-slate-800">Haftalık Günlük Seri Durumu:</span>
                <span className="font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
                  {user.streakDays || 1} Günlük Aktif Seri
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((dayName, idx) => {
                  const isChecked = idx < Math.min(7, (user.streakDays || 1));
                  const isTodayPill = idx === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);

                  return (
                    <div
                      key={dayName}
                      className={`p-2 rounded-xl flex flex-col items-center justify-center text-center transition ${
                        isChecked 
                          ? 'bg-emerald-500 text-white shadow-2xs' 
                          : isTodayPill 
                            ? 'bg-teal-100 text-teal-900 border-2 border-teal-500 font-black' 
                            : 'bg-white text-slate-400 border border-slate-200'
                      }`}
                    >
                      <span className="text-[10px] font-bold">{dayName}</span>
                      {isChecked ? (
                        <Check className="w-3.5 h-3.5 stroke-[3] mt-0.5" />
                      ) : (
                        <span className="text-[10px] mt-0.5 font-bold">○</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Save Goals Button */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleSaveGoalSettings}
            className="py-2.5 px-5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-600/20 transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Hedefleri Kaydet & Takip Et</span>
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. DERS HATIRLATICI (DAILY STUDY REMINDER)           */}
      {/* ==================================================== */}
      <div className="bg-white p-5 rounded-3xl border border-amber-200/90 shadow-sm space-y-4 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-400/20 via-orange-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
              <Clock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  {isTr ? 'Ders Hatırlatıcı (Günlük)' : 'Сабақ Ескерткіші'}
                </h3>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  notificationsActive 
                    ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {notificationsActive ? `Saat ${reminderTimeState}` : 'Kapalı'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {isTr 
                  ? 'Her gün belirlediğiniz saatte Kazakça çalışma hatırlatıcısı ve masaüstü bildirimi alın.' 
                  : 'Күнделікті белгіленген уақытта қазақ тілін оқу туралы ескертпе алыңыз.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleTestReminder}
            className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-[11px] shadow-sm transition flex items-center gap-1 active:scale-95 cursor-pointer shrink-0"
            title="Hatırlatıcı bildirimini anında test edin"
          >
            <BellRing className="w-3.5 h-3.5 text-white" />
            <span>Hatırlatıcıyı Test Et</span>
          </button>
        </div>

        {reminderToast && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in">
            <span>{reminderToast}</span>
            <button onClick={() => setReminderToast(null)} className="text-amber-950 ml-2 font-bold cursor-pointer">✕</button>
          </div>
        )}

        {/* Reminder Controls Box */}
        <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-3">
          {/* Toggle Switch */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-200 text-amber-900">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 block">
                  Günlük Çalışma Saati Hatırlatıcısı
                </span>
                <span className="text-[10px] text-slate-600 font-medium">
                  Belirlenen saatte tarayıcı bildirimi ve sesli uyarı gönderir
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsActive}
                onChange={(e) => setNotificationsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Time Picker and Quick Presets */}
          {notificationsActive && (
            <div className="space-y-2.5 pt-2 border-t border-amber-200/80">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-black text-amber-950">Hatırlatıcı Saati Seçin:</span>
                  <input
                    type="time"
                    value={reminderTimeState}
                    onChange={(e) => setReminderTimeState(e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-amber-300 rounded-xl text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {notificationPermission !== 'granted' ? (
                  <button
                    type="button"
                    onClick={handleRequestBrowserPermission}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-black rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                  >
                    <span>🔔 Tarayıcı Bildirim İzni Ver</span>
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Masaüstü Bildirimleri Aktif</span>
                  </span>
                )}
              </div>

              {/* Quick Hour Preset Buttons */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 block mb-1">
                  Hızlı Saat Seçimi:
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { label: '09:00', title: '🌅 Sabah' },
                    { label: '13:00', title: '☀️ Öğle' },
                    { label: '19:30', title: '🌆 Akşam' },
                    { label: '20:00', title: '🌙 20:00' },
                    { label: '21:30', title: '🦉 Gece' }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setReminderTimeState(preset.label);
                        audioService.playFeedbackSound('click');
                      }}
                      className={`py-1.5 px-2 rounded-xl text-xs font-black transition flex flex-col items-center justify-center cursor-pointer ${
                        reminderTimeState === preset.label
                          ? 'bg-amber-500 text-white shadow-xs scale-102 ring-2 ring-amber-300'
                          : 'bg-white text-slate-700 border border-amber-200 hover:border-amber-400'
                      }`}
                    >
                      <span>{preset.label}</span>
                      <span className={`text-[8px] ${reminderTimeState === preset.label ? 'text-amber-100' : 'text-slate-400'}`}>
                        {preset.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notification Preview Card */}
              <div className="p-3 bg-white/90 border border-amber-200 rounded-xl text-left space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-black text-amber-800">
                  <Bell className="w-3 h-3 text-amber-600" />
                  <span>Bildirim Önizlemesi (Saat {reminderTimeState}):</span>
                </div>
                <div className="text-xs font-extrabold text-slate-900">
                  ⏰ Günlük Kazakça Çalışma Vakti!
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  Saat {reminderTimeState} oldu. {user.streakDays || 1} günlük serinizi bozmamak ve günlük hedefinize ulaşmak için bugün bir Kazakça dersi tamamlayın!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Reminder Button */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleSaveGoalSettings}
            className="py-2.5 px-5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md shadow-amber-600/20 transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Ders Hatırlatıcısını Kaydet</span>
          </button>
        </div>
      </div>

      {/* DATA VISUALIZATION: WEEKLY XP ACTIVITY (RECHARTS BAR CHART) */}
      <div className="bg-white p-5 rounded-3xl border border-teal-100 shadow-sm space-y-3.5 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <BarChart2 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 flex-wrap">
                <span>{isTr ? 'Haftalık XP Aktivitesi' : 'Апталық XP белсенділігі'}</span>
                <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.2 rounded-full border border-teal-200">
                  {isTr ? 'Son 7 Gün' : 'Соңғы 7 күн'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {isTr 
                  ? `Son bir haftada toplam ${totalWeeklyXp} XP kazandınız.` 
                  : `Соңғы аптада барлығы ${totalWeeklyXp} XP жинадыңыз.`}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/80 inline-flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{isTr ? `Hedef: ${dailyTarget} XP` : `Меже: ${dailyTarget} XP`}</span>
            </span>
          </div>
        </div>

        {/* Recharts Bar Chart Container */}
        <div className="w-full h-56 pt-1 select-none">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 12, right: 10, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="day" 
                tickLine={false} 
                axisLine={{ stroke: '#E2E8F0' }}
                tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }}
              />
              <YAxis 
                tickLine={false} 
                axisLine={{ stroke: '#E2E8F0' }}
                tick={{ fill: '#94A3B8', fontSize: 10 }}
                domain={[0, (dataMax: number) => Math.max(dataMax + 15, dailyTarget + 20)]}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(139, 92, 246, 0.06)' }}
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl border border-slate-800 text-xs space-y-1 min-w-[130px]">
                        <div className="flex items-center justify-between gap-2 font-bold text-slate-300 border-b border-slate-800 pb-1">
                          <span>{data.fullDate} ({data.day})</span>
                          {data.isToday && (
                            <span className="text-[9px] bg-teal-600 text-white px-1.5 py-0.2 rounded font-black">
                              {isTr ? 'Bugün' : 'Бүгін'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-3 pt-0.5">
                          <span className="text-slate-400">{isTr ? 'Kazanılan:' : 'Жиналған:'}</span>
                          <span className="font-black text-amber-400">{data.xp} XP</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-[10px]">
                          <span className="text-slate-400">{isTr ? 'Hedef:' : 'Меже:'}</span>
                          <span className="font-semibold text-slate-300">{dailyTarget} XP</span>
                        </div>
                        <div className="pt-0.5 text-[10px] font-black">
                          {data.metGoal ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <span>✓</span>
                              <span>{isTr ? 'Hedefe ulaşıldı' : 'Меже орындалды'}</span>
                            </span>
                          ) : (
                            <span className="text-amber-400">
                              {isTr ? `${dailyTarget - data.xp} XP eksik` : `${dailyTarget - data.xp} XP жетпейді`}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }} 
              />
              <ReferenceLine 
                y={dailyTarget} 
                stroke="#F59E0B" 
                strokeDasharray="4 4" 
                strokeWidth={1.5}
                label={{ 
                  value: isTr ? `Hedef ${dailyTarget}` : `Меже ${dailyTarget}`, 
                  fill: '#D97706', 
                  fontSize: 9, 
                  position: 'insideTopRight',
                  fontWeight: 700 
                }} 
              />
              <Bar 
                dataKey="xp" 
                radius={[6, 6, 0, 0]} 
                maxBarSize={36}
                animationDuration={600}
              >
                {weeklyData.map((entry, index) => {
                  let fillColor = '#A78BFA';
                  if (entry.isToday) {
                    fillColor = entry.metGoal ? '#10B981' : '#7C3AED';
                  } else if (entry.metGoal) {
                    fillColor = '#8B5CF6';
                  } else {
                    fillColor = '#CBD5E1';
                  }
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={fillColor}
                      stroke={entry.isToday ? '#5B21B6' : 'transparent'}
                      strokeWidth={entry.isToday ? 2 : 0}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Summary KPIs */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
          <div className="p-2 bg-slate-50 rounded-xl text-center">
            <span className="text-[10px] text-slate-500 font-bold block">{isTr ? 'Toplam XP' : 'Барлық XP'}</span>
            <span className="text-xs font-black text-teal-900">{totalWeeklyXp} XP</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-xl text-center">
            <span className="text-[10px] text-slate-500 font-bold block">{isTr ? 'Ortalama' : 'Орташа'}</span>
            <span className="text-xs font-black text-slate-900">{avgDailyXp} XP/{isTr ? 'gün' : 'күн'}</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-xl text-center">
            <span className="text-[10px] text-slate-500 font-bold block">{isTr ? 'Hedef Başarısı' : 'Меже нәтижесі'}</span>
            <span className="text-xs font-black text-emerald-700">{goalsMetCount} / 7 {isTr ? 'gün' : 'күн'}</span>
          </div>
        </div>
      </div>

      {/* Profile Customization Form Accordion */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-white p-5 rounded-3xl border border-teal-200 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Profil Kişiselleştirme & Fotoğraf</span>
            </h3>
            <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-md">
              Liderlik Tablosunda Görünür
            </span>
          </div>

          {/* Direct Photo Upload Card inside Edit Mode */}
          <div className="p-3.5 bg-teal-50/50 rounded-2xl border border-teal-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt="Seçili Fotoğraf"
                className="w-12 h-12 rounded-full object-cover border-2 border-teal-500 shadow-sm"
              />
              <div>
                <p className="text-xs font-black text-slate-900">Kendi Profil Fotoğrafınızı Ekleyin</p>
                <p className="text-[10px] text-slate-500">Galeriden veya bilgisayarınızdan resim yükleyin</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition"
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
                className="w-full pl-7 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden font-bold text-slate-800"
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
                  className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 rounded-md text-slate-600 transition"
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
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden text-slate-800 font-medium"
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
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden text-slate-800 font-semibold"
            />
            <div className="mt-1.5 flex flex-wrap gap-1">
              {PRESET_TITLES.slice(0, 4).map((tit) => (
                <button
                  type="button"
                  key={tit}
                  onClick={() => setCustomTitle(tit)}
                  className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 rounded-md text-slate-600 transition"
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
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden text-slate-800 font-normal leading-relaxed"
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
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden text-slate-800 font-medium bg-white"
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
                        ? 'border-teal-600 bg-teal-50/50 shadow-sm' 
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
              className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white text-xs font-black rounded-xl shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-1.5"
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

      {/* COMPACT BAŞARI ROZETLERİ PREVIEW BÖLÜMÜ (In Profile Tab) */}
      <div className="bg-white p-5 rounded-3xl border border-teal-100 shadow-sm space-y-4">
        {/* Header & Overall Progress */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs font-bold">
              <Award className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 flex-wrap">
                <span>{isTr ? 'Başarı Rozetleri & Kilometre Taşları' : 'Жетістік белгілері мен межелер'}</span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.2 rounded-full border border-amber-200">
                  {unlockedBadgesCount} / {achievements.length} {isTr ? 'Kazanıldı' : 'Ашылды'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {isTr 
                  ? 'Hedeflere ulaşarak yeni unvan ve rozetlerin kilidini açın.' 
                  : 'Мақсаттарға жетіп, жаңа атақтар мен марапаттарға ие болыңыз.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveProfileTab('achievements');
              audioService.playFeedbackSound('click');
            }}
            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black rounded-xl shadow-xs transition flex items-center gap-1 active:scale-95 shrink-0"
          >
            <span>{isTr ? 'Tümünü İncele' : 'Барлығын көру'}</span>
            <span>→</span>
          </button>
        </div>

        {/* Overall Completion Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner p-0.5 border border-slate-200/60">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-500 transition-all duration-700 ease-out"
            style={{ width: `${Math.max(5, badgesCompletionPercent)}%` }}
          />
        </div>

        {/* Quick horizontal preview of badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {achievements.slice(0, 4).map((item) => {
            const isUnlocked = item.isUnlocked;
            return (
              <div
                key={item.badge.id}
                onClick={() => setSelectedBadgeDetail(item)}
                className={`p-3 rounded-2xl border text-center cursor-pointer transition relative overflow-hidden ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-amber-50/70 via-white to-teal-50/40 border-amber-200 shadow-2xs hover:shadow-xs'
                    : 'bg-slate-50 border-slate-200/80 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="text-2xl mb-1">
                  {isUnlocked ? (
                    item.badge.icon === 'Award' ? '🏅' : item.badge.icon === 'Flame' ? '🔥' : item.badge.icon === 'Trophy' ? '🏆' : item.badge.icon === 'Zap' ? '⚡' : '⭐'
                  ) : (
                    '🔒'
                  )}
                </div>
                <div className="text-[11px] font-black text-slate-800 truncate">
                  {isTr ? item.badge.titleTr : item.badge.titleKz}
                </div>
                <div className="text-[9px] text-slate-500 font-bold mt-0.5">
                  {isUnlocked ? (
                    <span className="text-emerald-700 font-black">✓ Kazanıldı</span>
                  ) : (
                    <span>%{Math.min(100, Math.round((item.progress / item.max) * 100))}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner link to full achievements */}
        <div 
          onClick={() => {
            setActiveProfileTab('achievements');
            audioService.playFeedbackSound('click');
          }}
          className="p-3 bg-teal-50/70 hover:bg-teal-100/60 rounded-2xl border border-teal-200/80 flex items-center justify-between text-xs text-teal-800 cursor-pointer transition"
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-bold">
              {isTr 
                ? `Toplam ${achievements.length} başarı rozeti ve kilometre taşı sizi bekliyor` 
                : `Барлығы ${achievements.length} жетістік белгісі мен межесі сізді күтуде`}
            </span>
          </div>
          <span className="font-black text-teal-700 flex items-center gap-0.5">
            <span>{isTr ? 'Ekranı Aç' : 'Ашу'}</span>
            <span>→</span>
          </span>
        </div>
      </div>

      {/* Badge Detail Modal Dialog */}
      {selectedBadgeDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-teal-100 animate-in zoom-in-95">
            <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-md ${
              selectedBadgeDetail.isUnlocked
                ? 'bg-gradient-to-br from-amber-400 to-orange-400 text-white ring-4 ring-amber-300/50'
                : 'bg-slate-100 text-slate-400 border-2 border-slate-200'
            }`}>
              {selectedBadgeDetail.isUnlocked ? '🏆' : '🔒'}
            </div>

            <div>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-1.5 ${
                selectedBadgeDetail.isUnlocked
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {selectedBadgeDetail.isUnlocked ? '✓ ROZET KAZANILDI' : 'KİLİTLİ HEDEF'}
              </span>

              <h3 className="text-base font-black text-slate-900">
                {isTr ? selectedBadgeDetail.badge.titleTr : selectedBadgeDetail.badge.titleKz}
              </h3>

              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {isTr ? selectedBadgeDetail.badge.descriptionTr : selectedBadgeDetail.badge.descriptionKz}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-1.5 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-700">
                <span>Gereksinim:</span>
                <span className="text-teal-700">{selectedBadgeDetail.max} {selectedBadgeDetail.unit || ''}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-slate-700">
                <span>Mevcut Durum:</span>
                <span className={selectedBadgeDetail.isUnlocked ? 'text-emerald-600 font-black' : 'text-slate-900'}>
                  {Math.min(selectedBadgeDetail.progress, selectedBadgeDetail.max)} {selectedBadgeDetail.unit || ''}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full ${
                    selectedBadgeDetail.isUnlocked ? 'bg-emerald-500' : 'bg-teal-600'
                  }`}
                  style={{ width: `${Math.min(100, Math.round((selectedBadgeDetail.progress / selectedBadgeDetail.max) * 100))}%` }}
                />
              </div>
            </div>

            {/* Social Share Card Button for unlocked badges */}
            {selectedBadgeDetail.isUnlocked && (
              <button
                onClick={() => {
                  const b = selectedBadgeDetail.badge;
                  const s = { progress: selectedBadgeDetail.progress, max: selectedBadgeDetail.max, unit: selectedBadgeDetail.unit };
                  setSelectedBadgeDetail(null);
                  setShareBadge(b);
                  setShareStats(s);
                }}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 active:scale-98"
              >
                <Share2 className="w-4 h-4 text-slate-950" />
                <span>Sosyal Medya Kartı Oluştur / Paylaş</span>
              </button>
            )}

            <button
              onClick={() => setSelectedBadgeDetail(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl transition"
            >
              Tamam / Жабу
            </button>
          </div>
        </div>
      )}

      {/* Shareable Badge Social Card Generator Modal */}
      <ShareableBadgeCardModal
        isOpen={Boolean(shareBadge)}
        onClose={() => setShareBadge(null)}
        badge={shareBadge}
        user={user}
        stats={shareStats}
      />

      {/* ÇEVRİMDIŞI MOD VE ÖNBELLEK YÖNETİMİ (OFFLINE MODE & CACHE STORAGE) */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold ${
              isOnlineState ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
            }`}>
              {isOnlineState ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 flex-wrap">
                <span>Çevrimdışı Mod ve Önbellek</span>
                <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                  isOnlineState 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {isOnlineState ? '🟢 Çevrimiçi' : '🟠 Çevrimdışı Mod'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                İnternet bağlantısı olmadan 34 ders, sesler ve alıştırmalara kesintisiz erişim.
              </p>
            </div>
          </div>
        </div>

        {/* Caching Status Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Müfredat Dersleri
            </span>
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-800 text-sm">34 / 34 Ders</span>
              <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                Önbellekte
              </span>
            </div>
            <p className="text-[10px] text-slate-500">A1-C1 tüm alıştırmalar yerel kayıtlı</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Kazakça Harf Sesleri
            </span>
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-800 text-sm">
                {offlineStats?.cachedAudios || 9} / 42 Ses
              </span>
              <span className="text-[9px] font-black text-cyan-700 bg-cyan-100 px-1.5 py-0.5 rounded">
                9 Özel Harf Hazır
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Gemini TTS stüdyo sesleri hazır</p>
          </div>
        </div>

        {/* Pre-Cache Progress Bar if active */}
        {isPreCaching && (
          <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-bold text-teal-900">
              <span>{preCacheMessage || 'İndiriliyor...'}</span>
              <span>%{preCachePercent}</span>
            </div>
            <div className="w-full bg-teal-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-teal-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${preCachePercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          {/* Pre-cache button */}
          <button
            onClick={handlePreCacheAllContent}
            disabled={isPreCaching}
            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 active:scale-98"
          >
            <HardDriveDownload className="w-4 h-4" />
            <span>{isPreCaching ? 'Önbelleğe Alınıyor...' : 'Tüm Müfredatı & Sesleri Çevrimdışı İndir'}</span>
          </button>

          {/* Airplane mode simulator toggle */}
          <button
            onClick={handleToggleSimulatedOffline}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 border ${
              isSimulatedOffline
                ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-500 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            {isSimulatedOffline ? <WifiOff className="w-4 h-4 text-amber-200" /> : <Radio className="w-4 h-4 text-slate-500" />}
            <span>{isSimulatedOffline ? 'Uçak Modunu Kapat' : 'Çevrimdışı Modu Test Et'}</span>
          </button>
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
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Öğrenme Yönü</span>
              <span className="text-[10px] text-slate-500">
                {isTr ? 'Türkçe → Kazakça (Қазақ тілін үйрену)' : 'Kazakça → Türkçe (Түрік тілін үйрену)'}
              </span>
            </div>
          </div>
          <span className="text-xs font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded-lg">
            Değiştir
          </span>
        </div>

        {/* Guest or Logged in status */}
        {user.isGuest ? (
          <div 
            onClick={() => onOpenAuth && onOpenAuth('login')}
            className="p-3.5 flex items-center justify-between hover:bg-teal-50/50 cursor-pointer transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 text-teal-700 rounded-xl">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Kendi Hesabınla Giriş Yap</span>
                <span className="text-[10px] text-slate-500">
                  Giriş yaparak tüm cihazlarda ilerlemeni eşitle
                </span>
              </div>
            </div>
            <span className="text-xs font-black text-teal-700 bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-200">
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
    </>
  ) : (
    /* ========================================================================= */
    /* DEDICATED FULL-PAGE 'BAŞARILARIM' (MY ACHIEVEMENTS) SCREEN                */
    /* ========================================================================= */
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Hero Achievements Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-teal-950 to-cyan-950 text-white p-6 rounded-3xl relative overflow-hidden shadow-xl border border-teal-800/40">
        {/* Ambient Background Glows */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-teal-600/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl shadow-lg ring-4 ring-amber-300/30 shrink-0">
                🏆
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30 mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{isTr ? 'Bozkır & Türkoloji Rozetleri' : 'Дала және Түркітану белгілері'}</span>
                </div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  {isTr ? 'Başarılarım ve Kilometre Taşları' : 'Жетістіктерім мен межелер'}
                </h2>
                <p className="text-xs text-teal-200/80 max-w-md mt-0.5 leading-relaxed">
                  {isTr 
                    ? 'Dersleri tamamlayın, kelime dağarcığınızı geliştirin ve serinizi koruyarak tüm prestijli rozetlerin kilidini açın.' 
                    : 'Сабақтарды аяқтап, сөздік қорыңызды молайтыңыз және барлық марапаттарды жинаңыз.'}
                </p>
              </div>
            </div>

            {/* Overall Progress Gauge Pill */}
            <div className="sm:text-right shrink-0 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
              <div className="text-[10px] font-bold text-teal-200 uppercase tracking-wider mb-0.5">
                {isTr ? 'Toplam Rozet Başarısı' : 'Жалпы жетістік'}
              </div>
              <div className="text-2xl font-black text-amber-300 flex items-center sm:justify-end gap-1">
                <span>%{badgesCompletionPercent}</span>
                <span className="text-xs font-semibold text-white/70">
                  ({unlockedBadgesCount}/{achievements.length})
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar with Gradient */}
          <div className="space-y-1.5">
            <div className="w-full bg-white/15 rounded-full h-2.5 overflow-hidden shadow-inner p-0.5 border border-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${Math.max(5, badgesCompletionPercent)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-teal-300/80 font-bold">
              <span>0 Rozet</span>
              <span>%{badgesCompletionPercent} Tamamlandı</span>
              <span>{achievements.length} Rozet (Usta Türkolog)</span>
            </div>
          </div>

          {/* 4 Stats Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-white/10">
            <div className="p-2.5 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold text-teal-300 block">Kazanılan Rozet</span>
              <span className="text-base font-black text-amber-300">{unlockedBadgesCount} / {achievements.length}</span>
            </div>
            <div className="p-2.5 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold text-teal-300 block">Rozet XP Bonusu</span>
              <span className="text-base font-black text-emerald-400">+{totalBadgeXpEarned} XP</span>
            </div>
            <div className="p-2.5 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold text-teal-300 block">Aktif Gün Seri</span>
              <span className="text-base font-black text-orange-400">{user.streakDays || 1} Gün 🔥</span>
            </div>
            <div className="p-2.5 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold text-teal-300 block">Mevcut Toplam XP</span>
              <span className="text-base font-black text-teal-200">{user.xpPoints || 0} XP ⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* NEXT CLOSEST MILESTONE ALERT (Sıradaki Kilometre Taşı) */}
      {nextClosestBadge && (
        <div 
          onClick={() => setSelectedBadgeDetail(nextClosestBadge)}
          className="p-4 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-300/80 rounded-3xl shadow-sm cursor-pointer hover:border-amber-400 transition group"
        >
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                🎯
              </div>
              <span className="text-xs font-black text-amber-950 uppercase tracking-wider">
                {isTr ? 'Sıradaki Başarınız Çok Yakın!' : 'Келесі жетістік өте жақын!'}
              </span>
            </div>
            <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300/70">
              {nextClosestBadge.badge.tier === 'diamond' ? '💎 Elmas' : nextClosestBadge.badge.tier === 'gold' ? '🥇 Altın' : nextClosestBadge.badge.tier === 'silver' ? '🥈 Gümüş' : '🥉 Bronz'}
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl font-black shrink-0 border border-amber-200 shadow-2xs group-hover:scale-105 transition">
              {nextClosestBadge.badge.icon === 'Award' ? '🏅' : nextClosestBadge.badge.icon === 'Flame' ? '🔥' : nextClosestBadge.badge.icon === 'Trophy' ? '🏆' : nextClosestBadge.badge.icon === 'Zap' ? '⚡' : nextClosestBadge.badge.icon === 'BookOpen' ? '📖' : nextClosestBadge.badge.icon === 'Crown' ? '👑' : nextClosestBadge.badge.icon === 'Mic' ? '🎙️' : nextClosestBadge.badge.icon === 'GraduationCap' ? '🎓' : '⭐'}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-black text-slate-900 truncate">
                  {isTr ? nextClosestBadge.badge.titleTr : nextClosestBadge.badge.titleKz}
                </h4>
                <span className="text-xs font-black text-teal-700 shrink-0">
                  +{nextClosestBadge.xpReward || 100} XP
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                {isTr ? nextClosestBadge.badge.descriptionTr : nextClosestBadge.badge.descriptionKz}
              </p>

              {/* Progress bar towards completion */}
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                  <span>İlerleme Durumu:</span>
                  <span className="text-amber-800 font-black">
                    {Math.min(nextClosestBadge.progress, nextClosestBadge.max)} / {nextClosestBadge.max} {nextClosestBadge.unit || ''} (%{Math.min(100, Math.round((nextClosestBadge.progress / nextClosestBadge.max) * 100))})
                  </span>
                </div>
                <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((nextClosestBadge.progress / nextClosestBadge.max) * 100))}%` }}
                  />
                </div>
                <div className="text-[10px] font-bold text-amber-900 mt-1 flex items-center justify-between">
                  <span>
                    Kilidi açmaya sadece <span className="underline font-black">{Math.max(0, nextClosestBadge.max - nextClosestBadge.progress)} {nextClosestBadge.unit || ''}</span> kaldı!
                  </span>
                  <span className="text-teal-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                    <span>Ayrıntılar</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FILTERS & SEARCH BAR */}
      <div className="bg-white p-4 rounded-3xl border border-teal-100 shadow-sm space-y-3">
        {/* Status Tabs: Tümü, Kazanılanlar, Hedefler */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setBadgeFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              badgeFilter === 'all'
                ? 'bg-teal-600 text-white shadow-2xs font-black'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <span>{isTr ? 'Tüm Rozetler' : 'Барлығы'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
              {achievements.length}
            </span>
          </button>
          <button
            onClick={() => setBadgeFilter('unlocked')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              badgeFilter === 'unlocked'
                ? 'bg-emerald-600 text-white shadow-2xs font-black'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isTr ? 'Kazanılanlar' : 'Ашылғандар'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
              {unlockedBadgesCount}
            </span>
          </button>
          <button
            onClick={() => setBadgeFilter('locked')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              badgeFilter === 'locked'
                ? 'bg-amber-600 text-white shadow-2xs font-black'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isTr ? 'Kilitli / Hedefler' : 'Мақсаттар'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
              {lockedBadges.length}
            </span>
          </button>
        </div>

        {/* Category Pills: Streak, XP, Lesson, Vocab, Academic */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 mr-1">Kategori:</span>
          <button
            onClick={() => setBadgeCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
              badgeCategoryFilter === 'all'
                ? 'bg-slate-900 text-white font-black'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setBadgeCategoryFilter('streak')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
              badgeCategoryFilter === 'streak'
                ? 'bg-orange-600 text-white font-black'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <span>🔥 Seri</span>
            <span className="opacity-75">({streakCount})</span>
          </button>
          <button
            onClick={() => setBadgeCategoryFilter('xp')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
              badgeCategoryFilter === 'xp'
                ? 'bg-amber-600 text-white font-black'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <span>⚡ XP</span>
            <span className="opacity-75">({xpCount})</span>
          </button>
          <button
            onClick={() => setBadgeCategoryFilter('lesson')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
              badgeCategoryFilter === 'lesson'
                ? 'bg-teal-600 text-white font-black'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <span>📖 Dersler</span>
            <span className="opacity-75">({lessonCount})</span>
          </button>
          <button
            onClick={() => setBadgeCategoryFilter('vocab')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
              badgeCategoryFilter === 'vocab'
                ? 'bg-emerald-600 text-white font-black'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <span>📚 Kelime</span>
            <span className="opacity-75">({vocabCount})</span>
          </button>
          <button
            onClick={() => setBadgeCategoryFilter('academic')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
              badgeCategoryFilter === 'academic'
                ? 'bg-teal-600 text-white font-black'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <span>🎓 Akademik</span>
            <span className="opacity-75">({academicCount})</span>
          </button>
        </div>
      </div>

      {/* DEDICATED BADGES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredAchievements.map((item) => {
          const isUnlocked = item.isUnlocked;
          const percent = Math.min(100, Math.round((item.progress / item.max) * 100));
          const tier = item.badge.tier || 'bronze';

          // Visual styling per tier
          const tierStyles = {
            diamond: isUnlocked
              ? 'border-cyan-300/90 bg-gradient-to-br from-cyan-50/70 via-white to-teal-50/80 shadow-md ring-2 ring-cyan-200/50'
              : 'border-slate-200 bg-slate-50/80',
            gold: isUnlocked
              ? 'border-amber-300/90 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/70 shadow-md ring-2 ring-amber-200/50'
              : 'border-slate-200 bg-slate-50/80',
            silver: isUnlocked
              ? 'border-slate-300/90 bg-gradient-to-br from-slate-50/90 via-white to-sky-50/60 shadow-sm'
              : 'border-slate-200 bg-slate-50/80',
            bronze: isUnlocked
              ? 'border-orange-200/90 bg-gradient-to-br from-orange-50/70 via-white to-amber-50/50 shadow-sm'
              : 'border-slate-200 bg-slate-50/80'
          }[tier] || 'border-slate-200 bg-slate-50';

          const tierLabels: Record<string, string> = {
            diamond: '💎 Elmas',
            gold: '🥇 Altın',
            silver: '🥈 Gümüş',
            bronze: '🥉 Bronz'
          };

          const categoryLabels: Record<string, string> = {
            streak: '🔥 Seri',
            xp: '⚡ XP',
            lesson: '📖 Ders',
            vocab: '📚 Kelime',
            academic: '🎓 Akademik'
          };

          return (
            <div
              key={item.badge.id}
              onClick={() => setSelectedBadgeDetail(item)}
              className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group hover:scale-[1.01] ${tierStyles}`}
            >
              <div className="flex items-start gap-3.5">
                {/* Badge Icon Frame */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-sm transition-transform group-hover:scale-105 ${
                  isUnlocked
                    ? tier === 'diamond'
                      ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-teal-500 text-white ring-2 ring-cyan-300'
                      : tier === 'gold'
                        ? 'bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500 text-white ring-2 ring-amber-300'
                        : tier === 'silver'
                          ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white ring-2 ring-slate-200'
                          : 'bg-gradient-to-br from-amber-600 to-orange-600 text-white ring-2 ring-amber-400'
                    : 'bg-slate-200 text-slate-400 border border-slate-300'
                }`}>
                  {isUnlocked ? (
                    <span>{item.badge.icon === 'Award' ? '🏅' : item.badge.icon === 'Flame' ? '🔥' : item.badge.icon === 'Trophy' ? '🏆' : item.badge.icon === 'Zap' ? '⚡' : item.badge.icon === 'BookOpen' ? '📖' : item.badge.icon === 'Crown' ? '👑' : item.badge.icon === 'Mic' ? '🎙️' : item.badge.icon === 'GraduationCap' ? '🎓' : item.badge.icon === 'Bookmark' ? '🔖' : '⭐'}</span>
                  ) : (
                    <Lock className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                {/* Badge Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-900/5 text-slate-700 border border-slate-900/10">
                        {tierLabels[tier] || '🥉 Bronz'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                        {categoryLabels[item.category || item.badge.category || 'lesson'] || '📖 Genel'}
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
                      +{item.xpReward || 100} XP
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 truncate">
                    {isTr ? item.badge.titleTr : item.badge.titleKz}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                    {isTr ? item.badge.descriptionTr : item.badge.descriptionKz}
                  </p>

                  {/* Progress or Completion Section */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                      <span>{isUnlocked ? 'Kazanım Durumu:' : 'Hedef İlerlemesi:'}</span>
                      <span className={isUnlocked ? 'text-emerald-700 font-black' : 'text-slate-700'}>
                        {isUnlocked ? (
                          <span>✓ Tamamlandı</span>
                        ) : (
                          <span>{Math.min(item.progress, item.max)} / {item.max} {item.unit || ''} (%{percent})</span>
                        )}
                      </span>
                    </div>

                    <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isUnlocked
                            ? 'bg-emerald-500'
                            : 'bg-gradient-to-r from-teal-500 to-amber-500'
                        }`}
                        style={{ width: `${Math.max(6, percent)}%` }}
                      />
                    </div>

                    {/* Bottom Action / Status Row */}
                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      {isUnlocked ? (
                        <>
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Kazanıldı</span>
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShareBadge(item.badge);
                              setShareStats({ progress: item.progress, max: item.max, unit: item.unit });
                            }}
                            className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg text-[10px] font-black shadow-xs transition flex items-center gap-1 active:scale-95"
                            title="Sosyal Medya Kartı Oluştur"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>Sosyal Kartı Paylaş</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-amber-800 font-bold">
                          Açılmasına {Math.max(0, item.max - item.progress)} {item.unit || ''} kaldı
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Back-to-Profile Button */}
      <div className="pt-2 text-center">
        <button
          onClick={() => {
            setActiveProfileTab('profile');
            audioService.playFeedbackSound('click');
          }}
          className="px-6 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-black shadow-xs transition inline-flex items-center gap-2 active:scale-98"
        >
          <User className="w-4 h-4 text-teal-600" />
          <span>{isTr ? '← Profil ve Hedefler Ayarlarına Dön' : '← Профиль және мақсаттарға оралу'}</span>
        </button>
      </div>
    </div>
  )}

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
              <button onClick={() => setShowPrivacyModal(false)} className="px-4 py-2 bg-teal-600 text-white font-bold rounded-xl text-xs">
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
              <p>Kullanıcılar platform alanlarında saygılı, yapıcı ve Türk Dünyası kardeşlik hukukuna uygun bir dil kullanmayı taahhüt eder. Zararlı veya yasa dışı içerik paylaşımı yasaktır.</p>
              <p className="font-bold text-slate-900">3. Fikri Mülkiyet</p>
              <p>Müfredat, seslendirmeler, telaffuz atlası ve alıştırmalar Uzaktan Türkolog ekibine aittir.</p>
            </div>
            <div className="pt-2 text-right">
              <button onClick={() => setShowTermsModal(false)} className="px-4 py-2 bg-teal-600 text-white font-bold rounded-xl text-xs">
                Kabul Ediyorum
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

