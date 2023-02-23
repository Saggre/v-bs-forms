<template>
  <div class="w-100">
    <div :class="containerClass">
      <div class="form-check">
        <input
          :id="field.id ?? field.title"
          :autocomplete="field.autocomplete || 'off'"
          :autofocus="field.autofocus || false"
          :disabled="field.disabled || false"
          :name="field.name ?? field.title"
          :required="field.required || false"
          :class="{
            'form-check-input': true,
            'is-invalid': !validation.valid,
            [field.class]: !!field.class,
          }"
          type="checkbox"
          v-model="value"
        />
        <FieldLabel :for="field.id ?? field.title" :value="field.title" />
        <FieldInputError :validation="validation" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { CheckboxFormField } from '@/use/fields';
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
      type: Object as PropType<CheckboxFormField>,
      required: true,
    },
  },
});
</script>
