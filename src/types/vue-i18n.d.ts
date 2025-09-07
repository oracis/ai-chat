declare module 'vue-i18n' {
  import type { Ref, App } from 'vue';

  export interface Composer {
    t: (key: string, ...args: any[]) => string;
    locale: Ref<string>;
  }

  export function useI18n(): Composer;

  export function createI18n(options: any): {
    global: Composer & {
      setLocaleMessage: (locale: string, messages: any) => void;
    };
    install: (app: App) => void;
  };
}
