<template>
  <div class="w-100">
    <div :class="wrapperClass">
      <FieldLabel
        class="form-label"
        :for="attributes.id"
        :value="field.title"
        :required="field.required || false"
      />
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
          :selected="value === key"
        >
          {{ option }}
        </option>
      </select>
      <FieldInputError :validation="validation" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue';
import { DropdownFormField } from '@/use/fields';
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
      type: Object as PropType<DropdownFormField>,
      required: true,
    },
  },
  setup(props) {
    return useStdComponent(toRefs(props));
  },
});
</script>
