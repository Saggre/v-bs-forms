<template>
  <div v-if="isDateTime()">
    <DateTimeField v-model="value" :field="field" :error="error" />
  </div>
  <div v-else-if="isAction()">
    <ActionField v-model="value" :field="field" :error="error" />
  </div>
  <div v-else-if="isListGroup()">
    <ListGroupField v-model="value" :field="field" :error="error" />
  </div>
  <div v-else>
    <StandardField v-model="value" :field="field" :error="error" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { FormField } from '@/use/fields';
import ActionField from '@/components/fields/Action.vue';
import StandardField from '@/components/fields/Standard.vue';
import DateTimeField from '@/components/fields/DateTime.vue';
import ListGroupField from '@/components/fields/ListGroup.vue';

export default defineComponent({
  components: {
    ActionField,
    StandardField,
    DateTimeField,
    ListGroupField,
  },
  props: {
    error: {
      type: String as PropType<string>,
      default: '',
    },
    field: {
      type: Object as PropType<FormField>,
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
