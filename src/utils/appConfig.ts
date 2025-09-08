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
    const normalized = normalizeConfig({
      ...defaultAppConfig,
      ...parsed,
    } as AppConfig);
    return normalized;
  } catch {
    return { ...defaultAppConfig };
  }
};

export const saveAppConfig = (cfg: AppConfig): void => {
  const merged = normalizeConfig({ ...defaultAppConfig, ...cfg } as AppConfig);
  fs.writeFileSync(getConfigPath(), JSON.stringify(merged, null, 2), 'utf-8');
};

function normalizeConfig(cfg: AppConfig): AppConfig {
  const src = cfg.providerSettings || {};
  const normalizedProviders: Record<string, Record<string, any>> = {};
  Object.keys(src).forEach((key) => {
    const lower = key?.toLowerCase?.() || key;
    normalizedProviders[lower] = { ...(src as any)[key] };
  });
  return { ...cfg, providerSettings: normalizedProviders };
}
