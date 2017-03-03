<template>
  <div class="m-log-main" :style="{height:dHeight}">
    <div class="m-log-leftBox">
      
      <md-whiteframe md-elevation="1" class="m-log-leftBox-tool">
          <h1 class="md-title">日志记录</h1>

          <div class="m-log-tool-choose">
            <div class="m-log-proj">
              <label for="proj">选择项目</label>
              <md-select name="proj" id="proj" v-model="selection.proj" multiple  @change="buttonSelectProj">
                <md-option v-for="proj in projList" :value="proj._id">{{proj.name}}</md-option>
              </md-select>
            </div>
          </div>

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

    <md-card md-elevation="10" class="m-log-rightBox">
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
            <h2 class="md-subheading">
              <span>请求参数</span>
              <md-icon class="m-log-btn-copy" @click.native="copyResult($event, detail.req)">content_copy</md-icon>
            </h2>
          </md-card-header>

          <md-card-content>
            <pre><code lang="json">{{formatStr(detail.req)}}</code></pre>
          </md-card-content>
        </md-card-area>

        <md-card-area md-inset  v-if="detail.reqParsed">
          <md-card-header>
            <h3 class="md-subheading">
              <span>转换后参数</span>
              <md-icon class="m-log-btn-copy" @click.native="copyResult($event, detail.reqParsed)">content_copy</md-icon>
            </h3>
          </md-card-header>
          <md-card-content>
            <pre><code lang="json">{{formatStr(detail.reqParsed)}}</code></pre>
          </md-card-content>
          
        </md-card-area>

        <md-card-area md-inset  v-if="detail.res">
          <md-card-header>
            <h3 class="md-subheading">
            <span>输出结果</span>
            <md-icon class="m-log-btn-copy" @click.native="copyResult($event, detail.res)">content_copy</md-icon>
            </h3>
          </md-card-header>
          
          <md-card-content>
            <pre><code lang="json">{{formatStr(detail.res)}}</code></pre>
          </md-card-content>
          <md-card-actions>
            <md-button @click.native="setApiAsDefault" v-if="detail.projectId && detail.res">
              <md-icon>settings</md-icon>
              设为当前值
            </md-button>
          </md-card-actions>
        </md-card-area>

        <md-card-area md-inset  v-if="detail.err">
          <md-card-header>
            <h3 class="md-subheading">错误详情</h3>
          </md-card-header>
          
          <md-card-content>
            <pre><code lang="json">{{formatStr(detail.err)}}</code></pre>
          </md-card-content>
        </md-card-area>

        <md-card-area md-inset  v-if="detail.argv">
          <md-card-header>
            <h3 class="md-subheading">应用启动参数</h3>
          </md-card-header>
          
          <md-card-content>
            <pre><code lang="json">{{formatStr(detail.argv)}}</code></pre>
          </md-card-content>
        </md-card-area>

        <md-card-area md-inset  v-if="detail.additional">
          <md-card-header>
            <h3 class="md-subheading">其他参数</h3>
          </md-card-header>
          
          <md-card-content>
            <pre><code lang="json">{{formatStr(detail.additional)}}</code></pre>
          </md-card-content>
        </md-card-area>

    </md-card>
  </div>
