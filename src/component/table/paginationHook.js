import { reactive, ref } from 'vue';


export function PaginationHook() {

    const pageData = reactive({
        currentPage: 1,
        pageSize: 10,
        total: 1,
        pageSizes: [10, 20, 30, 40]
    })

    // 分页操作
    const handleSizeChange = (val) => {
        // console.log(`每页 ${val} 条`);
        pageData.pageSize = val

    };
    const handleCurrentChange = (val) => {
        // console.log(`当前页: ${val}`);
        pageData.currentPage = val
    };




    return {
        pageData,
        handleSizeChange,
        handleCurrentChange,
    }
}