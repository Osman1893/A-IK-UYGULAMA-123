/**
 * Uzaktan Türkolog - Storage and State Management Service
 * Full persistence, Super Admin management, CRUD and Audit logging
 */

import { 
  Unit, 
  Lesson, 
  VocabItem, 
  UserProfile, 
  TranslationErrorTicket, 
  AuditLogItem, 
  AppReleaseMetadata, 
  LanguageDirection,
  CefrLevel,
  ExerciseItem,
  LeaderboardPeriod,
  LeaderboardEntry,
  UserBadge,
  ForumPost,
  ForumComment,
  ForumCategory
} from '../types';
import { initialUnits, initialBadges } from '../data/initialCurriculum';
import { SecurityService } from './securityService';

const STORAGE_KEYS = {
  UNITS: 'uzaktan_turkolog_units_v4',
  CURRENT_USER: 'uzaktan_turkolog_user_v1',
  USERS_LIST: 'uzaktan_turkolog_users_list_v1',
  ERROR_TICKETS: 'uzaktan_turkolog_error_tickets_clean_v1',
  AUDIT_LOGS: 'uzaktan_turkolog_audit_logs_v1',
  APP_CONFIG: 'uzaktan_turkolog_app_config_v1',
  FORUM_POSTS: 'uzaktan_turkolog_forum_posts_clean_v1',
  ADMIN_SESSION_VERIFIED: 'uzaktan_turkolog_admin_session_v1',
  ADMIN_PASSWORD_HASH: 'uzaktan_turkolog_admin_hash_v1',
};

// Default Super Admin User Profile for the application owner
export const SUPER_ADMIN_EMAIL = 'dadasosman2525@gmail.com';

// Cryptographically hashed master digest for initial administrator authorization (SHA-256)
// NO plaintext password is ever stored or exposed in the source code!
const INITIAL_ADMIN_HASH = 'ef4c6e47783ed719aed3586dbfc6dcfb97c5763a888d638aea6ac2c0eb930440';

// Default Guest / Standard Learner profile for visitors who have not logged in yet
export const defaultGuestProfile: UserProfile = {
  id: 'usr-guest-1',
  email: 'misafir@uzaktanturkolog.com',
  name: 'Misafir Öğrenci',
  nickname: 'Kıpçak Yolcusu',
  bio: 'Türk dilleri ve Kazak kültürünü öğrenen Türkolog adayı.',
  customTitle: 'Öğrenci',
  targetGoal: 'Kazakça A1 ve A2 seviyelerini tamamlamak',
  themeColor: 'violet',
  avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=KipcakYolcusu',
  role: 'user',
  isSuperAdmin: false,
  isGuest: true,
  currentDirection: 'TR_TO_KZ',
  currentLevel: 'A1',
  dailyGoalMinutes: 15,
  todayCompletedMinutes: 0,
  streakDays: 1,
  xpPoints: 0,
  completedLessonIds: [],
  masteredWordIds: [],
  reviewWordIds: [],
  badges: [initialBadges[0]],
  isPremium: false,
  energy: 100,
  maxEnergy: 100,
  lastEnergyRechargeAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  lastActiveAt: new Date().toISOString()
};

const defaultSuperAdminProfile: UserProfile = {
  id: 'usr-admin-1',
  email: SUPER_ADMIN_EMAIL,
  name: 'Osman Dadaş (Baş Admin)',
  nickname: 'Dadaş Hoca',
  bio: 'Türk Dünyası dilleri ve Kıpçak sahası araştırmacısı. Kazakça - Türkçe kardeşlik köprüsü.',
  customTitle: 'Baş Türkolog & Kurucu',
  targetGoal: 'Tüm Türk Dünyası için dijital dil ve kültür akademisi',
  themeColor: 'violet',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  role: 'super_admin',
  isSuperAdmin: true,
  currentDirection: 'TR_TO_KZ',
  currentLevel: 'A2',
  dailyGoalMinutes: 15,
  todayCompletedMinutes: 8,
  streakDays: 12,
  xpPoints: 1450,
  completedLessonIds: ['lesson-a2-1-1'],
  masteredWordIds: ['v-1', 'v-2', 'v-3', 'v-5'],
  reviewWordIds: ['v-4', 'v-6'],
  badges: initialBadges,
  isPremium: true,
  energy: 100,
  maxEnergy: 100,
  lastEnergyRechargeAt: new Date().toISOString(),
  createdAt: '2026-01-01T00:00:00.000Z',
  lastActiveAt: new Date().toISOString()
};

const defaultAppConfig: AppReleaseMetadata = {
  appName: 'Uzaktan Turkolog',
  packageNameAndroid: 'com.uzaktanturkolog.app',
  bundleIdIos: 'com.uzaktanturkolog.ios',
  versionName: '1.0.0',
  versionCode: 100,
  targetSdkAndroid: 34,
  minSdkAndroid: 23,
  iosDeploymentTarget: '15.0',
  privacyPolicyUrl: 'https://uzaktanturkolog.com/privacy',
  supportEmail: 'dadasosman2525@gmail.com',
  shortDescriptionTr: 'Çift Yönlü Türkçe - Kazakça Dil Öğrenme Platformu',
  shortDescriptionKz: 'Түрікше - Қазақша екіжақты тіл үйрену платформасы',
  fullDescriptionTr: 'Uzaktan Türkolog, Türkiye Türkçesi ve Kazak Türkçesi arasında A2 ve B1 seviyelerinde karşılıklı dil öğrenimi sağlayan profesyonel eğitim uygulamasıdır. Kiril ve Latin alfabeleri, sesli telaffuzlar, dil bilgisi karşılaştırmaları ve alıştırmalar içerir.',
  fullDescriptionKz: 'Қазақ және түрік тілдерін заманауи әдістемемен үйретуге арналған бірегей платформа. Сөздік, грамматика, дыбыстау және бейімделген жаттығулар.'
};

