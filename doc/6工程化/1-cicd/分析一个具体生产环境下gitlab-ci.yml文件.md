# 分析一个具体生产环境下.gitlab-ci.yml文件

源文件在同目录下：gitlab-ci.yml

gitlab的CI/CD默认的变量文档：https://docs.gitlab.com/ci/variables/predefined_variables

## 1、default

默认所有的job都使用这个node，作为runner的执行器

```yaml
default:
  image: registry.gitlab.dreamdev.cn/infrastructure/build/node:18.20-slim
```

在部署gitlab的服务器中有一个项目专门存基础构建的镜像

<img src="/Users/soup/Library/Application Support/typora-user-images/image-20250227181014495.png" alt="image-20250227181014495" style="zoom:67%;" />

registry.gitlab.dreamdev.cn 这个域名专门用来访问这个仓库，指向这个文件

实例runner中的配置使用docker作为执行器

![image-20250227205237092](/Users/soup/Library/Application Support/typora-user-images/image-20250227205237092.png)

## 2、stages

四个阶段：build（构建阶段）、upload（上传静态资源）、image（构建镜像并上传）、deploy（部署）

```yaml
stages:
  - build
  - upload
  - image
  - deploy
```

![image-20250227181250105](/Users/soup/Library/Application Support/typora-user-images/image-20250227181250105.png)

## 3、variables

变量

```yaml
variables:
  TEST_NAMESPACE: ebag-test
  PROD_NAMESPACE: ebag-prod
  DEPLOY_NAME_TEST: ai-learn-pc-web
  DEPLOY_NAME_PROD: ai-learn-pc-web
  KUBECTL_IMAGE: registry.gitlab.dreamdev.cn/docker/build/kubectl:v1.14.1-3
  GIT_DEPTH: 1
```

GIT_DEPTH：是一个用于控制 **Git 克隆深度** 的环境变量，它决定了 GitLab Runner 在拉取代码仓库时获取的提交历史深度，默认50。

## 4、job1：build-test

```yaml
build-test:
  stage: build  # 构建阶段
  variables: 
    DREAMENV: TEST
  cache:
    key: $CI_PROJECT_ID-$CI_PROJECT_NAME
    paths: # 相对于项目根目录的路径
      - .npm/ # 在job执行的脚本中会把依赖包放在.npm文件中，这里对这个文件夹进行缓存
  before_script:
    - echo "$NPMRC" > ~/.npmrc # 打印变量$NPMRC到标准输出并移植到.npmrc文件中，是对npm的配置
  script:
    - npm ci --omit=optional --cache .npm --prefer-offline --audit=false #下载依赖包
    - npm run build
  artifacts:	# 将路径为dist的文件构建成产物，3天后过期
    expire_in: 3 days
    paths:
      - dist
  rules:
    - if: $CI_COMMIT_REF_NAME == 'test'  # 分支名是test执行
```

### 4.1 before_script

执行script前要执行的脚本

因为在script中执行的是npm的脚本，需要设置npm的相关配置

1. `echo` 将指定的文本内容输出到标准输出
2. `$NPMRC` 表示引用名为 `NPMRC` 的环境变量
3. `>` 是 shell 中的重定向符号，用于将前面命令的输出结果重定向到指定的文件中。如果文件不存在，会创建该文件；如果文件已经存在，会覆盖文件原有的内容。
4. `~/.npmrc` .npmrc文件

```yaml
echo "$NPMRC" > ~/.npmrc #配置npm后，就可以用npm下载依赖包
```

​	`$NPMRC`是在群组中配置的，需要管理员权限，这是这个值的内容

```txt
//registry.npm.dreamdev.cn/:always-auth=false
@ebag:registry="https://registry.npm.dreamdev.cn"
registry="https://registry.npmmirror.com/"
//registry.npm.dreamdev.cn/:username=npmadmin
//registry.npm.dreamdev.cn/:_password="UmVhZCFucG1fQm95"
//registry.npm.dreamdev.cn/:email=npmadmin@readboy.com
```

- `@ebag:registry="https://registry.npm.dreamdev.cn"`

  指定依赖包的名字以@ebag开头的设置镜像源是 https://registry.npm.dreamdev.cn

  这是公司的私有镜像源

  ![image-20250227204021859](/Users/soup/Library/Application Support/typora-user-images/image-20250227204021859.png)

- `registry="https://registry.npmmirror.com/"`

  默认的镜像源是淘宝的镜像源

### 4.2 cache

![image-20250227195117806](/Users/soup/Library/Application Support/typora-user-images/image-20250227195117806.png)

