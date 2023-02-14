<template>
  <div class="w-100">
    <div
      class="mb-3"
      :class="{
        'form-floating': field.floating,
        [field.containerClass]: !!field.containerClass,
      }"
    >
      <FieldInput
        :id="`${field.title}-date`"
        v-model="inputDate"
        type="date"
        :class="{
          'is-invalid': error,
          [field.class]: !!field.class,
        }"
        :placeholder="field.placeholder"
      />
      <FieldLabel :for="`${field.title}-date`" :value="field.title" />
    </div>
    <div
      class="mb-3"
      :class="{
        'form-floating': field.floating,
        [field.containerClass]: !!field.containerClass,
      }"
    >
      <FieldInput
        :id="`${field.title}-time`"
        v-model="inputTime"
        type="time"
        :class="{
          'is-invalid': error,
          [field.class]: !!field.class,
        }"
        :placeholder="field.placeholder"
      />
      <FieldLabel :for="`${field.title}-time`" :value="field.title" />
      <FieldInputError :message="error" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import moment, { Moment } from 'moment/moment';
import { DateTimeFormField } from '@/use/fields';
import FieldLabel from '@/components/fields/standard/Label.vue';
import FieldInput from '@/components/fields/standard/Input.vue';
import FieldInputError from '@/components/fields/standard/InputError.vue';

export default defineComponent({
  components: {
    FieldLabel,
    FieldInput,
    FieldInputError,
  },
  props: {
    error: {
      type: String as PropType<string>,
      default: '',
    },
    field: {
      type: Object as PropType<DateTimeFormField>,
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
