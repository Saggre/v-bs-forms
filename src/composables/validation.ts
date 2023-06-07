import { ValidationResult } from '@/use/fields/base';
import { FormDefinition, FormErrorType } from '@/use/form';
import { Ref, computed } from 'vue';

export const useValidation = (
  key: Ref<string>,
  form: Ref<FormDefinition<any>>,
) => {
  const validation = computed((): ValidationResult => {
    const formError = form.value.accessors.errors?.[key.value];

    if (formError) {
      switch (formError) {
        case FormErrorType.Required:
          return {
            valid: false,
            // TODO: Add possibility to translate this message.
            message: 'Kenttä vaaditaan',
          };
        default:
          return {
            valid: false,
            message: form.value.accessors.errors?.[key.value] ?? '',
          };
      }
    }

    return {
      valid: true,
    };
  });

  return {
    validation,
  };
};
