<template>
<div class="sync-list">
  <Card>
    <p slot="title">导入API至{{projName}}</p>
    <Row>
      <Col span="8">
        <ul class="click-item">
          <li v-for="item in projectList" :key="item.id" @click="findProjectApi($event, item)">{{item.name || '无名称'}}</li>
        </ul>
      </Col>
      <Col span="8">
        <Table :columns="columns" :data="data" height="300" size="small" @on-selection-change="setSelection"></Table>
      </Col>
      <Col span="8" style="text-align: center;">
        <Button type="primary" @click="copyTo()" style="margin-top: 100px;">提交</Button>
      </Col>
    </Row>
  </Card>
</div>
</template>

<script>
import { getApi, copyApi } from '@/api/api.js'
export default {
  name: 'sync-list',
  data () {
    return {
      columns: [
        {type: 'selection', align: 'center', width: 60},
        {title: '选择API', key: 'name'},
      ],
      data: [],
      selectedList: [],
    }
  },
  created () {
    this.checkProjectList().then(() => {
      if (this.$route.query.id) {
        let id = this.$route.query.id
        this.id = id
      } else {
        this.$Message.error('抱歉，走错了呢')
      }
    })
  },
  computed: {
    projName: function () {
      return this.$route.query.name
    },
    projectList: function () {
      return this.$store.getters['project/selector']
    },
  },
  methods: {
    findProjectApi (e, item) {
      return getApi({ project: item.id, pageSize: 5000, pageNo: 0 }).then((data) => {
        if (!data.code) {
          this.data = data.data.list
        }
      })
    },
    copyTo () {
      let from = this.selectedList.map(s => s._id)
      return copyApi({ to: this.id, from: from.join(',') }).then((data) => {
        if (!data.code) {
          this.$Message.success(data.data.tip)
        }
      })
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
</style>
