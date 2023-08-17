<template>
  <div class="w-100">
    <div :class="wrapperClass">
      <FieldLabel
        class="form-label"
        :for="attributes.id"
        :value="field.title"
        :required="attributes.required || false"
      />
      <FieldInput ref="root" v-bind="attributes" v-model="value" type="file" />
      <FieldInputError :validation="validation" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue';
import { FileFormField } from '@/use/fields';
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
      type: Object as PropType<FileFormField>,
      required: true,
    },
  },
  setup(props) {
    return useStdComponent(toRefs(props));
  },
});
</script>
