import {
  BaseFormField,
  FormDataType,
  FormFieldType,
  GlobalFormField,
} from '@/use/fields/base';

type StandardFormField = BaseFormField & {
  type: FormFieldType;
  renderTransform?: (value: FormDataType) => string | number;
  submitTransform?: (value: string | number) => FormDataType;
};

interface ComponentFormField extends GlobalFormField {
  type: 'component';
  component: string;
  props: Record<string, unknown>;
}

export type ActionFormField = BaseFormField & {
  type: 'action';
  description?: string;
  submitTitle: () => string;
  isComplete: () => boolean;
  submit: () => void;
  required?: boolean;
};

export type DateTimeFormField = BaseFormField & {
  type: 'datetime';
  renderTransform: (value: string) => Moment;
  submitTransform: (value: Moment) => string;
};

export interface ListItem {
  key: string;
  name: string;
  description: string;
}

export type ListGroupFormField = BaseFormField & {
  type: 'list-group';
  items: ListItem[];
};

type DropdownFormField = BaseFormField & {
  type: 'dropdown';
  options: Record<string, string>;
  renderTransform?: (value: FormDataType) => string[] | number[];
  submitTransform?: (value: string[] | number[]) => FormDataType;
};

type TextareaFormField = BaseFormField & {
  type: 'textarea';
  rows?: number;
  renderTransform?: (value: FormDataType) => string | number;
  submitTransform?: (value: string | number) => FormDataType;
};

type MultiselectFormField = BaseFormField & {
  type: 'multiselect';
  searchable?: boolean;
  multiple?: boolean;
  label: (key: string) => string;
  options: string[];
  renderTransform?: (value: FormDataType) => string[];
  submitTransform?: (value: string[]) => FormDataType;
};

type SubmitButton = GlobalFormField & {
  type: 'submit';
  icon?: string;
  title: string;
  loading?: boolean;
};

export type _FormField =
  | StandardFormField
  | DropdownFormField
  | TextareaFormField
  | MultiselectFormField
  | DateTimeFormField
  | SubmitButton
  | ComponentFormField
  | ActionFormField
  | ListGroupFormField;

export type RepeaterFormField<T extends FormData> = GlobalFormField & {
  type: 'repeater';
  title: (data: any) => string;
  fields: { [key in keyof T]: _FormField };
};

export type FormField = _FormField | RepeaterFormField<FormData>;
