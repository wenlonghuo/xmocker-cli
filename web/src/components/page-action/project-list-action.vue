<template>
<div style="display: inline-block;float: right;">
  <a href="javascript:;" class="cus-action-link" @click="addProject">新增项目</a>
  <a href="javascript:;" class="cus-action-link">搜索</a>
  <a href="javascript:;" class="cus-action-link" @click="projectNext($event, -1)">上一页</a>
  <div class="cus-page-info"><span>{{pageNo}}</span>/<span>{{total}}</span></div>
  <a href="javascript:;" class="cus-action-link" @click="projectNext($event, 1)">下一页</a>
</div>
</template>

<script>
export default {
  name: 'page-action-project-list',
  data () {
    return {}
  },
  computed: {
    pageNo () {
      return this.$store.state.project.pageNo + 1
    },
    total () {
      return this.$store.getters['project/totalSize']
    },
  },
  methods: {
    projectNext (e, val) {
      this.$store.commit('project/INCREMENT', val)
    },
    addProject () {
      this.$router.push({name: '项目编辑'})
    }
  },
}
</script>

<style lang="css">

</style>
