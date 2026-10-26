import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Flame,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio,
  MapPin,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2,
  Users,
  ShoppingBag,
  Tag,
  Repeat,
  Megaphone,
  AlertTriangle,
  ShieldAlert,
  Zap,
  Smartphone,
  Ban,
  DollarSign,
  TrendingUp,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { CityData } from '../types';
import { CrownLogo } from './CrownLogo';

interface WelcomeScreenProps {
  onStartQuiz: () => void;
  cities: CityData[];
  onOpenReport: () => void;
  onSelectCityDirect?: (city: CityData) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartQuiz,
  cities,
  onOpenReport,
  onSelectCityDirect,
}) => {
  const [activeUsersCount, setActiveUsersCount] = useState(1420);
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeChannel, setActiveChannel] = useState<0 | 1 | 2>(0);
  const [radarSec, setRadarSec] = useState(0);
  const [activeFlyerTab, setActiveFlyerTab] = useState<'manifesto1' | 'manifesto2' | 'manifesto3'>('manifesto1');
  const [selectedFilterCity, setSelectedFilterCity] = useState<string>('all');
  const [expandedCityId, setExpandedCityId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsersCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(1390, Math.min(1510, prev + delta));
      });
      setRadarSec((s) => (s + 1) % 60);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const videoChannels = [
    {
      id: 'pix',
      title: 'Varredura de Comprovantes Pix',
      location: 'Canoas • Mathias Velho / Guajuviras',
      status: 'AUDITORIA ATIVA',
      scannedTarget: 'Pix R$ 1.850 (iPhone 12)',
      result: 'BLOQUEADO: Agendamento Falso Detectado',
      accentColor: 'text-red-400 border-red-500/40 bg-red-950/40',
      badge: 'GOLPE INTERCEPTADO',
      bgGrad: 'from-red-950/40 via-black to-slate-950',
    },
    {
      id: 'meeting',
      title: 'Ponto Seguro de Encontro',
      location: 'Esteio • Estação Trensurb',
      status: 'TRANSPARÊNCIA TOTAL',
      scannedTarget: 'Troca de Console PS4 por Dinheiro',
      result: 'APROVADO: Negociação em Ponto de Alto Fluxo',
      accentColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
      badge: 'ZONA BLINDADA',
      bgGrad: 'from-emerald-950/40 via-black to-slate-950',
    },
    {
      id: 'imei',
      title: 'Checagem de Procedência de Moto/Celular',
      location: 'Sapucaia • Nova Sapucaia / Vargas',
      status: 'VERIFICAÇÃO DE CHASSI',
      scannedTarget: 'Honda CG 160 Titan 2021',
      result: 'APROVADO: Sem Restrição / Documentação OK',
      accentColor: 'text-[#FFE500] border-[#FFE500]/40 bg-amber-950/40',
      badge: 'PROCEDÊNCIA ATESTADA',
      bgGrad: 'from-amber-950/40 via-black to-slate-950',
    },
  ];

  const currentChannelData = videoChannels[activeChannel];

  const filteredCities = selectedFilterCity === 'all'
    ? cities
    : cities.filter((c) => c.id === selectedFilterCity || c.name.toLowerCase() === selectedFilterCity.toLowerCase());

  // Landmarks mapping from uploaded Image 1 & 3
  const cityLandmarks: Record<string, string> = {
    'canoas': 'Praça do Avião & Mathias Velho',
    'porto-alegre': 'Orla do Guaíba & Monumento ao Laçador',
    'esteio': 'Parque Assis Brasil & Touro de Esteio',
    'sapucaia': 'Morro das Cabras & Letreiro Sapucaia',
    'cachoeirinha': 'Parque da Matriz & Ponte Histórica',
    'gravatai': 'Praça Central & Prefeitura de Gravataí',
    'sao-leopoldo': 'Museu do Trem & Ponte de Ferro',
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-20 px-2 sm:px-4 max-w-4xl mx-auto">
      {/* Top Caution Tape Header Divider */}
      <div className="h-3 w-full caution-stripes rounded-sm shadow-md" />

      {/* Top Street Banner & Crown Identity */}
      <div className="text-center space-y-3 pt-1">
        {/* Urgent Warning Ribbon from Flyer */}
        <div className="inline-block transform -rotate-1 shadow-xl max-w-full">
          <div className="bg-[#EF233C] text-white px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-black tracking-wider uppercase flex items-center justify-center gap-1.5 sm:gap-2 border-2 border-black rounded-sm">
            <span className="text-base select-none shrink-0">⚠️</span>
            <span className="truncate">AVISO URGENTE PARA MORADORES & VENDEDORES LOCAIS!</span>
          </div>
        </div>

        {/* Crown & Deu-Brick Main Street Logo */}
        <div className="pt-2">
          <CrownLogo size="xl" showSubtitle={true} />
        </div>

        {/* Dynamic Scarcity & Traffic Counter */}
        <div className="pt-1 flex items-center justify-center gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-black/90 border-2 border-[#FFE500] text-[#FFE500] font-semibold shadow-inner max-w-full">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]"></span>
            </span>
            <span className="font-mono font-bold text-white whitespace-nowrap">
              +{activeUsersCount.toLocaleString('pt-BR')}
            </span>
            <span className="text-slate-200 text-[11px] sm:text-xs">
              moradores ativos negociando esta semana
            </span>
          </div>
        </div>
      </div>

      {/* MOBILE & TABLET HERO POSTER CARD */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-[#FFE500] shadow-[0_10px_35px_rgba(255,229,0,0.15)] bg-zinc-950">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          {/* Mobile Image Poster Area */}
          <div className="md:col-span-5 relative h-72 sm:h-80 md:h-full min-h-[300px] overflow-hidden bg-black">
            <img
              src="/images/deubrick_mobile_hero.jpg"
              alt="Deu Brick Classificados Urbanos"
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-zinc-950" />
            
            {/* Top Badge overlay */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-[#FFE500] text-[#FFE500] text-xs font-black tracking-wider uppercase font-bebas">
              <span>🔥 100% FEITO PRA RUA</span>
            </div>
            
            {/* Bottom Overlay on Mobile */}
            <div className="absolute bottom-3 left-3 right-3 md:hidden bg-black/85 backdrop-blur-md p-2.5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
              <span className="font-bebas text-sm text-[#25D366] tracking-wide uppercase font-bold">
                ✓ SEM ATRAVESSADOR
              </span>
              <span className="font-bebas text-sm text-[#FFE500] tracking-wide uppercase font-bold">
                ✓ NEGÓCIO DIRETO
              </span>
            </div>
          </div>

          {/* Hero Content Area */}
          <div className="md:col-span-7 p-5 sm:p-7 space-y-4 text-center md:text-left">
            <div className="inline-block marker-highlight text-lg sm:text-2xl font-bebas uppercase tracking-wide">
              CHEGA DE PERDER TEMPO NO CONCORRENTE, VEM PRO BRICK REAL!
            </div>

            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              Tá precisando desapegar daquele troço parado em casa pra fazer um dinheiro extra? Ou procurando um desapego bom e barato na nossa cidade sem ter que pagar frete caro?
            </p>

            {/* 4 ICON TILES FROM FLYER 1 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-black/80 border border-[#FFE500]/50 flex flex-col items-center text-center">
                <span className="text-xl">📍</span>
                <span className="font-bebas text-xs sm:text-sm text-[#FFE500] tracking-wider uppercase font-black">
                  NEGÓCIO LOCAL
                </span>
                <span className="text-[9px] text-slate-400">Na sua cidade</span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/80 border border-[#FFE500]/50 flex flex-col items-center text-center">
                <span className="text-xl">🚫</span>
                <span className="font-bebas text-xs sm:text-sm text-[#FFE500] tracking-wider uppercase font-black">
                  SEM GOLPE
                </span>
                <span className="text-[9px] text-slate-400">Blindado e moderado</span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/80 border border-[#FFE500]/50 flex flex-col items-center text-center">
                <span className="text-xl">💵</span>
                <span className="font-bebas text-xs sm:text-sm text-[#FFE500] tracking-wider uppercase font-black">
                  PIX OU DINHEIRO
                </span>
                <span className="text-[9px] text-slate-400">Direto com o dono</span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/80 border border-[#FFE500]/50 flex flex-col items-center text-center">
                <span className="text-xl">🛡️</span>
                <span className="font-bebas text-xs sm:text-sm text-[#FFE500] tracking-wider uppercase font-black">
                  MONITORADO
                </span>
                <span className="text-[9px] text-slate-400">Triagem antifraude</span>
              </div>
            </div>

            {/* GIANT ACTION BUTTON */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={onStartQuiz}
                className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-[#25D366] via-emerald-400 to-[#128C7E] hover:from-[#20ba59] hover:to-[#0f7a6e] text-black font-bebas font-black text-2xl sm:text-3xl uppercase tracking-wider shadow-2xl glow-whatsapp transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer select-none border-2 border-black"
              >
                <span>ENTRAR NO GRUPO DA MINHA CIDADE</span>
                <ArrowRight className="w-7 h-7 stroke-[3] shrink-0" />
              </button>
              <div className="flex items-center justify-between text-[11px] text-slate-300 px-1">
                <span className="text-[#FFE500] font-bold">⚡ Vagas Limitadas por Cidade</span>
                <span>🔒 Acesso 100% Gratuito</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FLYER MANIFESTO TABS (MARKETPLACE VS DEU-BRICK COMPARISON) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bebas text-xl tracking-wider text-[#FFE500] uppercase flex items-center gap-2">
            <span>🔥 POR QUE O DEU-BRICK MUDA O JOGO?</span>
          </span>
          <span className="text-[11px] text-slate-400 hidden xs:inline">Toque para ver:</span>
        </div>

        {/* Tabs Bar with mobile touch optimization */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveFlyerTab('manifesto1')}
            className={`py-2.5 px-2 rounded-xl border-2 text-xs sm:text-sm font-bebas uppercase tracking-wide transition-all ${
              activeFlyerTab === 'manifesto1'
                ? 'bg-[#FFE500] text-black border-[#FFE500] shadow-lg font-black'
                : 'bg-zinc-900 text-slate-300 border-white/10 hover:border-white/30'
            }`}
          >
            1. Face Travando?
          </button>
          <button
            type="button"
            onClick={() => setActiveFlyerTab('manifesto2')}
            className={`py-2.5 px-2 rounded-xl border-2 text-xs sm:text-sm font-bebas uppercase tracking-wide transition-all ${
              activeFlyerTab === 'manifesto2'
                ? 'bg-[#FFE500] text-black border-[#FFE500] shadow-lg font-black'
                : 'bg-zinc-900 text-slate-300 border-white/10 hover:border-white/30'
            }`}
          >
            2. Só Curioso?
          </button>
          <button
            type="button"
            onClick={() => setActiveFlyerTab('manifesto3')}
            className={`py-2.5 px-2 rounded-xl border-2 text-xs sm:text-sm font-bebas uppercase tracking-wide transition-all ${
              activeFlyerTab === 'manifesto3'
                ? 'bg-[#FFE500] text-black border-[#FFE500] shadow-lg font-black'
                : 'bg-zinc-900 text-slate-300 border-white/10 hover:border-white/30'
            }`}
          >
            3. Postou, Vendeu!
          </button>
        </div>

        {/* Tab 1 Content: Marketplace Travando (Flyer 2) */}
        {activeFlyerTab === 'manifesto1' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border-2 border-red-500/40 space-y-3">
            <div className="inline-block marker-alert text-sm sm:text-base font-bebas uppercase">
              NINGUÉM MAIS AGUENTA O MARKETPLACE TRAVANDO TUDO!
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Você quer vender rápido pra pagar uma conta e o anúncio fica em análise por dias? No Facebook, eles cortaram o alcance orgânico pra te forçar a pagar anúncios caros. 
            </p>
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center gap-3">
              <span className="text-2xl shrink-0">⚡</span>
              <div>
                <strong className="text-[#FFE500] font-bebas text-base uppercase block">
                  VAMOS FACILITAR A VIDA!
                </strong>
                <span className="text-xs text-slate-300">
                  Todo mundo usa o Zap o dia inteiro. No Deu-Brick, as ofertas caem direto no celular de compradores reais da sua cidade. Negócio rápido e sem intermediário!
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2 Content: Cansado de Curioso (Flyer 3) */}
        {activeFlyerTab === 'manifesto2' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border-2 border-amber-500/40 space-y-3">
            <div className="inline-block marker-highlight text-sm sm:text-base font-bebas uppercase">
              CANSADO DE ANUNCIAR E SÓ APARECER CURIOSO?
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Você posta aquela roupa, celular ou bike baratinha e a única coisa que recebe é: <span className="italic text-amber-300 font-semibold">"Ainda está disponível?"</span> e depois a pessoa te deixa no vácuo?
            </p>
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center gap-3">
              <span className="text-2xl shrink-0">🤝</span>
              <div>
                <strong className="text-[#25D366] font-bebas text-base uppercase block">
                  BORA SAIR DESSA ENROLAÇÃO!
                </strong>
                <span className="text-xs text-slate-300">
                  Aqui é grupo de desapego de verdade, povão, direto com o dono e sem frescura. Respeito mútuo e quem chama é pra fechar negócio!
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3 Content: Postou Vendeu (Flyer 5 & 6) */}
        {activeFlyerTab === 'manifesto3' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border-2 border-emerald-500/40 space-y-3">
            <div className="inline-block bg-[#25D366] text-black px-2 py-0.5 text-sm sm:text-base font-bebas uppercase font-black transform -rotate-1">
              SEM FILTRO DE ALGORITMO, SEM MENSAGENS FANTASMA!
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              No Grupo de Whats (DEU-BRICK), o seu produto cai direto na tela de centenas de moradores da sua cidade no mesmo minuto. 
            </p>
            <div className="p-3 rounded-xl bg-black/60 border border-emerald-500/30 flex items-center gap-3">
              <span className="text-2xl shrink-0">💰</span>
              <div>
                <strong className="text-[#FFE500] font-bebas text-lg uppercase block">
                  POSTOU, VENDEU, PEGOU O DINHEIRO NA MÃO!
                </strong>
                <span className="text-xs text-slate-300">
                  Liberdade total pro comércio da quebrada. Juntos somos mais fortes!
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4 MODES OF DEU-BRICK (COMPRA, VENDA, TROCA, ANÚNCIO) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bebas text-xl tracking-wider text-white uppercase flex items-center gap-2">
            <span>📢 O QUE ROLA NO DEU-BRICK?</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Compra */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-900 border-2 border-emerald-500/40 space-y-1 hover:border-emerald-400 transition-all text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-[#25D366] flex items-center justify-center font-black">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="font-bebas text-lg text-[#25D366] tracking-wide block">
              COMPRA
            </span>
            <p className="text-[11px] text-slate-300 leading-tight font-medium">
              Ache barbadas na sua rua sem pagar frete.
            </p>
          </div>

          {/* Venda */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-900 border-2 border-[#00B4D8]/40 space-y-1 hover:border-[#00B4D8] transition-all text-left">
            <div className="w-10 h-10 rounded-xl bg-[#00B4D8]/20 text-[#00B4D8] flex items-center justify-center font-black">
              <Tag className="w-5 h-5" />
            </div>
            <span className="font-bebas text-lg text-[#00B4D8] tracking-wide block">
              VENDA
            </span>
            <p className="text-[11px] text-slate-300 leading-tight font-medium">
              Desapego rápido pra fazer dinheiro no mesmo dia.
            </p>
          </div>

          {/* Troca */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-900 border-2 border-[#F77F00]/40 space-y-1 hover:border-[#F77F00] transition-all text-left">
            <div className="w-10 h-10 rounded-xl bg-[#F77F00]/20 text-[#F77F00] flex items-center justify-center font-black">
              <Repeat className="w-5 h-5" />
            </div>
            <span className="font-bebas text-lg text-[#F77F00] tracking-wide block">
              TROCA
            </span>
            <p className="text-[11px] text-slate-300 leading-tight font-medium">
              Troque o que tá parado por algo que você precisa.
            </p>
          </div>

          {/* Anúncio */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-900 border-2 border-[#8338EC]/40 space-y-1 hover:border-[#8338EC] transition-all text-left">
            <div className="w-10 h-10 rounded-xl bg-[#8338EC]/20 text-[#9D4EDD] flex items-center justify-center font-black">
              <Megaphone className="w-5 h-5" />
            </div>
            <span className="font-bebas text-lg text-[#9D4EDD] tracking-wide block">
              ANÚNCIO
            </span>
            <p className="text-[11px] text-slate-300 leading-tight font-medium">
              Divulgue seu trampo, prestação de serviço ou loja.
            </p>
          </div>
        </div>
      </div>

      {/* GRUPOS POR CIDADE E BAIRRO - METROPOLITAN GRID COM FILTROS */}
      <div className="space-y-4 pt-2">
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFE500] text-black font-bebas text-lg sm:text-xl uppercase tracking-wider font-black shadow-md">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>GRUPOS POR CIDADE E BAIRRO NA REGIÃO!</span>
          </div>
          <p className="text-xs text-slate-300 max-w-lg mx-auto font-medium">
            Você só pode participar do grupo da sua cidade e do seu bairro. Isso mantém os anúncios relevantes e seguros para todos!
          </p>
        </div>

        {/* Quick Filter Horizontal Scrollbar for Mobile / Tablet */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none px-1">
          <button
            type="button"
            onClick={() => setSelectedFilterCity('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bebas uppercase tracking-wide whitespace-nowrap transition-all border ${
              selectedFilterCity === 'all'
                ? 'bg-[#FFE500] text-black border-[#FFE500] font-black shadow-md'
                : 'bg-zinc-900 text-slate-300 border-white/10 hover:border-white/30'
            }`}
          >
            Todas as Cidades ({cities.length})
          </button>
          {cities.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => setSelectedFilterCity(city.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bebas uppercase tracking-wide whitespace-nowrap transition-all border ${
                selectedFilterCity === city.id
                  ? 'bg-[#25D366] text-black border-[#25D366] font-black shadow-md'
                  : 'bg-zinc-900 text-slate-300 border-white/10 hover:border-white/30'
              }`}
            >
              📍 {city.name}
            </button>
          ))}
        </div>

        {/* City Cards Grid (1-col on mobile, 2-col on tablet, 3-col on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredCities.map((city) => {
            const borderClass = city.themeColor?.border || 'border-[#FFE500]';
            const bgHeaderClass = city.themeColor?.bgHeader || 'bg-[#FFE500]';
            const landmark = cityLandmarks[city.id] || 'Comércio Local & Bairros';
            const isExpanded = expandedCityId === city.id;

            return (
              <div
                key={city.id}
                className={`rounded-2xl bg-zinc-900 border-2 ${borderClass} overflow-hidden shadow-xl flex flex-col justify-between group hover:scale-[1.01] transition-all`}
              >
                {/* Card Header Bar with City Name */}
                <div className={`${bgHeaderClass} text-black font-bebas text-xl px-4 py-2 flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className="tracking-wide uppercase font-black text-xl">
                      {city.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold bg-black/25 px-2 py-0.5 rounded text-black">
                    {city.activeOffers || 150} ofertas
                  </span>
                </div>

                {/* Landmark badge */}
                <div className="px-4 pt-3 pb-1 flex items-center gap-1.5 text-xs text-[#FFE500] font-bebas tracking-wide">
                  <span>🏛️ {landmark}</span>
                </div>

                {/* Neighborhoods list with expand option */}
                <div className="px-4 py-2 space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Bairros Atendidos ({city.neighborhoods.length}):
                    </span>
                    <button
                      type="button"
                      onClick={() => setExpandedCityId(isExpanded ? null : city.id)}
                      className="text-[10px] text-[#FFE500] hover:underline font-bold"
                    >
                      {isExpanded ? 'Recolher' : 'Ver todos'}
                    </button>
                  </div>

                  <p className={`text-xs text-slate-200 leading-relaxed font-medium transition-all ${
                    isExpanded ? '' : 'line-clamp-2'
                  }`}>
                    {city.neighborhoods.join(', ')}.
                  </p>
                </div>

                {/* City Slogan Banner & Direct Entry Button */}
                <div className="px-4 py-2.5 bg-black/80 border-t border-white/5 flex items-center justify-between text-xs gap-2">
                  <span className="font-bebas text-[#FFE500] tracking-wider uppercase text-xs sm:text-sm truncate">
                    {city.slogan || 'NOSSA CIDADE, NOSSO GRUPO!'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectCityDirect) {
                        onSelectCityDirect(city);
                      } else {
                        onStartQuiz();
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-emerald-400 text-black font-bebas font-black text-xs sm:text-sm transition-all uppercase cursor-pointer shrink-0 shadow-md active:scale-95 flex items-center gap-1"
                  >
                    <span>Entrar</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RESPONSIVE MEDIA SCANNER SIMULATING INTERNAL MODERATION */}
      <div className="relative rounded-2xl bg-[#0F131A] border-2 border-[#FFE500]/50 overflow-hidden shadow-2xl">
        {/* Top Player Chrome */}
        <div className="bg-black/95 px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-[#FFE500]" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-300 font-mono text-[11px] ml-2 font-bold truncate">
              RADAR DEU-BRICK • AUDITORIA AO VIVO
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-[#25D366] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1 font-bold">
              <Radio className="w-3 h-3 animate-spin shrink-0" />
              CANAL 0{activeChannel + 1}
            </span>
          </div>
        </div>

        {/* Video Canvas Simulation Area */}
        <div className={`relative h-56 sm:h-64 w-full bg-gradient-to-b ${currentChannelData.bgGrad} flex flex-col justify-between p-4 overflow-hidden`}>
          <div className="absolute inset-0 bg-asfalto opacity-60 pointer-events-none" />
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#25D366] to-transparent opacity-75 animate-scanline pointer-events-none" />

          {/* Top Video Overlay Information */}
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-1">
              <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${currentChannelData.accentColor}`}>
                {currentChannelData.badge}
              </span>
              <h4 className="text-white font-bebas text-lg sm:text-2xl drop-shadow tracking-wide">
                {currentChannelData.title}
              </h4>
              <p className="text-xs text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#25D366]" />
                {currentChannelData.location}
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-white font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>REC 00:{radarSec < 10 ? `0${radarSec}` : radarSec}</span>
            </div>
          </div>

          {/* Central Holographic HUD Graphic */}
          <div className="relative z-10 my-auto text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/90 border border-[#FFE500]/40 backdrop-blur-md max-w-full">
              <ShieldCheck className="w-5 h-5 text-[#25D366] shrink-0" />
              <div className="text-left truncate">
                <div className="text-[10px] text-slate-400 font-mono">ALVO INSPECIONADO:</div>
                <div className="text-xs sm:text-sm font-bold text-white font-mono truncate">
                  {currentChannelData.scannedTarget}
                </div>
              </div>
            </div>

            <div className="block">
              <span className="inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-black/95 border border-[#FFE500] text-[#FFE500] shadow-lg">
                👉 {currentChannelData.result}
              </span>
            </div>
          </div>

          {/* Bottom Player Controls */}
          <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 bg-black/70 backdrop-blur-md -mx-4 -mb-4 px-4 py-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title={isPlayingVideo ? 'Pausar' : 'Reproduzir'}
              >
                {isPlayingVideo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title={isMuted ? 'Ativar Áudio' : 'Mutar'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#25D366]" />}
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveChannel(idx as 0 | 1 | 2)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                    activeChannel === idx
                      ? 'bg-[#FFE500] text-black shadow-md font-black'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  CAM 0{idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Caution Tape Bottom Footer Divider */}
      <div className="h-3 w-full caution-stripes rounded-sm shadow-md" />
    </div>
  );
};
