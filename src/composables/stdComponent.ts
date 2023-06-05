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

  const getPlaceholder = (field: F) => {
    if ('placeholder' in field && field.placeholder) {
      return field.placeholder;
    }

    if (field.floating) {
      return field.title ?? null;
    }

    return null;
  };

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
      placeholder: getPlaceholder(field),
      ...tooltipAttributes,
    },
    events: {
      onChange,
      onInput,
    },
  };
};
