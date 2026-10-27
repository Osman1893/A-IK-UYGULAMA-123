import React from 'react';
import { Volume2, Sparkles, X, CheckCircle2, AlertTriangle, Monitor, Smartphone, Globe, Headphones, ExternalLink } from 'lucide-react';
import { audioService } from '../../services/audioService';

interface NaturalVoiceGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NaturalVoiceGuideModal: React.FC<NaturalVoiceGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const currentVoiceKz = audioService.getActiveVoiceDetails('kk');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-teal-200">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black tracking-tight">
                Doğal Ses Kalitesi & Stüdyo Çözüm Rehberi
              </h3>
              <p className="text-[11px] text-teal-200 font-medium">
                Seslerin robotik değil, gerçek insan gibi çıkması için kılavuz
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diagnostic Status Card */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Cihazınızda Tespit Edilen Aktif Ses Motoru:
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                currentVoiceKz.isNeural 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-900'
              }`}>
                {currentVoiceKz.isNeural ? '✨ Doğal Nöral Ses Aktif' : '⚠️ Standart/Mekanik Ses'}
              </span>
            </div>
            <p className="text-xs font-black text-slate-800">
              {currentVoiceKz.name}
            </p>
            <p className="text-[11px] text-slate-500">
              {currentVoiceKz.isNeural 
                ? 'Harika! Cihazınızda yapay zekâ destekli doğal insan sesi sentezleyicisi bulundu.'
                : 'Cihazınızın yerel çevrimdışı ses motoru kullanılıyor. Sesin tamamen doğal insan gibi duyulması için aşağıdaki adımları uygulayabilirsiniz.'}
            </p>
          </div>
        </div>

        {/* Step-by-Step Solutions */}
        <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-slate-700">
          
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Doğal İnsan Sesi Nasıl Elde Edilir? (3 Kolay Yöntem)</span>
          </h4>

          {/* 1. Microsoft Edge Method */}
          <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-lg bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <h5 className="font-black text-teal-950">
                Microsoft Edge ile Açın (En Kolay & En Doğal İnsan Sesi)
              </h5>
            </div>
            <p className="text-[11px] text-teal-900/90 leading-relaxed pl-7">
              Microsoft Edge tarayıcısı, yerleşik olarak dünyanın en gelişmiş <strong>Microsoft Natural (Nöral)</strong> bulut ses motoruna sahiptir. Uygulamayı Edge ile açtığınızda sistem otomatik olarak stüdyo kalitesinde pürüzsüz gerçek insan sesiyle konuşur; hiçbir ek indirme veya ayar gerektirmez.
            </p>
          </div>

          {/* 2. Google Chrome & Android Method */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-lg bg-slate-700 text-white font-black text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <h5 className="font-black text-slate-900">
                Google Chrome & Android: Kazakça Dil Paketini İndirin
              </h5>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed pl-7">
              Telefonunuzda veya tabletinizde <strong>Ayarlar ➔ Erişilebilirlik ➔ Metin Okuma (TTS) ➔ Google Konuşma Hizmetleri (Çark simgesi) ➔ Ses Verilerini Yükle ➔ Kazakça (Қазақ)</strong> paketini indirin. Bu işlem mekanik sesi doğrudan Google'ın akıcı nöral sesine dönüştürür.
            </p>
          </div>

          {/* 3. iOS (iPhone / iPad / Mac) Method */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-lg bg-slate-700 text-white font-black text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <h5 className="font-black text-slate-900">
                iOS (iPhone / iPad): Gelişmiş Siri Doğal Sesini Açın
              </h5>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed pl-7">
              iPhone'da <strong>Ayarlar ➔ Erişilebilirlik ➔ Seslendirilen İçerik ➔ Sesler ➔ Kazakça / Türkçe</strong> seçeneğinden "Gelişmiş / Yüksek Kalite" ses paketini indirdiğinizde robotik tonlama ortadan kalkar.
            </p>
          </div>

          {/* 4. Professional Cloud API Option */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-lg bg-amber-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                4
              </span>
              <h5 className="font-black text-amber-950">
                Gelişmiş Sunucu Tabanlı API Opsiyonu (ElevenLabs / Google Cloud TTS)
              </h5>
            </div>
            <p className="text-[11px] text-amber-900/90 leading-relaxed pl-7">
              Tarayıcıdan bağımsız olarak her ortamda radyo/podcast kalitesinde profesyonel insan sesi elde etmek isterseniz, arka uçta Google Cloud Text-to-Speech WaveNet veya ElevenLabs ses API'si entegre edilebilir.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              audioService.speak('Сәлеметсіз бе! Бұл табиғи қазақша дауысты тексеру.', 'kk');
            }}
            className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition flex items-center gap-1.5 shadow-xs active:scale-95"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Sesi Canlı Test Et</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-black text-xs transition"
          >
            Anladım, Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
