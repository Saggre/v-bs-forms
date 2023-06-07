import { createApp, h } from 'vue'
import App from './App.vue'
import { createInertiaApp } from '@inertiajs/vue3';

createInertiaApp({
    progress: {
        color: '#4B5563',
    },
    title: () => 'Demo',
    // @ts-ignore
    resolve: () => App,
    // @ts-ignore
    setup({el, App, props, plugin}) {
        return createApp({
            render: () => h(App, props)
        }).mount('#app');
    },
}).then(r => {});
