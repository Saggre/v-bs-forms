import {
  BaseFormFieldDefinition,
  CardFormFieldDefinition,
  HtmlFormFieldType,
  InputFormField,
  ValidationResult,
} from '@/use/fields/base';
import { Moment } from 'moment/moment';

export type StandardFormField<V = string> = BaseFormFieldDefinition<V> &
  InputFormField & {
    type: HtmlFormFieldType[keyof HtmlFormFieldType];
  };

export type NumberFormField<V = number> = BaseFormFieldDefinition<V> &
  InputFormField & {
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
    autocomplete?: never;
  };

export type DateTimeFormField<V = Moment> = BaseFormFieldDefinition<V> &
  InputFormField & {
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

export type CheckboxFormField<V = boolean> = BaseFormFieldDefinition<V> &
  InputFormField & {
    type: 'checkbox';
    indeterminate?: boolean;
  };

export type DropdownFormField<V = string[]> = BaseFormFieldDefinition<V> &
  InputFormField & {
    type: 'dropdown';
    options: Record<string, string>;
  };

export type TextareaFormField<V = string> = BaseFormFieldDefinition<V> &
  InputFormField & {
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
