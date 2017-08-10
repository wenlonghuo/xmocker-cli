<style scoped>
  .ivu-menu-light {
    background: none;
  }
  .layout {
    border: 1px solid #d7dde4;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    height: 100vh;
  }

  .layout-breadcrumb {
    padding: 8px 15px 8px;
    box-shadow: 1px 1px 0 #efefef;
  }

  .layout-content {
    min-height: 200px;
    margin: 5px 15px 15px 15px;
    overflow-y: auto;
    background: #fff;
    border-radius: 4px;
    height: calc(100vh - 60px);
  }

  .layout-content-main {
    padding: 10px;
  }

  .layout-copy {
    text-align: center;
    padding: 10px 0 10px;
    color: #9ea7b4;
  }

  .layout-right,
  .layout-menu-left {
    height: 100vh;
  }
  .layout-menu-left {
    float: left;
    width: 180px;
    background: #f2f2f2;
    user-select: none;
  }
  .layout-right {
    width: auto;
    overflow-x: hidden;
  }
  .layout-menu-left.shrink {
    width: 65px;
  }
  .layout-menu-left.shrink .layout-text {
    display: none;
  }

  .toggle-button {
    padding: 14px 24px;
    cursor: pointer;
  }

  .layout-header {
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  }

  .layout-ceiling-main a {
    color: #9ba7b5;
  }

  .ivu-col {
    transition: width .2s ease-in-out;
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
<style>
.layout-menu-list {
  height: 100vh;
  display: flex !important;
  flex-direction: column;
}
.layout .ivu-breadcrumb {
  font-size: 12px;
}
.layout-breadcrumb .ivu-breadcrumb>span .ivu-breadcrumb-item-link{
  cursor: pointer;
}
.layout-breadcrumb .ivu-breadcrumb>span:last-child .ivu-breadcrumb-item-link {
  cursor: auto;
}
</style>

<template>

  <div class="layout">
      <div :class="{shrink: shrink}" class="layout-menu-left">
        <Menu :active-name="actived" width="auto" class="layout-menu-list">
          <li class="toggle-button" @click="toggleClick" style="color: #3d3d3d">
            <Icon type="navicon" size="24"></Icon>
          </li>
          <Menu-item name="search" @click.native="selectMenu('搜索')">
            <Icon type="search" size="18"></Icon>
            <span class="layout-text">搜索</span>
          </Menu-item>
          <Menu-item name="projectList" @click.native="selectMenu('项目列表')">
            <Icon type="ios-keypad" size="18"></Icon>
            <span class="layout-text">项目列表</span>
          </Menu-item>
          <Menu-item name="config" @click.native="selectMenu('基础配置')">
            <Icon type="gear-b" size="18"></Icon>
            <span class="layout-text">配置</span>
          </Menu-item>
          <Menu-item name="syncList" @click.native="selectMenu('同步')">
            <Icon type="arrow-swap" size="18"></Icon>
            <span class="layout-text">同步</span>
          </Menu-item>
          <Menu-item name="log" @click.native="selectMenu('日志')">
              <Icon type="bug" size="18"></Icon>
              <span class="layout-text">日志</span>
          </Menu-item>
           <Menu-item name="about" @click.native="selectMenu('关于')">
              <Icon type="information-circled" size="18"></Icon>
              <span class="layout-text">关于</span>
          </Menu-item> 
        </Menu>
      </div>
      <div class="layout-right">
        <div class="layout-breadcrumb">
          <Breadcrumb>
            <Breadcrumb-item v-for="(item, index) in breadList" href="" :key="index" @click.native="breadClick(item, index)">{{item.name}}</Breadcrumb-item>
          </Breadcrumb>
        </div>
        <div class="layout-content">
          <transition name="scale-out" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
        <!-- <div class="layout-copy">
          mocker服务
        </div> -->
      </div>
  </div>
</template>
<script>

export default {
  name: 'layout-default',
  data () {
    return {
      shrink: true,
    }
  },
  created () {
    let toggle = window.localStorage.getItem('layout-toggle')
    this.shrink = !!toggle
  },
  computed: {
    actionBar () {
      return this.$store.state.actionBar
    },
    actived () {
      return this.$route.path.slice(1) || 'index'
    },
    iconSize () {
      return this.spanLeft === 5 ? 14 : 24
    },
    breadList () {
      return this.$route.meta.breadList || this.$store.state.breadList
    },
  },
  methods: {
    selectMenu (val) {
      this.$router.push({name: val})
    },
    toggleClick () {
      this.shrink = !this.shrink
      window.localStorage.setItem('layout-toggle', this.shrink ? 1 : '')
    },
    breadClick (item, index) {
      let diff = this.breadList.length - index - 1
      if (diff >= 1) {
        this.$router.go(-diff)
      }
    },
  },
}
</script>
