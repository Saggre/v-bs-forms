<template>
  <div v-if="isRepeater()">
    <AppFormRepeaterField
      v-model="value"
      :repeater="field"
      :error="error"
    />
  </div>
  <div v-else-if="isDateTime()">
    <AppFormDateTimeField
      v-model="value"
      :field="field"
      :error="error"
    />
  </div>
  <div v-else-if="isAction()">
    <AppFormActionField
      v-model="value"
      :field="field"
      :error="error"
    />
  </div>
  <div v-else-if="isListGroup()">
    <AppFormListGroupField
      v-model="value"
      :field="field"
      :error="error"
    />
  </div>
  <div v-else>
    <AppFormDefaultField
      v-model="value"
      :field="field"
      :error="error"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { AppFormField } from '@/utils/appForm';
import AppFormRepeaterField from '@/Components/AppFormRepeaterField.vue';
import AppFormDefaultField from '@/Components/AppFormDefaultField.vue';
import AppFormDateTimeField from '@/Components/AppFormDateTimeField.vue';
import AppFormActionField from '@/Components/AppFormActionField.vue';
import AppFormListGroupField from '@/Components/AppFormListGroupField.vue';

export default defineComponent({
  components: {
    AppFormActionField,
    AppFormRepeaterField,
    AppFormDefaultField,
    AppFormDateTimeField,
    AppFormListGroupField,
  },
  props: {
    error: {
      type: String as PropType<string>,
      default: '',
    },
    field: {
      type: Object as PropType<AppFormField>,
      required: true,
    },
    modelValue: {
      type: [String, Number, Array] as PropType<string | number | []>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data(props) {
    return {
      value: props.modelValue,
    };
  },
  watch: {
    value(val) {
      this.$emit('update:modelValue', val);
    },
  },
  methods: {
    isRepeater(): boolean {
      return this.field.type === 'repeater';
    },
    isDateTime(): boolean {
      return this.field.type === 'datetime';
    },
    isAction(): boolean {
      return this.field.type === 'action';
    },
    isListGroup(): boolean {
      return this.field.type === 'list-group';
    },
  },
});
</script>
