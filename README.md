### 前端mock用工具
#### 介绍
提供一个易于移植的文件服务器，可通过浏览器进行相关信息定义后，方便对静态的HTML进行调试。
主要功能包括提供文件服务，代理至其他端口，启动gulp
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
 简写   命令            描述
 -e     empty           不启动任何项目
 -h     help            帮助
 -kp    kill port       杀掉指定端口的进程
 -k     kill            停止指定项目
 -lr    list run        列出所有正在运行的项目
 -l     list            列出所有项目
 -r     restart         重启带有简称的项目
 -s     start           启动带有简称的项目
~~~

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
 
 ##### 主进程提供的接口
 参见app/api-schemas 下所有接口输入参数的定义