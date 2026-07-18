# FeiTools - 多端影视工具箱

`FeiTools` 是一款轻量、低耦合、极速开发的多功能工具箱，支持**微信小程序**和**H5 网页端**，并包含一个**一体化的后台管理系统**。用户端核心功能和推荐内容完全由后台动态下发。

---

## 🌟 模块功能介绍

### 1. 用户客户端 (`frontend`)
基于 **uni-app (Vue3)** 开发，一套代码同时编译并运行在微信小程序和 H5 网页中。
* 🎬 **影视解析**：支持粘贴各大主流视频平台（爱优腾等）的视频链接，自由切换多个解析通道。小程序端自动复制解析链接引导浏览器打开，H5端支持直接新窗口跳转。
* 🌐 **影视导航**：后台配置的推荐影视资源站展示。H5 端可一键访问，小程序端一键复制，兼顾用户体验与平台审核合规。
* 🎵 **音乐空间**：高颜值的黑胶唱片播放器，内置自然白噪音与静心舒缓钢琴乐，支持唱片旋转动画、切歌与播放控制。
* 👤 **个人中心**：微信小程序端支持一键静默登录（获取 `openid` 自动注册），H5 端支持免登录游客模式。

### 2. 后端服务 (`backend`)
基于 **Node.js + Express + MySQL**，极致轻量，省内存。
* 提供管理端登录认证，账号、密码和 Token 均通过环境变量配置。
* 提供针对解析通道和推荐站点的完整 **CRUD (增删改查)** 接口。
* 为客户端提供公开的 API，读取最新配置并自动过滤未启用的站点和接口。

### 3. 后台管理端 (`backend/public/admin`)
无需繁琐的脚手架构建与打包，采用 **Vue3 + Element Plus (CDN)** 编写的优雅单页面后台。
* 直接随 Node 服务一同托管启动，通过 `http://localhost:3000/admin/index.html` 即可直达。
* **数据看板**：直观管理解析接口的增加、删除、编辑、权重排序和一键启用/禁用。
* **导航管理**：动态管理推荐站点的配置，支持快速开关。

---

## 📂 项目目录树

```text
FeiTools/
├── backend/                  # 后端 API 与管理后台服务
│   ├── public/admin/         # 托管的管理端静态文件
│   │   └── index.html        # 管理后台单页面 (Vue3+ElementPlus CDN)
│   ├── .env                  # 数据库连接与管理员凭证配置文件
│   ├── db.js                 # 数据库连接池与连接测试脚本
│   ├── init.sql              # 本地数据库结构与初始数据 SQL
│   ├── package.json          # Node.js 依赖配置
│   ├── server.js             # 主 API 服务入口文件
│   └── setup.js              # 一键自动建库建表脚本
│
└── frontend/                 # 客户端模块 (uni-app)
    ├── pages/                # 页面目录
    │   ├── index/index.vue   # 影视解析页面
    │   ├── navigation/navigation.vue # 影视导航页面
    │   ├── music/music.vue   # 音乐播放页面 (黑胶盘片旋转)
    │   └── my/my.vue         # 个人中心页面 (微信登录)
    ├── App.vue               # 全局根组件及公共 CSS
    ├── config.js             # 网络请求基础配置文件 (BASE_URL)
    ├── main.js               # uni-app 程序入口
    ├── manifest.json         # 多端应用配置文件
    └── pages.json            # 路由与底部 4 Tab tabBar 配置文件
```

---

## 🚀 快速本地启动

### 后端服务启动
1. 确保本地已启动 MySQL 数据库，复制 `backend/.env.example` 为 `backend/.env`，并填写您本机的数据库用户名、密码、管理员账号、管理员密码和 Token。
2. 在终端进入 `backend` 目录，安装依赖：
   ```bash
   cd backend
   npm install
   ```
3. 运行一键配置脚本，自动创建数据库 `feitools_db` 并导入表和初始数据：
   ```bash
   node setup.js
   ```
4. 启动服务：
   ```bash
   node server.js
   ```
   * 启动成功后，浏览器访问 `http://localhost:3000/admin/index.html` 进入后台。
   * 管理端账号、密码和认证 Token 请以您本地 `backend/.env` 为准，仓库不会提供明文默认密码。

### 客户端启动
1. 打开 **HBuilderX**，选择“文件 -> 导入 -> 从本地目录导入”，导入 `frontend` 文件夹。
2. 配置 `frontend/config.js` 确保 `BASE_URL` 指向您的后端地址（本地测试保持默认即可）。
3. 在 HBuilderX 菜单中点击“运行 -> 运行到浏览器 -> Chrome”，或运行到小程序模拟器中进行联调测试。
