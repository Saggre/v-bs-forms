import { VueWrapper, mount } from '@vue/test-utils';
import BaseForm from '@/components/BaseForm.vue';
import { useInertiaForm } from '@/use/form';
import { InertiaForm } from '@inertiajs/inertia-vue3';

describe('InertiaJS form', () => {
  let wrapper: VueWrapper;
  let form;
  let inertiaForm: InertiaForm<{
    email: string;
    password: string;
  }>;

  beforeAll(() => {
    [form, inertiaForm] = useInertiaForm(
      {
        email: '',
        password: '',
      },
      {
        fields: {
          email: {
            type: 'email',
            title: 'Email',
          },
          password: {
            type: 'password',
            title: 'Password',
          },
        },
      },
    );

    wrapper = mount(BaseForm, {
      props: {
        form,
      },
    });
  });

  describe('Submit InertiaJS form', async () => {
    beforeAll(async () => {
      await wrapper
        .get<HTMLInputElement>('input[type="email"]')
        .setValue('foo@bar.com');
      await wrapper
        .get<HTMLInputElement>('input[type="password"]')
        .setValue('secret');
      await wrapper.find('form').trigger('submit');
    });

    it('Field values are relayed on submit', async () => {
      expect(inertiaForm.email).toEqual('foo@bar.com');
      expect(inertiaForm.password).toEqual('secret');
    });
  });

  describe('Submit InertiaJS form with errors', async () => {
    const error = {
      valid: false,
      message: 'Error message',
    };

    beforeAll(async () => {
      wrapper.props().form.fields.password.validate = () => error;
      await wrapper.find('form').trigger('submit');
    });

    it('Field errors are relayed on submit', async () => {
      expect(inertiaForm.errors.password).toEqual(error.message);
    });
  });
});
