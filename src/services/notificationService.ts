/**
 * Uzaktan Türkolog - Daily Goal Notification Service
 * Handles Web Notifications API, in-app motivational toasts, and milestone achievements (50%, 80%, 100%)
 */

export interface GoalMilestoneEvent {
  milestone: 50 | 80 | 100;
  type: 'xp' | 'minutes';
  current: number;
  target: number;
  title: string;
  message: string;
  timestamp: number;
}

type NotificationListener = (event: GoalMilestoneEvent) => void;

class NotificationService {
  private listeners: Set<NotificationListener> = new Set();
  private lastNotifiedKey = 'uzaktan_turkolog_goal_milestones';

  constructor() {
    this.cleanOldMilestoneRecords();
  }

  /**
   * Request permission for Web Notifications API
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    try {
      return await Notification.requestPermission();
    } catch {
      return 'denied';
    }
  }

  /**
   * Check current notification permission status
   */
  getPermission(): NotificationPermission {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  /**
   * Subscribe to in-app goal milestone events
   */
  onMilestone(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Check if milestone should trigger based on current progress
   */
  checkProgressMilestone(
    current: number,
    target: number,
    type: 'xp' | 'minutes' = 'xp',
    enabled: boolean = true
  ): GoalMilestoneEvent | null {
    if (!enabled || target <= 0) return null;

    const percent = Math.round((current / target) * 100);
    const today = new Date().toISOString().split('T')[0];
    const key = `${today}_${type}`;
    const recorded = this.getRecordedMilestones(key);

    let reachedMilestone: 50 | 80 | 100 | null = null;
    if (percent >= 100 && !recorded.includes(100)) {
      reachedMilestone = 100;
    } else if (percent >= 80 && !recorded.includes(80)) {
      reachedMilestone = 80;
    } else if (percent >= 50 && !recorded.includes(50)) {
      reachedMilestone = 50;
    }

    if (!reachedMilestone) return null;

    // Record milestone to avoid duplicates on the same day
    recorded.push(reachedMilestone);
    this.saveRecordedMilestones(key, recorded);

    const unitLabel = type === 'xp' ? 'XP' : 'Dakika';
    let title = '';
    let message = '';

    if (reachedMilestone === 100) {
      title = '🏆 Günlük Hedef Tamamlandı!';
      message = `Tebrikler! Bugünkü ${target} ${unitLabel} hedefinize ulaştınız. Serinizi korudunuz!`;
    } else if (reachedMilestone === 80) {
      title = '🔥 Hedefe Çok Yaklaştın!';
      message = `Harika gidiyorsun! ${current}/${target} ${unitLabel} tamamlandı (%80). Son bir gayret!`;
    } else {
      title = '🎯 Yarı Yol Aşıldı!';
      message = `Tebrikler! Günlük ${unitLabel} hedefinin %50'sini tamamladın (${current}/${target}).`;
    }

    const event: GoalMilestoneEvent = {
      milestone: reachedMilestone,
      type,
      current,
      target,
      title,
      message,
      timestamp: Date.now()
    };

    // Trigger in-app listeners
    this.listeners.forEach(fn => fn(event));

    // Trigger browser notification if granted
    this.sendBrowserNotification(title, message);

    return event;
  }

  /**
   * Send Native Browser Notification if permitted
   */
  sendBrowserNotification(title: string, body: string) {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=UzaktanTurkolog&backgroundColor=7c3aed',
          badge: 'https://api.dicebear.com/7.x/identicon/svg?seed=UzaktanTurkolog&backgroundColor=7c3aed'
        });
      } catch {
        // Notification instantiation silently ignored if restricted by OS/sandbox
      }
    }
  }

  /**
   * Trigger instant test notification for settings verification
   */
  triggerTestNotification(type: 'xp' | 'minutes', target: number): GoalMilestoneEvent {
    const unit = type === 'xp' ? 'XP' : 'Dakika';
    const event: GoalMilestoneEvent = {
      milestone: 100,
      type,
      current: target,
      target,
      title: '🔔 Bildirim Mekanizması Aktif!',
      message: `Günlük ${target} ${unit} hedefiniz için hatırlatıcılar ve ilerleme bildirimleri başarıyla kuruldu.`,
      timestamp: Date.now()
    };

    this.listeners.forEach(fn => fn(event));
    this.sendBrowserNotification(event.title, event.message);
    return event;
  }

  // ==========================================
  // DERS HATIRLATICI (DAILY STUDY REMINDER)
  // ==========================================
  private reminderListeners: Set<(event: DailyReminderEvent) => void> = new Set();
  private reminderIntervalId: any = null;
  private lastReminderDateKey = 'uzaktan_turkolog_last_daily_reminder_date';

  /**
   * Subscribe to in-app Daily Study Reminder notifications
   */
  onDailyReminder(listener: (event: DailyReminderEvent) => void): () => void {
    this.reminderListeners.add(listener);
    return () => {
      this.reminderListeners.delete(listener);
    };
  }

  /**
   * Start periodic timer checking for daily study reminder hour
   */
  startDailyReminderScheduler(
    getSettings: () => { enabled: boolean; reminderTime: string; streakDays?: number; targetXp?: number }
  ) {
    if (this.reminderIntervalId) {
      clearInterval(this.reminderIntervalId);
    }

    // Check immediately and then every 30 seconds
    const performCheck = () => {
      try {
        const settings = getSettings();
        if (!settings.enabled || !settings.reminderTime) return;

        const now = new Date();
        const currentHours = String(now.getHours()).padStart(2, '0');
        const currentMinutes = String(now.getMinutes()).padStart(2, '0');
        const currentTime = `${currentHours}:${currentMinutes}`;

        // Compare target time
        if (currentTime === settings.reminderTime) {
          const today = now.toISOString().split('T')[0];
          const lastFired = localStorage.getItem(this.lastReminderDateKey);

          if (lastFired !== today) {
            localStorage.setItem(this.lastReminderDateKey, today);

            const streak = settings.streakDays || 1;
            const title = '⏰ Günlük Kazakça Çalışma Vakti!';
            const message = `Bugünkü dersinizi tamamlayıp ${streak} günlük serinizi korumak için şimdi 10 dakikanızı ayırın!`;

            const event: DailyReminderEvent = {
              title,
              message,
              scheduledTime: settings.reminderTime,
              timestamp: Date.now()
            };

            this.reminderListeners.forEach(fn => fn(event));
            this.sendBrowserNotification(title, message);
          }
        }
      } catch {
        // Scheduler resilient execution
      }
    };

    performCheck();
    this.reminderIntervalId = setInterval(performCheck, 30000);
  }

  /**
   * Stop reminder scheduler
   */
  stopDailyReminderScheduler() {
    if (this.reminderIntervalId) {
      clearInterval(this.reminderIntervalId);
      this.reminderIntervalId = null;
    }
  }

  /**
   * Instantly trigger a test daily study reminder
   */
  triggerStudyReminderTest(reminderTime: string = '20:00', streakDays: number = 7): DailyReminderEvent {
    const title = '⏰ Ders Hatırlatıcı: Çalışma Vaktiniz Geldi!';
    const message = `Saat ${reminderTime} oldu. ${streakDays} günlük serinizi bozmamak ve günlük hedefinize ulaşmak için bugün bir Kazakça dersi tamamlayın!`;

    const event: DailyReminderEvent = {
      title,
      message,
      scheduledTime: reminderTime,
      timestamp: Date.now()
    };

    this.reminderListeners.forEach(fn => fn(event));
    this.sendBrowserNotification(title, message);
    return event;
  }

  private getRecordedMilestones(key: string): number[] {
    try {
      const raw = localStorage.getItem(`${this.lastNotifiedKey}_${key}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveRecordedMilestones(key: string, milestones: number[]) {
    try {
      localStorage.setItem(`${this.lastNotifiedKey}_${key}`, JSON.stringify(milestones));
    } catch {
      // storage unavailable
    }
  }

  private cleanOldMilestoneRecords() {
    if (typeof localStorage === 'undefined') return;
    try {
      const today = new Date().toISOString().split('T')[0];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(this.lastNotifiedKey) && !k.includes(today)) {
          localStorage.removeItem(k);
        }
      }
    } catch {
      // ignore
    }
  }
}

export interface DailyReminderEvent {
  title: string;
  message: string;
  scheduledTime: string;
  timestamp: number;
}

export const notificationService = new NotificationService();
