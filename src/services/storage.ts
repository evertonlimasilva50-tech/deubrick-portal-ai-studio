import {
  BlacklistEntry,
  CityData,
  CityName,
  DeviceFingerprint,
  GuerrillaCampaign,
  ReportItem,
  TriadProfile,
} from '../types';

// Default Cities data for the metropolitan area from official Deu Brick identity
export const DEFAULT_CITIES: CityData[] = [
  {
    id: 'canoas',
    name: 'Canoas',
    slug: 'canoas',
    tagline: 'Centro, Marechal Rondon, Mathias Velho e mais 12 bairros',
    slogan: 'NOSSA CIDADE, NOSSO GRUPO!',
    whatsAppGroupUrl: 'https://chat.whatsapp.com/invite/CanoasDeuBrickOficial2025',
    activeMembers: 1420,
    activeOffers: 215,
    featuredDeals: ['iPhone 13 128GB R$ 2.450', 'Gol G5 2011 R$ 19.900', 'Furadeira Makita R$ 180'],
    neighborhoods: [
      'Centro', 'Marechal Rondon', 'Mathias Velho', 'Nossa Senhora das Graças',
      'Igara', 'Olaria', 'Harmonia', 'São José', 'Fátima', 'Estância Velha',
      'Guajuviras', 'Brigadeira', 'São Luís', 'Industrial', 'Campo Novo'
    ],
    themeColor: {
      border: 'border-[#00B4D8]',
      bgHeader: 'bg-[#00B4D8]',
      text: 'text-[#00B4D8]',
      glow: 'shadow-[#00B4D8]/20',
    },
  },
  {
    id: 'porto-alegre',
    name: 'Porto Alegre',
    slug: 'porto-alegre',
    tagline: 'Centro, Cidade Baixa, Bom Fim, Zona Norte, Sul e Restinga',
    slogan: 'NOSSO POVO, NOSSO GRUPO!',
    whatsAppGroupUrl: 'https://chat.whatsapp.com/invite/PoaDeuBrickOficial2025',
    activeMembers: 2380,
    activeOffers: 420,
    featuredDeals: ['Xiaomi Redmi Note 13 R$ 900', 'Uno Way 2014 R$ 24.500', 'TV Samsung 50 4K R$ 1.250'],
    neighborhoods: [
      'Centro', 'Cidade Baixa', 'Bom Fim', 'Independência', 'Moinhos de Vento',
      'Auxiliadora', 'Petrópolis', 'Menino Deus', 'Azenha', 'Santana',
      'Medianeira', 'Cristal', 'Glória', 'Jardim Botânico', 'Tristeza',
      'Ipanema', 'Cavalhada', 'Restinga', 'Lomba do Pinheiro'
    ],
    themeColor: {
      border: 'border-[#06D6A0]',
      bgHeader: 'bg-[#06D6A0]',
      text: 'text-[#06D6A0]',
      glow: 'shadow-[#06D6A0]/20',
    },
  },
  {
    id: 'esteio',
    name: 'Esteio',
    slug: 'esteio',
    tagline: 'Centro, São Sebastião, Três Portos, Novo Esteio e bairros',
    slogan: 'JUNTOS SOMOS MAIS FORTES!',
    whatsAppGroupUrl: 'https://chat.whatsapp.com/invite/EsteioDeuBrickOficial2025',
    activeMembers: 890,
    activeOffers: 130,
    featuredDeals: ['Notebook Dell i5 R$ 1.100', 'Jogo de Rodas 15 R$ 700', 'Lavadora Brastemp 12kg R$ 650'],
    neighborhoods: [
      'Centro', 'São Sebastião', 'Três Portos', 'Novo Esteio', 'Santo Inácio',
      'Anchieta', 'Várzea', 'Parque Primavera', 'Jardim do Alto', 'Vila C. Rolante',
      'Industrial', 'Esteio Leste', 'Tamandaré', 'Vila Pedras Brancas'
    ],
    themeColor: {
      border: 'border-[#10B981]',
      bgHeader: 'bg-[#10B981]',
      text: 'text-[#10B981]',
      glow: 'shadow-[#10B981]/20',
    },
  },
  {
    id: 'sapucaia',
    name: 'Sapucaia do Sul',
    slug: 'sapucaia',
    tagline: 'Centro, Capão da Cruz, Jardim América, Nova Sapucaia e mais',
    slogan: 'NOSSA GENTE, NOSSO GRUPO!',
    whatsAppGroupUrl: 'https://chat.whatsapp.com/invite/SapucaiaDeuBrickOficial2025',
    activeMembers: 960,
    activeOffers: 145,
    featuredDeals: ['CG Titan 160 2021 R$ 12.800', 'PlayStation 4 Pro R$ 1.400', 'Bicicleta Aro 29 R$ 550'],
    neighborhoods: [
      'Centro', 'Capão da Cruz', 'Jardim América', 'Cruzeiro', 'Fortaleza',
      'Nova Sapucaia', 'Borges de Medeiros', 'São Jorge', 'Rincão dos Ilhéus',
      'Santa Catarina', 'Ipiranga', 'Colina'
    ],
    themeColor: {
      border: 'border-[#F72585]',
      bgHeader: 'bg-[#F72585]',
      text: 'text-[#F72585]',
      glow: 'shadow-[#F72585]/20',
    },
  },
  {
    id: 'cachoeirinha',
    name: 'Cachoeirinha',
    slug: 'cachoeirinha',
    tagline: 'Centro, Vila Cachoeirinha, Betânia, Parque da Matriz e mais',
    slogan: 'JUNTOS FAZEMOS NOSSA CIDADE MAIS FORTE!',
    whatsAppGroupUrl: 'https://chat.whatsapp.com/invite/CachoeirinhaDeuBrickOficial2025',
    activeMembers: 870,
    activeOffers: 118,
    featuredDeals: ['Smart TV 43 TCL R$ 950', 'Biz 125 2019 R$ 9.800', 'Caixa de Som JBL R$ 500'],
    neighborhoods: [
      'Centro', 'Vila Cachoeirinha', 'Vila City', 'Jardim Betânia', 'Parque da Matriz',
      'Imbuí', 'Vila Porto', 'Parque Granja', 'Eucaliptos', 'São Vicente',
      'Vila Rosário', 'Pajuçara'
    ],
    themeColor: {
      border: 'border-[#FF5722]',
      bgHeader: 'bg-[#FF5722]',
      text: 'text-[#FF5722]',
      glow: 'shadow-[#FF5722]/20',
    },
  },
  {
    id: 'gravatai',
    name: 'Gravataí',
    slug: 'gravatai',
    tagline: 'Centro, Planaltina, Barnabé, Parada 68, Morada do Vale e Cohab',
    slogan: 'JUNTOS SOMOS MAIS FORTES!',
    whatsAppGroupUrl: 'https://chat.whatsapp.com/invite/GravataiDeuBrickOficial2025',
    activeMembers: 1150,
    activeOffers: 175,
    featuredDeals: ['Caixa de Som JBL Partybox R$ 1.350', 'Celta 2010 R$ 16.500', 'Betoneira 400L R$ 1.800'],
    neighborhoods: [
      'Centro', 'Planaltina', 'Barnabé', 'Parque dos Anjos', 'Morada do Vale',
      'Vila Rica', 'Santa Fé', 'Cruzeiro', 'Jardim Ipiranga', 'Cohab',
      'Salgado', 'Passo das Pedras', 'Nossa Senhora de Fátima', 'Vera Cruz'
    ],
    themeColor: {
      border: 'border-[#0077B6]',
      bgHeader: 'bg-[#0077B6]',
      text: 'text-[#0077B6]',
      glow: 'shadow-[#0077B6]/20',
    },
  },
  {
    id: 'sao-leopoldo',
    name: 'São Leopoldo',
    slug: 'sao-leopoldo',
    tagline: 'Centro, Feitoria, Scharlau, Campina, Santos Dumont e bairros',
    slogan: 'NOSSA CIDADE, NOSSO GRUPO!',
    whatsAppGroupUrl: 'https://chat.whatsapp.com/invite/SaoLeoDeuBrickOficial2025',
    activeMembers: 1220,
    activeOffers: 185,
    featuredDeals: ['Smart TV 55 LG R$ 1.450', 'Honda Fan 160 2020 R$ 11.900', 'Furadeira DeWalt R$ 260'],
    neighborhoods: [
      'Centro', 'Cristo Rei', 'Rio Branco', 'Santo André', 'Feitoria',
      'Scharlau', 'Farrapos', 'Jardim América', 'Arroio da Manteiga', 'Campina',
      'Duque de Caxias', 'São João', 'Batista', 'Morro do Espelho'
    ],
    themeColor: {
      border: 'border-[#8338EC]',
      bgHeader: 'bg-[#8338EC]',
      text: 'text-[#8338EC]',
      glow: 'shadow-[#8338EC]/20',
    },
  },
];

