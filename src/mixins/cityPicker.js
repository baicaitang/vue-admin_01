import { reactive, toRefs, ref, onMounted, watch } from "vue";
import { getCityPicker } from "@/api/user";

// 省、城市、区县、街道下拉联动代码抽离
export function cityPicker() {

    const picker_data = reactive({
        provinceVal: "",
        cityVal: "",
        areaVal: "",
        streetVal: "",
        provinceData: [],
        cityData: [],
        areaData: [],
        streetData: [],
    });

    const resultData = reactive({
        provinceVal: "",
        cityVal: "",
        areaVal: "",
        streetVal: "",
    })
    const picker_datas = toRefs(picker_data)


    const getData = (params) => {
        // console.log(params);
        getCityPicker(params)
            .then((res) => {
                //   console.log(res);
                let data = res.data.data.data;
                // console.log(`${params.type}Data`);
                picker_data[`${params.type}Data`] = data;
            })
            .catch((err) => { });
    }

    // 获取省份
    const getProvance = () => {

        getData({ type: "province" })

    };

    // 选择省份，获取城市
    const handleProvince = (val) => {
        // console.log(val);
        if (val) {
            picker_data.provinceVal = val
        } else {
            picker_data.provinceVal = ""
            // picker_data.cityVal = val
            resetValue({ type: "city" })
            return false
        }
        // 选择另一个省份重置选项
        resetValue({ type: "city" })
        getData({
            type: "city", province_code: val,
        })

    };

    //选择城市， 获取区县
    const handleCity = (val) => {
        if (val) {
            picker_data.cityVal = val
        }
        resetValue({ type: "area" })
        getData({
            type: "area", city_code: val,
        })

    };

    //选择区县， 获取街道
    const handleArea = (val) => {
        if (val) {
            picker_data.areaVal = val
        }
        resetValue({ type: "street" })
        getData({
            type: "street", area_code: val,
        })

    };

    const handleStreet = (val) => {
        if (val) {
            picker_data.streetVal = val
        }
        resetValue({ type: "" })
    }

    // 重置选项
    const resetValue = (params) => {
        // 方法一：
        // if (params.type === "province") {
        //     picker_data.cityVal = ""
        //     picker_data.areaVal = ""
        //     picker_data.streetVal = ""
        // } else if (params.type === "city") {
        //     picker_data.areaVal = ""
        //     picker_data.streetVal = ""
        // } else if (params.type === "area") {
        //     picker_data.streetVal = ""
        // }

        // 方法二：
        const valJson = {
            city: ["cityVal", "areaVal", "streetVal"],
            area: ["areaVal", "streetVal"],
            street: ["streetVal"],
        }

        const arr = valJson[params.type] //["cityVal", "areaVal", "streetVal",undefined]
        // console.log(arr);

        if (arr) {
            arr.forEach(item => {
                // item-- > "cityVal"
                picker_data[item] = ""
            })
        } else {

        }

        result()

    }

    const result = () => {
        for (let key in resultData) {
            resultData[key] = picker_data[key]
        }
        // console.log(resultData);
    }



    return {
        // picker_data,
        picker_datas,
        // ...picker_data,
        resultData,
        getProvance,
        handleProvince,
        handleCity,
        handleArea,
        handleStreet
    }
}