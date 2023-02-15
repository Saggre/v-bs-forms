export const enum HtmlFormFieldType {
  Text = 'text',
  Textarea = 'textarea',
  Select = 'select',
  Checkbox = 'checkbox',
  Radio = 'radio',
  Date = 'date',
  Time = 'time',
  Datetime = 'datetime',
  Email = 'email',
  Tel = 'tel',
  Url = 'url',
  Password = 'password',
  File = 'file',
  Hidden = 'hidden',
}

export type _FormDataType =
  | string
  | number
  | boolean
  | null
  | undefined
  | _FormDataType[];

export type _FormData = Record<string, _FormDataType>;

export interface ValidationSuccess {
  valid: true;
}

export interface ValidationError {
  valid: false;
  message: string;
}

export type ValidationResult = ValidationSuccess | ValidationError;

export interface GlobalFormField<V, S extends _FormDataType = string> {
  type: string;
  class?: string;
  containerClass?: string;
  validate?: (value: V) => ValidationResult;
  deserialize?: (value: S) => V;
  serialize?: (value: V) => S;
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

export type BaseFormField<V> = (StaticFormField | FloatingFormField) &
  GlobalFormField<V>;
