import { FormDataDefinition, ValidationResult } from '@/use/fields/base';
import { FormField } from '@/use/fields';
import { Errors, VisitOptions } from '@inertiajs/core/types/types';
import { Router, router } from '@inertiajs/core';

export const enum FormErrorType {
  Required = 1,
}

export interface FormAccessors<T extends FormDataDefinition> {
  data: T;
  errors: Partial<Record<keyof T, string | FormErrorType>>;
}

export interface FormCallbacks<T extends FormDataDefinition> {
  onSubmit: (form: FormDefinition<T>) => Promise<void>;
  onCancel?: (form: FormDefinition<T>) => void;
  onError?: (
    errors: Partial<Record<keyof T, string | FormErrorType>>,
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

export type PartialFormDefinition<T extends FormDataDefinition> = Partial<
  FormDefinition<T>
> & {
  accessors: Partial<FormAccessors<T>>;
};

export interface FormButtons<T> {
  next: T;
  previous: T;
}

export interface FormTranslations {
  buttons?: FormButtons<string>;
  errors?: {
    [key in FormErrorType]: string;
  };
}

export interface FormVisibility {
  buttons: FormButtons<boolean>;
  sidebar: boolean;
}

export interface FormClasses {
  card: string;
}

let inertiaRouter: Router;

export const setInertiaRouter = (router: Router) => {
  inertiaRouter = router;
};

export const getInertiaRouter = (): Router => inertiaRouter ?? router;

function validateFields<T extends FormDataDefinition>(
  form: FormDefinition<T>,
): Record<keyof T, ValidationResult> {
  const results = {} as Record<keyof T, ValidationResult>;

  for (const key in form.fields) {
    const field: FormField = form.fields[key];

    if (field.validate) {
      const value = form?.accessors?.data?.[key];
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
  errors: {} as Record<keyof T, string>,
});

/**
 * Creates a form object with default values.
 *
 * @param formDefinition
 */
const createForm = <T extends FormDataDefinition>(
  formDefinition: PartialFormDefinition<T>,
) => {
  return {
    title: formDefinition.title ?? undefined,
    description: formDefinition.description ?? undefined,
    fields: formDefinition.fields ?? ({} as FormInputFields<T>),
    accessors: {
      ...getDefaultAccessors<T>(),
      ...(formDefinition.accessors ?? {}),
    },
    callbacks: formDefinition.callbacks ?? {
      onSubmit: async () => {
        return;
      },
    },
  };
};

const checkLocalErrors = <T extends FormDataDefinition>(
  form: FormDefinition<T>,
): void => {
  const errors = {} as Partial<Record<keyof T, FormErrorType>>;

  for (const key in form.fields) {
    const field = form.fields[key];

    if ('required' in field && field.required && !form?.accessors?.data[key]) {
      errors[key] = FormErrorType.Required;
    }
  }

  if (Object.keys(errors).length > 0) {
    throw errors;
  }
};

export const useForm = <T extends FormDataDefinition>(
  formDefinition: PartialFormDefinition<T>,
): FormDefinition<T> => {
  const form = createForm<T>(formDefinition);
  const onSubmit = form.callbacks.onSubmit;

  form.callbacks.onSubmit = async form => {
    let hasErrors = false;
    const validationResults = validateFields(form);

    form.accessors.errors = {};

    try {
      checkLocalErrors(form);
    } catch (errors) {
      form.accessors.errors = errors as Partial<Record<keyof T, FormErrorType>>;
      form.callbacks.onError?.(form.accessors.errors, form);

      return;
    }

    for (const key in validationResults) {
      const validationResult = validationResults[key];

      if (validationResult.valid) {
        continue;
      }

      hasErrors = true;
      form.accessors.errors[key] = validationResult.message;
    }

    if (hasErrors) {
      form.callbacks.onError?.(form.accessors.errors, form);
    } else {
      try {
        await onSubmit(form);
      } catch (e) {
        form.callbacks.onError?.({}, form);
      }
    }
  };

  return form;
};

/**
 * Submit an Inertia form and mirror response data to the actual form.
 *
 * @param form
 * @param url
 * @param visitOptions
 */
const submitInertiaForm = async <T extends FormDataDefinition>(
  form: FormDefinition<T>,
  url: string | URL,
  visitOptions: VisitOptions,
) => {
  await new Promise<void>((resolve, reject) => {
    getInertiaRouter().visit(url, {
      data: form.accessors.data,
      preserveState: true,
      ...visitOptions,
      onError: (errors: Errors) => {
        form.accessors.errors = errors as Partial<Record<keyof T, string>>;
        visitOptions?.onError?.(errors);
        reject(errors);
      },
      onSuccess: (page: any) => {
        form.accessors.errors = {};
        visitOptions?.onSuccess?.(page);
        resolve();
      },
      onFinish: (visit: any) => {
        visitOptions?.onFinish?.(visit);
        resolve();
      },
    });
  });
};

export const useInertiaForm = <T extends FormDataDefinition>(
  url: string | URL,
  visitOptions: VisitOptions,
  formDefinition: PartialFormDefinition<T>,
): FormDefinition<T> => {
  const form = useForm<T>(formDefinition);
  const onSubmit = form.callbacks.onSubmit;

  form.callbacks.onSubmit = async () => {
    debugger;
    try {
      await onSubmit(form);
    } catch (e) {
      return;
    }

    try {
      await submitInertiaForm(form, url, visitOptions);
    } catch (errors) {
      form.accessors.errors = errors as Partial<Record<keyof T, string>>;
      form.callbacks.onError?.(form.accessors.errors, form);
    }
  };

  return form;
};
