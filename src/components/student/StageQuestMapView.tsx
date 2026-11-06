import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Volume2, 
  Star, 
  Gift, 
  Heart, 
  Flame, 
  Trophy, 
  ArrowLeft, 
  Check, 
  X, 
  RotateCcw,
  Play,
  ArrowRight,
  HelpCircle,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioService } from '../../services/audioService';
import { storageService } from '../../services/storageService';
import { UserProfile, Unit, Lesson } from '../../types';
import { StageEvaluationModal, EvaluationQuestion } from './StageEvaluationModal';
import { AlageyikMascot } from '../common/AlageyikMascot';

interface StageQuestMapViewProps {
  user: UserProfile;
  units: Unit[];
  onSelectLesson: (unit: Unit, lesson: Lesson) => void;
  onOpenMatchGame: () => void;
  onNavigateTab: (tab: any) => void;
  onEarnXp: (xp: number) => void;
}

export interface QuestStage {
  id: string;
  stageNumber: number;
  titleTr: string;
  titleKz: string;
  icon: string;
  stars: number; // 0, 1, 2, 3
  status: 'completed' | 'active' | 'locked';
  totalTasks: number;
  description: string;
  sentencePrompt: {
    kz: string;
    tr: string;
    audio: string;
    wordBank: string[];
    correctOrder: string[];
  };
}

/**
 * Fisher-Yates word shuffle utility that guarantees the word bank
 * is NEVER presented in the sequential correct order!
 */
export function shuffleWords(words: string[], correctSeq?: string[]): string[] {
  const arr = [...words];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // If the shuffled words accidentally match the beginning of correctSeq, reverse to scramble
  if (correctSeq && correctSeq.length > 1 && arr.slice(0, correctSeq.length).every((w, i) => w === correctSeq[i])) {
    arr.reverse();
  }
  return arr;
}

