<template>
  <div class="w-100">
    <div :class="containerClass">
      <input
        ref="root"
        v-bind="attributes"
        :min="field.min || null"
        :max="field.max || null"
        :step="field.step || null"
        v-model="value"
        @change="events.onChange"
        @input="events.onInput"
        type="number"
      />
      <FieldLabel :for="attributes.id" :value="field.title" />
      <FieldInputError :validation="validation" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue';
import { NumberFormField } from '@/use/fields';
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
      type: Object as PropType<NumberFormField>,
      required: true,
    },
  },
  setup(props) {
    return useStdComponent(toRefs(props));
  },
});
</script>
