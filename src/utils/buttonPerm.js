import App from "../App.vue";
import { createApp } from "vue";
const app = createApp(App)

// 自定义指令，使用 v- 来绑定使用
app.directive("btnPerm", {
    beforeMount: function (el, bingind, vnode) {
        // console.log(el);
        // console.log(bingind);
        // 操作dom
        // 自定义方法
        if (bingind.dir.hasBtnPerm(bingind.value)) {
            el.style.display = "none"
        }
    },
    mounted: function () {

    },
    beforeUpdate: function () {

    },
    Updated: function () {

    },
    unmounted: function () {

    },
    hasBtnPerm: function (value) {
        const button = store.getters["app/buttonPermission"]
        const roles = store.getters["app/roles"]
        // console.log(button);

        if (roles.includes("admin")) return true

        return button.indexOf(value) != -1
    }
})