<template>
  <div class="w-100">
    <div :class="containerClass">
      <FieldInput
        ref="root"
        v-bind="attributes"
        @change="events.onChange"
        @input="events.onInput"
        v-model="value"
        type="time"
      />
      <FieldLabel :for="attributes.id" :value="field.title" />
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
import { TimeFormField } from '@/use/fields';
import { useStdComponent } from '@/composables/stdComponent';

export default defineComponent({
  extends: BaseFormField,
  components: {
    FieldLabel,
    FieldInput,
    FieldInputError,
  },
  props: {
    field: {
      type: Object as PropType<TimeFormField>,
      required: true,
    },
  },
  setup(props) {
    return useStdComponent(props.field, props.form, props.validation);
  },
});
</script>
