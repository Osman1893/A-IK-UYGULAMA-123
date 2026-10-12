import React, { useState } from 'react';
import { X, CheckCircle2, Award, ChevronRight, HelpCircle, Sparkles, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CefrLevel } from '../../types';
import { audioService } from '../../services/audioService';

interface PlacementTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetLevel: (level: CefrLevel) => void;
}

interface TestQuestion {
  id: number;
  level: CefrLevel;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

export const PlacementTestModal: React.FC<PlacementTestModalProps> = ({
  isOpen,
  onClose,
  onSetLevel
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [calculatedLevel, setCalculatedLevel] = useState<CefrLevel>('A1');

  // Exact 10 CEFR Placement Questions (2 for each level: A1, A2, B1, B2, C1)
  const questions: TestQuestion[] = [
    // A1 - 1
    {
      id: 1,
      level: 'A1',
      question: 'Kazakçada "Қалыңыз қалай?" sorusunun Türkçe karşılığı nedir?',
      options: ['Nasılsınız?', 'Adınız nedir?', 'Nereye gidiyorsunuz?', 'Saat kaç?'],
      correct: 'Nasılsınız?',
      explanation: '«Қалыңыз қалай?» Kazakçada saygılı ve resmî hâl-hatır sorma ifadesidir.'
    },
    // A1 - 2
    {
      id: 2,
      level: 'A1',
      question: 'Kazak alfabesindeki «Ә» harfi hangi sese karşılık gelir?',
      options: [
        'Açık ve ince E sesi (Azerbaycan ə, Almanca ä)',
        'Kalın ve derin O sesi',
        'Sert boğaz K sesi',
        'Genizden gelen sağır N sesi'
      ],
      correct: 'Açık ve ince E sesi (Azerbaycan ə, Almanca ä)',
      explanation: '«Ә», çene açık ve dudaklar yayvan telaffuz edilen ince açık e sesidir (Әке, Ән).'
    },
    // A2 - 3
    {
      id: 3,
      level: 'A2',
      question: '«Мен Түркиядан____.» cümlesindeki boşluğa hangi şahıs eki gelmelidir?',
      options: ['мын', 'мін', 'сың', 'сіз'],
      correct: 'мын',
      explanation: '«Түркиядан» kelimesi kalınlaşan son ek aldığı için 1. tekil şahıs eki kalın -мын olur.'
    },
    // A2 - 4
    {
      id: 4,
      level: 'A2',
      question: '«Бұл менің досым____ үйі.» cümlesinde ilgi hâli (ілік септік) için hangi ek gelmelidir?',
      options: ['-ның', '-нің', '-дың', '-дің'],
      correct: '-ның',
      explanation: '«Досым» kelimesi m ünsüzü ile bittiği ve kalın ünlü barındırdığı için -ның eki gelir.'
    },
    // B1 - 5
    {
      id: 5,
      level: 'B1',
      question: 'Kazakçada «Мен кітап оқып отырмын» cümlesi ne anlama gelir?',
      options: [
        'Ben kitap okuyorum (oturarak, şu anda).',
        'Ben dün kitap okudum.',
        'Ben yarın kitap okuyacağım.',
        'Ben kitap okumayı severim.'
      ],
      correct: 'Ben kitap okuyorum (oturarak, şu anda).',
      explanation: '«Отыр» fiili, şimdiki zamanda (нақ осы шақ) eylemin oturarak şu anda icra edildiğini belirtir.'
    },
    // B1 - 6
    {
      id: 6,
      level: 'B1',
      question: '«Келісу» fiilinin Türkiye Türkçesindeki doğru karşılığı nedir?',
      options: ['Anlaşmak / Uzlaşmak', 'Gelişmek', 'Gelmek', 'Geri çekilmek'],
      correct: 'Anlaşmak / Uzlaşmak',
      explanation: '«Келісу», bir konuda fikir birliğine varmak, uzlaşmak demektir.'
    },
    // B2 - 7
    {
      id: 7,
      level: 'B2',
      question: 'Kıpçak-Oğuz ses denkliğine göre Türkiye Türkçesindeki "Yol" ve "Yıl" kelimeleri Kazakçada nasıl başlar?',
      options: [
        'Ж (J) ile: Жол ve Жыл',
        'Д (D) ile: Дол ve Дыл',
        'Т (T) ile: Тол ve Тыл',
        'Ғ (Ğ) ile: Ғол ve Ғыл'
      ],
      correct: 'Ж (J) ile: Жол ve Жыл',
      explanation: 'Oğuz grubu söz başı Y-, Kıpçak grubu Kazakçada düzenli olarak Ж- (J) sesine dönüşür.'
    },
    // B2 - 8
    {
      id: 8,
      level: 'B2',
      question: 'Abay Kunanbayev\'in Kazak ahlak felsefesinin şaheseri sayılan 45 nesir yazısına ne ad verilir?',
      options: ['Қара сөздер (Kara Sözler)', 'Бақытсыз Жамал', 'Қалың мал', 'Көксерек'],
      correct: 'Қара сөздер (Kara Sözler)',
      explanation: 'Abay Kunanbayev\'in felsefi, ahlaki ve toplumsal öğütlerini içeren eseri «Қара сөздер»dir.'
    },
    // C1 - 9
    {
      id: 9,
      level: 'C1',
      question: '«Ел үмітін ер ақтар, ер атағын ел сақтар» atasözünün derin Türkolojik anlamı nedir?',
      options: [
        'Halkın umudunu yiğit boşa çıkarmaz; yiğidin şanını da halk yaşatır.',
        'Her yiğit kendi çıkarını düşünmelidir.',
        'Sadece zenginler ülkeyi yönetir.',
        'Gelenekler zamanla yok olmaya mahkumdur.'
      ],
      correct: 'Halkın umudunu yiğit boşa çıkarmaz; yiğidin şanını da halk yaşatır.',
      explanation: 'Bu atasözü birey ve millet arasındaki karşılıklı vefa ve sorumluluk bağını ifade eder.'
    },
    // C1 - 10
    {
      id: 10,
      level: 'C1',
      question: 'Eski Türkçedeki «Tağ / Dağ» kelimesinin Kazakçadaki «Тау» şekline dönüşmesi hangi fonetik kanundur?',
      options: [
        'Kelime sonu art-damaksıl -ğ/-g sesinin dudaksıl yarı ünlü -w (у) sesine vokalizasyonu',
        'Ön damak incelmesi',
        'Gırtlak ünsüzü türemesi',
        'Ünsüz benzeşmesi'
      ],
      correct: 'Kelime sonu art-damaksıl -ğ/-g sesinin dudaksıl yarı ünlü -w (у) sesine vokalizasyonu',
      explanation: 'Kıpçak grubunda söz sonu -G/-Ğ sesleri -W (у) sesine vokalize olur: Tağ ➔ Taw (Тау), Saığ ➔ Saw (Сау).'
    }
  ];

  if (!isOpen) return null;

  const currentQ = questions[currentQIndex];

  const handleNext = () => {
    if (!selectedOpt) return;

    const isCorrect = selectedOpt === currentQ.correct;
    const newCorrect = correctAnswersCount + (isCorrect ? 1 : 0);
    
    if (isCorrect) {
      setCorrectAnswersCount(newCorrect);
      audioService.playFeedbackSound('correct');
    } else {
      audioService.playFeedbackSound('wrong');
    }

    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOpt(null);
    } else {
      // 10-Question Score calculation:
      let lvl: CefrLevel = 'A1';
      if (newCorrect >= 9) lvl = 'C1';
      else if (newCorrect >= 7) lvl = 'B2';
      else if (newCorrect >= 5) lvl = 'B1';
      else if (newCorrect >= 3) lvl = 'A2';
      else lvl = 'A1';

      setCalculatedLevel(lvl);
      setIsTestFinished(true);
      audioService.playFeedbackSound('complete');
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    }
  };

  const handleApplyLevel = () => {
    onSetLevel(calculatedLevel);
    onClose();
  };

  const handleReset = () => {
    setCurrentQIndex(0);
    setSelectedOpt(null);
    setCorrectAnswersCount(0);
    setIsTestFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-teal-200">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight">
                10 Soruluk CEFR Seviye Tespit Sınavı
              </h3>
              <p className="text-[10px] text-teal-200 font-medium">
                Деңгей анықтау емтиханы (A1 - C1 Düzey Analizi)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {!isTestFinished && (
          <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between shrink-0">
            <span className="text-[11px] font-bold text-slate-700">
              Soru {currentQIndex + 1} / 10 ({currentQ.level} Seviyesi)
            </span>
            <div className="w-32 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-teal-600 h-2 transition-all duration-300"
                style={{ width: `${((currentQIndex + 1) / 10) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Question Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {!isTestFinished ? (
            <div className="space-y-4">
              <div className="bg-teal-50/70 border border-teal-200/80 p-4 rounded-2xl">
                <span className="text-[10px] font-black uppercase text-teal-800 bg-teal-200/70 px-2 py-0.5 rounded-md">
                  {currentQ.level} Seviye Sorusu
                </span>
                <p className="text-sm font-bold text-slate-900 mt-2 leading-relaxed">
                  {currentQ.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedOpt(opt)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs font-semibold transition flex items-center justify-between ${
                      selectedOpt === opt
                        ? 'border-teal-600 bg-teal-50/80 text-teal-950 ring-2 ring-teal-500/20'
                        : 'border-slate-200 bg-white hover:border-teal-300 text-slate-800'
                    }`}
                  >
                    <span>{opt}</span>
                    {selectedOpt === opt && (
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Result Screen */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/30">
                <Sparkles className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-base font-black text-slate-900">
                  Tebrikler! Sınavı Tamamladınız
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  10 sorudan <span className="font-bold text-teal-700">{correctAnswersCount} doğru</span> yaptınız.
                </p>
              </div>

              {/* Calculated Level Badge */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 p-4 rounded-2xl max-w-xs mx-auto">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  Önerilen CEFR Başlangıç Seviyeniz
                </span>
                <div className="text-3xl font-black text-teal-900 mt-1">
                  {calculatedLevel}
                </div>
                <p className="text-[11px] text-teal-800 font-medium mt-1">
                  {calculatedLevel === 'A1' && 'A1 - Başlangıç Düzeyi (Temel tanışma ve alfabe)'}
                  {calculatedLevel === 'A2' && 'A2 - Temel Düzey (Günlük hayat ve iyelik kalıpları)'}
                  {calculatedLevel === 'B1' && 'B1 - Orta Düzey (Zamanlar ve akıcı cümleler)'}
                  {calculatedLevel === 'B2' && 'B2 - İleri Orta Düzey (Kültür, edebiyat ve bileşik yapılar)'}
                  {calculatedLevel === 'C1' && 'C1 - Yetkin Düzey (Akademik Türkoloji ve atasözleri)'}
                </p>
              </div>

              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Tekrar Çöz</span>
                </button>
                <button
                  onClick={handleApplyLevel}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <span>{calculatedLevel} Seviyesine Başla</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        {!isTestFinished && (
          <div className="p-4 bg-white border-t border-slate-200/80 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-slate-500 font-semibold">
              {selectedOpt ? 'Cevabınızı onaylayın' : 'Lütfen bir şık seçin'}
            </span>
            <button
              onClick={handleNext}
              disabled={!selectedOpt}
              className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                selectedOpt
                  ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>{currentQIndex === 9 ? 'Sonucu Gör' : 'Sonraki Soru'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
