<template>
  <form
    ref="form"
    class="v-bs-form needs-validation position-relative"
    novalidate
    @submit="onSubmit"
  >
    <slot name="head" />
    <div class="row">
      <div
        v-for="(field, key) in form.fields"
        :key="key"
        :class="
          field.columnClass ?? {
            'col-12': true,
          }
        "
      >
        <FormFieldComponent
          v-if="field && isFieldVisible(field)"
          :form-key="`${key}`"
          :field="{
            ...field,
            // TODO: More robust process for default values.
            name: field && field.name ? field.name : key,
          }"
          :form="form"
        />
      </div>
    </div>
    <slot />
    <div v-if="loading" class="v-bs-form-glasspane-container">
      <slot name="glasspane">
        <div
          class="v-bs-form-glasspane position-absolute start-0 end-0 top-0 bottom-0 d-flex h-100 justify-content-center align-items-center"
        >
          <div class="spinner-border" role="status">
            <span class="visually-hidden">{{ 'Loading...' }}</span>
          </div>
        </div>
      </slot>
    </div>
  </form>
</template>

<style>
.v-bs-form-glasspane {
  background-color: rgba(255, 255, 255, 0.6);
  z-index: 9999;
}
</style>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { AbstractFormDefinition } from '@/use/form';
import FormFieldComponent from '@/components/fields/FormField.vue';
import { FormField } from '@/use/fields';

export default defineComponent({
  components: {
    FormFieldComponent,
  },
  props: {
    form: {
      type: Object as PropType<AbstractFormDefinition>,
      required: true,
    },
    resetOnCancel: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    preventDefault: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
  provide() {
    return {
      loading: this.loading,
    };
  },
  emits: ['submit', 'cancel'],
  computed: {
    htmlForm(): HTMLFormElement {
      return this.$refs.form as HTMLFormElement;
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  mounted() {
    this.form.callbacks?.onRender?.(this.form);
  },
  methods: {
    isFieldVisible(field: FormField): boolean {
      if (field.type === 'html') {
        return false;
      }

      return field.visible instanceof Function
        ? field.visible(this.form)
        : field.visible ?? true;
    },
    async onSubmit(event: Event) {
      if (this.preventDefault) {
        event.preventDefault();
      }

      this.loading = true;

      try {
        await this.form?.callbacks?.onSubmit?.(this.form);

        this.$emit('submit', this.form, this.htmlForm);
      } catch (err) {
        event.preventDefault();
      }

      this.loading = false;
    },
    async onCancel() {
      if (this.form.callbacks.onCancel) {
        this.form.callbacks.onCancel(this.form);
      }
      this.$emit('cancel', this.form, this.htmlForm);
    },
    /**
     * Can be called externally to reset the form.
     */
    reset() {
      this.htmlForm.reset();
    },
    /**
     * Can be called externally to submit the form.
     */
    submit() {
      this.htmlForm.requestSubmit();
    },
    /**
     * Can be called externally to cancel the form.
     */
    cancel() {
      if (this.resetOnCancel) {
        this.reset();
      }

      this.onCancel();
    },
  },
});
</script>
