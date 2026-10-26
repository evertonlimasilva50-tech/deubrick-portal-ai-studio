import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowLeft,
  KeyRound,
  FileText,
  BadgeAlert,
  Smartphone,
  Car,
  DollarSign,
  Users,
  Camera,
  Clock,
  ThumbsUp,
  Ban,
  Sparkles,
} from 'lucide-react';
import { CityData, DeviceFingerprint, QuizState } from '../types';
import { executeSecureRedirect, getMaskedDestination } from '../services/cloaking';

interface RulesScreenProps {
  currentCity: CityData;
  cities: CityData[];
  onSelectCity: (city: CityData) => void;
  fingerprint?: DeviceFingerprint | null;
  quizState: QuizState;
  onGoHome: () => void;
}

export const RulesScreen: React.FC<RulesScreenProps> = ({
  currentCity,
  cities,
  onSelectCity,
  fingerprint,
  quizState,
  onGoHome,
}) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [activeTab, setActiveTab] = useState<'regras' | 'adesivos' | 'locais'>('regras');

  // Return to WhatsApp group programmatically (Closed Loop Button)
  const handleReturnToWhatsApp = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      executeSecureRedirect(
        currentCity,
        {
          city: currentCity.name,
          objective: quizState.objective || 'comprar',
          searchedItem: quizState.searchedItem || 'Geral',
        },
        fingerprint || null
      );
    }, 350);
  };

  // Official 6 Group Rules from reference flyer
  const officialRules = [
    {
      num: 1,
      title: 'SEJA RESPEITOSO',
      icon: '🤝',
      desc: 'Mantenha o respeito com todos os membros. Aqui não tem espaço para ofensas, preconceito ou discriminação.',
      badge: 'RESPEITO MÚTUO',
      badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40',
    },
    {
      num: 2,
      title: 'SEM SPAM',
      icon: '🚫',
      desc: 'Não envie correntes, links suspeitos, pirâmides financeiras ou qualquer tipo de conteúdo não relacionado ao grupo.',
      badge: 'TOLERÂNCIA ZERO',
      badgeColor: 'border-red-500/40 text-red-400 bg-red-950/40',
    },
    {
      num: 3,
      title: 'ANÚNCIOS CLAROS',
      icon: '🏷️',
      desc: 'Informe corretamente o que está vendendo, trocando ou procurando. Inclua fotos reais, preço e localização no bairro.',
      badge: 'FOTO + PREÇO',
      badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-950/40',
    },
    {
      num: 4,
      title: 'NEGOCIE COM CALMA',
      icon: '💬',
      desc: 'Tire suas dúvidas, combine os detalhes e evite pressa. Negociações seguras e sem correria fazem toda a diferença.',
      badge: 'BOA CONVERSA',
      badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-950/40',
    },
    {
      num: 5,
      title: 'RESPEITE OS HORÁRIOS',
      icon: '⏰',
      desc: 'Evite enviar mensagens fora do horário comercial, principalmente à noite e na madrugada, para não atrapalhar os demais membros.',
      badge: 'SILÊNCIO NOTURNO',
      badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-950/40',
    },
    {
      num: 6,
      title: 'O ADMIN PODE INTERVIR',
      icon: '🛡️',
      desc: 'Em caso de descumprimento das regras ou suspeita de golpe, o administrador poderá remover o membro do grupo sem aviso prévio.',
      badge: 'MODERAÇÃO ATIVA',
      badgeColor: 'border-[#FFE500]/50 text-[#FFE500] bg-amber-950/40',
    },
  ];

  // Official 6 Community Mascot Cards from Reference
  const communityStickers = [
    {
      title: 'RESPEITO É TUDO!',
      icon: '👑',
      tagline: 'Trate todos bem, sem preconceito e sem ofensas. Aqui é uma comunidade!',
      accent: 'border-[#FFE500] text-[#FFE500]',
    },
    {
      title: 'SEM GOLPES',
      icon: '🚷',
      tagline: 'Desconfie de propostas muito boas, não passe dados pessoais e não clique em links suspeitos.',
      accent: 'border-red-500 text-red-400',
    },
    {
      title: 'ANÚNCIOS COM FOTO!',
      icon: '📸',
      tagline: 'Poste com foto real, descrição clara e preço justo. Isso ajuda todo mundo a fechar negócio!',
      accent: 'border-blue-400 text-blue-300',
    },
    {
      title: 'COMPRE, VENDA, TROQUE',
      icon: '🔄',
      tagline: 'Negocie com tranquilidade e sem pressa. Aqui tem papo reto e ótimas oportunidades locais!',
      accent: 'border-emerald-400 text-emerald-300',
    },
    {
      title: 'ANUNCIE SEU SERVIÇO!',
      icon: '📢',
      tagline: 'Divulgue seu produto, serviço ou empreendimento. O grupo é feito de pessoas e negócios reais!',
      accent: 'border-purple-400 text-purple-300',
    },
    {
      title: 'JUNTOS SOMOS MAIS FORTES!',
      icon: '🤝',
      tagline: 'Participe, colabore, ajude o comércio local e fortaleça a nossa comunidade metropolitana!',
      accent: 'border-[#25D366] text-[#25D366]',
    },
  ];

  const safeMeetingPoints = [
    {
      city: 'Canoas',
      points: ['Estação Trensurb Mathias Velho', 'Canoas Shopping (Praça de Alimentação)', 'Posto 24h Av. Boqueirão'],
    },
    {
      city: 'Sapucaia do Sul',
      points: ['Estação Trensurb Sapucaia', 'Praça General Freitas (Centro)', 'Av. Sapucaia (área comercial iluminada)'],
    },
    {
      city: 'Esteio',
      points: ['Estação Trensurb Esteio', 'Av. Presidente Vargas (área bancária iluminada)', 'Parque Galvany Guedes'],
    },
    {
      city: 'Cachoeirinha',
      points: ['Parque da Matriz (Área Comercial)', 'Ponte de Cachoeirinha (Posto 24h)', 'Av. Flores da Cunha (Centro)'],
    },
    {
      city: 'Porto Alegre',
      points: ['Estação Mercado / Trensurb', 'Bourbon Shopping (Ipiranga ou Wallig)', 'Rótula das Cuias / Gasômetro'],
    },
    {
      city: 'Gravataí',
      points: ['Parada 68 (Zona Comercial)', 'Parada 72 (Centro)', 'Gravataí Shopping Center'],
    },
    {
      city: 'São Leopoldo',
      points: ['Estação Trensurb São Leopoldo', 'Bourbon Shopping São Leopoldo', 'Praça do Imigrante (Rua Grande)'],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-20 px-2 sm:px-4">
      {/* Top Navigation */}
      <div className="flex items-center justify-between text-xs pt-1">
        <button
          onClick={onGoHome}
          className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
        >
          <ArrowLeft className="w-4 h-4 text-[#FFE500]" />
          <span>Voltar ao Início</span>
        </button>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40 font-bold">
          GUIA OFICIAL DA QUEBRADA
        </span>
      </div>

      {/* Main Header with Crown */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE500]/10 border border-[#FFE500]/40 text-[#FFE500] text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-[#FFE500]" />
          <span>Blindagem de Negociação • 7 Cidades</span>
        </div>
        <h1 className="font-bebas font-black text-3xl sm:text-5xl text-white tracking-wide uppercase">
          DEU<span className="text-[#FFE500]">-</span>BRICK REGRAS DO GRUPO
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 max-w-lg mx-auto font-medium">
          Aqui é respeito, confiança e boas negociações! O código oficial que protege a nossa comunidade.
        </p>
      </div>

      {/* BOTÃO INTELIGENTE DE RETORNO AO GRUPO (LOOP FECHADO) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-[#10141D] to-[#0A0D12] border-2 border-[#25D366]/50 shadow-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#25D366] font-black tracking-wider block">
              LOOP FECHADO • ACESSO RESTRITO
            </span>
            <h3 className="font-bebas font-bold text-lg sm:text-xl text-white tracking-wide">
              VOLTAR PARA O GRUPO OFICIAL DO WHATSAPP
            </h3>
          </div>

          {/* Quick city selector */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-slate-300 font-bold">Sua Cidade:</span>
            <select
              value={currentCity.name}
              onChange={(e) => {
                const found = cities.find((c) => c.name === e.target.value);
                if (found) onSelectCity(found);
              }}
              className="bg-black/90 border-2 border-[#25D366]/60 text-white rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-[#25D366]"
            >
              {cities.map((c) => (
                <option key={c.id} value={c.name} className="bg-zinc-950 text-white">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* The Smart Button with Programmatic JavaScript Cloaking */}
        <button
          type="button"
          onClick={handleReturnToWhatsApp}
          disabled={isRedirecting}
          onContextMenu={(e) => e.preventDefault()}
          className="w-full py-4 px-5 rounded-xl bg-gradient-to-r from-[#25D366] via-emerald-400 to-[#128C7E] hover:from-[#20ba59] hover:to-[#0f7a6e] text-black font-bebas font-black text-xl sm:text-2xl uppercase tracking-wider shadow-xl glow-whatsapp transition-all flex items-center justify-center gap-2.5 cursor-pointer select-none border-2 border-black active:scale-[0.99]"
        >
          {isRedirecting ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-3 border-black/30 border-t-black rounded-full animate-spin" />
              <span>RECONECTANDO AO WHATSAPP DE {currentCity.name.toUpperCase()}...</span>
            </div>
          ) : (
            <>
              <svg className="w-6 h-6 fill-black shrink-0" viewBox="0 0 24 24">
                <path d="M12.031 2C6.505 2 2.016 6.489 2.016 12.016c0 1.765.46 3.488 1.332 5.009L2 22.031l5.148-1.328a9.986 9.986 0 0 0 4.883 1.313h.004c5.526 0 10.015-4.489 10.015-10.016 0-2.678-1.043-5.197-2.936-7.09A9.95 9.95 0 0 0 12.031 2zm0 18.336h-.003a8.318 8.318 0 0 1-4.242-1.163l-.304-.18-3.156.816.844-3.076-.197-.314a8.31 8.31 0 0 1-1.272-4.403c0-4.595 3.738-8.333 8.335-8.333 2.226 0 4.318.867 5.892 2.441a8.27 8.27 0 0 1 2.44 5.895c0 4.597-3.739 8.334-8.334 8.334zm4.569-6.236c-.25-.125-1.48-.73-1.71-.813-.23-.083-.397-.125-.564.125-.167.25-.646.813-.792.98-.146.167-.292.188-.542.063s-1.057-.39-2.013-1.242c-.744-.664-1.247-1.484-1.393-1.734-.146-.25-.016-.385.109-.51.113-.112.25-.292.375-.438.125-.146.167-.25.25-.417.083-.167.042-.313-.021-.438s-.564-1.356-.772-1.856c-.203-.487-.41-.42-.564-.428-.146-.008-.313-.01-.48-.01s-.438.063-.667.313c-.23.25-.876.855-.876 2.085s.896 2.418 1.021 2.585c.125.167 1.764 2.693 4.273 3.777.597.258 1.064.412 1.428.528.6.191 1.146.164 1.578.1.481-.072 1.48-.605 1.688-1.189.208-.584.208-1.084.146-1.189-.063-.104-.23-.167-.48-.292z" />
              </svg>
              <span>VOLTAR PARA O GRUPO DE {currentCity.name.toUpperCase()}</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-slate-400">
          🔒 Redirecionamento seguro via JavaScript • Destino mascarado contra clonagem
        </p>
      </div>

      {/* TABS SELECTOR FOR MOBILE & TABLET */}
      <div className="flex rounded-xl bg-zinc-950 p-1 border border-white/10 gap-1">
        <button
          onClick={() => setActiveTab('regras')}
          className={`flex-1 py-2 px-2 rounded-lg text-xs font-bebas uppercase tracking-wide transition-all ${
            activeTab === 'regras'
              ? 'bg-[#FFE500] text-black font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          📜 6 Regras Oficiais
        </button>
        <button
          onClick={() => setActiveTab('adesivos')}
          className={`flex-1 py-2 px-2 rounded-lg text-xs font-bebas uppercase tracking-wide transition-all ${
            activeTab === 'adesivos'
              ? 'bg-[#FFE500] text-black font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          👑 Adesivos da Comunidade
        </button>
        <button
          onClick={() => setActiveTab('locais')}
          className={`flex-1 py-2 px-2 rounded-lg text-xs font-bebas uppercase tracking-wide transition-all ${
            activeTab === 'locais'
              ? 'bg-[#FFE500] text-black font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          📍 Pontos Seguros
        </button>
      </div>

      {/* OFFICIAL CAUTION WARNING BOX FROM REFERENCE */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/40 border-2 border-[#FFE500] text-slate-200 space-y-2 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          <span className="font-bebas text-lg sm:text-xl text-[#FFE500] tracking-wide uppercase font-black">
            RESPEITE ESTA REGRA FUNDAMENTAL!
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
          ISSO EVITA GOLPES, FALSOS ANÚNCIOS E MANTÉM O FOCO DO QUE REALMENTE IMPORTA: VOCÊ E SUA CIDADE! SÓ SÃO PERMITIDAS PESSOAS QUE MOREM OU TENHAM COMÉRCIO/SERVIÇO EM UM DOS BAIRROS DA CIDADE CORRESPONDENTE AO GRUPO.
        </p>
      </div>

      {/* TAB 1: 6 REGRAS OFICIAIS DO GRUPO */}
      {activeTab === 'regras' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-bebas text-xl text-white tracking-wide uppercase flex items-center gap-2">
              <BadgeAlert className="w-5 h-5 text-[#FFE500]" />
              <span>OS 6 MANDAMENTOS DO DEU-BRICK</span>
            </span>
            <span className="text-[11px] text-[#25D366] font-mono font-bold">Oficial RS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {officialRules.map((rule) => (
              <div
                key={rule.num}
                className="p-4 rounded-2xl bg-zinc-900/90 border-2 border-white/10 hover:border-[#FFE500]/60 transition-all flex flex-col justify-between space-y-3 shadow-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#FFE500] text-black font-bebas font-black text-lg flex items-center justify-center shadow-md">
                        {rule.num}
                      </div>
                      <span className="text-2xl select-none">{rule.icon}</span>
                      <h4 className="font-bebas text-lg text-white tracking-wide font-black">
                        {rule.title}
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {rule.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded border ${rule.badgeColor}`}>
                    {rule.badge}
                  </span>
                  <span className="text-[10px] text-slate-400">Regra #{rule.num}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ADESIVOS DA COMUNIDADE */}
      {activeTab === 'adesivos' && (
        <div className="space-y-4">
          {/* Banner with Stickers Graphic */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#FFE500] shadow-2xl bg-zinc-950">
            <img
              src="/images/deubrick_stickers_badge.jpg"
              alt="Adesivos Deu-Brick"
              className="w-full h-48 sm:h-64 object-cover object-center opacity-85 hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-4">
              <span className="font-bebas text-2xl sm:text-3xl text-[#FFE500] tracking-wide uppercase drop-shadow-md">
                ADESIVOS OFICIAIS DA QUEBRADA
              </span>
              <p className="text-xs text-slate-200 drop-shadow">
                Identidade autêntica • Postura e respeito nas negociações!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {communityStickers.map((sticker, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl bg-zinc-900 border-2 ${sticker.accent} space-y-2 shadow-lg flex flex-col justify-between`}
              >
                <div>
                  <div className="text-3xl select-none mb-1">{sticker.icon}</div>
                  <h4 className="font-bebas text-lg tracking-wide uppercase font-black">
                    {sticker.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    {sticker.tagline}
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Selo Comunitário</span>
                  <span className="font-bold text-[#FFE500]">DEU-BRICK</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PONTOS SEGUROS DE ENCONTRO */}
      {activeTab === 'locais' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs text-slate-300 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#25D366] shrink-0" />
            <span>
              Locais públicos recomendados para entrega, teste de aparelhos e conferência do Pix.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {safeMeetingPoints.map((item) => (
              <div
                key={item.city}
                className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-2.5 shadow-md"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <span className="font-bebas text-lg text-[#FFE500] tracking-wide uppercase font-black">
                    {item.city}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold">
                    ZONA SEGURA
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {item.points.map((pt, i) => (
                    <li key={i} className="text-xs text-slate-200 flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4 Street Action Pills matching Reference */}
      <div className="p-4 rounded-2xl bg-zinc-950 border-2 border-white/10 flex flex-wrap items-center justify-around gap-2 text-center">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 font-bebas text-sm sm:text-base">
          <span>🛒</span>
          <span>COMPRA</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/70 border border-blue-500/40 text-blue-400 font-bebas text-sm sm:text-base">
          <span>🏷️</span>
          <span>VENDA</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-400 font-bebas text-sm sm:text-base">
          <span>🔄</span>
          <span>TROCA</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/70 border border-purple-500/40 text-purple-400 font-bebas text-sm sm:text-base">
          <span>📢</span>
          <span>ANÚNCIO</span>
        </div>
      </div>
    </div>
  );
};
