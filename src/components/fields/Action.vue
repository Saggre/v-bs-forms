<template>
  <CardFormField
    :field="field"
    :class="{
      'mb-3': true,
      'border-danger': !validation.valid,
    }"
    :id="attributes.id"
    :attributes="{
      'data-bs-toggle': attributes['data-bs-toggle'],
      'data-bs-placement': attributes['data-bs-placement'],
      title: attributes['title'],
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
        @click.prevent="onSubmit"
        >{{ field.texts.submit }}</a
      >
    </template>
    <template #footer v-if="!validation.valid">
      <FieldInputError :validation="validation" class="d-block" />
    </template>
  </CardFormField>
</template>

<script lang="ts">
import { ActionFormField } from '@/use/fields';
import { defineComponent, PropType, toRefs } from 'vue';
import BaseFormField from '@/components/fields/BaseFormField.vue';
import FieldInputError from '@/components/fields/standard/InputError.vue';
import CardFormField from '@/components/fields/CardFormField.vue';
import { useStdComponent } from '@/composables/stdComponent';

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
  data() {
    return {
      value: this.field.validate().valid,
    };
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
  setup(props) {
    return useStdComponent(toRefs(props));
  },
});
</script>
