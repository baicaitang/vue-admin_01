import axios from "axios";
import { ElMessage } from "element-plus";
import { getToken, getUsername } from "@/utils/app.js";

let baseUrl = process.env.VUE_APP_FLAG;

// 新建一个 axios 实例
const service = axios.create({
  baseURL: baseUrl,
  timeout: 5000
});

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // console.log(config);
    // 给后端发送相关参数
    // 根据业务需求添加 
    config.headers['tokey'] = getToken();
    config.headers['UserName'] = getUsername();



    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
/**
 * 请求接口返回数据进行拦截
 */
service.interceptors.response.use(
  function (response) {
    // console.log(response);
    let data = response.data;

    if (data.resCode !== 0) {
      ElMessage({
        showClose: true,
        message: data.message,
        type: "error"
      });
      return Promise.reject(error);
    } else {
      return response;
    }
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default service;
