### NodeJs

https://nqdeng.github.io/7-days-nodejs

中文文档：https://npm.nodejs.cn/

## 1、什么是nodejs？

- Chrome V8 引擎

  `将js代码高效的解析并转换成计算机可直接运行的机器码`，让js程序能在浏览器、服务器等环境中快速执行

- 浏览器能执行js代码就是因为浏览器内置了js引擎，如Chrome V8 引擎

- Node.js 的线程模型是一个**单线程与多线程结合**的架构

  1. 其设计核心在于**主线程的单线程事件循环机制**，
  2. 底层通过**异步I/O、线程池和Worker Threads模块**实现了多线程能力。


## 2、模块化架构

通过`module模块系统`划分功能

- 核心模块：http、fs
- 第三方：npm（node package manager）
- 还可以使用require引入模块，exports导出模块

counter.js

```js
let i = 0;
function count() {
    return ++i;
}
exports.count = count;  // 1-模块导出
```

main.js

```js
let count = require("./counter"); // 2-模块导入
let count1 = require("./counter");


// 3-module对象：可以访问到当前模块的一些相关信息
module.exports.hello = function () {
  console.log("Hello World!");
};
console.log(module); // 看图片

// 4-模块初始化：一个模块中的JS代码仅在模块第一次被使用时执行一次，并在执行过程中初始化模块的导出对象。之后，缓存起来的导出对象被重复利用。
// main.js 是主应用程序
console.log(count.count()); // 1
console.log(count1.count()); // 2
console.log(count1.count()); // 3

console.log(count === count1); // true
```

![image-20250305115142558](/Users/soup/Library/Application Support/typora-user-images/image-20250305115142558.png)

## 3、模块路径解析规则

上面这个图可以看见path在找`node_modules`，这是node找模块包的优先级，不断向上找直到根

可以使用NODE_PATH变量，指定额外的模块搜索路径

Window写法：NODE_PATH环境变量：

```
 NODE_PATH=/home/user/lib;/home/lib
```

当使用`require('foo/bar')`的方式加载模块时，则NodeJS依次尝试以下路径。

```
 /home/user/lib/foo/bar
 /home/lib/foo/bar
```

## 4、package

模块化

![image-20250305150241455](/Users/soup/Library/Application Support/typora-user-images/image-20250305150241455.png)

package.json

```json
{
    "name": "counter1", // 命名
    "main": "./lib/main.js"
}
```

test.js

```js
const counter = require('./counter')
console.log(counter);
```

test.js执行这个require的时候会进入到counter这个文件夹，然后根据这个package.json找入口文件

看下axios的结构

![image-20250305150645076](/Users/soup/Library/Application Support/typora-user-images/image-20250305150645076.png)

## 5、npm

和nodejs一起安装的包管理工具

- 让用户从npm服务器中下载别人的三方包到本地使用
- 让用户从npm服务器中下载别人的命令行程序到本地使用
- 上传自己的包到npm服务器

1. 下载三方包

   npm install argv

   ![image-20250305155816799](/Users/soup/Library/Application Support/typora-user-images/image-20250305155816799.png)这个文件就可以管理所有的包

   ![image-20250305160152791](/Users/soup/Library/Application Support/typora-user-images/image-20250305160152791.png)安装的包如果也依赖其他包的话就会有自己的node_modules，package.json的dependences也会有定义

2. 安装命令行程序

   -g：全局安装

   ```
   npm install echo -g
   ```

## 6、文件操作

### 6.1 Buffer（数据块）

缓冲区：是一种临时存储数据的机制，将js数据处理能力从string》》二进制数据

- 是二进制数据容器

  ```javascript
  // 从字符串创建（默认 utf8 编码）
  const buf1 = Buffer.from("Hello World");
  ```

- 内存分配

  ```javascript
  // 创建指定大小的空缓冲区（默认填充 0）
  const buf2 = Buffer.alloc(10);
  ```

- 编码支持

  `utf8`、`base64`、`hex` 等编码与字符串相互转换

#### 拓展1：什么是utf8、base64编码？

