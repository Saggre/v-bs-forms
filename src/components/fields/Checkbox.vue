<template>
  <div class="w-100">
    <div :class="containerClass">
      <div class="form-check">
        <input ref="root" v-bind="attributes" type="checkbox" v-model="value" />
        <FieldLabel :for="attributes.id" :value="field.title" />
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
import { useStdComponent } from '@/composables/stdComponent';

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
  setup(props) {
    return useStdComponent(props.field, props.form, props.validation, {
      baseClasses: { 'form-check-input': true },
    });
  },
});
</script>
