<template>
<div>
  <Card :bordered="false" class="log-search-bar" style="height:74px;">
    <h2 class="log-title">日志查询</h2>
    <div class="search-input-item">
      <Input class="search-item" type="text" v-model="search.project"  placeholder="项目名称"/>
      <Input class="search-item" type="text" v-model="search.api"  placeholder="API名称"/>
      <Input class="search-item" type="text" v-model="search.apiModel"  placeholder="分支名称"/>
      <Input class="search-item" type="text" v-model="search.client.browser"  placeholder="浏览器"/>
      <Input class="search-item" type="text" v-model="search.client.device"  placeholder="设备"/>
      <Input class="search-item" type="text" v-model="search.ip"  placeholder="IP地址"/>
      <Input class="search-item" type="text" v-model="search.client.os"  placeholder="系统"/>
    </div>
  </Card>
  <div class="tabs-bar">
    <Card :bordered="false" class="log-tab">
      <Tabs v-model="logType" class="tabs-bar-body">
        <Tab-pane label="错误" name="error">
          <logItem v-for="item in errList" :info="item" :key="item.time" @click="setDetail"></logItem>
        </Tab-pane>
        <Tab-pane label="历史" name="his">
          <logItem v-for="item in hisList" :info="item" :key="item.time" @click="setDetail"></logItem>
        </Tab-pane>
        <Tab-pane label="代理" name="proxy">
          <logItem v-for="item in proxyList" :info="item" :key="item.time" @click="setDetail"></logItem>
        </Tab-pane>
        <Tab-pane label="记录" name="record">
          <logItem v-for="item in recordList" :info="item" :key="item.time" @click="setDetail"></logItem>
        </Tab-pane>
        <Tab-pane label="错误上传" name="collector">
          <logItem v-for="item in collectorList" :info="item" :key="item.time" @click="setDetail"></logItem>
        </Tab-pane>
      </Tabs>
    </Card>
    <detailLog class="log-info-box" :info="detail"></detailLog>
  </div>
</div>
</template>
<script>
import logItem from '~components/log-item.vue'
import detailLog from '~components/detail/detail-log.vue'
export default {
  name: 'log-list',
  data () {
    return {
      logType: 'error',
      detail: {},
      search: {
        project: '',
        api: '',
        apiModel: '',
        client: {
          browser: '',
          device: '',
          os: '',
        },
        ip: '',
      },
    }
  },
  components: {
    logItem,
    detailLog,
  },
  computed: {
    errList () {
      return this.$store.state.log.error.list
    },
    hisList () {
      return this.$store.state.log.his.list
    },
    proxyList () {
      return this.$store.state.log.proxy.list
    },
    recordList () {
      return this.$store.state.log.record.list
    },
    collectorList () {
      return this.$store.state.log.collector.list
    },
  },
  watch: {
    'search.project': function () {
      this.searchLog(true)
    },
    'search.api': function () {
      this.searchLog(true)
    },
    'search.apiModel': function () {
      this.searchLog(true)
    },
    'search.client.browser': function () {
      this.searchLog(true)
    },
    'search.client.device': function () {
      this.searchLog(true)
    },
    'search.ip': function () {
      this.searchLog(true)
    },
    'search.client.os': function () {
      this.searchLog(true)
    },
    logType () {
      this.searchLog()
    },
  },
  destroyed () {
    this.removeScrollEvent()
  },
  mounted () {
    this.searchLog()
    this.addScrollEvent()
  },
  methods: {
    addScrollEvent () {
      let doms = document.querySelectorAll('.tabs-bar-body .ivu-tabs-tabpane')
      this.tabDoms = [].slice.call(doms)
      this.tabDoms.forEach(item => {
        item.addEventListener('scroll', this.scrollEvt)
      })
    },
    removeScrollEvent () {
      this.tabDoms.forEach(item => {
        item.removeEventListener('scroll', this.scrollEvt)
      })
    },
    scrollEvt (e) {
      let top = e.target.scrollTop + e.target.offsetHeight
      let height = e.target.scrollHeight
      if (height - top > 30) return
      if (this.isLoading) {
        if (this.debounceScroll) return
        clearTimeout(this.debounceScroll)
        this.debounceScroll = null
        this.debounceScroll = setTimeout(() => {
          this.searchLog()
        }, 300)
      } else {
        this.searchLog()
      }
    },
    setDetail (item) {
      Object.keys(this.detail).forEach(key => {
        this.detail[key] = undefined
      })
      this.detail = Object.assign({}, this.detail, item)
    },
    searchLog (refresh) {
      this.isLoading = true
      return this.$store.dispatch('log/GET_LOGS', {type: this.logType, refresh, search: this.search}).then(() => {
        this.isLoading = false
      })
    },
  },
}
</script>
<style scoped>
.search-bar {
  margin-bottom: 10px;
}
.tabs-bar {
  display: flex;
  margin-top: 10px;
}
.log-tab {
  height:calc(100vh - 194px);
  flex-basis: 500px;
  flex-grow: 1;
}
.log-info-box {
  height:calc(100vh - 194px);
  flex-basis: 400px;
  flex-grow: 2;
  margin-left: 10px;
}
.search-input-item .search-item {
  width: 110px;
  margin: 5px 6px;
}
.log-title {
  width: 100px;
  float: left;
}
.log-search-bar .search-input-item {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  overflow-x: hidden;
}
.tabs-bar-body {
  height: 100%;
  overflow-y: hidden;
}
</style>
<style>
.log-tab .ivu-card-body {
  height: 100%;
}

.tabs-bar-body .ivu-tabs-content {
  height: 100%;
}
.tabs-bar-body .ivu-tabs-tabpane {
  height: calc( 100% - 40px);
  overflow-y: auto;
}

</style>
