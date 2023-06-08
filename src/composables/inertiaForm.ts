import { FormDataDefinition, ValidationError } from '@/use/fields/base';
import {
  FormAccessorData,
  FormAccessorErrors,
  FormDefinition,
  PartialFormDefinition,
} from '@/use/form';
import { Errors, VisitOptions } from '@inertiajs/core/types/types';
import { router } from '@inertiajs/core';
import { useForm } from '@/composables/form';

type CustomVisitOptions<T extends FormDataDefinition> = {
  submitTransform?: (data: FormAccessorData<T>) => FormAccessorData<T>;
};

export interface VisitRouter {
  visit: (url: string | URL, options?: VisitOptions) => void;
}

let inertiaRouter: VisitRouter;

export const setInertiaRouter = (router: VisitRouter) => {
  inertiaRouter = router;
};

export const getInertiaRouter = (): VisitRouter => inertiaRouter ?? router;

/**
 * Submit an Inertia form and mirror response data to the actual form.
 *
 * @param form
 * @param url
 * @param visitOptions
 */
const submitInertiaForm = async <T extends FormDataDefinition>(
  form: FormDefinition<T>,
  url: string | URL,
  visitOptions: VisitOptions & CustomVisitOptions<T>,
) => {
  await new Promise<void>((resolve, reject) => {
    getInertiaRouter().visit(url, {
      data: (visitOptions.submitTransform?.(form.accessors.data) ??
        form.accessors.data) as {},
      preserveState: true,
      ...visitOptions,
      onError: (errors: Errors) => {
        const errorObjects = Object.fromEntries(
          Object.entries(errors).map(([key, message]) => [
            key,
            {
              valid: false,
              message,
            } as ValidationError,
          ]),
        ) as FormAccessorErrors<T>;
        visitOptions?.onError?.(errors);
        reject(errorObjects);
      },
      onSuccess: (page: any) => {
        form.accessors.errors = {};
        visitOptions?.onSuccess?.(page);
        resolve();
      },
      onFinish: (visit: any) => {
        visitOptions?.onFinish?.(visit);
        resolve();
      },
    });
  });
};

/**
 * Helper function for creating a form that submits with Inertia.
 *
 * @param url
 * @param visitOptions
 * @param formDefinition
 */
export const useInertiaForm = <T extends FormDataDefinition>(
  url: (string | URL) | ((form: FormDefinition<T>) => string | URL),
  visitOptions: VisitOptions & CustomVisitOptions<T>,
  formDefinition: PartialFormDefinition<T>,
): FormDefinition<T> => {
  const form = useForm<T>(formDefinition);
  const onSubmit = form.callbacks.onSubmit;

  form.callbacks.onSubmit = async form => {
    await onSubmit(form);

    try {
      await submitInertiaForm(
        form,
        url instanceof Function ? url(form) : url,
        visitOptions,
      );
    } catch (errors) {
      form.accessors.errors = {
        ...form.accessors.errors,
        ...(errors as FormAccessorErrors<T>),
      };

      form.callbacks.onError?.(form.accessors.errors, form);

      throw errors;
    }
  };

  return form;
};
