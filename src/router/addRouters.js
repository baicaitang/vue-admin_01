// import { useRoute, useRouter } from "vue-router";
import router from "./index";

// 添加动态路由
export function addR() {

    // let R = useRouter();
    // let route = useRoute();
    // console.log(R);
    // console.log(route);

    const addRouterFun = (routerList) => {
        routerList.forEach(item => {
            // console.log(item);
            if (item.children) {
                item.children.forEach(child => {
                    // console.log(child);
                    let name = item.name
                    router.addRoute(name, child)
                })

            }
            router.addRoute(item)
        })
    }


    return {
        addRouterFun
    }
}