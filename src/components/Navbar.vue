<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { useModal } from '../composables/modal';
import { useUsers } from '../stores/users';

const modal = useModal();
const usersStore = useUsers();
const route = useRoute();
const router = useRouter();

const logout = async () => {
  await usersStore.logout();
  router.push({ path: '/' });
};
</script>

<template>
  <div class="navbar">
    <div class="navbar-end">
      <div class="buttons" v-if="usersStore.currentUserId">
        <RouterLink
          to="/posts/new"
          class="button"
          v-if="route.name !== 'newPost'"
        >
          New Post
        </RouterLink>

        <RouterLink to="/" class="button" v-else>Home</RouterLink>

        <button class="button" @click="logout()">Log Out</button>
      </div>

      <div class="buttons" v-else>
        <button class="button" @click="modal.showModal('signUp')">
          Sign Up
        </button>
        <button class="button" @click="modal.showModal('signIn')">
          Sign In
        </button>
      </div>
    </div>
  </div>

  <Teleport to="#modal">
    <component :is="modal.component.value" />
  </Teleport>
</template>
