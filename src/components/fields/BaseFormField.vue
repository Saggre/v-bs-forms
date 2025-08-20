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
      type: Object as PropType<FormDefinition>,
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
  computed: {},
  data(props) {
    return {
      value: props.modelValue as any,
    };
  },
});
</script>
