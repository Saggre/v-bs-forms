<template>
  <div class="container py-5">
    <FormComponent :form="loginForm"></FormComponent>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FormComponent from '@/components/Form.vue';
import {
  Form,
  FormAccessors,
  FormCallbacks,
  FormInputFields,
  useForm,
} from '@/use/form';
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
    floating: true,
  },
  password: {
    type: 'password',
    title: 'Password',
    floating: true,
    validate: (value: string) => {
      if (value.length < 8) {
        return {
          message: 'Password must be at least 8 characters',
          valid: false,
        };
      }

      return {
        valid: true,
      };
    },
  },
};

const data = {
  email: '',
  password: '',
};
const errors = {};

const accessors: FormAccessors<LoginFormData> = {
  data,
  errors,
};

const callbacks: FormCallbacks<LoginFormData> = {
  onSubmit: async (form: LoginForm) => {
    console.log('Submit', form.accessors.data);
    await new Promise<void>(resolve => {
      setTimeout(() => {
        console.log('Resolve submit');
        resolve();
      }, 1000);
    });
  },
  onCancel: (form: LoginForm) => {
    console.log('Cancel');
  },
  onValidationError: (form: LoginForm) => {
    console.log('Validation error', form.accessors.errors);
  },
};

export const useLoginForm = () =>
  useForm<LoginFormData>({
    title: 'Login',
    description: 'Login to your account',
    fields,
    accessors,
    callbacks,
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
      loginForm: useLoginForm(),
    };
  },
});
</script>
