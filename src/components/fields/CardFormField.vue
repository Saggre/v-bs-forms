<template>
  <div class="card" ref="root" v-bind="attributes">
    <div class="card-header" v-if="!!field.header">{{ field.header }}</div>
    <div class="card-body">
      <h5 class="card-title" v-if="!!field.title">
        {{ field.title
        }}<span v-if="attributes.required" class="ms-1 text-danger">*</span>
      </h5>
      <h6 class="card-subtitle mb-2 text-muted" v-if="!!field.subtitle">
        {{ field.subtitle }}
      </h6>
      <p class="card-text" v-if="!!field.description">
        {{ field.description }}
      </p>
      <slot name="body" />
    </div>
    <slot />
    <div
      class="card-footer text-muted"
      v-if="!!field.footer || !!$slots.footer"
    >
      {{ field.footer }}
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { CardFormFieldDefinition } from '@/use/fields/base';

/**
 * This is more of an abstract component, but some other components are based on it.
 */

export default defineComponent({
  props: {
    field: {
      type: Object as PropType<CardFormFieldDefinition>,
      required: true,
    },
    attributes: {
      type: Object as PropType<Record<string, unknown>>,
      default: {} as PropType<Record<string, unknown>>,
    },
  },
});
</script>
