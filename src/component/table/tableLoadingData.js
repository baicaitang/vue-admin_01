import { reactive, toRefs, ref } from 'vue';
import { requestUrl } from "@/api/requestUrl.js";
import { loadingTableData } from "@/api/user.js";

export function TableLoadingData(params) {


    const tableDatas = reactive({
        item: [],
        total_data: 1//默认数据
    })

    //params: root 
    // console.log(params);

    //params: table_data.tableConfig.requestData
    const tableLoadData = (params) => {
        // console.log(params);

        let req;

        let requestDataKey = params.url;
        req = {
            url: requestUrl[requestDataKey],
            method: params.method,
            data: params.data, //请求参数
        };

        // console.log(req);
        // return false
        // 请求数据
        // 请求接口方法
        loadingTableData(req)
            .then((res) => {
                // console.log(res);
                let data = res.data.data;
                // console.log(data);

                // tableDatas.item = data.data;
                tableDatas.total_data = data.data.length === 0 ? 0 : data.total;

                // 数据处理
                let datas = data.data;
                // console.log(datas);
                tableDatas.item = datas

                // console.log(tableDatas.item);


            })
            .catch((err) => { });
    }


    return { tableDatas, tableLoadData }

}