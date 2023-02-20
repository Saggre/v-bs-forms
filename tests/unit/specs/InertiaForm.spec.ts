import { VueWrapper, mount } from '@vue/test-utils';
import BaseForm from '@/components/BaseForm.vue';
import { useForm } from '@/use/form';
import {
  InertiaForm,
  useForm as useInertiaForm,
} from '@inertiajs/inertia-vue3';

describe('InertiaJS form', () => {
  let wrapper: VueWrapper;
  let inertiaForm: InertiaForm<{
    email: string;
    password: string;
  }>;
  const data = {
    email: '',
    password: '',
  };

  beforeAll(() => {
    inertiaForm = useInertiaForm(data);
    wrapper = mount(BaseForm, {
      props: {
        form: useForm({
          title: 'Inertia form',
          description: 'Inertia form description',
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
          accessors: {
            data,
            errors: inertiaForm.errors,
          },
          callbacks: {
            onSubmit: async () => {
              return;
            },
          },
        }),
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
      expect(data.email).toEqual('foo@bar.com');
      expect(data.password).toEqual('secret');
    });
  });

  describe('Submit InertiaJS form with errors', async () => {
    const error = {
      valid: false,
      message: 'Error message',
    };

    beforeAll(async () => {
      wrapper.props().form.fields.password.validate = () => error;
    });

    it('Field errors are relayed on submit', async () => {
      expect(inertiaForm.errors.password).toEqual(error);
    });
  });
});
