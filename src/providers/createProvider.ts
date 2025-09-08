import BaseProvider from './BaseProvider';
import QianfanProvider from './QianfanProvider';
import OpenAIProvider from './OpenAIProvider';
import DeepSeekProvider from './DeepSeekProvider';
import { providerConfigs } from '@/config/providerConfigs';
import type { ProviderConfigItem } from '@/types';
import { loadAppConfig } from '@/utils/appConfig';

export function createProvider(providerName: string): BaseProvider | Error {
  const defaults = providerConfigs[providerName] || [];
  const cfg = loadAppConfig();
  const saved =
    (cfg.providerSettings && cfg.providerSettings[providerName]) || {};
  const providerConfig: ProviderConfigItem[] = defaults.map((item) => ({
    ...item,
    value: Object.prototype.hasOwnProperty.call(saved, item.key)
      ? saved[item.key]
      : item.value,
  }));

  const getConfigValue = (key: string) =>
    providerConfig.find((it) => it.key === key)?.value || '';
  const apiKey = getConfigValue('apiKey');
  const baseUrl = getConfigValue('baseUrl');

  if (providerName === 'qianfan') {
    if (!apiKey || !baseUrl) {
      throw new Error('缺少千帆API配置：请在设置中配置 apiKey 和 baseUrl');
    }
    return new QianfanProvider(providerConfig);
  } else if (providerName === 'dashscope') {
    if (!apiKey || !baseUrl) {
      throw new Error('缺少阿里灵积API配置：请在设置中配置 apiKey 和 baseUrl');
    }
    return new OpenAIProvider(providerConfig);
  } else if (providerName === 'deepseek') {
    if (!apiKey || !baseUrl) {
      throw new Error('缺少DeepSeekAPI配置：请在设置中配置 apiKey 和 baseUrl');
    }
    return new DeepSeekProvider(providerConfig);
  } else {
    throw new Error(`provider ${providerName} not found`);
  }
}
