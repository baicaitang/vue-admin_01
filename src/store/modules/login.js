// import cookie from 'js-cookie';
// import { Login } from "@/api/login";


const state = {
    // isCollapse: JSON.parse(cookie.get('isCollapse')) || false,
    isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false,

}
const getters = {
    isCollapse: state => state.isCollapse
}
const mutations = {//同步
    SET_COLLAPSE(state) {
        console.log('login!!!!!!!');
        state.isCollapse = !state.isCollapse
        // 本地存储 menu切换状态
        sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse))
        // cookie.set('isCollapse', JSON.stringify(state.isCollapse))
    }
}
const actions = {//异步

}



export default {
    namespaced: true,//命名空间
    state,
    getters,
    mutations,
    actions
};