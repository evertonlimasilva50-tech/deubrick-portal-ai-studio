import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  MapPin,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Users,
  Tag,
  Lock,
  KeyRound,
  ShieldAlert,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { CityData, DeviceFingerprint, QuizState } from '../types';
import {
  executeSecureRedirect,
  resolveCloakedWhatsAppUrl,
  getMaskedDestination,
} from '../services/cloaking';

interface AccessScreenProps {
  quizState: QuizState;
  cityData: CityData;
  fingerprint?: DeviceFingerprint | null;
  onResetQuiz: () => void;
  onNavigateToRules: () => void;
  onNavigateToReport: () => void;
}

export const AccessScreen: React.FC<AccessScreenProps> = ({
  quizState,
  cityData,
  fingerprint = null,
  onResetQuiz,
  onNavigateToRules,
  onNavigateToReport,
}) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectError, setRedirectError] = useState<string | null>(null);

  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#25D366', '#FFE500', '#10B981', '#FFFFFF'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  /**
   * redirectClick:
   * Programmatic, cloaked redirection handler with an additional multi-layer obfuscation step.
   * Completely bypasses DOM link injection and strictly uses `window.location.replace`
   * to shield group invite URLs against web scrapers, DOM inspection, and right-click copying.
   */
  const redirectClick = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isRedirecting) return;

    setRedirectError(null);
    setIsRedirecting(true);

    // Micro-delay for antifraud cryptographic validation animation
    setTimeout(() => {
      try {
        // Multi-layer Obfuscation & Cloaking Resolution:
        // 1. Cross-checks quiz completion & terminal integrity
        // 2. Dynamically decodes obfuscated payload only in private execution scope
        // 3. Immediately executes window.location.replace
        const resolution = resolveCloakedWhatsAppUrl(cityData, quizState, fingerprint);

        if (!resolution.success || !resolution.url) {
          setIsRedirecting(false);
          setRedirectError(resolution.error || 'Acesso negado: falha na validação do passe VIP.');
          return;
        }

        // Programmatic replace execution (Zero link presence in DOM)
        window.location.replace(resolution.url);
      } catch (err) {
        // Controlled fallback executing window.location.replace via service
        const fallback = executeSecureRedirect(cityData, quizState, fingerprint);
        if (!fallback.success) {
          setIsRedirecting(false);
          setRedirectError(fallback.error || 'Erro ao processar redirecionamento seguro.');
        }
      }
    }, 420);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-slide-up-fade pb-20">
      {/* Top Banner of Approval */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-black border-2 border-[#25D366] text-[#25D366] text-xs font-stencil uppercase tracking-wider shadow-[2px_2px_0_#000] animate-stencil-stamp">
          <CheckCircle className="w-4 h-4 text-[#25D366]" />
          <span>TRIAGEM CONCLUÍDA • ACESSO VIP</span>
        </div>
        <h1 className="font-stencil text-3xl sm:text-4xl text-white tracking-wide uppercase text-street-3d">
          SEU PASSE VIP ESTÁ PRONTO!
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Você foi aprovado na triagem metropolitana. Bem-vindo ao grupo de{' '}
          <strong className="text-[#FFE500]">{cityData.name}</strong>.
        </p>
      </div>

      {/* Street Pass VIP Ticket with Negative Margins and Accented Stencil Borders */}
      <div className="relative bracket-box rounded-2xl bg-gradient-to-br from-[#121620] via-[#0A0C10] to-[#121620] border-3 border-[#FFE500] p-5 sm:p-6 shadow-2xl overflow-visible space-y-5 pt-5">
        {/* Negative Margin Floating Badge on Ticket */}
        <div className="absolute -top-3.5 left-4 z-10 flex items-center gap-1.5">
          <span className="font-stencil text-[10px] bg-[#FFE500] text-black px-2.5 py-0.5 rounded-sm border-2 border-black shadow-[2px_2px_0_#000] tracking-wider uppercase font-bold">
            👑 CREDENCIAL OFICIAL DE QUEBRADA
          </span>
        </div>

        {/* Decorative corner cuts & glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFE500]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Ticket Header with Crown and Street Badge */}
        <div className="flex items-start justify-between border-b-2 border-white/10 pb-4 pt-1">
          <div>
            <span className="text-[11px] font-stencil uppercase text-[#FFE500] font-black tracking-widest block">
              PORTAL METROPOLITANO RS
            </span>
            <h3 className="font-stencil text-2xl sm:text-3xl text-white flex items-center gap-2 mt-0.5 tracking-wide">
              <span>DEU-BRICK</span>
              <span className="text-[#FFE500]">•</span>
              <span className="text-[#FFE500]">{cityData.name.toUpperCase()}</span>
            </h3>
          </div>
          <div className="p-2 rounded-xl bg-[#FFE500]/20 border-2 border-[#FFE500] text-[#FFE500] shadow-[0_0_15px_rgba(255,229,0,0.3)]">
            <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
          </div>
        </div>

        {/* Flyer Slogan Strip with Street Stencil */}
        <div className="p-2.5 rounded-sm bg-black border-2 border-[#FFE500]/60 text-center shadow-inner">
          <span className="font-stencil text-xs sm:text-sm text-[#FFE500] uppercase tracking-wider font-bold">
            ⚡ POSTOU, VENDEU, PEGOU O DINHEIRO NA MÃO!
          </span>
        </div>

        {/* Ticket Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-black/60 border-2 border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 block font-stencil">CIDADE DE DESTINO:</span>
            <span className="text-white font-stencil text-sm sm:text-base flex items-center gap-1 truncate font-bold">
              <MapPin className="w-3.5 h-3.5 text-[#FFE500] shrink-0" />
              {cityData.name} - RS
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/60 border-2 border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 block font-stencil">SEU OBJETIVO:</span>
            <span className="text-[#FFE500] font-stencil text-sm sm:text-base uppercase truncate font-bold">
              {quizState.objective === 'comprar'
                ? '🛒 Barbadas'
                : quizState.objective === 'vender'
                ? '🏷️ Desapego'
                : quizState.objective === 'trocar'
                ? '🔄 Troca'
                : '📢 Trampo'}
            </span>
          </div>

          <div className="col-span-2 p-3 rounded-xl bg-black/60 border-2 border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 block font-stencil">ITEM DE INTERESSE:</span>
            <span className="text-white font-bold flex items-center gap-1.5 text-xs sm:text-sm">
              <Tag className="w-4 h-4 text-[#25D366]" />
              {quizState.searchedItem || 'Geral (Celulares, motos, carros e ferramentas)'}
            </span>
          </div>

          {/* Tríade de Identidade Verified Morador Badge */}
          <div className="col-span-2 p-3 rounded-xl bg-zinc-900/90 border-2 border-[#25D366]/40 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-stencil text-[#25D366]">
              <span>👑 TITULAR DA CREDENCIAL VERIFICADA</span>
              <span className="text-white font-mono text-[10px] bg-black px-2 py-0.5 rounded border border-[#25D366]/30">
                AUDITORIA 100% OK
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="text-slate-300">
                <span className="text-slate-400 text-[10px] block">NOME REAL:</span>
                <strong className="text-white font-bold">{quizState.fullName || 'Morador Verificado'}</strong>
              </div>
              <div className="text-slate-300">
                <span className="text-slate-400 text-[10px] block">WHATSAPP:</span>
                <strong className="text-[#25D366] font-bold">{quizState.whatsapp || '(51) 9****-****'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Cloaked Destination Status Bar (Zero RAW Link in DOM) */}
        <div className="p-3 rounded-xl bg-emerald-950/40 border-2 border-emerald-500/30 space-y-1 text-xs">
          <div className="flex items-center justify-between text-emerald-300">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#25D366]" />
              <span className="font-semibold">Membros Ativos Hoje:</span>
            </div>
            <span className="font-mono font-bold text-white">
              {cityData.activeMembers} moradores
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-white/5">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#25D366]" />
              ROTA CLOAKED:
            </span>
            <span className="text-slate-300">{getMaskedDestination(cityData)}</span>
          </div>
        </div>
      </div>

      {/* Error Message if any */}
      {redirectError && (
        <div className="p-3.5 rounded-xl bg-red-950/80 border-2 border-red-500 text-red-200 text-xs font-bold flex items-center gap-2 animate-stencil-stamp">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span>{redirectError}</span>
        </div>
      )}

      {/* GIANT STREET BUTTON (PROGRAMMATIC CLOAKING VIA redirectClick) */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={redirectClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              redirectClick(e);
            }
          }}
          disabled={isRedirecting}
          onContextMenu={(e) => e.preventDefault()}
          draggable={false}
          className="w-full py-5 px-6 rounded-2xl bg-[#FFE500] hover:bg-[#FFE500]/90 text-black font-stencil text-xl sm:text-2xl uppercase tracking-wider shadow-[0_0_30px_rgba(255,229,0,0.45)] border-3 border-black transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer text-center select-none disabled:opacity-75"
          title="Clique para entrar no grupo verificado"
          aria-label="Entrar no grupo oficial verificado do WhatsApp"
        >
          {isRedirecting ? (
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin" />
              <span className="text-lg">VALIDANDO CREDENCIAL VIP...</span>
            </div>
          ) : (
            <>
              {/* WhatsApp Custom Vector Icon */}
              <svg className="w-8 h-8 fill-black" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.031 2C6.505 2 2.016 6.489 2.016 12.016c0 1.765.46 3.488 1.332 5.009L2 22.031l5.148-1.328a9.986 9.986 0 0 0 4.883 1.313h.004c5.526 0 10.015-4.489 10.015-10.016 0-2.678-1.043-5.197-2.936-7.09A9.95 9.95 0 0 0 12.031 2zm0 18.336h-.003a8.318 8.318 0 0 1-4.242-1.163l-.304-.18-3.156.816.844-3.076-.197-.314a8.31 8.31 0 0 1-1.272-4.403c0-4.595 3.738-8.333 8.335-8.333 2.226 0 4.318.867 5.892 2.441a8.27 8.27 0 0 1 2.44 5.895c0 4.597-3.739 8.334-8.334 8.334zm4.569-6.236c-.25-.125-1.48-.73-1.71-.813-.23-.083-.397-.125-.564.125-.167.25-.646.813-.792.98-.146.167-.292.188-.542.063s-1.057-.39-2.013-1.242c-.744-.664-1.247-1.484-1.393-1.734-.146-.25-.016-.385.109-.51.113-.112.25-.292.375-.438.125-.146.167-.25.25-.417.083-.167.042-.313-.021-.438s-.564-1.356-.772-1.856c-.203-.487-.41-.42-.564-.428-.146-.008-.313-.01-.48-.01s-.438.063-.667.313c-.23.25-.876.855-.876 2.085s.896 2.418 1.021 2.585c.125.167 1.764 2.693 4.273 3.777.597.258 1.064.412 1.428.528.6.191 1.146.164 1.578.1.481-.072 1.48-.605 1.688-1.189.208-.584.208-1.084.146-1.189-.063-.104-.23-.167-.48-.292z" />
              </svg>
              <span>ENTRAR NO WHATSAPP OFICIAL</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono">
          <KeyRound className="w-3.5 h-3.5 text-[#25D366]" />
          <span>Redirecionamento blindado contra bots de raspagem e clonagem</span>
        </div>
      </div>

      {/* Community Rules Notice */}
      <div className="p-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/30 space-y-2 text-xs text-amber-200">
        <div className="flex items-center gap-2 font-stencil text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>REGRAS BÁSICAS DA QUEBRADA:</span>
        </div>
        <ul className="space-y-1.5 text-slate-300 pl-6 list-disc font-medium">
          <li>
            <strong className="text-white">Ponto de Encontro Seguro:</strong> Sempre combine entregas em locais movimentados (Trensurb, postos, shoppings).
          </li>
          <li>
            <strong className="text-white">Pix Somente com Produto em Mãos:</strong> Nunca transfira adiantado e confira o saldo real no seu banco.
          </li>
        </ul>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={onNavigateToRules}
          className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-[#FFE500]" />
          <span>Regras & Mandamentos</span>
        </button>

        <button
          type="button"
          onClick={onNavigateToReport}
          className="p-3.5 rounded-xl bg-red-950/40 hover:bg-red-950/70 border border-red-500/30 text-xs font-bold text-red-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <span>Central de Denúncias</span>
        </button>
      </div>

      {/* Reset Action */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={onResetQuiz}
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Trocar de Cidade / Nova Triagem</span>
        </button>
      </div>
    </div>
  );
};
