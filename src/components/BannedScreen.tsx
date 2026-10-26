import React from 'react';
import { ShieldAlert, AlertOctagon, Terminal, PhoneCall, RefreshCw } from 'lucide-react';
import { BlacklistEntry, DeviceFingerprint } from '../types';

interface BannedScreenProps {
  fingerprint: DeviceFingerprint;
  banDetails?: BlacklistEntry;
  onTestUnban?: () => void;
}

export const BannedScreen: React.FC<BannedScreenProps> = ({
  fingerprint,
  banDetails,
  onTestUnban,
}) => {
  return (
    <div className="min-h-screen bg-[#07090C] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Red ambient warning background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Police siren line indicator */}
      <div className="fixed top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-red-700 animate-pulse" />

      <div className="max-w-md w-full relative z-10 bg-[#0F1218] border-2 border-red-600/70 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Warning Icon */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 border-2 border-red-500 flex items-center justify-center text-red-500 shadow-xl shadow-red-500/20">
            <AlertOctagon className="w-10 h-10 animate-bounce" />
          </div>
          <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-black tracking-widest uppercase">
            Radar Antifraude • Bloqueio Nível 1
          </span>
          <h1 className="font-display font-black text-2xl text-white tracking-tight">
            DISPOSITIVO BLOQUEADO
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Este terminal ou conexão foi identificado pelo sistema de triagem do <strong className="text-white">Deu Brick</strong> associado a condutas fraudulentas na Região Metropolitana.
          </p>
        </div>

        {/* Infraction details card */}
        <div className="p-4 rounded-xl bg-black/60 border border-red-500/30 space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-1.5">
            <span>ID DO APARELHO:</span>
            <span className="text-red-400 font-bold">{fingerprint.hash}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-1.5">
            <span>CIDADE DETECTADA:</span>
            <span className="text-slate-200">{banDetails?.city || fingerprint.cityInferred || 'Canoas / RS'}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-1.5">
            <span>STATUS DE RISCO:</span>
            <span className="text-red-500 font-bold">99.8% (INFRAÇÃO CRÍTICA)</span>
          </div>
          <div className="pt-1 text-slate-300">
            <span className="text-red-400 font-semibold block mb-0.5">MOTIVO DO BANIMENTO:</span>
            <p className="text-[11px] font-sans text-slate-200 bg-red-950/40 p-2 rounded border border-red-900/50">
              {banDetails?.reason || 'Tentativa de aplicação de golpe do Pix / desacordo comercial grave reportado por membros locais.'}
            </p>
          </div>
        </div>

        {/* Info for innocent users / Appeal */}
        <div className="text-center space-y-3">
          <p className="text-[11px] text-slate-400">
            Acredita que isto seja um engano ou comprou um aparelho usado que estava na lista negra?
          </p>
          <a
            href="https://wa.me/5551999999999?text=Ol%C3%A1%20Modera%C3%A7%C3%A3o%20Deu%20Brick,%20meu%20aparelho%20caiu%20no%20bloqueio%20de%20antifraude%20e%20gostaria%20de%20solicitar%20revis%C3%A3o%20humana."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/20 transition-all"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Falar com Ouvidoria dos Administradores</span>
          </a>

          {onTestUnban && (
            <button
              onClick={onTestUnban}
              className="inline-flex items-center gap-1.5 text-[11px] text-[#25D366] hover:underline pt-2 font-mono"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>[Modo Simulação: Desbloquear meu dispositivo para testes]</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
