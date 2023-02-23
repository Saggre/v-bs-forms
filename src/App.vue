<template>
  <div class="container py-5">
    <AppForm :form="loginForm">
      <template #title>
        <h1>Title override</h1>
      </template>
    </AppForm>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppForm from '@/components/Form.vue';
import {
  FormDefinition,
  FormCallbacks,
  FormInputFields,
  useForm,
} from '@/use/form';
import {
  FormDataDefinition,
  ValidationResult,
  ValidationSuccess,
} from '@/use/fields/base';
import moment, { Moment } from 'moment/moment';

interface LoginFormData extends FormDataDefinition {
  email: string;
  password: string;
  action: boolean;
}

type LoginForm = FormDefinition<LoginFormData>;

const data = {
  email: '',
  password: '',
  action: false,
  number: 1337,
  role: 'foo',
  'list-group': 'bar',
};

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
    id: 'password-id',
    autocomplete: 'password',
    autofocus: true,
    disabled: false,
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
  image: {
    type: 'file',
    title: 'Profile image',
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
    required: true,
  },
  checkbox: {
    type: 'checkbox',
    title: 'Checkbox',
    validate: (value: boolean): ValidationResult => {
      if (!value) {
        return {
          message: 'Checkbox must be checked',
          valid: false,
        };
      }

      return {
        valid: true,
      };
    },
  },
  'list-group': {
    type: 'list-group',
    title: 'List group',
    subtitle: 'Subtitle',
    description: 'Description',
    header: 'Header',
    footer: 'Footer',
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
    subtitle: 'Subtitle',
    description: 'Description',
    header: 'Header',
    footer: 'Footer',
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
  'valid-action': {
    type: 'action',
    title: 'Valid action',
    subtitle: 'An action that is always valid',
    header: 'Valid action',
    onSubmit: () => {
      return;
    },
    texts: {
      submit: 'Submit',
      success: 'Success',
      description: 'Description',
    },
    validate: () => {
      return {
        valid: true,
      };
    },
  },
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
  onRender: (form: LoginForm) => {
    console.log('Render', form.accessors.data);
  },
  onCancel: (form: LoginForm) => {
    console.log('Cancel', form.accessors.data);
  },
  onError: errors => {
    console.log('Validation error', errors);
  },
};

export const useLoginForm = () =>
  useForm<LoginFormData>({
    title: 'Login',
    description: 'Login to your account',
    fields,
    accessors: {
      data,
      errors: {},
    },
    callbacks,
  });

export default defineComponent({
  components: {
    AppForm,
  },
  setup() {
    return {
      loginForm: useLoginForm(),
    };
  },
});
</script>
