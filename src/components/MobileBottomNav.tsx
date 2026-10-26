import React from 'react';
import { Home, Sparkles, BookOpen, ShieldAlert, Shield } from 'lucide-react';

interface MobileBottomNavProps {
  currentScreen: string;
  onNavigate: (screen: 'welcome' | 'quiz' | 'regras' | 'denunciar') => void;
  onOpenAdmin: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentScreen,
  onNavigate,
  onOpenAdmin,
}) => {
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-[#07090D]/95 backdrop-blur-xl border-t-2 border-[#FFE500]/30 px-2 py-1.5 pb-safe shadow-[0_-8px_25px_rgba(0,0,0,0.85)]">
      <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
        {/* Início */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic();
            onNavigate('welcome');
          }}
          className={`flex-1 py-1 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
            currentScreen === 'welcome'
              ? 'text-[#FFE500] bg-white/5 font-black scale-105'
              : 'text-slate-400 hover:text-slate-200 active:scale-95'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-wide font-bebas uppercase">Início</span>
        </button>

        {/* Entrar no Zap (Hero CTA) */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic();
            onNavigate('quiz');
          }}
          className={`flex-1 py-1 px-1 rounded-xl flex flex-col items-center justify-center transition-all relative ${
            currentScreen === 'quiz' || currentScreen === 'access'
              ? 'text-black bg-[#25D366] font-black scale-105 shadow-md shadow-[#25D366]/40'
              : 'text-[#25D366] hover:text-emerald-300 active:scale-95'
          }`}
        >
          <div className={`w-7 h-7 -mt-3 rounded-full flex items-center justify-center shadow-lg border-2 border-black font-black text-sm ${
            currentScreen === 'quiz' || currentScreen === 'access'
              ? 'bg-black text-[#25D366]'
              : 'bg-gradient-to-tr from-[#25D366] to-emerald-400 text-black'
          }`}>
            ⚡
          </div>
          <span className={`text-[10px] tracking-wide font-bebas uppercase font-bold ${
            currentScreen === 'quiz' || currentScreen === 'access' ? 'text-black' : 'text-[#25D366]'
          }`}>
            Entrar Zap
          </span>
        </button>

        {/* Regras */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic();
            onNavigate('regras');
          }}
          className={`flex-1 py-1 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
            currentScreen === 'regras'
              ? 'text-[#FFE500] bg-white/5 font-black scale-105'
              : 'text-slate-400 hover:text-slate-200 active:scale-95'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5 text-[#FFE500]" />
          <span className="text-[10px] tracking-wide font-bebas uppercase">Regras</span>
        </button>

        {/* Denúncias */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic();
            onNavigate('denunciar');
          }}
          className={`flex-1 py-1 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
            currentScreen === 'denunciar'
              ? 'text-red-400 bg-red-950/40 font-black scale-105 border border-red-500/40'
              : 'text-slate-400 hover:text-red-300 active:scale-95'
          }`}
        >
          <ShieldAlert className="w-5 h-5 mb-0.5 text-red-400" />
          <span className="text-[10px] tracking-wide font-bebas uppercase">Denunciar</span>
        </button>

        {/* Admin / Moderação */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic();
            onOpenAdmin();
          }}
          className="flex-1 py-1 px-1 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-white active:scale-95 transition-all"
        >
          <Shield className="w-5 h-5 mb-0.5 text-slate-400" />
          <span className="text-[10px] tracking-wide font-bebas uppercase">Admin</span>
        </button>
      </div>
    </nav>
  );
};
