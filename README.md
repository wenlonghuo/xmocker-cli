### 前端mock用工具
#### 介绍
本工具是定制的mock服务工具，主要针对的是特殊API进行的设置。特色：
* 定义API使用WEB页面操作

* API添加不仅依赖于URL链接，而是支持从输入参数中判断所属的API名称

* 使用nodejs和Koa的function进行条件判断，可针对不同的数据返回自定义的结果

* 使用本地文件数据库nedb，整个环境仅依赖于nodejs环境

* 提供文件服务器，可执行gulp类型的构建，并提供页面刷新及url展示接口

注意：本版本不稳定，部分功能还未实现

#### Install
~~~ 
   git clone https://github.com/wenlonghuo/fe-mock-server
   cd fe-mock-server
   npm i
   npm link
~~~
#### 使用
打开网页 http://localhost:6001 即可访问
在网页中添加完成项目相关的信息后，可使用命令进行启动对应的项目
命令：mocker
~~~
  Usage: mocker [options]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -m, --main             只启动主进程，不启动任何项目
    -e, --exit             退出主进程
    -f, --free [value]     释放指定端口
    -l, --list             列出所有项目
    -s, --start [value]    启动指定项目
    -k, --kill [value]     停止指定项目
    -r, --restart [value]  重启指定项目
~~~

schema 使用的是json-gate
https://github.com/oferei/json-gate
##### 修改的项目
* json-gate: https://github.com/oferei/json-gate
* koa-send: https://github.com/koajs/send
* promiseNedb: https://github.com/jrop/nedb-promise