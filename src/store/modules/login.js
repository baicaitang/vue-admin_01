import { Login } from "@/api/login";
import { setToken, setUsername } from "@/utils/app.js";
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
    },
    SET_TOKEN(state, value) {
        state.to_token = value
    },
    SET_USERNAME(state, value) {
        state.username = value
    },
}
const actions = {//异步
    // 登录 
    login(content, requestData) {
        return new Promise((resolve, reject) => {
            Login(requestData).then(res => {
                // console.log(content);
                console.log(res);

                let data = res.data.data

                content.commit("SET_TOKEN", data.token)
                content.commit("SET_USERNAME", data.username)
                // 存储token
                setToken(data.token)
                setUsername(data.username)

                resolve(res)
            }).catch(err => {
                reject(err)
            })
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