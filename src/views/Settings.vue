<template>
  <div class="settings-page">
    <h1 class="settings-title flex items-center justify-center">
      {{ t('settings.title') }}
    </h1>
    <div class="p-4 max-w-3xl mx-auto">
      <TabsRoot v-model="activeTab" class="w-full" activation-mode="manual">
        <TabsList class="flex border-b mb-4">
          <TabsTrigger
            value="general"
            class="px-4 py-2 -mb-px border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
            >{{ t('settings.tab.general') }}</TabsTrigger
          >
          <TabsTrigger
            value="models"
            class="px-4 py-2 -mb-px border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
            >{{ t('settings.tab.models') }}</TabsTrigger
          >
        </TabsList>

        <TabsContent value="general" class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="mr-4">{{ t('settings.language') }}</label>
            <SelectRoot v-model="config.language">
              <SelectTrigger
                class="inline-flex items-center justify-between rounded border px-3 py-1 min-w-40"
              >
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectPortal>
                <SelectContent class="rounded border bg-white shadow">
                  <SelectViewport class="p-2">
                    <SelectGroup>
                      <SelectItem
                        value="zh-CN"
                        class="outline-none relative rounded flex items-center pl-8 pr-3 py-1 cursor-pointer hover:bg-gray-100"
                      >
                        <SelectItemIndicator class="absolute left-2 w-5">
                          <Icon icon="radix-icons:check" class="w-4 h-4" />
                        </SelectItemIndicator>
                        <SelectItemText>中文</SelectItemText>
                      </SelectItem>
                      <SelectItem
                        value="en-US"
                        class="outline-none relative rounded flex items-center pl-8 pr-3 py-1 cursor-pointer hover:bg-gray-100"
                      >
                        <SelectItemIndicator class="absolute left-2 w-5">
                          <Icon icon="radix-icons:check" class="w-4 h-4" />
                        </SelectItemIndicator>
                        <SelectItemText>English</SelectItemText>
                      </SelectItem>
                    </SelectGroup>
                  </SelectViewport>
                </SelectContent>
              </SelectPortal>
            </SelectRoot>
          </div>

          <div class="flex items-center justify-between">
            <label class="mr-4">{{ t('settings.fontSize') }}</label>
            <NumberFieldRoot
              v-model="config.fontSize"
              :min="10"
              :max="28"
              :step="1"
            >
              <div class="flex items-center border rounded overflow-hidden">
                <NumberFieldDecrement
                  class="px-2 select-none cursor-pointer hover:bg-gray-100"
                  >-</NumberFieldDecrement
                >
                <NumberFieldInput
                  class="w-24 px-2 py-1 text-right outline-none"
                />
                <NumberFieldIncrement
                  class="px-2 select-none cursor-pointer hover:bg-gray-100"
                  >+</NumberFieldIncrement
                >
              </div>
            </NumberFieldRoot>
          </div>
        </TabsContent>

        <TabsContent value="models">
          <AccordionRoot type="single" collapsible class="space-y-3">
            <AccordionItem
              v-for="p in providers"
              :key="p.id"
              :value="String(p.id)"
              class="border rounded"
            >
              <AccordionHeader>
                <AccordionTrigger
                  class="w-full flex items-center justify-between px-4 py-2"
                >
                  <div class="flex items-center">
                    <Icon icon="radix-icons:gear" class="w-4 h-4 mr-2" />
                    <span>{{ p.name }}</span>
                  </div>
                  <Icon icon="radix-icons:chevron-down" class="w-4 h-4" />
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent class="px-4 py-3 border-t bg-gray-50">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <template
                    v-for="item in providerForms[getProviderKey(p)]"
                    :key="item.key"
                  >
                    <div
                      class="flex items-center justify-between"
                      :class="{
                        'md:col-span-2': item.key.toLowerCase().includes('url'),
                      }"
                    >
                      <label class="mr-4">{{ item.label || item.key }}</label>
                      <input
                        :type="item.type || 'text'"
                        class="border rounded px-3 py-1 w-full max-w-xl"
                        v-model="item.value"
                        @blur="onProviderFieldBlur(getProviderKey(p), item)"
                        :placeholder="item.placeholder || ''"
                      />
                    </div>
                  </template>
                </div>
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>
        </TabsContent>
      </TabsRoot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { setLocale } from '@/i18n';
import type { AppConfig } from '@/types';
import type { ProviderConfigItem } from '@/types';
import {
  SelectItemText,
  SelectItemIndicator,
  SelectPortal,
  SelectViewport,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  NumberFieldRoot,
  NumberFieldInput,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from 'radix-vue';
import { Icon } from '@iconify/vue';
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from 'radix-vue';
import { computed, ref } from 'vue';
import { useProviderStore } from '@/stores/providerStore';
import { providerConfigs } from '@/config/providerConfigs';

const defaultConfig: AppConfig = {
  language: 'zh-CN',
  fontSize: 14,
  providerSettings: {},
};
const config = reactive<AppConfig>({ ...defaultConfig });
const { t } = useI18n();
const activeTab = ref<'general' | 'models'>('general');
const providerStore = useProviderStore();
const providers = computed(() => providerStore.providers);
const providerForms = reactive<Record<string, ProviderConfigItem[]>>({});
const getProviderKey = (p: { name: string }) =>
  p.name?.toLowerCase?.() || p.name;

const initializeProviderForms = async () => {
  await providerStore.fetchProviders();
  providers.value.forEach((p) => {
    const key = getProviderKey(p);
    const baseItems = (providerConfigs[key] || []).map((it) => ({ ...it }));
    const saved =
      (config.providerSettings && config.providerSettings[key]) || {};
    baseItems.forEach((it) => {
      if (saved && Object.prototype.hasOwnProperty.call(saved, it.key)) {
        it.value = saved[it.key];
      }
    });
    providerForms[key] = baseItems;
  });
};

const toPlain = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

let ready = false;
onMounted(async () => {
  const loaded = await window.electronApi.getConfig();
  Object.assign(config, loaded || defaultConfig);
  ready = true;
});

watch(
  () => activeTab.value,
  async (tab) => {
    if (tab === 'models') {
      await initializeProviderForms();
    }
  },
  { immediate: true }
);

watch(
  () => ({ ...config }),
  async (val) => {
    if (!ready) return;
    await window.electronApi.setConfig(toPlain(val));
    await setLocale(val.language);
  },
  { deep: true }
);

const onProviderFieldBlur = async (
  providerKey: string,
  item: ProviderConfigItem
) => {
  const settings = config.providerSettings || {};
  const current = { ...(settings[providerKey] || {}) } as Record<string, any>;
  current[item.key] = item.value;
  config.providerSettings = { ...settings, [providerKey]: current };
  await window.electronApi.setConfig(toPlain(config));
};
</script>

<style scoped></style>
