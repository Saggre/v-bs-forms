import { VueWrapper, mount } from '@vue/test-utils';
import BaseForm from '@/components/BaseForm.vue';
import { Form, useForm } from '@/use/form';
import { MockedFunction } from 'vitest';

describe('Form', () => {
  let data;
  let errors;
  let wrapper: VueWrapper;
  let callbacks: Record<string, MockedFunction<any>>;

  beforeAll(() => {
    data = {
      foo: 'bar',
    };
    errors = {};
    callbacks = {
      onSubmit: vi.fn(),
      onCancel: vi.fn(),
      onValidationError: vi.fn(),
    };
    wrapper = mount(BaseForm, {
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
      expect(callbacks.onValidationError.called).toBe(false);
      expect(callbacks.onSubmit.called).toBe(true);
      expect(callbacks.onSubmit.calls[0][0]).toEqual(propForm);
    });
  });

  describe('Submit with errors', async () => {
    let propForm: Form<any>;

    beforeAll(async () => {
      callbacks.onSubmit.mockReset();
      callbacks.onCancel.mockReset();
      callbacks.onValidationError.mockReset();
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
      expect(callbacks.onValidationError.called).toBe(true);
    });
  });
});
