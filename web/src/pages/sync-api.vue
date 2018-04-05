<template>
<div>
  <div class="sync-list">
    <syncCard v-for="item in typeList" :key="item.key" :data="filterList(item.key)" @submit="clientDownLoadApi" :name="item.name" :show="item.key !== 'clientSide'" v-if="list[item.key] && list[item.key].length"></syncCard>
    <div v-for="i in [1,2,3,4,5,6,7,8,9, 10]" :key="i"></div>
  </div>
  <Modal v-model="showShareResult" width="360">
    <p slot="header" style="text-align:center">
      <span>提交结果</span>
    </p>
    <div style="text-align:center" class="cus-share-box">
      <p class="cus-info">API冲突个数：
        <span class="cus-focus">{{leftApis.length}}</span>个。
      </p>
      <p style="text-align: left;">
        <span class="copy-api-conflict" v-for="item in leftApis" :key="item._id">{{item.name}}</span>
      </p>
      <p class="cus-share-tip" v-if="leftApis.length">提示: 更新会将当前API与已有API合并，删除并更新会删除原API，并插入当前API</p>
      <p class="cus-share-tip" v-if="!leftApis.length">恭喜，全部提交成功！</p>
    </div>
    <div slot="footer">
      <Button size="large" @click="closeShareResult">关闭</Button>
      <Button v-if="leftApis.length" type="warning" size="large" @click="shareApiAction(1, 1)">删除并更新</Button>
      <Button v-if="leftApis.length" type="primary" size="large" @click="shareApiAction(1, 0)">更新</Button>
    </div>
  </Modal>
</div>
</template>

<script>
import { clientGetApiDiff, clientDownLoadApi } from '@/api/api.js'
import syncCard from '~components/card/select-api-card.vue'
const assign = Object.assign
export default {
  name: 'sync-list',
  data () {
    return {
      list: {},
      typeList: [
        {name: '落后于服务端', key: 'behind', download: 'base'},
        {name: '领先于服务端', key: 'ahead', download: 'base'},
        {name: '本机独有', key: 'clientSide', download: ''},
        {name: '服务端独有', key: 'serverSide', download: 'all'},
        {name: '无变化项目', key: 'unchanged', download: ''},
        {name: '未知项目', key: 'unstaged', download: ''},
      ],
      leftApis: [],
      showShareResult: false,
    }
  },
  components: {
    syncCard
  },
  created () {
    this.getSyncData()
  },
  methods: {
    getSyncData () {
      let uid = this.$route.query.uid
      this.id = this.$route.query.id
      this.uid = uid
      return clientGetApiDiff({id: uid}).then((data) => {
        if (!data.code) {
          this.list = data.data
        }
      })
    },
    clientDownLoadApi (item) {
      this.currentApis = item
      this.downLoadApi()
    },
    downLoadApi (force, forceRemove) {
      let apis = this.currentApis
      let ids = apis.map(item => item._uid).join(',')
      let params = {
        project: this.uid,
        ids: ids,
        localProject: this.id,
        force,
        forceRemove,
      }
      return clientDownLoadApi(params).then((res) => {
        if (res.code) return
        this.$Message.success(res.message)
        let list = res.data.api.fail.map(item => {
          return Object.assign({}, item.api.base)
        })
        if (list.length) {
          this.leftApis.splice(0, this.leftApis.length, ...list)
          this.showShareResult = true
        }
        if (force) {
          this.showShareResult = false
        }
      })
    },
    filterList (key) {
      return (this.list[key] || []).map(item => assign((item.client || item.server).base, {key}))
    },
    shareApiAction (force, forceRemove) {
      this.downLoadApi(force, forceRemove)
    },
    closeShareResult () {
      this.showShareResult = false
    },
  },
}
</script>

<style lang="css" scoped>
.sync-list, .sync-body-list {
  display: flex;
  flex-wrap: wrap;
}
.sync-list>div {
  flex-basis: 400px;
  margin: 10px;
}
.sync-body-list {
  justify-content: center;
}
.sync-body-list>div {
  flex-basis: 150px;
  margin: 10px;
}

</style>
