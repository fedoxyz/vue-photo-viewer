import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './assets/index.css';

// Create Pinia instance first
const pinia = createPinia();

// Create Vue app
const app = createApp(App);

// Use Pinia before mounting
app.use(pinia);

// Mount the app
app.mount('#app');

