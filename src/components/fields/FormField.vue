<template>
  <div>
    <component
      :is="component"
      :field="field"
      :form-key="formKey"
      :form="form"
      v-model="form.data[formKey]"
    ></component>
  </div>
</template>

<script lang="ts">
import { Component, defineComponent, PropType } from 'vue';
import ActionField from '@/components/fields/Action.vue';
import StandardField from '@/components/fields/Standard.vue';
import ListGroupField from '@/components/fields/ListGroup.vue';
import PasswordField from '@/components/fields/Password.vue';
import DropdownField from '@/components/fields/Dropdown.vue';
import TextareaField from '@/components/fields/Textarea.vue';
import NumberField from '@/components/fields/Number.vue';
import CheckboxField from '@/components/fields/Checkbox.vue';
import FileField from '@/components/fields/File.vue';
import { formFieldPlugin } from '@/use/plugins';
import { FormDefinition } from '@/use/form';

enum BaseFieldTypes {
  Date = 'date',
  Time = 'time',
  Action = 'action',
  ListGroup = 'list-group',
  Dropdown = 'dropdown',
  Password = 'password',
  Textarea = 'textarea',
  Checkbox = 'checkbox',
  File = 'file',
  Number = 'number',
}

export default defineComponent({
  components: {
    ActionField,
    StandardField,
    ListGroupField,
    DropdownField,
    NumberField,
    TextareaField,
    CheckboxField,
    FileField,
  },
  props: {
    field: {
      type: Object as PropType<any>,
      required: true,
    },
    form: {
      type: Object as PropType<FormDefinition>,
      required: true,
    },
    formKey: {
      type: String as PropType<string>,
      required: true,
    },
  },
  data() {
    return {
      BaseFieldTypes,
    };
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
        case BaseFieldTypes.Action:
          return ActionField;
        case BaseFieldTypes.ListGroup:
          return ListGroupField;
        case BaseFieldTypes.Dropdown:
          return DropdownField;
        case BaseFieldTypes.Textarea:
          return TextareaField;
        case BaseFieldTypes.Password:
          return PasswordField;
        case BaseFieldTypes.Number:
          return NumberField;
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
  },
});
</script>
