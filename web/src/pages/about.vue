<template>
  <div class="about">
    <h1>XMOCKER</h1>
      <a href="https://github.com/wenlonghuo/xmocker-cli" class="github"><Icon type="md-social-github" size="24"></Icon></a>
    <section>
      <h2>介绍</h2>
      xmocker是一套提供mock数据的本地工具。通过图形化操作界面，为页面提供相应API，提高开发速度
    </section>
    <section>
      <h2>主要特色</h2>
      <ul>
        <li>1. 提供界面进行API的编辑</li>
        <li>2. 本地提供命令式安装，随意修改mock数据，不影响其他人操作</li>
        <li>3. 简单易用的代理</li>
      </ul>
    </section>

    <section>
      <h2>安装</h2>
      本地安装
      <pre>
        git clone https://github.com/wenlonghuo/xmocker-cli.git
        cd xmocker-cli
        npm link --production
      </pre>
      不需要使用自带的gulp相关功能时，可直接npm安装
      <pre>
        npm i -g xmocker-cli
      </pre>
    </section>

    <section>
      <h2>使用</h2>
      启动服务
      <pre>
        mocker start
      </pre>
      在当前文件夹下启动文件服务器，指定端口为8787，并将所有的404代理至指定网站
      <pre>
        mocker here -p 8787 -t "http://www.xxxx.com"
      </pre>
      浏览器访问地址
      <pre>
        http://localhost:6001
      </pre>
      更多命令请使用
      <pre>
        mocker -h
      </pre>
    </section>

    <section>
      <h2>致谢</h2>
      由于定制原因修改了以下库
      <ul>
        <li><a href="https://github.com/koajs/send">koa-send</a></li>
        <li><a href="https://github.com/oferei/json-gate">json-gate</a></li>
      </ul>
    </section>
  </div>
</template>
<script>
export default {
  name: 'about',
  data () {
    return {
    }
  },
}
</script>
<style scoped>
.about {
  font-size: 14px;
  height: 100%;
  overflow-y: auto;
  padding: 20px 15;
}
.about h1 {
  margin: 15px 0;
  text-align: center;
}
.about h2 {
  margin: 10px 0;
}
.github {
  float: right;
  margin-top: -50px;
  margin-right: 15px;
}
</style>
