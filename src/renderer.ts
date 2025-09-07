import { createApp } from 'vue';
import App from '@/App.vue';
import { createPinia } from 'pinia';
import './index.css';
import 'highlight.js/styles/github-dark.min.css';
import { i18n, setLocale } from '@/i18n';

const pinia = createPinia();
import router from '@/router';

async function bootstrap() {
  const app = createApp(App);
  app.use(router).use(pinia).use(i18n);
  try {
    const cfg = await window.electronApi.getConfig();
    await setLocale(cfg.language, i18n);
  } catch {}
  app.mount('#app');
}

bootstrap();
