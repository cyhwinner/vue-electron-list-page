import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import 'codemirror/theme/dracula.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/lint/lint.css'
// import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/vue/vue'
import 'codemirror/addon/hint/anyword-hint.js'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/lint/lint.js'
import 'codemirror/addon/lint/css-lint.js'
import 'codemirror/addon/lint/javascript-lint.js'
import 'codemirror/addon/lint/json-lint.js'
import 'codemirror/addon/edit/closebrackets.js'
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')
