import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, HardDriveDownload, Check, AlertCircle } from 'lucide-react';
import { offlineCacheService } from '../../services/offlineCacheService';

interface OfflineIndicatorProps {
  onPreCacheClick?: () => void;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = () => {
  const [isOnline, setIsOnline] = useState<boolean>(offlineCacheService.isOnline());
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [justReconnected, setJustReconnected] = useState<boolean>(false);

  useEffect(() => {
    let wasOffline = !offlineCacheService.isOnline();

    const unsubscribe = offlineCacheService.subscribe((online) => {
      setIsOnline(online);
      if (online && wasOffline) {
        setJustReconnected(true);
        const timer = setTimeout(() => {
          setJustReconnected(false);
        }, 4000);
        return () => clearTimeout(timer);
      }
      wasOffline = !online;
      if (!online) {
        setIsDismissed(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // When reconnected, show brief positive banner
  if (justReconnected) {
    return (
      <div className="bg-emerald-600 text-white px-3.5 py-1.5 text-xs font-bold flex items-center justify-between shadow-md animate-in slide-in-from-top duration-300">
        <div className="flex items-center gap-2">
          <Wifi className="w-3.5 h-3.5 text-emerald-200" />
          <span>İnternet bağlantısı yeniden kuruldu. Çevrimiçi mod aktif.</span>
        </div>
        <span className="text-[10px] bg-emerald-700/80 px-2 py-0.5 rounded-full font-black">
          ÇEVRİMİÇİ
        </span>
      </div>
    );
  }

  // When offline and not dismissed
  if (!isOnline && !isDismissed) {
    return (
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-3 py-2 text-xs shadow-md border-b border-amber-500/50 flex flex-wrap items-center justify-between gap-2 animate-in slide-in-from-top duration-300">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-white/20 rounded-lg">
            <WifiOff className="w-4 h-4 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black uppercase tracking-wider text-[10px] bg-amber-900/60 px-1.5 py-0.5 rounded">
                ÇEVRİMDISI MOD
              </span>
              <span className="font-bold text-[11px]">
                İnternet bağlantısı yok
              </span>
            </div>
            <p className="text-[10px] text-amber-100/90 leading-tight">
              Önbellekteki 34 temel ders, alıştırmalar ve harf sesleri sorunsuz çalışıyor.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[9px] font-black bg-white/20 px-2 py-0.5 rounded-md text-amber-50 flex items-center gap-1">
            <Check className="w-2.5 h-2.5" />
            <span>34/34 Ders Hazır</span>
          </span>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-[10px] font-bold text-amber-200 hover:text-white px-1.5 py-0.5 rounded transition"
            title="Kapat"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return null;
};
