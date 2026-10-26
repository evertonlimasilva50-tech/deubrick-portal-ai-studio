import React from 'react';
import { ShieldCheck, ShieldAlert, Radio, Lock, BookOpen, Home } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onOpenReport: () => void;
  onOpenRules: () => void;
  onOpenAdmin: () => void;
  isAdminActive: boolean;
  currentScreen: string;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenReport,
  onOpenRules,
  onOpenAdmin,
  isAdminActive,
  currentScreen,
  onGoHome,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0B0D11]/90 backdrop-blur-md border-b border-white/10 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Logo and Brand with Gold Crown */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 text-left group focus:outline-none cursor-pointer"
        >
          {/* Gold Crown + DB Badge */}
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFE500] via-[#FACC15] to-[#B45309] p-[2px] shadow-lg shadow-[#FFE500]/20">
              <div className="w-full h-full bg-[#0E1116] rounded-[10px] flex items-center justify-center font-bebas text-xl text-[#FFE500] tracking-wider">
                DB
              </div>
            </div>
            {/* Mini crown floating */}
            <span className="absolute -top-2 -right-1 text-xs select-none">👑</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bebas font-black text-2xl tracking-wide text-white group-hover:text-[#FFE500] transition-colors italic">
                DEU<span className="text-[#FFE500]">-</span>BRICK
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-marker bg-[#FFE500] text-black font-black uppercase tracking-wider">
                RS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Aqui é Comércio Local • 7 Cidades
            </p>
          </div>
        </button>

        {/* Action Buttons & Navigation */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Regras Button */}
          <button
            onClick={onOpenRules}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              currentScreen === 'regras'
                ? 'bg-amber-500/20 text-[#FACC15] border-amber-500/40 shadow-sm'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
            title="Regras e Guia de Sobrevivência da Quebrada"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#FACC15]" />
            <span className="hidden sm:inline">Regras</span>
          </button>

          {/* Report Button */}
          <button
            onClick={onOpenReport}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              currentScreen === 'denunciar'
                ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                : 'bg-red-950/70 hover:bg-red-900/80 text-red-300 border border-red-500/40'
            }`}
            title="Central de Denúncias Anônimas"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden xs:inline">Denunciar</span>
          </button>

          {/* Admin Toggle */}
          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              isAdminActive
                ? 'bg-[#EAB308] text-black border-[#EAB308] shadow-md shadow-[#EAB308]/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
            title="Painel de Moderação e Campanhas"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Moderação</span>
          </button>
        </div>
      </div>
    </header>
  );
};
