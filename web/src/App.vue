<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { getBase } from './api/api.js'
export default {
  name: 'app',
  created () {
    this.initSocket()
  },
  watch: {
    '$store.state.collectorToast': function (val) {
      let data = val[val.length - 1]
      this.toastCollector(data)
    }
  },
  methods: {
    initSocket () {
      getBase().then(data => {
        let port = 6001
        if (!data.code) {
          port = data.data.managePort || 6001
        }
        this.$socket.init({ port })
      })
    },
    toastCollector (data) {
      let device = (data.client.device || {})
      let browser = data.client.browser || {}
      let os = data.client.os || {}
      let err = data.err || {}
      let msg = ''
      msg += 'IP地址：' + data.ip
      msg += '<br>设备：' + device.vendor + ' -- ' + device.model
      msg += '<br>浏览器：' + browser.name + ' -- ' + browser.version
      msg += '<br>系统：' + os.name + ' -- ' + os.version
      msg += '<br>错误详情：' + err.msg + '<br>行号：' + err.lineno + '<br>列号：' + err.colno + '<br>' + (err.stack || '')
      this.$Notice.error({
        title: '客户端上传错误提示',
        desc: msg,
      })
    },
  },
}
</script>
