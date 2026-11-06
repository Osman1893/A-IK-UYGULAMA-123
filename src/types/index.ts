/**
 * Uzaktan Türkolog - Core Types Definition
 * Bi-directional Turkish-Kazakh Learning Platform
 */

export type LanguageDirection = 'TR_TO_KZ' | 'KZ_TO_TR' | 'BOTH';
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export type UserRole = 
  | 'super_admin' 
  | 'admin' 
  | 'content_editor' 
  | 'reviewer' 
  | 'support' 
  | 'user';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  nickname?: string; // Kullanıcının seçtiği lakap / rumuz
  bio?: string; // Kullanıcı biyografisi / hakkında
  customTitle?: string; // Özel unvan / rütbe (örn. Genç Türkolog, Bozkır Kartalı)
  targetGoal?: string; // Öğrenme hedefi
  themeColor?: string; // Tercih edilen tema vurgusu
  avatarUrl?: string;
  role: UserRole;
  isSuperAdmin: boolean;
  isGuest?: boolean; // Misafir / Oturum açmamış kullanıcı bayrağı
  currentDirection: LanguageDirection;
  currentLevel: CefrLevel;
  dailyGoalMinutes: number;
  todayCompletedMinutes: number;
  dailyGoalType?: 'xp' | 'minutes'; // 'xp' (XP bazlı) veya 'minutes' (dakika bazlı) hedef
  dailyXpTarget?: number; // Günlük hedeflenen XP puanı (varsayılan: 50 XP)
  todayEarnedXp?: number; // Bugün kazanılan XP puanı
  weeklyGoalDays?: number; // Haftalık hedeflenen aktif öğrenme gün sayısı (varsayılan: 5 gün)
  weeklyCompletedDays?: number; // Bu hafta tamamlanan gün sayısı
  weeklyGoalType?: 'days' | 'xp' | 'lessons'; // Haftalık hedef türü
  weeklyXpTarget?: number; // Haftalık hedeflenen toplam XP puanı (varsayılan: 250 XP)
  weeklyLessonsTarget?: number; // Haftalık hedeflenen tamamlanacak ders sayısı (varsayılan: 5 ders)
  notificationsEnabled?: boolean; // Günlük hedef & hatırlatıcı bildirimleri açık mı?
  reminderTime?: string; // Hatırlatıcı saati (örn: "20:00")
  streakDays: number;
  xpPoints: number;
  completedLessonIds: string[];
  masteredWordIds: string[];
  reviewWordIds: string[];
  favoriteWordIds?: string[]; // Kullanıcının zorlandığı ve yıldızladığı 'Favori Kelimelerim' listesi
  streakShields?: number; // Seri Kalkanı / Dondurucu sayısı (Örn: 1 veya 2 kalkan)
  audioSpeed?: 0.75 | 1.0; // Telaffuz ses hızı (0.75 yavaş / 1.0 normal)
  dailyQuests?: DailyQuestItem[]; // Günlük 3 Görev listesi ve ilerleme durumları
  lastDailyQuestDate?: string; // Günlük görevlerin oluşturulduğu tarih
  badges: UserBadge[];
  isPremium: boolean;
  energy: number; // Günlük enerji (0-100)
  maxEnergy: number; // Maksimum enerji (100)
  lastEnergyRechargeAt: string; // Son 8 saatlik enerji yenilenme zamanı
  createdAt: string;
  lastActiveAt: string;
}

