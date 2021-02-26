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
 *获取用户角色
 */

/**
 * 登录
 */
export function Login(data) {
  return service.request({
    url: "/login/",
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
