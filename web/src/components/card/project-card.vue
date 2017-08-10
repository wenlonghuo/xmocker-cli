<template>
  <Card :style="titleColor">
    <p slot="title" @click="btnView()" class="cus-hover" style="max-width: 70%;" :title="name">
      <!--<Icon type="power" color="green" v-if="status"></Icon>-->
      <Icon type="monitor" color="#9ea7b4"></Icon>
      {{name}}
    </p>
    <template slot="extra">
      <a href="javascript:void(0)" v-for="item in topBarItems" class="cus-card-tbar-btn" v-if="!fromSearch">
        <Icon :type="item.type" color="#9ea7b4" @click.native="btnAction(item.action)"></Icon>
      </a>
      <a v-if="fromSearch" href="javascript:void(0)" @click="btnAction('btnView')">详情</a>
      <Dropdown trigger="click" placement="bottom-end" style="margin-left: 10px;" v-if="!fromSearch">
        <a href="javascript:void(0)">
          <Icon type="more" color="#9ea7b4"></Icon>
        </a>
        <Dropdown-menu slot="list">
          <Dropdown-item v-for="item in topDropdownItems" @click.native="btnAction(item.action)" :key="item.type">
            <Icon :type="item.type" color="#9ea7b4" class="cus-dw-icon"></Icon>{{item.name}}
          </Dropdown-item>
        </Dropdown-menu>
      </Dropdown>
    </template>
    
    <ul class="cus-list-db">
      <li>
          <span>项目路径</span>
          <div class="cus-list-right">
            <span class="cus-show-value proj-path" :title="path || '暂无'">{{path || '暂无'}}</span>
            <Poptip placement="right" width="300" v-if="!fromSearch">
              <a href="javascript:void(0)">修改</a>
              <div class="cus-tooltip" slot="content">
                <p class="cus-tooltip-text">项目路径用于gulp或提供静态文件服务器，修改后项目会自动重启</p>
                <Input placeholder="项目路径" v-model="ModifyPath"></Input>
                <Button type="primary" size="small" @click.native="submitItem('path', ModifyPath)">提交</Button>
              </div>
            </Poptip>
          </div>
      </li>
      <li>
          <span>端口号</span>
          <div class="cus-list-right">
            <span class="cus-show-value">{{port || '暂未配置'}}</span>
            <template>
              <Poptip placement="right" width="300" v-if="!fromSearch">
                <a href="javascript:void(0)">修改</a>
                <div class="cus-tooltip" slot="content">
                  <p class="cus-tooltip-text">端口号是访问数据的端口，纯数字，修改后会自动重启</p>
                  <div class="cus-tooltip-oneline">
                    <Input-number :max="65535" :min="0" placeholder="端口号" size="small" v-model="ModifyPort"></Input-number>
                    <Button type="primary" size="small" style="margin: 0" @click.native="submitItem('port', ModifyPort)">提交</Button>
                  </div>
                </div>
              </Poptip>
            </template>
          </div>
      </li>
      <li>
          <span>404代理模式</span>
          <div class="cus-list-right">
            <span class="cus-show-value">{{proxyText}}</span>
            <Dropdown placement="right-end" trigger="click" v-if="!fromSearch">
              <a href="javascript:void(0)">
                修改
              </a>
              <Dropdown-menu slot="list">
                <Dropdown-item @click.native="submitItem('proxyType', 0)">本地</Dropdown-item>
                <Dropdown-item @click.native="submitItem('proxyType', 1)">服务器</Dropdown-item>
                <Dropdown-item @click.native="submitItem('proxyType', 2)">混合</Dropdown-item>
              </Dropdown-menu>
            </Dropdown>
          </div>
      </li>
      <li>
          <span>自定义链接列表</span>
          <div class="cus-list-right">
            <span class="cus-show-value">{{(urlList && urlList.length) || 0}}个</span>
            <Poptip placement="right" width="300" v-if="!fromSearch">
              <a href="javascript:void(0)" v-if="(urlList && urlList.length) || 0">查看</a>
              <div class="cus-tooltip" slot="content">
                <ul class="cus-tooltip-list">
                  <li v-for="url in urlList">
                    <a href="javascript:;">{{url.name}}</a>
                    <a :href="getUrl(url)" target="_blank">{{url.url}}</a>
                  </li>
                </ul>
              </div>
            </Poptip>
          </div>
      </li>
      <li>
          <span>父级项目</span>
          <div class="cus-list-right">
            <span class="cus-show-value">{{parentName || '暂无'}}</span>
          </div>
      </li>
      <li>
          <span>其他功能</span>
          <span>
            <Tag v-if="gulp && Object.keys(gulp).length">gulp</Tag>
            <Tag v-if="staticPath && staticPath.length">静态资源</Tag>
            <Tag v-if="proxyTable && proxyTable.length">代理</Tag>
          </span>
      </li>
    </ul>
  </Card>
