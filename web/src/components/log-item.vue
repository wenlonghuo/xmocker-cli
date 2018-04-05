<template>
<Card class="log-item">
  <div class="log-item-time" style="width: 90px;cursor: pointer;" @click="getDetail">
    <span>{{info.time | timeDate}}</span>
    <span>{{info.time | timeCount}}</span>
  </div>
  <div class="log-item-body">
    <div style="width: 100%;word-break: break-all;">
      <span>{{info.project}}</span>
      <span>{{info.api}}</span>
      <span>{{info | ip}}</span>
      <span>{{info | os}}</span>
    </div>
    <div>
      {{info | msg}}
    </div>
  </div>
</Card>
</template>
<script>
import mixin from '../mixin'
const timer = mixin.methods.timer
export default {
  name: 'log-item',
  data () {
    return {

    }
  },
  props: {
    info: {
      type: Object,
      default: () => ({}),
    }
  },
  filters: {
    timeDate (val) {
      val = val || 0
      return timer(val).slice(0, 10)
    },
    timeCount (val) {
      return timer(val).slice(11, 23)
    },
    ip (item) {
      return item.ip || (item.client && item.client.ip)
    },
    os (item) {
      return item.os && (item.os.name + '-' + item.os.version)
    },
    msg (item) {
      return item.message + (item.err ? item.err.msg : '')
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
  },
}
</script>
<style scoped>
.log-item-time, .log-item-body {
  display: flex;
  flex-wrap: wrap;
}
.log-item-time {
  border-right: 1px solid #efefef;
  margin-left: 5px;
  align-content: flex-start;
  font-size: 12px;
}
.log-item-time span {
  padding-right: 10px;
  width: 100%;
  text-align: right;
}
.log-item-time span:first-child {
  font-size: 13px;
}
.log-item {
  margin: 3px 0;
}
</style>
<style>
.log-item>.ivu-card-body {
  padding: 5px;
  display: flex;
}
.log-item>.ivu-card-body>.log-item-body {
  margin-left: 5px;
  display: flex;
  flex-wrap: wrap;
}
</style>
