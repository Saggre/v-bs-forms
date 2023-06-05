import { FormDataDefinition } from '@/use/fields/base';
import { FormInputFields } from '@/use/form';

/**
 * Get form data as JSON
 *
 * @param form
 */
export const getFormAsJson = (
  form: HTMLFormElement,
): { [key: string]: any } => {
  return Object.fromEntries(new FormData(form));
};

/**
 * Get an object containing a HTML form's fields that are not defined in the form definition.
 *
 * @param form
 * @param definedFields
 */
export const getFormExtraFields = <T extends FormDataDefinition>(
  form: HTMLFormElement,
  definedFields: FormInputFields<T>,
): { [key: string]: any } => {
  const formData = getFormAsJson(form);

  return Object.fromEntries(
    Object.entries(formData).filter(([key]) => !(key in definedFields)),
  );
};
