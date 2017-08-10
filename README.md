### 前端mock用工具
#### 介绍
本工具是定制的mock服务工具，主要针对的是特殊API进行的设置。特色：
* 定义API使用WEB页面操作

* API添加不仅依赖于URL链接，而是支持从输入参数中判断所属的API名称

* 使用nodejs和Koa的function进行条件判断，可针对不同的数据返回自定义的结果

* 使用本地文件数据库nedb，整个环境仅依赖于nodejs环境

* 提供文件服务器，可执行gulp类型的构建，并提供页面刷新及url展示接口


#### Install
~~~ 
   git clone https://github.com/wenlonghuo/xmocker-cli
   cd xmocker-cli
   npm link --production
~~~
#### 使用
打开网页 http://localhost:6001 即可访问
在网页中添加完成项目相关的信息后，可使用命令进行启动对应的项目
命令：mocker
~~~
  Usage: mocker [options] [command]


  Options:

    -V, --version  output the version number
    -h, --help     output usage information

  Commands:

    start <proj>    启动项目
    stop <proj>     停止项目
    restart <proj>  重启项目
    list            列出项目
    exit            退出项目
    free <port>     杀掉指定端口
    here            在当前目录启动服务器，更多参数请使用 mocker here -h查看
    help [cmd]      display help for [cmd]
~~~

schema 使用的是json-gate
https://github.com/oferei/json-gate
##### 修改的项目
* json-gate: https://github.com/oferei/json-gate
* koa-send: https://github.com/koajs/send