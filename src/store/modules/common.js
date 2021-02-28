import { GetCategory } from "@/api/news";

const state = {
    QiniuUrl: "http://www-web-jshtml-cn-idva7mx.web-jshtml.cn/"
}

const getters = {
    QiniuUrl: state => state.QiniuUrl
}

const actions = {//异步
    //获取信息分类
    getInfoCategory(content, requestData) {
        return new Promise((resolve, reject) => {
            GetCategory({}).then(res => {

                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },

}


export default {
    namespaced: true,//命名空间
    state,
    getters,
    actions
}