<template>
  <div class="p-main">
    <h1>欢迎使用前端调试用后台管理工具</h1>
    <div class="m-main-box">
      <div class="m-main-urls" v-if="!hideRight">
        <md-icon class="md-warn m-main-url-clear" @click.native="closePanel">clear</md-icon>
        <h3>常用链接列表</h3>
        <md-list class="md-double-line" v-for="item in urlList">
          <md-list-item>
            <md-icon class="md-primary">http</md-icon>

            <div class="md-list-text-container">
              <span>{{item.name}}</span>
              <a :href="'http://localhost:' + port + item.url" target="_blank">{{item.url}}</a>
            </div>

            <md-button class="md-icon-button md-list-action" @click.native="findApi($event, item)">
              <md-icon>reorder</md-icon>
            </md-button>
          </md-list-item>
        </md-list>
      </div>
      <div class="m-main-card-list" :class="{'show-list': !hideRight}">
        <md-card md-with-hover v-for="item in runningProject" class="m-api-list">
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">{{item.procInfo.name}}</div>
              <div class="md-subhead">{{item.createdTime}}</div>
            </md-card-header-text>
          </md-card-header>
            
          <md-card-content>
            <p>运行端口-{{item.procInfo.port}}pid --> {{item.pid}}</p>
            <p>项目路径 -- {{item.procInfo.path}}</p>
            <p>运行状态 -- {{item.status === 2?'启动中':(item.status?'运行中':'暂停运行')}}</p>
          </md-card-content>

          <md-card-actions>
            <md-button class="md-icon-button" @click.native="restartProj($event, item.procInfo._id)" md-tooltip="重启">
              <md-icon>refresh</md-icon>
            </md-button>
            <md-button @click.native="showList($event, item)" v-if="item.procInfo.urls && item.procInfo.urls.length">
              查看url列表
            </md-button>
          </md-card-actions>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'main',
    data: function () {
      return {
        runningProject: [],
        hideRight: true,
        urlList: [],
        selection: {
          proj: '',
        },
        port: 80,
      }
    },
    computed: {

    },
    mounted: function () {
      this.app = this.$resource('', {}, {
        get: {
          method: 'GET',
          url: '/mock/getAppStatus',
        },
        start: {
          method: 'PUT',
          url: '/mock/startAppProject',
        },
      })
      this.getAppStatus()
    },
    methods: {
      getAppStatus: function () {
        this.app.get({}).then(function (json) {
          var data = json.data
          if (!data.code) {
            this.runningProject = data.data.runningProject
          }
        })
      },
      startProject: function (ids) {
        var param = {
          id: ids,
          force: true,
        }
        return this.app.start(param).then(function () {
          this.getAppStatus()
        })
      },
      restartProj: function (e, id) {
        this.startProject(id)
      },
      showList: function (e, proj) {
        this.hideRight = false
        this.urlList = proj.procInfo.urls || []
        this.port = proj.procInfo.port
        this.selection.proj = proj.procInfo._id
      },
      findApi: function (e, item) {
        var apis = item.apisconsole.log(item)
        if (apis && apis.length) {
          this.$router.push({name: 'api-list', params: {id: this.selection.proj}, query: {name: apis.join(',')}})
        }
      },
      closePanel: function () {
        this.hideRight = true
        console.log('ss')
      },
    },
  }
</script>

<style>
.p-main h1 {
  text-align: center;
}
.m-main-box {
  display: block;
  width: 100%;
  height: 100%;
}
.m-main-box .m-main-card-list {
  width: 100%;
  overflow: auto;
  text-align: center;
}
.m-main-box .show-list{
  padding-right: 350px;
}
.m-main-box .m-main-urls {
  position: fixed;
  right: 20px;
  top: 120px;
  width: 300px;
  height: 80%;
  overflow: auto;
  padding: 5px 10px;
  box-shadow: -1px 2px 3px 2px rgba(187, 187, 187, .87);
}
.m-main-url-clear {
  float: right;
  z-index: 2;
  cursor: pointer;
}
</style>