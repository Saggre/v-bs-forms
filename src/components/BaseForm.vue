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
      :validation="
        form.accessors.errors[key]
          ? {
              valid: false,
              message: form.accessors.errors[key] ?? '',
            }
          : undefined
      "
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
import { FormDefinition } from '@/use/form';
import FormField from '@/components/fields/FormField.vue';

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
    async onSubmit() {
      if (!this.htmlForm.checkValidity()) {
        return;
      }

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
