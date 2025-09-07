<template>
  <div class="conversation-list">
    <div
      v-for="item in items"
      :key="item.id"
      :class="{
        'bg-gray-100 hover:bg-gray-300':
          item.id === conversationStore.selectedId,
        'bg-white hover:bg-gray-200': item.id !== conversationStore.selectedId,
      }"
      class="conversation-item border-gray-300 border-t cursor-pointer p-2"
      @contextmenu.prevent="showContextMenu(item)"
    >
      <a @click.prevent="goToConversation(item.id)">
        <div
          class="flex items-center justify-between text-sm leading-5 text-gray-500"
        >
          <span>{{ item.selectedModel }}</span>
          <span>{{ dayjs(item.updatedAt).format('YYYY-MM-DD') }}</span>
        </div>
        <h2 class="text-lg leading-6 font-bold text-gray-700 truncate">
          {{ item.title }}
        </h2>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConversationProps } from '@/types';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { useConversationStore } from '@/stores/conversationStore';
import { onMounted, onUnmounted } from 'vue';

defineProps<{
  items: ConversationProps[];
}>();

const router = useRouter();
const conversationStore = useConversationStore();

const goToConversation = (id: number) => {
  router.push({
    name: 'conversation',
    params: { id },
  });
  conversationStore.selectedId = id;
};

// 显示右键菜单
const showContextMenu = (item: ConversationProps) => {
  if (window.electronApi) {
    window.electronApi.showConversationContextMenu(item.id);
  }
};

// 处理右键菜单操作
const handleContextMenuAction = async (
  action: string,
  conversationId: number
) => {
  if (action === 'delete') {
    try {
      // 检查是否删除的是当前正在查看的对话
      const isCurrentConversation =
        conversationStore.selectedId === conversationId;

      await conversationStore.deleteConversation(conversationId);

      // 如果删除的是当前对话，跳转到首页
      if (isCurrentConversation) {
        router.push({ name: 'home' });
      }
    } catch (error) {
      console.error('删除对话失败:', error);
    }
  }
};

onMounted(() => {
  if (window.electronApi) {
    window.electronApi.onConversationContextMenuAction(handleContextMenuAction);
  }
});

onUnmounted(() => {
  // 清理事件监听器
});
</script>

<style scoped></style>
