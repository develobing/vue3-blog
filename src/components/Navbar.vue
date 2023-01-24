<script lang="ts" setup>
import { useModal } from '../composables/modal';
import SignUpForm from './SignUpForm.vue';

const modal = useModal();
</script>

<template>
  <div class="navbar">
    <div class="navbar-end">
      <div class="buttons">
        <button class="button" @click="modal.showModal()">Sign Up</button>
        <RouterLink to="/posts/new" class="button">New Post</RouterLink>
      </div>
    </div>
  </div>

  <Teleport to="#modal">
    <SignUpForm />
  </Teleport>
</template>