### 4.3 script：job执行的脚本

```yaml
- npm ci --omit=optional --cache .npm --prefer-offline --audit=false # 安装依赖
```

1. `npm ci` 是npm提供给ci环境中的命令
2. `--omit=optional` 忽略可选依赖项
3. `--cache .npm` 把npm下载的文件缓存在.npm中，cache对.npm文件进行缓存，如果文件夹里面的包已经下载了就不用再下载
4. `--prefer-offline` 优先使用缓存包，如果缓存包没有再从网路下载
5. `--audit=false` 禁用对项目依赖包的安全功能

### 4.4 artifacts

![image-20250227192058830](/Users/soup/Library/Application Support/typora-user-images/image-20250227192058830.png)![image-20250227192109022](/Users/soup/Library/Application Support/typora-user-images/image-20250227192109022.png)

## 分析build-test的报告

tip： 所有流水线报告在这 `/Users/soup/Documents/2025年工作包/基建学习/流水线报告`

### 阶段1：Preparing the "docker" executor

准备runner的执行器runner

![image-20250227210138471](/Users/soup/Library/Application Support/typora-user-images/image-20250227210138471.png)

### 阶段2：Preparing environment

![image-20250227210944081](/Users/soup/Library/Application Support/typora-user-images/image-20250227210944081.png)

```Running on runner-afcomky-project-1261-concurrent-0 via iZwz9i833t6h5cq295eynrZ...```

afcomky：指定的runner

project-1261：项目id是1261的项目

via iZwz9i833t6h5cq295eynrZ...：经由这个runner

### 阶段3：Getting source from Git repository

从gitlab仓库中拉取项目代码

![image-20250227213020981](/Users/soup/Library/Application Support/typora-user-images/image-20250227213020981.png)

### 阶段4：Restoring cache

恢复缓存的过程：一般是对依赖或是构建产物的缓存。这个阶段写的是对依赖的缓存。

```yml
  cache:
    key: $CI_PROJECT_ID-$CI_PROJECT_NAME
    paths: # 相对于项目根目录的路径
      - .npm/ # 在job执行的脚本中会把依赖包放在.npm文件中，这里对这个文件夹进行缓存
```

![image-20250228091925879](/Users/soup/Library/Application Support/typora-user-images/image-20250228091925879.png)

`extracted`：提取的过去式

### 阶段5：Executing "step_script" stage of the job script

开始执行build阶段的各个job的脚本

```yaml
before_script:
    - echo "$NPMRC" > ~/.npmrc # 打印变量$NPMRC到标准输出并移植到.npmrc文件中，是对npm的配置
  script:
    - npm ci --omit=optional --cache .npm --prefer-offline --audit=false #下载依赖包
    - npm run build
```

deprecated：荒废的

#### 执行npm install

![image-20250228094753091](/Users/soup/Library/Application Support/typora-user-images/image-20250228094753091.png)husky：是git执行特定操作（commit、push、pull)前后自动触发执行的脚本，如：检查代码、格式化等功能。

这里说`husky - git command not found, skipping install`：表示gitlab runner所在环境找不到git命令。

项目中的package.json文件中有'prepare'命令会在npm install之后自动执行。![image-20250228094532564](/Users/soup/Library/Application Support/typora-user-images/image-20250228094532564.png)

#### 执行npm build

![image-20250228095726710](/Users/soup/Library/Application Support/typora-user-images/image-20250228095726710.png)

package.json中build脚本：

`"build": "echo 'VITE_ENV=test' > .env.local&&get-config test&&vite build"`

1. `echo 'VITE_ENV=test' > .env.local`：将VITE_ENV=test这段写入根目录.env.local文件中

   本地项目执行这个npm build后

   ![image-20250228100217636](/Users/soup/Library/Application Support/typora-user-images/image-20250228100217636.png)

2. `get-config test`：获取变量配置项

   ![image-20250228100439585](/Users/soup/Library/Application Support/typora-user-images/image-20250228100439585.png)

3. `vite build`：执行vite的构建命令

- `transforming`：开始转换

  ![image-20250228101450412](/Users/soup/Library/Application Support/typora-user-images/image-20250228101450412.png)

  在前端项目构建流程中，代码转换是一个关键环节。由于现代前端开发广泛运用了各种新的语言特性和模块规范，而这些新特性可能不被所有目标浏览器或运行环境所支持。因此，构建工具需要对代码进行转换，使其能够在目标环境中正常运行。

  1. js语法转换：es6》es5
  2. 模块转换：把使用 ES 模块（`import` 和 `export`）或其他模块规范（如 CommonJS）编写的代码转换为目标环境能够理解的模块格式。
  3. css转换

  这个日志表示了模块stream、events、buffer、util被转换，以及项目里面的formula.js，全部是7525个模块被转换