// Initial realistic blacklist of RS metro fraudsters
export const INITIAL_BLACKLIST: BlacklistEntry[] = [
  {
    id: 'bl-1',
    fingerprintHash: 'DB-FP-GOLP-9921A',
    phoneOrIdentifier: '(51) 98934-1182',
    reason: 'Comprovante falso de Pix agendado com Uber Flash no Mathias Velho (Canoas)',
    bannedAt: '16/10/2026 14:22',
    bannedBy: 'Admin Radar RS',
    city: 'Canoas',
    severity: 'CRITICA',
  },
  {
    id: 'bl-2',
    fingerprintHash: 'DB-FP-CLON-5582B',
    phoneOrIdentifier: '(51) 98112-9043',
    reason: 'Clonagem de anúncio de moto CG 160 pedindo sinal de R$ 500 no Pix em Sapucaia',
    bannedAt: '15/10/2026 19:40',
    bannedBy: 'Moderação Esteio/Sapucaia',
    city: 'Sapucaia do Sul',
    severity: 'CRITICA',
  },
  {
    id: 'bl-3',
    fingerprintHash: 'DB-FP-RECEPT-1144C',
    phoneOrIdentifier: '(51) 99422-7719',
    reason: 'Tentativa de repasse de 3 iPhones com bloqueio de iCloud e boletim de furto em POA',
    bannedAt: '14/10/2026 11:15',
    bannedBy: 'Plantão Antifraude',
    city: 'Porto Alegre',
    severity: 'CRITICA',
  },
  {
    id: 'bl-4',
    fingerprintHash: 'DB-FP-TESTE-BANNED',
    phoneOrIdentifier: '(51) 99999-0000',
    reason: 'Dispositivo marcado para teste de validação de tela de banimento',
    bannedAt: '18/10/2026 10:00',
    bannedBy: 'Sistema',
    city: 'Região Metropolitana',
    severity: 'MEDIA',
  },
];

