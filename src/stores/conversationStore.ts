import { defineStore } from 'pinia';
import type { ConversationProps } from '@/types';
import { db } from '@/db';

export interface ConversationStore {
  conversations: ConversationProps[];
  selectedId: number;
}

export const useConversationStore = defineStore('conversation', {
  state: (): ConversationStore => ({
    conversations: [],
    selectedId: -1,
  }),
  actions: {
    async fetchConversations() {
      const items = await db.conversations.toArray();
      this.conversations = items;
    },
    async createConversation(createData: Omit<ConversationProps, 'id'>) {
      const id = await db.conversations.add(createData);
      this.conversations.push({
        ...createData,
        id,
      });
      return id;
    },
    async updateConversation(conversation: ConversationProps) {
      await db.conversations.update(conversation.id, conversation);
    },
    async deleteConversation(id: number) {
      // 删除对话及其相关消息
      await db.transaction('rw', [db.conversations, db.messages], async () => {
        // 删除对话
        await db.conversations.delete(id);
        // 删除该对话的所有消息
        await db.messages.where('conversationId').equals(id).delete();
      });

      // 从store中移除对话
      const index = this.conversations.findIndex((conv) => conv.id === id);
      if (index !== -1) {
        this.conversations.splice(index, 1);
      }

      // 如果删除的是当前选中的对话，重置选中状态
      if (this.selectedId === id) {
        this.selectedId = -1;
      }
    },
  },
  getters: {
    totalNumber: (state) => state.conversations.length,
    getConversationById: (state) => (id: number) => {
      return state.conversations.find((item) => item.id === id);
    },
  },
});
