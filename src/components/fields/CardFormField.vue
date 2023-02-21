<template>
  <div class="card">
    <div class="card-header" v-if="!!field.header">{{ field.header }}</div>
    <div class="card-body">
      <h5 class="card-title" v-if="!!field.title">{{ field.title }}</h5>
      <h6 class="card-subtitle mb-2 text-muted" v-if="!!field.subtitle">
        {{ field.subtitle }}
      </h6>
      <p class="card-text" v-if="!!field.description">
        {{ field.description }}
      </p>
      <slot name="body" />
    </div>
    <slot />
    <div class="card-footer text-muted" v-if="!!field.footer">
      {{ field.footer }}
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import BaseFormField from '@/components/fields/BaseFormField.vue';
import { CardFormFieldDefinition } from '@/use/fields/base';

export default defineComponent({
  extends: BaseFormField,
  props: {
    field: {
      type: Object as PropType<CardFormFieldDefinition>,
      required: true,
    },
  },
});
</script>
