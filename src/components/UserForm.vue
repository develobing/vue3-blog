<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { validate, required, length } from '../validation';
import { NewUser } from '../users';
import FormInput from '../components/FormInput.vue';

defineProps<{
  title?: string;
  error?: string;
}>();

const emit = defineEmits<{
  (event: 'submit', payload: NewUser): void;
}>();

const username = ref('');
const usernameTouched = ref(false);
const usernameStatus = computed(() => {
  return validate(
    username.value,
    [required, length({ min: 3, max: 10 })],
    usernameTouched.value
  );
});
watch(username, () => {
  usernameTouched.value = true;
});

const password = ref('');
const passwordTouched = ref(false);
const passwordStatus = computed(() => {
  return validate(
    password.value,
    [required, length({ min: 10, max: 30 })],
    passwordTouched.value
  );
});
watch(password, () => {
  passwordTouched.value = true;
});

const isInvalid = computed(() => {
  return !usernameStatus.value.valid || !passwordStatus.value.valid;
});

async function handleSubmit() {
  if (isInvalid.value) return;

  const newUser: NewUser = {
    username: username.value,
    password: password.value,
  };

  try {
    emit('submit', newUser);
  } catch (error) {
    console.log('error', error);
  }
}
</script>

<template>
  <form class="form" @submit.prevent="handleSubmit">
    <h2 v-if="title">{{ title }}</h2>

    <FormInput
      type="text"
      name="Username"
      v-model="username"
      :status="usernameStatus"
    />
    <FormInput
      type="password"
      name="Password"
      v-model="password"
      :status="passwordStatus"
    />

    <div class="is-danger help" v-if="error">{{ error }}</div>

    <button class="button" :disabled="isInvalid">Submit</button>
  </form>
</template>

<style scoped>
.form {
  background: white;
  margin-top: 50px;
  padding: 15px 30px 30px 30px;
}

.form h2 {
  color: black;
}
</style>
