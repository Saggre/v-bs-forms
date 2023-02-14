<template>
  <form
    ref="form"
    class="needs-validation position-relative"
    novalidate
    @submit.prevent="onSubmit"
  >
    <slot name="head" />
    <AppFormField
      v-for="(field, key) in form.fields"
      :key="key"
      v-model="form.form[key]"
      :error="form.form.errors[key]"
      :field="field"
    />
    <slot />
    <div
      v-if="loading"
      class="position-absolute start-0 end-0 top-0 bottom-0 d-flex h-100 justify-content-center align-items-center bg-muted-light"
    >
      <div
        class="spinner-border"
        role="status"
      >
        <span class="visually-hidden">{{ $t('Loading...') }}</span>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { AppForm, AppFormData } from '@/utils/appForm';
import AppFormField from '@/Components/AppFormField.vue';
import { trans } from 'laravel-vue-i18n';

const AppFormComponent = defineComponent({
  components: {
    AppFormField,
  },
  props: {
    form: {
      type: Object as PropType<AppForm<AppFormData>>,
      required: true,
    },
    submitInternally: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    timeout: {
      type: Number as PropType<number>,
      default: 10000,
    },
  },
  emits: ['submit'],
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    htmlForm(): HTMLFormElement {
      return this.$refs.form;
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
          await this.form.onSubmit(this.form);
        }

        this.$emit('submit', this.form, this.htmlForm);
      } catch (err) {
        this.loading = false;
        throw err;
      }

      this.loading = false;
    },
    submit() {
      this.htmlForm.requestSubmit();
    },
    $t: trans,
  },
});

export default AppFormComponent;
</script>
