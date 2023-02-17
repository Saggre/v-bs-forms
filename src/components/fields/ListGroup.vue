<template>
  <div class="w-100">
    <FieldLabel :for="`${field.title}-list-group`" :value="field.title" />
    <FieldInputError :validation="validation" />
    <div class="list-group mb-3">
      <a
        v-for="(option, key) in field.options"
        :key="key"
        href="#"
        class="list-group-item list-group-item-action"
        :class="{ 'text-black-50': isSelected(key) }"
        @click.prevent="onSelect(key, option)"
      >
        <div>
          <span :class="{ 'font-weight-bold': isSelected(key) }">
            {{ option.name }}
          </span>

          <svg
            v-if="isSelected(key)"
            class="ms-1 text-success font-weight-light"
            width="20"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style="transform: translateY(-1px)"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div class="mt-2">
          {{ option.description }}
        </div>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ListGroupFormField, ListItem } from '@/use/fields';
import FieldLabel from '@/components/fields/standard/Label.vue';
import FieldInputError from '@/components/fields/standard/InputError.vue';
import { ValidationResult } from '@/use/fields/base';

export default defineComponent({
  components: {
    FieldLabel,
    FieldInputError,
  },
  props: {
    validation: {
      type: Object as PropType<ValidationResult>,
      default: undefined,
    },
    field: {
      type: Object as PropType<ListGroupFormField | unknown>,
      required: true,
    },
    modelValue: {
      type: String as PropType<string>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      selected: null as string | null,
    };
  },
  methods: {
    onSelect(key: string, item: ListItem) {
      this.selected = key;
      this.$emit('update:modelValue', key);
    },
    isSelected(key: string): boolean {
      return this.selected === key;
    },
  },
  computed: {
    _field(): ListGroupFormField {
      return this.field as ListGroupFormField;
    },
  },
});
</script>
