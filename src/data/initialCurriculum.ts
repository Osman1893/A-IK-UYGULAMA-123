/**
 * Uzaktan Türkolog - Standard CEFR A1, A2, B1, B2 & C1 Full Academic & Conversational Curriculum
 * Prepared based on Kazakhstani Official Educational Standards and Comparative Turkic Linguistics.
 * 17 Comprehensive Units across all 5 CEFR levels with 34 in-depth lessons, authentic vocabulary,
 * comparative grammar rules, dialogues, and interactive exercises.
 */

import { Unit, UserBadge } from '../types';

export const initialUnits: Unit[] = [
  // ==========================================
  // LEVEL A1 - UNIT 1: ALFABE VE ÖZEL SESLER
  // ==========================================
  {
    id: 'unit-a1-1',
    unitNumber: 1,
    level: 'A1',
    direction: 'TR_TO_KZ',
    titleTr: 'Ünite 1: Kazak Alfabesi ve Özel Sesler',
    titleKz: '1-бөлім: Қазақ әліпбиі және төл дыбыстар',
    descriptionTr: 'Kazakçaya özgü 9 özel harf (Ә, І, Ң, Ғ, Ү, Ұ, Қ, Ө, Һ), sesletim ve alfabe temelleri.',
    descriptionKz: 'Қазақ тілінің 9 төл дыбысы (Ә, І, Ң, Ғ, Ү, Ұ, Қ, Ө, Һ) және әліпби ерекшеліктері.',
    icon: 'Sparkles',
    isPublished: true,
    version: 6,
    lessons: [
      {
        id: 'lesson-a1-1-1',
        unitId: 'unit-a1-1',
        lessonNumber: 1,
        titleTr: 'Ders 1: Kazakçanın 9 Özel Harfi ve Fonetiği',
        titleKz: '1-сабақ: Қазақ тілінің 9 төл әрпі',
        summaryTr: 'Ә, І, Ң, Ғ, Ү, Ұ, Қ, Ө, Һ harflerinin ağız hareketleri, sesletim noktaları ve örnek kelimeleri.',
        summaryKz: 'Қазақ тіліндегі төл дыбыстарды дұрыс дыбыстау және жазу үлгілері.',
        learningObjectivesTr: [
          'Kazakçaya özgü 9 özel sesi ayırt edebilme ve doğru telaffuz edebilme',
          'Kiril ve Latin harf karşılıklarını kavrama',
          'Açık e (Ә), geniz nesi (Ң) ve boğaz kaf (Қ) seslerini çıkarma'
        ],
        learningObjectivesKz: [
          'Төл дыбыстарды анық айта білу',
          'Әріптердің емлесін меңгеру'
        ],
        vocabulary: [
          {
            id: 'v-a1-1',
            kazakhCyrillic: 'Ән',
            kazakhLatin: 'Än',
            turkish: 'Şarkı / Ezgi',
            phoneticGuide: 'än (açık e sesi)',
            partOfSpeech: 'noun',
            exampleKazakh: 'Қазақтың әсем әні.',
            exampleTurkish: 'Kazakların güzel şarkısı.',
            category: 'Alfabe ve Sesler'
          },
          {
            id: 'v-a1-2',
            kazakhCyrillic: 'Ғалым',
            kazakhLatin: 'Ğalym',
            turkish: 'Bilim insanı / Âlim',
            phoneticGuide: 'ğa-lym (derin boğaz ğ)',
            partOfSpeech: 'noun',
            exampleKazakh: 'Ол – белгілі қазақ ғалымы.',
            exampleTurkish: 'O, tanınmış bir Kazak bilim insanıdır.',
            category: 'Alfabe ve Sesler'
          },
          {
            id: 'v-a1-3',
            kazakhCyrillic: 'Қазақ',
            kazakhLatin: 'Qazaq',
            turkish: 'Kazak',
            phoneticGuide: 'qa-zaq (kalın boğaz k)',
            partOfSpeech: 'noun',
            exampleKazakh: 'Қазақ халқы өте қонақжай.',
            exampleTurkish: 'Kazak halkı çok misafirperverdir.',
            category: 'Alfabe ve Sesler'
          },
          {
            id: 'v-a1-4',
            kazakhCyrillic: 'Жаңа',
            kazakhLatin: 'Jaña',
            turkish: 'Yeni',
            phoneticGuide: 'ja-ña (geniz n sesi)',
            partOfSpeech: 'adj',
            exampleKazakh: 'Жаңа кітап оқыдым.',
            exampleTurkish: 'Yeni kitap okudum.',
            category: 'Alfabe ve Sesler'
          },
          {
            id: 'v-a1-5',
            kazakhCyrillic: 'Үй',
            kazakhLatin: 'Üy',
            turkish: 'Ev',
            phoneticGuide: 'üy (ince yuvarlak ü)',
            partOfSpeech: 'noun',
            exampleKazakh: 'Біздің үй кең әрі жарық.',
            exampleTurkish: 'Bizim evimiz geniş ve aydınlıktır.',
            category: 'Alfabe ve Sesler'
          }
        ],
        grammar: {
          titleTr: 'Kazakça ve Türkiye Türkçesi Ses Uyumu Karşılaştırması',
          titleKz: 'Қазақ және түрік тілдеріндегі дыбыс үндестігі',
          explanationTr: 'Kazakçada kalınlık-incelik uyumu Türkçeye göre çok daha katıdır. Kelime kalın ünlüyle (А, О, Ұ, Ы) başlarsa bütün ekler kalın; ince ünlüyle (Ә, Ө, Ү, І, Е) başlarsa ekler ince gelir.',
          explanationKz: 'Жуан және жіңішке дауыстылардың үндестік заңы сөздер мен қосымшаларда қатаң сақталады.',
          rules: [
            {
              id: 'r-a1-1',
              titleTr: 'Kalın Ünlüler Kuralı',
              titleKz: 'Жуан дауыстылар',
              trPattern: 'a, ı, o, u ➔ Kalın ekler (-lar, -da, -dan)',
              kzPattern: 'а, о, ұ, ы ➔ Жуан жалғаулар (-лар, -да, -дан)',
              explanationTr: 'Kalın kökler sadece kalın ek alır: Бала + лар = Балалар (Çocuklar).',
              explanationKz: 'Бала сөзіне жуан -лар жалғанады.'
            }
          ],
          examples: [
            {
              kazakh: 'Балалар мектепке барды.',
              turkish: 'Çocuklar okula gitti.',
              breakdown: 'Бала-лар (kalın uyum) + мектеп-ке (ince uyum) + бар-ды'
            }
          ],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-a1-1',
          titleTr: 'Sınıfta Harflerin Okunuşu',
          titleKz: 'Сыныптағы әріптердің дыбысталуы',
          contextTr: 'Öğretmen ve öğrenci Kazakça özel harfleri telaffuz ediyor.',
          contextKz: 'Мұғалім мен оқушы төл дыбыстарды үйренуде.',
          lines: [
            {
              id: 'dl-a1-1',
              speaker: 'Ұстаз',
              avatar: '👩‍🏫',
              kazakh: '«Қазақ» сөзін бірге қайталайық: Қа-зақ.',
              turkish: '«Kazak» kelimesini birlikte tekrarlayalım: Ka-zak.'
            },
            {
              id: 'dl-a1-2',
              speaker: 'Оқушы',
              avatar: '🧑‍🎓',
              kazakh: 'Қазақ! «Қ» дыбысы көмейден шығады екен.',
              turkish: 'Kazak! «Q» sesi boğazdan çıkıyormuş.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-a1-1',
            type: 'multiple_choice',
            questionTr: 'Kazakçadaki "Қ" harfinin doğru artikülasyonu nasıldır?',
            questionKz: '«Қ» әрпі қалай дыбысталады?',
            options: [
              'Boğazdan derin çıkan kalın patlamalı k sesi',
              'Ön damak ince k sesi',
              'Genizden gelen burun sesi',
              'Yumuşak g sesi'
            ],
            correctAnswer: 'Boğazdan derin çıkan kalın patlamalı k sesi',
            explanationTr: 'Doğru! «Қ» kalın ünlülerle hecelenen derin boğaz sesidir.',
            explanationKz: 'Дұрыс! «Қ» — қатаң көмей дыбысы.',
            points: 10
          }
        ],
        isPublished: true
      },
      {
        id: 'lesson-a1-1-2',
        unitId: 'unit-a1-1',
        lessonNumber: 2,
        titleTr: 'Ders 2: Büyük ve Küçük Ses Uyumu (Үндестік заңы)',
        titleKz: '2-сабақ: Үндестік заңы және буын түрлері',
        summaryTr: 'Dudak ve damak uyumu, çoğul eklerinin (-лар/-лер, -дар/-дер, -тар/-тер) değişimi.',
        summaryKz: 'Буын үндестігі және көптік жалғауларының заңдылықтары.',
        learningObjectivesTr: ['Kelime sonuna göre doğru çoğul ekini seçebilme', 'Sert ve yumuşak ünsüzleri ayırt edebilme'],
        learningObjectivesKz: ['Көптік жалғауларын қатесіз жалғау'],
        vocabulary: [
          {
            id: 'v-a1-6',
            kazakhCyrillic: 'Кітап',
            kazakhLatin: 'Kіtap',
            turkish: 'Kitap',
            phoneticGuide: 'ki-tap',
            partOfSpeech: 'noun',
            exampleKazakh: 'Кітап – білім бұлағы.',
            exampleTurkish: 'Kitap, bilgi pınarıdır.',
            category: 'Eşyalar'
          },
          {
            id: 'v-a1-7',
            kazakhCyrillic: 'Дәптер',
            kazakhLatin: 'Däpter',
            turkish: 'Defter',
            phoneticGuide: 'däp-ter',
            partOfSpeech: 'noun',
            exampleKazakh: 'Мен жаңа дәптер сатып алдым.',
            exampleTurkish: 'Ben yeni bir defter satın aldım.',
            category: 'Eşyalar'
          }
        ],
        grammar: {
          titleTr: 'Kazakçada Çoğul Ekinin 6 Varyantı',
          titleKz: 'Көптік жалғауының 6 түрі',
          explanationTr: 'Son ses ünlü veya r, l, y, w ise: -лар/-лер; z, j ise: -дар/-дер; sert ünsüz (p, f, k, q, t, s, ş) ise: -тар/-тер.',
          explanationKz: 'Көптік жалғаулары дыбыс үндестігіне бағынады.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-a1-2',
          titleTr: 'Kütüphanede Kitap Seçimi',
          titleKz: 'Кітапханада',
          contextTr: 'Öğrenci kütüphaneden kitap istiyor.',
          contextKz: 'Оқушы кітап алып жатыр.',
          lines: [
            {
              id: 'dl-a1-2-1',
              speaker: 'Оқушы',
              avatar: '🧑‍🎓',
              kazakh: 'Маған қазақша кітаптар керек.',
              turkish: 'Bana Kazakça kitaplar lazım.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-a1-2',
            type: 'multiple_choice',
            questionTr: '«Кітап» kelimesinin çoğul hali hangisidir?',
            questionKz: '«Кітап» сөзіне қай көптік жалғауы қосылады?',
            options: ['Кітаптар', 'Кітаплар', 'Кітапдар', 'Кітаптер'],
            correctAnswer: 'Кітаптар',
            explanationTr: 'Doğru! «П» sert ünsüz olduğu için -тар eki gelir.',
            explanationKz: 'Дұрыс! Қатаң п дыбысынан кейін -тар жалғанады.',
            points: 10
          }
        ],
        isPublished: true
      }
    ]
  },

  // ==========================================
  // LEVEL A1 - UNIT 2: TANIŞMA VE SELAMLAŞMA
  // ==========================================
  {
    id: 'unit-a1-2',
    unitNumber: 2,
    level: 'A1',
    direction: 'TR_TO_KZ',
    titleTr: 'Ünite 2: Tanışma ve Nerelisin?',
    titleKz: '2-бөлім: Танысу және қай елденсіз?',
    descriptionTr: 'Kendini tanıtma, meslekler, ülke ve millet isimleri, ayrılma hali (-дан/-ден).',
    descriptionKz: 'Өзін таныстыру, мамандықтар, ел атаулары және шығыс септігі.',
    icon: 'User',
    isPublished: true,
    version: 6,
    lessons: [
      {
        id: 'lesson-a1-2-1',
        unitId: 'unit-a1-2',
        lessonNumber: 1,
        titleTr: 'Ders 1: Tanışma ve İsim Sorma',
        titleKz: '1-сабақ: Танысу және есімін сұрау',
        summaryTr: '«Сіздің атыңыз кім?», «Менің атым...» kalıpları ve nezaket ifadeleri.',
        summaryKz: 'Есім сұрау және жауап беру үлгілері.',
        learningObjectivesTr: ['Kazakça ismini söyleyebilme ve karşısındakine adını nezaketle sorabilme'],
        learningObjectivesKz: ['Өз атын таныстыра білу'],
        vocabulary: [
          {
            id: 'v-a1-8',
            kazakhCyrillic: 'Атыңыз кім?',
            kazakhLatin: 'Atyñyz kіm?',
            turkish: 'Adınız nedir? (Saygılı)',
            phoneticGuide: 'a-ty-nyz kim',
            partOfSpeech: 'phrase',
            exampleKazakh: 'Кешіріңіз, сіздің атыңыз кім?',
            exampleTurkish: 'Affedersiniz, adınız nedir?',
            category: 'Tanışma'
          },
          {
            id: 'v-a1-9',
            kazakhCyrillic: 'Танысқаныма қуаныштымын',
            kazakhLatin: 'Tanysqanyma qwanyştymyn',
            turkish: 'Tanıştığıma memnun oldum',
            phoneticGuide: 'ta-nys-qa-ny-ma qua-nyş-ty-myn',
            partOfSpeech: 'phrase',
            exampleKazakh: 'Сізбен танысқаныма өте қуаныштымын!',
            exampleTurkish: 'Sizinle tanıştığıma çok memnun oldum!',
            category: 'Tanışma'
          }
        ],
        grammar: {
          titleTr: 'İyelik Ekli İsim Sorma Kalıbı',
          titleKz: 'Тәуелдік жалғауымен сұрау',
          explanationTr: 'Ат (ad) + ыңыз (sizin) = Атыңыз кім? (Adınız kim/nedir?)',
          explanationKz: 'Сыпайы түрде есім сұрау формасы.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-a1-2-1',
          titleTr: 'Havalimanında Tanışma',
          titleKz: 'Әуежайда танысу',
          contextTr: 'İki yolcu uçakta tanışıyor.',
          contextKz: 'Ұшақтағы екі жолаушы.',
          lines: [
            {
              id: 'dl-a1-2-1a',
              speaker: 'Жан',
              avatar: '👨‍💼',
              kazakh: 'Сәлеметсіз бе! Менің атым – Жан.',
              turkish: 'Merhaba! Benim adım Can.'
            },
            {
              id: 'dl-a1-2-1b',
              speaker: 'Айбек',
              avatar: '🧑',
              kazakh: 'Сәлеметсіз бе! Менің атым – Айбек. Танысқаныма қуаныштымын!',
              turkish: 'Merhaba! Benim adım Aybek. Tanıştığıma memnun oldum!'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-a1-2-1',
            type: 'multiple_choice',
            questionTr: '«Tanıştığıma memnun oldum» ifadesinin Kazakçası hangisidir?',
            questionKz: '«Tanıştığıma memnun oldum» сөзінің қазақшасы:',
            options: ['Танысқаныма қуаныштымын', 'Қалыңыз қалай?', 'Рақмет', 'Қайырлы күн'],
            correctAnswer: 'Танысқаныма қуаныштымын',
            explanationTr: 'Doğru! «Танысқаныма қуаныштымын» tanıştığıma memnun oldum demektir.',
            explanationKz: 'Дұрыс жауап!',
            points: 10
          }
        ],
        isPublished: true
      },
      {
        id: 'lesson-a1-2-2',
        unitId: 'unit-a1-2',
        lessonNumber: 2,
        titleTr: 'Ders 2: Ülkeler, Milletler ve Nerelisin? (Қай елденсіз?)',
        titleKz: '2-сабақ: Елдер, ұлттар және қайдансыз?',
        summaryTr: '«Қайдансыз?», «Қай елден келдіңіз?», ayrılma hali (-дан/-ден, -тан/-тен) ve millet isimleri.',
        summaryKz: 'Шығыс септігі арқылы туған жерін, елін айту үлгілері.',
        learningObjectivesTr: [
          'Memleketini, yaşadığı ülkeyi ve milletini Kazakça ifade edebilme',
          'Ayrılma hali eklerini (-дан/-ден/-тан/-тен) ses uyumuna göre doğru ekleyebilme'
        ],
        learningObjectivesKz: [
          'Қай елден екенін дұрыс айту',
          'Шығыс септігінің жалғауларын меңгеру'
        ],
        vocabulary: [
          {
            id: 'v-a1-10',
            kazakhCyrillic: 'Қайдансыз?',
            kazakhLatin: 'Qaidansyz?',
            turkish: 'Nerelisiniz? / Neredensiniz?',
            phoneticGuide: 'qay-dan-syz',
            partOfSpeech: 'phrase',
            exampleKazakh: 'Сіз қайдансыз? – Мен Түркияданмын.',
            exampleTurkish: 'Siz nerelisiniz? – Ben Türkiye\'denim.',
            category: 'Ülkeler ve Tanışma'
          },
          {
            id: 'v-a1-11',
            kazakhCyrillic: 'Түркиya',
            kazakhLatin: 'Türkiya',
            turkish: 'Türkiye',
            phoneticGuide: 'tür-ki-ya',
            partOfSpeech: 'noun',
            exampleKazakh: 'Түркия – табиғаты әсем, бауырлас мемлекет.',
            exampleTurkish: 'Türkiye doğası güzel, kardeş bir devlettir.',
            category: 'Ülkeler ve Tanışma'
          },
          {
            id: 'v-a1-12',
            kazakhCyrillic: 'Қазақстан',
            kazakhLatin: 'Qazaqstan',
            turkish: 'Kazakistan',
            phoneticGuide: 'qa-zaq-stan',
            partOfSpeech: 'noun',
            exampleKazakh: 'Қазақстан – Ұлы дала елі.',
            exampleTurkish: 'Kazakistan, ulu bozkır ülkesidir.',
            category: 'Ülkeler ve Tanışma'
          },
          {
            id: 'v-a1-13',
            kazakhCyrillic: 'Қала',
            kazakhLatin: 'Qala',
            turkish: 'Şehir / Kent',
            phoneticGuide: 'qa-la',
            partOfSpeech: 'noun',
            exampleKazakh: 'Астана – бас қала.',
            exampleTurkish: 'Astana başkenttir.',
            category: 'Coğrafya'
          }
        ],
        grammar: {
          titleTr: 'Kazakçada Ayrılma Hali (Шығыс септік: -дан/-ден, -тан/-тен, -нан/-нен)',
          titleKz: 'Шығыс септігінің жалғаулары',
          explanationTr: 'Nereden gelindiğini bildirir. Ünlülerden ve r, l, y, w seslerinden sonra -дан/-ден; sert ünsüzlerden sonra -тан/-тен; geniz seslerinden (m, n, ŋ) sonra -нан/-нен gelir.',
          explanationKz: 'Қайдан? сұрағына жауап береді.',
          rules: [],
          examples: [
            {
              kazakh: 'Мен Стамбұлдан келдім.',
              turkish: 'Ben İstanbul\'dan geldim.',
              breakdown: 'Стамбұл + -дан (ayrılma hali) + келдім'
            }
          ],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-a1-2-2',
          titleTr: 'Yeni Öğrenci ile Tanışma',
          titleKz: 'Жаңа студентпен танысу',
          contextTr: 'Üniversite kampüsünde iki öğrenci sohbet ediyor.',
          contextKz: 'Университеттегі екі студент.',
          lines: [
            {
              id: 'dl-a1-2-2a',
              speaker: 'Дәурен',
              avatar: '🧑‍🎓',
              kazakh: 'Сәлем! Сен қай қаладан келдің?',
              turkish: 'Selam! Sen hangi şehirden geldin?'
            },
            {
              id: 'dl-a1-2-2b',
              speaker: 'Мұрат',
              avatar: '🧑‍💼',
              kazakh: 'Мен Анкарадан келдім. Сен ше?',
              turkish: 'Ben Ankara\'dan geldim. Sen peki?'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-a1-2-2',
            type: 'multiple_choice',
            questionTr: '«Түркия» kelimesine ayrılma hali eki getirildiğinde hangisi doğru olur?',
            questionKz: '«Түркия» сөзіне қай шығыс септігі жалғанады?',
            options: ['Түркиядан', 'Түркиятан', 'Түркияден', 'Түркиянан'],
            correctAnswer: 'Түркиядан',
            explanationTr: 'Doğru! Ünlüyle bitip kalın uyuma uyduğu için -дан eki gelir.',
            explanationKz: 'Дұрыс! Дауысты а дыбысынан кейін жуан -дан жалғанады.',
            points: 10
          }
        ],
        isPublished: true
      }
    ]
  },

  // ==========================================
  // LEVEL A1 - UNIT 3: SAYILAR, SAATLER VE ALIŞVERİŞ
  // ==========================================
  {
    id: 'unit-a1-3',
    unitNumber: 3,
    level: 'A1',
    direction: 'TR_TO_KZ',
    titleTr: 'Ünite 3: Sayılar, Saatler ve Alışveriş',
    titleKz: '3-бөлім: Сандар, уақыт және сауда',
    descriptionTr: '1-100 arası sayılar, saat sorma, fiyat sorma ve markette alışveriş kalıpları.',
    descriptionKz: 'Сан есімдер, сағатты білу және дүкенде сауда жасау.',
    icon: 'Sparkles',
    isPublished: true,
    version: 6,
    lessons: [
      {
        id: 'lesson-a1-3-1',
        unitId: 'unit-a1-3',
        lessonNumber: 1,
        titleTr: 'Ders 1: Sayılar ve Miktar Bildirme (1-100)',
        titleKz: '1-сабақ: Сан есімдер (1-100)',
        summaryTr: 'Бір, екі, үш, он, жиырма... Sayılarla nesne sayma ve miktar sorma («Қанша?», «Неше?»).',
        summaryKz: 'Есептік сан есімдер және заттарды санау.',
        learningObjectivesTr: [
          'Kazakça 1\'den 100\'e kadar sayıları doğru telaffuz edebilme',
          '«Қанша тұрады?» kalıbıyla fiyat sorabilme'
        ],
        learningObjectivesKz: ['Сандарды дұрыс айту және саудада қолдану'],
        vocabulary: [
          {
            id: 'v-a1-14',
            kazakhCyrillic: 'Бір',
            kazakhLatin: 'Bіr',
            turkish: 'Bir (1)',
            phoneticGuide: 'bir',
            partOfSpeech: 'noun',
            exampleKazakh: 'Бір күн, бір түн.',
            exampleTurkish: 'Bir gün, bir gece.',
            category: 'Sayılar'
          },
          {
            id: 'v-a1-15',
            kazakhCyrillic: 'Бес',
            kazakhLatin: 'Bes',
            turkish: 'Beş (5)',
            phoneticGuide: 'bes',
            partOfSpeech: 'noun',
            exampleKazakh: 'Бес саусақ бірдей емес.',
            exampleTurkish: 'Beş parmak bir değildir.',
            category: 'Sayılar'
          },
          {
            id: 'v-a1-16',
            kazakhCyrillic: 'Он',
            kazakhLatin: 'On',
            turkish: 'On (10)',
            phoneticGuide: 'on',
            partOfSpeech: 'noun',
            exampleKazakh: 'Он теңге.',
            exampleTurkish: 'On tenge.',
            category: 'Sayılar'
          },
          {
            id: 'v-a1-17',
            kazakhCyrillic: 'Жүз',
            kazakhLatin: 'Jüz',
            turkish: 'Yüz (100)',
            phoneticGuide: 'jüz',
            partOfSpeech: 'noun',
            exampleKazakh: 'Жүз дос тапқан абзал.',
            exampleTurkish: 'Yüz dost bulmak hayırlıdır.',
            category: 'Sayılar'
          },
          {
            id: 'v-a1-18',
            kazakhCyrillic: 'Қанша тұрады?',
            kazakhLatin: 'Qanşa tūrady?',
            turkish: 'Ne kadar? / Fiyatı kaç?',
            phoneticGuide: 'qan-şa tu-ra-dy',
            partOfSpeech: 'phrase',
            exampleKazakh: 'Бұл нан қанша тұрады?',
            exampleTurkish: 'Bu ekmek ne kadar?',
            category: 'Alışveriş'
          }
        ],
        grammar: {
          titleTr: 'Kazakçada Sayılardan Sonra Çoğul Eki Gelmez Kuralı',
          titleKz: 'Сан есімнен кейінгі зат есімнің жекеше тұруы',
          explanationTr: 'Türkçede olduğu gibi Kazakçada da sayı sıfatlarından sonra gelen isimler TEKİL kalır: Бес кітап (Beş kitap, *бес кітаптар değil).',
          explanationKz: 'Сандардан кейін көптік жалғауы жалғанбайды.',
          rules: [],
          examples: [
            {
              kazakh: 'Үш алма сатып алдым.',
              turkish: 'Üç elma satın aldım.',
              breakdown: 'Үш (3) + алма (elma - tekil) + сатып алдым'
            }
          ],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-a1-3-1',
          titleTr: 'Pazarda Meyve Alışverişi',
          titleKz: 'Базарда сауда жасау',
          contextTr: 'Alıcı pazarcıdan elma fiyatı soruyor.',
          contextKz: 'Базардағы саудагер мен сатып алушы.',
          lines: [
            {
              id: 'dl-a1-3-1a',
              speaker: 'Сатып алушы',
              avatar: '🛍️',
              kazakh: 'Сәлеметсіз бе! Мына алмалардың келісі қанша тұрады?',
              turkish: 'Merhaba! Şu elmaların kilosu kaç para?'
            },
            {
              id: 'dl-a1-3-1b',
              speaker: 'Сатушы',
              avatar: '🍎',
              kazakh: 'Сәлеметсіз бе! Бір келісі – бес жүз теңге.',
              turkish: 'Merhaba! Bir kilosu beş yüz tenge.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-a1-3-1',
            type: 'multiple_choice',
            questionTr: 'Kazakçada «On tenge» nasıl ifade edilir?',
            questionKz: '«10 tenge» қалай жазылады?',
            options: ['Он теңге', 'Бес теңге', 'Жүз теңге', 'Бір теңге'],
            correctAnswer: 'Он теңге',
            explanationTr: 'Doğru! «Он» Kazakçada 10 demektir.',
            explanationKz: 'Дұрыс! 10 = Он.',
            points: 10
          }
        ],
        isPublished: true
      },
      {
        id: 'lesson-a1-3-2',
        unitId: 'unit-a1-3',
        lessonNumber: 2,
        titleTr: 'Ders 2: Saat Kaç? ve Günün Vakitleri',
        titleKz: '2-сабақ: Сағат неше? және тәулік мезгілдері',
        summaryTr: '«Сағат неше?», «Сағат нешеде?», sabah, öğle, akşam ve gece zaman kalıpları.',
        summaryKz: 'Сағатты сұрау және жауап беру.',
        learningObjectivesTr: ['Kazakça saatleri ve randevu zamanlarını doğru söyleyebilme'],
        learningObjectivesKz: ['Уақытты дұрыс айту'],
        vocabulary: [
          {
            id: 'v-a1-19',
            kazakhCyrillic: 'Сағат неше?',
            kazakhLatin: 'Sağat neşe?',
            turkish: 'Saat kaç?',
            phoneticGuide: 'sa-ğat ne-şe',
            partOfSpeech: 'phrase',
            exampleKazakh: 'Кешіріңіз, қазір сағат неше?',
            exampleTurkish: 'Affedersiniz, şimdi saat kaç?',
            category: 'Zaman'
          },
          {
            id: 'v-a1-20',
            kazakhCyrillic: 'Таңертең',
            kazakhLatin: 'Tañerteñ',
            turkish: 'Sabahleyin',
            phoneticGuide: 'ta-ñer-teñ',
            partOfSpeech: 'noun',
            exampleKazakh: 'Таңертең ерте тұрамын.',
            exampleTurkish: 'Sabahleyin erken kalkarım.',
            category: 'Zaman'
          },
          {
            id: 'v-a1-21',
            kazakhCyrillic: 'Кеш',
            kazakhLatin: 'Keş',
            turkish: 'Akşam / Geç',
            phoneticGuide: 'keş',
            partOfSpeech: 'noun',
            exampleKazakh: 'Кешкі асты бірге ішейік.',
            exampleTurkish: 'Akşam yemeğini birlikte yiyelim.',
            category: 'Zaman'
          }
        ],
        grammar: {
          titleTr: 'Kazakçada Zaman Bildirme ve Bulunma Hali (-да/-де)',
          titleKz: 'Жатыс септігі арқылы уақытты білдіру',
          explanationTr: '«Saat kaçta?» sorusuna cevap verirken saat sayısına bulunma hali (-да/-де/-та/-те) eklenir: Сағат бесте (Saat beşte).',
          explanationKz: 'Уақыт мезгілін жатыс септігімен айту.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-a1-3-2',
          titleTr: 'Randevu Saati Kararlaştırma',
          titleKz: 'Кездесу уақыты',
          contextTr: 'İki iş arkadaşı görüşme saati belirliyor.',
          contextKz: 'Екі әріптес кездесу уақытын белгілеуде.',
          lines: [
            {
              id: 'dl-a1-3-2a',
              speaker: 'Айгүл',
              avatar: '👩',
              kazakh: 'Бүгін сағат нешеде кездесеміз?',
              turkish: 'Bugün saat kaçta buluşuyoruz?'
            },
            {
              id: 'dl-a1-3-2b',
              speaker: 'Ерлан',
              avatar: '👨',
              kazakh: 'Сағat үште кездесейік.',
              turkish: 'Saat üçte buluşalım.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-a1-3-2',
            type: 'multiple_choice',
            questionTr: '«Saat beşte» ifadesinin Kazakça karşılığı nedir?',
            questionKz: '«Saat beşte» сөзінің қазақшасы:',
            options: ['Сағат бесте', 'Сағат беспен', 'Сағат бес', 'Сағат бестен'],
            correctAnswer: 'Сағат бесте',
            explanationTr: 'Doğru! Бес kelimesine sert ünsüz sonrası ince -те eki gelir: Сағат бесте.',
            explanationKz: 'Дұрыс жауап: Сағат бесте.',
            points: 10
          }
        ],
        isPublished: true
      }
    ]
  },

  // ==========================================
  // LEVEL A1 - UNIT 4: AİLE VE AKRABALIK BAĞLARI
  // ==========================================
  {
    id: 'unit-a1-4',
    unitNumber: 4,
    level: 'A1',
    direction: 'TR_TO_KZ',
    titleTr: 'Ünite 4: Aile ve Kazak Soy Ağacı',
    titleKz: '4-бөлім: Отбасы және жеті ата',
    descriptionTr: 'Aile fertleri, akrabalık terimleri, Kazak kültüründe 7 ata bilinci ve iyelik zamirleri.',
    descriptionKz: 'Отбасы мүшелері, туыстық атаулар және қазақтың жеті ата ұғымы.',
    icon: 'Heart',
    isPublished: true,
    version: 6,
    lessons: [
      {
        id: 'lesson-a1-4-1',
        unitId: 'unit-a1-4',
        lessonNumber: 1,
        titleTr: 'Ders 1: Çekirdek Aile Bireyleri',
        titleKz: '1-сабақ: Жақын туыстар және отбасы',
        summaryTr: 'Әке (baba), шеше/ана (anne), аға (ağabey), апа/әпке (abla), қарындас (kız kardeş).',
        summaryKz: 'Отбасы мүшелерінің атаулары.',
        learningObjectivesTr: ['Ailesini ve yakın akrabalarını Kazakça terimlerle tanıtabilme'],
        learningObjectivesKz: ['Отбасын таныстыра білу'],
        vocabulary: [
          {
            id: 'v-a1-22',
            kazakhCyrillic: 'Отбасы',
            kazakhLatin: 'Otbasy',
            turkish: 'Aile / Ocak',
            phoneticGuide: 'ot-ba-sy',
            partOfSpeech: 'noun',
            exampleKazakh: 'Біздің отбасымыз үлкен.',
            exampleTurkish: 'Bizim ailemiz geniştir.',
            category: 'Aile'
          },
          {
            id: 'v-a1-23',
            kazakhCyrillic: 'Әке',
            kazakhLatin: 'Äke',
            turkish: 'Baba',
            phoneticGuide: 'ä-ke',
            partOfSpeech: 'noun',
            exampleKazakh: 'Менің әкем – инженер.',
            exampleTurkish: 'Benim babam mühendistir.',
            category: 'Aile'
          },
          {
            id: 'v-a1-24',
            kazakhCyrillic: 'Ана',
            kazakhLatin: 'Ana',
            turkish: 'Anne',
            phoneticGuide: 'a-na',
            partOfSpeech: 'noun',
            exampleKazakh: 'Анам дәмді бауырсақ пісірді.',
            exampleTurkish: 'Annem lezzetli baursak pişirdi.',
            category: 'Aile'
          },
          {
            id: 'v-a1-25',
            kazakhCyrillic: 'Қарындас',
            kazakhLatin: 'Qaryndas',
            turkish: 'Kız kardeş (Erkeğin kız kardeşi)',
            phoneticGuide: 'qa-ryn-das',
            partOfSpeech: 'noun',
            exampleKazakh: 'Қарындасым мектепте оқиды.',
            exampleTurkish: 'Kız kardeşim okulda okuyor.',
            category: 'Aile'
          }
        ],
        grammar: {
          titleTr: 'Kazakçada İyelik Ekleri (Менің, Сенің, Сіздің)',
          titleKz: 'Тәуелдік жалғаулары',
          explanationTr: 'Benim: Менің әке-м (Babam). Senin: Сенің әке-ң (Baban). Sizin (saygılı): Сіздің әке-ңіз (Babanız).',
          explanationKz: 'Тәуелдік жалғаулары жаққа қарай өзгереді.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-a1-4-1',
          titleTr: 'Fotoğraftaki Aileyi Tanıtma',
          titleKz: 'Суреттегі отбасы',
          contextTr: 'Öğrenci arkadaşına aile albümünü gösteriyor.',
          contextKz: 'Досына отбасын көрсету.',
          lines: [
            {
              id: 'dl-a1-4-1a',
              speaker: 'Тимур',
              avatar: '👦',
              kazakh: 'Мынау кім? – Бұл менің үлкен ағам.',
              turkish: 'Şu kim? – Bu benim büyük ağabeyim.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-a1-4-1',
            type: 'multiple_choice',
            questionTr: 'Kazakçada erkeğin kız kardeşine hitap ederken kullanılan kelime hangisidir?',
            questionKz: 'Ер адамның қыз бауыры қалай аталады?',
            options: ['Қарындас', 'Сіңлі', 'Апа', 'Бауыр'],
            correctAnswer: 'Қарындас',
            explanationTr: 'Doğru! Bir erkeğin kız kardeşine Kazakçada «қарындас» denir; kadının kız kardeşine ise «сіңлі» denir.',
            explanationKz: 'Дұрыс! Ер бауыры үшін «қарындас» болады.',
            points: 10
          }
        ],
        isPublished: true
      },
      {
        id: 'lesson-a1-4-2',
        unitId: 'unit-a1-4',
        lessonNumber: 2,
        titleTr: 'Ders 2: Kazak Kültüründe Yedi Ata (Жеті ата) Geleneği',
        titleKz: '2-сабақ: Қазақтың «Жеті ата» салты',
        summaryTr: 'Kazak töresinde 7 kuşak ecdat bilinci: Бала, әке, ата, арғы ата, баба, түп ата, тек.',
        summaryKz: 'Жеті ата ұғымы және тектілік.',
        learningObjectivesTr: ['Kazak soy kütüğü terminolojisini ve akrabalık derecelerini kavrama'],
        learningObjectivesKz: ['Жеті ата шежіресін білу'],
        vocabulary: [
          {
            id: 'v-a1-26',
            kazakhCyrillic: 'Жеті ата',
            kazakhLatin: 'Jetі ata',
            turkish: 'Yedi ata / Yedi kuşak cet',
            phoneticGuide: 'je-ti a-ta',
            partOfSpeech: 'phrase',
            exampleKazakh: 'Жеті атасын білген ұл – текті.',
            exampleTurkish: 'Yedi atasını bilen çocuk soyludur.',
            category: 'Kültür'
          },
          {
            id: 'v-a1-27',
            kazakhCyrillic: 'Ата',
            kazakhLatin: 'Ata',
            turkish: 'Dede / Ata',
            phoneticGuide: 'a-ta',
            partOfSpeech: 'noun',
            exampleKazakh: 'Атам маған ақ батасын берді.',
            exampleTurkish: 'Dedem bana ak hayır duasını verdi.',
            category: 'Aile'
          },
          {
            id: 'v-a1-28',
            kazakhCyrillic: 'Әже',
            kazakhLatin: 'Äje',
            turkish: 'Nine / Babaanne / Anneanne',
            phoneticGuide: 'ä-je',
            partOfSpeech: 'noun',
            exampleKazakh: 'Әжем ертегі айтып берді.',
            exampleTurkish: 'Ninem masal anlattı.',
            category: 'Aile'
          }
        ],
        grammar: {
          titleTr: 'Kültürel Dil Bilgisi: Hitap Sözcükleri ve Saygı İfadeleri',
          titleKz: 'Сыйластық сөздері',
          explanationTr: 'Kazakçada büyüklere «Аға» (ağabey/amca) ve «Апа/Тәте» (abla/teyze) şeklinde saygıyla hitap edilir.',
          explanationKz: 'Үлкендерге құрмет білдіру үлгілері.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-a1-4-2',
          titleTr: 'Dededen Toruna Nasihat',
          titleKz: 'Ата өсиеті',
          contextTr: 'Dede torununa ecdatlarını anlatıyor.',
          contextKz: 'Атасы немересіне шежіре үйретуде.',
          lines: [
            {
              id: 'dl-a1-4-2a',
              speaker: 'Ата',
              avatar: '👴',
              kazakh: 'Балам, жеті атаңды жаттап ал, тегіңді ұмытпа.',
              turkish: 'Yavrum, yedi atanı ezberle, soyunu unutma.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-a1-4-2',
            type: 'multiple_choice',
            questionTr: 'Kazakçada «Nine / Babaanne» anlamına gelen kelime hangisidir?',
            questionKz: '«Nine» сөзінің қазақшасы:',
            options: ['Әже', 'Ана', 'Апа', 'Қарындас'],
            correctAnswer: 'Әже',
            explanationTr: 'Doğru! «Әже» nine / büyükanne demektir.',
            explanationKz: 'Дұрыс! Әже = büyükanne.',
            points: 10
          }
        ],
        isPublished: true
      }
    ]
  },

  // ==========================================
  // LEVEL A1 - UNIT 5: GÜNLÜK HAYAT VE ZAMAN
  // ==========================================
  {
    id: 'unit-a1-5',
    unitNumber: 5,
    level: 'A1',
    direction: 'TR_TO_KZ',
    titleTr: 'Ünite 5: Günlük Hayat ve Rutinler',
    titleKz: '5-бөлім: Күнделікті өмір және дағдылар',
    descriptionTr: 'Günün bölümleri, haftanın günleri, günlük fiiller ve şimdiki zaman temelleri.',
    descriptionKz: 'Апта күндері, күнделікті іс-әрекеттер және етістіктер.',
    icon: 'Activity',
    isPublished: true,
    version: 6,
    lessons: [
      {
        id: 'lesson-a1-5-1',
        unitId: 'unit-a1-5',
        lessonNumber: 1,
        titleTr: 'Ders 1: Haftanın Günleri ve Zaman Planı',
        titleKz: '1-сабақ: Апта күндері',
        summaryTr: 'Дүйсенбі (pazartesi), Сейсенбі (salı), Сәрсенбі (çarşamba)... Haftalık program yapma.',
        summaryKz: 'Апта күндерін үйрену.',
        learningObjectivesTr: ['Kazakça haftanın 7 gününü eksiksiz sayabilme ve plan yapabilme'],
        learningObjectivesKz: ['Апта күндерін меңгеру'],
        vocabulary: [
          {
            id: 'v-a1-29',
            kazakhCyrillic: 'Дүйсенбі',
            kazakhLatin: 'Düysembі',
            turkish: 'Pazartesi',
            phoneticGuide: 'düy-sem-bi',
            partOfSpeech: 'noun',
            exampleKazakh: 'Дүйсенбіде сабақ басталады.',
            exampleTurkish: 'Pazartesi günü ders başlar.',
            category: 'Günler'
          },
          {
            id: 'v-a1-30',
            kazakhCyrillic: 'Жұма',
            kazakhLatin: 'Jūma',
            turkish: 'Cuma',
            phoneticGuide: 'ju-ma',
            partOfSpeech: 'noun',
            exampleKazakh: 'Жұма – берекелі күн.',
            exampleTurkish: 'Cuma, bereketli bir gündür.',
            category: 'Günler'
          },
          {
            id: 'v-a1-31',
            kazakhCyrillic: 'Жексенбі',
            kazakhLatin: 'Jeksembі',
            turkish: 'Pazar',
            phoneticGuide: 'jek-sem-bi',
            partOfSpeech: 'noun',
            exampleKazakh: 'Жексенбіде демаламыз.',
            exampleTurkish: 'Pazar günü dinleniyoruz.',
            category: 'Günler'
          }
        ],
        grammar: {
          titleTr: 'Gün Adlarına Zaman Eki Getirme',
          titleKz: 'Мезгіл мәнді сөздер',
          explanationTr: 'Kazakçada haftanın gününde yapılan işler bulunma hali (-де) veya yalın halde söylenir: Дүйсенбіде (Pazartesi günü).',
          explanationKz: 'Күндерге жалғанатын жалғаулар.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-a1-5-1',
          titleTr: 'Hafta Sonu Planı',
          titleKz: 'Демалыс жоспары',
          contextTr: 'İki arkadaş hafta sonu ne yapacaklarını konuşuyor.',
          contextKz: 'Екі дос демалыс туралы сөйлесуде.',
          lines: [
            {
              id: 'dl-a1-5-1a',
              speaker: 'Әлішер',
              avatar: '🏃',
              kazakh: 'Сен сенбіде не істейсің?',
              turkish: 'Sen cumartesi günü ne yapacaksın?'
            },
            {
              id: 'dl-a1-5-1b',
              speaker: 'Бауыржан',
              avatar: '⚽',
              kazakh: 'Сенбіде футбол ойнаймын.',
              turkish: 'Cumartesi günü futbol oynayacağım.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-a1-5-1',
            type: 'multiple_choice',
            questionTr: 'Kazakçada «Pazartesi» gününün karşılığı hangisidir?',
            questionKz: '«Pazartesi» күнінің қазақшасы:',
            options: ['Дүйсенбі', 'Сейсенбі', 'Жұма', 'Сәрсенбі'],
            correctAnswer: 'Дүйсенбі',
            explanationTr: 'Doğru! Pazartesi = Дүйсенбі.',
            explanationKz: 'Дұрыс! Pazartesi = Дүйсенбі.',
            points: 10
          }
        ],
        isPublished: true
      },
      {
        id: 'lesson-a1-5-2',
        unitId: 'unit-a1-5',
        lessonNumber: 2,
        titleTr: 'Ders 2: Günlük Fiiller ve Basit Cümleler',
        titleKz: '2-сабақ: Күнделікті етістіктер',
        summaryTr: 'Тұру (kalkmak), тамақтану (yemek yemek), бару (gitmek), келу (gelmek), ұйықтау (uyumak).',
        summaryKz: 'Негізгі етістіктерді қолдану.',
        learningObjectivesTr: ['Günlük temel eylemleri basit Kazakça cümlelerle anlatabilme'],
        learningObjectivesKz: ['Күнделікті әрекеттерді айту'],
        vocabulary: [
          {
            id: 'v-a1-32',
            kazakhCyrillic: 'Бару',
            kazakhLatin: 'Barw',
            turkish: 'Gitmek',
            phoneticGuide: 'ba-ru',
            partOfSpeech: 'verb',
            exampleKazakh: 'Мен мектепке барамын.',
            exampleTurkish: 'Ben okula giderim / gidiyorum.',
            category: 'Fiiller'
          },
          {
            id: 'v-a1-33',
            kazakhCyrillic: 'Келу',
            kazakhLatin: 'Kelw',
            turkish: 'Gelmek',
            phoneticGuide: 'ke-lu',
            partOfSpeech: 'verb',
            exampleKazakh: 'Үйге сағат алтыда келдім.',
            exampleTurkish: 'Eve saat altıda geldim.',
            category: 'Fiiller'
          },
          {
            id: 'v-a1-34',
            kazakhCyrillic: 'Ұйықтау',
            kazakhLatin: 'Ūiyqtaw',
            turkish: 'Uyumak',
            phoneticGuide: 'u-yq-tau',
            partOfSpeech: 'verb',
            exampleKazakh: 'Түнде жақсы ұйықтадым.',
            exampleTurkish: 'Gece iyi uyudum.',
            category: 'Fiiller'
          }
        ],
        grammar: {
          titleTr: 'Geniş Zaman / Şimdiki Zaman Eki (-а/-е/-й)',
          titleKz: 'Ауыспалы осы шақ',
          explanationTr: 'Alışkanlıkları ifade eder: Мен бара-мын (Giderim), Сен келе-сің (Gelirsin).',
          explanationKz: 'Үнемі қайталанатын әрекеттер.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-a1-5-2',
          titleTr: 'Bir Günün Özeti',
          titleKz: 'Бір күндік режім',
          contextTr: 'Öğrenci günlük rutinini anlatıyor.',
          contextKz: 'Күнделікті тәртіпті баяндау.',
          lines: [
            {
              id: 'dl-a1-5-2a',
              speaker: 'Мәдина',
              avatar: '👧',
              kazakh: 'Мен күнде таңертең ерте тұрамын, сосын сабаққа барамын.',
              turkish: 'Ben her gün sabahleyin erken kalkarım, sonra derse giderim.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-a1-5-2',
            type: 'multiple_choice',
            questionTr: '«Бару» fiilinin Türkçe anlamı nedir?',
            questionKz: '«Бару» сөзінің түрікшесі:',
            options: ['Gitmek', 'Gelmek', 'Uyumak', 'Yemek'],
            correctAnswer: 'Gitmek',
            explanationTr: 'Doğru! Бару = Gitmek.',
            explanationKz: 'Дұрыс! Бару = Gitmek.',
            points: 10
          }
        ],
        isPublished: true
      }
    ]
  },

  // ==========================================
  // LEVEL A2 - UNIT 1: TEMELLER VE SELAMLAŞMA
  // ==========================================
  {
    id: 'unit-a2-1',
    unitNumber: 1,
    level: 'A2',
    direction: 'TR_TO_KZ',
    titleTr: 'Ünite 1: Temeller ve Selamlaşma',
    titleKz: '1-бөлім: Негіздер және сәлемдесу',
    descriptionTr: 'Kendini tanıtma, selamlaşma kalıpları, kişi zamirleri ve hal hatır sorma.',
    descriptionKz: 'Өзін таныстыру, сәлемдесу үлгілері, жіктеу есімдіктері және хал-жағдай сұрау.',
    icon: 'MessageSquare',
    isPublished: true,
    version: 6,
    lessons: [
      {
        id: 'lesson-a2-1-1',
        unitId: 'unit-a2-1',
        lessonNumber: 1,
        titleTr: 'Ders 1: Selamlaşma ve Hal Hatır Sorma',
        titleKz: '1-сабақ: Сәлемдесу және хал-жағдай сұрасу',
        summaryTr: 'Günlük hayatta Kazakça selamlaşma, yaş ve resmiyet durumuna göre hitap kuralları.',
        summaryKz: 'Күнделікті өмірде қазақша сәлемдесу, жас пен ресмилікке байланысты сөйлесу қағидалары.',
        learningObjectivesTr: [
          'Kazakça resmi ve samimi selamlaşma ifadelerini ayırt edebilme',
          'Hal hatır sorma kalıplarını (Қалыңыз қалай?, Қал қалай?) doğru kullanabilme',
          'Kazak kültüründeki selamlaşma nezaket kurallarını kavrama'
        ],
        learningObjectivesKz: [
          'Қазақша ресми және еркін сәлемдесуді ажырата білу',
          'Хал-жағдай сұрау үлгілерін дұрыс қолдану'
        ],
        vocabulary: [
          {
            id: 'v-1',
            kazakhCyrillic: 'Сәлеметсіз бе!',
            kazakhLatin: 'Sälemetsiz be!',
            turkish: 'Merhaba! (Saygılı/Resmi)',
            phoneticGuide: 'se-le-met-siz be',
            partOfSpeech: 'phrase',
            exampleKazakh: 'Сәлеметсіз бе, мұғалім!',
            exampleTurkish: 'Merhaba öğretmenim!',
            category: 'Selamlaşma',
            falseFriendWarning: 'Büyüklere ve tanımadığınız kişilere "Сәлем" yerine her zaman "Сәлеметсіз бе" denir.'
          },
          {
            id: 'v-2',
            kazakhCyrillic: 'Қалыңыз қалай?',
            kazakhLatin: 'Qalyñyz qalay?',
            turkish: 'Nasılsınız? (Saygılı)',
            phoneticGuide: 'qa-ly-nyz qa-lay',
            partOfSpeech: 'phrase',
            exampleKazakh: 'Қалыңыз қалай, Асқар аға?',
            exampleTurkish: 'Nasılsınız Askar ağabey?',
            category: 'Hal Hatır'
          },
          {
            id: 'v-3',
            kazakhCyrillic: 'Жақсы, рақмет',
            kazakhLatin: 'Jaqsı, raqmet',
            turkish: 'İyi, teşekkür ederim',
            phoneticGuide: 'jaq-sy raq-met',
            partOfSpeech: 'phrase',
            exampleKazakh: 'Мен жақсымын, рақмет, өзіңіз қалайсыз?',
            exampleTurkish: 'Ben iyiyim teşekkürler, siz nasılsınız?',
            category: 'Hal Hatır'
          }
        ],
        grammar: {
          titleTr: 'Kazakçada Kişi Zamirleri ve Ek-Fiil (-мын/-мін)',
          titleKz: 'Жіктеу есімдіктері және жіктік жалғаулары',
          explanationTr: 'Kazakçada şahıs ekleri kalınlık-incelik uyumuna göre değişir.',
          explanationKz: 'Жіктік жалғаулары сөздің жуан не жіңішкелігіне қарай жалғанады.',
          rules: [
            {
              id: 'r-1',
              titleTr: '1. Tekil Şahıs Bildirme Eki',
              titleKz: '1-жақ жекеше жіктік жалғауы',
              trPattern: 'Ben öğrenci-yim / Ben Türk-üm',
              kzPattern: 'Мен оқушы-мын / Мен түрік-пін',
              explanationTr: 'Son ses ünlü veya tınlatıcı ünsüz ise -мын/-мін; ötümsüz ünsüzden sonra -пын/-пін gelir.',
              explanationKz: 'Дауысты және ұяң дыбыстардан кейін -мын/-мін, қатаң дыбыстардан кейін -пын/-пін жалғанады.'
            }
          ],
          examples: [
            {
              kazakh: 'Мен Түркияданмын.',
              turkish: 'Ben Türkiye\'denim.',
              breakdown: 'Мен (Ben) + Түркия (Türkiye) + -дан (ayrılma hali) + -мын (1. tekil şahıs eki)'
            }
          ],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-a2-1',
          titleTr: 'Havaalanında Karşılaşma',
          titleKz: 'Әуежайда кездесу',
          contextTr: 'Almatı Havalimanı\'nda iki yolcu tanışıyor.',
          contextKz: 'Алматы әуежайында екі жолаушы танысып жатыр.',
          lines: [
            {
              id: 'dl-1',
              speaker: 'Can (Жан)',
              avatar: '👨‍💼',
              kazakh: 'Сәлеметсіз бе! Менің атым – Жан.',
              turkish: 'Merhaba! Benim adım Can.'
            },
            {
              id: 'dl-2',
              speaker: 'Aydos (Айдос)',
              avatar: '🧑',
              kazakh: 'Сәлеметсіз бе, Жан! Танысқаныма қуаныштымын. Қалыңыз қалай?',
              turkish: 'Merhaba Can! Tanıştığıma memnun oldum. Nasılsınız?'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-1',
            type: 'multiple_choice',
            questionTr: 'Büyüklere veya tanımadığımız kişilere saygılı selam verirken hangisi kullanılır?',
            questionKz: 'Үлкендерге құрметпен сәлемдескенде қайсысы айтылады?',
            options: ['Сәлеметсіз бе!', 'Сәлем!', 'Қайырлы түн', 'Сау бол'],
            correctAnswer: 'Сәлеметсіз бе!',
            explanationTr: 'Doğru! «Сәлеметсіз бе!» saygılı ve resmi selamlaşma ifadesidir.',
            explanationKz: 'Дұрыс! «Сәлеметсіз бе!» сыпайы сәлемдесу сөзі.',
            points: 10
          }
        ],
        isPublished: true
      },
      {
        id: 'lesson-a2-1-2',
        unitId: 'unit-a2-1',
        lessonNumber: 2,
        titleTr: 'Ders 2: Şimdiki Zaman ve 4 Yardımcı Fiil (Жатыр, Отыр, Тұр, Жүр)',
        titleKz: '2-сабақ: Нақ осы шақ және көмекші етістіктер',
        summaryTr: 'Kazakçada anlık eylemler: Отыр (oturarak), Тұр (ayakta), Жүр (hareketli), Жатыр (uzanarak/genel).',
        summaryKz: 'Қалып етістіктері арқылы осы шақты білдіру заңдылықтары.',
        learningObjectivesTr: [
          'Kazakçanın 4 temel durumsal yardımcı fiilini (жатыр, отыр, тұр, жүр) doğru ayırt edebilme',
          '«Мен жазып отырмын», «Ол жұмыс істеп жүр» gibi anlık şimdiki zaman cümleleri kurabilme'
        ],
        learningObjectivesKz: [
          'Нақ осы шақтың 4 көмекші етістігін ажырата білу',
          'Күнделікті іс-әрекеттерді дәл сипаттау'
        ],
        vocabulary: [
          {
            id: 'v-a2-10',
            kazakhCyrillic: 'Жазу',
            kazakhLatin: 'Jazw',
            turkish: 'Yazmak',
            phoneticGuide: 'ja-zu',
            partOfSpeech: 'verb',
            exampleKazakh: 'Мен хат жазып отырмын.',
            exampleTurkish: 'Ben mektup yazıyorum (oturarak).',
            category: 'Fiiller'
          },
          {
            id: 'v-a2-11',
            kazakhCyrillic: 'Оқу',
            kazakhLatin: 'Oqw',
            turkish: 'Okumak / Öğrenim görmek',
            phoneticGuide: 'o-qu',
            partOfSpeech: 'verb',
            exampleKazakh: 'Ол кітап оқып жатыр.',
            exampleTurkish: 'O kitap okuyor.',
            category: 'Fiiller'
          },
          {
            id: 'v-a2-12',
            kazakhCyrillic: 'Күту',
            kazakhLatin: 'Kütw',
            turkish: 'Beklemek',
            phoneticGuide: 'kü-tu',
            partOfSpeech: 'verb',
            exampleKazakh: 'Мен аялдамада күтіп тұрмын.',
            exampleTurkish: 'Ben durakta bekliyorum (ayakta).',
            category: 'Fiiller'
          },
          {
            id: 'v-a2-13',
            kazakhCyrillic: 'Жұмыс істеу',
            kazakhLatin: 'Jūmys іstew',
            turkish: 'Çalışmak / İş yapmak',
            phoneticGuide: 'ju-mys is-teu',
            partOfSpeech: 'verb',
            exampleKazakh: 'Олар кеңседе жұмыс істеп жүр.',
            exampleTurkish: 'Onlar ofiste çalışıyorlar (hareketli/devamlı).',
            category: 'İş ve Fiiller'
          }
        ],
        grammar: {
          titleTr: 'Kazakçada Şimdiki Zaman Durum Fiilleri',
          titleKz: 'Қалып етістіктерінің қызметі',
          explanationTr: 'Kazakçada bir fiilin şimdiki zamanı ana fiil + -ып/-іп/-п zarf-fiili ve ardından pozisyona uygun yardımcı fiil eklenerek yapılır: 1. Отыр: Oturarak (жазып отырмын). 2. Тұр: Ayakta (күтіп тұрмын). 3. Жүр: Hareket halindeki alışkanlık (оқып жүрмін). 4. Жатыр: Uzanarak veya genel süreklilik (ұйықтап жатыр).',
          explanationKz: 'Негізгі етістікке -ып/-іп жалғанып, көмекші етістіктер қосылады.',
          rules: [],
          examples: [
            {
              kazakh: 'Сен не істеп жатырсың?',
              turkish: 'Sen ne yapıyorsun?',
              breakdown: 'Не (ne) + істе-п (yapıp) + жатыр-сың (durumdasın)'
            }
          ],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-a2-1-2',
          titleTr: 'Telefonda Ne Yapıyorsun? Sorusu',
          titleKz: 'Телефонмен сөйлесу',
          contextTr: 'İki arkadaş telefonla konuşup ne yaptıklarını soruyor.',
          contextKz: 'Телефон арқылы хал-жағдай сұрасу.',
          lines: [
            {
              id: 'dl-a2-1-2a',
              speaker: 'Асқар',
              avatar: '📱',
              kazakh: 'Алло! Арман, қазір қайдасың, не істеп отырсың?',
              turkish: 'Alo! Arman, şu an neredesin, ne yapıyorsun?'
            },
            {
              id: 'dl-a2-1-2b',
              speaker: 'Арман',
              avatar: '☕',
              kazakh: 'Сәлем! Мен кофеханада кофе ішіп отырмын. Сен ше?',
              turkish: 'Selam! Ben kafede kahve içiyorum (oturarak). Sen peki?'
            },
            {
              id: 'dl-a2-1-2c',
              speaker: 'Асқар',
              avatar: '🚶',
              kazakh: 'Мен саябақта серуендеп жүрмін.',
              turkish: 'Ben parkta yürüyüş yapıyorum (hareketli).'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-a2-1-2',
            type: 'multiple_choice',
            questionTr: 'Ayakta durarak yapılan bir eylem için (Örn: Durakta beklemek) hangi yardımcı fiil seçilir?',
            questionKz: 'Тік тұрып жасалатын әрекет үшін қай көмекші етістік қосылады?',
            options: ['Тұр (Тұрмын)', 'Отыр (Отырмын)', 'Жатыр (Жатырмын)', 'Бар'],
            correctAnswer: 'Тұр (Тұрмын)',
            explanationTr: 'Doğru! Ayakta dik pozisyonda yapılan eylemler için «тұр» (күтіп тұрмын = bekliyorum) kullanılır.',
            explanationKz: 'Дұрыс! Тік тұрған қалып үшін «тұр» етістігі қолданылады.',
            points: 15
          }
        ],
        isPublished: true
      }
    ]
  },

  // ==========================================
  // LEVEL A2 - UNIT 2: EV VE AİLE HAYATI
  // ==========================================
  {
    id: 'unit-a2-2',
    unitNumber: 2,
    level: 'A2',
    direction: 'TR_TO_KZ',
    titleTr: 'Ünite 2: Aile, Ev ve İyelik Ekleri',
    titleKz: '2-бөлім: Отбасы, үй және тәуелдік жалғаулары',
    descriptionTr: 'Aile bireyleri, ev eşyaları, iyelik ekleri (менің, сенің, сіздің, оның) ve mekan bildirme.',
    descriptionKz: 'Отбасы мүшелері, үй заттары және тәуелдік формалары.',
    icon: 'Home',
    isPublished: true,
    version: 6,
    lessons: [
      {
        id: 'lesson-a2-2-1',
        unitId: 'unit-a2-2',
        lessonNumber: 1,
        titleTr: 'Ders 1: Aile Bireyleri ve İyelik Ekleri',
        titleKz: '1-сабақ: Отбасы мүшелері және тәуелдік',
        summaryTr: 'Baba (әке), anne (ана), kardeş (бауыр/іні/қарындас) ve iyelik eklerinin doğru bağlanışı.',
        summaryKz: 'Отбасы мүшелеріне тәуелдік жалғауларын қосу.',
        learningObjectivesTr: ['Ailesini tanıtabilme ve iyelik eklerini hatasız kullanabilme'],
        learningObjectivesKz: ['Отбасы туралы әңгімелей білу'],
        vocabulary: [
          {
            id: 'v-a2-4',
            kazakhCyrillic: 'Әке',
            kazakhLatin: 'Äke',
            turkish: 'Baba',
            phoneticGuide: 'ä-ke',
            partOfSpeech: 'noun',
            exampleKazakh: 'Менің әкем – мұғалім.',
            exampleTurkish: 'Benim babam öğretmendir.',
            category: 'Aile'
          },
          {
            id: 'v-a2-5',
            kazakhCyrillic: 'Ана',
            kazakhLatin: 'Ana',
            turkish: 'Anne',
            phoneticGuide: 'a-na',
            partOfSpeech: 'noun',
            exampleKazakh: 'Ана – әлемдегі ең қымбат адам.',
            exampleTurkish: 'Anne, dünyadaki en kıymetli insandır.',
            category: 'Aile'
          },
          {
            id: 'v-a2-6',
            kazakhCyrillic: 'Бауыр',
            kazakhLatin: 'Bawyr',
            turkish: 'Kardeş',
            phoneticGuide: 'ba-wyr',
            partOfSpeech: 'noun',
            exampleKazakh: 'Біз – тату бауырлармыз.',
            exampleTurkish: 'Biz dost/kardeşleriz.',
            category: 'Aile'
          }
        ],
        grammar: {
          titleTr: 'Kazakçada Sen ve Siz İyelik Ayrımı (-ың vs -ыңыз)',
          titleKz: 'Сен және Сіз тәуелдік айырмашылығы',
          explanationTr: 'Senin baban: Әке-ң; Sizin babanız: Әке-ңіз. Damaksıl n (ң) daima korunur.',
          explanationKz: 'Сыпайы және жақын сөйлесудегі тәуелдік.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-a2-2',
          titleTr: 'Aile Albümüne Bakarken',
          titleKz: 'Отбасылық альбом',
          contextTr: 'İki arkadaş aile fotoğraflarına bakıyor.',
          contextKz: 'Екі дос суреттерді көруде.',
          lines: [
            {
              id: 'dl-a2-2a',
              speaker: 'Айдос',
              avatar: '🧑',
              kazakh: 'Бұл – менің отбасым. Мынау – әкем, мына кісі – анам.',
              turkish: 'Bu benim ailem. Şu babam, bu kişi ise annem.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-a2-2',
            type: 'multiple_choice',
            questionTr: '«Sizin babanız» ifadesinin Kazakça saygılı karşılığı hangisidir?',
            questionKz: '«Сіздің әкеңіз» дұрыс нұсқасы:',
            options: ['Әкеңіз', 'Әкең', 'Әкем', 'Әкесі'],
            correctAnswer: 'Әкеңіз',
            explanationTr: 'Doğru! Saygılı ikinci tekil şahıs iyelik eki -ңыз/-ңіз\'dir.',
            explanationKz: 'Дұрыс! Сыпайы формасы: Әкеңіз.',
            points: 10
          }
        ],
        isPublished: true
      },
      {
        id: 'lesson-a2-2-2',
        unitId: 'unit-a2-2',
        lessonNumber: 2,
        titleTr: 'Ders 2: Ev Eşyaları ve Bulunma Hali (-да/-де)',
        titleKz: '2-сабақ: Үй жиһаздары және жатыс септігі',
        summaryTr: 'Үстел (masa), орындық (sandalye), төсек (yatak), бөлме (oda) ve eşyaların yerini tarif etme.',
        summaryKz: 'Үй жиһаздарының орналасуын айту.',
        learningObjectivesTr: ['Evdeki eşyaları ve nerede bulunduklarını Kazakça tarif edebilme'],
        learningObjectivesKz: ['Заттардың орнын сипаттау'],
        vocabulary: [
          {
            id: 'v-a2-7',
            kazakhCyrillic: 'Үстел',
            kazakhLatin: 'Üstel',
            turkish: 'Masa',
            phoneticGuide: 'üs-tel',
            partOfSpeech: 'noun',
            exampleKazakh: 'Кітап үстелде жатыр.',
            exampleTurkish: 'Kitap masanın üzerinde duruyor.',
            category: 'Ev'
          },
          {
            id: 'v-a2-8',
            kazakhCyrillic: 'Бөлме',
            kazakhLatin: 'Bölme',
            turkish: 'Oda',
            phoneticGuide: 'böl-me',
            partOfSpeech: 'noun',
            exampleKazakh: 'Біздің бөлме кең әрі жарық.',
            exampleTurkish: 'Bizim odamız geniş ve aydınlıktır.',
            category: 'Ev'
          }
        ],
        grammar: {
          titleTr: 'Bulunma Hali (Жатыс септік: -да/-де, -та/-те)',
          titleKz: 'Жатыс септігі',
          explanationTr: 'Nerede? (Қайда?) sorusuna cevap verir. Үстел-де (Masada), Мектеп-те (Okulda).',
          explanationKz: 'Қайда? сұрағына жауап.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-a2-2-2',
          titleTr: 'Anahtar Nerede?',
          titleKz: 'Кілт қайда?',
          contextTr: 'Oda arkadaşları anahtarı arıyor.',
          contextKz: 'Кілтті іздеу.',
          lines: [
            {
              id: 'dl-a2-2-2a',
              speaker: 'Қанат',
              avatar: '🔑',
              kazakh: 'Кілт қайда жатыр? – Ол үстелде жатыр.',
              turkish: 'Anahtar nerede duruyor? – O masada duruyor.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-a2-2-2',
            type: 'multiple_choice',
            questionTr: '«Oda» kelimesinin Kazakçası hangisidir?',
            questionKz: '«Oda» сөзінің қазақшасы:',
            options: ['Бөлме', 'Үй', 'Есік', 'Терезе'],
            correctAnswer: 'Бөлме',
            explanationTr: 'Doğru! Бөлме = Oda.',
            explanationKz: 'Дұрыс! Бөлме = Oda.',
            points: 10
          }
        ],
        isPublished: true
      }
    ]
  },

  // ==========================================
  // LEVEL A2 - UNIT 3: KAZAK MUTFAĞI VE RESTORAN
  // ==========================================
  {
    id: 'unit-a2-3',
    unitNumber: 3,
    level: 'A2',
    direction: 'TR_TO_KZ',
    titleTr: 'Ünite 3: Kazak Mutfağı ve Restoranda Sipariş',
    titleKz: '3-бөлім: Қазақ тағамдары және мейрамхана',
    descriptionTr: 'Milli yemekler (Бесбармақ, бауырсақ, қымыз), çay kültürü, restoranda sipariş ve hesap isteme.',
    descriptionKz: 'Ұлттық тағамдар, қонақасы салты және асханада сөйлесу.',
    icon: 'Coffee',
    isPublished: true,
    version: 6,
    lessons: [
      {
        id: 'lesson-a2-3-1',
        unitId: 'unit-a2-3',
        lessonNumber: 1,
        titleTr: 'Ders 1: Kazak Milli Yemekleri ve Sofra Kültürü',
        titleKz: '1-сабақ: Ұлттық тағамдар және қонақасы',
        summaryTr: 'Бесбармақ (et yemeği), қазы (at sucuğu), қымыз (kımız), шұбат (deve sütü) ve sofra duaları (бата).',
        summaryKz: 'Қазақтың бас тағамдары мен дәстүрлері.',
        learningObjectivesTr: ['Kazak mutfağının baş yemeklerini tanıyabilme ve misafirlikte nezaket ifadelerini bilme'],
        learningObjectivesKz: ['Ұлттық тағамдарды танып, сипаттай білу'],
        vocabulary: [
          {
            id: 'v-a2-14',
            kazakhCyrillic: 'Ет (Бесбармақ)',
            kazakhLatin: 'Et (Besbarmaq)',
            turkish: 'Kazak Milli Et Yemeği (Beşparmak)',
            phoneticGuide: 'et (bes-bar-maq)',
            partOfSpeech: 'noun',
            exampleKazakh: 'Қазақтың бас тағамы – ет.',
            exampleTurkish: 'Kazakların baş yemeği beşparmak etidir.',
            category: 'Yemek'
          },
          {
            id: 'v-a2-15',
            kazakhCyrillic: 'Бауырсақ',
            kazakhLatin: 'Bawyrsaq',
            turkish: 'Baursak (Kızarmış mayalı hamur)',
            phoneticGuide: 'ba-wyr-saq',
            partOfSpeech: 'noun',
            exampleKazakh: 'Ыстық бауырсақпен шай іштік.',
            exampleTurkish: 'Sıcak baursakla çay içtik.',
            category: 'Yemek'
          },
          {
            id: 'v-a2-16',
            kazakhCyrillic: 'Қымыз',
            kazakhLatin: 'Qymyz',
            turkish: 'Kımız (Mayalanmış kısrak sütü)',
            phoneticGuide: 'qy-myz',
            partOfSpeech: 'noun',
            exampleKazakh: 'Самал желде салқын қымыз ішкен керемет.',
            exampleTurkish: 'Ilık rüzgarda soğuk kımız içmek harikadır.',
            category: 'Yemek'
          }
        ],
        grammar: {
          titleTr: 'İstek ve Rica Kipi (-ғы/-гі келеді)',
          titleKz: 'Қалау рай формасы',
          explanationTr: 'Bir şeyi istemek için fiil köküne -ғы/-гі/-қы/-кі + iyelik eki + келеді kalıbı kullanılır: Шай ішкім келеді (Çay içmek istiyorum).',
          explanationKz: 'Ішкім келеді = içmek istiyorum.',
          rules: [],
          examples: [
            {
              kazakh: 'Маған ет жегім келеді.',
              turkish: 'Canım et yemek istiyor.',
              breakdown: 'Же (ye) + -гі-м (isteğim) + келеді (geliyor)'
            }
          ],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-a2-3-1',
          titleTr: 'Kazak Sofrasında Çay İkramı',
          titleKz: 'Қазақ дастарқанында',
          contextTr: 'Ev sahibi misafirine çay ve baursak ikram ediyor.',
          contextKz: 'Қонаққа шай құю.',
          lines: [
            {
              id: 'dl-a2-3-1a',
              speaker: 'Үй иесі',
              avatar: '👵',
              kazakh: 'Төрлетіңіз! Ыстық шайдан алыңыз, бауырсақтан дәм татыңыз.',
              turkish: 'Başköşeye buyrun! Sıcak çaydan içiniz, baursaktan tadınız.'
            },
            {
              id: 'dl-a2-3-1b',
              speaker: 'Қонақ',
              avatar: '🧑',
              kazakh: 'Көп рақмет! Дастарқаныңыз берекелі болсын!',
              turkish: 'Çok teşekkürler! Sofranız bereketli olsun!'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-a2-3-1',
            type: 'multiple_choice',
            questionTr: '«Çay içmek istiyorum» ifadesinin Kazakçası hangisidir?',
            questionKz: '«Шай ішкім келеді» дұрыс нұсқасы:',
            options: ['Шай ішкім келеді', 'Шай ішемін', 'Шай іш', 'Шай бар'],
            correctAnswer: 'Шай ішкім келеді',
            explanationTr: 'Doğru! -ғы/-гі келеді kalıbıyla «Şay işkim keledi» (çay içmek istiyorum) denir.',
            explanationKz: 'Дұрыс! Шай ішкім келеді.',
            points: 10
          }
        ],
        isPublished: true
      },
      {
        id: 'lesson-a2-3-2',
        unitId: 'unit-a2-3',
        lessonNumber: 2,
        titleTr: 'Ders 2: Kafe ve Restoranda Sipariş Verme',
        titleKz: '2-сабақ: Мейрамханада асқа тапсырыс беру',
        summaryTr: 'Menü isteme, «Маған ... әкеліңізші», hesap isteme («Есепшотты әкеліңізші»).',
        summaryKz: 'Даяшымен тіл табысу және есеп айырысу.',
        learningObjectivesTr: ['Kazakça restoranda rahatça sipariş verip hesap ödeyebilme'],
        learningObjectivesKz: ['Мейрамханада еркін тапсырыс беру'],
        vocabulary: [
          {
            id: 'v-a2-17',
            kazakhCyrillic: 'Мәзір',
            kazakhLatin: 'Mäzіr',
            turkish: 'Menü / Yemek listesi',
            phoneticGuide: 'mä-zir',
            partOfSpeech: 'noun',
            exampleKazakh: 'Мәзірді көруге бола ма?',
            exampleTurkish: 'Menüyü görebilir miyim?',
            category: 'Restoran'
          },
          {
            id: 'v-a2-18',
            kazakhCyrillic: 'Есепшот',
            kazakhLatin: 'Esepşot',
            turkish: 'Hesap / Adisyon',
            phoneticGuide: 'e-sep-şot',
            partOfSpeech: 'noun',
            exampleKazakh: 'Есепшотты әкеліңізші.',
            exampleTurkish: 'Hesabı getirir misiniz lütfen.',
            category: 'Restoran'
          }
        ],
        grammar: {
          titleTr: 'Nezaket Eki (-шы/-ші ile rica)',
          titleKz: 'Өтініш мәнді -шы/-ші жұрнағы',
          explanationTr: 'Emir kipine eklenerek kibar rica yapar: Әкел (Getir) ➔ Әкеліңізші (Lütfen getiriniz).',
          explanationKz: 'Сыпайы өтініш білдіру.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-a2-3-2',
          titleTr: 'Garson ile Sipariş Diyaloğu',
          titleKz: 'Даяшымен сөйлесу',
          contextTr: 'Müşteri kafede sipariş veriyor.',
          contextKz: 'Тапсырыс беру.',
          lines: [
            {
              id: 'dl-a2-3-2a',
              speaker: 'Тұтынушы',
              avatar: '🍽️',
              kazakh: 'Кешіріңіз! Бізге бір шәйнек қара шай мен екі лағман әкеліңізші.',
              turkish: 'Affedersiniz! Bize bir demlik siyah çay ile iki lagman getirir misiniz lütfen.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-a2-3-2',
            type: 'multiple_choice',
            questionTr: 'Kazakça restoranda «Hesabı getiriniz lütfen» nasıl denir?',
            questionKz: '«Есепшотты әкеліңізші» дұрыс аудармасы:',
            options: ['Есепшотты әкеліңізші', 'Мәзірді беріңіз', 'Шай ішіңіз', 'Кеттік'],
            correctAnswer: 'Есепшотты әкеліңізші',
            explanationTr: 'Doğru! «Есепшотты әкеліңізші» hesap isteme kalıbıdır.',
            explanationKz: 'Дұрыс жауап!',
            points: 10
          }
        ],
        isPublished: true
      }
    ]
  },

  // ==========================================
  // LEVEL A2 - UNIT 4: ŞEHİR, ULAŞIM VE YOLCULUK
  // ==========================================
  {
    id: 'unit-a2-4',
    unitNumber: 4,
    level: 'A2',
    direction: 'TR_TO_KZ',
    titleTr: 'Ünite 4: Şehir, Ulaşım ve Yolculuk',
    titleKz: '4-бөлім: Қала, көлік және саяхат',
    descriptionTr: 'Toplu taşıma (автобус, пойыз, метро), taksi çağırma, yön sorma ve bilet alma.',
    descriptionKz: 'Қоғамдық көліктер, такси шақыру және жол сұрау үлгілері.',
    icon: 'Compass',
    isPublished: true,
    version: 6,
    lessons: [
      {
        id: 'lesson-a2-4-1',
        unitId: 'unit-a2-4',
        lessonNumber: 1,
        titleTr: 'Ders 1: Ulaşım Araçları ve Bilet Alma',
        titleKz: '1-сабақ: Қоғамдық көлік және билет алу',
        summaryTr: 'Автобус, пойыз (tren), ұшақ (uçak), аялдама (durak) ve bilet gişesi kalıpları.',
        summaryKz: 'Көлік түрлері және сапарға дайындық.',
        learningObjectivesTr: ['Ulaşım araçlarını adlandırabilme ve bilet satın alabilme'],
        learningObjectivesKz: ['Көлікке билет алуды меңгеру'],
        vocabulary: [
          {
            id: 'v-a2-19',
            kazakhCyrillic: 'Пойыз',
            kazakhLatin: 'Poyyz',
            turkish: 'Tren',
            phoneticGuide: 'po-yyz',
            partOfSpeech: 'noun',
            exampleKazakh: 'Алматыға баратын пойыз келді.',
            exampleTurkish: 'Almatı\'ya giden tren geldi.',
            category: 'Ulaşım'
          },
          {
            id: 'v-a2-20',
            kazakhCyrillic: 'Аялдама',
            kazakhLatin: 'Ayaldama',
            turkish: 'Durak',
            phoneticGuide: 'a-yal-da-ma',
            partOfSpeech: 'noun',
            exampleKazakh: 'Келесі аялдамадан түсемін.',
            exampleTurkish: 'Gelecek durakta ineceğim.',
            category: 'Ulaşım'
          },
          {
            id: 'v-a2-21',
            kazakhCyrillic: 'Билет',
            kazakhLatin: 'Bіlet',
            turkish: 'Bilet',
            phoneticGuide: 'bi-let',
            partOfSpeech: 'noun',
            exampleKazakh: 'Астанаға екі билет беріңізші.',
            exampleTurkish: 'Astana\'ya iki bilet veriniz lütfen.',
            category: 'Ulaşım'
          }
        ],
        grammar: {
          titleTr: 'Vasıta / Birliktelik Hali (-мен/-бен/-пен)',
          titleKz: 'Көмектес септігі',
          explanationTr: 'Neyle gidildiğini bildirir: Автобус-пен (Otobüsle), Пойыз-бен (Trenle), Ұшақ-пен (Uçakla).',
          explanationKz: 'Көмектес септігінің жалғануы.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-a2-4-1',
          titleTr: 'Tren Garında Bilet Alma',
          titleKz: 'Теміржол вокзалында',
          contextTr: 'Yolcu gişeden Türkistan bileti alıyor.',
          contextKz: 'Билет сатып алу.',
          lines: [
            {
              id: 'dl-a2-4-1a',
              speaker: 'Жолаушы',
              avatar: '🧳',
              kazakh: 'Сәлеметсіз бе! Ертеңгі Түркістан пойызына орын бар ма?',
              turkish: 'Merhaba! Yarınki Türkistan trenine yer var mı?'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-a2-4-1',
            type: 'multiple_choice',
            questionTr: '«Otobüs durağı» Kazakça nasıl söylenir?',
            questionKz: '«Otobüs durağı» сөзінің қазақшасы:',
            options: ['Автобус аялдамасы', 'Пойыз вокзалы', 'Әуежай', 'Көше'],
            correctAnswer: 'Автобус аялдамасы',
            explanationTr: 'Doğru! Аялдама = durak.',
            explanationKz: 'Дұрыс! Аялдама = durak.',
            points: 10
          }
        ],
        isPublished: true
      },
      {
        id: 'lesson-a2-4-2',
        unitId: 'unit-a2-4',
        lessonNumber: 2,
        titleTr: 'Ders 2: Adres ve Yön Sorma (Қайда? Қалай барамын?)',
        titleKz: '2-сабақ: Жол және бағыт сұрау',
        summaryTr: 'Оңға (sağa), солға (sola), тура (düz), жақын (yakın), алыс (uzak).',
        summaryKz: 'Бағыт-бағдарды білу.',
        learningObjectivesTr: ['Kazakça bir adresi veya yeri tarif edip yön sorabilme'],
        learningObjectivesKz: ['Жолды дұрыс сілтей білу'],
        vocabulary: [
          {
            id: 'v-a2-22',
            kazakhCyrillic: 'Оңға',
            kazakhLatin: 'Oñğa',
            turkish: 'Sağa',
            phoneticGuide: 'oñ-ğa',
            partOfSpeech: 'adverb',
            exampleKazakh: 'Бағдаршамнан оңға бұрылыңыз.',
            exampleTurkish: 'Trafik ışığından sağa dönünüz.',
            category: 'Yönler'
          },
          {
            id: 'v-a2-23',
            kazakhCyrillic: 'Солға',
            kazakhLatin: 'Solğa',
            turkish: 'Sola',
            phoneticGuide: 'sol-ğa',
            partOfSpeech: 'adverb',
            exampleKazakh: 'Солға қарай екі жүз метр жүріңіз.',
            exampleTurkish: 'Sola doğru iki yüz metre yürüyünüz.',
            category: 'Yönler'
          },
          {
            id: 'v-a2-24',
            kazakhCyrillic: 'Тура',
            kazakhLatin: 'Twra',
            turkish: 'Düz / Dosdoğru',
            phoneticGuide: 'tu-ra',
            partOfSpeech: 'adverb',
            exampleKazakh: 'Тура бара беріңіз.',
            exampleTurkish: 'Dümdüz gidiniz.',
            category: 'Yönler'
          }
        ],
        grammar: {
          titleTr: 'Yönelme Hali (-ға/-ге, -қа/-ке)',
          titleKz: 'Барыс септігі',
          explanationTr: 'Nereye? (Қайда?) sorusuna cevap: Мектеп-ке (Okula), Оң-ға (Sağa), Астана-ға (Astana\'ya).',
          explanationKz: 'Барыс септігі бағытты білдіреді.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-a2-4-2',
          titleTr: 'Sokakta Müze Adresi Sorma',
          titleKz: 'Көшеде жол сұрау',
          contextTr: 'Turist yoldan geçen birine müzeyi soruyor.',
          contextKz: 'Мұражайдың орнын сұрау.',
          lines: [
            {
              id: 'dl-a2-4-2a',
              speaker: 'Саяхатшы',
              avatar: '🗺️',
              kazakh: 'Кешіріңіз, Ұлттық мұражайға қалай баруға болады?',
              turkish: 'Affedersiniz, Milli Müze\'ye nasıl gidilebilir?'
            },
            {
              id: 'dl-a2-4-2b',
              speaker: 'Қала тұрғыны',
              avatar: '🚶',
              kazakh: 'Тура жүріңіз, сосын солға бұрылыңыз. Мұражай дәл алдыңызда тұрады.',
              turkish: 'Düz yürüyün, sonra sola dönün. Müze tam önünüzde olacaktır.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-a2-4-2',
            type: 'multiple_choice',
            questionTr: 'Kazakçada «Düz gidiniz» nasıl denir?',
            questionKz: '«Тура жүріңіз» мағынасы:',
            options: ['Düz yürüyünüz / gidiniz', 'Sağa dönünüz', 'Geri geliniz', 'Durunuz'],
            correctAnswer: 'Düz yürüyünüz / gidiniz',
            explanationTr: 'Doğru! «Тура жүріңіз» dosdoğru gidiniz demektir.',
            explanationKz: 'Дұрыс! Тура = Düz.',
            points: 10
          }
        ],
        isPublished: true
      }
    ]
  },

  // ==========================================
  // LEVEL B1 - UNIT 1: İŞ VE MESLEKLER
  // ==========================================
  {
    id: 'unit-b1-1',
    unitNumber: 1,
    level: 'B1',
    direction: 'TR_TO_KZ',
    titleTr: 'Ünite 1: İş ve Meslekler',
    titleKz: '1-бөлім: Кәсіп пен жұмыс',
    descriptionTr: 'İş mülakatı, meslekler, CV hazırlama ve geçmiş zaman sıfat-fiili (-ған/-ген).',
    descriptionKz: 'Жұмыс сұхбаты, мамандықтар және есімше өткен шақ.',
    icon: 'Briefcase',
    isPublished: true,
    version: 6,
    lessons: [
      {
        id: 'lesson-b1-1-1',
        unitId: 'unit-b1-1',
        lessonNumber: 1,
        titleTr: 'Ders 1: İş Mülakatı ve Özgeçmiş',
        titleKz: '1-сабақ: Жұмыс сұхбаты және түйіндеме',
        summaryTr: 'Mesleki deneyimleri anlatma, geçmiş zaman tecrübe eki (-ғанмын/-генмін).',
        summaryKz: 'Кәсіби тәжірибені баяндау.',
        learningObjectivesTr: ['Geçmiş iş tecrübelerinden bahsedebilme ve resmi dilde kendini tanıtabilme'],
        learningObjectivesKz: ['Жұмыс тәжірибесін сипаттай білу'],
        vocabulary: [
          {
            id: 'v-b1-1',
            kazakhCyrillic: 'Түйіндеме',
            kazakhLatin: 'Tüyіndeme',
            turkish: 'Özgeçmiş / CV',
            phoneticGuide: 'tü-yin-de-me',
            partOfSpeech: 'noun',
            exampleKazakh: 'Түйіндемемді электронды поштамен жібердім.',
            exampleTurkish: 'Özgeçmişimi e-posta ile gönderdim.',
            category: 'Kariyer'
          },
          {
            id: 'v-b1-2',
            kazakhCyrillic: 'Тәжірибе',
            kazakhLatin: 'Täjіrіbe',
            turkish: 'Deneyim / Tecrübe',
            phoneticGuide: 'tä-ji-ri-be',
            partOfSpeech: 'noun',
            exampleKazakh: 'Менің бес жылдық жұмыс тәжірибем бар.',
            exampleTurkish: 'Benim beş yıllık iş tecrübem var.',
            category: 'Kariyer'
          }
        ],
        grammar: {
          titleTr: 'Geçmiş Zaman Sıfat-Fiil Eki (-ған/-ген)',
          titleKz: 'Есімше өткен шақ',
          explanationTr: 'Eylemin daha önce yapıldığını ve kesinliğini bildirir: Мен университет бітіргенмін (Ben üniversite bitirmişim/bitirdim).',
          explanationKz: 'Өткен шақтың есімше түрі.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-b1-1',
          titleTr: 'Şirkette İş Görüşmesi',
          titleKz: 'Жұмыс сұхбатында',
          contextTr: 'Aday insan kaynakları müdürüyle mülakat yapıyor.',
          contextKz: 'Сұхбат барысы.',
          lines: [
            {
              id: 'dl-b1-1a',
              speaker: 'Басшы',
              avatar: '👔',
              kazakh: 'Бұрын қай компанияда жұмыс істегенсіз?',
              turkish: 'Daha önce hangi şirkette çalışmıştınız?'
            },
            {
              id: 'dl-b1-1b',
              speaker: 'Үміткер',
              avatar: '🧑‍💼',
              kazakh: 'Мен халықаралық логистика фирмасында аудармашы болып жұмыс істегенмін.',
              turkish: 'Ben uluslararası lojistik firmasında tercüman olarak çalışmıştım.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-b1-1',
            type: 'multiple_choice',
            questionTr: 'Kazakçada «Özgeçmiş / CV» kelimesinin karşılığı hangisidir?',
            questionKz: '«CV» сөзінің қазақша баламасы:',
            options: ['Түйіндеме', 'Кітапша', 'Құжат', 'Мәзір'],
            correctAnswer: 'Түйіндеме',
            explanationTr: 'Doğru! Түйіндеме = Özgeçmiş / CV.',
            explanationKz: 'Дұрыс! Түйіндеме = CV.',
            points: 15
          }
        ],
        isPublished: true
      },
      {
        id: 'lesson-b1-1-2',
        unitId: 'unit-b1-1',
        lessonNumber: 2,
        titleTr: 'Ders 2: Resmi E-posta ve Ofis İletişimi',
        titleKz: '2-сабақ: Ресми хат алмасу және кеңсе тілі',
        summaryTr: '«Құрметті әріптестер», resmi hitap ve imza kalıpları, toplantı planlama.',
        summaryKz: 'Ресми электронды хат жазу ережелері.',
        learningObjectivesTr: ['Kazakça resmi iş e-postası ve dilekçe yazabilme'],
        learningObjectivesKz: ['Ресми хат жаза білу'],
        vocabulary: [
          {
            id: 'v-b1-3',
            kazakhCyrillic: 'Құрметті',
            kazakhLatin: 'Qūrmettі',
            turkish: 'Sayın / Saygıdeğer',
            phoneticGuide: 'qur-met-ti',
            partOfSpeech: 'adj',
            exampleKazakh: 'Құрметті Аслан мырза!',
            exampleTurkish: 'Sayın Aslan Bey!',
            category: 'Resmi Dil'
          },
          {
            id: 'v-b1-4',
            kazakhCyrillic: 'Жиналыс',
            kazakhLatin: 'Jynalys',
            turkish: 'Toplantı',
            phoneticGuide: 'jy-na-lys',
            partOfSpeech: 'noun',
            exampleKazakh: 'Жиналыс сағат онда басталады.',
            exampleTurkish: 'Toplantı saat onda başlayacak.',
            category: 'Ofis'
          }
        ],
        grammar: {
          titleTr: 'Gereklilik Kipi (-у керек / -у қажет)',
          titleKz: 'Қажеттілік мәні',
          explanationTr: 'Yapılması gereken işleri belirtir: Есеп беру керек (Rapor vermek lazım).',
          explanationKz: 'Істің орындалу қажеттілігі.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-b1-1-2',
          titleTr: 'Toplantı Saati Belirleme',
          titleKz: 'Жиналыс белгілеу',
          contextTr: 'Ofis çalışanları haftalık toplantıyı planlıyor.',
          contextKz: 'Кеңседегі әріптестер.',
          lines: [
            {
              id: 'dl-b1-1-2a',
              speaker: 'Менеджер',
              avatar: '📊',
              kazakh: 'Ертең жаңа жоба бойынша жиналыс өткізуіміз керек.',
              turkish: 'Yarın yeni proje hakkında toplantı yapmamız gerekiyor.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-b1-1-2',
            type: 'multiple_choice',
            questionTr: 'Kazakça resmi mektuplarda «Sayın / Saygıdeğer» anlamında kullanılan kelime hangisidir?',
            questionKz: 'Ресми хатта қай сөз қолданылады?',
            options: ['Құрметті', 'Сәлем', 'Жақсы', 'Керемет'],
            correctAnswer: 'Құрметті',
            explanationTr: 'Doğru! «Құрметті» saygıdeğer/sayın demektir.',
            explanationKz: 'Дұрыс! Құрметті = Sayın.',
            points: 15
          }
        ],
        isPublished: true
      }
    ]
  },

  // ==========================================
  // LEVEL B1 - UNIT 2: KAZAKİSTAN COĞRAFYASI VE ŞEHİRLERİ
  // ==========================================
  {
    id: 'unit-b1-2',
    unitNumber: 2,
    level: 'B1',
    direction: 'TR_TO_KZ',
    titleTr: 'Ünite 2: Kazakistan Coğrafyası ve Tarihi Şehirler',
    titleKz: '2-бөлім: Қазақстан географиясы және көне қалалар',
    descriptionTr: 'Astana, Almatı, Türkistan ve Hoca Ahmet Yesevi Külliyesi, doğal güzellikler (Burabay, Şarın kanyonu).',
    descriptionKz: 'Елорда, Алматы, Түркістан және табиғи қорықтар.',
    icon: 'Globe',
    isPublished: true,
    version: 6,
    lessons: [
      {
        id: 'lesson-b1-2-1',
        unitId: 'unit-b1-2',
        lessonNumber: 1,
        titleTr: 'Ders 1: İki Büyük Şehir: Astana ve Almatı',
        titleKz: '1-сабақ: Екі алып шаһар: Астана мен Алматы',
        summaryTr: 'Kuzeyin rüzgarlı başkenti Astana ve Aladağ eteklerindeki kültür merkezi Almatı.',
        summaryKz: 'Астана мен Алматының мәдениеті мен архитектурасы.',
        learningObjectivesTr: ['Kazakistan\'ın iki başkentini coğrafi ve kültürel özellikleriyle anlatabilme'],
        learningObjectivesKz: ['Екі қала туралы кеңінен әңгімелеу'],
        vocabulary: [
          {
            id: 'v-b1-5',
            kazakhCyrillic: 'Елорда',
            kazakhLatin: 'Elorda',
            turkish: 'Başkent (Halk diliyle)',
            phoneticGuide: 'el-or-da',
            partOfSpeech: 'noun',
            exampleKazakh: 'Астана – Тәуелсіз Қазақстанның елордасы.',
            exampleTurkish: 'Astana, Bağımsız Kazakistan\'ın başkentidir.',
            category: 'Coğrafya'
          },
          {
            id: 'v-b1-6',
            kazakhCyrillic: 'Алатау',
            kazakhLatin: 'Alataw',
            turkish: 'Aladağ (Tanrı Dağları silsilesi)',
            phoneticGuide: 'a-la-tau',
            partOfSpeech: 'noun',
            exampleKazakh: 'Алматы Алатаудың баурайында орналасқан.',
            exampleTurkish: 'Almatı, Aladağ\'ın eteklerinde kurulmuştur.',
            category: 'Coğrafya'
          }
        ],
        grammar: {
          titleTr: 'Sıfatlarda Karşılaştırma ve Üstünlük Derecesi (-рақ/-рек, ең)',
          titleKz: 'Сын есімнің салыстырмалы және асырмалы шырайлары',
          explanationTr: 'Daha büyük: Үлкен-ірек; En büyük: Ең үлкен.',
          explanationKz: 'Шырай формалары.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-b1-2-1',
          titleTr: 'Tur Rehberi Eşliğinde Şehir Gezisi',
          titleKz: 'Қала саяхатында',
          contextTr: 'Rehber turistlere Baiterek Kulesi\'ni tanıtıyor.',
          contextKz: 'Бәйтерек монументін таныстыру.',
          lines: [
            {
              id: 'dl-b1-2-1a',
              speaker: 'Гид',
              avatar: '🎙️',
              kazakh: '«Бәйтерек» – қазақ халқының өмір ағашы мен болашаққа ұмтылысының белгісі.',
              turkish: '«Bayterek», Kazak halkının hayat ağacı ve geleceğe yönelişinin simgesidir.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-b1-2-1',
            type: 'multiple_choice',
            questionTr: 'Kazakçada başkent anlamına gelen özel terim hangisidir?',
            questionKz: 'Бас қала қалай аталады?',
            options: ['Елорда', 'Ауыл', 'Қалашық', 'Аймақ'],
            correctAnswer: 'Елорда',
            explanationTr: 'Doğru! «Елорда» başkent demektir.',
            explanationKz: 'Дұрыс! Елорда = Başkent.',
            points: 15
          }
        ],
        isPublished: true
      },
      {
        id: 'lesson-b1-2-2',
        unitId: 'unit-b1-2',
        lessonNumber: 2,
        titleTr: 'Ders 2: Manevi Başkent Türkistan ve Hoca Ahmet Yesevi',
        titleKz: '2-сабақ: Түркі әлемінің рухани астанасы – Түркістан',
        summaryTr: 'İpek Yolu üzerindeki kadim Yesi şehri, Ahmet Yesevi Türbesi ve Türk Dünyası birliği.',
        summaryKz: 'Қожа Ахмет Ясауи кесенесі мен түркі бірлігі.',
        learningObjectivesTr: ['Türkistan\'ın Türk Dünyasındaki manevi yerini ve tarihi mirasını ifade edebilme'],
        learningObjectivesKz: ['Түркістан тарихын баяндау'],
        vocabulary: [
          {
            id: 'v-b1-7',
            kazakhCyrillic: 'Кесене',
            kazakhLatin: 'Kesene',
            turkish: 'Türbe / Külliye / Anıtmezar',
            phoneticGuide: 'ke-se-ne',
            partOfSpeech: 'noun',
            exampleKazakh: 'Қожа Ахмет Ясауи кесенесі – сәулет өнерінің жауһары.',
            exampleTurkish: 'Hoca Ahmet Yesevi türbesi mimari sanatın şaheseridir.',
            category: 'Tarih'
          },
          {
            id: 'v-b1-8',
            kazakhCyrillic: 'Рухани',
            kazakhLatin: 'Rwhanı',
            turkish: 'Manevi / Ruhani',
            phoneticGuide: 'ru-ha-ni',
            partOfSpeech: 'adj',
            exampleKazakh: 'Түркістан – күллі түркінің рухани ордасы.',
            exampleTurkish: 'Türkistan, bütün Türk dünyasının manevi merkezidir.',
            category: 'Kültür'
          }
        ],
        grammar: {
          titleTr: 'Amaç ve Gaye Zarf-Fiilleri (-у үшін)',
          titleKz: 'Мақсат мәнді құрылымдар',
          explanationTr: 'Bir eylemin amacını bildirir: Түркістанды көру үшін келдім (Türkistan\'ı görmek için geldim).',
          explanationKz: 'Мақсатты білдіру.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-b1-2-2',
          titleTr: 'Yesevi Külliyesi Ziyareti',
          titleKz: 'Ясауи кесенесінде',
          contextTr: 'Ziyaretçiler Yesevi Türbesi önünde dua ediyor.',
          contextKz: 'Зиярат ету.',
          lines: [
            {
              id: 'dl-b1-2-2a',
              speaker: 'Зияратшы',
              avatar: '🕌',
              kazakh: 'Түркі дүниесінің ұлы ұстазы Ясауи бабамыздың рухына тағзым етеміз.',
              turkish: 'Türk dünyasının ulu hocası Yesevi atamızın aziz ruhuna hürmet ederiz.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-b1-2-2',
            type: 'multiple_choice',
            questionTr: 'Kazakçada «Türbe / Külliye» anlamına gelen kelime hangisidir?',
            questionKz: '«Türbe» сөзінің қазақшасы:',
            options: ['Кесене', 'Мектеп', 'Аурухана', 'Дүкен'],
            correctAnswer: 'Кесене',
            explanationTr: 'Doğru! «Кесене» anıt mezar / türbe demektir.',
            explanationKz: 'Дұрыс! Кесене = Türbe.',
            points: 15
          }
        ],
        isPublished: true
      }
    ]
  },

  // ==========================================
  // LEVEL B1 - UNIT 3: KAZAK KÜLTÜRÜ, MÜZİK VE SANAT
  // ==========================================
  {
    id: 'unit-b1-3',
    unitNumber: 3,
    level: 'B1',
    direction: 'TR_TO_KZ',
    titleTr: 'Ünite 3: Kazak Kültürü, Müzik ve Sanat',
    titleKz: '3-бөлім: Қазақ мәдениеті, саз және өнер',
    descriptionTr: 'Dombra sanatı, küy geleneği, halk çalgıları (қобыз, сыбызғы) ve aytıs atışmaları.',
    descriptionKz: 'Домбыра, күй өнері, қобыз және айтыс салты.',
    icon: 'Music',
    isPublished: true,
    version: 6,
    lessons: [
      {
        id: 'lesson-b1-3-1',
        unitId: 'unit-b1-3',
        lessonNumber: 1,
        titleTr: 'Ders 1: Dombra ve Küy Sanatı',
        titleKz: '1-сабақ: Қасиетті домбыра мен күй',
        summaryTr: '«Нағыз қазақ – қазақ емес, нағыз қазақ – домбыра». Kurmangazı ve küy ustaları.',
        summaryKz: 'Құрманғазы, Тәттімбет және күй құдіреті.',
        learningObjectivesTr: ['Kazak müzik kültürünün kalbi olan dombra ve küy kavramlarını derinlemesine anlayabilme'],
        learningObjectivesKz: ['Күй мен домбыраның маңызын түсіну'],
        vocabulary: [
          {
            id: 'v-b1-9',
            kazakhCyrillic: 'Домбыра',
            kazakhLatin: 'Dombyra',
            turkish: 'Dombra (İki telli Kazak milli çalgısı)',
            phoneticGuide: 'dom-by-ra',
            partOfSpeech: 'noun',
            exampleKazakh: 'Домбыра – қазақтың жан серігі.',
            exampleTurkish: 'Dombra, Kazakların can yoldaşıdır.',
            category: 'Müzik'
          },
          {
            id: 'v-b1-10',
            kazakhCyrillic: 'Күй',
            kazakhLatin: 'Küy',
            turkish: 'Küy (Sözsüz dombra veya kopuz ezgisi / bestesi)',
            phoneticGuide: 'küy',
            partOfSpeech: 'noun',
            exampleKazakh: 'Құрманғазының «Сарыарқа» күйі өте жігерлі.',
            exampleTurkish: 'Kurmangazı\'nın «Sarıarka» küyü çok coşkuludur.',
            category: 'Müzik'
          }
        ],
        grammar: {
          titleTr: 'Edatlar ve Son Çekimler (Туралы - Hakkında, Арқылы - Yoluyla)',
          titleKz: 'Септеуліктердің қолданылуы',
          explanationTr: 'Konu bildirme: Домбыра туралы (Dombra hakkında).',
          explanationKz: 'Туралы шылауы.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-b1-3-1',
          titleTr: 'Konser Sonrası Dombra Yorumu',
          titleKz: 'Концерттен кейін',
          contextTr: 'İki dinleyici milli orkestra konserini değerlendiriyor.',
          contextKz: 'Концерттен алған әсер.',
          lines: [
            {
              id: 'dl-b1-3-1a',
              speaker: 'Сәкен',
              avatar: '🎶',
              kazakh: 'Күй орындалғанда даланың еркін лебі ескендей болады.',
              turkish: 'Küy çalındığında bozkırın hür rüzgarı esiyormuş gibi oluyor.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-b1-3-1',
            type: 'multiple_choice',
            questionTr: 'Kazak müzik kültüründe sözsüz enstrümantal ezgi / besteye ne ad verilir?',
            questionKz: 'Қазақтың аспаптық музыкалық шығармасы қалай аталады?',
            options: ['Күй', 'Ән', 'Өлең', 'Би'],
            correctAnswer: 'Күй',
            explanationTr: 'Doğru! Dombra ve kopuzla icra edilen enstrümantal bestelere «Күй» denir.',
            explanationKz: 'Дұрыс! Аспаптық шығарма = Күй.',
            points: 15
          }
        ],
        isPublished: true
      },
      {
        id: 'lesson-b1-3-2',
        unitId: 'unit-b1-3',
        lessonNumber: 2,
        titleTr: 'Ders 2: Aytıs (Айтыс) - Halk Ozanlarının Doğaçlama Söz Yarışı',
        titleKz: '2-сабақ: Сөз сайысы – төл өнеріміз айтыс',
        summaryTr: 'Akınların dombra eşliğinde irticalen (doğaçlama) şiirle atışması, hiciv ve bilgelik sanatı.',
        summaryKz: 'Ақындар айтысының табиғаты мен сөз тапқырлығы.',
        learningObjectivesTr: ['Kazak halk edebiyatının zirvesi olan Aytıs geleneğini ve şiir sanatını kavrama'],
        learningObjectivesKz: ['Айтыс өнерін тану'],
        vocabulary: [
          {
            id: 'v-b1-11',
            kazakhCyrillic: 'Ақын',
            kazakhLatin: 'Aqyn',
            turkish: 'Halk ozanı / Şair',
            phoneticGuide: 'a-qyn',
            partOfSpeech: 'noun',
            exampleKazakh: 'Ақын сөзі – халықтың үні.',
            exampleTurkish: 'Ozanın sözü, halkın sesidir.',
            category: 'Edebiyat'
          },
          {
            id: 'v-b1-12',
            kazakhCyrillic: 'Шешен',
            kazakhLatin: 'Şeşen',
            turkish: 'Hitabet ustası / Dili akıcı söz üstadı',
            phoneticGuide: 'şe-şen',
            partOfSpeech: 'noun',
            exampleKazakh: 'Қазақта шешендік өнер өте жоғары бағаланған.',
            exampleTurkish: 'Kazaklarda hitabet sanatına çok büyük kıymet verilmiştir.',
            category: 'Edebiyat'
          }
        ],
        grammar: {
          titleTr: 'Şart Kipi ve Bağlama (-са/-се)',
          titleKz: 'Шартты рай',
          explanationTr: 'Koşul bildirir: Ақын айтса, халық тыңдайды (Ozan söylerse, halk dinler).',
          explanationKz: 'Шартты рай жалғаулары.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-b1-3-2',
          titleTr: 'Aytıs Sahnesinde İki Ozan',
          titleKz: 'Айтыс алаңында',
          contextTr: 'İki akın doğaçlama dizelerle atışıyor.',
          contextKz: 'Сөз қағысу.',
          lines: [
            {
              id: 'dl-b1-3-2a',
              speaker: 'Ақын',
              avatar: '🪕',
              kazakh: 'Тіл қаруы – сөз, сөз қаруы – ой демекпін!',
              turkish: 'Dilin silahı söz, sözün silahı düşüncedir derim!'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-b1-3-2',
            type: 'multiple_choice',
            questionTr: 'Kazakçada doğaçlama şiir söyleyen halk ozanına ne ad verilir?',
            questionKz: 'Суырыпсалма өлең айтатын өнерпаз:',
            options: ['Ақын', 'Жазушы', 'Суретші', 'Ғалым'],
            correctAnswer: 'Ақын',
            explanationTr: 'Doğru! Dombra çalıp şiir söyleyen halk ozanına «Ақын» denir.',
            explanationKz: 'Дұрыс! Ақын = Ozan.',
            points: 15
          }
        ],
        isPublished: true
      }
    ]
  },

  // ==========================================
  // LEVEL B2 - UNIT 1: KAZAK EDEBİYATI VE ABAY
  // ==========================================
  {
    id: 'unit-b2-1',
    unitNumber: 1,
    level: 'B2',
    direction: 'TR_TO_KZ',
    titleTr: 'Ünite 1: Kazak Edebiyatı, Abay ve Felsefe',
    titleKz: '1-бөлім: Қазақ әдебиеті, Абай және философия',
    descriptionTr: 'Abay Kunanbayev\'in Kara Sözleri, Kazak milli kimliği, deyimler ve karmaşık cümle yapıları.',
    descriptionKz: 'Абай Құнанбайұлының «Қара сөздері», ұлттық болмыс және күрделі сөйлемдер.',
    icon: 'BookOpen',
    isPublished: true,
    version: 6,
    lessons: [
      {
        id: 'lesson-b2-1-1',
        unitId: 'unit-b2-1',
        lessonNumber: 1,
        titleTr: 'Ders 1: Abay\'ın Kara Sözleri ve Bilgi Arayışı',
        titleKz: '1-сабақ: Абайдың «Қара сөздері» мен ғылым-білім',
        summaryTr: 'B2 seviyesinde edebi metin analizi, felsefi kavramlar ve soyut kelime dağarcığı.',
        summaryKz: 'Көркем мәтінді талдау, философиялық ұғымдар және сөз байлығы.',
        learningObjectivesTr: ['Klasik Kazak edebiyatı metinlerini anlayabilme ve felsefi terimleri yorumlayabilme'],
        learningObjectivesKz: ['Әдеби мәтіндерді талдай білу'],
        vocabulary: [
          {
            id: 'v-b2-1',
            kazakhCyrillic: 'Парасат',
            kazakhLatin: 'Parasat',
            turkish: 'Sağduyu / Basiret / Hikmet',
            phoneticGuide: 'pa-ra-sat',
            partOfSpeech: 'noun',
            exampleKazakh: 'Парасатты адам әрқашан әділдікті жақтайды.',
            exampleTurkish: 'Sağduyulu insan her zaman adaleti savunur.',
            category: 'Felsefe ve Edebiyat'
          },
          {
            id: 'v-b2-2',
            kazakhCyrillic: 'Шешендік',
            kazakhLatin: 'Şeşendik',
            turkish: 'Hitabet sanatı / Belagat',
            phoneticGuide: 'şe-şen-dik',
            partOfSpeech: 'noun',
            exampleKazakh: 'Қазақ халқы шешендік өнерге аса жоғары баға берген.',
            exampleTurkish: 'Kazak halkı hitabet sanatına çok büyük değer vermiştir.',
            category: 'Felsefe ve Edebiyat'
          }
        ],
        grammar: {
          titleTr: 'B2: Zarf-Fiil Ekleri ve Bağlaçlar (-ып/-іп, -ғалы/-гелі)',
          titleKz: 'Көсемше және құрмалас сөйлемдер',
          explanationTr: 'Eylemlerin peş peşe veya sebep-sonuç bağıyla gerçekleştiği karmaşık cümle yapıları.',
          explanationKz: 'Сабақтас құрмалас сөйлемдердің байланысу жолдары.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-b2-1',
          titleTr: 'Edebiyat Kulübünde Tartışma',
          titleKz: 'Әдеби клубтағы пікірталас',
          contextTr: 'Öğrenciler Abay\'ın eserlerini müzakere ediyor.',
          contextKz: 'Студенттер Абай шығармашылығын талқылап жатыр.',
          lines: [
            {
              id: 'dl-b2-1',
              speaker: 'Айдар',
              avatar: '🧑‍🎓',
              kazakh: 'Абайдың 17-қара сөзіндегі ақыл, қайрат, жүрек үндестігі туралы не ойлайсыз?',
              turkish: 'Abay\'ın 17. kara sözündeki akıl, irade ve yürek uyumu hakkında ne düşünüyorsunuz?'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-b2-1',
            type: 'multiple_choice',
            questionTr: 'Kazakçada «Парасат» kelimesinin felsefi Türkçe anlamı nedir?',
            questionKz: '«Парасат» сөзінің мағынасы:',
            options: ['Sağduyu / Basiret / Akıl', 'Öfke', 'Hız', 'Korku'],
            correctAnswer: 'Sağduyu / Basiret / Akıl',
            explanationTr: 'Doğru! Парасат, derin aklı ve hikmeti ifade eder.',
            explanationKz: 'Дұрыс! Мағынасы: «Sağduyu / Basiret».',
            points: 15
          }
        ],
        isPublished: true
      },
      {
        id: 'lesson-b2-1-2',
        unitId: 'unit-b2-1',
        lessonNumber: 2,
        titleTr: 'Ders 2: Alaş Aydınları ve Mağcan Cumabay Şiiri',
        titleKz: '2-сабақ: Алаш зиялылары және Мағжан поэзиясы',
        summaryTr: 'Ahmet Baytursınov, Alihan Bökeyhan ve Mağcan Cumabay\'ın Türkistan şiiri üzerine analiz.',
        summaryKz: 'Алаш қозғалысының тілдік және әдеби мұрасы.',
        learningObjectivesTr: ['Alaş aydınlarının modern Kazak edebiyatına katkılarını ve şiir dilini inceleyebilme'],
        learningObjectivesKz: ['Мағжан поэзиясын талдау'],
        vocabulary: [
          {
            id: 'v-b2-3',
            kazakhCyrillic: 'Зиялы',
            kazakhLatin: 'Ziyaly',
            turkish: 'Aydın / Münevver / Entelektüel',
            phoneticGuide: 'zi-ya-ly',
            partOfSpeech: 'noun',
            exampleKazakh: 'Алаш зиялылары ұлт үшін күресті.',
            exampleTurkish: 'Alaş aydınları millet için mücadele etti.',
            category: 'Tarih'
          },
          {
            id: 'v-b2-4',
            kazakhCyrillic: 'Тәуелсіздік',
            kazakhLatin: 'Täuelsіzdіk',
            turkish: 'Bağımsızlık / İstiklal',
            phoneticGuide: 'tä-uel-siz-dik',
            partOfSpeech: 'noun',
            exampleKazakh: 'Тәуелсіздік – ең ұлы құндылық.',
            exampleTurkish: 'Bağımsızlık, en yüce değerdir.',
            category: 'Tarih'
          }
        ],
        grammar: {
          titleTr: 'Sebep-Sonuç ve Amaç Bağlaçları (Сондықтан - Bu yüzden, Сол себепті)',
          titleKz: 'Себеп-салдар құрмалас сөйлемдер',
          explanationTr: 'Fikirler arası mantıksal köprü kurma: Зиялылар еңбек етті, сондықтан тіліміз сақталды (Aydınlar emek verdi, bu yüzden dilimiz korundu).',
          explanationKz: 'Себеп-салдар байланысы.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-b2-1-2',
          titleTr: 'Türkoloji Seminerinde Mağcan Şiiri',
          titleKz: 'Мағжан өлеңдері',
          contextTr: 'Öğrenciler Mağcan\'ın «Türkistan» şiirini tahlil ediyor.',
          contextKz: 'Өлең талдау.',
          lines: [
            {
              id: 'dl-b2-1-2a',
              speaker: 'Оқытушы',
              avatar: '📖',
              kazakh: '«Түркістан – екі дүние есігі ғой, Түркістан – ер түріктің бесігі ғой» деген жолдардың мәні неде?',
              turkish: '«Türkistan iki dünya kapısıdır, Türkistan yiğit Türk\'ün beşiğidir» mısralarının anlamı nedir?'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-b2-1-2',
            type: 'multiple_choice',
            questionTr: 'Kazakçada «Bağımsızlık / İstiklal» anlamına gelen kelime hangisidir?',
            questionKz: '«Bağımsızlık» сөзінің қазақшасы:',
            options: ['Тәуелсіздік', 'Билік', 'Байлық', 'Бақыт'],
            correctAnswer: 'Тәуелсіздік',
            explanationTr: 'Doğru! Тәуелсіздік = Bağımsızlık.',
            explanationKz: 'Дұрыс! Тәуелсіздік = Bağımsızlık.',
            points: 15
          }
        ],
        isPublished: true
      }
    ]
  },

  // ==========================================
  // LEVEL B2 - UNIT 2: MEDYA VE TEKNOLOJİ
  // ==========================================
  {
    id: 'unit-b2-2',
    unitNumber: 2,
    level: 'B2',
    direction: 'TR_TO_KZ',
    titleTr: 'Ünite 2: Medya, Teknoloji ve Sosyal Hayat',
    titleKz: '2-бөлім: БАҚ, заманауи технология және қоғам',
    descriptionTr: 'Haber dili, dijital dönüşüm, çevre ve Aral Gölü meselesi, bilimsel kavramlar.',
    descriptionKz: 'Ақпарат құралдары, жасанды интеллект және экологиялық мәселелер.',
    icon: 'Monitor',
    isPublished: true,
    version: 6,
    lessons: [
      {
        id: 'lesson-b2-2-1',
        unitId: 'unit-b2-2',
        lessonNumber: 1,
        titleTr: 'Ders 1: Haber Dili ve Medya Terminolojisi',
        titleKz: '1-сабақ: Бұқаралық ақпарат құралдарының тілі',
        summaryTr: 'Haber bülteni, resmi demeç, röportaj ve güncel olayları Kazakça yorumlama.',
        summaryKz: 'БАҚ стилі мен жаңалықтарды талдау.',
        learningObjectivesTr: ['Kazakça haber bültenlerini ve gazete makalelerini anlayıp özetleyebilme'],
        learningObjectivesKz: ['Жаңалықтарды еркін түсіну'],
        vocabulary: [
          {
            id: 'v-b2-5',
            kazakhCyrillic: 'Ақпарат',
            kazakhLatin: 'Aqparat',
            turkish: 'Bilgi / Enformasyon / Haber',
            phoneticGuide: 'aq-pa-rat',
            partOfSpeech: 'noun',
            exampleKazakh: 'Ресми ақпарат құралдары мәлімдеме жасады.',
            exampleTurkish: 'Resmi enformasyon organları açıklama yaptı.',
            category: 'Medya'
          },
          {
            id: 'v-b2-6',
            kazakhCyrillic: 'Жасанды интеллект',
            kazakhLatin: 'Jasandy intellekt',
            turkish: 'Yapay zeka',
            phoneticGuide: 'ja-san-dy in-tel-lekt',
            partOfSpeech: 'phrase',
            exampleKazakh: 'Жасанды интеллект білім беру саласына енгізілуде.',
            exampleTurkish: 'Yapay zeka eğitim alanına entegre edilmektedir.',
            category: 'Teknoloji'
          }
        ],
        grammar: {
          titleTr: 'Dolaylı Anlatım ve Aktarma Cümleleri (Деп айтты, Мәлімдеді)',
          titleKz: 'Төл сөзді төлеу сөзге айналдыру',
          explanationTr: 'Haberlerde başkalarının sözlerini aktarma: Министр жаңа жобаның басталғанын мәлімдеді.',
          explanationKz: 'Ақпарат таратудағы төлеу сөздер.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-b2-2-1',
          titleTr: 'Haber Bülteni Sunumu',
          titleKz: 'Жаңалықтар топтамасы',
          contextTr: 'Spiker akşam haberlerini sunuyor.',
          contextKz: 'Теледидардағы жаңалықтар.',
          lines: [
            {
              id: 'dl-b2-2-1a',
              speaker: 'Диктор',
              avatar: '📺',
              kazakh: 'Қайырлы кеш, құрметті көрермендер! Эфирде – бүгінгі күннің басты жаңалықтары.',
              turkish: 'İyi akşamlar saygıdeğer seyirciler! Yayında günün öne çıkan haberleri.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-b2-2-1',
            type: 'multiple_choice',
            questionTr: 'Kazakçada «Yapay Zeka» ifadesinin karşılığı hangisidir?',
            questionKz: '«Yapay zeka» сөзінің қазақшасы:',
            options: ['Жасанды интеллект', 'Табиғи сана', 'Электронды ми', 'Жаңа ғылым'],
            correctAnswer: 'Жасанды интеллект',
            explanationTr: 'Doğru! Жасанды интеллект = Yapay zeka.',
            explanationKz: 'Дұрыс жауап!',
            points: 15
          }
        ],
        isPublished: true
      },
      {
        id: 'lesson-b2-2-2',
        unitId: 'unit-b2-2',
        lessonNumber: 2,
        titleTr: 'Ders 2: Ekoloji ve Aral Gölü Meselesi',
        titleKz: '2-сабақ: Экология және Арал тағдыры',
        summaryTr: 'Doğal kaynakların korunması, bozkır ekolojisi ve küresel çevre sorunları üzerine tartışma.',
        summaryKz: 'Арал теңізі мен қоршаған ортаны қорғау мәселелері.',
        learningObjectivesTr: ['Çevre sorunları ve ekolojik dengeler hakkında akıcı argüman üretebilme'],
        learningObjectivesKz: ['Экология туралы ой толғау'],
        vocabulary: [
          {
            id: 'v-b2-7',
            kazakhCyrillic: 'Қоршаған орта',
            kazakhLatin: 'Qorşağan orta',
            turkish: 'Çevre / Etraf / Doğal çevre',
            phoneticGuide: 'qor-şa-ğan or-ta',
            partOfSpeech: 'phrase',
            exampleKazakh: 'Қоршаған ортаны қорғау – ортақ парызымыз.',
            exampleTurkish: 'Çevreyi korumak ortak görevimizdir.',
            category: 'Çevre'
          },
          {
            id: 'v-b2-8',
            kazakhCyrillic: 'Табиғат',
            kazakhLatin: 'Tabiğat',
            turkish: 'Doğa / Tabiat',
            phoneticGuide: 'ta-bi-ğat',
            partOfSpeech: 'noun',
            exampleKazakh: 'Қазақстанның табиғаты өте бай.',
            exampleTurkish: 'Kazakistan\'ın doğası çok zengindir.',
            category: 'Çevre'
          }
        ],
        grammar: {
          titleTr: 'Gereklilik ve İhtimal Yapıları (-уы мүмкін / -уы тиіс)',
          titleKz: 'Ықтималдық пен міндеттілік',
          explanationTr: 'Eylemin olma ihtimali: Жағдай жақсаруы мүмкін (Durum düzelebilir).',
          explanationKz: 'Ықтималдықты білдіру.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-b2-2-2',
          titleTr: 'Ekoloji Konferansında Konuşma',
          titleKz: 'Экологиялық конференция',
          contextTr: 'Uzmanlar Aral Gölü\'nün kurtarılması için konuşuyor.',
          contextKz: 'Арал мәселесі.',
          lines: [
            {
              id: 'dl-b2-2-2a',
              speaker: 'Эколог',
              avatar: '🌱',
              kazakh: 'Кіші Аралды сақтап қалу арқылы аймақтағы балық шаруашылығын қайта жандандырдық.',
              turkish: 'Küçük Aral\'ı koruyarak bölgedeki balıkçılığı yeniden canlandırdık.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-b2-2-2',
            type: 'multiple_choice',
            questionTr: 'Kazakçada «Çevre / Doğal ortam» anlamına gelen tamlama hangisidir?',
            questionKz: '«Çevre» сөзінің қазақшасы:',
            options: ['Қоршаған орта', 'Ашық дала', 'Қалың орман', 'Көк теңіз'],
            correctAnswer: 'Қоршаған орта',
            explanationTr: 'Doğru! Қоршаған орта = Çevre.',
            explanationKz: 'Дұрыс! Қоршаған орта = Çevre.',
            points: 15
          }
        ],
        isPublished: true
      }
    ]
  },

  // ==========================================
  // LEVEL B2 - UNIT 3: MİLLİ OYUNLAR VE BOZKIR KÜLTÜRÜ
  // ==========================================
  {
    id: 'unit-b2-3',
    unitNumber: 3,
    level: 'B2',
    direction: 'TR_TO_KZ',
    titleTr: 'Ünite 3: Göçebe Medeniyeti ve Bozkır Oyunları',
    titleKz: '3-бөлім: Көшпелілер өркениеті және ұлттық ойындар',
    descriptionTr: 'Kökpar, Kazak küresi, asık atuv, toğızqumalaq ve keçe ev (киіз үй) mimarisi ile felsefesi.',
    descriptionKz: 'Көкпар, қазақ күресі, тоғызқұмалақ және киіз үй философиясы.',
    icon: 'Shield',
    isPublished: true,
    version: 6,
    lessons: [
      {
        id: 'lesson-b2-3-1',
        unitId: 'unit-b2-3',
        lessonNumber: 1,
        titleTr: 'Ders 1: Milli Sporlar: Kökpar ve Kazak Küresi',
        titleKz: '1-сабақ: Ұлттық спорт: Көкпар мен қазақ күресі',
        summaryTr: 'Atlı sporların zirvesi Kökpar, bilek ve akıl gücü Kazak küresi, yiğitlik kültürü.',
        summaryKz: 'Көкпар тарту мен қазақ күресінің ережелері мен тарихы.',
        learningObjectivesTr: ['Bozkır geleneksel sporlarını ve terimlerini akıcı bir dille anlatabilme'],
        learningObjectivesKz: ['Ұлттық ойындарды сипаттау'],
        vocabulary: [
          {
            id: 'v-b2-9',
            kazakhCyrillic: 'Көкпар',
            kazakhLatin: 'Kökpar',
            turkish: 'Kökbörü / Kökpar (Atlı oğlak kapmaca oyunu)',
            phoneticGuide: 'kök-par',
            partOfSpeech: 'noun',
            exampleKazakh: 'Көкпар – ерлік пен ептіліктің сыны.',
            exampleTurkish: 'Kökpar, yiğitlik ve çevikliğin sınavıdır.',
            category: 'Spor'
          },
          {
            id: 'v-b2-10',
            kazakhCyrillic: 'Балуан',
            kazakhLatin: 'Baluwan',
            turkish: 'Pehlivan / Güreşçi',
            phoneticGuide: 'ba-lu-an',
            partOfSpeech: 'noun',
            exampleKazakh: 'Қазақ күресінен өткен жарыста бас балуан жеңіске жетті.',
            exampleTurkish: 'Kazak güreşi müsabakasında başpehlivan zafere ulaştı.',
            category: 'Spor'
          }
        ],
        grammar: {
          titleTr: 'Zaman Zarfları ve Benzetme Ekleri (-дай/-дей, -ша/-ше)',
          titleKz: 'Салыстыру және ұқсату мәні',
          explanationTr: 'Kartal gibi: Бүркіт-тей; Kazakça: Қазақ-ша.',
          explanationKz: '-дай/-дей жұрнақтары.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-b2-3-1',
          titleTr: 'Dünya Göçebe Oyunlarında',
          titleKz: 'Көшпенділер ойындарында',
          contextTr: 'Seyirciler Kökpar finalini heyecanla izliyor.',
          contextKz: 'Көкпар финалын тамашалау.',
          lines: [
            {
              id: 'dl-b2-3-1a',
              speaker: 'Жанкүйер',
              avatar: '🐎',
              kazakh: 'Мына шабандоз ат үстінде еркін ойнайды екен!',
              turkish: 'Şu binici at üstünde ne kadar da ustalıkla hareket ediyor!'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-b2-3-1',
            type: 'multiple_choice',
            questionTr: 'Kazakçada «Pehlivan / Güreşçi» anlamına gelen kelime hangisidir?',
            questionKz: '«Pehlivan» сөзінің қазақшасы:',
            options: ['Балуан', 'Мерген', 'Шабандоз', 'Ұста'],
            correctAnswer: 'Балуан',
            explanationTr: 'Doğru! Güreşçiye / pehlivana «Балуан» denir.',
            explanationKz: 'Дұрыс! Балуан = Güreşçi.',
            points: 15
          }
        ],
        isPublished: true
      },
      {
        id: 'lesson-b2-3-2',
        unitId: 'unit-b2-3',
        lessonNumber: 2,
        titleTr: 'Ders 2: Keçe Ev (Киіз үй) Mimarisi ve Felsefesi',
        titleKz: '2-сабақ: Киіз үйдің құрылысы мен ғарыштық философиясы',
        summaryTr: 'Шаңырақ (çatı kubbesi/çemberi), кереге (kafes duvar), уық (kubbe çıtaları) ve aile ocağı.',
        summaryKz: 'Шаңырақ, кереге, уық және бау-шулардың мағынасы.',
        learningObjectivesTr: ['Kazak çadır mimarisini, parçalarını ve milli sembolik anlamlarını açıklayabilme'],
        learningObjectivesKz: ['Киіз үйдің құрылымын білу'],
        vocabulary: [
          {
            id: 'v-b2-11',
            kazakhCyrillic: 'Шаңырақ',
            kazakhLatin: 'Şañyraq',
            turkish: 'Şanırak (Çadırın tepe kubbesi / Aile ocağı)',
            phoneticGuide: 'şa-ñy-raq',
            partOfSpeech: 'noun',
            exampleKazakh: 'Шаңырағың биік, керегең кең болсын!',
            exampleTurkish: 'Ocağın yüce, evin ferah olsun!',
            category: 'Kültür'
          },
          {
            id: 'v-b2-12',
            kazakhCyrillic: 'Кереге',
            kazakhLatin: 'Kerege',
            turkish: 'Kerege (Çadırın açılır kapanır ahşap kafes duvarı)',
            phoneticGuide: 'ke-re-ge',
            partOfSpeech: 'noun',
            exampleKazakh: 'Керегені жинап, көшке дайындалды.',
            exampleTurkish: 'Kafes duvarları toplayıp göçe hazırlandılar.',
            category: 'Kültür'
          }
        ],
        grammar: {
          titleTr: 'Dilek ve Temenni İfadeleri (-сын/-сін)',
          titleKz: 'Бата-тілек формалары',
          explanationTr: 'Hayırlı dualarda kullanılır: Шаңырағың биік бол-сын (Ocağın yüce olsun).',
          explanationKz: 'Бата сөздерінің грамматикасы.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-b2-3-2',
          titleTr: 'Yeni Evlenen Gençlere Şanırak Duası',
          titleKz: 'Шаңырақ көтеру',
          contextTr: 'Büyükler yeni yuva kuran gençlere ak dua veriyor.',
          contextKz: 'Ақ бата беру.',
          lines: [
            {
              id: 'dl-b2-3-2a',
              speaker: 'Ақсақал',
              avatar: '🧓',
              kazakh: 'Көтерген шаңырақтарың құтты болсын, іші қуанышқа толсын!',
              turkish: 'Kaldırdığınız şanırak kutlu olsun, içi sevinçle dolsun!'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-b2-3-2',
            type: 'multiple_choice',
            questionTr: 'Kazakistan devlet armasında da yer alan, çadırın göğe bakan en üst çemberine ne denir?',
            questionKz: 'Киіз үйдің ең жоғарғы бөлігі:',
            options: ['Шаңырақ', 'Кереге', 'Уық', 'Түндік'],
            correctAnswer: 'Шаңырақ',
            explanationTr: 'Doğru! Çadırın tepe kasnağına ve aile ocağına «Шаңырақ» denir.',
            explanationKz: 'Дұрыс! Шаңырақ = Aile ocağının tepe kubbesi.',
            points: 15
          }
        ],
        isPublished: true
      }
    ]
  },

  // ==========================================
  // LEVEL C1 - UNIT 1: AKADEMİK TÜRKOLOJİ
  // ==========================================
  {
    id: 'unit-c1-1',
    unitNumber: 1,
    level: 'C1',
    direction: 'TR_TO_KZ',
    titleTr: 'Ünite 1: Karşılaştırmalı Türkoloji ve Ses Yasaları',
    titleKz: '1-бөлім: Салыстырмалы түркітану және дыбыс заңдары',
    descriptionTr: 'Ortak Türk tarihi, Orhun Yazıtları, Kıpçak-Oğuz ses denklikleri ve uluslararası resmi yazışmalar.',
    descriptionKz: 'Түркі тілдерінің салыстырмалы грамматикасы, ресми құжаттар және дипломатиялық қатынастар.',
    icon: 'Crown',
    isPublished: true,
    version: 6,
    lessons: [
      {
        id: 'lesson-c1-1-1',
        unitId: 'unit-c1-1',
        lessonNumber: 1,
        titleTr: 'Ders 1: Kıpçak ve Oğuz Grubu Ses Denklikleri (y- ~ c-, -ğ- ~ -w-)',
        titleKz: '1-сабақ: Қыпшақ және оғыз дыбыс сәйкестіктері',
        summaryTr: 'Etimolojik geçiş kuralları: Yol ➔ Жол, Dağ ➔ Тау, Taş ➔ Тас.',
        summaryKz: 'Тарихи фонетикалық заңдылықтар.',
        learningObjectivesTr: ['Düzenli ses denkliklerini uygulayarak bilinmeyen kelimelerin köklerini tespit edebilme'],
        learningObjectivesKz: ['Дыбыс сәйкестіктерін талдай білу'],
        vocabulary: [
          {
            id: 'v-c1-1',
            kazakhCyrillic: 'Мұрағат',
            kazakhLatin: 'Murağat',
            turkish: 'Arşiv / Belgelik',
            phoneticGuide: 'mu-ra-ğat',
            partOfSpeech: 'noun',
            exampleKazakh: 'Мемлекеттік мұрағатта көне қолжазбалар сақталған.',
            exampleTurkish: 'Devlet arşivinde kadim el yazmaları korunmaktadır.',
            category: 'Akademik Terimler'
          },
          {
            id: 'v-c1-2',
            kazakhCyrillic: 'Үндестік',
            kazakhLatin: 'Ündestіk',
            turkish: 'Uyum / Ahenk / Fonetik senkretizm',
            phoneticGuide: 'ün-des-tik',
            partOfSpeech: 'noun',
            exampleKazakh: 'Тілдегі дыбыс үндестігі – заңды құбылыс.',
            exampleTurkish: 'Dildeki ses uyumu kanuni bir hadisedir.',
            category: 'Akademik Terimler'
          }
        ],
        grammar: {
          titleTr: 'C1: Kıpçak-Oğuz Düzenli Ses Yasaları',
          titleKz: 'Қыпшақ-оғыз дыбыстық заңдары',
          explanationTr: '1. Söz başı Y- (Oğuz) ➔ J- (Kıpçak): Yıl ➔ Жыл, Yol ➔ Жол. 2. Söz sonu -Ğ (Oğuz) ➔ -W (Kıpçak): Dağ ➔ Тау, Bağ ➔ Бау. 3. Ş / S denkliği: Taş ➔ Тас.',
          explanationKz: 'Түркітану ғылымында бұл заңдылықтар тарихи фонетиканың негізі саналады.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-c1-1',
          titleTr: 'Uluslararası Türkoloji Kongresinde Bildiri',
          titleKz: 'Түркітану конгресінде',
          contextTr: 'Bilim insanları Türk dünyasının ortak terminolojisini tartışıyor.',
          contextKz: 'Ғалымдар ортақ терминологияны талқылауда.',
          lines: [
            {
              id: 'dl-c1-1',
              speaker: 'Профессор',
              avatar: '👨‍🏫',
              kazakh: 'Түркі тілдес халықтардың ортақ әліпбиі біздің рухани бірлігіміздің кепілі.',
              turkish: 'Türk dilli halkların ortak alfabesi manevi birliğimizin teminatıdır.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-c1-1',
            type: 'multiple_choice',
            questionTr: 'Kıpçak-Oğuz ses denkliğine göre Türkçedeki «Yol» kelimesinin Kazakça etimolojik karşılığı hangisidir?',
            questionKz: '«Yol» сөзінің қазақшасы:',
            options: ['Жол', 'Тол', 'Қол', 'Сол'],
            correctAnswer: 'Жол',
            explanationTr: 'Doğru! Türkiye Türkçesindeki kelime başı "y-" sesi Kazakçada düzenli olarak "ж-" (j) sesine denk gelir: Yol ➔ Жол.',
            explanationKz: 'Дұрыс! Оғызша «yol» қыпшақша «жол» болады.',
            points: 20
          }
        ],
        isPublished: true
      },
      {
        id: 'lesson-c1-1-2',
        unitId: 'unit-c1-1',
        lessonNumber: 2,
        titleTr: 'Ders 2: Orhun Yazıtları ve Kadim Kıpçak Metinleri (Kül Tigin & Bilge Kağan)',
        titleKz: '2-сабақ: Орхон ескерткіштері және көне қыпшақ жазбалары',
        summaryTr: 'Göktürk runik yazısı, Kül Tigin abidesi, Kodeks Kumanikus ve dil tarihi evrimi.',
        summaryKz: 'Күлтегін, Білге қаған ескерткіштері және «Кодекс Куманикус».',
        learningObjectivesTr: ['Kadim Türk kitabelerinin dilini ve Kazak Türkçesiyle olan doğrudan bağlarını inceleyebilme'],
        learningObjectivesKz: ['Көне түркі жазбаларын талдау'],
        vocabulary: [
          {
            id: 'v-c1-3',
            kazakhCyrillic: 'Мәңгілік',
            kazakhLatin: 'Mäñgіlіk',
            turkish: 'Ebedi / Sonsuz / Bengü',
            phoneticGuide: 'mäñ-gi-lik',
            partOfSpeech: 'adj',
            exampleKazakh: '«Мәңгілік Ел» идеясы – ата-баба аманаты.',
            exampleTurkish: '«Bengü İl (Ebedi Millet)» fikri ecdadın emanetidir.',
            category: 'Akademik'
          },
          {
            id: 'v-c1-4',
            kazakhCyrillic: 'Жәдігер',
            kazakhLatin: 'Jädіger',
            turkish: 'Yadigâr / Tarihi miras / Kıymetli eser',
            phoneticGuide: 'jä-di-ger',
            partOfSpeech: 'noun',
            exampleKazakh: 'Көне түркі ескерткіштері – баға жетпес жәдігер.',
            exampleTurkish: 'Kadim Türk anıtları paha biçilmez bir yadigârdır.',
            category: 'Akademik'
          }
        ],
        grammar: {
          titleTr: 'Eski Türkçe ve Çağdaş Kazakça Morfolojik Süreklilik',
          titleKz: 'Морфологиялық сабақтастық',
          explanationTr: 'Eski Türkçedeki ilgi eki (-nıñ), yönelme eki (-qa/-ke) ve şahıs ekleri günümüz Kazakçasında en saf şekliyle yaşamaktadır.',
          explanationKz: 'Тарихи морфология.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-c1-1-2',
          titleTr: 'Kül Tigin Abidesi Önünde Tartışma',
          titleKz: 'Күлтегін ескерткіші қасында',
          contextTr: 'Türkoloji araştırmacıları bengü taş metnini okuyor.',
          contextKz: 'Көне мәтінді оқу.',
          lines: [
            {
              id: 'dl-c1-1-2a',
              speaker: 'Түркітанушы',
              avatar: '📜',
              kazakh: '«Үстінде көк тәңірі, астында қара жер жаралғанда, екеуінің арасында адам баласы жаралған» деген сөздер тасқа қашалған.',
              turkish: '«Üstte mavi gök, altta kara yer kılındıkta, ikisi arasında insanoğlu yaratılmış» sözleri taşa kazınmıştır.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-c1-1-2',
            type: 'multiple_choice',
            questionTr: 'Kazakçada tarihi miras / yadigâr anlamına gelen kelime hangisidir?',
            questionKz: '«Yadigâr / Miras» сөзінің қазақшасы:',
            options: ['Жәдігер', 'Бұйым', 'Тауар', 'Кітап'],
            correctAnswer: 'Жәдігер',
            explanationTr: 'Doğru! Жәдігер = Tarihi yadigâr / miras.',
            explanationKz: 'Дұрыс! Жәдігер = Tarihi yadigâr.',
            points: 20
          }
        ],
        isPublished: true
      }
    ]
  },

  // ==========================================
  // LEVEL C1 - UNIT 2: DİPLOMASİ VE TÜRK DÜNYASI
  // ==========================================
  {
    id: 'unit-c1-2',
    unitNumber: 2,
    level: 'C1',
    direction: 'TR_TO_KZ',
    titleTr: 'Ünite 2: Diplomatik İlişkiler ve Türk Dünyası Entegrasyonu',
    titleKz: '2-бөлім: Дипломатиялық қатынастар және Түркі интеграциясы',
    descriptionTr: 'Türk Devletleri Teşkilatı (TDT), resmi protokol, ortak alfabe çalışmaları ve uluslararası anlaşmalar.',
    descriptionKz: 'Түркі мемлекеттері ұйымы, ортақ әліпби және ресми құжаттар тілі.',
    icon: 'Building2',
    isPublished: true,
    version: 6,
    lessons: [
      {
        id: 'lesson-c1-2-1',
        unitId: 'unit-c1-2',
        lessonNumber: 1,
        titleTr: 'Ders 1: Türk Devletleri Teşkilatı ve Ortak Terminoloji',
        titleKz: '1-сабақ: Түркі мемлекеттері ұйымы және ортақ терминология',
        summaryTr: 'Ankara, Astana, Bakü, Taşkent, Bişkek hattında stratejik ortaklık ve ortak dil çalışmaları.',
        summaryKz: 'Бауырлас елдердің саяси, экономикалық және мәдени ынтымақтастығы.',
        learningObjectivesTr: ['Uluslararası diplomatik ilişkiler ve çok taraflı antlaşmalar terminolojisine hakim olabilme'],
        learningObjectivesKz: ['Халықаралық дипломатиялық терминдерді меңгеру'],
        vocabulary: [
          {
            id: 'v-c1-5',
            kazakhCyrillic: 'Ынтымақтастық',
            kazakhLatin: 'Yntymaqtastyq',
            turkish: 'İş birliği / Dayanışma / Dayanışmacı entegrasyon',
            phoneticGuide: 'yn-ty-maq-tas-tyq',
            partOfSpeech: 'noun',
            exampleKazakh: 'Түркі мемлекеттері арасындағы жан-жақты ынтымақтастық нығаюда.',
            exampleTurkish: 'Türk devletleri arasındaki çok yönlü iş birliği güçlenmektedir.',
            category: 'Diplomasi'
          },
          {
            id: 'v-c1-6',
            kazakhCyrillic: 'Келісімшарт',
            kazakhLatin: 'Kelіsіmşart',
            turkish: 'Anlaşma / Sözleşme / Pakt',
            phoneticGuide: 'ke-li-sim-şart',
            partOfSpeech: 'noun',
            exampleKazakh: 'Екі ел арасында стратегиялық серіктестік туралы келісімшартқа қол қойылды.',
            exampleTurkish: 'İki ülke arasında stratejik ortaklık anlaşması imzalandı.',
            category: 'Diplomasi'
          }
        ],
        grammar: {
          titleTr: 'Diplomatik ve Hukuki İfadelerde Edilgen Çatı (-ыл/-іл, -лын/-лін)',
          titleKz: 'Ырықсыз етіс формасы',
          explanationTr: 'Resmi metinlerde faili gizleme: Қол қой-ыл-ды (İmzalandı), Қабылдан-ды (Kabul edildi).',
          explanationKz: 'Ресми іс қағаздарындағы ырықсыз етіс.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-c1-2-1',
          titleTr: 'TDT Zirvesi Sonuç Bildirgesi',
          titleKz: 'Саммит қорытындысы',
          contextTr: 'Diplomatlar ortak basın açıklamasını okuyor.',
          contextKz: 'Ресми мәлімдеме.',
          lines: [
            {
              id: 'dl-c1-2-1a',
              speaker: 'Дипломат',
              avatar: '🤝',
              kazakh: 'Түркі әлемінің 2040 жылға дейінгі көзқарасы біздің экономикалық және мәдени бірлігіміздің негізі.',
              turkish: 'Türk Dünyası 2040 Vizyonu ekonomik ve manevi birliğimizin temelidir.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-c1-2-1',
            type: 'multiple_choice',
            questionTr: 'Kazakçada «İş birliği / Dayanışma» anlamına gelen diplomatik terim hangisidir?',
            questionKz: '«İş birliği» терминінің қазақшасы:',
            options: ['Ынтымақтастық', 'Бәсекелестік', 'Кедергі', 'Сайыс'],
            correctAnswer: 'Ынтымақтастық',
            explanationTr: 'Doğru! Ынтымақтастық = İş birliği / Dayanışma.',
            explanationKz: 'Дұрыс! Ынтымақтастық = İş birliği.',
            points: 20
          }
        ],
        isPublished: true
      },
      {
        id: 'lesson-c1-2-2',
        unitId: 'unit-c1-2',
        lessonNumber: 2,
        titleTr: 'Ders 2: Ortak 34 Harfli Türk Alfabesi ve Gelecek Vizyonu',
        titleKz: '2-сабақ: Ортақ 34 әріпті түркі әліпбиі және келешек',
        summaryTr: 'Bakü 1926 Türkiyat Kurultayı\'ndan günümüze ortak Latin alfabesi tasarımı ve dil köprüsü.',
        summaryKz: 'Ортақ түркі әліпбиі комиссиясының шешімдері.',
        learningObjectivesTr: ['Ortak Türk alfabesi ses sistemini ve dil politikalarını akademik seviyede tartışabilme'],
        learningObjectivesKz: ['Ортақ әліпби жүйесін түсіндіру'],
        vocabulary: [
          {
            id: 'v-c1-7',
            kazakhCyrillic: 'Үйлестіру',
            kazakhLatin: 'Üylestіrw',
            turkish: 'Koordinasyon / Uyumlaştırma / Harmonizasyon',
            phoneticGuide: 'üy-les-ti-ru',
            partOfSpeech: 'noun',
            exampleKazakh: 'Тіл саясатын үйлестіру комиссиясы жұмыс жүргізуде.',
            exampleTurkish: 'Dil politikasını uyumlaştırma komisyonu çalışmalar yürütmektedir.',
            category: 'Akademik'
          },
          {
            id: 'v-c1-8',
            kazakhCyrillic: 'Бауырластық',
            kazakhLatin: 'Bawyrlastyq',
            turkish: 'Kardeşlik / Uhuvvet',
            phoneticGuide: 'ba-wyr-las-tyq',
            partOfSpeech: 'noun',
            exampleKazakh: 'Түркі халықтарының бауырластығы – тарихпен сыналған мызғымас байланыс.',
            exampleTurkish: 'Türk halklarının kardeşliği tarihle sınanmış sarsılmaz bir bağdır.',
            category: 'Kültür'
          }
        ],
        grammar: {
          titleTr: 'İleri Seviye Cümle Bağlama ve Karşılaştırma Yapıları',
          titleKz: 'Күрделі ой түйіндеу',
          explanationTr: 'Akademik makalelerde tez savunma ve sonuç çıkarma: Қорыта келгенде (Sonuç olarak), Бұдан шығатын қорытынды (Buradan çıkarılan netice).',
          explanationKz: 'Қорытынды жасау формалары.',
          rules: [],
          examples: [],
          commonMistakes: []
        },
        dialogue: {
          id: 'dlg-c1-2-2',
          titleTr: 'Ortak Alfabe Paneli',
          titleKz: 'Ортақ әліпби конференциясы',
          contextTr: 'Dil bilimciler 34 harfli ortak Latin alfabesini değerlendiriyor.',
          contextKz: 'Тіл білімі мамандары.',
          lines: [
            {
              id: 'dl-c1-2-2a',
              speaker: 'Ғалым',
              avatar: '🎓',
              kazakh: 'Ортақ әліпби – миллиондаған қандастың бір-бірін еш аудармасыз түсінуіне жол ашады.',
              turkish: 'Ortak alfabe, milyonlarca soydaşın birbirini hiçbir tercüme olmadan anlamasına yol açacaktır.'
            }
          ]
        },
        exercises: [
          {
            id: 'ex-c1-2-2',
            type: 'multiple_choice',
            questionTr: 'Kazakçada «Kardeşlik / Uhuvvet» anlamına gelen kelime hangisidir?',
            questionKz: '«Kardeşlik» сөзінің қазақшасы:',
            options: ['Бауырластық', 'Достық', 'Көршілік', 'Таныстық'],
            correctAnswer: 'Бауырластық',
            explanationTr: 'Doğru! Бауырластық = Kardeşlik.',
            explanationKz: 'Дұрыс! Бауырластық = Kardeşlik.',
            points: 20
          }
        ],
        isPublished: true
      }
    ]
  }
];

export const initialBadges: UserBadge[] = [
  {
    id: 'badge-1',
    titleTr: 'İlk Adım',
    titleKz: 'Алғашқы қадам',
    descriptionTr: 'İlk dersi başarıyla tamamladınız.',
    descriptionKz: 'Алғашқы сабақты сәтті аяқтадыңыз.',
    icon: 'Award',
    unlockedAt: '2026-10-10'
  },
  {
    id: 'badge-2',
    titleTr: 'Kelime Avcısı',
    titleKz: 'Сөз шебері',
    descriptionTr: '25 kelimeyi hafızanıza kaydettiniz.',
    descriptionKz: '25 сөзді жаттап үйрендіңіз.',
    icon: 'BookOpen',
    unlockedAt: '2026-10-10'
  },
  {
    id: 'badge-3',
    titleTr: 'Sürekli Öğrenen',
    titleKz: 'Тұрақты оқушы',
    descriptionTr: '7 günlük kesintisiz öğrenme serisi yakaladınız.',
    descriptionKz: '7 күн қатарынан оқу сериясын жалғастырдыңыз.',
    icon: 'Flame',
    unlockedAt: '2026-10-10'
  },
  {
    id: 'badge-4',
    titleTr: 'Bozkırın Sesi',
    titleKz: 'Дала дауысы',
    descriptionTr: 'Telaffuz sınavında %90 üzeri başarı aldınız.',
    descriptionKz: 'Дыбыстау емтиханынан 90%-дан жоғары балл алдыңыз.',
    icon: 'Mic',
    unlockedAt: '2026-10-10'
  },
  {
    id: 'badge-5',
    titleTr: 'Gramer Ustası',
    titleKz: 'Грамматика шебері',
    descriptionTr: 'Tüm ek ve zaman kurallarını hatasız çözdünüz.',
    descriptionKz: 'Жалғаулар мен шақтарды қатесіз орындадыңыз.',
    icon: 'CheckCircle2',
    unlockedAt: '2026-10-10'
  },
  {
    id: 'badge-6',
    titleTr: 'Türkoloji Bilgini (C1)',
    titleKz: 'Түркітану ғалымы',
    descriptionTr: 'İleri C1 akademik Türkoloji düzeyine ulaştınız.',
    descriptionKz: 'Жоғары C1 академиялық деңгейге жеттіңіз.',
    icon: 'Crown',
    unlockedAt: '2026-10-10'
  }
];
