<template>
  <div class="w-100">
    <div :class="containerClass">
      <FieldLabel
        class="form-label"
        :for="attributes.id"
        :value="field.title"
      />
      <FieldInput
        ref="root"
        v-bind="attributes"
        @change="events.onChange"
        @input="events.onInput"
        v-model="value"
        type="time"
      />
      <FieldInputError :validation="validation" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue';
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
    return useStdComponent(toRefs(props));
  },
});
</script>
