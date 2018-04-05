<template>
<div class="sync-list">
  <Card v-for="(tp, index1) in typeList" v-if="list[tp.key] && list[tp.key].length" :key="index1">
    <p slot="title">{{tp.name}}</p>
    <div class="sync-body-list">
      <Card border="false" v-for="(item, index) in list[tp.key]" :key="index">
        <div>{{item | projName}}</div>
        <div>
          <a href="javascript:void(0)" @click="clientDownLoadProjBase(item)" v-if="tp.download === 'base'" style="margin-right: 10px;">
            <Icon type="arrow-down-a"></Icon>
          </a>
          <a href="javascript:void(0)" @click="clientDownLoadProj(item)" v-if="tp.download === 'all'" style="margin-right: 10px;">
            <Icon type="arrow-down-a"></Icon>
          </a>
          <a href="javascript:void(0)" @click="linkNext(item)" v-if="item.client" style="margin-right: 10px;">
            <Icon type="android-open"></Icon>
          </a>
        </div>
      </Card>
      <div v-for="i in [1,2,3,4,5,6,7,8,9,10]" :key="'s' + i"></div>
    </div>
  </Card>
  <div v-for="i in [1,2,3,4,5,6,7,8,9, 10]" :key="'i' + i"></div>
</div>
</template>

<script>
import { clientGetProjDiff, clientDownLoadProjBase, clientDownLoadProj } from '@/api/api.js'
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
    }
  },
  created () {
    this.getSyncData()
  },
  filters: {
    projName (val) {
      var obj = val.client ? val.client : val.server
      var str = obj.shortcut ? '(' + obj.shortcut + ')' : ''
      return `${obj.name || ''}${str}`
    },
  },
  methods: {
    getSyncData () {
      return clientGetProjDiff({}).then((data) => {
        if (!data.code) {
          this.list = data.data
        }
      })
    },
    clientDownLoadProjBase (item) {
      let id = (item.client || item.server)._uid
      return clientDownLoadProjBase({id: id}).then((data) => {
        if (!data.code) {
          this.$Message.success(data.message)
        }
      })
    },
    clientDownLoadProj (item) {
      let id = (item.client || item.server)._uid
      return clientDownLoadProj({id: id}).then((data) => {
        if (!data.code) {
          this.$Message.success(data.message)
        }
      })
    },
    linkNext (item) {
      if (!item.client) return
      this.$router.push({name: '同步API', query: {uid: item.client._uid, id: item.client._id, name: item.client.name}})
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

</style>
