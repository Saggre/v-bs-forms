import { VueWrapper, mount } from '@vue/test-utils';
import StandardField from '@/components/fields/Standard.vue';
import { DOMWrapper } from '@vue/test-utils/dist/domWrapper';

describe('Text field', () => {
  let wrapper: VueWrapper;
  let field: Omit<DOMWrapper<HTMLInputElement>, 'exists'>;
  let element: HTMLInputElement;

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
        modelValue: 'initialText',
      },
    });

    field = wrapper.get<HTMLInputElement>('input[type="text"]');
    element = field.element;
  });

  describe('Input', () => {
    it('Field exists', async () => {
      expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    });

    it('Field is displayed correctly', async () => {
      expect(wrapper.find('label').text()).toBe('Field title');
      expect(wrapper.find('.form-floating').exists()).toBe(true);

      await wrapper.setProps({
        field: {
          type: 'text',
          title: 'Field title',
          floating: false,
        },
      });

      expect(wrapper.find('.form-floating').exists()).toBe(false);
    });

    it('Field has initial data', async () => {
      expect(element.value).toBe('initialText');
    });

    it('Field can be edited', async () => {
      await field.setValue('modifiedText');
      expect(field.element.value).toBe('modifiedText');
      expect(wrapper.emitted()).toHaveProperty('update:modelValue');
      const event = wrapper.emitted('update:modelValue');
      expect(event).toHaveLength(1);
      // @ts-ignore
      expect(event[0]).toEqual(['modifiedText']);
    });
  });
});
