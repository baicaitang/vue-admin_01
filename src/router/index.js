import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "../views/Layout/index.vue";

const routes = [
  {
    path: "/",
    redirect: "login",
    hidden: true,
    meta: {
      name: "主页"
    }
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    component: () => import("../views/Login/index.vue"),
    meta: {
      name: "登录"
    }
  },
  /**
   * 控制台
   */
  {
    path: "/console",
    name: "Console",
    redirect: "ConsoleIndex",
    component: Layout,
    meta: {
      name: "控制台",
      icon: "console"
    },
    children: [
      //默认首页
      {
        path: "/consoleIndex",
        name: "ConsoleIndex",
        component: () => import("../views/Console/index.vue"),
        meta: {
          name: "首页"
        }
      }
    ]
  },
  /**
   * 信息管理
   */
  {
    path: "/info",
    name: "Info",
    component: Layout,
    meta: {
      name: "信息管理",
      icon: "info"
    },
    children: [
      {
        path: "/infoIndex",
        name: "InfoIndex",
        component: () => import("../views/Info/index.vue"),
        meta: {
          name: "信息列表"
        },
      },
      {
        path: "/infoCategory",
        name: "InfoCategory",
        component: () => import("../views/Info/category.vue"),
        meta: {
          name: "信息分类"
        },

      },
      {
        path: "/infoDetail",
        name: "InfoDetail",
        hidden: true,
        component: () => import("../views/Info/detail.vue"),
        meta: {
          name: "信息详情"
        },
      }
    ]
  },
  /**
   * 用户管理
   */
  {
    path: "/user",
    name: "User",
    component: Layout,
    meta: {
      name: "用户管理",
      icon: "user"
    },
    children: [
      {
        path: "/userIndex",
        name: "UserIndex",
        component: () => import("../views/User/index.vue"),
        meta: {
          name: "用户列表"
        },
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
