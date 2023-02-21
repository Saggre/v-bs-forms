import {
  FormDataDefinition,
  ValidationError,
  ValidationResult,
} from '@/use/fields/base';
import { FormField } from '@/use/fields';
import {
  InertiaForm,
  useForm as _useInertiaForm,
} from '@inertiajs/inertia-vue3';

export interface FormAccessors<T extends FormDataDefinition> {
  data: T;
  errors: Partial<Record<keyof T, ValidationError>>;
}

export interface FormCallbacks<T extends FormDataDefinition> {
  onSubmit: (form: FormDefinition<T>) => Promise<void>;
  onCancel?: (form: FormDefinition<T>) => void;
  onError?: (
    errors: Partial<Record<keyof T, ValidationError>>,
    form: FormDefinition<T>,
  ) => void;
}

export type FormInputFields<T extends FormDataDefinition> = {
  [key in keyof T]: FormField;
};

export type FormDefinition<T extends FormDataDefinition> = {
  title?: string;
  description?: string;
  fields: FormInputFields<T>;
  accessors: FormAccessors<T>;
  callbacks: FormCallbacks<T>;
};

function validateFields<T extends FormDataDefinition>(
  form: FormDefinition<T>,
): Record<keyof T, ValidationResult> {
  const results = {} as Record<keyof T, ValidationResult>;

  for (const key in form.fields) {
    const field: FormField = form.fields[key];

    if (field.validate) {
      const value = form.accessors.data[key];
      const validate = field.validate as (value: any) => ValidationResult;
      results[key] = validate(value);
    }
  }

  return results;
}

/**
 * Returns default accessors for a form.
 */
const getDefaultAccessors = <T extends FormDataDefinition>(): FormAccessors<T> => ({
  data: {} as T,
  errors: {} as Record<keyof T, ValidationError>,
});

/**
 * Creates a form object with default values.
 *
 * @param formDefinition
 */
const createForm = <T extends FormDataDefinition>(formDefinition: Partial<FormDefinition<T>>) => {
  return {
    title: formDefinition.title ?? undefined,
    description: formDefinition.description ?? undefined,
    fields: formDefinition.fields ?? ({} as FormInputFields<T>),
    accessors: formDefinition.accessors ?? getDefaultAccessors<T>(),
    callbacks: formDefinition.callbacks ?? {
      onSubmit: async () => {
        return;
      },
    },
  };
};

export function useForm<T extends FormDataDefinition>(
  formDefinition: Partial<FormDefinition<T>>,
): FormDefinition<T> {
  const form = createForm<T>(formDefinition);
  const onSubmit = form.callbacks.onSubmit;

  form.callbacks.onSubmit = async form => {
    let hasErrors = false;
    const validationResults = validateFields(form);

    form.accessors.errors = {};

    for (const key in validationResults) {
      const validationResult = validationResults[key];

      if (validationResult.valid) {
        continue;
      }

      hasErrors = true;
      form.accessors.errors[key] = validationResult as ValidationError;
    }

    if (hasErrors) {
      form.callbacks.onError?.(form.accessors.errors, form);
    } else {
      await onSubmit(form);
    }
  };

  return form;
}

type ErrorMessages<T> = Record<keyof T, string>;

const mapValidationErrorsToMessages = <T>(
  errors: Partial<Record<keyof T, ValidationError>>,
): ErrorMessages<T> => {
  const messages: ErrorMessages<T> = {} as ErrorMessages<T>;

  for (const key in errors) {
    // eslint-disable-next-line no-prototype-builtins
    if (errors.hasOwnProperty(key)) {
      const error = errors[key];

      if (error) {
        messages[key] = error.message;
      }
    }
  }

  return messages;
};

export function useInertiaForm<T extends FormDataDefinition>(
  data: T,
  formDefinition: Partial<FormDefinition<T>>,
): [FormDefinition<T>, InertiaForm<T>] {
  const form = useForm<T>(formDefinition);
  const inertiaForm = _useInertiaForm(data);

  form.accessors.data = inertiaForm;
  form.accessors.errors = {};

  const onError = form.callbacks.onError;

  form.callbacks.onError = errors => {
    inertiaForm.errors = mapValidationErrorsToMessages(errors);
    onError?.(errors, form);
  };

  return [form, inertiaForm];
}
