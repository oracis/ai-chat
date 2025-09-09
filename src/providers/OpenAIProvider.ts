import type { ProviderConfigItem } from '@/types';
import OpenAICompatibleProvider from './OpenAICompatibleProvider';

class OpenAIProvider extends OpenAICompatibleProvider {
  constructor(config: ProviderConfigItem[]) {
    super(config);
  }
}

export default OpenAIProvider;