// Initial realistic community reports
export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep-101',
    targetPhone: '(51) 98912-3344',
    city: 'Canoas',
    scamType: 'Pix Falso / Comprovante Agendado',
    description: 'O cara mandou um print de Pix agendado e queria que eu entregasse um iPhone 11 na Estação Mathias Velho pelo Uber entregas. Quando fui ver no app do banco, não caiu nada!',
    proofImageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    reporterFingerprint: 'DB-FP-USER-8812A',
    status: 'banido',
    createdAt: '17/10/2026 16:30',
  },
  {
    id: 'rep-102',
    targetPhone: '(51) 99233-8871',
    city: 'Gravataí',
    scamType: 'Golpe do Sinal / Adiantamento',
    description: 'Anunciou uma Titan 160 2022 por R$ 7.000 na Parada 68. Quando chamei, disse que tinha 3 pessoas interessadas e pediu R$ 300 pra segurar a moto. Golpe manjado!',
    proofImageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    reporterFingerprint: 'DB-FP-USER-4419C',
    status: 'pendente',
    createdAt: '18/10/2026 14:10',
  },
  {
    id: 'rep-103',
    targetPhone: '(51) 98341-2290',
    city: 'São Leopoldo',
    scamType: 'Produto Sem Procedência / Roubado',
    description: 'Oferecendo ferramentas elétricas (Makita e Bosch) pela metade do preço sem nota e sem cabo de força original. Claramente produto sem procedência na Scharlau.',
    reporterFingerprint: 'DB-FP-USER-1109D',
    status: 'em_analise',
    createdAt: '18/10/2026 19:25',
  },
];

// Initial Guerrilla Campaigns
export const INITIAL_CAMPAIGNS: GuerrillaCampaign[] = [
  {
    id: 'camp-1',
    slug: 'barbada-canoas',
    cityName: 'Canoas',
    title: '🔥 Feirão da Quebrada Canoas: Celulares, Motos e Desapego Sem Golpe',
    description: 'Grupo 100% blindado por moderação local. Compre e venda direto com moradores de Canoas com segurança total.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80',
    categoryTag: 'Eletrônicos & Carros',
    clicksCount: 1420,
    scansCount: 388,
    createdAt: '10/10/2026',
  },
  {
    id: 'camp-2',
    slug: 'desapego-poa',
    cityName: 'Porto Alegre',
    title: '🚨 Brick Porto Alegre Seguro • Grupo Oficial de Negócios da Capital',
    description: 'Entrada exclusiva com triagem antifraude. Mais de 1.800 membros ativos comprando e vendendo hoje.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    categoryTag: 'Capital & Zona Norte',
    clicksCount: 2890,
    scansCount: 742,
    createdAt: '12/10/2026',
  },
  {
    id: 'camp-3',
    slug: 'feirao-esteio',
    cityName: 'Esteio',
    title: '⚡ Barbadas Esteio & Sapucaia • Negociação Rápida e Direta',
    description: 'Achados de carros, móveis, ferramentas e informática em Esteio e redondezas. Entre antes que fechem as vagas.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    categoryTag: 'Motos & Ferramentas',
    clicksCount: 910,
    scansCount: 215,
    createdAt: '14/10/2026',
  },
];

