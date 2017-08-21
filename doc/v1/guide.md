## 安装
如果不需要使用自带的gulp功能，可以使用全局安装

 - 全局安装
```bash
  npm i -g xmocker-cli
```

 - 本地安装
 ```bash
  git clone https://github.com/wenlonghuo/xmocker-cli.git
  cd xmocker-cli
  npm link --production
 ```

## 启动服务
xmocker注册的全局命令是`mocker`，在命令行中输入：
```bash
 mocker start
```
即启动了mocker服务。然后打开浏览器访问 [http://localhost:6001](http://localhost:6001)。

## 新建项目

 - 点击左侧菜单的`项目列表` -> `新建`

 - 填写`项目名称`，`简称`（用于快速启动），`端口号`

 - 点击提交。

## 新建API
 
 - 点击左侧菜单的`项目列表`，点击右侧项目的标题，进入项目详情页

 - 点击API列表栏上的`+新建`，进入新增API页面

 - 在左侧的基础信息中，填写`名称`、`URL`、`描述`，选择`方法`，如果同一URL判断是根据输入参数进行的（如根据输入参数的 `func`判断API名称），则填写`二级路径`和`二级路径字段预期值`。点击提交

 - 在右侧的API分支列表中填写`名称`和`mock数据`（json数据），点击提交

 - 完成了API的创建

## 访问

 - 访问 http://localhost:配置的端口号 和相应的URL，即可获取之前填入的`mock数据`

## 为项目设置代理服务器
 - 在编辑项目信息中，配置`代理`一项。即可将指定路径代理到对应的服务器上

 ```javascript
 [
  {
    "api": "/official/v1/*",
    "target": "http://xxxx.com"
  },
]
 ```
