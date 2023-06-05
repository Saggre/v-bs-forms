<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { CommonHtmlAttributes, ValidationResult } from '@/use/fields/base';
import { getContainerClass } from '@/use/fields/util';
import { FormDefinition } from '@/use/form';
import { Tooltip } from 'bootstrap';
import { useTooltip } from '@/composables/tooltip';
import { useInputEvents } from '@/composables/inputEvents';

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
        if (!this.formKey) {
          return;
        }

        this.value = newData[this.formKey];
      },
      deep: true,
    },
  },
  computed: {
    baseClass() {
      return {
        'form-control': true,
      };
    },
    containerClass(): string[] {
      return getContainerClass(this.field);
    },
    commonHtmlAttributes(): CommonHtmlAttributes {
      const field = this.field;
      return {
        class: {
          ...this.baseClass,
          'is-invalid': !this.validation.valid,
          [field.class]: !!field.class,
        },
        disabled: field.disabled || false,
        inputmode: field.inputmode || null,
        pattern: field.pattern || null,
        autocomplete: field.autocomplete || 'off',
        autofocus: field.autofocus || false,
        id: field.id || field.title,
        name: field.name || field.title,
        required: field.required || false,
      };
    },
    attributes(): object {
      return {
        ...this.commonHtmlAttributes,
        ...this.tooltipAttributes,
      };
    },
  },
  data(props) {
    return {
      value: props.modelValue,
    };
  },
  mounted() {
    this.initTooltips();
  },
  methods: {
    initTooltips() {
      const el = this.$el.querySelector('[data-bs-toggle="tooltip"]');
      if (el) {
        return new Tooltip(el);
      }
    },
  },
  setup(props) {
    const { tooltipAttributes } = useTooltip(props.field.tooltip);
    const { onChange, onInput } = useInputEvents(props.field, props.form);

    return {
      tooltipAttributes,
      onChange,
      onInput,
    };
  },
});
</script>
