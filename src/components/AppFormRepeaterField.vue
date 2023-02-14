<template>
  <div class="w-100">
    <div
      class="mb-3"
      :class="{
        [repeater.containerClass]: !!repeater.containerClass,
      }"
    >
      <div
        :id="`repeater`"
        class="accordion mb-3"
      >
        <div
          v-for="(item, index) in value"
          :key="`${getTitle(index)}-${index}`"
          class="accordion-item"
        >
          <h2
            :id="`heading-${getTitle(index)}-${index}`"
            class="accordion-header d-flex flex-row justify-content-end"
          >
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="`#collapse-${getTitle(index)}-${index}`"
              aria-expanded="true"
              :aria-controls="`collapse-${getTitle(index)}-${index}`"
            >
              {{ getTitle(index) }}
              <button
                type="button"
                style="min-width:140px;position:absolute;right:60px;top:50%;transform:translateY(-50%);"
                class="btn btn-sm btn-danger text-uppercase"
                @click="removeRepeaterElement(index)"
              >
                {{ $t('Remove') }} <i class="bi bi-dash-lg ms-1" />
              </button>
            </button>
          </h2>
          <div
            :id="`collapse-${getTitle(index)}-${index}`"
            class="accordion-collapse collapse show"
            :aria-labelledby="`heading-${getTitle(index)}-${index}`"
            :data-bs-parent="`#${getTitle(index)}-repeater`"
          >
            <div class="accordion-body">
              <AppFormDefaultField
                v-for="(field, key) in repeater.fields"
                :key="key"
                :error="error"
                :field="field"
                model-value=""
                @update:model-value="(value) => onChange(value, index, key)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <div class="d-flex flex-row justify-content-center">
            <!-- Add button for adding repeater element -->
            <button
              type="button"
              class="btn btn-success text-uppercase"
              style="min-width:140px;"
              @click="addRepeaterElement"
            >
              {{ $t('Add new') }} <i class="bi bi-plus-lg ms-1" />
            </button>
          </div>
        </div>
      </div>
      <jet-input-error :message="error" />
    </div>
  </div>
</template>

<script lang="ts">
import JetInputError from '@/Jetstream/InputError.vue';
import { defineComponent, PropType } from 'vue';
import { AppFormData, RepeaterAppFormField } from '@/utils/appForm';
import AppFormDefaultField from '@/Components/AppFormDefaultField.vue';
// noinspection TypeScriptCheckImport

export default defineComponent({
  name: 'AppFormRepeaterField',
  components: {
    AppFormDefaultField,
    JetInputError,
  },
  props: {
    error: {
      type: String as PropType<string>,
      default: '',
    },
    repeater: {
      type: Object as PropType<RepeaterAppFormField<AppFormData>>,
      required: true,
    },
    modelValue: {
      type: Object,
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
    onChange(val: string, index: number, key: string) {
      this.value[index][key] = val;
    },
    addRepeaterElement() {
      this.value.push({});
    },
    removeRepeaterElement(index: number) {
      this.value.splice(index, 1);
    },
    getTitle(index: number) {
      return this.repeater.title(this.value[index] ?? undefined);
    },
  },
});
</script>
