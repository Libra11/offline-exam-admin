/*
 * @Author: Libra
 * @Date: 2023-06-05 14:55:10
 * @LastEditors: Libra
 * @Description:
 */
const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录",
      showLink: false,
      rank: 101
    },
    component: () => import("@/views/login/index.vue")
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录",
      showLink: false,
      rank: 101
    },
    component: () => import("@/views/login/index.vue")
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      title: "加载中...",
      showLink: false,
      rank: 102
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  }
] as Array<RouteConfigsTable>;
