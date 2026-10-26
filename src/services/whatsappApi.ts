import {
  BlacklistEntry,
  CityData,
  CityName,
  ReportItem,
  TriadProfile,
} from '../types';
import {
  WhatsAppApiConfig,
  WhatsAppCommandLog,
  WhatsAppCommandResult,
  WhatsAppIncomingMessage,
  WhatsAppProviderType,
} from '../types/whatsappIntegration';
import {
  getBlacklist,
  saveBlacklist,
  getTriadProfiles,
  saveTriadProfiles,
  getReports,
  saveReports,
  getCities,
  STORAGE_KEYS,
} from './storage';

export const DEFAULT_WHATSAPP_CONFIG: WhatsAppApiConfig = {
  provider: 'evolution_api',
  apiUrl: 'http://localhost:8080',
  apiKey: 'DEUBRICK_EVOLUTION_API_KEY_2025',
  instanceName: 'deubrick-moderacao-rs',
  webhookSecret: 'wh_sec_deubrick_quebrada_v1',
  autoReplyEnabled: true,
  authorizedModeratorPhones: [
    '(51) 98888-7777',
    '(51) 99999-1111',
    '5551988887777',
    '5551999991111',
  ],
  commandPrefix: '!',
  enabledCommands: {
    ban: true,
    desban: true,
    status: true,
    denuncia: true,
    link: true,
    regras: true,
    ajuda: true,
  },
  isConnected: true,
  lastPingAt: 'Hoje 19:42',
};

export const INITIAL_COMMAND_LOGS: WhatsAppCommandLog[] = [
  {
    id: 'cmd-log-1',
    timestamp: 'Hoje 19:35',
    provider: 'evolution_api',
    senderPhone: '(51) 98888-7777',
    senderName: 'Everton (Moderador)',
    commandText: '!ban (51) 98934-1182 Golpe do Pix Falso',
    actionTaken: 'Terminal e número adicionados à Blacklist',
    success: true,
    responseText: '⛔ [DEU BRICK] Alvo bloqueado com sucesso na Blacklist metropolitana.',
    isGroup: true,
  },
  {
    id: 'cmd-log-2',
    timestamp: 'Hoje 18:20',
    provider: 'baileys_local',
    senderPhone: '(51) 98888-7777',
    senderName: 'Everton (Moderador)',
    commandText: '!status (51) 99188-7734',
    actionTaken: 'Consulta da Tríade de Identidade',
    success: true,
    responseText: '🛡️ [DEU BRICK] Juliana Moreira • Status: APROVADO • Risco: 5/100',
    isGroup: false,
  },
  {
    id: 'cmd-log-3',
    timestamp: 'Hoje 17:15',
    provider: 'evolution_api',
    senderPhone: '(51) 99999-1111',
    senderName: 'Plantão Canoas',
    commandText: '!link Canoas',
    actionTaken: 'Envio de link seguro com triagem',
    success: true,
    responseText: '🔗 Link seguro com triagem para Canoas gerado.',
    isGroup: true,
  },
];

// Helper: Normalize phone to clean digits and formatted standard
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 13 && digits.startsWith('55')) {
    const ddd = digits.slice(2, 4);
    const num = digits.slice(4);
    return `(${ddd}) ${num.slice(0, 5)}-${num.slice(5)}`;
  }
  return raw;
}

// Get/Save config
export function getWhatsAppConfig(): WhatsAppApiConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WHATSAPP_CONFIG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WHATSAPP_CONFIG, JSON.stringify(DEFAULT_WHATSAPP_CONFIG));
      return DEFAULT_WHATSAPP_CONFIG;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_WHATSAPP_CONFIG;
  }
}

export function saveWhatsAppConfig(config: WhatsAppApiConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WHATSAPP_CONFIG, JSON.stringify(config));
  } catch (err) {
    console.warn('Erro ao salvar configuração WhatsApp API', err);
  }
}

