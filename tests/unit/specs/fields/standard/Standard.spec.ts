import { VueWrapper, mount } from '@vue/test-utils';
import StandardField from '@/components/fields/Standard.vue';
import { createForm } from '@/composables/form';

describe('Standard field wrapper', () => {
  let wrapper: VueWrapper;

  const form = createForm({
    fields: {
      field: {
        type: 'text',
        title: 'Field title',
      },
    },
  });

  beforeEach(() => {
    // @ts-ignore
    wrapper = mount(StandardField, {
      props: {
        field: form.fields.field,
        form,
        formKey: 'field',
        modelValue: 'initialText',
      },
    });
  });

  describe('Standard input', () => {
    it('Field exists', async () => {
      expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    });

    it('Field is displayed correctly', async () => {
      expect(wrapper.find('label').text()).toBe('Field title');
      expect(wrapper.find('.form-floating').exists()).toBe(false);
    });
  });

  describe('Validation error visibility', () => {
    it('No error is visible when the field is valid', async () => {
      expect(wrapper.find('.invalid-feedback').isVisible()).toBe(false);
    });

    /*it('An error text is visible when the field is invalid', async () => {
      await wrapper.setProps({
        field: form.fields.field,
        form: {
          ...form,
          accessors: {
            errors: {
              field: {
                valid: false,
                message: 'This field is invalid',
              },
            },
          },
        },
        formKey: 'field',
      });

      expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
      expect(wrapper.find('.invalid-feedback').text()).toBe(
        'This field is invalid',
      );
      expect(wrapper.find('input').classes()).toContain('is-invalid');
    });*/
  });
});
