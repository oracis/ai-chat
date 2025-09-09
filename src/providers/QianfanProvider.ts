import type { ProviderConfigItem } from '@/types';
import OpenAICompatibleProvider from './OpenAICompatibleProvider';

class QianfanProvider extends OpenAICompatibleProvider {
  constructor(config: ProviderConfigItem[]) {
    super(config, {
      modelTransform: (model: string) => model.toLowerCase(),
    });
  }
}

export default QianfanProvider;
