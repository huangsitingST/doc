



# 爱学网app

工作内容：爱学网app实现AI答疑功能

需求内容：学生通过题目&拍照上传图片可以进行和ai聊天解答题目

技术核心：大模型对话、科目提示词定位

![image-20250414150038980](../../images/image-20250414150038980.png)

## 1 上传图片的方式：拓展-文件上传的方式

aliyun上传、七牛云上传

## 2 图片框题&识别图片的题目

使用阿里云集成的openai：https://apifox.com/apidoc/shared-2fd72ae0-84f1-4e2e-b210-8b204151d970

## 4 会话：指令id

## 5 与安卓通信

使用js-bridge，核心是，应用端和h5端都把属性或者方法放在window下，两个端使用不同的方法去调用

应用端使用flutter，可以实现多端打包，虽然这么说，但是如果出现了不兼容的现象，其实也是应用端去做一个兼容解决

就像uniapp一样，也说是前端可以打包成h5、小程序、安卓、ios应用，但是有些兼容问题出现也需要通过代码和配置兼容

- h5调用native原生

  应用端

  ```js
  // 注入对象，应用端实际上是在window中存放应用端的对象，里面包含属性和方法供h5端调用
  webView.addJavascriptInterface(new JsBridge(), "JSBridge");
  // 定义注入的Jsbridge对象
  class JsBridge {  
      @JavascriptInterface
      fun takePhoto(callbackId: String) {
          // 调用相机并返回结果
      }
  }
  ```

  h5调用

  ```js
  window.JSBridge.takePhoto('callback_123')
  ```

- native调用h5

  ```js
  // Android获取H5页面标题
  webView.evaluateJavascript("javascript:document.title", value -> {
      String title = value.replace("\"", ""); // 去除JSON引号
  });
  ```

  两种

  1. 应用端监听到h5页面加载完毕后，可以执行

     ```js
     String json = "{'key': 'value'}".replace("'", "\\'");
     webView.loadUrl("javascript:parseJson('" + json + "')");
     ```

  2. 判断构建的版本看是否支持evaluateJavascript方式

     ```js
     if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
         webView.evaluateJavascript("javascript:getResult()", new ValueCallback<String>() {
             @Override
             public void onReceiveValue(String value) {
                 // 处理 JS 返回的值（如 JSON 字符串）
             }
         });
     } else {
         webView.loadUrl("javascript:getResult()"); // 低版本降级方案
     }
     ```

     

## 6 鉴权方式

无状态 ===》有状态

### 6.1 basic authentication

通过将用户名密码**Base64编码**后的数据放在请求头**Authorization**中，服务端解码验证身份

### 6.2 session-cookie机制

服务器创建session并生成唯一id，通过cookie传给客户端，cooke存在客户端中，后续请求是会自动传这个cookie验证在请求的set-cookie中

场景：用户在银行网站A中登陆，cookie处于有效中，可以在网站A植入恶意广告，用户点击进入网站B，网站B中引导用户点击，通过脚本方式之情转账请求，传的是相同cookie，服务端认为是正常操作。

这个操作就是CSRF攻击（通过伪造用户身份，利用目标网站对浏览器的信任机制（如Cookie中的会话凭证），执行未经授权的操作）

### 6.3 token验证

#### 1、什么是token验证&例子：jwt

公司统一认证方式

由后端根据用户名密码生成token（JWT：json web token），客户端存在请求的token中传递

jwt由三个部分构成：header.playload.signature

​					算法     数据	服务端保存的一段字符串

<img src="../../images/image-20250415085934261.png" alt="image-20250415085934261" style="zoom: 24%;" />

<img src="../../images/image-20250415090046160.png" alt="image-20250415090046160" style="zoom:30%;" />

公司的jwt例子：

```
access_token: 
"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxNjgxNzgwMjU3MTE1IiwiZXhwIjoxNzQ0NjY5NjA5LCJzdWIiOiIzMDkwNjUxODMxOTQ5Mzk1In0.oSHxncyj42ISGWweeT6COnaq4jUwtxVvNQPT26IIdax8fZFHZx90YJy8gveH-NwX-HhOj2j62iztwjpqgSDkIw"
```

<img src="../../images/image-20250415092251334.png" alt="image-20250415092251334" style="zoom:67%;" />

#### 2、例子：爱学网的登录例子

![image-20250415103212705](../../images/image-20250415103212705.png)

![image-20250415103403641](../../images/image-20250415103403641.png)

公司全部的token用的是sessionid做token，问了后端，这个token不做过期时间限制。

这个account_center这个可以跟第三方接口登录。

ps：公司的中台都不用鉴权的，直接传数据就可以请求。

> [!CAUTION]
>
> 什么第三方使用场景

#### 3、refresh-token

```
{
    "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxNjgxNzgwMjU3MTE1IiwiZXhwIjoxNzQ0NjkxMDEzLCJzdWIiOiIzNDgwNDAxNjkwMDM5NjYyIn0.CsR4EGLnpyT8WZ4VogcMfHHQwYDKqXeEnADfP3tP6o4LK-7qKp_fYqqVbjghBkbu8prDr4A28drmbiB6OY9ZmQ",
    "expires_in": 7200,
    "refresh_token": "YJGXNGEYNZATZDLKOC01ZJI1LWEZNTATZWYWYWUYZDDJOGQ5",
    "token_type": "Bearer"
}
```

access_token：短效

expires_in：过期时间2h

refresh_token：长效token

![image-20250415113510092](../../images/image-20250415113510092.png)

总结：在响应拦截中处理401未认证，使用refresh_token再去请求，如果未过期则可以更新access_token和refresh_token，如果refresh_token都过期了，则可以重新登录

#### 4、SSO：single sign on 单点登录（实现多系统统一认证）

