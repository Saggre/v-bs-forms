import {
  BaseFormFieldDefinition,
  CardFormFieldDefinition,
  HtmlFormFieldType,
  ValidationResult,
} from '@/use/fields/base';
import { Moment } from 'moment/moment';

export type StandardFormField<V = string> = BaseFormFieldDefinition<V> & {
  type: HtmlFormFieldType[keyof HtmlFormFieldType];
};

export type NumberFormField<V = number> = BaseFormFieldDefinition<V> & {
  type: 'number';
};

export interface ActionFormFieldTexts {
  submit: string;
  success: string;
  description?: string;
}

export type ActionFormField<V = boolean> = BaseFormFieldDefinition<V> &
  CardFormFieldDefinition & {
    type: 'action';
    onSubmit: () => void;
    validate: () => ValidationResult;
    texts: ActionFormFieldTexts;
  };

export type DateTimeFormField<V = Moment> = BaseFormFieldDefinition<V> & {
  type: 'datetime';
  deserialize: (value: string) => V;
  serialize: (value: V) => string;
};

export interface ListItem {
  name: string;
  description: string;
}

export type ListGroupFormField<V = ListItem> = BaseFormFieldDefinition<V> &
  CardFormFieldDefinition & {
    type: 'list-group';
    options: Record<string, ListItem>;
  };

export type CheckboxFormField<V = boolean> = BaseFormFieldDefinition<V> & {
  type: 'checkbox';
  indeterminate?: boolean;
};

export type DropdownFormField<V = string[]> = BaseFormFieldDefinition<V> & {
  type: 'dropdown';
  options: Record<string, string>;
};

export type TextareaFormField<V = string> = BaseFormFieldDefinition<V> & {
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
  | ListGroupFormField
  | CheckboxFormField;
