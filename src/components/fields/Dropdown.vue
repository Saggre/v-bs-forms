<template>
  <div class="w-100">
    <div
      class="mb-3"
      :class="{
        'form-floating': field.floating,
        [field.containerClass]: !!field.containerClass,
      }"
    >
      <select
        :id="field.title"
        v-model="value"
        class="form-select"
        :class="{
          'is-invalid': !validation.valid,
          [field.class]: !!field.class,
        }"
      >
        <option
          v-for="(option, key) in field.options"
          :key="key"
          :value="key"
          :selected="value === option"
        >
          {{ option }}
        </option>
      </select>
      <FieldLabel :for="field.title" :value="field.title" />
      <FieldInputError :validation="validation" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { DropdownFormField } from '@/use/fields';
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
      type: Object as PropType<DropdownFormField | unknown>,
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
