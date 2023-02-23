import { VueWrapper, mount } from '@vue/test-utils';
import PluginFieldComponent from '../../../mock/PluginFieldComponent.vue';
import { formFieldPlugin } from '@/use/plugins';
import Form from '@/components/Form.vue';
import { useForm } from '@/use/form';

describe('Plugin field tests', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    formFieldPlugin.install({
      type: 'plugin-field',
      component: PluginFieldComponent,
    });

    wrapper = mount(Form, {
      props: {
        form: useForm({
          fields: {
            plugin: {
              type: 'plugin-field',
              title: 'Plugin field',
            },
          },
        }),
      },
    });
  });

  describe('Plugin field', () => {
    it('Field exists', async () => {
      expect(wrapper.find('#plugin-field').exists()).toBe(true);
    });

    it('Field is displayed correctly', async () => {
      expect(wrapper.find('#plugin-field').text()).toBe(
        'This is a plugin field',
      );
    });
  });
});
