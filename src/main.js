// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'
// 引入全局过滤器
import './filters'
import './mock/mockServer'

// 注册全局的组件标签
import { Button } from 'mint-ui'
// 下面两种方式都可以
Vue.component(Button.name, Button)
// 我自己测试，不可以使用Vue.use(Button)
// Vue.use(Button)

// 使用了这个，内部自定义一个指令v-lazy
Vue.use(VueLazyload, {
  loading: require('./common/images/loading.gif')
})

/* eslint-disable no-new */
new Vue({ 
  el: '#app',
  router,
  store,
  render: h => h(App)
})
