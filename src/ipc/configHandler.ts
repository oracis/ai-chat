import { ipcMain } from 'electron';
import type { AppConfig } from '../types';
import { loadAppConfig, saveAppConfig } from '../utils/appConfig';
import { createApplicationMenu } from '../menu';

export function registerConfigHandlers() {
  ipcMain.handle('config-get', async () => {
    const cfg = loadAppConfig();
    return cfg;
  });

  ipcMain.handle('config-set', async (_event, cfg: AppConfig) => {
    saveAppConfig(cfg);
    // Rebuild application menu when language changes
    if (cfg.language) {
      createApplicationMenu(cfg.language);
    }
    return true;
  });
}
