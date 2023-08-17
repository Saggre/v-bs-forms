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
  /** @deprecated */
  columnClass?: { [key: string]: boolean };
  validate?: (value: V | undefined) => ValidationResult;
  onChange?: (value: V, form: FormDefinition | undefined) => void;
  onInput?: (value: V, form: FormDefinition | undefined) => void;
  /** @deprecated */
  disabled?: boolean;
  /** @deprecated */
  inputmode?: string;
  /** @deprecated */
  pattern?: string;
  /** @deprecated */
  autocomplete?: string;
  /** @deprecated */
  autofocus?: boolean;
  /** @deprecated */
  id?: string;
  /** @deprecated */
  name?: string;
  tooltip?: TooltipOptions;
  /** @deprecated */
  required?: boolean;
  visible?: boolean | ((form: FormDefinition) => boolean);
  attributes?: Partial<
    // TODO: Select conditionally with type.
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
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
