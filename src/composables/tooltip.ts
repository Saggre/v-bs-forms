import { ref, onMounted } from 'vue';
import { Tooltip } from 'bootstrap';

export const useTooltip = () => {
  const tooltip = ref<Tooltip>();
  const root = ref<HTMLElement | null>(null);

  const init = () => {
    const el = root.value;

    if (!el) {
      return;
    }

    tooltip.value = new Tooltip(el);
  };

  onMounted(() => init());

  return { tooltip };
};
