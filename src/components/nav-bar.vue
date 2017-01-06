<template>
  <md-toolbar>
      <h2 class="md-title">后台管理</h2>

      <md-button md-menu-trigger>首页</md-button>

      <md-menu md-align-trigger>
        <md-button md-menu-trigger>api管理</md-button>

        <md-menu-content>
          <md-menu-item href="/#/api/">api列表</md-menu-item>
          <md-menu-item>管理api基础信息</md-menu-item>
          <md-menu-item>编辑api输入参数</md-menu-item>
          <md-menu-item>编辑api输出参数</md-menu-item>
        </md-menu-content>
      </md-menu>

      <md-button md-menu-trigger href="/#/projectList/">项目管理</md-button>

      <md-button md-menu-trigger>基础信息配置</md-button>


      <md-menu md-align-trigger  style="flex: 1">
        <md-button md-menu-trigger>其他功能</md-button>

        <md-menu-content>
          <md-menu-item>导入api数据</md-menu-item>
          <md-menu-item>导出api数据</md-menu-item>
          <md-menu-item>同步服务器数据</md-menu-item>
        </md-menu-content>
      </md-menu>

      

      <md-button md-menu-trigger>关于</md-button>

      <md-button class="md-icon-button">
        <md-icon>account_circle</md-icon>
      </md-button>

    </md-toolbar>
</template>

<script>

</script>