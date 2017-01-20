<template>
  <md-toolbar>
      <h2 class="md-title">后台管理</h2>

      <md-button href="/#/">首页</md-button>

      <md-menu md-align-trigger>
        <md-button md-menu-trigger>api管理</md-button>

        <md-menu-content>
          <md-menu-item @click.native="navTo($event,'api-list')">api列表</md-menu-item>
          <md-menu-item @click.native="navTo($event,'api-add')">添加api</md-menu-item>
        </md-menu-content>
      </md-menu>

      <md-button href="/#/projectList/">项目管理</md-button>

      <md-button href="/#/app/base">基础信息配置</md-button>


      <md-menu md-align-trigger  style="flex: 1">
        <md-button md-menu-trigger>其他功能</md-button>

        <md-menu-content>
          <md-menu-item>导入api数据</md-menu-item>
          <md-menu-item>导出api数据</md-menu-item>
          <md-menu-item>同步服务器数据</md-menu-item>
        </md-menu-content>
      </md-menu>

      

      <md-button href="/#/about">关于</md-button>

      <md-button class="md-icon-button">
        <md-icon>account_circle</md-icon>
      </md-button>

    </md-toolbar>
</template>

<script>

  export default {
    name: 'nav-bar',
    data: function(){
      return {

      }
    },
    methods: {
      navTo: function(e, href){
        this.$router.push({name: href, params: {}});
      }
    }
  }

</script>