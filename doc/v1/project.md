---
title: "项目"
type: "help"
order: 1
---

## 项目操作
### 启动
  在项目列表或项目详情中可点按钮进行启动。当项目已经启动时，重新点击会检查项目配置是否发生了变化，如果未发生变化或者变化的是可动态改变的参数，不会重启项目进程。否则会重启进程，导致临时数据丢失。导致重启的参数有： 项目路径、端口、静态资源

### 停止
  点击停止会停止项目进程，注意，gulp进程也会被停止

### 重启
  强制重启项目进程，如果项目未启动，则启动项目

### 删除
  删除项目和项目下的所有API


## 项目参数说明

### 项目名称、项目简称
 - 类型： String
 - 默认： ''
 - 说明：两项均是必填。项目名称是在项目列表上显示的卡片，项目简称是简短的项目名称，两项都可以作用启动项目时标识，尤其要注意项目简称不要出现重复。

### 项目路径
 - 类型： String
 - 默认： ''
 - 示例： /User/Documents/myProject
 - 说明：项目路径提供了一个默认的静态资源路径，必须是绝对路径，如： "D://fe/"。当gulp参数配置了buildPath（相对路径）字段时，静态资源的路径变为：项目路径+buildPath。如果没有buildPath，则静态资源路径为项目路径。

### 端口
 - 类型： Number
 - 默认： 8080
 - 说明：API服务器监听的端口，访问相关API时需要指向这个端口

### 父级项目
 - 类型： String
 - 默认： 无
 - 说明：提供一个备用的API库，访问API服务时，优先从当前项目获取API，未找到相应的API，则访问父级的API。非继承关系，即父级API不会访问父级API的父级API。通常指向一个公用的库，减少复制API至新建项目

### 404代理至
 - 类型： String
 - 默认： ''
 - 示例： http://www.xxx.com
 - 说明：配置了网址后，并将代理模式调整为服务器或混合时生效。当访问API服务时，未找到相应的API，则把当前请求转发至指定的网址。


 ### html注入
  - 类型： Boolean
  - 默认： true
  - 说明：打开本项时，会在文件服务器的html页面的head部分添加一个`<script>`标签，目前能够刷新页面和上传错误至管理后台

### 静态资源
 - 类型： [String]
 - 默认： []
 - 示例： 
 ```javascript
  [
    "D:\\fe\\git\\test",
    "D:\\fe\\svn\\trunk"
  ]
 ```
 - 说明：静态资源路径，数组类型，所有路径都是绝对路径。提供其他静态资源的路径。当填写了项目路径时，项目路径已经被加入了静态资源，不需要再次加入静态资源路径。


 ### 代理
 - 类型： [{api: String, target: String}]
 - 默认： []
 - 示例：
```javascript
  [
    {
      "api": "/official/v1/*",
      "target": "http://xxxx.com"
    },
    {
      "api": "/upload/*",
      "target": "http://xxxx.com"
    },
  ]
 ```
 - 说明：代理相关的URL路径至其他服务器。代理模式和404不同，当符合API条件时，将API代理至指定网址，不再查询项目下相应的API。

### URL列表
 - 类型： [{name: String, url: String, path: String, params: Object, apis: Array}]
 - 默认： []
 - 示例：
```javascript
[
  {
    "name": "主页",
    "url": "/wechat/html/project/index/?type=0",
    "apis": [
      "api1",
      "api2"
    ]
  },
  {
    "name": "测试",
    "path": "/wechat/html/project/test",
    "params": {
      "token": "xkfdi39kfd"
    }
  },
]
 ```
 - 说明： URL列表用于保存经常访问的链接，也会在 `端口号/_link`网址下显示。`name`为必填项， `apis`表示用到了哪些API，可用于检索对应的API。URL配置可选方案为：只填`url`，相应的search,hash都必须填写好。或者填写`path`和`params`，则会为url自动拼接search。

### GULP
 - 类型： Object
 - 默认： {}
 - 示例： 
```javascript
{
  "buildPath": "/build/",
  "cmd": "dev",
  "js": "/wechat/script/!(project)$,/wechat/script/project/,/common/script/",
  "css": "/wechat/style/!(project)$,/wechat/style/project/,/common/style/",
  "html": "/wechat/html/!(project)$,/wechat/html/project/,/common/html/",
  "image": "/wechat/image/!(project)$/,/wechat/image/project/,/common/image/",
  "autoRefresh": true
}
 ```
 - 说明：gulp的相关信息。本对象会在`JSON.stringify()`之后再进行`encodeURIComponent`，通过 `--option`传入到gulp中，结构如下：
 ```javascript
 {
    injectHtml: html注入,
    port: 项目的端口号,
    gulp: 项目的gulp参数,
    path: 项目路径,
  }
 ```
  - 注意在gulpfile.js中进行parse并`decodeURIComponent`。其中`buildPath`表示构建输出路径，是相对路径，与项目路径合成路径为静态资源服务所在的路径。 `cmd`表示gulp命令执行时的命令，默认为`dev`。`path`表示调用的gulp路径。其他参数则根据gulpfile编写需要自行填写