import type { ProviderConfigItem } from '@/types';
import OpenAICompatibleProvider from './OpenAICompatibleProvider';

class DeepSeekProvider extends OpenAICompatibleProvider {
  constructor(config: ProviderConfigItem[]) {
    super(config);
  }
}

export default DeepSeekProvider;