- `rendering chunks`：构建工具会把项目代码分割成多个较小的代码块

  Chunks：块

- `computing gzip size.`：构建工具正在计算打包后文件经过 Gzip 压缩后的大小![image-20250228102645175](/Users/soup/Library/Application Support/typora-user-images/image-20250228102645175.png)

  ![image-20250228102422441](/Users/soup/Library/Application Support/typora-user-images/image-20250228102422441.png)![image-20250228102441280](/Users/soup/Library/Application Support/typora-user-images/image-20250228102441280.png)![image-20250228102459464](/Users/soup/Library/Application Support/typora-user-images/image-20250228102459464.png)

  发现到只有png不会被压缩，其他的css、js、svg都会被gzip，是因为png本身已经对图片进行压缩，再gzip意义不大

  ![image-20250228141748928](/Users/soup/Library/Application Support/typora-user-images/image-20250228141748928.png)

  花费1m22s

​		build完之后产生dist

### 阶段6：Saving cache for successful job

为成功的job缓存到.npm/文件

![image-20250228142046375](/Users/soup/Library/Application Support/typora-user-images/image-20250228142046375.png)

### 阶段7：Uploading artifacts for successful job

![image-20250228142443628](/Users/soup/Library/Application Support/typora-user-images/image-20250228142443628.png)

### 阶段8：Cleaning up project directory and file based variables

清除空间![image-20250228142728304](/Users/soup/Library/Application Support/typora-user-images/image-20250228142728304.png)

## 5、job2: upload-test

```yaml
upload-test:
  stage: upload  # 该job所属阶段是upload
  variables:
    DREAMENV: TEST
  script:
    - node ./tools/generate.config.cjs # 运行这个generate.config.cjs文件的脚本
    - qshell='./tools/qshell-linux-x64' # 七牛云提供的命令行工具 qshell 在 64 位 Linux 操作系统下的可执行文件
    - chmod a+x "${qshell}" # 为这个命令行工具添加可执行权限，a+x 表示为所有用户
    - ${qshell} account "${QINIU_AK}" "${QINIU_SK}" # 账号密码登陆
    - ${qshell} qupload 8 ./qiniuconfig # 使用七牛云命令行上传文件 
  rules:
    - if: $CI_COMMIT_REF_NAME == 'test'  # 测试分支的时候执行该job
```

process.env：这个的变量可以是gitlab全局配置、项目配置、ci文件配置

- `node ./tools/generate.config.cjs`：node执行这个文件./tools/generate.config.cjs

  查看里面写的是

  config：将dist下的文件上传到指定环境路由的七牛云bucket

  写到文件qiniuconfig里面

- `qshell='./tools/qshell-linux-x64'`：定义`七牛云命令行工具`路径

- `chmod a+x "${qshell}"` 

  chmod：修改文件权限的命令

  a+x：表示为所有用户

- `${qshell} account "${QINIU_AK}" "${QINIU_SK}"`：登陆七牛云

- `${qshell} qupload 8 ./qiniuconfig`：使用qupload命令行上传 qiniuconfig文件

  `8` 表示并发上传的线程数

  **<u>*上传这个配置文件，并且执行这个配置文件*</u>**

兜一眼这个generate.config.cjs文件

![image-20250228161150317](/Users/soup/Library/Application Support/typora-user-images/image-20250228161150317.png)

在vite.config.js中看获取资源的路径![image-20250228161633712](/Users/soup/Library/Application Support/typora-user-images/image-20250228161633712.png)

发现它是指定域名的，但是一个bucket有很多个域名，指定了其中一个，这样怎么实现cdn加速？

到思考2中看答案

## 分析upload-test的报告

![image-20250303112547833](/Users/soup/Library/Application Support/typora-user-images/image-20250303112547833.png)

需要经历这些阶段

![image-20250303092813220](/Users/soup/Library/Application Support/typora-user-images/image-20250303092813220.png)

### 阶段3：Getting source from Git repository

从仓库中获取源代码

![image-20250303101219280](/Users/soup/Library/Application Support/typora-user-images/image-20250303101219280.png)

### 阶段4：Downloading artifacts

下载构建产物

![image-20250303105844792](/Users/soup/Library/Application Support/typora-user-images/image-20250303105844792.png)

```
Downloading artifacts from coordinator... ok        host=gitlab.dreamdev.cn id=417571 responseStatus=200 OK token=glcbt-64
```

