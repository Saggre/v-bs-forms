<template>
  <form
    ref="form"
    class="needs-validation position-relative"
    novalidate
    @submit.prevent="onSubmit"
  >
    <slot name="head" />
    <FormField
      v-for="(field, key) in form.fields"
      :key="key"
      v-model="form.accessors.data[key]"
      :validation="getFieldValidation(key)"
      :field="field"
    />
    <slot />
    <div
      v-if="loading"
      class="position-absolute start-0 end-0 top-0 bottom-0 d-flex h-100 justify-content-center align-items-center"
      style="background-color: rgba(255, 255, 255, 0.6)"
    >
      <div class="spinner-border" role="status">
        <span class="visually-hidden">{{ 'Loading...' }}</span>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { FormDefinition, FormErrorType } from '@/use/form';
import FormField from '@/components/fields/FormField.vue';
import { ValidationError } from '@/use/fields/base';
import { FormTranslations } from '@/components/Form.vue';

export default defineComponent({
  components: {
    FormField,
  },
  props: {
    form: {
      type: Object as PropType<FormDefinition<any>>,
      required: true,
    },
    submitInternally: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    translations: {
      type: Object as PropType<FormTranslations>,
      default: () => ({
        buttons: {
          next: 'Finish',
          previous: 'Back',
        },
      }),
    },
  },
  emits: ['submit', 'cancel'],
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    htmlForm(): HTMLFormElement {
      return this.$refs.form as HTMLFormElement;
    },
    _form(): FormDefinition<any> {
      return this.form as FormDefinition<any>;
    },
  },
  methods: {
    getFieldValidation(key: string | number): ValidationError | undefined {
      const error = this._form.accessors.errors[key] ?? null;

      if (!error) {
        return undefined;
      }

      switch (error) {
        case FormErrorType.Required:
          return {
            valid: false,
            message:
              this.translations?.errors?.[FormErrorType.Required] ??
              'This field is required',
          };
      }

      return {
        valid: false,
        message: this._form.accessors.errors[key] ?? '',
      };
    },
    async onSubmit() {
      this.loading = true;

      try {
        if (this.submitInternally) {
          await this._form.callbacks.onSubmit(this._form);
        }

        this.$emit('submit', this.form, this.htmlForm);
      } catch (err) {
        this.loading = false;
        throw err;
      }

      this.loading = false;
    },
    async onCancel() {
      if (this._form.callbacks.onCancel) {
        this._form.callbacks.onCancel(this._form);
      }
      this.$emit('cancel', this._form, this.htmlForm);
    },
    submit() {
      this.htmlForm.requestSubmit();
    },
    cancel() {
      this.htmlForm.reset();
      this.onCancel();
    },
  },
});
</script>
