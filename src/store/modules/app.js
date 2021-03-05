// import cookie from 'js-cookie';
import { getUsername, removeToken, removeUsername } from "@/utils/app.js";
import { Logout } from "@/api/login";

const state = {
    // isCollapse: JSON.parse(cookie.get('isCollapse')) || false,
    isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false,
    to_token: "",
    username: getUsername() || "",
    roles: [],
    buttonPermission: []
}
const getters = {
    isCollapse: state => state.isCollapse,
    roles: state => state.roles,
    buttonPermission: state => state.buttonPermission
}
const mutations = {//同步
    SET_COLLAPSE(state) {
        // console.log('app??????');
        state.isCollapse = !state.isCollapse
        // 本地存储 
        sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse))
        // cookie.set('isCollapse', JSON.stringify(state.isCollapse))
    },
    SET_ROLES(state, value) {
        state.roles = value
    },
    SET_BUTTON(state, value) {
        state.buttonPermission = value
        // console.log(state.buttonPermission);
    },
    SET_ROUTER(state, value) {
        state.addRouter = value
        state.allRouter = defaultRouterMap.concat(value)
        // console.log(state.allRouter);
        // console.log(state.addRouter);
    },


}


const actions = {//异步
    // setMenuStatus({ commit }, data) {
    //     commit('SET_COLLAPSE')
    //     // console.log(data);
    // }

    // 退出 
    logout({ commit }) {

        return new Promise((resolve, reject) => {
            Logout().then(res => {

                let data = res.data

                removeToken()
                removeUsername()

                commit("SET_TOKEN", "")
                commit("SET_USERNAME", "")

                resolve(data)

            }).catch(err => { })

        })

    }

}



export default {
    namespaced: true,//命名空间
    state,
    getters,
    mutations,
    actions
};