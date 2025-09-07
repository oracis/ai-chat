import { BrowserWindow } from 'electron';
import { registerChatHandlers } from './chatHandler';
import { registerImageHandlers } from './imageHandler';
import { registerConfigHandlers } from './configHandler';
import { registerContextMenuHandlers } from './contextMenuHandler';

export function registerAllIpcHandlers(mainWindow: BrowserWindow) {
  registerChatHandlers(mainWindow);
  registerImageHandlers();
  registerConfigHandlers();
  registerContextMenuHandlers();
}
