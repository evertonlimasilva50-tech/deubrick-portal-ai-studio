import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Upload,
  CheckCircle2,
  X,
  ArrowLeft,
  Lock,
  Phone,
  FileText,
  MapPin,
  Check,
} from 'lucide-react';
import { CityData, CityName, DeviceFingerprint, QuizState, ReportItem } from '../types';
import { getReports, saveReports } from '../services/storage';
import { executeSecureRedirect } from '../services/cloaking';

interface ReportScreenProps {
  currentCity: CityData;
  cities: CityData[];
  onSelectCity: (city: CityData) => void;
  fingerprint?: DeviceFingerprint | null;
  quizState: QuizState;
  onGoHome: () => void;
}

export const ReportScreen: React.FC<ReportScreenProps> = ({
  currentCity,
  cities,
  onSelectCity,
  fingerprint,
  quizState,
  onGoHome,
}) => {
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState<CityName>(currentCity.name);
  const [scamType, setScamType] = useState<ReportItem['scamType']>('Pix Falso / Comprovante Agendado');
  const [description, setDescription] = useState('');
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Return to WhatsApp programmatically (Closed Loop Button)
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

  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) {
      setPhone(digits ? `(${digits}` : '');
    } else if (digits.length <= 7) {
      setPhone(`(${digits.slice(0, 2)}) ${digits.slice(2)}`);
    } else {
      setPhone(`(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('A imagem deve ter menos de 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProofImage(reader.result as string);
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 14) {
      setErrorMessage('Informe o número de WhatsApp do suspeito com DDD.');
      return;
    }
    if (!description.trim() || description.length < 15) {
      setErrorMessage('Descreva com detalhes o que aconteceu (mínimo 15 caracteres).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      const newReport: ReportItem = {
        id: 'rep-' + Date.now(),
        targetPhone: phone,
        city,
        scamType,
        description: description.trim(),
        proofImageUrl: proofImage || undefined,
        reporterFingerprint: fingerprint?.hash || 'DB-FP-ANON',
        status: 'pendente',
        createdAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR').slice(0, 5),
      };

      const existing = getReports();
      saveReports([newReport, ...existing]);

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between text-xs">
        <button
          onClick={onGoHome}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Início</span>
        </button>
        <span className="text-[11px] font-mono text-red-400 bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-500/30">
          CANAL ANÔNIMO 100% SIGILOSO
        </span>
      </div>

      {/* Main Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <span>QG de Moderação e Denúncias</span>
        </div>
        <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight uppercase">
          CENTRAL DE DENÚNCIAS
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          Reporte golpistas, calotes ou produtos sem procedência. Seus dados e seu aparelho estão 100% blindados sob sigilo.
        </p>
      </div>

      {/* BOTÃO INTELIGENTE DE RETORNO AO GRUPO (LOOP FECHADO) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-zinc-900 to-zinc-950 border-2 border-emerald-500/40 shadow-xl space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider">
            LOOP FECHADO
          </span>
          <span className="text-xs text-slate-400">
            Grupo ativo: <strong className="text-white">{currentCity.name}</strong>
          </span>
        </div>

        <button
          type="button"
          onClick={handleReturnToWhatsApp}
          disabled={isRedirecting}
          onContextMenu={(e) => e.preventDefault()}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#25D366] via-emerald-500 to-[#128C7E] hover:from-[#20ba59] hover:to-[#0f7a6e] text-black font-display font-black text-sm uppercase tracking-wider shadow-lg glow-whatsapp transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
        >
          {isRedirecting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              <span>RECONECTANDO AO WHATSAPP...</span>
            </div>
          ) : (
            <>
              {/* WhatsApp Icon */}
              <svg className="w-5 h-5 fill-black" viewBox="0 0 24 24">
                <path d="M12.031 2C6.505 2 2.016 6.489 2.016 12.016c0 1.765.46 3.488 1.332 5.009L2 22.031l5.148-1.328a9.986 9.986 0 0 0 4.883 1.313h.004c5.526 0 10.015-4.489 10.015-10.016 0-2.678-1.043-5.197-2.936-7.09A9.95 9.95 0 0 0 12.031 2zm0 18.336h-.003a8.318 8.318 0 0 1-4.242-1.163l-.304-.18-3.156.816.844-3.076-.197-.314a8.31 8.31 0 0 1-1.272-4.403c0-4.595 3.738-8.333 8.335-8.333 2.226 0 4.318.867 5.892 2.441a8.27 8.27 0 0 1 2.44 5.895c0 4.597-3.739 8.334-8.334 8.334zm4.569-6.236c-.25-.125-1.48-.73-1.71-.813-.23-.083-.397-.125-.564.125-.167.25-.646.813-.792.98-.146.167-.292.188-.542.063s-1.057-.39-2.013-1.242c-.744-.664-1.247-1.484-1.393-1.734-.146-.25-.016-.385.109-.51.113-.112.25-.292.375-.438.125-.146.167-.25.25-.417.083-.167.042-.313-.021-.438s-.564-1.356-.772-1.856c-.203-.487-.41-.42-.564-.428-.146-.008-.313-.01-.48-.01s-.438.063-.667.313c-.23.25-.876.855-.876 2.085s.896 2.418 1.021 2.585c.125.167 1.764 2.693 4.273 3.777.597.258 1.064.412 1.428.528.6.191 1.146.164 1.578.1.481-.072 1.48-.605 1.688-1.189.208-.584.208-1.084.146-1.189-.063-.104-.23-.167-.48-.292z" />
              </svg>
              <span>VOLTAR PARA O MEU GRUPO DE WHATSAPP</span>
            </>
          )}
        </button>
      </div>

      {/* Main Report Form Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl space-y-4">
        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xl text-white">
                Denúncia Enviada aos Administradores!
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-sm mx-auto">
                O número reportado e os metadados entraram em quarentena no Radar RS. Se comprovada a má fé, o aparelho será banido de todos os 6 subgrupos.
              </p>
            </div>
            <div className="pt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleReturnToWhatsApp}
                className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-display font-black text-sm uppercase rounded-xl transition-all shadow-lg"
              >
                Voltar Agora para o WhatsApp
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setPhone('');
                  setDescription('');
                  setProofImage(null);
                }}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-white"
              >
                Enviar Outro Relato
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>
                Proteja seus parceiros da quebrada. Informe o número e o tipo de tentativa de golpe. Suas informações nunca serão repassadas ao denunciado.
              </span>
            </div>

            {errorMessage && (
              <div className="p-2.5 bg-red-500/20 border border-red-500/50 rounded-lg text-xs text-red-200">
                {errorMessage}
              </div>
            )}

            {/* Suspect Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                WhatsApp do Suspeito / Golpista *
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(51) 98765-4321"
                className="w-full px-3.5 py-3 bg-black/50 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 font-mono"
                required
              />
            </div>

            {/* City and Scam Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cidade Onde Ocorreu *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as CityName)}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="Canoas">Canoas</option>
                  <option value="Sapucaia do Sul">Sapucaia do Sul</option>
                  <option value="Esteio">Esteio</option>
                  <option value="Porto Alegre">Porto Alegre</option>
                  <option value="Gravataí">Gravataí</option>
                  <option value="São Leopoldo">São Leopoldo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tipo de Malandragem *
                </label>
                <select
                  value={scamType}
                  onChange={(e) => setScamType(e.target.value as ReportItem['scamType'])}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="Pix Falso / Comprovante Agendado">Pix Falso / Comprovante Agendado</option>
                  <option value="Produto Sem Procedência / Roubado">Produto Roubado / Sem Procedência</option>
                  <option value="Calote no Envio / Entrega">Calote no Envio / Uber Entrega</option>
                  <option value="Anúncio Clonado / Perfil Fake">Anúncio Clonado / Fake</option>
                  <option value="Golpe do Sinal / Adiantamento">Golpe do Sinal / Adiantamento</option>
                  <option value="Outro">Outra Tentativa de Golpe</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Relato dos Fatos (O que ele fez ou disse?) *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Mandou comprovante de Pix agendado no Mathias Velho querendo que eu entregasse um celular antes de cair na conta..."
                rows={3}
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 resize-none"
                required
              />
            </div>

            {/* Proof Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Print da Conversa ou Evidência (Opcional)
              </label>
              {proofImage ? (
                <div className="relative rounded-xl border border-white/20 overflow-hidden bg-black/50">
                  <img
                    src={proofImage}
                    alt="Evidência"
                    className="w-full h-36 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setProofImage(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/15 hover:border-red-500/50 rounded-xl p-4 cursor-pointer bg-black/20 hover:bg-red-500/[0.03] transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs text-slate-300 font-medium">
                    Clique para anexar print do WhatsApp
                  </span>
                  <span className="text-[10px] text-slate-500">
                    PNG, JPG até 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-display font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-red-700/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>ENVIANDO RELATO SEGURO...</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    <span>ENVIAR DENÚNCIA ANÔNIMA</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
