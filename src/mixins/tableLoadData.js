//了解混入
// import { requestUrl } from "@/api/requestUrl.js";
// import { loadingTableData } from "@/api/user.js";


// let tableLoadDataMixin = {
    // data() {
    //     return {

    //     }
    // },
    // created() {

    // },
    // mounted() {
    //     this.handleTableLoadData
    // },
    // methods: {
    //     handleTableLoadData() {
    //         let requestDataJson = this.table_Config.requestData;
    //         console.log(requestDataJson);

    //         let req = {
    //             url: requestUrl[requestDataJson.url],
    //             method: requestDataJson.method,
    //             data: requestDataJson.data, //请求参数
    //         };
    //         // 请求接口方法
    //         loadingTableData(req)
    //             .then((res) => {
    //                 console.log(res);
    //                 let data = res.data.data.data;

    //                 if (data && data.length > 0) {
    //                     this.Data = data;
    //                 }
    //             })
    //             .catch((err) => { });
    //     }
    // },


// }

// export default {
//     tableLoadDataMixin
// }