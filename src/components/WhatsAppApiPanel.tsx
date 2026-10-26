import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Bot,
  Zap,
  Terminal,
  ShieldAlert,
  ShieldCheck,
  Check,
  Copy,
  Send,
  RefreshCw,
  Server,
  Play,
  Settings,
  Phone,
  User,
  AlertTriangle,
  ExternalLink,
  Code2,
  Trash2,
  Plus,
  HelpCircle,
  Radio,
  Sliders,
} from 'lucide-react';
import {
  WhatsAppApiConfig,
  WhatsAppCommandLog,
  WhatsAppCommandResult,
  WhatsAppProviderType,
} from '../types/whatsappIntegration';
import {
  getWhatsAppConfig,
  saveWhatsAppConfig,
  getWhatsAppCommandLogs,
  addWhatsAppCommandLog,
  clearWhatsAppCommandLogs,
  simulateIncomingWhatsAppCommand,
  sendWhatsAppApiMessage,
  normalizePhone,
} from '../services/whatsappApi';

interface WhatsAppApiPanelProps {
  onRefreshParentData?: () => void;
}

export const WhatsAppApiPanel: React.FC<WhatsAppApiPanelProps> = ({
  onRefreshParentData,
}) => {
  const [config, setConfig] = useState<WhatsAppApiConfig>(getWhatsAppConfig());
  const [logs, setLogs] = useState<WhatsAppCommandLog[]>(getWhatsAppCommandLogs());
  const [activeSubTab, setActiveSubTab] = useState<'simulator' | 'config' | 'logs' | 'docs'>('simulator');

  // Simulator state
  const [simText, setSimText] = useState('!status (51) 98934-1182');
  const [simSenderPhone, setSimSenderPhone] = useState('(51) 98888-7777');
  const [simSenderName, setSimSenderName] = useState('Everton (Moderador)');
  const [simIsAuthorized, setSimIsAuthorized] = useState(true);
  const [simLastResult, setSimLastResult] = useState<WhatsAppCommandResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Quick preset commands for the simulator
  const quickPresets = [
    { label: '🔍 Consultar Status', cmd: '!status (51) 98934-1182' },
    { label: '⛔ Banir Infrator', cmd: '!ban (51) 99882-1144 Tentativa de Pix Falso Agendado' },
    { label: '✅ Desbanir Número', cmd: '!desban (51) 99882-1144' },
    { label: '🚨 Criar Denúncia', cmd: '!denuncia (51) 99422-7719 Moto roubada anunciada sem doc' },
    { label: '🔗 Pedir Link da Cidade', cmd: '!link Canoas' },
    { label: '📜 Código de Regras', cmd: '!regras' },
    { label: '❓ Menu de Ajuda', cmd: '!ajuda' },
  ];

  // Config form state
  const [tempConfig, setTempConfig] = useState<WhatsAppApiConfig>(config);
  const [newModeratorPhone, setNewModeratorPhone] = useState('');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [testSendResult, setTestSendResult] = useState<{ success: boolean; msg: string } | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  useEffect(() => {
    setLogs(getWhatsAppCommandLogs());
  }, [simLastResult]);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveWhatsAppConfig(tempConfig);
    setConfig(tempConfig);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2500);
  };

  const handleAddModerator = () => {
    if (!newModeratorPhone.trim()) return;
    const formatted = normalizePhone(newModeratorPhone.trim());
    if (!tempConfig.authorizedModeratorPhones.includes(formatted)) {
      const updated = {
        ...tempConfig,
        authorizedModeratorPhones: [...tempConfig.authorizedModeratorPhones, formatted],
      };
      setTempConfig(updated);
      saveWhatsAppConfig(updated);
      setConfig(updated);
    }
    setNewModeratorPhone('');
  };

  const handleRemoveModerator = (phoneToRemove: string) => {
    const updated = {
      ...tempConfig,
      authorizedModeratorPhones: tempConfig.authorizedModeratorPhones.filter((p) => p !== phoneToRemove),
    };
    setTempConfig(updated);
    saveWhatsAppConfig(updated);
    setConfig(updated);
  };

  const handleRunSimulation = (overrideCmd?: string) => {
    const commandToRun = overrideCmd || simText;
    if (!commandToRun.trim()) return;

    setIsSimulating(true);

    setTimeout(() => {
      const senderPhone = simIsAuthorized ? simSenderPhone : '(51) 97777-0000';
      const senderName = simIsAuthorized ? simSenderName : 'Membro Comum do Grupo';

      const result = simulateIncomingWhatsAppCommand(commandToRun, senderPhone, senderName, true);
      setSimLastResult(result);
      setLogs(getWhatsAppCommandLogs());
      setIsSimulating(false);

      if (onRefreshParentData) {
        onRefreshParentData();
      }
    }, 380);
  };

  const handleClearLogs = () => {
    clearWhatsAppCommandLogs();
    setLogs([]);
  };

  const handleTestConnection = async () => {
    setTestSendResult(null);
    const res = await sendWhatsAppApiMessage(
      config,
      config.authorizedModeratorPhones[0] || '5551988887777',
      '🤖 [DEU BRICK RS] Teste de conexão com a API do WhatsApp executado com sucesso!'
    );

    if (res.success) {
      setTestSendResult({
        success: true,
        msg: `Conexão bem-sucedida com ${config.provider.toUpperCase()} (${config.apiUrl})!`,
      });
    } else {
      setTestSendResult({
        success: false,
        msg: `Falha na conexão: ${res.error || 'Verifique se a Evolution API / Baileys está rodando.'}`,
      });
    }
  };

  // Node.js Baileys Local Agent Script template for Windows PC
  const localAgentScript = `/**
 * DEU BRICK RS • AGENTE LOCAL BAILEYS / EVOLUTION (WINDOWS & LINUX)
 * Roda no computador Windows da moderação via Node.js
 * Mantém sessão com WhatsApp Web e repassa comandos para o Deu Brick
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');

const DEUBRICK_API_URL = '${window.location.origin}';
const WEBHOOK_SECRET = '${config.webhookSecret}';

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info_deubrick');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: pino({ level: 'silent' }),
    browser: ['DeuBrick Moderação', 'Chrome', '1.0.0']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Conexão encerrada. Reconectando...', shouldReconnect);
      if (shouldReconnect) connectToWhatsApp();
    } else if (connection === 'open') {
      console.log('👑 [DEU BRICK] Conectado com sucesso ao WhatsApp Web!');
    }
  });

  // Escuta todas as mensagens e comandos recebidos no grupo
  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
    if (text.startsWith('!')) {
      console.log('Comando detectado:', text, 'de:', msg.key.remoteJid);
      
      // Repassa para o motor de moderação do Deu Brick
      try {
        const response = await fetch(\`\${DEUBRICK_API_URL}/api/whatsapp-webhook\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-webhook-secret': WEBHOOK_SECRET },
          body: JSON.stringify(m)
        });
        const result = await response.json();
        if (result.responseText) {
          await sock.sendMessage(msg.key.remoteJid, { text: result.responseText });
        }
      } catch (err) {
        console.error('Erro ao processar comando:', err.message);
      }
    }
  });
}

connectToWhatsApp();
`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-slide-up-fade">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0E121A] border-2 border-[#25D366]/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-8 h-8 rounded-lg bg-[#25D366] text-black font-stencil flex items-center justify-center text-sm font-bold border border-black shadow">
              <Bot className="w-4 h-4 text-black" />
            </div>
            <h3 className="font-stencil text-base sm:text-lg text-white">
              INTEGRAÇÃO WHATSAPP APIS (BAILEYS / EVOLUTION API)
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#25D366]/20 text-[#25D366] font-bold border border-[#25D366]/40 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
              <span>MOTOR TÁTICO ATIVO</span>
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Receba mensagens, comandos de moderação (<code className="text-[#FFE500]">!ban</code>, <code className="text-[#FFE500]">!status</code>, <code className="text-[#FFE500]">!denuncia</code>) e dados da Tríade direto do WhatsApp via Baileys ou Evolution API.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleTestConnection}
            className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-stencil text-xs flex items-center gap-1.5 border border-white/20 cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Testar Ping API</span>
          </button>
        </div>
      </div>

      {/* Test Send Feedback */}
      {testSendResult && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
            testSendResult.success
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
              : 'bg-red-950/60 border-red-500/50 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {testSendResult.success ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{testSendResult.msg}</span>
          </div>
          <button
            onClick={() => setTestSendResult(null)}
            className="text-slate-400 hover:text-white text-xs cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-white/10 overflow-x-auto scrollbar-none pb-0.5">
        <button
          onClick={() => setActiveSubTab('simulator')}
          className={`py-2 px-3.5 rounded-t-xl text-xs font-stencil flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'simulator'
              ? 'bg-[#25D366] text-black font-black shadow-md'
              : 'bg-black/40 text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Simulador de Comandos</span>
        </button>

        <button
          onClick={() => setActiveSubTab('config')}
          className={`py-2 px-3.5 rounded-t-xl text-xs font-stencil flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'config'
              ? 'bg-[#25D366] text-black font-black shadow-md'
              : 'bg-black/40 text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Configurações & Provedores</span>
        </button>

        <button
          onClick={() => setActiveSubTab('logs')}
          className={`py-2 px-3.5 rounded-t-xl text-xs font-stencil flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'logs'
              ? 'bg-[#25D366] text-black font-black shadow-md'
              : 'bg-black/40 text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Histórico Auditável ({logs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('docs')}
          className={`py-2 px-3.5 rounded-t-xl text-xs font-stencil flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'docs'
              ? 'bg-[#25D366] text-black font-black shadow-md'
              : 'bg-black/40 text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Guia Baileys / Evolution</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* SUBTAB 1: SIMULADOR DE COMANDOS DO WHATSAPP */}
      {/* ========================================================= */}
      {activeSubTab === 'simulator' && (
        <div className="space-y-5 animate-slide-up-fade">
          {/* Quick Preset Buttons */}
          <div className="p-4 rounded-2xl bg-[#0E121A] border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-stencil text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#FFE500]" />
                <span>Comandos Prontos para Teste Imediato:</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Clique para testar</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickPresets.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSimText(p.cmd);
                    handleRunSimulation(p.cmd);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-[#25D366]/20 hover:border-[#25D366]/50 text-slate-200 hover:text-[#25D366] text-xs font-mono border border-white/10 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Simulation Sandbox */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Input Simulator Form */}
            <div className="lg:col-span-6 p-4 sm:p-5 rounded-2xl bg-[#0E121A] border-2 border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="font-stencil text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-[#25D366]" />
                  <span>Terminal de Entrada (WhatsApp Msg)</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-400">Mock Webhook</span>
              </div>

              {/* Sender Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">Nome do Remetente</label>
                  <input
                    type="text"
                    value={simSenderName}
                    onChange={(e) => setSimSenderName(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/15 rounded-xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">Telefone WhatsApp</label>
                  <input
                    type="text"
                    value={simSenderPhone}
                    onChange={(e) => setSimSenderPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/15 rounded-xl text-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* Permission Check Toggle */}
              <div className="p-3 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-white font-medium block">Perfil de Autorização:</span>
                  <span className="text-[10px] text-slate-400">
                    {simIsAuthorized ? 'Simula Moderador cadastrado na lista' : 'Simula Membro comum sem privilégios'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSimIsAuthorized(!simIsAuthorized)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-stencil transition-colors ${
                    simIsAuthorized
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-400 border border-red-500/40'
                  }`}
                >
                  {simIsAuthorized ? '✓ MODERADOR' : '○ USUÁRIO COMUM'}
                </button>
              </div>

              {/* Message text input */}
              <div className="space-y-1">
                <label className="block text-[11px] text-slate-400 font-medium">Mensagem enviada no WhatsApp</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={simText}
                    onChange={(e) => setSimText(e.target.value)}
                    placeholder="Ex: !ban (51) 9XXXX-XXXX Golpe do Pix"
                    className="flex-1 px-3.5 py-2.5 bg-black border border-white/20 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#25D366]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRunSimulation()}
                    disabled={isSimulating}
                    className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-stencil text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 border border-black shadow"
                  >
                    {isSimulating ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>DISPARAR</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono">
                Ao disparar, o comando é processado exatamente como se viesse da Evolution API ou Baileys. Se for <code className="text-[#FFE500]">!ban</code>, adiciona na Blacklist imediatamente.
              </div>
            </div>

            {/* WhatsApp Mockup Output Preview */}
            <div className="lg:col-span-6 p-4 sm:p-5 rounded-2xl bg-[#0E121A] border-2 border-white/10 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#25D366] animate-pulse" />
                  <span className="font-stencil text-sm text-white">RESPOSTA DO BOT NO WHATSAPP</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                  AO VIVO
                </span>
              </div>

              {/* WhatsApp Chat Bubble Mockup */}
              <div className="p-3.5 rounded-2xl bg-[#0b141a] border border-white/10 shadow-2xl space-y-3 font-sans min-h-[220px] flex flex-col justify-end">
                {/* Incoming Message from Sender */}
                <div className="self-end max-w-[85%] bg-[#005c4b] text-white p-2.5 rounded-2xl rounded-tr-sm text-xs space-y-1 shadow">
                  <div className="text-[10px] text-emerald-300 font-bold truncate">
                    {simSenderName} ({simSenderPhone})
                  </div>
                  <div className="font-mono text-xs">{simText}</div>
                  <div className="text-[9px] text-slate-300 text-right font-mono">
                    {new Date().toLocaleTimeString('pt-BR').slice(0, 5)} ✓✓
                  </div>
                </div>

                {/* Bot Answer */}
                <div className="self-start max-w-[90%] bg-[#1F2C34] text-white p-3 rounded-2xl rounded-tl-sm text-xs space-y-1.5 shadow-lg border border-white/5">
                  <div className="flex items-center gap-1.5 text-[10px] font-stencil text-[#FFE500] border-b border-white/10 pb-1">
                    <Bot className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>DEU BRICK RS • MODERAÇÃO BOT</span>
                  </div>

                  <div className="whitespace-pre-wrap leading-relaxed text-slate-100 text-[11px] font-mono">
                    {simLastResult ? (
                      simLastResult.responseText
                    ) : (
                      'Aguardando comando... Clique em um dos botões prontos acima ou digite uma mensagem para testar a resposta do bot em tempo real.'
                    )}
                  </div>

                  <div className="text-[9px] text-slate-400 text-right font-mono pt-1">
                    {simLastResult?.executedAt || new Date().toLocaleTimeString('pt-BR').slice(0, 5)}
                  </div>
                </div>
              </div>

              {/* Action summary badge */}
              {simLastResult && (
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Ação executada no sistema:</span>
                  <span className="font-stencil text-emerald-400 font-bold">
                    {simLastResult.actionTaken?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 2: CONFIGURAÇÕES DA API & PROVEDORES */}
      {/* ========================================================= */}
      {activeSubTab === 'config' && (
        <form onSubmit={handleSaveConfig} className="p-4 sm:p-6 rounded-2xl bg-[#0E121A] border-2 border-white/10 space-y-5 animate-slide-up-fade">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <h4 className="font-stencil text-base text-white uppercase tracking-wider">
                PARÂMETROS DE CONEXÃO DA WHATSAPP API
              </h4>
              <p className="text-xs text-slate-400">
                Ajuste os dados de conexão da Evolution API, Baileys local ou Z-API.
              </p>
            </div>

            <button
              type="submit"
              className="py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-stencil text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-black shadow"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>SALVAR CONFIGURAÇÃO</span>
            </button>
          </div>

          {saveSuccessNotice && (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Configurações do WhatsApp salvas com sucesso!</span>
            </div>
          )}

          {/* Provider Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-stencil text-white uppercase tracking-wide">
              PROVEDOR / MOTOR DE CONEXÃO:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {[
                {
                  id: 'evolution_api',
                  title: 'Evolution API (Baileys v2)',
                  badge: 'RECOMENDADO',
                  desc: 'Open-source, gratuita, suporte a multi-instâncias e webhooks.',
                },
                {
                  id: 'baileys_local',
                  title: 'Baileys Local Worker',
                  badge: 'OFFLINE / PC LOCAL',
                  desc: 'Roda direto no Node.js do seu computador Windows sem servidor externo.',
                },
                {
                  id: 'z_api',
                  title: 'Z-API Cloud',
                  badge: 'COMPATÍVEL',
                  desc: 'API comercial gerenciada com webhooks padrão.',
                },
                {
                  id: 'custom_webhook',
                  title: 'Webhook Customizado',
                  badge: 'REST / JSON',
                  desc: 'Qualquer gateway HTTP com payload JSON.',
                },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setTempConfig({ ...tempConfig, provider: p.id as WhatsAppProviderType })}
                  className={`p-3 rounded-xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    tempConfig.provider === p.id
                      ? 'bg-[#25D366]/15 border-[#25D366] text-white shadow-lg'
                      : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/25'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <strong className="text-xs font-bold text-white block">{p.title}</strong>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/70 text-[#FFE500] border border-white/10">
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{p.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Connection URL & API Key */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-slate-300 mb-1 font-medium">URL da API / Instância</label>
              <input
                type="text"
                value={tempConfig.apiUrl}
                onChange={(e) => setTempConfig({ ...tempConfig, apiUrl: e.target.value })}
                placeholder="http://localhost:8080 ou https://evolution.seuservidor.com"
                className="w-full px-3 py-2 bg-black border border-white/15 rounded-xl text-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-300 mb-1 font-medium">Nome da Instância</label>
              <input
                type="text"
                value={tempConfig.instanceName}
                onChange={(e) => setTempConfig({ ...tempConfig, instanceName: e.target.value })}
                placeholder="deubrick-rs"
                className="w-full px-3 py-2 bg-black border border-white/15 rounded-xl text-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-300 mb-1 font-medium">API Key / Token Global</label>
              <input
                type="password"
                value={tempConfig.apiKey}
                onChange={(e) => setTempConfig({ ...tempConfig, apiKey: e.target.value })}
                placeholder="Chave secreta de autenticação"
                className="w-full px-3 py-2 bg-black border border-white/15 rounded-xl text-white text-xs font-mono"
              />
            </div>
          </div>

          {/* Webhook Secret & Prefix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-300 mb-1 font-medium">Chave Secreta de Webhook (Header Signature)</label>
              <input
                type="text"
                value={tempConfig.webhookSecret}
                onChange={(e) => setTempConfig({ ...tempConfig, webhookSecret: e.target.value })}
                className="w-full px-3 py-2 bg-black border border-white/15 rounded-xl text-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-300 mb-1 font-medium">Prefixo de Comandos</label>
              <input
                type="text"
                value={tempConfig.commandPrefix}
                onChange={(e) => setTempConfig({ ...tempConfig, commandPrefix: e.target.value })}
                placeholder="!"
                className="w-full px-3 py-2 bg-black border border-white/15 rounded-xl text-white text-xs font-mono"
              />
            </div>
          </div>

          {/* Authorized Moderator Numbers Management */}
          <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
            <div>
              <h5 className="font-stencil text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#FFE500]" />
                <span>Telefones de Moderadores Autorizados (Segurança de Banimento)</span>
              </h5>
              <p className="text-[11px] text-slate-400">
                Apenas mensagens enviadas por estes números do WhatsApp têm permissão de executar comandos administrativos como <code className="text-[#FFE500]">!ban</code> ou <code className="text-[#FFE500]">!desban</code>.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newModeratorPhone}
                onChange={(e) => setNewModeratorPhone(e.target.value)}
                placeholder="Ex: (51) 98888-7777 ou 5551988887777"
                className="flex-1 px-3 py-2 bg-black border border-white/15 rounded-xl text-white text-xs font-mono"
              />
              <button
                type="button"
                onClick={handleAddModerator}
                className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba59] text-black font-stencil text-xs rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {tempConfig.authorizedModeratorPhones.map((ph, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-[#0E121A] border border-white/15 text-xs text-white font-mono flex items-center gap-2"
                >
                  <Phone className="w-3 h-3 text-[#25D366]" />
                  <span>{ph}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveModerator(ph)}
                    className="text-red-400 hover:text-red-300 cursor-pointer"
                    title="Remover Moderador"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 3: HISTÓRICO AUDITÁVEL DE COMANDOS */}
      {/* ========================================================= */}
      {activeSubTab === 'logs' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0E121A] border-2 border-white/10 space-y-4 animate-slide-up-fade">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <h4 className="font-stencil text-sm sm:text-base text-white">
                HISTÓRICO DE COMANDOS EXECUTADOS VIA WHATSAPP ({logs.length})
              </h4>
              <p className="text-xs text-slate-400">
                Auditoria completa de todas as instruções recebidas por mensagens.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClearLogs}
              className="py-1.5 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Histórico</span>
            </button>
          </div>

          <div className="divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10 bg-black/40">
            {logs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <Bot className="w-8 h-8 text-slate-600 mx-auto" />
                <p>Nenhum comando recebido ainda.</p>
                <p className="text-[11px] text-slate-500">
                  Use a aba "Simulador de Comandos" para enviar mensagens de teste.
                </p>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-3 sm:p-4 hover:bg-white/[0.02] space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          log.success
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-950 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {log.success ? '✓ EXECUTADO' : '⛔ RECUSADO'}
                      </span>
                      <strong className="text-white font-mono">{log.senderName}</strong>
                      <span className="text-slate-400 font-mono text-[11px]">• {log.senderPhone}</span>
                    </div>

                    <span className="text-[11px] font-mono text-slate-500">{log.timestamp}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black border border-white/5 space-y-1">
                    <div className="text-[11px] text-[#FFE500] font-mono font-bold">
                      {log.commandText}
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans whitespace-pre-wrap">
                      {log.responseText}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 4: GUIA DE INSTALAÇÃO BAILEYS / EVOLUTION NO WINDOWS */}
      {/* ========================================================= */}
      {activeSubTab === 'docs' && (
        <div className="p-4 sm:p-6 rounded-2xl bg-[#0E121A] border-2 border-white/10 space-y-5 animate-slide-up-fade">
          <div className="border-b border-white/10 pb-3">
            <h4 className="font-stencil text-base text-white uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#25D366]" />
              <span>COMO CONECTAR O WHATSAPP NO SEU COMPUTADOR (ZERO CUSTO)</span>
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              Guia oficial para deixar o WhatsApp Web conectado continuamente no seu Windows rodando com a Evolution API ou Baileys.
            </p>
          </div>

          {/* Option A: Evolution API com Docker */}
          <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#25D366] text-black font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <strong className="text-white text-sm font-stencil">
                  OPÇÃO RECOMENDADA: EVOLUTION API (DOCKER / WINDOWS)
                </strong>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                100% GRÁTIS
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Instale o Docker Desktop no seu Windows e execute o comando abaixo no terminal PowerShell para subir a Evolution API:
            </p>

            <div className="relative p-3 rounded-xl bg-black border border-white/15 font-mono text-xs text-[#FFE500] overflow-x-auto">
              <code>{`docker run -d \\
  --name evolution-api \\
  -p 8080:8080 \\
  -e AUTHENTICATION_API_KEY=DEUBRICK_EVOLUTION_API_KEY_2025 \\
  atendai/evolution-api:v2.1.0`}</code>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <p>1. Acesse <code>http://localhost:8080/manager</code> no navegador.</p>
              <p>2. Crie a instância com o nome <code className="text-[#FFE500]">{config.instanceName}</code>.</p>
              <p>3. Aponte o Webhook para a URL do seu app Deu Brick.</p>
              <p>4. Escaneie o QR Code com o WhatsApp do seu celular que administra o grupo.</p>
            </div>
          </div>

          {/* Option B: Baileys Local Agent Script */}
          <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FFE500] text-black font-bold flex items-center justify-center text-xs">
                  2
                </span>
                <strong className="text-white text-sm font-stencil">
                  OPÇÃO DIRETA: SCRIPT NODE.JS BAILEYS NO SEU WINDOWS
                </strong>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(localAgentScript);
                  setCopiedScript(true);
                  setTimeout(() => setCopiedScript(false), 2000);
                }}
                className="py-1 px-2.5 rounded-lg bg-[#FFE500]/15 hover:bg-[#FFE500]/25 text-[#FFE500] border border-[#FFE500]/40 text-xs font-mono flex items-center gap-1 cursor-pointer"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Copiado!' : 'Copiar Script Node.js'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Crie uma pasta no seu computador (ex: <code>C:\\deubrick-agent</code>), instale as dependências com <code>npm i @whiskeysockets/baileys pino</code> e rode com <code>node agent.js</code>. O terminal exibirá o QR Code para pareamento instantâneo.
            </p>

            <div className="p-3 rounded-xl bg-black border border-white/15 font-mono text-[11px] text-slate-300 max-h-48 overflow-y-auto leading-relaxed">
              <pre>{localAgentScript}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
