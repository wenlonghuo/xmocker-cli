<template>
<Card>
  <p slot="title">{{name}}</p>
  <Table :columns="columns" :data="data" height="300" width="360" size="small" @on-selection-change="setSelection">
  </Table>
  <div style="padding: 10px 0;text-align: right;">
    <Button type="primary" v-if="type != 'clientSide'" @click="clientDownLoadApi(item)">提交</Button>
  </div>
</Card>
</template>

<script>
export default {
  name: 'sync-list',
  data () {
    return {
      columns: [
        {type: 'selection', align: 'center', width: 60},
        {title: '选择API同步', key: 'name', width: 290},
      ],
      selectedList: []
    }
  },
  props: {
    data: {
      type: Array,
      default: [],
    },
    name: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  methods: {
    clientDownLoadApi (item) {
      this.$emit('submit', this.selectedList)
    },
    setSelection (selection) {
      this.selectedList = selection
    },
  },
}
</script>

<style lang="css" scoped>

</style>
