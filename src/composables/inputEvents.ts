import { GlobalFormField } from '@/use/fields/base';
import { FormDefinition } from '@/use/form';

export const useInputEvents = <T, F extends GlobalFormField<T>>(
  field: F,
  form: FormDefinition | undefined,
) => {
  const onChange = (event: Event) => {
    const element = event.target as HTMLInputElement;

    if (field.onChange) {
      field.onChange(element.value as T, form);
    }
  };

  const onInput = (event: Event) => {
    const element = event.target as HTMLInputElement;

    if (field.onInput) {
      field.onInput(element.value as T, form);
    }
  };

  return { onChange, onInput };
};
