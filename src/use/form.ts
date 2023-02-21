import {
  FormDataDefinition,
  ValidationError,
  ValidationResult,
} from '@/use/fields/base';
import { FormField } from '@/use/fields';
import { Inertia } from '@inertiajs/inertia';

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
const getDefaultAccessors = <
  T extends FormDataDefinition,
>(): FormAccessors<T> => ({
  data: {} as T,
  errors: {} as Record<keyof T, ValidationError>,
});

/**
 * Creates a form object with default values.
 *
 * @param formDefinition
 */
const createForm = <T extends FormDataDefinition>(
  formDefinition: Partial<FormDefinition<T>>,
) => {
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

export const useForm = <T extends FormDataDefinition>(
  formDefinition: Partial<FormDefinition<T>>,
): FormDefinition<T> => {
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
};

/**
 * Submit an Inertia form and mirror response data to the actual form.
 *
 * @param form
 * @param url
 * @param inertiaOptions
 */
const submitInertiaForm = async <T extends FormDataDefinition>(
  form: FormDefinition<T>,
  [url, inertiaOptions]: Parameters<typeof Inertia.visit>,
) => {
  const onInertiaError = inertiaOptions?.onError;
  const onInertiaSuccess = inertiaOptions?.onSuccess;
  const onInertiaFinish = inertiaOptions?.onFinish;

  await new Promise<void>((resolve, reject) => {
    inertiaOptions = {
      ...inertiaOptions,
      onError: errors => {
        form.accessors.errors = errors;
        onInertiaError?.(errors);
        reject(errors);
      },
      onSuccess: page => {
        form.accessors.errors = {};
        onInertiaSuccess?.(page);
        resolve();
      },
      onFinish: () => {
        onInertiaFinish?.();
        resolve();
      },
    };

    Inertia.visit(url, inertiaOptions);
  });
};

type VisitOptions = Parameters<typeof Inertia.visit>;

export const useInertiaForm = <T extends FormDataDefinition>(
  url: VisitOptions[0],
  inertiaOptions: VisitOptions[1],
  formDefinition: Partial<FormDefinition<T>>,
): FormDefinition<T> => {
  const form = useForm<T>(formDefinition);
  const onSubmit = form.callbacks.onSubmit;

  form.callbacks.onSubmit = async form => {
    await submitInertiaForm(form, [url, inertiaOptions]);
    await onSubmit(form);
  };

  return form;
};
