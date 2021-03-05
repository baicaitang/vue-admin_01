import { createRouter, createWebHashHistory } from "vue-router";
// import Layout from "@/views/Layout/index.vue";

// 默认路由，所有人可访问
export const defaultRouterMap = [
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
    component: () => import("@/views/Login/index.vue"),
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
    // component: Layout,
    component: () => import("@/views/Layout/index.vue"),
    meta: {
      name: "控制台",
      icon: "console"
    },
    children: [
      //默认首页
      {
        path: "/consoleIndex",
        name: "ConsoleIndex",
        component: () => import("@/views/Console/index.vue"),
        meta: {
          keepAlive: true,
          name: "首页"
        }
      }
    ]
  },
  /**
   * 404
   */
  {
    path: "/page404",
    name: "404",
    hidden: true,
    component: () => import("@/views/Layout/index.vue"),
    meta: {
      // name: "404",
      // icon: "404"
    },
    children: [
      {
        path: "/404",
        component: () => import("@/views/404.vue"),
        meta: {
          name: "404"
        }
      }
    ]
  },

]

// 动态路由
export const asnycRouterMap = [
  /**
   * 信息管理
   */
  {
    path: "/info",
    name: "Info",
    component: () => import("@/views/Layout/index.vue"),
    meta: {
      role: ["sale", "manager"],
      system: "infoSystem",
      name: "信息管理",
      icon: "info"
    },
    children: [
      {
        path: "/infoIndex",
        name: "InfoIndex",
        component: () => import("@/views/Info/index.vue"),
        meta: {
          // keepAlive: true,
          role: ["sale", "manager"],
          name: "信息列表"
        },
      },
      {
        path: "/infoCategory",
        name: "InfoCategory",
        component: () => import("@/views/Info/category.vue"),
        meta: {
          // keepAlive: true,
          role: ["sale", "manager"],
          name: "信息分类"
        },

      },
      {
        path: "/infoDetail",
        name: "InfoDetail",
        hidden: true,
        component: () => import("@/views/Info/detail.vue"),
        meta: {
          keepAlive: true,
          role: ["sale", "manager"],
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
    component: () => import("@/views/Layout/index.vue"),
    meta: {
      role: ["technician"],
      system: "userSystem",
      name: "用户管理",
      icon: "user"
    },
    children: [
      {
        path: "/userIndex",
        name: "UserIndex",
        component: () => import("@/views/User/index.vue"),
        meta: {
          // keepAlive: true,
          role: ["technician"],
          name: "用户列表"
        },
      }
    ]
  },
  {//404
    path: "/:pathMatch(.*)",
    redirect: "/404",
    hidden: true,
  },
];


const router = createRouter({
  history: createWebHashHistory(),
  routes: defaultRouterMap
});

export default router;
