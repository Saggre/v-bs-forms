<template>
  <label :class="_class">
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
    class: {
      type: String as PropType<string>,
      default: '',
    },
  },
  computed: {
    _class(): string {
      return this.class;
    },
  },
});
</script>
