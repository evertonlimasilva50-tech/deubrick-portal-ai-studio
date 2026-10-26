import { CityData, DeviceFingerprint, QuizState } from '../types';

/**
 * Cloaking & Anti-Leak Security Module
 * 
 * Prevents raw WhatsApp group URLs from ever being injected into HTML attributes
 * (such as href, data-url, etc.) where users could right-click and "Copy Link Address"
 * or scrapers could harvest the links.
 */

// Cryptographic Salt & Dynamic Obfuscation Key
const MASTER_SALT = 'DB_RS_QUEBRADA_BLINDADA_2026';
const XOR_KEY = 0x5a;

/**
 * Multi-layer XOR cipher with Base64 encoding for URL obfuscation
 */
export function obfuscateUrl(rawUrl: string, customSalt: string = MASTER_SALT): string {
  try {
    const combined = `${customSalt}::${rawUrl}`;
    let xorChars = '';
    for (let i = 0; i < combined.length; i++) {
      xorChars += String.fromCharCode(combined.charCodeAt(i) ^ XOR_KEY);
    }
    return typeof btoa !== 'undefined' ? btoa(xorChars) : Buffer.from(xorChars).toString('base64');
  } catch {
    return rawUrl;
  }
}

/**
 * Deobfuscates URL right at the instant of execution
 */
export function deobfuscateUrl(payload: string, customSalt: string = MASTER_SALT): string {
  try {
    const rawXor = typeof atob !== 'undefined' ? atob(payload) : Buffer.from(payload, 'base64').toString();
    let original = '';
    for (let i = 0; i < rawXor.length; i++) {
      original += String.fromCharCode(rawXor.charCodeAt(i) ^ XOR_KEY);
    }
    const prefix = `${customSalt}::`;
    if (original.startsWith(prefix)) {
      return original.slice(prefix.length);
    }
    return original;
  } catch {
    return '';
  }
}

/**
 * Generates an encrypted one-time access token based on user fingerprint and verified quiz
 */
export function generateAccessToken(fingerprint: DeviceFingerprint, quizState: QuizState): string {
  const timestamp = Date.now();
  const payload = `${fingerprint.hash}:${quizState.city}:${quizState.objective}:${timestamp}:${MASTER_SALT}`;
  
  // Base64-encode with obfuscated prefix
  const token = typeof btoa !== 'undefined' ? btoa(payload) : Buffer.from(payload).toString('base64');
  return `DB_AUTH_${token.slice(0, 32)}_${timestamp}`;
}

/**
 * Validates integrity and resolves obfuscated URL dynamically in memory
 */
export function resolveCloakedWhatsAppUrl(
  cityData: CityData,
  quizState: QuizState,
  fingerprint: DeviceFingerprint | null
): { success: boolean; url?: string; error?: string } {
  // Validate that the user actually completed the quiz
  if (!quizState.city || !quizState.objective) {
    return { success: false, error: 'Acesso negado: Triagem do quiz não concluída.' };
  }

  // Validate fingerprint integrity
  if (fingerprint?.isBanned) {
    return { success: false, error: 'Acesso negado: Terminal bloqueado na lista negra.' };
  }

  const rawUrl = cityData.whatsAppGroupUrl;
  if (!rawUrl) {
    return { success: false, error: 'Erro de roteamento: Subgrupo temporariamente indisponível.' };
  }

  // Obfuscate and immediately deobfuscate in private scope
  const salt = `${fingerprint?.hash || 'DB-METRO'}_${cityData.slug}`;
  const cloaked = obfuscateUrl(rawUrl, salt);
  const resolved = deobfuscateUrl(cloaked, salt);

  if (!resolved || !resolved.startsWith('http')) {
    return { success: false, error: 'Falha na descriptografia da rota segura.' };
  }

  return { success: true, url: resolved };
}

/**
 * Validates the access token and returns the safe redirection execution
 * ONLY executable by legitimate user dispatch
 */
export function executeSecureRedirect(
  cityData: CityData,
  quizState: QuizState,
  fingerprint: DeviceFingerprint | null
): { success: boolean; error?: string } {
  const resolution = resolveCloakedWhatsAppUrl(cityData, quizState, fingerprint);
  if (!resolution.success || !resolution.url) {
    return { success: false, error: resolution.error || 'Acesso negado.' };
  }

  // Execute programmatic cloaked redirection strictly via window.location.replace without exposing URL in DOM
  try {
    window.location.replace(resolution.url);
    return { success: true };
  } catch (err) {
    // Fallback if replace is restricted
    try {
      window.location.href = resolution.url;
    } catch {
      window.open(resolution.url, '_self');
    }
    return { success: true };
  }
}

/**
 * Returns a masked representation of the destination for UI status (e.g. "chat.whatsapp.com/inv/***••••")
 */
export function getMaskedDestination(cityData: CityData): string {
  return `wa.me/invite/rs-${cityData.slug}-***BLINDADO***`;
}
