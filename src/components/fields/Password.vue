<template>
  <FieldLabel class="form-label" :for="attributes.id" :value="field.title" />
  <div class="input-group mb-3">
    <FieldInput
      ref="root"
      v-bind="attributes"
      v-model="value"
      @change="events.onChange"
      @input="events.onInput"
      :type="showPassword ? 'text' : 'password'"
    />
    <button
      v-if="field.toggleable"
      class="btn btn-dark position-relative btn--password-toggle"
      type="button"
      @click="togglePassword"
    >
      <span>{{ showPassword ? icons.show : icons.hide }}</span>
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
