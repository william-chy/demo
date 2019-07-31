import Vue from 'vue';
import App from './app/index.vue';

import 'element-ui/lib/theme-chalk/index.css';

import Element from 'element-ui';
Vue.use(Element, { size: 'small', zIndex: 3000 });

//按需引入

// import { Button } from 'element-ui';
// Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };
// Vue.use(Button);

// import router from "./router";

new Vue({
  // router: router,
  el: '#root',
  render: (h) => h(App),
});
