<template>
  <form
    ref="form"
    class="v-bs-form needs-validation position-relative"
    novalidate
    @submit="onSubmit"
  >
    <slot name="head" />
    <FormFieldGroup
      :fields="form.fields"
      :form="form"
      :group-component="groupComponent"
      :class="groupContainerClass"
    >
      <template #before-field="{ fieldKey, field }">
        <slot name="before-field" :field-key="`${fieldKey}`" :field="field" />
      </template>
      <template #after-field="{ fieldKey, field }">
        <slot name="after-field" :field-key="`${fieldKey}`" :field="field" />
      </template>
      <slot />
    </FormFieldGroup>
    <Teleport to="body" :disabled="!teleportEnabled">
      <div v-if="loading" class="v-bs-form-glasspane-container">
        <slot name="glasspane">
          <div
            class="v-bs-form-glasspane start-0 end-0 top-0 bottom-0 d-flex h-100 justify-content-center align-items-center"
            :class="{
              'position-fixed': teleportEnabled,
              'position-absolute': !teleportEnabled,
            }"
          >
            <div class="spinner-border" role="status">
              <span class="visually-hidden">{{ 'Loading...' }}</span>
            </div>
          </div>
        </slot>
      </div>
    </Teleport>
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
import { AbstractFormDefinition, isFormFieldGroup } from '@/use/form';
import FormFieldGroup from '@/components/FormFieldGroup.vue';

export default defineComponent({
  components: {
    FormFieldGroup,
  },
  props: {
    groupComponent: {
      type: [Object, String] as PropType<
        ReturnType<typeof defineComponent> | string
      >,
      default: 'div',
    },
    groupContainerClass: {
      type: Object as PropType<Record<string, boolean>>,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {
        row: true,
      },
    },
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
    teleportEnabled: {
      type: Boolean as PropType<boolean>,
      default: false,
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
    isFormFieldGroup,
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
        console.error(err);
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
      if (this.htmlForm.requestSubmit) {
        this.htmlForm.requestSubmit();
      } else {
        // Safari & Firefox compatibility.
        const submitter = document.createElement('input');
        submitter.type = 'submit';
        submitter.hidden = true;
        this.htmlForm.appendChild(submitter);
        submitter.click();
        this.htmlForm.removeChild(submitter);
      }
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
