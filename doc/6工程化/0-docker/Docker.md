# Docker

学习链接：https://docker.easydoc.net/doc/81170005/cCewZWoN/lTKfePfP

## 1、定义

**Docker 是一个应用打包、分发、部署的工具**
**你也可以把它理解为一个轻量的```虚拟机```，它只虚拟你软件需要的运行环境，多余的一点都不要，**
**而普通虚拟机则是一个完整而庞大的系统，包含各种不管你要不要的软件。**

## 2、笔记

### 2.1 docker完成整一套动作：

打包（将应用所需要的资源打包成一个镜像）

分发（将镜像上传到镜像仓库，别人可以获取/安装）

部署（将镜像运行起来，可以直接访问）

### 2.2 重要概念

**镜像**：可以理解为软件安装包，可以方便的进行传播和安装。（相当于exe）

**容器**：软件安装后的状态，每个软件运行环境都是独立的、隔离的，称之为容器。（相当于exe安装之后的状态）

### 2.3 构建一个vue应用的镜像

- 基本流程

  1. 构建vue项目的产物
  2. 将产物放到nginx中
  3. 启动nginx

- 编写Dockerfile文件

  ```
  # 第一阶段：构建 Vue 项目
  # 使用 Node.js 18 作为基础镜像
  FROM node:18 AS build-stage
  # 设置工作目录
  WORKDIR /app
  # 将 package.json 和 package-lock.json 复制到工作目录
  COPY package*.json ./
  # 安装项目依赖
  RUN npm install
  # 将项目的所有文件复制到工作目录
  COPY . .
  # 构建 Vue 项目，生成生产环境的静态文件
  RUN npm run build
  
  # 第二阶段：创建生产环境镜像
  # 使用轻量级的 Nginx 镜像
  FROM nginx:stable-alpine AS production-stage
  # 创建一个目录来存储 Vue 项目的静态文件
  RUN mkdir /app
  # 将第一阶段构建好的静态文件复制到 Nginx 的默认静态文件目录
  COPY --from=build-stage /app/dist /app
  # 复制自定义的 Nginx 配置文件到 Nginx 的配置目录
  COPY nginx.conf /etc/nginx/nginx.conf
  # 暴露 Nginx 的默认端口 80
  EXPOSE 80
  
  # 启动 Nginx 服务
  CMD ["nginx", "-g", "daemon off;"]
  ```

- 配置nginx文件

  ```json
  user  nginx;
  worker_processes  auto;
  
  error_log  /var/log/nginx/error.log notice;
  pid        /var/run/nginx.pid;
  
  events {
      worker_connections  1024;
  }
  
  http {
      include       /etc/nginx/mime.types;
      default_type  application/octet-stream;
  
      log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                        '$status $body_bytes_sent "$http_referer" '
                        '"$http_user_agent" "$http_x_forwarded_for"';
  
      access_log  /var/log/nginx/access.log  main;
  
      sendfile        on;
      keepalive_timeout  65;
  
      server {
          listen       80;
          server_name  localhost;
  
          root   /app;
          index  index.html index.htm;
  
          location / {
              try_files $uri $uri/ /index.html;
          }
  
          error_page   500 502 503 504  /50x.html;
          location = /50x.html {
              root   /usr/share/nginx/html;
          }
      }
  }
  ```

- 执行构建image

  ```js
  docker build -t docker-web:v1 . 
  ```

- 运行这个容器

  ```
  docker run -d -p 9090:80 --name vue-container docker-web:v1
  // 指定这个镜像命名成vue-container并运行
  ```

### 2.4 遇到的问题

在实行构建image的过程中，会出现安装nginx和node18超时的问题，因为这两个包的镜像在国外，所以可以在docker中配置镜像。但是还是超时，直接单独安装这两个包就好了

### 2.5 目录挂载

### 2.6 多容器通信

视频项目中的web项目需要一个count变量做缓存，依赖redis，于是docker中有两个容器![image-20250213112218587](/Users/soup/Library/Application Support/typora-user-images/image-20250213112218587.png)

- 在docker中创建一个虚拟网络
- 让redis和web项目使用同一个网络
- web项目中使用同一个网络中的指定redis

就可以实现多容器通信

### 2.7 Docker-Compose

配置多容器通信的配置文件

```js
version: "3.7"

services:
  app:
    build: ./
    ports:
      - 80:8080
    volumes:
      - ./:/app
    environment:
      - TZ=Asia/Shanghai
  redis:
    image: redis:5.0.13
    volumes:
      - redis:/data
    environment:
      - TZ=Asia/Shanghai

volumes:
  redis:

```

运行之后会默认创建网络并把所有的容器放在同一个网络运行

```js
docker-compose up
```

![image-20250213113729253](/Users/soup/Library/Application Support/typora-user-images/image-20250213113729253.png)

运行完之后可以看到：一个容器有两个服务，这两个服务相互合作

### 2.8 发布和部署

将自己的镜像发布到镜像仓库中

- 发布：有官方docker免费的镜像仓库，或者阿里云自己的

  ![image-20250213135635802](/Users/soup/Library/Application Support/typora-user-images/image-20250213135635802.png)

  推送镜像到官方docker镜像仓库中

