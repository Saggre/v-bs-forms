<template>
  <CardFormField
    :field="field"
    :class="{
      'mb-3': true,
      'border-danger': !validation.valid,
    }"
  >
    <template #body>
      <div v-if="value">
        <span class="text-success h4"
          >{{ field.texts.success }}<i class="bi bi-check-lg h3 ms-2"
        /></span>
      </div>
      <a
        v-else
        class="btn btn-primary"
        :class="{
          'is-invalid': !validation.valid,
        }"
        @click="onSubmit"
        >{{ field.texts.submit }}</a
      >
    </template>
    <template #footer>
      <FieldInputError :validation="validation" class="d-block" />
    </template>
  </CardFormField>
</template>

<script lang="ts">
import { ActionFormField } from '@/use/fields';
import { defineComponent, PropType } from 'vue';
import BaseFormField from '@/components/fields/BaseFormField.vue';
import FieldInputError from '@/components/fields/standard/InputError.vue';
import CardFormField from '@/components/fields/CardFormField.vue';

export default defineComponent({
  extends: BaseFormField,
  components: {
    CardFormField,
    FieldInputError,
  },
  props: {
    field: {
      type: Object as PropType<ActionFormField>,
      required: true,
    },
  },
  methods: {
    onSubmit() {
      this.field.onSubmit();
      this.checkValid();
    },
    checkValid() {
      this.value = this.field.validate().valid;
    },
  },
});
</script>
