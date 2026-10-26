import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2, ExternalLink, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // Suppress when already installed in standalone mode
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-black text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#25D366]/20 active:scale-95"
        title="Instalar Deu Brick no seu celular"
      >
        <Download className="w-3.5 h-3.5 stroke-[3]" />
        <span>Instalar App</span>
      </button>
    );
  }

  // iOS Safari flow (since beforeinstallprompt is not fired by iOS WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSModal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 text-xs font-bold transition-all"
          title="Instalar no iPhone"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#25D366]" />
          <span>Instalar no iPhone</span>
        </button>

        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-[#121620] border-2 border-[#25D366]/50 p-6 shadow-2xl text-left space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-black text-base text-white">
                    Instalar Deu Brick no iPhone
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-300">
                Para ter o Deu Brick na sua tela inicial como um aplicativo nativo:
              </p>

              <div className="space-y-3 bg-black/40 p-4 rounded-xl border border-white/5 text-xs text-slate-200">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white/10 text-[#25D366] shrink-0 mt-0.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-white block">1. Menu de Opções do Safari</strong>
                    <span>No rodapé do Safari, toque no ícone de opções (quadrado com seta para cima).</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white/10 text-[#FACC15] shrink-0 mt-0.5">
                    <PlusSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-white block">2. Adicionar à Tela de Início</strong>
                    <span>Role a lista para baixo e selecione "Adicionar à Tela de Início".</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#25D366] text-black font-bold text-xs uppercase"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback ambient button if prompt is not ready yet
  return (
    <button
      onClick={() => setShowIOSModal(true)}
      className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-medium transition-all"
      title="Instalar aplicativo"
    >
      <Smartphone className="w-3.5 h-3.5 text-[#25D366]" />
      <span>Instalar App</span>
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#121620] border-2 border-[#25D366]/50 p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-black text-base text-white">
                Instalação do Aplicativo
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowIOSModal(false);
                }}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              No seu navegador (Chrome, Edge ou Safari), use o menu de opções (três pontinhos) e clique em <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à Tela Inicial"</strong>.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowIOSModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-[#25D366] text-black font-bold text-xs uppercase"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </button>
  );
};
