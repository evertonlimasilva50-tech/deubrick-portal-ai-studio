import React, { useState } from 'react';
import { X, ShieldAlert, Upload, CheckCircle2, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { CityName, ReportItem } from '../types';
import { getReports, saveReports } from '../services/storage';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userFingerprintHash?: string;
  onReportSubmitted?: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  userFingerprintHash = 'DB-FP-ANON',
  onReportSubmitted,
}) => {
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState<CityName>('Canoas');
  const [scamType, setScamType] = useState<ReportItem['scamType']>('Pix Falso / Comprovante Agendado');
  const [description, setDescription] = useState('');
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handlePhoneChange = (val: string) => {
    // Basic phone formatting for BR mobile
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
        reporterFingerprint: userFingerprintHash,
        status: 'pendente',
        createdAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR').slice(0, 5),
      };

      const existing = getReports();
      saveReports([newReport, ...existing]);

      setIsSubmitting(false);
      setIsSuccess(true);
      if (onReportSubmitted) onReportSubmitted();
    }, 600);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setPhone('');
    setDescription('');
    setProofImage(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#11141A] border border-red-500/40 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-red-950/40 border-b border-red-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                Central de Denúncias Anônimas
              </h3>
              <p className="text-xs text-red-300">
                100% Sigiloso • Alimentação direta do Radar Antifraude
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-display font-bold text-xl text-white">
                  Denúncia Registrada com Sucesso!
                </h4>
                <p className="text-sm text-slate-300 mt-2 max-w-sm mx-auto">
                  Nossa moderação metropolitana recebeu os dados e os metadados do suspeito. Se confirmado, o aparelho dele será banido de todos os grupos do Deu Brick.
                </p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-slate-400">
                Protocolo sigiloso gerado sob fingerprint: <span className="text-emerald-400 font-mono">{userFingerprintHash}</span>
              </div>
              <button
                onClick={handleResetAndClose}
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-black font-bold rounded-xl transition-all shadow-lg"
              >
                Entendido, Fechar Central
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span>
                  Proteja a comunidade da quebrada. Relate tentativas de golpe do Pix, envio falso ou anúncios clonados. Sua identidade nunca será revelada.
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
                  Número de WhatsApp do Suspeito / Golpista *
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="(51) 98765-4321"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 font-mono"
                  required
                />
              </div>

              {/* City and Scam Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cidade do Fato *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value as CityName)}
                    className="w-full px-3.5 py-2.5 bg-[#161A22] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-500"
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
                    Tipo de Ocorrência *
                  </label>
                  <select
                    value={scamType}
                    onChange={(e) => setScamType(e.target.value as ReportItem['scamType'])}
                    className="w-full px-3.5 py-2.5 bg-[#161A22] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-500"
                  >
                    <option value="Pix Falso / Comprovante Agendado">Pix Falso / Comprovante Agendado</option>
                    <option value="Produto Sem Procedência / Roubado">Produto Roubado / Sem Procedência</option>
                    <option value="Calote no Envio / Entrega">Calote no Envio / Entrega</option>
                    <option value="Anúncio Clonado / Perfil Fake">Anúncio Clonado / Fake</option>
                    <option value="Golpe do Sinal / Adiantamento">Golpe do Sinal / Adiantamento</option>
                    <option value="Outro">Outra Malandragem</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Relato dos Fatos (Como aconteceu?) *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Mandou comprovante de Pix com agendamento e mandou Uber buscar o celular na estação..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 resize-none"
                  required
                />
              </div>

              {/* Proof Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Print da Conversa ou Evidência (Opcional)
                </label>
                {proofImage ? (
                  <div className="relative rounded-xl border border-white/20 overflow-hidden bg-black/50 group">
                    <img
                      src={proofImage}
                      alt="Evidência do Golpe"
                      className="w-full h-36 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setProofImage(null)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] bg-black/70 text-slate-200">
                      Print anexado com sucesso
                    </span>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/15 hover:border-red-500/50 rounded-xl p-4 cursor-pointer bg-white/[0.02] hover:bg-red-500/[0.03] transition-colors">
                    <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
                    <span className="text-xs text-slate-300 font-medium">
                      Clique para anexar print do WhatsApp ou comprovante
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      PNG, JPG ou WEBP até 5MB
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

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 text-xs font-semibold hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-bold transition-all shadow-lg shadow-red-700/30 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Blindando Dados...</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4" />
                      <span>Enviar Denúncia Anônima</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
