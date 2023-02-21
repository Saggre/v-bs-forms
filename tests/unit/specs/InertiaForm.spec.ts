import { VueWrapper, mount } from '@vue/test-utils';
import BaseForm from '@/components/BaseForm.vue';
import { useInertiaForm } from '@/use/form';
import { Inertia } from '@inertiajs/inertia';

describe('InertiaJS form', () => {
  let wrapper: VueWrapper;
  let form;

  beforeAll(() => {
    Inertia.visit = vi.fn();

    form = useInertiaForm(
      'http://localhost',
      {
        method: 'post',
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

    it('Inertia visit was called', async () => {
      expect(Inertia.visit.called).toEqual(true);

      const [url, options] = Inertia.visit.calls[0];
      expect(url).toEqual('http://localhost');
      expect(options).toContain({
        method: 'post',
      });
    });
  });
});
