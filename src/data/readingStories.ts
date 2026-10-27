/**
 * Uzaktan Türkolog - CEFR A1 to C1 Authentic Story & Reading Library
 * Rich literary, cultural, everyday and academic reading texts for Turkish-Kazakh learners.
 */

export interface StoryQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface StoryVocabItem {
  kz: string;
  tr: string;
  note?: string;
}

export interface ReadingStory {
  id: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  levelLabel: string;
  titleTr: string;
  titleKz: string;
  subtitle: string;
  category: string;
  contentKz: string;
  contentTr: string;
  wordCount: number;
  readingMinutes: number;
  vocabulary: StoryVocabItem[];
  questions: StoryQuestion[];
}

export const READING_STORIES: ReadingStory[] = [
  // ==========================================
  // TÜRK MİTOLOJİSİ VE EFSANELER - ÖZEL KOLEKSİYON
  // ==========================================
  {
    id: 'story-mytho-alageyik',
    level: 'A2',
    levelLabel: 'A2 - Türk Mitolojisi',
    titleTr: 'Kutsal Alageyik Efsanesi: Altay Dağlarının Rehberi',
    titleKz: 'Қасиетті Алагеяк аңызы: Алтай тауларының жолбасшысы',
    subtitle: 'Bozkırın karanlığında yol gösteren altın boynuzlu kutlu geyik',
    category: 'Türk Mitolojisi & Efsaneler',
    wordCount: 220,
    readingMinutes: 3,
    contentKz: `Ерте заманда, Ұлы Даланың төсінде, қатал қыс басталған екен. Қалың қар басып, адамдар мен үйір-үйір жылқылар жол таба алмай, суықтан қатты қиналыпты. Қараңғы түнде боран соғып, ешкім қайда барарын білмепті.
    
Сол кезде аспаннан ерекше бір жарық пайда болыпты. Бұл – алтын мүйізді, сүттей аппақ Алагеяк (Сығын) екен. Оның мүйіздерінен күннің шуағындай нұр шашырап тұрды. Алагеяк еш қорықпай, адасқан елдің алдына шығып, басын изеп, өзінің артынан еруге шақырды.

Халық осы қасиетті жануарға сенді. Олар Алагеяқтың ізімен биік тау шатқалдарынан аман-есен өтіп, жылы әрі шөбі шүйгін құтты қонысқа жетті. Адамдар дін аман құтылып, Тәңірге шүкіршілік етті.

Сол күннен бастап қазақ және түркі халықтары үшін Алагеяк – ақылдың, адалдықтың, ізгілік пен тура жолдың мәңгілік киелі нышанына айналды. Сондықтан бабаларымыз: «Алагеяқты ренжітпе, ол – жақсылықтың жаршысы» деп өсиет қалдырған.`,
    contentTr: `Eski zamanlarda, Ulu Bozkır'ın bağrında çok çetin bir kış başlamıştı. Kalın kar her yanı örtmüş, insanlar ve yılkı yılkı atlar yollarını bulamayarak dondurucu soğuktan büyük ızdırap çekmişti. Zifiri karanlık gecede fırtına esiyor, hiç kimse nereye gideceğini bilemiyordu.

Tam o anda gökyüzünden eşsiz bir ışık belirdi. Bu; altın boynuzlu, süt gibi bembeyaz Alageyik (Sıgun) idi. Onun boynuzlarından güneşin ışığı gibi nurlar saçılıyordu. Alageyik hiç korkmadan, yolunu şaşırmış halkın önüne çıktı; başını sallayarak kendi ardından gelmelerini işaret etti.

Halk bu kutsal hayvana güvendi. Onlar Alageyik'in ayak izlerini takip ederek sarp dağ vadilerinden sağ salim geçti ve sıcak, otu bol bereketli bir yurda ulaştı. İnsanlar esenliğe kavuşup Tanrı'ya şükretti.

O günden sonra Kazak ve Türk halkları için Alageyik; aklın, dürüstlüğün, iyiliğin ve doğru yolun ebedi kutsal sembolü haline geldi. Bu yüzden atalarımız: «Alageyik'i incitme, o hayrın ve bereketin müjdecisidir» diye vasiyet bırakmıştır.`,
    vocabulary: [
      { kz: 'Алагеяк / Сығын', tr: 'Alageyik / Erkek Geyik', note: 'Türk mitolojisinin kutsal yol göstericisi' },
      { kz: 'Алтын мүйізді', tr: 'Altın boynuzlu', note: 'Güneş ışığını ve bilgeliği simgeler' },
      { kz: 'Ұлы Дала', tr: 'Ulu Bozkır', note: 'Avrasya bozkır coğrafyası' },
      { kz: 'Құтты қоныс', tr: 'Kutlu yurt / Bereketli yayla', note: 'Kut kavramı Türk inancında berekettir' },
      { kz: 'Жолбасшы', tr: 'Yol gösterici / Rehber / Kılavuz', note: 'Jol (Yol) + Bas (Baş) türetimi' }
    ],
    questions: [
      {
        question: 'Efsaneye göre Alageyik\'in boynuzları nasıldır ve ne saçmaktadır?',
        options: ['Altın boynuzludur ve güneş gibi nur saçmaktadır', 'Gümüş renklidir', 'Ağaç dalı gibidir', 'Işık saçmamaktadır'],
        correctAnswer: 'Altın boynuzludur ve güneş gibi nur saçmaktadır',
        explanation: 'Metinde: «Бұл – алтын мүйізді, сүттей аппақ Алагеяк екен. Оның мүйіздерінен күннің шуағындай нұр шашырап тұрды» denmektedir.'
      },
      {
        question: 'Türk ve Kazak kültüründe Alageyik neyin sembolüdür?',
        options: ['Aklın, dürüstlüğün, iyiliğin ve doğru yolun kutsal sembolüdür', 'Sadece bir av hayvanıdır', 'Savaş sembolüdür', 'Kış mevsiminin işaretidir'],
        correctAnswer: 'Aklın, dürüstlüğün, iyiliğin ve doğru yolun kutsal sembolüdür',
        explanation: 'Metinde: «Алагеяк – ақылдың, адалдықтың, ізгілік пен тура жолдың мәңгілік киелі нышанына айналды» ifadesi geçmektedir.'
      }
    ]
  },
  {
    id: 'story-korkut-ata',
    level: 'B1',
    levelLabel: 'B1 - Kültür & Tarih',
    titleTr: 'Korkut Ata ve Kopuzun Doğuşu',
    titleKz: 'Қорқыт ата және қобыздың тууы',
    subtitle: 'Ölüme meydan okuyan bilge ozan ve bozkırın ilk çalgısı',
    category: 'Mitoloji & Edebiyat',
    wordCount: 240,
    readingMinutes: 3,
    contentKz: `Қорқыт ата – барша түркі дүниесінің ұлы ойшылы, дана жырауы әрі тұңғыш күйшісі. Аңыз бойынша, Қорқыт өлімнен қашып, дүниенің төрт бұрышын аралапты. Бірақ қайда барса да, көр қазып жатқан адамдарды көріп: «Бұл кімнің көрі?» деп сұрағанда, олар: «Қорқыттың көрі» деп жауап береді екен.
    
Сонда Қорқыт өлімнің денеге ғана билік ететінін, ал мәңгілік өмір тек өнер мен ізгі сөзде ғана бар екенін түсінеді. Ол қарағай ағашын шауып, оның ішін ойып, түйенің терісімен қаптап, нар ішегін тағып, дүниедегі тұңғыш қобызды жасап шығарады.

Қорқыт Сырдария өзенінің үстіне кілем жайып, қобызын тартып, ғажайып күйлер төгеді. Оның қобызынан шыққан күй желді тоқтатып, ұшқан құсты қондырып, ағып жатқан суды кідірткен екен. Өлімнің өзі осы сұлу саздың алдында дәрменсіз қалыпты.

Қорқыттың осы өнері арқылы оның аты ғасырлар бойы өлмей, ұрпақтан ұрпаққа жетті.`,
    contentTr: `Korkut Ata; bütün Türk dünyasının ulu düşünürü, bilge ozanı ve ilk küy (beste) üstadıdır. Efsaneye göre Korkut, ölümden kaçmak için dünyanın dört bir bucağını dolaşmıştır. Fakat nereye varsa, mezar kazan insanları görüp: «Bu kimin mezarıdır?» diye sorduğunda, onlar: «Korkut\'un mezarıdır» diye cevap verirmiş.

Bunun üzerine Korkut, ölümün yalnızca ete ve kemiğe hükmettiğini; ebedi diriliğin ise ancak sanatta ve hakikatli sözde olduğunu anlamıştır. O, bir çam ağacını yontup içini oymuş, üzerini deve derisiyle kaplamış, atın kıl kirişlerini takarak dünyadaki ilk kopuzu yapmıştır.

Korkut, Seyhun (Sırderya) nehrinin üzerine bir kilim serip kopuzunu çalarak eşsiz besteler terennüm etmiştir. Onun kopuzundan çıkan nağmeler esen yeli dindirmiş, uçan kuşu gökten indirip dinletmiş, coşkun akan suları durdurmuştur. Ölümün kendisi bile bu kutlu melodinin önünde çaresiz kalmıştır.

Korkut\'un bu sanatı sayesinde onun adı asırlar boyunca ölmemiş, nesilden nesile yaşamıştır.`,
    vocabulary: [
      { kz: 'Жырау', tr: 'Bilge ozan / Destan anlatıcısı', note: 'Topluma nasihat veren halk bilgesi' },
      { kz: 'Қобыз', tr: 'Kopuz', note: 'Korkut Ata\'nın icat ettiği yaylı çalgı' },
      { kz: 'Күй / Күйші', tr: 'Küy (Beste) / Küy ustası', note: 'Dombra ve kopuzla çalınan sözsüz felsefi beste' },
      { kz: 'Сырдария', tr: 'Sırderya (Seyhun)', note: 'Korkut Ata türbesinin bulunduğu tarihi nehir' }
    ],
    questions: [
      {
        question: 'Korkut Ata dünyadaki ilk kopuzu hangi malzemelerden yapmıştır?',
        options: ['Çam ağacını oyup deve derisi ve at kılı kiriş takarak', 'Demir ve telden', 'Taştan', 'Sadece kamıştan'],
        correctAnswer: 'Çam ağacını oyup deve derisi ve at kılı kiriş takarak',
        explanation: 'Metinde: «Ол қарағай ағашын шауып, оның ішін ойып, түйенің терісімен қаптап, нар ішегін тағып қобыз жасады» denmektedir.'
      }
    ]
  },
  {
    id: 'story-kiyiz-uy',
    level: 'A2',
    levelLabel: 'A2 - Bozkır Kültürü',
    titleTr: 'Bozkırın Kalbi: Kazak Yurdu (Kiyiz Üy) ve Şanırak',
    titleKz: 'Даланың жүрегі: Қазақтың киіз үйі және Шаңырақ',
    subtitle: 'Binlerce yıllık mühendislik harikası göçebe evi ve birlik simgesi',
    category: 'Bozkır Yaşamı & Kültür',
    wordCount: 195,
    readingMinutes: 3,
    contentKz: `Қазақтың киіз үйі – көшпелі өркениеттің ең ғажайып туындысы. Ол жазда салқын, қыста жылы, әрі небары бір-екі сағатта жиналып, түйеге артылатын өте ыңғайлы баспана.
    
Киіз үйдің негізгі бөліктері: кереге (қабырғасы), уық (күмбез тіреулері) және ең төбесіндегі дөңгелек шаңырақ. Шаңырақ – киіз үйдің төбесіндегі күн көзі, түтін шығатын әрі жарық түсетін қасиетті орын.

Қазақ халқы үшін шаңырақ – жай ғана ағаш бөлшек емес, ол – отбасының, ел бірлігінің және ұрпақ жалғастығының қасиетті белгісі. Қазақта «Шаңырағың биік болсын!» деген бата бар. Бұл «Әулетің берекелі, бірлігің мықты болсын» деген ізгі тілек. Бүгінде шаңырақ бейнесі Қазақстанның мемлекеттік Елтаңбасында да асқақтап тұр.`,
    contentTr: `Kazakların keçe çadırı (Kiyiz Üy); göçebe medeniyetinin en muazzam şaheseridir. O yazın serin, kışın sıcacıktır; üstelik sadece bir iki saat içinde sökülüp toplanarak deveye yüklenebilen son derece pratik bir konuttur.

Keçe çadırın ana kısımları: kerege (kafes biçimli duvarlar), uvuq (kubbe çıtaları) ve en tepedeki yuvarlak şanıraktır. Şanırak; çadırın kubbesindeki güneş gözü, hem dumanın çıktığı hem de içeriye güneş ışığının süzüldüğü mukaddes açıklıktır.

Kazak halkı için şanırak alelade bir ahşap parça değildir; o ailenin, millet birliğinin ve nesil sürekliliğinin kutsal timsalidir. Kazaklarda «Şanırağın yüksek olsun!» diye köklü bir dua vardır. Bu, «Ocağın bereketli, yuvan sağlam olsun» demektir. Günümüzde şanırak tasviri Kazakistan Cumhuriyeti Devlet Arması\'nın da merkezinde yer almaktadır.`,
    vocabulary: [
      { kz: 'Киіз үй', tr: 'Keçe ev / Göçebe çadırı / Yurt', note: 'Kiyiz = Keçe, Üy = Ev' },
      { kz: 'Шаңырақ', tr: 'Şanırak', note: 'Çadırın tepesindeki çember; bayrak ve armada birlik sembolüdür' },
      { kz: 'Кереге', tr: 'Kerege (Kafes duvar)', note: 'Katlanabilir ahşap iskelet' },
      { kz: 'Бата', tr: 'Hayır duası / Nasihat', note: '«Şanırağıñ biyik bolsın» en meşhur Kazak duasıdır' }
    ],
    questions: [
      {
        question: 'Kazak kültüründe «Şanırağıñ biyik bolsın!» duası ne anlama gelir?',
        options: ['Ocağın bereketli, hanen huzurlu ve birliğin kavi olsun', 'Evin çok katlı olsun', 'Dağlara çadır kur', 'Hızlı at sür'],
        correctAnswer: 'Ocağın bereketli, hanen huzurlu ve birliğin kavi olsun',
        explanation: 'Metinde: «Әулетің берекелі, бірлігің мықты болсын» anlamına geldiği belirtilmektedir.'
      },
      {
        question: 'Keçe evin (Kiyiz Üy) kubbe çıtalarına ne ad verilir?',
        options: ['Уық (Uvuq)', 'Кереге', 'Шаңырақ', 'Есік'],
        correctAnswer: 'Уық (Uvuq)',
        explanation: 'Metinde kubbe çıtaları için «уық (күмбез тіреулері)» ifadesi geçer.'
      }
    ]
  },
  // ==========================================
  // LEVEL A1 - BAŞLANGIÇ HİKAYELERİ
  // ==========================================
  {
    id: 'story-a1-1',
    level: 'A1',
    levelLabel: 'A1 - Başlangıç',
    titleTr: 'Almatı\'da İlk Günüm ve Medeu Zirvesi',
    titleKz: 'Алматыдағы алғашқы күн және Медеу шыңы',
    subtitle: 'Almatı şehrine ilk varış, tanışma ve karlı dağ manzaraları',
    category: 'Günlük Yaşam & Seyahat',
    wordCount: 145,
    readingMinutes: 2,
    contentKz: `Сәлеметсіз бе! Менің атым – Жан. Мен Түркиядан, Стамбұл қаласынан келдім. Бүгін менің Қазақстандағы алғашқы күнім. 

Таңертең ұшақ Алматы халықаралық әуежайына қонды. Мені қазақ досым Айбек күтіп алды. Ол күлімсіреп: «Қош келдіңіз, бауырым!» деді. Біз бір-бірімізге сәлем беріп, көлікке отырдық.

Алматы – өте әдемі, таза және жасыл қала. Көшелерде биік ағаштар мен әдемі гүлдер көп. Қаланың оңтүстігінде биік Алатау таулары асқақтап тұр. Таулардың шыңында аппақ қар жатыр.

Түстен кейін біз әйгілі Медеу мұз айдынына бардық. Мұнда таудың ауасы өте таза әрі салқын екен. Айнала шыршаларға толы. Мен қазақша бірнеше жаңа сөз үйрендім: «тау», «қар», «ауа» және «рахмет». Қазақстан маған бірден ұнады!`,
    contentTr: `Merhaba! Benim adım Can. Ben Türkiye'den, İstanbul şehrinden geldim. Bugün benim Kazakistan'daki ilk günüm.

Sabahleyin uçak Almatı Uluslararası Havalimanı'na indi. Beni Kazak arkadaşım Aybek karşıladı. O gülümseyerek: «Hoş geldiniz, kardeşim!» dedi. Biz birbirimize selam verip arabaya bindik.

Almatı; çok güzel, temiz ve yemyeşil bir şehirdir. Caddelerde yüksek ağaçlar ve güzel çiçekler çoktur. Şehrin güneyinde yüksek Aladağlar heybetle durmaktadır. Dağların doruklarında bembeyaz kar bulunmaktadır.

Öğleden sonra biz meşhur Medeu buz pateni pistine gittik. Burada dağ havası çok temiz ve serindi. Etraf ladin ağaçlarıyla doluydu. Ben Kazakça birkaç yeni kelime öğrendim: «dağ», «kar», «hava» ve «teşekkür ederim». Kazakistan'ı hemen çok sevdim!`,
    vocabulary: [
      { kz: 'Қош келдіңіз', tr: 'Hoş geldiniz', note: 'Saygılı karşılama kalıbı' },
      { kz: 'Бауыр / Бауырым', tr: 'Kardeş / Kardeşim', note: 'Kazakçada samimi hitap' },
      { kz: 'Тау', tr: 'Dağ', note: 'Kıpçak ses değişimi: Dağ ➔ Taw' },
      { kz: 'Мұз айдыны', tr: 'Buz pateni pisti', note: 'Medeu dünyanın en yüksek buz pistidir' }
    ],
    questions: [
      {
        question: 'Can Kazakistan\'a hangi ülkeden ve şehirden gelmiştir?',
        options: ['Türkiye / İstanbul', 'Azerbaycan / Bakü', 'Özbekistan / Taşkent', 'Kırgızistan / Bişkek'],
        correctAnswer: 'Türkiye / İstanbul',
        explanation: 'Metinde: «Мен Түркиядан, Стамбұл қаласынан келдім» denmektedir.'
      },
      {
        question: 'Can\'ı havaalanında kim karşılamıştır?',
        options: ['Kazak arkadaşı Aybek', 'Taksi şoförü', 'Öğretmeni', 'Kardeşi'],
        correctAnswer: 'Kazak arkadaşı Aybek',
        explanation: 'Metinde: «Мені қазақ досым Айбек күтіп алды» ifadesi yer almaktadır.'
      }
    ]
  },
  {
    id: 'story-a1-2',
    level: 'A1',
    levelLabel: 'A1 - Başlangıç',
    titleTr: 'Yeşil Pazar\'da Alışveriş ve Aport Elması',
    titleKz: 'Көк базардағы сауда және Апорт алмасы',
    subtitle: 'Pazar alışverişi, sayılar, meyveler ve Kazak lezzetleri',
    category: 'Günlük Yaşam & Alışveriş',
    wordCount: 138,
    readingMinutes: 2,
    contentKz: `Бүгін сенбі. Біз Айбек екеуміз Алматының атақты «Көк базарына» бардық. Базардың іші адамға толы, өте көңілді.

Мұнда алуан түрлі дәмді тағамдар сатылады. Ең алдымен біз жеміс-жидек бөліміне бардық. Сатушы апай: «Келіңіздер, жас жігіттер! Дәм татыңыздар!» деп шақырды. 

Ол бізге үлкен, қызыл Апорт алмасын ұсынды. Алма өте тәтті әрі шырынды екен. Мен: «Бұл алманың бір килограмы қанша тұрады?» деп сұрадым. Сатушы: «Бір килограмы – жеті жүз теңге» деді. Біз екі килограмм алма және бір килограмм бал сатып алдық.

Содан кейін біз ұлттық тағамдар қатарына өттік. Онда құрт, ірімшік және балғын бауырсақ бар екен. Құрт – дөңгелек, тұзды және пайдалы сүт өнімі. Қазақ базарында сауда жасау өте қызықты!`,
    contentTr: `Bugün cumartesi. Biz Aybek ikimiz Almatı'nın meşhur «Yeşil Pazarı»na (Kök Bazar) gittik. Pazarın içi insan doluydu, çok neşeliydi.

Burada çeşit çeşit lezzetli yiyecekler satılmaktadır. En başta biz meyve-sebze reyonuna gittik. Satıcı teyze: «Gelin, genç yiğitler! Tadına bakın!» diye çağırdı.

O bize büyük, kırmızı bir Aport elması ikram etti. Elma çok tatlı ve suluydu. Ben: «Bu elmanın bir kilosu kaç para?» diye sordum. Satıcı: «Bir kilosu – yedi yüz tenge» dedi. Biz iki kilo elma ve bir kilo bal satın aldık.

Ondan sonra biz geleneksel yiyecekler sırasına geçtik. Orada kurut, irmşik ve taze bavursak vardı. Kurut; yuvarlak, tuzlu ve faydalı bir süt ürünüdür. Kazak pazarında alışveriş yapmak çok ilginçti!`,
    vocabulary: [
      { kz: 'Көк базар', tr: 'Yeşil Pazar', note: 'Almatı\'nın tarihi kapalı çarşısı' },
      { kz: 'Апорт алмасы', tr: 'Aport elması', note: 'Almatı\'ya adını veren dev elma cinsi' },
      { kz: 'Құрт', tr: 'Kurut / Kurutulmuş çökelek', note: 'Tuzlu sert süt ürünü' },
      { kz: 'Қанша тұрады?', tr: 'Kaç para? / Fiyatı ne kadar?', note: 'Alışveriş soru kalıbı' }
    ],
    questions: [
      {
        question: 'Elmanın bir kilogramı kaç tengedir?',
        options: ['700 tenge', '500 tenge', '1000 tenge', '300 tenge'],
        correctAnswer: '700 tenge',
        explanation: 'Satıcı teyze: «Бір килограмы – жеті жүз теңге» (700 tenge) demiştir.'
      },
      {
        question: 'Kazak pazarında satılan yuvarlak ve tuzlu süt ürünü hangisidir?',
        options: ['Құрт (Kurut)', 'Шұбат', 'Қымыз', 'Бауырсақ'],
        correctAnswer: 'Құрт (Kurut)',
        explanation: 'Metinde: «Құрт – дөңгелек, тұзды және пайдалы сүт өнімі» denmektedir.'
      }
    ]
  },
  {
    id: 'story-a1-3',
    level: 'A1',
    levelLabel: 'A1 - Başlangıç',
    titleTr: 'Aybek\'in Köyü ve Evcil Hayvanları',
    titleKz: 'Айбектің ауылы және төрт түлік мал',
    subtitle: 'Bozkır köyünde bir gün, atlar, koyunlar ve temiz doğa',
    category: 'Doğa ve Köy Hayatı',
    wordCount: 130,
    readingMinutes: 2,
    contentKz: `Жазғы демалыста біз Айбектің ауылына бардық. Ауыл таудың етегінде, кең даланың ортасында орналасқан.

Ауылда Айбектің атасы мен әжесі тұрады. Олар бізді зор қуанышпен қарсы алды. Әжеміз бізге ыстық шәй мен дәмді бауырсақ пісіріп берді. Атасы маған ауылдың тыныс-тіршілігін көрсетті.

Қорада көптеген үй жануарлары бар: жылқы, сиыр, қой және ешкі. Қазақ халқы бұларды «төрт түлік мал» деп атайды. Маған әсіресе кішкентай құлыншақ қатты ұнады. Оның түсі қара, көздері мейірімді.

Кешкісін ауылда тыныштық орнайды. Аспанда мыңдаған жұлдыздар жарқырайды. Ауылдың самал желі өте жағымды. Мен табиғаттың сұлулығына таңғалдым.`,
    contentTr: `Yaz tatilinde biz Aybek'in köyüne gittik. Köy dağın eteğinde, geniş bozkırın ortasında yer almaktadır.

Köyde Aybek'in dedesi ve ninesi yaşamaktadır. Onlar bizi büyük bir sevinçle karşıladılar. Ninemiz bize sıcak çay ve lezzetli bavursak pişirip verdi. Dedesi bana köyün günlük yaşamını gösterdi.

Ağılda birçok evcil hayvan vardır: at, inek, koyun ve keçi. Kazak halkı bunlara «dört tür hayvan» (tört tülik) der. Benim özellikle küçük tay çok hoşuma gitti. Rengi siyah, gözleri şefkatliydi.

Akşamleyin köyde sessizlik hakim olur. Gökyüzünde binlerce yıldız parlar. Köyün ılık rüzgarı çok hoştur. Ben doğanın güzelliğine hayran kaldım.`,
    vocabulary: [
      { kz: 'Ауыл', tr: 'Köy', note: 'Bozkır yerleşimi' },
      { kz: 'Ата мен Әже', tr: 'Dede ve Nine', note: 'Büyüklere saygı kalıbı' },
      { kz: 'Төрт түлік', tr: 'Dört tür mal/hayvan', note: 'At, koyun/keçi, sığır, deve' },
      { kz: 'Құлыншақ', tr: 'Taycık / Küçük tay', note: 'At yavrusu' }
    ],
    questions: [
      {
        question: 'Kazak kültüründe «төрт түлік мал» ne anlama gelir?',
        options: ['Dört tür evcil hayvan (at, koyun, sığır, deve)', 'Dört mevsim', 'Dört yön', 'Dört tekerli araba'],
        correctAnswer: 'Dört tür evcil hayvan (at, koyun, sığır, deve)',
        explanation: 'Kazakçada dört temel sürü hayvanına tört tülik denir.'
      }
    ]
  },
  {
    id: 'story-a1-4',
    level: 'A1',
    levelLabel: 'A1 - Başlangıç',
    titleTr: 'Yeni Okulun İlk Sabahı ve Sınıf Arkadaşları',
    titleKz: 'Жаңа мектептегі алғашқы таң және сыныптастар',
    subtitle: 'Sınıf ortamı, ders araçları ve kardeşlik bağı',
    category: 'Eğitim & Arkadaşlık',
    wordCount: 125,
    readingMinutes: 2,
    contentKz: `Бүгін – бірінші қыркүйек, Білім күні! Қазақстанда мектептерде жаңа оқу жылы басталды. 

Мен таңертең ерте ояндым. Мектеп формамды киіп, сөмкеме кітаптарым мен дәптерлерімді салдым. Мектеп ауласында көңілді әуен ойнап тұрды. Оқушылардың қолында әдемі гүл шоқтары бар.

Біздің сынып екінші қабатта. Мұғаліміміз – Гүлнәр апай. Ол өте мейірімді әрі парасатты ұстаз. Сыныпта жиырма бес оқушы бар. 

Мұғалім бізге: «Қымбатты балалар, жаңа оқу жылы құтты болсын! Тіл үйрену – үлкен өнер» деді. Мен қасымда отырған досыммен таныстым. Оның есімі – Нұрсұлтан. Біз бірге жақсы оқуға сөз бердік.`,
    contentTr: `Bugün – bir eylül, Bilgi Günü! Kazakistan'da okullarda yeni eğitim öğretim yılı başladı.

Ben sabah erkenden uyandım. Okul formamı giyip çantama kitaplarımı ve defterlerimi koydum. Okul bahçesinde neşeli müzik çalıyordu. Öğrencilerin elinde güzel çiçek buketleri vardı.

Bizim sınıf ikinci kattadır. Öğretmenimiz – Gülnar Hanım'dır. O çok şefkatli ve bilge bir öğretmendir. Sınıfta yirmi beş öğrenci vardır.

Öğretmen bize: «Değerli çocuklar, yeni ders yılı kutlu olsun! Dil öğrenmek büyük sanattır» dedi. Ben yanımda oturan arkadaşımla tanıştım. Onun adı – Nursultan. Biz birlikte iyi ders çalışmaya söz verdik.`,
    vocabulary: [
      { kz: 'Білім күні', tr: 'Bilgi Günü (1 Eylül)', note: 'Tüm Türkistan\'da okulların açılış bayramı' },
      { kz: 'Сөмке', tr: 'Çanta', note: 'Okul çantası' },
      { kz: 'Ұстаз / Мұғалім', tr: 'Öğretmen / Hoca', note: 'Saygılı hitap' }
    ],
    questions: [
      {
        question: 'Kazakistan\'da yeni eğitim öğretim yılı ne zaman başlar?',
        options: ['1 Eylül (Білім күні)', '1 Ekim', '15 Eylül', '1 Ocak'],
        correctAnswer: '1 Eylül (Білім күні)',
        explanation: '1 Eylül tüm Kazakistan\'da Bilim Günü olarak kutlanır ve dersler başlar.'
      }
    ]
  },

  // ==========================================
  // LEVEL A2 - TEMEL DÜZEY HİKAYELERİ
  // ==========================================
  {
    id: 'story-a2-1',
    level: 'A2',
    levelLabel: 'A2 - Temel',
    titleTr: 'Kazak Sofrası ve Dasturhanın Kutsiyeti',
    titleKz: 'Қазақтың киелі дастарқаны және қонақжайлылық',
    subtitle: 'Misafir karşılama, başköşe (төр), kazy ikramı ve aksakal batası',
    category: 'Gelenek & Görenek',
    wordCount: 175,
    readingMinutes: 3,
    contentKz: `Қазақ халқының тұрмысында дастарқанның орны ерекше қасиетті саналады. Үйге қонақ келгенде, үй иелері оны ең алдымен төрге шақырады. Төр – үйдің ең құрметті, қадірлі орны.

Дастарқан жайылғанда оның үстіне түрлі дәмді тағамдар қойылады: ыстық бауырсақ, сары май, құрт, бал және қазы-қарта. Қазы – жылқы етінен жасалатын ең бағалы әрі дәмді ұлттық тағам. 

Қонақтарға алдымен пиаламен қою сүтті шәй ұсынылады. Шәйді құйғанда пиаланы толтырмай, жартылай құяды. Бұл – «шәй суымасын, жиі жаңартып құйып тұрайын» деген қонаққа деген ілтипаттың белгісі.

Тамақтанып болған соң, дастарқан басындағы ең жасы үлкен ақсақал қос қолын жайып, бата береді:
«Дастарқаныңызға береке берсін,
Бастарыңызға амандық берсін,
Әумин!» 
Бата – елге амандық, шаңыраққа шаттық тілейтін рухани дәстүр. Бата берілмей дастарқаннан тұруға болмайды.`,
    contentTr: `Kazak halkının yaşamında dasturhanın (sofranın) yeri fevkalade kutsal sayılır. Eve misafir geldiğinde ev sahipleri onu en başta başköşeye (tör) buyur eder. Tör, evin en hürmetli, kıymetli yeridir.

Sofra kurulduğunda üzerine türlü lezzetli yiyecekler konulur: sıcak bavursak, tereyağı, kurut, bal ve kazy-karta. Kazy, at etinden yapılan en değerli ve lezzetli milli yiyecektir.

Misafirlere önce piala (kulpsuz kase) ile koyu sütlü çay ikram edilir. Çay doldurulurken piala tepeleme doldurulmaz, yarım doldurulur. Bu; «çay soğumasın, tazeleyerek doldurayım» anlamına gelen misafire hürmet göstergesidir.

Yemek bittikten sonra sofradaki en yaşlı aksakal iki elini açıp dua (bata) verir:
«Sofranıza bereket versin,
Başınıza esenlik versin,
Amin!»
Bata; yurda esenlik, ocağa neşe dileyen manevi bir gelenektir. Bata verilmeden sofradan kalkılmaz.`,
    vocabulary: [
      { kz: 'Төр', tr: 'Başköşe / Evin en saygın yeri', note: 'Geleneksel Türk keçeevinde kapının tam karşısı' },
      { kz: 'Қазы', tr: 'Kazy / Geleneksel at eti sucuğu', note: 'Özel günlerin şeref yemeği' },
      { kz: 'Пиала', tr: 'Kulpsuz çay kasesi', note: 'Çay yarım doldurulur' },
      { kz: 'Бата', tr: 'Dua / Hayır duası', note: 'Yemek sonu aksakal tarafından okunur' }
    ],
    questions: [
      {
        question: 'Kazak misafirperverliğinde çay kasesi (пиала) neden yarım doldurulur?',
        options: [
          'Çay soğumasın, ev sahibi sürekli tazeleyerek hürmet etsin diye',
          'Çay yetersiz olduğu için',
          'Misafir çabuk kalksın diye',
          'Kase çok ağır olduğu için'
        ],
        correctAnswer: 'Çay soğumasın, ev sahibi sürekli tazeleyerek hürmet etsin diye',
        explanation: 'Pialaya yarım çay koymak misafire değer verildiğini ve sohbetin devam edeceğini gösterir.'
      }
    ]
  },
  {
    id: 'story-a2-2',
    level: 'A2',
    levelLabel: 'A2 - Temel',
    titleTr: 'Korkut Ata Efsanesi ve Kopuzun Doğuşu',
    titleKz: 'Қорқыт ата аңызы және киелі қобыз',
    subtitle: 'Ölümden kaçan Korkut Ata, Sır Derya ve ebedi müzik',
    category: 'Efsane & Mitoloji',
    wordCount: 165,
    readingMinutes: 3,
    contentKz: `Ежелгі түркі аңыздарында Қорқыт ата – барша бақсы-жыраулардың пірі, күй атасы саналады. Қорқыт ата өмірдің мәнін іздеп, өлімнен қашқан адам ретінде тарихта қалған.

Қорқыт қайда барса да, алдынан қабір қазып жатқан адамдарды көреді екен. Олардан: «Бұл кімнің қабірі?» деп сұраса, олар: «Бұл – Қорқыттың көрі» деп жауап береді. Дүниенің төрт бұрышын аралап, өлімнен құтыла алмасын білген ол Сырдария өзенінің жағасына оралады.

Сонда Қорқыт қарағай ағашын шауып, түйенің терісі мен жылқының қылынан тұңғыш рет қобыз аспабын жасайды. Ол өзеннің ортасына кілем жайып, қобызда күй тарта бастайды.

Қобыздың үні сондай мұңды әрі сиқырлы шығады. Қобыз сарнағанда аспандағы құстар ұшуын тоқтатып, жүгірген аңдар тыңдап қалады екен. Қорқыт күй тартып отырғанда өлім оған жақындай алмапты. Өнер мен күй – адамның жанын мәңгілікке жеткізетін ұлы күш.`,
    contentTr: `Kadim Türk efsanelerinde Korkut Ata; tüm ozanların piri, ezgilerin atası sayılır. Korkut Ata hayatın anlamını arayıp ölümden kaçan bir bilge olarak tarihe geçmiştir.

Korkut nereye gitse önünde mezar kazan insanlarla karşılaşırmış. Onlara: «Bu kimin mezarı?» diye sorduğunda onlar: «Bu, Korkut'un kabridir» diye cevap verirlermiş. Dünyanın dört bir bucağını dolaşıp ölümden kaçılamayacağını anlayınca Sır Derya ırmağının kıyısına döner.

O vakit Korkut çam ağacını yontup deve derisi ve at kılından ilk defa kopuz çalgısını yapar. Irmağın ortasına kilim serip kopuzla ezgiler (küy) çalmaya başlar.

Kopuzun sesi öyle hüzünlü ve büyüleyici çıkar ki, kopuz inlediğinde gökteki kuşlar uçmayı bırakır, koşan hayvanlar durup dinlermiş. Korkut ezgi çaldığı sürece ölüm ona yaklaşamazmış. Sanat ve musiki, insan ruhunu ölümsüzlüğe ulaştıran ulu bir güçtür.`,
    vocabulary: [
      { kz: 'Қобыз', tr: 'Kopuz / Kıl kopuz', note: 'At kılı telli kadim Türk yaylı çalgısı' },
      { kz: 'Күй', tr: 'Küy / Enstrümantal bozkır ezgisi', note: 'Sözsüz derin felsefi müzik eseri' },
      { kz: 'Сырдария', tr: 'Sır Derya nehri', note: 'Korkut Ata türbesinin bulunduğu kadim ırmak' }
    ],
    questions: [
      {
        question: 'Korkut Ata kopuz çaldığı sırada ne olmuştur?',
        options: [
          'Kuşlar ve hayvanlar durup dinlemiş, ölüm ona yaklaşamamıştır',
          'Fırtına kopmuştur',
          'Sular donmuştur',
          'Hiç kimse dinlememiştir'
        ],
        correctAnswer: 'Kuşlar ve hayvanlar durup dinlemiş, ölüm ona yaklaşamamıştır',
        explanation: 'Efsaneye göre musiki çalındığı sürece ölüm Korkut\'a yaklaşamamıştır.'
      }
    ]
  },
  {
    id: 'story-a2-3',
    level: 'A2',
    levelLabel: 'A2 - Temel',
    titleTr: 'Nevruz: Bozkırın ve Baharın Dirilişi',
    titleKz: 'Ұлыстың ұлы күні – Наурыз мейрамы',
    subtitle: '21 Mart ekinoksu, Nevruz köje ve kardeşlik bayramı',
    category: 'Bayram & Kültür',
    wordCount: 160,
    readingMinutes: 3,
    contentKz: `Наурыз – көктемнің бастауы, жаңа күннің, жаңа өмірдің мерекесі. Қазақ халқы жиырма бірінші наурызды «Ұлыстың ұлы күні» деп ерекше қастерлейді. Бұл күні күн мен түн теңеледі.

Мереке күні адамдар ерте оянып, бір-біріне: «Наурыз құтты болсын, ақ мол болсын!» деп ақ тілек айтады. Ренжіскен адамдар татуласып, құшақтасады. Ауыл азаматтары ағаш егіп, бұлақтың көзін ашады.

Наурыздың басты дәмі – Наурыз көже. Ол жеті түрлі дәмнен жасалады: су, ет, тұз, май, ұн, сүт және астық (тары немесе күріш). Жеті саны – қазақта қасиетті сан. Бұл көже тоқтық пен берекенің белгісі.

Алаңдарда киіз үйлер тігіліп, алтыбақан тербеледі. Балуандар күресіп, жүйрік аттар бәйгеге шабады. Наурыз – бүкіл түркі дүниесінің ортақ бірлік мейрамы.`,
    contentTr: `Nevruz; baharın başlangıcı, yeni günün ve yeni hayatın bayramıdır. Kazak halkı 21 Mart gününü «Milletin Ulu Günü» olarak hürmetle anar. Bu günde gece ile gündüz eşitlenir.

Bayram günü insanlar erkenden uyanıp birbirlerine: «Nevruz kutlu olsun, bereket bol olsun!» diye iyi dilekler söyler. Küs olanlar barışır, kucaklaşır. Köy halkı ağaç dikip pınarların gözünü açar.

Nevruzun baş aşı – Nevruz Köjedir. O yedi çeşit nimetten yapılır: su, et, tuz, yağ, un, süt ve tahıl (darı veya pirinç). Yedi sayısı Kazaklarda kutsal sayıdır. Bu çorba tokluğun ve bereketin nişanesidir.

Meydanlarda keçe evler kurulup salıncaklar (altıbakan) sallanır. Pehlivanlar güreşip soylu atlar yarışır. Nevruz, tüm Türk dünyasının ortak birlik bayramıdır.`,
    vocabulary: [
      { kz: 'Наурыз көже', tr: 'Nevruz köjesi', note: '7 kutsal malzemeden yapılan bayram aşı' },
      { kz: 'Алтыбақан', tr: 'Altıbakan salıncağı', note: 'Gençlerin bayramda sallandığı 6 direkli salıncak' },
      { kz: 'Ақ мол болсын', tr: 'Süt/bereket bol olsun', note: 'Geleneksel Nevruz duası' }
    ],
    questions: [
      {
        question: 'Nevruz köjesi kaç çeşit gıdadan pişirilir?',
        options: ['7 çeşit', '3 çeşit', '12 çeşit', '5 çeşit'],
        correctAnswer: '7 çeşit',
        explanation: 'Yedi kutsal nimet: su, et, tuz, yağ, un, süt ve tahıl.'
      }
    ]
  },
  {
    id: 'story-a2-4',
    level: 'A2',
    levelLabel: 'A2 - Temel',
    titleTr: 'Tulpar Treniyle Bozkırda Gece Yolculuğu',
    titleKz: '«Тұлпар» жүрдек пойызындағы түнгі сапар',
    subtitle: 'Astana\'dan Almatı\'ya demir yolu serüveni ve kompartıman sohbeti',
    category: 'Seyahat & Coğrafya',
    wordCount: 155,
    readingMinutes: 3,
    contentKz: `Кешкі сағат жетіде біз елордамыз Астананың «Нұрлы жол» теміржол вокзалына келдік. Біз «Тұлпар-Тальго» жүрдек пойызымен Алматыға қарай жол тарттық.

Пойыз өте жылдам әрі жайлы. Вагонның іші тап-таза, терезелері кең. Терезеден қарағанда шексіз Сарыарқа даласы көз алдыңа жайылады. Далада күн батып, аспан қызыл түске боялды.

Біздің купедегі жолсерігіміз – Мұрат есімді тарих пәнінің мұғалімі. Ол бізге Балқаш көлі туралы және қазақ даласының ұлы батырлары жөнінде қызықты әңгімелер айтып берді. Жол үстінде біз ыстық шәй ішіп, сөйлестік.

Түнде пойыз бірқалыпты ырғақпен зымырап келеді. Таңертең ерте оянғанымызда терезеден қарлы Алатау шыңдары көрінді. Қазақстанның кең-байтақ жерін пойызбен саяхаттау – ұмытылмас әсер сыйлайды.`,
    contentTr: `Akşam saat yedide biz başkentimiz Astana'nın «Nurlu Jol» tren garına geldik. Biz «Tulpar-Talgo» hızlı treniyle Almatı'ya doğru yola çıktık.

Tren çok hızlı ve konforluydu. Vagonun içi tertemiz, pencereleri genişti. Pencereden bakıldığında sonsuz Sarıarka bozkırı gözünün önüne seriliyordu. Bozkırda güneş batıp gökyüzü kızıl renge boyandı.

Bizim kompartımandaki yol arkadaşımız – Murat isimli tarih öğretmeniydi. O bize Balkaş Gölü hakkında ve Kazak bozkırının ulu bahadırları üzerine ilginç hikayeler anlattı. Yol boyu biz sıcak çay içip sohbet ettik.

Geceleyin tren ahenkli bir ritimle hızla akıp gitti. Sabah erkenden uyandığımızda pencereden karlı Aladağ dorukları göründü. Kazakistan'ın uçsuz bucaksız topraklarını trenle gezmek unutulmaz hatıralar bahşeder.`,
    vocabulary: [
      { kz: 'Жүрдек пойыз', tr: 'Hızlı tren', note: 'Tulpar hızlı tren ağı' },
      { kz: 'Сарыарқа', tr: 'Sarıarka bozkırı', note: 'Orta Kazakistan\'ın ulu yaylası' },
      { kz: 'Жолсерік', tr: 'Yol arkadaşı / Kondüktör', note: 'Seyahat yoldaşı' }
    ],
    questions: [
      {
        question: 'Tren yolcuları sabah uyandıklarında pencereden neyi görmüşlerdir?',
        options: ['Karlı Aladağ doruklarını', 'Denizi', 'Ormanı', 'Çölü'],
        correctAnswer: 'Karlı Aladağ doruklarını',
        explanation: 'Sabah Almatı\'ya yaklaşıldığında karlı Aladağ dorukları görünmüştür.'
      }
    ]
  },

  // ==========================================
  // LEVEL B1 - ORTA DÜZEY HİKAYELERİ
  // ==========================================
  {
    id: 'story-b1-1',
    level: 'B1',
    levelLabel: 'B1 - Orta',
    titleTr: 'Ulu Bozkırın Atlı Medeniyeti ve Keçe Ev Mimarlık Harikası',
    titleKz: 'Ұлы даланың аттылы өркениеті және киіз үй ғажайыбы',
    subtitle: 'Tulparın kanatları, şanırak mimarisi ve göçebe felsefesi',
    category: 'Tarih & Medeniyet',
    wordCount: 195,
    readingMinutes: 4,
    contentKz: `Қазақ халқының мыңжылдық тарихы мен рухани болмысы Ұлы Даламен және көшпелі өркениетпен тамырлас. Боз далада еркін өскен көшпенділер үшін жылқы – жай ғана түлік емес, адамның қанаты мен сенімді серігі саналған. Қазақ мақалында «Жылқы – ердің қанаты» деп тегін айтылмаған. Бабаларымыз тұлпардың жалында жүріп, ұлан-ғайыр жерді жаудан қорғаған.

Сонымен қатар көшпелілердің табиғатпен үйлесімді сәулет туындысы – киіз үй. Киіз үй тез құрылып, тез жиналатын, жазда салқын, қыста жылы болатын әмбебап баспана. Оның негізгі бөлшектері: кереге (кереге ағаштары), уық (күмбезді ұстайтын шыбықтар) және шаңырақ.

Шаңырақ – киіз үйдің ең жоғарғы дөңгелек бөлігі, күннің, жарықтың және түтіннің шығар есігі. Қазақ түсінігінде шаңырақ – тек үйдің төбесі ғана емес, әулеттің, отбасының және мемлекеттің киелі символы. Бүгінгі Қазақстанның мемлекеттік елтаңбасында да шаңырақ бейнеленген. 

Көшпелілер мәдениеті дүниежүзілік өркениетке шалбарды, үзеңгіні, ер-тоқымды және жылқыны алғаш рет қолға үйрету тәжірибесін сыйлады. Бұл мұра біздің мақтанышымыз.`,
    contentTr: `Kazak halkının bin yıllık tarihi ve manevi varlığı Ulu Bozkır ile ve göçebe medeniyetiyle kök salmıştır. Uçsuz bucaksız bozkırda özgürce yaşayan göçebeler için at, sadece bir binek değil; insanın kanadı ve güvenilir yoldaşı sayılmıştır. Kazak atasözünde «At, yiğidin kanadıdır» diye boşuna söylenmemiştir. Atalarımız soylu küheylanların yelesinde fırtına gibi eserek bu uçsuz bucaksız yurdu düşmandan korumuştur.

Bunun yanı sıra göçebelerin doğayla uyumlu mimari şaheseri – keçe evdir (yurt). Keçe ev çabucak kurulup toplanabilen, yazın serin kışın sıcak tutan çok işlevli bir barınaktır. Temel unsurları: kerege (kafesli ahşap duvarlar), uuk (kubbeyi taşıyan çıtalar) ve şanıraktır.

Şanırak, keçe evin en tepesindeki dairesel çatıdır; güneşin, ışığın girdiği ve dumanın çıktığı kutsal açıklıktır. Kazak anlayışında şanırak, yalnızca bir çatı değil; ailenin, hanedanın ve devletin kutsal sembolüdür. Bugün Kazakistan'ın devlet armasında da şanırak yer alır.

Göçebe medeniyeti dünya uygarlığına pantolonu, üzengiyi, eyeri ve atı ilk kez evcilleştirme tecrübesini hediye etmiştir. Bu miras bizim ortak iftiharımızdır.`,
    vocabulary: [
      { kz: 'Шаңырақ', tr: 'Şanırak / Çadır kubbesi', note: 'Aile ve devlet birliğinin sembolü' },
      { kz: 'Кереге', tr: 'Kerege / Kafes ahşap duvar', note: 'Keçe evin taşıyıcı gövdesi' },
      { kz: 'Уық', tr: 'Uuk / Çatı çıtası', note: 'Kerege ile şanırağı birleştiren kollar' },
      { kz: 'Үзеңгі', tr: 'Üzengi', note: 'Bozkırlıların süvarilik icadı' }
    ],
    questions: [
      {
        question: 'Kazakistan devlet armasında da yer alan ve ailenin kutsal sembolü sayılan mimari öge hangisidir?',
        options: ['Шаңырақ (Şanırak)', 'Кереге', 'Уық', 'Қазық'],
        correctAnswer: 'Шаңырақ (Şanırak)',
        explanation: 'Şanırak hem keçe evin kubbesi hem de bağımsızlık ve aile birliğinin armasıdır.'
      }
    ]
  },
  {
    id: 'story-b1-2',
    level: 'B1',
    levelLabel: 'B1 - Orta',
    titleTr: 'Esik Kurganı ve Altın Adam Gizemi',
    titleKz: 'Есік обасы және Алтын адам құпиясы',
    subtitle: 'Saka savaşçısı, 4000 altın zırh plakası ve bozkır arkeolojisi',
    category: 'Arkeoloji & Tarih',
    wordCount: 185,
    readingMinutes: 4,
    contentKz: `1969 жылы Алматы қаласынан елу шақырым жердегі Есік өзенінің маңында әлемдік сенсация тудырған ұлы археологиялық жаңалық ашылды. Белгілі қазақ археологы Кемал Ақышев бастаған ғалымдар тобы ежелгі сақ қорғанын зерттеу барысында таңғажайып қабір тапты.

Бұл қабірден бұдан екі жарым мың жыл бұрын өмір сүрген жас сақ жауынгерінің сүйегі шықты. Оның киімі төрт мыңнан астам таза алтын әшекеймен безендірілген екен. Ғалымдар оны бүкіл әлемге «Алтын адам» деп танытты.

Алтын жауынгердің басындағы шошақ төбелі дулығасы жетпіс сантиметрге жуық биік болған. Дулығаның үстінде қанатты тұлпарлар, барыстар және тау шыңдары бейнеленген. Бұл бейнелеу өнері тарихта «сақтардың аң стилі» деп аталады. 

Ең құнды жәдігерлердің бірі – жиырма алты таңбалы күміс тостаған. Бұл жазу түркі тектес халықтардың біздің дәуірімізге дейінгі бесінші ғасырдың өзінде-ақ төл жазу мәдениеті болғанын дәлелдейді. «Алтын адам» бүгінде Қазақстанның еркіндігі мен тарихи тереңдігінің рәмізі болып табылады.`,
    contentTr: `1969 yılında Almatı şehrine elli kilometre mesafedeki Esik Irmağı civarında dünya çapında yankı uyandıran büyük bir arkeolojik keşif yapıldı. Tanınmış Kazak arkeoloğu Kemal Akışev liderliğindeki bilim heyeti, kadim Saka kurganını araştırırken hayret verici bir mezar buldu.

Bu mezardan bundan iki bin beş yüz yıl önce yaşamış genç bir Saka savaşçısının kalıntıları çıktı. Savaşçının elbisesi dört binden fazla saf altın süsleme ve plakayla donatılmıştı. Bilim insanları onu tüm dünyaya «Altın Adam» adıyla tanıttı.

Altın savaşçının başındaki sivri miğfer yaklaşık yetmiş santimetre yüksekliğindeydi. Miğferin üzerinde kanatlı atlar (tulpar), pars figürleri ve dağ dorukları tasvir edilmişti. Bu tasvir sanatına tarihte «Sakaların hayvan üslubu» denir.

En kıymetli buluntulardan biri de yirmi altı harfli gümüş tastır. Bu yazıt, Türk soylu halkların milattan önce beşinci yüzyılda dahi kendilerine ait gelişmiş bir yazı kültürüne sahip olduğunu kanıtlamaktadır. «Altın Adam» bugün Kazakistan'ın bağımsızlığının ve tarihi derinliğinin simgesidir.`,
    vocabulary: [
      { kz: 'Оба / Қорған', tr: 'Kurgan / Mezar höyüğü', note: 'Bozkır hükümdarlarının anıt mezarı' },
      { kz: 'Сақтар', tr: 'Sakalar / İskitler', note: 'Kadim Türk-bozkır atlı kavmi' },
      { kz: 'Аң стилі', tr: 'Hayvan üslubu sanatı', note: 'Bozkır maden sanatının alametifarikası' }
    ],
    questions: [
      {
        question: 'Altın Adam zırhında yaklaşık kaç adet altın plaka ve süsleme bulunmuştur?',
        options: ['4.000\'den fazla', '500 adet', '10.000 adet', '100 adet'],
        correctAnswer: '4.000\'den fazla',
        explanation: 'Metinde: «төрт мыңнан астам таза алтын әшекеймен безендірілген» (4000\'den fazla) denmiştir.'
      }
    ]
  },
  {
    id: 'story-b1-3',
    level: 'B1',
    levelLabel: 'B1 - Orta',
    titleTr: 'Hoca Ahmed Yesevî ve Türkistan\'ın Manevi Nuru',
    titleKz: 'Қожа Ахмет Ясауи және Түркістанның рухани нұры',
    subtitle: 'Divan-ı Hikmet öğretileri, Taykazan ve Türk dünyasının manevi başkenti',
    category: 'Tasavvuf & Mimari',
    wordCount: 180,
    readingMinutes: 4,
    contentKz: `Түркістан – күллі түркі жұртының рухани астанасы, тарихтың алтын бесігі. Мұнда он екінші ғасырда өмір сүрген ұлы ғұлама, сопылық поэзияның негізін салушы Қожа Ахмет Ясауи бабамыздың кесенесі асқақтап тұр.

Ясауи бабамыз өз ілімін халыққа қарапайым түркі тілінде, «Диуани Хикмет» (Даналық кітабы) атты өлеңдері арқылы жеткізді. Ол адамдарды адалдыққа, имандылыққа, білімге және бірлікке шақырды. Оның шәкірттері бүкіл Орталық Азия мен Анатолияға тарап, рухани көпір орнатты.

Он төртінші ғасырдың соңында әйгілі Әмір Темір Ясауи бабамыздың қабірінің басына теңдессіз сәулетті алып кесене салдырды. Кесененің көгілдір күмбезі дала төсінде аспанмен астасып жатыр. Кесененің ішінде жеті металдың қосындысынан құйылған алып «Тайқазан» орналасқан. Тайқазан – береке мен бірліктің, қонақжайлықтың киелі белгісі.

Бүгінде Түркістан жаңарып, бой түзеп, Түркі Мемлекеттері Ұйымының мәдени және рухани орталығына айналды. Мұнда келген әрбір адам бабалардың парасатын сезінеді.`,
    contentTr: `Türkistan; cümle Türk aleminin manevi başkenti, tarihin altın beşiğidir. Burada on ikinci yüzyılda yaşamış ulu alim, tasavvuf şiirinin öncüsü Hoca Ahmed Yesevî atamızın türbesi ihtişamla yükselmektedir.

Yesevî atamız öğretisini halka yalın bir Türkçe ile «Divan-ı Hikmet» (Hikmetler Kitabı) isimli manzumeleri vasıtasıyla ulaştırdı. O, insanları dürüstlüğe, imana, ilme ve birliğe davet etti. Onun dervişleri ve talebeleri tüm Orta Asya ve Anadolu'ya yayılarak sarsılmaz manevi bir köprü kurdu.

On dördüncü yüzyılın sonunda meşhur Emir Timur, Yesevî atamızın kabri üzerine eşsiz mimariye sahip devasa bir külliye inşa ettirdi. Türbenin turkuaz kubbesi bozkırın ortasında gökyüzüyle kucaklaşmaktadır. Türbenin içinde yedi madenin karışımından dökülen dev «Taykazan» bulunmaktadır. Taykazan, bereketin ve kardeşliğin sembolüdür.

Bugün Türkistan yenilenip serpilerek Türk Devletleri Teşkilatı'nın manevi ve kültürel merkezine dönüşmüştür. Burayı ziyaret eden her insan ataların hikmetini derinden hisseder.`,
    vocabulary: [
      { kz: 'Диуани Хикмет', tr: 'Divan-ı Hikmet', note: 'Ahmet Yesevi\'nin Türkçe tasavvufi şiirleri' },
      { kz: 'Кесене', tr: 'Türbe / Anıt Mezar', note: 'Timur tarafından yaptırılan ulu külliye' },
      { kz: 'Тайқазан', tr: 'Taykazan / Dev tunç kazan', note: '2 ton ağırlığında 7 madenden dökülmüş kutsal kazan' }
    ],
    questions: [
      {
        question: 'Ahmet Yesevî Külliyesi\'ni 14. yüzyılda kim inşa ettirmiştir?',
        options: ['Emir Timur', 'Cengiz Han', 'Korkut Ata', 'Abay Kunanbayev'],
        correctAnswer: 'Emir Timur',
        explanation: 'Metinde: «Он төртінші ғасырдың соңында әйгілі Әмір Темір алып кесене салдырды» denmiştir.'
      }
    ]
  },
  {
    id: 'story-b1-4',
    level: 'B1',
    levelLabel: 'B1 - Orta',
    titleTr: 'Bozkırın Yiğitlik İmtihanı: Kökpar ve At Oyunları',
    titleKz: 'Дала жігіттерінің сыны: Көкпар және ұлттық ат ойындары',
    subtitle: 'Cesaret, çeviklik, takım ruhu ve binicilik sanatı',
    category: 'Milli Spor & Yiğitlik',
    wordCount: 175,
    readingMinutes: 3,
    contentKz: `Көкпар – қазақтың ең ежелгі, әрі жігерлі ұлттық ат спорты ойындарының бірі. Бұл ойын бозбалаларды ержүректілікке, төзімділікке, ептілікке және серіктестікке тәрбиелейді.

Ойынның шарты бойынша шабандоздар ортаға тасталған салмақты серкенің денесін ат үстінен іліп алып, қарсыластардан қорғай отырып, мәредегі «қазандыққа» салуы қажет. Көкпарда жеңіске жету үшін тек балуандық күш қана емес, сонымен бірге ақыл, тактика және атыңның жүйріктігі мен үйретілуі маңызды.

Көкпар аты ерекше бапталады. Ол шабандоздың кез келген қимылын түсініп, қарсыласты итеріп, тартыста иесіне демеу болады. Шабандоз бен сәйгүліктің арасындағы тылсым байланыс осы ойында анық көрінеді.

Көкпардан бөлек қазақта «Қыз қуу», «Теңге ілу» және «Аударыспақ» сияқты ат ойындары бар. Қыз қуу ойынында жігіт алдында шапқан қызды қуып жетіп, бетінен сүюі керек, ал жете алмаса – қыз жігітті қамшымен шықпыртады. Бұл ойындар бүгінде халықаралық деңгейде өткізіліп, әлем халықтарының қызығушылығын тудыруда.`,
    contentTr: `Kökpar; Kazakların en kadim ve en coşkulu geleneksel atlı spor oyunlarından biridir. Bu oyun delikanlıları yiğitliğe, dayanıklılığa, çevikliğe ve takım ruhuna eğitir.

Oyunun kuralına göre biniciler ortaya atılan ağır keçi gövdesini at sırtından kapıp, rakiplerinden koruyarak varış noktasındaki «kazanlık» kuyusuna bırakmak zorundadır. Kökparda galip gelmek için sadece pazı gücü değil; aynı zamanda akıl, taktik ve atın çevikliği şarttır.

Kökpar atı özel olarak eğitilir. Binicisinin her hareketini anlayıp rakip atları omuzlayarak sahibine cansiperane destek olur. Binici ile asil küheylan arasındaki görünmez bağ bu oyunda berraklaşır.

Kökparın haricinde Kazaklarda «Kız Kuu» (Kız Kovalama), «Tenge İlü» (Yerden Tenge Kapma) ve «Audarıspak» (At Üstünde Güreş) gibi binicilik oyunları vardır. Kız Kuu oyununda yiğit önünde koşan kıza yetişip yanağından öpmelidir; yetişemezse kız delikanlıyı kamçıyla kovalar. Bu oyunlar günümüzde dünya çapında ilgi görmektedir.`,
    vocabulary: [
      { kz: 'Көкпар', tr: 'Kökpar / Gökbörü', note: 'Geleneksel atlı mücadele sporu' },
      { kz: 'Шабандоз', tr: 'Usta binici / Jokey', note: 'At üstündeki hünerli binici' },
      { kz: 'Қыз қуу', tr: 'Kız Kovalama oyunu', note: 'Neşeli geleneksel binicilik yarışması' }
    ],
    questions: [
      {
        question: 'Kız Kuu (Қыз қуу) oyununda yiğit kıza yetişemezse ne olur?',
        options: [
          'Kız yiğidi kamçı ile kovalar',
          'Yarış iptal edilir',
          'Yiğide ceza puanı verilir',
          'Kız oyunu kaybeder'
        ],
        correctAnswer: 'Kız yiğidi kamçı ile kovalar',
        explanation: 'Kazak geleneğinde yetişemeyen yiğit dönüş yolunda kız tarafından kamçıyla kovalanır.'
      }
    ]
  },

  // ==========================================
  // LEVEL B2 - İLERİ ORTA DÜZEY HİKAYELERİ
  // ==========================================
  {
    id: 'story-b2-1',
    level: 'B2',
    levelLabel: 'B2 - İleri Orta',
    titleTr: 'Abay Kunanbayev: 17. Kara Söz (Akıl, İrade ve Yürek Münazarası)',
    titleKz: 'Абай Құнанбайұлының он жетінші қара сөзі',
    subtitle: '«Толық адам» (Kâmil İnsan) felsefesi ve İlimin hakemliği',
    category: 'Felsefe & Ahlak',
    wordCount: 220,
    readingMinutes: 5,
    contentKz: `Қайрат, Ақыл, Жүрек үшеуі өнерлерін салыстырып, таласып, ақыры Ғылымға төрелік сұрап келіпті.

Қайрат айтыпты: «Ей, Ғылым, менсіз ешбір іс баянды болмайды. Мен болмасам, ғылымды да меңгере алмайды, байлықты да құра алмайды. Қиындықты жеңетін – мен».

Ақыл айтыпты: «Менсіз не жақсы, не жаман екенін адам біле алмайды. Дүние мен ақиреттің пайдасын ажырататын – мен. Менсіз бұлар қараңғыда қалады».

Жүрек айтыпты: «Мен – адамның патшасымын. Қан мен жанымды бүкіл денеге жүгіртемін. Менсіз мейірім де, рақым да, достық та жоқ. Мен болмасам, адам айуанға айналады».

Сонда Ғылым үшеуін тыңдап болып, былай деп төрелік айтыпты:
«Ей, Қайрат, айтқаныңның бәрі рас, бірақ сенің қаталдығың бар. Қайратқа Ақыл жетекшілік етпесе, ол зұлымдыққа да қызмет етеді. 
Ей, Ақыл, сен айла мен амалдың да жолын табасың. Жақсыға да, жаманға да сүйене бересің. 
Сондықтан үшеуіңнің де басыңды қосатын – Жүрек. Жүрек – әділеттің, махаббат пен ынсаптың ордасы. 

Қайрат пен Ақыл, сендер Жүрекке бағыныңдар! Үшеуің бір кісінің бойынан жарасымды табылсаңдар, сонда ғана ол адам «толық адам» болады. Біреуің жетіспесеңдер, адамның жартысы кем болады».

Абайдың бұл сөзі – бүкіл адамзатты парасаттылық пен гуманизмге үндейтін мәңгілік шамшырақ.`,
    contentTr: `İrade (Kayrat), Akıl ve Yürek hünerlerini karşılaştırıp münakaşa ederek nihayetinde İlim'in huzuruna hakemlik istemeye gelmişler.

İrade demiş ki: «Ey İlim, bensiz hiçbir iş sonuca ulaşmaz. Ben olmazsam ilim de öğrenilemez, servet de kazanılamaz. Zorlukları dize getiren benim».

Akıl demiş ki: «Bensiz neyin iyi, neyin kötü olduğunu insanoğlu bilemez. Dünyanın ve ahiretin faydasını ayırt eden benim. Bensiz bunlar karanlıkta kaybolur».

Yürek demiş ki: «Ben insanın sultanıyım. Kanı ve canı bütün bedene dolaştırırım. Bensiz merhamet de, şefkat de, dostluk da olmaz. Ben olmazsam insan hayvana dönüşür».

O vakit İlim üçünü de dinledikten sonra şöyle hüküm bildirmiş:
«Ey İrade, söylediklerinin hepsi doğru; lâkin senin sertliğin ve taşkınlığın vardır. İradeye Akıl kılavuzluk etmezse o zulme de alet olur.
Ey Akıl, sen hilenin ve kurnazlığın da yolunu bulursun. İyiliğe de kötülüğe de meyledersin.
Bu sebeple üçünüzü adaletle birleştirecek olan Yürek'tir. Yürek; vicdanın, sevginin ve adaletin dergâhıdır.

İrade ve Akıl, siz ikiniz Yürek'in buyruğuna uyunuz! Üçünüz tek bir kimsede ahenk ve kemal ile birleşirseniz, işte o zaman o kişi «kâmil insan» (tolık adam) mertebesine erişir. Biriniz eksik olursa insan yarım kalır».

Abay'ın bu sözü, bütün insanlığı erdem ve vicdan medeniyetine çağıran ölümsüz bir meşaledir.`,
    vocabulary: [
      { kz: 'Қайрат', tr: 'İrade / Gayret / Kararlılık', note: 'Eyleme geçme kudreti' },
      { kz: 'Толық адам', tr: 'Kâmil insan', note: 'Abay felsefesinin en yüce ahlaki hedefi' },
      { kz: 'Ынсап', tr: 'İnsaf / Vicdan', note: 'Yürekten beslenen ahlak ölçüsü' }
    ],
    questions: [
      {
        question: 'Abay\'ın 17. Kara Sözü\'nde İlim (Ғылым) kime sultanlık vermiş ve diğerlerinin ona uymasını emretmiştir?',
        options: ['Жүрек (Yürek / Vicdan)', 'Қайрат (İrade)', 'Ақыл (Akıl)', 'Байлық (Servet)'],
        correctAnswer: 'Жүрек (Yürek / Vicdan)',
        explanation: 'İlim, vicdan ve şefkatin kaynağı olan Yürek\'i hakem tayin etmiştir.'
      }
    ]
  },
  {
    id: 'story-b2-2',
    level: 'B2',
    levelLabel: 'B2 - İleri Orta',
    titleTr: 'Muhtar Avezov: Abay Yolu Romanından Bir Kesit',
    titleKz: 'Мұхтар Әуезовтің «Абай жолы» эпопеясынан үзінді',
    subtitle: 'Genç Abay\'ın medreseden dönüşü ve Kunanbay meclisindeki sınav',
    category: 'Klasik Edebiyat',
    wordCount: 210,
    readingMinutes: 5,
    contentKz: `Семей қаласындағы Ахмет Риза медресесінде үш жыл білім алған жас Абай биыл туған ауылына оралды. Он үш жасар бозбаланың көзінде білімге деген құштарлық пен далаға деген сағыныш қатар ұялаған еді.

Абайды ауыл шетінен анасы Ұлжан мен әжесі Зере қарсы алды. Әжесі Абайды құшағына қысып, көз жасын көлдетті: «Құнанбайдың жаманы емес, менің телқоңырым келді!» деп маңдайынан сүйді. Зере әже – Абайдың жүрегіне халық ертегілері мен дастандарын егіп, оны ақындық жолға жетелеген асыл жан еді.

Келесі күні Абай әкесі Құнанбай мырзаның алдына барды. Құнанбай – бүкіл Тобықты руының қатал да беделді аға сұлтаны. Ол баласына сұсты көзбен қарап: «Оқығаныңды көрейін, халықтың дауына аралас. Әділ би бола аласың ба, жоқ па – ел сынайды» деді.

Абай әкесінің қатал үкімдерін көрген сайын қарапайым халықтың мұң-мұқтажына жаны ашитын. Оның жүрегі билікке емес, әділдік пен өлең сөзге бұрылды. Әлемге әйгілі бұл шығарма қазақ халқының тұтас ғасырлық тарихын суреттейді.`,
    contentTr: `Semey şehrindeki Ahmet Rıza Medresesi'nde üç yıl tahsil gören genç Abay, bu yıl doğduğu köyüne döndü. On üç yaşındaki delikanlının gözlerinde ilme duyulan aşk ile bozkıra duyulan hasret yan yana parıldıyordu.

Abay'ı köyün girişinde annesi Uljan ile ninesi Zere karşıladı. Ninesi Abay'ı bağrına basıp gözyaşlarına boğuldu: «Kunanbay'ın katı evladı değil, benim can ciğer kuzum geldi!» diyerek alnından öptü. Zere Nine; Abay'ın yüreğine halk masallarını, efsanelerini ve destanlarını ekip onu şairlik yoluna sevk eden asil ruhlu bir kadındı.

Ertesi gün Abay, babası Kunanbay Mirza'nın huzuruna çıktı. Kunanbay; bütün Tobıktı boyunun sert ve otoriter ağa sultanıydı. O oğluna keskin bakışlarla bakıp: «Okuduğunu göreyim, halkın davalarına katıl. Adil bir yargıç (biy) olabilecek misin olamayacak mısın, bunu halk imtihan edecek» dedi.

Abay babasının katı hükümlerine şahit oldukça garip halkın dert ve acılarına içi sızlardı. Onun yüreği iktidar hırsına değil, adalete ve şiir sanatına meyletti. Dünyaca ünlü bu şaheser, Kazak halkının bir asırlık hayatını eşsiz bir dille resmeder.`,
    vocabulary: [
      { kz: 'Аға сұлтан', tr: 'Ağa Sultan', note: '19. yüzyıl Kazak bozkır yöneticisi' },
      { kz: 'Телқоңыр', tr: 'Can ciğer / Sevgili yavru', note: 'Ninesinin Abay\'a sevgi dolu hitabı' },
      { kz: 'Би', tr: 'Biy / Geleneksel Kazak halk hakimi', note: 'Töre hukuku uygulayıcısı' }
    ],
    questions: [
      {
        question: 'Abay\'ın yüreğine halk masallarını ve şairlik ruhunu aşılayan kimdir?',
        options: ['Зере әжесі (Ninesi Zere)', 'Babası Kunanbay', 'Medrese hocası', 'Arkadaşı Erbol'],
        correctAnswer: 'Зере әжесі (Ninesi Zere)',
        explanation: 'Romanda Abay\'ın ruh dünyasını ninesi Zere ile annesi Uljan beslemiştir.'
      }
    ]
  },
  {
    id: 'story-b2-3',
    level: 'B2',
    levelLabel: 'B2 - İleri Orta',
    titleTr: 'Beybit Maylin ve Muhtar Avezov: Bozkır Kurdu Kökserik',
    titleKz: '«Көксерек» хикаяты: Адам мен табиғат тартысы',
    subtitle: 'Bozkırda insan ile kurt yavrusunun dramatik karşılaşması',
    category: 'Doğa & Psikoloji',
    wordCount: 195,
    readingMinutes: 4,
    contentKz: `Мұхтар Әуезовтің классикалық «Көксерек» шығармасы – адам мен жабайы табиғаттың, қасқыр мен қоғамның арасындағы қасіретті қақтығысты шебер баяндайтын жауһар туынды.

Құрмаш есімді ауыл баласы қырдан анасы өлген кішкентай көкжал бөлтірікті тауып алып, оған «Көксерек» деп ат қояды. Құрмаш оны өз қолымен асырап, сүт беріп, ит сияқты қолға үйретпек болады. Бірақ қасқырдың табиғаты өзгеше еді. Қазақ мақалы: «Қасқырды қанша асырасаң да, тоғайға қарап ұлиды» дейді.

Көксерек өскен сайын оның көзінде түз жыртқышының қатал ұшқыны оянады. Ауылдың иттері оны шеттетіп, қабылдамайды. Ақыры бір күні Көксерек шынжырын үзіп, өзінің туған мекені – аязды боранды түзге қашып кетеді.

Жылдар өтеді. Көксерек айналасына қорқыныш ұялатқан аса қатерлі ақсақ көкжалға айналады. Бұл хикаят жабайы табиғаттың заңын адамның күштеп өзгерте алмайтынын, еркіндіктің құдіретін терең сездіреді.`,
    contentTr: `Muhtar Avezov'un klasik eseri «Kökserik» (Bozkır Kurdu); insan ile vahşi doğanın, kurt ile toplumun arasındaki trajik hesaplaşmayı ustalıkla anlatan bir şaheserdir.

Kurmaş isimli köy çocuğu, kırlardan annesi ölmüş küçük bir bozkır kurt yavrusu bulup ona «Kökserik» adını verir. Kurmaş onu kendi elleriyle besleyip süt vererek köpek gibi ehlileştirmek ister. Lakin kurdun tabiatı bambaşkadır. Kazak atasözü şöyle der: «Kurdu ne kadar beslesen de gözü ormandadır (dağlara ulur)».

Kökserik büyüdükçe gözlerinde vahşi doğa yırtıcısının keskin kıvılcımları parıldar. Köyün köpekleri onu dışlayıp aralarına kabul etmez. Nihayet bir gün Kökserik zincirini koparıp doğduğu asıl vatanına – ayazlı, fırtınalı bozkıra kaçar.

Yıllar geçer. Kökserik etrafa dehşet saçan tehlikeli bir kurt liderine dönüşür. Bu hikaye, vahşi doğanın kanunlarını insanın zorla değiştiremeyeceğini ve özgürlüğün kudretini derinden hissettirir.`,
    vocabulary: [
      { kz: 'Бөлтірік', tr: 'Kurt yavrusu', note: 'Kurt eniği' },
      { kz: 'Көкжал', tr: 'Bozkır kurdu / Lider kurt', note: 'Yeleli kurt' },
      { kz: 'Түз / Дала', tr: 'Yaban / Bozkır', note: 'Vahşi tabiat' }
    ],
    questions: [
      {
        question: 'Kökserik hikayesinin temel felsefi mesajı nedir?',
        options: [
          'Vahşi doğanın kanunu zorla değiştirilemez, kurdun aslı özgürlüktür',
          'Köpekler kurtlardan daha güçlüdür',
          'Köyde yaşamak zordur',
          'Kış mevsimi tehlikelidir'
        ],
        correctAnswer: 'Vahşi doğanın kanunu zorla değiştirilemez, kurdun aslı özgürlüktür',
        explanation: 'Eser, doğanın bağımsızlığı ve ehlileştirilemez karakterini vurgular.'
      }
    ]
  },
  {
    id: 'story-b2-4',
    level: 'B2',
    levelLabel: 'B2 - İleri Orta',
    titleTr: 'Çokan Valihanov: Kaşgar Seyahati ve Manas Keşfi',
    titleKz: 'Шоқан Уәлихановтың Қашқар сапары және «Манас» жыры',
    subtitle: 'İlk Kazak aydını, İpek Yolu kaşifi ve Türk destanları',
    category: 'Tarih & Keşif',
    wordCount: 205,
    readingMinutes: 4,
    contentKz: `Шоқан Шыңғысұлы Уәлиханов – қазақтың тұңғыш кәсіби ғалымы, ағартушысы, тарихшысы және саяхатшысы. Абылай ханның ұрпағы саналатын Шоқан небәрі отыз жыл ғұмыр кешсе де, артына өлмес ғылыми мұра қалдырды.

Оның ең атақты ерлігі – 1858-1859 жылдардағы Қашқар сапары. Ол кезде Шығыс Түркістан Еуропа зерттеушілері үшін жабық әрі аса қатерлі аймақ болатын. Шетелдіктерді көрсе бірден өлім жазасына кесетін. Шоқан Әлімбай деген көпес саудагердің кейпіне еніп, сауда керуенімен Тянь-Шань тауларының биік асуларын басып өтіп, Қашқарға жетеді.

Мұнда ол бес ай бойы өмір сүріп, өлкенің тарихын, географиясын, саяси құрылымын жан-жақты зерттеп, жасырын түрде қағазға түсіреді. Оның бұл еңбегі әлемдік география ғылымында сенсация тудырды.

Бұған қоса Шоқан – қырғыз халқының мыңдаған жылдық энциклопедиясы саналатын алып «Манас» эпосын алғаш рет қағазға түсіріп, ғылыми айналымға қосқан тұлға. Ол «Манасты» көшпелілердің «Илиадасы» деп жоғары бағалады. Шоқан – Шығыс пен Батыс өркениетін тең меңгерген біртуар тұлға.`,
    contentTr: `Çokan Çıngısoğlu Valihanov; Kazakların ilk profesyonel bilgini, aydınlanmacısı, tarihçisi ve kâşifidir. Ablay Han'ın torunu olan Çokan, yalnızca otuz yıllık bir ömür sürse de ardında ölümsüz bir ilmi miras bıraktı.

Onun en meşhur kahramanlığı – 1858-1859 yıllarındaki Kaşgar seyahatidir. O dönemde Doğu Türkistan, Avrupalı araştırmacılar için kapalı ve ölümcül tehlikelerle dolu bir bölgeydi. Yabancıları gördükleri anda idam ederlerdi. Çokan, Alimbay isimli tüccar kılığına bürünüp kervanla Tanrı Dağları'nın yalçın geçitlerini aşarak Kaşgar'a ulaştı.

Burada beş ay boyunca yaşayıp yörenin tarihini, coğrafyasını ve siyasi yapısını gizlice kağıda döktü. Bu eseri dünya coğrafya çevrelerinde büyük yankı uyandırdı.

Bunun yanı sıra Çokan, Kırgız halkının devasa sözlü hafızası olan «Manas Destanı»nı tarihte ilk kez yazıya geçirip bilim dünyasına tanıtan kişidir. O Manas'ı «Bozkırın İlyada'sı» olarak tanımlamıştır. Çokan, Doğu ve Batı medeniyetini meczetmiş emsalsiz bir dâhidir.`,
    vocabulary: [
      { kz: 'Ағартушы', tr: 'Aydınlanmacı / Maarifçi', note: 'Halkı eğiten fikir önderi' },
      { kz: 'Керуен', tr: 'Kervan', note: 'İpek Yolu ticaret kafilesi' },
      { kz: '«Манас» эпосы', tr: 'Manas Destanı', note: 'Dünyanın en uzun manzum destanı' }
    ],
    questions: [
      {
        question: 'Çokan Valihanov Kaşgar\'a hangi kılıkta ve nasıl gitmiştir?',
        options: ['Tüccar Alimbay kılığında bir kervanla', 'Elçi olarak', 'Askeri komutan olarak', 'Gezgin derviş olarak'],
        correctAnswer: 'Tüccar Alimbay kılığında bir kervanla',
        explanation: 'Çokan, hayatını tehlikeye atarak tüccar kılığına girip Kaşgar\'a girmiştir.'
      }
    ]
  },

  // ==========================================
  // LEVEL C1 - YETKİN & AKADEMİK HİKAYELER
  // ==========================================
  {
    id: 'story-c1-1',
    level: 'C1',
    levelLabel: 'C1 - Yetkin Düzey',
    titleTr: 'Mağjan Jumabayev: Türkistan Destanı ve Turan Ruhu',
    titleKz: 'Мағжан Жұмабаевтың «Түркістан» дастаны және Тұран рухы',
    subtitle: 'Alaşı Orda edebiyatı, ortak Türk tarihi ve felsefi tahlili',
    category: 'Destan & Pan-Türkizm',
    wordCount: 220,
    readingMinutes: 5,
    contentKz: `Түркістан – екі дүние есігі ғой,
Түркістан – ер түріктің бесігі ғой.
Тамаша Түркістандай жерде туған,
Түріктің Тәңір берген несібі ғой.

Алаш қозғалысының жалынды шайыры Мағжан Жұмабаевтың бұл өлеңі – күллі түркі дүниесінің рухани манифесі саналады. Жиырмасыншы ғасырдың басында, аласапыран заманда жазылған бұл дастан ұлттың тарихи жадын оятып, өткен мен болашақтың арасына алтын көпір салды.

Мағжан Түркістан топырағын ежелгі Тұран даласының жүрегі деп қастерлейді. Оның жырларында Сақ, Ғұн, Көк Түрік және Алтын Орда мемлекеттерінің қаһармандық даңқы қайта жаңғырады. Ақын Оғыз қағаннан бастап Абылай мен Кенесарыға дейінгі батырлардың намысын ту етеді.

«Тұранда ер түрігім туып-өскен,
Тұранның тағдыры бар тар кезеңді...» 
деп тебіренген ақын түркі халықтарын бодандық ұйқысынан оянып, бірлік пен ғылымға ұмтылуға үндейді. Мағжан поэзиясының тілі – аса бай, көркемдік қуаты жоғары, образдылық пен сыршылдықтың шыңы. Ол қазақ тілінің сөздік қорын түркітанудың ең биік шыңына көтерді. Бүгінде Түркістан қаласы қайта түлеп, осы дастандағы армандар шындыққа айналуда.`,
    contentTr: `Türkistan – iki cihanın kapısıdır,
Türkistan – yiğit Türk'ün beşiğidir.
Muhteşem Türkistan gibi bir yerde doğmak,
Türk'e Tanrı'nın bahşettiği büyük nasiptir.

Alaş Orda hareketinin alevli şairi Mağjan Jumabayev'in bu şiiri, cümle Türk dünyasının manevi manifestosu kabul edilir. Yirminci yüzyılın başında yazılan bu destan, milletin tarihi hafızasını diriltip geçmiş ile gelecek arasına sarsılmaz bir köprü kurmuştur.

Mağjan, Türkistan toprağını kadim Turan yurdunun kalbi olarak selamlar. Onun mısralarında Saka, Hun, Göktürk ve Altın Orda devletlerinin bahadırlık şanı yeniden şahlanır. Şair, Oğuz Kağan'dan Ablay ve Kenesarı'ya uzanan kahramanlar zincirini şerefle anar.

«Turan'da yiğit Türk'üm doğup büyüdü,
Turan'ın çetin dönemeçli kaderi vardır...»
diyerek coşan şair; Türk soylu halkları esaret uykusundan uyanıp ilme ve birliğe sarılmaya davet eder. Mağjan'ın Türkçesi fevkalade zengin, lirizmin ve estetizmin doruğundadır. O, Kazak Türkçesini Türkolojinin en yüksek edebi makamına ulaştırmıştır.`,
    vocabulary: [
      { kz: 'Тұран', tr: 'Turan', note: 'Tarihi Türk-Orta Asya coğrafyası' },
      { kz: 'Алаш қозғалысы', tr: 'Alaş Orda Hareketi', note: '20. yy başı Kazak bağımsızlık hareketi' },
      { kz: 'Несіп', tr: 'Nasip / Kısmet / İhsan', note: 'Tanrı\'nın lütfu' }
    ],
    questions: [
      {
        question: 'Mağjan Jumabayev «Türkistan» şiirinde Türkistan\'ı neyin beşiği olarak tanımlamıştır?',
        options: ['Ер түріктің бесігі (Yiğit Türk\'ün beşiği)', 'Şairlerin beşiği', 'Kervanların beşiği', 'Dağların beşiği'],
        correctAnswer: 'Ер түріктің бесігі (Yiğit Türk\'ün beşiği)',
        explanation: 'Şiirin en ünlü mısrası: «Түркістан – ер түріктің бесігі ғой» şeklindedir.'
      }
    ]
  },
  {
    id: 'story-c1-2',
    level: 'C1',
    levelLabel: 'C1 - Yetkin Düzey',
    titleTr: 'Orhun Yazıtları ve Tonyukuk: Taşlara Kazınan Türkoloji',
    titleKz: 'Күлтегін мен Тоныкөк бітіктастары: Мәңгілік ел мұраты',
    subtitle: 'Kültegin, Bilge Kağan, runik alfabe ve Kazak Türkçesiyle morfolojik bağlar',
    category: 'Akademik Türkoloji & Epigrafi',
    wordCount: 230,
    readingMinutes: 5,
    contentKz: `Сегізінші ғасырдың басында Моңғолиядағы Орхон өзенінің бойында қашалған Күлтегін, Білге қаған және Тоныкөк бітіктастары – бүкіл түркі жұртының алғашқы жазба әдеби ескерткіштері болып табылады. Бұл мәңгілік тастарға ойылған руна жазулары ежелгі Көк Түрік қағанатының саяси, философиялық және әскери ұстанымдарын паш етеді.

Жазулардағы басты идеология – «Мәңгілік Ел» идеясы. Тоныкөк пен Білге қаған өз халқына: «Түрік елі, жеріңнен, суыңнан айырылмасаң, түндігің шайқалмайды, тәуелсіздігің мәңгі болады» деп өсиет қалдырды.

Лингвистикалық тұрғыдан алғанда, Орхон жазбалары мен қазіргі қазақ тілінің арасында тікелей табиғи сабақтастық бар. Ежелгі бітіктастардағы септік жалғаулары, тәуелдік жүйесі, етістік шақтары мен көптеген лексикалық қор қазақ тілінде түпнұсқалық қалпын сақтаған. Мысалы: «көк тәңірі» (көк аспан), «қаған» (хан), «бөрі» (қасқыр), «ел» (мемлекет), «жұрт» (халық) сөздері тікелей қолданыста.

Сонымен қатар үндестік заңы мен сөзжасам құрылымы көне түркі тілінде қалай қалыптасса, қазақ тілінде де дәл солай сақталған. 1893 жылы дат ғалымы Вильгельм Томсен бітіктастың сырын ашып, ең алғаш «Тәңірі» және «Түрік» сөздерін оқығанда, дүниежүзілік түркітану ғылымы жаңа дәуірге қадам басты. Бұл жазбалар біздің терең тамырымыздың мәңгілік куәсі.`,
    contentTr: `Sekizinci yüzyılın başında Moğolistan'daki Orhun ırmağı boyunda dikilen Kültegin, Bilge Kağan ve Tonyukuk yazıtları; bütün Türk halklarının ilk yazılı edebi anıtlarıdır. Bu bengü taşlara kazınan runik yazılar, kadim Göktürk Kağanlığı'nın siyasi, felsefi ve askeri nizamını haykırır.

Yazıtlardaki baş gaye – «Bengü İl» (Mengi El / Sonsuz Devlet) ülküsüdür. Tonyukuk ve Bilge Kağan milletine: «Türk milleti, yurdundan, törenden ayrılmazsan varlığın sarsılmaz, bağımsızlığın ebedi kalır» diye vasiyet etmiştir.

Dil bilimsel açıdan bakıldığında Orhun yazıtları ile günümüz Kazak Türkçesi arasında doğrudan organik bir süreklilik mevcuttur. Eski yazıtlardaki hâl ekleri, iyelik sistemi, fiil kipleri ve zengin kelime hazinesi Kazakçada en saf haliyle yaşamaktadır. Örneğin: «kök tengri», «kağan», «börü», «il/el», «yurt» kelimeleri doğrudan kullanılmaktadır.

Dahası, ünlü uyumu kanunu ve eklemeli türetim kuralları eski Türkçede nasılsa Kazakçada da aynen korunmuştur. 1893 yılında Danimarkalı dil bilimci Vilhelm Thomsen yazıtların şifresini çözüp ilk olarak «Tengri» ve «Türk» kelimelerini okuduğunda Türkoloji bilimi yeni bir çağa adım attı. Bu yazıtlar bizim köklerimizin ebedi tapu senetleridir.`,
    vocabulary: [
      { kz: 'Бітіктас', tr: 'Bengü taş / Yazıt', note: 'Orhun anıt kitabeleri' },
      { kz: 'Мәңгілік Ел', tr: 'Bengü İl / Ebedi Devlet', note: 'Göktürk devlet felsefesi' },
      { kz: 'Руна жазуы', tr: 'Runik alfabe', note: 'Orhun Göktürk yazı sistemi' }
    ],
    questions: [
      {
        question: 'Orhun Yazıtları\'nın şifresini 1893\'te çözen ve ilk «Tengri» ile «Türk» kelimelerini okuyan bilgin kimdir?',
        options: ['Vilhelm Thomsen', 'Radloff', 'Barthold', 'Kemal Akışev'],
        correctAnswer: 'Vilhelm Thomsen',
        explanation: 'Danimarkalı dil bilimci Vilhelm Thomsen Orhun yazıtlarını çözen ilk Türkologdur.'
      }
    ]
  },
  {
    id: 'story-c1-3',
    level: 'C1',
    levelLabel: 'C1 - Yetkin Düzey',
    titleTr: 'İlyas Esenberlin: Göçebeler ve Han Kene Destanı',
    titleKz: 'Ілияс Есенберлиннің «Көшпенділер» трилогиясы және Хан Кене',
    subtitle: 'Kazak Hanlığı\'nın kuruluşu, bağımsızlık savaşı ve diplomatik strateji',
    category: 'Tarihi Roman & Bağımsızlık',
    wordCount: 215,
    readingMinutes: 5,
    contentKz: `Ілияс Есенберлиннің «Көшпенділер» трилогиясы – қазақ халқының бес ғасырлық ұлт-азаттық күресі мен мемлекеттілік тарихын көркем тілмен сомдаған ұлы эпопея. Трилогия «Алмас қылыш», «Жанталас» және «Қаһар» атты үш кітаптан тұрады.

Шығарманың алғашқы бөлімінде он бесінші ғасырда Керей мен Жәнібек хандардың Шу бойында дербес Қазақ Хандығының туын тіккені баяндалады. Бұл оқиға – бытыраңқы көшпелі рулардың біртұтас ұлт ретінде бірігуінің ұлы бастамасы еді. Одан кейін Қасым ханның, Хақназар мен Тәуке ханның «Жеті жарғы» заңдар жинағы арқылы мемлекетті нығайтуы суреттеледі.

Трилогияның ең қасіретті әрі қаһармандық бөлімі – «Қаһар» романы. Мұнда қазақтың соңғы ханы – Кенесары Қасымұлының он жылға созылған ұлт-азаттық көтерілісі сөз болады. Кенесары хан дала еркіндігін сақтап қалу үшін империялық отарлау саясатына қарсы қарулы күрес жүргізді.

Есенберлин бұл шығарманы кеңестік цензураның қатал кезеңінде жазып, қазақ халқының тарихи санасын оятты. «Көшпенділер» – мемлекеттіліктің қадірін, бірліктің бағасын ұқтыратын ұлттық құндылық.`,
    contentTr: `İlyas Esenberlin'in «Göçebeler» üçlemesi; Kazak halkının beş asırlık bağımsızlık mücadelesini ve devletleşme sürecini anlatan anıtsal bir tarihi romandır. Üçleme «Elmas Kılıç», «Can Pazarı» ve «Kahır» adlı üç ciltten oluşur.

Eserin ilk cildinde on beşinci yüzyılda Kerey ve Janibek hanların Şu boyunda bağımsız Kazak Hanlığı'nın sancağını dikmesi hikaye edilir. Bu hadise, dağınık boyların tek bir millet halinde birleşmesinin dönüm noktasıdır. Ardından Kasım Han, Haknazar ve Tavke Han'ın «Yedi Yargı» kanunnamesiyle devleti kurumsallaştırması resmedilir.

Üçlemenin en dramatik ve epik kısmı – «Kahır» romanıdır. Burada Kazakların son hanı Kenesarı Kasımuly'nın on yıl süren bağımsızlık savaşı anlatılır. Kenesarı Han bozkırın hürriyetini müdafaa etmek uğruna sömürgeci yayılmaya karşı destansı bir direniş sergilemiştir.

Esenberlin bu eseri Sovyet sansürünün en katı olduğu dönemde kaleme alarak Kazak halkının milli şuurunu uyandırmıştır. «Göçebeler», devletin ve milli birliğin kıymetini haykıran ulu bir kaynaktır.`,
    vocabulary: [
      { kz: 'Ұлт-азаттық күрес', tr: 'Milli kurtuluş mücadelesi', note: 'Bağımsızlık savaşı' },
      { kz: 'Жеті жарғы', tr: 'Yedi Yargı (Yedi Töre)', note: 'Tavke Han\'ın anayasa niteliğindeki töresi' },
      { kz: 'Хандық', tr: 'Hanlık / Devlet', note: '1465\'te kurulan Kazak Hanlığı' }
    ],
    questions: [
      {
        question: 'İlyas Esenberlin\'in «Göçebeler» üçlemesinde anlatılan Kazak Hanlığı\'nın kurucuları kimlerdir?',
        options: ['Керей мен Жәнібек хандар', 'Abilhayır Han', 'Cengiz Han', 'Korkut Ata'],
        correctAnswer: 'Керей мен Жәнібек хандар',
        explanation: '1465 yılında Kazak Hanlığı Kerey ve Janibek Han tarafından kurulmuştur.'
      }
    ]
  },
  {
    id: 'story-c1-4',
    level: 'C1',
    levelLabel: 'C1 - Yetkin Düzey',
    titleTr: 'Kazak Söz Varlığında Atasözleri ve Felsefi Dünya Görüşü',
    titleKz: 'Қазақ мақал-мәтелдеріндегі халық даналығы мен дүниетанымы',
    subtitle: 'Türkolojik açıdan atasözlerinin etimolojik ve ahlaki tahlili',
    category: 'Etnolinguistik & Felsefe',
    wordCount: 225,
    readingMinutes: 5,
    contentKz: `Қазақ тілі – сөз өнерін бағалаған, «Өнер алды – қызыл тіл» деп шешендікке табынған дана халықтың тілі. Қазақ мақал-мәтелдері – ғасырлар бойы жинақталған халықтық этиканың, заң мен философияның ықшам да терең көрінісі.

Бұл мақалдарда көшпелілердің мемлекетке, отанға, ерлікке және адамгершілікке деген көзқарасы тайға таңба басқандай көрінеді. Мәселен: «Отансыз адам – ормансыз бұлбұл» деген сөз отансүйгіштіктің ең көркем бейнесі. Ал «Ел үмітін ер ақтар, ер атағын ел сақтар» нақылы – тұлға мен қоғамның арасындағы өзара жауапкершілік заңы.

Сонымен бірге туыстық қатынастар мен татулық туралы: «Алтау ала болса – ауыздағы кетеді, төртеу түгел болса – төбедегі келеді» дейді. Бұл – бірлігі жоқ елдің күйрейтінін, бірлігі мықты жұрттың алынбас қамал болатынын ескертетін саяси даналық.

Түркітану ғылымында бұл мақалдардың көпшілігі Махмұд Қашқаридің «Диуану лұғат-ит-түрк» сөздігіндегі көне түркі мақалдарымен бірдей ұйқасып келеді. Бұл – тілдік және тарихи бірлігіміздің бұлтартпас дәлелі. Сөз қадірін түсінген адам – ұлттың жанын түсінеді.`,
    contentTr: `Kazak dili; söz sanatını yücelten, «Sanatın başı tatlı dildir» diyerek belagate hürmet eden bilge bir milletin dilidir. Kazak atasözleri; asırlar boyu süzülüp gelen halk ahlakının, töre hukukunun ve hayat felsefesinin en özlü ve derin aynasıdır.

Bu atasözlerinde göçebelerin devlete, vatana, yiğitliğe ve insanlığa bakışı mühür gibi kazınmıştır. Mesela: «Vatansız insan – ormansız bülbüldür» sözü vatanseverliğin en lirik ifadesidir. «Halkın umudunu yiğit boşa çıkarmaz; yiğidin şanını da halk yaşatır» hikmeti ise fert ile millet arasındaki karşılıklı vefa kanunudur.

Bunun yanı sıra birlik ve dirlik hususunda: «Altı kişi anlaşmazsa ağızdaki lokma gider, dört kişi el ele verirse gökteki nimet gelir» denir. Bu; tefrikanın devleti yıkacağını, birliğin ise aşılmaz bir kale inşa edeceğini öğütleyen siyasi bir dehadır.

Türkoloji ilminde bu atasözlerinin pek çoğu, Kaşgarlı Mahmud'un 11. yüzyılda kaleme aldığı «Divânu Lugâti't-Türk» sözlüğündeki kadim Türk atasözleriyle lafzen ve manen örtüşmektedir. Bu hakikat, Türk dünyasının müşterek köklerinin ebedi delilidir.`,
    vocabulary: [
      { kz: 'Шешендік сөз', tr: 'Hitabet / Belagat sanatı', note: 'Kazak bozkır söz düellosu' },
      { kz: 'Мақал-мәтел', tr: 'Atasözleri ve deyimler', note: 'Felsefi halk hikmetleri' },
      { kz: 'Диуану лұғат-ит-түрк', tr: 'Divânu Lugâti\'t-Türk', note: '1072 yılında yazılan ilk Türkçe sözlük' }
    ],
    questions: [
      {
        question: '«Отансыз адам – ормансыз бұлбұл» atasözünün Türkçe karşılığı nedir?',
        options: [
          'Vatansız insan, ormansız bülbüle benzer',
          'Ağaç yaprağıyla gürler',
          'Bülbülü altın kafese koymuşlar, yine vatanım demiş',
          'Vatan sevgisi imandandır'
        ],
        correctAnswer: 'Vatansız insan, ormansız bülbüle benzer',
        explanation: 'Atasözünde vatanından ayrı düşen insan ormansız ötemeyen bülbüle benzetilmiştir.'
      }
    ]
  }
];
