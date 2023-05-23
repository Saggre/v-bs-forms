<template>
  <div class="w-100 input-group mb-3">
    <div :class="`flex-grow-1 form-floating ${field.containerClass}`">
      <FieldInput
        :id="field.id ?? field.title"
        :autocomplete="field.autocomplete || 'off'"
        :autofocus="field.autofocus || false"
        :inputmode="field.inputmode || null"
        :pattern="field.pattern || null"
        :disabled="field.disabled || false"
        :name="field.name ?? field.title"
        :required="field.required || false"
        v-model="value"
        @change="onChange"
        @input="onInput"
        :type="showPassword ? 'text' : 'password'"
        :class="{
          'is-invalid': !validation.valid,
          [field.class]: !!field.class,
        }"
        :placeholder="placeholder"
      />
      <FieldLabel :for="field.id ?? field.title" :value="field.title" />
      <FieldInputError :validation="validation" />
    </div>
    <button
      v-if="field.toggleable"
      class="btn btn-outline-dark position-relative btn--password-toggle"
      type="button"
      style="width: 58px"
      @click="togglePassword"
    >
      <span
        class="fs-2 position-absolute top-50 start-50"
        style="transform: translate(-50%, -50%)"
        >{{ showPassword ? '🙉' : '🙈' }}</span
      >
    </button>
  </div>
</template>

<style lang="css">
.btn--password-toggle:focus {
  outline: none !important;
}
</style>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { PasswordFormField } from '@/use/fields';
import FieldLabel from '@/components/fields/standard/Label.vue';
import FieldInput from '@/components/fields/standard/Input.vue';
import FieldInputError from '@/components/fields/standard/InputError.vue';
import BaseFormField from '@/components/fields/BaseFormField.vue';

export default defineComponent({
  extends: BaseFormField,
  components: {
    FieldLabel,
    FieldInput,
    FieldInputError,
  },
  props: {
    field: {
      type: Object as PropType<PasswordFormField>,
      required: true,
    },
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    onChange(event: Event) {
      const element = event.target as HTMLInputElement;

      if (this.field.onChange) {
        this.field.onChange(element.value);
      }
    },
    onInput(event: Event) {
      const element = event.target as HTMLInputElement;

      if (this.field.onInput) {
        this.field.onInput(element.value);
      }
    },
  },
  data() {
    return {
      showPassword: false,
    };
  },
  computed: {
    placeholder(): string {
      if (this.field.placeholder) {
        return this.field.placeholder;
      }

      if (this.field.floating) {
        return this.field.title;
      }

      return '';
    },
  },
});
</script>