-  拉取并部署

  ```js
  docker run -dp 9090:80 --name docker-web-container huangsiting/docker-web:v1    
  ```

  ![image-20250213140625563](/Users/soup/Library/Application Support/typora-user-images/image-20250213140625563.png)

## 3、思考

#### 3.1 有很多的镜像，那我们去安装运行一个镜像就像是运行了一个应用，那么对应用的任何操作也是可以的吗？可以看到界面吗？

答：以redis为例，正常安装redis需要搭建redis所需要的环境以及相关配置https://redis.io/downloads/到本地操作系统上，可以通过命令行对redis对它进行操作，如果想要方便的操作redis再去下载redis相关图形化界面的软件。

拉取镜像、安装、运行相当于以上操作，跟上面的操作没有区别，在本地操作系统用一个端口来跑这个服务，这里是使用本地操作系统的6379端口来跑redis服务，不会下载图形化界面，可以选择下载图形化界面软件，在安装完后需要链接到本地的服务，才能在图形化界面中操作这个服务。

![image-20250207174434392](/Users/soup/Library/Application Support/typora-user-images/image-20250207174434392.png)

#### 3.2 可以用docker来做什么？

答：1-可以通过docker快速安装应用。

<img src="/Users/soup/Library/Application Support/typora-user-images/image-20250207175946607.png" alt="image-20250207175946607" style="zoom:90%;" />

2-在开发业务中，本地应用上传到镜像仓库中，服务器就可以拉取镜像部署。

#### 3.3 在2.3中，image和node、nginx的关系是什么

![image-20250211173758565](/Users/soup/Library/Application Support/typora-user-images/image-20250211173758565.png)

docker相当于一个虚拟机，运行应用所需要的环境都需要在docker中配置

#### 3.4 公司的镜像仓库是哪个？怎么配置的

公司使用的是阿里云的

![image-20250213143142690](/Users/soup/Library/Application Support/typora-user-images/image-20250213143142690.png)

#### 3.5、 开发人员拉取项目，npm包失败是什么原因？

![image-20250213162555878](/Users/soup/Library/Application Support/typora-user-images/image-20250213162555878.png)

假如项目是A开发的，她电脑上node环境是18，且ci文件配置的环境是node18，项目正常运行没问题，但是B的电脑node16，安装的某个包里面不再兼容node16了，所以下载失败，需要升级为node18，可以使用nvm进行node版本管理

## 4、 公司的镜像仓库

账号：huangsiting@zhreadboy.onaliyun.com

密码：as76QTrCsXujeKE6(K!LxBH@l1qimAD(

ram用户登陆阿里云控制台



目前公司用的两种镜像仓库gitlab和阿里云的

- 阿里云：存放node镜像有很多种

![image-20250213165902809](/Users/soup/Library/Application Support/typora-user-images/image-20250213165902809.png)

直接在阿里云镜像仓库中拉取需要的镜像，项目配置中直接指向这个镜像

![企业微信截图_d9976525-0cff-4d54-a006-72cf179b3e8b](/Users/soup/Library/Containers/com.tencent.WeWorkMac/Data/Documents/Profiles/D94AE1DB4AB88E28EA4F6C889814E92F/Caches/Images/1970-1/5306a796c09f6a6b180c40bdf9e43d01_HD/企业微信截图_d9976525-0cff-4d54-a006-72cf179b3e8b.png)

- gitlab仓库镜像库

![image-20250213170122226](/Users/soup/Library/Application Support/typora-user-images/image-20250213170122226.png)

​	根据这个地址找到公司gitlab的基础建设仓库

​	https://gitlab.dreamdev.cn/infrastructure![image-20250214120036443](/Users/soup/Library/Application Support/typora-user-images/image-20250214120036443.png)

​	有nginx和node服务的镜像库![image-20250214120209690](/Users/soup/Library/Application Support/typora-user-images/image-20250214120209690.png)

​	node里面就有指定的镜像版本![image-20250214120242338](/Users/soup/Library/Application Support/typora-user-images/image-20250214120242338.png)	

#### [**思考：公司是从阿里云的镜像仓库转到gitlab镜像仓库的，是出于什么考虑？**]()

## 6、操作下：在公司练手项目上自己写ci，上传镜像

- 构建docker指导部署运行项目

  ![image-20250214144746546](/Users/soup/Library/Application Support/typora-user-images/image-20250214144746546.png)

- 编写ci文件

  ![image-20250214145026411](/Users/soup/Library/Application Support/typora-user-images/image-20250214145026411.png)

## 7、总结

![image-20250213150802651](/Users/soup/Library/Application Support/typora-user-images/image-20250213150802651.png)

## 8、常见docker命令

![image-20250308104135215](/Users/soup/Library/Application Support/typora-user-images/image-20250308104135215.png)

![image-20250308104144942](/Users/soup/Library/Application Support/typora-user-images/image-20250308104144942.png)

![image-20250308104153279](/Users/soup/Library/Application Support/typora-user-images/image-20250308104153279.png)
