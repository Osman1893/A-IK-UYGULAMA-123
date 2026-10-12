import React, { useState } from 'react';
import { Wifi, Battery, Signal, Maximize2, Minimize2 } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [scale, setScale] = useState<'normal' | 'compact'>('normal');

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 min-h-[calc(100vh-4rem)] bg-slate-900/5">
      {/* Viewport Control Bar */}
      <div className="mb-4 flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-xs border border-slate-200">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          Mobil Cihaz Görünümü (iOS / Android)
        </span>
        <div className="h-4 w-px bg-slate-200" />
        <button
          onClick={() => setScale(scale === 'normal' ? 'compact' : 'normal')}
          className="text-xs font-semibold text-slate-600 hover:text-teal-700 flex items-center gap-1 transition"
        >
          {scale === 'normal' ? (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Kompakt Ölçek (%85)</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Gerçek Boyut (%100)</span>
            </>
          )}
        </button>
      </div>

      {/* Realistic Smartphone Shell */}
      <div 
        className={`relative transition-all duration-300 w-[390px] h-[844px] rounded-[52px] bg-slate-900 p-3.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,0,0,0.1)] border-[4px] border-slate-700/80 ${
          scale === 'compact' ? 'scale-[0.88] origin-top -mb-16' : ''
        }`}
      >
        {/* Dynamic Island Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 w-28 h-6 bg-black rounded-full flex items-center justify-end px-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900/90 border border-slate-800" />
        </div>

        {/* Outer Phone Screen Canvas */}
        <div className="relative w-full h-full bg-white rounded-[40px] overflow-hidden flex flex-col shadow-inner select-none">
          
          {/* iOS / Android Status Bar */}
          <div className="h-10 px-6 pt-1.5 flex items-center justify-between text-xs font-bold text-slate-800 z-20 shrink-0 select-none">
            <span className="text-[13px] tracking-tight pl-1">9:41</span>
            <div className="flex items-center gap-1.5 pr-1">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 fill-current" />
            </div>
          </div>

          {/* Screen Content Container (Scrollable) */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col bg-slate-50">
            {children}
          </div>

          {/* iOS Home Gesture Indicator Bar */}
          <div className="h-5 flex items-center justify-center shrink-0 bg-white border-t border-slate-100 z-20">
            <div className="w-32 h-1 bg-slate-400/80 rounded-full" />
          </div>

        </div>
      </div>
    </div>
  );
};
