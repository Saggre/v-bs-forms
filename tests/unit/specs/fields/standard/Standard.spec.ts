import { VueWrapper, mount } from '@vue/test-utils';
import StandardField from '@/components/fields/Standard.vue';
import { DOMWrapper } from '@vue/test-utils/dist/domWrapper';

describe('Standard field wrapper', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(StandardField, {
      props: {
        field: {
          type: 'text',
          title: 'Field title',
          floating: true,
        },
        validation: {
          valid: true,
        },
        modelValue: '',
      },
    });
  });

  describe('Standard input', () => {
    it('Field exists', async () => {
      expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    });

    it('Field is displayed correctly', async () => {
      expect(wrapper.find('label').text()).toBe('Field title');
      expect(wrapper.find('.form-floating').exists()).toBe(true);

      await wrapper.setProps({
        field: {
          type: 'text',
          title: 'Modified field title',
          floating: false,
        },
      });

      expect(wrapper.find('label').text()).toBe('Modified field title');
      expect(wrapper.find('.form-floating').exists()).toBe(false);
    });
  });

  describe('Validation error visibility', () => {
    it('No error is visible when the field is valid', async () => {
      expect(wrapper.find('.invalid-feedback').isVisible()).toBe(false);
    });

    it('An error text is visible when the field is invalid', async () => {
      await wrapper.setProps({
        validation: {
          valid: false,
          message: 'This field is invalid',
        },
      });

      expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
      expect(wrapper.find('.invalid-feedback').text()).toBe(
        'This field is invalid',
      );
      expect(wrapper.find('input').classes()).toContain('is-invalid');
    });
  });
});
