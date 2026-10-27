import { describe, it, expect } from 'vitest';
import { READING_STORIES } from '../data/readingStories';
import { getStageQuestions } from '../components/student/StageQuestMapView';
import { LETTER_MOUTH_MAP } from '../components/student/KazakhAlphabetVoiceGuide';
import { transliterateKazakhToAudibleString } from '../services/audioService';

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
  it('generates at least 3 questions for every stage from 1 to 10', () => {
    for (let stageNum = 1; stageNum <= 10; stageNum++) {
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
