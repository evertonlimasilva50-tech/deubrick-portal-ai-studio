import React from 'react';
import { WifiOff, Database } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 flex items-center justify-between gap-3 rounded-xl bg-amber-500/95 text-black px-4 py-2.5 text-xs font-bold shadow-2xl backdrop-blur-md border border-amber-300 animate-bounce">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 shrink-0 text-black" />
        <span>Modo Offline Ativo — Visualizando dados armazenados em cache local.</span>
      </div>
      <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/15 text-[10px] font-mono">
        <Database className="w-3 h-3" />
        PWA CACHE
      </span>
    </div>
  );
};
