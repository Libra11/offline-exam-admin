/*
 * @Author: Libra
 * @Date: 2023-06-05 14:54:54
 * @LastEditors: Libra
 * @Description:
 */
// 模拟后端动态生成路由
import { MockMethod } from "vite-plugin-mock";

/**
 * roles：页面级别权限，这里模拟二种 "admin"、"common"
 * admin：管理员角色
 * common：普通角色
 */

const permissionRouter = {
  path: "/permission",
  meta: {
    showLink: false,
    title: "权限管理",
    icon: "lollipop",
    rank: 10
  },
  children: [
    {
      path: "/permission/page/index",
      name: "PermissionPage",
      meta: {
        title: "页面权限",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/permission/button/index",
      name: "PermissionButton",
      meta: {
        title: "按钮权限",
        roles: ["admin", "common"],
        auths: ["btn_add", "btn_edit", "btn_delete"]
      }
    }
  ]
};

const manageRouter = {
  path: "/manager/manage/index",
  name: "ManagerManage",
  meta: {
    title: "考试机管理",
    roles: ["admin", "common"],
    icon: "lollipop",
    rank: 9
  }
};

const projectRouter = {
  path: "/manager/project/index",
  name: "ProjectManage",
  meta: {
    title: "项目管理",
    roles: ["admin", "common"],
    icon: "lollipop",
    rank: 8
  }
};

export default [
  {
    url: "/getAsyncRoutes",
    method: "get",
    response: () => {
      return {
        success: true,
        data: [permissionRouter, manageRouter, projectRouter]
      };
    }
  }
] as MockMethod[];
