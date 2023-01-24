import { DateTime } from 'luxon';
import { defineStore } from 'pinia';
import { fetchApi } from '../api';
import { Period } from '../constants';
import { Post, today, thisWeek, thisMonth, TimelinePost } from '../posts';

interface PostsState {
  ids: string[];
  all: Map<string, Post>;
  selectedPeriod: Period;
}

function delay() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

export const usePosts = defineStore('posts', {
  state: (): PostsState => ({
    ids: [],
    all: new Map(),
    selectedPeriod: 'Today',
  }),

  actions: {
    setSelectedPeriod(period: Period) {
      this.selectedPeriod = period;
    },

    async fetchPosts() {
      const response = await fetchApi('/api/posts');
      const posts = response.data;
      await delay();

      let ids: string[] = [];
      let all = new Map<string, Post>();
      for (const post of posts) {
        ids.push(post.id);
        all.set(post.id, post);
      }

      this.ids = ids;
      this.all = all;
    },

    createPost(post: TimelinePost) {
      return fetchApi('/api/posts', {
        method: 'POST',
        data: { ...post, created: post.created.toISO() },
      });
    },
  },

  getters: {
    filteredPosts: (state): TimelinePost[] => {
      return state.ids
        .map((id) => {
          const post = state.all.get(id);
          if (!post) throw new Error(`Post not found with id ${id}`);

          return {
            ...post,
            created: DateTime.fromISO(post.created),
          };
        })
        .filter((post) => {
          if (state.selectedPeriod === 'Today') {
            return post.created >= DateTime.now().minus({ day: 1 });
          } else if (state.selectedPeriod === 'This Week') {
            return post.created >= DateTime.now().minus({ week: 1 });
          } else if (state.selectedPeriod === 'This Month') {
            return post.created >= DateTime.now().minus({ month: 1 });
          }

          return post;
        });
    },
  },
});
