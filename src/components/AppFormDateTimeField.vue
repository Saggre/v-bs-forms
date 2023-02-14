<template>
  <div class="w-100">
    <div
      class="mb-3"
      :class="{
        'form-floating': field.floating,
        [field.containerClass]: !!field.containerClass,
      }"
    >
      <jet-input
        :id="`${field.title}-date`"
        v-model="inputDate"
        type="date"
        :class="{
          'is-invalid': error,
          [field.class]: !!field.class,
        }"
        :placeholder="field.placeholder"
      />
      <jet-label
        :for="`${field.title}-date`"
        :value="field.title"
      />
    </div>
    <div
      class="mb-3"
      :class="{
        'form-floating': field.floating,
        [field.containerClass]: !!field.containerClass,
      }"
    >
      <jet-input
        :id="`${field.title}-time`"
        v-model="inputTime"
        type="time"
        :class="{
          'is-invalid': error,
          [field.class]: !!field.class,
        }"
        :placeholder="field.placeholder"
      />
      <jet-label
        :for="`${field.title}-time`"
        :value="field.title"
      />
      <jet-input-error :message="error" />
    </div>
  </div>
</template>

<script lang="ts">
import JetInput from '@/Jetstream/Input.vue';
import JetInputError from '@/Jetstream/InputError.vue';
import JetLabel from '@/Jetstream/Label.vue';
import { defineComponent, PropType } from 'vue';
import { DateTimeAppFormField } from '@/utils/appForm';
import moment, { Moment } from 'moment';

export default defineComponent({
  components: {
    JetInput,
    JetInputError,
    JetLabel,
  },
  props: {
    error: {
      type: String as PropType<string>,
      default: '',
    },
    field: {
      type: Object as PropType<DateTimeAppFormField>,
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
      inputDate: this.internalModelValue().format('YYYY-MM-DD'),
      inputTime: this.internalModelValue().format('HH:mm'),
    };
  },
  watch: {
    inputDate(date) {
      const value = this.internalModelValue();
      const input = moment(date, 'YYYY-MM-DD');
      value.year(input.year());
      value.month(input.month());
      value.date(input.date());

      this.$emit('update:modelValue', this.field.submitTransform(value));
    },
    inputTime(time) {
      const value = this.internalModelValue();
      const input = moment(time, 'HH:mm');
      value.hour(input.hour());
      value.minute(input.minute());

      this.$emit('update:modelValue', this.field.submitTransform(value));
    },
  },
  methods: {
    internalModelValue(): Moment {
      return this.field.renderTransform(this.modelValue);
    },
  },
});
</script>
