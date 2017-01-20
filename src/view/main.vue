<template>
  <div>
    <div class="m-main-card-list">
      <h1>欢迎使用前端调试用后台管理工具</h1>
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
          <md-button class="md-icon-button" @click="restartProj($event, item.procInfo._id)" md-tooltip="重启">
            <md-icon>refresh</md-icon>
          </md-button>
        </md-card-actions>
      </md-card>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'main',
    data: function(){
      return {
        runningProject: []
      }
    },
    computed: {
      
    },
    mounted: function(){
      this.app = this.$resource('', {}, {
        get: {
          method: 'GET',
          url: '/mock/getAppStatus'
        },
        start: {
          method: 'PUT',
          url: '/mock/startAppProject'
        },
      });
      this.getAppStatus()
    },
    methods: {
      getAppStatus: function(){
        this.app.get({}).then(function(json){
          var data = json.data;
          if(!data.code) {
            this.runningProject = data.data.runningProject
          }
        })
      },
      startProject: function(ids) {
        var param = {
          id: ids,
          force: true
        };
        return this.app.start(param).then(function(){
          this.getAppStatus()
        });
      },
      restartProj: function(e, id){
        this.startProject(id)
      },
    },
  }
</script>

<style>
.m-main-card-list {
  width: 100%;
  display: block;
  text-align: center;
}
</style>