Downloading artifacts from coordinator... ok：从协调器中下载产物

id=417571：强调下载的产物任务id

token=glcbt-64：身份验证令牌，授权的用户或任务可以下载产物

### 阶段5：Executing "step_script" stage of the job script

执行job脚本

![image-20250303114409243](/Users/soup/Library/Application Support/typora-user-images/image-20250303114409243.png)

![image-20250303113508762](/Users/soup/Library/Application Support/typora-user-images/image-20250303113508762.png)

```
Uploading /builds/ebag/web/ai-learn/ai-learn-pc/dist/_redirects => ai-learn-pc/2025226/_redirects [1/363, 0.3%] ...
```

/builds/ebag/web/ai-learn/ai-learn-pc/dist/_redirects：服务器中文件的位置

ai-learn-pc/2025226/_redirects：七牛云中文件位置

![image-20250303114214635](/Users/soup/Library/Application Support/typora-user-images/image-20250303114214635.png)

查看是否在七牛云中有上传

![image-20250303114158865](/Users/soup/Library/Application Support/typora-user-images/image-20250303114158865.png)

## 6、job3：image-test

```yaml
image-test:
  stage: image # 镜像阶段
  image: $DOCKER_IMAGE # 指定docker镜像
  variables:
    IMAGE_NAME: $CI_REGISTRY_IMAGE/$CI_COMMIT_REF_NAME:$CI_COMMIT_SHA-$CI_PIPELINE_IID
    # 生成镜像的名称
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    # 登陆gitlab的镜像仓库地址
    - docker build --build-arg NGINX_IMAGE=$x -t $IMAGE_NAME -f docker/Dockerfile . # 使用 docker build 命令构建 Docker 镜像
    - docker push $IMAGE_NAME # 将构建好的 Docker 镜像推送到 GitLab 的容器镜像仓库
  rules:
    - if: $CI_COMMIT_REF_NAME == 'test' # 只有当前提交所在分支名是test的时候执行
```

-  IMAGE_NAME: $CI_REGISTRY_IMAGE/$CI_COMMIT_REF_NAME:$CI_COMMIT_SHA-$CI_PIPELINE_IID

  项目的 Container Registry 的地址/构建项目的分支名：项目为其构建的提交修订-当前流水线的项目级 IID

- docker build --build-arg NGINX_IMAGE=$NGINX_IMAGE -t $IMAGE_NAME -f docker/Dockerfile .

  1. docker build：构建docker镜像
  2. --build-arg NGINX_IMAGE=$NGINX_IMAGE：传递一个构建参数
  3. -t $IMAGE_NAME：构建镜像的名儿
  4. -f docker/Dockerfile：指定使用 `docker/Dockerfile` 作为 Dockerfile 文件
  5. `.`：当前文件

这两个地址都没有权限访问

NGINX_IMAGE：registry.gitlab.dreamdev.cn/docker/build/nginx:latest

DOCKER_IMAGE：registry.gitlab.dreamdev.cn/docker/build/docker:git

![image-20250303144933237](/Users/soup/Library/Application Support/typora-user-images/image-20250303144933237.png)

镜像仓库中找到这个镜像

![image-20250303142501537](/Users/soup/Library/Application Support/typora-user-images/image-20250303142501537.png)

## 分析image-test的报告

### 阶段1:准备环境

![](/Users/soup/Library/Application Support/typora-user-images/image-20250303150611777.png)

### 阶段2：执行脚本

![image-20250303150936268](/Users/soup/Library/Application Support/typora-user-images/image-20250303150936268.png)

![image-20250303151107854](/Users/soup/Library/Application Support/typora-user-images/image-20250303151107854.png)

### 阶段3:上传镜像

![image-20250303151137801](/Users/soup/Library/Application Support/typora-user-images/image-20250303151137801.png)

## 7、job：deploy-test

```yaml
deploy-test:
  stage: deploy # deploy阶段
  variables:
  	# image-test阶段生成的镜像
    IMAGE_NAME: $CI_REGISTRY_IMAGE/$CI_COMMIT_REF_NAME:$CI_COMMIT_SHA-$CI_PIPELINE_IID
    GIT_STRATEGY: none # 不需要git操作
  
  script:
    - mkdir -p ~/.kube # 创建kuke文件夹
    - echo "$TEST_KUBERNETES_CONFIG" > ~/.kube/config # 该文件包含了连接到 Kubernetes 测试集群所需的配置信息
    - echo "$TEST_KUBERNETES_CA" > ~/.kube/ca.crt # 该文件包含了 Kubernetes 集群的证书信息，用于验证集群的安全性。
    - kubectl -n $TEST_NAMESPACE set image deployment/$DEPLOY_NAME_TEST $DEPLOY_NAME_TEST=$IMAGE_NAME
  dependencies: []
  rules:
    - if: $CI_COMMIT_REF_NAME == 'test'
```