// Get/Save command logs
export function getWhatsAppCommandLogs(): WhatsAppCommandLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WHATSAPP_COMMAND_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WHATSAPP_COMMAND_LOGS, JSON.stringify(INITIAL_COMMAND_LOGS));
      return INITIAL_COMMAND_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_COMMAND_LOGS;
  }
}

export function saveWhatsAppCommandLogs(logs: WhatsAppCommandLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WHATSAPP_COMMAND_LOGS, JSON.stringify(logs.slice(0, 60)));
  } catch (err) {
    console.warn('Erro ao salvar logs de comando WhatsApp', err);
  }
}

export function addWhatsAppCommandLog(log: WhatsAppCommandLog): void {
  const current = getWhatsAppCommandLogs();
  const updated = [log, ...current].slice(0, 60);
  saveWhatsAppCommandLogs(updated);
}

export function clearWhatsAppCommandLogs(): void {
  localStorage.setItem(STORAGE_KEYS.WHATSAPP_COMMAND_LOGS, JSON.stringify([]));
}

/**
 * Normaliza payloads de webhooks recebidos de diferentes APIs do WhatsApp:
 * - Evolution API (Evolution v1 / v2 com Baileys engine)
 * - Baileys Local WebSocket/Worker
 * - Z-API
 * - Webhook Customizado
 */
export function parseIncomingWebhookPayload(
  payload: any,
  provider: WhatsAppProviderType = 'evolution_api'
): WhatsAppIncomingMessage | null {
  if (!payload || typeof payload !== 'object') return null;

  try {
    // 1. Evolution API (format: event: "messages.upsert", data: { key: { remoteJid }, message: { ... } })
    if (provider === 'evolution_api' || payload.event === 'messages.upsert' || payload.data?.key) {
      const data = payload.data || payload;
      const key = data.key || {};
      const remoteJid = key.remoteJid || '';
      const isGroup = remoteJid.includes('@g.us');
      const senderPhone = key.participant
        ? key.participant.replace('@s.whatsapp.net', '')
        : remoteJid.replace('@s.whatsapp.net', '').replace('@g.us', '');
      
      const messageObj = data.message || {};
      const text =
        messageObj.conversation ||
        messageObj.extendedTextMessage?.text ||
        messageObj.imageMessage?.caption ||
        '';

      if (!text) return null;

      return {
        id: key.id || 'msg-' + Date.now(),
        from: remoteJid,
        senderPhone: normalizePhone(senderPhone),
        senderName: data.pushName || 'Usuário WhatsApp',
        messageText: text.trim(),
        timestamp: data.messageTimestamp ? data.messageTimestamp * 1000 : Date.now(),
        isGroup,
        groupJid: isGroup ? remoteJid : undefined,
        rawPayload: payload,
      };
    }

    // 2. Baileys Direct / Local Agent
    if (provider === 'baileys_local' || payload.messages) {
      const msg = Array.isArray(payload.messages) ? payload.messages[0] : payload;
      const key = msg.key || {};
      const remoteJid = key.remoteJid || '';
      const isGroup = remoteJid.includes('@g.us');
      const senderPhone = key.participant || remoteJid;
      const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';

      if (!text) return null;

      return {
        id: key.id || 'msg-' + Date.now(),
        from: remoteJid,
        senderPhone: normalizePhone(senderPhone.replace('@s.whatsapp.net', '')),
        senderName: msg.pushName || 'Membro do Grupo',
        messageText: text.trim(),
        timestamp: msg.messageTimestamp ? msg.messageTimestamp * 1000 : Date.now(),
        isGroup,
        groupJid: isGroup ? remoteJid : undefined,
        rawPayload: payload,
      };
    }

    // 3. Z-API / Generic webhook fallback
    const sender = payload.phone || payload.sender || payload.from || '';
    const text = payload.text?.message || payload.message || payload.body || '';

    if (!text) return null;

    return {
      id: payload.messageId || 'msg-' + Date.now(),
      from: sender,
      senderPhone: normalizePhone(sender),
      senderName: payload.senderName || payload.pushName || 'Contato WhatsApp',
      messageText: text.trim(),
      timestamp: Date.now(),
      isGroup: Boolean(payload.isGroup),
      rawPayload: payload,
    };
  } catch (err) {
    console.warn('Erro ao processar payload do WhatsApp:', err);
    return null;
  }
}

