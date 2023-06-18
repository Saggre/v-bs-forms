<template>
  <label>
    <span v-if="!!value"
      >{{ value }}<span v-if="required" class="text-danger ms-1">*</span></span
    >
    <span v-else><slot /></span>
  </label>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    value: {
      type: String as PropType<string>,
      default: '',
    },
    required: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
});
</script>
