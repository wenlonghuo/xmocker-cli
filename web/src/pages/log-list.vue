<template>
<div>
  <Card :bordered="false" class="log-search-bar" style="height:74px;">
    <h2 class="log-title">日志查询</h2>
    <div class="search-input-item">
      <Input class="search-item" type="text" v-model="search.project"  placeholder="项目名称"></Input>
      <Input class="search-item" type="text" v-model="search.api"  placeholder="API名称"></Input>
      <Input class="search-item" type="text" v-model="search.apiModel"  placeholder="分支名称"></Input>
      <Input class="search-item" type="text" v-model="search.client.browser"  placeholder="浏览器"></Input>
      <Input class="search-item" type="text" v-model="search.client.device"  placeholder="设备"></Input>
      <Input class="search-item" type="text" v-model="search.client.ip"  placeholder="IP地址"></Input>
      <Input class="search-item" type="text" v-model="search.client.os"  placeholder="系统"></Input>
    </div>
  </Card>
  <div class="tabs-bar">
    <Card :bordered="false" class="log-tab">
      <Tabs value="name1" class="tabs-bar-body">
        <Tab-pane label="错误" name="name1">
          <logItem v-for="item in errList" :info="item" :key="item.time" @click="setDetail"></logItem>
        </Tab-pane>
        <Tab-pane label="历史" name="name2">
          <logItem v-for="item in hisList" :info="item" :key="item.time" @click="setDetail"></logItem>
        </Tab-pane>
        <Tab-pane label="代理" name="name3">
          <logItem v-for="item in proxyList" :info="item" :key="item.time" @click="setDetail"></logItem>
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
      detail: {},
      search: {
        project: '',
        api: '',
        apiModel: '',
        client: {
          browser: '',
          device: '',
          ip: '',
          os: '',
        },
      },
    }
  },
  components: {
    logItem,
    detailLog,
  },
  computed: {
    errList () {
      return this.$store.state.log.err
    },
    hisList () {
      return this.$store.state.log.his
    },
    proxyList () {
      return this.$store.state.log.proxy
    },
  },
  watch: {
    'search.project': function () {
      this.searchLog()
    },
    'search.api': function () {
      this.searchLog()
    },
    'search.apiModel': function () {
      this.searchLog()
    },
    'search.client.browser': function () {
      this.searchLog()
    },
    'search.client.device': function () {
      this.searchLog()
    },
    'search.client.ip': function () {
      this.searchLog()
    },
    'search.client.os': function () {
      this.searchLog()
    },
  },
  created () {
  },
  mounted () {
    this.getLog({type: 'log'})
  },
  methods: {
    setDetail (item) {
      this.detail = Object.assign({}, this.detail, item)
    },
    getLog (option) {
      // if (this.$store.state.log.fetchTime) return
      return this.$socket.send(option).then(data => {
        this.$store.commit('log/SET_LOGS', data.data)
      })
    },
    searchLog () {
      let option = { type: 'log', data: {query: this.search} }
      return this.getLog(option)
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
  overflow-y: auto;
}
</style>
<style>
.log-tab .ivu-card-body {
  height: 100%;
}
</style>

