<template>
  <div class="w-100">
    <div
      class="mb-3"
      :class="{
        'form-floating': field.floating,
        [field.containerClass]: !!field.containerClass,
      }"
    >
      <textarea
        :id="field.title"
        v-model="value"
        class="form-control"
        :class="{
          'is-invalid': !validation.valid,
          [field.class]: !!field.class,
        }"
        :rows="field.rows ?? 3"
      />
      <FieldLabel :for="field.title" :value="field.title" />
      <FieldInputError :validation="validation" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { TextareaFormField } from '@/use/fields';
import FieldLabel from '@/components/fields/standard/Label.vue';
import FieldInputError from '@/components/fields/standard/InputError.vue';
import { ValidationResult } from '@/use/fields/base';

export default defineComponent({
  components: {
    FieldLabel,
    FieldInputError,
  },
  props: {
    validation: {
      type: Object as PropType<ValidationResult>,
      required: true,
    },
    field: {
      type: Object as PropType<TextareaFormField | unknown>,
      required: true,
    },
    modelValue: {
      type: String as PropType<string>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data(props) {
    return {
      value: props.modelValue,
    };
  },
});
</script>
