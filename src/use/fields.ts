import {
  BaseFormFieldDefinition,
  CardFormFieldDefinition,
  HtmlFormFieldType,
} from '@/use/fields/base';

export type StandardFormField = BaseFormFieldDefinition<string> & {
  type: HtmlFormFieldType[keyof HtmlFormFieldType];
};

export type NumberFormField = BaseFormFieldDefinition<number>;

export interface ActionFormFieldTexts {
  submit: string;
  success: string;
  description?: string;
}

export type ActionFormField = BaseFormFieldDefinition<boolean> &
  CardFormFieldDefinition & {
    type: 'action';
    onSubmit: () => void;
    texts: ActionFormFieldTexts;
    /** @deprecated */
    autocomplete?: never;
    onChange?: never;
    onInput?: never;
  };

export type DateFormField = BaseFormFieldDefinition<string>;

export type TimeFormField = BaseFormFieldDefinition<string>;

export interface ListItem {
  name: string;
  description: string;
}

export type ListGroupFormField = BaseFormFieldDefinition<ListItem> &
  CardFormFieldDefinition & {
    type: 'list-group';
    options: Record<string, ListItem>;
    onChange?: never;
    onInput?: never;
  };

export type CheckboxFormField = BaseFormFieldDefinition<boolean> & {
  type: 'checkbox';
  /** @deprecated */
  indeterminate?: boolean;
  onChange?: never;
  onInput?: never;
};

export type DropdownFormField = BaseFormFieldDefinition<string[]> & {
  type: 'dropdown';
  options: Record<string, string>;
  onChange?: never;
  onInput?: never;
};

export type TextareaFormField = BaseFormFieldDefinition<string> & {
  type: 'textarea';
  /** @deprecated */
  maxlength?: number;
  /** @deprecated */
  minlength?: number;
  /** @deprecated */
  rows?: number;
};

export type PasswordFormField = BaseFormFieldDefinition<string> & {
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

export type FileFormField = BaseFormFieldDefinition<string> & {
  type: 'file';
  /** @deprecated */
  accept?: string;
  onChange?: never;
  onInput?: never;
};

export type FormField =
  | StandardFormField
  | NumberFormField
  | DropdownFormField
  | TextareaFormField
  | DateFormField
  | TimeFormField
  | ActionFormField
  | ListGroupFormField
  | CheckboxFormField
  | FileFormField
  | PasswordFormField;
