import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ChevronRight, 
  Sparkles, 
  BookOpen, 
  Volume2, 
  X,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AlageyikMascot } from '../common/AlageyikMascot';
import { audioService } from '../../services/audioService';
import { Unit, Lesson } from '../../types';

export interface EvaluationQuestion {
  id: string;
  questionTr: string;
  questionKz: string;
  options: string[];
  correctAnswer: string;
  explanationTr: string;
  explanationKz: string;
}

interface StageEvaluationModalProps {
  isOpen: boolean;
  stageTitle: string;
  stageNumber: number;
  unit?: Unit;
  lesson?: Lesson;
  questions: EvaluationQuestion[];
  onPassStage: () => void;
  onReviewLesson: () => void;
  onClose: () => void;
}

export const StageEvaluationModal: React.FC<StageEvaluationModalProps> = ({
  isOpen,
  stageTitle,
  stageNumber,
  unit,
  lesson,
  questions,
  onPassStage,
  onReviewLesson,
  onClose
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, { selected: string; isCorrect: boolean }>>({});
  const [isExamCompleted, setIsExamCompleted] = useState(false);

  if (!isOpen) return null;

  const currentQ = questions[currentQuestionIndex] || questions[0];
  const totalQuestions = questions.length;
  const passingScorePercentage = 75; // 75% required to pass to next stage

  // Handle option select
  const handleSelect = (option: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(option);
    audioService.playFeedbackSound('click');
  };

  // Submit current question
  const handleSubmitAnswer = () => {
    if (!selectedOption) return;

    const isCorrect = selectedOption.trim() === currentQ.correctAnswer.trim();
    setIsAnswerSubmitted(true);

    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: { selected: selectedOption, isCorrect }
    }));

    if (isCorrect) {
      audioService.playFeedbackSound('correct');
    } else {
      audioService.playFeedbackSound('wrong');
    }
  };

  // Next question or finish
  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);

    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate final score
      setIsExamCompleted(true);
      const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
      const scorePercent = Math.round((correctCount / totalQuestions) * 100);

      if (scorePercent >= passingScorePercentage) {
        audioService.playFeedbackSound('complete');
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      } else {
        audioService.playFeedbackSound('wrong');
      }
    }
  };

  // Calculate score
  const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const isPassed = scorePercent >= passingScorePercentage;

  // Speak question
  const handleSpeak = (text: string) => {
    audioService.speak(text, 'kk');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="p-4 bg-gradient-to-r from-violet-700 via-indigo-700 to-purple-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-white/15 text-violet-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  Etap {stageNumber} Değerlendirmesi
                </span>
                <span className="text-xs text-violet-200 font-bold">
                  Geçme Eşiği: %{passingScorePercentage}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black tracking-tight mt-0.5">
                {stageTitle} • Yeterlilik Sınavı
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition text-violet-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {!isExamCompleted && (
          <div className="w-full bg-slate-100 h-1.5 shrink-0">
            <div 
              className="bg-gradient-to-r from-amber-500 to-violet-600 h-1.5 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {!isExamCompleted ? (
            /* Active Question Screen */
            <div className="space-y-4">
              
              {/* Question Header & Mascot Guidance */}
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                <span>Soru {currentQuestionIndex + 1} / {totalQuestions}</span>
                <span className="text-violet-600 font-black">
                  {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
                </span>
              </div>

              {/* Question Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 leading-snug">
                      {currentQ.questionTr}
                    </h4>
                    <p className="text-xs text-teal-800 font-bold mt-1">
                      {currentQ.questionKz}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSpeak(currentQ.questionKz)}
                    className="p-2 rounded-xl bg-violet-100 hover:bg-violet-200 text-violet-700 transition shrink-0"
                    title="Sesli Dinle"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrectAnswer = option.trim() === currentQ.correctAnswer.trim();

                  let style = 'bg-white border-slate-200 hover:border-violet-400 text-slate-800';
                  if (isSelected && !isAnswerSubmitted) {
                    style = 'bg-violet-50 border-violet-500 ring-2 ring-violet-500/20 text-violet-900 font-bold';
                  } else if (isAnswerSubmitted) {
                    if (isCorrectAnswer) {
                      style = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                    } else if (isSelected && !isCorrectAnswer) {
                      style = 'bg-rose-50 border-rose-500 text-rose-950 font-bold ring-2 ring-rose-500/20';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelect(option)}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs font-semibold transition flex items-center justify-between shadow-2xs ${style}`}
                    >
                      <span>{option}</span>
                      {isAnswerSubmitted && isCorrectAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                      )}
                      {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submission */}
              {isAnswerSubmitted && (
                <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed animate-in fade-in ${
                  selectedOption?.trim() === currentQ.correctAnswer.trim()
                    ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/90 border-rose-200 text-rose-950'
                }`}>
                  <p className="font-black mb-0.5">
                    {selectedOption?.trim() === currentQ.correctAnswer.trim() ? '✓ Tebrikler, Doğru!' : '✗ Yanlış Cevap!'}
                  </p>
                  <p className="font-medium text-[11px] text-slate-700">{currentQ.explanationTr}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                {!isAnswerSubmitted ? (
                  <button
                    disabled={!selectedOption}
                    onClick={handleSubmitAnswer}
                    className="w-full py-3.5 px-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white font-black text-xs rounded-2xl shadow-md transition"
                  >
                    Cevabı Onayla
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <span>{currentQuestionIndex + 1 < totalQuestions ? 'Sonraki Soruya Geç' : 'Sınavı Bitir ve Sonucu Gör'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          ) : (
            /* Exam Completed Screen (Gatekeeper Decision) */
            <div className="space-y-4 py-2">
              
              {isPassed ? (
                /* PASSED SCREEN (Score >= 75%) */
                <div className="space-y-4">
                  <AlageyikMascot
                    pose="celebrating"
                    size="md"
                    message={`Tebrikler! ${stageTitle} etabını başarıyla geçtin!`}
                    subMessage={`Başarı Oranın: %${scorePercent} (${correctCount}/${totalQuestions} Doğru). Sıradaki yeni etap açıldı!`}
                    showLoreButton={false}
                  />

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center mx-auto text-xl shadow-md">
                      ✓
                    </div>
                    <h4 className="text-base font-black text-emerald-950">
                      ETAP YETERLİLİĞİ SAĞLANDI!
                    </h4>
                    <p className="text-xs text-emerald-800 font-medium">
                      Bu etabın gramer ve kelime hedeflerini başarıyla kavradınız. +50 Bonus XP kazandınız ve kilitli sonraki etap açıldı!
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onPassStage();
                      onClose();
                    }}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    <span>Ödülü Al ve Yeni Etaba Geç ✓</span>
                  </button>
                </div>
              ) : (
                /* FAILED SCREEN (Score < 75%) -> Must Review Lesson! */
                <div className="space-y-4">
                  <AlageyikMascot
                    pose="encouraging"
                    size="md"
                    message="Üzülme! Bozkırın cesur yolcusu pes etmez!"
                    subMessage={`Skorun: %${scorePercent} (${correctCount}/${totalQuestions} Doğru). Bir sonraki etaba geçmek için en az %${passingScorePercentage} başarı gerekmektedir.`}
                    showLoreButton={false}
                  />

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Kural: Başarısız Olunan Konuyu Tekrar Etme Zorunluluğu</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Etabı tam anlamadan ilerlemek sonraki dersleri zorlaştırır. Şimdi dersin gramer kurallarını ve kelimelerini tekrar inceleyip testi yeniden deneyebilirsiniz.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => {
                        // Reset exam to retry
                        setUserAnswers({});
                        setCurrentQuestionIndex(0);
                        setSelectedOption(null);
                        setIsAnswerSubmitted(false);
                        setIsExamCompleted(false);
                      }}
                      className="py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Testi Yeniden Dene</span>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onReviewLesson();
                      }}
                      className="py-3 px-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Konuyu Tekrar Et ➔</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
