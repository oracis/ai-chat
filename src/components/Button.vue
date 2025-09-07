<template>
  <button
    class="button shadow-sm inline-flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none"
    :class="[colorClasses, sizeClasses]"
    :disabled="disabled || loading"
  >
    <Icon v-if="iconWithLoading" :icon="iconWithLoading" class="mr-2" />
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import type { ButtonColor, ButtonProps } from '@/types';
import { Icon } from '@iconify/vue';
import { computed } from 'vue';
const {
  color = 'green',
  size,
  plain,
  disabled,
  loading,
  iconName,
} = defineProps<ButtonProps>();
const colorVariants: Record<ButtonColor, any> = {
  green: {
    normal:
      'bg-green-700 text-white hover:bg-green-700/90 border border-green-700',
    plain:
      'bg-green-50 text-green-700 hover:bg-green-700 border border-green-700 hover:text-white',
  },
  purple: {
    normal:
      'bg-purple-700 text-white hover:bg-purple-700/90 border border-purple-700',
    plain:
      'bg-purple-50 text-purple-700 hover:bg-purple-700 border border-purple-700 hover:text-white',
  },
};
const colorClasses = computed(() => {
  if (plain) {
    return colorVariants[color].plain;
  } else {
    return colorVariants[color].normal;
  }
});
const sizeClasses = computed(() => {
  if (!size) {
    return 'h-[32px] py-[8px] px-[15px] text-sm rounded-[4px]';
  } else {
    if (size === 'small') {
      return 'h-[24px] py-[11px] px-[5px] text-xs rounded-[3px]';
    } else if (size === 'large') {
      return 'h-[40px] py-[12px] px-[20px] text-base rounded-[4px]';
    }
  }
});

const iconWithLoading = computed(() => {
  if (loading) {
    return 'line-md:loading-loop';
  } else {
    return iconName;
  }
});
</script>
