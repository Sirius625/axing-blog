import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from './router'
import './main.css';
import './style.css'
import './style/style.css'
import { createPinia } from 'pinia'
import '@fortawesome/fontawesome-free/css/all.min.css';

const pinia = createPinia()


createApp(App).use(pinia).use(router).mount('#app')
