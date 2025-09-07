<template>
  <div class="message-list" ref="_ref">
    <div
      class="message-item mb-3"
      v-for="message in messages"
      :key="message.id"
    >
      <div class="flex" :class="{ 'justify-end': message.type === 'question' }">
        <div>
          <div
            class="text-sm text-gray-500 mb-2"
            :class="{ 'text-right': message.type === 'question' }"
          >
            {{ dayjs(message.updatedAt).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
          <div
            class="message-question bg-green-700 text-white p-2 rounded-md"
            v-if="message.type === 'question'"
          >
            <img
              v-if="message.imagePath"
              :src="`safe-file:///${message.imagePath}`"
              alt=""
              class="w-24 h-24 rounded-md"
            />
            <VueMarkdown :source="message.content" />
          </div>

          <div
            class="message-answer bg-gray-200 text-gray-700 p-2 rounded-md"
            :class="{ 'bg-red-200 text-red-700': message.status === 'error' }"
            v-else
          >
            <template v-if="message.status === 'loading'">
              <Icon icon="eos-icons:three-dots-loading" />
            </template>
            <template v-else-if="message.status === 'error'">
              <Icon icon="mdi:alert-circle" />
              <span>{{ message.content }}</span>
            </template>
            <div
              v-else-if="
                message.status === 'finished' || message.status === 'streaming'
              "
              class="prose prose-headings:my-2 prose-hr:my-0 prose-li:my-0 prose-ul:my-1 prose-p:my-1 prose-pre:p-0"
            >
              <VueMarkdown :source="message.content" :plugins="plugins" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MessageProps } from '@/types';
import { Icon } from '@iconify/vue';
import dayjs from 'dayjs';
import VueMarkdown from 'vue-markdown-render';
import markdownItHighlightjs from 'markdown-it-highlightjs';
import { ref } from 'vue';
defineProps<{ messages: MessageProps[] }>();
const _ref = ref<HTMLDivElement>();
const plugins = [markdownItHighlightjs];
defineExpose({
  ref: _ref,
});
</script>

<style scoped></style>
