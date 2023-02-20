import { VueWrapper, mount } from '@vue/test-utils';
import BaseForm from '@/components/BaseForm.vue';
import { Form, useForm } from '@/use/form';
import { MockedFunction } from 'vitest';

describe('Form', () => {
  let wrapper: VueWrapper;
  let callbacks: Record<string, MockedFunction<any>>;

  beforeAll(() => {
    callbacks = {
      onSubmit: vi.fn(),
      onCancel: vi.fn(),
      onError: vi.fn(),
    };
    wrapper = mount(BaseForm, {
      props: {
        form: useForm({
          fields: {
            foo: {
              type: 'text',
              title: 'Foo',
              floating: true,
            },
          },
          callbacks: {
            ...callbacks,
            onSubmit: async form => await callbacks.onSubmit(form),
          },
        }),
      },
    });
  });

  describe('Submit', async () => {
    let propForm: Form<any>;

    beforeAll(async () => {
      propForm = wrapper.props().form;
      const field = wrapper.get<HTMLInputElement>('input[type="text"]');
      await field.setValue('Field value');
      await wrapper.find('form').trigger('submit');
    });

    it('Field value is relayed on submit', async () => {
      expect(propForm.accessors.data.foo).toEqual('Field value');
    });

    it('Submit event is triggered on submit', async () => {
      expect(wrapper.emitted()).toHaveProperty('submit');
      const event = wrapper.emitted('submit');
      expect(event).toHaveLength(1);
      // @ts-ignore
      const [form, htmlForm] = event[0];
      expect(form).toEqual(propForm);
      expect(htmlForm).toEqual(wrapper.find('form').element);
    });

    it('Form callbacks are called correctly on submit', async () => {
      expect(callbacks.onCancel.called).toBe(false);
      expect(callbacks.onError.called).toBe(false);
      expect(callbacks.onSubmit.called).toBe(true);
      expect(callbacks.onSubmit.calls[0][0]).toEqual(propForm);
    });
  });

  describe('Submit with errors', async () => {
    let propForm: Form<any>;

    beforeAll(async () => {
      callbacks.onSubmit.mockReset();
      callbacks.onCancel.mockReset();
      callbacks.onError.mockReset();
      propForm = wrapper.props().form;
      propForm.fields.foo.validate = () => ({
        valid: false,
        message: 'Error message',
      });
    });

    it('Form callbacks are called correctly on submit', async () => {
      await wrapper.find('form').element.requestSubmit();

      expect(callbacks.onCancel.called).toBe(false);
      expect(callbacks.onSubmit.called).toBe(false);
      expect(callbacks.onError.called).toBe(true);
    });
  });
});