class StorageService {
  /**
   * Load all units with default fallback
   */
  getUnits(): Unit[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.UNITS);
      if (data) {
        const parsed = JSON.parse(data) as Unit[];
        // Synchronize with initialUnits so content upgrades are instantly applied
        const updated = initialUnits.map(initU => {
          const existing = parsed.find(p => p.id === initU.id);
          if (!existing || (existing.version || 0) < (initU.version || 1)) {
            return initU;
          }
          return existing;
        });
        // Preserve any custom units created by Super Admin
        const initialIds = new Set(initialUnits.map(u => u.id));
        const customAdminUnits = parsed.filter(u => !initialIds.has(u.id));
        const finalUnits = [...updated, ...customAdminUnits];
        this.saveUnits(finalUnits);
        return finalUnits;
      }
    } catch {
      // ignore
    }
    this.saveUnits(initialUnits);
    return initialUnits;
  }

  saveUnits(units: Unit[]): void {
    localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(units));
  }

  /**
   * Get Current Logged-in User Profile.
   * If not logged in, defaults to a regular student (guest learner).
   * Super Admin is NEVER automatically assigned without verified admin credentials!
   */
  getCurrentUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      const adminVerified = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION_VERIFIED) === 'true';

      if (data) {
        const user = JSON.parse(data) as UserProfile;
        
        // 8-Hour Energy Recharge Check (28,800,000 ms)
        const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;
        const now = Date.now();
        const lastRechargeTime = user.lastEnergyRechargeAt ? new Date(user.lastEnergyRechargeAt).getTime() : now;
        
        if (now - lastRechargeTime >= EIGHT_HOURS_MS) {
          user.energy = 100;
          user.lastEnergyRechargeAt = new Date().toISOString();
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        } else if (typeof user.energy !== 'number') {
          user.energy = 100;
          user.maxEnergy = 100;
          user.lastEnergyRechargeAt = new Date().toISOString();
        }
        user.maxEnergy = 100;

        // Critical safeguard: If stored profile is Super Admin email, BUT admin session
        // has NOT been explicitly verified by password/admin login:
        if (user.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
          if (!adminVerified) {
            // Not verified as Admin! Fall back to guest student so other users do not get admin privileges.
            return { ...defaultGuestProfile };
          }
          user.isSuperAdmin = true;
          user.role = 'super_admin';
          user.isGuest = false;
          return user;
        }

        // Regular users must NEVER have Super Admin flags
        user.isSuperAdmin = false;
        if (user.role === 'super_admin') {
          user.role = 'user';
        }
        return user;
      }
    } catch {
      // ignore
    }

    // Default for brand new visitors: Guest Student (NOT Admin!)
    return { ...defaultGuestProfile };
  }

  saveCurrentUser(user: UserProfile): void {
    const adminVerified = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION_VERIFIED) === 'true';
    if (user.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() && adminVerified) {
      user.isSuperAdmin = true;
      user.role = 'super_admin';
    } else {
      user.isSuperAdmin = false;
      if (user.role === 'super_admin') {
        user.role = 'user';
      }
    }

    if (typeof user.energy !== 'number') {
      user.energy = 100;
    }
    user.maxEnergy = 100;
    if (!user.lastEnergyRechargeAt) {
      user.lastEnergyRechargeAt = new Date().toISOString();
    }

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  /**
   * Consume user energy for activities
   * Standard: 100 energy, recharges every 8 hours.
   * Pro / Premium: UNLIMITED (isPremium === true).
   */
  consumeEnergy(amount: number): { success: boolean; currentEnergy: number; isUnlimited: boolean; error?: string } {
    const user = this.getCurrentUser();
    
    // Pro users have unlimited energy!
    if (user.isPremium) {
      return { success: true, currentEnergy: 100, isUnlimited: true };
    }

    if (user.energy < amount) {
      return { 
        success: false, 
        currentEnergy: user.energy, 
        isUnlimited: false, 
        error: `Yetersiz enerji! Bu aktivite ${amount} enerji gerektirir. Mevcut enerjiniz: ${user.energy}.` 
      };
    }

    user.energy = Math.max(0, user.energy - amount);
    this.saveCurrentUser(user);

    return { success: true, currentEnergy: user.energy, isUnlimited: false };
  }

  /**
   * Get Energy Status & Next 8h Refill Timer
   */
  getEnergyStatus(): { energy: number; maxEnergy: number; isUnlimited: boolean; nextRefillFormatted: string; percent: number } {
    const user = this.getCurrentUser();
    if (user.isPremium) {
      return { energy: 100, maxEnergy: 100, isUnlimited: true, nextRefillFormatted: 'Sınırsız Enerji (PRO)', percent: 100 };
    }

    const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;
    const now = Date.now();
    const lastRechargeTime = user.lastEnergyRechargeAt ? new Date(user.lastEnergyRechargeAt).getTime() : now;
    const elapsed = now - lastRechargeTime;
    const remainingMs = Math.max(0, EIGHT_HOURS_MS - elapsed);

    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

    const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const percent = Math.min(100, Math.round((user.energy / 100) * 100));

    return {
      energy: user.energy,
      maxEnergy: 100,
      isUnlimited: false,
      nextRefillFormatted: formatted,
      percent
    };
  }

  /**
   * Upgrade User to PRO (Unlimited Energy Lifetime)
   */
  upgradeToPro(): UserProfile {
    const user = this.getCurrentUser();
    user.isPremium = true;
    user.energy = 100;
    this.saveCurrentUser(user);
    this.logAudit(user.email, 'UPGRADE_PRO', 'Abonelik', 'Kullanıcı PRO Sürüme yükseltildi (Sınırsız Enerji).');
    return user;
  }

  /**
   * Update and personalize user profile with strict security sanitization
   */
  updateUserProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getCurrentUser();
    
    // Security: Prevent malicious role elevation
    delete (updates as any).role;
    delete (updates as any).isSuperAdmin;

    // Security sanitization for text inputs to prevent XSS
    const sanitizeText = (txt?: string) => txt ? txt.replace(/[<>]/g, '').trim() : undefined;

    const updated: UserProfile = {
      ...current,
      ...updates,
      name: sanitizeText(updates.name) || current.name,
      nickname: sanitizeText(updates.nickname) || current.nickname,
      bio: sanitizeText(updates.bio) || current.bio,
      customTitle: sanitizeText(updates.customTitle) || current.customTitle,
      lastActiveAt: new Date().toISOString()
    };
    
    const adminVerified = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION_VERIFIED) === 'true';
    if (updated.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() && adminVerified) {
      updated.isSuperAdmin = true;
      updated.role = 'super_admin';
    } else {
      updated.isSuperAdmin = false;
    }

    this.saveCurrentUser(updated);

    // Also update in registered users list
    const users = this.getRegisteredUsers();
    const index = users.findIndex(u => u.id === updated.id || u.email.toLowerCase() === updated.email.toLowerCase());
    if (index >= 0) {
      users[index] = { ...updated };
    } else {
      users.push(updated);
    }
    this.saveRegisteredUsers(users);

    this.logAudit(
      updated.email, 
      'UPDATE_PROFILE', 
      'Profil', 
      `Profil güncellendi. Lakap: ${updated.nickname || updated.name}`
    );

    return updated;
  }

  /**
   * Super Admin Login - verifies admin authorization before granting permissions
   * Enterprise security: Cryptographic SHA-256 Digest Verification, Anti-Brute-Force Rate Limiting & Session Tokens
   */
  loginAsSuperAdmin(password?: string): { success: boolean; user: UserProfile; error?: string } {
    // 1. Check Anti-Brute-Force Rate Limiter (max 5 attempts, 3 min lockout)
    const rateLimit = SecurityService.checkRateLimit('admin_auth', 5, 180000);
    if (!rateLimit.allowed) {
      this.logAudit(SUPER_ADMIN_EMAIL, 'SECURITY_LOCKOUT', 'Güvenlik', `Yönetici girişi geçici olarak kilitlendi. Kalan süre: ${rateLimit.retryAfterSeconds} sn.`);
      return {
        success: false,
        user: this.getCurrentUser(),
        error: `Güvenlik Koruması: Çok fazla hatalı deneme yapıldı! Lütfen ${rateLimit.retryAfterSeconds} saniye sonra tekrar deneyiniz.`
      };
    }

    if (!password || password.trim() === '') {
      return {
        success: false,
        user: this.getCurrentUser(),
        error: 'Lütfen yönetici şifrenizi giriniz.'
      };
    }

    const cleanPass = password.trim();
    // One-way SHA-256 cryptographic hashing (no plaintext stored or compared)
    const inputHash = SecurityService.sha256(cleanPass);
    const storedHash = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD_HASH) || INITIAL_ADMIN_HASH;

    if (inputHash !== storedHash) {
      SecurityService.recordFailedAttempt('admin_auth');
      this.logAudit(SUPER_ADMIN_EMAIL, 'AUTH_FAILED', 'Güvenlik', 'Hatalı yönetici şifresi denemesi engellendi.');
      return {
        success: false,
        user: this.getCurrentUser(),
        error: `Hatalı yönetici şifresi! Kalan deneme hakkı: ${Math.max(0, rateLimit.remainingAttempts - 1)}.`
      };
    }

    // Reset rate limit on valid authentication
    SecurityService.resetRateLimit('admin_auth');

    // Create cryptographically signed token
    SecurityService.createAdminSessionToken(SUPER_ADMIN_EMAIL);

    // Set verified admin session
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION_VERIFIED, 'true');
    const adminUser: UserProfile = { ...defaultSuperAdminProfile, isGuest: false, isSuperAdmin: true, role: 'super_admin' };
    this.saveCurrentUser(adminUser);
    
    // Ensure in registered users
    const users = this.getRegisteredUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase());
    if (idx >= 0) {
      users[idx] = { ...adminUser };
    } else {
      users.push(adminUser);
    }
    this.saveRegisteredUsers(users);

    this.logAudit(SUPER_ADMIN_EMAIL, 'SUPER_ADMIN_LOGIN', 'Kimlik Doğrulama', 'Yönetici doğrulamasıyla Super Admin girişi yapıldı.');
    return { success: true, user: adminUser };
  }

  /**
   * Securely update Super Admin password using SHA-256 hashing
   */
  changeAdminPassword(newPassword: string): { success: boolean; error?: string } {
    const val = SecurityService.validatePassword(newPassword);
    if (!val.isValid) {
      return { success: false, error: val.message || 'Geçersiz şifre formatı.' };
    }

    const hashed = SecurityService.sha256(newPassword.trim());
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD_HASH, hashed);
    // Remove any legacy plaintext key
    localStorage.removeItem('uzaktan_turkolog_admin_pwd');

    this.logAudit(
      SUPER_ADMIN_EMAIL,
      'PASSWORD_UPDATE',
      'Güvenlik',
      'Baş yönetici şifresi SHA-256 şifrelemesi ile başarıyla güncellendi.'
    );
    return { success: true };
  }

  /**
   * Logout user, clear admin session verification and revert to guest learner
   */
  logout(): UserProfile {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION_VERIFIED);
    SecurityService.clearAdminSession();
    const guestUser: UserProfile = {
      ...defaultGuestProfile,
      id: 'usr-guest-' + Date.now(),
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };
    this.saveCurrentUser(guestUser);
    this.logAudit('Sistem', 'USER_LOGOUT', 'Kimlik Doğrulama', 'Oturum kapatıldı, misafir durumuna geçildi.');
    return guestUser;
  }

  /**
   * Get list of all registered users
   */
  getRegisteredUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    const defaultList = [defaultSuperAdminProfile];
    this.saveRegisteredUsers(defaultList);
    return defaultList;
  }

  saveRegisteredUsers(users: UserProfile[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
  }

  /**
   * Register with Email, Name, Password & Selected Language Direction
   */
  registerWithEmail(
    email: string, 
    name: string, 
    direction: LanguageDirection, 
    level: CefrLevel = 'A1',
    nickname?: string,
    password?: string
  ): UserProfile {
    const cleanEmail = email.trim();
    const isOwner = cleanEmail.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
    
    if (isOwner) {
      const adminRes = this.loginAsSuperAdmin(password);
      return adminRes.user || defaultSuperAdminProfile;
    }

    // Clear admin verification for regular users
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION_VERIFIED);

    const users = this.getRegisteredUsers();
    
    // Check if user already exists
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail.toLowerCase());
    if (existing) {
      existing.currentDirection = direction;
      existing.currentLevel = level;
      if (nickname) existing.nickname = nickname.trim();
      existing.isSuperAdmin = false;
      existing.role = 'user';
      existing.isGuest = false;
      this.saveCurrentUser(existing);
      this.saveRegisteredUsers(users);
      return existing;
    }

    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      email: cleanEmail,
      name: name.trim() || cleanEmail.split('@')[0],
      nickname: nickname ? nickname.trim() : undefined,
      customTitle: 'Genç Türkolog',
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(nickname || name || cleanEmail)}`,
      role: 'user',
      isSuperAdmin: false,
      isGuest: false,
      currentDirection: direction,
      currentLevel: level,
      dailyGoalMinutes: 15,
      todayCompletedMinutes: 0,
      streakDays: 1,
      xpPoints: 0,
      completedLessonIds: [],
      masteredWordIds: [],
      reviewWordIds: [],
      badges: [initialBadges[0]],
      isPremium: false,
      energy: 100,
      maxEnergy: 100,
      lastEnergyRechargeAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveRegisteredUsers(users);
    this.saveCurrentUser(newUser);
    this.logAudit(cleanEmail, 'USER_REGISTER', 'Kayıt', `${name} (${cleanEmail}) ${direction} yönüyle kayıt oldu.`);
    return newUser;
  }

  /**
   * Login with Email & Target Language Direction & Level
   */
  loginWithEmail(
    email: string, 
    direction?: LanguageDirection, 
    level?: CefrLevel,
    password?: string
  ): { success: boolean; user: UserProfile; error?: string } {
    const cleanEmail = email.trim();
    const isOwner = cleanEmail.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

    if (isOwner) {
      const adminResult = this.loginAsSuperAdmin(password);
      if (!adminResult.success) {
        return adminResult;
      }
      const admin = adminResult.user!;
      if (direction) {
        admin.currentDirection = direction;
      }
      if (level) {
        admin.currentLevel = level;
      }
      this.saveCurrentUser(admin);
      return { success: true, user: admin };
    }

    // Clear admin verification for regular users
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION_VERIFIED);

    const users = this.getRegisteredUsers();
    let user = users.find(u => u.email.toLowerCase() === cleanEmail.toLowerCase());

    if (!user) {
      // Auto register if logging in for first time with this email
      user = this.registerWithEmail(
        cleanEmail, 
        cleanEmail.split('@')[0], 
        direction || 'TR_TO_KZ', 
        level || 'A1', 
        undefined, 
        password
      );
    } else {
      if (direction) user.currentDirection = direction;
      if (level) user.currentLevel = level;
      user.lastActiveAt = new Date().toISOString();
      user.isSuperAdmin = false;
      user.role = 'user';
      user.isGuest = false;
      this.saveCurrentUser(user);

      // Update in registered users list
      const idx = users.findIndex(u => u.id === user!.id);
      if (idx >= 0) {
        users[idx] = { ...user };
        this.saveRegisteredUsers(users);
      }
    }

    this.logAudit(cleanEmail, 'USER_LOGIN', 'Kullanıcı', `${user.nickname || user.name} (${cleanEmail}) giriş yaptı.`);
    return { success: true, user };
  }

  /**
   * Login or Register Regular User (Compatibility wrapper)
   */
  loginOrRegister(email: string, name: string): UserProfile {
    return this.registerWithEmail(email, name, 'TR_TO_KZ', 'A1');
  }

  /**
   * Get Leaderboard for daily, weekly, or monthly period
   * STRICT PRODUCTION: Uses ONLY real registered users, zero fake dummy accounts!
   */
  getLeaderboard(period: LeaderboardPeriod): LeaderboardEntry[] {
    const currentUser = this.getCurrentUser();
    const registeredUsers = this.getRegisteredUsers();

    // Scale multiplier for periods
    const xpMultiplier = period === 'daily' ? 0.25 : period === 'weekly' ? 0.75 : 1.0;

    // Filter out unauthenticated guest accounts
    const realUsers = registeredUsers.filter(u => !u.isGuest && u.email !== 'misafir@uzaktanturkolog.com');

    // Ensure current user is in the list if logged in
    const hasCurrentUser = realUsers.some(
      u => u.id === currentUser.id || u.email.toLowerCase() === currentUser.email.toLowerCase()
    );
    if (!hasCurrentUser && !currentUser.isGuest) {
      realUsers.push(currentUser);
    }

    const entries: LeaderboardEntry[] = realUsers.map(u => {
      const isCur = u.id === currentUser.id || u.email.toLowerCase() === currentUser.email.toLowerCase();
      const userXp = isCur ? currentUser.xpPoints : (u.xpPoints || 0);
      const periodXp = Math.max(0, Math.round(userXp * xpMultiplier));

      return {
        userId: u.id,
        name: u.nickname ? `${u.name} (@${u.nickname})` : u.name,
        email: u.email,
        avatarUrl: u.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(u.name)}`,
        xp: periodXp,
        streak: isCur ? currentUser.streakDays : (u.streakDays || 1),
        level: isCur ? currentUser.currentLevel : (u.currentLevel || 'A1'),
        isCurrentUser: isCur,
        badgeTitle: u.isSuperAdmin ? '👑 Baş Admin' : u.customTitle || '⭐ Öğrenci',
        rank: 1
      };
    });

    // If no registered users yet, include current user if not guest
    if (entries.length === 0 && !currentUser.isGuest) {
      entries.push({
        userId: currentUser.id,
        name: currentUser.nickname ? `${currentUser.name} (@${currentUser.nickname})` : currentUser.name,
        email: currentUser.email,
        avatarUrl: currentUser.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(currentUser.name)}`,
        xp: Math.max(0, Math.round(currentUser.xpPoints * xpMultiplier)),
        streak: currentUser.streakDays,
        level: currentUser.currentLevel,
        isCurrentUser: true,
        badgeTitle: currentUser.isSuperAdmin ? '👑 Baş Admin' : currentUser.customTitle || '⭐ Öğrenci',
        rank: 1
      });
    }

    // Sort by XP descending and set rank
    entries.sort((a, b) => b.xp - a.xp);

    return entries.map((entry, idx) => ({
      ...entry,
      rank: idx + 1
    }));
  }

  /**
   * Get Achievements List with user progress
   */
  getAchievementsProgress() {
    const user = this.getCurrentUser();
    return [
      {
        badge: initialBadges[0], // İlk Adım
        progress: user.completedLessonIds.length,
        max: 1,
        isUnlocked: user.completedLessonIds.length >= 1
      },
      {
        badge: initialBadges[1], // Kelime Avcısı
        progress: user.masteredWordIds.length,
        max: 25,
        isUnlocked: user.masteredWordIds.length >= 25
      },
      {
        badge: initialBadges[2], // Sürekli Öğrenen
        progress: user.streakDays,
        max: 7,
        isUnlocked: user.streakDays >= 7
      },
      {
        badge: initialBadges[3], // Bozkırın Sesi
        progress: user.completedLessonIds.length * 3,
        max: 10,
        isUnlocked: user.completedLessonIds.length >= 3
      },
      {
        badge: initialBadges[4], // Gramer Ustası
        progress: user.completedLessonIds.length >= 2 ? 5 : user.completedLessonIds.length,
        max: 5,
        isUnlocked: user.completedLessonIds.length >= 2
      },
      {
        badge: initialBadges[5], // Türkoloji Bilgini (C1)
        progress: user.currentLevel === 'C1' ? 1 : 0,
        max: 1,
        isUnlocked: user.currentLevel === 'C1'
      }
    ];
  }

  /**
   * Progress Update
   */
  completeLesson(lessonId: string, earnedXp: number): UserProfile {
    const user = this.getCurrentUser();
    if (!user.completedLessonIds.includes(lessonId)) {
      user.completedLessonIds.push(lessonId);
    }
    user.xpPoints += earnedXp;
    user.todayCompletedMinutes += 5;
    this.saveCurrentUser(user);
    return user;
  }

  addXp(earnedXp: number): UserProfile {
    const user = this.getCurrentUser();
    user.xpPoints += earnedXp;
    this.saveCurrentUser(user);
    return user;
  }

  toggleWordMastery(wordId: string, mastered: boolean): UserProfile {
    const user = this.getCurrentUser();
    if (mastered) {
      if (!user.masteredWordIds.includes(wordId)) user.masteredWordIds.push(wordId);
      user.reviewWordIds = user.reviewWordIds.filter(id => id !== wordId);
    } else {
      if (!user.reviewWordIds.includes(wordId)) user.reviewWordIds.push(wordId);
      user.masteredWordIds = user.masteredWordIds.filter(id => id !== wordId);
    }
    this.saveCurrentUser(user);
    return user;
  }

  setLanguageDirection(direction: LanguageDirection): UserProfile {
    const user = this.getCurrentUser();
    user.currentDirection = direction;
    this.saveCurrentUser(user);
    return user;
  }

  setLevel(level: CefrLevel): UserProfile {
    const user = this.getCurrentUser();
    user.currentLevel = level;
    this.saveCurrentUser(user);
    return user;
  }

  /**
   * CURRICULUM CRUD (Super Admin & Editors)
   */
  createUnit(newUnit: Omit<Unit, 'id' | 'version'>): Unit {
    const units = this.getUnits();
    const created: Unit = {
      ...newUnit,
      id: 'unit-' + Date.now(),
      version: 1,
    };
    units.push(created);
    this.saveUnits(units);
    this.logAudit(this.getCurrentUser().email, 'CREATE_UNIT', 'Müfredat', `Yeni ünite oluşturuldu: ${created.titleTr}`);
    return created;
  }

  updateUnit(unitId: string, updates: Partial<Unit>): Unit | null {
    const units = this.getUnits();
    const index = units.findIndex(u => u.id === unitId);
    if (index === -1) return null;
    units[index] = { ...units[index], ...updates, version: units[index].version + 1 };
    this.saveUnits(units);
    this.logAudit(this.getCurrentUser().email, 'UPDATE_UNIT', 'Müfredat', `Ünite güncellendi: ${units[index].titleTr} (v${units[index].version})`);
    return units[index];
  }

  deleteUnit(unitId: string): boolean {
    let units = this.getUnits();
    const target = units.find(u => u.id === unitId);
    units = units.filter(u => u.id !== unitId);
    this.saveUnits(units);
    this.logAudit(this.getCurrentUser().email, 'DELETE_UNIT', 'Müfredat', `Ünite silindi: ${target?.titleTr || unitId}`);
    return true;
  }

  addLessonToUnit(unitId: string, lesson: Omit<Lesson, 'id' | 'unitId'>): Lesson {
    const units = this.getUnits();
    const unit = units.find(u => u.id === unitId);
    if (!unit) throw new Error('Unit not found');
    const newLesson: Lesson = {
      ...lesson,
      id: 'lesson-' + Date.now(),
      unitId,
    };
    unit.lessons.push(newLesson);
    unit.version += 1;
    this.saveUnits(units);
    this.logAudit(this.getCurrentUser().email, 'ADD_LESSON', 'Dersler', `${unit.titleTr} içine yeni ders eklendi: ${newLesson.titleTr}`);
    return newLesson;
  }

  updateLesson(unitId: string, lessonId: string, updates: Partial<Lesson>): Lesson | null {
    const units = this.getUnits();
    const unit = units.find(u => u.id === unitId);
    if (!unit) return null;
    const lIndex = unit.lessons.findIndex(l => l.id === lessonId);
    if (lIndex === -1) return null;
    unit.lessons[lIndex] = { ...unit.lessons[lIndex], ...updates };
    unit.version += 1;
    this.saveUnits(units);
    this.logAudit(this.getCurrentUser().email, 'UPDATE_LESSON', 'Dersler', `Ders güncellendi: ${unit.lessons[lIndex].titleTr}`);
    return unit.lessons[lIndex];
  }

  deleteLesson(unitId: string, lessonId: string): boolean {
    const units = this.getUnits();
    const unit = units.find(u => u.id === unitId);
    if (!unit) return false;
    unit.lessons = unit.lessons.filter(l => l.id !== lessonId);
    unit.version += 1;
    this.saveUnits(units);
    this.logAudit(this.getCurrentUser().email, 'DELETE_LESSON', 'Dersler', `Ders silindi: ${lessonId}`);
    return true;
  }

  /**
   * VOCABULARY CRUD (Global word editor across all units)
   */
  getAllVocabulary(): VocabItem[] {
    const units = this.getUnits();
    const map = new Map<string, VocabItem>();
    units.forEach(u => {
      u.lessons.forEach(l => {
        l.vocabulary.forEach(v => map.set(v.id, v));
      });
    });
    return Array.from(map.values());
  }

  updateVocabEverywhere(vocabId: string, updatedWord: Partial<VocabItem>): void {
    const units = this.getUnits();
    let updatedCount = 0;
    units.forEach(u => {
      u.lessons.forEach(l => {
        l.vocabulary = l.vocabulary.map(v => {
          if (v.id === vocabId) {
            updatedCount++;
            return { ...v, ...updatedWord };
          }
          return v;
        });
      });
    });
    this.saveUnits(units);
    this.logAudit(this.getCurrentUser().email, 'UPDATE_VOCAB', 'Sözlük', `Kelime güncellendi: ${updatedWord.kazakhCyrillic || vocabId} (${updatedCount} derste güncellendi)`);
  }

  addWordToLesson(unitId: string, lessonId: string, word: Omit<VocabItem, 'id'>): VocabItem {
    const units = this.getUnits();
    const unit = units.find(u => u.id === unitId);
    const lesson = unit?.lessons.find(l => l.id === lessonId);
    if (!lesson) throw new Error('Lesson not found');
    const newWord: VocabItem = {
      ...word,
      id: 'v-' + Date.now()
    };
    lesson.vocabulary.push(newWord);
    this.saveUnits(units);
    this.logAudit(this.getCurrentUser().email, 'ADD_VOCAB', 'Sözlük', `Derse kelime eklendi: ${newWord.kazakhCyrillic}`);
    return newWord;
  }

  addExerciseToLesson(unitId: string, lessonId: string, exercise: Omit<ExerciseItem, 'id'>): ExerciseItem {
    const units = this.getUnits();
    const unit = units.find(u => u.id === unitId);
    const lesson = unit?.lessons.find(l => l.id === lessonId);
    if (!lesson) throw new Error('Lesson not found');
    const newEx: ExerciseItem = {
      ...exercise,
      id: 'ex-' + Date.now()
    };
    lesson.exercises.push(newEx);
    this.saveUnits(units);
    this.logAudit(this.getCurrentUser().email, 'ADD_EXERCISE', 'Alıştırmalar', `Yeni alıştırma eklendi: ${newEx.questionTr}`);
    return newEx;
  }

  /**
   * Delete word completely from all lessons
   */
  deleteWordEverywhere(vocabId: string): boolean {
    const units = this.getUnits();
    let deletedCount = 0;
    units.forEach(u => {
      u.lessons.forEach(l => {
        const initialLen = l.vocabulary.length;
        l.vocabulary = l.vocabulary.filter(v => v.id !== vocabId);
        if (l.vocabulary.length < initialLen) deletedCount++;
      });
    });
    this.saveUnits(units);
    this.logAudit(this.getCurrentUser().email, 'DELETE_VOCAB', 'Sözlük', `Kelime ${vocabId} silindi (${deletedCount} dersten kaldırıldı).`);
    return deletedCount > 0;
  }

  /**
   * USER & ACCESS MANAGEMENT (Super Admin only)
   */
  updateUserRole(userId: string, role: 'user' | 'admin' | 'super_admin'): boolean {
    const users = this.getRegisteredUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return false;
    user.role = role;
    if (role === 'super_admin') {
      user.isSuperAdmin = true;
    } else {
      user.isSuperAdmin = false;
    }
    this.saveRegisteredUsers(users);
    this.logAudit(this.getCurrentUser().email, 'UPDATE_USER_ROLE', 'Kullanıcılar', `${user.name} (${user.email}) rolü "${role}" olarak güncellendi.`);
    return true;
  }

  deleteUser(userId: string): boolean {
    let users = this.getRegisteredUsers();
    const target = users.find(u => u.id === userId);
    if (!target) return false;
    if (target.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      throw new Error('Baş Yönetici hesabı silinemez!');
    }
    users = users.filter(u => u.id !== userId);
    this.saveRegisteredUsers(users);
    this.logAudit(this.getCurrentUser().email, 'DELETE_USER', 'Kullanıcılar', `Kullanıcı silindi: ${target.name} (${target.email})`);
    return true;
  }

  /**
   * Apple App Store Guideline 5.1.1(v) Compliant Account Deletion
   * Deletes user's account and personal data from device upon user request
   */
  deleteAccount(userId: string): UserProfile {
    let users = this.getRegisteredUsers();
    const target = users.find(u => u.id === userId);
    if (target && target.email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
      users = users.filter(u => u.id !== userId);
      this.saveRegisteredUsers(users);
      this.logAudit(target.email, 'ACCOUNT_DELETED', 'Hesap', `${target.name} hesabını ve verilerini kalıcı olarak sildi.`);
    }
    return this.logout();
  }

  /**
   * Import Database from JSON Backup
   */
  importDatabaseJson(jsonData: any): { success: boolean; message: string } {
    try {
      if (!jsonData || typeof jsonData !== 'object') {
        return { success: false, message: 'Geçersiz JSON dosyası formatı!' };
      }
      if (Array.isArray(jsonData.units) && jsonData.units.length > 0) {
        this.saveUnits(jsonData.units);
      }
      if (Array.isArray(jsonData.tickets)) {
        this.saveErrorTickets(jsonData.tickets);
      }
      if (jsonData.appConfig) {
        this.saveAppConfig(jsonData.appConfig);
      }
      this.logAudit(this.getCurrentUser().email, 'RESTORE_DATABASE', 'Veritabanı', 'JSON yedeği başarıyla geri yüklendi.');
      return { success: true, message: 'Veritabanı yedeği başarıyla geri yüklendi ve müfredat güncellendi!' };
    } catch (err: any) {
      return { success: false, message: 'Yedek yükleme başarısız oldu: ' + (err?.message || 'Bilinmeyen hata') };
    }
  }

  /**
   * Reset curriculum to factory default (17 units, 34 lessons)
   */
  resetCurriculumToInitial(): Unit[] {
    this.saveUnits(initialUnits);
    this.logAudit(this.getCurrentUser().email, 'RESET_CURRICULUM', 'Müfredat', 'Tüm müfredat fabrika çıkışı 17 üniteye sıfırlandı.');
    return initialUnits;
  }

  /**
   * TRANSLATION ERROR TICKETS (Kullanıcı Çeviri Hata Bildirimleri)
   * Production: Starts completely clean, records real user reports
   */
  getErrorTickets(): TranslationErrorTicket[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ERROR_TICKETS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    const empty: TranslationErrorTicket[] = [];
    this.saveErrorTickets(empty);
    return empty;
  }

  saveErrorTickets(tickets: TranslationErrorTicket[]): void {
    localStorage.setItem(STORAGE_KEYS.ERROR_TICKETS, JSON.stringify(tickets));
  }

  submitErrorTicket(ticket: Omit<TranslationErrorTicket, 'id' | 'status' | 'createdAt'>): TranslationErrorTicket {
    const tickets = this.getErrorTickets();
    const created: TranslationErrorTicket = {
      ...ticket,
      id: 'ticket-' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    tickets.unshift(created);
    this.saveErrorTickets(tickets);
    return created;
  }

  resolveErrorTicket(ticketId: string, status: 'resolved' | 'rejected', adminNote?: string): void {
    const tickets = this.getErrorTickets();
    const target = tickets.find(t => t.id === ticketId);
    if (target) {
      target.status = status;
      target.resolvedAt = new Date().toISOString();
      if (adminNote) target.adminNote = adminNote;
      this.saveErrorTickets(tickets);
      this.logAudit(this.getCurrentUser().email, 'RESOLVE_TICKET', 'Destek', `Hata talebi #${ticketId} durumu: ${status}`);
    }
  }

  /**
   * AUDIT LOGS
   */
  getAuditLogs(): AuditLogItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    const initialLogs: AuditLogItem[] = [
      {
        id: 'log-1',
        timestamp: '2026-10-10T09:00:00.000Z',
        userEmail: SUPER_ADMIN_EMAIL,
        action: 'SYSTEM_INIT',
        module: 'Sistem',
        details: 'Uzaktan Türkolog sistemi Super Admin yetkisiyle başlatıldı.'
      }
    ];
    this.saveAuditLogs(initialLogs);
    return initialLogs;
  }

  saveAuditLogs(logs: AuditLogItem[]): void {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 300)));
  }

  logAudit(userEmail: string, action: string, module: string, details: string): void {
    const logs = this.getAuditLogs();
    logs.unshift({
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      userEmail,
      action,
      module,
      details
    });
    this.saveAuditLogs(logs);
  }

  /**
   * FORUM & COMMUNITY SYSTEM (Kullanıcı Forum & Paylaşım Alanı)
   * Production Release: Clean state with real user discussion topics only
   */
  getForumPosts(): ForumPost[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FORUM_POSTS);
      if (data) {
        return JSON.parse(data) as ForumPost[];
      }
    } catch {
      // ignore
    }

    const emptyPosts: ForumPost[] = [];
    this.saveForumPosts(emptyPosts);
    return emptyPosts;
  }

  saveForumPosts(posts: ForumPost[]): void {
    localStorage.setItem(STORAGE_KEYS.FORUM_POSTS, JSON.stringify(posts));
  }

  createForumPost(postData: Omit<ForumPost, 'id' | 'createdAt' | 'likesCount' | 'comments' | 'viewsCount'>): ForumPost {
    const posts = this.getForumPosts();
    const newPost: ForumPost = {
      ...postData,
      id: 'post-' + Date.now(),
      createdAt: new Date().toISOString(),
      likesCount: 1, // Author automatic upvote
      likedByCurrentUser: true,
      comments: [],
      viewsCount: 1,
      pinned: postData.isSuperAdmin ? (postData.pinned || false) : false
    };

    posts.unshift(newPost);
    this.saveForumPosts(posts);

    this.logAudit(
      postData.authorName, 
      'CREATE_FORUM_POST', 
      'Forum', 
      `Yeni forum konusu açıldı: "${newPost.title}" (${newPost.category})`
    );

    return newPost;
  }

  addPostComment(postId: string, commentData: Omit<ForumComment, 'id' | 'createdAt' | 'likesCount'>): ForumComment {
    const posts = this.getForumPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');

    const newComment: ForumComment = {
      ...commentData,
      id: 'comm-' + Date.now(),
      createdAt: new Date().toISOString(),
      likesCount: 1,
      likedByCurrentUser: true
    };

    post.comments.push(newComment);
    this.saveForumPosts(posts);

    this.logAudit(
      commentData.authorName,
      'ADD_FORUM_COMMENT',
      'Forum',
      `Konuya yorum yapıldı: "${post.title}"`
    );

    return newComment;
  }

  togglePostLike(postId: string): ForumPost | undefined {
    const posts = this.getForumPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return undefined;

    if (post.likedByCurrentUser) {
      post.likesCount = Math.max(0, post.likesCount - 1);
      post.likedByCurrentUser = false;
    } else {
      post.likesCount += 1;
      post.likedByCurrentUser = true;
    }

    this.saveForumPosts(posts);
    return post;
  }

  toggleCommentLike(postId: string, commentId: string): void {
    const posts = this.getForumPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) return;

    if (comment.likedByCurrentUser) {
      comment.likesCount = Math.max(0, comment.likesCount - 1);
      comment.likedByCurrentUser = false;
    } else {
      comment.likesCount += 1;
      comment.likedByCurrentUser = true;
    }

    this.saveForumPosts(posts);
  }

  toggleBookmarkPost(postId: string): boolean {
    const posts = this.getForumPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return false;

    post.isBookmarked = !post.isBookmarked;
    this.saveForumPosts(posts);
    return post.isBookmarked;
  }

  deleteForumPost(postId: string): void {
    const posts = this.getForumPosts().filter(p => p.id !== postId);
    this.saveForumPosts(posts);
  }

  /**
   * APP CONFIG & RELEASE
   */
  getAppConfig(): AppReleaseMetadata {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APP_CONFIG);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    this.saveAppConfig(defaultAppConfig);
    return defaultAppConfig;
  }

  saveAppConfig(config: AppReleaseMetadata): void {
    localStorage.setItem(STORAGE_KEYS.APP_CONFIG, JSON.stringify(config));
    this.logAudit(this.getCurrentUser().email, 'UPDATE_CONFIG', 'Yayınlama', 'Uygulama mağaza ayarları güncellendi.');
  }

  /**
   * RESET TO INITIAL DATA
   */
  resetAllData(): void {
    localStorage.clear();
    this.saveUnits(initialUnits);
    this.saveCurrentUser(defaultSuperAdminProfile);
    this.saveAppConfig(defaultAppConfig);
  }
}

export const storageService = new StorageService();
