<template>
  <CardFormField
    :field="field"
    :class="{
      'mb-3': true,
      'border-danger': !validation.valid,
    }"
  >
    <template #default>
      <ul class="list-group list-group-flush">
        <li
          v-for="(option, key) in field.options"
          :key="key"
          href="#"
          class="list-group-item list-group-item-action pe-auto"
          :class="{ 'text-black-50': value === key }"
          @click.prevent="value = key"
        >
          <div>
            <span :class="{ 'font-weight-bold': value === key }">
              {{ option.name }}
            </span>

            <svg
              v-if="value === key"
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
        </li>
      </ul>
    </template>
    <template #footer>
      <FieldInputError :validation="validation" class="d-block" />
    </template>
  </CardFormField>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ListGroupFormField } from '@/use/fields';
import FieldInputError from '@/components/fields/standard/InputError.vue';
import BaseFormField from '@/components/fields/BaseFormField.vue';
import CardFormField from '@/components/fields/CardFormField.vue';

export default defineComponent({
  extends: BaseFormField,
  components: {
    CardFormField,
    FieldInputError,
  },
  props: {
    field: {
      type: Object as PropType<ListGroupFormField>,
      required: true,
    },
  },
});
</script>
