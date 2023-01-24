import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import NewPost from './views/NewPost.vue';

export const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },

    {
      path: '/posts/new',
      name: 'newPost',
      component: NewPost,
    },
  ],
});