export const DEFAULT_STAGES: QuestStage[] = [
  {
    id: 'stage-1',
    stageNumber: 1,
    titleTr: 'Selamlaşma & Tanışma',
    titleKz: 'Сәлемдесу және Танысу',
    icon: '👋',
    stars: 3,
    status: 'completed',
    totalTasks: 5,
    description: 'Temel selamlaşmalar, hal hatır sorma ve kendini tanıtma.',
    sentencePrompt: {
      kz: 'Сәлеметсіз бе! Менің атым Айдос.',
      tr: 'Merhaba! Benim adım Aydos.',
      audio: 'Сәлеметсіз бе! Менің атым Айдос.',
      wordBank: ['adım', 'Aydos.', 'Nasılsınız', 'Merhaba!', 'arkadaş', 'Benim'],
      correctOrder: ['Merhaba!', 'Benim', 'adım', 'Aydos.']
    }
  },
  {
    id: 'stage-2',
    stageNumber: 2,
    titleTr: 'Sayılar, Alışveriş & Kazak Bazarı',
    titleKz: 'Сандар мен Сауда',
    icon: '🔢',
    stars: 2,
    status: 'active',
    totalTasks: 6,
    description: '1-100 arası sayılar, fiyat sorma ve pazar alışverişi.',
    sentencePrompt: {
      kz: 'Бұл кітап қанша тұрады?',
      tr: 'Bu kitap ne kadar?',
      audio: 'Бұл кітап қанша тұрады?',
      wordBank: ['kadar?', 'fiyat', 'Bu', 'almak', 'kitap', 'ne'],
      correctOrder: ['Bu', 'kitap', 'ne', 'kadar?']
    }
  },
  {
    id: 'stage-chest-1',
    stageNumber: 2.5,
    titleTr: '🎁 Hazine Sandığı I (Kelime Oyunu)',
    titleKz: '🎁 Қазына сандығы I',
    icon: '🎁',
    stars: 0,
    status: 'active',
    totalTasks: 1,
    description: 'Hızlı kelime eşleştirme görevi ve 50 bonus XP!',
    sentencePrompt: {
      kz: 'Достық — өмірдегі ең үлкен байлық.',
      tr: 'Dostluk hayattaki en büyük zenginliktir.',
      audio: 'Достық — өмірдегі ең үлкен байлық.',
      wordBank: ['en', 'zenginliktir.', 'güzel', 'hayattaki', 'Dostluk', 'büyük'],
      correctOrder: ['Dostluk', 'hayattaki', 'en', 'büyük', 'zenginliktir.']
    }
  },
  {
    id: 'stage-3',
    stageNumber: 3,
    titleTr: 'Kazak Ailesi & Akrabalık',
    titleKz: 'Отбасы мен Туыстар',
    icon: '👨‍👩‍👧‍👦',
    stars: 1,
    status: 'active',
    totalTasks: 5,
    description: 'Anne, baba, kardeşler ve Kazak akrabalık terimleri.',
    sentencePrompt: {
      kz: 'Менің үлкен отбасым бар.',
      tr: 'Benim büyük bir ailem var.',
      audio: 'Менің үлкен отбасым бар.',
      wordBank: ['bir', 'var.', 'küçük', 'Benim', 'ailem', 'büyük'],
      correctOrder: ['Benim', 'büyük', 'bir', 'ailem', 'var.']
    }
  },
  {
    id: 'stage-4',
    stageNumber: 4,
    titleTr: 'Kazak Mutfağı, Beşbarmak & Dasturhan',
    titleKz: 'Қазақ Асханасы мен Дастарқан',
    icon: '🍲',
    stars: 0,
    status: 'locked',
    totalTasks: 6,
    description: 'Beşbarmak, kımız, baursak ve sofra adabı.',
    sentencePrompt: {
      kz: 'Дастарқан басына қош келдіңіз!',
      tr: 'Sofraya hoş geldiniz!',
      audio: 'Дастарқан басына қош келдіңіз!',
      wordBank: ['afiyet', 'hoş', 'olsun', 'geldiniz!', 'Sofraya'],
      correctOrder: ['Sofraya', 'hoş', 'geldiniz!']
    }
  },
  {
    id: 'stage-5',
    stageNumber: 5,
    titleTr: 'Almatı & Astana: Şehir ve Ulaşım',
    titleKz: 'Қала мен Саяхат',
    icon: '🏙️',
    stars: 0,
    status: 'locked',
    totalTasks: 6,
    description: 'Almatı, Astana seyahati, otobüs ve yön sorma.',
    sentencePrompt: {
      kz: 'Вокзалға қалай баруға болады?',
      tr: 'Gara nasıl gidebilirim?',
      audio: 'Вокзалға қалай баруға болады?',
      wordBank: ['otobüs', 'nasıl', 'nerede', 'gidebilirim?', 'Gara'],
      correctOrder: ['Gara', 'nasıl', 'gidebilirim?']
    }
  },
  {
    id: 'stage-chest-2',
    stageNumber: 5.5,
    titleTr: '🎁 Hazine Sandığı II (Bozkır Atları)',
    titleKz: '🎁 Қазына сандығы II',
    icon: '🎁',
    stars: 0,
    status: 'locked',
    totalTasks: 1,
    description: 'Bozkır Atları ve Kımız Ödülü (75 bonus XP)!',
    sentencePrompt: {
      kz: 'Тұлпар — ер қанаты.',
      tr: 'Tulpar yiğidin kanadıdır.',
      audio: 'Тұлпар — ер қанаты.',
      wordBank: ['kanadıdır.', 'hızlı', 'yiğidin', 'at', 'Tulpar'],
      correctOrder: ['Tulpar', 'yiğidin', 'kanadıdır.']
    }
  },
  {
    id: 'stage-6',
    stageNumber: 6,
    titleTr: 'Zaman, Saatler & Günler',
    titleKz: 'Уақыт пен Мезгіл',
    icon: '⏰',
    stars: 0,
    status: 'locked',
    totalTasks: 5,
    description: 'Haftanın günleri, aylar, saat sorma ve randevular.',
    sentencePrompt: {
      kz: 'Қазір сағат неше болды?',
      tr: 'Şu an saat kaç oldu?',
      audio: 'Қазір сағат неше болды?',
      wordBank: ['kaç', 'saat', 'erken', 'Şu', 'oldu?', 'an'],
      correctOrder: ['Şu', 'an', 'saat', 'kaç', 'oldu?']
    }
  },
  {
    id: 'stage-7',
    stageNumber: 7,
    titleTr: 'Bozkır Coğrafyası & Tiyanşan',
    titleKz: 'Табиғат пен Тянь-Шань',
    icon: '🏔️',
    stars: 0,
    status: 'locked',
    totalTasks: 6,
    description: 'Aladağlar, Tiyanşan, Hazar Denizi ve bozkır coğrafyası.',
    sentencePrompt: {
      kz: 'Таудың басында ақ қар жатыр.',
      tr: 'Dağın başında ak kar yatmaktadır.',
      audio: 'Таудың басында ақ қар жатыр.',
      wordBank: ['kar', 'Dağın', 'yatmaktadır.', 'yeşil', 'başında', 'ak'],
      correctOrder: ['Dağın', 'başında', 'ak', 'kar', 'yatmaktadır.']
    }
  },
  {
    id: 'stage-8',
    stageNumber: 8,
    titleTr: 'Dombra & Kazak Küyleri',
    titleKz: 'Домбыра мен Күй өнері',
    icon: '🪕',
    stars: 0,
    status: 'locked',
    totalTasks: 6,
    description: 'Kazakların iki telli kutsal sazı dombra, küyler ve ozanlık.',
    sentencePrompt: {
      kz: 'Домбыра — қазақтың қасиетті аспабы.',
      tr: 'Dombra Kazakların kutsal çalgısıdır.',
      audio: 'Домбыра — қазақтың қасиетті аспабы.',
      wordBank: ['çalgısıdır.', 'kutsal', 'telli', 'Dombra', 'Kazakların', 'güzel'],
      correctOrder: ['Dombra', 'Kazakların', 'kutsal', 'çalgısıdır.']
    }
  },
  {
    id: 'stage-chest-3',
    stageNumber: 8.5,
    titleTr: '🎁 Hazine Sandığı III (Saka Mirası)',
    titleKz: '🎁 Қазына сандығы III',
    icon: '🎁',
    stars: 0,
    status: 'locked',
    totalTasks: 1,
    description: 'Altın Adam & Bozkır Arkeolojisi (100 bonus XP)!',
    sentencePrompt: {
      kz: 'Ер есімі — ел есінде.',
      tr: 'Yiğidin adı milletin hafızasındadır.',
      audio: 'Ер есімі — ел есінде.',
      wordBank: ['hafızasındadır.', 'adı', 'şeref', 'milletin', 'Yiğidin', 'ebedi'],
      correctOrder: ['Yiğidin', 'adı', 'milletin', 'hafızasındadır.']
    }
  },
  {
    id: 'stage-9',
    stageNumber: 9,
    titleTr: 'Abay Kunanbayulı & Bozkır Hikmeti',
    titleKz: 'Абай мұрасы мен Әдебиет',
    icon: '📖',
    stars: 0,
    status: 'locked',
    totalTasks: 8,
    description: 'Abay, Kara Sözler ve felsefi Kıpçak edebiyatı.',
    sentencePrompt: {
      kz: 'Абайдың сөзі — халықтың көзі.',
      tr: 'Abay\'ın sözü halkın gözüdür.',
      audio: 'Абайдың сөзі — халықтың көзі.',
      wordBank: ['Abay\'ın', 'yoludur', 'gözüdür.', 'sözü', 'halkın', 'bilgi'],
      correctOrder: ['Abay\'ın', 'sözü', 'halkın', 'gözüdür.']
    }
  },
  {
    id: 'stage-10',
    stageNumber: 10,
    titleTr: 'Konukseverlik & Kıpçak Töreleri',
    titleKz: 'Қонақжайлылық пен Дәстүр',
    icon: '🐎',
    stars: 0,
    status: 'locked',
    totalTasks: 6,
    description: 'Kazak misafirperverliği, бата (dua) ve aksakallık kurumu.',
    sentencePrompt: {
      kz: 'Қонақ — құт пен береке.',
      tr: 'Misafir uğur ve berekettir.',
      audio: 'Қонақ — құт пен береке.',
      wordBank: ['ve', 'Misafir', 'berekettir.', 'ev', 'uğur', 'kutsal'],
      correctOrder: ['Misafir', 'uğur', 've', 'berekettir.']
    }
  },
  {
    id: 'stage-11',
    stageNumber: 11,
    titleTr: 'Meslekler & İş Dünyası',
    titleKz: 'Мамандықтар мен Еңбек',
    icon: '💼',
    stars: 0,
    status: 'locked',
    totalTasks: 6,
    description: 'Öğretmen, doktor, mühendis ve iş hayatı terimleri.',
    sentencePrompt: {
      kz: 'Ұстаз — мектептің жүрегі.',
      tr: 'Öğretmen okulun kalbidir.',
      audio: 'Ұстаз — мектептің жүрегі.',
      wordBank: ['bilgi', 'kalbidir.', 'öğrenci', 'okulun', 'Öğretmen'],
      correctOrder: ['Öğretmen', 'okulun', 'kalbidir.']
    }
  },
  {
    id: 'stage-12',
    stageNumber: 12,
    titleTr: 'Türk Dünyası Kardeşliği & Kültür',
    titleKz: 'Түркі дүниесі мен Бірлік',
    icon: '🌐',
    stars: 0,
    status: 'locked',
    totalTasks: 7,
    description: 'Ortak Türk tarihi, alfabeler ve Kıpçak-Oğuz kardeşliği.',
    sentencePrompt: {
      kz: 'Бірлік бар жерде — тірлік бар.',
      tr: 'Birliğin olduğu yerde dirlik vardır.',
      audio: 'Бірлік бар жерде — тірлік бар.',
      wordBank: ['vardır.', 'yerde', 'güç', 'dirlik', 'Birliğin', 'olduğu'],
      correctOrder: ['Birliğin', 'olduğu', 'yerde', 'dirlik', 'vardır.']
    }
  },
  {
    id: 'stage-13',
    stageNumber: 13,
    titleTr: 'Büyük Kurultay & Usta Türkolog',
    titleKz: 'Ұлы Құрылтай және Бас Түркітанушы',
    icon: '👑',
    stars: 0,
    status: 'locked',
    totalTasks: 10,
    description: 'Tüm etapların birleşimi ve Usta Türkolog Şeref Nişanı.',
    sentencePrompt: {
      kz: 'Тіл — ұлттың ең биік туы.',
      tr: 'Dil milletin en yüce bayrağıdır.',
      audio: 'Тіл — ұлттың ең биік туы.',
      wordBank: ['yüce', 'bayrağıdır.', 'Dil', 'sözüdür', 'milletin', 'en'],
      correctOrder: ['Dil', 'milletin', 'en', 'yüce', 'bayrağıdır.']
    }
  },
  {
    id: 'stage-chest-4',
    stageNumber: 13.5,
    titleTr: '🎁 Hazine Sandığı IV (Bozkır Kurultayı)',
    titleKz: '🎁 Қазына сандығы IV',
    icon: '🎁',
    stars: 0,
    status: 'locked',
    totalTasks: 1,
    description: 'Büyük Bozkır Kurultayı Özel Ödülü (100 bonus XP)!',
    sentencePrompt: {
      kz: 'Өнер алды — қызыл тіл.',
      tr: 'Sanatın başı tatlı ve güzel dildir.',
      audio: 'Өнер алды — қызыл тіл.',
      wordBank: ['dildir.', 'tatlı', 'Sanatın', 'başı', 've', 'söz'],
      correctOrder: ['Sanatın', 'başı', 'tatlı', 've', 'dildir.']
    }
  },
  {
    id: 'stage-14',
    stageNumber: 14,
    titleTr: 'Söz Sanatı, Aytıs & Bozkır Ozanlığı',
    titleKz: 'Сөз өнері мен Айтыс',
    icon: '🎙️',
    stars: 0,
    status: 'locked',
    totalTasks: 7,
    description: 'Dombra eşliğinde doğaçlama atışma sanatı, jıravlar ve akınlar.',
    sentencePrompt: {
      kz: 'Айтыс — халықтың айнасы мен үні.',
      tr: 'Aytıs halkın aynası ve sesidir.',
      audio: 'Айтыс — халықтың айнасы мен үні.',
      wordBank: ['ve', 'halkın', 'sesidir.', 'Aytıs', 'aynası', 'sözü'],
      correctOrder: ['Aytıs', 'halkın', 'aynası', 've', 'sesidir.']
    }
  },
  {
    id: 'stage-15',
    stageNumber: 15,
    titleTr: 'Kök Bayrak & Bağımsızlık Yolu',
    titleKz: 'Көк ту және Тәуелсіздік',
    icon: '🇰🇿',
    stars: 0,
    status: 'locked',
    totalTasks: 8,
    description: 'Gök mavisi sancak, altın kartal ve egemenlik tarihi.',
    sentencePrompt: {
      kz: 'Тәуелсіздік — ата-бабаның аманаты.',
      tr: 'Bağımsızlık ataların emanetidir.',
      audio: 'Тәуелсіздік — ата-бабаның аманаты.',
      wordBank: ['ataların', 'Bağımsızlık', 'yoludur', 'kutlu', 'emanetidir.'],
      correctOrder: ['Bağımsızlık', 'ataların', 'emanetidir.']
    }
  },
  {
    id: 'stage-16',
    stageNumber: 16,
    titleTr: 'Ulu Bozkır Felsefesi & Baş Türkolog',
    titleKz: 'Ұлы Дала Пәлсапасы мен Бас Түркітанушы',
    icon: '🦅',
    stars: 0,
    status: 'locked',
    totalTasks: 10,
    description: 'Alageyik kılavuzluğunda nihai ustalık seviyesi ve Türkoloji tacı.',
    sentencePrompt: {
      kz: 'Алагеяк — түркі жұртының мәңгілік бағдары.',
      tr: 'Alageyik Türk milletinin ebedi kılavuzudur.',
      audio: 'Алагеяк — түркі жұртының мәңгілік бағдары.',
      wordBank: ['Alageyik', 'milletinin', 'ebedi', 'kılavuzudur.', 'Türk', 'yolu'],
      correctOrder: ['Alageyik', 'Türk', 'milletinin', 'ebedi', 'kılavuzudur.']
    }
  }
];

