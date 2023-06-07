<template>
  <div class="w-100">
    <div :class="containerClass">
      <FieldInput
        ref="root"
        v-bind="attributes"
        v-model="value"
        @change="events.onChange"
        @input="events.onInput"
        :type="field.type"
      />
      <FieldLabel :for="attributes.id" :value="field.title" />
      <FieldInputError :validation="validation" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue';
import { FormField } from '@/use/fields';
import FieldLabel from '@/components/fields/standard/Label.vue';
import FieldInput from '@/components/fields/standard/Input.vue';
import FieldInputError from '@/components/fields/standard/InputError.vue';
import BaseFormField from '@/components/fields/BaseFormField.vue';
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
      type: Object as PropType<FormField>,
      required: true,
    },
  },
  setup(props) {
    return useStdComponent(toRefs(props));
  },
});
</script>
