import { createApp } from "vue";
// import VueComposition from "@vue/composition-api";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
// 路由守卫 
import "./router/Route_guard";
// axios
import axios from "axios";
import VueAxios from "vue-axios";
// element-plus
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";

// icon 
import svg_icon from "./component/svg_icon/index.vue";
import "./utils/svg";



createApp(App)
  .component("SvgIcon", svg_icon) //全局组件
  .use(store)
  .use(router)
  .use(ElementPlus)
  .use(VueAxios, axios)
  .mount("#app");
