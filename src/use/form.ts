import { _FormData, ValidationResult } from '@/use/fields/base';
import { FormField } from '@/use/fields';

export interface FormAccessors<T extends _FormData> {
  data: () => T;
  errors: () => Record<string, string>;
}

export type FormInputFields<T extends _FormData> = {
  [key in keyof T]: FormField;
};

export type Form<T extends _FormData> = {
  title?: string;
  description?: string;
  accessors: FormAccessors<T>;
  fields: FormInputFields<T>;
  onSubmit: (data: Form<T>) => Promise<void>;
};

function validateFields<T extends _FormData>(
  form: Form<T>,
): Record<keyof T, ValidationResult> {
  const results: Record<keyof T, ValidationResult> = {} as Record<
    keyof T,
    ValidationResult
  >;

  if (!form.fields) {
    return results;
  }

  for (const [key, field] of Object.entries(form.fields)) {
    if (!field.validate) {
      continue;
    }

    //const value = form.form.data()[key];
    //results[key as keyof T] = field.validate(value);
  }

  return results;
}

export function useForm<T extends _FormData>(form: Form<T>): Form<T> {
  const { onSubmit } = form;

  form.onSubmit = async () => {
    const validationResults = validateFields(form);
    let hasErrors = false;

    for (const [key, validationResult] of Object.entries(validationResults)) {
      if (validationResult.valid) {
        continue;
      }

      hasErrors = true;
      //form.form.errors[key as keyof T] = validationResult.message;
    }

    if (!hasErrors) {
      await onSubmit(form);
    }
  };

  return form;
}
