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
    'form.accessors.data': {
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
    containerClass() {
      let classes = { 'mb-3': true } as Record<string, boolean>;

      if (this.field.containerClass) {
        classes = { ...classes, ...this.field.containerClass };
      }

      return classes;
    },
  },
  data(props) {
    return {
      value: props.modelValue as any,
    };
  },
});
</script>
