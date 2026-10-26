import {
  BlacklistEntry,
  CityData,
  DeviceFingerprint,
  GuerrillaCampaign,
  ReportItem,
  TriadProfile,
} from '../types';
import {
  DeuBrickBackupPackage,
  BackupValidationResult,
  getCities as localGetCities,
  saveCities as localSaveCities,
  getBlacklist as localGetBlacklist,
  saveBlacklist as localSaveBlacklist,
  getReports as localGetReports,
  saveReports as localSaveReports,
  getCampaigns as localGetCampaigns,
  saveCampaigns as localSaveCampaigns,
  getTriadProfiles as localGetTriadProfiles,
  saveTriadProfiles as localSaveTriadProfiles,
  addTriadProfile as localAddTriadProfile,
  updateTriadProfileStatus as localUpdateTriadProfileStatus,
  getVisitorLogs as localGetVisitorLogs,
  addVisitorLog as localAddVisitorLog,
  generateFullSystemBackup,
  validateBackupPackage,
} from './storage';

/**
 * Interface unificada do contrato de armazenamento (Storage Adapter Pattern).
 * Garante portabilidade total entre Google AI Studio, Lovable, Replit e servidores externos.
 */
export interface IStorageAdapter {
  readonly mode: 'local' | 'api';
  readonly isConnected: boolean;

  // Cidades metropolitanas
  getCities(): Promise<CityData[]>;
  saveCities(cities: CityData[]): Promise<void>;

  // Lista negra / Terminais banidos
  getBlacklist(): Promise<BlacklistEntry[]>;
  saveBlacklist(entries: BlacklistEntry[]): Promise<void>;
  addBlacklistEntry(entry: BlacklistEntry): Promise<void>;

  // Central de denúncias
  getReports(): Promise<ReportItem[]>;
  saveReports(reports: ReportItem[]): Promise<void>;
  addReport(report: ReportItem): Promise<void>;

  // Campanhas de guerrilha & QR
  getCampaigns(): Promise<GuerrillaCampaign[]>;
  saveCampaigns(campaigns: GuerrillaCampaign[]): Promise<void>;

  // Tríade de Identidade
  getTriadProfiles(): Promise<TriadProfile[]>;
  saveTriadProfiles(profiles: TriadProfile[]): Promise<void>;
  addTriadProfile(profile: TriadProfile): Promise<void>;
  updateTriadProfileStatus(id: string, status: 'aprovado' | 'sob_analise' | 'banido'): Promise<void>;

  // Logs de dispositivos
  getVisitorLogs(): Promise<DeviceFingerprint[]>;
  addVisitorLog(fp: DeviceFingerprint): Promise<void>;

  // Backup & Integridade
  exportBackup(): Promise<DeuBrickBackupPackage>;
  validateBackup(content: unknown): Promise<BackupValidationResult>;
}

/**
 * LocalStorageAdapter:
 * Implementação padrão que utiliza o localStorage do navegador com resposta instantânea.
 */
export class LocalStorageAdapter implements IStorageAdapter {
  readonly mode = 'local' as const;
  readonly isConnected = true;

  async getCities(): Promise<CityData[]> {
    return localGetCities();
  }

  async saveCities(cities: CityData[]): Promise<void> {
    localSaveCities(cities);
  }

  async getBlacklist(): Promise<BlacklistEntry[]> {
    return localGetBlacklist();
  }

  async saveBlacklist(entries: BlacklistEntry[]): Promise<void> {
    localSaveBlacklist(entries);
  }

  async addBlacklistEntry(entry: BlacklistEntry): Promise<void> {
    const current = localGetBlacklist();
    localSaveBlacklist([entry, ...current]);
  }

  async getReports(): Promise<ReportItem[]> {
    return localGetReports();
  }

  async saveReports(reports: ReportItem[]): Promise<void> {
    localSaveReports(reports);
  }

  async addReport(report: ReportItem): Promise<void> {
    const current = localGetReports();
    localSaveReports([report, ...current]);
  }

  async getCampaigns(): Promise<GuerrillaCampaign[]>;
  async getCampaigns(): Promise<GuerrillaCampaign[]> {
    return localGetCampaigns();
  }

  async saveCampaigns(campaigns: GuerrillaCampaign[]): Promise<void> {
    localSaveCampaigns(campaigns);
  }

  async getTriadProfiles(): Promise<TriadProfile[]> {
    return localGetTriadProfiles();
  }

  async saveTriadProfiles(profiles: TriadProfile[]): Promise<void> {
    localSaveTriadProfiles(profiles);
  }

  async addTriadProfile(profile: TriadProfile): Promise<void> {
    localAddTriadProfile(profile);
  }

  async updateTriadProfileStatus(id: string, status: 'aprovado' | 'sob_analise' | 'banido'): Promise<void> {
    localUpdateTriadProfileStatus(id, status);
  }

  async getVisitorLogs(): Promise<DeviceFingerprint[]> {
    return localGetVisitorLogs();
  }

  async addVisitorLog(fp: DeviceFingerprint): Promise<void> {
    localAddVisitorLog(fp);
  }

  async exportBackup(): Promise<DeuBrickBackupPackage> {
    return generateFullSystemBackup();
  }

  async validateBackup(content: unknown): Promise<BackupValidationResult> {
    return validateBackupPackage(content);
  }
}

/**
 * ApiStorageAdapter:
 * Implementação preparada para conectar a qualquer API REST/JSON (Supabase, Express, Render, Replit, Lovable)
 * com fallback transparente para localStorage caso o backend esteja indisponível (resiliência offline).
 */
