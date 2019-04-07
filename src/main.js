import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {
  MdButton,
  MdTabs,
  MdIcon,
  MdProgress,
  MdSnackbar,
  MdDialog,
  MdField,
  MdRadio,
  MdList,
  MdApp
} from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import infiniteScroll from 'vue-infinite-scroll'

import ScatterJS from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs'
//import { EIO } from 'constants';

Vue.config.productionTip = false;
Vue.use(MdButton);
Vue.use(MdTabs);
Vue.use(MdIcon);
Vue.use(MdProgress);
Vue.use(MdSnackbar);
Vue.use(MdDialog);
Vue.use(MdField);
Vue.use(MdRadio);
Vue.use(MdList);
Vue.use(MdApp);
Vue.use(infiniteScroll);
ScatterJS.plugins(new ScatterEOS());

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')