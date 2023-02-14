<template>
  <div class="container py-5">
    <FormComponent :form="loginForm"></FormComponent>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FormComponent from '@/components/Form.vue';
import { Form, FormAccessors, FormInputFields, useForm } from '@/use/form';
import { _FormData } from '@/use/fields/base';

interface LoginFormData extends _FormData {
  email: string;
  password: string;
}

type LoginForm = Form<LoginFormData>;

const fields: FormInputFields<LoginFormData> = {
  email: {
    type: 'text',
    title: 'Email',
    placeholder: 'Email',
    floating: true,
  },
  password: {
    type: 'password',
    title: 'Password',
    placeholder: 'Password',
    floating: true,
  },
};

const accessors: FormAccessors<LoginFormData> = {
  data: () => ({
    email: '',
    password: '',
  }),
  errors: () => ({}),
};

export const useLoginForm = (onSubmit: (form: LoginForm) => Promise<void>) =>
  useForm<LoginFormData>({
    fields,
    accessors,
    onSubmit,
  });

export default defineComponent({
  components: {
    FormComponent,
  },
  props: {
    canResetPassword: Boolean,
    status: String,
  },
  setup() {
    return {
      loginForm: useLoginForm(async (form: LoginForm) => {
        await new Promise<void>((resolve, reject) => {
          /*form.form
            .transform(data => ({
              ...data,
              remember: appForm.form.remember ? 'on' : '',
            }))
            .post(route('login'), {
              preserveScroll: true,
              onFinish: () => {
                appForm.form.reset('password');
              },
              onSuccess: () => resolve(),
              onError: () => reject(),
            });*/
        });
      }),
    };
  },
});
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