// Initial realistic Triad Identity Records (Fingerprint + Real Name + WhatsApp)
export const INITIAL_TRIAD_PROFILES: TriadProfile[] = [
  {
    id: 'tr-1',
    fingerprintHash: 'DB-FP-8B12-44FA',
    fullName: 'Rodrigo Silveira Dornelles',
    whatsapp: '(51) 99341-8820',
    city: 'Canoas',
    objective: 'comprar',
    searchedItem: 'Furadeira Makita ou DeWalt',
    deviceIp: '177.101.44.12',
    deviceInfo: 'Chrome 122 • Android 14 • 1080x2400',
    riskScore: 4,
    status: 'aprovado',
    createdAt: '19/10/2026 10:14',
  },
  {
    id: 'tr-2',
    fingerprintHash: 'DB-FP-1C90-88BC',
    fullName: 'Camila Fernandes da Rosa',
    whatsapp: '(51) 98112-4099',
    city: 'Porto Alegre',
    objective: 'vender',
    searchedItem: 'iPhone 13 128GB Impecável',
    deviceIp: '177.101.55.91',
    deviceInfo: 'Safari 17 • iOS 17.5 • iPhone 13',
    riskScore: 6,
    status: 'aprovado',
    createdAt: '19/10/2026 14:32',
  },
  {
    id: 'tr-3',
    fingerprintHash: 'DB-FP-7E23-991A',
    fullName: 'Marcos Vinicius de Souza',
    whatsapp: '(51) 98450-1123',
    city: 'Esteio',
    objective: 'trocar',
    searchedItem: 'PlayStation 4 por Celular',
    deviceIp: '177.101.12.80',
    deviceInfo: 'Edge 123 • Windows 11 • 1920x1080',
    riskScore: 8,
    status: 'aprovado',
    createdAt: '18/10/2026 18:05',
  },
  {
    id: 'tr-4',
    fingerprintHash: 'DB-FP-GOLP-9921A',
    fullName: 'Claudio Roberto Peixoto (Suspeito)',
    whatsapp: '(51) 98934-1182',
    city: 'Canoas',
    objective: 'comprar',
    searchedItem: 'Compro celulares com Pix na hora',
    deviceIp: '177.101.88.204',
    deviceInfo: 'Chrome 119 • Android 11 • 720x1600',
    riskScore: 98,
    status: 'banido',
    createdAt: '16/10/2026 14:15',
  },
  {
    id: 'tr-5',
    fingerprintHash: 'DB-FP-2A44-66E1',
    fullName: 'Juliana Beatriz Moreira',
    whatsapp: '(51) 99188-7734',
    city: 'São Leopoldo',
    objective: 'anunciar',
    searchedItem: 'Fretes e Pequenas Mudanças na Scharlau',
    deviceIp: '177.101.33.15',
    deviceInfo: 'Samsung Browser • Galaxy A54',
    riskScore: 5,
    status: 'aprovado',
    createdAt: '17/10/2026 11:40',
  },
];

// LocalStorage keys actually used across the Deu Brick application
export const STORAGE_KEYS = {
  CITIES: 'deubrick_cities_v1',
  BLACKLIST: 'deubrick_blacklist_v1',
  REPORTS: 'deubrick_reports_v1',
  CAMPAIGNS: 'deubrick_campaigns_v1',
  CURRENT_FINGERPRINT: 'deubrick_current_device_fp',
  VISITOR_LOGS: 'deubrick_visitor_logs_v1',
  TRIAD_PROFILES: 'deubrick_triad_profiles_v1',
  USER_SELECTED_CITY: 'deubrick_user_selected_city',
  WHATSAPP_CONFIG: 'deubrick_whatsapp_config_v1',
  WHATSAPP_COMMAND_LOGS: 'deubrick_whatsapp_command_logs_v1',
} as const;

const KEYS = STORAGE_KEYS;

export function getCities(): CityData[] {
  try {
    const raw = localStorage.getItem(KEYS.CITIES);
    if (!raw) {
      localStorage.setItem(KEYS.CITIES, JSON.stringify(DEFAULT_CITIES));
      return DEFAULT_CITIES;
    }
    const parsed: Partial<CityData>[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_CITIES;
    }

    // Merge each default city with any user customizations from storage
    const merged = DEFAULT_CITIES.map((defCity) => {
      const saved = parsed.find((p) => p?.id === defCity.id || p?.name === defCity.name);
      if (!saved) return defCity;
      return {
        ...defCity,
        ...saved,
        themeColor: saved.themeColor && saved.themeColor.border ? saved.themeColor : defCity.themeColor,
        neighborhoods: Array.isArray(saved.neighborhoods) && saved.neighborhoods.length > 0 ? saved.neighborhoods : defCity.neighborhoods,
        slogan: saved.slogan || defCity.slogan,
        activeOffers: typeof saved.activeOffers === 'number' ? saved.activeOffers : defCity.activeOffers,
      };
    });

    return merged;
  } catch {
    return DEFAULT_CITIES;
  }
}

