<template>
  <div class="w-100 input-group mb-3">
    <div
      :class="{
        'flex-grow-1': true,
        'form-floating': true,
        ...containerClass,
        'is-invalid': attributes.class['is-invalid'],
        'flex-basis-0': true,
      }"
    >
      <FieldInput
        ref="root"
        v-bind="attributes"
        v-model="value"
        @change="events.onChange"
        @input="events.onInput"
        :type="showPassword ? 'text' : 'password'"
      />
      <FieldLabel :for="attributes.id" :value="field.title" />
    </div>
    <button
      v-if="field.toggleable"
      class="btn btn-dark position-relative btn--password-toggle"
      type="button"
      style="width: 58px; min-height: 58px"
      @click="togglePassword"
    >
      <span
        class="fs-2 position-absolute top-50 start-50"
        style="transform: translate(-50%, -50%)"
        >{{ showPassword ? icons.show : icons.hide }}</span
      >
    </button>
    <FieldInputError :validation="validation" />
  </div>
</template>

<style lang="css">
.btn--password-toggle:focus {
  outline: none !important;
}

.flex-basis-0 {
  flex-basis: 0 !important;
}

.input-group > .form-floating {
  min-width: auto !important;
}
</style>

<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue';
import { PasswordFormField } from '@/use/fields';
import FieldLabel from '@/components/fields/standard/Label.vue';
import FieldInput from '@/components/fields/standard/Input.vue';
import FieldInputError from '@/components/fields/standard/InputError.vue';
import BaseFormField from '@/components/fields/BaseFormField.vue';
import { useStdComponent } from '@/composables/stdComponent';

export default defineComponent({
  extends: BaseFormField,
  components: {
    FieldLabel,
    FieldInput,
    FieldInputError,
  },
  props: {
    field: {
      type: Object as PropType<PasswordFormField>,
      required: true,
    },
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
  },
  computed: {
    icons(): { show: string; hide: string } {
      return (
        this.field.toggleable?.icons ?? {
          show: '👁️',
          hide: '👁️‍🗨️',
        }
      );
    },
    containerClass() {
      let classes = {} as Record<string, boolean>;

      if (this.field.floating ?? false) {
        classes['form-floating'] = true;
      }

      if (this.field.containerClass) {
        classes = { ...classes, ...this.field.containerClass };
      }

      return classes;
    },
  },
  data() {
    return {
      showPassword: false,
    };
  },
  setup(props) {
    return useStdComponent(toRefs(props));
  },
});
</script>
