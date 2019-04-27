// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'

// import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
// import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// // this part resolve an issue where the markers would not appear
// delete Icon.Default.prototype._getIconUrl

// Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png')
// })

// import {
//   library
// } from '@fortawesome/fontawesome-svg-core'
// import {
//   faCoffee
// } from '@fortawesome/free-solid-svg-icons'

// library.add(faCoffee)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})
