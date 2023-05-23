<template>
  <div class="w-100">
    <div :class="containerClass">
      <FieldInput
        :id="field.id ?? field.title"
        :autocomplete="field.autocomplete || 'off'"
        :autofocus="field.autofocus || false"
        :inputmode="field.inputmode || null"
        :pattern="field.pattern || null"
        :disabled="field.disabled || false"
        :name="field.name ?? field.title"
        :required="field.required || false"
        v-model="value"
        @change="
          event =>
            field.onChange ? field.onChange(event.target.value) : () => {}
        "
        @input="
          event =>
            field.onInput ? field.onInput(event.target.value) : () => {}
        "
        :type="field.type"
        :class="{
          'is-invalid': !validation.valid,
          [field.class]: !!field.class,
        }"
        :placeholder="placeholder"
      />
      <FieldLabel :for="field.id ?? field.title" :value="field.title" />
      <FieldInputError :validation="validation" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { FormField } from '@/use/fields';
import FieldLabel from '@/components/fields/standard/Label.vue';
import FieldInput from '@/components/fields/standard/Input.vue';
import FieldInputError from '@/components/fields/standard/InputError.vue';
import BaseFormField from '@/components/fields/BaseFormField.vue';

export default defineComponent({
  extends: BaseFormField,
  components: {
    FieldLabel,
    FieldInput,
    FieldInputError,
  },
  props: {
    field: {
      type: Object as PropType<FormField>,
      required: true,
    },
  },
  computed: {
    placeholder(): string {
      if (this.field.placeholder) {
        return this.field.placeholder;
      }

      if (this.field.floating) {
        return this.field.title;
      }

      return '';
    },
  },
});
</script>
