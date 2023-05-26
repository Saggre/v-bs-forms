<template>
  <div class="w-100">
    <div :class="containerClass">
      <textarea
        :id="field.id ?? field.title"
        :autocomplete="field.autocomplete || 'off'"
        :autofocus="field.autofocus || false"
        :disabled="field.disabled || false"
        :inputmode="field.inputmode || null"
        :name="field.name ?? field.title"
        :required="field.required || false"
        v-model="value"
        @change="onChange"
        @input="onInput"
        class="form-control"
        :class="{
          'is-invalid': !validation.valid,
          [field.class]: !!field.class,
        }"
        :rows="field.rows ?? 3"
      />
      <FieldLabel :for="field.id ?? field.title" :value="field.title" />
      <FieldInputError :validation="validation" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { TextareaFormField } from '@/use/fields';
import FieldLabel from '@/components/fields/standard/Label.vue';
import FieldInputError from '@/components/fields/standard/InputError.vue';
import BaseFormField from '@/components/fields/BaseFormField.vue';

export default defineComponent({
  extends: BaseFormField,
  components: {
    FieldLabel,
    FieldInputError,
  },
  props: {
    field: {
      type: Object as PropType<TextareaFormField>,
      required: true,
    },
  },
  methods: {
    onChange(event: Event) {
      const element = event.target as HTMLInputElement;

      if (this.field.onChange) {
        this.field.onChange(element.value, this.form);
      }
    },
    onInput(event: Event) {
      const element = event.target as HTMLInputElement;

      if (this.field.onInput) {
        this.field.onInput(element.value, this.form);
      }
    },
  },
});
</script>
