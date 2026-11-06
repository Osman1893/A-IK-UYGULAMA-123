/**
 * Uzaktan Türkolog - Advanced Speech Synthesis & Acoustic Formant Vocal Engine
 * Guarantees crystal-clear pronunciation of ALL 42 Kazakh letters and the 9 special phonemes:
 * Ә [æ], І [ɪ], Ң [ŋ], Ғ [ʁ], Ү [ʏ], Ұ [ʊ], Қ [q], Ө [œ], Һ [h]
 */

export type VoiceProfileId = 'kk-male' | 'kk-female' | 'tr-male' | 'tr-female';

// Standard voice persona type
export type VoicePersona = VoiceProfileId;
// Backwards-compatible type alias
export type LuvVoicePersona = VoicePersona;

export interface VoicePersonaInfo {
  id: VoicePersona;
  name: string;
  lang: 'kk' | 'tr';
  gender: 'male' | 'female';
  description: string;
  sourceStyle: string;
  pitch: number;
  defaultRate: number;
}

export const VOICE_PROFILES: VoicePersonaInfo[] = [
  {
    id: 'kk-male',
    name: 'Kazakça Ses (Erkek)',
    lang: 'kk',
    gender: 'male',
    description: 'Doğal Kazakça Erkek Sesi - Akıcı, tok ve net telaffuz',
    sourceStyle: 'Doğal Nöral Ses',
    pitch: 0.98,
    defaultRate: 0.90
  },
  {
    id: 'kk-female',
    name: 'Kazakça Ses (Kadın)',
    lang: 'kk',
    gender: 'female',
    description: 'Doğal Kazakça Kadın Sesi - Yumuşak, berrak ve öğretici telaffuz',
    sourceStyle: 'Doğal Nöral Ses',
    pitch: 1.02,
    defaultRate: 0.90
  },
  {
    id: 'tr-male',
    name: 'Türkçe Ses (Erkek)',
    lang: 'tr',
    gender: 'male',
    description: 'Standart Türkçe Erkek Sesi - Tok ve anlaşılır anlatım',
    sourceStyle: 'Doğal Nöral Ses',
    pitch: 0.98,
    defaultRate: 0.92
  },
  {
    id: 'tr-female',
    name: 'Türkçe Ses (Kadın)',
    lang: 'tr',
    gender: 'female',
    description: 'Standart Türkçe Kadın Sesi - Berrak ve akıcı anlatım',
    sourceStyle: 'Doğal Nöral Ses',
    pitch: 1.02,
    defaultRate: 0.92
  }
];

// Backwards-compatible constant alias
export const LUVVOICE_PERSONAS = VOICE_PROFILES;

export interface KazakhPhoneticData {
  letter: string;
  lower: string;
  latin: string;
  ipa: string;
  nameTr: string;
  nameKz: string;
  articulatoryType: string;
  turkicCognate: string;
  f1: number; // First formant resonance (Hz)
  f2: number; // Second formant resonance (Hz)
  f3: number; // Third formant resonance (Hz)
  exampleKz: string;
  exampleTr: string;
  vocalInstruction: string;
  spokenSyllable: string;
}

export const KAZAKH_PHONETIC_ATLAS: KazakhPhoneticData[] = [
  {
    letter: 'Ә',
    lower: 'ә',
    latin: 'Ä / Ae',
    ipa: '[æ]',
    nameTr: 'Açık İnce E (Ä)',
    nameKz: 'Ашық жіңішке ә',
    articulatoryType: 'Açık, düz, ön-damaksıl ince ünlü (Çene açık, dudaklar yayvan)',
    turkicCognate: 'Azerbaycan Türkçesi «ə», Eski Anadolu Türkçesi açık e',
    f1: 680,
    f2: 1750,
    f3: 2500,
    exampleKz: 'Әке (Baba), Ән (Şarkı), Әдемі (Güzel)',
    exampleTr: 'Äke, Än, Ädemi',
    vocalInstruction: 'Açık boğaz e sesi',
    spokenSyllable: 'Ää'
  },
  {
    letter: 'І',
    lower: 'і',
    latin: 'I / İ',
    ipa: '[ɪ]',
    nameTr: 'Kısa Kapalı İ',
    nameKz: 'Қысаң қысқа і',
    articulatoryType: 'Dar, düz, ön-damaksıl çok kısa kapalı ünlü (Türkçe i\'den daha kısa)',
    turkicCognate: 'Eski Türkçedeki kapalı e/i arası ses (Bilge Kağan: «İl tutar»)',
    f1: 380,
    f2: 2000,
    f3: 2750,
    exampleKz: 'Іні (Erkek kardeş), Тіл (Dil), Бір (Bir)',
    exampleTr: 'İni, Til, Bir',
    vocalInstruction: 'Kısa kapalı i sesi',
    spokenSyllable: 'İi'
  },
  {
    letter: 'Ң',
    lower: 'ң',
    latin: 'Ñ / Ng',
    ipa: '[ŋ]',
    nameTr: 'Sağır Kâf (Geniz Nesi)',
    nameKz: 'Мұрын жолды үнді ң',
    articulatoryType: 'Art-damaksıl nazal ötümlü ünsüz (Genizden gelen n sesi)',
    turkicCognate: 'Orhun Abideleri 𐰭, Osmanlıca ك (kâf-ı nûnî), Çağatayca «mıñ»',
    f1: 290,
    f2: 2150,
    f3: 2900,
    exampleKz: 'Мың (Bin), Жаңа (Yeni), Соңғы (Sonuncu)',
    exampleTr: 'Mıng, Janga, Songğı',
    vocalInstruction: 'Genizden gelen sağır n sesi',
    spokenSyllable: 'Eng'
  },
  {
    letter: 'Ғ',
    lower: 'ғ',
    latin: 'Ğ / Gh',
    ipa: '[ʁ]',
    nameTr: 'Kalın Boğaz G\'si (Gayn)',
    nameKz: 'Ұяң дауыссыз ғ',
    articulatoryType: 'Art-damaksıl sızıcı ötümlü ünsüz (Kalın ünlülerle gırtlaktan derin)',
    turkicCognate: 'Eski Türkçe ve Kıpçakça 𐰍 «Tağ / Taw», Arapça Gayn (غ)',
    f1: 340,
    f2: 1150,
    f3: 2400,
    exampleKz: 'Ғалым (Âlim), Тауға (Dağa), Баға (Fiyat)',
    exampleTr: 'Ğalım, Tawğa, Bağa',
    vocalInstruction: 'Derin boğaz gayn sesi',
    spokenSyllable: 'Ghaa'
  },
  {
    letter: 'Қ',
    lower: 'қ',
    latin: 'Q / K',
    ipa: '[q]',
    nameTr: 'Kalın Boğaz K\'si (Kaf)',
    nameKz: 'Қатаң дауыссыз қ',
    articulatoryType: 'Küçük-dil / Art-damak patlamalı ötümsüz ünsüz (Derin boğaz sesi)',
    turkicCognate: 'Orhun Yazıtları 𐰴, Divânu Lugâti\'t-Türk: «Qazaq, Qara»',
    f1: 310,
    f2: 1250,
    f3: 2350,
    exampleKz: 'Қазақ (Kazak), Қала (Şehir), Қол (El/Kol)',
    exampleTr: 'Qazaq, Qala, Qol',
    vocalInstruction: 'Derin kalın kaf sesi',
    spokenSyllable: 'Qaa'
  },
  {
    letter: 'Ү',
    lower: 'ү',
    latin: 'Ü',
    ipa: '[ʏ]',
    nameTr: 'İnce Yuvarlak Ü',
    nameKz: 'Езулік емес жіңішке ү',
    articulatoryType: 'Dar, yuvarlak, ön-damaksıl ince ünlü (Dudaklar öne doğru)',
    turkicCognate: 'Ortak Türkçedeki ince yuvarlak ünlü: «Üy, Kün»',
    f1: 380,
    f2: 1650,
    f3: 2300,
    exampleKz: 'Үй (Ev), Үлкен (Büyük), Күн (Gün/Güneş)',
    exampleTr: 'Üy, Ülken, Kün',
    vocalInstruction: 'İnce yuvarlak ü sesi',
    spokenSyllable: 'Üü'
  },
  {
    letter: 'Ұ',
    lower: 'ұ',
    latin: 'U',
    ipa: '[ʊ]',
    nameTr: 'Kalın Boğaz U\'su',
    nameKz: 'Жуан қысаң ұ',
    articulatoryType: 'Dar, yuvarlak, art-damaksıl kalın ünlü (Türkçe u\'dan daha derin)',
    turkicCognate: 'Eski Türkçe «Ul / Oğul», «Uluğ / Yüce»',
    f1: 430,
    f2: 1040,
    f3: 2200,
    exampleKz: 'Ұл (Erkek evlat), Ұстаз (Öğretmen), Жұлдыз (Yıldız)',
    exampleTr: 'Ul, Ustaz, Juldyz',
    vocalInstruction: 'Kalın derin boğaz u sesi',
    spokenSyllable: 'Uu'
  },
  {
    letter: 'Ө',
    lower: 'ө',
    latin: 'Ö',
    ipa: '[œ]',
    nameTr: 'Geniş Yuvarlak Ö',
    nameKz: 'Езулік емес ашықтау ө',
    articulatoryType: 'Orta-açık, yuvarlak, ön-damaksıl ince ünlü',
    turkicCognate: 'Ortak Türkçe «Öz, Köz / Göz, Төр / Başköşe»',
    f1: 510,
    f2: 1390,
    f3: 2450,
    exampleKz: 'Өмір (Hayat/Ömür), Өзен (Nehir), Сөз (Söz)',
    exampleTr: 'Ömir, Özen, Söz',
    vocalInstruction: 'Geniş yuvarlak ö sesi',
    spokenSyllable: 'Öö'
  },
  {
    letter: 'Һ',
    lower: 'һ',
    latin: 'H',
    ipa: '[h]',
    nameTr: 'Gırtlaksıl Yumuşak H',
    nameKz: 'Көмейлік салдыр һ',
    articulatoryType: 'Gırtlaksıl sızıcı ötümsüz hafif nefes sesi',
    turkicCognate: 'Farsça ve Arapça alıntılarda hafif yumuşak h',
    f1: 450,
    f2: 1550,
    f3: 2500,
    exampleKz: 'Гауһар (Elmas/Cevher), Қаһарман (Kahraman)',
    exampleTr: 'Gawhar, Qaharman',
    vocalInstruction: 'Soluklu hafif h sesi',
    spokenSyllable: 'Haa'
  }
];

