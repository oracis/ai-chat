<template>
  <div
    class="message-input w-full shadow-sm border rounded-lg border-gray-300 py-1 px-2 focus-within:border-green-700"
  >
    <div v-if="imagePreview" class="mb-2 relative flex items-center">
      <img
        :src="imagePreview"
        :alt="t('input.preview')"
        class="size-24 rounded object-cover"
      />
    </div>
    <div class="flex items-center">
      <input
        type="file"
        accept="image/*"
        ref="fileInput"
        class="hidden"
        @change="handleImageUpload"
      />
      <Icon
        icon="radix-icons:image"
        size="24"
        @click="triggerFileInput"
        :class="[
          'mr-2',
          disabled
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-400 cursor-pointer hover:text-gray-600',
        ]"
      />
      <input
        type="text"
        v-model="model"
        :disabled="disabled"
        :placeholder="t('input.placeholder')"
        class="outline-none border-0 flex-1 bg-white focus:ring-0"
      />
      <Button
        @click="onCreate"
        :disabled="disabled"
        iconName="radix-icons:paper-plane"
        >{{ t('input.send') }}</Button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/Button.vue';
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const fileInput = ref<HTMLInputElement | null>(null);
const { t } = useI18n();

const props = defineProps<{
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'create', question: string, imagePath?: string): void;
}>();

const model = defineModel<string>();

const onCreate = () => {
  if (model.value) {
    emit(
      'create',
      model.value,
      selectedImage
        ? window.electronApi.getPathForFile(selectedImage as File)
        : undefined
    );
  }
  model.value = '';
  imagePreview.value = '';
  selectedImage = null;
};

const triggerFileInput = () => {
  if (props.disabled) {
    return;
  }
  fileInput.value?.click();
};
const imagePreview = ref<string>('');
let selectedImage: File | null = null;

const handleImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files?.length) {
    selectedImage = target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onload = () => {
      if (reader.result) {
        imagePreview.value = reader.result as string;
      }
    };
  }
};
</script>
