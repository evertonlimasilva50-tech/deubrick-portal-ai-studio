import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import {
  ShieldCheck,
  Lock,
  Plus,
  QrCode,
  Download,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Pin,
  MessageSquare,
  BookOpen,
  Send,
  Users,
  AlertTriangle,
  Upload,
  Globe,
  Smartphone,
  Eye,
  EyeOff,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileText,
  Sliders,
  ChevronRight,
  X,
  Sparkles,
  UserCheck,
  UserX,
  Fingerprint,
  Phone,
  User,
  HardDrive,
  FileCheck,
  Shield,
  AlertCircle,
  Bot,
} from 'lucide-react';
import {
  BlacklistEntry,
  CityData,
  CityName,
  DeviceFingerprint,
  GuerrillaCampaign,
  ReportItem,
  TriadProfile,
} from '../types';
import {
  getCampaigns,
  saveCampaigns,
  getCities,
  saveCities,
  getReports,
  saveReports,
  getBlacklist,
  saveBlacklist,
  getVisitorLogs,
  getTriadProfiles,
  saveTriadProfiles,
  updateTriadProfileStatus,
  generateFullSystemBackup,
  validateBackupPackage,
  DeuBrickBackupPackage,
  BackupValidationResult,
  STORAGE_KEYS,
  getActiveStorageAdapter,
} from '../services/storage';
import { RealTimeThreatDashboard } from './RealTimeThreatDashboard';
import { WhatsAppApiPanel } from './WhatsAppApiPanel';

interface AdminPanelProps {
  onClose: () => void;
  currentFingerprint?: DeviceFingerprint;
  onSimulateBanSelf?: (banned: boolean) => void;
  isSelfBanned?: boolean;
}

