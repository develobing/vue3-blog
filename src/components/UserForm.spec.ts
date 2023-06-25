import { mount } from '@vue/test-utils';
import { Pinia, createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Router, createMemoryHistory, createRouter } from 'vue-router';
import { routes } from '../router';
import UserForm from './UserForm.vue';

vi.stubGlobal('fetch', vi.fn());

describe('UserForm', () => {
  let pinia: Pinia;
  let router: Router;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    router = createRouter({
      history: createMemoryHistory(),
      routes,
    });
  });

  it('run through the workflow', async () => {
    const wrapper = mount(UserForm, {
      global: {
        plugins: [pinia, router],
      },
    });

    expect(wrapper.find('[data-testid="username"] .is-danger').exists()).toBe(
      false
    );
    expect(wrapper.find('[data-testid="password"] .is-danger').exists()).toBe(
      false
    );

    // Filling out the form
    await wrapper.find('#Username').setValue('aa');
    await wrapper.find('#Password').setValue('password');
    // await wrapper.find('form').trigger('submit.prevent');

    const btn = wrapper.find('button');
    // expect(btn.element.text()).toBe('Submit');
    expect(btn.element.disabled).toBe(true);

    expect(
      wrapper.find('[data-testid="username"]').find('.is-danger').text()
    ).toBe('This field must be between 3 and 10 characters');
    expect(
      wrapper.find('[data-testid="password"]').find('.is-danger').text()
    ).toBe('This field must be between 10 and 30 characters');

    // Filling out the form
    await wrapper.find('#Username').setValue('username');
    await wrapper.find('#Password').setValue('password123');

    expect(
      wrapper.find('[data-testid="username"]').find('.is-danger').exists()
    ).toBe(false);
    expect(
      wrapper.find('[data-testid="password"]').find('.is-danger').exists()
    ).toBe(false);

    expect(btn.element.disabled).toBe(false);

    await wrapper.find('form').trigger('submit.prevent');

    expect((wrapper.emitted().submit[0] as any)[0]).toEqual({
      username: 'username',
      password: 'password123',
    });
  });
});
