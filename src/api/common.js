import {
    GetCategory,
    GetCategoryAll,

} from "@/api/news.js";
import { reactive } from "vue";

export function common() {

    const infoCategory = reactive({ item: [] })
    const allCategory = reactive({ item: [] })
    /**
     * 获取分类
     */
    const getInfoCategory = (params) => {
        GetCategory({}).then(res => {
            let data = res.data.data.data;
            // console.log(data);
            // sessionStorage.setItem('category_name', JSON.stringify(data))
            infoCategory.item = data

        }).catch(err => { })
    }

    const getCategoryAll = (params) => {
        GetCategoryAll({}).then(res => {
            let data = res.data.data;
            // console.log(data);
            allCategory.item = data

        }).catch(err => { })
    }

    return {
        infoCategory,
        allCategory,
        getInfoCategory,
        getCategoryAll
    }
}

