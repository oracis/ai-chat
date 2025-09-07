import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import type { AppConfig } from '@/types';

export const defaultAppConfig: AppConfig = {
  language: 'zh-CN',
  fontSize: 14,
  providerSettings: {},
};

export const getConfigPath = (): string =>
  path.join(app.getPath('userData'), 'config.json');

export const loadAppConfig = (): AppConfig => {
  try {
    const content = fs.readFileSync(getConfigPath(), 'utf-8');
    const parsed = JSON.parse(content);
    return { ...defaultAppConfig, ...parsed } as AppConfig;
  } catch {
    return { ...defaultAppConfig };
  }
};

export const saveAppConfig = (cfg: AppConfig): void => {
  const merged = { ...defaultAppConfig, ...cfg } as AppConfig;
  fs.writeFileSync(getConfigPath(), JSON.stringify(merged, null, 2), 'utf-8');
};
