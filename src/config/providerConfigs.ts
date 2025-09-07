import type { ProviderConfigItem, ProviderConfigMap } from '@/types';

const qianfanConfig: ProviderConfigItem[] = [
  {
    key: 'accessKey',
    value: '',
    label: 'Access Key',
    placeholder: 'abcd',
    type: 'text',
  },
  {
    key: 'secretKey',
    value: '',
    label: 'Secret Key',
    placeholder: 'abcd',
    type: 'password',
  },
];

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
  qianfan: qianfanConfig,
  dashscope: openaiConfig,
  deepseek: openaiConfig,
};
