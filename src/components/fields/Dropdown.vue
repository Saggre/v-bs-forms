<template>
  <div class="w-100">
    <div :class="containerClass">
      <select
        :id="field.id ?? field.title"
        :autocomplete="field.autocomplete || 'off'"
        :autofocus="field.autofocus || false"
        :disabled="field.disabled || false"
        :name="field.name ?? field.title"
        :required="field.required || false"
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
      <FieldLabel :for="field.id ?? field.title" :value="field.title" />
      <FieldInputError :validation="validation" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { DropdownFormField } from '@/use/fields';
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
      type: Object as PropType<DropdownFormField>,
      required: true,
    },
  },
});
</script>
