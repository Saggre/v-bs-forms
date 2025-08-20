<template>
  <div
    v-for="(field, key) in fields"
    :key="key"
    :class="getClassForLevel(level, field)"
    :level="level"
  >
    <FormFieldGroup
      v-if="field && isFormFieldGroup(field)"
      :fields="field.fields"
      :form="form"
      :level="level + 1"
    >
      <!-- Form field group -->
      <template
        #before-field="//@ts-ignore
          { fieldKey, field }"
      >
        <slot name="before-field" :field-key="`${fieldKey}`" :field="field" />
      </template>
      <template
        #after-field="//@ts-ignore
           { fieldKey, field }"
      >
        <slot name="after-field" :field-key="`${fieldKey}`" :field="field" />
      </template>
    </FormFieldGroup>
    <FormFieldGroup
      v-else-if="level === 0"
      :fields="{ [key]: field }"
      :form="form"
      :level="level + 1"
    >
      <!-- Wrapped top-level field -->
      <template
        #before-field="//@ts-ignore
          { fieldKey, field }"
      >
        <slot name="before-field" :field-key="`${fieldKey}`" :field="field" />
      </template>
      <template
        #after-field="//@ts-ignore
           { fieldKey, field }"
      >
        <slot name="after-field" :field-key="`${fieldKey}`" :field="field" />
      </template>
    </FormFieldGroup>
    <div v-else :class="getFieldWrapperClass(field)">
      <!-- Input field -->
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
  <slot></slot>
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
    level: {
      type: Number as PropType<number>,
      default: 0,
    },
    form: {
      type: Object as PropType<FormDefinition>,
      required: true,
    },
    fields: {
      type: [Object] as PropType<FormInputFields>,
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
    getFieldWrapperClass(field: FormField): Record<string, boolean> {
      return (
        field?.wrapperClass ?? {
          'mb-3': true,
          'w-100': true,
        }
      );
    },
    getClassForLevel(level: number, field: FormField): Record<string, boolean> {
      switch (level) {
        case 0:
          return {
            row: true,
          };
        default:
          return (
            field?.containerClass ?? {
              col: true,
              'col-12': true,
            }
          );
      }
    },
  },
});
</script>
