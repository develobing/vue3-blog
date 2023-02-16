import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { computed, defineComponent, ref } from 'vue';
import FormInput from './FormInput.vue';

describe('FormInput', () => {
  it('tests validations', async () => {
    const Parent = defineComponent({
      components: { FormInput },
      template: `
        <FormInput
          name="foo"
          type="input"
          :status="status"
          v-model="formValue"
        />
      `,

      setup() {
        const formValue = ref('foo');
        const status = computed(() => {
          if (formValue.value.length > 5) {
            return {
              valid: true,
            };
          } else {
            return {
              valid: false,
              message: 'error',
            };
          }
        });

        return {
          formValue,
          status,
        };
      },
    });

    const wrapper = mount(Parent);
    expect(wrapper.find('.is-danger').text()).toBe('error');
    await wrapper.find('input').setValue('foobar');

    expect(wrapper.find('.is-danger').exists()).toBe(false);
  });

  it('renders some errors', () => {
    const wrapper = mount(FormInput, {
      props: {
        name: 'foo',
        modelValue: 'bar',
        status: { valid: false, message: 'error' },
        type: 'input',
      },
    });

    expect(wrapper.find('.is-danger').exists()).toBe(true);
  });

  it('renders no errors', () => {
    const wrapper = mount(FormInput, {
      props: {
        name: 'foo',
        modelValue: 'bar',
        status: { valid: true, message: 'error' },
        type: 'input',
      },
    });

    expect(wrapper.find('.is-danger').exists()).toBe(false);
  });
});
