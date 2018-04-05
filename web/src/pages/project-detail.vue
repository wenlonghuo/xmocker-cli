/* eslint-disable */
<template>
<div class="project-detail">
  <detail-project :info="info" class="left-info"></detail-project>
  <Card class="right-container" :bordered="false" dis-hover="dis-hover">
    <p slot="title">
        <Icon type="ios-film-outline"></Icon>
        API列表
        <span class="cus-card-left-bar">
          <Input v-model="searchVal" icon="search" placeholder="输入API名进行检索" style="width: 150px;margin: 0 10px;"/>
          <a href="javascript:;" v-if="sortBy" class="cus-action-link" @click="sortList('')" style="margin-right: 20px;"><Icon type="navicon"></Icon> 按名称排序</a>
          <a href="javascript:;" v-else class="cus-action-link" @click="sortList('_mt')" style="margin-right: 20px;"><Icon type="clock"></Icon> 按时间排序</a>
          <a href="javascript:;" class="cus-action-link" @click="addApi" style="margin-right: 10px;"><Icon type="plus-round"></Icon> 新建</a>
          <a href="javascript:;" class="cus-action-link" @click="copyApi" style="margin-right: 10px;"><Icon type="arrow-down-a"></Icon> 导入API</a>
        </span>
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

    <div class="right-list flex-api-card-list" style="position: relative;height: 100%;">
      <Spin fix v-if="loading" style="background-color: rgba(255, 255, 255, .3)">
          <Icon type="load-c" size=18 class="spin-icon-load"></Icon>
          <div>Loading</div>
      </Spin>
      <div class="card-tab" v-for="(tab, index) in flowTabList" :key="index">
        <apiCard class="card-color"
          v-for="item in tab"
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
          @setFix="setFix"
        ></apiCard>
      </div>
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

  <Modal v-model="showFixData" width="360">
    <p slot="header" style="text-align:center">
      <span>固定数据</span>
    </p>
    <div>
      <p style="margin-bottom: 10px;">选择要设置的固定数据类型和值</p>
      <div class="cus-radio-group">
        <div class="label-data">
          <div class="label">选择类型</div>
          <Radio-group v-model="modifyFixedType" type="button" vertical>
            <Radio label="1">错误</Radio>
            <Radio label="2">异常</Radio>
            <Radio label="3">分支</Radio>
            <Radio label="0">无空</Radio>
          </Radio-group>
        </div>
        <div class="label-data">
          <div class="label">选择数值</div>
          <div class="selection-list">
            <Select v-show="modifyFixedType == 1" v-model="modifyFixedWrong" placeholder="错误" class="radio-select" size="small">
              <Option v-for="item in libList" :value="item._id" :key="item.name">{{ item.name }}</Option>
            </Select>
            <Select v-show="modifyFixedType == 2" v-model="modifyFixedThrow" placeholder="异常" class="radio-select" size="small">
              <Option v-for="item in throwList" :value="item.value" :key="item.label">{{ item.label }}</Option>
            </Select>
            <Select v-show="modifyFixedType == 3" v-model="modifyFixedBranch" placeholder="分支" class="radio-select" size="small">
              <Option v-for="item in ModelList" :value="item._id" :key="item.name">{{ item.name }}</Option>
            </Select>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <Button size="large"  :loading="modalLoading" @click="closeFixModel">关闭</Button>
      <Button type="primary" size="large"  :loading="modalLoading" @click="submitFixData">提交</Button>
    </div>
  </Modal>

</div>
</template>
<script>
import apiCard from '../components/card/api-card-simple.vue'
import detailProject from '../components/detail/detail-project.vue'
import { getApi, searchApi, clientGetProjList, clientPushApiById, copyApi, getLib, getApiModel, setApiStatus } from '@/api/api.js'
export default {
  name: 'projectDetail',
  data () {
    return {
      rehearse: {
        hVal: 0,
        vVal: 0,
      },
      methodList: [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'DELETE', label: 'DELETE' },
        { value: 'PATCH', label: 'PATCH' },
      ],
      libList: [],
      ModelList: [],
      throwList: [
        { value: '302', label: '302' },
        { value: '304', label: '304' },
        { value: '400', label: '400' },
        { value: '401', label: '401' },
        { value: '403', label: '403' },
        { value: '404', label: '404' },
        { value: '500', label: '500' },
        { value: '502', label: '502' },
      ],
      jsonData: '',
      info: {

      },
      searchVal: '',
      apiList: [],
      leftApis: [],
      showShare: false,
      showShareResult: false,
      showFixData: false,
      modalLoading: false,
      shareType: '本机',
      remoteTarget: '',
      remoteProjs: [],
      localTarget: '',
      selectedApi: '',
      modifyDelay: 0,
      modifyFixedType: '3',
      modifyFixedOutput: '',
      modifyFixedWrong: '',
      modifyFixedBranch: '',
      modifyFixedThrow: '',
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
    flowTabList () {
      let vVal = this.rehearse.vVal
      let tabList = []
      let tabIndex = -1
      if (vVal === 0) return tabList
      for (let i = 0; i < this.apiList.length; i++) {
        if (i % vVal === 0) tabIndex++
        if (!tabList[tabIndex]) tabList.push([])
        tabList[tabIndex].push(this.apiList[i])
      }
      return tabList
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
    getLibList () {
      let param = {
        pageSize: 1000,
        pageNo: 0,
      }
      getLib(param).then(res => {
        if (!res.code) {
          this.libList = res.data.list
        }
      })
    },
    getModelList (id) {
      let param = {
        pageSize: 1000,
        pageNo: 0,
        baseid: this.selectedApi,
      }
      getApiModel(param).then(res => {
        if (!res.code) {
          this.ModelList = [{ _id: '0', name: '基础数据' }, ...res.data.list]
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
      let hVal = Math.floor((rContainer.width - 52) / 370)
      let vVal = Math.floor((rContainer.height - 32) / 165)
      this.rehearse.hVal = hVal
      this.rehearse.vVal = vVal
      let val = vVal * hVal
      this.$store.commit('api/SET_PAGE_SIZE', val)
    },
    sortList (val) {
      this.$store.commit('api/SET_SORT', val)
      this.getApi()
    },
    setFix ({id}) {
      this.selectedApi = id
      this.getLibList()
      this.getModelList(id)
      this.showFixData = true
    },
    submitFixData () {
      let type = this.modifyFixedType
      let param = {
        type,
        project: this.$route.query.id,
        api: this.selectedApi,
      }
      param.id = type === '1' ? this.modifyFixedWrong : type === '3' ? this.modifyFixedBranch : undefined
      param.data = type === '2' ? { code: ~~this.modifyFixedThrow } : undefined
      setApiStatus(param)
        .then(res => {
          if (res.code) return
          this.$Message.success(res.message)
          this.showFixData = false
        })
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
    closeFixModel () {
      this.showFixData = false
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

.flex-api-card-list {
  justify-content: flex-start;
  flex-direction: column;
}
.flex-api-card-list .card-tab>div {
  margin-bottom: 5px;
  margin-right: 20px;
}
.flex-api-card-list .card-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
}
/* 按钮组 */

.cus-radio-group .label-data {
  display: flex;
  margin: 20px 0;
}

.cus-radio-group .label-data>.label {
  display: block;
  width: 6em;
  height: 32px;
  line-height: 30px;
}
.cus-radio-group .selection-list {
  display: flex;
  align-items: center;
}

.radio-select {
  width: 228px;
}
</style>
<style>
.project-detail>.right-container>.ivu-card-body {
  padding-bottom: 0;
}
</style>
