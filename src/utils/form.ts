/**
 * Get form data as JSON
 *
 * @param form
 */
export const getFormAsJson = (
  form: HTMLFormElement,
): { [key: string]: any } => {
  return Object.fromEntries(new FormData(form));
};
