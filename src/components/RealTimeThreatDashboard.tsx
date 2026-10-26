import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import {
  ShieldAlert,
  Radio,
  Fingerprint,
  AlertTriangle,
  RefreshCw,
  Lock,
  Activity,
  Zap,
} from 'lucide-react';
import { BlacklistEntry, DeviceFingerprint } from '../types';

interface RealTimeThreatDashboardProps {
  blacklist: BlacklistEntry[];
  visitorLogs: DeviceFingerprint[];
  className?: string;
}

interface ThreatIncident {
  id: string;
  hash: string;
  phone: string;
  city: string;
  threatType: string;
  ip: string;
  riskScore: number;
  timeAgo: string;
  timestamp: number;
}

export const RealTimeThreatDashboard: React.FC<RealTimeThreatDashboardProps> = ({
  blacklist,
  visitorLogs,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'city' | 'type'>('city');
  const [livePulseCount, setLivePulseCount] = useState<number>(0);

  // Simulated live incoming threat feed based on actual blacklist and RS metro stats
  const [threatEvents, setThreatEvents] = useState<ThreatIncident[]>(() => [
    {
      id: 'th-1',
      hash: 'DB-FP-GOLP-9921A',
      phone: '(51) 98934-1182',
      city: 'Canoas',
      threatType: 'Pix Falso Agendado',
      ip: '177.101.44.12',
      riskScore: 98,
      timeAgo: 'há 12s',
      timestamp: Date.now() - 12000,
    },
    {
      id: 'th-2',
      hash: 'DB-FP-CLON-5582B',
      phone: '(51) 98112-9043',
      city: 'Sapucaia do Sul',
      threatType: 'Clonagem de Moto CG',
      ip: '177.101.90.34',
      riskScore: 95,
      timeAgo: 'há 45s',
      timestamp: Date.now() - 45000,
    },
    {
      id: 'th-3',
      hash: 'DB-FP-RECEPT-1144C',
      phone: '(51) 99422-7719',
      city: 'Porto Alegre',
      threatType: 'Receptação de iPhone',
      ip: '177.101.12.80',
      riskScore: 99,
      timeAgo: 'há 2m',
      timestamp: Date.now() - 120000,
    },
    {
      id: 'th-4',
      hash: 'DB-FP-BOT-3321D',
      phone: '(51) 99233-8871',
      city: 'Gravataí',
      threatType: 'Golpe do Sinal Pix',
      ip: '177.101.88.204',
      riskScore: 94,
      timeAgo: 'há 4m',
      timestamp: Date.now() - 240000,
    },
    {
      id: 'th-5',
      hash: 'DB-FP-SCRAP-7740E',
      phone: '(51) 98341-2290',
      city: 'São Leopoldo',
      threatType: 'Bot Scraper de Grupo',
      ip: '177.101.33.15',
      riskScore: 92,
      timeAgo: 'há 7m',
      timestamp: Date.now() - 420000,
    },
    {
      id: 'th-6',
      hash: 'DB-FP-ESTE-6612F',
      phone: '(51) 98845-3310',
      city: 'Esteio',
      threatType: 'Comprovante Clonado',
      ip: '177.101.55.91',
      riskScore: 96,
      timeAgo: 'há 11m',
      timestamp: Date.now() - 660000,
    },
  ]);

  // Periodic heartbeat adding or updating live blocked attempts
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePulseCount((c) => c + 1);

      // Randomly simulate an incoming blocked threat attempt every 15-25 seconds
      if (Math.random() > 0.45) {
        const metroCities = [
          'Canoas',
          'Porto Alegre',
          'Esteio',
          'Sapucaia do Sul',
          'Gravataí',
          'São Leopoldo',
        ];
        const threatTypes = [
          'Pix Falso Agendado',
          'Golpe do Sinal Pix',
          'Clonagem de Anúncio',
          'Receptação sem Procedência',
          'Bot Scraper de Terminal',
        ];

        const randomCity = metroCities[Math.floor(Math.random() * metroCities.length)];
        const randomType = threatTypes[Math.floor(Math.random() * threatTypes.length)];
        const hex = Math.floor(Math.random() * 0xffff)
          .toString(16)
          .toUpperCase()
          .padStart(4, '0');

        const newThreat: ThreatIncident = {
          id: 'th-' + Date.now(),
          hash: `DB-FP-GOLP-${hex}`,
          phone: `(51) 9${Math.floor(Math.random() * 8999 + 1000)}-${Math.floor(Math.random() * 8999 + 1000)}`,
          city: randomCity,
          threatType: randomType,
          ip: `177.101.${Math.floor(Math.random() * 80) + 10}.${Math.floor(Math.random() * 240) + 10}`,
          riskScore: Math.floor(Math.random() * 9) + 91,
          timeAgo: 'agora',
          timestamp: Date.now(),
        };

        setThreatEvents((prev) => [newThreat, ...prev.slice(0, 7)]);
      }
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // Aggregated data by metropolitan city
  const cityData = useMemo(() => {
    const baseCounts: Record<string, number> = {
      Canoas: 52,
      'Porto Alegre': 78,
      Esteio: 24,
      'Sapucaia do Sul': 36,
      Gravataí: 31,
      'São Leopoldo': 42,
    };

    // Add extra counts from active blacklist and live threat events
    blacklist.forEach((b) => {
      if (baseCounts[b.city]) {
        baseCounts[b.city] += 1;
      }
    });

    threatEvents.forEach((t) => {
      if (baseCounts[t.city]) {
        baseCounts[t.city] += 1;
      }
    });

    return Object.keys(baseCounts).map((cityName) => ({
      name: cityName,
      bloqueios: baseCounts[cityName],
      color:
        cityName === 'Canoas'
          ? '#FFE500'
          : cityName === 'Porto Alegre'
          ? '#EF4444'
          : cityName === 'Esteio'
          ? '#10B981'
          : cityName === 'Sapucaia do Sul'
          ? '#F72585'
          : cityName === 'Gravataí'
          ? '#00B4D8'
          : '#8338EC',
    }));
  }, [blacklist, threatEvents]);

  // Aggregated data by Threat Type
  const threatTypeData = useMemo(() => {
    return [
      { name: 'Pix Falso Agendado', bloqueios: 68, color: '#EF4444' },
      { name: 'Golpe do Sinal', bloqueios: 54, color: '#F59E0B' },
      { name: 'Clonagem de Perfil', bloqueios: 42, color: '#FFE500' },
      { name: 'Receptação / Furto', bloqueios: 38, color: '#EC4899' },
      { name: 'Bot Scraper de Link', bloqueios: 27, color: '#3B82F6' },
    ];
  }, []);

  const chartData = viewMode === 'city' ? cityData : threatTypeData;
  const totalBlockedAttempts = useMemo(() => {
    return cityData.reduce((acc, curr) => acc + curr.bloqueios, 0);
  }, [cityData]);

  // Custom Stencil Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/95 border-2 border-[#FFE500] p-3 rounded-xl shadow-2xl font-mono text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-white font-bold font-stencil uppercase tracking-wide">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span>{label}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-300">
            <span>Tentativas Bloqueadas:</span>
            <strong className="text-[#FFE500] font-black text-sm">
              {payload[0].value}
            </strong>
          </div>
          <div className="text-[10px] text-emerald-400 font-sans">
            ✓ Barreira de Fingerprint 100% Eficaz
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Threat Radar Bar */}
      <div className="relative bracket-box p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/60 via-[#0E121A] to-black border-2 border-red-500/50 shadow-2xl space-y-4">
        {/* Negative Margin Stencil Floating Badge */}
        <div className="absolute -top-3.5 left-4 z-10 flex items-center gap-1.5">
          <span className="font-stencil text-[10px] bg-red-600 text-white px-2.5 py-0.5 rounded-sm border-2 border-black font-black uppercase tracking-wider shadow-[2px_2px_0_#000] flex items-center gap-1">
            <Radio className="w-3 h-3 animate-spin text-white" />
            RADAR DE AMEAÇAS EM TEMPO REAL • RECHARTS
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
              <h3 className="font-stencil text-base sm:text-lg text-white">
                TENTATIVAS DE ACESSO BLOQUEADAS PELO FINGERPRINT
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Dispositivos com assinatura em quarentena ou presentes na Blacklist metropolitana barrados automaticamente antes de chegarem ao WhatsApp.
            </p>
          </div>

          {/* Quick Realtime KPIs */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-center font-mono">
              <span className="text-[9px] text-slate-400 uppercase block">Total Bloqueios</span>
              <strong className="text-base sm:text-lg text-red-400 font-stencil font-black">
                {totalBlockedAttempts}
              </strong>
            </div>

            <div className="px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-center font-mono">
              <span className="text-[9px] text-slate-400 uppercase block">Interceptação</span>
              <strong className="text-base sm:text-lg text-[#25D366] font-stencil font-black">
                99.8%
              </strong>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-stencil text-slate-400 uppercase tracking-wide">
              Agrupamento:
            </span>
            <div className="inline-flex rounded-xl bg-black p-1 border border-white/15 gap-1">
              <button
                type="button"
                onClick={() => setViewMode('city')}
                className={`py-1 px-3 rounded-lg text-xs font-stencil transition-all cursor-pointer ${
                  viewMode === 'city'
                    ? 'bg-[#FFE500] text-black font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Por Cidade RS ({cityData.length})
              </button>

              <button
                type="button"
                onClick={() => setViewMode('type')}
                className={`py-1 px-3 rounded-lg text-xs font-stencil transition-all cursor-pointer ${
                  viewMode === 'type'
                    ? 'bg-[#FFE500] text-black font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Por Categoria de Golpe ({threatTypeData.length})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
            <span>Escaneando terminais metropolitanos ao vivo</span>
          </div>
        </div>

        {/* RECHARTS BAR CHART CONTAINER */}
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#ffffff"
                opacity={0.07}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#ffffff', opacity: 0.15 }}
                angle={-15}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#ffffff', opacity: 0.15 }}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
              />
              <Bar
                dataKey="bloqueios"
                radius={[6, 6, 0, 0]}
                animationDuration={900}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || '#FFE500'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Intercepted Feed Strip */}
      <div className="bg-[#0E121A] border-2 border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#FFE500]" />
            <h4 className="font-stencil text-xs sm:text-sm text-white">
              ÚLTIMOS APARELHOS INTERCEPTADOS NA PORTA DO QUIZ
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Atualizado automaticamente
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {threatEvents.slice(0, 4).map((threat) => (
            <div
              key={threat.id}
              className="p-3 rounded-xl bg-black/70 border border-white/10 flex items-center justify-between gap-3 text-xs font-mono animate-fade-in"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-400 truncate">
                    {threat.hash}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-950 text-red-300 border border-red-500/30 shrink-0">
                    {threat.city}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans truncate">
                  {threat.threatType}
                </p>
                <div className="text-[10px] text-slate-500">
                  IP: {threat.ip} • Risco: {threat.riskScore}% • {threat.timeAgo}
                </div>
              </div>

              <span className="px-2 py-1 rounded bg-red-600/20 text-red-400 border border-red-600/40 font-stencil text-[10px] shrink-0 font-bold uppercase">
                BARRADO 🛡️
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
