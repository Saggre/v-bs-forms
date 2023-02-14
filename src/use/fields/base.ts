export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'time'
  | 'email'
  | 'tel'
  | 'url'
  | 'password'
  | 'file'
  | 'hidden'
  | 'action';

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
  renderTransform?: (value: S) => V;
  submitTransform?: (value: V) => S;
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
