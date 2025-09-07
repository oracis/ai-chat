<template>
  <div class="flex justify-center h-full">
    <div class="w-[80%] max-auto">
      <div class="h-[85%] flex items-center">
        <ProviderSelect
          :providers="providers"
          v-model="currentProvider"
          :disabled="!currentProvider"
        />
      </div>
      <div class="h-[15%] flex items-center">
        <MessageInput
          @create="createConversation"
          :disabled="currentProvider == null"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import ProviderSelect from '@/components/ProviderSelect.vue';
import MessageInput from '@/components/MessageInput.vue';
import { db } from '@/db';
import { useRouter } from 'vue-router';
import { useConversationStore } from '@/stores/conversationStore';
import { useProviderStore } from '@/stores/providerStore';
const providerStore = useProviderStore();
const currentProvider = ref<string>('');
const providers = computed(() => providerStore.providers);
const router = useRouter();
const conversationStore = useConversationStore();
onMounted(async () => {
  await providerStore.fetchProviders();
  window.electronApi.onMenuNewConversation(() => router.push('/')); // 或创建对话的路由
  window.electronApi.onMenuSettings(() => router.push('/settings'));
});

const modelInfo = computed(() => {
  const [providerId, selectedModel] = currentProvider.value.split('/');
  return {
    providerId: parseInt(providerId),
    selectedModel,
  };
});

const createConversation = async (question: string, imagePath?: string) => {
  const { providerId, selectedModel } = modelInfo.value;
  const currentDate = new Date().toISOString();
  let copiedImagePath: string | undefined;
  if (imagePath) {
    try {
      copiedImagePath = await window.electronApi.copyImageToUserDir(imagePath);
    } catch (error) {
      console.error('复制图片失败', error);
    }
  }
  const conversationId = await conversationStore.createConversation({
    title: question,
    selectedModel,
    createdAt: currentDate,
    updatedAt: currentDate,
    providerId,
  });

  const newMessageId = await db.messages.add({
    type: 'question',
    conversationId,
    content: question,
    createdAt: currentDate,
    updatedAt: currentDate,
    ...(copiedImagePath ? { imagePath: copiedImagePath } : {}),
  });

  router.push(`/conversation/${conversationId}?init=${newMessageId}`);
};
</script>

<style scoped></style>
