import type {
  MessageStreamProps,
  ProviderConfigItem,
  UniversalChunkProps,
} from '@/types';
import OpenAI from 'openai';
import BaseProvider from './BaseProvider';
import { convertMessages } from '../helper';

export interface OpenAICompatibleConfig {
  apiKey?: string;
  baseURL?: string;
  modelTransform?: (model: string) => string;
}

class OpenAICompatibleProvider extends BaseProvider {
  protected client: OpenAI;
  protected modelTransform: (model: string) => string;

  constructor(
    config: ProviderConfigItem[],
    options: OpenAICompatibleConfig = {}
  ) {
    super();

    this.client = new OpenAI({
      apiKey:
        config.find((item) => item.key === 'apiKey')?.value || options.apiKey,
      baseURL:
        config.find((item) => item.key === 'baseUrl')?.value || options.baseURL,
    });

    // 默认不转换模型名称，子类可以重写
    this.modelTransform = options.modelTransform || ((model: string) => model);
  }

  async chat(messages: MessageStreamProps[], model: string) {
    const convertedMessages = await convertMessages(messages);
    const transformedModel = this.modelTransform(model);

    const stream = await this.client.chat.completions.create({
      model: transformedModel,
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

export default OpenAICompatibleProvider;
