<script lang="ts" setup>
import { computed, ref } from 'vue';
import { validate, required, length } from '../validation';
import { useUsers } from '../stores/users';
import { NewUser } from '../users';
import FormInput from '../components/FormInput.vue';
import { useModal } from '../composables/modal';

const username = ref('');
const usernameStatus = computed(() => {
  return validate(username.value, [required, length({ min: 3, max: 10 })]);
});

const password = ref('');
const passwordStatus = computed(() => {
  return validate(password.value, [required, length({ min: 10, max: 30 })]);
});

const isInvalid = computed(() => {
  return !usernameStatus.value.valid || !passwordStatus.value.valid;
});

const usersStore = useUsers();
const modal = useModal();

async function handleSubmit() {
  if (isInvalid.value) return;

  const newUser: NewUser = {
    username: username.value,
    password: password.value,
  };

  console.log('newUser', newUser);
  try {
    await usersStore.createUser(newUser);
  } catch (error) {
    console.log('error', error);
  }

  modal.hideModal();
}
</script>

<template>
  <form class="form" @submit.prevent="handleSubmit">
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

    <button class="button" :disabled="isInvalid">Submit</button>
  </form>
</template>

<style scoped>
.form {
  background: white;
  margin-top: 50px;
  padding: 30px;
}
</style>