export function saveCities(cities: CityData[]): void {
  localStorage.setItem(KEYS.CITIES, JSON.stringify(cities));
}

export function getBlacklist(): BlacklistEntry[] {
  try {
    const raw = localStorage.getItem(KEYS.BLACKLIST);
    if (!raw) {
      localStorage.setItem(KEYS.BLACKLIST, JSON.stringify(INITIAL_BLACKLIST));
      return INITIAL_BLACKLIST;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BLACKLIST;
  }
}

export function saveBlacklist(list: BlacklistEntry[]): void {
  localStorage.setItem(KEYS.BLACKLIST, JSON.stringify(list));
}

export function getReports(): ReportItem[] {
  try {
    const raw = localStorage.getItem(KEYS.REPORTS);
    if (!raw) {
      localStorage.setItem(KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REPORTS;
  }
}

export function saveReports(reports: ReportItem[]): void {
  localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));
}

export function getCampaigns(): GuerrillaCampaign[] {
  try {
    const raw = localStorage.getItem(KEYS.CAMPAIGNS);
    if (!raw) {
      localStorage.setItem(KEYS.CAMPAIGNS, JSON.stringify(INITIAL_CAMPAIGNS));
      return INITIAL_CAMPAIGNS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CAMPAIGNS;
  }
}

export function saveCampaigns(campaigns: GuerrillaCampaign[]): void {
  localStorage.setItem(KEYS.CAMPAIGNS, JSON.stringify(campaigns));
}

export function getTriadProfiles(): TriadProfile[] {
  try {
    const raw = localStorage.getItem(KEYS.TRIAD_PROFILES);
    if (!raw) {
      localStorage.setItem(KEYS.TRIAD_PROFILES, JSON.stringify(INITIAL_TRIAD_PROFILES));
      return INITIAL_TRIAD_PROFILES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TRIAD_PROFILES;
  }
}

export function saveTriadProfiles(profiles: TriadProfile[]): void {
  localStorage.setItem(KEYS.TRIAD_PROFILES, JSON.stringify(profiles));
}

export function addTriadProfile(profile: TriadProfile): void {
  try {
    const current = getTriadProfiles();
    const filtered = current.filter(
      (p) => p.fingerprintHash !== profile.fingerprintHash && p.whatsapp !== profile.whatsapp
    );
    const updated = [profile, ...filtered];
    saveTriadProfiles(updated);
  } catch (err) {
    console.warn('Could not save Triad profile', err);
  }
}

export function updateTriadProfileStatus(id: string, status: 'aprovado' | 'sob_analise' | 'banido'): void {
  try {
    const current = getTriadProfiles();
    const updated = current.map((p) => (p.id === id ? { ...p, status } : p));
    saveTriadProfiles(updated);
  } catch (err) {
    console.warn('Could not update Triad profile', err);
  }
}

export function getVisitorLogs(): DeviceFingerprint[] {
  try {
    const raw = localStorage.getItem(KEYS.VISITOR_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addVisitorLog(fp: DeviceFingerprint): void {
  try {
    const logs = getVisitorLogs();
    const updated = [fp, ...logs.filter((l) => l.hash !== fp.hash)].slice(0, 50);
    localStorage.setItem(KEYS.VISITOR_LOGS, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not save visitor log', err);
  }
}

// Client-side Silent Fingerprinting
export function generateDeviceFingerprint(preferredCity?: CityName): DeviceFingerprint {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
  const screenRes =
    typeof window !== 'undefined'
      ? `${window.screen.width}x${window.screen.height} (${window.screen.availWidth}x${window.screen.availHeight})`
      : '1080x1920';
  const colorDepth = typeof window !== 'undefined' ? window.screen.colorDepth : 24;
  const lang = typeof navigator !== 'undefined' ? navigator.language : 'pt-BR';
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
  const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 8;
  const platform = typeof navigator !== 'undefined' ? navigator.platform : 'Linux';

  // Canvas Hash generation
  let canvasHash = 'cv_standard_rs';
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = "14px 'Plus Jakarta Sans'";
      ctx.fillStyle = '#25D366';
      ctx.fillRect(0, 0, 160, 40);
      ctx.fillStyle = '#0B0D11';
      ctx.fillText('DeuBrickAntifraudRS', 6, 12);
      const dataUrl = canvas.toDataURL();
      let simpleHash = 0;
      for (let i = 0; i < dataUrl.length; i++) {
        simpleHash = (simpleHash << 5) - simpleHash + dataUrl.charCodeAt(i);
        simpleHash |= 0;
      }
      canvasHash = 'cv_' + Math.abs(simpleHash).toString(16).toUpperCase();
    }
  } catch {
    canvasHash = 'cv_fallback';
  }

  // Combined Unique Hash
  const rawString = `${ua}|${screenRes}|${colorDepth}|${tz}|${cores}|${canvasHash}`;
  let hashVal = 0;
  for (let i = 0; i < rawString.length; i++) {
    hashVal = (hashVal << 5) - hashVal + rawString.charCodeAt(i);
    hashVal |= 0;
  }
  const hexHash = Math.abs(hashVal).toString(16).toUpperCase().padStart(8, '0');
  const fpHash = `DB-FP-${hexHash.slice(0, 4)}-${hexHash.slice(4, 8)}`;

  // Simulated RS metropolitan IP
  const simulatedIp = `177.101.${Math.floor(Math.random() * 80) + 10}.${Math.floor(Math.random() * 240) + 10}`;

  // Default inferred city
  const cityInferred: CityName = preferredCity || 'Canoas';

  // Cross check against blacklist
  const blacklist = getBlacklist();
  const isBanned = blacklist.some(
    (b) => b.fingerprintHash.toLowerCase() === fpHash.toLowerCase()
  );

  const fp: DeviceFingerprint = {
    id: 'fp_' + Date.now(),
    hash: fpHash,
    userAgent: ua,
    screenResolution: screenRes,
    colorDepth,
    language: lang,
    timezone: tz,
    hardwareConcurrency: cores,
    deviceMemory: memory,
    platform,
    canvasHash,
    createdAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR'),
    ipSimulated: simulatedIp,
    riskScore: isBanned ? 98 : Math.floor(Math.random() * 12) + 2, // 2-14% for normal clean users
    isBanned,
    cityInferred,
  };

  try {
    localStorage.setItem(KEYS.CURRENT_FINGERPRINT, JSON.stringify(fp));
    addVisitorLog(fp);
  } catch (err) {
    console.warn(err);
  }

  return fp;
}

export function getCurrentFingerprint(): DeviceFingerprint | null {
  try {
    const raw = localStorage.getItem(KEYS.CURRENT_FINGERPRINT);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return null;
}

// =========================================================================
// ETAPA 1A — BACKUP & CONFERÊNCIA DE DADOS (SEM MODIFICAÇÃO OU MIGRAÇÃO)
// =========================================================================

export interface DeuBrickCategorySummary {
  key: string;
  label: string;
  status: 'present' | 'empty' | 'missing';
  count: number;
  description: string;
}

export interface DeuBrickBackupPackage {
  schemaVersion: '1.0';
  appName: string;
  exportedAt: string;
  exportedAtFormatted: string;
  securityNotice: string;
  summary: {
    totalCategoriesChecked: number;
    categoriesWithData: number;
    emptyOrMissingCategories: number;
    totalRecords: number;
  };
  categoriesStatus: Record<string, DeuBrickCategorySummary>;
  data: {
    triadProfiles: TriadProfile[];
    blacklist: BlacklistEntry[];
    reports: ReportItem[];
    campaigns: GuerrillaCampaign[];
    cities: CityData[];
    visitorLogs: DeviceFingerprint[];
    currentDeviceFingerprint: DeviceFingerprint | null;
    userSelectedCity: string | null;
  };
}

export interface BackupValidationResult {
  isValid: boolean;
  schemaVersion?: string;
  exportedAt?: string;
  securityNoticeFound?: boolean;
  summary?: DeuBrickBackupPackage['summary'];
  categoriesChecked: {
    name: string;
    key: string;
    found: boolean;
    count: number;
    status: 'present' | 'empty' | 'missing';
    label: string;
  }[];
  errors: string[];
  warnings: string[];
}

/**
 * generateFullSystemBackup:
 * Lê de forma estritamente somente-leitura todas as 8 chaves reais de armazenamento utilizadas pelo Deu Brick.
 * Preserva 100% dos dados originais sem apagar, modificar ou migrar nada.
 * Não inclui nenhuma senha, token ou chave secreta.
 */
export function generateFullSystemBackup(): DeuBrickBackupPackage {
  const triadRaw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.TRIAD_PROFILES) : null;
  const blacklistRaw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.BLACKLIST) : null;
  const reportsRaw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.REPORTS) : null;
  const campaignsRaw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.CAMPAIGNS) : null;
  const citiesRaw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.CITIES) : null;
  const visitorLogsRaw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.VISITOR_LOGS) : null;
  const currentFpRaw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.CURRENT_FINGERPRINT) : null;
  const userCityRaw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.USER_SELECTED_CITY) : null;

  const parseArray = <T>(raw: string | null): { data: T[]; status: 'present' | 'empty' | 'missing' } => {
    if (raw === null) return { data: [], status: 'missing' };
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return { data: parsed, status: parsed.length > 0 ? 'present' : 'empty' };
      }
      return { data: [], status: 'empty' };
    } catch {
      return { data: [], status: 'empty' };
    }
  };

  const parseObj = <T>(raw: string | null): { data: T | null; status: 'present' | 'empty' | 'missing' } => {
    if (raw === null) return { data: null, status: 'missing' };
    try {
      const parsed = JSON.parse(raw);
      return { data: parsed, status: parsed ? 'present' : 'empty' };
    } catch {
      return { data: null, status: 'empty' };
    }
  };

  const triad = parseArray<TriadProfile>(triadRaw);
  const blacklist = parseArray<BlacklistEntry>(blacklistRaw);
  const reports = parseArray<ReportItem>(reportsRaw);
  const campaigns = parseArray<GuerrillaCampaign>(campaignsRaw);
  const cities = parseArray<CityData>(citiesRaw);
  const visitorLogs = parseArray<DeviceFingerprint>(visitorLogsRaw);
  const currentFp = parseObj<DeviceFingerprint>(currentFpRaw);

  const userCityStatus: 'present' | 'empty' | 'missing' =
    userCityRaw === null ? 'missing' : userCityRaw.trim() === '' ? 'empty' : 'present';

  const categoriesStatus: Record<string, DeuBrickCategorySummary> = {
    triadProfiles: {
      key: STORAGE_KEYS.TRIAD_PROFILES,
      label: 'Tríade de Identidade',
      status: triad.status,
      count: triad.data.length,
      description: 'Perfis de usuários vinculados à Tríade: Nome Real, WhatsApp, Fingerprint Hash, Cidade e Item.',
    },
    blacklist: {
      key: STORAGE_KEYS.BLACKLIST,
      label: 'Lista Negra / Terminais Bloqueados',
      status: blacklist.status,
      count: blacklist.data.length,
      description: 'Terminais de aparelhos e números bloqueados pelo antifraude.',
    },
    reports: {
      key: STORAGE_KEYS.REPORTS,
      label: 'Central de Denúncias',
      status: reports.status,
      count: reports.data.length,
      description: 'Denúncias enviadas pelos moradores com tipo de golpe, descrição e evidências.',
    },
    campaigns: {
      key: STORAGE_KEYS.CAMPAIGNS,
      label: 'Campanhas de Guerrilha & QR',
      status: campaigns.status,
      count: campaigns.data.length,
      description: 'Slugs customizadas, tags Open Graph, contadores de cliques e scans de QR Code.',
    },
    cities: {
      key: STORAGE_KEYS.CITIES,
      label: 'Configurações de Cidades',
      status: cities.status,
      count: cities.data.length,
      description: 'Parâmetros e links dos grupos de WhatsApp das 6 cidades metropolitanas.',
    },
    visitorLogs: {
      key: STORAGE_KEYS.VISITOR_LOGS,
      label: 'Logs de Dispositivos',
      status: visitorLogs.status,
      count: visitorLogs.data.length,
      description: 'Histórico de telemetria dos últimos dispositivos que acessaram a aplicação.',
    },
    currentDeviceFingerprint: {
      key: STORAGE_KEYS.CURRENT_FINGERPRINT,
      label: 'Fingerprint do Dispositivo Atual',
      status: currentFp.status,
      count: currentFp.data ? 1 : 0,
      description: 'Hash e metadados silenciosos do terminal atualmente em uso neste navegador.',
    },
    userSelectedCity: {
      key: STORAGE_KEYS.USER_SELECTED_CITY,
      label: 'Última Cidade Selecionada',
      status: userCityStatus,
      count: userCityStatus === 'present' ? 1 : 0,
      description: 'Cidade metropolitana selecionada pelo usuário no botão inteligente de retorno.',
    },
  };

  const categoriesArray = Object.values(categoriesStatus);
  const categoriesWithData = categoriesArray.filter((c) => c.status === 'present').length;
  const emptyOrMissingCategories = categoriesArray.filter((c) => c.status !== 'present').length;
  const totalRecords = categoriesArray.reduce((acc, c) => acc + c.count, 0);

  const now = new Date();

  return {
    schemaVersion: '1.0',
    appName: 'Deu Brick - Classificados da Quebrada RS',
    exportedAt: now.toISOString(),
    exportedAtFormatted: now.toLocaleString('pt-BR'),
    securityNotice:
      'CONFIDENCIAL E RESTRITO (LGPD / PRIVACIDADE): Este backup contém dados pessoais reais cadastrados na Tríade de Identidade (Nomes Reais e Números de WhatsApp), registros de denúncias e identificadores de dispositivos. Guarde este arquivo em local seguro (armazenamento criptografado ou mídia protegida) e nunca o compartilhe publicamente.',
    summary: {
      totalCategoriesChecked: categoriesArray.length,
      categoriesWithData,
      emptyOrMissingCategories,
      totalRecords,
    },
    categoriesStatus,
    data: {
      triadProfiles: triad.data,
      blacklist: blacklist.data,
      reports: reports.data,
      campaigns: campaigns.data,
      cities: cities.data,
      visitorLogs: visitorLogs.data,
      currentDeviceFingerprint: currentFp.data,
      userSelectedCity: userCityRaw,
    },
  };
}

