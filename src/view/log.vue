<template>
  <div class="m-log-main" :style="{height:dHeight}">
    <div class="m-log-leftBox">
      
      <md-whiteframe md-elevation="1" class="">
          <h1 class="md-title">日志记录</h1>  
      </md-whiteframe>
      <md-whiteframe md-elevation="1" class="m-log-leftBox-main" @click.native="showDetail($event)">
            <div v-for="(log, gIndex) in logs" :data-id="gIndex" class="m-log-item">
              [<span>{{formatTime(log.time)}} </span>]
              <span>{{log.data}},</span>
              <span>{{log.project}},</span>
              <span>{{log.api}}</span>
            </div>
      </md-whiteframe>
    </div>

    <md-card md-elevation="1" class="m-log-rightBox">
        <md-card-header>
          <h2 class="md-title">log详情</h2>
        </md-card-header>
         <md-card-area md-inset> 
          <md-card-header>
            <h2 class="md-subheading">{{detail.api}}</h2>
            <div class="md-subhead">
              <span>{{detail.project}}</span>
              <span>{{detail.apiModel}}</span>
              <span>{{formatTime(detail.time)}}</span>
              <span></span>
            </div>
          </md-card-header>

          <md-card-content>
              {{detail.data}}
          </md-card-content>
        </md-card-area>

        <md-card-area md-inset v-if="detail.req">
          <md-card-header>
            <h2 class="md-subheading">请求参数</h2>
          </md-card-header>

          <md-card-content v-html="formatStr(detail.req)">
          </md-card-content>
        </md-card-area>

        <md-card-area md-inset  v-if="detail.reqParsed">
          <md-card-header>
            <h3 class="md-subheading">转换后参数</h3>
          </md-card-header>
          <md-card-content v-html="formatStr(detail.reqParsed)">
          </md-card-content>
          
        </md-card-area>

        <md-card-area md-inset  v-if="detail.res">
          <md-card-header>
            <h3 class="md-subheading">输出结果</h3>
          </md-card-header>
          
          <md-card-content v-html="formatStr(detail.res)">
          </md-card-content>
        </md-card-area>

        <md-card-area md-inset  v-if="detail.err">
          <md-card-header>
            <h3 class="md-subheading">错误详情</h3>
          </md-card-header>
          
          <md-card-content v-html="formatStr(detail.err)">
          </md-card-content>
        </md-card-area>

        <md-card-area md-inset  v-if="detail.argv">
          <md-card-header>
            <h3 class="md-subheading">应用启动参数</h3>
          </md-card-header>
          
          <md-card-content v-html="formatStr(detail.argv)">
          </md-card-content>
        </md-card-area>

        <md-card-area md-inset  v-if="detail.additional">
          <md-card-header>
            <h3 class="md-subheading">其他参数</h3>
          </md-card-header>
          
          <md-card-content v-html="formatStr(detail.additional)">
          </md-card-content>
        </md-card-area>

    </md-card>
  </div>
</template>

<script>
  export default {
    name: 'log',
    data: function(){
      return {
        detail: {}
      }
    },
    watch: {
      'logs': function(){
        var that = this;
        var ratio = that.ele.scrollHeight - (that.ele.scrollTop + that.ele.clientHeight);
        if(ratio < 50){
          setTimeout(function(){
            that.ele.scrollTop = that.ele.scrollHeight;
          }, 0)
        }
      }
    },
    computed: {
      logs: function(){
        return this.$store.state.ws.logs;
      },
      dHeight: function(){
        return (document.documentElement.clientHeight - 64) + 'px'
      },
    },
    mounted: function(){
      this.app = this.$resource('', {}, {
        get: {
          method: 'GET',
          url: '/mock/getAppStatus'
        },
      });
      if(!this.logs.length)this.getLogs();
      this.ele = document.querySelector('.m-log-leftBox-main');
    },
    methods: {
      getAppStatus: function(){
      },
      getLogs: function(){
        this.$store.commit('pushCmd', {_cmd: 'getAllLogs'});
      },


      showDetail: function(e, id){
        var el = this.getTarget(e.target, 'm-log-item');
        if(el){
          var id = el.getAttribute('data-id')
          var log = this.logs[id]
          this.detail = log;
        }
      },
      formatStr: function(obj){
        var str = '';
        if(typeof obj !== 'object')return obj;
        for(var key in obj) {
          str += key + ": "+ JSON.stringify(obj[key]) + "<br/>";
        }
        return str
      },
      formatTime: function(d){
        if(!d)return
        var time = new Date(d)
        var diff = time.getTimezoneOffset();
        time = new Date(time.getTime() - diff * 60 * 1000)
        return time.toISOString().replace('T', ' ').replace('Z', '');
      },
      getTarget: function(elem, cssName) {
        if (!elem) return;
        if (cssName === elem.className) {
          return elem;
        }
        var p = elem.parentNode;
        while (p && p.className !== cssName) {
          p = p.parentNode;
        }
        if (p && p.className === cssName) return p;
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

.m-log-rightBox {
  position: absolute;
  right: 20px;
  top: 100px;
  width: 350px;
  height: calc( 100% - 150px );
  overflow-y: auto;
  overflow-x: hidden; 
}
.m-log-leftBox {
  padding-right: 400px;
  padding-left: 30px;
  height: calc( 100% - 30px );
  overflow-y: auto;
  overflow-x: hidden; 
}
.m-log-leftBox-main {
  max-height: calc( 100% - 80px );
  overflow-y: auto;
  padding: 10px 20px;
}
.m-log-main {
  max-height: 100%;
  overflow: hidden;
}

.m-log-leftBox-main div {
  padding: 3px;
}
.m-log-leftBox-main div span:first-child {
  font-size: 12px;
}

.m-log-item {
  cursor: pointer;
}
</style>