<template>
<div class="project-detail">
  <div class="left-info">
    <detail-project :info="info"></detail-project>
  </div>
  <Card :bordered="false" class="right-container" style="height:calc(100vh - 112px)">
    <p slot="title">
        <Icon type="ios-film-outline"></Icon>
        API列表
        <div class="cus-card-left-bar">
          <Input v-model="searchVal" icon="search" placeholder="输入API名进行检索" style="width: 150px;margin: 0 10px;"></Input>
          <a href="javascript:;" class="cus-action-link" @click="addApi" style="margin-right: 10px;"><Icon type="plus-round"></Icon> 新建</a>
          <a href="javascript:;" class="cus-action-link" @click="copyApi" style="margin-right: 10px;"><Icon type="arrow-down-a"></Icon> 从其他项目导入</a>
        </div>
    </p>
    <template slot="extra">
        <a href="javascript:;" class="cus-action-link" @click="pageBefore()">
          &nbsp;<Icon type="chevron-left"></Icon>&nbsp;
        </a>
        <div class="cus-page-info"><span>{{pageInfo.pageNo + 1}}</span>/<span>{{pageInfo.total}}</span></div>
        <a href="javascript:;" class="cus-action-link" @click="pageNext()">
          &nbsp;<Icon type="chevron-right"></Icon>&nbsp;
        </a>
    </template>
    
    <div class="right-list" style="position: relative;height: 100%;">
      <Spin fix v-if="loading" style="background-color: rgba(255, 255, 255, .3)">
          <Icon type="load-c" size=18 class="spin-icon-load"></Icon>
          <div>Loading</div>
      </Spin>
      <apiCard class="right-list-item card-color"
        v-for="item in apiList"
        :key="item._id"
        :name="item.name"
        :id="item._id"
        :method="item.method"
        :project="item.project"
        :url="item.url"
        :path="item.path"
        :pathEqual="item.pathEqual"
        :delay="item.delay"
        :fixedOutput="item.fixedOutput"
        :description="item.description"
        :pageNo="item.pageNo"
        @delete="getApi"
      ></apiCard>
      <div v-for="i in [1,2,3,4,5,6,7,8,9,10]" :key="i" class="flex-fill"></div>
    </div>
  </Card>
</div>
</template>
<script>
import apiCard from '../components/card/api-card.vue'
import detailProject from '../components/detail/detail-project.vue'
import { getApi, searchApi } from '@/api/api.js'
export default {
  name: 'projectDetail',
  data () {
    return {
      jsonData: '',
      info: {

      },
      searchVal: '',
      apiList: [],
      pageInfo: {
        pageNo: 0,
        pageSize: 6,
        total: 0,
      },
      loading: true
    }
  },
  components: {
    apiCard: apiCard,
    detailProject,
  },
  computed: {
  },
  watch: {
    searchVal (val) {
      this.pageInfo.pageNo = 0
      this.pageInfo.total = 1
      this.getApi()
    },
  },
  mounted () {
    this.checkProjectList().then(() => {
      if (this.$route.query.id) {
        let id = this.$route.query.id
        let proj = this.$store.state.project.list.find((p) => { return p._id === id })
        this.setPageSize()
        if (proj) {
          this.info = proj
          this.getApi()
        } else {
          this.$Message.error('项目未找到！')
        }
      } else {
        this.$Message.error('抱歉，走错了呢')
      }
    })
  },
  methods: {
    getApi () {
      this.loading = true
      let func = this.searchVal ? searchApi : getApi
      let param = {project: this.info._id, pageSize: this.pageInfo.pageSize, pageNo: this.pageInfo.pageNo}
      if (this.searchVal) param.words = this.searchVal
      return func(param).then((data) => {
        this.loading = false
        if (!data.code) {
          this.apiList = data.data.list
          this.pageInfo.total = data.data.pagination.pageCnt || 1
        }
      })
    },
    pageNext () {
      if (this.pageInfo.pageNo >= this.pageInfo.total - 1) return
      this.pageInfo.pageNo++
      this.getApi()
    },
    pageBefore () {
      if (this.pageInfo.pageNo <= 0) return
      this.pageInfo.pageNo--
      this.getApi()
    },
    addApi () {
      this.$router.push({name: 'API编辑', query: {project: this.info._id}})
    },
    copyApi () {
      this.$router.push({name: 'API复制', query: {id: this.info._id, name: this.info.name}})
    },
    setPageSize () {
      let rContainer = document.querySelector('.right-container').getBoundingClientRect()
      let hVal = Math.floor((rContainer.width - 52) / 356)
      let vVal = Math.floor((rContainer.height - 32) / 268)
      let val = vVal * hVal
      this.pageInfo.pageSize = val < 6 ? 6 : val
    },
  },
}
</script>
<style scoped>
.left-info {
  width: 300px;
  float: left;
  height: 100%;
  overflow-y: auto;
}

</style>