#### 拓展2：什么是Unicode 字符集

### 6.2 Stream（数据流）

当内存中无法一次装下需要处理的数据时，或者一边读取一边处理更加高效时，我们就需要用到数据流。

```js
var rs = fs.createReadStream(src);

rs.on('data', function (chunk) {
    rs.pause();
    doSomething(chunk, function () {
        rs.resume();
    });
});

rs.on('end', function () {
    cleanUp();
});
```

### 6.3 File System（文件系统）

## 7、网络操作

### 7.1 http/https

```js
var options = {
        key: fs.readFileSync('./ssl/default.key'),
        cert: fs.readFileSync('./ssl/default.cer')
    };

var server = https.createServer(options, function (request, response) {
        // ...
    });

// 给多个域名添加证书
server.addContext('foo.com', {
    key: fs.readFileSync('./ssl/foo.com.key'),
    cert: fs.readFileSync('./ssl/foo.com.cer')
});

server.addContext('bar.com', {
    key: fs.readFileSync('./ssl/bar.com.key'),
    cert: fs.readFileSync('./ssl/bar.com.cer')
});
```

### 7.1 url

![image-20250306105047359](/Users/soup/Library/Application Support/typora-user-images/image-20250306105047359.png)

### 7.2 socket

`================================================================================================`

卡住https://nqdeng.github.io/7-days-nodejs/#5

什么是进程线程的东西

## 8、进程



## 思考

### 1、process.env

### 2、分析一个node_modules包的package.json

### 3、一般我们会同时提供命令行模式和API模式两种使用方式？

### 4、input标签：type=file，是什么文件类型？能否实现对文件的操作？



### 5、文本编码是什么？

目的是

- 字符到二进制的映射：给每个字符匹配一个数字编码：A -> 65`（十进制）`
- 跨设备兼容
- 支持多语言

主流的编码标准：

- ASCII：128个

  如：A -> 0100 0001 `（二进制）`

- ISO-8859 系列

- GB 系列（中文编码）

  1. GB2312

  2. GBK：218886个字符

     如：凱 -> 8450

- Unicode

  **目标**：统一全球字符集（包含超过 14 万个字符）

  用UTF编码的文件可能带有BOM，这个是可以标记这个文件unicode编码模式

  ![image-20250305185907093](/Users/soup/Library/Application Support/typora-user-images/image-20250305185907093.png)

  1. **UTF-8**：可变长度（1-4 字节）

     中 -> 14989485（十进制）

  2. **UTF-16**

### 6、乱码现象是如何产生的？

![image-20250305190621136](/Users/soup/Library/Application Support/typora-user-images/image-20250305190621136.png)

![image-20250305190629109](/Users/soup/Library/Application Support/typora-user-images/image-20250305190629109.png)

![image-20250305190652269](/Users/soup/Library/Application Support/typora-user-images/image-20250305190652269.png)

![image-20250305190658480](/Users/soup/Library/Application Support/typora-user-images/image-20250305190658480.png)

### 7、node的http模块创建的http服务器返回的响应是transfer-encoding:chunked方式传输的？

transfer-encoding：用于指示消息正文在传输时使用的编码方式

常见的值有

- chunked：分块传输

  大文件下载

  实时聊天

- 压缩编码

  gzip、deflate

- identity：无编码处理

因为默认情况下，使用`.writeHead`方法写入响应头后，允许使用`.write`方法写入任意长度的响应体数据，并使用`.end`方法结束一个响应。

由于响应体数据长度不确定，因此NodeJS自动在响应头里添加了`Transfer-Encoding: chunked`字段，并采用`chunked`传输方式。

但是当响应体数据长度确定时，可使用`.writeHead`方法在响应头里加上`Content-Length`字段。

### 8、`cluster`模块是对`child_process`模块的进一步封装，专用于解决单进程NodeJS Web服务器无法充分利用多核CPU的问题。使用该模块可以简化多进程服务器程序的开发，让每个核上运行一个工作进程，并统一通过主进程监听端口和分发请求。
