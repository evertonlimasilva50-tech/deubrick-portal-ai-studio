import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Radio, CheckCircle, Fingerprint, Cpu, ShieldAlert, UserCheck } from 'lucide-react';
import { DeviceFingerprint, QuizState } from '../types';

interface SecurityTransitionScreenProps {
  fingerprint: DeviceFingerprint;
  quizState?: QuizState;
  onComplete: () => void;
}

export const SecurityTransitionScreen: React.FC<SecurityTransitionScreenProps> = ({
  fingerprint,
  quizState,
  onComplete,
}) => {
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Stage 1: Conferindo a malandragem... (0ms - 900ms)
    const t1 = setTimeout(() => {
      setProgress(48);
    }, 450);

    // Stage 2: Blindando contra golpista... (900ms - 1900ms)
    const t2 = setTimeout(() => {
      setStage(2);
      setProgress(78);
    }, 950);

    // Stage 3: Barbada, tudo limpo! (1900ms - 2700ms)
    const t3 = setTimeout(() => {
      setStage(3);
      setProgress(100);
    }, 1900);

    // Complete transition
    const t4 = setTimeout(() => {
      onComplete();
    }, 2850);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center max-w-md mx-auto space-y-6 animate-slide-up-fade">
      {/* High-tech Radar & Holographic Shield with Street Stencil Elements */}
      <div className="relative">
        <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-tr from-[#0E121A] via-black to-[#131824] border-3 border-[#FFE500] flex items-center justify-center shadow-[0_0_35px_rgba(255,229,0,0.25)] relative overflow-hidden">
          {/* Circular scanner ring */}
          <div className="absolute inset-0 rounded-2xl border-2 border-[#25D366]/40 animate-ping opacity-25" />
          <div className="absolute inset-x-0 h-1.5 bg-[#FFE500] opacity-80 animate-scanline" />

          {stage === 3 ? (
            <ShieldCheck className="w-16 h-16 text-[#25D366] animate-stencil-stamp stroke-[2.5]" />
          ) : stage === 2 ? (
            <Lock className="w-14 h-14 text-[#FFE500] animate-bounce stroke-[2.5]" />
          ) : (
            <Fingerprint className="w-14 h-14 text-[#25D366] animate-pulse stroke-[2.5]" />
          )}
        </div>

        {/* Negative Margin Stencil Live Badge */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-sm bg-black border-2 border-[#FFE500] text-[10px] font-stencil text-[#FFE500] font-bold flex items-center gap-1.5 shadow-[2px_2px_0_#000] tracking-wider">
          <Radio className="w-3 h-3 text-[#25D366] animate-spin" />
          <span>ESCANEAMENTO DE REDE RS</span>
        </div>
      </div>

      {/* Main Status Text with Stencil Font & Stencil Stamp Animation */}
      <div className="space-y-2 pt-3">
        <div className="min-h-[50px] flex items-center justify-center">
          {stage === 1 && (
            <h2 className="font-stencil text-2xl sm:text-3xl text-white tracking-wider animate-stencil-stamp uppercase text-street-3d">
              CONFERINDO A MALANDRAGEM...
            </h2>
          )}
          {stage === 2 && (
            <h2 className="font-stencil text-2xl sm:text-3xl text-[#FFE500] tracking-wider animate-stencil-stamp uppercase text-street-yellow-3d">
              BLINDANDO CONTRA GOLPISTA...
            </h2>
          )}
          {stage === 3 && (
            <h2 className="font-stencil text-2xl sm:text-3xl text-[#25D366] tracking-wider animate-stencil-stamp uppercase text-street-3d">
              BARBADA, TUDO LIMPO!
            </h2>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-300 font-medium h-6">
          {stage === 1 && 'Analisando histórico de terminal e integridade do aparelho...'}
          {stage === 2 && 'Cruzando dados técnicos com a Blacklist metropolitana...'}
          {stage === 3 && 'Dispositivo 100% verificado. Gerando chave VIP do WhatsApp!'}
        </p>
      </div>

      {/* Heavy Industrial Progress Bar */}
      <div className="w-full space-y-2">
        <div className="w-full h-4 rounded-sm bg-black overflow-hidden p-0.5 border-2 border-white/20">
          <div
            className="h-full rounded-sm bg-gradient-to-r from-[#FFE500] via-amber-400 to-[#25D366] transition-all duration-500 ease-out shadow-[0_0_12px_rgba(255,229,0,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] font-stencil text-slate-400">
          <span>PROGRESSO DA TRIAGEM</span>
          <span className="text-[#FFE500] font-bold">{progress}%</span>
        </div>
      </div>

      {/* Stencil Device Fingerprint Widget with Corner Cuts */}
      <div className="w-full bracket-box p-4 rounded-xl bg-black/80 border-2 border-white/20 text-left font-mono text-xs space-y-2 shadow-2xl">
        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span className="flex items-center gap-1.5 font-stencil text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-[#FFE500]" />
            DEVICE FINGERPRINT:
          </span>
          <span className="text-[#25D366] font-bold font-mono">{fingerprint.hash}</span>
        </div>

        {quizState?.fullName && (
          <div className="flex items-center justify-between text-slate-400 text-[11px] border-t border-white/10 pt-2">
            <span className="font-stencil text-slate-300">TRÍADE DE IDENTIDADE:</span>
            <span className="text-white font-bold flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-[#25D366]" />
              {quizState.fullName.split(' ')[0]} • {quizState.whatsapp || 'OK'}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-slate-400 text-[11px] border-t border-white/10 pt-2">
          <span className="font-stencil text-slate-300">STATUS ANTIFRAUDE:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1 font-stencil text-[10px]">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            APROVADO • 0 REINCIDÊNCIAS
          </span>
        </div>
      </div>
    </div>
  );
};