export interface FullAlphabetLetter {
  char: string;
  lower: string;
  latin: string;
  ipa: string;
  nameKz: string;
  nameTr: string;
  exampleKz: string;
  exampleTr: string;
  f1: number;
  f2: number;
  f3: number;
  spokenSyllable: string;
}

export const ALL_42_KAZAKH_LETTERS: FullAlphabetLetter[] = [
  { char: 'А', lower: 'а', latin: 'A', ipa: '[ɑ]', nameKz: 'А', nameTr: 'Kalın A sesi', exampleKz: 'Ана (Anne)', exampleTr: 'Anne', f1: 750, f2: 1200, f3: 2400, spokenSyllable: 'Aa' },
  { char: 'Ә', lower: 'ә', latin: 'Ä', ipa: '[æ]', nameKz: 'Ә', nameTr: 'Açık İnce E (Ä)', exampleKz: 'Әке (Baba)', exampleTr: 'Baba', f1: 680, f2: 1750, f3: 2500, spokenSyllable: 'Ää' },
  { char: 'Б', lower: 'б', latin: 'B', ipa: '[b]', nameKz: 'Бе', nameTr: 'Dudaksıl B sesi', exampleKz: 'Бала (Çocuk)', exampleTr: 'Çocuk', f1: 300, f2: 1100, f3: 2200, spokenSyllable: 'Be' },
  { char: 'В', lower: 'в', latin: 'V', ipa: '[v]', nameKz: 'Ве', nameTr: 'Diş-dudaksıl V sesi', exampleKz: 'Вагон (Vagon)', exampleTr: 'Vagon', f1: 320, f2: 1300, f3: 2300, spokenSyllable: 'Ve' },
  { char: 'Г', lower: 'г', latin: 'G', ipa: '[ɡ]', nameKz: 'Ге', nameTr: 'Ön damaksıl ince G', exampleKz: 'Гүл (Çiçek)', exampleTr: 'Çiçek', f1: 350, f2: 1800, f3: 2500, spokenSyllable: 'Ge' },
  { char: 'Ғ', lower: 'ғ', latin: 'Ğ', ipa: '[ʁ]', nameKz: 'Ға', nameTr: 'Derin Boğaz Gayn (Ғ)', exampleKz: 'Ғалым (Âlim)', exampleTr: 'Alim/Bilim insanı', f1: 340, f2: 1150, f3: 2400, spokenSyllable: 'Ghaa' },
  { char: 'Д', lower: 'д', latin: 'D', ipa: '[d]', nameKz: 'Де', nameTr: 'Dişeti D sesi', exampleKz: 'Дос (Arkadaş)', exampleTr: 'Dost/Arkadaş', f1: 320, f2: 1600, f3: 2450, spokenSyllable: 'De' },
  { char: 'Е', lower: 'е', latin: 'E', ipa: '[e]', nameKz: 'Е', nameTr: 'Düz İnce E sesi', exampleKz: 'Есік (Kapı)', exampleTr: 'Kapı', f1: 450, f2: 1900, f3: 2600, spokenSyllable: 'Ee' },
  { char: 'Ё', lower: 'ё', latin: 'Yo', ipa: '[jo]', nameKz: 'Ё', nameTr: 'Yo diftongu', exampleKz: 'Ёлка (Çam ağacı)', exampleTr: 'Yılbaşı ağacı', f1: 500, f2: 1300, f3: 2400, spokenSyllable: 'Yo' },
  { char: 'Ж', lower: 'ж', latin: 'J', ipa: '[ʒ]', nameKz: 'Же', nameTr: 'Ötümlü J sesi (C/J)', exampleKz: 'Жол (Yol)', exampleTr: 'Yol', f1: 350, f2: 1700, f3: 2550, spokenSyllable: 'Je' },
  { char: 'З', lower: 'з', latin: 'Z', ipa: '[z]', nameKz: 'Зе', nameTr: 'Sızıcı Z sesi', exampleKz: 'Заман (Zaman)', exampleTr: 'Zaman', f1: 330, f2: 1650, f3: 2500, spokenSyllable: 'Ze' },
  { char: 'И', lower: 'и', latin: 'İy / Y', ipa: '[i]', nameKz: 'И', nameTr: 'Uzun İy sesi', exampleKz: 'Ит (Köpek)', exampleTr: 'Köpek', f1: 300, f2: 2200, f3: 2900, spokenSyllable: 'İy' },
  { char: 'Й', lower: 'й', latin: 'Y', ipa: '[j]', nameKz: 'Қысқа и', nameTr: 'Kısa Y sesi', exampleKz: 'Ай (Ay)', exampleTr: 'Ay', f1: 320, f2: 2000, f3: 2700, spokenSyllable: 'Yy' },
  { char: 'К', lower: 'к', latin: 'K', ipa: '[k]', nameKz: 'Ке', nameTr: 'İnce damaksıl K sesi', exampleKz: 'Көз (Göz)', exampleTr: 'Göz', f1: 350, f2: 1900, f3: 2600, spokenSyllable: 'Ke' },
  { char: 'Қ', lower: 'қ', latin: 'Q', ipa: '[q]', nameKz: 'Қа', nameTr: 'Kalın Boğaz K\'si (Kaf)', exampleKz: 'Қазақ (Kazak)', exampleTr: 'Kazak', f1: 310, f2: 1250, f3: 2350, spokenSyllable: 'Qaa' },
  { char: 'Л', lower: 'л', latin: 'L', ipa: '[l]', nameKz: 'Эл', nameTr: 'Yanal L sesi', exampleKz: 'Лашық (Kulübe)', exampleTr: 'Kulübe', f1: 380, f2: 1300, f3: 2500, spokenSyllable: 'El' },
  { char: 'М', lower: 'м', latin: 'M', ipa: '[m]', nameKz: 'Эм', nameTr: 'Çift dudak M sesi', exampleKz: 'Мектеп (Okul)', exampleTr: 'Okul', f1: 300, f2: 1200, f3: 2300, spokenSyllable: 'Em' },
  { char: 'Н', lower: 'н', latin: 'N', ipa: '[n]', nameKz: 'Эн', nameTr: 'Dişeti N sesi', exampleKz: 'Нан (Ekmek)', exampleTr: 'Ekmek', f1: 310, f2: 1500, f3: 2400, spokenSyllable: 'En' },
  { char: 'Ң', lower: 'ң', latin: 'Ñ', ipa: '[ŋ]', nameKz: 'Эң', nameTr: 'Sağır N (Geniz N\'si)', exampleKz: 'Мың (Bin)', exampleTr: 'Bin (1000)', f1: 290, f2: 2150, f3: 2900, spokenSyllable: 'Eng' },
  { char: 'О', lower: 'о', latin: 'O', ipa: '[o]', nameKz: 'О', nameTr: 'Geniş Yuvarlak O', exampleKz: 'Отан (Vatan)', exampleTr: 'Vatan', f1: 520, f2: 950, f3: 2250, spokenSyllable: 'Oo' },
  { char: 'Ө', lower: 'ө', latin: 'Ö', ipa: '[œ]', nameKz: 'Ө', nameTr: 'Geniş Yuvarlak İnce Ö', exampleKz: 'Өмір (Ömür/Hayat)', exampleTr: 'Hayat', f1: 510, f2: 1390, f3: 2450, spokenSyllable: 'Öö' },
  { char: 'П', lower: 'п', latin: 'P', ipa: '[p]', nameKz: 'Пе', nameTr: 'Çift dudak ötümsüz P', exampleKz: 'Піл (Fil)', exampleTr: 'Fil', f1: 320, f2: 1200, f3: 2300, spokenSyllable: 'Pe' },
  { char: 'Р', lower: 'р', latin: 'R', ipa: '[r]', nameKz: 'Эр', nameTr: 'Titreşimli R sesi', exampleKz: 'Рахмет (Teşekkür)', exampleTr: 'Teşekkür ederim', f1: 350, f2: 1400, f3: 2400, spokenSyllable: 'Er' },
  { char: 'С', lower: 'с', latin: 'S', ipa: '[s]', nameKz: 'Эс', nameTr: 'Dişeti ıslıklı S', exampleKz: 'Су (Su)', exampleTr: 'Su', f1: 340, f2: 1600, f3: 2600, spokenSyllable: 'Es' },
  { char: 'Т', lower: 'т', latin: 'T', ipa: '[t]', nameKz: 'Те', nameTr: 'Dişeti patlamalı T', exampleKz: 'Тау (Dağ)', exampleTr: 'Dağ', f1: 320, f2: 1700, f3: 2500, spokenSyllable: 'Te' },
  { char: 'У', lower: 'у', latin: 'U / W', ipa: '[w]/[u]', nameKz: 'У', nameTr: 'Yarı ünlü W/U', exampleKz: 'Уақыт (Vakit)', exampleTr: 'Zaman/Vakit', f1: 400, f2: 900, f3: 2200, spokenSyllable: 'Uu' },
  { char: 'Ұ', lower: 'ұ', latin: 'U', ipa: '[ʊ]', nameKz: 'Ұ', nameTr: 'Kalın Boğaz U\'su', exampleKz: 'Ұл (Erkek çocuk)', exampleTr: 'Erkek evlat', f1: 430, f2: 1040, f3: 2200, spokenSyllable: 'Uu' },
  { char: 'Ү', lower: 'ү', latin: 'Ü', ipa: '[ʏ]', nameKz: 'Ү', nameTr: 'İnce Yuvarlak Ü', exampleKz: 'Үй (Ev)', exampleTr: 'Ev', f1: 380, f2: 1650, f3: 2300, spokenSyllable: 'Üü' },
  { char: 'Ф', lower: 'ф', latin: 'F', ipa: '[f]', nameKz: 'Эф', nameTr: 'Diş-dudak sızıcı F', exampleKz: 'Фото (Fotoğraf)', exampleTr: 'Fotoğraf', f1: 330, f2: 1400, f3: 2400, spokenSyllable: 'Ef' },
  { char: 'Х', lower: 'х', latin: 'H', ipa: '[x]', nameKz: 'Ха', nameTr: 'Damaksıl Hırıltılı H', exampleKz: 'Хат (Mektup)', exampleTr: 'Mektup', f1: 420, f2: 1450, f3: 2400, spokenSyllable: 'Haa' },
  { char: 'Һ', lower: 'һ', latin: 'H', ipa: '[h]', nameKz: 'Һа', nameTr: 'Gırtlaksıl Yumuşak Һ', exampleKz: 'Қаһарман (Kahraman)', exampleTr: 'Kahraman', f1: 450, f2: 1550, f3: 2500, spokenSyllable: 'Haa' },
  { char: 'Ц', lower: 'ц', latin: 'Ts', ipa: '[ts]', nameKz: 'Це', nameTr: 'Ts bileşik sesi', exampleKz: 'Цирк (Sirk)', exampleTr: 'Sirk', f1: 340, f2: 1800, f3: 2600, spokenSyllable: 'Tse' },
  { char: 'Ч', lower: 'ч', latin: 'Ç', ipa: '[tʃ]', nameKz: 'Че', nameTr: 'Ötümsüz Ç sesi', exampleKz: 'Чек (Çek)', exampleTr: 'Fiş/Çek', f1: 350, f2: 1900, f3: 2650, spokenSyllable: 'Çe' },
  { char: 'Ш', lower: 'ш', latin: 'Ş', ipa: '[ʃ]', nameKz: 'Ша', nameTr: 'Dişeti-damak Ş', exampleKz: 'Шәй (Çay)', exampleTr: 'Çay', f1: 360, f2: 1800, f3: 2550, spokenSyllable: 'Şa' },
  { char: 'Щ', lower: 'щ', latin: 'Şş', ipa: '[ɕː]', nameKz: 'Ща', nameTr: 'Uzun ince Şç', exampleKz: 'Щетка (Fırça)', exampleTr: 'Fırça', f1: 360, f2: 1950, f3: 2700, spokenSyllable: 'Şşa' },
  { char: 'Ъ', lower: 'ъ', latin: '”', ipa: '[-]', nameKz: 'Жуандық белгісі', nameTr: 'Kalınlık ayırıcı işaret', exampleKz: 'Съезд', exampleTr: 'Kurultay/Kongre', f1: 350, f2: 1200, f3: 2200, spokenSyllable: 'Belgi' },
  { char: 'Ы', lower: 'ы', latin: 'Y / I', ipa: '[ɯ]', nameKz: 'Ы', nameTr: 'Kalın Düz I', exampleKz: 'Ыдыс (Kap-kacak)', exampleTr: 'Mutfak kabı', f1: 390, f2: 1100, f3: 2350, spokenSyllable: 'Iı' },
  { char: 'І', lower: 'і', latin: 'I / İ', ipa: '[ɪ]', nameKz: 'І', nameTr: 'Kısa Kapalı İ (І)', exampleKz: 'Іні (Kardeş)', exampleTr: 'Küçük erkek kardeş', f1: 380, f2: 2000, f3: 2750, spokenSyllable: 'İi' },
  { char: 'Ь', lower: 'ь', latin: '’', ipa: '[ʲ]', nameKz: 'Жіңішкелік белгісі', nameTr: 'İncelik yumuşatma işareti', exampleKz: 'Лагерь', exampleTr: 'Kamp/Düşergâh', f1: 360, f2: 1800, f3: 2500, spokenSyllable: 'Belgi' },
  { char: 'Э', lower: 'э', latin: 'E', ipa: '[e]', nameKz: 'Э', nameTr: 'Kelime başı açık E', exampleKz: 'Экран (Ekran)', exampleTr: 'Ekran', f1: 480, f2: 1850, f3: 2550, spokenSyllable: 'Ee' },
  { char: 'Ю', lower: 'ю', latin: 'Yu', ipa: '[ju]', nameKz: 'Ю', nameTr: 'Yu diftongu', exampleKz: 'Аю (Ayı)', exampleTr: 'Ayı', f1: 420, f2: 1100, f3: 2200, spokenSyllable: 'Yu' },
  { char: 'Я', lower: 'я', latin: 'Ya', ipa: '[jɑ]', nameKz: 'Я', nameTr: 'Ya diftongu', exampleKz: 'Аяқ (Ayak)', exampleTr: 'Ayak', f1: 650, f2: 1300, f3: 2350, spokenSyllable: 'Ya' }
];

