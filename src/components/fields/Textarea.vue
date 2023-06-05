<template>
  <div class="w-100">
    <div :class="containerClass">
      <textarea
        ref="root"
        v-bind="attributes"
        v-model="value"
        @change="onChange"
        @input="onInput"
        :rows="field.rows ?? 3"
      />
      <FieldLabel :for="field.id ?? field.title" :value="field.title" />
      <FieldInputError :validation="validation" />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {TextareaFormField} from '@/use/fields';
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
      type: Object as PropType<TextareaFormField>,
      required: true,
    },
  },
});
</script>
