import { createI18n } from 'vue-i18n';

export const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: {},
});

export async function setLocale(lang: 'zh-CN' | 'en-US', inst = i18n) {
  const msgs = await import(`../locales/${lang}.json`);
  inst.global.setLocaleMessage(lang, msgs.default);
  inst.global.locale.value = lang;
}
