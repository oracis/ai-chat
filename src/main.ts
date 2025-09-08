import { app, BrowserWindow, net, protocol } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { loadAppConfig } from '@/utils/appConfig';
import { createApplicationMenu } from './menu';
import { registerAllIpcHandlers } from './ipc';
import { updateElectronApp, UpdateSourceType } from 'update-electron-app';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}
let mainWindow: BrowserWindow;
const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    title: 'AI Chat',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  protocol.handle('safe-file', (request) => {
    const filePath = decodeURIComponent(
      request.url.slice('safe-file:///'.length)
    );
    return net.fetch(`file:///${filePath}`);
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools only in development environment
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  // Register all IPC handlers
  registerAllIpcHandlers(mainWindow);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  const cfg = loadAppConfig();
  createApplicationMenu(cfg.language);
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

updateElectronApp({
  updateSource: {
    type: UpdateSourceType.ElectronPublicUpdateService,
    repo: 'oracis/ai-chat',
  },
  updateInterval: '1 hour',
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
