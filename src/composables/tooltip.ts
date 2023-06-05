import { ref, onMounted } from 'vue';
import { Tooltip } from 'bootstrap';
import { TooltipOptions } from '@/use/fields/base';

export const useTooltip = (options: TooltipOptions | undefined) => {
  if (!options) {
    return {
      bootstrapTooltip: null,
      tooltipAttributes: {},
    };
  }

  const bootstrapTooltip = ref<Tooltip>();
  const root = ref<HTMLElement | null>(null);

  const init = () => {
    const el = root.value;

    if (!el) {
      return;
    }

    bootstrapTooltip.value = new Tooltip(el);
  };

  const tooltipAttributes = ref<Record<string, string>>({
    'data-bs-toggle': 'tooltip',
    'data-bs-placement': options.placement,
    title: options.title,
  });

  onMounted(() => init());

  return { bootstrapTooltip, tooltipAttributes };
};
