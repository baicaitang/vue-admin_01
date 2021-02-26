// import cookie from 'js-cookie';
import { getUsername, removeToken, removeUsername } from "@/utils/app.js";

const state = {
    // isCollapse: JSON.parse(cookie.get('isCollapse')) || false,
    isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false,
    to_token: "",
    username: getUsername() || "",
}
const getters = {
    isCollapse: state => state.isCollapse,

}
const mutations = {//同步
    SET_COLLAPSE(state) {
        console.log('app??????');
        state.isCollapse = !state.isCollapse
        // 本地存储 
        sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse))
        // cookie.set('isCollapse', JSON.stringify(state.isCollapse))
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
            removeToken()
            removeUsername()

            commit("SET_TOKEN", "")
            commit("SET_USERNAME", "")

            resolve()
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