测试网站：

教学研：https://ebag-test.readboy.com/teaching-learning-research/

认证中心登录页：https://account-center-test.readboy.com/

##### 4.1 逻辑图

这里是公司单点登录的逻辑，业务网站例子是教学研

认证中心就是这个/v1/oauth2/authorize，如果请求中携带的cookie是合法的，那么就会返回code给业务网站，网站就可以拿这个code去获取login获取用户信息


![image-20250415222145114](../../../doc/images/image-20250415222145114.png)

分析下登录接口

```
https://api.ebag-test.readboy.com/login/v2/auth/token

F_code: YTRLMDU3ZTCTOGU5MS0ZM2ZHLTK5ZWUTMZI0NDNLYJEZOTC2
redirect_uri: https%3A%2F%2Febag-test.readboy.com%2Fteaching-learning-research%2F
F_from: 600000
userType: 2
```

![image-20250415213532702](../../images/image-20250415213532702.png)

返回的数据中的sessionid是整个公司通用的token，account_token是与第三方协作的token数据

并且整个教学研的认证方式是query去传这个sessionid

##### 4.2 核心要点

凡是进入到这个单点登录页面都要携带这个cookie，只有跟域名对应的cookie在控制台中采会显示出来

```
https://account-center-test.readboy.com/v1/oauth2/authorize?

client_id=1681780257115&

redirect_uri=https%3A%2F%2Febag-test.readboy.com%2Fteaching-learning-research%2F&

response_type=code
```

认证中心判断这个cookie，这个cookie是认证中心产出的，登出cookie/有实效的cookie

- 没有cookie，返回：{"code":100400,"data":{},"msg":"无效请求"}
- 登出/过期的cookie：重定向到单点登录页面
- 合法的token：重定向到redirect_uri，且返回需要的response_type![image-20250415222616124](../../images/image-20250415222616124.png)

尝试：使用apifox调用认证中心的接口，使用登出的cookie去调上面的接口，是成功的<img src="../../images/image-20250416094551632.png" alt="image-20250416094551632" style="zoom:70%;" />

#### 5、OAuth2协议标准

阮一峰理解OAuth 2.0：https://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html

##### 5.1 what

服务提供商    —— 	授权层（authorization layer）—[限权token]—》	客户端（第三方）

​	｜																	｜

​	———————————————[限权token访问服务提供商]——————————



应用A中存在重要用户信息，当第三方用户数据想去访问的时候就需要由应用A去授权，即access_token，但是有时间期限

- 首次登录就会返回access_token
- 后面再去访问的时候就可以携带这个access_token去访问
- access_token到期可以使用refresh_token去更新
- 两个token都过期了就需要重新授权

##### 5.2 授权的四种方式

阮一峰：https://www.ruanyifeng.com/blog/2019/04/oauth-grant-types.html

- 授权码（最完整、流程最严密的授权模式）

  教学研用的授权码的方式，那这个code去获取token

- 密码式

  爱学网web和app用的账号密码登录返回token

- 隐藏式

  直接返回给A网站token

  ```javascript
  https://b.com/oauth/authorize?
    response_type=token&
    client_id=CLIENT_ID&
    redirect_uri=CALLBACK_URL&
    scope=read
  ```

  ![image-20250416143004338](../../images/image-20250416143004338.png)

- 凭证式

  A直接向B请求令牌

##### 5.3 公司应用的实例：

中台（数据中心）===>  教学研（第三方应用）

​			         ===>  爱学网（第三方应用）

两个子应用都是调的同一个登录接口：https://api.ebag-test.readboy.com/login/v2/auth/login

```
// 教学研传参：使用认证完之后的code去登录
F_code: M2E2ODC2MDMTNTU5NI0ZZJRJLWIWYTCTMJIZMZA3YMU5NGE4  （中台认证返回的code）
redirect_uri: https://ebag-test.readboy.com/teaching-learning-research/
F_from: 600000
userType: 2
F_sign:

// 爱学网传参：使用用户名密码
username: 13210000001
password: a123456
userType: 2
platform: 101
		爱学网app传参
username: a211
password: a123456
userType: 1
platform: 103
F_from: 600000
```

返回的数据是一样的

![image-20250416110256391](../../images/image-20250416110256391.png)

##### 5.4 更新令牌

access_token和refresh_token结合过期时间去更新令牌，使用refresh_token去请求更新两个令牌

##### 5.5 思考：如果用户的登录时间还没有过期，去认证中心应该是不用重新登录的，这个是怎么实现的？

正常来说，是需要带access_token去访问的，但是公司的认证不携带这个中台token，以及，中台的其他接口都没有做鉴权操作。<img src="../../images/image-20250416112831390.png" alt="image-20250416112831390" style="zoom:70%;" />



##### 5.4 用户登录状态被挤掉？

后端的实现思路：

1. ip1登录，数据库中存 {uid: sessionId1}
2. ip2使用相同uid登录，数据库中更新{uid: sessionId2}
3. ip1仍然用sessionId1去访问，数据库中比对不上，提示强制退出

#### 6、市面上的登录

1. 传统凭证方式

   1. 用户名密码登录
   2. 手机号码+验证码

2. 第三方授权登录

   1. 社交媒体：微信、支付宝、抖音、google、钉钉

   2. 政府/机构统一认证：

      权威性较高的统一认证平台，用户注册后，第三方系统就可以使用sso授权登录

3. 生物识别：指纹、面部、虹膜扫描

4. 无密码/新兴技术

   1. 扫码登录
   2. 游客模式
   3. 单点登录

5. 特殊场景登录

   1. 邀请码注册

7、MFA认证

Mutil-Factor Authentication。 解决两种及以上独立验证因素

8、阿里云的RAM用户

由主账户创建账户并分配权限























