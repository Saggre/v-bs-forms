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
import { _FormData, ValidationSuccess } from '@/use/fields/base';
import moment, { Moment } from 'moment/moment';

interface LoginFormData extends _FormData {
  email: string;
  password: string;
  action: boolean;
}

type LoginForm = Form<LoginFormData>;

const data = {
  email: '',
  password: '',
  action: false,
  number: 1337,
  role: 'foo',
  textarea: 'Text',
  'list-group': 'bar',
};
const errors = {};

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
  role: {
    type: 'dropdown',
    title: 'Role',
    floating: true,
    options: {
      foo: 'foo',
      bar: 'bar',
      baz: 'baz',
    },
  },
  number: {
    type: 'number',
    title: 'Number',
    floating: true,
  },
  datetime: {
    type: 'datetime',
    title: 'Datetime',
    floating: true,
    deserialize: (value: string) => moment(value),
    serialize: (value: Moment) => value.toISOString(),
  },
  textarea: {
    type: 'textarea',
    title: 'Textarea',
    floating: true,
    rows: 5,
  },
  'list-group': {
    type: 'list-group',
    title: 'List group',
    floating: true,
    options: {
      foo: {
        name: 'Foo',
        description: 'Foo description',
      },
      bar: {
        name: 'Bar',
        description: 'Bar description',
      },
      baz: {
        name: 'Baz',
        description: 'Baz description',
      },
    },
  },
  action: {
    type: 'action',
    title: 'Action',
    floating: true,
    onSubmit: () => {
      console.log('Action submitted');
      data.action = true;
    },
    validate: () => {
      if (data.action) {
        return {
          valid: true,
        } as ValidationSuccess;
      }

      return {
        message: 'Action must be completed',
        valid: false,
      };
    },
    texts: {
      submit: 'Submit',
      success: 'Success',
      description: 'Description',
    },
  },
};

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
    console.log('Cancel', form.accessors.data);
  },
  onError: (form: LoginForm) => {
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
