<template>
  <div class="row">
    <div
      v-for="(field, key) in fields"
      :key="key"
      :class="field?.columnClass ?? {}"
    >
      <component :is="groupComponent" v-if="isFormFieldGroup(field)">
        <FormFieldGroup :fields="field.fields" :form="form"></FormFieldGroup>
      </component>
      <div v-else>
        <slot name="before-field" :field-key="`${key}`" :field="field" />
        <FormFieldComponent
          v-if="field && isFieldVisible(field)"
          :form-key="`${key}`"
          :field="{
            ...field,
            // TODO: More robust process for default values.
            name: field && field.name ? field.name : key,
          }"
          :form="form"
        />
        <slot name="after-field" :field-key="`${key}`" :field="field" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { FormDefinition, FormInputFields, isFormFieldGroup } from '@/use/form';
import FormFieldComponent from '@/components/fields/FormField.vue';
import { FormField } from '@/use/fields';

export default defineComponent({
  name: 'form-field-group',
  components: {
    FormFieldComponent,
  },
  props: {
    groupComponent: {
      type: [Object, String] as PropType<
        ReturnType<typeof defineComponent> | string
      >,
      default: 'div',
    },
    form: {
      type: Object as PropType<FormDefinition<any>>,
      required: true,
    },
    fields: {
      type: [Object] as PropType<FormInputFields<any>>,
      required: true,
    },
  },
  methods: {
    isFormFieldGroup,
    isFieldVisible(field: FormField): boolean {
      if (field.type === 'html') {
        return false;
      }

      return field.visible instanceof Function
        ? field.visible(this.form)
        : field.visible ?? true;
    },
  },
});
</script>
