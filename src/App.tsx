import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { SecurityTransitionScreen } from './components/SecurityTransitionScreen';
import { AccessScreen } from './components/AccessScreen';
import { BannedScreen } from './components/BannedScreen';
import { RulesScreen } from './components/RulesScreen';
import { ReportScreen } from './components/ReportScreen';
import { AdminPanel } from './components/AdminPanel';
import {
  BlacklistEntry,
  CityData,
  DeviceFingerprint,
  GuerrillaCampaign,
  QuizState,
} from './types';
import {
  generateDeviceFingerprint,
  getCurrentFingerprint,
  getCities,
  getBlacklist,
  getCampaigns,
  STORAGE_KEYS,
} from './services/storage';
import { Shield, Sparkles, MapPin, AlertTriangle, BookOpen } from 'lucide-react';
import { OfflineIndicator } from './components/OfflineIndicator';
import { MobileBottomNav } from './components/MobileBottomNav';

type AppScreen = 'welcome' | 'quiz' | 'security_check' | 'access' | 'banned' | 'denunciar' | 'regras';

const SAVED_CITY_KEY = STORAGE_KEYS.USER_SELECTED_CITY;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Data
  const [cities, setCities] = useState<CityData[]>([]);
  const [campaigns, setCampaigns] = useState<GuerrillaCampaign[]>([]);
  const [deviceFingerprint, setDeviceFingerprint] = useState<DeviceFingerprint | null>(null);
  const [banEntry, setBanEntry] = useState<BlacklistEntry | undefined>(undefined);
  const [activeCampaign, setActiveCampaign] = useState<GuerrillaCampaign | null>(null);

  // Quiz state
  const [quizState, setQuizState] = useState<QuizState>(() => {
    const savedCity = typeof localStorage !== 'undefined' ? localStorage.getItem(SAVED_CITY_KEY) : null;
    return {
      city: (savedCity as any) || null,
      objective: null,
      searchedItem: '',
    };
  });

  // Self simulated ban state for easy admin testing
  const [isSelfBanned, setIsSelfBanned] = useState(false);

  // Check URL routes helper
  const syncRouteFromUrl = (loadedCampaigns: GuerrillaCampaign[]) => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const urlParams = new URLSearchParams(window.location.search);

    // Slug campaign check
    const slugParam = urlParams.get('slug');
    if (slugParam) {
      const foundCamp = loadedCampaigns.find((c) => c.slug.toLowerCase() === slugParam.toLowerCase());
      if (foundCamp) {
        setActiveCampaign(foundCamp);
        setQuizState((prev) => ({ ...prev, city: foundCamp.cityName }));
      }
    }

    if (path.includes('/admin') || hash === '#admin') {
      setIsAdminOpen(true);
    } else if (path.includes('/denunciar') || hash === '#denunciar') {
      setCurrentScreen('denunciar');
    } else if (path.includes('/regras') || hash === '#regras') {
      setCurrentScreen('regras');
    }
  };

  // Initialize and run silent antifraud fingerprinting on mount
  useEffect(() => {
    const loadedCities = getCities();
    const loadedCampaigns = getCampaigns();
    const loadedBlacklist = getBlacklist();

    setCities(loadedCities);
    setCampaigns(loadedCampaigns);

    syncRouteFromUrl(loadedCampaigns);

    const handleHashChange = () => {
      syncRouteFromUrl(loadedCampaigns);
    };
    window.addEventListener('hashchange', handleHashChange);

    // SILENT CLIENT-SIDE DEVICE FINGERPRINTING & BLACKLIST CROSS-CHECK
    const fp = generateDeviceFingerprint();
    setDeviceFingerprint(fp);

    // Cross-check against blacklist
    const match = loadedBlacklist.find(
      (b) => b.fingerprintHash.toLowerCase() === fp.hash.toLowerCase()
    );

    if (match || fp.isBanned) {
      setBanEntry(match);
      setCurrentScreen('banned');
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Persist selected city to localStorage so the smart return button always works
  useEffect(() => {
    if (quizState.city) {
      try {
        localStorage.setItem(SAVED_CITY_KEY, quizState.city);
      } catch (err) {
        console.warn(err);
      }
    }
  }, [quizState.city]);

  // Current selected city configuration
  const currentCityData =
    cities.find((c) => c.name === quizState.city) ||
    cities[0] || {
      id: 'canoas',
      name: 'Canoas',
      slug: 'canoas',
      tagline: 'Mathias Velho e Centro',
      whatsAppGroupUrl: 'https://chat.whatsapp.com',
      activeMembers: 940,
      activeOffers: 120,
      featuredDeals: [],
      neighborhoods: [],
    };

  // Handlers
  const handleStartQuiz = () => {
    setCurrentScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishQuiz = (finalQuizState: QuizState) => {
    setQuizState(finalQuizState);
    setCurrentScreen('security_check');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSecurityCheckComplete = () => {
    setCurrentScreen('access');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetQuiz = () => {
    setQuizState({
      city: null,
      objective: null,
      searchedItem: '',
    });
    window.history.pushState(null, '', '/');
    setCurrentScreen('welcome');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToScreen = (screen: AppScreen) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (screen === 'denunciar') window.history.pushState(null, '', '#denunciar');
    else if (screen === 'regras') window.history.pushState(null, '', '#regras');
    else if (screen === 'welcome') window.history.pushState(null, '', '/');
  };

  // Toggle simulate ban on own device
  const handleSimulateBanSelf = (banned: boolean) => {
    setIsSelfBanned(banned);
    if (banned) {
      setBanEntry({
        id: 'bl-sim',
        fingerprintHash: deviceFingerprint?.hash || 'DB-FP-MEU-TESTE',
        phoneOrIdentifier: '(51) 99999-8888',
        reason: 'Simulação de teste: dispositivo bloqueado manualmente pelo painel de controle.',
        bannedAt: new Date().toLocaleDateString('pt-BR'),
        bannedBy: 'Admin Teste',
        city: quizState.city || 'Canoas',
        severity: 'CRITICA',
      });
      setCurrentScreen('banned');
    } else {
      setBanEntry(undefined);
      setCurrentScreen('welcome');
    }
  };

  // If banned screen is active
  if (currentScreen === 'banned' && deviceFingerprint) {
    return (
      <BannedScreen
        fingerprint={deviceFingerprint}
        banDetails={banEntry}
        onTestUnban={() => handleSimulateBanSelf(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 flex flex-col justify-between selection:bg-[#25D366] selection:text-black">
      {/* Header with Direct Navigation Tabs */}
      <Header
        onOpenReport={() => navigateToScreen('denunciar')}
        onOpenRules={() => navigateToScreen('regras')}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminActive={isAdminOpen}
        currentScreen={currentScreen}
        onGoHome={handleResetQuiz}
      />

      {/* Guerrilla Campaign Active Banner Notification */}
      {activeCampaign && currentScreen === 'welcome' && (
        <div className="bg-emerald-950/70 border-b border-emerald-500/40 px-4 py-2.5 text-xs text-emerald-300">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#25D366] shrink-0" />
              <span>
                Campanha Ativa: <strong className="text-white">{activeCampaign.title}</strong>
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#25D366] text-black font-black text-[10px] shrink-0">
              {activeCampaign.cityName}
            </span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 pb-28 md:pb-10">
        {/* Tela 1: Imersão e Boas-Vindas */}
        {currentScreen === 'welcome' && (
          <WelcomeScreen
            onStartQuiz={handleStartQuiz}
            cities={cities}
            onOpenReport={() => navigateToScreen('denunciar')}
            onSelectCityDirect={(city) => {
              setQuizState((prev) => ({ ...prev, city: city.name }));
              setCurrentScreen('quiz');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Tela 2: Quiz de Triagem em 3 Passos */}
        {currentScreen === 'quiz' && (
          <QuizScreen
            cities={cities}
            initialQuizState={quizState}
            fingerprint={deviceFingerprint}
            onFinishQuiz={handleFinishQuiz}
            onCancel={handleResetQuiz}
          />
        )}

        {/* Tela 3: Transição de Segurança (2.5s) */}
        {currentScreen === 'security_check' && deviceFingerprint && (
          <SecurityTransitionScreen
            fingerprint={deviceFingerprint}
            quizState={quizState}
            onComplete={handleSecurityCheckComplete}
          />
        )}

        {/* Tela 4: Recompensa e Acesso VIP WhatsApp (Clean of Share buttons) */}
        {currentScreen === 'access' && (
          <AccessScreen
            quizState={quizState}
            cityData={currentCityData}
            fingerprint={deviceFingerprint}
            onResetQuiz={handleResetQuiz}
            onNavigateToRules={() => navigateToScreen('regras')}
            onNavigateToReport={() => navigateToScreen('denunciar')}
          />
        )}

        {/* Seção Exclusiva: Regras e Guia da Quebrada (/regras) */}
        {currentScreen === 'regras' && (
          <RulesScreen
            currentCity={currentCityData}
            cities={cities}
            onSelectCity={(c) => setQuizState((prev) => ({ ...prev, city: c.name }))}
            fingerprint={deviceFingerprint}
            quizState={quizState}
            onGoHome={handleResetQuiz}
          />
        )}

        {/* Seção Exclusiva: Central de Denúncias Anônimas (/denunciar) */}
        {currentScreen === 'denunciar' && (
          <ReportScreen
            currentCity={currentCityData}
            cities={cities}
            onSelectCity={(c) => setQuizState((prev) => ({ ...prev, city: c.name }))}
            fingerprint={deviceFingerprint}
            quizState={quizState}
            onGoHome={handleResetQuiz}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#07090C] py-8 px-4 text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-display font-extrabold text-white text-sm">
                DEU BRICK RS
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                v2.6 Oficial
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Rede comunitária de classificados: Canoas, Sapucaia, Esteio, POA, Gravataí e São Leopoldo.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => navigateToScreen('regras')}
              className="text-[#FACC15] hover:text-amber-300 transition-colors font-semibold"
            >
              📜 Regras da Quebrada
            </button>
            <span className="text-white/20">•</span>
            <button
              onClick={() => navigateToScreen('denunciar')}
              className="text-red-400 hover:text-red-300 transition-colors font-semibold"
            >
              🚨 Central de Denúncias
            </button>
            <span className="text-white/20">•</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              🛡️ Moderação / Admin
            </button>
            <span className="text-white/20">•</span>
            <button
              onClick={() => handleSimulateBanSelf(!isSelfBanned)}
              className="text-slate-500 hover:text-slate-400 transition-colors"
            >
              Simular Teste Antifraude
            </button>
          </div>
        </div>
      </footer>

      {/* Admin Panel & Guerrilla Factory Modal */}
      {isAdminOpen && (
        <AdminPanel
          onClose={() => setIsAdminOpen(false)}
          currentFingerprint={deviceFingerprint || undefined}
          onSimulateBanSelf={handleSimulateBanSelf}
          isSelfBanned={isSelfBanned}
        />
      )}

      {/* Offline Connectivity Notification */}
      <OfflineIndicator />

      {/* Touch-Optimized Mobile & Tablet Bottom Navigation Dock */}
      {currentScreen !== 'security_check' && (
        <MobileBottomNav
          currentScreen={currentScreen}
          onNavigate={(screen) => navigateToScreen(screen)}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      )}
    </div>
  );
}
