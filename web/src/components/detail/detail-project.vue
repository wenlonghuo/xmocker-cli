<template>
  <Card bordered="bordered" dis-hover="dis-hover">
    <p slot="title" >
      {{info.name}}
    </p>
    <template slot="extra">
      <a href="javascript:void(0)" v-for="item in topBarItems" :key="item.name" class="cus-card-tbar-btn" style="margin-left: 10px;">
        <Icon :type="item.type" color="#9ea7b4" @click.native="btnAction(item.action)"></Icon>
      </a>
      <Dropdown trigger="click" placement="bottom-end" style="margin-left: 10px;">
        <a href="javascript:void(0)">
          <Icon type="md-more" color="#9ea7b4"></Icon>
        </a>
        <Dropdown-menu slot="list">
          <Dropdown-item v-for="item in topDropdownItems" @click.native="btnAction(item.action)" :key="item.type">
            <Icon :type="item.type" color="#9ea7b4" class="cus-dw-icon"></Icon>{{item.name}}
          </Dropdown-item>
        </Dropdown-menu>
      </Dropdown>
    </template>

    <div class="cus-detail-list-simple" v-for="item in simpleItem" :key="item.label">
      <span>{{item.label}}: </span>
      <span>{{getItemVal(item)}}</span>
    </div>
    <div class="cus-detail-list-json">
      <span>静态资源</span>
      <div class="json-list">
        <span v-if="!projData.staticPath || !projData.staticPath.length">未配置</span>
        <div v-for="item in projData.staticPath" :key="item">{{item}}</div>
      </div>
    </div>
    <div class="cus-detail-list-json">
      <span>代理</span>
      <div class="json-list">
        <span v-if="!projData.proxyTable || !projData.proxyTable.length">未配置</span>
        <div v-for="item in projData.proxyTable" :key="item.api"><span>{{item.api}}</span><span>{{item.target}}</span></div>
      </div>
    </div>
    <div class="cus-detail-list-json">
      <span>常用URL列表</span>
      <div class="json-list">
        <span v-if="!projData.urls || !projData.urls.length">未配置</span>
        <div v-for="item in projData.urls" class="json-list-folder" v-if="item.list" :key="item.nam">
          <div v-for="iUrl in item.list" class="json-list-urls" :key="iUrl.name">
            <span>{{iUrl.name}}</span>
            <a :href="getUrl(iUrl)">{{iUrl.url}}</a>
          </div>
        </div>
        <div v-for="item in projData.urls" class="json-list-urls" v-if="!item.list" :key="item.name">
          <span>{{item.name}}</span>
          <a :href="getUrl(item)" target="_blank" style="word-break: break-all;">{{item.url}}</a>
        </div>
      </div>
    </div>
    <div class="cus-detail-list-json">
      <span>GULP配置</span>
      <div class="json-list">
        <span v-if="!projData.gulp || !Object.keys(projData.gulp).length">未配置</span>
        <div v-for="(val, key) in projData.gulp" :key="key"><span>{{key}}</span> -> <span>{{val}}</span></div>
      </div>
    </div>
  </Card>
</template>

<script>
import { editProject } from '@/api/api.js'
import mixin from '@/mixin/action-project.js'
export default {
  name: 'detail-project',
  mixins: [mixin],
  data () {
    return {
      topBarItems: [
        {name: '启动', type: 'md-play', action: 'btnPlay'},
        {name: '停止', type: 'md-stop', action: 'btnStop'},
        {name: '刷新', type: 'md-refresh', action: 'btnRefresh'},
      ],
      topDropdownItems: [
        {name: '编辑', type: 'md-settings', action: 'btnEdit'},
        {name: '删除', type: 'md-remove-circle', action: 'btnDelete'},
        // {name: '查看代理过的API', type: 'ios-cloud-download', action: 'btnViewProxy'},
      ],
      simpleItem: [
        {label: '项目名称', key: 'name'},
        {label: '简称', key: 'shortcut'},
        {label: '本地路径', key: 'path'},
        {label: '启动端口', key: 'port'},
        {label: '父级项目名称', key: 'parentName'},
        {label: '分页数', key: 'pageNo'},
        {label: '404代理服务器地址', key: 'proxyTo'},
        {label: '网页注入', key: 'injectHtml', type: 'boolean'},
      ],
      projData: {
        name: '',
        shortcut: '',
        path: '',
        port: '',
        parentName: '',
        pageNo: 0,
        proxyTo: '',
        injectHtml: false,
        proxyTable: [],
        staticPath: [],
        urls: [],
        gulp: {},
      }
    }
  },
  props: {
    info: {
      type: Object,
      default () {
        return {
          name: ''
        }
      },
    },
  },
  watch: {
    'info' () {
      this.initData()
    },
    'info.id' () {

    },
  },
  methods: {
    getItemVal (item) {
      if (item.type === 'boolean') return this.projData[item.key] ? '是' : '否'
      return this.projData[item.key] || '未配置'
    },
    submitItem (name, val) {
      let obj = { id: this.id }
      obj[name] = val
      editProject(obj).then(this.afterEdit)
    },
    btnEdit () {
      this.$router.push({name: '项目编辑', query: { id: this.info._id, fromDetail: true }})
    },
    initData () {
      this.projInfo.id = this.info._id
      this.copyToObj(this.projData, this.info)
    },
    getUrl (iUrl) {
      return 'http://' + window.location.hostname + ':' + this.projData.port + iUrl.url
    },
  },
  created () {
    this.initData()
  },
}
</script>

<style lang="css" scoped>
.cus-detail-list-simple {
  width: 100%;
  display: flex;
}
.cus-detail-list-simple>span:first-child {
  width: 140px;
}
.cus-detail-list-json>.json-list {
  padding-left: 28px;
}
.json-list {
  word-break: break-all;
}
</style>
