<template>
  <div class="w-100">
    <div
      class="mb-3"
      :class="{
        'form-floating': field.floating,
        [field.containerClass]: !!field.containerClass,
      }"
    >
      <div class="card" :key="key">
        <div class="card-header" v-if="_field.header">
          {{ _field.header }}
        </div>
        <div class="card-body">
          <h5 class="card-title">{{ _field.title }}</h5>
          <h6 class="card-subtitle mb-2 text-muted" v-if="!!_field.subtitle">
            {{ _field.subtitle }}
          </h6>
          <p v-if="!!_field.texts.description" class="card-text">
            {{ _field.texts.description }}
          </p>
          <div v-if="valid">
            <span class="text-success h4"
              >{{ _field.texts.success }}<i class="bi bi-check-lg h3 ms-2"
            /></span>
          </div>
          <a
            v-else
            class="btn btn-primary"
            :class="{
              'is-invalid': !validation.valid,
            }"
            @click="onSubmit"
            >{{ _field.texts.submit }}</a
          >
          <div class="invalid-feedback mt-3">
            {{ validation.message }}
          </div>
        </div>
        <div class="card-footer" v-if="_field.footer">
          {{ _field.footer }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, PropType } from "vue";
import { ActionFormField } from '@/use/fields';
import { ValidationResult } from '@/use/fields/base';

export default defineComponent({
  components: {},
  props: {
    validation: {
      type: Object as PropType<ValidationResult>,
      required: true,
    },
    field: {
      type: Object as PropType<ActionFormField | unknown>,
      required: true,
    },
    modelValue: {
      type: String as PropType<string>,
      required: true,
    },
  },
  data() {
    return {
      key: 0,
    };
  },
  emits: ['update:modelValue'],
  computed: {
    _field(): ActionFormField {
      return this.field as ActionFormField;
    },
    valid(): boolean {
      return this._field.validate().valid;
    },
  },
  methods: {
    onSubmit() {
      this._field.onSubmit();
      this.key++;
    },
  },
});
</script>
