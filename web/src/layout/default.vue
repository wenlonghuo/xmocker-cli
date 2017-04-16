<style scoped>
  .layout{
      border: 1px solid #d7dde4;
      background: #f5f7f9;
  }
  .layout-topbar {
    display: flex;
  }
  .layout-logo{
    width: 150px;
    height: 60px;
    border-radius: 3px;
    font-size: 16px;
    font-weight: bold;
    position: relative;
    text-align: center;
  }
  .layout-nav{
    width: 560px;
  }
  .layout-right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
  .layout-assistant{
    width: 300px;
    margin: 0 auto;
    height: inherit;
  }
  .layout-breadcrumb{
    padding: 10px 15px 0;
  }
  .layout-content{
    min-height: 200px;
    margin: 15px;
    overflow: hidden;
    /*background: #fff;*/
    border-radius: 4px;
  }
  .layout-content-main{
    padding: 10px;
  }
  .layout-copy{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    padding: 2px;
    color: #9ea7b4;
  }

  .scale-out-enter-active, .scale-out-leave-active {
    /*transform: scale(1, 1, 1);*/
    /*transform-origin: 100% 0%;*/
    opacity: 1;
    transition: all .1s ease;
  }
  .scale-out-enter, .scale-out-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
    /*transform: scale(.5, .5, 1);*/
  }
</style>
<template>
    <div class="layout">
        <Menu mode="horizontal" class="layout-topbar" :active-name="actived">
            <div class="layout-logo">API后台管理</div>
            <div class="layout-nav">
                <Menu-item name="index" @click.native="selectMenu('首页')">
                    <Icon type="ios-navigate"></Icon>
                    首页
                </Menu-item>
                <Menu-item name="projectList" @click.native="selectMenu('项目列表')">
                    <Icon type="ios-keypad"></Icon>
                    项目列表
                </Menu-item>
                <Menu-item name="search" @click.native="selectMenu('搜索')">
                    <Icon type="ios-analytics"></Icon>
                    搜索
                </Menu-item>
                <Menu-item name="config" @click.native="selectMenu('基础配置')">
                    <Icon type="ios-paper"></Icon>
                    配置
                </Menu-item>
                <Menu-item name="syncList" @click.native="selectMenu('同步')">
                    <Icon type="ios-paper"></Icon>
                    同步
                </Menu-item>
            </div>
            <div class="layout-right">
                <Menu-item name="log" @click.native="selectMenu('日志')">
                    <Icon type="ios-navigate"></Icon>
                    日志
                </Menu-item>
                <Menu-item name="about" @click.native="selectMenu('关于')">
                    <Icon type="ios-keypad"></Icon>
                    关于
                </Menu-item>
            </div>
        </Menu>
        <div class="layout-content">
          <transition name="scale-out" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
        <div class="layout-copy">
            API管理
        </div>
    </div>
</template>
<script>

export default {
  name: 'layout-default',
  mounted () {
    this.context = document.querySelector('.layout-content')
    this.topBar = document.querySelector('.layout-topbar')
    this.copy = document.querySelector('.layout-copy')
    this.setMinHeight()
  },
  computed: {
    actionBar () {
      return this.$store.state.actionBar
    },
    actived () {
      return this.$route.path.slice(1) || 'index'
    },
  },
  methods: {
    setMinHeight () {
      if (window) {
        let bodyHeight = document.documentElement.clientHeight
        this.context.style['min-height'] = bodyHeight - this.topBar.clientHeight - this.copy.clientHeight - 30 + 'px'
      }
    },
    selectMenu (val) {
      this.$router.push({name: val})
    },
  },
}
</script>
