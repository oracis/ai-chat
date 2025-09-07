import type { AppConfig } from '@/types';
import zhCN from '@/locales/zh-CN.json';
import enUS from '@/locales/en-US.json';

type Locale = AppConfig['language'];

// Embed translations to work in dev and production without relying on fs paths
const embeddedTranslations: Record<Locale, Record<string, string>> = {
  'zh-CN': zhCN as Record<string, string>,
  'en-US': enUS as Record<string, string>,
} as any;

/**
 * Load translations from locale files
 */
function loadTranslations(locale: Locale): Record<string, string> {
  const translations = embeddedTranslations[locale];
  if (translations) return translations;
  return embeddedTranslations['zh-CN'] || {};
}

/**
 * Get translation for a key in the main process
 */
export function getMainTranslation(
  key: string,
  locale: Locale = 'zh-CN'
): string {
  const translations = loadTranslations(locale);
  return translations[key] || key;
}

/**
 * Clear translation cache (useful for development)
 */
export function clearTranslationCache(): void {
  // No-op now that we embed translations
}
