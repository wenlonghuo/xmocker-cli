<template>
<div class="project-detail">
  <detail-project :info="info" class="left-info"></detail-project>
  <Card class="right-container" bordered="bordered" dis-hover="dis-hover">
    <p slot="title">
        <Icon type="ios-film-outline"></Icon>
        API列表
        <div class="cus-card-left-bar">
          <Input v-model="searchVal" icon="search" placeholder="输入API名进行检索" style="width: 150px;margin: 0 10px;"></Input>
          <a href="javascript:;" v-if="sortBy" class="cus-action-link" @click="sortList('')" style="margin-right: 20px;"><Icon type="navicon"></Icon> 按名称排序</a>
          <a href="javascript:;" v-else class="cus-action-link" @click="sortList('_mt')" style="margin-right: 20px;"><Icon type="clock"></Icon> 按时间排序</a>
          <a href="javascript:;" class="cus-action-link" @click="addApi" style="margin-right: 10px;"><Icon type="plus-round"></Icon> 新建</a>
          <a href="javascript:;" class="cus-action-link" @click="copyApi" style="margin-right: 10px;"><Icon type="arrow-down-a"></Icon> 导入API</a>
        </div>
    </p>
    <template slot="extra">
        <a href="javascript:;" class="cus-action-link" @click="pageBefore()">
          &nbsp;<Icon type="chevron-left"></Icon>&nbsp;
        </a>
        <div class="cus-page-info"><span>{{pageNo + 1}}</span>/<span>{{total}}</span></div>
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
        :mt="item._mt"
        :method="item.method"
        :project="item.project"
        :url="item.url"
        :path="item.path"
        :pathEqual="item.pathEqual"
        :delay="~~item.delay"
        :fixedOutput="item.fixedOutput"
        :description="item.description"
        :pageNo="item.pageNo"
        @delete="getApi"
        @shareApi="shareApi"
      ></apiCard>
      <div v-for="i in [1,2,3,4,5,6,7,8,9,10]" :key="i" class="flex-fill"></div>
    </div>
  </Card>
  
  <Modal v-model="showShare" width="360">
    <p slot="header" style="color:#f60;text-align:center">
      <Icon type="information-circled"></Icon>
      <span>贡献API</span>
    </p>
    <div style="text-align:center" class="cus-share-box">

      <RadioGroup v-model="shareType" type="button">
        <Radio label="本机"></Radio>
        <Radio label="服务端"></Radio>
      </RadioGroup>

      <div class="cus-share-choose">
        <label for="">选择项目</label>
        <Select v-if="shareType=='服务端'" v-model="remoteTarget" filterable>
          <Option v-for="item in remoteProjs" :value="item._uid" :key="item._uid">{{ item.name }}</Option>
        </Select>
        <Select v-if="shareType=='本机'" v-model="localTarget" filterable>
          <Option v-for="item in localProjs" :value="item._id" :key="item._id">{{ item.name }}</Option>
        </Select>
      </div>
      <p class="cus-info">当前选中的项目为：
        <span class="cus-focus">{{selectedProject.name}}</span>
        , 项目简称为: 
        <span class="cus-focus">{{selectedProject.shortcut}}</span>
      </p>
      <p class="cus-share-tip">提示: 提交后如果API已存在则不会覆盖原API，需要再次确认才能强制覆盖</p>
    </div>
    <div slot="footer">
      <Button type="primary" size="large" long :loading="modalLoading" @click="shareApiAction()">提交</Button>
    </div>
  </Modal>

  <Modal v-model="showShareResult" width="360">
    <p slot="header" style="text-align:center">
      <span>提交结果</span>
    </p>
    <div style="text-align:center" class="cus-share-box">

      <p class="cus-info">API冲突个数：
        <span class="cus-focus">{{leftApis.length}}</span>个。 
      </p>
      <div v-if="leftApis.length" class="cus-info">
        <span style="font-size: 14px;">冲突的API信息: </span>
        <div>名称: <span class="cus-focus">{{leftApiData.name}}</span>
        </div>
        <div>URL: <span class="cus-focus">{{leftApiData.url}}</span>
        </div>
        <div>方法: <span class="cus-focus">{{leftApiData.method}}</span>
        </div>
        <div>二级路径: <span class="cus-focus">{{leftApiData.path}}</span>
        </div>
        <div>对应的值: <span class="cus-focus">{{leftApiData.pathEqual}}</span>
        </div>
      </div>
      <p class="cus-share-tip" v-if="leftApis.length">提示: 更新会将当前API与已有API合并，删除并更新会删除原API，并插入当前API</p>
      <p class="cus-share-tip" v-if="!leftApis.length">恭喜，全部提交成功！</p>
    </div>
    <div slot="footer">
      <Button size="large"  :loading="modalLoading" @click="closeShareResult">关闭</Button>
      <Button v-if="leftApis.length" type="warning" size="large"  :loading="modalLoading" @click="shareApiAction(1, 1)">删除并更新</Button>
      <Button v-if="leftApis.length" type="primary" size="large"  :loading="modalLoading" @click="shareApiAction(1, 0)">更新</Button>
    </div>
  </Modal>

