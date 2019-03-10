import Vue from 'vue'
import Router from 'vue-router'
import shouye from './components/shouye.vue'
import loadmore from './components/loadmore.vue'
import sign from './components/sign.vue'
import regis from './components/regis.vue'
import account from './components/account.vue'
import member from './components/member.vue'
import transfer from './components/transfer.vue'
import pages from './components/pages.vue'
import transactioninfo from './components/transactioninfo.vue'
import SearchAccount from './components/SearchAccount.vue'
import allmembers from './components/allmembers.vue'
import kongtou from './components/kongtou.vue'
Vue.use(Router)
export default new Router({
  base:'/app/',
  routes: [
    { path: '/',
      // path: '/shouye',
      name: 'shouye',
      component: shouye
    },
    {
      path: '/loadmore',
      name: 'loadmore',
      component: loadmore
    },
    {
      path: '/sign',
      name: 'sign',
      component: sign
    },
    {
      path: '/regis',
      name: 'regis',
      component: regis
    },
    {
      path: '/account',
      name: 'account',
      component: account
    },
    {
      path: '/member',
      name: 'member',
      component: member
    },
    {
      path: '/transfer',
      name: 'transfer',
      component: transfer
    },
    {
      path: '/pages',
      name: 'pages',
      component: pages
    },
    {
      path: '/transactioninfo',
      name: 'transactioninfo',
      component: transactioninfo
    },
    {
      path: '/SearchAccount',
      name: 'SearchAccount',
      component: SearchAccount
    },
    {
      path: '/allmembers',
      name: 'allmembers',
      component: allmembers
    },
    {
      path: '/kongtou',
      name: 'kongtou',
      component: kongtou
    },
  ]
})
