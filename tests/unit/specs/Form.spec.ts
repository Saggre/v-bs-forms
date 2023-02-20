import { VueWrapper, mount } from '@vue/test-utils';
import Form from '@/components/Form.vue';
import { FormAccessors, FormCallbacks, useForm } from '@/use/form';

describe('Form', () => {
  const data = {
    foo: 'bar',
  };
  const errors = {};
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(Form, {
      props: {
        form: useForm({
          title: 'Test form',
          description: 'Test description',
          fields: {
            foo: {
              type: 'text',
              title: 'Foo',
              floating: true,
            },
          },
          accessors: {
            data,
            errors,
          },
          callbacks: {
            onSubmit: async form => {
              console.log('Submit');
            },
            onCancel: form => {
              console.log('Cancel');
            },
            onValidationError: form => {
              console.log('Validation error');
            },
          },
        }),
      },
    });
  });

  describe('Props', () => {
    it(':initial-page test', async () => {
      expect(true).toBe(true);
    });
  });

  describe('Input', () => {
    it('Field exists', async () => {
      expect(wrapper.find('form').exists()).toBe(true);
    });

    it('Field has initial data', async () => {
      const field = wrapper.get<HTMLInputElement>('input[type="text"]');
      expect(field.element.value).toBe('bar');
    });

    it('Field can be edited', async () => {
      const field = wrapper.get<HTMLInputElement>('input[type="text"]');
      await field.setValue('baz');
      expect(field.element.value).toBe('baz');
      expect(field.element.emitted()).toHaveProperty('submit');
    });

    it('Field value is relayed on submit', async () => {
      const field = wrapper.get<HTMLInputElement>('input[type="text"]');
      await field.setValue('qux');
      await wrapper.find('button[type="submit"]').trigger('click');

      // assert some action has been performed, like an emitted event.
      //expect(wrapper.emitted()).toHaveProperty('submit');

      //wrapper.get("[data-test=\"new-todo\"]").setValue("New todo");
      //wrapper.get("[data-test=\"form\"]").trigger("submit");

      //const incrementEvent = wrapper.emitted('increment')

      // We have "clicked" twice, so the array of `increment` should
      // have two values.
      //expect(incrementEvent).toHaveLength(2)
    });
  });

  describe('Submit', () => {
    it(':initial-page renders at given page', async () => {});
  });
});
