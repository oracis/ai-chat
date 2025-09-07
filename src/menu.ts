import { Menu, app, shell, BrowserWindow } from 'electron';
import type { AppConfig } from '@/types';

type Locale = AppConfig['language'];

const LOCALE_MESSAGES: Record<Locale, Record<string, string>> = {
  'en-US': {
    'menu.file': 'File',
    'menu.newConversation': 'New Conversation',
    'menu.settings': 'Settings',
    'menu.quit': 'Quit',
    'menu.edit': 'Edit',
    'menu.edit.undo': 'Undo',
    'menu.edit.redo': 'Redo',
    'menu.edit.cut': 'Cut',
    'menu.edit.copy': 'Copy',
    'menu.edit.paste': 'Paste',
    'menu.edit.selectAll': 'Select All',
    'menu.view': 'View',
    'menu.view.reload': 'Reload',
    'menu.view.forceReload': 'Force Reload',
    'menu.view.toggleDevTools': 'Toggle Developer Tools',
    'menu.view.resetZoom': 'Actual Size',
    'menu.view.zoomIn': 'Zoom In',
    'menu.view.zoomOut': 'Zoom Out',
    'menu.view.togglefullscreen': 'Toggle Full Screen',
    'menu.window': 'Window',
    'menu.window.minimize': 'Minimize',
    'menu.window.close': 'Close',
    'menu.window.front': 'Bring All to Front',
    'menu.help': 'Help',
    'menu.about': 'About',
  },
  'zh-CN': {
    'menu.file': '文件',
    'menu.newConversation': '新建对话',
    'menu.settings': '设置',
    'menu.quit': '退出',
    'menu.edit': '编辑',
    'menu.edit.undo': '撤销',
    'menu.edit.redo': '重做',
    'menu.edit.cut': '剪切',
    'menu.edit.copy': '复制',
    'menu.edit.paste': '粘贴',
    'menu.edit.selectAll': '全选',
    'menu.view': '视图',
    'menu.view.reload': '重新加载',
    'menu.view.forceReload': '强制重新加载',
    'menu.view.toggleDevTools': '切换开发者工具',
    'menu.view.resetZoom': '实际大小',
    'menu.view.zoomIn': '放大',
    'menu.view.zoomOut': '缩小',
    'menu.view.togglefullscreen': '切换全屏',
    'menu.window': '窗口',
    'menu.window.minimize': '最小化',
    'menu.window.close': '关闭',
    'menu.window.front': '前置所有窗口',
    'menu.help': '帮助',
    'menu.about': '关于',
  },
};

export const createApplicationMenu = (lang: Locale = 'zh-CN') => {
  const t = LOCALE_MESSAGES[lang] ?? LOCALE_MESSAGES['zh-CN'];
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: t['menu.file'] ?? 'File',
      submenu: [
        {
          label: t['menu.newConversation'] ?? 'New Conversation',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            const win =
              BrowserWindow.getFocusedWindow() ||
              BrowserWindow.getAllWindows()[0];
            if (win) win.webContents.send('menu-new-conversation');
          },
        },
        { type: 'separator' },
        {
          label: t['menu.settings'] ?? 'Settings',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            const win =
              BrowserWindow.getFocusedWindow() ||
              BrowserWindow.getAllWindows()[0];
            if (win) win.webContents.send('menu-settings');
          },
        },
        { type: 'separator' },
        {
          role: 'quit',
          label: t['menu.quit'] ?? 'Quit',
        },
      ],
    },
    {
      label: t['menu.edit'] ?? 'Edit',
      submenu: [
        { role: 'undo', label: t['menu.edit.undo'] ?? 'Undo' },
        { role: 'redo', label: t['menu.edit.redo'] ?? 'Redo' },
        { type: 'separator' },
        { role: 'cut', label: t['menu.edit.cut'] ?? 'Cut' },
        { role: 'copy', label: t['menu.edit.copy'] ?? 'Copy' },
        { role: 'paste', label: t['menu.edit.paste'] ?? 'Paste' },
        { role: 'selectAll', label: t['menu.edit.selectAll'] ?? 'Select All' },
      ],
    },
    {
      label: t['menu.view'] ?? 'View',
      submenu: [
        { role: 'reload', label: t['menu.view.reload'] ?? 'Reload' },
        {
          role: 'forceReload',
          label: t['menu.view.forceReload'] ?? 'Force Reload',
        },
        {
          role: 'toggleDevTools',
          label: t['menu.view.toggleDevTools'] ?? 'Toggle Developer Tools',
        },
        { type: 'separator' },
        { role: 'resetZoom', label: t['menu.view.resetZoom'] ?? 'Actual Size' },
        { role: 'zoomIn', label: t['menu.view.zoomIn'] ?? 'Zoom In' },
        { role: 'zoomOut', label: t['menu.view.zoomOut'] ?? 'Zoom Out' },
        { type: 'separator' },
        {
          role: 'togglefullscreen',
          label: t['menu.view.togglefullscreen'] ?? 'Toggle Full Screen',
        },
      ],
    },
    {
      label: t['menu.window'] ?? 'Window',
      submenu: [
        { role: 'minimize', label: t['menu.window.minimize'] ?? 'Minimize' },
        { role: 'close', label: t['menu.window.close'] ?? 'Close' },
      ],
    },
    {
      label: t['menu.help'] ?? 'Help',
      submenu: [
        {
          label: t['menu.about'] ?? 'About',
          click: () => {
            shell.openExternal('https://github.com/your-repo/ai-chat');
          },
        },
      ],
    },
  ];

  // macOS specific menu adjustments
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    });

    // Move Window menu items to the app menu on macOS
    const windowMenu = template.find((menu) => menu.label === 'Window');
    if (windowMenu && windowMenu.submenu) {
      (windowMenu.submenu as Electron.MenuItemConstructorOptions[]).push(
        { type: 'separator' },
        { role: 'front', label: t['menu.window.front'] ?? 'Bring All to Front' }
      );
    }
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
