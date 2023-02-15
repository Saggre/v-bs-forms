<template>
  <div v-show="!validation.valid" class="invalid-feedback" role="alert">
    <strong>{{ validation.message ?? '' }}</strong>
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
});
</script>
