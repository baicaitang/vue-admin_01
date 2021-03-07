import { ElMessageBox, ElMessage } from "element-plus";

export function global() {

    // 确认弹框
    const messageBox = (params) => {
        ElMessageBox.confirm(params.content, params.tip || '提示', {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: params.type || "warning",
            center: true,
        }).then(() => {
            params.fn && params.fn()
        }).catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
            params.catchFn && params.catchFn()
        });
    }

    return { messageBox }
}