<template>
  <div
    :id="form.title"
    class="row pb-3 overflow-visible position-relative"
  >
    <div class="col-md-4">
      <jet-section-title>
        <template #title>
          {{ form.title }}
        </template>
        <template #description>
          <span class="small">
            {{ form.description }}
          </span>
        </template>
      </jet-section-title>
    </div>

    <div class="col-md-8">
      <div class="card shadow">
        <div class="card-body">
          <AppForm
            ref="form"
            :form="form"
          >
            <template #head>
              <slot name="head" />
            </template>
            <slot />
          </AppForm>
        </div>
        <div class="card-footer d-flex justify-content-end">
          <InertiaLink
            v-if="prevButton"
            class="btn btn-outline-dark text-uppercase nav-prev me-2"
            type="button"
            :disabled="loading"
          >
            <i class="bi bi-arrow-left" />&nbsp;{{ prevText }}
          </InertiaLink>
          <button
            class="btn btn-dark text-uppercase nav-next"
            :class="{ 'text-white-50': loading }"
            :disabled="loading"
            type="submit"
            @click="$refs.form.submit()"
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
import JetSectionTitle from '@/Jetstream/SectionTitle.vue';
import { trans as $t } from 'laravel-vue-i18n';
import { AppForm } from '@/utils/appForm';
import { CrudFormType } from '@/enum/crudForm';

export default defineComponent({
  components: {
    JetSectionTitle,
  },
  props: {
    form: {
      type: Object as PropType<AppForm<any>>,
      required: true,
    },
    type: {
      type: Object as PropType<CrudFormType>,
      default: CrudFormType.CREATE,
    },
    nextText: {
      type: String as PropType<string | undefined>,
      default: $t('Finish'),
    },
    prevText: {
      type: String as PropType<string | undefined>,
      default: $t('Back'),
    },
    prevButton: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
  computed: {
    loading(): boolean {
      return this.$refs.form?.loading ?? false;
    },
  },
});
</script>