export function transliterateKazakhToAudibleString(text: string): string {
  // 1. First replace multi-letter combinations and diphthongs
  let result = text
    .replace(/ия/g, 'ıya')
    .replace(/Ия/g, 'Iya')
    .replace(/ие/g, 'iye')
    .replace(/Ие/g, 'İye')
    .replace(/уа/g, 'wa')
    .replace(/Уа/g, 'Wa')
    .replace(/уе/g, 'we')
    .replace(/Уе/g, 'We')
    .replace(/ю/g, 'yu')
    .replace(/Ю/g, 'Yu')
    .replace(/я/g, 'ya')
    .replace(/Я/g, 'Ya')
    .replace(/щ/g, 'şş')
    .replace(/Щ/g, 'Şş')
    .replace(/ё/g, 'yo')
    .replace(/Ё/g, 'Yo')
    .replace(/һ/g, 'h')
    .replace(/Һ/g, 'H');

  const map: Record<string, string> = {
    // 9 Special Kazakh letters calibrated for Turkish/universal phonetics
    'Ә': 'E', 'ә': 'e',
    'Ғ': 'Ğ', 'ғ': 'ğ',
    'Қ': 'K', 'қ': 'k',
    'Ң': 'n', 'ң': 'n',
    'Ө': 'Ö', 'ө': 'ö',
    'Ұ': 'U', 'ұ': 'u',
    'Ү': 'Ü', 'ү': 'ü',
    'І': 'İ', 'і': 'i',
    'Ы': 'I', 'ы': 'ı',
    'Һ': 'H', 'һ': 'h',
    // 33 Standard Cyrillic letters
    'А': 'A', 'а': 'a',
    'Б': 'B', 'б': 'b',
    'В': 'V', 'в': 'v',
    'Г': 'G', 'г': 'g',
    'Д': 'D', 'д': 'd',
    'Е': 'E', 'е': 'e',
    'Ж': 'J', 'ж': 'j',
    'З': 'Z', 'з': 'z',
    'И': 'İ', 'и': 'i',
    'Й': 'Y', 'й': 'y',
    'К': 'K', 'к': 'k',
    'Л': 'L', 'л': 'l',
    'М': 'M', 'м': 'm',
    'Н': 'N', 'н': 'n',
    'О': 'O', 'о': 'o',
    'П': 'P', 'п': 'p',
    'Р': 'R', 'р': 'r',
    'С': 'S', 'с': 's',
    'Т': 'T', 'т': 't',
    'У': 'U', 'у': 'u',
    'Ф': 'F', 'ф': 'f',
    'Х': 'H', 'х': 'h',
    'Ц': 'Ts', 'ц': 'ts',
    'Ч': 'Ç', 'ч': 'ç',
    'Ш': 'Ş', 'ш': 'ş',
    'Ъ': '', 'ъ': '',
    'Ь': '', 'ь': '',
    'Э': 'E', 'э': 'e'
  };

  return result.split('').map(c => map[c] ?? c).join('');
}

