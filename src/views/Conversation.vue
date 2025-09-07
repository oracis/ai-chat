<template>
  <div
    class="bg-gray-200 border-b border-gray-300 h-[10%] flex items-center px-3 justify-between"
  >
    <h3 class="font-semibold text-gray-900">{{ conversation?.title }}</h3>
    <span class="text-sm text-gray-500">{{
      dayjs(conversation?.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    }}</span>
  </div>

  <div class="w-[80%] mx-auto h-[75%] overflow-y-auto pt-2">
    <MessageList :messages="filteredMessages" ref="messageListRef" />
  </div>
  <div class="w-[80%] mx-auto h-[15%] flex items-center">
    <MessageInput
      @create="sendNewMessage"
      :disabled="messageStore.isMessageLoading"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type {
  MessageProps,
  MessageStreamProps,
  UpdatedStreamProps,
  MessageListRef,
  MessageStatus,
} from '@/types';
import dayjs from 'dayjs';

import MessageList from '@/components/MessageList.vue';
import MessageInput from '@/components/MessageInput.vue';
import { db } from '@/db';
import { useConversationStore } from '@/stores/conversationStore';
import { useMessageStore } from '@/stores/messageStore';
const route = useRoute();
let conversationId = ref(parseInt(route.params.id as string));

const initMessageId = parseInt(route.query.init as string);
const conversationStore = useConversationStore();
const messageStore = useMessageStore();
const computeStatus = (ended: boolean, errored: boolean): MessageStatus => {
  if (!ended) return 'streaming';
  return errored ? 'error' : 'finished';
};
const conversation = computed(() =>
  conversationStore.getConversationById(conversationId.value)
);
const filteredMessages = computed(() => messageStore.messages);
const sendedMessages = computed(() =>
  filteredMessages.value
    .filter((item) => item.status !== 'loading' && item.status !== 'error')
    .map((item) => ({
      role: item.type === 'question' ? 'user' : ('assistant' as const),
      content: item.content,
      ...(item.imagePath ? { imagePath: item.imagePath } : {}),
    }))
);
const sendNewMessage = async (question: string, imagePath?: string) => {
  if (question) {
    let copiedImagePath: string | undefined;
    if (imagePath) {
      try {
        copiedImagePath =
          await window.electronApi.copyImageToUserDir(imagePath);
      } catch (error) {
        console.error('复制图片失败', error);
      }
    }
    await messageStore.createMessage({
      conversationId: conversationId.value,
      type: 'question',
      content: question,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(copiedImagePath ? { imagePath: copiedImagePath } : {}),
    });
    await createInitialMessage();
  }
};
const createInitialMessage = async () => {
  const createData: Omit<MessageProps, 'id'> = {
    conversationId: conversationId.value,
    type: 'answer',
    content: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'loading',
  };
  const newMessageId = await messageStore.createMessage(createData);
  await messageScrollToBottom();

  if (conversation.value) {
    const provider = await db.providers.get({
      id: conversation.value.providerId,
    });
    if (provider) {
      window.electronApi.startChat({
        messageId: newMessageId,
        messages: sendedMessages.value as MessageStreamProps[],
        providerName: provider.name,
        selectedModel: conversation.value.selectedModel,
      });
    }
  }
};

const messageListRef = ref<MessageListRef>();
const messageScrollToBottom = async () => {
  await nextTick();
  if (messageListRef.value) {
    messageListRef.value.ref.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }
};

watch(
  () => route.params.id,
  async (newId) => {
    conversationId.value = parseInt(newId as string);
    await messageStore.fetchMessagesByConversation(conversationId.value);
    await messageScrollToBottom();
  }
);

onMounted(async () => {
  await messageStore.fetchMessagesByConversation(conversationId.value);
  await messageScrollToBottom();
  if (initMessageId) {
    await createInitialMessage();
  }
  let currentMessageListHeight = 0;
  let streamContent = '';
  const checkAndScrollBottom = async () => {
    if (messageListRef.value) {
      const newHeight = messageListRef.value.ref.clientHeight;
      if (newHeight > currentMessageListHeight) {
        currentMessageListHeight = newHeight;
        await messageScrollToBottom();
      }
    }
  };
  window.electronApi.onUpdateMessage(async (streamData: UpdatedStreamProps) => {
    const {
      messageId,
      data: { result, is_end, is_error },
    } = streamData;
    streamContent += result;
    const updateData = {
      content: streamContent,
      status: computeStatus(Boolean(is_end), Boolean(is_error)),
      updatedAt: new Date().toISOString(),
    };
    await messageStore.updateMessage(messageId, updateData);
    await nextTick();
    checkAndScrollBottom();
    if (is_end) {
      streamContent = '';
    }
  });
});
</script>
