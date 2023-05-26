<template>
  <div :id="form.title" class="row pb-3 overflow-visible position-relative">
    <div
      :class="visibility.sidebar ? 'col-md-4' : 'col-12'"
      v-if="!!form.title || !!form.description"
    >
      <SectionTitle>
        <template #title>
          <slot name="title">
            {{ form.title }}
          </slot>
        </template>
        <template #description>
          <slot name="description">
            <span class="small">
              {{ form.description }}
            </span>
          </slot>
        </template>
      </SectionTitle>
    </div>

    <div :class="visibility.sidebar ? 'col-md-8' : 'col-12'">
      <form
        ref="form"
        class="needs-validation position-relative"
        novalidate
        @submit.prevent="onSubmit"
      >
        <div :class="`card ${classes.card}`">
          <div class="card-body">
            <slot name="head" />
            <FormField
              v-for="(field, key) in form.fields"
              :key="key"
              :form-key="`${key}`"
              :validation="getFieldValidation(key)"
              :field="{
                ...field,
                name: field.name ?? key,
              }"
              :form="form"
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
          </div>
          <div class="card-footer d-flex justify-content-end">
            <slot name="buttons-before" />
            <slot name="buttons">
              <button
                v-if="visibility.buttons?.previous"
                class="btn btn-outline-dark text-uppercase nav-prev me-2"
                type="button"
                :disabled="loading"
                @click="cancel()"
              >
                <i class="bi bi-arrow-left me-2" />{{
                  translations.buttons?.previous
                }}
              </button>
              <button
                v-if="visibility.buttons?.next"
                class="btn btn-dark text-uppercase nav-next"
                :class="{ 'text-white-50': loading }"
                :disabled="loading"
                type="submit"
                @click="submit()"
              >
                {{ translations.buttons?.next
                }}<i class="bi bi-arrow-right ms-2" />
              </button>
            </slot>
            <slot name="buttons-after" />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import {
  FormClasses,
  FormDefinition,
  FormErrorType,
  FormTranslations,
  FormVisibility,
} from '@/use/form';
import SectionTitle from '@/components/section/SectionTitle.vue';
import { ValidationError } from '@/use/fields/base';
import FormField from '@/components/fields/FormField.vue';

type form =
  | undefined
  | {
      loading: boolean;
      submit: () => void;
      cancel: () => void;
    };

export default defineComponent({
  components: {
    SectionTitle,
    FormField,
  },
  props: {
    form: {
      type: Object as PropType<FormDefinition<any>>,
      required: true,
    },
    translations: {
      type: Object as PropType<FormTranslations>,
      default: () => ({
        buttons: {
          next: 'Finish',
          previous: 'Back',
        },
      }),
    },
    submitInternally: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    resetOnCancel: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    visibility: {
      type: Object as PropType<FormVisibility>,
      default: () => ({
        buttons: {
          next: true,
          previous: true,
        },
        sidebar: true,
      }),
    },
    classes: {
      type: Object as PropType<FormClasses>,
      default: () => ({
        card: 'shadow-sm',
      }),
    },
  },
  emits: ['submit', 'cancel'],
  computed: {
    htmlForm(): HTMLFormElement {
      return this.$refs.form as HTMLFormElement;
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  mounted() {
    this.form.callbacks?.onRender?.(this.form);
  },
  methods: {
    getFieldValidation(key: string | number): ValidationError | undefined {
      const error = this.form?.accessors?.errors?.[key] ?? null;

      if (!error) {
        return undefined;
      }

      switch (error) {
        case FormErrorType.Required:
          return {
            valid: false,
            message:
              this.translations?.errors?.[FormErrorType.Required] ??
              'This field is required',
          };
      }

      return {
        valid: false,
        message: this.form?.accessors?.errors?.[key] ?? '',
      };
    },
    async onSubmit() {
      this.loading = true;

      try {
        if (this.submitInternally) {
          await this.form?.callbacks?.onSubmit?.(this.form);
        }

        this.$emit('submit', this.form, this.htmlForm);
      } catch (err) {
        this.loading = false;
        throw err;
      }

      this.loading = false;
    },
    async onCancel() {
      if (this.form.callbacks.onCancel) {
        this.form.callbacks.onCancel(this.form);
      }
      this.$emit('cancel', this.form, this.htmlForm);
    },
    reset() {
      this.htmlForm.reset();
    },
    submit() {
      this.htmlForm.requestSubmit();
    },
    cancel() {
      if (this.resetOnCancel) {
        this.reset();
      }

      this.onCancel();
    },
  },
});
</script>
