<template>
  <div class="container bg-danger">
    <AppForm
      :form="loginForm"
      class="foobar"
      ref="form"
      :teleport-enabled="true"
    >
      <template #before-field="{ fieldKey }">
        <h1 v-if="fieldKey === 'password'">Password?</h1>
      </template>
      <div>
        <div class="w-100">
          <div class="mb-3">
            <label class="form-label text-white" for="Email"
              ><span>Extra field</span></label
            >
            <input
              class="form-control"
              id="extra"
              autocomplete="off"
              name="extra"
              type="text"
              placeholder="Extra field"
            />
          </div>
        </div>
        <button type="submit" class="btn btn-primary w-100 mb-3">Send</button>
      </div>
    </AppForm>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppForm from '@/components/Form.vue';
import { FormCallbacks, FormDefinition, FormInputFields } from '@/use/form';
import {
  FormDataDefinition,
  ValidationResult,
  ValidationSuccess,
} from '@/use/fields/base';
import { useInertiaForm } from '@/composables/inertiaForm';

interface LoginFormData extends FormDataDefinition {
  email: string;
  password: string;
  action: boolean;
  number1: number;
  number2: number;
  numberStep: number;
  date: Date;
  time: string;
  checkbox: boolean;
  extra: string;
  role: string;
}

type LoginForm = FormDefinition<LoginFormData>;

const data = {
  checkbox: false,
  email: '',
  password: '',
  password2: '',
  action: false,
  number: 1337,
  number2: 0,
  role: 'foo',
  'list-group': 'bar',
  'valid-action': true,
};

const fields: FormInputFields<LoginFormData> = {
  'login-group': {
    type: 'group',
    fields: {
      email: {
        type: 'text',
        title: 'Email',
        tooltip: {
          title: 'Tooltip title',
          placement: 'top',
        },
      },
      password: {
        type: 'password',
        title: 'Password',
        id: 'password-id',
        autocomplete: 'password',
        autofocus: true,
        disabled: false,
        columnClass: {
          'col-12': true,
          'col-md-6': true,
        },
        toggleable: {
          icons: {
            show: '🙈',
            hide: '🙉',
          },
        },
        validate: (value: string | undefined): ValidationResult => {
          if (value && value.length < 8) {
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
      password2: {
        type: 'password',
        title: 'Password',
        columnClass: {
          'col-12': true,
          'col-md-6': true,
        },
        toggleable: true,
        validate: (value: string | undefined): ValidationResult => {
          if (value && value.length < 8) {
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
    },
  },
  'other-group': {
    type: 'group',
    fields: {
      role: {
        type: 'dropdown',
        title: 'Role',
        options: {
          foo: 'Foo',
          bar: 'Bar',
          baz: 'Baz',
        },
      },
      number: {
        type: 'number',
        title: 'Number',
        required: true,
        wrapperClass: {
          'mb-0': true,
        },
      },
      image: {
        type: 'file',
        title: 'Profile image',
        required: true,
        attributes: {
          accept: 'image/*',
        },
      },
      date: {
        type: 'date',
        title: 'Date',
        attributes: {
          min: '2022-01-01',
        },
        onChange: (value: string, form: LoginForm | undefined) =>
          console.log(`Selected: ${value}`, form),
      },
      time: {
        type: 'time',
        title: 'Time',
      },
      textarea: {
        type: 'textarea',
        title: 'Textarea',
        rows: 5,
        maxlength: 140,
        required: true,
        validate: (value: string | undefined): ValidationResult => {
          if (value && value.length < 140) {
            return {
              message: 'Textarea must be at least 10 characters',
              valid: false,
            };
          }

          return {
            valid: true,
          };
        },
      },
      checkbox: {
        type: 'checkbox',
        title: 'Checkbox',
        required: true,
        validate: (value: boolean | undefined): ValidationResult => {
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
        required: true,
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
        validate: (): ValidationResult => {
          return {
            valid: true,
          };
        },
      },
      number1: {
        type: 'number',
        title: 'Number 1',
        onInput: (value: number, form: LoginForm | undefined) => {
          console.log(`Selected: ${value}`, form);

          if (form) {
            form.data['number2'] = value * 2;
          }
        },
      },
      number2: {
        type: 'number',
        title: 'Number 2',
        onInput: (value: number, form: LoginForm | undefined) =>
          console.log(`Selected: ${value}`, form),
      },
      numberStep: {
        type: 'number',
        title: 'Number stepped',
        attributes: {
          step: '0.1',
          min: '10',
          max: '20',
        },
        onInput: (value: number, form: LoginForm | undefined) =>
          console.log(`Selected: ${value}`, form),
        visible: (form: LoginForm | undefined) => {
          if (form) {
            return (form.data.number1 ?? 0) > 10;
          }

          return false;
        },
      },
    },
  },
};

const callbacks: FormCallbacks<LoginFormData> = {
  onSubmit: async (form: LoginForm) => {
    console.log('Submit', form.data);
    await new Promise<void>(resolve => {
      setTimeout(() => {
        console.log('Resolve submit');
        resolve();
      }, 1000);
    });
  },
  onRender: form => {
    console.log('Render', {
      ...form.data,
    });
  },
  onCancel: form => {
    console.log('Cancel', {
      ...form.data,
    });
  },
  onError: errors => {
    console.log('Validation error', {
      ...errors,
    });
  },
  onValidate: (errors, form) => {
    return {
      ...errors,
      /*image: {
        valid: false,
        message: 'Custom error',
      },*/
    };
  },
};

export const useLoginForm = () =>
  useInertiaForm<LoginFormData>(
    '',
    {},
    {
      fields,
      data,
      errors: {},
      callbacks,
    },
  );

export default defineComponent({
  components: {
    AppForm,
  },
  data() {
    return {
      loginForm: useLoginForm(),
    };
  },
});
</script>
