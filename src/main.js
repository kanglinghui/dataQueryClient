import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/zh-cn.js";
import App from "./App.vue";
import "tui-color-picker/dist/tui-color-picker.css";

// import "./registerServiceWorker";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
Vue.use(ElementUI, {
  size: "mini",
});
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
