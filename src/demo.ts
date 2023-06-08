import { createApp } from 'vue';
import App from './App.vue';
import { getTestRouter } from '@/use/testRouter';
import { setInertiaRouter } from '@/composables/inertiaForm';

setInertiaRouter(getTestRouter());

createApp(App).mount('#app');
