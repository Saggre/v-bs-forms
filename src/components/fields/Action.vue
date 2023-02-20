<template>
  <div class="w-100">
    <div :class="containerClass">
      <div class="card">
        <div class="card-header" v-if="field.header">
          {{ field.header }}
        </div>
        <div class="card-body">
          <h5 class="card-title">{{ field.title }}</h5>
          <h6 class="card-subtitle mb-2 text-muted" v-if="!!field.subtitle">
            {{ field.subtitle }}
          </h6>
          <p v-if="!!field.texts.description" class="card-text">
            {{ field.texts.description }}
          </p>
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
          <div class="invalid-feedback mt-3">
            {{ validation.message }}
          </div>
        </div>
        <div class="card-footer" v-if="field.footer">
          {{ field.footer }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ActionFormField } from '@/use/fields';
import { defineComponent, PropType } from 'vue';
import BaseFormField from '@/components/fields/BaseFormField.vue';

export default defineComponent({
  extends: BaseFormField,
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
