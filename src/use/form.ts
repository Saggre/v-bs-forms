import { InertiaForm } from '@inertiajs/inertia-vue3';
import { ValidationResult } from '@/use/fields/base';
import { FormField } from '@/use/fields';

export type Form<T extends FormData> = {
  title: string;
  description: string;
  form: InertiaForm<T>;
  fields: { [key in keyof T]: FormField };
  onSubmit: (data: Form<T>) => Promise<void>;
};

/**
 * TODO: Cleanup types.
 * @param form
 */
function validateFields<T extends FormData>(
  form: Form<T>,
): Record<keyof T, ValidationResult> {
  if (!form.fields) {
    return {} as Record<keyof T, ValidationResult>;
  }

  const results: Record<keyof T, ValidationResult> = {} as Record<
    keyof T,
    ValidationResult
  >;

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, field] of Object.entries(form.fields)) {
    if (!field.validate) {
      continue;
    }

    const value = form.form.data()[key];
    results[key as keyof T] = field.validate(value);
  }

  return results;
}

export function useAppForm<T extends FormData>(form: Form<T>): Form<T> {
  const { onSubmit } = form;

  form.onSubmit = async () => {
    const validationResults = validateFields(form);
    let hasErrors = false;

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, validationResult] of Object.entries(validationResults)) {
      if (validationResult.valid) {
        continue;
      }

      hasErrors = true;
      form.form.errors[key as keyof T] = validationResult.message;
    }

    if (!hasErrors) {
      await onSubmit(form);
    }
  };

  return form;
}
