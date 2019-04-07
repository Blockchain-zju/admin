import Vue from 'vue'
import Router from 'vue-router'

import kongtou from './components/kongtou.vue'
import signiture from './components/signature.vue'

Vue.use(Router)
export default new Router({
  base:'/app/',
  routes: [
    { path: '/',
      name: 'signiture',
      component: signiture
    },
    {
      path: '/kongtou',
      name: 'kongtou',
      component: kongtou
    },
    {
      path: '/signiture',
      name: 'signiture',
      component: signiture

    },
  ]
})
