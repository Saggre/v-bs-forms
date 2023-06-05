<template>
  <div class="w-100">
    <div :class="containerClass">
      <select
        ref="root"
        v-bind="attributes"
        :id="field.id ?? field.title"
        v-model="value"
        class="form-select"
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
