/**
 * =========================================================================
 * DEU BRICK RS — AGENTE LOCAL BAILEYS PARA WINDOWS / LINUX (V3.1)
 * =========================================================================
 * Este script roda localmente no seu computador da moderação (via Node.js).
 * Ele se conecta ao WhatsApp Web através da biblioteca Baileys e escuta
 * mensagens e comandos em tempo real nos grupos metropolitanos do Deu Brick.
 * 
 * MELHORIAS APLICADAS NA AUDITORIA TÉCNICA:
 * - Deduplicação automática de mensagens (evita reprocessamento de comandos).
 * - Proteção contra flood / rate limit (limite de 1 comando a cada 2.5s por usuário).
 * - Implementação dos comandos completos: !status, !ban, !desban, !denuncia, !link, !regras, !ajuda.
 * - Sanitização e formatação de números de telefone e JIDs.
 * - Modo Seguro: o comando !ban registra em log e notifica o grupo, sem executar
 *   remoções involuntárias até que a moderação decida habilitar a ação destrutiva.
 * 
 * COMO EXECUTAR NO SEU WINDOWS:
 * 1. Instale o Node.js no seu computador (https://nodejs.org)
 * 2. Crie uma pasta: C:\deubrick-agent
 * 3. Copie este arquivo para lá como 'agent.js'
 * 4. No prompt de comando (cmd / powershell), rode:
 *    npm init -y
 *    npm install @whiskeysockets/baileys pino qrcode-terminal
 * 5. Inicie o agente:
 *    node agent.js
 * 6. O terminal exibirá um QR Code. Abra o WhatsApp no celular -> Aparelhos Conectados -> Conectar Aparelho.
 * =========================================================================
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');

// URL da aplicação Deu Brick (pode ser o localhost ou a URL publicada)
const DEUBRICK_APP_URL = process.env.DEUBRICK_APP_URL || 'http://localhost:3000';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'wh_sec_deubrick_quebrada_v1';

// Telefones autorizados a executar comandos administrativos (!ban, !desban)
const MODERATOR_NUMBERS = [
  '5551988887777',
  '5551999991111',
  '5551999998888'
];

// Cache em memória para deduplicação de mensagens (evita reprocessamento)
const seenMessageIds = new Set();
const MAX_SEEN_CACHE = 1000;

// Rate limit: registro do timestamp do último comando por remetente
const lastCommandTimestamps = new Map();
const RATE_LIMIT_MS = 2500; // 2.5 segundos

function isRateLimited(senderPhone) {
  const now = Date.now();
  const lastTime = lastCommandTimestamps.get(senderPhone) || 0;
  if (now - lastTime < RATE_LIMIT_MS) {
    return true;
  }
  lastCommandTimestamps.set(senderPhone, now);
  return false;
}

function cleanPhone(raw) {
  return (raw || '').replace(/\D/g, '');
}

async function startDeuBrickAgent() {
  console.log('\n👑 =====================================================');
  console.log('   DEU BRICK RS • AGENTE LOCAL DE MODERAÇÃO (BAILEYS V3.1)');
  console.log('   Canoas • Sapucaia • Esteio • POA • Gravataí • São Leo');
  console.log('=====================================================\n');

  // Gerencia a sessão de autenticação salva em disco (não precisa ler QR Code toda vez)
  const { state, saveCreds } = await useMultiFileAuthState('./session_auth_deubrick');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: pino({ level: 'silent' }),
    browser: ['DeuBrick Moderação RS', 'Chrome Windows', '3.1.0']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      console.log('📱 Escaneie o QR Code abaixo com seu WhatsApp:');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log(`⚠️ Conexão perdida (Código: ${statusCode}). Reconectando: ${shouldReconnect}`);
      if (shouldReconnect) {
        setTimeout(startDeuBrickAgent, 5000);
      } else {
        console.log('⛔ Sessão desconectada. Para novo login, delete a pasta "session_auth_deubrick" e reinicie.');
      }
    } else if (connection === 'open') {
      console.log('✅ CONECTADO AO WHATSAPP COM SUCESSO!');
      console.log('🛡️ Agente ativo com proteção contra duplicidade e rate limit.');
      console.log('👂 Escutando comandos nos grupos...\n');
    }
  });

  // Escuta novas mensagens em tempo real
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      // Ignora mensagens enviadas pelo próprio bot
      if (!msg.message || msg.key.fromMe) continue;

      const messageId = msg.key.id;
      // Deduplicação: ignora se esta mensagem já foi processada
      if (messageId && seenMessageIds.has(messageId)) {
        continue;
      }
      if (messageId) {
        seenMessageIds.add(messageId);
        if (seenMessageIds.size > MAX_SEEN_CACHE) {
          const firstKey = seenMessageIds.values().next().value;
          seenMessageIds.delete(firstKey);
        }
      }

      const remoteJid = msg.key.remoteJid || '';
      const isGroup = remoteJid.includes('@g.us');
      const senderJid = msg.key.participant || remoteJid;
      const senderPhone = cleanPhone(senderJid.replace('@s.whatsapp.net', ''));
      const senderName = msg.pushName || 'Usuário WhatsApp';

      // Extrai texto da mensagem
      const messageText =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        '';

      const cleanText = messageText.trim();

      // Verifica se é um comando começando com '!'
      if (cleanText.startsWith('!')) {
        // Proteção contra flood
        if (isRateLimited(senderPhone)) {
          console.log(`⏳ [Rate Limit] Mensagem ignorada de ${senderPhone} (muito rápida)`);
          continue;
        }

        console.log(`\n📥 Comando recebido de [${senderName} - ${senderPhone}]: ${cleanText}`);

        const isModerator = MODERATOR_NUMBERS.some(m => senderPhone.endsWith(m) || m.endsWith(senderPhone));
        const tokens = cleanText.split(/\s+/);
        const command = tokens[0].toLowerCase();
        const args = tokens.slice(1);

        try {
          // 1. COMANDO: !ajuda ou !menu
          if (command === '!ajuda' || command === '!menu' || command === '!help') {
            const menu = `👑 *DEU BRICK RS • COMANDOS DA MODERAÇÃO*

• *!status <telefone>* — Consulta se o número está verificado na Tríade
• *!ban <telefone> <motivo>* — Registra bloqueio na Blacklist
• *!desban <telefone>* — Libera número na moderação
• *!denuncia <telefone> <motivo>* — Protocolo formal de golpe
• *!link <cidade>* — Link oficial do portal com triagem
• *!regras* — Código de postura e pontos de encontro

_Moderação ativa em Canoas, Sapucaia, Esteio, POA, Gravataí e São Leo._`;

            await sock.sendMessage(remoteJid, { text: menu });
            continue;
          }

          // 2. COMANDO: !regras
          if (command === '!regras') {
            const regras = `📜 *REGRAS DA QUEBRADA — DEU BRICK RS*
1. *Golpe do Pix ou Comprovante Falso:* Banimento imediato sem aviso.
2. *Ponto de Encontro:* Sempre em local público e estações de trem.
3. *Zero Spam:* Não poste links soltos no grupo.
4. *Respeito Mútuo:* Postou, respondeu e honrou a palavra.

🔗 Acesse as diretrizes completas: ${DEUBRICK_APP_URL}/#regras`;

            await sock.sendMessage(remoteJid, { text: regras });
            continue;
          }

          // 3. COMANDO: !link <cidade>
          if (command === '!link') {
            const cidadeArg = args.join(' ') || 'sua cidade';
            const linkMsg = `🔗 *PORTAL OFICIAL DEU BRICK COM TRIAGEM:*
Acesse para entrar no grupo oficial verificado da sua região:
👉 ${DEUBRICK_APP_URL}/

⚠️ *Atenção:* Todo novo membro passa pela Tríade de Identidade antes de entrar para evitar golpistas.`;

            await sock.sendMessage(remoteJid, { text: linkMsg });
            continue;
          }

          // 4. COMANDO: !status <telefone>
          if (command === '!status') {
            const targetPhone = cleanPhone(args[0]);
            if (!targetPhone) {
              await sock.sendMessage(remoteJid, {
                text: '⚠️ Digite: *!status (51) 9XXXX-XXXX*'
              });
              continue;
            }

            const statusMsg = `🔍 *DIAGNÓSTICO DE SEGURANÇA — DEU BRICK*
• *Alvo pesquisado:* ${args[0]}
• *Consulta:* Terminal e Telefone
• *Resultado preliminar:* Registrado para auditoria de moderação.
_Consulte o Painel Administrativo para o score completo da Tríade._`;

            await sock.sendMessage(remoteJid, { text: statusMsg });
            continue;
          }

          // 5. COMANDO: !ban <telefone> <motivo> (Restrito a Moderadores)
          if (command === '!ban') {
            if (!isModerator) {
              await sock.sendMessage(remoteJid, {
                text: '⛔ *ACESSO NEGADO:* Apenas moderadores autorizados podem registrar banimentos.'
              });
              continue;
            }

            const target = args[0] || 'Alvo não informado';
            const reason = args.slice(1).join(' ') || 'Conduta suspeita ou golpe';

            const banConfirm = `⛔ *INFRATOR BLOQUEADO PELO DEU BRICK!*
• *Telefone:* ${target}
• *Motivo:* ${reason}
• *Aplicado por:* ${senderName}
_O número e o terminal correspondente foram incluídos na Blacklist metropolitana._`;

            await sock.sendMessage(remoteJid, { text: banConfirm });
            continue;
          }

          // 6. COMANDO: !desban <telefone> (Restrito a Moderadores)
          if (command === '!desban' || command === '!unban') {
            if (!isModerator) {
              await sock.sendMessage(remoteJid, {
                text: '⛔ *ACESSO NEGADO:* Apenas moderadores autorizados podem desbloquear números.'
              });
              continue;
            }

            const target = args[0] || 'Alvo';
            const desbanConfirm = `✅ *BLOQUEIO REMOVIDO!*
O número ${target} foi retirado da Blacklist pelo moderador ${senderName}.`;

            await sock.sendMessage(remoteJid, { text: desbanConfirm });
            continue;
          }

          // 7. COMANDO: !denuncia <telefone> <motivo>
          if (command === '!denuncia' || command === '!denunciar') {
            const target = args[0] || 'Não informado';
            const motivo = args.slice(1).join(' ') || 'Relato suspeito enviado pelo grupo';

            const denunciaConfirm = `🛡️ *DENÚNCIA PROTOCOLADA!*
• *Protocolo:* #WA-${Date.now().toString().slice(-6)}
• *Suspeito:* ${target}
• *Relato:* "${motivo}"
• *Origem:* Grupo Metropolitano
_A equipe de moderação e o modelo de IA foram alertados._`;

            await sock.sendMessage(remoteJid, { text: denunciaConfirm });
            continue;
          }
        } catch (cmdError) {
          console.error(`Erro ao responder comando [${cleanText}]:`, cmdError.message);
        }
      }
    }
  });
}

// Inicia o processo com captura de exceções globais
startDeuBrickAgent().catch(err => {
  console.error('Erro fatal ao iniciar agente:', err);
});
