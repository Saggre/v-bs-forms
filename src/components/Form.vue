<template>
  <div :id="form.title" class="row pb-3 overflow-visible position-relative">
    <div
      :class="visibility.sidebar ? 'col-md-4' : 'col-12'"
      v-if="!!form.title || !!form.description"
    >
      <SectionTitle>
        <template #title>
          {{ form.title }}
        </template>
        <template #description>
          <span class="small">
            {{ form.description }}
          </span>
        </template>
      </SectionTitle>
    </div>

    <div :class="visibility.sidebar ? 'col-md-8' : 'col-12'">
      <div class="card shadow">
        <div class="card-body">
          <BaseForm ref="form" :form="form">
            <template #head>
              <slot name="head" />
            </template>
            <slot />
          </BaseForm>
        </div>
        <div class="card-footer d-flex justify-content-end">
          <button
            v-if="visibility.buttons.previous"
            class="btn btn-outline-dark text-uppercase nav-prev me-2"
            type="button"
            :disabled="loading"
            @click="cancel()"
          >
            <i class="bi bi-arrow-left" />&nbsp;{{
              translations.buttons.previous
            }}
          </button>
          <button
            v-if="visibility.buttons.next"
            class="btn btn-dark text-uppercase nav-next"
            :class="{ 'text-white-50': loading }"
            :disabled="loading"
            type="submit"
            @click="submit()"
          >
            {{ translations.buttons.next }}&nbsp;<i class="bi bi-arrow-right" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { FormDefinition } from '@/use/form';
import SectionTitle from '@/components/section/SectionTitle.vue';
import BaseForm from '@/components/BaseForm.vue';

type _Form =
  | undefined
  | {
      loading: boolean;
      submit: () => void;
      cancel: () => void;
    };

interface FormButtons<T> {
  next: T;
  previous: T;
}

export interface FormTranslations {
  buttons: FormButtons<string>;
}

export interface FormVisibility {
  buttons: FormButtons<boolean>;
  sidebar: boolean;
}

export default defineComponent({
  components: {
    SectionTitle,
    BaseForm,
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
  },
  computed: {
    loading(): boolean {
      return this.getForm()?.loading ?? false;
    },
  },
  methods: {
    getForm(): _Form {
      return this.$refs.form as unknown as _Form;
    },
    submit() {
      this.getForm()?.submit();
    },
    cancel() {
      this.getForm()?.cancel();
    },
  },
});
</script>
