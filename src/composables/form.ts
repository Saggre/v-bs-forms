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
  return {
    fields: formDefinition.fields ?? {},
    accessors: {
      ...getDefaultAccessors<T>(),
      ...(formDefinition.accessors ?? {}),
    },
    callbacks: {
      ...getDefaultCallbacks<T>(),
      ...(formDefinition.callbacks ?? {}),
    },
  } as FormDefinition<T>;
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
      form.accessors.errors = {
        ...form.accessors.errors,
        ...validationErrors,
      };

      form.callbacks.onError?.(form.accessors.errors, form);

      throw {
        message: 'Validation errors',
        errors: form.accessors.errors,
      };
    }

    await onSubmit(form);
  };

  return form;
};
