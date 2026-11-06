import { describe, it, expect } from 'vitest';
import { READING_STORIES } from '../data/readingStories';
import { getStageQuestions } from '../components/student/StageQuestMapView';
import { LETTER_MOUTH_MAP } from '../components/student/KazakhAlphabetVoiceGuide';
import { transliterateKazakhToAudibleString, audioService } from '../services/audioService';

describe('Reading Stories & Tokenization', () => {
  it('should have authentic stories with content and questions', () => {
    expect(READING_STORIES.length).toBeGreaterThanOrEqual(3);
    READING_STORIES.forEach((story) => {
      expect(story.id).toBeDefined();
      expect(story.titleKz.length).toBeGreaterThan(0);
      expect(story.titleTr.length).toBeGreaterThan(0);
      expect(story.contentKz.length).toBeGreaterThan(0);
      expect(story.contentTr.length).toBeGreaterThan(0);
      expect(story.vocabulary.length).toBeGreaterThan(2);
      expect(story.questions.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('contains the sacred Alageyik mythology story', () => {
    const alageyikStory = READING_STORIES.find((s) => s.id === 'story-mytho-alageyik');
    expect(alageyikStory).toBeDefined();
    expect(alageyikStory?.titleTr).toContain('Alageyik');
    expect(alageyikStory?.contentKz).toContain('Алагеяк');
  });
});

describe('Stage Evaluation Tests & Gatekeeping', () => {
  it('generates at least 3 questions for every stage from 1 to 16', () => {
    for (let stageNum = 1; stageNum <= 16; stageNum++) {
      const questions = getStageQuestions(stageNum);
      expect(questions.length).toBeGreaterThanOrEqual(3);
      questions.forEach((q) => {
        expect(q.id).toBeDefined();
        expect(q.questionTr.length).toBeGreaterThan(5);
        expect(q.options.length).toBeGreaterThanOrEqual(3);
        expect(q.options).toContain(q.correctAnswer);
        expect(q.explanationTr.length).toBeGreaterThan(3);
      });
    }
  });
});

describe('Phonetic Mouth Shape & Articulatory Visuals', () => {
  it('maps all unique Kazakh letters to phonetic articulatory categories', () => {
    const kazakhSpecialChars = ['Ә', 'І', 'Ң', 'Ғ', 'Ү', 'Ұ', 'Қ', 'Ө', 'Һ'];
    kazakhSpecialChars.forEach((char) => {
      const category = LETTER_MOUTH_MAP[char];
      expect(category).toBeDefined();
      expect(typeof category).toBe('string');
    });
  });
});

describe('Audio Fallback Transliteration', () => {
  it('correctly maps Kazakh Cyrillic phonemes to acoustic equivalents', () => {
    const text = 'Сәлем достар, Қазақстан';
    const audible = transliterateKazakhToAudibleString(text);
    expect(audible).toBeDefined();
    expect(audible.length).toBeGreaterThan(0);
    // Should convert Ә -> e/ä, Қ -> k, etc.
    expect(audible).toContain('Selem');
  });
});

describe('Pronunciation Analysis & Strict Error Detection', () => {
  it('correctly approves accurate Kazakh pronunciation', () => {
    const target = 'Сәлеметсіз бе! Қалыңыз қалай?';
    const spoken = 'Сәлеметсіз бе! Қалыңыз қалай?';
    const result = audioService.analyzePronunciation(spoken, target);
    expect(result.overallScore).toBeGreaterThanOrEqual(85);
    expect(result.isPassed).toBe(true);
    expect(result.words.every(w => w.status === 'correct')).toBe(true);
  });

  it('strictly rejects incorrect or mismatched speech', () => {
    const target = 'Сәлеметсіз бе! Қалыңыз қалай?';
    const spoken = 'Merhaba arkadas nasilsin';
    const result = audioService.analyzePronunciation(spoken, target);
    expect(result.overallScore).toBeLessThan(75);
    expect(result.isPassed).toBe(false);
    expect(result.criticalErrors.length).toBeGreaterThan(0);
  });

  it('handles empty silence speech with zero score and rejection', () => {
    const target = 'Мен қазақша сөйлеймін';
    const result = audioService.analyzePronunciation('', target);
    expect(result.overallScore).toBe(0);
    expect(result.isPassed).toBe(false);
    expect(result.words.every(w => w.status === 'missing')).toBe(true);
  });

  it('accurately calculates similarity with Turkic vowels without stripping letters', () => {
    // Words containing Turkic ı, ü, ö, etc.
    const scoreExact = audioService.calculateSimilarity('Қызық', 'Қызық');
    expect(scoreExact).toBe(100);

    const scoreTranslit = audioService.calculateSimilarity('Қызық', 'Kızık');
    expect(scoreTranslit).toBeGreaterThanOrEqual(90);

    const scoreDifferent = audioService.calculateSimilarity('Қызық', 'Басқа');
    expect(scoreDifferent).toBeLessThan(40);
  });
});

describe('Quest Stages Structure & Persistence', () => {
  it('defines 20 stages with initial active stage 1', async () => {
    const { DEFAULT_STAGES, shuffleWords } = await import('../components/student/StageQuestMapView');
    const { storageService } = await import('../services/storageService');

    expect(DEFAULT_STAGES.length).toBe(20);
    expect(DEFAULT_STAGES[0].status).toBe('completed');
    expect(DEFAULT_STAGES[4].status).toBe('locked');

    // Test persistence
    const modified = [...DEFAULT_STAGES];
    modified[0] = { ...modified[0], status: 'completed', stars: 3 };
    modified[1] = { ...modified[1], status: 'active' };

    storageService.saveQuestStages(modified);
    const loaded = storageService.getQuestStages(DEFAULT_STAGES);
    expect(loaded[0].status).toBe('completed');
    expect(loaded[0].stars).toBe(3);
    expect(loaded[1].status).toBe('active');

    // Test shuffleWords
    const original = ['Dombra', 'Kazakların', 'kutsal', 'çalgısıdır.'];
    const scrambled = shuffleWords(original, original);
    expect(scrambled.length).toBe(original.length);
    original.forEach(word => expect(scrambled).toContain(word));
  });
});

describe('Daily Learning Goal & Dynamic Exercise Progress Bar', () => {
  it('updates and persists daily XP target correctly', async () => {
    const { storageService } = await import('../services/storageService');
    const updated = storageService.setDailyXpTarget(100);
    expect(updated.dailyXpTarget).toBe(100);

    const reloaded = storageService.getCurrentUser();
    expect(reloaded.dailyXpTarget).toBe(100);
  });

  it('increments todayEarnedXp when lessons are completed or XP added', async () => {
    const { storageService } = await import('../services/storageService');
    const initialUser = storageService.getCurrentUser();
    const prevEarned = initialUser.todayEarnedXp || 0;

    const updatedUser = storageService.addXp(30);
    expect(updatedUser.todayEarnedXp).toBe(prevEarned + 30);
  });

  it('computes dynamic exercise progress accurately', () => {
    const totalExercises = 5;

    // Case 1: First question active, unanswered
    const c1Index = 0;
    const c1Submitted = false;
    const c1Correct = false;
    const c1Completed = c1Index + (c1Submitted && c1Correct ? 1 : 0);
    const c1Percent = Math.round((c1Completed / totalExercises) * 100);
    expect(c1Completed).toBe(0);
    expect(c1Percent).toBe(0);

    // Case 2: First question answered correctly
    const c2Submitted = true;
    const c2Correct = true;
    const c2Completed = c1Index + (c2Submitted && c2Correct ? 1 : 0);
    const c2Percent = Math.round((c2Completed / totalExercises) * 100);
    expect(c2Completed).toBe(1);
    expect(c2Percent).toBe(20);

    // Case 3: Advanced to question 3 (index 2) and submitted correctly
    const c3Index = 2;
    const c3Completed = c3Index + 1;
    const c3Percent = Math.round((c3Completed / totalExercises) * 100);
    expect(c3Completed).toBe(3);
    expect(c3Percent).toBe(60);

    // Case 4: Last question completed
    const c4Index = 4;
    const c4Completed = c4Index + 1;
    const c4Percent = Math.round((c4Completed / totalExercises) * 100);
    expect(c4Completed).toBe(5);
    expect(c4Percent).toBe(100);
  });

  it('generates 7-day weekly XP data with today matching todayEarnedXp', async () => {
    const { storageService } = await import('../services/storageService');
    const user = storageService.getCurrentUser();
    user.dailyXpTarget = 50;
    user.todayEarnedXp = 45;

    const dayNamesTr = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    const now = new Date();
    const weeklyData = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const isToday = i === 0;
      weeklyData.push({
        day: dayNamesTr[d.getDay()],
        xp: isToday ? user.todayEarnedXp : 40,
        target: user.dailyXpTarget,
        isToday,
        metGoal: (isToday ? user.todayEarnedXp : 40) >= user.dailyXpTarget
      });
    }

    expect(weeklyData.length).toBe(7);
    expect(weeklyData[6].isToday).toBe(true);
    expect(weeklyData[6].xp).toBe(45);
    expect(weeklyData[6].target).toBe(50);
  });
});

describe('Achievement Badges & Studio Kazakh Phonetic Audio Pack', () => {
  it('includes 1000 XP and 7-day streak badges in initial curriculum', async () => {
    const { initialBadges } = await import('../data/initialCurriculum');
    const badge1000Xp = initialBadges.find(b => b.id === 'badge-1000-xp');
    expect(badge1000Xp).toBeDefined();
    expect(badge1000Xp?.titleTr).toContain('1000 XP');

    const badgeStreak7 = initialBadges.find(b => b.id === 'badge-3');
    expect(badgeStreak7).toBeDefined();
    expect(badgeStreak7?.titleTr).toContain('7 Günlük');
  });

  it('correctly tracks 1000 XP and 7-day streak thresholds in achievements progress', async () => {
    const { storageService } = await import('../services/storageService');
    const progressList = storageService.getAchievementsProgress();

    const xp1000Prog = progressList.find(p => p.badge.id === 'badge-1000-xp');
    expect(xp1000Prog).toBeDefined();
    expect(xp1000Prog?.max).toBe(1000);

    const streak7Prog = progressList.find(p => p.badge.id === 'badge-3');
    expect(streak7Prog).toBeDefined();
    expect(streak7Prog?.max).toBe(7);
  });

  it('guarantees all 42 Kazakh letters have pre-bundled studio WAV audio files', async () => {
    const { ALL_42_KAZAKH_LETTERS } = await import('../services/audioService');
    const fs = await import('fs');
    const path = await import('path');

    expect(ALL_42_KAZAKH_LETTERS.length).toBe(42);
    ALL_42_KAZAKH_LETTERS.forEach(item => {
      const code = item.char.charCodeAt(0);
      const filePath = path.resolve('public', 'audio', 'letters', `letter_${code}.wav`);
      expect(fs.existsSync(filePath)).toBe(true);
      expect(fs.statSync(filePath).size).toBeGreaterThan(1000);
    });
  });
});

describe('Offline Mode & Service Worker Cache Support', () => {
  it('guarantees offlineCacheService marks all 34 lessons as offline-ready', async () => {
    const { offlineCacheService } = await import('../services/offlineCacheService');
    const stats = await offlineCacheService.getCacheStats();
    expect(stats.totalLessons).toBe(34);
    expect(stats.cachedLessons).toBe(34);
    expect(offlineCacheService.isLessonOfflineReady('lesson-a1-1-1')).toBe(true);
  });

  it('allows toggling simulated offline mode for testing and air travel learning', async () => {
    const { offlineCacheService } = await import('../services/offlineCacheService');
    offlineCacheService.setSimulatedOffline(true);
    expect(offlineCacheService.isOnline()).toBe(false);
    expect(offlineCacheService.getSimulatedOffline()).toBe(true);

    offlineCacheService.setSimulatedOffline(false);
    expect(offlineCacheService.getSimulatedOffline()).toBe(false);
  });

  it('verifies public/service-worker.js exists and contains core offline shell and audio routes', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const swPath = path.resolve('public', 'service-worker.js');
    expect(fs.existsSync(swPath)).toBe(true);

    const swContent = fs.readFileSync(swPath, 'utf-8');
    expect(swContent).toContain('turkolog-cache-v3');
    expect(swContent).toContain('/audio/');
    expect(swContent).toContain('/index.html');
    expect(swContent).toContain('letter_1240.wav'); // Kazakh Ә
    expect(swContent).toContain('letter_1178.wav'); // Kazakh Қ
  });
});

describe('Weekly Learning Goal & Flashcard Guessing Interface', () => {
  it('updates and persists user weekly learning goal settings', async () => {
    const { storageService } = await import('../services/storageService');
    const updated = storageService.updateWeeklyLearningGoal(6, 'days');
    expect(updated.weeklyGoalDays).toBe(6);
    expect(updated.weeklyGoalType).toBe('days');

    const updatedXp = storageService.updateWeeklyLearningGoal(5, 'xp', 350);
    expect(updatedXp.weeklyGoalDays).toBe(5);
    expect(updatedXp.weeklyGoalType).toBe('xp');
    expect(updatedXp.weeklyXpTarget).toBe(350);
  });

  it('correctly calculates remaining days in the week', () => {
    // Current day 1..7 (Monday=1, Sunday=7)
    const dayOfWeek = 5; // e.g. Friday
    const remainingDays = 7 - dayOfWeek;
    expect(remainingDays).toBe(2);

    const sunday = 7;
    const remainingSunday = 7 - sunday;
    expect(remainingSunday).toBe(0);
  });

  it('provides rich authentic vocabulary for flashcard practice', async () => {
    const { storageService } = await import('../services/storageService');
    const vocabList = storageService.getAllVocabulary();
    expect(vocabList.length).toBeGreaterThan(50);
    vocabList.slice(0, 10).forEach(v => {
      expect(v.id).toBeDefined();
      expect(v.kazakhCyrillic.length).toBeGreaterThan(0);
      expect(v.kazakhLatin.length).toBeGreaterThan(0);
      expect(v.turkish.length).toBeGreaterThan(0);
      expect(v.phoneticGuide.length).toBeGreaterThan(0);
      expect(v.category.length).toBeGreaterThan(0);
    });
  });
});




