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
  .layout-help {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 0;
    overflow: hidden;
  }
  .layout-help.show {
    width: 100%;
    z-index: 10;
  }

  .layout-help.show .markdown-body {
    height: 100%;
    padding: 20px 35px;
    overflow: auto;
    background-color: #fff;
  }

  .help-box {
    position: relative;
    float: right;
    width: 400px;
    margin-right: 10px;
    height: calc(80% - 40px);
    margin-top: 40px;
    border: 1px solid #efefef;
    box-shadow: 0 1px 6px rgba(0,0,0,.2);
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  .help-box:after, .help-box:before {
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    content: ' ';
    bottom: 100%;
    border: solid transparent;
  }

  .help-box:after { 
    right:10px;  
    border-width: 10px;  
    border-bottom: 10px solid  #fff;
  }
  .help-box:before {
    right:9px;  
    border-width: 11px;  
    border-bottom: 11px solid #efefef;
  }

  .help-global {
    position: absolute;
    width: 20px;
    text-align: center;
    top: 12px;
    right: 20px;
    cursor: pointer;
  }

  .help-box ::-webkit-scrollbar {
    width: 4px;
  }

  /*定义滚动条轨道 内阴影+圆角*/

  .help-box ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 6px;
  }


  /*定义滑块 内阴影+圆角*/

  .help-box ::-webkit-scrollbar-thumb {
    border-radius: 6px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
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
        <div class="help-global" @click="helpClick" v-if="$route.meta.help">
          <Icon type="help" size="14" color="#2d8cf0"></Icon>
        </div>
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
      <div class="layout-help"  :class="{show: showHelp}" v-if="showHelp" @click="hideHelp">
        <div class="help-box">
          <div class="wysiwyg markdown-body" v-html="helpHtml"></div>
        </div>
      </div>
  </div>
</template>
<script>
import hexo from 'hexo-front-matter'
import marked from 'marked'
import 'highlight.js/styles/default.css'
import '../assets/css/markdown.css'

import hightlight from 'highlight.js'
import docProject from '../../../doc/v1/project.md'
import apiDoc from '../../../doc/v1/api.md'
import configDoc from '../../../doc/v1/config.md'
import logDoc from '../../../doc/v1/log.md'
import syncDoc from '../../../doc/v1/sync.md'
const docs = {
  project: docProject.replace(/\r\n/g, '\n'),
  api: apiDoc.replace(/\r\n/g, '\n'),
  config: configDoc.replace(/\r\n/g, '\n'),
  log: logDoc.replace(/\r\n/g, '\n'),
  sync: syncDoc.replace(/\r\n/g, '\n'),
  empty: '暂无帮助',
}

marked.setOptions({
  highlight: function (code) {
    return hightlight.highlightAuto(code).value
  }
})

export default {
  name: 'layout-default',
  data () {
    return {
      shrink: true,
      helpHtml: '',
      showHelp: false,
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
    helpClick () {
      const help = this.$route.meta.help || {}
      const name = help.name || 'empty'
      const str = docs[name]
      let obj = hexo(str)
      let content = obj._content
      let html = marked(content)
      this.showHelp = true
      this.helpHtml = html
    },
    hideHelp (e) {
      if (!~e.target.className.indexOf('layout-help')) return
      this.showHelp = false
    },
  },
}
</script>
