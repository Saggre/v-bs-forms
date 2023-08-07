import { mount, VueWrapper } from '@vue/test-utils';
import Form from '@/components/Form.vue';
import { useInertiaForm } from '@/composables/inertiaForm';
import { router } from '@inertiajs/vue3';
import { MockedFunction } from 'vitest';
import { FormDataDefinition } from '@/use/fields/base';

interface FormData extends FormDataDefinition {
  email: string;
  password: string;
}

describe('InertiaJS form', () => {
  let wrapper: VueWrapper;
  let form;

  beforeAll(() => {
    // @ts-ignore
    router.visit = vi.fn() as MockedFunction<any>;

    form = useInertiaForm<FormData>(
      'http://localhost',
      { method: 'post' },
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

    wrapper = mount(Form, {
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
      // @ts-ignore
      expect(router.visit.called).toEqual(true);

      // @ts-ignore
      const [url, options] = router.visit.calls[0];
      expect(url).toEqual('http://localhost');
      expect(options).toContain({
        method: 'post',
      });
    });
  });
});