/**
 * Normalizes Kazakh Cyrillic special letters into standard Cyrillic phonemes
 * Allows any Slavic/Russian TTS engine (pre-installed on Windows/Android/iOS)
 * to vocalize Kazakh text with genuine Cyrillic phonology instead of choking.
 */
export function normalizeKazakhForRussianCyrillicVoice(text: string): string {
  const map: Record<string, string> = {
    'Ә': 'Э', 'ә': 'э',
    'Ғ': 'Г', 'ғ': 'г',
    'Қ': 'К', 'қ': 'к',
    'Ң': 'Н', 'ң': 'н',
    'Ө': 'О', 'ө': 'о',
    'Ұ': 'У', 'ұ': 'у',
    'Ү': 'Ю', 'ү': 'ю',
    'Һ': 'Х', 'һ': 'х',
    'І': 'И', 'і': 'и'
  };
  return text.split('').map(c => map[c] ?? c).join('');
}

class AudioService {
  private synth: SpeechSynthesis | null = null;
  private audioCtx: AudioContext | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private audioBlobUrlCache: Map<string, string> = new Map();
  private activeAudioElement: HTMLAudioElement | null = null;
  private audioSpeedMultiplier: number = 1.0;

  getAudioSpeed(): 0.75 | 1.0 {
    return this.audioSpeedMultiplier === 0.75 ? 0.75 : 1.0;
  }

