import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import services from '../src/service/Services.js'
import "../style.css"

createApp(App).use(router).use(services).mount('#app')
