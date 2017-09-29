<template>
<Card class="log-detail">
  <h3>日志详情</h3>
  <span style="font-size: 12px;">{{info.time | timeDate}}</span>
  <div class="log-detail-block">
    <h4>基本信息</h4>
    <div>
      <span>{{info.project}}</span> → 
      <span>{{info.api}}</span> → 
      <span>{{info.apiModel}}</span>
    </div>
  </div>
  <div style="width: 100%;" class="log-detail-block">
    <h4>设备信息</h4>
    <div>IP → {{info | ip}}</div>
    <div>系统 → {{info.client | os}}</div>
    <div>设备 → {{info.client | device}}</div>
    <div>浏览器 → {{info.client | browser}}</div>
    <div style="font-size: 12px;">UA → {{info.client && info.client.ua}}</div>
  </div>
  <div class="log-detail-block">
    <h4>结果</h4>
    {{info | msg}}
  </div>
  <h4 style="margin-top: 10px;">详情</h4>
  <Collapse v-model="panel" class="log-detail-block">
    <Panel name="req">
      请求参数
      <pre slot="content" class="code-area"v-html="req">
      </pre>
    </Panel>
    <Panel name="res" v-show="info.res">
      返回参数
      <pre slot="content" class="code-area" v-html="res">
      </pre>
    </Panel>
    <Panel name="error" v-show="info.err">
      错误信息
      <pre slot="content" class="code-area" v-html="err">
      </pre>
    </Panel>
  </Collapse>
</Card>
</template>
<script>
import mixin from '../../mixin'
import hljs from 'highlight.js/lib/highlight.js'
hljs.registerLanguage('json', require('highlight.js/lib/languages/json'))
import 'highlight.js/styles/xcode.css'
const timer = mixin.methods.timer

export default {
  name: 'log-item',
  data () {
    return {
      panel: ['req'],
    }
  },
  props: {
    info: {
      type: Object,
      default: () => ({})
    }
  },
  filters: {
    timeDate (val) {
      return timer(val)
    },
    ip (item = {}) {
      return item.ip || (item.client && item.client.ip)
    },
    os (item = {}) {
      return item.os && `${item.os.name || ''} - ${item.os.version || ''}`
    },
    browser (item = {}) {
      return item.browser && `${item.browser.name || ''} - ${item.browser.version || ''}`
    },
    device (item = {}) {
      let device = item.device || {}
      if (!Object.keys(device).length) return
      return item.device && `${item.device.type || ''}: ${item.device.vendor || ''} - ${item.device.model || ''}`
    },
    msg (item = {}) {
      return item.data
    },
  },
  computed: {
    req () {
      return this.lightCode(JSON.stringify(this.info.req || '', null, 2))
    },
    res () {
      var str = this.info.res
      if (typeof this.info.res === 'string') {
        try {
          str = JSON.parse(this.info.res || '')
          str = JSON.stringify(str, null, 2)
        } catch (e) {
        }
      } else {
        str = JSON.stringify(this.info.res || '', null, 2)
      }

      return this.lightCode(str)
    },
    err () {
      return this.lightCode(JSON.stringify(this.info.err || '', null, 2))
    },
  },
  watch: {
  },
  mounted () {

  },
  methods: {
    getDetail () {
      this.$emit('click', this.info)
    },
    lightCode (data) {
      return hljs.highlight('json', data).value
    },
  },
}
</script>
<style scoped>
.log-detail {
  overflow: auto;
}
.code-area {
  width: 100%;
  overflow: auto;
  max-height: 400px;
}
.log-detail-block {
  margin-top: 10px;
  border-bottom: 1px solid #efefef;
}
</style>
<style>

</style>

