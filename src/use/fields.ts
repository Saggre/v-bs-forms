import { BaseFormField, FormFieldType } from '@/use/fields/base';
import { Moment } from 'moment/moment';

export type StandardFormField<V = string> = BaseFormField<V> & {
  type: FormFieldType;
};

export type NumberFormField<V = number> = BaseFormField<V> & {
  type: 'number';
};

export type ActionFormField<V = boolean> = BaseFormField<V> & {
  type: 'action';
  description?: string;
  submitTitle: () => string;
  // TODO: Use validate.
  isComplete: () => boolean;
  submit: () => void;
  required?: boolean;
};

export type DateTimeFormField<V = Moment> = BaseFormField<V> & {
  type: 'datetime';
};

export interface ListItem {
  key: string;
  name: string;
  description: string;
}

export type ListGroupFormField<V = ListItem> = BaseFormField<V> & {
  type: 'list-group';
  options: ListItem[];
};

export type DropdownFormField<V = string[]> = BaseFormField<V> & {
  type: 'dropdown';
  options: Record<string, string>;
};

export type TextareaFormField<V = string> = BaseFormField<V> & {
  type: 'textarea';
  rows?: number;
};

export type MultiselectFormField<V = string[]> = BaseFormField<V> & {
  type: 'multiselect';
  searchable?: boolean;
  multiple?: boolean;
  label: (key: string) => string;
  options: string[];
};

export type FormField =
  | StandardFormField
  | NumberFormField
  | DropdownFormField
  | TextareaFormField
  | MultiselectFormField
  | DateTimeFormField
  | ActionFormField
  | ListGroupFormField;
