import { ValidationResult } from '@/use/fields/base';
import { FormDefinition } from '@/use/form';
import { Ref, computed } from 'vue';

export const useValidation = (
  key: Ref<string>,
  form: Ref<FormDefinition<any>>,
) => {
  const validation = computed(
    (): ValidationResult =>
      form.value.accessors.errors?.[key.value] ?? {
        valid: true,
      },
  );

  return {
    validation,
  };
};
