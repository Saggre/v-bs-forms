<template>
  <div v-if="isRegular()">
    <div class="w-100">
      <div
        class="mb-3"
        :class="{
          'form-floating': field.floating,
          [field.containerClass]: !!field.containerClass,
        }"
      >
        <FieldInput
          :id="field.title"
          v-model="value"
          :type="field.type"
          :class="{
            'is-invalid': error,
            [field.class]: !!field.class,
          }"
          :placeholder="field.placeholder"
        />
        <FieldLabel :for="field.title" :value="field.title" />
        <FieldInputError :message="error" />
      </div>
    </div>
  </div>
  <div v-else-if="isDropdown()">
    <div class="w-100">
      <div
        class="mb-3"
        :class="{
          'form-floating': field.floating,
          [field.containerClass]: !!field.containerClass,
        }"
      >
        <select
          :id="field.title"
          v-model="value"
          class="form-select"
          :class="{
            'is-invalid': error,
            [field.class]: !!field.class,
          }"
        >
          <option
            v-for="(option, key) in field.options"
            :key="key"
            :value="key"
            :selected="value === option"
          >
            {{ option }}
          </option>
        </select>
        <FieldLabel :for="field.title" :value="field.title" />
        <FieldInputError :message="error" />
      </div>
    </div>
  </div>
  <div v-else-if="isTextarea()">
    <div class="w-100">
      <div
        class="mb-3"
        :class="{
          'form-floating': field.floating,
          [field.containerClass]: !!field.containerClass,
        }"
      >
        <textarea
          :id="field.title"
          v-model="value"
          class="form-control"
          :class="{
            'is-invalid': error,
            [field.class]: !!field.class,
          }"
          :rows="field.rows ?? 3"
        />
        <FieldLabel :for="field.title" :value="field.title" />
        <FieldInputError :message="error" />
      </div>
    </div>
  </div>
  <div v-else-if="isMultiselect()">
    <div class="w-100">
      <div
        class="mb-3"
        :class="{
          'form-floating': field.floating,
          [field.containerClass]: !!field.containerClass,
        }"
      >
        <VueMultiselect
          :id="field.title"
          v-model="value"
          :options="field.options"
          :class="{
            'is-invalid': error,
            'multiselect--empty': value.length === 0,
            [field.class]: !!field.class,
          }"
          :multiple="field.multiple ?? true"
          :searchable="field.searchable ?? false"
          :custom-label="field.label"
          :placeholder="field.placeholder ?? $t('Select one or more options')"
          :select-label="$t('Press enter to select')"
          :select-group-label="$t('Press enter to select group')"
          :selected-label="$t('Selected')"
          :deselect-label="$t('Press enter to remove')"
          :deselect-group-label="$t('Press enter to deselect group')"
          @input="$emit('update:modelValue', $event.target.value)"
        />
        <FieldLabel :for="field.title" :value="field.title" />
        <FieldInputError :message="error" />
      </div>
    </div>
  </div>
  <div v-else-if="isSubmit()">
    <div class="w-100">
      <div
        class="mb-3"
        :class="{
          [field.containerClass]: !!field.containerClass,
        }"
      >
        <button
          class="btn btn-dark text-uppercase nav-next"
          :class="{
            'text-white-50': field.loading || false,
            [field.class]: !!field.class,
          }"
          :disabled="field.loading ?? false"
          type="submit"
        >
          {{ field.title
          }}<i v-if="!!field.icon" :class="`ms-3 ${field.icon || ''}`" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { FormField } from '@/use/fields';
import FieldLabel from '@/components/fields/standard/Label.vue';
import FieldInput from '@/components/fields/standard/Input.vue';
import FieldInputError from '@/components/fields/standard/InputError.vue';

export default defineComponent({
  components: {
    FieldLabel,
    FieldInput,
    FieldInputError,
  },
  props: {
    error: {
      type: String as PropType<string>,
      default: '',
    },
    field: {
      type: Object as PropType<FormField>,
      required: true,
    },
    modelValue: {
      type: [String, Number, Array] as PropType<string | number | []>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data(props) {
    return {
      value: props.modelValue,
    };
  },
  watch: {
    value(val) {
      this.$emit('update:modelValue', val);
    },
  },
  methods: {
    isRegular(): boolean {
      return [
        'text',
        'date',
        'number',
        'time',
        'email',
        'tel',
        'url',
        'password',
        'hidden',
      ].includes(this.field.type);
    },
    isTextarea(): boolean {
      return this.field.type === 'textarea';
    },
    isDropdown(): boolean {
      return this.field.type === 'dropdown';
    },
    isMultiselect(): boolean {
      return this.field.type === 'multiselect';
    },
    isSubmit(): boolean {
      return this.field.type === 'submit';
    },
  },
});
</script>
