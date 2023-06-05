import { FormField } from '@/use/fields';
/**
 * Get the container class for a field.
 *
 * @param field
 */
export const getContainerClass = (field: FormField<any>): string[] => {
  const classes = ['mb-3'];

  if (field.floating ?? false) {
    classes.push('form-floating');
  }

  if (field.containerClass) {
    classes.push(field.containerClass);
  }

  return classes;
};
