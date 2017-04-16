<template>
<div style="display: inline-block;float: right;">
  <a href="javascript:;" class="cus-action-link">新增API</a>
  <a href="javascript:;" class="cus-action-link">搜索</a>
  <a href="javascript:;" class="cus-action-link" @click="projectNext($event, -1)">上一页</a>
  <span>0</span>/<span>0</span>
  <a href="javascript:;" class="cus-action-link" @click="projectNext($event, 1)">下一页</a>
</div>
</template>

<script>
export default {
  name: 'page-action-project-list',
  data () {
    return {}
  },
  methods: {
    projectNext (e, val) {
      this.$store.commit('project/INCREMENT', val)
    },
  },
}
</script>

<style lang="css">

</style>
