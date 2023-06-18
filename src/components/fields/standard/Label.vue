<template>
  <label>
    <span v-if="!!value">{{ value }}</span>
    <span v-else><slot /></span>
  </label>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    value: {
      type: String as PropType<string>,
      value: '',
    },
  },
});
</script>