/**
 * Motor de Comandos e Moderação via WhatsApp:
 * Executa comandos autorizados recebidos do WhatsApp e aplica diretamente nas bases do Deu Brick
 */
export function executeWhatsAppCommand(
  msg: WhatsAppIncomingMessage,
  config: WhatsAppApiConfig
): WhatsAppCommandResult {
  const prefix = config.commandPrefix || '!';
  const text = msg.messageText.trim();
  const executedAt = new Date().toLocaleTimeString('pt-BR').slice(0, 5);

  if (!text.startsWith(prefix)) {
    return {
      command: '',
      args: [],
      senderPhone: msg.senderPhone,
      senderName: msg.senderName,
      isAuthorized: false,
      success: false,
      responseText: '',
      actionTaken: 'unknown',
      executedAt,
    };
  }

  // Split command and arguments
  const tokens = text.slice(prefix.length).trim().split(/\s+/);
  const command = tokens[0].toLowerCase();
  const args = tokens.slice(1);

  // Check moderator authorization for privileged commands
  const cleanSender = msg.senderPhone.replace(/\D/g, '');
  const isAuthorized = config.authorizedModeratorPhones.some((modPhone) => {
    const cleanMod = modPhone.replace(/\D/g, '');
    return cleanSender.endsWith(cleanMod) || cleanMod.endsWith(cleanSender);
  });

  // 1. COMANDO: !ajuda
  if (command === 'ajuda' || command === 'help' || command === 'menu') {
    const responseText = `👑 *DEU BRICK RS • COMANDOS DE MODERAÇÃO*

Comandos disponíveis via WhatsApp:
• *!status <telefone>* — Consulta histórico na Tríade e antifraude
• *!ban <telefone> <motivo>* — Bloqueia terminal/número na Blacklist
• *!desban <telefone>* — Libera número na Blacklist
• *!denuncia <telefone> <motivo>* — Cadastra denúncia formal
• *!link <cidade>* — Envia link do portal oficial com triagem
• *!regras* — Envia o código e regras da comunidade

_Moderação ativa em Canoas, Sapucaia, Esteio, POA, Gravataí e São Leo._`;

    return {
      command,
      args,
      senderPhone: msg.senderPhone,
      senderName: msg.senderName,
      isAuthorized,
      success: true,
      responseText,
      actionTaken: 'help',
      executedAt,
    };
  }

  // 2. COMANDO: !status <telefone>
  if (command === 'status') {
    const target = args[0];
    if (!target) {
      return {
        command,
        args,
        senderPhone: msg.senderPhone,
        senderName: msg.senderName,
        isAuthorized,
        success: false,
        responseText: '⚠️ Uso incorreto. Digite: *!status (51) 9XXXX-XXXX*',
        executedAt,
      };
    }

    const cleanTarget = target.replace(/\D/g, '');
    const triadList = getTriadProfiles();
    const blacklist = getBlacklist();

    const triadMatch = triadList.find((p) => p.whatsapp.replace(/\D/g, '').includes(cleanTarget));
    const banMatch = blacklist.find(
      (b) => b.phoneOrIdentifier.replace(/\D/g, '').includes(cleanTarget)
    );

    let responseText = '';
    if (banMatch) {
      responseText = `🚨 *ALERTA DE SEGURANÇA — NÚMERO BLOQUEADO!*
• *Telefone:* ${banMatch.phoneOrIdentifier}
• *Status:* ⛔ BANIDO NA BLACKLIST
• *Motivo:* ${banMatch.reason}
• *Cidade:* ${banMatch.city}
• *Banido em:* ${banMatch.bannedAt}
_Acesso ao app e grupos permanentemente bloqueado._`;
    } else if (triadMatch) {
      responseText = `✅ *CADASTRO IDENTIFICADO NA TRÍADE*
• *Nome Real:* ${triadMatch.fullName}
• *Telefone:* ${triadMatch.whatsapp}
• *Cidade:* ${triadMatch.city}
• *Score de Risco:* ${triadMatch.riskScore}/100 (${triadMatch.riskScore > 50 ? '⚠️ Atenção' : '✓ Limpo'})
• *Status do Perfil:* ${triadMatch.status.toUpperCase()}
• *Hash do Terminal:* ${triadMatch.fingerprintHash}`;
    } else {
      responseText = `ℹ️ *Nenhum registro encontrado* para ${target}.
Este usuário ainda não passou pela triagem da Tríade de Identidade nem possui denúncias ativas.`;
    }

    return {
      command,
      args,
      senderPhone: msg.senderPhone,
      senderName: msg.senderName,
      isAuthorized,
      success: true,
      responseText,
      actionTaken: 'status_lookup',
      targetPhone: target,
      executedAt,
    };
  }

  // 3. COMANDO: !ban <telefone> <motivo>
  if (command === 'ban' || command === 'bloquear') {
    if (!isAuthorized) {
      return {
        command,
        args,
        senderPhone: msg.senderPhone,
        senderName: msg.senderName,
        isAuthorized: false,
        success: false,
        responseText: '⛔ *ACESSO NEGADO:* Apenas moderadores autorizados do Deu Brick podem aplicar banimentos.',
        actionTaken: 'unauthorized',
        executedAt,
      };
    }

    const targetPhone = args[0];
    const reason = args.slice(1).join(' ') || 'Banido via comando WhatsApp por suspeita de golpe';

    if (!targetPhone) {
      return {
        command,
        args,
        senderPhone: msg.senderPhone,
        senderName: msg.senderName,
        isAuthorized: true,
        success: false,
        responseText: '⚠️ Uso incorreto. Digite: *!ban (51) 9XXXX-XXXX <motivo>*',
        executedAt,
      };
    }

    const newBanEntry: BlacklistEntry = {
      id: 'bl-wa-' + Date.now(),
      fingerprintHash: `DB-FP-WHA-${Math.floor(1000 + Math.random() * 9000)}`,
      phoneOrIdentifier: normalizePhone(targetPhone),
      reason,
      bannedAt: new Date().toLocaleDateString('pt-BR') + ' ' + executedAt,
      bannedBy: `WhatsApp Bot (${msg.senderName})`,
      city: 'Região Metropolitana',
      severity: 'CRITICA',
    };

    const currentBl = getBlacklist();
    saveBlacklist([newBanEntry, ...currentBl]);

    // Also update Triad status if profile exists
    const currentTriad = getTriadProfiles();
    const cleanDigits = targetPhone.replace(/\D/g, '');
    const updatedTriad = currentTriad.map((p) =>
      p.whatsapp.replace(/\D/g, '').includes(cleanDigits)
        ? { ...p, status: 'banido' as const }
        : p
    );
    saveTriadProfiles(updatedTriad);

    const responseText = `⛔ *INFRATOR BLOQUEADO COM SUCESSO!*
• *Alvo:* ${newBanEntry.phoneOrIdentifier}
• *Motivo:* ${reason}
• *Responsável:* ${msg.senderName}
• *Efeito Imediato:* Terminal e número na lista negra. Redirecionamento e acesso VIP bloqueados em todas as cidades.`;

    return {
      command,
      args,
      senderPhone: msg.senderPhone,
      senderName: msg.senderName,
      isAuthorized: true,
      success: true,
      responseText,
      actionTaken: 'ban',
      targetPhone: newBanEntry.phoneOrIdentifier,
      executedAt,
    };
  }

  // 4. COMANDO: !desban <telefone>
  if (command === 'desban' || command === 'unban') {
    if (!isAuthorized) {
      return {
        command,
        args,
        senderPhone: msg.senderPhone,
        senderName: msg.senderName,
        isAuthorized: false,
        success: false,
        responseText: '⛔ *ACESSO NEGADO:* Comando restrito a moderadores do Deu Brick.',
        actionTaken: 'unauthorized',
        executedAt,
      };
    }

    const targetPhone = args[0];
    if (!targetPhone) {
      return {
        command,
        args,
        senderPhone: msg.senderPhone,
        senderName: msg.senderName,
        isAuthorized: true,
        success: false,
        responseText: '⚠️ Uso incorreto. Digite: *!desban (51) 9XXXX-XXXX*',
        executedAt,
      };
    }

    const clean = targetPhone.replace(/\D/g, '');
    const currentBl = getBlacklist();
    const filtered = currentBl.filter(
      (b) => !b.phoneOrIdentifier.replace(/\D/g, '').includes(clean)
    );
    saveBlacklist(filtered);

    const currentTriad = getTriadProfiles();
    const updatedTriad = currentTriad.map((p) =>
      p.whatsapp.replace(/\D/g, '').includes(clean)
        ? { ...p, status: 'aprovado' as const }
        : p
    );
    saveTriadProfiles(updatedTriad);

    const responseText = `✅ *BLOQUEIO REMOVIDO!*
O número ${targetPhone} foi removido da Blacklist e seu status foi restaurado.`;

    return {
      command,
      args,
      senderPhone: msg.senderPhone,
      senderName: msg.senderName,
      isAuthorized: true,
      success: true,
      responseText,
      actionTaken: 'unban',
      targetPhone,
      executedAt,
    };
  }

  // 5. COMANDO: !denuncia <telefone> <motivo>
  if (command === 'denuncia' || command === 'denunciar' || command === 'report') {
    const targetPhone = args[0];
    const description = args.slice(1).join(' ') || 'Denúncia encaminhada diretamente via WhatsApp';

    if (!targetPhone) {
      return {
        command,
        args,
        senderPhone: msg.senderPhone,
        senderName: msg.senderName,
        isAuthorized,
        success: false,
        responseText: '⚠️ Digite: *!denuncia (51) 9XXXX-XXXX <descreva o ocorrido>*',
        executedAt,
      };
    }

    const newReport: ReportItem = {
      id: 'rep-wa-' + Date.now(),
      targetPhone: normalizePhone(targetPhone),
      city: 'Canoas', // default fallback
      scamType: 'Pix Falso / Comprovante Agendado',
      description: `[Via WhatsApp de ${msg.senderName}]: ${description}`,
      reporterFingerprint: 'WA-MSG-' + msg.senderPhone.replace(/\D/g, '').slice(-6),
      status: 'pendente',
      createdAt: new Date().toLocaleDateString('pt-BR') + ' ' + executedAt,
    };

    const currentReports = getReports();
    saveReports([newReport, ...currentReports]);

    const responseText = `🛡️ *DENÚNCIA PROTOCOLADA NO PAINEL ADMIN!*
• *Protocolo:* #${newReport.id}
• *Suspeito:* ${newReport.targetPhone}
• *Relato:* "${description}"
_A equipe de moderação e o modelo de IA analisarão a ocorrência em instantes._`;

    return {
      command,
      args,
      senderPhone: msg.senderPhone,
      senderName: msg.senderName,
      isAuthorized,
      success: true,
      responseText,
      actionTaken: 'report_created',
      targetPhone,
      executedAt,
    };
  }

  // 6. COMANDO: !link <cidade>
  if (command === 'link' || command === 'grupo') {
    const cityQuery = args.join(' ').toLowerCase().trim();
    const cities = getCities();
    const foundCity = cities.find(
      (c) =>
        c.name.toLowerCase().includes(cityQuery) ||
        c.slug.toLowerCase().includes(cityQuery)
    );

    const targetCity = foundCity || cities[0];
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://deubrick.com.br';
    const responseText = `🔗 *PORTAL DE ENTRADA OFICIAL COM TRIAGEM:*
• *Cidade:* ${targetCity.name} (${targetCity.tagline})
• *Link do Portal:* ${origin}/?cidade=${targetCity.slug}

⚠️ *Regra de Ouro:* Nunca envie links brutos de WhatsApp em aberto! Todo novo membro passa pelo antifraude antes de entrar.`;

    return {
      command,
      args,
      senderPhone: msg.senderPhone,
      senderName: msg.senderName,
      isAuthorized,
      success: true,
      responseText,
      actionTaken: 'link_sent',
      targetCity: targetCity.name,
      executedAt,
    };
  }

  // 7. COMANDO: !regras
  if (command === 'regras' || command === 'regrasdagalera') {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://deubrick.com.br';
    const responseText = `📜 *CÓDIGO DE POSTURA E REGRAS DA QUEBRADA*
1. *Zero Tolerância com Golpistas:* Pix agendado falso ou produto roubado = Banimento imediato e denúncia.
2. *Ponto de Encontro Seguro:* Negociações preferencialmente em locais públicos e estações de trem.
3. *Respeito Mútuo:* Postou, respondeu, negociou com clareza e transparência.
4. *Anti-Share:* Não espalhe links aleatórios no grupo.

🔗 Veja o guia completo em: ${origin}/#regras`;

    return {
      command,
      args,
      senderPhone: msg.senderPhone,
      senderName: msg.senderName,
      isAuthorized,
      success: true,
      responseText,
      actionTaken: 'rules_sent',
      executedAt,
    };
  }

  // Unknown command
  return {
    command,
    args,
    senderPhone: msg.senderPhone,
    senderName: msg.senderName,
    isAuthorized,
    success: false,
    responseText: `❓ Comando *!${command}* não reconhecido. Digite *!ajuda* para ver os comandos de moderação do Deu Brick.`,
    actionTaken: 'unknown',
    executedAt,
  };
}

