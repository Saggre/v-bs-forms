import { BaseFormField } from '@/use/fields/base';

export type PluginField<V = string> = BaseFormField<V> & {
  type: 'plugin-field';
};
