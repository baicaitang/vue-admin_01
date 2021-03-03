import service from "@/utils/request.js";

/**
 * table组件数据请求
 */
export function loadingTableData(params) {
    return service.request({
        url: params.url || "",
        method: params.method || "post",
        data: params.data || {}
    });
}


/**
 * 获取用户列表
 */
export function getUserList(data) {
    return service.request({
        url: "/user/getList/",
        method: "post",
        data
    });
}

/**
 * 添加用户
 */
export function AddUser(data) {
    return service.request({
        url: "/user/add/",
        method: "post",
        data
    });
}


/**
 * 编辑用户
 */
export function userEdit(data) {
    return service.request({
        url: "/user/edit/",
        method: "post",
        data
    });
}

/**
 * 删除用户
 */
export function deleteUser(data) {
    return service.request({
        url: "/user/delete/",
        method: "post",
        data
    });
}

/**
 * 用户禁用，启用
 */
export function userActive(data) {
    return service.request({
        url: "/user/actives/",
        method: "post",
        data
    });
}

/**
 * 用户角色
 */
export function userRole(data) {
    return service.request({
        url: "/userRole/",
        method: "post",
        data
    });
}


/**
 * 获取省、市、区
 */
export function getCityPicker(data) {
    return service.request({
        url: "/cityPicker/",
        method: "post",
        data
    });
}


/**
 * 获取所有角色
 */
export function getRole(data) {
    return service.request({
        url: "/role/",
        method: "post",
        data
    });
}