/**
 * validateBackupPackage:
 * Validador estritamente em memória do arquivo de backup exportado.
 * Confere schema, integridade de cada uma das 8 categorias e integridade estrutural,
 * SEM restaurar ou modificar nada no localStorage (Requisitos 8 e 9).
 */
export function validateBackupPackage(content: unknown): BackupValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!content || typeof content !== 'object') {
    return {
      isValid: false,
      categoriesChecked: [],
      errors: ['O arquivo fornecido não é um objeto JSON válido.'],
      warnings: [],
    };
  }

  const pkg = content as Partial<DeuBrickBackupPackage>;

  if (pkg.schemaVersion !== '1.0') {
    errors.push(`Versão de esquema inválida: "${pkg.schemaVersion}". Esperada versão "1.0".`);
  }

  if (!pkg.data || typeof pkg.data !== 'object') {
    errors.push('O arquivo não contém a propriedade "data" com os registros do sistema.');
    return {
      isValid: false,
      schemaVersion: pkg.schemaVersion,
      categoriesChecked: [],
      errors,
      warnings,
    };
  }

  const expectedCategories: { name: keyof DeuBrickBackupPackage['data']; key: string; label: string; isArray: boolean }[] = [
    { name: 'triadProfiles', key: STORAGE_KEYS.TRIAD_PROFILES, label: 'Tríade de Identidade', isArray: true },
    { name: 'blacklist', key: STORAGE_KEYS.BLACKLIST, label: 'Lista Negra / Terminais Bloqueados', isArray: true },
    { name: 'reports', key: STORAGE_KEYS.REPORTS, label: 'Central de Denúncias', isArray: true },
    { name: 'campaigns', key: STORAGE_KEYS.CAMPAIGNS, label: 'Campanhas de Guerrilha & QR', isArray: true },
    { name: 'cities', key: STORAGE_KEYS.CITIES, label: 'Configurações de Cidades', isArray: true },
    { name: 'visitorLogs', key: STORAGE_KEYS.VISITOR_LOGS, label: 'Logs de Dispositivos', isArray: true },
    { name: 'currentDeviceFingerprint', key: STORAGE_KEYS.CURRENT_FINGERPRINT, label: 'Fingerprint Atual', isArray: false },
    { name: 'userSelectedCity', key: STORAGE_KEYS.USER_SELECTED_CITY, label: 'Última Cidade Selecionada', isArray: false },
  ];

  const categoriesChecked: BackupValidationResult['categoriesChecked'] = [];

  for (const cat of expectedCategories) {
    const value = pkg.data[cat.name];
    const found = value !== undefined;
    let count = 0;
    let status: 'present' | 'empty' | 'missing' = 'missing';

    if (!found) {
      warnings.push(`Categoria "${cat.label}" (${cat.key}) ausente no pacote.`);
    } else if (cat.isArray) {
      if (Array.isArray(value)) {
        count = value.length;
        status = count > 0 ? 'present' : 'empty';
      } else {
        warnings.push(`Categoria "${cat.label}" esperava ser uma lista (array), mas veio em outro formato.`);
        status = 'empty';
      }
    } else {
      if (value !== null && value !== '') {
        count = 1;
        status = 'present';
      } else {
        status = 'empty';
      }
    }

    categoriesChecked.push({
      name: cat.name,
      key: cat.key,
      label: cat.label,
      found,
      count,
      status,
    });
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    schemaVersion: pkg.schemaVersion,
    exportedAt: pkg.exportedAtFormatted || pkg.exportedAt,
    securityNoticeFound: Boolean(pkg.securityNotice),
    summary: pkg.summary,
    categoriesChecked,
    errors,
    warnings,
  };
}

// =========================================================================
// ETAPA 1B — CAMADA DE ABSTRAÇÃO (STORAGE ADAPTER PATTERN)
// =========================================================================
export type { IStorageAdapter } from './storageAdapter';
export {
  LocalStorageAdapter,
  ApiStorageAdapter,
  getActiveStorageAdapter,
} from './storageAdapter';
