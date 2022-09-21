import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import MoonLoader from 'vue-spinner/src/MoonLoader.vue'
Vue.config.productionTip = false
Vue.use(Vuetify)

Vue.component('MoonLoader', MoonLoader)

new Vue({
  router,
  vuetify: new Vuetify(
    {
      icons: {
        iconfont: 'md',
      }
    }
  ),
  render: h => h(App)
}).$mount('#app')
