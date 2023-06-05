import { onMounted } from 'vue';
import { Tooltip } from 'bootstrap';
import { TooltipOptions } from '@/use/fields/base';

export const useTooltip = (options: TooltipOptions | undefined) => {
  if (!options) {
    return {
      tooltipAttributes: {},
    };
  }

  const init = () => {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
      new Tooltip(el);
    });
  };

  const tooltipAttributes = {
    'data-bs-toggle': 'tooltip',
    'data-bs-placement': options.placement,
    title: options.title,
  };

  onMounted(() => init());

  return { tooltipAttributes };
};
