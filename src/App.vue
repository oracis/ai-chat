<template>
  <div class="flex items-center justify-between h-screen">
    <div class="w-[300px] bg-gray-200 h-full border-r border-gray-300">
      <div class="h-[90%] overflow-y-auto">
        <ConversationList :items="items" />
      </div>
      <div class="h-[10%] grid grid-cols-2 gap-2 p-2 content-center">
        <RouterLink to="/">
          <Button iconName="radix-icons:chat-bubble">{{
            t('nav.newChat')
          }}</Button>
        </RouterLink>
        <RouterLink to="/settings">
          <Button :plain="true" iconName="radix-icons:chat-bubble">{{
            t('nav.settings')
          }}</Button>
        </RouterLink>
      </div>
    </div>
    <div class="flex-1 h-full">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ConversationList from '@/components/ConversationList.vue';
import Button from '@/components/Button.vue';
import { initProviders } from '@/db';
import { useConversationStore } from '@/stores/conversationStore';
const conversationStore = useConversationStore();
const { t } = useI18n();

const items = computed(() => conversationStore.conversations);
onMounted(async () => {
  await initProviders();
  await conversationStore.fetchConversations();
 
});
</script>
