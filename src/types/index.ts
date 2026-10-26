export type CityName =
  | 'Canoas'
  | 'Porto Alegre'
  | 'Esteio'
  | 'Sapucaia do Sul'
  | 'Cachoeirinha'
  | 'Gravataí'
  | 'São Leopoldo';

export interface CityData {
  id: string;
  name: CityName;
  slug: string;
  tagline: string;
  slogan: string;
  whatsAppGroupUrl: string;
  activeMembers: number;
  activeOffers: number;
  featuredDeals: string[];
  neighborhoods: string[];
  themeColor: {
    border: string;
    bgHeader: string;
    text: string;
    glow: string;
  };
}

export type ObjectiveType = 'comprar' | 'vender' | 'trocar' | 'anunciar';

export interface DeviceFingerprint {
  id: string;
  hash: string;
  userAgent: string;
  screenResolution: string;
  colorDepth: number;
  language: string;
  timezone: string;
  hardwareConcurrency: number;
  deviceMemory?: number;
  platform: string;
  canvasHash: string;
  createdAt: string;
  ipSimulated: string;
  riskScore: number; // 0 to 100
  isBanned: boolean;
  cityInferred: CityName;
}

export interface BlacklistEntry {
  id: string;
  fingerprintHash: string;
  phoneOrIdentifier: string;
  reason: string;
  bannedAt: string;
  bannedBy: string;
  city: CityName | 'Região Metropolitana';
  severity: 'ALTA' | 'CRITICA' | 'MEDIA';
}

export interface ReportItem {
  id: string;
  targetPhone: string;
  city: CityName;
  scamType:
    | 'Pix Falso / Comprovante Agendado'
    | 'Produto Sem Procedência / Roubado'
    | 'Calote no Envio / Entrega'
    | 'Anúncio Clonado / Perfil Fake'
    | 'Golpe do Sinal / Adiantamento'
    | 'Outro';
  description: string;
  proofImageUrl?: string;
  reporterFingerprint: string;
  status: 'pendente' | 'em_analise' | 'banido' | 'descartado';
  createdAt: string;
}

export interface GuerrillaCampaign {
  id: string;
  slug: string;
  cityName: CityName;
  title: string;
  description: string;
  thumbnailUrl: string;
  categoryTag: string;
  clicksCount: number;
  scansCount: number;
  createdAt: string;
}

export interface QuizState {
  city: CityName | null;
  objective: ObjectiveType | null;
  searchedItem: string;
  fullName?: string;
  whatsapp?: string;
}

export interface TriadProfile {
  id: string;
  fingerprintHash: string;
  fullName: string;
  whatsapp: string;
  city: CityName;
  objective: ObjectiveType;
  searchedItem: string;
  deviceIp: string;
  deviceInfo: string;
  riskScore: number;
  status: 'aprovado' | 'sob_analise' | 'banido';
  createdAt: string;
}
