<script setup lang="ts">
import { Post, TimelinePost } from '../posts';

defineProps<{ post: TimelinePost }>();

// ({
//   post: {
//     type: Object,
//     required: true,
//   },
// });
</script>

<template>
  <a
    class="panel-block is-flex is-flex-direction-column is-align-items-flex-start"
  >
    <a>{{ post.title }}</a>
    <div>{{ post.created.toFormat('d MMM') }}</div>
  </a>
</template>
