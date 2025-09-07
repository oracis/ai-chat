import { defineStore } from 'pinia';
import type { ProviderProps } from '@/types';
import { db } from '@/db';

export interface ProviderStore {
  providers: ProviderProps[];
}

export const useProviderStore = defineStore('provider', {
  state: (): ProviderStore => ({
    providers: [],
  }),
  actions: {
    async fetchProviders() {
      const items = await db.providers.toArray();
      this.providers = items;
    },
  },
});
