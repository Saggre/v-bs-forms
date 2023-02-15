<template>
  <div class="w-100">
    <FieldLabel :for="`${field.title}-list-group`" :value="field.title" />
    <FieldInputError :validation="validation" />
    <div class="list-group">
      <a
        v-for="item in field.items"
        :key="item.key"
        href="#"
        class="list-group-item list-group-item-action"
        :class="{ 'text-black-50': isSelected(item) }"
        @click.prevent="onSelect(item)"
      >
        <div>
          <span :class="{ 'font-weight-bold': isSelected(item) }">
            {{ item.name }}
          </span>

          <svg
            v-if="isSelected(item)"
            class="ms-1 text-success font-weight-light"
            width="20"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div class="mt-2">
          {{ item.description }}
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
      selected: this.field.items[0] ?? null,
    };
  },
  methods: {
    onSelect(item: ListItem) {
      this.selected = item;
      this.$emit('update:modelValue', item.key);
    },
    isSelected(item: ListItem) {
      return this.selected && this.selected.key === item.key;
    },
  },
});
</script>
