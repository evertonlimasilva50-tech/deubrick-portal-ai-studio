import React, { useState } from 'react';
import {
  MapPin,
  ShoppingBag,
  Tag,
  Repeat,
  Megaphone,
  ArrowRight,
  ArrowLeft,
  Search,
  Check,
  Shield,
  Sparkles,
  ShieldCheck,
  Flame,
  Radio,
  User,
  Phone,
  Fingerprint,
} from 'lucide-react';
import { CityData, CityName, DeviceFingerprint, ObjectiveType, QuizState, TriadProfile } from '../types';
import { addTriadProfile } from '../services/storage';

interface QuizScreenProps {
  cities: CityData[];
  initialQuizState: QuizState;
  fingerprint?: DeviceFingerprint | null;
  onFinishQuiz: (finalState: QuizState) => void;
  onCancel: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  cities,
  initialQuizState,
  fingerprint = null,
  onFinishQuiz,
  onCancel,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCity, setSelectedCity] = useState<CityName | null>(initialQuizState.city);
  const [selectedObjective, setSelectedObjective] = useState<ObjectiveType | null>(
    initialQuizState.objective
  );
  const [searchedItem, setSearchedItem] = useState(initialQuizState.searchedItem || '');
  const [fullName, setFullName] = useState(initialQuizState.fullName || '');
  const [whatsapp, setWhatsapp] = useState(initialQuizState.whatsapp || '');
  const [errorMsg, setErrorMsg] = useState('');

  // Quick suggestion chips for Step 3
  const suggestionChips = [
    'iPhone / Celular',
    'Moto (CG, Biz, Fan)',
    'Carro até R$ 25k',
    'PlayStation 4 / 5',
    'Furadeira / Ferramentas',
    'Smart TV 4K',
    'Bicicleta Aro 29',
    'Geladeira / Eletro',
  ];

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(14);
      } catch {
        // ignore
      }
    }
  };

  const formatWhatsApp = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) {
      return digits ? `(${digits}` : '';
    }
    if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleNextFromStep1 = (cityName: CityName) => {
    triggerHaptic();
    setSelectedCity(cityName);
    setErrorMsg('');
    setStep(2);
  };

  const handleNextFromStep2 = (obj: ObjectiveType) => {
    triggerHaptic();
    setSelectedObjective(obj);
    setErrorMsg('');
    setStep(3);
  };

  const handleFinish = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedCity) {
      setStep(1);
      setErrorMsg('Escolha sua cidade primeiro.');
      return;
    }
    if (!selectedObjective) {
      setStep(2);
      setErrorMsg('Escolha a categoria do seu anúncio.');
      return;
    }

    // MANDATORY TRIAD AUDIT: Full Real Name (with surname)
    const trimmedName = fullName.trim();
    if (!trimmedName || trimmedName.length < 5 || !trimmedName.includes(' ')) {
      setErrorMsg('Informe seu Nome Completo (Nome e Sobrenome reais) para a Tríade de Identidade.');
      return;
    }

    // MANDATORY TRIAD AUDIT: WhatsApp Number with DDD (min 10-11 digits)
    const rawDigits = whatsapp.replace(/\D/g, '');
    if (rawDigits.length < 10) {
      setErrorMsg('Informe um número de WhatsApp válido com DDD (ex: 51 9XXXX-XXXX).');
      return;
    }

    const finalItem =
      searchedItem.trim() ||
      (selectedObjective === 'comprar'
        ? 'Barbadas em Geral'
        : selectedObjective === 'vender'
        ? 'Desapego Rápido'
        : selectedObjective === 'trocar'
        ? 'Troca Justa'
        : 'Divulgação Comercial');

    // Persist to local Triad audit database linked to Fingerprint
    const triadRecord: TriadProfile = {
      id: 'tr-' + Date.now(),
      fingerprintHash: fingerprint?.hash || 'DB-FP-TRIAD-' + Math.random().toString(16).slice(2, 6).toUpperCase(),
      fullName: trimmedName,
      whatsapp: formatWhatsApp(whatsapp),
      city: selectedCity,
      objective: selectedObjective,
      searchedItem: finalItem,
      deviceIp: fingerprint?.ipSimulated || '177.101.45.19',
      deviceInfo: `${fingerprint?.platform || 'Mobile'} • ${fingerprint?.screenResolution || '1080x1920'}`,
      riskScore: fingerprint?.riskScore || 5,
      status: 'aprovado',
      createdAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR').slice(0, 5),
    };

    addTriadProfile(triadRecord);

    triggerHaptic();
    onFinishQuiz({
      city: selectedCity,
      objective: selectedObjective,
      searchedItem: finalItem,
      fullName: trimmedName,
      whatsapp: formatWhatsApp(whatsapp),
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Tactical Progress Bar & Step Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <button
            onClick={() => {
              if (step === 1) onCancel();
              else setStep((s) => (s - 1) as 1 | 2);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer font-bold"
          >
            <ArrowLeft className="w-4 h-4 text-[#FFE500]" />
            <span>{step === 1 ? 'Início' : 'Voltar Etapa'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-stencil text-sm text-[#FFE500] tracking-wider bg-black/80 px-2.5 py-0.5 rounded border border-[#FFE500]/40">
              PASSO 0{step} / 03
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-semibold text-[11px] sm:text-xs">
              {step === 1 && 'Sua Cidade & Bairros'}
              {step === 2 && 'Categoria do Brick'}
              {step === 3 && 'Item do Anúncio'}
            </span>
          </div>
        </div>

        {/* Industrial Stencil Step Segments */}
        <div className="grid grid-cols-3 gap-2">
          <div
            className={`h-2 rounded-sm transition-all duration-300 border ${
              step >= 1
                ? 'bg-[#FFE500] border-[#FFE500] shadow-[0_0_10px_rgba(255,229,0,0.5)]'
                : 'bg-white/10 border-white/10'
            }`}
          />
          <div
            className={`h-2 rounded-sm transition-all duration-300 border ${
              step >= 2
                ? 'bg-[#FFE500] border-[#FFE500] shadow-[0_0_10px_rgba(255,229,0,0.5)]'
                : 'bg-white/10 border-white/10'
            }`}
          />
          <div
            className={`h-2 rounded-sm transition-all duration-300 border ${
              step >= 3
                ? 'bg-[#FFE500] border-[#FFE500] shadow-[0_0_10px_rgba(255,229,0,0.5)]'
                : 'bg-white/10 border-white/10'
            }`}
          />
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-950/80 border-2 border-red-500 text-xs text-red-200 font-bold animate-stencil-stamp flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: City Selection */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Header with Stencil Street Aesthetics & Negative Margin Badges */}
          <div className="text-center space-y-2 relative pt-2">
            <div className="inline-block -rotate-1 animate-stencil-stamp">
              <span className="font-stencil text-xs text-black bg-[#FFE500] px-3 py-1 rounded-sm shadow-[2px_3px_0_#000] tracking-wider uppercase font-bold">
                👑 GRUPOS OFICIAIS POR CIDADE
              </span>
            </div>

            <h2 className="font-stencil text-3xl sm:text-4xl text-white tracking-wide uppercase pt-1 text-street-3d">
              QUAL É A SUA CIDADE?
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Só é permitido entrar no grupo correspondente à sua cidade e bairros. <strong className="text-[#FFE500]">Sem atravessadores, sem golpes.</strong>
            </p>
          </div>

          {/* City Cards Grid with Negative Margins, Accented Borders & Stencil Elements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {cities.map((city, idx) => {
              const isSelected = selectedCity === city.name;
              const borderClass = city.themeColor?.border || 'border-[#FFE500]';
              const glowClass = city.themeColor?.glow || 'shadow-[#FFE500]/20';
              const bgHeaderClass = city.themeColor?.bgHeader || 'bg-[#FFE500]';

              return (
                <button
                  key={city.id}
                  onClick={() => handleNextFromStep1(city.name)}
                  style={{ animationDelay: `${idx * 60}ms` }}
                  className={`rounded-2xl border-3 text-left transition-all relative group flex flex-col justify-between overflow-visible cursor-pointer animate-slide-up-fade pt-2 ${
                    isSelected
                      ? `${borderClass} bg-zinc-900 shadow-2xl ${glowClass} scale-[1.01]`
                      : 'border-white/20 bg-[#0E121A] hover:border-[#FFE500] hover:bg-[#131824]'
                  }`}
                >
                  {/* Negative Margin Stencil Floating Badge on Top Corner */}
                  <div className="absolute -top-3.5 left-4 z-10 flex items-center gap-1.5">
                    <span className="font-stencil text-[10px] bg-black text-[#FFE500] px-2.5 py-0.5 rounded-sm border-2 border-[#FFE500] shadow-[2px_2px_0_#000] tracking-wider uppercase">
                      SETOR RS • {city.slug.toUpperCase()}
                    </span>
                  </div>

                  {/* Colored Header Tab with Stencil Typography */}
                  <div className={`mx-[-1px] mt-2 px-4 py-2.5 ${bgHeaderClass} text-black flex items-center justify-between border-y-2 border-black`}>
                    <div className="flex items-center gap-2">
                      <span className="font-stencil text-xl sm:text-2xl font-bold tracking-wide uppercase">
                        {city.name}
                      </span>
                    </div>
                    <span className="font-stencil text-[11px] bg-black text-white px-2 py-0.5 rounded-sm border border-black/40">
                      +{city.activeMembers} VIPS
                    </span>
                  </div>

                  {/* Neighborhoods List */}
                  <div className="p-4 space-y-2 flex-1">
                    <div className="flex items-start gap-1.5 text-xs text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-[#FFE500] shrink-0 mt-0.5" />
                      <p className="line-clamp-2 leading-relaxed font-medium">
                        {city.neighborhoods.slice(0, 6).join(', ')}...
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                      <span className="text-slate-400 font-mono">
                        +{city.neighborhoods.length} bairros credenciados
                      </span>
                      <span className="text-emerald-400 font-bold text-[10px] uppercase font-mono">
                        MODERADO ✓
                      </span>
                    </div>
                  </div>

                  {/* Tactical Bottom Footer with Accented Border */}
                  <div className="px-4 py-2.5 bg-black/80 border-t-2 border-white/10 flex items-center justify-between text-xs rounded-b-xl group-hover:bg-black transition-colors">
                    <span className="font-bebas text-[#FFE500] tracking-wider text-xs sm:text-sm">
                      {city.slogan || 'NOSSA CIDADE, NOSSO GRUPO!'}
                    </span>
                    <span className="font-stencil text-[11px] font-bold text-white group-hover:text-[#FFE500] transition-colors flex items-center gap-1">
                      <span>ENTRAR</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: Objective Selection (The 4 Pillars from Flyer) */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center space-y-2 relative pt-2">
            <div className="inline-block rotate-1 animate-stencil-stamp">
              <span className="font-stencil text-xs text-black bg-[#FFE500] px-3 py-1 rounded-sm shadow-[2px_3px_0_#000] tracking-wider uppercase font-bold">
                👑 DEU-BRICK CLASSIFICADOS
              </span>
            </div>

            <h2 className="font-stencil text-3xl sm:text-4xl text-white tracking-wide uppercase pt-1 text-street-3d">
              QUAL É O SEU FOCO HOJE?
            </h2>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/20 text-xs">
              <span className="text-slate-400">Cidade selecionada:</span>
              <strong className="text-[#FFE500] font-stencil tracking-wide">{selectedCity}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Compra */}
            <button
              onClick={() => handleNextFromStep2('comprar')}
              style={{ animationDelay: '50ms' }}
              className={`p-5 rounded-2xl border-3 text-left transition-all relative flex flex-col justify-between group cursor-pointer animate-slide-up-fade ${
                selectedObjective === 'comprar'
                  ? 'bg-emerald-950/60 border-[#10B981] shadow-2xl shadow-[#10B981]/30 scale-[1.01]'
                  : 'bg-[#0E121A] border-white/20 hover:border-[#10B981] hover:bg-zinc-900'
              }`}
            >
              {/* Negative Margin Badge */}
              <div className="absolute -top-3 left-4">
                <span className="font-stencil text-[10px] bg-[#10B981] text-black px-2.5 py-0.5 rounded-sm border-2 border-black font-bold tracking-wider">
                  01 • COMPRA
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="w-12 h-12 rounded-xl bg-[#10B981]/20 border-2 border-[#10B981]/50 text-[#10B981] flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-stencil text-2xl text-[#10B981] tracking-wide">
                    BARBADAS
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    PREÇO DE QUEBRADA
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed font-medium">
                Encontre o que precisa e faça bons negócios com moradores da sua região, sem atravessador.
              </p>

              <div className="mt-4 pt-2.5 border-t-2 border-white/10 flex items-center justify-between text-xs font-stencil">
                <span className="text-slate-400 group-hover:text-white transition-colors">BUSCAR OFERTAS</span>
                <ArrowRight className="w-4 h-4 text-[#10B981] group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Venda */}
            <button
              onClick={() => handleNextFromStep2('vender')}
              style={{ animationDelay: '100ms' }}
              className={`p-5 rounded-2xl border-3 text-left transition-all relative flex flex-col justify-between group cursor-pointer animate-slide-up-fade ${
                selectedObjective === 'vender'
                  ? 'bg-sky-950/60 border-[#00B4D8] shadow-2xl shadow-[#00B4D8]/30 scale-[1.01]'
                  : 'bg-[#0E121A] border-white/20 hover:border-[#00B4D8] hover:bg-zinc-900'
              }`}
            >
              <div className="absolute -top-3 left-4">
                <span className="font-stencil text-[10px] bg-[#00B4D8] text-black px-2.5 py-0.5 rounded-sm border-2 border-black font-bold tracking-wider">
                  02 • VENDA
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="w-12 h-12 rounded-xl bg-[#00B4D8]/20 border-2 border-[#00B4D8]/50 text-[#00B4D8] flex items-center justify-center shrink-0">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-stencil text-2xl text-[#00B4D8] tracking-wide">
                    DESAPEGO
                  </h3>
                  <span className="text-[10px] font-mono text-sky-400 font-bold">
                    PIX OU DINHEIRO VIVO
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed font-medium">
                Postou, vendeu! Mostre seus produtos com fotos reais e receba direto no Pix no mesmo dia.
              </p>

              <div className="mt-4 pt-2.5 border-t-2 border-white/10 flex items-center justify-between text-xs font-stencil">
                <span className="text-slate-400 group-hover:text-white transition-colors">ANUNCIAR PRODUTO</span>
                <ArrowRight className="w-4 h-4 text-[#00B4D8] group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Troca */}
            <button
              onClick={() => handleNextFromStep2('trocar')}
              style={{ animationDelay: '150ms' }}
              className={`p-5 rounded-2xl border-3 text-left transition-all relative flex flex-col justify-between group cursor-pointer animate-slide-up-fade ${
                selectedObjective === 'trocar'
                  ? 'bg-amber-950/60 border-[#F77F00] shadow-2xl shadow-[#F77F00]/30 scale-[1.01]'
                  : 'bg-[#0E121A] border-white/20 hover:border-[#F77F00] hover:bg-zinc-900'
              }`}
            >
              <div className="absolute -top-3 left-4">
                <span className="font-stencil text-[10px] bg-[#F77F00] text-black px-2.5 py-0.5 rounded-sm border-2 border-black font-bold tracking-wider">
                  03 • TROCA
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="w-12 h-12 rounded-xl bg-[#F77F00]/20 border-2 border-[#F77F00]/50 text-[#F77F00] flex items-center justify-center shrink-0">
                  <Repeat className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-stencil text-2xl text-[#F77F00] tracking-wide">
                    BRICK DIRETO
                  </h3>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">
                    PAU A PAU OU COM VOLTA
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed font-medium">
                Troque o que está parado por algo que você precisa agora. Negociação justa e transparente.
              </p>

              <div className="mt-4 pt-2.5 border-t-2 border-white/10 flex items-center justify-between text-xs font-stencil">
                <span className="text-slate-400 group-hover:text-white transition-colors">PROPOR BRICK</span>
                <ArrowRight className="w-4 h-4 text-[#F77F00] group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Anúncio */}
            <button
              onClick={() => handleNextFromStep2('anunciar')}
              style={{ animationDelay: '200ms' }}
              className={`p-5 rounded-2xl border-3 text-left transition-all relative flex flex-col justify-between group cursor-pointer animate-slide-up-fade ${
                selectedObjective === 'anunciar'
                  ? 'bg-purple-950/60 border-[#8338EC] shadow-2xl shadow-[#8338EC]/30 scale-[1.01]'
                  : 'bg-[#0E121A] border-white/20 hover:border-[#8338EC] hover:bg-zinc-900'
              }`}
            >
              <div className="absolute -top-3 left-4">
                <span className="font-stencil text-[10px] bg-[#8338EC] text-white px-2.5 py-0.5 rounded-sm border-2 border-black font-bold tracking-wider">
                  04 • TRAMPO
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="w-12 h-12 rounded-xl bg-[#8338EC]/20 border-2 border-[#8338EC]/50 text-[#9D4EDD] flex items-center justify-center shrink-0">
                  <Megaphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-stencil text-2xl text-[#9D4EDD] tracking-wide">
                    SERVIÇOS
                  </h3>
                  <span className="text-[10px] font-mono text-purple-300 font-bold">
                    COMÉRCIO & MÃO DE OBRA
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed font-medium">
                Divulgue sua profissão, frete, consertos ou comércio para milhares de vizinhos reais.
              </p>

              <div className="mt-4 pt-2.5 border-t-2 border-white/10 flex items-center justify-between text-xs font-stencil">
                <span className="text-slate-400 group-hover:text-white transition-colors">DIVULGAR TRAMPO</span>
                <ArrowRight className="w-4 h-4 text-[#9D4EDD] group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Tríade de Identidade & Item de Interesse */}
      {step === 3 && (
        <form onSubmit={handleFinish} className="space-y-6 animate-slide-up-fade">
          <div className="text-center space-y-2 relative pt-2">
            <div className="inline-block -rotate-1 animate-stencil-stamp">
              <span className="font-stencil text-xs text-black bg-[#FFE500] px-3 py-1 rounded-sm shadow-[2px_3px_0_#000] tracking-wider uppercase font-bold">
                👑 TRÍADE DE IDENTIDADE & ANÚNCIO
              </span>
            </div>

            <h2 className="font-stencil text-2xl sm:text-4xl text-white tracking-wide uppercase pt-1 text-street-3d">
              CADASTRO DO MORADOR & ITEM
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              Para manter o grupo 100% blindado contra golpistas, preencha seus dados reais para emissão da credencial VIP.
            </p>
          </div>

          {/* Item / Desapego Input */}
          <div className="space-y-3 pt-1">
            <label className="block text-xs font-stencil text-slate-300 uppercase tracking-wide">
              1. O que você procura, vende ou troca hoje? *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#FFE500]">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchedItem}
                onChange={(e) => setSearchedItem(e.target.value)}
                placeholder="Ex: iPhone 13, Titan 160, PlayStation 5, Furadeira..."
                className="w-full pl-12 pr-4 py-3.5 bg-[#0E121A] border-3 border-white/20 focus:border-[#FFE500] rounded-2xl text-white placeholder-slate-500 text-sm sm:text-base font-bold focus:outline-none transition-all shadow-xl"
              />
            </div>

            {/* Quick Chips with Stencil Badges */}
            <div className="space-y-1.5 pt-1">
              <span className="font-stencil text-[11px] text-[#FFE500] block tracking-wide">
                ⚡ SUGESTÕES RÁPIDAS DA QUEBRADA:
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestionChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setSearchedItem(chip)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                      searchedItem === chip
                        ? 'bg-[#FFE500] text-black border-[#FFE500] shadow-md font-stencil tracking-wider'
                        : 'bg-[#0E121A] border-white/10 text-slate-300 hover:bg-zinc-800 hover:border-white/30'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* TRÍADE DE IDENTIDADE CONTAINER */}
          <div className="relative bracket-box p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#121620] via-black to-[#0E121A] border-3 border-[#FFE500] shadow-2xl space-y-4">
            {/* Top Negative Margin Badge */}
            <div className="absolute -top-3.5 left-4 z-10 flex items-center gap-1.5">
              <span className="font-stencil text-[10px] bg-[#FFE500] text-black px-2.5 py-0.5 rounded-sm border-2 border-black font-black tracking-wider uppercase shadow-[2px_2px_0_#000]">
                🔒 TRÍADE ANTIFRAUDE OBRIGATÓRIA
              </span>
            </div>

            <div className="pt-1">
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Dados vinculados de forma criptográfica ao seu terminal para auditoria interna da moderação.
              </p>
            </div>

            {/* Field: Nome Completo (Nome Real) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-stencil text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#FFE500]" />
                  <span>Nome Completo (Nome Real) *</span>
                </label>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  {fullName.trim().includes(' ') && fullName.trim().length >= 5 ? '✓ VÁLIDO' : 'OBRIGATÓRIO'}
                </span>
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Carlos Eduardo de Oliveira"
                className="w-full px-4 py-3 bg-black/80 border-2 border-white/20 focus:border-[#FFE500] rounded-xl text-white placeholder-slate-500 text-sm font-bold focus:outline-none transition-all"
                required
              />
              <span className="text-[10px] text-slate-400 block font-medium">
                Informe nome e sobrenome como constam nos seus comprovantes de Pix.
              </span>
            </div>

            {/* Field: WhatsApp com DDD */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-stencil text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Número de WhatsApp com DDD *</span>
                </label>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  {whatsapp.replace(/\D/g, '').length >= 10 ? '✓ VÁLIDO' : 'DDD + NÚMERO'}
                </span>
              </div>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(formatWhatsApp(e.target.value))}
                placeholder="(51) 99876-5432"
                maxLength={15}
                className="w-full px-4 py-3 bg-black/80 border-2 border-white/20 focus:border-[#25D366] rounded-xl text-white placeholder-slate-500 text-sm font-bold focus:outline-none transition-all font-mono"
                required
              />
              <span className="text-[10px] text-slate-400 block font-medium">
                Número do seu aplicativo de WhatsApp onde você receberá autorização no grupo.
              </span>
            </div>

            {/* Live Triad Verification Footprint Strip */}
            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <Fingerprint className="w-3.5 h-3.5 text-[#FFE500]" />
                TERMINAL HASH:
              </span>
              <span className="text-emerald-400 font-bold">
                {fingerprint?.hash || 'DB-FP-METRO-RS'}
              </span>
            </div>
          </div>

          {/* Tactical Summary Pass with Stencil Borders & Corner Brackets */}
          <div className="bracket-box p-4 rounded-xl bg-black/80 border-3 border-[#FFE500]/50 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-300 border-b border-white/10 pb-2">
              <span className="font-stencil text-[11px] text-slate-400">CIDADE DESTINO:</span>
              <span className="font-stencil text-white text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#FFE500]" />
                {selectedCity} - RS
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="font-stencil text-[11px] text-slate-400">MODALIDADE:</span>
              <span className="font-stencil text-[#FFE500] text-sm">
                {selectedObjective === 'comprar'
                  ? '🛒 COMPRA DE BARBADA'
                  : selectedObjective === 'vender'
                  ? '🏷️ VENDA / DESAPEGO'
                  : selectedObjective === 'trocar'
                  ? '🔄 TROCA JUSTA'
                  : '📢 ANÚNCIO DE SERVIÇO'}
              </span>
            </div>
          </div>

          {/* Tactical Advance Button with Stencil Typography */}
          <button
            type="submit"
            className="w-full py-4.5 px-6 rounded-2xl bg-[#FFE500] hover:bg-[#FFE500]/90 text-black font-stencil text-xl sm:text-2xl uppercase tracking-wider shadow-[0_0_25px_rgba(255,229,0,0.4)] border-3 border-black transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-[0.98]"
          >
            <span>CONCLUIR TRIAGEM & LIBERAR ACESSO</span>
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </button>
        </form>
      )}
    </div>
  );
};
