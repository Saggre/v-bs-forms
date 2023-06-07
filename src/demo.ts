import { createApp } from 'vue';
import App from './App.vue';
import { setInertiaRouter } from '@/use/form';
import { getTestRouter } from '@/use/testRouter';

setInertiaRouter(getTestRouter());

createApp(App).mount('#app');
