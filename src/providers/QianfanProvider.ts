import type {
  MessageStreamProps,
  ProviderConfigItem,
  UniversalChunkProps,
} from '@/types';
import OpenAI from 'openai';
import BaseProvider from './BaseProvider';
import { convertMessages } from '../helper';

class QianfanProvider extends BaseProvider {
  private client: OpenAI;
  constructor(config: ProviderConfigItem[]) {
    super();
    this.client = new OpenAI({
      apiKey: config.find((item) => item.key === 'apiKey')?.value,
      baseURL: config.find((item) => item.key === 'baseUrl')?.value,
    });
  }
  async chat(messages: MessageStreamProps[], model: string) {
    const convertedMessages = await convertMessages(messages);
    const stream = await this.client.chat.completions.create({
      model: model.toLowerCase(),
      messages: convertedMessages,
      stream: true,
    });
    const self = this;
    return {
      async *[Symbol.asyncIterator]() {
        for await (const chunk of stream) {
          yield self.transformResponse(chunk);
        }
      },
    };
  }

  protected transformResponse(
    chunk: OpenAI.Chat.Completions.ChatCompletionChunk
  ): UniversalChunkProps {
    return {
      is_end: chunk.choices[0].finish_reason === 'stop',
      result: chunk.choices[0].delta.content || '',
    };
  }
}

export default QianfanProvider;
