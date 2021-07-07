
项目地址：http://wyz.baicaitang.top/#/login

========================================================================

项目描述：这是一个记录和管理各部门日常收支信息的后台管理系统

项目使用技术：
- vue3.0
- element-plus
- vuex
- sass
- Axios拦截器
- 检测toKen
- cookie存储，sessionStorage存储、localStorage存储
- svg 图片拼接成 雪碧图
- 组件化开发
- 动态路由
- 路由守卫
- 按钮权限
- 开发环境跨域，线上跨域

项目职责：
- 完成后台各模块的功能，权限管理，登录注册，数据展示，添加编辑删除分类，为不同用户角色分配路由和按钮权限，前端跨域

技术描述：
- 采用了vue + element-plus对模块进行封装，方便前端多模块间相互调用
- 使用echarts展示部门收支情况
- 使用vuex,vue-router，sessionStorage,cookie等对登录token进行存储，分配路由
- 使用axios做请求拦截和响应拦截

## 安装依赖
```
yarn install
```

### 启动服务
```
yarn serve
```

### 打包
```
yarn build
```
