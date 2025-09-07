import type { CreateChatProps, OnUpdatedCallback, AppConfig } from '@/types';

export interface ElectronApi {
  startChat: (data: CreateChatProps) => void;
  onUpdateMessage: (callback: OnUpdatedCallback) => any;
  copyImageToUserDir: (imagePath: string) => Promise<string>;
  getPathForFile: (file: File) => string;
  getConfig: () => Promise<AppConfig>;
  setConfig: (cfg: AppConfig) => Promise<boolean>;
  onMenuNewConversation: (handler: () => void) => void;
  onMenuSettings: (handler: () => void) => void;
  showConversationContextMenu: (conversationId: number) => void;
  onConversationContextMenuAction: (
    handler: (action: string, conversationId: number) => void
  ) => void;
}

declare global {
  interface Window {
    electronApi: ElectronApi;
  }
}

// Fallback shim for vue-i18n types in TS 4.5 + bundler envs
declare module 'vue-i18n';
