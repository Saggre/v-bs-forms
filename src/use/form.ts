import {
  _FormData,
  ValidationError,
  ValidationResult,
} from '@/use/fields/base';
import { FormField } from '@/use/fields';

export interface FormAccessors<T extends _FormData> {
  data: T;
  errors: Record<keyof T, ValidationError> | {};
}

export interface FormCallbacks<T extends _FormData> {
  onSubmit: (form: Form<T>) => Promise<void>;
  onCancel?: (form: Form<T>) => void;
  onValidationError?: (form: Form<T>) => void;
}

export type FormInputFields<T extends _FormData> = {
  [key in keyof T]: FormField;
};

export type Form<T extends _FormData> = {
  title?: string;
  description?: string;
  fields: FormInputFields<T>;
  accessors: FormAccessors<T>;
  callbacks: FormCallbacks<T>;
};

function validateFields<T extends _FormData>(
  form: Form<T>,
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
const getDefaultAccessors = <T extends _FormData>(): FormAccessors<T> => ({
  data: {} as T,
  errors: {} as Record<keyof T, ValidationError>,
});

/**
 * Creates a form object with default values.
 *
 * @param formDefinition
 */
const createForm = <T extends _FormData>(formDefinition: Partial<Form<T>>) => {
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

export function useForm<T extends _FormData>(
  formDefinition: Partial<Form<T>>,
): Form<T> {
  const form = createForm<T>(formDefinition);
  const onSubmit = form.callbacks.onSubmit;

  form.callbacks.onSubmit = async () => {
    let hasErrors = false;
    const validationResults = validateFields(form);

    form.accessors.errors = {} as Record<keyof T, ValidationError>;

    for (const key in validationResults) {
      const validationResult = validationResults[key];

      if (validationResult.valid) {
        continue;
      }

      hasErrors = true;
      // @ts-ignore
      form.accessors.errors[key] = validationResult as ValidationError;
    }

    if (hasErrors) {
      form.callbacks.onValidationError?.(form);
    } else {
      await onSubmit(form);
    }
  };

  return form;
}