// Questions bank for stage evaluation tests
export const getStageQuestions = (stageNumber: number): EvaluationQuestion[] => {
  const map: Record<number, EvaluationQuestion[]> = {
    1: [
      {
        id: 'q-1-1',
        questionTr: 'Kazakçada saygılı «Merhaba, benim adım...» nasıl denir?',
        questionKz: '«Сәлеметсіз бе, менің атым...» дұрыс па?',
        options: ['Сәлеметсіз бе, менің атым...', 'Сау болыңыз, мен барамын', 'Қайырлы түн, достар', 'Көріскенше!'],
        correctAnswer: 'Сәлеметсіз бе, менің атым...',
        explanationTr: '«Сәлеметсіз бе» saygılı merhaba, «менің атым» benim adım demektir.',
        explanationKz: 'Сәлеметсіз бе – сыпайы сәлем.'
      },
      {
        id: 'q-1-2',
        questionTr: '«Қалайсыз?» sorusuna en uygun nezaket cevabı hangisidir?',
        questionKz: '«Қалайсыз?» сұрағына қай жауап дұрыс?',
        options: ['Жақсы, рахмет! Өзіңіз қалайсыз?', 'Жоқ, келмеймін', 'Бұл кітап қанша?', 'Сағат бес'],
        correctAnswer: 'Жақсы, рахмет! Өзіңіз қалайсыз?',
        explanationTr: '«Жақсы, рахмет!» (İyiyim, teşekkür ederim) kalıbı kullanılır.',
        explanationKz: 'Жақсы, рахмет.'
      },
      {
        id: 'q-1-3',
        questionTr: 'Kazakçadaki 9 özel harften hangisi genizden gelen «sağır n» sesidir?',
        questionKz: 'Мұрын жолды төл дыбыс қайсысы?',
        options: ['Ң', 'Ғ', 'Ү', 'Қ'],
        correctAnswer: 'Ң',
        explanationTr: 'Ң harfi geniz n\'si (sağır kâf) sesidir.',
        explanationKz: 'Ң – төл дыбыс.'
      },
      {
        id: 'q-1-4',
        questionTr: '«Сау болыңыз!» ne anlama gelir?',
        questionKz: '«Сау болыңыз!» мағынасы?',
        options: ['Hoşça kalın / Sağlıcakla kalın', 'Günaydın', 'Lütfen', 'Rica ederim'],
        correctAnswer: 'Hoşça kalın / Sağlıcakla kalın',
        explanationTr: 'Ayrılırken «Sağlıcakla kalın» manasında söylenir.',
        explanationKz: 'Қоштасу сөзі.'
      }
    ],
    2: [
      {
        id: 'q-2-1',
        questionTr: '«Бұл кітап қанша тұрады?» ne anlama gelir?',
        questionKz: 'Бұл сөйлем қалай аударылады?',
        options: ['Bu kitap ne kadar / kaç para?', 'Bu kitap nerede?', 'Kitap okuyor musunuz?', 'Yeni kitap aldım'],
        correctAnswer: 'Bu kitap ne kadar / kaç para?',
        explanationTr: '«Қанша тұрады?» fiyat sorma kalıbıdır.',
        explanationKz: 'Баға сұрау.'
      },
      {
        id: 'q-2-2',
        questionTr: '«Жеті жүз теңге» kaç parayı ifade eder?',
        questionKz: '«Жеті жүз» қай сан?',
        options: ['700', '70', '7000', '750'],
        correctAnswer: '700',
        explanationTr: 'Жеті (7) + жүз (100) = 700.',
        explanationKz: '700 саны.'
      },
      {
        id: 'q-2-3',
        questionTr: 'Alışverişte «Çok pahalı, biraz indirim yapınız» nasıl denir?',
        questionKz: '«Өте қымбат, аздап түсіріңіз» деген не?',
        options: ['Өте қымбат, аздап түсіріңіз', 'Бәрі тегін', 'Ақшам жоқ', 'Қош келдіңіз'],
        correctAnswer: 'Өте қымбат, аздап түсіріңіз',
        explanationTr: 'Қымбат = Pahalı, түсіріңіз = İndiriniz.',
        explanationKz: 'Саудаласу үлгісі.'
      }
    ],
    3: [
      {
        id: 'q-3-1',
        questionTr: 'Kazakçada «Küçük erkek kardeş» için ne denir?',
        questionKz: 'Кіші ер бауыр қалай аталады?',
        options: ['Іні', 'Аға', 'Әпке', 'Қарындас'],
        correctAnswer: 'Іні',
        explanationTr: 'Іні = Küçük erkek kardeş.',
        explanationKz: 'Іні.'
      },
      {
        id: 'q-3-2',
        questionTr: '«Әке» ve «Ана» kimdir?',
        questionKz: '«Әке» мен «Ана» кімдер?',
        options: ['Baba ve Anne', 'Dede ve Nine', 'Kardeşler', 'Arkadaş ve Komşu'],
        correctAnswer: 'Baba ve Anne',
        explanationTr: 'Әке = Baba, Ана = Anne.',
        explanationKz: 'Ата-ана.'
      },
      {
        id: 'q-3-3',
        questionTr: 'Kazakçada dedeye ne denir?',
        questionKz: '«Ата» сөзінің мағынасы қайсысы?',
        options: ['Ата', 'Аға', 'Бөле', 'Жеңге'],
        correctAnswer: 'Ата',
        explanationTr: '«Ата» büyükbaba, dede demektir.',
        explanationKz: 'Ата – үлкен кісі, атамыз.'
      }
    ],
    4: [
      {
        id: 'q-4-1',
        questionTr: 'Kazak milli yemeği Beşbarmak\'ın Kazakça doğru adı nedir?',
        questionKz: 'Қазақтың бас ұлттық тағамы қалай аталады?',
        options: ['Ет / Қазақша ет', 'Шұжық', 'Қуырдақ', 'Бауырсақ'],
        correctAnswer: 'Ет / Қазақша ет',
        explanationTr: 'Kazaklar bu yemeğe doğrudan «Ет» veya «Қазақша ет» derler.',
        explanationKz: 'Ет – қазақтың басты асы.'
      },
      {
        id: 'q-4-2',
        questionTr: '«Дастарқан» kelimesinin Kazak kültüründeki anlamı nedir?',
        questionKz: '«Дастарқан» дегеніміз не?',
        options: ['Sofra ve bereket meclisi', 'Çadır örtüsü', 'Mutfak bıçağı', 'At eyeri'],
        correctAnswer: 'Sofra ve bereket meclisi',
        explanationTr: 'Дастарқан sofra ve misafir ağırlama kültürünün kalbidir.',
        explanationKz: 'Береке мен қонақжайлылық нышаны.'
      },
      {
        id: 'q-4-3',
        questionTr: 'Kısrak sütünden mayalanarak yapılan geleneksel Kazak içeceği nedir?',
        questionKz: 'Бие сүтінен жасалатын емдік сусын қалай аталады?',
        options: ['Қымыз', 'Шұбат', 'Айран', 'Қатық'],
        correctAnswer: 'Қымыз',
        explanationTr: 'Kısrak sütü mayası «Қымыз» (Kımız)\'dır. Deve sütü ise «Шұбат»tır.',
        explanationKz: 'Қымыз – бие сүті.'
      }
    ],
    5: [
      {
        id: 'q-5-1',
        questionTr: '«Вокзалға қалай баруға болады?» sorusu ne amaçla sorulur?',
        questionKz: 'Бұл сұрақпен не сұралады?',
        options: ['Gara nasıl gidebilirim / yol tarifi', 'Tren ne zaman kalkıyor?', 'Bilet kaç para?', 'Otel nerede?'],
        correctAnswer: 'Gara nasıl gidebilirim / yol tarifi',
        explanationTr: '«Қалай баруға болады?» nasıl gidilir kalıbıdır.',
        explanationKz: 'Жол сұрау.'
      },
      {
        id: 'q-5-2',
        questionTr: 'Kazakistan\'ın tarihi kültür başkenti ve «Elmalı» anlamına gelen şehri hangisidir?',
        questionKz: 'Қазақстанның оңтүстік астанасы қай қала?',
        options: ['Алматы', 'Астана', 'Шымкент', 'Түркістан'],
        correctAnswer: 'Алматы',
        explanationTr: 'Алматы kelimesi elmalı (alma) kökünden gelir.',
        explanationKz: 'Алматы – тарихи мәдени орда.'
      },
      {
        id: 'q-5-3',
        questionTr: 'Kazakçada «Otobüs durağı» nasıl söylenir?',
        questionKz: '«Аялдама» сөзінің аудармасы қандай?',
        options: ['Аялдама', 'Әуежай', 'Теміржол', 'Көше'],
        correctAnswer: 'Аялдама',
        explanationTr: '«Аялдама» durak anlamına gelir.',
        explanationKz: 'Аялдама.'
      }
    ],
    6: [
      {
        id: 'q-6-1',
        questionTr: '«Қазір сағат неше болды?» ne demektir?',
        questionKz: 'Бұл сөйлемнің мағынасы қандай?',
        options: ['Şu an saat kaç oldu?', 'Bugün günlerden ne?', 'Saat kaçta buluşacağız?', 'Zaman çok çabuk geçti'],
        correctAnswer: 'Şu an saat kaç oldu?',
        explanationTr: '«Сағат неше болды?» anlık saat sorma kalıbıdır.',
        explanationKz: 'Сағат сұрау.'
      },
      {
        id: 'q-6-2',
        questionTr: 'Kazakçada «Pazartesi» gününe ne ad verilir?',
        questionKz: 'Аптаның бірінші күні қалай аталады?',
        options: ['Дүйсенбі', 'Сейсенбі', 'Сәрсенбі', 'Жұма'],
        correctAnswer: 'Дүйсенбі',
        explanationTr: 'Дүйсенбі = Pazartesi.',
        explanationKz: 'Дүйсенбі – апта басы.'
      },
      {
        id: 'q-6-3',
        questionTr: '«Бүгін», «Кеше» ve «Ертең» sıralaması Türkçede nedir?',
        questionKz: 'Бұл сөздер қалай аударылады?',
        options: ['Bugün, Dün, Yarın', 'Dün, Bugün, Yarın', 'Sabah, Akşam, Gece', 'Yarın, Bugün, Dün'],
        correctAnswer: 'Bugün, Dün, Yarın',
        explanationTr: 'Бүгін = Bugün, Кеше = Dün, Ертең = Yarın.',
        explanationKz: 'Уақыт мерзімдері.'
      }
    ],
    7: [
      {
        id: 'q-7-1',
        questionTr: 'Kazakistan\'ın güney sınırındaki yüce Tiyanşan dağ silsilesine Kazakçada ne ad verilir?',
        questionKz: 'Қазақстанның оңтүстігіндегі биік тау қалай аталады?',
        options: ['Алатау / Тянь-Шань', 'Алтай', 'Орал', 'Қаратау'],
        correctAnswer: 'Алатау / Тянь-Шань',
        explanationTr: 'Алатау (Aladağlar) Tiyanşan silsilesinin Kazakça adıdır.',
        explanationKz: 'Алатау – биік тау.'
      },
      {
        id: 'q-7-2',
        questionTr: 'Kazakçada «Bozkır» için hangi kelime kullanılır?',
        questionKz: '«Дала» сөзінің аудармасы қандай?',
        options: ['Дала', 'Орман', 'Өзен', 'Көл'],
        correctAnswer: 'Дала',
        explanationTr: '«Дала» uçsuz bucaksız bozkırı ifade eder.',
        explanationKz: 'Ұлы дала.'
      },
      {
        id: 'q-7-3',
        questionTr: '«Өзен» ve «Көл» coğrafi terimlerinin karşılığı hangisidir?',
        questionKz: '«Өзен» мен «Көл» мағынасы:',
        options: ['Irmak/Nehir ve Göl', 'Dağ ve Tepe', 'Deniz ve Orman', 'Yol ve Köprü'],
        correctAnswer: 'Irmak/Nehir ve Göl',
        explanationTr: 'Өзен = Nehir, Көл = Göl.',
        explanationKz: 'Өзен мен көл.'
      }
    ],
    8: [
      {
        id: 'q-8-1',
        questionTr: 'Kazak milli çalgısı Dombra kaç tellidir?',
        questionKz: 'Домбыраның неше ішегі бар?',
        options: ['2 telli', '3 telli', '4 telli', '6 telli'],
        correctAnswer: '2 telli',
        explanationTr: 'Dombra iki telli, perdelere ayrılmış mukaddes bir Türk çalgısıdır.',
        explanationKz: 'Екі ішекті домбыра.'
      },
      {
        id: 'q-8-2',
        questionTr: 'Kazak müziğinde sözsüz, derin hikaye anlatan enstrümantal bestelere ne denir?',
        questionKz: 'Домбырада орындалатын аспаптық туынды қалай аталады?',
        options: ['Күй', 'Жыр', 'Терме', 'Айтыс'],
        correctAnswer: 'Күй',
        explanationTr: '«Күй» (Küy) derin bozkır hislerini anlatan ezgidir (Örn: Kurmangazı - Adıy).',
        explanationKz: 'Күй – қазақ жаны.'
      },
      {
        id: 'q-8-3',
        questionTr: '«Домбыра — қазақтың жаны» sözü neyi vurgular?',
        questionKz: 'Бұл тіркес нені білдіреді?',
        options: ['Dombra Kazak kimliğinin ve ruhunun sembolüdür', 'Sadece bir müzik aletidir', 'Eski bir süs eşyasıdır', 'Sadece düğünlerde çalınır'],
        correctAnswer: 'Dombra Kazak kimliğinin ve ruhunun sembolüdür',
        explanationTr: 'Dombra Kazak milli şuurunun en derin taşıyıcısıdır.',
        explanationKz: 'Ұлттық болмыс.'
      }
    ],
    9: [
      {
        id: 'q-9-1',
        questionTr: 'Kazak yazılı edebiyatının kurucusu ve büyük düşünürü kimdir?',
        questionKz: 'Қазақ жазба әдебиетінің негізін қалаушы ұлы ақын кім?',
        options: ['Абай Құнанбайұлы', 'Мағжан Жұмабаев', 'Ыбырай Алтынсарин', 'Ахмет Байтұрсынұлы'],
        correctAnswer: 'Абай Құнанбайұлы',
        explanationTr: 'Abay Kunanbayulı (1845-1904) büyük şair ve düşünürdür.',
        explanationKz: 'Хакім Абай.'
      },
      {
        id: 'q-9-2',
        questionTr: 'Abay\'ın insanlık, ahlak ve ilim üzerine yazdığı 45 felsefi düzyazı eserine ne denir?',
        questionKz: 'Абайдың пәлсапалық 45 туындысы қалай аталады?',
        options: ['Қара сөздер (Kara Sözler)', 'Ескендір', 'Қалың елім, қазағым', 'Сегіз аяқ'],
        correctAnswer: 'Қара сөздер (Kara Sözler)',
        explanationTr: '«Қара сөздер» (Kelimeler / Hikmetli Sözler) Abay\'ın başyapıtıdır.',
        explanationKz: 'Абайдың қара сөздері.'
      },
      {
        id: 'q-9-3',
        questionTr: '«Ғылым таппай мақтанба» dizesi neyi öğütler?',
        questionKz: 'Абай бұл өлеңінде неге үндейді?',
        options: ['İlim öğrenmeden boş yere övünme', 'Zenginlikle gururlan', 'Sadece dinlen', 'Yalnızca gez'],
        correctAnswer: 'İlim öğrenmeden boş yere övünme',
        explanationTr: 'İlim, ahlak ve gayret olmadan gururlanmanın boş olduğunu anlatır.',
        explanationKz: 'Ғылым-білім үйренуге шақыру.'
      }
    ],
    10: [
      {
        id: 'q-10-1',
        questionTr: 'Kazak misafirperverlik töresinde eve gelen misafire ne ad verilir?',
        questionKz: 'Қазақта үйге келген қонақты кім дейді?',
        options: ['Құдайы қонақ (Tanrı misafiri)', 'Бөгде адам', 'Жолаушы ғана', 'Сатушы'],
        correctAnswer: 'Құдайы қонақ (Tanrı misafiri)',
        explanationTr: 'Kazak kültüründe kapıya gelen herkes kutlu bir «Құдайы қонақ»tır.',
        explanationKz: 'Қонақ – береке.'
      },
      {
        id: 'q-10-2',
        questionTr: 'Sofradan kalkarken veya yolculuğa çıkarken büyüklerin verdiği hayır duasına ne denir?',
        questionKz: 'Үлкендердің беретін ақ тілегі мен дұғасы қалай аталады?',
        options: ['Бата', 'Айтыс', 'Сүйінші', 'Шашу'],
        correctAnswer: 'Бата',
        explanationTr: '«Бата» (Ak dua) Kazak töresinde uğur getiren duadır.',
        explanationKz: 'Бата беру салты.'
      },
      {
        id: 'q-10-3',
        questionTr: 'Sevinçli bir haber verildiğinde hediye isteme geleneğine ne denir?',
        questionKz: 'Қуанышты хабар жеткізгенде айтылатын дәстүр сөзі:',
        options: ['Сүйінші!', 'Бата', 'Көрімдік', 'Сәлем'],
        correctAnswer: 'Сүйінші!',
        explanationTr: '«Сүйінші!» (Müjde!) karşılığında hediye verilir.',
        explanationKz: 'Сүйінші сұрау.'
      }
    ],
    11: [
      {
        id: 'q-11-1',
        questionTr: 'Kazakçada «Öğretmen» ve «Öğrenci» kelimeleri hangileridir?',
        questionKz: '«Ұстаз/Мұғалім» және «Оқушы» сөздерінің мағынасы:',
        options: ['Öğretmen ve Öğrenci', 'Doktor ve Hasta', 'Mühendis ve İşçi', 'Yazar ve Okur'],
        correctAnswer: 'Öğretmen ve Öğrenci',
        explanationTr: 'Ұстаз / Мұғалім = Öğretmen, Оқушы / Студент = Öğrenci.',
        explanationKz: 'Мамандық.'
      },
      {
        id: 'q-11-2',
        questionTr: '«Дәрігер» hangi meslek dalını ifade eder?',
        questionKz: '«Дәрігер» кім?',
        options: ['Doktor / Hekim', 'Eczacı', 'Hemşire', 'Veteriner'],
        correctAnswer: 'Doktor / Hekim',
        explanationTr: 'Дәрігер = Doktor. Дәрі (ilaç) kökünden gelir.',
        explanationKz: 'Дәрігер – емдеуші адам.'
      },
      {
        id: 'q-11-3',
        questionTr: '«Еңбек түбі — береке» atasözü ne anlatır?',
        questionKz: 'Бұл мақалдың түйіні қандай?',
        options: ['Emeğin sonu berekettir', 'Çalışmak zordur', 'Boş durmak iyidir', 'Tembellik rahatlıktır'],
        correctAnswer: 'Emeğin sonu berekettir',
        explanationTr: 'Emek ve gayretin daima kazanç ve bereket getireceğini anlatır.',
        explanationKz: 'Еңбек етуге үндеу.'
      }
    ],
    12: [
      {
        id: 'q-12-1',
        questionTr: 'Kazak Türkçesi Türk dillerinin hangi ana koluna mensuptur?',
        questionKz: 'Қазақ тілі түркі тілдерінің қай тобына жатады?',
        options: ['Kıpçak (Qypchaq) grubu', 'Oğuz grubu', 'Karluk grubu', 'Sibirya grubu'],
        correctAnswer: 'Kıpçak (Qypchaq) grubu',
        explanationTr: 'Kazakça, Kırgızca, Tatarca ve Başkurtça ile birlikte Kıpçak sahasındadır.',
        explanationKz: 'Қыпшақ тобы.'
      },
      {
        id: 'q-12-2',
        questionTr: 'Oğuz Türkçesindeki «y» sesi Kıpçak (Kazak) sahasında çoğunlukla hangi sese dönüşür (Örn: Yol / Jol, Yıl / Jıl)?',
        questionKz: 'Оғызша «й» дыбысы қазақша көбінесе қай дыбысқа сәйкес келеді?',
        options: ['Ж (j/c) sesine', 'Б sesine', 'Д sesine', 'М sesine'],
        correctAnswer: 'Ж (j/c) sesine',
        explanationTr: 'Yıl ➔ Жыл, Yol ➔ Жол, Yok ➔ Жоқ, Yaş ➔ Жас.',
        explanationKz: 'Й ➔ Ж дыбыс ауысу заңы.'
      },
      {
        id: 'q-12-3',
        questionTr: '«Бірлік бар жерде — тірлік бар» sözünün felsefesi nedir?',
        questionKz: 'Бұл қанатты сөз неге үндейді?',
        options: ['Birlik ve beraberliğin olduğu yerde hayat ve dirlik vardır', 'Herkes yalnız yaşamalıdır', 'Birlikten güç doğmaz', 'Gezmek hayatın amacıdır'],
        correctAnswer: 'Birlik ve beraberliğin olduğu yerde hayat ve dirlik vardır',
        explanationTr: 'Türk Dünyasının en temel dayanışma felsefesidir.',
        explanationKz: 'Ынтымақ пен бірлік.'
      }
    ],
    13: [
      {
        id: 'q-13-1',
        questionTr: '«Тіл — ұлттың ең биік туы» aforizması neyi simgeler?',
        questionKz: 'Бұл тұжырымның мәні неде?',
        options: ['Dil bir milletin bağımsızlığının ve ruhunun en yüce sancağıdır', 'Sadece iletişim aracıdır', 'Yabancı diller önemsizdir', 'Tarih kitaplarında kalmalıdır'],
        correctAnswer: 'Dil bir milletin bağımsızlığının ve ruhunun en yüce sancağıdır',
        explanationTr: 'Dil milletin hafızası, kültürü ve bağımsızlık bayrağıdır.',
        explanationKz: 'Ана тілінің қадірі.'
      },
      {
        id: 'q-13-2',
        questionTr: 'Usta bir Türkolog olmak için Kazakçada hangi fonetik dengelere hakim olmak gerekir?',
        questionKz: 'Түркітанушы қандай дағдыларды толық меңгеруі тиіс?',
        options: ['9 özel harf, kalınlık-incelik uyumu, Kiril ve Latin yazımı ve sesletim', 'Sadece kelime ezberlemek', 'Sadece gramer kurallarını bilmek', 'Yalnızca Türkçe bilmek'],
        correctAnswer: '9 özel harf, kalınlık-incelik uyumu, Kiril ve Latin yazımı ve sesletim',
        explanationTr: 'Tam yetkinlik karşılaştırmalı ses bilgisi ve kelime hazinesi gerektirir.',
        explanationKz: 'Кешенді білім.'
      },
      {
        id: 'q-13-3',
        questionTr: 'Uzaktan Türkolog platformunun kadim mitolojik sembolü nedir?',
        questionKz: 'Платформаның киелі мифологиялық нышаны қайсысы?',
        options: ['Kutsal Alageyik (Алагеяк)', 'Bozkurt', 'Kartal', 'Bars'],
        correctAnswer: 'Kutsal Alageyik (Алагеяк)',
        explanationTr: 'Alageyik Türk mitolojisinde yol gösterici, hikmetli ve kutsal rehberdir.',
        explanationKz: 'Киелі Алагеяк.'
      }
    ],
    14: [
      {
        id: 'q-14-1',
        questionTr: 'Kazak halk edebiyatında iki akının (ozanın) dombra eşliğinde karşılıklı doğaçlama şiir yarışmasına ne ad verilir?',
        questionKz: 'Екі ақынның домбырамен сөз сайысы қалай аталады?',
        options: ['Айтыс (Aytıs)', 'Күй (Küy)', 'Беташар (Betaşar)', 'Жар-жар (Jar-jar)'],
        correctAnswer: 'Айтыс (Aytıs)',
        explanationTr: 'Айтыс, UNESCO somut olmayan kültür mirası listesindeki kadim Türk atışma geleneğidir.',
        explanationKz: 'Айтыс – суырыпсалмалық өнер.'
      },
      {
        id: 'q-14-2',
        questionTr: '«Өнер алды — қызыл тіл» Kazak atasözünün Türkçe karşılığı nedir?',
        questionKz: 'Бұл мақалдың мағынасы қандай?',
        options: ['Sanatların başı tatlı, güzel ve etkili dildir', 'Resim yapmak en zor sanattır', 'Konuşmamak altındır', 'Dilsiz sanat olmaz'],
        correctAnswer: 'Sanatların başı tatlı, güzel ve etkili dildir',
        explanationTr: 'Söz söyleme ve hitabet sanatının tüm sanatların önünde olduğunu vurgular.',
        explanationKz: 'Сөз қадірін бағалау.'
      },
      {
        id: 'q-14-3',
        questionTr: 'Eski Kazak-Kıpçak geleneğinde kabile ve orduya rehberlik eden destancı bilgelere ne ad verilirdi?',
        questionKz: 'Халқына ақылшы, ел қорғаны болған жыршылар қалай аталған?',
        options: ['Жырау (Jırav)', 'Бәйбіше (Baybişe)', 'Мырза (Mırza)', 'Сарбаз (Sarbaz)'],
        correctAnswer: 'Жырау (Jırav)',
        explanationTr: 'Жырауlar (Asan Kaygı, Kaztugan vb.) bozkırın felsefe ve devlet danışmanı ozanlarıdır.',
        explanationKz: 'Жыраулық дәстүр.'
      }
    ],
    15: [
      {
        id: 'q-15-1',
        questionTr: 'Kazakistan Cumhuriyeti devlet bayrağındaki gök mavisi zemin ve altın kartal neyi sembolize eder?',
        questionKz: 'Көк тудың көгілдір түсі мен алтын қыран нені білдіреді?',
        options: ['Barış, birlik, açık gökyüzü ve bağımsızlığın engin özgürlüğünü', 'Yalnızca zenginliği', 'Sadece kış mevsimini', 'Denizleri ve gölleri'],
        correctAnswer: 'Barış, birlik, açık gökyüzü ve bağımsızlığın engin özgürlüğünü',
        explanationTr: 'Gök mavisi ebedi gök kubbeyi ve Türk barışını; süzülen altın kartal bağımsızlığı simgeler.',
        explanationKz: 'Мемлекеттік тудың символикасы.'
      },
      {
        id: 'q-15-2',
        questionTr: '«Тәуелсіздік» kelimesi ne anlama gelir?',
        questionKz: '«Тәуелсіздік» сөзінің аудармасы:',
        options: ['Bağımsızlık / İstiklal', 'Dostluk', 'Gelenek', 'Birlik'],
        correctAnswer: 'Bağımsızlık / İstiklal',
        explanationTr: 'Тәуелсіз (Bağımsız) ➔ Тәуелсіздік (Bağımsızlık / Egemenlik).',
        explanationKz: 'Егемендік.'
      },
      {
        id: 'q-15-3',
        questionTr: 'Kazakistan\'ın bağımsızlık günü hangi tarihte kutlanır?',
        questionKz: 'Қазақстанның Тәуелсіздік күні қашан?',
        options: ['16 Aralık (Желтоқсан)', '22 Mart (Наурыз)', '25 Ekim (Республика күні)', '30 Ağustos (Ата заң күні)'],
        correctAnswer: '16 Aralık (Желтоқсан)',
        explanationTr: '16 Aralık 1991 Kazakistan Bağımsızlık Günüdür.',
        explanationKz: 'Тәуелсіздік күні.'
      }
    ],
    16: [
      {
        id: 'q-16-1',
        questionTr: 'Türk mitolojisinde yol gösterici, zarafet, barış ve bereket elçisi olarak kabul edilen kutlu hayvan hangisidir?',
        questionKz: 'Түркі мифологиясындағы жол көрсетер киелі жануар қайсысы?',
        options: ['Алагеяк (Kutsal Alageyik / Maral)', 'Қасқыр (Kurt)', 'Түлкі (Tilki)', 'Арыстан (Aslan)'],
        correctAnswer: 'Алагеяк (Kutsal Alageyik / Maral)',
        explanationTr: 'Alageyik Oğuz Kağan\'dan Altay efsanelerine kadar kutlu kılavuzdur.',
        explanationKz: 'Киелі Алагеяк бейнесі.'
      },
      {
        id: 'q-16-2',
        questionTr: '«Тіл білсең — түркі дүниесін кезерсің» sözü neye işaret eder?',
        questionKz: 'Бұл қанатты сөздің мағынасы:',
        options: ['Ortak dil kökleri sayesinde Adriyatik\'ten Çin Seddi\'ne tüm Türk boylarıyla anlaşılabilir', 'Sadece tek ülkede seyahat edilir', 'Diller birbirinden tamamen uzaktır', 'Eski kitaplar okunamaz'],
        correctAnswer: 'Ortak dil kökleri sayesinde Adriyatik\'ten Çin Seddi\'ne tüm Türk boylarıyla anlaşılabilir',
        explanationTr: 'Türk lehçeleri arasındaki akrabalık ve kök birliği tüm coğrafyada iletişimi mümkün kılar.',
        explanationKz: 'Ортақ түркілік тамыр.'
      },
      {
        id: 'q-16-3',
        questionTr: 'Uzaktan Türkolog eğitimini başarıyla tamamlayan bir Türkolog adayı hangi yetkinliği kazanmıştır?',
        questionKz: 'Түркітану курсын бітірген білімгер қандай нәтижеге қол жеткізеді?',
        options: ['Kazakça ses kurallarına, zengin söz varlığına, akıcı okuma ve konuşmaya tam hakimiyet', 'Yalnızca birkaç kelime bilmek', 'Hiç konuşamamak', 'Sadece alfabe ezberlemek'],
        correctAnswer: 'Kazakça ses kurallarına, zengin söz varlığına, akıcı okuma ve konuşmaya tam hakimiyet',
        explanationTr: 'Fonetik, morfolojik, edebi ve pratik Türkolog formasyonu tamamlanmıştır.',
        explanationKz: 'Толыққанды түркітанушылық білім.'
      }
    ]
  };

  const defaultQ: EvaluationQuestion[] = [
    {
      id: `q-${stageNumber}-1`,
      questionTr: `Etap ${stageNumber} temel kuralı ve kelimeleri başarıyla kavrandı mı?`,
      questionKz: `Кезең мақсаттары толық меңгерілді ме?`,
      options: ['Evet, konuyu ve kelimeleri tam olarak kavradım', 'Hayır, eksiklerim var', 'Kararsızım', 'Tekrar etmeliyim'],
      correctAnswer: 'Evet, konuyu ve kelimeleri tam olarak kavradım',
      explanationTr: 'Tebrikler, etap hedefleri tamamlandı.',
      explanationKz: 'Жарайсыз!'
    },
    {
      id: `q-${stageNumber}-2`,
      questionTr: 'Kazakçada soru eki hangisinde doğru kullanılmıştır?',
      questionKz: 'Сұраулық шылау қайсысында дұрыс?',
      options: ['Бұл кітап па?', 'Бұл кітап ма?', 'Бұл кітап ба?', 'Бұл кітап пе?'],
      correctAnswer: 'Бұл кітап па?',
      explanationTr: 'П ile biten sert kelimeden sonra «па» gelir.',
      explanationKz: 'Кітап па.'
    },
    {
      id: `q-${stageNumber}-3`,
      questionTr: 'Kazakçada şimdiki zaman tasvir fiili hangisidir?',
      questionKz: 'Қазіргі шақ көмекші етістігі қайсысы?',
      options: ['отыр / тұр / жүр / жатыр', 'келді / кетті', 'алды / берді', 'көрді / естіді'],
      correctAnswer: 'отыр / тұр / жүр / жатыр',
      explanationTr: 'Kazakçada esas anlık şimdiki zaman 4 ana tasvir fiiliyle (отыр, тұр, жүр, жатыр) kurulur.',
      explanationKz: 'Отыр, тұр, жүр, жатыр – қалып етістіктері.'
    }
  ];

  return map[stageNumber] || defaultQ;
};

