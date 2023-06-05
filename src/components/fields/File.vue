<template>
  <div class="w-100">
    <div :class="containerClass">
      <FieldLabel
        :for="field.id ?? field.title"
        :value="field.title"
        class="form-label"
      />
      <FieldInput
        ref="root"
        v-bind="attributes"
        :accept="field.accept || 'image/*'"
        v-model="value"
        :type="field.type"
        :placeholder="placeholder"
      />
      <FieldInputError :validation="validation" />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {FileFormField} from '@/use/fields';
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
      type: Object as PropType<FileFormField>,
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
