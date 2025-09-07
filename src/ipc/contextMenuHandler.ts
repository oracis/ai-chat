import { ipcMain, Menu, BrowserWindow } from 'electron';
import { loadAppConfig } from '../utils/appConfig';
import { getMainTranslation } from '../utils/mainI18n';

export function registerContextMenuHandlers() {
  // 处理右键菜单显示
  ipcMain.on(
    'show-conversation-context-menu',
    (event, conversationId: number) => {
      // 获取当前语言设置
      const config = loadAppConfig();
      const currentLang = config.language || 'zh-CN';

      const template: Electron.MenuItemConstructorOptions[] = [
        {
          label: getMainTranslation(
            'contextMenu.deleteConversation',
            currentLang
          ),
          click: () => {
            event.sender.send('conversation-context-menu-action', {
              action: 'delete',
              conversationId: conversationId,
            });
          },
        },
      ];

      const menu = Menu.buildFromTemplate(template);
      menu.popup({
        window: BrowserWindow.fromWebContents(event.sender) || undefined,
      });
    }
  );
}
