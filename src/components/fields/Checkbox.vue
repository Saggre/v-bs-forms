<template>
  <div class="w-100">
    <div :class="wrapperClass">
      <div class="form-check">
        <FieldLabel
          class="form-label"
          :for="attributes.id"
          :value="field.title"
          :required="attributes.required || false"
        />
        <input ref="root" v-bind="attributes" type="checkbox" v-model="value" />
        <FieldInputError :validation="validation" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue';
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
    return useStdComponent(toRefs(props), {
      baseClasses: { 'form-check-input': true },
    });
  },
});
</script>
