<template>
  <div>
    <div
      v-for="(field, key) in fields"
      :key="key"
      :class="
        field?.wrapperClass ?? {
          col: true,
          'col-12': true,
        }
      "
    >
      <component
        :is="groupComponent"
        :class="
          field?.containerClass ?? {
            row: true,
          }
        "
        v-if="field && isFormFieldGroup(field)"
      >
        <FormFieldGroup :fields="field.fields" :form="form">
          <template
            #before-field="//@ts-ignore
          { fieldKey, field }"
          >
            <slot
              name="before-field"
              :field-key="`${fieldKey}`"
              :field="field"
            />
          </template>
          <template
            #after-field="//@ts-ignore
           { fieldKey, field }"
          >
            <slot
              name="after-field"
              :field-key="`${fieldKey}`"
              :field="field"
            />
          </template>
        </FormFieldGroup>
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
    <slot></slot>
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
  },
});
</script>
