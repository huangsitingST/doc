import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
console.log(1212, process.env.NODE_ENV);

export default defineConfig({
  // base: getBaseURL(),
  base: process.env.NODE_ENV === "production" ? "/doc/" : "/",
  title: "个人学习阅读文档",
  description: "A VitePress Site21",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/link.md" },
      { text: "README", link: "/doc/README.md" },
      { text: "文档", link: "/doc/6工程化/3-nginx/Nginx-上.md" },
    ],

    sidebar: [
      {
        text: "基建学习",
        items: [
          { text: "Nginx-上", link: "/doc/6工程化/3-nginx/Nginx-上.md" },
          { text: "Nginx-下", link: "/doc/6工程化/3-nginx/Nginx-下.md" },

          {
            text: "部署一套gitlab实现ci流水线",
            link: "/doc/2框架/2-git/部署一套gitlab实现ci流水线.md",
          },

          {
            text: "git",
            link: "/doc/2框架/2-git/git.md",
          },
          {
            text: "docker",
            link: "/doc/6工程化/0-docker/Docker.md",
          },
          {
            text: "CICD",
            link: "/doc/6工程化/1-cicd/CICD.md",
          },
          {
            text: "node",
            link: "/doc/6工程化/4-node/node.md",
          },
          {
            text: "cdn",
            link: "/doc/6工程化/6-cdn/CDN.md",
          },
        ],
      },
      {
        text: "vue生态学习",
        items: [
          {
            text: "从零开始搭建一个vue",
            link: "/doc/2框架/1-vue/0-从零开始搭建一个vue.md",
          },
          { text: "vite文档学习", link: "/doc/2框架/0-vite/文档学习.md" },
          {
            text: "vue学习",
            link: "/doc/2框架/1-vue/2-vue学习.md",
          },
          {
            text: "vue-router",
            link: "/doc/2框架/1-vue/1-vue-router.md",
          },
        ],
      },
      {
        text: "项目总结",
        items: [
          { text: "爱学网app", link: "/doc/4项目业务/0-项目点/爱学网app.md" },
          {
            text: "开发中遇到的问题",
            link: "/doc/4项目业务/1-技术点/开发中遇到的问题.md",
          },
          { text: "micro-app", link: "/doc/4项目业务/2-项目学习/micro-app.md" },
        ],
      },
      {
        text: "基础",
        items: [
          { text: "js", link: "/doc/1基础/2-js/js.md" },
          { text: "html", link: "/doc/1基础/1-html/html.md" },
          { text: "css", link: "/doc/1基础/0-css/css.md" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 20 20"><g fill="none"><path fill="currentColor" d="M6.5 2h6.685a1.5 1.5 0 0 1 1.106.486l4.314 4.702A1.5 1.5 0 0 1 19 8.202V18.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18.5v-15A1.5 1.5 0 0 1 6.5 2" opacity=".2"></path><path fill="currentColor" d="M6.5 12.5a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zm0 2.5a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1z"></path><path fill="currentColor" fill-rule="evenodd" d="M11.185 1H4.5A1.5 1.5 0 0 0 3 2.5v15A1.5 1.5 0 0 0 4.5 19h11a1.5 1.5 0 0 0 1.5-1.5V7.202a1.5 1.5 0 0 0-.395-1.014l-4.314-4.702A1.5 1.5 0 0 0 11.185 1M4 2.5a.5.5 0 0 1 .5-.5h6.685a.5.5 0 0 1 .369.162l4.314 4.702a.5.5 0 0 1 .132.338V17.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5z" clip-rule="evenodd"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M11.5 2.1v4.7h4.7"></path><path fill="currentColor" d="M8.134 6.133a1.067 1.067 0 1 0 0-2.133a1.067 1.067 0 0 0 0 2.133"></path><path fill="currentColor" fill-rule="evenodd" d="M10.266 8.444c0-1.134-.955-1.955-2.133-1.955S6 7.309 6 8.444v.534a.356.356 0 0 0 .356.355h3.555a.356.356 0 0 0 .355-.355z" clip-rule="evenodd"></path></g></svg>',
        },
        link: "http://8.134.38.38/assets/%E5%89%8D%E7%AB%AF-%E9%BB%84%E6%96%AF%E5%A9%B7-%E4%B8%89%E5%B9%B4.pdf",
      },
    ],
  },
  srcExclude: [
    // "doc/2框架/1-vue/0-从零开始搭建一个vue.md",
    // "基建学习/git.md",
    // "基建学习/网络安全.md",
    // "基建学习/Docker.md",
    // "gitlab管理员界面.mov",
    // "http/请求头.md",
    // "vite/",

    // "项目总结/",
    // "**/2框架/**", 
    // "**/4项目业务/**",
    "**/5计算机网络/**",
    "**/项目集.md",
    // "**/6工程化/0-docker/**",
    // "**/6工程化/1-*/**",
    // "**/6工程化/4-*/**",
    "**/6工程化/5-*/**",
    // "**/6工程化/6-*/**",
    "**/6工程化/7-*/**",
    "**/6工程化/8-*/**",
    "**/6工程化/9-*/**",
  ],
});
