import { FormDefinition, FormErrorType } from '@/use/form';

export const enum HtmlFormFieldType {
  Text = 'text',
  Textarea = 'textarea',
  Select = 'select',
  Radio = 'radio',
  Date = 'date',
  Time = 'time',
  Datetime = 'datetime',
  Email = 'email',
  Tel = 'tel',
  Url = 'url',
  Password = 'password',
  Hidden = 'hidden',
}

export type FormDataDefinition = Record<string, any>;

export interface ValidationSuccess {
  valid: true;
}

export interface ValidationError {
  valid: false;
  message: string | FormErrorType;
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
}

export interface TooltipOptions {
  title: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

export interface GlobalFormField<V, S = string> {
  type: string;
  class?: string;
  containerClass?: string;
  validate?: (value: V) => ValidationResult;
  deserialize?: (value: S) => V;
  serialize?: (value: V) => S;
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
}

export interface InputFormField {
  required?: boolean;
}

export interface CardFormFieldDefinition {
  title: string;
  subtitle?: string;
  description?: string;
  header?: string;
  footer?: string;
  floating: never;
}

export interface StaticFormField {
  title: string;
  placeholder?: string;
  floating?: false;
}

export interface FloatingFormField {
  title: string;
  floating: true;
}

export type BaseFormFieldDefinition<V> = (StaticFormField | FloatingFormField) &
  GlobalFormField<V>;