</div>
</template>
<script>
import apiCard from '../components/card/api-card.vue'
import detailProject from '../components/detail/detail-project.vue'
import { getApi, searchApi, clientGetProjList, clientPushApiById, copyApi } from '@/api/api.js'
export default {
  name: 'projectDetail',
  data () {
    return {
      jsonData: '',
      info: {

      },
      searchVal: '',
      apiList: [],
      leftApis: [],
      showShare: false,
      showShareResult: false,
      modalLoading: false,
      shareType: '本机',
      remoteTarget: '',
      remoteProjs: [],
      localTarget: '',

      loading: true
    }
  },
  components: {
    apiCard: apiCard,
    detailProject,
  },
  computed: {
    pageSize () {
      return this.$store.state.api.pageSize
    },
    pageNo () {
      return this.$store.state.api.pageNo
    },
    total () {
      return this.$store.state.api.total
    },
    searchData () {
      return this.$store.state.api.searchVal
    },
    sortBy () {
      return this.$store.state.api.sortBy
    },
    localProjs () {
      return this.$store.state.project.list
    },
    selectedProject () {
      if (this.shareType === '本机') {
        return this.localProjs.find(item => item._id === this.localTarget) || {}
      }
      return this.remoteProjs.find(item => item._uid === this.remoteTarget) || {}
    },
    leftApiData () {
      let serverData = (this.leftApis[0] || {}).api || {}
      return this.shareType === '本机' ? (this.leftApis[0] || {}) : (Object.assign({}, serverData.base, {model: serverData.model}))
    },
  },
  watch: {
    searchVal (val) {
      this.$store.commit('api/SET_SEARCH', val)
      clearTimeout(this.delayHandle)
      this.delayHandle = setTimeout(() => {
        this.$store.commit('api/SET_ZERO')
        this.getApi()
      }, 200)
    },
  },
  mounted () {
    this.searchVal = this.searchData
    this.callTime = 0
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
      clearTimeout(this.delayHandle)
      this.callTime++
      this.loading = true
      let func = this.searchData ? searchApi : getApi
      let param = {
        project: this.info._id,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        sortBy: this.sortBy,
        order: this.sortBy ? -1 : 1,
      }
      if (this.searchData) param.words = this.searchData
      return func(param).then((data) => {
        this.loading = false
        if (!data.code) {
          this.apiList = data.data.list
          this.$store.commit('api/SET_TOTAL', data.data.pagination.pageCnt || 1)
        }
      })
    },
    pageNext () {
      if (this.pageNo >= this.total - 1) return
      this.$store.commit('api/INCREMENT', 1)
      this.getApi()
    },
    pageBefore () {
      if (this.pageNo <= 0) return
      this.$store.commit('api/INCREMENT', -1)
      this.getApi()
    },
    addApi () {
      this.$router.push({name: 'API编辑', query: {project: this.info._id}})
    },
    copyApi () {
      this.$router.push({name: 'API复制', query: {id: this.info._id, uid: this.info._uid, name: this.info.name}})
    },
    setPageSize () {
      let rContainer = document.querySelector('.right-container').getBoundingClientRect()
      let hVal = Math.floor((rContainer.width - 52) / 356)
      let vVal = Math.floor((rContainer.height - 32) / 268)
      let val = vVal * hVal
      val = val < 6 ? 6 : val
      this.$store.commit('api/SET_PAGE_SIZE', val)
    },
    sortList (val) {
      this.$store.commit('api/SET_SORT', val)
      this.getApi()
    },
    shareApi (id) {
      let api = this.apiList.find(item => item._id === id)
      if (!api) return
      this.sharedApi = api
      this.showShare = true
      let params = {
        pageSize: 10000,
        pageNo: 0,
      }
      clientGetProjList(params).then(res => {
        if (res.code) return
        this.remoteProjs.splice(0, this.remoteProjs.length, ...res.data.list)
      })
      .catch(e => {
        console.log(e)
      })
    },
    shareApiAction (force, forceRemove) {
      let p
      if (this.shareType === '服务端') {
        if (!this.remoteTarget) return
        p = this.postShare(force, forceRemove)
      } else {
        if (!this.localTarget) return
        p = this.postCopy(force, forceRemove)
      }
      this.modalLoading = true
      p.then(res => {
        this.modalLoading = false
        if (res.code) return
        this.showShare = false
        this.showShareResult = !this.showShareResult
        let data = this.shareType === '本机' ? res.data.list[0].apis : res.data.api.fail
        if (!data) return
        this.leftApis.splice(0, this.leftApis.length, ...data)
        this.$Message.success(res.message)
      })
      .catch(e => {
        this.modalLoading = false
      })
    },
    closeShareResult () {
      this.showShareResult = false
    },
    postShare (force, forceRemove) {
      let params = {
        id: this.sharedApi._id,
        project: this.remoteTarget,
        force,
        forceRemove,
      }
      return clientPushApiById(params)
    },
    postCopy (force, forceRemove) {
      let params = {
        from: this.sharedApi._id,
        to: this.localTarget,
        force,
        forceRemove,
      }
      return copyApi(params)
    },
  },
}
</script>
<style scoped>
.left-info {
  margin-top: 0;
}
.cus-share-choose {
  display: block;
  margin-top: 30px;
  text-align: left;
}

.cus-share-choose>label {
  display: inline-block;
  margin-right: 20px;
  line-height: 32px;
}
.cus-share-choose>div {
  display: inline-block;
  width: 200px;
}

.cus-share-box>p {
  margin: 10px 0;
  text-align: justify;
  line-height: 1.5;
}
.cus-share-box .cus-info {
  margin-top: 25px;
  text-align: left;
}

.cus-focus {
  color: #2d8cf0;
}
.cus-share-tip {
  color: #ff9900;
}
</style>