</template>
<script>
  // import '../lib/highlight/highlight.pack.js'
  // import '../lib/highlight/styles/default.css'
  export default {
    name: 'log',
    data: function () {
      return {
        detail: {},
        projList: [

        ],
        selection: {
          proj: [],
          api: [],
          apiModel: [],
          chips: [
            {name: 'getHospitalWeiXinGuid'},
          ],
        },
        show: {
          proj: true,
        },
      }
    },
    watch: {
      'logs': function () {
        var that = this
        var ratio = that.ele.scrollHeight - (that.ele.scrollTop + that.ele.clientHeight)
        if (ratio < 50) {
          setTimeout(function () {
            that.ele.scrollTop = that.ele.scrollHeight
          }, 0)
        }
      },
    },
    computed: {
      logs: function () {
        return this.$store.state.ws.logs
      },
      dHeight: function () {
        return (document.documentElement.clientHeight - 64) + 'px'
      },
    },
    mounted: function () {
      this.app = this.$resource('', {}, {
        get: {
          method: 'GET',
          url: '/mock/getAppStatus',
        },
        getProj: {
          method: 'GET',
          url: '/mock/getAppProject',
        },
        setApi: {
          method: 'PUT',
          url: '/mock/setApiStatus',
        },
      })
      if (!this.logs.length) this.getLogs()
      this.ele = document.querySelector('.m-log-leftBox-main')
      this.getProjectList()
    },
    methods: {
      getAppStatus: function () {
      },
      getLogs: function () {
        this.$store.commit('pushCmd', {
          _cmd: 'getAllLogs',
          projectId: this.selection.proj,
          apiId: this.selection.api.map(function (a) { return a.id }),
          apiModel: this.selection.apiModel.map(function (a) { return a.id }),
        })
      },

      getProjectList: function () {
        var param = {
          pageSize: 2000,
          pageNo: 0,
        }
        return this.app.getProj(param).then(function (data) {
          data = data.data
          if (data.code) {
            this.alert(data.err)
            return
          }
          // 设置到数据中
          this.projList = data.data.list
          // this.selection.proj = this.$route.params.id || this.projList[0]._id
        })
      },

      buttonSelectProj: function () {
        // this.$router.replace({name: 'api-list', params: {id: this.selection.proj}})
        // this.pageInfo.pageNo = 0
        // this.getApiList()
        this.getLogs()
      },

      setApiAsDefault: function () {
        var detail = this.detail
        if (!detail.projectId || !detail.apiId || !detail.res) return
        this.app.setApi({type: 'fixed', id: detail.apiId, data: detail.res})
      },

      showDetail: function (e, id) {
        var el = this.getTarget(e.target, 'm-log-item')
        if (el) {
          var did = el.getAttribute('data-id')
          var log = this.logs[did]
          this.detail = log
        }
      },
      formatStr: function (obj) {
        var str = ''
        if (typeof obj !== 'object') return obj
        str = JSON.stringify(obj, null, 2)
        return str
        // String.prototype.replaceAll = function (s1,s2) {
        //   return this.replace(new RegExp(s1,"gm"), s2)
        // }
        // return str.replaceAll("&", "&amp")
        //   .replaceAll("<", "&lt")
        //   .replaceAll(">", "&gt")
        //   .replaceAll(String.fromCharCode(32), "&nbsp")
        //   .replaceAll(String.fromCharCode(9), "&nbsp")
        //   .replaceAll(String.fromCharCode(9), "&#160&#160&#160&#160")
        //   .replaceAll(String.fromCharCode(34),  "&quot")
        //   .replaceAll(String.fromCharCode(39),  "&#39")
        //   .replaceAll(String.fromCharCode(13),  "")
        //   .replaceAll(String.fromCharCode(10),  "<br/>")
      },
      formatTime: function (d) {
        if (!d) return
        var time = new Date(d)
        var diff = time.getTimezoneOffset()
        time = new Date(time.getTime() - diff * 60 * 1000)
        return time.toISOString().replace('T', ' ').replace('Z', '')
      },
      getTarget: function (elem, cssName) {
        if (!elem) return
        if (cssName === elem.className) {
          return elem
        }
        var p = elem.parentNode
        while (p && p.className !== cssName) {
          p = p.parentNode
        }
        if (p && p.className === cssName) return p
      },
      copyResult (e, item) {
        this.copy2Clipboard(JSON.stringify(item, null, 2))
      },
      copy2Clipboard (content) {
        var a = document.createElement('textarea')
        a.value = content
        a.style.width = 0
        a.style.height = 0
        a.style.opacity = 0
        document.body.appendChild(a)
        a.select()
        document.execCommand('Copy')
        document.body.removeChild(a)
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
  width: 35%;
  height: calc( 100% - 150px );
  overflow-y: auto;
  overflow-x: hidden; 
}
.m-log-leftBox {
  /*padding-right: 400px;*/
  width: 60%;
  padding-left: 30px;
  height: calc( 100% - 30px );
  overflow-y: auto;
  overflow-x: hidden; 
}

.m-log-leftBox-tool{
  height: 80px;
  position: relative;
}
.m-log-leftBox-tool h1 {
  display: inline-block;
}

.m-log-leftBox-main {
  max-height: calc( 100% - 100px );
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

.m-log-tool-choose {
  position: absolute;
  right: 10px;
  top: 20px;
}
.m-log-proj {
  width: 200px;
  display: inline-block;
}

.m-log-type {
  display: inline-block;
}

pre {
  width: 100%;
  overflow-x: auto;
}

.m-log-btn-copy {
  cursor: pointer;
}
</style>