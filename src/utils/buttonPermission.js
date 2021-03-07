import store from "../store/index";

// 按钮权限
export function buttonPermission(permission) {

    // console.log(permission);
    const button = store.getters["app/buttonPermission"]
    // console.log(button);
    const roles = store.getters["app/roles"]
    // console.log(button);

    if (roles.includes("admin")) return true

    return button.indexOf(permission) != -1

}