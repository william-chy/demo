import Vue from "vue";
import router from "./router";
import ElementUI from "element-ui";
import store from "./store";
Vue.use(ElementUI);
Vue.$shopUrl = '';
new Vue({
    router: router,
    store,
    el: "#root"
});

