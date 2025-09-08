import type { ProviderConfigItem, ProviderConfigMap } from '@/types';

const openaiConfig: ProviderConfigItem[] = [
  {
    key: 'apiKey',
    value: '',
    label: 'API Key',
    placeholder: 'sk-...',
    type: 'password',
  },
  {
    key: 'baseUrl',
    value: '',
    label: 'BaseUrl',
    placeholder: 'https://api.openai.com',
    type: 'url',
  },
];

export const providerConfigs: ProviderConfigMap = {
  qianfan: openaiConfig,
  dashscope: openaiConfig,
  deepseek: openaiConfig,
};
