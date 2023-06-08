import { FormDataDefinition } from '@/use/fields/base';
import {
  FormAccessorErrors,
  FormAccessors,
  FormCallbacks,
  FormDefinition,
  FormInputFields,
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
 * Creates a form object with default values.
 *
 * @param formDefinition
 */
const createForm = <T extends FormDataDefinition>(
  formDefinition: PartialFormDefinition<T>,
) => {
  return {
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
      form.accessors.errors = {
        ...form.accessors.errors,
        ...(errors as FormAccessorErrors<T>),
      };

      form.callbacks.onError?.(form.accessors.errors, form);

      throw errors;
    }
  };

  return form;
};
