import Vue from 'vue'
import App from './App'

import store from './store'
import {
	api,
	getajax,
	postajax
} from './utils/api'
Vue.prototype.$api = api
Vue.prototype.$getajax = getajax
Vue.prototype.$postajax = postajax
Vue.config.productionTip = false

Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()
