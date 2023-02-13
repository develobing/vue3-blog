<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import debounce from 'lodash/debounce';
import { marked } from 'marked';
import highlightjs from 'highlight.js';
import { Post, TimelinePost } from '../posts';
import { usePosts } from '../stores/posts';
import { useUsers } from '../stores/users';

const props = defineProps<{ post: TimelinePost | Post }>();

const emit = defineEmits<{
  (event: 'submit', post: Post): void;
}>();

const title = ref(props.post.title);
const content = ref(props.post.markdown);
const html = ref('');
const contentEditable = ref<HTMLDivElement>();

const posts = usePosts();
const usersStore = useUsers();
const router = useRouter();

const parseHtml = (markdown: string) => {
  marked.parse(
    markdown,
    {
      gfm: true,
      breaks: true,
      highlight: (code, lang) => {
        return highlightjs.highlightAuto(code).value;
        // if (lang && highlightjs.getLanguage(lang)) {
        //   return highlightjs.highlight(code, { language: lang }).value;
        // }

        // return highlightjs.highlightAuto(code).value;
      },
    },
    (err, parseResult) => {
      html.value = parseResult;
    }
  );
};

watch(
  content,
  debounce((newContent) => {
    parseHtml(newContent);
  }, 250),
  {
    immediate: true,
  }
);

onMounted(() => {
  if (!contentEditable.value) {
    throw new Error('contentEditable DOM node was not found');
  }

  contentEditable.value.innerText = content.value;
});

const handleInput = () => {
  if (!contentEditable.value) {
    throw new Error('contentEditable DOM node was not found');
  }

  content.value = contentEditable.value.innerText;
};

const handleClick = async () => {
  if (!usersStore.currentUserId) {
    throw new Error('User is not logged in');
  }

  const newPost: Post = {
    ...props.post,
    created:
      typeof props.post.created === 'string'
        ? props.post.created
        : props.post.created.toISO(),
    title: title.value,
    markdown: content.value,
    html: html.value,
    authorId: usersStore.currentUserId,
  };

  emit('submit', newPost);
};
</script>

<template>
  <div class="columns">
    <div class="column">
      <div class="field">
        <div class="label">Post Title</div>
        <input type="text" class="input" v-model="title" />
      </div>
    </div>
  </div>

  <div class="columns">
    <div class="column">
      <div contenteditable ref="contentEditable" @input="handleInput" />
    </div>

    <div class="column">
      <div v-html="html"></div>
    </div>
  </div>

  <div class="columns">
    <div class="column">
      <button class="button is-primary is-pulled-right" @click="handleClick">
        Save Post
      </button>
    </div>
  </div>
</template>
