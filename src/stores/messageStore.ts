import { defineStore } from 'pinia';
import type { MessageProps, MessageStatus, UpdatedStreamProps } from '@/types';
import { db } from '@/db';

export interface MessageStore {
  messages: MessageProps[];
}

export const useMessageStore = defineStore('message', {
  state: (): MessageStore => ({
    messages: [],
  }),
  actions: {
    async fetchMessagesByConversation(conversationId: number) {
      const items = await db.messages
        .filter((message) => message.conversationId === conversationId)
        .toArray();
      this.messages = items;
    },
    async createMessage(createData: Omit<MessageProps, 'id'>) {
      const id = await db.messages.add(createData);
      this.messages.push({
        ...createData,
        id,
      });
      return id;
    },
    async updateMessage(messageId: number, updateData: Partial<MessageProps>) {
      await db.messages.update(messageId, updateData);
      const index = this.messages.findIndex(
        (message) => message.id === messageId
      );
      if (index !== -1) {
        this.messages[index] = {
          ...this.messages[index],
          ...updateData,
        };
      }
    },
  },
  getters: {
    getLastQuestion: (state) => (conversationId: number) => {
      return (
        state.messages.findLast(
          (item) =>
            item.conversationId === conversationId && item.type === 'question'
        )?.content || ''
      );
    },
    isMessageLoading: (state) => {
      return state.messages.some(
        (item) => item.status === 'loading' || item.status === 'streaming'
      );
    },
  },
});
