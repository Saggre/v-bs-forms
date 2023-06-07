import {
  BaseFormFieldDefinition,
  CardFormFieldDefinition,
  HtmlFormFieldType,
  InputFormField,
  ValidationResult,
} from '@/use/fields/base';

export type StandardFormField<V = string> = BaseFormFieldDefinition<V> &
  InputFormField & {
    type: HtmlFormFieldType[keyof HtmlFormFieldType];
  };

export type NumberFormField<V = number> = BaseFormFieldDefinition<V> &
  InputFormField & {
    type: 'number';
    min?: number;
    max?: number;
    step?: number;
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
    onChange?: never;
    onInput?: never;
  };

export type DateFormField<V = Date> = BaseFormFieldDefinition<V> &
  InputFormField & {
    type: 'date';
    deserialize: (value: string) => V;
    serialize: (value: V) => string;
  };

export type TimeFormField<V = string> = BaseFormFieldDefinition<V> &
  InputFormField & {
    type: 'time';
  };

export interface ListItem {
  name: string;
  description: string;
}

export type ListGroupFormField<V = ListItem> = BaseFormFieldDefinition<V> &
  CardFormFieldDefinition & {
    type: 'list-group';
    options: Record<string, ListItem>;
    onChange?: never;
    onInput?: never;
  };

export type CheckboxFormField<V = boolean> = BaseFormFieldDefinition<V> &
  InputFormField & {
    type: 'checkbox';
    indeterminate?: boolean;
    onChange?: never;
    onInput?: never;
  };

export type DropdownFormField<V = string[]> = BaseFormFieldDefinition<V> &
  InputFormField & {
    type: 'dropdown';
    options: Record<string, string>;
    onChange?: never;
    onInput?: never;
  };

export type TextareaFormField<V = string> = BaseFormFieldDefinition<V> &
  InputFormField & {
    type: 'textarea';
    rows?: number;
  };

export type PasswordFormField<V = string> = BaseFormFieldDefinition<V> &
  InputFormField & {
    type: 'password';
    toggleable?:
      | boolean
      | {
          icons: {
            show: string;
            hide: string;
          };
        };
  };

export type FileFormField<V = string> = BaseFormFieldDefinition<V> &
  InputFormField & {
    type: 'file';
    accept?: string;
    floating?: never;
    onChange?: never;
    onInput?: never;
  };

export type HtmlFormField = {
  type: 'html';
};

export type FormField<V> =
  | StandardFormField<V>
  | NumberFormField<V>
  | DropdownFormField<V>
  | TextareaFormField<V>
  | DateFormField<V>
  | TimeFormField<V>
  | ActionFormField<V>
  | ListGroupFormField<V>
  | CheckboxFormField<V>
  | FileFormField<V>
  | PasswordFormField<V>;
