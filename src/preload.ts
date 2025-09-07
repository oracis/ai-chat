// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { ipcRenderer, contextBridge, webUtils } from 'electron';
import type { CreateChatProps, OnUpdatedCallback, AppConfig } from '@/types';

contextBridge.exposeInMainWorld('electronApi', {
  startChat: (data: CreateChatProps) => ipcRenderer.send('start-chat', data),
  onUpdateMessage: (callback: OnUpdatedCallback) =>
    ipcRenderer.on('update-message', (event, data) => callback(data)),
  copyImageToUserDir: (imagePath: string) =>
    ipcRenderer.invoke('copy-image-to-user-dir', imagePath),
  getPathForFile: webUtils.getPathForFile,
  getConfig: (): Promise<AppConfig> => ipcRenderer.invoke('config-get'),
  setConfig: (cfg: AppConfig): Promise<boolean> =>
    ipcRenderer.invoke('config-set', cfg),
  onMenuNewConversation: (handler: () => void) =>
    ipcRenderer.on('menu-new-conversation', handler),
  onMenuSettings: (handler: () => void) =>
    ipcRenderer.on('menu-settings', handler),
  showConversationContextMenu: (conversationId: number) =>
    ipcRenderer.send('show-conversation-context-menu', conversationId),
  onConversationContextMenuAction: (
    handler: (action: string, conversationId: number) => void
  ) =>
    ipcRenderer.on('conversation-context-menu-action', (event, data) =>
      handler(data.action, data.conversationId)
    ),
});
