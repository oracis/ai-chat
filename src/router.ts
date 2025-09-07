import { createRouter, createMemoryHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Conversation from '@/views/Conversation.vue';
import Settings from '@/views/Settings.vue';
import { useConversationStore } from './stores/conversationStore';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/conversation/:id',
    name: 'conversation',
    component: Conversation,
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

router.beforeEach((to) => {
  if (to.name !== 'conversation') {
    const conversationStore = useConversationStore();
    conversationStore.selectedId = -1;
  }
});

export default router;
