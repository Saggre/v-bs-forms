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
import ActionField from '@/components/fields/Action.vue';
import StandardField from '@/components/fields/Standard.vue';
import DateTimeField from '@/components/fields/DateTime.vue';
import ListGroupField from '@/components/fields/ListGroup.vue';
import DropdownField from '@/components/fields/Dropdown.vue';
import TextareaField from '@/components/fields/Textarea.vue';
import CheckboxField from '@/components/fields/Checkbox.vue';
import FileField from '@/components/fields/File.vue';
import { ValidationResult } from '@/use/fields/base';
import { formFieldPlugin } from '@/use/plugins';

enum BaseFieldTypes {
  DateTime = 'datetime',
  Action = 'action',
  ListGroup = 'list-group',
  Dropdown = 'dropdown',
  Textarea = 'textarea',
  Checkbox = 'checkbox',
  File = 'file',
}

export default defineComponent({
  components: {
    ActionField,
    StandardField,
    DateTimeField,
    ListGroupField,
    DropdownField,
    TextareaField,
    CheckboxField,
    FileField,
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
      const plugin = formFieldPlugin
        .all()
        .find(plugin => plugin.type === this.type);

      if (plugin) {
        return plugin.component;
      }

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
        case BaseFieldTypes.Checkbox:
          return CheckboxField;
        case BaseFieldTypes.File:
          return FileField;
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
