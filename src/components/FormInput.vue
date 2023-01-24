<script lang="ts" setup>
import { Status } from '../validation';

defineProps<{
  type: string;
  name: string;
  modelValue: string;
  status: Status;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const handleInput = ($event: Event) => {
  const value = ($event.target as HTMLInputElement).value;
  emit('update:modelValue', value);
};
</script>

<template>
  <div class="field">
    <label :for="name" class="label">{{ name }}</label>
    <div class="control">
      <input
        class="input"
        :type="type"
        :id="name"
        :value="modelValue"
        @input="handleInput"
      />
    </div>

    <p class="is-danger help" v-if="!status.valid">{{ status.message }}</p>
  </div>
</template>
