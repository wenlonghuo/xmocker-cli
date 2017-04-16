<template>
  <div class="cus-api-detail">
    <div class="left-info">
      <Card>
        <p slot="title">
          {{info.name}}
        </p>
        <template slot="extra">
          <a href="javascript:void(0)" v-for="item in topBarItems" :key="item.action" style="margin-right: 10px;">
            <Icon :type="item.type" color="#9ea7b4" @click.native="btnAction(item.action)"></Icon>
          </a>
        </template>
        <div class="cus-detail-list-simple" v-for="item in simpleItem" :key="item.key">
          <span>{{item.label}}: </span>
          <span>{{info[item.key] || '未配置'}}</span>
        </div>
      </Card>
    </div>
    <Card :bordered="false" class="right-container" style="height:calc(100vh - 112px)">
      <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          API分支列表
      </p>
      <div class="right-list">
        <Card class="right-list-item" v-for="model in info.model" :key="model._id">
          <p slot="title">
            分支 - {{model.name}}
          </p>
          <div class="cus-detail-list-simple" v-for="item in modelItem" :key="item.key">
            <span>{{item.label}}: </span>
            <span>{{model[item.key] || '未配置'}}</span>
          </div>
          <div class="cus-detail-list-simple" v-for="item in modelItemPre" :key="item.key">
            <span>{{item.label}}: </span>
            <pre><code>{{model[item.key]}}</code></pre>
          </div>
        </Card>
        <div v-for="i in [1,2,3,4,5,6,7,8,9,10]" :key="i" class="flex-fill"></div>
      </div>
    </Card>
  </div>
</template>

<script>
import mixin from '@/mixin/action-api.js'
export default {
  name: 'detail-api',
  mixins: [mixin],
  data () {
    return {
      topBarItems: [
        {name: '编辑', type: 'edit', action: 'btnEdit'},
        {name: '删除', type: 'android-remove-circle', action: 'btnDelete'},
      ],
      simpleItem: [
        {label: '名称', key: 'name'},
        {label: '方法', key: 'method'},
        {label: 'URL', key: 'url'},
        {label: '二级路径', key: 'path'},
        {label: '二级路径字段预期值', key: 'pathEqual'},
        {label: '延时设置', key: 'delay'},
        {label: '描述', key: 'description'},
      ],
      modelItem: [
      ],
      modelItemPre: [
        {label: '判断条件', key: 'condition', type: 'javascript'},
        {label: '输出过滤函数', key: 'afterFunc', type: 'javascript'},
        {label: '输入参数模板', key: 'inputParam', type: 'json'},
        {label: '输出参数模板', key: 'outputParam', type: 'json'},
        {label: 'mock数据', key: 'data', type: 'json'},
      ],
    }
  },
  props: {
    info: {
      type: Object,
      default: {},
    },
  },
  created () {
    this.setGData()
  },
  methods: {
    setGData () {
      let query = this.$route.query
      this.apiInfo.id = query.id
      this.apiInfo.project = query.project
    },
  },
}
</script>

<style lang="css">

</style>
