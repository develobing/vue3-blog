<script lang="ts" setup>
import { DateTime } from 'luxon';
import { useRouter } from 'vue-router';
import PostWriter from '../components/PostWriter.vue';
import { Post, TimelinePost } from '../posts';
import { usePosts } from '../stores/posts';
import { useUsers } from '../stores/users';

const router = useRouter();
const postsStore = usePosts();
const usersStore = useUsers();

if (!usersStore.currentUserId) {
  throw new Error('User is not logged in');
}

const post: TimelinePost = {
  id: '-1',
  title: 'New Post',
  created: DateTime.now(),
  markdown: '## Title',
  html: '<h2>Title</h2>',
  authorId: usersStore.currentUserId,
};

const handleSubmit = async (newPost: Post) => {
  console.log('New Post', post);

  await postsStore.createPost(newPost);
  router.push('/');
};
</script>

<template>
  <div>
    New Post

    <PostWriter :post="post" @submit="handleSubmit" />
  </div>
</template>