/**
 * Envia uma mensagem via WhatsApp API (Evolution API ou Baileys Local)
 */
export async function sendWhatsAppApiMessage(
  config: WhatsAppApiConfig,
  to: string,
  message: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  const cleanNumber = to.replace(/\D/g, '');
  const recipient = cleanNumber.includes('@') ? cleanNumber : `${cleanNumber}@s.whatsapp.net`;

  try {
    if (config.provider === 'evolution_api') {
      const endpoint = `${config.apiUrl.replace(/\/$/, '')}/message/sendText/${config.instanceName}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: config.apiKey,
        },
        body: JSON.stringify({
          number: recipient,
          text: message,
          delay: 1200,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    }

    // Baileys Local Worker / Custom Webhook fallback
    return {
      success: true,
      data: { simulated: true, provider: config.provider, recipient, message },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Falha ao conectar com o endpoint da WhatsApp API',
    };
  }
}

/**
 * Simulador interativo de mensagens recebidas:
 * Permite ao moderador testar comandos na interface como se fossem enviados pelo WhatsApp
 */
export function simulateIncomingWhatsAppCommand(
  text: string,
  senderPhone: string = '(51) 98888-7777',
  senderName: string = 'Everton (Moderador)',
  isGroup: boolean = true
): WhatsAppCommandResult {
  const config = getWhatsAppConfig();
  const incomingMsg: WhatsAppIncomingMessage = {
    id: 'sim-' + Date.now(),
    from: senderPhone,
    senderPhone,
    senderName,
    messageText: text,
    timestamp: Date.now(),
    isGroup,
    groupName: 'Deu Brick RS • Moderação',
  };

  const result = executeWhatsAppCommand(incomingMsg, config);

  if (result.command) {
    addWhatsAppCommandLog({
      id: 'log-' + Date.now(),
      timestamp: 'Hoje ' + result.executedAt,
      provider: config.provider,
      senderPhone: result.senderPhone,
      senderName: result.senderName,
      commandText: text,
      actionTaken: result.actionTaken || 'comando_executado',
      success: result.success,
      responseText: result.responseText,
      isGroup,
    });
  }

  return result;
}
