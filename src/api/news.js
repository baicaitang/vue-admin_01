import service from "@/utils/request.js";
/**
 * 获取列表
 */
export function GetList(data) {
    return service.request({
        url: "/news/getList/",
        method: "post",
        data
    });
}

/**
 * 新增
 */
export function AddInfo(data) {
    return service.request({
        url: "/news/add/",
        method: "post",
        data
    });
}

/**
 *编辑
 */
export function EditInfo(data) {
    return service.request({
        url: "/news/editInfo/",
        method: "post",
        data
    });
}


/**
 * 删除
 */
export function DeleteInfo(data) {
    return service.request({
        url: "/news/deleteInfo/",
        method: "post",
        data
    });
}

/**
* 添加一级分类
*/
export function AddFirstCategory(data) {
    return service.request({
        url: "/news/addFirstCategory/",
        method: "post",
        data
    });
}

/**
 * 添加二级分类
 */
export function AddChildrenCategory(data) {
    return service.request({
        url: "/news/addChildrenCategory/",
        method: "post",
        data
    });
}

/**
 * 获取分类
 */
export function GetCategory(data) {
    return service.request({
        url: "/news/getCategory/",
        method: "post",
        data
    });
}

/**
 * 获取所有分类
 */
export function GetCategoryAll(data) {
    return service.request({
        url: "/news/getCategoryAll/",
        method: "post",
        data
    });
}


/**
 * 删除分类
 */
export function DeleteCategory(data) {
    return service.request({
        url: "/news/deleteCategory/",
        method: "post",
        data
    });
}

/**
 * 编辑一级分类
 */
export function EditCategory(data) {
    return service.request({
        url: "/news/editCategory/",
        method: "post",
        data
    });
}

/**
 * 获取七牛云token
 */
export function getQiniuToken(data) {
    return service.request({
        url: "/uploadImgToken/",
        method: "post",
        data
    });
}