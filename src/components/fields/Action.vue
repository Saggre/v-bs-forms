<template>
  <div class="w-100">
    <div
      class="mb-3"
      :class="{
        'form-floating': field.floating,
        [field.containerClass]: !!field.containerClass,
      }"
    >
      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-3">
            {{ field.title }}
          </h5>
          <h6 v-if="!!field.description" class="card-subtitle mb-2 text-muted">
            {{ field.description }}
          </h6>
          <div v-if="field.isComplete()">
            <span class="text-success h4"
              >{{ $t('Authenticated') }}<i class="bi bi-check-lg h3 ms-2"
            /></span>
          </div>
          <a
            v-else
            class="btn btn-primary"
            :class="{
              'is-invalid': !!error,
            }"
            @click="field.submit()"
            >{{ field.submitTitle ? field.submitTitle() : $t('Submit') }}</a
          >
          <div class="invalid-feedback mt-3">
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ActionAppFormField } from '@/utils/appForm';

export default defineComponent({
  components: {},
  props: {
    error: {
      type: String as PropType<string>,
      default: '',
    },
    field: {
      type: Object as PropType<ActionAppFormField>,
      required: true,
    },
    modelValue: {
      type: String as PropType<string>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
});
</script>
