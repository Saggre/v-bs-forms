import { Component } from 'vue';

const plugins: FormFieldPlugin[] = [];

export interface FormFieldPlugin {
  type: string;
  component: Component;
}

export const formFieldPlugin = {
  all: () => plugins,
  install: (definition: FormFieldPlugin) => {
    plugins.push(definition);
  },
};
