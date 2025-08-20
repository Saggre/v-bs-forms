import { BaseFormFieldDefinition, ValidationResult } from '@/use/fields/base';
import { useTooltip } from '@/composables/tooltip';
import { useInputEvents } from '@/composables/inputEvents';
import { FormDefinition } from '@/use/form';
import {
  computed,
  InputHTMLAttributes,
  Ref,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'vue';
import { useValidation } from '@/composables/validation';

export interface StdComponentOptions {
  baseClasses: { [key: string]: boolean };
}

type BaseFormFieldProps<T, F extends BaseFormFieldDefinition<T>> = {
  formKey: string;
  field: F;
  form: FormDefinition;
};

type HTMLTypeName = 'input' | 'select' | 'textarea';
type HTMLType<T> = T extends 'input'
  ? InputHTMLAttributes
  : T extends 'select'
  ? SelectHTMLAttributes
  : T extends 'textarea'
  ? TextareaHTMLAttributes
  : never;

export interface StdComponent<H extends HTMLTypeName> {
  attributes: Ref<HTMLType<H>>;
  events: {
    onChange: (event: Event) => void;
    onInput: (event: Event) => void;
  };
  validation: Ref<ValidationResult>;
}

export const useStdComponent = <
  T,
  F extends BaseFormFieldDefinition<T>,
  H extends HTMLTypeName,
>(
  type: H,
  props: {
    [key in keyof BaseFormFieldProps<T, F>]: Ref<BaseFormFieldProps<T, F>[key]>;
  },
  { baseClasses }: StdComponentOptions = {
    baseClasses: { 'form-control': true },
  },
): StdComponent<H> => {
  const field = props.field.value;
  const form = props.form.value;
  const { tooltipAttributes } = useTooltip(field.tooltip);
  const { onChange, onInput } = useInputEvents<T, F>(field, form);
  const { validation } = useValidation(props.formKey, props.form);

  const getPlaceholder = (field: F) => {
    if ('placeholder' in field && field.placeholder) {
      return field.placeholder;
    }

    return null;
  };

  return {
    attributes: computed(
      () =>
        ({
          class: {
            ...baseClasses,
            'is-invalid': !validation.value.valid,
            ...(field.class ?? {}),
          },
          disabled: field.disabled || false,
          inputmode: field.inputmode || null,
          pattern: field.pattern || null,
          // @ts-ignore
          min: field.min || null,
          // @ts-ignore
          max: field.max || null,
          // @ts-ignore
          step: field.step || null,
          // @ts-ignore
          accept: field.accept || null,
          autocomplete: field.autocomplete || 'off',
          autofocus: field.autofocus || false,
          id: field.id || field.title,
          name: field.name || field.title,
          required: field.required || false,
          placeholder: getPlaceholder(field),
          ...tooltipAttributes,
          ...field.attributes,
        } as HTMLType<H>),
    ),
    events: {
      onChange,
      onInput,
    },
    validation,
  };
};
