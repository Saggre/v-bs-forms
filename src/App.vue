<template>
  <div class="container py-5">
    <AppForm :form="loginForm" class="foobar">
      <div class="w-100">
        <div class="mb-3 form-floating">
          <input
            class="form-control"
            id="extra"
            autocomplete="off"
            name="extra"
            type="text"
            placeholder="Extra field"
          />
          <label class="" for="Email"><span>Extra field</span></label>
        </div>
      </div>
      <button type="submit" class="btn btn-primary w-100">Send</button>
    </AppForm>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppForm from '@/components/Form.vue';
import {
  FormAccessorErrors,
  FormCallbacks,
  FormDefinition,
  FormInputFields,
} from '@/use/form';
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
  email: '',
  password: '',
  password2: '',
  action: false,
  number: 1337,
  number2: 0,
  role: 'foo',
  'list-group': 'bar',
};

const fields: FormInputFields<LoginFormData> = {
  email: {
    type: 'text',
    title: 'Email',
    floating: true,
    tooltip: {
      title: 'Tooltip title',
      placement: 'top',
    },
  },
  password: {
    type: 'password',
    title: 'Password',
    floating: true,
    id: 'password-id',
    autocomplete: 'password',
    autofocus: true,
    disabled: false,
    toggleable: {
      icons: {
        show: '🙈',
        hide: '🙉',
      },
    },
    validate: (value: string): ValidationResult => {
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
  password2: {
    type: 'password',
    title: 'Password',
    floating: true,
    validate: (value: string): ValidationResult => {
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
      foo: 'Foo',
      bar: 'Bar',
      baz: 'Baz',
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
  date: {
    type: 'date',
    title: 'Date',
    floating: true,
    onChange: (value: string, form: LoginForm | undefined) =>
      console.log(`Selected: ${value}`, form),
  },
  time: {
    type: 'time',
    title: 'Time',
    floating: true,
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
    validate: (): ValidationResult => {
      return {
        valid: true,
      };
    },
  },
  number1: {
    type: 'number',
    title: 'Number 1',
    floating: true,
    onInput: (value: number, form: LoginForm | undefined) => {
      console.log(`Selected: ${value}`, form);

      if (form) {
        form.accessors.data['number2'] = value * 2;
      }
    },
  },
  number2: {
    type: 'number',
    title: 'Number 2',
    floating: true,
    onInput: (value: number, form: LoginForm | undefined) =>
      console.log(`Selected: ${value}`, form),
  },
  numberStep: {
    type: 'number',
    title: 'Number stepped',
    floating: true,
    step: 0.1,
    min: 10,
    max: 20,
    onInput: (value: number, form: LoginForm | undefined) =>
      console.log(`Selected: ${value}`, form),
    visible: (form: LoginForm | undefined) => {
      if (form) {
        return (form.accessors.data.number1 ?? 0) > 10;
      }

      return false;
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
  onRender: form => {
    console.log('Render', form.accessors.data);
  },
  onCancel: form => {
    console.log('Cancel', form.accessors.data);
  },
  onError: errors => {
    console.log('Validation error', errors);
  },
  onValidate: (errors, form) => {
    return {
      ...errors,
      image: {
        valid: false,
        message: 'Custom error',
      },
    };
  },
};

export const useLoginForm = () =>
  useInertiaForm<LoginFormData>(
    '',
    {},
    {
      fields,
      accessors: {
        data,
        errors: {},
      },
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
