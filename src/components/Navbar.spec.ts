import { mount } from '@vue/test-utils';
import { Pinia, createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMemoryHistory, createRouter, Router } from 'vue-router';
import Navbar from './Navbar.vue';
import { routes } from '../router';
import { useUsers } from '../stores/users';

vi.stubGlobal('fetch', vi.fn());

describe('Navbar', () => {
  let pinia: Pinia;
  let router: Router;

  beforeEach(() => {
    const el = document.createElement('div');
    el.id = 'modal';
    document.body.appendChild(el);

    pinia = createPinia();
    setActivePinia(pinia);
    router = createRouter({
      history: createMemoryHistory(),
      routes,
    });
  });

  it('renders signin and signup buttons when not authenticated', async () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [pinia, router],
      },
    });

    expect(wrapper.find('#sign-up').exists()).toBe(true);
    expect(wrapper.find('[data-testid="sign-in"]').exists()).toBe(true);
    // console.log('wrapper', wrapper.html());
  });

  it('renders new post and logout when authenticated', async () => {
    const users = useUsers();
    users.currentUserId = '1';

    const wrapper = mount(Navbar, {
      global: {
        plugins: [pinia, router],
      },
    });

    expect(wrapper.find('a').text()).toBe('New Post');
    expect(wrapper.find('button').text()).toBe('Log Out');
    await wrapper.find('#logout').trigger('click');

    expect(wrapper.find('#sign-up').exists()).toBe(true);
    expect(wrapper.find('[data-testid="sign-in"]').exists()).toBe(true);
    await wrapper.find('[data-testid="sign-in"]').trigger('click');

    expect(document.body.querySelector('#signin-form')).toBeTruthy();

    console.log('wrapper()', wrapper.html());
    console.log('document.body', document.body.outerHTML);
  });
});
