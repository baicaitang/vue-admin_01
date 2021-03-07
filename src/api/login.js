import service from "@/utils/request.js";

/**
 * 获取验证码
 */
export function GetSms(data) {
  return service.request({
    url: "/getSms/",
    method: "post",
    data
  });
}

/**
 * 登录
 */
export function Login(data = {}) {
  return service.request({
    url: "/login/",
    method: "post",
    data
  });
}

/**
 * 登退出录
 */
export function Logout(data) {
  return service.request({
    url: "/logout/",
    method: "post",
    data
  });
}

/**
 * 注册
 */
export function Register(data) {
  return service.request({
    url: "/register/",
    method: "post",
    data
  });
}


/**
 * 获取用户角色
 */
export function getUserRole(data = {}) {
  return service.request({
    url: "/userRole/",
    method: "post",
    data
  });
}

/**
 * 获取按钮权限
 */
export function permButton(data = {}) {
  return service.request({
    url: "/permButton/",
    method: "post",
    data
  });
}

/**
 * 获取系统
 */
export function getSystem(data = {}) {
  return service.request({
    url: "/system/",
    method: "post",
    data
  });
}