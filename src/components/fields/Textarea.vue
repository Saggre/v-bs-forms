<template>
  <div class="w-100">
    <div :class="containerClass">
      <FieldLabel
        class="form-label"
        :for="attributes.id"
        :value="field.title"
        :required="field.required || false"
      />
      <textarea
        ref="root"
        v-bind="attributes"
        v-model="value"
        @change="events.onChange"
        @input="events.onInput"
        :rows="field.rows ?? 3"
        :maxlength="field.maxlength ?? null"
        :minlength="field.minlength ?? null"
      />
      <FieldInputError :validation="validation" />
      <span
        v-if="field.maxlength"
        :class="{
          'text-danger': value?.length > field.maxlength,
          'small text-muted': true,
        }"
        >{{ `${value?.length ?? 0} / ${field.maxlength}` }}</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue';
import { TextareaFormField } from '@/use/fields';
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
      type: Object as PropType<TextareaFormField>,
      required: true,
    },
  },
  setup(props) {
    return useStdComponent(toRefs(props));
  },
});
</script>

<style scoped>
textarea:after {
  content: '10 / 100';
}
</style>