</template>
<script>
import { editProject } from '@/api/api.js'
import mixin from '@/mixin/action-project.js'
export default {
  name: 'project-card',
  mixins: [mixin],
  data () {
    return {
      topBarItems: [
        {name: '启动', type: 'play', action: 'btnPlay'},
        {name: '停止', type: 'stop', action: 'btnStop'},
        {name: '刷新', type: 'refresh', action: 'btnRefresh'},
      ],
      topDropdownItems: [
        {name: '查看', type: 'eye', action: 'btnView'},
        {name: '编辑', type: 'edit', action: 'btnEdit'},
        {name: '删除', type: 'android-remove-circle', action: 'btnDelete'},
        // {name: '查看代理过的API', type: 'ios-cloud-download', action: 'btnViewProxy'},
      ],
      ModifyPath: '',
      pType: '',
      ModifyPort: 8080,
    }
  },
  props: {
    name: {
      type: String,
    },
    status: {
      type: Number,
    },
    shortcut: {
      type: String,
    },
    id: {
      type: String,
    },
    path: {
      type: String,
    },
    port: {
      type: Number,
    },
    proxyType: {
      type: Number,
      default: 0,
    },
    urlList: {
      type: Array,
    },
    parentName: {
      type: String,
    },
    parentId: {
      type: String,
    },
    gulp: {
      type: Object,
    },
    staticPath: {
      type: Array,
    },
    proxyTable: {
      type: Array,
    },
    fromSearch: {
      type: Boolean,
    },
  },
  watch: {
    'path': function () {
      this.ModifyPath = this.path
    },
    'port': function () {
      this.ModifyPort = this.port
    },
    'proxyType': function () {
      this.pType = this.proxyType
    },
  },
  computed: {
    proxyText: function () {
      var type = ['本地', '服务器', '混合']
      return type[this.proxyType] || '未知'
    },
    titleColor: function () {
      return this.status ? {'background-color': '#CAE1FF'} : {}
    },
  },
  methods: {
    submitItem (name, val) {
      let obj = { id: this.id }
      obj[name] = val
      editProject(obj).then(this.afterEdit)
    },
    getUrl (url) {
      return `http://${window.location.hostname}:${this.port}${url.url}`
    },
  },
  mounted () {
    this.projInfo.id = this.id
  }
}
</script>

<style>
.cus-dw-icon {
  margin-right: 5px!important;
}
.cus-list-db > li {
  display: flex;
  justify-content: space-between;
}
.cus-tooltip {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.cus-tooltip .ivu-btn {
  margin-top: 10px;
}
.cus-tooltip-text {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  word-break: break-word;
  white-space: normal;
}
.cus-tooltip-oneline {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.cus-tooltip-list {
  width: 100%;
}
.cus-tooltip-list li {
  display: flex;
  overflow: hidden;
}
.cus-tooltip-list li a:first-child {
  flex-basis: 100px;
  margin-right: 10px;
}
.cus-list-right {
  display: flex;
}
.cus-list-right>span:first-child {
  max-width: 120px;
  overflow: hidden;
  height: 20px;
  margin-right: 5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cus-card-tbar-btn {
  margin-left: 10px;
}
.cus-hover {
  cursor: pointer;
}
.ivu-badge-dot {
  background-color: green;
}

</style>
