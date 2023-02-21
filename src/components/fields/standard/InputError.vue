<template>
  <div v-show="!valid" class="invalid-feedback" role="alert">
    <strong>{{ message }}</strong>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ValidationResult } from '@/use/fields/base.js';

export default defineComponent({
  props: {
    validation: {
      type: Object as PropType<ValidationResult>,
      required: true,
    },
  },
  computed: {
    valid(): boolean {
      return this.validation.valid;
    },
    message(): string {
      return 'message' in this.validation ? this.validation.message : '';
    },
  },
});
</script>
