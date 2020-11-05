import Vue from 'vue'
import App from './App.vue'
import './assets/style/main.scss'
import store from './store'
import Multiselect from 'vue-multiselect'

Vue.component('multiselect', Multiselect)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
