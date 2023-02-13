<script lang="ts" setup>
import PostWriter from '../components/PostWriter.vue';
import { useRoute, useRouter } from 'vue-router';
import { Post } from '../posts';
import { usePosts } from '../stores/posts';
import { useUsers } from '../stores/users';

const route = useRoute();
const router = useRouter();
const postsStore = usePosts();

const id = route.params.id as string;
const post = postsStore.all.get(id);

if (!post) {
  throw Error(`Post with id ${id} was not found`);
}

const handleSubmit = async (newPost: Post) => {
  console.log('New Post', post);

  await postsStore.updatePost(newPost);
  router.push('/');
};
</script>

<template>
  <div>
    Edit Post

    <PostWriter :post="post" @submit="handleSubmit" />
  </div>
</template>
