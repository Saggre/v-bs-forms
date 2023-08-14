import { FormDefinition } from '@/use/form';

export const enum HtmlFormFieldType {
  Text = 'text',
  Textarea = 'textarea',
  Select = 'select',
  Radio = 'radio',
  Date = 'date',
  Time = 'time',
  Email = 'email',
  Tel = 'tel',
  Url = 'url',
  Password = 'password',
  Hidden = 'hidden',
}

export type FormDataDefinition = Record<string, unknown>;

export interface ValidationSuccess {
  valid: true;
}

export interface ValidationError {
  valid: false;
  message: string;
}

export type ValidationResult = ValidationSuccess | ValidationError;

/**
 * Attributes that are common for all input types.
 */
export interface CommonHtmlAttributes {
  class: string | object | null;
  disabled: boolean | null;
  inputmode: string | null;
  pattern: string | null;
  autocomplete: string | null;
  autofocus: boolean | null;
  id: string | null;
  name: string | null;
  required: boolean | null;
  placeholder: string | null;
}

export interface TooltipOptions {
  title: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

export interface GlobalFormField<V> {
  type: string;
  title: string;
  placeholder?: string;
  class?: { [key: string]: boolean };
  /**
   * Wrapper for the input element.
   */
  wrapperClass?: { [key: string]: boolean };
  /**
   * Container for the input element. Usually a column (col).
   */
  containerClass?: { [key: string]: boolean };
  /**
   * @deprecated
   */
  columnClass?: { [key: string]: boolean };
  validate?: (value: V | undefined) => ValidationResult;
  onChange?: (value: V, form: FormDefinition<any> | undefined) => void;
  onInput?: (value: V, form: FormDefinition<any> | undefined) => void;
  disabled?: boolean;
  inputmode?: string;
  pattern?: string;
  autocomplete?: string;
  autofocus?: boolean;
  id?: string;
  name?: string;
  tooltip?: TooltipOptions;
  required?: boolean;
  visible?: boolean | ((form: FormDefinition<any>) => boolean);
}

export interface CardFormFieldDefinition {
  title: string;
  subtitle?: string;
  description?: string;
  header?: string;
  footer?: string;
  tooltip?: TooltipOptions;
  required?: boolean;
}

export type BaseFormFieldDefinition<V> = GlobalFormField<V>;
