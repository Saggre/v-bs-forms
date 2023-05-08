import {
  FormDataDefinition,
  ValidationError,
  ValidationResult,
} from '@/use/fields/base';
import { FormField } from '@/use/fields';
import { Errors, VisitOptions } from '@inertiajs/core/types/types';
import { Router, router } from '@inertiajs/core';

export const enum FormErrorType {
  Required = 1,
}

export type FormAccessorData<T extends FormDataDefinition> = Partial<
  Record<keyof T, T[keyof T] | undefined>
>;

export type FormAccessorErrors<T extends FormDataDefinition> = Partial<
  Record<keyof T, string | FormErrorType>
>;

export interface FormAccessors<T extends FormDataDefinition> {
  data: FormAccessorData<T>;
  errors: FormAccessorErrors<T>;
}

export interface FormCallbacks<T extends FormDataDefinition> {
  onSubmit: (form: FormDefinition<T>) => Promise<void>;
  onRender?: (form: FormDefinition<T>) => void;
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

export type PartialFormDefinition<T extends FormDataDefinition> = Partial<{
  title?: string;
  description?: string;
  fields: FormInputFields<T>;
  accessors: Partial<FormAccessors<T>>;
  callbacks: Partial<FormCallbacks<T>>;
}>;

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

/**
 * Validates fields marked as required.
 *
 * @param form
 */
const getRequiredFieldErrors = <T extends FormDataDefinition>(
  form: FormDefinition<T>,
): Partial<Record<keyof T, ValidationError>> => {
  const errors = {} as Partial<Record<keyof T, ValidationError>>;

  for (const key in form.fields) {
    const field = form.fields[key];

    if ('required' in field && field.required && !form?.accessors?.data[key]) {
      errors[key] = {
        valid: false,
        message: FormErrorType.Required,
      };
    }
  }

  return errors;
};

/**
 * Validates all fields in a form with a provided validation function.
 *
 * @param form
 */
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

  return {
    ...results,
    ...getRequiredFieldErrors(form),
  };
}

/**
 * Returns default accessors for a form.
 */
const getDefaultAccessors = <
  T extends FormDataDefinition,
>(): FormAccessors<T> => ({
  data: {} as FormAccessorData<T>,
  errors: {} as Record<keyof T, string>,
});

/**
 * Returns default callbacks for a form.
 */
const getDefaultCallbacks = <
  T extends FormDataDefinition,
>(): FormCallbacks<T> => ({
  onSubmit: async () => {
    return;
  },
  onRender: async () => {
    return;
  },
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
    callbacks: {
      ...getDefaultCallbacks<T>(),
      ...(formDefinition.callbacks ?? {}),
    },
  };
};

export const resetFormErrors = <T extends FormDataDefinition>(
  form: FormDefinition<T>,
) => {
  form.accessors.errors = {} as Partial<Record<keyof T, string>>;
};

const getValidationErrors = (
  validationResults: Partial<Record<string, ValidationResult>>,
): Partial<Record<string, ValidationError>> => {
  return Object.fromEntries(
    Object.entries(validationResults).filter(
      ([, validationResult]) => !validationResult?.valid,
    ),
  ) as Partial<Record<string, ValidationError>>;
};

const getErrorMessages = (
  validationErrors: Partial<Record<string, ValidationError>>,
): Partial<Record<string, string | FormErrorType>> => {
  const errors: Partial<Record<string, string | FormErrorType>> = {};

  for (const key in validationErrors) {
    const validationError = validationErrors[key];
    errors[key] = validationError?.message ?? '';
  }

  return errors;
};

/**
 * Validates a form and throws an error if there are any validation errors.
 *
 * @param form
 */
export const onSubmitValidation = async <T extends FormDataDefinition>(
  form: FormDefinition<T>,
) => {
  const validationResults = validateFields(form);
  const validationErrors = getValidationErrors(validationResults);
  const errorMessages = getErrorMessages(validationErrors);

  if (Object.keys(validationErrors).length > 0) {
    throw errorMessages;
  }
};

/**
 * Helper function for adding validation and error handling to a form.
 *
 * @param formDefinition
 */
export const useForm = <T extends FormDataDefinition>(
  formDefinition: PartialFormDefinition<T>,
): FormDefinition<T> => {
  const form = createForm<T>(formDefinition);
  const onSubmit = form.callbacks.onSubmit;

  form.callbacks.onSubmit = async form => {
    resetFormErrors(form);

    try {
      await onSubmitValidation(form);
      await onSubmit(form);
    } catch (errors) {
      form.accessors.errors = errors as Partial<Record<keyof T, string>>;
      form.callbacks.onError?.(form.accessors.errors, form);
    }
  };

  return form;
};

type _VisitOptions<T extends FormDataDefinition> = VisitOptions & {
  submitTransform?: (data: FormAccessorData<T>) => FormAccessorData<T>;
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
  visitOptions: _VisitOptions<T>,
) => {
  await new Promise<void>((resolve, reject) => {
    getInertiaRouter().visit(url, {
      data:
        visitOptions.submitTransform?.(form.accessors.data) ??
        form.accessors.data,
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

/**
 * Helper function for creating a form that submits with Inertia.
 *
 * @param url
 * @param visitOptions
 * @param formDefinition
 */
export const useInertiaForm = <T extends FormDataDefinition>(
  url: (string | URL) | ((form: FormDefinition<T>) => string | URL),
  visitOptions: _VisitOptions<T>,
  formDefinition: PartialFormDefinition<T>,
): FormDefinition<T> => {
  const form = useForm<T>(formDefinition);
  const onSubmit = form.callbacks.onSubmit;

  form.callbacks.onSubmit = async () => {
    try {
      await onSubmit(form);
    } catch (e) {
      return;
    }

    try {
      await submitInertiaForm(
        form,
        url instanceof Function ? url(form) : url,
        visitOptions,
      );
    } catch (errors) {
      form.accessors.errors = errors as Partial<Record<keyof T, string>>;
      form.callbacks.onError?.(form.accessors.errors, form);
    }
  };

  return form;
};
