import { getUserRole, getSystem } from "@/api/login.js";
import { getRole } from "@/api/user";
// import { createRouter } from "vue-router";
import { defaultRouterMap, asnycRouterMap } from "@/router/index";
const state = {
    // roles: [],//用户角色
    allRouter: defaultRouterMap,
    addRouter: [],
}
const getters = {//返回
    // roles: state => state.roles,
    allRouter: state => state.allRouter,
    addRouter: state => state.addRouter,
}
const mutations = {//同步
    // SET_ROLES(state, value) {
    //     state.roles = value
    //     // console.log(state.roles);
    // },
    SET_ROUTER(state, value) {
        state.addRouter = value
        state.allRouter = defaultRouterMap.concat(value)
        // console.log(state.allRouter);
        // console.log(state.addRouter);
    }
}
const actions = {//异步
    // 获取用户角色 
    getRouters({ commit }, reqData) {
        // console.log(content);
        return new Promise((resolve, reject) => {
            getUserRole().then(res => {
                // console.log(res);
                let result = res.data.data;
                // commit("SET_ROLES", result.role)
                resolve(result)
            }).catch(err => { })
        })
    },
    // 创建动态路由 
    createRouter({ commit }, data) {
        return new Promise((resolve, reject) => {
            // console.log(data[0]);
            let role = data
            //接口有问题,修改admin为信息功能、用户功能测试
            // if (role[0] === 'admin') role = ["userSystem"]
            // console.log(role);
            let addRouters = []
            // console.log(asnycRouterMap);

            if (role.includes('admin')) {

                // role = ["sale", "technician", "manager"]

                // 超管
                addRouters = asnycRouterMap

            } else {
                role = ["sale"]//示例

                // 普通管理员 
                addRouters = asnycRouterMap.filter(item => {
                    // console.log(item.meta.system);//信息功能、用户功能


                    if (hasPermission(role, item)) {

                        if (item.children && item.children.length > 0) {
                            item.children.filter(child => {
                                if (hasPermission(role, child)) {
                                    return child
                                }
                            })
                            return item
                        }
                        return item
                    }

                    // if (role.includes(item.meta.system)) {
                    //     return item
                    // }
                })
                // 404
                addRouters.push(asnycRouterMap[asnycRouterMap.length - 1])

            }
            commit("SET_ROUTER", addRouters)

            resolve()
        })
    },
    // 获取系统 
    // getS({ commit }, reqData) {
    //     console.log(content);
    //     return new Promise((resolve, reject) => {
    //         getSystem().then(res => {
    //             console.log(res.data.data);
    // 0: { name: "信息功能", role: "infoSystem" }
    // 1: { name: "用户功能", role: "userSystem" }
    // length: 2

    //         }).catch(err => { })
    //     })
    // },
    // 获取角色
    // getR({ commit }, reqData) {
    //     console.log(content);
    //     return new Promise((resolve, reject) => {
    //         getRole().then(res => {
    //             console.log(res.data.data);
    //         }).catch(err => { })
    //     })
    // },
}

function hasPermission(role, router) {
    // console.log(role);
    // console.log(router);

    if (router.meta && router.meta.role) {
        return role.some(item => router.meta.role.indexOf(item) != -1)
    }
}


export default {
    namespaced: true,//命名空间
    state,
    getters,
    mutations,
    actions
};