import Dexie, { type EntityTable } from 'dexie';
import type { ProviderProps, ConversationProps, MessageProps } from '@/types';
import { providers } from '@/testData';

export const db = new Dexie('AiChatDatabase') as Dexie & {
  providers: EntityTable<ProviderProps, 'id'>;
  conversations: EntityTable<ConversationProps, 'id'>;
  messages: EntityTable<MessageProps, 'id'>;
};
db.version(1).stores({
  providers: '++id, name',
  conversations: '++id, providerId',
  messages: '++id, conversationId',
});

export const initProviders = async () => {
  const count = await db.providers.count();
  if (count === 0) {
    await db.providers.bulkAdd(providers);
  }
};
