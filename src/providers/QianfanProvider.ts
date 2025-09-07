import type {
  MessageStreamProps,
  ProviderConfigItem,
  UniversalChunkProps,
  UpdatedStreamProps,
} from '@/types';
import BaseProvider from './BaseProvider';
import { ChatCompletion, setEnvVariable } from '@baiducloud/qianfan';

class QianfanProvider extends BaseProvider {
  private client: ChatCompletion;
  constructor(config: ProviderConfigItem[]) {
    setEnvVariable(
      'QIANFAN_ACCESS_KEY',
      config.find((item) => item.key === 'accessKey')?.value
    );
    setEnvVariable(
      'QIANFAN_SECRET_KEY',
      config.find((item) => item.key === 'secretKey')?.value
    );
    super();
    this.client = new ChatCompletion();
  }
  async chat(messages: MessageStreamProps[], model: string) {
    const stream: any = await this.client.chat(
      {
        messages,
        stream: true,
      },
      model
    );
    const self = this;
    return {
      async *[Symbol.asyncIterator]() {
        for await (const chunk of stream) {
          yield self.transformResponse(chunk);
        }
      },
    };
  }
  protected transformResponse(chunk: any): UniversalChunkProps {
    const { is_end, result } = chunk;
    return {
      is_end,
      result,
    };
  }
}

export default QianfanProvider;
