import { FormDataDefinition, ValidationResult } from '@/use/fields/base';
import { FormField } from '@/use/fields';

export type FormAccessorData<T extends FormDataDefinition> = Partial<{
  [K in keyof T]: T[K];
}>;

export type FormAccessorErrors<T extends FormDataDefinition> = Partial<
  Record<keyof T, ValidationResult>
>;

export interface FormAccessors<T extends FormDataDefinition> {
  data: FormAccessorData<T>;
  errors: FormAccessorErrors<T>;
}

export interface FormCallbacks<T extends FormDataDefinition> {
  onSubmit: (form: FormDefinition<T>) => Promise<void>;
  /**
   * Called when the form is validated.
   * The function can return errors to prevent the form from being submitted and to display custom errors.
   */
  onValidate?: (
    errors: FormAccessorErrors<T>,
    form: FormDefinition<T>,
  ) => FormAccessorErrors<T>;
  onError?: (errors: FormAccessorErrors<T>, form: FormDefinition<T>) => void;
  onRender?: (form: FormDefinition<T>) => void;
  onCancel?: (form: FormDefinition<T>) => void;
}

export type FormInputFields<T extends FormDataDefinition> = Partial<{
  // TODO: Allow form field types based on defined value type.
  [K in keyof T]: FormField;
}>;

export type FormInputGroup<T extends FormDataDefinition> = {
  type: 'group';
  fields: FormInputFields<T>;
};

export type FormInputGroups<T extends FormDataDefinition> = {
  [key: string]: FormInputGroup<T>;
};

export type FormDefinition<T extends FormDataDefinition> = {
  fields: FormInputFields<T> & FormInputGroups<T>;
  accessors: FormAccessors<T>;
  callbacks: FormCallbacks<T>;
};

export type AbstractFormDefinition = FormDefinition<{ [key: string]: any }>;

export type PartialFormDefinition<T extends FormDataDefinition> = Partial<{
  fields: FormInputFields<T> & FormInputGroups<T>;
  accessors: Partial<FormAccessors<T>>;
  callbacks: Partial<FormCallbacks<T>>;
}>;

export function isFormField<T extends FormDataDefinition>(
  field: FormField | FormInputGroup<T>,
): field is FormField {
  return field.type !== 'group';
}

export function isFormFieldGroup<T extends FormDataDefinition>(
  field: FormField | FormInputGroup<T>,
): field is FormInputGroup<T> {
  return field.type === 'group';
}

function getFormFieldGroups<T extends FormDataDefinition>(
  form: FormDefinition<T>,
): FormInputGroups<T> {
  return Object.fromEntries(
    Object.entries(form.fields).filter(([, field]) => {
      return isFormFieldGroup(field);
    }),
  ) as FormInputGroups<T>;
}

/**
 * Get all form fields in a flat form, even if they are nested in a group.
 *
 * @param form
 */
function getFormFields<T extends FormDataDefinition>(
  form: FormDefinition<T>,
): FormInputFields<T> {
  let fields = {} as FormInputFields<T>;

  // Get all fields that are not in a group.
  fields = {
    ...fields,
    ...Object.fromEntries(
      Object.entries(form.fields).filter(([, field]) => isFormField<T>(field)),
    ),
  };

  // Get all fields from groups.
  Object.values(getFormFieldGroups<T>(form)).forEach(group => {
    fields = { ...fields, ...Object.values(group.fields) };
  });

  return fields;
}

/**
 * Validates all fields in a form with a provided validation function.
 *
 * @param form
 */
function validateFields<T extends FormDataDefinition>(
  form: FormDefinition<T>,
): Record<keyof T, ValidationResult> {
  const results = {} as Record<keyof T, ValidationResult>;
  const fields = getFormFields(form);

  for (const key in fields) {
    const field = fields[key] as FormField;

    if (field.validate) {
      const value = form.accessors.data[key];
      results[key] = field.validate(value as never);
    }
  }

  return results;
}

/**
 * Resets form errors.
 *
 * @param form
 */
export const resetFormErrors = <T extends FormDataDefinition>(
  form: FormDefinition<T>,
) => {
  form.accessors.errors = {};
};

/**
 * Filter validation errors from all validation results.
 *
 * @param validationResults
 */
const getValidationErrors = <T extends FormDataDefinition>(
  validationResults: FormAccessorErrors<T>,
): FormAccessorErrors<T> => {
  return Object.fromEntries(
    Object.entries(validationResults).filter(
      ([, validationResult]) => !validationResult?.valid,
    ),
  ) as FormAccessorErrors<T>;
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
  let validationErrors = getValidationErrors(validationResults);

  if (form.callbacks.onValidate) {
    validationErrors = form.callbacks.onValidate(validationErrors, form);
  }

  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
};