export interface DailyQuestItem {
  id: string;
  type: 'lesson' | 'vocab' | 'game' | 'speak';
  titleTr: string;
  titleKz: string;
  descriptionTr: string;
  descriptionKz: string;
  icon: string;
  progress: number;
  target: number;
  unit: string;
  xpReward: number;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface SuffixSegment {
  text: string;
  type: 'root' | 'plural' | 'possessive' | 'case' | 'tense' | 'person' | 'derivational';
  nameTr: string;
  nameKz: string;
  turkishEquivalent: string;
  explanationTr: string;
  explanationKz: string;
}

export interface SuffixAnalysisResult {
  originalWord: string;
  rootWord: string;
  rootMeaningTr: string;
  rootMeaningKz: string;
  segments: SuffixSegment[];
  comparativeTurkish: string;
  grammaticalSummaryTr: string;
  grammaticalSummaryKz: string;
}

export interface UserBadge {
  id: string;
  titleTr: string;
  titleKz: string;
  descriptionTr: string;
  descriptionKz: string;
  icon: string;
  unlockedAt: string;
  category?: 'streak' | 'xp' | 'lesson' | 'vocab' | 'academic';
  tier?: 'bronze' | 'silver' | 'gold' | 'diamond';
  xpReward?: number;
}

export interface Unit {
  id: string;
  unitNumber: number;
  level: CefrLevel;
  direction: LanguageDirection;
  titleTr: string;
  titleKz: string;
  descriptionTr: string;
  descriptionKz: string;
  icon: string;
  isPublished: boolean;
  version: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  unitId: string;
  lessonNumber: number;
  titleTr: string;
  titleKz: string;
  summaryTr: string;
  summaryKz: string;
  learningObjectivesTr: string[];
  learningObjectivesKz: string[];
  vocabulary: VocabItem[];
  grammar: GrammarSection;
  dialogue: DialogueScript;
  exercises: ExerciseItem[];
  isPublished: boolean;
  isPremiumOnly?: boolean;
}

export interface VocabItem {
  id: string;
  kazakhCyrillic: string;
  kazakhLatin: string;
  turkish: string;
  phoneticGuide: string;
  partOfSpeech: 'noun' | 'verb' | 'adj' | 'adverb' | 'phrase' | 'number';
  exampleKazakh: string;
  exampleTurkish: string;
  category: string;
  falseFriendWarning?: string; // Yalancı eşdeğerlik uyarısı
  imageUrl?: string;
  audioUrl?: string;
}

export interface GrammarSection {
  titleTr: string;
  titleKz: string;
  explanationTr: string;
  explanationKz: string;
  rules: GrammarRule[];
  examples: GrammarExample[];
  commonMistakes: CommonMistake[];
}

export interface GrammarRule {
  id: string;
  titleTr: string;
  titleKz: string;
  trPattern: string;
  kzPattern: string;
  explanationTr: string;
  explanationKz: string;
}

export interface GrammarExample {
  kazakh: string;
  turkish: string;
  breakdown: string;
}

export interface CommonMistake {
  incorrect: string;
  correct: string;
  reasonTr: string;
  reasonKz: string;
}

export interface DialogueLine {
  id: string;
  speaker: string;
  avatar: string;
  kazakh: string;
  turkish: string;
  audioTimestamp?: number;
}

export interface DialogueScript {
  id: string;
  titleTr: string;
  titleKz: string;
  contextTr: string;
  contextKz: string;
  lines: DialogueLine[];
}

export type ExerciseType = 
  | 'image_choice'
  | 'multiple_choice' 
  | 'listening_choice' 
  | 'sentence_order' 
  | 'fill_blank' 
  | 'speaking_pronunciation' 
  | 'matching';

export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  email: string;
  avatarUrl: string;
  xp: number;
  streak: number;
  level: CefrLevel;
  isCurrentUser: boolean;
  badgeTitle: string;
}

export interface ExerciseItem {
  id: string;
  type: ExerciseType;
  questionTr: string;
  questionKz: string;
  audioPromptText?: string;
  audioPromptLang?: 'kk' | 'tr';
  options?: string[];
  correctAnswer: string | string[];
  explanationTr: string;
  explanationKz: string;
  points: number;
  imageUrl?: string;
  pairs?: { left: string; right: string }[];
}

export interface TranslationErrorTicket {
  id: string;
  reportedByEmail: string;
  reportedByName: string;
  wordOrPhrase: string;
  currentTranslation: string;
  suggestedCorrection: string;
  explanation: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'rejected';
  createdAt: string;
  resolvedAt?: string;
  adminNote?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userEmail: string;
  action: string;
  module: string;
  details: string;
}

export interface AppReleaseMetadata {
  appName: string;
  packageNameAndroid: string;
  bundleIdIos: string;
  versionName: string;
  versionCode: number;
  targetSdkAndroid: number;
  minSdkAndroid: number;
  iosDeploymentTarget: string;
  privacyPolicyUrl: string;
  supportEmail: string;
  shortDescriptionTr: string;
  shortDescriptionKz: string;
  fullDescriptionTr: string;
  fullDescriptionKz: string;
}
