# js

## 1、js是一种单线程语言

为避免多线程同时操作dom等冲突问题，js被设计成单线程语言。

`浏览器提供了机制（时间循环、web worker），让js可以模拟多线程`

## 2、事件循环

**事件循环流程**：
同步代码 → 清空微任务队列 → 执行下一个宏任务 → 重复循环

![image-20250305110304811](/Users/soup/Library/Application Support/typora-user-images/image-20250305110304811.png)