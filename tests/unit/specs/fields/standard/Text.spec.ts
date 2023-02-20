import { VueWrapper, mount } from '@vue/test-utils';
import StandardField from '@/components/fields/Standard.vue';
import { DOMWrapper } from '@vue/test-utils/dist/domWrapper';

describe('Text field', () => {
  let wrapper: VueWrapper;
  let field: Omit<DOMWrapper<HTMLInputElement>, 'exists'>;

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
  });

  describe('Input', () => {
    it('Field exists', async () => {
      expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    });

    it('Field has initial data', async () => {
      expect(field.element.value).toBe('initialText');
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
