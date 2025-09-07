import { ipcMain, app } from 'electron';
import path from 'node:path';
import fs from 'fs';

export function registerImageHandlers() {
  ipcMain.handle('copy-image-to-user-dir', async (event, imagePath: string) => {
    const userDir = app.getPath('userData');
    const imagesDir = path.join(userDir, 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir);
    }
    const fileName = path.basename(imagePath);
    const destPath = path.join(imagesDir, fileName);
    fs.copyFileSync(imagePath, destPath);
    return destPath;
  });
}
