import {
  BaseFormField,
  CardFormField,
  HtmlFormFieldType,
  ValidationResult,
} from '@/use/fields/base';
import { Moment } from 'moment/moment';

export type StandardFormField<V = string> = BaseFormField<V> & {
  type: HtmlFormFieldType[keyof HtmlFormFieldType];
};

export type NumberFormField<V = number> = BaseFormField<V> & {
  type: 'number';
};

export interface ActionFormFieldTexts {
  submit: string;
  success: string;
  description?: string;
}

export type ActionFormField<V = boolean> = BaseFormField<V> &
  CardFormField & {
    type: 'action';
    onSubmit: () => void;
    validate: () => ValidationResult;
    texts: ActionFormFieldTexts;
  };

export type DateTimeFormField<V = Moment> = BaseFormField<V> & {
  type: 'datetime';
  deserialize: (value: string) => V;
  serialize: (value: V) => string;
};

export interface ListItem {
  name: string;
  description: string;
}

export type ListGroupFormField<V = ListItem> = BaseFormField<V> &
  CardFormField & {
    type: 'list-group';
    options: Record<string, ListItem>;
  };

export type DropdownFormField<V = string[]> = BaseFormField<V> & {
  type: 'dropdown';
  options: Record<string, string>;
};

export type TextareaFormField<V = string> = BaseFormField<V> & {
  type: 'textarea';
  rows?: number;
};

export type FormField =
  | StandardFormField
  | NumberFormField
  | DropdownFormField
  | TextareaFormField
  | DateTimeFormField
  | ActionFormField
  | ListGroupFormField;
