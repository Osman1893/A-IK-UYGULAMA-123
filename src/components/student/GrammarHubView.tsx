import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Volume2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Layers,
  GraduationCap,
  Activity
} from 'lucide-react';
import { audioService } from '../../services/audioService';
import { AlageyikMascot } from '../common/AlageyikMascot';

interface GrammarTopic {
  id: string;
  category: string;
  titleTr: string;
  titleKz: string;
  summaryTr: string;
  summaryKz: string;
  tableData?: {
    caseName: string;
    suffixesTr: string;
    suffixesKz: string;
    exampleTr: string;
    exampleKz: string;
  }[];
  explanationTr: string;
  explanationKz: string;
  examples: { kz: string; tr: string; breakdown: string }[];
}

interface GrammarHubViewProps {
  onOpenAlphabetGuide?: () => void;
}

export const GrammarHubView: React.FC<GrammarHubViewProps> = ({ onOpenAlphabetGuide }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>('g-alfabe-fonetik');

  const grammarTopics: GrammarTopic[] = [
    {
      id: 'g-alfabe-fonetik',
      category: 'Alfabe & Fonetik',
      titleTr: 'Kazak Alfabesi ve 9 Özel Fonem (Ә, І, Ң, Ғ, Ү, Ұ, Қ, Ө, Һ)',
      titleKz: 'Қазақ әліпбиі және 9 төл дыбыс',
      summaryTr: '42 harfli Kiril alfabesi ve Türkiye Türkçesinden farklı 9 karakteristik sesin artikülasyonu.',
      summaryKz: 'Қазақ тілінің төл дыбыстарының артикуляциялық ерекшеліктері.',
      explanationTr: 'Kazak alfabesi 42 harften oluşur. Türkçede bulunmayan 9 özel harf mevcuttur:\n• Ә (Açık ince e: Әке)\n• І (Kısa kapalı i: Тіл)\n• Ң (Sağır kâf / geniz nesi: Жаңа)\n• Ғ (Kalın boğaz g\'si: Ғалым)\n• Қ (Derin boğaz k\'si: Қазақ)\n• Ү (İnce yuvarlak ü: Үй)\n• Ұ (Kalın boğaz u\'su: Ұстаз)\n• Ө (Geniş yuvarlak ö: Өмір)\n• Һ (Gırtlaksıl yumuşak h: Қаһарман)',
      explanationKz: 'Төл дыбыстар қазақ тілінің фонетикалық байлығын құрайды.',
      tableData: [
        {
          caseName: 'Ә [æ] - Açık İnce E',
          suffixesTr: 'Ä / Açık E',
          suffixesKz: 'Жіңішке ә',
          exampleTr: 'Baba, Şarkı, Güzel',
          exampleKz: 'Әке, Ән, Әдемі'
        },
        {
          caseName: 'І [ɪ] - Kısa Kapalı İ',
          suffixesTr: 'Kısa İ',
          suffixesKz: 'Қысқа і',
          exampleTr: 'Dil, Bir, Kardeş',
          exampleKz: 'Тіл, Бір, Іні'
        },
        {
          caseName: 'Ң [ŋ] - Sağır N (Geniz)',
          suffixesTr: 'Sağır N (ñ)',
          suffixesKz: 'Мұрын жолды ң',
          exampleTr: 'Yeni, Bin, Sonuncu',
          exampleKz: 'Жаңа, Мың, Соңғы'
        },
        {
          caseName: 'Ғ [ʁ] - Boğaz Gayn',
          suffixesTr: 'Gayn (Kalın Ğ)',
          suffixesKz: 'Ұяң ғ',
          exampleTr: 'Âlim, Dağ, Fiyat',
          exampleKz: 'Ғалым, Тауға, Баға'
        },
        {
          caseName: 'Қ [q] - Boğaz Kaf',
          suffixesTr: 'Kaf (Kalın Q)',
          suffixesKz: 'Қатаң қ',
          exampleTr: 'Kazak, Şehir, El',
          exampleKz: 'Қазақ, Қала, Қол'
        },
        {
          caseName: 'Ұ [ʊ] - Kalın U',
          suffixesTr: 'Derin Kalın U',
          suffixesKz: 'Жуан ұ',
          exampleTr: 'Erkek evlat, Öğretmen',
          exampleKz: 'Ұл, Ұстаз, Жұлдыз'
        },
        {
          caseName: 'Ү [ʏ] - İnce Ü',
          suffixesTr: 'İnce Yuvarlak Ü',
          suffixesKz: 'Жіңішке ү',
          exampleTr: 'Ev, Büyük, Gün',
          exampleKz: 'Үй, Үлкен, Күн'
        },
        {
          caseName: 'Ө [œ] - Geniş Ö',
          suffixesTr: 'Geniş Yuvarlak Ö',
          suffixesKz: 'Ашық ө',
          exampleTr: 'Hayat, Nehir, Söz',
          exampleKz: 'Өмір, Өзен, Сөз'
        },
        {
          caseName: 'Һ [h] - Yumuşak H',
          suffixesTr: 'Soluklu Nefes H',
          suffixesKz: 'Көмей һ',
          exampleTr: 'Elmas, Kahraman',
          exampleKz: 'Гауһар, Қаһарман'
        }
      ],
      examples: [
        {
          kz: 'Қазақ тілі – бай тіл.',
          tr: 'Kazak dili zengin bir dildir.',
          breakdown: 'Қазақ (boğaz kafı) + тіл-і + бай + тіл'
        },
        {
          kz: 'Әкем маған жаңа кітап әкелді.',
          tr: 'Babam bana yeni kitap getirdi.',
          breakdown: 'Әке-м (açık e) + маған + жаңа (sağır n) + кітап + әкелді'
        }
      ]
    },
    {
      id: 'g-undestik',
      category: 'Ses Bilgisi',
      titleTr: 'Kazakçada Büyük ve Küçük Ünlü Uyumu (Үндестік заңы)',
      titleKz: 'Дыбыс үндестігі: Жуан және жіңішке',
      summaryTr: 'Dudak ve damak uyumunun Kazakçadaki katı kuralları.',
      summaryKz: 'Сөз ішіндегі және қосымшалардағы дауыстылар үндестігі.',
      explanationTr: 'Kazakçada Türkçedeki gibi ünlü uyumu çok katıdır:\n• Kalın Ünlüler (Жуан): А, О, Ұ, Ы\n• İnce Ünlüler (Жіңішке): Ә, Ө, Ү, І, Е\nKelime kökü kalın ünlü ile başlıyorsa ekler daima kalın gelir (Бала-лар-ға); ince ile başlıyorsa ince gelir (Үй-лер-ге).',
      explanationKz: 'Буын үндестігі бойынша сөздер бірыңғай жуан немесе бірыңғай жіңішке болады.',
      examples: [
        {
          kz: 'Балалар далада ойнап жүр.',
          tr: 'Çocuklar kırda oynuyorlar (Kalın uyum).',
          breakdown: 'Бала-лар (kalın çoğul) + дала-да (kalın bulunma)'
        },
        {
          kz: 'Мектептерде дәріс жүріп жатыр.',
          tr: 'Okullarda ders işleniyor (İnce uyum).',
          breakdown: 'Мектеп-тер-де (ince çoğul ve bulunma hâli)'
        }
      ]
    },
    {
      id: 'g-septik',
      category: 'İsim Çekimi',
      titleTr: 'Kazakçada 7 İsim Hâli (Септіктер)',
      titleKz: 'Зат есімнің 7 септігі',
      summaryTr: 'Kazakçadaki 7 hâl eki (Türkçeden farklı olarak vasıta hali -мен bağımsız bir septiktir).',
      summaryKz: 'Қазақ тіліндегі 7 септік жалғауларының толық жүйесі.',
      explanationTr: 'Türkçede 5 temel hâl bulunurken Kazakçada "Көмектес септік" (ile/vasıta) dâhil 7 hâl eki mevcuttur. Ekler son sese göre sertleşir ve yumuşar.',
      explanationKz: 'Септік жалғаулары сөздерді бір-бірімен байланыстырады.',
      tableData: [
        {
          caseName: '1. Атау септік (Yalın)',
          suffixesTr: 'Eksiz',
          suffixesKz: 'Жалғаусыз',
          exampleTr: 'Ev, Kitap, Öğrenci',
          exampleKz: 'Үй, Кітап, Оқушы'
        },
        {
          caseName: '2. Ілік септік (İlgi/Genitif)',
          suffixesTr: '-ın, -in, -un, -ün, -nın',
          suffixesKz: '-ның/-нің, -дың/-дің, -тың/-тің',
          exampleTr: 'Öğrencinin kitabı',
          exampleKz: 'Оқушы-ның кітабы'
        },
        {
          caseName: '3. Барыс септік (Yönelme/Datif)',
          suffixesTr: '-a, -e, -ya, -ye',
          suffixesKz: '-ға/-ге, -қа/-ке, -на/-не',
          exampleTr: 'Okula gitmek',
          exampleKz: 'Мектеп-ке бару'
        },
        {
          caseName: '4. Табыс септік (Belirtme/Akuzatif)',
          suffixesTr: '-ı, -i, -u, -ü, -yı, -yi',
          suffixesKz: '-ны/-ні, -ды/-ді, -ты/-ті',
          exampleTr: 'Kitabı okumak',
          exampleKz: 'Кітап-ты оқу'
        },
        {
          caseName: '5. Жатыс септік (Bulunma/Lokatif)',
          suffixesTr: '-da, -de, -ta, -te',
          suffixesKz: '-да/-де, -та/-те, -нда/-нде',
          exampleTr: 'Evde oturmak',
          exampleKz: 'Үй-де отыру'
        },
        {
          caseName: '6. Шығыс септік (Ayrılma/Ablatif)',
          suffixesTr: '-dan, -den, -tan, -ten',
          suffixesKz: '-дан/-ден, -тан/-тен, -нан/-нен',
          exampleTr: 'İşten gelmek',
          exampleKz: 'Жұмыс-тан келу'
        },
        {
          caseName: '7. Көмектес септік (Vasıta/İle)',
          suffixesTr: '-la, -le (ile)',
          suffixesKz: '-мен, -бен, -пен',
          exampleTr: 'Arkadaşımla konuşmak',
          exampleKz: 'Досым-мен сөйлесу'
        }
      ],
      examples: [
        {
          kz: 'Мен қаламмен дәптерге жаздым.',
          tr: 'Ben kalemle deftere yazdım.',
          breakdown: 'қалам-мен (vasıta hâli) + дәптер-ге (yönelme hâli) + жаздым'
        },
        {
          kz: 'Астананың ауасы таза.',
          tr: 'Astana\'nın havası temizdir.',
          breakdown: 'Астана-ның (ilgi hâli) + ауасы'
        }
      ]
    },
    {
      id: 'g-iyelik',
      category: 'İsim Çekimi',
      titleTr: 'İyelik Ekleri (Тәуелдік жалғаулары)',
      titleKz: 'Тәуелдік жалғаулары',
      summaryTr: 'Bir varlığın kime ait olduğunu gösteren ekler; Sen ve Siz saygı ayrımı.',
      summaryKz: 'Заттың біреуге меншікті екенін білдіретін тәуелдік жүйесі.',
      explanationTr: 'Kazakçada 2. şahıs teklik için hem samimi (-ың/-ің) hem de saygılı (-ыңыз/-іңіз) iki ayrı iyelik kalıbı bulunur. Damak n\'si (ң) daima korunur.',
      explanationKz: 'Сөздің дауысты не дауыссызға бітуіне қарай тәуелдік жалғанады.',
      tableData: [
        {
          caseName: '1. Tekil (Benim)',
          suffixesTr: '-(ı)m, -(i)m',
          suffixesKz: '-ым/-ім (ünlüden sonra: -м)',
          exampleTr: 'Ev-im, Baba-m',
          exampleKz: 'Үй-ім, Әке-м'
        },
        {
          caseName: '2. Tekil Samimi (Senin)',
          suffixesTr: '-(ı)n, -(i)n',
          suffixesKz: '-ың/-ің (ünlüden sonra: -ң)',
          exampleTr: 'Ev-in, Baba-n',
          exampleKz: 'Үй-ің, Әке-ң'
        },
        {
          caseName: '2. Tekil Saygılı (Sizin)',
          suffixesTr: '-(ı)nız, -(i)niz',
          suffixesKz: '-ыңыз/-іңіз (ünlüden sonra: -ңыз/-ңіз)',
          exampleTr: 'Ev-iniz, Baba-nız',
          exampleKz: 'Үй-іңіз, Әке-ңіз'
        },
        {
          caseName: '3. Tekil (Onun)',
          suffixesTr: '-(s)ı, -(s)i',
          suffixesKz: '-ы/-і (ünlüden sonra: -сы/-сі)',
          exampleTr: 'Ev-i, Baba-sı',
          exampleKz: 'Үй-і, Әке-сі'
        }
      ],
      examples: [
        {
          kz: 'Бұл – сіздің кітабыңыз.',
          tr: 'Bu sizin kitabınızdır.',
          breakdown: 'сіздің (sizin) + кітап-ыңыз (saygılı iyelik eki)'
        }
      ]
    },
    {
      id: 'g-simdiki-zaman',
      category: 'Fiil Zamanları',
      titleTr: 'Şimdiki Zaman: Naq Osy Shaq (Жатыр, Отыр, Тұр, Жүр)',
      titleKz: 'Нақ осы шақтың 4 көмекші етістігі',
      summaryTr: 'Kazakçada eylemin şu anda yapıldığını bildiren 4 yardımcı fiil.',
      summaryKz: 'Іс-әрекеттің сөйлеп тұрған сәтте болып жатқанын білдіреді.',
      explanationTr: 'Türkçedeki "-yor" ekinin yerini Kazakçada duruş bildiren 4 yardımcı fiil alır:\n• Жатыр (yatıyor / uzanmış halde veya geniş süreçte yapılan eylemler)\n• Отыр (oturuyor / oturarak yapılan: yazmak, okumak vb.)\n• Тұр (ayakta / dikey duran eylemler)\n• Жүр (yürüyor / hareket halinde devam eden alışkanlıklar)',
      explanationKz: 'Негізгі етістікке -а/-е/-й қосылып, соңынан көмекші етістік жіктеледі.',
      examples: [
        {
          kz: 'Мен кітап оқып отырмын.',
          tr: 'Ben kitap okuyorum (oturarak).',
          breakdown: 'оқы-п (bağlayıcı) + отыр (oturmak) + -мын (1. şahıs)'
        },
        {
          kz: 'Сыртта қар жауып тұр.',
          tr: 'Dışarıda kar yağıyor (düşey hareket).',
          breakdown: 'жау-ып + тұр (durmak)'
        },
        {
          kz: 'Ол университетте оқып жүр.',
          tr: 'O üniversitede okuyor (süregelen durum).',
          breakdown: 'оқы-п + жүр (yürümek/sürmek)'
        }
      ]
    },
    {
      id: 'g-gecmis-zaman',
      category: 'Fiil Zamanları',
      titleTr: 'Geçmiş Zaman Ayrımı: -ды/-ді vs -ған/-ген',
      titleKz: 'Жедел өткен шақ және бұрынғы өткен шақ',
      summaryTr: 'Görülen kesin geçmiş zaman ile tecrübe bildiren geçmiş zamanın nüansları.',
      summaryKz: 'Өткен шақ формаларының мағыналық айырмашылығы.',
      explanationTr: '• -ды/-ді: Konuşanın bizzat tanık olduğu veya kesinleşmiş anlık geçmiş zaman (Мен келдім = Ben geldim).\n• -ған/-ген: Hayat tecrübesi veya etkisi devam eden geçmiş zaman (Мен Алматыда болғанмын = Ben Almatı\'da bulunmuştum).',
      explanationKz: 'Өмірлік тәжірибені айтқанда есімше формасы қолданылады.',
      examples: [
        {
          kz: 'Мен кеше оны көрдім.',
          tr: 'Ben dün onu gördüm (kesin/anlık).',
          breakdown: 'көр-ді-м'
        },
        {
          kz: 'Мен бұл фильмді көргенмін.',
          tr: 'Ben bu filmi görmüştüm (tecrübe).',
          breakdown: 'көр-ген-мін'
        }
      ]
    },
    {
      id: 'g-ses-denklikleri',
      category: 'Karşılaştırmalı Türkoloji',
      titleTr: 'Kıpçak - Oğuz Düzenli Ses Denklikleri (Y ~ J, Ş ~ S)',
      titleKz: 'Қыпшақ және Оғыз тілдерінің дыбыстық заңдылықтары',
      summaryTr: 'Türkiye Türkçesi ile Kazakça arasındaki düzenli etimolojik ses geçiş kuralları.',
      summaryKz: 'Түркітанудағы дыбыс сәйкестіктері (й ~ ж, тау ~ дағ, тас ~ таш).',
      explanationTr: '1. Söz başı Y- ➔ J- (ж): Yıl ➔ Жыл, Yol ➔ Жол, Yer ➔ Жер, Yeni ➔ Жаңа, Yılan ➔ Жылан.\n2. Söz sonu ve içi -Ğ/-G ➔ -W (у): Dağ ➔ Тау, Bağ ➔ Бау, Sağ ➔ Сау, Yağ ➔ Май.\n3. Kalın D- ➔ T-: Dil ➔ Тіл, Taş ➔ Тас, Dört ➔ Төрт, Deve ➔ Түйе.\n4. Ş ➔ S ses değişimi: Taş ➔ Тас, Kış ➔ Қыс, Baş ➔ Бас, Yaş ➔ Жас.\n5. Ç ➔ Ş ses değişimi: Üç ➔ Үш, Ağaç ➔ Ағаш, Kaç ➔ Қаш (kaçmak) / Қанша (miktar).',
      explanationKz: 'Бұл сәйкестіктер екі тілдің тарихи туыстығын көрсетеді.',
      tableData: [
        { caseName: 'Y- ➔ J- (Ж)', suffixesTr: 'Yol, Yıl, Yer', suffixesKz: 'Жол, Жыл, Жер', exampleTr: 'Yeni yol', exampleKz: 'Жаңа жол' },
        { caseName: '-G/-Ğ ➔ -W (У)', suffixesTr: 'Dağ, Bağ, Av', suffixesKz: 'Тау, Бау, Ау', exampleTr: 'Yüksek dağ', exampleKz: 'Биік тау' },
        { caseName: 'Ş ➔ S', suffixesTr: 'Taş, Kış, Baş', suffixesKz: 'Тас, Қыс, Бас', exampleTr: 'Sert taş', exampleKz: 'Қатты тас' },
        { caseName: 'Ç ➔ Ş', suffixesTr: 'Üç, Ağaç, Çay', suffixesKz: 'Үш, Ағаш, Шәй', exampleTr: 'Üç ağaç', exampleKz: 'Үш ағаш' }
      ],
      examples: [
        {
          kz: 'Жаңа жол – жаңа жыл.',
          tr: 'Yeni yol – yeni yıl.',
          breakdown: 'y- ➔ ж- düzenli ses geçişi'
        },
        {
          kz: 'Биік таудың басында ақ қар жатыр.',
          tr: 'Yüksek dağın başında ak kar yatmaktadır.',
          breakdown: 'taw (dağ), bas (baş), jatır (yatmak)'
        }
      ]
    },
    {
      id: 'g-tasvir-fiilleri',
      category: 'Fiil Çekimleri',
      titleTr: 'Kazakçada Tasvir Fiilleri: Жүр, Отыр, Тұр, Жатыр',
      titleKz: 'Қалып етістіктері және көмекші етістіктер (Жүр, Отыр, Тұр, Жатыр)',
      summaryTr: 'Eylemin anlık bedensel duruşunu ve sürekliliğini gösteren Kıpçak fiil sistemi.',
      summaryKz: 'Нақ осы шақтың 4 негізгі қалып етістігімен жасалуы.',
      explanationTr: 'Kazakçada şimdiki zaman doğrudan «-yor» ekiyle değil, insanın fiziksel pozisyonuna göre 4 yardımcı eylemle kurulur:\n1. Отыр (Oturmak): Masada, sandalyede veya oturarak yapılan eylemler (Кітап оқып отырмын = Kitap okumaktayım/okuyorum).\n2. Тұр (Ayakta durmak): Ayakta veya dik yapılan eylemler (Сөйлеп тұр = Ayakta konuşuyor).\n3. Жүр (Gezinmek/Yürümek): Hareket halinde, dönemsel yapılan eylemler (Жұмыс істеп жүрмін = Çalışmaktayım / çalışıyorum).\n4. Жатыр (Uzanmak/Yatmak): Yatarak yapılan veya geniş zamana yayılan eylemler (Ұйықтап жатыр = Uyumakta / yatıyor; Қар жауып жатыр = Kar yağıyor).',
      explanationKz: 'Қалып етістіктері қимылдың қалай өтіп жатқанын дәл білдіреді.',
      tableData: [
        { caseName: 'Отыр (Oturur pozisyonda)', suffixesTr: '-ıp/-ip/-(y)p otır', suffixesKz: 'оқып отыр, жазып отыр', exampleTr: 'Mektup yazıyorum', exampleKz: 'Хат жазып отырмын' },
        { caseName: 'Тұр (Ayakta pozisyonda)', suffixesTr: '-ıp/-ip/-(y)p tur', suffixesKz: 'қарап тұр, күтіп тұр', exampleTr: 'Otobüs bekliyorum', exampleKz: 'Автобус күтіп тұрмын' },
        { caseName: 'Жүр (Hareket halinde)', suffixesTr: '-ıp/-ip/-(y)p jür', suffixesKz: 'іздеп жүр, оқып жүр', exampleTr: 'Üniversitede okuyorum', exampleKz: 'Университетте оқып жүрмін' },
        { caseName: 'Жатыр (Yatarak / Doğa olayı)', suffixesTr: '-ıp/-ip/-(y)p jatır', suffixesKz: 'ұйықтап жатыр, жауып жатыр', exampleTr: 'Yağmur yağıyor', exampleKz: 'Жаңбыр жауып жатыр' }
      ],
      examples: [
        { kz: 'Мен қазақ тілін үйреніп жүрмін.', tr: 'Ben Kazak dilini öğrenmekteyim / öğreniyorum.', breakdown: 'үйрен-іп жүр-мін' },
        { kz: 'Ол кітапханада оқып отыр.', tr: 'O kütüphanede (oturmuş) kitap okuyor.', breakdown: 'оқы-п отыр' }
      ]
    },
    {
      id: 'g-soru-ekleri',
      category: 'Cümle Bilgisi',
      titleTr: 'Kazak Soru Ekleri: Ба/Бе, Па/Пе, Ма/Ме Kuralları',
      titleKz: 'Сұраулық шылаулар (Ба/Бе, Па/Пе, Ма/Ме)',
      summaryTr: 'Son harfin sert, yumuşak veya ünlü olmasına göre soru ekinin 6 biçimi.',
      summaryKz: 'Сөздің соңғы дыбысына байланысты сұраулық шылаулардың қолданылуы.',
      explanationTr: 'Kazakçada soru eki kelimeden ayrı yazılır ve son sese göre 3 çifte ayrılır:\n1. МА / МЕ: Ünlü harflerden ve М, Н, Ң sonrasından gelir (Бұл алма ма? Сен келесің бе?)\n2. БА / БЕ: Ötümlü ünsüzlerden (Ж, З, Л, Р, У, Й) sonra gelir (Қыз ба? Үй ме? Бар ма?)\n3. ПА / ПЕ: Sert ünsüzlerden (К, Қ, П, С, Т, Ш, Ф, Х, Ц, Ч) sonra gelir (Кітап па? Сүт пе? Қазақ па?)\n\nÖnemli: Cümlede soru zamiri (Кім, Не, Қайда, Қалай, Қашан, Қанша) varsa soru eki KULLANILMAZ!',
      explanationKz: 'Сұрау есімдіктері бар сөйлемде сұраулық шылаулар қойылмайды.',
      tableData: [
        { caseName: 'Ма / Ме (Ünlü ve Nazal)', suffixesTr: '-mı / -mi', suffixesKz: 'дауысты, м, н, ң соңы', exampleTr: 'Bu elma mı?', exampleKz: 'Бұл алма ма?' },
        { caseName: 'Ба / Бе (Ötümlü Ünsüzler)', suffixesTr: '-mı / -mi', suffixesKz: 'ж, з, л, р, у, й соңы', exampleTr: 'Var mı? Evde mi?', exampleKz: 'Бар ма? Үйде ме?' },
        { caseName: 'Па / Пе (Sert Ünsüzler)', suffixesTr: '-mı / -mi', suffixesKz: 'қатаң дыбыстар соңы', exampleTr: 'Kitap mı? Kazak mı?', exampleKz: 'Кітап па? Қазақ па?' }
      ],
      examples: [
        { kz: 'Сіз қазақша сөйлейсіз бе?', tr: 'Siz Kazakça konuşur musunuz?', breakdown: 'сөйле-й-сіз бе (soru)' },
        { kz: 'Бұл кім? (Soru zamirli cümle)', tr: 'Bu kimdir? (Soru eki gelmez)', breakdown: 'Кім soru zamiridir' }
      ]
    },
    {
      id: 'g-yalanci-esdegerler',
      category: 'Karşılaştırmalı Türkoloji',
      titleTr: 'Kazakça - Türkçe Yalancı Eşdeğerler (Tuzak Kelimeler)',
      titleKz: 'Жалған эктестер және мағыналық айырмашылықтар',
      summaryTr: 'Yazılışı veya söylenişi aynı olup anlamı tamamen farklı olan kelimeler rehberi.',
      summaryKz: 'Оғыз және қыпшақ тілдеріндегі мағыналық сәйкессіздіктер.',
      explanationTr: 'İki dil çok yakın olduğu için bazı kelimeler aynı sesletime sahip olsa da anlamları farklılaşmıştır:\n• Ертең (Erteñ): Türkçe «erken» değil, «YARIN» demektir! (Erken = Ерте)\n• Шалбар (Şalbar): Türkçe «şalvar» değil, standart «PANTOLON» demektir.\n• Аяқ (Ayaq): Sadece bilekten aşağısı değil, kalçadan parmak ucuna kadar bütün «BACAK VE AYAK» demektir.\n• Түс (Tüs): Sadece «renk» değil, aynı zamanda «RÜYA» ve «ÖĞLE VAKTİ» demektir.\n• Сақ бол (Saq bol): «Sağ ol / Teşekkürler» değil, «DİKKATLİ OL / TETİKTE OL» demektir!\n• Кір (Kir): Türkçe «kir / pislik» kökteşidir ancak fiil olarak «GİRMEK» demektir (Үйге кір = Eve gir).',
      explanationKz: 'Бұл сөздерді шатастырмау аударма сапасы үшін өте маңызды.',
      tableData: [
        { caseName: 'Ертең (Erteñ)', suffixesTr: 'Yarın (Erken değil!)', suffixesKz: 'Ертеңгі күн', exampleTr: 'Yarın geleceğim', exampleKz: 'Ертең келемін' },
        { caseName: 'Шалбар (Şalbar)', suffixesTr: 'Pantolon (Şalvar değil)', suffixesKz: 'Киім түрі', exampleTr: 'Yeni pantolon', exampleKz: 'Жаңа шалбар' },
        { caseName: 'Түс (Tüs)', suffixesTr: '1. Rüya, 2. Renk, 3. Öğle', suffixesKz: 'Түс көру', exampleTr: 'Güzel rüya gördüm', exampleKz: 'Жақсы түс көрдім' },
        { caseName: 'Сақ бол (Saq bol)', suffixesTr: 'Dikkatli ol! (Sağ ol değil!)', suffixesKz: 'Абай бол', exampleTr: 'Yolda dikkatli ol', exampleKz: 'Жолда сақ бол!' }
      ],
      examples: [
        { kz: 'Ертең ерте тұрамын.', tr: 'Yarın erken kalkacağım.', breakdown: 'ертең (yarın) + ерте (erken)' },
        { kz: 'Үйге кіріңіз, төрге шығыңыз!', tr: 'Eve giriniz, başköşeye buyurunuz!', breakdown: 'кір-іңіз (giriniz)' }
      ]
    },
    {
      id: 'g-bata-ve-nezaket',
      category: 'Kültür & Pragmatik',
      titleTr: 'Kazakçada Nezaket Dereceleri ve Kutsal «Bata» Geleneği',
      titleKz: 'Сыпайылық түрлері (Сен / Сіз / Сіздер) және Бата беру дәстүрі',
      summaryTr: 'Sen, Siz ve Çoğul Siz arasındaki saygı kademeleri ve geleneksel hayır duaları.',
      summaryKz: 'Қазақ тіліндегі сыпайылық нормалары мен ақ баталар.',
      explanationTr: 'Kazakçada hitap üç kademelidir:\n1. Сен (Sen): Akranlara, küçüklere ve çok samimi dostlara söylenir.\n2. Сіз (Siz): Yaşça büyüklere, tanımadık kimselere, anne-babaya ve hürmet edilen kişilere tekil olarak hitaptır (Fiil: -сыз/-сіз).\n3. Сіздер (Sizler): Birden fazla kişiye saygılı toplu hitaptır.\n\nBata Geleneği: Kazak sofrasından kalkarken veya yolculuğa çıkarken aksakallar (büyükler) iki elini açarak hayır duası («Ақ бата») verir. Bata verilmeden sofradan kalkılmaz. En yaygın dua:\n«Ниетің қабыл болсын, шаңырағың биік болсын, абыройың асқақ болсын!» (Niyetin kabul, yuvan yüksek, itibarın yüce olsun!)',
      explanationKz: 'Бата – ұлттық руханияттың қайнар көзі.',
      tableData: [
        { caseName: 'Сен (Samimi Sen)', suffixesTr: 'Sen gelirsin', suffixesKz: 'Сен келесің', exampleTr: 'Sen nasılsın?', exampleKz: 'Сен қалайсың?' },
        { caseName: 'Сіз (Hürmetkâr Tekil Siz)', suffixesTr: 'Siz gelirsiniz', suffixesKz: 'Сіз келесіз', exampleTr: 'Siz nasılsınız?', exampleKz: 'Сіз қалайсыз?' },
        { caseName: 'Сіздер (Saygılı Çoğul Sizler)', suffixesTr: 'Sizler gelirsiniz', suffixesKz: 'Сіздер келесіздер', exampleTr: 'Sizler hoş geldiniz', exampleKz: 'Сіздер қош келдіңіздер' }
      ],
      examples: [
        { kz: 'Ас тәтті, өмір ұзақ болсын! Аумин!', tr: 'Aşınız tatlı, ömrünüz uzun olsun! Amin!', breakdown: 'Sofradan sonra verilen kısa bata' }
      ]
    }
  ];

  const categories = [
    'all', 
    'Alfabe & Fonetik', 
    'Ses Bilgisi', 
    'İsim Çekimi', 
    'Fiil Çekimleri', 
    'Cümle Bilgisi', 
    'Karşılaştırmalı Türkoloji',
    'Kültür & Pragmatik'
  ];

  const filteredTopics = grammarTopics.filter(t => {
    const matchCat = selectedCategory === 'all' || t.category === selectedCategory;
    const term = searchTerm.toLowerCase();
    const matchSearch = t.titleTr.toLowerCase().includes(term) ||
      t.titleKz.toLowerCase().includes(term) ||
      t.summaryTr.toLowerCase().includes(term);
    return matchCat && matchSearch;
  });

  const handleSpeak = (text: string) => {
    audioService.speak(text, 'kk', 0.85);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 pb-8">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-cyan-900 text-white px-5 pt-5 pb-6 rounded-b-3xl shadow-md shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-white/10 text-teal-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">
                Dil Bilgisi & Karşılaştırmalı Gramer
              </h2>
              <p className="text-[11px] text-teal-200 font-medium">
                Türkçe - Kazakça Morfoloji, Sentaks & Türkoloji Atlası
              </p>
            </div>
          </div>

          {onOpenAlphabetGuide && (
            <button
              onClick={onOpenAlphabetGuide}
              className="px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-white/20"
            >
              <Activity className="w-3.5 h-3.5 text-teal-300" />
              <span>42 Harf Atlası</span>
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="mt-4 relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Kural, hâl eki veya zaman ara (Örn: Septik, Şimdiki Zaman)..."
            className="w-full pl-10 pr-4 py-2 bg-white text-slate-900 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm"
          />
        </div>
      </div>

      {/* Alageyik Mascot Grammar Tip */}
      <div className="px-4 pt-3 shrink-0">
        <div className="p-3 bg-gradient-to-r from-amber-50 to-teal-50 border border-amber-200/80 rounded-2xl shadow-2xs">
          <AlageyikMascot
            pose="thinking"
            size="sm"
            message="Kıpçak Türkçesinde ekler kökün ses uyumuna göre şekil alır!"
            subMessage="Singarmonizm mantığını kavradığınızda eklerin -ba/-be, -pa/-pe veya -tar/-ter dönüşümlerini anında tahmin edebilirsiniz."
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300'
            }`}
          >
            {cat === 'all' ? 'Tüm Kurallar' : cat}
          </button>
        ))}
      </div>

      {/* Topics Accordion List */}
      <div className="px-4 space-y-3 flex-1 overflow-y-auto">
        {filteredTopics.map((topic) => {
          const isExpanded = expandedTopicId === topic.id;
          return (
            <div
              key={topic.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition"
            >
              {/* Header Bar */}
              <div
                onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-black text-sm shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wide">
                      {topic.category}
                    </span>
                    <h3 className="text-xs font-black text-slate-900 leading-tight">
                      {topic.titleTr}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium line-clamp-1">
                      {topic.summaryTr}
                    </p>
                  </div>
                </div>

                <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-4">
                  {/* Detailed Explanation */}
                  <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    {topic.explanationTr}
                  </div>

                  {/* Table Comparison if available */}
                  {topic.tableData && (
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-teal-50/80 text-teal-900 font-bold border-b border-slate-200 text-[11px]">
                          <tr>
                            <th className="p-2.5">Hâl / Unsur</th>
                            <th className="p-2.5">Kazakça Ek</th>
                            <th className="p-2.5">Türkçe Ek</th>
                            <th className="p-2.5">Kazakça Örnek</th>
                            <th className="p-2.5">Türkçe Anlam</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[11px]">
                          {topic.tableData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-teal-50/30">
                              <td className="p-2.5 font-bold text-slate-900">{row.caseName}</td>
                              <td className="p-2.5 font-mono font-semibold text-teal-700">{row.suffixesKz}</td>
                              <td className="p-2.5 text-slate-600">{row.suffixesTr}</td>
                              <td className="p-2.5 font-bold text-teal-900 flex items-center gap-1.5">
                                <span>{row.exampleKz}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSpeak(row.exampleKz.split(' ')[0]);
                                  }}
                                  className="text-teal-600 hover:text-teal-800"
                                >
                                  <Volume2 className="w-3 h-3" />
                                </button>
                              </td>
                              <td className="p-2.5 text-slate-600">{row.exampleTr}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Example Sentences */}
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                      Cümle İçi Kullanımlar ve Çözümleme:
                    </h4>
                    {topic.examples.map((ex, i) => (
                      <div key={i} className="p-3 rounded-xl bg-teal-50/50 border border-teal-100 flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                            <span>🇰🇿 {ex.kz}</span>
                            <button
                              onClick={() => handleSpeak(ex.kz)}
                              className="text-teal-600 hover:text-teal-800"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                            🇹🇷 {ex.tr}
                          </div>
                          <div className="text-[10px] text-teal-700 font-mono mt-1">
                            🔎 {ex.breakdown}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </div>
          );
        })}

        {filteredTopics.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
            Arama kriterinize uygun dil bilgisi konusu bulunamadı.
          </div>
        )}
      </div>

    </div>
  );
};
