<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { FormDefinition } from '@/use/form';

export default defineComponent({
  props: {
    field: {
      type: Object as PropType<any>,
      required: true,
    },
    form: {
      type: Object as PropType<FormDefinition<any>>,
      required: true,
    },
    formKey: {
      type: String as PropType<string>,
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
    'form.data': {
      handler(newData) {
        if (!this.formKey) {
          return;
        }

        this.value = newData[this.formKey];
      },
      deep: true,
    },
  },
  computed: {
    wrapperClass(): Record<string, boolean> {
      return (
        this.field.wrapperClass ?? {
          'mb-3': true,
        }
      );
    },
  },
  data(props) {
    return {
      value: props.modelValue as any,
    };
  },
});
</script>
