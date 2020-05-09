<template>
<Card class="right-container" >
  <p slot="title">
    <Icon type="ios-film-outline"/>
    项目列表
    <span class="cus-card-left-bar">
      <Input v-model="searchVal" icon="search" placeholder="输入项目名进行检索" style="width: 150px;margin: 0 10px;"/>
      <a href="javascript:;" class="cus-action-link" @click="addProject" style="margin-right: 30px;"><Icon type="plus-round"/> 新建</a>
    </span>
  </p>
  <template slot="extra" v-if="!searchVal">
      <a href="javascript:;" class="cus-action-link" @click="projectNext($event, -1)">
        &nbsp;<Icon type="md-arrow-round-back"/>&nbsp;
      </a>
      <div class="cus-page-info"><span>{{pageNo}}</span>/<span>{{total}}</span></div>
      <a href="javascript:;" class="cus-action-link" @click="projectNext($event, 1)">
        &nbsp;<Icon type="md-arrow-round-forward"/>&nbsp;
      </a>
  </template>
  <div class="project-list">
      <projectCard v-for="item in projectList" class="cus-proj-card card-color"
        :name="item.name"
        :status="item.status"
        :shortcut="item.shortcut"
        :id="item._id"
        :path="item.path"
        :port="item.port"
        :proxyType="item.proxyType"
        :urlList="item.urls"
        :parentName="item.parentName"
        :parentId="item.parentId"
        :gulp="item.gulp"
        :staticPath="item.staticPath"
        :proxyTable="item.proxyTable"
        :key="item._id"
      ></projectCard>
      <div v-for="i in [1,2,3,4,5,6,7,8,9, 10]" :key="i" style="height: 0;margin: 0;"></div>
  </div>
</Card>
</template>
<script>
import pCard from '../components/card/project-card.vue'
export default {
  name: 'projectList',
  data () {
    return {
      searchVal: '',
    }
  },
  components: {
    projectCard: pCard,
  },
  breadList: {
    name: '项目列表',
    menuName: '项目列表',
    href: -1,
  },
  computed: {
    projectList () {
      if (this.searchVal) {
        return this.$store.state.project.list.filter(obj => (obj.name || '').indexOf(this.searchVal) >= 0)
      } else {
        return this.$store.getters['project/pagedList']
      }
    },
    pageNo () {
      return this.$store.state.project.pageNo + 1
    },
    total () {
      return this.$store.getters['project/totalSize']
    },
  },
  mounted () {
    this.setPageSize()
    this.checkProjectList()
  },
  methods: {
    projectNext (e, val) {
      this.$store.commit('project/INCREMENT', val)
    },
    addProject () {
      this.$router.push({name: '项目编辑'})
    },
    setPageSize () {
      let rContainer = document.querySelector('.right-container').getBoundingClientRect()
      let hVal = Math.floor((rContainer.width - 32) / 370)
      let vVal = Math.floor((rContainer.height - 32) / 220)
      let val = vVal * hVal
      this.$store.commit('project/SET_PAGE_SIZE', val < 6 ? 6 : val)
    },
  },
}
</script>
<style scoped>

.project-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  overflow: auto;
  height: 100%;
}

.project-list>div {
  flex-basis: 350px;
  margin: 10px 10px;
  height: 220px;
  /*flex-grow: 1;*/
}
</style>
