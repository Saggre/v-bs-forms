import { FormDataDefinition } from '@/use/fields/base';
import {
  FormAccessors,
  FormCallbacks,
  FormDefinition,
  onSubmitValidation,
  PartialFormDefinition,
  resetFormErrors,
} from '@/use/form';

/**
 * Returns default accessors for a form.
 */
const getDefaultAccessors = <
  T extends FormDataDefinition,
>(): FormAccessors<T> => ({
  data: {},
  errors: {},
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
 * Creates a form object with default values from a partial form object.
 *
 * @param formDefinition
 */
export const createForm = <T extends FormDataDefinition>(
  formDefinition: PartialFormDefinition<T>,
): FormDefinition<T> => {
  const { data, errors } = getDefaultAccessors<T>();

  const form = {
    fields: formDefinition.fields ?? {},
    accessors: {}, // This is just an alias.
    callbacks: {
      ...getDefaultCallbacks<T>(),
      ...(formDefinition.callbacks ?? {}),
    },
    data: {
      ...data,
      ...(formDefinition.accessors?.data ?? {}),
      ...(formDefinition.data ?? {}),
    },
    errors: {
      ...errors,
      ...(formDefinition.accessors?.errors ?? {}),
      ...(formDefinition.errors ?? {}),
    },
  } as FormDefinition<T>;

  Object.defineProperty(form.accessors, 'data', {
    enumerable: true,
    configurable: true,
    get() {
      return form.data;
    },
    set(value) {
      form.data = value;
    },
  });

  Object.defineProperty(form.accessors, 'errors', {
    enumerable: true,
    configurable: true,
    get() {
      return form.errors;
    },
    set(value) {
      form.errors = value;
    },
  });

  return form;
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

    const validationErrors = onSubmitValidation(form);

    if (Object.keys(validationErrors).length > 0) {
      form.errors = {
        ...form.errors,
        ...validationErrors,
      };

      form.callbacks.onError?.(form.errors, form);

      throw {
        message: 'Validation errors',
        errors: form.errors,
      };
    }

    await onSubmit(form);
  };

  return form;
};
