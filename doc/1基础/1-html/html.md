## 1、form表单会有默认提交行为

```html
<form id="myForm">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>
  <button type="submit">Submit</button>
</form>
```

在表单内部有一个`type=submit`的按钮，当点击这个按钮的时候：

- 表单的默认行为：收集表单中带有nam属性的字段
- 构建请求：get方法会拼接字符串到url中，post会放在http请求体中
- 请求发送给服务器
- 刷新或跳转页面：服务器返回响应，浏览器会刷新当前页面或者跳转到新页面

1. 为什么会有这种行为？

   在早期web开发中，js功能有限，页面交互主要通过服务器处理

2. 局限性

   页面刷新会打断用户体验，特别在单应用页面中

3. 阻止默认行为

   ```js
   document.querySelector('form').addEventListener('submit', function(event) {
       event.preventDefault(); // 阻止表单的默认提交行为
       // 在这里执行自定义逻辑，比如发送AJAX请求
   });
   ```