export const StageQuestMapView: React.FC<StageQuestMapViewProps> = ({
  user,
  units,
  onSelectLesson,
  onOpenMatchGame,
  onNavigateTab,
  onEarnXp
}) => {
  const [stages, setStages] = useState<QuestStage[]>(() => storageService.getQuestStages(DEFAULT_STAGES));
  const [selectedStage, setSelectedStage] = useState<QuestStage | null>(null);
  const [evaluatingStage, setEvaluatingStage] = useState<QuestStage | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [lives, setLives] = useState(5);

  // Translation Game State
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  // Chest Modal State
  const [isChestOpen, setIsChestOpen] = useState(false);
  const [chestClaimed, setChestClaimed] = useState(false);
  const [energyError, setEnergyError] = useState<string | null>(null);

  const isTr = user.currentDirection === 'TR_TO_KZ';

  const handleStageClick = (stage: QuestStage) => {
    if (stage.status === 'locked') {
      audioService.playFeedbackSound('wrong');
      return;
    }

    if (stage.id.includes('chest')) {
      setSelectedStage(stage);
      setIsChestOpen(true);
      audioService.playFeedbackSound('click');
      return;
    }

    setEnergyError(null);

    // Consume 10 energy for Stage Quest
    const energyRes = storageService.consumeEnergy(10);
    if (!energyRes.success) {
      setEnergyError(energyRes.error || 'Yetersiz enerji!');
      audioService.playFeedbackSound('wrong');
      return;
    }

    setSelectedStage(stage);
    setPlacedWords([]);
    
    // CRITICAL: Always randomize / shuffle word bank tiles so they are NEVER in predictable order!
    const scrambled = shuffleWords(stage.sentencePrompt.wordBank, stage.sentencePrompt.correctOrder);
    setAvailableWords(scrambled);
    
    setIsAnswerChecked(false);
    setIsAnswerCorrect(false);
    setIsGameActive(true);
    audioService.playFeedbackSound('click');
  };

  // Play sentence audio in translation modal
  const handlePlayPromptAudio = (text: string) => {
    audioService.speak(text, 'kk', 0.85);
  };

  // Click on available word bank tile
  const handleSelectWord = (word: string, index: number) => {
    if (isAnswerChecked) return;
    setPlacedWords(prev => [...prev, word]);
    setAvailableWords(prev => prev.filter((_, idx) => idx !== index));
    audioService.playFeedbackSound('click');
  };

  // Click on placed word to return to word bank
  const handleRemoveWord = (word: string, index: number) => {
    if (isAnswerChecked) return;
    setPlacedWords(prev => prev.filter((_, idx) => idx !== index));
    setAvailableWords(prev => [...prev, word]);
    audioService.playFeedbackSound('click');
  };

  // Check assembled sentence
  const handleCheckAnswer = () => {
    if (!selectedStage || placedWords.length === 0) return;

    const targetOrder = selectedStage.sentencePrompt.correctOrder;
    const isCorrect = 
      placedWords.length === targetOrder.length &&
      placedWords.every((word, idx) => word.trim().toLowerCase() === targetOrder[idx].trim().toLowerCase());

    setIsAnswerChecked(true);
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      audioService.playFeedbackSound('correct');
      confetti({ particleCount: 50, spread: 60 });
    } else {
      audioService.playFeedbackSound('wrong');
      setLives(prev => Math.max(0, prev - 1));
    }
  };

  // Continue to next question or complete stage (triggers mandatory evaluation gatekeeper!)
  const handleContinue = () => {
    if (isAnswerCorrect && selectedStage) {
      setEvaluatingStage(selectedStage);
      setIsGameActive(false);
    }
  };

  const handlePassStageEvaluation = (stage: QuestStage) => {
    const currentIdx = stages.findIndex(s => s.id === stage.id);
    const updated = stages.map((s, idx) => {
      if (s.id === stage.id) {
        return { ...s, status: 'completed' as const, stars: 3 };
      }
      if (currentIdx !== -1 && idx === currentIdx + 1 && s.status === 'locked') {
        return { ...s, status: 'active' as const };
      }
      return s;
    });

    setStages(updated);
    storageService.saveQuestStages(updated);
    onEarnXp(50);
    setEvaluatingStage(null);
    setSelectedStage(null);
  };

  const handleReviewLessonForStage = () => {
    setEvaluatingStage(null);
    setSelectedStage(null);
    onNavigateTab('lessons');
  };

  // Resets words and gives them another attempt on the current question with scrambled tiles
  const handleRetry = () => {
    if (!selectedStage) return;
    setPlacedWords([]);
    setAvailableWords(shuffleWords(selectedStage.sentencePrompt.wordBank, selectedStage.sentencePrompt.correctOrder));
    setIsAnswerChecked(false);
    setIsAnswerCorrect(false);
    audioService.playFeedbackSound('click');
  };

  // Open Chest reward
  const handleClaimChest = () => {
    audioService.playFeedbackSound('complete');
    confetti({ particleCount: 100, spread: 80 });
    onEarnXp(100);
    setChestClaimed(true);

    if (selectedStage) {
      const currentIdx = stages.findIndex(s => s.id === selectedStage.id);
      const updated = stages.map((s, idx) => {
        if (s.id === selectedStage.id) {
          return { ...s, status: 'completed' as const, stars: 3 };
        }
        if (currentIdx !== -1 && idx === currentIdx + 1 && s.status === 'locked') {
          return { ...s, status: 'active' as const };
        }
        return s;
      });
      setStages(updated);
      storageService.saveQuestStages(updated);
    }

    setTimeout(() => {
      setIsChestOpen(false);
      setSelectedStage(null);
      onOpenMatchGame();
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-full pb-14">
      
      {/* Top Bar with Hearts, XP and Streak */}
      <div className="bg-white/95 backdrop-blur-md border-b border-teal-100 px-4 py-2.5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        
        {/* Streak */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-xs font-black text-amber-900">{user.streakDays}</span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-teal-50 rounded-full border border-teal-200">
          <Trophy className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-black text-teal-900">{user.xpPoints} XP</span>
        </div>

        {/* Lives / Energy */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 rounded-full border border-rose-200">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span className="text-xs font-black text-rose-900">{lives}</span>
        </div>
      </div>

      {/* Energy Depletion Warning */}
      {energyError && (
        <div className="m-4 p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between text-xs text-amber-950 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="text-base">⚡</span>
            <span className="font-bold">{energyError}</span>
          </div>
          <button
            onClick={() => setEnergyError(null)}
            className="text-[10px] font-black underline"
          >
            Tamam
          </button>
        </div>
      )}

      {/* Unit Level Map Header */}
      <div className="p-4 bg-gradient-to-br from-teal-700 via-cyan-700 to-teal-900 text-white rounded-b-3xl shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-white/20 rounded-md text-amber-300">
              {isTr ? `${user.currentLevel} ETAP HARİTASI` : `${user.currentLevel} КЕЗЕҢ КАРТАСЫ`}
            </span>
            <h2 className="text-base font-black text-white mt-1 leading-tight">
              {isTr ? 'Etap Etap Görevler & Oyunlar' : 'Кезең-кезеңмен ойындар'}
            </h2>
            <p className="text-[11px] text-teal-100 mt-0.5">
              {isTr ? 'Etapları tamamla, yıldızları topla ve yeni bölümlerin kilidini aç!' : 'Кезеңдерді аяқтап, жұлдыз жинаңыз және жаңа сабақтарды ашыңыз!'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
            🗺️
          </div>
        </div>

        {/* Mascot Road Guide */}
        <div className="mt-3 p-3.5 bg-gradient-to-r from-amber-50 via-white to-teal-50 border border-amber-200/80 rounded-3xl shadow-xs">
          <AlageyikMascot
            pose="guide"
            size="sm"
            message={isTr ? 'Her etaptan sonra değerlendirme sınavı seni bekliyor!' : 'Әр кезеңнен соң бағалау тесті күтуде!'}
            subMessage={isTr ? "Geçme notu %75'tir. Başarısız olursan konuyu tekrar edip yeniden dene." : 'Өту баллы 75%. Сәтсіз болса, қайталап көріңіз.'}
          />
        </div>
      </div>

      {/* Gamified Winding Roadmap */}
      <div className="flex-1 px-4 py-4 max-w-md mx-auto w-full relative">
        
        {/* Stages Stepped Path */}
        <div className="space-y-6 relative py-4">
          {stages.map((stage, idx) => {
            const isLeft = idx % 2 === 1;
            const isCompleted = stage.status === 'completed';
            const isActive = stage.status === 'active';
            const isLocked = stage.status === 'locked';
            const isChest = stage.id.includes('chest');

            return (
              <div 
                key={stage.id} 
                className={`flex flex-col items-center transition relative ${
                  isLeft ? '-translate-x-6' : 'translate-x-6'
                }`}
              >
                {/* Node Button */}
                <div className="relative group">
                  {/* Pulsing ring for active current stage */}
                  {isActive && (
                    <div className="absolute -inset-2 rounded-full bg-teal-500/25 animate-ping duration-1000" />
                  )}

                  <button
                    onClick={() => handleStageClick(stage)}
                    disabled={isLocked}
                    className={`relative z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all shadow-lg active:scale-95 ${
                      isCompleted 
                        ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/30' 
                        : isActive
                        ? isChest
                          ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-white shadow-amber-500/30 ring-4 ring-amber-200 animate-bounce'
                          : 'bg-gradient-to-tr from-teal-600 to-cyan-500 text-white shadow-teal-600/30 ring-4 ring-teal-200'
                        : 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed border-2 border-slate-300'
                    }`}
                  >
                    {isLocked ? (
                      <Lock className="w-7 h-7 text-slate-400" />
                    ) : isCompleted ? (
                      <Check className="w-8 h-8 stroke-[3]" />
                    ) : (
                      <span className="text-2xl">{stage.icon}</span>
                    )}

                    {/* Stage number pill */}
                    {!isChest && (
                      <span className={`text-[10px] font-black mt-0.5 ${
                        isLocked ? 'text-slate-400' : 'text-white'
                      }`}>
                        {isTr ? `Etap ${stage.stageNumber}` : `${stage.stageNumber}-кезең`}
                      </span>
                    )}
                  </button>

                  {/* Stars Pill underneath */}
                  {!isLocked && !isChest && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-white px-2 py-0.5 rounded-full shadow-xs border border-slate-200 z-10">
                      {[1, 2, 3].map((starIdx) => (
                        <Star 
                          key={starIdx} 
                          className={`w-3 h-3 ${
                            starIdx <= stage.stars 
                              ? 'text-amber-400 fill-amber-400' 
                              : 'text-slate-200'
                          }`} 
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Stage Label */}
                <div className="text-center mt-3 max-w-[170px]">
                  <h4 className={`text-xs font-black leading-tight ${
                    isLocked ? 'text-slate-400' : 'text-slate-900'
                  }`}>
                    {isTr ? stage.titleTr : stage.titleKz}
                  </h4>
                  <p className={`text-[10px] font-semibold mt-0.5 truncate ${
                    isLocked ? 'text-slate-400' : 'text-teal-600'
                  }`}>
                    {isTr ? stage.titleKz : stage.titleTr}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* ======================================================== */}
      {/* SCREEN 1 INTERACTIVE MODAL: "Translate this sentence" */}
      {/* ======================================================== */}
      {isGameActive && selectedStage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
            
            {/* Modal Top Bar */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setIsGameActive(false)}
                className="p-1 rounded-xl text-slate-500 hover:bg-slate-100 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="text-center">
                <span className="text-[10px] font-black uppercase text-teal-600 tracking-wider">
                  {isTr ? `Etap ${selectedStage.stageNumber} Görevi` : `${selectedStage.stageNumber}-кезең тапсырмасы`}
                </span>
                <h3 className="text-xs font-black text-slate-900">
                  {isTr ? selectedStage.titleTr : selectedStage.titleKz}
                </h3>
              </div>

              <div className="flex items-center gap-1 text-rose-500 font-bold text-xs">
                <Heart className="w-4 h-4 fill-rose-500" />
                <span>{lives}</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              
              {/* Task Title (Bi-directional translation) */}
              <h2 className="text-sm font-black text-slate-800">
                {user.currentDirection === 'KZ_TO_TR'
                  ? 'Бұл сөйлемді түрікшеге аударыңыз:'
                  : 'Bu cümlenin Türkçe karşılığını oluşturun:'}
              </h2>

              {/* Character Avatar with Speech Bubble */}
              <div className="flex items-start gap-3">
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover border-2 border-teal-500 shadow-sm shrink-0"
                />

                {/* Speech Bubble with Kazakh audio button */}
                <div className="bg-teal-50 border border-teal-200 rounded-2xl rounded-tl-none p-3 shadow-xs flex-1 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-black text-slate-900">
                      {selectedStage.sentencePrompt.kz}
                    </p>
                    <p className="text-[10px] text-teal-600 font-medium">
                      {isTr ? 'Kazakça sesli okunuş için hoparlöre dokunun' : 'Дыбыстау үшін түймені басыңыз'}
                    </p>
                  </div>
                  <button
                    onClick={() => handlePlayPromptAudio(selectedStage.sentencePrompt.kz)}
                    className="p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs transition shrink-0 ml-2"
                    title="Sesli Dinle"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Answer Slot Area (where placed words appear) */}
              <div className="min-h-[70px] p-3 rounded-2xl border-2 border-dashed border-teal-200 bg-teal-50/30 flex flex-wrap gap-2 items-center">
                {placedWords.length === 0 ? (
                  <span className="text-xs text-slate-400 italic font-medium w-full text-center">
                    {isTr 
                      ? 'Aşağıdaki kelimelere dokunarak cümleyi oluşturun...' 
                      : 'Төмендегі сөздерді басу арқылы сөйлем құраңыз...'}
                  </span>
                ) : (
                  placedWords.map((word, index) => (
                    <button
                      key={index}
                      onClick={() => handleRemoveWord(word, index)}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-rose-500 text-white text-xs font-black rounded-xl shadow-sm transition hover:scale-95"
                      title="Geri Çıkar"
                    >
                      {word}
                    </button>
                  ))
                )}
              </div>

              {/* Word Bank Chips (Guaranteed Randomly Shuffled Order) */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 block mb-2">
                  {isTr ? 'Kelime Havuzu (Karışık Sıralı):' : 'Сөздер қоры (Аралас ретпен):'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableWords.map((word, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectWord(word, index)}
                      className="px-3.5 py-2 bg-white hover:bg-teal-50 text-slate-800 border-2 border-slate-200 hover:border-teal-400 text-xs font-extrabold rounded-2xl shadow-xs transition active:scale-95"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Action / Feedback Drawer */}
            <div className={`p-4 border-t transition-all ${
              isAnswerChecked 
                ? isAnswerCorrect 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : 'bg-rose-50 border-rose-200'
                : 'bg-white border-slate-100'
            }`}>
              {isAnswerChecked ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {isAnswerCorrect ? (
                      <div className="p-1.5 bg-emerald-500 text-white rounded-full">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="p-1.5 bg-rose-500 text-white rounded-full">
                        <X className="w-5 h-5 stroke-[3]" />
                      </div>
                    )}
                    <div>
                      <h4 className={`text-sm font-black ${
                        isAnswerCorrect ? 'text-emerald-950' : 'text-rose-950'
                      }`}>
                        {isAnswerCorrect ? (isTr ? 'HARİKA! DOĞRU CEVAP' : 'КЕРЕМЕТ! ДҰРЫС') : (isTr ? 'HATA TESPİT EDİLDİ!' : 'ҚАТЕ АНЫҚТАЛДЫ!')}
                      </h4>
                      <p className={`text-xs ${
                        isAnswerCorrect ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {isAnswerCorrect 
                          ? (isTr ? 'Cümleyi başarıyla oluşturdunuz. Şimdi değerlendirme testine geçebilirsiniz.' : 'Сөйлем дұрыс құралды.')
                          : (isTr ? 'Doğru yapana kadar geçilemez! Lütfen tekrar deneyin.' : 'Дұрыс орындамайынша келесіге өтуге болмайды.')}
                      </p>
                    </div>
                  </div>

                  {/* If incorrect, show correct answer explicitly */}
                  {!isAnswerCorrect && (
                    <div className="p-2.5 bg-white rounded-xl border border-rose-200 text-xs text-rose-900">
                      <span className="font-bold">Doğru Cümle: </span>
                      <span>{selectedStage.sentencePrompt.correctOrder.join(' ')}</span>
                    </div>
                  )}

                  {isAnswerCorrect ? (
                    <button
                      onClick={handleContinue}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2"
                    >
                      <span>{isTr ? 'DEĞERLENDİRME TESTİNE GEÇ (ZORUNLU)' : 'БАҒАЛАУ ТЕСТІНЕ ӨТУ'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleRetry}
                      className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{isTr ? 'TEKRAR DENE (DOĞRU YAPANA KADAR GEÇİLEMEZ)' : 'ҚАЙТА КӨРІҢІЗ'}</span>
                    </button>
                  )}
                </div>
              ) : (
                <button
                  disabled={placedWords.length === 0}
                  onClick={handleCheckAnswer}
                  className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-black text-xs rounded-2xl shadow-md transition"
                >
                  {isTr ? 'KONTROL ET / ТЕКСЕРУ' : 'ТЕКСЕРУ'}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TREASURE CHEST MODAL */}
      {/* ======================================================== */}
      {isChestOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 text-center space-y-4 shadow-2xl">
            <div className="w-20 h-20 bg-amber-100 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-inner animate-bounce">
              🎁
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">
                {isTr ? 'Tebrikler! Hazine Sandığı Açıldı' : 'Құттықтаймыз! Қазына сандығы'}
              </h3>
              <p className="text-xs text-slate-600">
                {isTr 
                  ? 'Bozkırın kadim ödülü ve 50 Bonus XP kazandınız! Hemen hızlı kelime oyununu başlatın.' 
                  : '50 бонус ұпай ұтып алдыңыз! Сөздік ойынын бастаңыз.'}
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 font-extrabold text-sm">
              ✨ +50 Bonus XP Eklendi!
            </div>

            <button
              onClick={handleClaimChest}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-black text-xs rounded-xl shadow-md transition"
            >
              {isTr ? 'Ödülü Al ve Kelime Oyununu Başlat' : 'Сыйлықты алу'}
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MANDATORY STAGE EVALUATION GATEKEEPER MODAL */}
      {/* ======================================================== */}
      {evaluatingStage && (
        <StageEvaluationModal
          isOpen={Boolean(evaluatingStage)}
          stageTitle={isTr ? evaluatingStage.titleTr : evaluatingStage.titleKz}
          stageNumber={evaluatingStage.stageNumber}
          questions={getStageQuestions(evaluatingStage.stageNumber)}
          onPassStage={() => handlePassStageEvaluation(evaluatingStage)}
          onReviewLesson={handleReviewLessonForStage}
          onClose={() => setEvaluatingStage(null)}
        />
      )}

    </div>
  );
};
