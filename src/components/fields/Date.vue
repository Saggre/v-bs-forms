<template>
  <div class="w-100">
    <div :class="containerClass">
      <FieldInput
        ref="root"
        v-bind="attributes"
        v-model="value"
        type="date"
        :placeholder="field.placeholder"
      />
      <FieldLabel :for="field.id ?? field.title" :value="field.title" />
      <FieldInputError :validation="validation" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import FieldLabel from '@/components/fields/standard/Label.vue';
import FieldInput from '@/components/fields/standard/Input.vue';
import FieldInputError from '@/components/fields/standard/InputError.vue';
import BaseFormField from '@/components/fields/BaseFormField.vue';
import { DateFormField } from '@/use/fields';

export default defineComponent({
  extends: BaseFormField,
  components: {
    FieldLabel,
    FieldInput,
    FieldInputError,
  },
  props: {
    field: {
      type: Object as PropType<DateFormField>,
      required: true,
    },
  },
  /* data() {
    const date = this.internalModelValue();
    return {
      value: `${date.getYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    };
  },
  watch: {
    value(fieldValue: string) {
      const parts = fieldValue.split('-');
      const date = new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1]) - 1,
        parseInt(parts[2]),
      );

      this.value = this.field.serialize(date);

      if (this.field.onChange) {
        this.field.onChange(date, this.form);
      }
    },
  },
  methods: {
    internalModelValue(): Date {
      return this.field.deserialize(this.modelValue);
    },
  },*/
});
</script>
