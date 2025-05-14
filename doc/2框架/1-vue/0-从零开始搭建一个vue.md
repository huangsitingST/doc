

# 从零开始搭建一个vue

https://www.bilibili.com/video/BV1dt4y1K7BF?spm_id_from=333.788.player.switch&vd_source=dde64d07ecb0f5155b9ee44781f029a0

![image-20250303205210917](/Users/soup/Library/Application Support/typora-user-images/image-20250303205210917.png)

## 1、SFC

single file components 单文件组件

将模板、脚本和样式封装在一个文件中

## 2、webpack：开发时依赖

webpack：整合js代码

webpack-cli：为了使用webpack的命令

webpack-dev-server： 热部署

```bash
npm i -D webpack webpack-cli webpack-dev-server 
// -D 表示开发时依赖，这些依赖并不放在生产环境中，打包以后的上线产品并不需要webpack的代码功能
```

`-D 表示开发时依赖，这些依赖并不放在生产环境中，打包以后的上线产品并不需要webpack的代码功能`

## 3、babel：es6转es5

并不是每一个浏览器都支持高版本的es6语法，就需要将es6转成es5的语法

```bash
npm i -D babel-loader @babel/core @babel/preset-env
```

同理，转的依赖就是将vue文件转成浏览器认识的样子：结合html、js、css、打包，全部都是开发时依赖，打包完后的dist文件就是浏览器可以识别的合成文件

![image-20250225103555106](../images/image-20250225103555106.png)

## 4、脚手架

1. vue cli：webpack

1. vite 

## 5、vue-router 客户端路由

vue作为一个当页面应用，配置完vue-router后，路由的变化会由客户端来控制，就不作为一个请求去请求服务器

### 5.1 router-link和a标签的区别

- <a/>是html的原生超链接标签
  1. 用于跳转页面或外部链接
  2. 点击时会刷新页面
  3. 适用于多应用页面（MPA）
- **`router-link`**是vue-router提供的组件
  1. 在单应用页面实现路由跳转
  2. 点击时不会刷新页面，而是通过 Vue Router 动态加载目标组件
  3. 适用于单页面应用（SPA）

### 5.2 createWebHistiry和createWebHashHistory的区别

1. createWebHistiry

   - 使用标准的路由形式：https://example.com/about

     `当用户去刷新或者输入地址访问时，浏览器会根据这个url向服务器发送请求，而服务器不知道这个url是前端页面，会按照传统的文件路径查找资源，由于服务器通常不存在与前端路由完全对应的文件或路由(只有打包的dist静态资源)，就会出现找不到404错误`

     需要nginx服务器配置支持，确保所有的路由都指向index.html，以免访问到的网页不存在而出现404。

     ```bash
     location / {
       try_files $uri $uri/ /index.html;
     }
     ```

   - 对SEO友好，因为是标准的路径形式，搜索引擎可以正确抓取

2. createWebHashHistory

   - 使用hash模式，url中会有#：https://example.com/#/about

     #之后的哈哈希部分不会发送到服务器，服务器只提供index.html文件就行

   - 对SEO不好，哈希值部分不会被搜索引擎抓取

### 5.3 懒加载

- 不使用懒加载，直接导入组件![image-20250225112127986](/Users/soup/Library/Application Support/typora-user-images/image-20250225112127986.png)

  打包后只有一个js文件

  ![image-20250225112215594](/Users/soup/Library/Application Support/typora-user-images/image-20250225112215594.png)

  运行开发环境：npm run dev的时候，首次加载页面就会加载所有的组件

  ![image-20250225112340047](/Users/soup/Library/Application Support/typora-user-images/image-20250225112340047.png)

- 使用懒加载：在访问到文件的时候才去加载组件![image-20250225112531666](/Users/soup/Library/Application Support/typora-user-images/image-20250225112531666.png)

  打包项目，发现会有懒加载的组件对应的js和css文件

  ![image-20250225112610350](/Users/soup/Library/Application Support/typora-user-images/image-20250225112610350.png)

  运行开发环境：npm run dev的时候，访问到Eggs.vue组件的时候才去加载Eggs.vue的js文件和css文件

## 思考：

### 1、什么是SEO？

Search Engine Optimization，搜索引擎优化

通过遵循搜索引擎的规则和算法以达到以下目的

- 对网站的内容、结构、代码等多方面进行优化
- 提高网站在搜索引擎自然搜索结果中的排名
- 加网站的可见性和流量，最终实现网站的商业目标或其他目标的技术和策略

### 2、为什么createWebHashHistory不利于SEO？





vite：https://www.bilibili.com/video/BV1GN4y1M7P5?spm_id_from=333.788.player.switch&vd_source=dde64d07ecb0f5155b9ee44781f029a0&p=2

技术蛋老师：https://space.bilibili.com/327247876

