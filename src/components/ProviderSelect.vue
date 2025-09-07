<template>
  <div class="provider-select w-full">
    <SelectRoot v-model="currentModel">
      <SelectTrigger
        class="flex w-full items-center justify-between rounded-md py-1.5 px-3 shadow-sm border border-gray-300 outline-none data-[placeholder]:text-gray-400"
      >
        <SelectValue placeholder="Select a model" />
        <Icon icon="radix-icons:chevron-down" class="w-5 h-5" />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent class="bg-white rounded-md shadow-md z-[100] border">
          <SelectViewport class="p-2">
            <div v-for="provider in providers" :key="provider.id">
              <SelectLabel class="flex items-center px-6 h-7 text-gray-500">
                <img
                  :src="provider.avatar"
                  :alt="provider.name"
                  class="w-5 h-5 rounded"
                />
                <span class="ml-2">{{ provider.name }}</span>
              </SelectLabel>
              <SelectGroup>
                <SelectItem
                  v-for="(model, index) in provider.models"
                  :key="index"
                  :value="`${provider.id}/${model}`"
                  class="outline-none relative rounded flex items-center px-6 h-7 text-green-700 cursor-pointer data-[highlighted]:bg-green-700 data-[highlighted]:text-white"
                >
                  <SelectItemIndicator class="absolute left-2 w-6">
                    <Icon icon="radix-icons:check" class="w-4 h-4 mr-4" />
                  </SelectItemIndicator>
                  <SelectItemText>{{ model }}</SelectItemText>
                </SelectItem>
              </SelectGroup>
              <SelectSeparator class="h-[1px] my-2 bg-gray-300" />
            </div>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </div>
</template>

<script setup lang="ts">
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'radix-vue';

import type { ProviderProps } from '@/types';
import { Icon } from '@iconify/vue';
defineProps<{
  providers: ProviderProps[] | undefined;
}>();

const currentModel = defineModel<string>();
</script>
