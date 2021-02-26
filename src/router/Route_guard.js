import router from "./index";
import store from "@/store/index";
import { getToken, removeToken, removeUsername } from "@/utils/app";

// 白名单
const whiteRouter = ["/login"];

// 路由守卫: 登录后才能进入其他界面的一个权限
router.beforeEach((to, from, next) => {
    // console.log(to);

    if (getToken()) {
        // console.log("存在token");

        if (to.path === "/login") {
            // 删除token
            removeToken()
            removeUsername()
            // 清除state
            store.commit("app/SET_TOKEN", "")
            store.commit("app/SET_USERNAME", "")
            next()
        } else {
            next()
        }

    } else {
        console.log("不存在token");
        //跳转到login页面

        if (whiteRouter.indexOf(to.path) !== -1) {
            next()
        } else {
            next('/login')
        }

    }


    // console.log(to);//进入的下一个页面
    // console.log(from);//离开之前的页面
    // console.log(next);

    // 执行下一步 
    // next()不带参数，执行to 
    // next()

})