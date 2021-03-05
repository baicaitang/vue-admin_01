import router from "./index";
import store from "@/store/index";
import { getToken, removeToken, removeUsername } from "@/utils/app";
import { addR } from "./addRouters";

const { addRouterFun } = addR()

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
            /**
             * 处理动态路由：
             * 1、获取用户角色
             * 2、动态分配路由权限
             */
            if (store.getters['app/roles'].length === 0) {

                // store.dispatch("permission/getS")
                store.dispatch("permission/getRouters").then(res => {
                    let btnArr = ["info.edit", "info.delete", 'info.add', 'info.detailed', 'info.batchDel', 'user:edit', 'user:del', 'user:add', 'user:search', 'user:batchDel', 'info:firstCategoryAdd']
                    // console.log(res);
                    let role = res.role;
                    let button = res.button;
                    let btnPerm = res.btnPerm

                    if (role.includes('admin')) {
                        button = btnArr
                    }

                    store.commit("app/SET_ROLES", role)
                    store.commit("app/SET_BUTTON", button)

                    store.dispatch("permission/createRouter", role).then(res => {
                        let addRouters = store.getters["permission/addRouter"]
                        let allRouter = store.getters["permission/allRouter"]

                        // 路由更新
                        router.options.routes = allRouter

                        // console.log(addRouters);
                        // console.log(allRouter);

                        // 在Vue3中，摒弃了 addRoutes() 方法，只保留了 addRoute() 单个添加路由配置的方法
                        //添加动态路由
                        // router.addRoute()
                        // console.log(router);
                        addRouterFun(addRouters)

                        //跳转 replace: true 不添加到历史记录
                        next({ ...to, replace: true })
                    })
                })
            } else {
                next()
            }

            // next()

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