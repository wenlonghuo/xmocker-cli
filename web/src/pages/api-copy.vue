<template>
<div class="copy-list">
  <Card>
    <p slot="title">导入API至{{projName}}</p>

    <Form class="copy-box">
      <Form-item class="" label="选择类型">
        <RadioGroup v-model="shareType" type="button">
          <Radio label="本机"></Radio>
          <Radio label="服务端"></Radio>
        </RadioGroup>
      </Form-item>
      <Form-item class="" label="选择项目">
        <div class="share-choose">
          <Select v-if="shareType=='服务端'" v-model="remoteTarget" filterable>
            <Option v-for="item in remoteProjs" :value="item._uid" :key="item._uid">{{ item.name }}</Option>
          </Select>
          <Select v-if="shareType=='本机'" v-model="localTarget" filterable>
            <Option v-for="item in localProjs" :value="item._id" :key="item._id">{{ item.name }}</Option>
          </Select>
        </div>
      </Form-item>
      <Form-item class="" label="选择API">
        <Table class="share-choose-table" :columns="columns" :data="data" height="300" width="600" size="small" @on-selection-change="setSelection"></Table>
      </Form-item>
      <Button type="primary" @click.native="copyTo()" style="margin-top: 30px;">提交</Button>

    </Form>
  </Card>

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
import { getApi, copyApi, clientDownLoadApi, clientGetProjList, clientGetApiListByProject } from '@/api/api.js'
export default {
  name: 'copy-list',
  data () {
    return {
      columns: [
        {type: 'selection', align: 'center', width: 60},
        {title: '选择API', key: 'name', width: 300},
        {title: '修改时间', key: 'time', width: 230},
      ],
      data: [],
      shareType: '本机',
      selectedList: [],
      localApiList: [],
      localTarget: '',
      remoteTarget: '',
      remoteApiList: [],
      remoteProjs: [],
      leftApis: [],
      showShareResult: false,
    }
  },
  watch: {
    shareType () {
      this.findProjectApi()
    },
    localTarget () {
      this.findProjectApi()
    },
    remoteTarget () {
      this.findProjectApi()
    },
  },
  created () {
    this.checkProjectList().then(() => {
      if (this.$route.query.id) {
        this.id = this.$route.query.id
        this.uid = this.$route.query.uid
      } else {
        this.$Message.error('抱歉，走错了呢')
      }
    })
    this.getRemoteProject()
  },
  computed: {
    projName: function () {
      return this.$route.query.name
    },
    localProjs () {
      return this.$store.state.project.list
    },
  },
  methods: {
    getRemoteProject () {
      let params = {
        pageSize: 10000,
        pageNo: 0,
      }
      return clientGetProjList(params).then(res => {
        if (res.code) return
        this.remoteProjs.splice(0, this.remoteProjs.length, ...res.data.list)
      })
    },
    findProjectApi (e, item) {
      let func = this.shareType === '本机' ? this.getLocalApiList : this.getRemoteApiList
      return func.call(this).then((data) => {
        if (!data || data.code) return
        let list = data.data.list.map(item => {
          if (item.base) {
            return Object.assign({}, item.base, { time: this.timer(item.base._mt), model: item.model })
          }
          return Object.assign({}, item, { time: this.timer(item._mt) })
        })
        this.data.splice(0, this.data.length, ...list)
      })
    },
    getLocalApiList () {
      if (!this.localTarget) return Promise.resolve()
      return getApi({
        project: this.localTarget,
        pageSize: 5000,
        pageNo: 0,
        order: -1,
        sortBy: '_mt',
      })
    },
    getRemoteApiList () {
      if (!this.remoteTarget) return Promise.resolve()
      let params = {
        pageSize: 10000,
        pageNo: 0,
        id: this.remoteTarget,
        order: -1,
        sortBy: '_mt',
      }
      return clientGetApiListByProject(params)
    },
    copyToLocal (force, forceRemove) {
      return copyApi({
        to: this.id,
        from: this.from,
        force,
        forceRemove,
      })
    },
    copyToAction (force, forceRemove) {
      if (this.shareType === '本机' && !this.localTarget) {
        return this.$Message.error('请选择项目')
      }
      if (this.shareType === '服务端' && !this.remoteTarget) {
        return this.$Message.error('请选择项目')
      }
      this.from = this.selectedList.map(s => (this.shareType === '本机' ? s._id : s._uid)).join(',')
      if (!this.from) return this.$Message.error('请选择API')

      return (this.shareType === '本机' ? this.copyToLocal(force, forceRemove) : this.copyFromRemote(force, forceRemove))
        .then(res => {
          if (res.code) return
          this.$Message.success(res.message)
          let list
          if (this.shareType === '本机') {
            list = res.data.list[0].apis
          } else {
            list = res.data.api.fail.map(item => {
              return Object.assign({}, item.api.base)
            })
          }
          if (list.length) {
            this.leftApis.splice(0, this.leftApis.length, ...list)
            this.showShareResult = true
          }
          if (force) {
            this.showShareResult = false
          }
        })
    },
    copyTo (force, forceRemove) {
      this.copyToAction()
    },
    copyFromRemote (force, forceRemove) {
      return clientDownLoadApi({
        ids: this.from,
        project: this.remoteTarget,
        localProject: this.id,
        force,
        forceRemove,
      })
    },
    closeShareResult () {
      this.showShareResult = false
    },
    shareApiAction (force, forceRemove) {
      this.copyToAction(force, forceRemove)
    },
    setSelection (selection) {
      this.selectedList = selection
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
  flex-grow: 1;
  flex-basis: 45%;
  margin: 10px;
}
.sync-body-list {
  justify-content: center;
}
.sync-body-list>div {
  flex-basis: 150px;
  margin: 10px;
}
.click-item {
  margin: 0 10px;
  overflow-y: auto;
  cursor: pointer;
  height: 300px;
}
.click-item li {
  padding: 10px;
  position: relative;
}
.click-item li::before {
  content: '';
  position: absolute;
  display: block;
  width: 200%;
  height: 200%;
  top: 0;
  left: 0;
  transform: scale(.5);
  transform-origin: 0% 0%;
  border: 1px solid #efefef;
}

.copy-box .share-choose {
  display: inline-block;
  text-align: left;
  width: 200px;
}
.copy-box .share-choose-table {
  display: inline-block;
}
</style>
