### 前端mock用工具

#### Install
~~~ 
   git clone https://github.com/wenlonghuo/fe-mock-server
   cd fe-mock-server
   npm i --production
~~~
打开网页 http://localhost:6001 即可访问
#### 说明
后续将加入faker.js中功能

##### api定义中输入输出参数
传入参数校验定义   

- type: 类型，支持 number, string, boolean, object, array,  
- required: 是否必传
- noEmpty: 是否不能为空，字符串类型
- name: 参数名称
- cname: 中文名称
- description: 参数描述
- max: 最大值
- min: 最小值，仅对数字和字符串生效
- specialValue: 字符串类型，以逗号隔开，特殊值，允许null, undefined, NaN等特殊值，默认不允许
- default: 默认值
- child: 类型为object或array类型时，内置下一层数据  

输出参数定义
- type: 类型，支持 number, string, boolean, object, array, fixed
- required: 是否必传
- noEmpty: 是否不能为空，字符串类型
- name: 参数名称
- cname: 中文名称
- description: 参数描述
- max: 最大值
- min: 最小值，仅对数字和字符串生效
- specialValue: 只允许bool值，特殊值，允许null, undefined, NaN等特殊值
- default: 默认值，生成即时显示数据，原始类型具有该值
- child: 类型为object或array类型时，内置下一层数据 
- faker: 指定为faker的类型，字符串，以.隔开
 
 ##### 其他各接口的定义
 参见app/api-schemas 下所有接口输入参数的定义