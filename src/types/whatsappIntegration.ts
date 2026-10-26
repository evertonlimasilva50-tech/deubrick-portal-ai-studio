import { CityName } from './index';

export type WhatsAppProviderType =
  | 'evolution_api'
  | 'baileys_local'
  | 'z_api'
  | 'custom_webhook';

export interface WhatsAppApiConfig {
  provider: WhatsAppProviderType;
  apiUrl: string;
  apiKey: string;
  instanceName: string;
  webhookSecret: string;
  autoReplyEnabled: boolean;
  authorizedModeratorPhones: string[];
  commandPrefix: string;
  enabledCommands: {
    ban: boolean;
    desban: boolean;
    status: boolean;
    denuncia: boolean;
    link: boolean;
    regras: boolean;
    ajuda: boolean;
  };
  lastPingAt?: string;
  isConnected: boolean;
}

export interface WhatsAppIncomingMessage {
  id: string;
  from: string; // Phone number or remoteJid (e.g. 5551988887777@s.whatsapp.net)
  senderPhone: string; // Clean phone e.g. (51) 98888-7777 or 5551988887777
  senderName: string; // Push name or profile name
  messageText: string;
  timestamp: number;
  isGroup: boolean;
  groupJid?: string;
  groupName?: string;
  rawPayload?: any;
}

export interface WhatsAppCommandResult {
  command: string;
  args: string[];
  senderPhone: string;
  senderName: string;
  isAuthorized: boolean;
  success: boolean;
  responseText: string;
  actionTaken?: 'ban' | 'unban' | 'report_created' | 'status_lookup' | 'link_sent' | 'rules_sent' | 'help' | 'unauthorized' | 'unknown';
  targetPhone?: string;
  targetCity?: CityName | string;
  executedAt: string;
}

export interface WhatsAppCommandLog {
  id: string;
  timestamp: string;
  provider: WhatsAppProviderType;
  senderPhone: string;
  senderName: string;
  commandText: string;
  actionTaken: string;
  success: boolean;
  responseText: string;
  isGroup: boolean;
}
