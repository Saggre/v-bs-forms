import { BaseFormFieldDefinition } from '@/use/fields/base';

export type PluginField<V = string> = BaseFormFieldDefinition<V> & {
  type: 'plugin-field';
};
