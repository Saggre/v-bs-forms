import {
  FormDataDefinition,
  ValidationError,
  ValidationResult,
} from '@/use/fields/base';
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
  onRender?: (form: FormDefinition<T>) => void;
  onCancel?: (form: FormDefinition<T>) => void;
  onError?: (errors: FormAccessorErrors<T>, form: FormDefinition<T>) => void;
}

export type FormInputFields<T extends FormDataDefinition> = Partial<{
  // TODO: Allow form field types based on defined value type.
  [K in keyof T]: FormField;
}>;

export type FormDefinition<T extends FormDataDefinition> = {
  fields: FormInputFields<T>;
  accessors: FormAccessors<T>;
  callbacks: FormCallbacks<T>;
};

export type AbstractFormDefinition = FormDefinition<{ [key: string]: any }>;

export type PartialFormDefinition<T extends FormDataDefinition> = Partial<{
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
}

export interface FormVisibility {
  buttons: FormButtons<boolean>;
  sidebar: boolean;
}

export interface FormClasses {
  card: string;
}

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
    const field = form.fields[key] as FormField;

    if ('required' in field && field.required && !form?.accessors?.data[key]) {
      errors[key] = {
        valid: false,
        // TODO: Allow translation of error messages.
        message: 'Kenttä on pakollinen.',
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
    const field = form.fields[key] as FormField;

    if (field.validate) {
      const value = form.accessors.data[key];
      results[key] = field.validate(value as never);
    }
  }

  return {
    ...results,
    ...getRequiredFieldErrors(form),
  };
}

export const resetFormErrors = <T extends FormDataDefinition>(
  form: FormDefinition<T>,
) => {
  form.accessors.errors = {};
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

  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
};
