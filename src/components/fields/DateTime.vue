<template>
  <div class="w-100">
    <div :class="containerClass">
      <FieldInput
        :id="`${field.title}-date`"
        v-model="inputDate"
        type="date"
        :class="{
          'is-invalid': !validation.valid,
          [field.class]: !!field.class,
        }"
        :placeholder="field.placeholder"
      />
      <FieldLabel :for="`${field.title}-date`" :value="field.title" />
    </div>
    <div :class="containerClass">
      <FieldInput
        :id="`${field.title}-time`"
        v-model="inputTime"
        type="time"
        :class="{
          'is-invalid': !validation.valid,
          [field.class]: !!field.class,
        }"
        :placeholder="field.placeholder"
      />
      <FieldLabel :for="`${field.title}-time`" :value="field.title" />
      <FieldInputError :validation="validation" />
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
import BaseFormField from '@/components/fields/BaseFormField.vue';

export default defineComponent({
  extends: BaseFormField,
  components: {
    FieldLabel,
    FieldInput,
    FieldInputError,
  },
  props: {
    field: {
      type: Object as PropType<DateTimeFormField>,
      required: true,
    },
  },
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

      this.value = this.field.serialize(value);
    },
    inputTime(time) {
      const value = this.internalModelValue();
      const input = moment(time, 'HH:mm');
      value.hour(input.hour());
      value.minute(input.minute());

      this.value = this.field.serialize(value);
    },
  },
  methods: {
    internalModelValue(): Moment {
      return this.field.deserialize(this.modelValue);
    },
  },
});
</script>
