<template>
  <div>
    <component
      :is="component"
      :field="field"
      :validation="_validation"
      v-model="value"
    ></component>
  </div>
</template>

<script lang="ts">
import { Component, defineComponent, PropType } from 'vue';
import { FormField } from '@/use/fields';
import ActionField from '@/components/fields/Action.vue';
import StandardField from '@/components/fields/Standard.vue';
import DateTimeField from '@/components/fields/DateTime.vue';
import ListGroupField from '@/components/fields/ListGroup.vue';
import DropdownField from '@/components/fields/Dropdown.vue';
import TextareaField from '@/components/fields/Textarea.vue';
import { ValidationResult } from '@/use/fields/base';

enum BaseFieldTypes {
  DateTime = 'datetime',
  Action = 'action',
  ListGroup = 'list-group',
  Dropdown = 'dropdown',
  Textarea = 'textarea',
}

export default defineComponent({
  components: {
    ActionField,
    StandardField,
    DateTimeField,
    ListGroupField,
    DropdownField,
    TextareaField,
  },
  props: {
    validation: {
      type: Object as PropType<ValidationResult | undefined>,
      default: undefined,
    },
    field: {
      type: Object as PropType<any>,
      required: true,
    },
    modelValue: {
      type: [String, Number, Array, Boolean] as PropType<
        string | number | [] | boolean
      >,
      required: false,
    },
  },
  emits: ['update:modelValue'],
  data(props) {
    return {
      value: props.modelValue,
      BaseFieldTypes,
    };
  },
  watch: {
    value(val) {
      this.$emit('update:modelValue', val);
    },
  },
  computed: {
    component(): Component {
      switch (this.type) {
        case BaseFieldTypes.DateTime:
          return DateTimeField;
        case BaseFieldTypes.Action:
          return ActionField;
        case BaseFieldTypes.ListGroup:
          return ListGroupField;
        case BaseFieldTypes.Dropdown:
          return DropdownField;
        case BaseFieldTypes.Textarea:
          return TextareaField;
        default:
          return StandardField;
      }
    },
    type() {
      return this.field.type;
    },
    _validation(): ValidationResult {
      return (
        this.validation ?? {
          valid: true,
        }
      );
    },
  },
});
</script>
