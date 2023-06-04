<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ValidationResult } from '@/use/fields/base';
import { getContainerClass } from '@/use/fields/util';
import { FormDefinition } from '@/use/form';

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
    form: {
      type: Object as PropType<FormDefinition<any>>,
      required: false,
    },
    formKey: {
      type: String as PropType<string>,
      required: false,
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
        this.value = newData[this.formKey];
      },
      deep: true,
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
