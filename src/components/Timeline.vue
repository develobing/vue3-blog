<script setup lang="ts">
import { usePosts } from '../stores/posts';
import { periods } from '../constants';
import TimelineItem from './TimelineItem.vue';

const postsStore = usePosts();
await postsStore.fetchPosts();
</script>

<template>
  <nav class="is-primary panel">
    {{ postsStore.selectedPeriod }}
    <span class="panel-tabs">
      <a
        v-for="period in periods"
        :key="period"
        class="panel-tab"
        :class="{ 'is-active': period === postsStore.selectedPeriod }"
        @click="postsStore.setSelectedPeriod(period)"
      >
        {{ period }}
      </a>
    </span>

    <TimelineItem
      v-for="post of postsStore.filteredPosts"
      :key="post.id"
      :post="post"
    />
  </nav>
</template>

<style></style>