- image: $KUBECTL_IMAGE 

  指向kubectl工具的docker镜像，`kubectl` 是用于与 Kubernetes 集群进行交互的命令行工具。

  ![image-20250303153800732](/Users/soup/Library/Application Support/typora-user-images/image-20250303153800732.png)

  涉及到的其中三个变量都是ci文件配置的

  ![image-20250303155041424](/Users/soup/Library/Application Support/typora-user-images/image-20250303155041424.png)

- kubectl镜像文件

  ![image-20250303155250131](/Users/soup/Library/Application Support/typora-user-images/image-20250303155250131.png)

- kubectl -n $TEST_NAMESPACE set image deployment/$DEPLOY_NAME_TEST $DEPLOY_NAME_TEST=$IMAGE_NAME

  `命名空间下的特定 Deployment 中容器所使用的镜像更新为新的镜像，实现应用程序的版本更新或配置变化`

  翻译一下

  ```
    kubectl -n ebag-test set image deployment/ai-learn-pc-web ai-learn-pc-web=项目镜像
  ```

  -n $TEST_NAMESPACE：指定操作的环境变量，表示测试环境的命名空间

  

总结：

项目访问地址：https://ebag-test.readboy.com/ai-learn-pc/index/workbench#/

旨在对阿里云上 Kubernetes 集群里特定命名空间下的 Deployment 所使用的镜像进行更新

![image-20250303161315482](/Users/soup/Library/Application Support/typora-user-images/image-20250303161315482.png)

## 思考

### 1、build完之后的文件名都会带有hash值是在哪里配置的？

vite.config.js配置文档：https://vite.dev/config/build-options.html#build-rollupoptions

defineConfig.build.rollupOptions 的配置文档：https://rollupjs.org/configuration-options/#output-entryfilenames

这个是vite.config.js默认配置的，也可以自行配置

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // 可以根据需要调整资源内联的大小限制
    assetsInlineLimit: 0, 
    rollupOptions: {
      output: {
        // 为 JavaScript 文件添加哈希值
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        // 为 CSS 文件添加哈希值
        assetFileNames: `assets/[name].[hash].[ext]`
      }
    }
  }
});
```

![image-20250228110716415](/Users/soup/Library/Application Support/typora-user-images/image-20250228110716415.png)

查到的vite源码中有相关默认配置![image-20250228133843328](/Users/soup/Library/Application Support/typora-user-images/image-20250228133843328.png)

### 2、vite.config.js中配置请求静态资源是指定域名的，但是一个bucket有很多个域名，指定了其中一个，这样怎么实现cdn加速？

**<u>*误区：cdn加速域名不代表cdn边缘服务器*</u>**

- cdn加速域名：主要负责引导请求，本身不存储和处理资源
- CDN 边缘服务器：负责存储从源站拉取的静态资源（如 CSS、JavaScript、图片等），并根据用户的请求将这些资源返回给用户

1. CDN 加速域名是 CDN 服务提供商为用户分配的用于访问加速资源的域名。
2. 在 `vite.config.js` 里把 `base` 设置为这个 CDN 加速域名后，用户访问网站时，浏览器会根据这个域名去请求静态资源。
3. 这个域名背后实际上是 CDN 服务提供商部署在全球各地的大量**<u>*边缘服务器组成的网络*</u>**。所以，从某种程度上讲，这个域名代表着整个 CDN 边缘服务网络，它会引导用户的请求到最合适的边缘服务器上获取资源。

**<u>*这个cdn域名代表的是整个cdn网络，dns计算之后才会给出离用户最近的cdn边缘服务器地址*</u>**

这个域名是cdn加速了，所以测试环境中访问的资源就是cdn边缘服务器的ip地址![image-20250228165109930](/Users/soup/Library/Application Support/typora-user-images/image-20250228165109930.png)

### 3、如果一个cdn加速域名配置图片缓存可以是1天，边缘服务器返回的资源也会是图片缓存1天吗？

如果 CDN 加速域名配置了图片缓存时间为 1 天，边缘服务器返回的资源响应头中大概率会体现出这个缓存策略，会在响应头添加相关的缓存控制字段：cache-control、expores

如果是：源站设置覆盖、cdn刷新、客户端请求头有Cache-Control: no-cache` 或 `Pragma: no-cache就不会有这个缓存
