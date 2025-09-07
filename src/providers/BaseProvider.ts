import type { MessageStreamProps, UniversalChunkProps } from '@/types';

abstract class BaseProvider {
  abstract chat(
    messages: MessageStreamProps[],
    modelName: string
  ): Promise<AsyncIterable<UniversalChunkProps>>;
  protected abstract transformResponse(chunk: any): UniversalChunkProps;
}

export default BaseProvider;
