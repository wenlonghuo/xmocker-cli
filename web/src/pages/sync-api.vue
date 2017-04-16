<template>
<div class="sync-list">
  <syncCard v-for="item in typeList" :key="item.key" :data="filterList(item.key)" @submit="clientDownLoadApi" :name="item.name" :show="item.key !== 'clientSide'" v-if="list[item.key] && list[item.key].length"></syncCard>
  <div v-for="i in [1,2,3,4,5,6,7,8,9, 10]" :key="i"></div>
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
      let id = this.$route.query.id
      this.id = id
      return clientGetApiDiff({id: id}).then((data) => {
        if (!data.code) {
          this.list = data.data
        }
      })
    },
    clientDownLoadApi (item) {
      let ids = item.map(item => item._id)
      return clientDownLoadApi({project: this.id, ids: ids.join(',')}).then((data) => {
        if (!data.code) {
          this.$Message.success(data.data.tips)
        }
      })
    },
    filterList (key) {
      return (this.list[key] || []).map(item => assign((item.client || item.server).base, {key}))
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
