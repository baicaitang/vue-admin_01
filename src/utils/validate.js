/**
 * 过滤特殊字符
 */
export function stripscript(str) {
  var pattern = new RegExp(
    "[`~!@#$%^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（ ）——|{}【】‘；：”“'。，、？]"
  );

  var rs = "";

  for (var i = 0; i < str.length; i++) {
    rs = rs + str.substr(i, 1).replace(pattern, "");
  }

  return rs;
}

/**
 * 用户邮箱验证
 */
export function validate_email(value) {
  let regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  return !regEmail.test(value);
}

/**
 * 密码验证
 */
export function validate_password(value) {
  let regPassword = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
  return !regPassword.test(value);
}

/**
 * 验证码
 */
export function validate_code(value) {
  let regCode = /^[a-z0-9]{6}$/;
  return !regCode.test(value);
}