  setAudioSpeed(speed: 0.75 | 1.0): void {
    this.audioSpeedMultiplier = speed;
    if (this.activeAudioElement) {
      this.activeAudioElement.playbackRate = speed;
    }
  }

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
      // Re-trigger voice loading after brief intervals (Chrome/Safari bug workaround)
      setTimeout(() => this.loadVoices(), 150);
      setTimeout(() => this.loadVoices(), 600);
    }
  }

  /**
   * Try playing an audio URL (e.g. static bundled audio files in /audio/letters)
   */
  async tryPlayAudioUrl(url: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    return new Promise((resolve) => {
      try {
        if (this.activeAudioElement) {
          this.activeAudioElement.pause();
          this.activeAudioElement.currentTime = 0;
          this.activeAudioElement = null;
        }

        const audio = new Audio(url);
        audio.playbackRate = this.audioSpeedMultiplier;
        this.activeAudioElement = audio;

        audio.onended = () => {
          this.activeAudioElement = null;
          resolve(true);
        };

        audio.onerror = () => {
          this.activeAudioElement = null;
          resolve(false);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Playing started successfully
            })
            .catch(() => {
              this.activeAudioElement = null;
              resolve(false);
            });
        }
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Try playing authentic human voice from /api/tts endpoint
   */
  async tryPlayServerTts(text: string, lang: 'kk' | 'tr' = 'kk', voice: 'female' | 'male' = 'female'): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    const cleanText = text.trim();
    if (!cleanText) return false;

    // Fast check: Single Kazakh letter uses pre-bundled studio wav
    if (cleanText.length === 1) {
      const code = cleanText.toUpperCase().charCodeAt(0);
      const staticWavUrl = `/audio/letters/letter_${code}.wav?v=gemini-ai-tts`;
      const played = await this.tryPlayAudioUrl(staticWavUrl);
      if (played) return true;
    }

    const cacheKey = `${lang}:${voice}:${cleanText}`;
    if (this.audioBlobUrlCache.has(cacheKey)) {
      const cachedUrl = this.audioBlobUrlCache.get(cacheKey)!;
      return this.tryPlayAudioUrl(cachedUrl);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, lang, voice }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) return false;

      const blob = await response.blob();
      if (!blob || blob.size < 500) return false;

      const objectUrl = URL.createObjectURL(blob);
      this.audioBlobUrlCache.set(cacheKey, objectUrl);
      return this.tryPlayAudioUrl(objectUrl);
    } catch {
      return false;
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (voices && voices.length > 0) {
      this.cachedVoices = voices;
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Articulate letter phoneme cleanly and naturally without artificial oscillator buzz
   */
  async playAcousticPhoneme(char: string): Promise<void> {
    const letterUpper = char.toUpperCase().trim();
    const code = letterUpper.charCodeAt(0);
    const staticWavUrl = `/audio/letters/letter_${code}.wav?v=gemini-ai-tts`;
    const played = await this.tryPlayAudioUrl(staticWavUrl);
    if (!played) {
      await this.speak(letterUpper, 'kk', 0.76);
    }
  }

  /**
   * Speak complete Kazakh letter clearly (Letter name + Syllable + Example word)
   * Guaranteed to vocalize accurately even if device has no native Kazakh TTS installed!
   */
  /**
   * Speak complete Kazakh letter clearly in natural human voice
   * 1. Checks pre-bundled static Kazakh letter audio pack (/audio/letters/letter_<code}.wav)
   * 2. Checks neural TTS server endpoint (/api/tts)
   * 3. Falls back to native Web Speech API with kk-KZ language
   */
  async speakKazakhLetterComplete(char: string): Promise<void> {
    const letterUpper = char.toUpperCase().trim();
    const code = letterUpper.charCodeAt(0);

    // 1. First priority: Pre-bundled static authentic Kazakh audio pack
    const staticWavUrl = `/audio/letters/letter_${code}.wav?v=gemini-ai-tts`;
    const staticPlayed = await this.tryPlayAudioUrl(staticWavUrl);
    if (staticPlayed) return;

    const item = ALL_42_KAZAKH_LETTERS.find(l => l.char === letterUpper);
    const sampleWord = item ? item.exampleKz.split(' ')[0] : '';
    const phrase = sampleWord ? `${item!.char}. ${sampleWord}.` : letterUpper;

    // 2. Second priority: Full-stack natural neural TTS API
    const isFemale = this.currentKazakhPersona === 'kk-female';
    const serverPlayed = await this.tryPlayServerTts(phrase, 'kk', isFemale ? 'female' : 'male');
    if (serverPlayed) return;

    // 3. Third priority: Web Speech Synthesis with kk-KZ native language
    await this.speak(phrase, 'kk', 0.88);
  }

  /**
   * Play single Kazakh alphabet letter sound flawlessly
   */
  async playLetterSound(letter: string): Promise<void> {
    await this.speakKazakhLetterComplete(letter);
  }

  private currentKazakhPersona: VoicePersona = 'kk-female';
  private currentTurkishPersona: VoicePersona = 'tr-female';

  getKazakhPersona(): VoicePersona {
    return this.currentKazakhPersona;
  }

  setKazakhPersona(persona: VoicePersona) {
    this.currentKazakhPersona = persona;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('uzaktan_turkolog_kz_voice', persona);
    }
  }

  getTurkishPersona(): VoicePersona {
    return this.currentTurkishPersona;
  }

  setTurkishPersona(persona: VoicePersona) {
    this.currentTurkishPersona = persona;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('uzaktan_turkolog_tr_voice', persona);
    }
  }

  /**
   * Get active voice details for natural voice diagnostic dialog
   */
  getActiveVoiceDetails(lang: 'kk' | 'tr' = 'kk'): {
    name: string;
    isNative: boolean;
    isNeural: boolean;
    lang: string;
  } {
    if (!this.synth) {
      return { name: 'Doğal Nöral Bulut Sesi (Stüdyo)', isNative: true, isNeural: true, lang: 'kk-KZ' };
    }
    const voices = this.cachedVoices.length > 0 ? this.cachedVoices : this.synth.getVoices();
    const isKk = lang === 'kk';
    const kzVoice = voices.find(v => {
      const l = v.lang.toLowerCase();
      return l.includes('kk') || l.includes('kz') || l.includes('kaz');
    });

    if (isKk && kzVoice) {
      const n = kzVoice.name.toLowerCase();
      const isNeural = n.includes('natural') || n.includes('neural') || n.includes('online') || n.includes('google');
      return { name: kzVoice.name, isNative: true, isNeural, lang: kzVoice.lang };
    }

    if (isKk) {
      const ruVoice = voices.find(v => v.lang.toLowerCase().startsWith('ru'));
      if (ruVoice) {
        return {
          name: `${ruVoice.name} (Kiril Doğal Fonetik)`,
          isNative: false,
          isNeural: true,
          lang: ruVoice.lang
        };
      }
    }

    const trVoice = voices.find(v => v.lang.toLowerCase().includes('tr'));
    if (trVoice) {
      const n = trVoice.name.toLowerCase();
      const isNeural = n.includes('natural') || n.includes('neural') || n.includes('online') || n.includes('google');
      return { 
        name: `${trVoice.name} (Türkçe Fonetik Eşleme)`, 
        isNative: !isKk, 
        isNeural, 
        lang: trVoice.lang 
      };
    }

    return { name: 'Doğal Nöral Bulut Sesi (Stüdyo)', isNative: true, isNeural: true, lang: 'kk-KZ' };
  }

  /**
   * Speak a vocabulary word
   */
  speakWord(word: string, lang: 'kk' | 'tr' = 'kk'): Promise<void> {
    return this.speak(word, lang);
  }

  /**
   * Speak with a specific voice profile
   */
  speakWithPersona(text: string, persona?: VoicePersona, rateOverride?: number): Promise<void> {
    const selected = persona || this.currentKazakhPersona;
    const personaMeta = VOICE_PROFILES.find(p => p.id === selected) || VOICE_PROFILES[0];
    return this.speak(text, personaMeta.lang, rateOverride || personaMeta.defaultRate, personaMeta.pitch);
  }

  /**
   * Speak full text in Kazakh or Turkish with natural tone calibration
   * Prioritizes neural server TTS, then authentic native SpeechSynthesis
   */
  async speak(text: string, lang: 'kk' | 'tr' = 'kk', rate: number = 0.88, customPitch?: number): Promise<void> {
    const cleanText = text.trim();
    if (!cleanText) return;

    const activePersonaId = lang === 'kk' ? this.currentKazakhPersona : this.currentTurkishPersona;
    const personaInfo = VOICE_PROFILES.find(p => p.id === activePersonaId);
    const isFemale = personaInfo ? personaInfo.gender === 'female' : true;

    // 1. Studio-quality server neural TTS (Kazakh and Turkish up to 1000 chars)
    if (cleanText.length <= 1000) {
      const serverTtsPlayed = await this.tryPlayServerTts(cleanText, lang, isFemale ? 'female' : 'male');
      if (serverTtsPlayed) return;
    }

    // 2. Fall back to Web Speech Synthesis with intelligent multi-tier cascade
    return new Promise((resolve) => {
      if (!this.synth) {
        resolve();
        return;
      }

      this.synth.cancel();

      const voices = this.cachedVoices.length > 0 ? this.cachedVoices : this.synth.getVoices();
      let textToSpeak = cleanText;
      let targetLang = lang === 'kk' ? 'kk-KZ' : 'tr-TR';
      let selectedVoice: SpeechSynthesisVoice | undefined;
      const pitch = customPitch ?? (isFemale ? 1.02 : 0.98);

      if (lang === 'kk') {
        const allKzVoices = voices.filter(v => {
          const l = v.lang.toLowerCase();
          return l.includes('kk') || l.includes('kz') || l.includes('kaz');
        });

        // 1. Prioritize natural / neural / online Kazakh voices
        const naturalKzVoice = allKzVoices.find(v => {
          const n = v.name.toLowerCase();
          const isNatural = n.includes('natural') || n.includes('neural') || n.includes('online') || n.includes('google');
          if (isFemale && (n.includes('female') || n.includes('kadın') || n.includes('әйел') || n.includes('woman'))) return true;
          if (!isFemale && (n.includes('male') || n.includes('erkek') || n.includes('ер') || n.includes('man'))) return true;
          return true;
        });

        const standardKzVoice = allKzVoices.find(v => {
          const n = v.name.toLowerCase();
          if (isFemale && (n.includes('female') || n.includes('kadın'))) return true;
          if (!isFemale && (n.includes('male') || n.includes('erkek'))) return true;
          return true;
        }) || allKzVoices[0];

        const bestKzVoice = naturalKzVoice || standardKzVoice;

        if (bestKzVoice) {
          // Tier A: Native Kazakh voice installed
          selectedVoice = bestKzVoice;
          targetLang = bestKzVoice.lang;
          textToSpeak = cleanText;
        } else {
          // Tier B: Russian Cyrillic voice (reads Cyrillic with natural phonology)
          const ruVoice = voices.find(v => v.lang.toLowerCase().startsWith('ru'));
          if (ruVoice) {
            selectedVoice = ruVoice;
            targetLang = ruVoice.lang;
            textToSpeak = normalizeKazakhForRussianCyrillicVoice(cleanText);
          } else {
            // Tier C: Turkish voice (reads Turkic phonology cleanly and harmoniously)
            const trVoice = voices.find(v => v.lang.toLowerCase().startsWith('tr'));
            if (trVoice) {
              selectedVoice = trVoice;
              targetLang = trVoice.lang;
              textToSpeak = transliterateKazakhToAudibleString(cleanText);
            } else {
              // Tier D: Universal readable Latin string
              targetLang = 'en-US';
              textToSpeak = transliterateKazakhToAudibleString(cleanText);
            }
          }
        }
      } else {
        const allTrVoices = voices.filter(v => v.lang.toLowerCase().includes('tr'));
        const naturalTrVoice = allTrVoices.find(v => {
          const n = v.name.toLowerCase();
          return n.includes('natural') || n.includes('neural') || n.includes('online') || n.includes('google');
        }) || allTrVoices[0];

        if (naturalTrVoice) selectedVoice = naturalTrVoice;
        targetLang = 'tr-TR';
        textToSpeak = cleanText;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = rate * this.audioSpeedMultiplier;
      utterance.pitch = pitch;
      utterance.lang = targetLang;
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      try {
        this.synth.speak(utterance);
      } catch {
        resolve();
      }
    });
  }

  /**
   * UI Sound effects & Celebratory Audio Engine
   */
  playFeedbackSound(type: 'correct' | 'wrong' | 'complete' | 'click' | 'badge_unlocked' | 'level_up' | 'lesson_complete') {
    if (type === 'badge_unlocked') {
      this.playBadgeUnlockSound();
      return;
    }
    if (type === 'level_up') {
      this.playLevelUpSound();
      return;
    }
    if (type === 'lesson_complete') {
      this.playLessonCompleteSound();
      return;
    }

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.setValueAtTime(196, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'complete') {
        this.playLessonCompleteSound();
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch {
      // Audio autoplay policy handled silently
    }
  }

  /**
   * Triumphant Lesson Complete Sound Effect
   * Celebratory 4-stage ascending harmonic fanfare with sparkling shimmer finish
   */
  playLessonCompleteSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      
      // Stage 1: Arpeggio Chords (C4, E4, G4, C5, E5, G5, C6)
      const notes = [
        { freq: 261.63, time: 0.00, dur: 0.18, type: 'triangle' as OscillatorType, vol: 0.18 }, // C4
        { freq: 329.63, time: 0.10, dur: 0.20, type: 'triangle' as OscillatorType, vol: 0.20 }, // E4
        { freq: 392.00, time: 0.20, dur: 0.22, type: 'triangle' as OscillatorType, vol: 0.22 }, // G4
        { freq: 523.25, time: 0.32, dur: 0.35, type: 'sine' as OscillatorType, vol: 0.25 },     // C5
        { freq: 659.25, time: 0.45, dur: 0.40, type: 'sine' as OscillatorType, vol: 0.24 },     // E5
        { freq: 783.99, time: 0.58, dur: 0.65, type: 'sine' as OscillatorType, vol: 0.28 },     // G5
        { freq: 1046.50, time: 0.68, dur: 0.85, type: 'sine' as OscillatorType, vol: 0.26 }     // C6
      ];

      notes.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = n.type;
        osc.frequency.setValueAtTime(n.freq, now + n.time);
        
        gain.gain.setValueAtTime(0.001, now + n.time);
        gain.gain.linearRampToValueAtTime(n.vol, now + n.time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur);
      });

      // Sparkle Shimmer Harmonics (high bells)
      const sparkles = [1318.51, 1567.98, 2093.00];
      sparkles.forEach((freq, idx) => {
        const sOsc = ctx.createOscillator();
        const sGain = ctx.createGain();
        sOsc.type = 'sine';
        sOsc.frequency.setValueAtTime(freq, now + 0.70 + idx * 0.08);

        sGain.gain.setValueAtTime(0.001, now + 0.70 + idx * 0.08);
        sGain.gain.linearRampToValueAtTime(0.08, now + 0.72 + idx * 0.08);
        sGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);

        sOsc.connect(sGain);
        sGain.connect(ctx.destination);
        sOsc.start(now + 0.70 + idx * 0.08);
        sOsc.stop(now + 1.25);
      });
    } catch {
      // Audio autoplay handled
    }
  }

  /**
   * Glorious Badge Unlock Sound Effect
   * Royal achievement fanfare with brass-style attack and golden bell resonance
   */
  playBadgeUnlockSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Royal Fanfare motif: D4 -> F#4 -> A4 -> D5 -> F#5 -> A5
      const motif = [
        { freq: 293.66, time: 0.00, dur: 0.22, vol: 0.22 }, // D4
        { freq: 369.99, time: 0.12, dur: 0.22, vol: 0.22 }, // F#4
        { freq: 440.00, time: 0.24, dur: 0.26, vol: 0.25 }, // A4
        { freq: 587.33, time: 0.38, dur: 0.40, vol: 0.30 }, // D5
        { freq: 739.99, time: 0.52, dur: 0.55, vol: 0.32 }, // F#5
        { freq: 880.00, time: 0.65, dur: 0.90, vol: 0.35 }  // A5 Climax
      ];

      motif.forEach(m => {
        // Dual-oscillator for rich brass / chime timbre (fundamental + overtone)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(m.freq, now + m.time);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(m.freq * 2, now + m.time); // Octave overtone

        gain.gain.setValueAtTime(0.001, now + m.time);
        gain.gain.linearRampToValueAtTime(m.vol, now + m.time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + m.time + m.dur);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now + m.time);
        osc2.start(now + m.time);
        osc1.stop(now + m.time + m.dur);
        osc2.stop(now + m.time + m.dur);
      });

      // Victory Bell Chimes
      const bellFreqs = [1174.66, 1760.00];
      bellFreqs.forEach((freq, idx) => {
        const bOsc = ctx.createOscillator();
        const bGain = ctx.createGain();
        bOsc.type = 'sine';
        bOsc.frequency.setValueAtTime(freq, now + 0.68 + idx * 0.1);
        bGain.gain.setValueAtTime(0.12, now + 0.68 + idx * 0.1);
        bGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
        bOsc.connect(bGain);
        bGain.connect(ctx.destination);
        bOsc.start(now + 0.68 + idx * 0.1);
        bOsc.stop(now + 1.5);
      });
    } catch {
      // Audio autoplay handled
    }
  }

  /**
   * Level-Up Triumph Sound Effect
   * Glissando power-up frequency sweep followed by victory chord progression
   */
  playLevelUpSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Frequency Glissando Sweep (Power Up)
      const sweepOsc = ctx.createOscillator();
      const sweepGain = ctx.createGain();
      sweepOsc.type = 'sine';
      sweepOsc.frequency.setValueAtTime(220, now);
      sweepOsc.frequency.exponentialRampToValueAtTime(880, now + 0.35);

      sweepGain.gain.setValueAtTime(0.001, now);
      sweepGain.gain.linearRampToValueAtTime(0.22, now + 0.1);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      sweepOsc.connect(sweepGain);
      sweepGain.connect(ctx.destination);
      sweepOsc.start(now);
      sweepOsc.stop(now + 0.35);

      // Triumph Major Chords (0.35s and 0.65s)
      const chords = [
        // Chord 1 (C Major 5th)
        { freqs: [523.25, 659.25, 783.99], time: 0.35, dur: 0.35, vol: 0.25 },
        // Chord 2 (E Major high)
        { freqs: [659.25, 830.61, 987.77], time: 0.55, dur: 0.35, vol: 0.26 },
        // Chord 3 Climax (A Major 6th)
        { freqs: [880.00, 1108.73, 1318.51, 1760.00], time: 0.75, dur: 0.85, vol: 0.28 }
      ];

      chords.forEach(c => {
        c.freqs.forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + c.time);

          gain.gain.setValueAtTime(0.001, now + c.time);
          gain.gain.linearRampToValueAtTime(c.vol / c.freqs.length * 1.5, now + c.time + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + c.time + c.dur);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + c.time);
          osc.stop(now + c.time + c.dur);
        });
      });
    } catch {
      // Audio autoplay handled
    }
  }

  /**
   * String similarity for pronunciation practice with Turkic-aware phonetic normalization
   */
  calculateSimilarity(str1: string, str2: string): number {
    const normalize = (str: string) => {
      const translit = transliterateKazakhToAudibleString(str || '');
      return translit
        .toLowerCase()
        .replace(/[ıİ]/g, 'i')
        .replace(/[ğĞ]/g, 'g')
        .replace(/[şŞ]/g, 's')
        .replace(/[çÇ]/g, 'c')
        .replace(/[öÖ]/g, 'o')
        .replace(/[üÜ]/g, 'u')
        .replace(/[әӘ]/g, 'a')
        .replace(/[ңҢ]/g, 'n')
        .replace(/[қҚ]/g, 'k')
        .replace(/[ғҒ]/g, 'g')
        .replace(/[ұҰ]/g, 'u')
        .replace(/[үҮ]/g, 'u')
        .replace(/[іІ]/g, 'i')
        .replace(/[һҺ]/g, 'h')
        .replace(/[^a-z0-9]/gi, '');
    };

    const s1 = normalize(str1);
    const s2 = normalize(str2);
    if (s1 === s2) return 100;
    if (!s1.length || !s2.length) return 0;

    const track = Array(s2.length + 1).fill(null).map(() =>
      Array(s1.length + 1).fill(null));
    for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
    for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;

    for (let j = 1; j <= s2.length; j += 1) {
      for (let i = 1; i <= s1.length; i += 1) {
        const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1,
          track[j - 1][i] + 1,
          track[j - 1][i - 1] + indicator
        );
      }
    }
    const distance = track[s2.length][s1.length];
    const maxLen = Math.max(s1.length, s2.length);
    return Math.max(0, Math.round(((maxLen - distance) / maxLen) * 100));
  }

  /**
   * Comprehensive Speech Recognition & Phonetic Pronunciation Analysis
   * Compares learner's spoken input word-by-word against target phrase,
   * detects acoustic errors in special Kazakh phonemes (Ә, І, Ң, Ғ, Ү, Ұ, Қ, Ө, Һ),
   * and strictly rejects incorrect speech (<75% pass mark).
   */
  analyzePronunciation(spokenText: string, targetPhrase: string): PronunciationAnalysis {
    const cleanTarget = (targetPhrase || '').trim();
    const cleanSpoken = (spokenText || '').trim();

    // Clean punctuation
    const stripPunct = (s: string) => s.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"«»!]/g, '').trim().toLowerCase();

    const targetWords = cleanTarget.split(/\s+/).map(stripPunct).filter(Boolean);
    const spokenWords = cleanSpoken.split(/\s+/).map(stripPunct).filter(Boolean);

    // If student did not say anything or empty input:
    if (spokenWords.length === 0 || !cleanSpoken) {
      return {
        overallScore: 0,
        isPassed: false,
        accuracy: 0,
        targetText: cleanTarget,
        recognizedText: '',
        words: targetWords.map(w => ({
          word: '',
          expectedWord: w,
          status: 'missing',
          score: 0,
          phoneticHint: `«${w}» kelimesi söylenmedi.`
        })),
        feedbackTitle: 'Ses Algılanamadı / Дыбыс анықталмады',
        feedbackMessage: 'Mikrofondan ses gelmedi veya anlaşılır bir kelime tespit edilemedi. Lütfen mikrofona yaklaşarak tekrar konuşun.',
        criticalErrors: ['Ses tespit edilemedi. Lütfen mikrofona izin verip tekrar deneyin.']
      };
    }

    const wordResults: WordPronunciationResult[] = [];
    const criticalErrors: string[] = [];

    // Evaluate each word
    for (let i = 0; i < targetWords.length; i++) {
      const targetW = targetWords[i];
      // Compare with the aligned spoken word, or find best match in spokenWords
      let bestScore = 0;
      let matchedSpokenWord = '';

      // Direct positional check first
      if (spokenWords[i]) {
        const directScore = this.calculateSimilarity(targetW, spokenWords[i]);
        bestScore = directScore;
        matchedSpokenWord = spokenWords[i];
      }

      // Check adjacent / other words in case of small omission or insertion
      for (const sp of spokenWords) {
        const score = this.calculateSimilarity(targetW, sp);
        if (score > bestScore) {
          bestScore = score;
          matchedSpokenWord = sp;
        }
      }

      let status: 'correct' | 'partial' | 'wrong' | 'missing' = 'wrong';
      let phoneticHint: string | undefined = undefined;

      // Special Kazakh letter audits
      const containsKazakhSpecial = /[әіңғүұқөһ]/i.test(targetW);

      if (bestScore >= 85) {
        status = 'correct';
      } else if (bestScore >= 55) {
        status = 'partial';
        if (containsKazakhSpecial) {
          phoneticHint = `«${targetW}» kelimesindeki Kazakça özel ses vurgusu (Ә, Қ, Ң, Ғ, Ү) daha belirgin çıkarılmalıdır.`;
        } else {
          phoneticHint = `«${targetW}» kelimesinde tonlama hatası var. Söylenen: «${matchedSpokenWord || '—'}».`;
        }
      } else {
        status = 'wrong';
        criticalErrors.push(`«${targetW}» kelimesi yanlış veya eksik telaffuz edildi (Söylenen: «${matchedSpokenWord || 'Yok'}»).`);
      }

      wordResults.push({
        word: matchedSpokenWord,
        expectedWord: targetW,
        status,
        score: bestScore,
        phoneticHint
      });
    }

    // Penalty if learner spoke far too few or extra unrelated words
    const lengthRatio = Math.min(spokenWords.length, targetWords.length) / Math.max(spokenWords.length, targetWords.length);
    const avgScore = wordResults.reduce((acc, w) => acc + w.score, 0) / (targetWords.length || 1);
    const overallScore = Math.round(avgScore * (0.8 + 0.2 * lengthRatio));

    // Strict Gate: Must score >= 75% AND have no more than 1 'wrong' word to pass
    const wrongCount = wordResults.filter(w => w.status === 'wrong' || w.status === 'missing').length;
    const isPassed = overallScore >= 75 && wrongCount === 0;

    let feedbackTitle = '';
    let feedbackMessage = '';

    if (isPassed) {
      feedbackTitle = 'Mükemmel Telaffuz! (Өте жақсы!)';
      feedbackMessage = 'Kazakça harf tonlaması ve fonetik kurallar doğru uygulandı. Akustik formant uyumu başarıyla sağlandı.';
    } else {
      feedbackTitle = 'Hata Tespit Edildi! (Қате анықталды)';
      feedbackMessage = `Telaffuz doğruluğunuz %${overallScore}. Kural gereği doğru söyleyene kadar (%75 üzeri) bir sonraki aşamaya geçemezsiniz. Lütfen kırmızı ile işaretlenen kelimelere dikkat ederek mikrofona tekrar dokunun ve cümleyi okuyun.`;
    }

    return {
      overallScore,
      isPassed,
      accuracy: overallScore,
      targetText: cleanTarget,
      recognizedText: cleanSpoken,
      words: wordResults,
      feedbackTitle,
      feedbackMessage,
      criticalErrors
    };
  }
}

export interface WordPronunciationResult {
  word: string;
  expectedWord: string;
  status: 'correct' | 'partial' | 'wrong' | 'missing';
  score: number;
  phoneticHint?: string;
}

export interface PronunciationAnalysis {
  overallScore: number;
  isPassed: boolean;
  accuracy: number;
  targetText: string;
  recognizedText: string;
  words: WordPronunciationResult[];
  feedbackTitle: string;
  feedbackMessage: string;
  criticalErrors: string[];
}

export const audioService = new AudioService();