export class ApiStorageAdapter implements IStorageAdapter {
  readonly mode = 'api' as const;
  private readonly baseUrl: string;
  private readonly fallback: LocalStorageAdapter;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.fallback = new LocalStorageAdapter();
  }

  get isConnected(): boolean {
    return Boolean(this.baseUrl);
  }

  private async fetchWithFallback<T>(endpoint: string, options?: RequestInit, fallbackFn?: () => Promise<T>): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      if (fallbackFn) {
        return await fallbackFn();
      }
      throw err;
    }
  }

  async getCities(): Promise<CityData[]> {
    return this.fetchWithFallback<CityData[]>('/api/cities', undefined, () => this.fallback.getCities());
  }

  async saveCities(cities: CityData[]): Promise<void> {
    await this.fetchWithFallback('/api/cities', {
      method: 'PUT',
      body: JSON.stringify(cities),
    }, () => this.fallback.saveCities(cities));
  }

  async getBlacklist(): Promise<BlacklistEntry[]> {
    return this.fetchWithFallback<BlacklistEntry[]>('/api/blacklist', undefined, () => this.fallback.getBlacklist());
  }

  async saveBlacklist(entries: BlacklistEntry[]): Promise<void> {
    await this.fetchWithFallback('/api/blacklist', {
      method: 'PUT',
      body: JSON.stringify(entries),
    }, () => this.fallback.saveBlacklist(entries));
  }

  async addBlacklistEntry(entry: BlacklistEntry): Promise<void> {
    await this.fetchWithFallback('/api/blacklist', {
      method: 'POST',
      body: JSON.stringify(entry),
    }, () => this.fallback.addBlacklistEntry(entry));
  }

  async getReports(): Promise<ReportItem[]> {
    return this.fetchWithFallback<ReportItem[]>('/api/reports', undefined, () => this.fallback.getReports());
  }

  async saveReports(reports: ReportItem[]): Promise<void> {
    await this.fetchWithFallback('/api/reports', {
      method: 'PUT',
      body: JSON.stringify(reports),
    }, () => this.fallback.saveReports(reports));
  }

  async addReport(report: ReportItem): Promise<void> {
    await this.fetchWithFallback('/api/reports', {
      method: 'POST',
      body: JSON.stringify(report),
    }, () => this.fallback.addReport(report));
  }

  async getCampaigns(): Promise<GuerrillaCampaign[]> {
    return this.fetchWithFallback<GuerrillaCampaign[]>('/api/campaigns', undefined, () => this.fallback.getCampaigns());
  }

  async saveCampaigns(campaigns: GuerrillaCampaign[]): Promise<void> {
    await this.fetchWithFallback('/api/campaigns', {
      method: 'PUT',
      body: JSON.stringify(campaigns),
    }, () => this.fallback.saveCampaigns(campaigns));
  }

  async getTriadProfiles(): Promise<TriadProfile[]> {
    return this.fetchWithFallback<TriadProfile[]>('/api/triad', undefined, () => this.fallback.getTriadProfiles());
  }

  async saveTriadProfiles(profiles: TriadProfile[]): Promise<void> {
    await this.fetchWithFallback('/api/triad', {
      method: 'PUT',
      body: JSON.stringify(profiles),
    }, () => this.fallback.saveTriadProfiles(profiles));
  }

  async addTriadProfile(profile: TriadProfile): Promise<void> {
    await this.fetchWithFallback('/api/triad', {
      method: 'POST',
      body: JSON.stringify(profile),
    }, () => this.fallback.addTriadProfile(profile));
  }

  async updateTriadProfileStatus(id: string, status: 'aprovado' | 'sob_analise' | 'banido'): Promise<void> {
    await this.fetchWithFallback(`/api/triad/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }, () => this.fallback.updateTriadProfileStatus(id, status));
  }

  async getVisitorLogs(): Promise<DeviceFingerprint[]> {
    return this.fetchWithFallback<DeviceFingerprint[]>('/api/visitor-logs', undefined, () => this.fallback.getVisitorLogs());
  }

  async addVisitorLog(fp: DeviceFingerprint): Promise<void> {
    await this.fetchWithFallback('/api/visitor-logs', {
      method: 'POST',
      body: JSON.stringify(fp),
    }, () => this.fallback.addVisitorLog(fp));
  }

  async exportBackup(): Promise<DeuBrickBackupPackage> {
    return this.fallback.exportBackup();
  }

  async validateBackup(content: unknown): Promise<BackupValidationResult> {
    return this.fallback.validateBackup(content);
  }
}

/**
 * Factory singleton que seleciona automaticamente o StorageAdapter ativo:
 * - Se VITE_API_URL estiver definida no ambiente, usa ApiStorageAdapter com fallback.
 * - Caso contrário (padrão atual), usa LocalStorageAdapter (100% offline e sem custos).
 */
let activeAdapterInstance: IStorageAdapter | null = null;

export function getActiveStorageAdapter(): IStorageAdapter {
  if (activeAdapterInstance) {
    return activeAdapterInstance;
  }

  const apiUrl = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL
    ? String(import.meta.env.VITE_API_URL).trim()
    : '';

  if (apiUrl) {
    activeAdapterInstance = new ApiStorageAdapter(apiUrl);
  } else {
    activeAdapterInstance = new LocalStorageAdapter();
  }

  return activeAdapterInstance;
}
