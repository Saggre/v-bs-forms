<template>
  <div>
    <DateTimeField
      v-if="type === BaseFieldTypes.DateTime"
      v-model="value"
      :field="field"
      :validation="_validation"
    />
    <ActionField
      v-else-if="type === BaseFieldTypes.Action"
      v-model="value"
      :field="field"
      :validation="_validation"
    />
    <ListGroupField
      v-else-if="type === BaseFieldTypes.ListGroup"
      v-model="value"
      :field="field"
      :validation="_validation"
    />
    <DropdownField
      v-else-if="type === BaseFieldTypes.Dropdown"
      v-model="value"
      :field="field"
      :validation="_validation"
    />
    <TextareaField
      v-else-if="type === BaseFieldTypes.Textarea"
      v-model="value"
      :field="field"
      :validation="_validation"
    />
    <StandardField
      v-else
      v-model="value"
      :field="field"
      :validation="_validation"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
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
      BaseFieldTypes,
    };
  },
  watch: {
    value(val) {
      this.$emit('update:modelValue', val);
    },
  },
  computed: {
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
