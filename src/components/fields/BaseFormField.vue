<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ValidationResult } from '@/use/fields/base';
import { getContainerClass } from '@/use/fields/util';

export default defineComponent({
  props: {
    validation: {
      type: Object as PropType<ValidationResult>,
      default: {
        valid: true,
      } as ValidationResult,
    },
    field: {
      type: Object as PropType<any>,
      required: true,
    },
    modelValue: {
      default: undefined,
    },
  },
  emits: ['update:modelValue'],
  watch: {
    value(val) {
      this.$emit('update:modelValue', val);
    },
  },
  computed: {
    containerClass(): string[] {
      return getContainerClass(this.field);
    },
  },
  data(props) {
    return {
      value: props.modelValue,
    };
  },
});
</script>
