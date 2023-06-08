import { VisitOptions } from '@inertiajs/core/types/types';
import { VisitRouter } from '@/use/form';

const visit = (href: string | URL, options?: VisitOptions) => {
  options?.onError?.({
    foo: 'bar',
    // password: 'Server error',
  });
};

export const getTestRouter = (): VisitRouter => ({
  visit,
});
