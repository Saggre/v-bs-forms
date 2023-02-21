<template>
  <div :id="form.title" class="row pb-3 overflow-visible position-relative">
    <div class="col-md-4">
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

    <div class="col-md-8">
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
            v-if="prevButton"
            class="btn btn-outline-dark text-uppercase nav-prev me-2"
            type="button"
            :disabled="loading"
            @click="cancel()"
          >
            <i class="bi bi-arrow-left" />&nbsp;{{ prevText }}
          </button>
          <button
            class="btn btn-dark text-uppercase nav-next"
            :class="{ 'text-white-50': loading }"
            :disabled="loading"
            type="submit"
            @click="submit()"
          >
            {{ nextText }}&nbsp;<i class="bi bi-arrow-right" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Form } from '@/use/form';
import SectionTitle from '@/components/section/SectionTitle.vue';
import BaseForm from '@/components/BaseForm.vue';

type _Form =
  | undefined
  | {
      loading: boolean;
      submit: () => void;
      cancel: () => void;
    };

export default defineComponent({
  components: {
    SectionTitle,
    BaseForm,
  },
  props: {
    form: {
      type: Object as PropType<Form<any>>,
      required: true,
    },
    nextText: {
      type: String as PropType<string>,
      default: 'Finish',
    },
    prevText: {
      type: String as PropType<string>,
      default: 'Back',
    },
    prevButton: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
  computed: {
    _form(): _Form {
      return this.form as unknown as _Form;
    },
    loading(): boolean {
      return this._form?.loading ?? false;
    },
  },
  methods: {
    submit() {
      this._form?.submit();
    },
    cancel() {
      this._form?.cancel();
    },
  },
});
</script>
