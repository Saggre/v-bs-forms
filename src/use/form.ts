import { InertiaForm } from '@inertiajs/inertia-vue3';
import { Moment } from 'moment';

export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'time'
  | 'number'
  | 'email'
  | 'tel'
  | 'url'
  | 'password'
  | 'file'
  | 'hidden'
  | 'action';

export type FormDataType =
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | number[]
  | boolean[]
  | null[]
  | undefined[]
  | Eloquent[];
export type AppFormData = Record<string, FormDataType>;

interface AppFormFieldValidationResultSuccess {
  valid: true;
}

interface AppFormFieldValidationResultError {
  valid: false;
  message: string;
}

export type AppFormFieldValidationResult =
  | AppFormFieldValidationResultSuccess
  | AppFormFieldValidationResultError;

interface GlobalAppFormField {
  type: string;
  class?: string;
  containerClass?: string;
  validate?: (value: FormDataType) => AppFormFieldValidationResult;
}

interface StaticAppFormField {
  title: string;
  placeholder?: string;
  floating?: false;
}

interface FloatingAppFormField {
  title: string;
  placeholder: string;
  floating: true;
}

type BaseAppFormField = (StaticAppFormField | FloatingAppFormField) &
  GlobalAppFormField;

type RegularAppFormField = BaseAppFormField & {
  type: FormFieldType;
  renderTransform?: (value: FormDataType) => string | number;
  submitTransform?: (value: string | number) => FormDataType;
};

interface ComponentAppFormField extends GlobalAppFormField {
  type: 'component';
  component: string;
  props: Record<string, unknown>;
}

export type ActionAppFormField = BaseAppFormField & {
  type: 'action';
  description?: string;
  submitTitle: () => string;
  isComplete: () => boolean;
  submit: () => void;
  required?: boolean;
};

export type DateTimeAppFormField = BaseAppFormField & {
  type: 'datetime';
  renderTransform: (value: string) => Moment;
  submitTransform: (value: Moment) => string;
};

export interface ListItem {
  key: string;
  name: string;
  description: string;
}

export type ListGroupAppFormField = BaseAppFormField & {
  type: 'list-group';
  items: ListItem[];
};

type DropdownAppFormField = BaseAppFormField & {
  type: 'dropdown';
  options: Record<string, string>;
  renderTransform?: (value: FormDataType) => string[] | number[];
  submitTransform?: (value: string[] | number[]) => FormDataType;
};

type TextareaAppFormField = BaseAppFormField & {
  type: 'textarea';
  rows?: number;
  renderTransform?: (value: FormDataType) => string | number;
  submitTransform?: (value: string | number) => FormDataType;
};

type MultiselectAppFormField = BaseAppFormField & {
  type: 'multiselect';
  searchable?: boolean;
  multiple?: boolean;
  label: (key: string) => string;
  options: string[];
  renderTransform?: (value: FormDataType) => string[];
  submitTransform?: (value: string[]) => FormDataType;
};

type SubmitButton = GlobalAppFormField & {
  type: 'submit';
  icon?: string;
  title: string;
  loading?: boolean;
};

export type _AppFormField =
  | RegularAppFormField
  | DropdownAppFormField
  | TextareaAppFormField
  | MultiselectAppFormField
  | DateTimeAppFormField
  | SubmitButton
  | ComponentAppFormField
  | ActionAppFormField
  | ListGroupAppFormField;

export type RepeaterAppFormField<T extends AppFormData> = GlobalAppFormField & {
  type: 'repeater';
  title: (data: any) => string;
  fields: { [key in keyof T]: _AppFormField };
};

export type AppFormField = _AppFormField | RepeaterAppFormField<AppFormData>;

export type AppForm<T extends AppFormData> = {
  title: string;
  description: string;
  form: InertiaForm<T>;
  fields: { [key in keyof T]: AppFormField };
  onSubmit: (data: AppForm<T>) => Promise<void>;
};

/**
 * TODO: Cleanup types.
 * @param form
 */
function validateFields<T extends AppFormData>(
  form: AppForm<T>,
): Record<keyof T, AppFormFieldValidationResult> {
  if (!form.fields) {
    return {} as Record<keyof T, AppFormFieldValidationResult>;
  }

  const results: Record<keyof T, AppFormFieldValidationResult> = {} as Record<
    keyof T,
    AppFormFieldValidationResult
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

export function useAppForm<T extends AppFormData>(
  form: AppForm<T>,
): AppForm<T> {
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
