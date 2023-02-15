<template>
  <div class="w-100">
    <div
      class="mb-3"
      :class="{
        'form-floating': field.floating,
        [field.containerClass]: !!field.containerClass,
      }"
    >
      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-3">
            {{ field.title }}
          </h5>
          <h6 v-if="!!field.description" class="card-subtitle mb-2 text-muted">
            {{ field.description }}
          </h6>
          <div v-if="_field.validate()">
            <span class="text-success h4"
              >{{ 'Authenticated' }}<i class="bi bi-check-lg h3 ms-2"
            /></span>
          </div>
          <a
            v-else
            class="btn btn-primary"
            :class="{
              'is-invalid': !validation.valid,
            }"
            @click="field.submit()"
            >{{ field.submitTitle ? field.submitTitle() : 'Submit' }}</a
          >
          <div class="invalid-feedback mt-3">
            {{ validation.message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ActionFormField } from '@/use/fields';
import { ValidationResult } from '@/use/fields/base';

export default defineComponent({
  components: {},
  props: {
    validation: {
      type: Object as PropType<ValidationResult>,
      required: true,
    },
    field: {
      type: Object as PropType<ActionFormField | unknown>,
      required: true,
    },
    modelValue: {
      type: String as PropType<string>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    _field(): ActionFormField {
      return this.field as ActionFormField;
    },
  },
});
</script>
