<template>
  <div>
    <div class="m-about-box">
      <h1>关于测试用工具</h1>
      <p>本工具提供文件服务器及相关api的测试数据，用于前端页面的调试。</p>
      <p>github: <a href="https://github.com/wenlonghuo/fe-mock-server" target="_blank">https://github.com/wenlonghuo/fe-mock-server</a></p>
      <p>Html框架：<a href="https://github.com/marcosmoura/vue-material" target="_blank">https://github.com/marcosmoura/vue-material</a></p>
      
    </div>
  </div>
</template>

<script>
  export default {
    name: 'about',
    data: function(){
      return {
        runningProject: []
      }
    },
    computed: {
      
    },
    mounted: function(){

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
          id: ids
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
.m-about-box {
  display: block;
  width: 100%;
  text-align: center;
}
</style>