import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// Pinia (estado global) precisa ser registrado antes do router,
// porque a guarda de rota usa a store de autenticação.
createApp(App).use(createPinia()).use(router).mount('#app')
