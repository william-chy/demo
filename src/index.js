import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './app/index.vue';

// import router from "./router";

Vue.use(ElementUI);
new Vue({
  // router: router,
  el: '#root',
  render: (h) => h(App),
});