type AdminTab = 'campaigns' | 'triad' | 'whatsapp_api' | 'pinned_links' | 'cities' | 'reports' | 'blacklist' | 'scanner';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onClose,
  currentFingerprint,
  onSimulateBanSelf,
  isSelfBanned,
}) => {
  // Simple password check (unlocked with 'deubrick2025' or 'admin123' or 'admin')
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active admin tab
  const [activeTab, setActiveTab] = useState<AdminTab>('campaigns');

  // Data states
  const [campaigns, setCampaigns] = useState<GuerrillaCampaign[]>([]);
  const [cities, setCities] = useState<CityData[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>([]);
  const [visitorLogs, setVisitorLogs] = useState<DeviceFingerprint[]>([]);
  const [triadProfiles, setTriadProfiles] = useState<TriadProfile[]>([]);

  // Search & Filter States
  const [reportFilter, setReportFilter] = useState<'all' | 'pendente' | 'em_analise' | 'banido'>('all');
  const [blacklistSearch, setBlacklistSearch] = useState('');
  const [scannerSearch, setScannerSearch] = useState('');
  const [triadSearch, setTriadSearch] = useState('');
  const [triadCityFilter, setTriadCityFilter] = useState<string>('all');
  const [triadStatusFilter, setTriadStatusFilter] = useState<'all' | 'aprovado' | 'sob_analise' | 'banido'>('all');

  // Mobile toggle for WhatsApp preview in campaign builder
  const [showWhatsAppPreview, setShowWhatsAppPreview] = useState(false);

  // New Campaign Form State
  const [newSlug, setNewSlug] = useState('barbada-quebrada');
  const [newCity, setNewCity] = useState<CityName>('Canoas');
  const [newTitle, setNewTitle] = useState('🔥 Feirão de Barbadas Canoas • Celulares e Desapego Sem Golpe');
  const [newDescription, setNewDescription] = useState('Grupo 100% verificado por moderação local. Compre e venda com segurança total direto no WhatsApp.');
  const [newThumbnail, setNewThumbnail] = useState('https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80');
  const [newCategoryTag, setNewCategoryTag] = useState('Eletrônicos & Carros');

  // Preview device modal / QR modal powered by qrcode.react
  const [activeQrModal, setActiveQrModal] = useState<{
    url: string;
    title: string;
    slug?: string;
    cityName?: CityName;
  } | null>(null);
  const [qrColorTheme, setQrColorTheme] = useState<'yellow' | 'white' | 'green' | 'dark_gold'>('yellow');
  const [qrRenderMode, setQrRenderMode] = useState<'canvas' | 'svg'>('canvas');
  const [includeCenterLogo, setIncludeCenterLogo] = useState<boolean>(true);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const qrSvgRef = useRef<HTMLDivElement | null>(null);

  // Stencil Color Palettes for High-Performance QR Codes
  const STENCIL_QR_THEMES = {
    yellow: {
      id: 'yellow',
      name: 'Asfalto & Amarelo Alerta',
      fg: '#0B0D11',
      bg: '#FFE500',
      badgeClass: 'bg-[#FFE500] text-black border-[#FFE500]',
      desc: 'Máxima visibilidade em postes e pontos de ônibus',
    },
    white: {
      id: 'white',
      name: 'Preto & Branco Gráfica',
      fg: '#000000',
      bg: '#FFFFFF',
      badgeClass: 'bg-white text-black border-white',
      desc: 'Ideal para panfletos offset e fotocópias PB',
    },
    green: {
      id: 'green',
      name: 'Verde WhatsApp Quebrada',
      fg: '#0B0D11',
      bg: '#25D366',
      badgeClass: 'bg-[#25D366] text-black border-[#25D366]',
      desc: 'Identidade oficial dos grupos metropolitanos',
    },
    dark_gold: {
      id: 'dark_gold',
      name: 'Dark Street Ouro Metropolitano',
      fg: '#FFE500',
      bg: '#0E121A',
      badgeClass: 'bg-zinc-900 text-[#FFE500] border-[#FFE500]',
      desc: 'Estilo noturno moderno com contraste tático',
    },
  };
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Blacklist Entry form
  const [manualPhone, setManualPhone] = useState('');
  const [manualReason, setManualReason] = useState('');
  const [manualCity, setManualCity] = useState<CityName>('Canoas');

  // Selected report preview image
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Etapa 1A: Backup & Conferência de Dados
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [backupPackage, setBackupPackage] = useState<DeuBrickBackupPackage | null>(null);
  const [backupDownloadNotice, setBackupDownloadNotice] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<BackupValidationResult | null>(null);
  const [validationFileError, setValidationFileError] = useState<string | null>(null);
  const [validatedFileName, setValidatedFileName] = useState<string | null>(null);
  const backupFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenBackupModal = () => {
    // Leitura estritamente somente-leitura de todas as 8 chaves reais
    const pkg = generateFullSystemBackup();
    setBackupPackage(pkg);
    setBackupDownloadNotice(null);
    setValidationResult(null);
    setValidationFileError(null);
    setValidatedFileName(null);
    setIsBackupModalOpen(true);
  };

  const handleDownloadBackup = () => {
    const pkg = generateFullSystemBackup();
    setBackupPackage(pkg);

    const jsonString = JSON.stringify(pkg, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    const safeDate = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `deubrick_backup_v1_${safeDate}.json`;

    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);

    setBackupDownloadNotice(`Backup "${filename}" gerado com sucesso! Guarde-o em local seguro.`);
  };

  const handleFileVerificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValidatedFileName(file.name);
    setValidationFileError(null);
    setValidationResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const result = validateBackupPackage(parsed);
        setValidationResult(result);
      } catch (err) {
        setValidationFileError('Erro ao processar arquivo: o conteúdo não é um JSON válido.');
      }
    };
    reader.onerror = () => {
      setValidationFileError('Falha ao ler o arquivo local.');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Load initial data
  useEffect(() => {
    setCampaigns(getCampaigns());
    setCities(getCities());
    setReports(getReports());
    setBlacklist(getBlacklist());
    setVisitorLogs(getVisitorLogs());
    setTriadProfiles(getTriadProfiles());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'deubrick2025' || passwordInput === 'admin123' || passwordInput === 'admin') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Senha incorreta! Utilize "deubrick2025" ou "admin123"');
    }
  };

  // Thumbnail presets
  const thumbnailPresets = [
    {
      name: 'Smartphones & Eletrônicos',
      url: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Motos & Veículos RS',
      url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Quebrada & Urbano Poa',
      url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Ferramentas & Casa',
      url: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=800&q=80',
    },
  ];

  // 6 Flyer Templates directly from the reference image
  const flyerPresets = [
    {
      label: 'Flyer 1 • Vem pro Brick Real',
      slug: 'brick-real',
      title: '👑 DEU-BRICK: Chega de Perder Tempo no Concorrente, Vem pro Brick Real!',
      description: 'Negócio Local, Sem Golpe, Pix ou Dinheiro e 100% Grátis. Entre no grupo oficial da sua cidade!',
      category: 'Geral & Desapego',
    },
    {
      label: 'Flyer 2 • Face Travando Tudo',
      slug: 'destravar-vendas',
      title: '⚠️ Ninguém Mais Aguenta o Marketplace Travando Tudo! Vem pro Zap!',
      description: 'Vagas Limitadas: as ofertas caem direto no celular sem intermediários nem espera.',
      category: 'Comércio Local',
    },
    {
      label: 'Flyer 3 • Chega de Curioso',
      slug: 'sem-curioso',
      title: '🔥 Cansado de Anunciar e Só Aparecer Curioso? Postou, Vendeu!',
      description: 'Grupo povão, direto com o dono e sem frescura. Negociação rápida e respeito mútuo.',
      category: 'Desapego Rápido',
    },
    {
      label: 'Flyer 4 • Alerta Vendedores',
      slug: 'vendedores-locais',
      title: '🚨 AVISO URGENTE: O Comércio da Cidade Migrou pro Whats do Deu-Brick!',
      description: 'Comunidade blindada contra golpes e focada em quem quer fechar negócio no mesmo dia.',
      category: 'Vendedores da Quebrada',
    },
    {
      label: 'Flyer 5 • Chega de Esperar Resposta',
      slug: 'resposta-imediata',
      title: '⚡ Sem Filtro de Algoritmo, Sem Mensagens Fantasma. Postou, Vendeu!',
      description: 'Seu produto na tela de centenas de compradores reais da sua cidade de forma instantânea.',
      category: 'Negócios Imediatos',
    },
    {
      label: 'Flyer 6 • Anunciando pras Paredes',
      slug: 'liberdade-comercio',
      title: '📢 Você Está Anunciando para as Paredes? Não Seja Refém Deles!',
      description: 'Negociação direta, na palma da mão e resposta imediata. Juntos somos mais fortes!',
      category: 'Feirão da Quebrada',
    },
  ];

  // Create Campaign
  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = newSlug.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    const fullUrl = `${window.location.origin}/?slug=${cleanSlug}`;

    const newCamp: GuerrillaCampaign = {
      id: 'camp-' + Date.now(),
      slug: cleanSlug,
      cityName: newCity,
      title: newTitle.trim(),
      description: newDescription.trim(),
      thumbnailUrl: newThumbnail,
      categoryTag: newCategoryTag,
      clicksCount: 0,
      scansCount: 0,
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };

    const updated = [newCamp, ...campaigns];
    setCampaigns(updated);
    saveCampaigns(updated);

    setActiveQrModal({
      url: fullUrl,
      title: newCamp.title,
      slug: cleanSlug,
      cityName: newCamp.cityName,
    });
  };

  // Open QR Code for existing campaign
  const handleOpenExistingQr = (camp: GuerrillaCampaign) => {
    const fullUrl = `${window.location.origin}/?slug=${camp.slug}`;
    setActiveQrModal({
      url: fullUrl,
      title: camp.title,
      slug: camp.slug,
      cityName: camp.cityName,
    });
  };

  // Download high-resolution PNG using QRCodeCanvas
  const handleDownloadQrPng = () => {
    if (!activeQrModal) return;
    const canvas = qrCanvasRef.current;
    if (canvas) {
      // Create high-res 1024x1024 printable canvas for maximum sharpness on print
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 1024;
      exportCanvas.height = 1024;
      const ctx = exportCanvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(canvas, 0, 0, 1024, 1024);
        const link = document.createElement('a');
        link.download = `qrcode-${activeQrModal.slug || 'deubrick'}-1024px.png`;
        link.href = exportCanvas.toDataURL('image/png');
        link.click();
        return;
      }
      const link = document.createElement('a');
      link.download = `qrcode-${activeQrModal.slug || 'deubrick'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  // Download Vector SVG using QRCodeSVG
  const handleDownloadQrSvg = () => {
    if (!activeQrModal || !qrSvgRef.current) return;
    const svg = qrSvgRef.current.querySelector('svg');
    if (svg) {
      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(svg);
      const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `qrcode-${activeQrModal.slug || 'deubrick'}-vetor.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  // Delete Campaign
  const handleDeleteCampaign = (id: string) => {
    if (confirm('Tem certeza que deseja apagar esta campanha de guerrilha?')) {
      const updated = campaigns.filter((c) => c.id !== id);
      setCampaigns(updated);
      saveCampaigns(updated);
    }
  };

  // Update City WhatsApp URL
  const handleUpdateCity = (cityId: string, newUrl: string, newMembers: number) => {
    const updated = cities.map((c) => {
      if (c.id === cityId) {
        return { ...c, whatsAppGroupUrl: newUrl, activeMembers: newMembers };
      }
      return c;
    });
    setCities(updated);
    saveCities(updated);
    setCopiedId(`city-${cityId}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Tríade Actions: Ban Terminal & Phone
  const handleBanTriadProfile = (profile: TriadProfile) => {
    if (confirm(`Deseja bloquear permanentemente o terminal e WhatsApp de ${profile.fullName}?`)) {
      updateTriadProfileStatus(profile.id, 'banido');
      setTriadProfiles(getTriadProfiles());

      const newBlEntry: BlacklistEntry = {
        id: 'bl-' + Date.now(),
        fingerprintHash: profile.fingerprintHash,
        phoneOrIdentifier: profile.whatsapp,
        reason: `Banimento via Tríade de Identidade: ${profile.fullName} (${profile.searchedItem})`,
        bannedAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR').slice(0, 5),
        bannedBy: 'Admin Moderação',
        city: profile.city,
        severity: 'CRITICA',
      };
      const updatedBl = [newBlEntry, ...blacklist.filter((b) => b.fingerprintHash !== profile.fingerprintHash)];
      setBlacklist(updatedBl);
      saveBlacklist(updatedBl);
    }
  };

  const handleUnbanTriadProfile = (profile: TriadProfile) => {
    updateTriadProfileStatus(profile.id, 'aprovado');
    setTriadProfiles(getTriadProfiles());

    const updatedBl = blacklist.filter(
      (b) =>
        b.fingerprintHash.toLowerCase() !== profile.fingerprintHash.toLowerCase() &&
        b.phoneOrIdentifier !== profile.whatsapp
    );
    setBlacklist(updatedBl);
    saveBlacklist(updatedBl);
  };

  const handleExportTriadAudit = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(triadProfiles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `deubrick_triade_auditoria_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handle report status change and direct ban
  const handleBanFromReport = (rep: ReportItem) => {
    const newEntry: BlacklistEntry = {
      id: 'bl-' + Date.now(),
      fingerprintHash: `DB-FP-BAN-${Math.floor(1000 + Math.random() * 9000)}`,
      phoneOrIdentifier: rep.targetPhone,
      reason: `Banido via denúncia confirmada: ${rep.scamType} - ${rep.description.slice(0, 60)}...`,
      bannedAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR').slice(0, 5),
      bannedBy: 'Admin Plantão',
      city: rep.city,
      severity: 'CRITICA',
    };

    const updatedBlacklist = [newEntry, ...blacklist];
    setBlacklist(updatedBlacklist);
    saveBlacklist(updatedBlacklist);

    const updatedReports = reports.map((r) =>
      r.id === rep.id ? { ...r, status: 'banido' as const } : r
    );
    setReports(updatedReports);
    saveReports(updatedReports);
  };

  const handleUpdateReportStatus = (reportId: string, newStatus: ReportItem['status']) => {
    const updated = reports.map((r) =>
      r.id === reportId ? { ...r, status: newStatus } : r
    );
    setReports(updated);
    saveReports(updated);
  };

  // Add manual ban
  const handleAddManualBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPhone || !manualReason) return;

    const newEntry: BlacklistEntry = {
      id: 'bl-' + Date.now(),
      fingerprintHash: `DB-FP-MAN-${Math.floor(1000 + Math.random() * 9000)}`,
      phoneOrIdentifier: manualPhone,
      reason: manualReason,
      bannedAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR').slice(0, 5),
      bannedBy: 'Admin Manual',
      city: manualCity,
      severity: 'ALTA',
    };

    const updated = [newEntry, ...blacklist];
    setBlacklist(updated);
    saveBlacklist(updated);
    setManualPhone('');
    setManualReason('');
  };

  // Remove ban
  const handleRemoveBan = (id: string) => {
    const updated = blacklist.filter((b) => b.id !== id);
    setBlacklist(updated);
    saveBlacklist(updated);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered lists
  const pendingReportsCount = reports.filter((r) => r.status === 'pendente').length;
  const filteredReports = reports.filter((r) => {
    if (reportFilter === 'all') return true;
    return r.status === reportFilter;
  });

  const filteredBlacklist = blacklist.filter((b) => {
    if (!blacklistSearch.trim()) return true;
    const query = blacklistSearch.toLowerCase();
    return (
      b.phoneOrIdentifier.toLowerCase().includes(query) ||
      b.city.toLowerCase().includes(query) ||
      b.reason.toLowerCase().includes(query) ||
      b.fingerprintHash.toLowerCase().includes(query)
    );
  });

  const filteredVisitorLogs = visitorLogs.filter((log) => {
    if (!scannerSearch.trim()) return true;
    const query = scannerSearch.toLowerCase();
    return (
      log.hash.toLowerCase().includes(query) ||
      (log.ipSimulated && log.ipSimulated.toLowerCase().includes(query)) ||
      log.userAgent.toLowerCase().includes(query)
    );
  });

  const totalMembers = cities.reduce((acc, c) => acc + (c.activeMembers || 0), 0);

  // Login view if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
        <div className="w-full max-w-sm sm:max-w-md bg-[#0F1218] border-3 border-[#FFE500]/50 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-xl bg-[#FFE500]/20 border-2 border-[#FFE500] text-[#FFE500] flex items-center justify-center shadow-lg">
              <Lock className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h2 className="font-stencil text-2xl text-white uppercase tracking-wider pt-1">
              PAINEL DA MODERAÇÃO
            </h2>
            <p className="text-xs text-slate-400">
              Área restrita aos administradores e moderadores das 6 cidades do Deu-Brick.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-stencil text-slate-300 mb-1.5">
                SENHA DE ACESSO:
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Digite a senha..."
                className="w-full px-4 py-3 bg-black border-2 border-white/20 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-[#FFE500]"
                autoFocus
                required
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-400 font-bold bg-red-950/50 p-2.5 rounded-lg border border-red-500/40">
                {loginError}
              </p>
            )}

            <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-[11px] text-slate-400">
              <span>
                🔑 Senha de demonstração rápida: <strong className="text-[#FFE500] font-mono">deubrick2025</strong>
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border-2 border-white/15 text-slate-300 text-xs font-bold hover:bg-white/5 transition-colors cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-[#FFE500] hover:bg-[#FFE500]/90 text-black text-xs font-stencil uppercase tracking-wider transition-all shadow-lg border-2 border-black cursor-pointer"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#08090C] text-slate-100 flex flex-col overflow-hidden animate-slide-up-fade">
      {/* Top Navbar - Clean, Compact & Responsive */}
      <header className="bg-[#0E121A] border-b-2 border-white/10 px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#FFE500] text-black font-stencil flex items-center justify-center text-xs font-bold shrink-0 border border-black shadow-sm">
            ADM
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-stencil text-sm sm:text-base text-white tracking-wide truncate">
                DEU-BRICK RS • MODERAÇÃO
              </h2>
              <span className="px-1.5 py-0.2 rounded-sm text-[9px] font-stencil bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                ONLINE
              </span>
              <span className="px-1.5 py-0.2 rounded-sm text-[9px] font-mono bg-white/10 text-slate-300 border border-white/15 shrink-0 hidden md:inline">
                {getActiveStorageAdapter().mode === 'api' ? 'API CONECTADA' : 'ARMAZENAMENTO LOCAL'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate hidden sm:block">
              Fábrica de Links, Grupos WhatsApp, Denúncias & Scanner Antifraude
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Botão de Backup Geral do Sistema (Etapa 1A) */}
          <button
            onClick={handleOpenBackupModal}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#FFE500]/15 hover:bg-[#FFE500]/25 text-[#FFE500] text-xs font-stencil flex items-center gap-1.5 border border-[#FFE500]/40 transition-colors cursor-pointer shadow-sm"
            title="Exportar backup completo de todos os dados do sistema em JSON"
          >
            <HardDrive className="w-3.5 h-3.5 text-[#FFE500]" />
            <span className="hidden sm:inline">Backup Geral</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#FFE500]/20 text-[#FFE500] font-bold">
              JSON
            </span>
          </button>

          {/* Quick toggle to simulate ban on current device */}
          {onSimulateBanSelf && (
            <button
              onClick={() => onSimulateBanSelf(!isSelfBanned)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border-2 flex items-center gap-1 cursor-pointer ${
                isSelfBanned
                  ? 'bg-red-600 text-white border-red-500 animate-pulse'
                  : 'bg-black/60 hover:bg-white/10 text-slate-300 border-white/15'
              }`}
              title="Testar como a tela de banimento aparece quando o aparelho é bloqueado"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#FFE500]" />
              <span className="hidden md:inline text-[11px]">
                {isSelfBanned ? 'Aparelho Banido (Ativo)' : 'Simular Ban'}
              </span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold border border-white/20 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fechar</span>
          </button>
        </div>
      </header>

      {/* Quick KPI Overview Strip - Tap to switch tabs! */}
      <div className="bg-[#0A0D14] border-b border-white/10 px-3 sm:px-5 py-2 overflow-x-auto scrollbar-none shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-max">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-3 py-1.5 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'campaigns'
                ? 'bg-[#FFE500]/15 border-[#FFE500] text-white'
                : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/20'
            }`}
          >
            <QrCode className="w-4 h-4 text-[#FFE500]" />
            <div className="text-[11px]">
              <span className="text-slate-400 block text-[9px] uppercase font-mono">Campanhas</span>
              <strong className="text-white font-stencil">{campaigns.length} Links</strong>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('triad')}
            className={`px-3 py-1.5 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'triad'
                ? 'bg-[#FFE500]/25 border-[#FFE500] text-white shadow-lg'
                : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/20'
            }`}
          >
            <Fingerprint className="w-4 h-4 text-[#FFE500]" />
            <div className="text-[11px]">
              <span className="text-slate-400 block text-[9px] uppercase font-mono">Tríade Identidade</span>
              <strong className="text-white font-stencil">{triadProfiles.length} Perfis</strong>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp_api')}
            className={`px-3 py-1.5 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'whatsapp_api'
                ? 'bg-[#25D366]/25 border-[#25D366] text-white shadow-lg'
                : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/20'
            }`}
          >
            <Bot className="w-4 h-4 text-[#25D366]" />
            <div className="text-[11px]">
              <span className="text-slate-400 block text-[9px] uppercase font-mono">WhatsApp API</span>
              <strong className="text-white font-stencil">Baileys / Evolution</strong>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('cities')}
            className={`px-3 py-1.5 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'cities'
                ? 'bg-[#25D366]/15 border-[#25D366] text-white'
                : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/20'
            }`}
          >
            <Users className="w-4 h-4 text-[#25D366]" />
            <div className="text-[11px]">
              <span className="text-slate-400 block text-[9px] uppercase font-mono">Grupos Zap</span>
              <strong className="text-white font-stencil">{cities.length} Cidades ({totalMembers})</strong>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-red-500/20 border-red-500 text-white'
                : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/20'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <div className="text-[11px]">
              <span className="text-slate-400 block text-[9px] uppercase font-mono">Denúncias</span>
              <strong className={`font-stencil ${pendingReportsCount > 0 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                {pendingReportsCount} Pendentes
              </strong>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('blacklist')}
            className={`px-3 py-1.5 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'blacklist'
                ? 'bg-amber-500/20 border-amber-500 text-white'
                : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/20'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <div className="text-[11px]">
              <span className="text-slate-400 block text-[9px] uppercase font-mono">Blacklist</span>
              <strong className="text-white font-stencil">{blacklist.length} Bloqueados</strong>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-3 py-1.5 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'scanner'
                ? 'bg-sky-500/20 border-sky-500 text-white'
                : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/20'
            }`}
          >
            <Smartphone className="w-4 h-4 text-sky-400" />
            <div className="text-[11px]">
              <span className="text-slate-400 block text-[9px] uppercase font-mono">Scanner</span>
              <strong className="text-white font-stencil">{visitorLogs.length} Dispositivos</strong>
            </div>
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <nav className="bg-[#10141E] border-b-2 border-white/10 px-3 sm:px-5 flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`py-3 px-3.5 text-xs font-stencil border-b-3 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'campaigns'
              ? 'border-[#FFE500] text-[#FFE500] bg-white/[0.04]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Fábrica de Links & QR</span>
        </button>

        <button
          onClick={() => setActiveTab('triad')}
          className={`py-3 px-3.5 text-xs font-stencil border-b-3 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'triad'
              ? 'border-[#FFE500] text-[#FFE500] bg-white/[0.04]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Fingerprint className="w-4 h-4 text-[#FFE500]" />
          <span>Tríade & Antifraude ({triadProfiles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('whatsapp_api')}
          className={`py-3 px-3.5 text-xs font-stencil border-b-3 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'whatsapp_api'
              ? 'border-[#25D366] text-[#25D366] bg-white/[0.04]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4 text-[#25D366]" />
          <span>WhatsApp APIs & Baileys</span>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#25D366]/20 text-[#25D366] font-bold">
            NOVO
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pinned_links')}
          className={`py-3 px-3.5 text-xs font-stencil border-b-3 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'pinned_links'
              ? 'border-[#FFE500] text-[#FFE500] bg-white/[0.04]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Pin className="w-4 h-4" />
          <span>Avisos Zap</span>
        </button>

        <button
          onClick={() => setActiveTab('cities')}
          className={`py-3 px-3.5 text-xs font-stencil border-b-3 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'cities'
              ? 'border-[#25D366] text-[#25D366] bg-white/[0.04]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Grupos WhatsApp ({cities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`py-3 px-3.5 text-xs font-stencil border-b-3 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'reports'
              ? 'border-red-500 text-red-400 bg-white/[0.04]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Denúncias</span>
          {pendingReportsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-sm bg-red-600 text-[10px] text-white font-bold font-mono">
              {pendingReportsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('blacklist')}
          className={`py-3 px-3.5 text-xs font-stencil border-b-3 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'blacklist'
              ? 'border-amber-400 text-amber-400 bg-white/[0.04]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Blacklist ({blacklist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('scanner')}
          className={`py-3 px-3.5 text-xs font-stencil border-b-3 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'scanner'
              ? 'border-sky-400 text-sky-400 bg-white/[0.04]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Scanner Logs</span>
        </button>
      </nav>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-6">
        {/* ========================================================= */}
        {/* TAB 1: FÁBRICA DE LINKS, CARDS E QR CODES */}
        {/* ========================================================= */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Top Banner */}
            <div className="p-4 rounded-xl bg-[#0E121A] border-2 border-[#FFE500]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-stencil text-base sm:text-lg text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-[#FFE500]" />
                  FÁBRICA DE LINKS DE GUERRILHA & QR CODES
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Gere URLs personalizadas com slug limpa, capa Open Graph para WhatsApp e QR Code em alta definição para panfletos e lambe-lambe.
                </p>
              </div>

              {/* Mobile toggle for preview */}
              <button
                type="button"
                onClick={() => setShowWhatsAppPreview(!showWhatsAppPreview)}
                className="lg:hidden px-3 py-1.5 rounded-lg bg-black border border-white/20 text-xs font-bold text-[#FFE500] flex items-center gap-1.5 self-end sm:self-auto"
              >
                {showWhatsAppPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showWhatsAppPreview ? 'Ocultar Prévia Zap' : 'Ver Prévia Zap'}</span>
              </button>
            </div>

            {/* Campaign Creator Form & Live Open Graph Simulator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Form Column */}
              <div className="lg:col-span-7 bg-[#0E121A] border-2 border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
                <h4 className="font-stencil text-sm text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#FFE500]" />
                  CADASTRAR NOVO LINK DE GUERRILHA
                </h4>

                {/* 6 Panfletos Prontos Selector */}
                <div className="space-y-2 p-3 rounded-xl bg-black border border-[#FFE500]/40">
                  <span className="text-[10px] sm:text-[11px] font-stencil tracking-wider text-[#FFE500] uppercase block">
                    ⚡ PREENCHER COM MODELOS DOS 6 PANFLETOS OFICIAIS:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {flyerPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setNewSlug(preset.slug);
                          setNewTitle(preset.title);
                          setNewDescription(preset.description);
                          setNewCategoryTag(preset.category);
                        }}
                        className="p-1.5 text-left rounded bg-zinc-900 hover:bg-[#FFE500] hover:text-black text-slate-300 border border-white/10 text-[10px] font-bold truncate transition-colors cursor-pointer"
                        title={preset.title}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleCreateCampaign} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Slug Customizada da URL *
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center bg-black border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono gap-1">
                      <span className="text-slate-500 text-xs truncate">{window.location.host}/?slug=</span>
                      <input
                        type="text"
                        value={newSlug}
                        onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
                        placeholder="barbada-canoas"
                        className="bg-transparent text-[#FFE500] font-bold focus:outline-none flex-1 text-xs sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Cidade do Grupo WhatsApp *
                      </label>
                      <select
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value as CityName)}
                        className="w-full px-3 py-2 bg-black border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-[#FFE500]"
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
                        Etiqueta de Categoria
                      </label>
                      <input
                        type="text"
                        value={newCategoryTag}
                        onChange={(e) => setNewCategoryTag(e.target.value)}
                        placeholder="Ex: Celulares & Motos"
                        className="w-full px-3 py-2 bg-black border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-[#FFE500]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Título Open Graph (Aparece no card do Zap) *
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-black border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-[#FFE500]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Descrição Open Graph *
                    </label>
                    <textarea
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-black border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-[#FFE500] resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      URL da Imagem de Capa (Thumbnail OG) *
                    </label>
                    <input
                      type="text"
                      value={newThumbnail}
                      onChange={(e) => setNewThumbnail(e.target.value)}
                      className="w-full px-3 py-2 bg-black border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-[#FFE500] font-mono text-[11px]"
                      required
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[10px] text-slate-400 py-0.5">Presets:</span>
                      {thumbnailPresets.map((p) => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => setNewThumbnail(p.url)}
                          className="px-2 py-0.5 rounded text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 cursor-pointer"
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#FFE500] hover:bg-[#FFE500]/90 text-black font-stencil text-sm uppercase tracking-wider transition-all shadow-lg border-2 border-black flex items-center justify-center gap-2 cursor-pointer mt-3"
                  >
                    <QrCode className="w-4 h-4 stroke-[2.5]" />
                    <span>GERAR LINK & QR CODE</span>
                  </button>
                </form>
              </div>

              {/* WhatsApp Live Simulator Column */}
              <div className={`lg:col-span-5 space-y-4 ${showWhatsAppPreview ? 'block' : 'hidden lg:block'}`}>
                <div className="bg-[#0E121A] border-2 border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-stencil text-xs text-white flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-emerald-400" />
                      SIMULAÇÃO DO CARD NO WHATSAPP
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      LIVE PREVIEW
                    </span>
                  </div>

                  {/* WhatsApp Message Bubble Mockup */}
                  <div className="bg-[#0b141a] p-3 rounded-2xl border border-white/10 shadow-2xl space-y-2">
                    <div className="text-[10px] text-slate-500 text-center font-mono">
                      HOJE 14:32 • MENSAGEM RECEBIDA
                    </div>

                    <div className="bg-[#1F2C34] rounded-xl rounded-tl-sm p-2 text-white shadow-md border border-white/5 space-y-2">
                      <div className="relative rounded-lg overflow-hidden aspect-[16/9] bg-black">
                        <img
                          src={newThumbnail}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-[#FFE500] border border-[#FFE500]/40 backdrop-blur-sm">
                          {newCity} • {newCategoryTag}
                        </div>
                      </div>

                      <div className="p-1 space-y-1">
                        <h5 className="font-bold text-xs leading-snug line-clamp-2 text-slate-100">
                          {newTitle || 'Título da Campanha de Guerrilha'}
                        </h5>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {newDescription || 'Descrição da campanha com moderação e antifraude garantido.'}
                        </p>
                        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>deubrick.com.br</span>
                          <span>14:32 ✓✓</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-[11px] text-slate-400">
                    Ao divulgar o link da campanha no WhatsApp, grupos ou Stories, este card com imagem é gerado automaticamente!
                  </p>
                </div>
              </div>
            </div>

            {/* List of Active Guerrilla Campaigns */}
            <div className="bg-[#0E121A] border-2 border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-stencil text-sm sm:text-base text-white">
                    CAMPANHAS E LINKS ATIVOS ({campaigns.length})
                  </h4>
                  <p className="text-xs text-slate-400">
                    Links para colar em postes, pontos de ônibus, grupos de Facebook e stories.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {campaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="relative h-28 rounded-lg overflow-hidden bg-black">
                        <img
                          src={camp.thumbnailUrl}
                          alt={camp.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-stencil bg-black text-[#FFE500] border border-[#FFE500]/50">
                          {camp.cityName}
                        </span>
                        {/* Mini Vectorized QR Badge */}
                        <div className="absolute bottom-2 right-2 p-1 rounded-md bg-[#FFE500] border-2 border-black shadow-lg">
                          <QRCodeSVG
                            value={`${window.location.origin}/?slug=${camp.slug}`}
                            size={32}
                            bgColor="#FFE500"
                            fgColor="#0B0D11"
                            level="M"
                          />
                        </div>
                      </div>

                      <div className="font-mono text-xs text-[#FFE500] font-bold truncate">
                        /?slug={camp.slug}
                      </div>

                      <h5 className="font-bold text-xs text-white line-clamp-2 leading-snug">
                        {camp.title}
                      </h5>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5 font-mono">
                        <span>Cliques: <strong className="text-white">{camp.clicksCount}</strong></span>
                        <span>Scans: <strong className="text-[#FFE500]">{camp.scansCount}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-white/10">
                      <button
                        onClick={() => handleOpenExistingQr(camp)}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-[#FFE500]/15 hover:bg-[#FFE500]/25 text-[#FFE500] text-xs font-bold flex items-center justify-center gap-1 border border-[#FFE500]/40 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Ver QR</span>
                      </button>

                      <button
                        onClick={() => copyToClipboard(`${window.location.origin}/?slug=${camp.slug}`, camp.id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 cursor-pointer"
                        title="Copiar Link"
                      >
                        {copiedId === camp.id ? (
                          <Check className="w-3.5 h-3.5 text-[#25D366]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteCampaign(camp.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 cursor-pointer"
                        title="Excluir Campanha"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: GESTÃO DE TRÍADE & BANIDOS (FINGERPRINT + NOME + WHATSAPP) */}
        {/* ========================================================= */}
        {activeTab === 'triad' && (
          <div className="space-y-6 max-w-6xl mx-auto animate-slide-up-fade">
            {/* Header Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0E121A] border-2 border-[#FFE500]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-5 h-5 text-[#FFE500]" />
                  <h3 className="font-stencil text-base sm:text-lg text-white">
                    GESTÃO DE TRÍADE DE IDENTIDADE & BANIDOS
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FFE500]/20 text-[#FFE500] font-bold border border-[#FFE500]/40">
                    ANTIFRAUDE V3.0
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
                  Tabela cruzando <strong className="text-white">Device Fingerprint</strong>, <strong className="text-white">Nome Real</strong> e <strong className="text-[#25D366]">WhatsApp</strong> capturados silenciosamente no quiz para controle de fraudes, auditoria e consumo por agentes de IA.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportTriadAudit}
                className="py-2.5 px-4 rounded-xl bg-[#FFE500] hover:bg-[#FFE500]/90 text-black font-stencil text-xs uppercase tracking-wider flex items-center gap-2 border-2 border-black shadow-lg cursor-pointer shrink-0"
                title="Exportar base estruturada para agentes externos de IA"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>EXPORTAR BASE (JSON / IA)</span>
              </button>
            </div>

            {/* Quick KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0E121A] border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Total Cadastrados</span>
                <strong className="text-xl font-stencil text-white block">{triadProfiles.length} Moradores</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0E121A] border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Status Aprovado</span>
                <strong className="text-xl font-stencil text-emerald-400 block">
                  {triadProfiles.filter((p) => p.status === 'aprovado').length} Limpos
                </strong>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0E121A] border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Banidos / Bloqueados</span>
                <strong className="text-xl font-stencil text-red-400 block">
                  {triadProfiles.filter((p) => p.status === 'banido').length} Suspeitos
                </strong>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0E121A] border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Cidades Monitoradas</span>
                <strong className="text-xl font-stencil text-[#FFE500] block">{cities.length} Subgrupos RS</strong>
              </div>
            </div>

            {/* Filters & Search Toolbar */}
            <div className="bg-[#0E121A] border-2 border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={triadSearch}
                  onChange={(e) => setTriadSearch(e.target.value)}
                  placeholder="Buscar por Nome, WhatsApp, Fingerprint Hash ou Item..."
                  className="w-full pl-10 pr-4 py-2.5 bg-black border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FFE500]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={triadCityFilter}
                  onChange={(e) => setTriadCityFilter(e.target.value)}
                  className="px-3 py-2 bg-black border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFE500]"
                >
                  <option value="all">Todas as Cidades</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={triadStatusFilter}
                  onChange={(e) => setTriadStatusFilter(e.target.value as any)}
                  className="px-3 py-2 bg-black border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFE500]"
                >
                  <option value="all">Todos os Status</option>
                  <option value="aprovado">Aprovados</option>
                  <option value="banido">Banidos</option>
                  <option value="sob_analise">Em Análise</option>
                </select>
              </div>
            </div>

            {/* Triad Table / Cards List */}
            <div className="space-y-3">
              {triadProfiles
                .filter((p) => {
                  const query = triadSearch.toLowerCase().trim();
                  const matchesQuery =
                    !query ||
                    p.fullName.toLowerCase().includes(query) ||
                    p.whatsapp.includes(query) ||
                    p.fingerprintHash.toLowerCase().includes(query) ||
                    p.searchedItem.toLowerCase().includes(query);

                  const matchesCity = triadCityFilter === 'all' || p.city === triadCityFilter;
                  const matchesStatus = triadStatusFilter === 'all' || p.status === triadStatusFilter;

                  return matchesQuery && matchesCity && matchesStatus;
                })
                .map((profile) => {
                  const isBanned = profile.status === 'banido';

                  return (
                    <div
                      key={profile.id}
                      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all space-y-3 ${
                        isBanned
                          ? 'bg-red-950/30 border-red-500/50'
                          : 'bg-[#0E121A] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                        {/* Morador & WhatsApp */}
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                              isBanned
                                ? 'bg-red-950 text-red-400 border-red-500'
                                : 'bg-emerald-950 text-emerald-400 border-emerald-500'
                            }`}
                          >
                            {isBanned ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-white text-sm sm:text-base">
                                {profile.fullName}
                              </h4>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                                  isBanned
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                }`}
                              >
                                {isBanned ? 'TERMINAL BANIDO' : 'APROVADO ✓'}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-300 font-mono mt-0.5">
                              <span className="flex items-center gap-1 text-[#25D366] font-bold">
                                <Phone className="w-3.5 h-3.5" />
                                {profile.whatsapp}
                              </span>
                              <span className="text-slate-500">•</span>
                              <span className="text-slate-400 font-sans">{profile.createdAt}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {isBanned ? (
                            <button
                              type="button"
                              onClick={() => handleUnbanTriadProfile(profile)}
                              className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold border border-white/20 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Restaurar Terminal</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleBanTriadProfile(profile)}
                              className="py-1.5 px-3 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 text-xs font-bold border border-red-500/40 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <UserX className="w-3.5 h-3.5 text-red-400" />
                              <span>Banir Terminal & Whats</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Triad Technical Cross-Check Data Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        {/* Fingerprint Hash */}
                        <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 space-y-1 font-mono">
                          <span className="text-[10px] text-slate-400 block uppercase">Device Fingerprint:</span>
                          <span className="text-[#FFE500] font-bold block truncate">{profile.fingerprintHash}</span>
                        </div>

                        {/* City & Category */}
                        <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 space-y-1">
                          <span className="text-[10px] text-slate-400 block font-mono uppercase">Cidade & Foco:</span>
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="font-bold text-white">{profile.city}</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-white/10 text-[#FFE500] uppercase font-bold">
                              {profile.objective}
                            </span>
                          </div>
                        </div>

                        {/* Searched / Advertised Item */}
                        <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 space-y-1 sm:col-span-2">
                          <span className="text-[10px] text-slate-400 block font-mono uppercase">Item do Anúncio:</span>
                          <span className="font-medium text-slate-200 truncate block">
                            {profile.searchedItem || 'Geral'}
                          </span>
                        </div>
                      </div>

                      {/* Device & Network Trace */}
                      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-white/5">
                        <span className="truncate">Trace: {profile.deviceInfo}</span>
                        <span>IP RS: {profile.deviceIp}</span>
                      </div>
                    </div>
                  );
                })}

              {triadProfiles.length === 0 && (
                <div className="p-8 text-center rounded-2xl bg-[#0E121A] border-2 border-white/10 space-y-2">
                  <Fingerprint className="w-10 h-10 text-slate-500 mx-auto" />
                  <h4 className="font-bold text-white text-sm">Nenhum Morador Encontrado</h4>
                  <p className="text-xs text-slate-400">
                    Ajuste os filtros de busca ou aguarde novos cadastros na triagem.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: INTEGRAÇÃO WHATSAPP APIS (BAILEYS / EVOLUTION API) */}
        {/* ========================================================= */}
        {activeTab === 'whatsapp_api' && (
          <WhatsAppApiPanel
            onRefreshParentData={() => {
              setBlacklist(getBlacklist());
              setTriadProfiles(getTriadProfiles());
              setReports(getReports());
            }}
          />
        )}

        {/* ========================================================= */}
        {/* TAB 2: AVISOS FIXADOS PARA O WHATSAPP */}
        {/* ========================================================= */}
        {activeTab === 'pinned_links' && (
          <div className="space-y-6 max-w-5xl mx-auto animate-slide-up-fade">
            <div className="p-4 rounded-xl bg-[#0E121A] border-2 border-[#FFE500]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-stencil text-base sm:text-lg text-white flex items-center gap-2">
                  <Pin className="w-5 h-5 text-[#FFE500]" />
                  AVISOS PRONTOS PARA PINAR NO TOPO DOS GRUPOS
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Textos formatados para copiar com 1 toque e fixar no topo dos grupos de Canoas, Sapucaia, Esteio, POA, Gravataí e São Leopoldo.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Message 1: Denúncias */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0E121A] border-2 border-white/10 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-stencil bg-red-950 text-red-300 border border-red-500/30">
                      PIN DE SEGURANÇA
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">/denunciar</span>
                  </div>
                  <h4 className="font-stencil text-sm text-white">
                    🚨 AVISO DE CENTRAL DE DENÚNCIAS
                  </h4>
                  <div className="p-3 rounded-xl bg-black/80 border border-white/5 text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
{`🚨 *AVISO IMPORTANTE DA MODERAÇÃO • CENTRAL DE DENÚNCIAS*

Tentaram aplicar golpe do Pix agendado? Mandaram anúncio falso ou produto sem procedência?

Envie seu relato anônimo agora mesmo para o nosso QG de segurança. O aparelho do golpista será investigado e banido de todos os grupos do Deu Brick:

👉 Acesse para denunciar:
${window.location.origin}/denunciar

🔒 _Sua identidade é 100% preservada sob sigilo._`}
                  </div>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
`🚨 *AVISO IMPORTANTE DA MODERAÇÃO • CENTRAL DE DENÚNCIAS*

Tentaram aplicar golpe do Pix agendado? Mandaram anúncio falso ou produto sem procedência?

Envie seu relato anônimo agora mesmo para o nosso QG de segurança. O aparelho do golpista será investigado e banido de todos os grupos do Deu Brick:

👉 Acesse para denunciar:
${window.location.origin}/denunciar

🔒 _Sua identidade é 100% preservada sob sigilo._`,
                      'pin-1'
                    )
                  }
                  className="w-full py-3 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-stencil text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  {copiedId === 'pin-1' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>COPIADO COM SUCESSO!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>COPIAR TEXTO PARA PINAR</span>
                    </>
                  )}
                </button>
              </div>

              {/* Message 2: Regras */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0E121A] border-2 border-white/10 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-stencil bg-amber-950 text-amber-300 border border-amber-500/30">
                      PIN DE REGRAS
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">/regras</span>
                  </div>
                  <h4 className="font-stencil text-sm text-white">
                    📜 MANDAMENTOS DA QUEBRADA
                  </h4>
                  <div className="p-3 rounded-xl bg-black/80 border border-white/5 text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
{`📜 *REGRAS DO DEU BRICK • LEIA ANTES DE ANUNCIAR*

Para segurança de todos os moradores:
1️⃣ Encontros SEMPRE em locais públicos (estações Trensurb ou shoppings).
2️⃣ Pix SOMENTE com produto em mãos e verificado no app do banco.
3️⃣ PROIBIDO links soltos, apostas ou spam.
4️⃣ Checagem de IMEI e procedência obrigatória.

👉 Guia completo de sobrevivência e pontos seguros:
${window.location.origin}/regras`}
                  </div>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
`📜 *REGRAS DO DEU BRICK • LEIA ANTES DE ANUNCIAR*

Para segurança de todos os moradores:
1️⃣ Encontros SEMPRE em locais públicos (estações Trensurb ou shoppings).
2️⃣ Pix SOMENTE com produto em mãos e verificado no app do banco.
3️⃣ PROIBIDO links soltos, apostas ou spam.
4️⃣ Checagem de IMEI e procedência obrigatória.

👉 Guia completo de sobrevivência e pontos seguros:
${window.location.origin}/regras`,
                      'pin-2'
                    )
                  }
                  className="w-full py-3 px-3 rounded-xl bg-[#FFE500] hover:bg-[#FFE500]/90 text-black font-stencil text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer border border-black"
                >
                  {copiedId === 'pin-2' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>COPIADO COM SUCESSO!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>COPIAR TEXTO PARA PINAR</span>
                    </>
                  )}
                </button>
              </div>

              {/* Message 3: Convite Seguro */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0E121A] border-2 border-white/10 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-stencil bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      PIN DE CONVITE SEGURO
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">/portal</span>
                  </div>
                  <h4 className="font-stencil text-sm text-white">
                    🔒 CONVITE SEGURO COM TRIAGEM
                  </h4>
                  <div className="p-3 rounded-xl bg-black/80 border border-white/5 text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
{`🔒 *QUER CONVIDAR UM AMIGO OU VIZINHO PARA O GRUPO?*

⚠️ ATENÇÃO: Nunca repasse links soltos de WhatsApp!
Para manter o grupo livre de golpistas e bots, todo novo membro precisa passar pela triagem de segurança oficial:

👉 Envie o link do Portal Oficial:
${window.location.origin}/

🛡️ _Dispositivos na lista negra são bloqueados antes de entrar._`}
                  </div>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
`🔒 *QUER CONVIDAR UM AMIGO OU VIZINHO PARA O GRUPO?*

⚠️ ATENÇÃO: Nunca repasse links soltos de WhatsApp!
Para manter o grupo livre de golpistas e bots, todo novo membro precisa passar pela triagem de segurança oficial:

👉 Envie o link do Portal Oficial:
${window.location.origin}/

🛡️ _Dispositivos na lista negra são bloqueados antes de entrar._`,
                      'pin-3'
                    )
                  }
                  className="w-full py-3 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-stencil text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer border border-black"
                >
                  {copiedId === 'pin-3' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>COPIADO COM SUCESSO!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>COPIAR TEXTO PARA PINAR</span>
                    </>
                  )}
                </button>
              </div>

              {/* Message 4: Alerta Pix */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0E121A] border-2 border-white/10 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-stencil bg-amber-950 text-amber-300 border border-amber-500/30">
                      ALERTA GOLPE DO PIX
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">/denunciar</span>
                  </div>
                  <h4 className="font-stencil text-sm text-white">
                    ⚡ ALERTA DE GOLPE DO PIX AGENDADO
                  </h4>
                  <div className="p-3 rounded-xl bg-black/80 border border-white/5 text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
{`⚡ *ALERTA DA MODERAÇÃO • GOLPE DO PIX AGENDADO*

Malandros estão enviando comprovante falso e mandando motorista de aplicativo buscar o produto.
Lembre-se:
❌ Comprovante de agendamento não é Pix pago!
✅ Abra o app do seu banco e confira o saldo disponível real!

Dúvidas ou denúncias de perfis suspeitos:
👉 ${window.location.origin}/denunciar`}
                  </div>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
`⚡ *ALERTA DA MODERAÇÃO • GOLPE DO PIX AGENDADO*

Malandros estão enviando comprovante falso e mandando motorista de aplicativo buscar o produto.
Lembre-se:
❌ Comprovante de agendamento não é Pix pago!
✅ Abra o app do seu banco e confira o saldo disponível real!

Dúvidas ou denúncias de perfis suspeitos:
👉 ${window.location.origin}/denunciar`,
                      'pin-4'
                    )
                  }
                  className="w-full py-3 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-stencil text-xs flex items-center justify-center gap-2 transition-all border border-white/20 cursor-pointer"
                >
                  {copiedId === 'pin-4' ? (
                    <>
                      <Check className="w-4 h-4 text-[#25D366]" />
                      <span>COPIADO COM SUCESSO!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>COPIAR TEXTO PARA PINAR</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: GERENCIADOR DE LINKS DE WHATSAPP POR CIDADE */}
        {/* ========================================================= */}
        {activeTab === 'cities' && (
          <div className="space-y-5 max-w-5xl mx-auto animate-slide-up-fade">
            <div className="p-4 rounded-xl bg-[#0E121A] border-2 border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-stencil text-base sm:text-lg text-white">
                  CONFIGURAÇÃO DOS GRUPOS OFICIAIS ({cities.length} CIDADES)
                </h3>
                <p className="text-xs text-slate-400">
                  Altere a URL oficial de cada grupo ou ajuste o contador de membros em tempo real.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {cities.map((city) => (
                <div
                  key={city.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#0E121A] border-2 border-white/10 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FFE500]/20 text-[#FFE500] border border-[#FFE500]/40 flex items-center justify-center font-stencil font-bold">
                        {city.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-stencil text-base text-white">
                          {city.name}
                        </h4>
                        <span className="text-xs text-slate-400">
                          {city.tagline}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span className="px-2.5 py-1 rounded-sm bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                        {city.activeMembers} membros
                      </span>
                      <a
                        href={city.whatsAppGroupUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white flex items-center gap-1 font-semibold"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#25D366]" />
                        <span>Testar Link</span>
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-8">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        URL Oficial do Grupo ({city.name})
                      </label>
                      <input
                        type="url"
                        value={city.whatsAppGroupUrl}
                        onChange={(e) => handleUpdateCity(city.id, e.target.value, city.activeMembers)}
                        className="w-full px-3 py-2.5 bg-black border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#FFE500]"
                      />
                    </div>

                    <div className="md:col-span-4 flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Membros Ativos
                        </label>
                        <input
                          type="number"
                          value={city.activeMembers}
                          onChange={(e) => handleUpdateCity(city.id, city.whatsAppGroupUrl, parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2.5 bg-black border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#FFE500]"
                        />
                      </div>
                      {copiedId === `city-${city.id}` && (
                        <span className="px-2.5 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 animate-fade-in shrink-0">
                          Salvo!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: CENTRAL DE DENÚNCIAS ANÔNIMAS */}
        {/* ========================================================= */}
        {activeTab === 'reports' && (
          <div className="space-y-5 max-w-5xl mx-auto animate-slide-up-fade">
            <div className="p-4 rounded-xl bg-red-950/40 border-2 border-red-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-stencil text-base sm:text-lg text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  CENTRAL DE DENÚNCIAS & GOLPES
                </h3>
                <p className="text-xs text-red-200 mt-0.5">
                  Denúncias enviadas por moradores. Banir o infrator bloqueia o aparelho e o número em toda a rede.
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
                <button
                  onClick={() => setReportFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    reportFilter === 'all' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todas ({reports.length})
                </button>
                <button
                  onClick={() => setReportFilter('pendente')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    reportFilter === 'pendente' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pendentes ({reports.filter((r) => r.status === 'pendente').length})
                </button>
                <button
                  onClick={() => setReportFilter('banido')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    reportFilter === 'banido' ? 'bg-red-950 text-red-300 border border-red-500/50' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Banidos
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredReports.length === 0 ? (
                <div className="p-8 text-center bg-[#0E121A] rounded-2xl border border-white/10 text-slate-400 text-sm">
                  Nenhuma denúncia encontrada nesta categoria.
                </div>
              ) : (
                filteredReports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#0E121A] border-2 border-white/10 space-y-3.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-sm text-[10px] font-stencil uppercase tracking-wider ${
                          rep.status === 'banido'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : rep.status === 'em_analise'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-red-600 text-white'
                        }`}>
                          {rep.status === 'banido' ? '⛔ INFRATOR BANIDO' : rep.status.toUpperCase()}
                        </span>
                        <span className="text-sm font-bold text-white font-mono">
                          {rep.targetPhone}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          • {rep.city}
                        </span>
                      </div>

                      <span className="text-xs text-slate-400 font-mono">
                        {rep.createdAt}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-1.5 text-xs">
                      <div className="text-[#FFE500] font-stencil text-xs">
                        TIPO: {rep.scamType}
                      </div>
                      <p className="text-slate-200 leading-relaxed font-sans text-sm">
                        "{rep.description}"
                      </p>
                    </div>

                    {rep.proofImageUrl && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPreviewImage(rep.proofImageUrl || null)}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-slate-200 flex items-center gap-1.5 font-semibold cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#25D366]" />
                          <span>Ver Imagem de Prova</span>
                        </button>
                      </div>
                    )}

                    <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-400 font-mono">
                        Fingerprint denunciante: {rep.reporterFingerprint}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {rep.status !== 'banido' && (
                          <button
                            onClick={() => handleBanFromReport(rep)}
                            className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-stencil flex items-center gap-1.5 shadow-md cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>CONFIRMAR E BANIR AGORA</span>
                          </button>
                        )}
                        {rep.status === 'pendente' && (
                          <button
                            onClick={() => handleUpdateReportStatus(rep.id, 'em_analise')}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 cursor-pointer"
                          >
                            Em Análise
                          </button>
                        )}
                        <button
                          onClick={() => handleUpdateReportStatus(rep.id, 'descartado')}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-semibold cursor-pointer"
                        >
                          Descartar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: BLACKLIST E GESTÃO DE BANIMENTOS */}
        {/* ========================================================= */}
        {activeTab === 'blacklist' && (
          <div className="space-y-6 max-w-5xl mx-auto animate-slide-up-fade">
            <div className="p-4 rounded-xl bg-[#0E121A] border-2 border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-stencil text-base sm:text-lg text-white">
                  LISTA NEGRA & TERMINAIS BLOQUEADOS ({blacklist.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Dispositivos cadastrados têm o acesso bloqueado na hora ao tentar entrar no app.
                </p>
              </div>

              {currentFingerprint && (
                <div className="text-right text-xs font-mono bg-black/60 p-2 rounded-lg border border-white/10">
                  <span className="text-slate-400 block text-[10px]">Seu Fingerprint Atual:</span>
                  <span className="text-[#25D366] font-bold">{currentFingerprint.hash}</span>
                </div>
              )}
            </div>

            {/* Real-time Threat Dashboard with Recharts visualization */}
            <RealTimeThreatDashboard blacklist={blacklist} visitorLogs={visitorLogs} />

            {/* Manual Ban Adder Form */}
            <form onSubmit={handleAddManualBan} className="p-4 sm:p-5 rounded-2xl bg-[#0E121A] border-2 border-white/10 space-y-3">
              <h4 className="font-stencil text-xs text-white uppercase tracking-wider">
                ADICIONAR BLOQUEIO MANUAL
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Telefone / Identificador</label>
                  <input
                    type="text"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="(51) 9XXXX-XXXX"
                    className="w-full px-3 py-2 bg-black border border-white/15 rounded-xl text-white text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Cidade da Ocorrência</label>
                  <select
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value as CityName)}
                    className="w-full px-3 py-2 bg-black border border-white/15 rounded-xl text-white text-xs"
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
                  <label className="block text-[11px] text-slate-400 mb-1">Motivo do Bloqueio</label>
                  <input
                    type="text"
                    value={manualReason}
                    onChange={(e) => setManualReason(e.target.value)}
                    placeholder="Ex: Tentativa de golpe do Pix agendado"
                    className="w-full px-3 py-2 bg-black border border-white/15 rounded-xl text-white text-xs"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-stencil text-xs cursor-pointer shadow-md"
              >
                BLOQUEAR IMEDIATAMENTE
              </button>
            </form>

            {/* Blacklist Table & Search Bar */}
            <div className="bg-[#0E121A] border-2 border-white/10 rounded-2xl overflow-hidden space-y-3 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <span className="font-stencil text-xs text-white uppercase tracking-wider">
                  INFRATORES BLOQUEADOS ({filteredBlacklist.length})
                </span>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={blacklistSearch}
                    onChange={(e) => setBlacklistSearch(e.target.value)}
                    placeholder="Buscar por telefone, hash ou cidade..."
                    className="w-full pl-8 pr-3 py-1.5 bg-black border border-white/15 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FFE500]"
                  />
                </div>
              </div>

              <div className="divide-y divide-white/5">
                {filteredBlacklist.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    Nenhum infrator encontrado com esse filtro.
                  </div>
                ) : (
                  filteredBlacklist.map((entry) => (
                    <div key={entry.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-red-400">
                            {entry.phoneOrIdentifier}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-black text-[10px] text-slate-400 font-mono border border-white/5">
                            {entry.fingerprintHash}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30 text-[10px] font-bold">
                            {entry.city}
                          </span>
                        </div>
                        <p className="text-slate-300">
                          {entry.reason}
                        </p>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          Bloqueado em {entry.bannedAt} por {entry.bannedBy}
                        </span>
                      </div>

                      <button
                        onClick={() => handleRemoveBan(entry.id)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-semibold self-start sm:self-center cursor-pointer text-xs"
                      >
                        Remover Ban
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: SCANNER DE FINGERPRINTS */}
        {/* ========================================================= */}
        {activeTab === 'scanner' && (
          <div className="space-y-5 max-w-5xl mx-auto animate-slide-up-fade">
            <div className="p-4 rounded-xl bg-[#0E121A] border-2 border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-stencil text-base sm:text-lg text-white">
                  SCANNER DE DISPOSITIVOS E FINGERPRINTS EM TEMPO REAL
                </h3>
                <p className="text-xs text-slate-400">
                  Metadados técnicos dos visitantes para cruzamento e integridade antifraude.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={scannerSearch}
                  onChange={(e) => setScannerSearch(e.target.value)}
                  placeholder="Filtrar por hash ou IP..."
                  className="w-full pl-8 pr-3 py-1.5 bg-black border border-white/15 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FFE500]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {filteredVisitorLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-[#0E121A] border border-white/10 space-y-2 font-mono text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[#FFE500] font-bold">{log.hash}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.isBanned ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {log.isBanned ? 'BANIDO' : 'INTEGRIDADE OK (RISCO: ' + log.riskScore + '%)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400 pt-1 border-t border-white/5">
                    <div>Tela: <span className="text-white">{log.screenResolution}</span></div>
                    <div>Cores/Mem: <span className="text-white">{log.hardwareConcurrency}c / {log.deviceMemory}GB</span></div>
                    <div>Fuso: <span className="text-white">{log.timezone}</span></div>
                    <div>IP RS: <span className="text-white">{log.ipSimulated}</span></div>
                  </div>

                  <div className="text-[10px] text-slate-500 truncate">
                    UA: {log.userAgent}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* QR Code Vectorized Modal with High-Res Download (powered by qrcode.react) */}
      {activeQrModal && (() => {
        const currentTheme = STENCIL_QR_THEMES[qrColorTheme] || STENCIL_QR_THEMES.yellow;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto">
            <div className="relative bracket-box bg-[#0E121A] border-3 border-[#FFE500] rounded-2xl p-5 sm:p-6 max-w-md w-full text-center space-y-4 shadow-2xl my-auto">
              {/* Negative Margin Stencil Floating Badge */}
              <div className="absolute -top-3.5 left-4 z-10 flex items-center gap-1.5">
                <span className="font-stencil text-[10px] bg-[#FFE500] text-black px-2.5 py-0.5 rounded-sm border-2 border-black font-black uppercase tracking-wider shadow-[2px_2px_0_#000]">
                  ⚡ CANVAS VETORIZADO • QRCODE.REACT
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="text-left">
                  <h3 className="font-stencil text-lg text-white">
                    GERADOR DE QR CODE GUERRILHA
                  </h3>
                  <p className="text-xs text-slate-300">
                    {activeQrModal.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveQrModal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mode Switcher: Canvas vs SVG */}
              <div className="flex rounded-xl bg-black p-1 border border-white/15 gap-1">
                <button
                  type="button"
                  onClick={() => setQrRenderMode('canvas')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-stencil transition-all ${
                    qrRenderMode === 'canvas'
                      ? 'bg-[#FFE500] text-black font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  CANVAS HD (PIXEL-PERFECT)
                </button>
                <button
                  type="button"
                  onClick={() => setQrRenderMode('svg')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-stencil transition-all ${
                    qrRenderMode === 'svg'
                      ? 'bg-[#FFE500] text-black font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  VETOR SVG (ESCALA INFINITA)
                </button>
              </div>

              {/* Stencil Custom Color Palettes */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between text-[11px] font-stencil text-slate-300">
                  <span>CORES CUSTOMIZADAS STENCIL:</span>
                  <span className="text-[#FFE500] font-mono">{currentTheme.name}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {(Object.keys(STENCIL_QR_THEMES) as Array<keyof typeof STENCIL_QR_THEMES>).map((key) => {
                    const theme = STENCIL_QR_THEMES[key];
                    const isSelected = qrColorTheme === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setQrColorTheme(key)}
                        className={`p-1.5 rounded-lg border-2 text-[10px] font-stencil transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'border-[#FFE500] bg-white/10 text-white scale-[1.02] shadow-md'
                            : 'border-white/10 bg-black/60 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <div
                          className="w-5 h-5 rounded-full border border-black/40 shadow-sm"
                          style={{ backgroundColor: theme.bg }}
                        />
                        <span className="truncate max-w-full">{theme.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* QR Code Container with High-Performance qrcode.react */}
              <div
                className="p-4 rounded-2xl inline-block shadow-2xl border-4 border-black transition-all"
                style={{ backgroundColor: currentTheme.bg }}
              >
                {qrRenderMode === 'canvas' ? (
                  <QRCodeCanvas
                    ref={qrCanvasRef}
                    value={activeQrModal.url}
                    size={220}
                    bgColor={currentTheme.bg}
                    fgColor={currentTheme.fg}
                    level="H"
                    marginSize={1}
                    imageSettings={
                      includeCenterLogo
                        ? {
                            src: '/pwa-192x192.png',
                            height: 38,
                            width: 38,
                            excavate: true,
                          }
                        : undefined
                    }
                    className="mx-auto block"
                  />
                ) : (
                  <div ref={qrSvgRef} className="inline-block">
                    <QRCodeSVG
                      value={activeQrModal.url}
                      size={220}
                      bgColor={currentTheme.bg}
                      fgColor={currentTheme.fg}
                      level="H"
                      marginSize={1}
                      imageSettings={
                        includeCenterLogo
                          ? {
                              src: '/pwa-192x192.png',
                              height: 38,
                              width: 38,
                              excavate: true,
                            }
                          : undefined
                      }
                      className="mx-auto block"
                    />
                  </div>
                )}
              </div>

              {/* Logo Inclusion Toggle */}
              <div className="flex items-center justify-between text-xs px-2 py-1.5 bg-black/50 rounded-xl border border-white/10">
                <span className="text-slate-300 font-stencil text-[11px]">
                  SELO CENTRAL 'DEU BRICK':
                </span>
                <button
                  type="button"
                  onClick={() => setIncludeCenterLogo(!includeCenterLogo)}
                  className={`px-2.5 py-1 rounded text-[10px] font-stencil transition-colors ${
                    includeCenterLogo
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {includeCenterLogo ? '✓ ATIVO' : 'DESATIVADO'}
                </button>
              </div>

              {/* Target URL Display */}
              <div className="text-[11px] font-mono text-[#FFE500] truncate bg-black p-2 rounded-lg border border-white/15">
                {activeQrModal.url}
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadQrPng}
                  className="py-3 px-3 rounded-xl bg-[#FFE500] hover:bg-[#FFE500]/90 text-black font-stencil text-xs flex items-center justify-center gap-1.5 shadow-lg border-2 border-black cursor-pointer uppercase"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>PNG 1024px ALTA RES</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadQrSvg}
                  className="py-3 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-stencil text-xs flex items-center justify-center gap-1.5 border border-white/20 cursor-pointer uppercase"
                >
                  <Download className="w-4 h-4 text-[#25D366]" />
                  <span>VETOR SVG PURO</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(activeQrModal.url);
                    setCopiedId('modal-url');
                    setTimeout(() => setCopiedId(null), 1800);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-black border border-white/15 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedId === 'modal-url' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Link Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Link da URL</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveQrModal(null)}
                  className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Fechar Janela
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Proof Image Fullscreen Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-2xl w-full bg-[#0E121A] rounded-2xl overflow-hidden border-2 border-white/20 p-3">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/80 text-white z-10 hover:bg-black cursor-pointer border border-white/20"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={previewImage}
              alt="Evidência"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ETAPA 1A — MODAL DE BACKUP GERAL & CONFERÊNCIA DE DADOS */}
      {/* ========================================================================= */}
      {isBackupModalOpen && backupPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative max-w-4xl w-full bg-[#0B0D11] rounded-2xl border-2 border-[#FFE500]/60 p-4 sm:p-6 space-y-5 my-8 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="w-8 h-8 rounded-lg bg-[#FFE500] text-black font-stencil flex items-center justify-center text-sm font-bold border border-black shadow">
                    <HardDrive className="w-4 h-4 text-black" />
                  </div>
                  <h3 className="font-stencil text-lg sm:text-xl text-white tracking-wide">
                    CENTRAL DE BACKUP GERAL DO SISTEMA
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FFE500]/20 text-[#FFE500] font-bold border border-[#FFE500]/40">
                    SCHEMA V1.0 • SOMENTE LEITURA
                  </span>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Exportação integral e segura dos dados locais gravados no navegador. Preserva 100% dos dados originais sem alterar, migrar ou apagar registros existentes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsBackupModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer border border-white/10 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Aviso de Privacidade e Segurança (LGPD / Dados Pessoais) */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-amber-950/40 border-2 border-amber-500/50 space-y-1.5 text-xs text-amber-200">
              <div className="flex items-center gap-2 font-stencil text-amber-300 text-xs sm:text-sm uppercase tracking-wide">
                <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Aviso de Privacidade e Segurança (LGPD / Dados Confidenciais)</span>
              </div>
              <p className="text-[11px] sm:text-xs leading-relaxed text-amber-200/90 font-sans">
                Este arquivo de backup contém registros reais com dados pessoais cadastrados na <strong>Tríade de Identidade</strong> (Nomes Reais e Telefones com WhatsApp), evidências de denúncias e identificadores de dispositivos. Guarde este arquivo em local seguro (mídia protegida ou pasta criptografada) e <strong>nunca o compartilhe publicamente</strong>. Nenhuma senha, token ou credencial administrativa é inserida no arquivo.
              </p>
            </div>

            {/* Resumo da Leitura */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Total de Categorias</span>
                <strong className="text-lg font-stencil text-white block">
                  {backupPackage.summary.totalCategoriesChecked} de 8
                </strong>
                <span className="text-[9px] text-emerald-400 font-mono">100% Mapeadas</span>
              </div>
              <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Com Registros Ativos</span>
                <strong className="text-lg font-stencil text-emerald-400 block">
                  {backupPackage.summary.categoriesWithData} Categorias
                </strong>
                <span className="text-[9px] text-slate-400 font-mono">Prontas p/ Exportar</span>
              </div>
              <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Vazias / Não Criadas</span>
                <strong className="text-lg font-stencil text-amber-400 block">
                  {backupPackage.summary.emptyOrMissingCategories} Categorias
                </strong>
                <span className="text-[9px] text-slate-400 font-mono">Informadas no JSON</span>
              </div>
              <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Total de Registros</span>
                <strong className="text-lg font-stencil text-[#FFE500] block">
                  {backupPackage.summary.totalRecords} Itens
                </strong>
                <span className="text-[9px] text-slate-400 font-mono">{backupPackage.exportedAtFormatted}</span>
              </div>
            </div>

            {/* Quadro de Conferência Pré-Exportação (Checklist de todas as 8 chaves reais) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-stencil text-xs sm:text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Conferência das 8 Chaves Reais de Armazenamento</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-400">
                  Leitura Direta do Código
                </span>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/50 divide-y divide-white/5 overflow-hidden text-xs max-h-56 overflow-y-auto">
                {Object.entries(backupPackage.categoriesStatus).map(([catKey, cat]) => {
                  const isPresent = cat.status === 'present';
                  const isEmpty = cat.status === 'empty';
                  return (
                    <div
                      key={catKey}
                      className="p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/[0.02]"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-white font-medium">{cat.label}</strong>
                          <code className="text-[10px] font-mono text-[#FFE500] bg-black/70 px-1.5 py-0.5 rounded border border-white/10">
                            {cat.key}
                          </code>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate sm:whitespace-normal">
                          {cat.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                        {isPresent ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Presente ({cat.count} {cat.count === 1 ? 'registro' : 'registros'})</span>
                          </span>
                        ) : isEmpty ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/60 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-amber-400" />
                            <span>Vazio (0 registros)</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-white/10 flex items-center gap-1">
                            <span>Não inicializado</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Feedback de Download */}
            {backupDownloadNotice && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{backupDownloadNotice}</span>
              </div>
            )}

            {/* Botão Principal de Download */}
            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-white/10">
              <div className="text-[11px] text-slate-400 font-mono">
                Arquivo gerado com Schema 1.0 e timestamp ISO em UTC e pt-BR.
              </div>

              <button
                type="button"
                onClick={handleDownloadBackup}
                className="py-3 px-5 rounded-xl bg-[#FFE500] hover:bg-[#FFE500]/90 text-black font-stencil text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-black shadow-xl cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>BAIXAR BACKUP GERAL (.JSON)</span>
              </button>
            </div>

            {/* ========================================================================= */}
            {/* SEÇÃO DE CONFERÊNCIA PÓS-EXPORTAÇÃO DO ARQUIVO (REQUISITO 8) */}
            {/* ========================================================================= */}
            <div className="p-4 rounded-xl bg-black/60 border-2 border-white/15 space-y-3 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <h4 className="font-stencil text-xs sm:text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-[#FFE500]" />
                    <span>Conferir Integridade de Arquivo Exportado</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Selecione o arquivo .json baixado para auditar se todas as categorias foram preservadas. A conferência roda estritamente em memória e <strong>não restaura nem altera nenhum dado</strong>.
                  </p>
                </div>

                <div className="shrink-0">
                  <input
                    type="file"
                    accept=".json,application/json"
                    ref={backupFileInputRef}
                    onChange={handleFileVerificationChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => backupFileInputRef.current?.click()}
                    className="py-2 px-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-stencil text-xs flex items-center gap-1.5 border border-white/20 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#FFE500]" />
                    <span>Selecionar Arquivo .JSON</span>
                  </button>
                </div>
              </div>

              {/* Erro de leitura de arquivo */}
              {validationFileError && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{validationFileError}</span>
                </div>
              )}

              {/* Relatório de Validação do Arquivo Selecionado */}
              {validationResult && (
                <div className="p-3.5 rounded-xl bg-[#0E121A] border-2 border-emerald-500/40 space-y-3 text-xs animate-slide-up-fade">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-stencil text-white text-xs sm:text-sm">
                        ARQUIVO AUDITADO COM SUCESSO: {validatedFileName}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                      SCHEMA {validationResult.schemaVersion || '1.0'}
                    </span>
                  </div>

                  {/* Informações auditadas */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                    <div className="p-2 rounded bg-black/60 border border-white/5">
                      <span className="text-slate-400 block text-[9px]">Data da Exportação:</span>
                      <span className="text-white font-bold">{validationResult.exportedAt || 'Detectada'}</span>
                    </div>
                    <div className="p-2 rounded bg-black/60 border border-white/5">
                      <span className="text-slate-400 block text-[9px]">Aviso LGPD Presente:</span>
                      <span className={validationResult.securityNoticeFound ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                        {validationResult.securityNoticeFound ? '✓ Sim (Auditado)' : '○ Não'}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-black/60 border border-white/5">
                      <span className="text-slate-400 block text-[9px]">Status de Integridade:</span>
                      <span className="text-emerald-400 font-bold">100% Válido</span>
                    </div>
                  </div>

                  {/* Lista de Categorias Auditadas */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      Categorias Reconhecidas no Arquivo:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                      {validationResult.categoriesChecked.map((cat) => (
                        <div
                          key={cat.key}
                          className="p-2 rounded-lg bg-black/60 border border-white/5 flex items-center justify-between gap-2"
                        >
                          <span className="text-slate-200 truncate">{cat.label}</span>
                          <span
                            className={`font-mono text-[10px] px-1.5 py-0.2 rounded font-bold ${
                              cat.status === 'present'
                                ? 'bg-emerald-950 text-emerald-400'
                                : 'bg-amber-950 text-amber-300'
                            }`}
                          >
                            {cat.status === 'present' ? `${cat.count} itens` : '0 itens (vazio)'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 border-t border-white/5 pt-2 flex items-center justify-between">
                    <span>✓ Auditoria concluída em memória.</span>
                    <span className="text-emerald-400 font-mono">Nenhum dado foi alterado na aplicação</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
