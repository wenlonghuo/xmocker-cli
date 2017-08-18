## API操作
### 新增、编辑
 API的新增和编辑需要添加API的基础信息和分支。基础信息只包含了判断URL请求是否为当前API。分支则对符合条件的API根据不同的条件进行处理，条件不同，返回不同的数据。

### 导入
 点击API列表侧的从其他项目导入可选择其他项目的API进行导入。通常建议使用一个通用的库，而不是相互复制API

### 删除
  删除API时会删除API下的分支。

## API基础信息参数说明

### 名称
 - 类型： String
 - 默认： ''
 - 说明：api的名称，用于检索，与判断api无关系。

### 方法
 - 类型： <POST, GET, PUT, DELTE, PATCH ...>
 - 默认： POST
 - 说明： 当前API指定的方法

### URL
 - 类型： String
 - 默认： /api
 - 说明： url路径。规则为：当存在 /:id这种形式，会将提取出来。否则必须url完全相等认为符合当前API，暂不支持正则

### 二级路径
 - 类型： String
 - 默认： func
 - 说明： 二级路径是用于当URL相同时，服务端以传入的参数进行区分API的情况。如果是普通API，则此项须为空。

### 二级路径字段预期值
 - 类型： String
 - 默认： ''
 - 说明： 二级路径对应的值。当传入参数的二级路径相等时，则认为API符合条件。例如：`二级路径`内容为`func`时，预约值填写的是`test`，请求的URL `/api?func=test`，则当前API为符合条件的API。

 ### 延时设置
  - 类型： Number
  - 默认： 0
  - 说明： 当查找到对应的API分支并进行了处理后，延时多久返回数据。单位为ms。

### 描述
 - 类型： String
 - 默认： ''
 - 说明： API的整体描述


## API分支参数说明

### 名称
 - 类型： String
 - 默认： 主干
 - 说明： 分支的名称。不能重复！！。

### 判断条件
 - 类型： String
 - 默认： ''
 - 示例：
```javascript
paramsKey.type == 0

或者
paramsKey = JSON.parse(paramsKey)
return paramsKey.type == 0
```
 - 说明： 根据输入参数进行判断，返回值为真类型时，认为当前条件符合，不在继续查找；返回假类型数据时认为条件不符合；未填写时，认为当前分支为默认分支，在遍历其他分支未找到时，认为本分支为目标分支。实际上填写的内容是处于一个function之内的内容，没有`return` 关键字则自动添加`return`。所有url中:id形式的参数，从url传过来的search，body中传过来的对象，合在一起形成的对象，将各key传入到入参中。调用为。：
 ```javascript
 function (...params)
```
 - 调用时`this`指向 koa中的`ctx`。

 ### 输出过滤函数
  - 类型： String
  - 默认： ''
  - 说明： 输出时执行的函数。实现方式与判断条件类型，但传入参数只有两个： params和data。params中URL传入的参数，data是填写的mock数据。返回结果为Object类型时，输入的是函数返回的结果

### 输入参数模板
 - 类型： Object
 - 默认: {}
 - 示例
```javascript
{
  "type": "object",
  "properties": {
    "func": {
      "type": "string",
      "required": true
    },
    "token": {
      "type": "string"
    },
    "params": {
      "type": "object"
    }
  }
}
```
 - 说明： 校验输入参数的模板，规则是json-gate类型，具体可见[https://github.com/oferei/json-gate](https://github.com/oferei/json-gate)。
 > 注意：本项目对json-gate进行了改写，当输入参数为String类型，而定义的类型为其他，会执行`JSON.parse`命令尝试转换。

### 输出参数模板
 - 类型： Object
 - 默认： {}
 - 说明： 与输入参数类似。本参数尚未使用，后续用于生成文档。

### mock数据
 - 类型： Object
 - 默认： {}
 - 说明： 要输出的mock数据，对象格式

