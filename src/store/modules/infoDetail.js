// import cookie from 'js-cookie';

const state = {
    id: "" || sessionStorage.getItem("infoId"),
    title: "" || sessionStorage.getItem("infoTitle")
}
const getters = {
    infoId: state => state.id,
    infoTitle: state => state.title
}
const mutations = {//同步
    UPDATE_STATE_VALUE(state, params) {
        for (let key in params) {
            state[key] = params[key].value
            if (params[key].session) {
                sessionStorage.setItem("infoId", params[key].sessionKey)
            }
        }

    },
    // SET_ID(state, value) {
    //     state.id = value
    //     sessionStorage.setItem("infoId", value)
    // },
    // SET_TITLE(state, value) {
    //     state.title = value
    //     sessionStorage.setItem("infoTitle", value)
    // }

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