import { BaseFormFieldDefinition, ValidationResult } from '@/use/fields/base';
import { useTooltip } from '@/composables/tooltip';
import { useInputEvents } from '@/composables/inputEvents';
import { FormDefinition } from '@/use/form';

export interface StdComponentOptions {
  baseClasses: { [key: string]: boolean };
}

export const useStdComponent = <T, F extends BaseFormFieldDefinition<T>>(
  field: F,
  form: FormDefinition<any> | undefined,
  validation: ValidationResult,
  { baseClasses }: StdComponentOptions = {
    baseClasses: { 'form-control': true },
  },
) => {
  const { tooltipAttributes } = useTooltip(field.tooltip);
  const { onChange, onInput } = useInputEvents<T, F>(field, form);

  let placeholder = null;

  if ('placeholder' in field && field.placeholder) {
    placeholder = field.placeholder;
  }

  if (field.floating) {
    placeholder = field.title ?? null;
  }

  return {
    attributes: {
      class: {
        ...baseClasses,
        'is-invalid': !validation.valid,
        ...(field.class ? { [field.class]: !!field.class } : {}),
      },
      disabled: field.disabled || false,
      inputmode: field.inputmode || null,
      pattern: field.pattern || null,
      autocomplete: field.autocomplete || 'off',
      autofocus: field.autofocus || false,
      id: field.id || field.title,
      name: field.name || field.title,
      required: field.required || false,
      placeholder,
      ...tooltipAttributes,
    },
    events: {
      onChange,
      onInput,
    },
  };
};
