import { ipcMain, BrowserWindow } from 'electron';
import type { CreateChatProps } from '../types';
import { createProvider } from '../providers/createProvider';
import BaseProvider from '../providers/BaseProvider';

export function registerChatHandlers(mainWindow: BrowserWindow) {
  ipcMain.on('start-chat', async (event, data: CreateChatProps) => {
    const { selectedModel, messages = [], providerName, messageId } = data;
    try {
      const provider = createProvider(providerName);
      if (provider instanceof BaseProvider) {
        const stream = await provider.chat(messages, selectedModel);
        for await (const chunk of stream) {
          mainWindow.webContents.send('update-message', {
            messageId,
            data: chunk,
          });
        }
      }
    } catch (error) {
      console.error('Chat error', error);
      mainWindow.webContents.send('update-message', {
        messageId,
        data: {
          is_end: true,
          is_error: true,
          result: error instanceof Error ? error.stack : '未知错误',
        },
      });
    }
  });
}
