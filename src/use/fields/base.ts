import { FormErrorType } from '@/use/form';

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

export type FormDataTypeDefinition =
  | string
  | number
  | boolean
  | null
  | undefined
  | FormDataTypeDefinition[];

export type FormDataDefinition = Record<string, FormDataTypeDefinition>;

export interface ValidationSuccess {
  valid: true;
}

export interface ValidationError {
  valid: false;
  message: string | FormErrorType;
}

export type ValidationResult = ValidationSuccess | ValidationError;

export interface GlobalFormField<V, S extends FormDataTypeDefinition = string> {
  type: string;
  class?: string;
  containerClass?: string;
  validate?: (value: V) => ValidationResult;
  deserialize?: (value: S) => V;
  serialize?: (value: V) => S;
  disabled?: boolean;
  inputmode?: string;
  pattern?: string;
  autocomplete?: string;
  autofocus?: boolean;
  id?: string;
  name?: string;
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
