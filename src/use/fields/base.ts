export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'time'
  | 'number'
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
  | string[]
  | number[]
  | boolean[]
  | null[]
  | undefined[];

export type _FormData = Record<string, _FormDataType>;

interface ValidationSuccess {
  valid: true;
}

interface ValidationError {
  valid: false;
  message: string;
}

export type ValidationResult = ValidationSuccess | ValidationError;

export interface GlobalFormField {
  type: string;
  class?: string;
  containerClass?: string;
  validate?: (value: _FormDataType) => ValidationResult;
}

export interface StaticFormField {
  title: string;
  placeholder?: string;
  floating?: false;
}

export interface FloatingFormField {
  title: string;
  placeholder: string;
  floating: true;
}

export type BaseFormField = (StaticFormField | FloatingFormField) &
  GlobalFormField;
