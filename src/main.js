import { createApp } from "vue";
// import VueComposition from "@vue/composition-api";
import App from "./App.vue";
// element-plus
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import router from "./router/index";
import store from "./store/index";
// 路由守卫 
import "./router/Route_guard";
// axios
import axios from "axios";
import VueAxios from "vue-axios";

// 按钮权限
import { buttonPermission } from "@/utils/buttonPermission";

// icon 
import svg_icon from "./component/svg_icon/index.vue";
import "./utils/svg";

const app = createApp(App)



// 1、全局按钮权限方法
app.config.globalProperties.$btnPerm = buttonPermission

// 2、自定义按钮权限
import "./utils/buttonPerm";


app
  .component("SvgIcon", svg_icon) //全局组件
  .use(ElementPlus)
  .use(store)
  .use(router)
  .use(VueAxios, axios)
  .mount("#app");
