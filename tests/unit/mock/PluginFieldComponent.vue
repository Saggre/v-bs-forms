<template>
  <div id="plugin-field">This is a plugin field</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { PluginField } from '@/unit/mock/plugin';

export default defineComponent({
  props: {
    field: {
      type: Object as PropType<PluginField>,
      required: true,
    },
    modelValue: {
      type: String as PropType<string>,
      required: true,
    },
  },
});
</script>
