<template>
  <Card>
    <p slot="title" :title="name" style="max-width: 70%;">
      <Icon type="at"></Icon>
      {{name}}
    </p>
    <template slot="extra">
      <a href="javascript:void(0)" v-for="item in topBarItems" :key="item.name" class="cus-card-tbar-btn" v-if="!fromSearch">
        <Icon :type="item.type" color="#9ea7b4" @click.native="btnAction(item.action)"></Icon>
      </a>
      <a v-if="fromSearch" href="javascript:void(0)" @click="btnAction('btnProject')">项目详情</a>
      <a v-if="fromSearch" href="javascript:void(0)" @click="btnAction('btnView')">详情</a>
    </template>
    
    <ul class="cus-list-db">
      <li>
        <span>URL</span>
        <div class="cus-list-right">
          <span class="cus-show-value">{{(method || url )? (method + ' -> ' + url) : '暂无'}}</span>
          <Poptip placement="right" width="300" v-if="!fromSearch">
            <a href="javascript:void(0)">修改</a>
            <div class="cus-tooltip" slot="content">
              <p class="cus-tooltip-text">URL地址是访问请求的url地址，以 "/" 开头，修改实时生效</p>
              <Input placeholder="请填写url" v-model="modifyUrl"></Input>
              <Select v-model="modifyMethod" placeholder="请填写请求方法" style="margin-top: 5px;">
                <Option v-for="item in methodList" :value="item.value" :key="item">{{ item.label }}</Option>
              </Select>
              <Button type="primary" size="small" @click.native="submitItem({url: modifyUrl, method: modifyMethod})">提交</Button>
            </div>
          </Poptip>
        </div>
      </li>
      <li>
        <span>二级路径</span>
        <div class="cus-list-right">
          <span class="cus-show-value">{{(path || pathEqual )? (path + ' ==> ' + pathEqual) : '未开启'}}</span>
          <Poptip placement="right" width="300" v-if="!fromSearch">
            <a href="javascript:void(0)">修改</a>
            <div class="cus-tooltip" slot="content">
              <p class="cus-tooltip-text">指定二级路径后，会先判断URL是否符合，然后判断请求传入的参数指定字段是否和预期值相等。</p>
              <Input placeholder="请填写指定字段" v-model="modifyPath"></Input>
              <Input placeholder="请填写字段预期值" v-model="modifyPathEqual" style="margin-top: 5px;"></Input>
              <Button type="primary" size="small" @click.native="submitItem({path: modifyPath, pathEqual: modifyPathEqual})">提交</Button>
            </div>
          </Poptip>
        </div>
      </li>
      <li>
        <span>延时设置</span>
        <div class="cus-list-right">
          <span class="cus-show-value">{{delay || '无延时'}}</span>
          <Poptip placement="right" width="300" v-if="!fromSearch">
            <a href="javascript:void(0)">修改</a>
            <div class="cus-tooltip" slot="content">
              <p class="cus-tooltip-text">延时是指获取数据后延时返回，单位为ms</p>
              <div class="cus-tooltip-oneline">
                <Input-number :min="0" placeholder="延时时长" size="small" v-model="modifyDelay"></Input-number>
                <Button type="primary" size="small" style="margin: 0" @click.native="submitItem({delay: modifyDelay})">提交</Button>
              </div>
            </div>
          </Poptip>
        </div>
      </li>
      <li>
        <span>固定数据</span>
        <div class="cus-list-right">
          <span class="cus-show-value">{{fixedText}}</span>
          <Poptip placement="bottom-end" width="300" v-if="!fromSearch">
            <a href="javascript:void(0)" @click="getSelection">修改</a>
            <div class="cus-tooltip" slot="content">
              <p class="cus-tooltip-text">选择要设置的固定数据</p>
              <div class="cus-radio-group">
                <Radio-group v-model="modifyFixedType" vertical>
                  <Radio label="1">错误</Radio>
                  <Radio label="2">异常</Radio>
                  <Radio label="3">分支</Radio>
                  <Radio label="0">无</Radio>
                </Radio-group>
                <div class="selection-list"> 
                  <Select v-model="modifyFixedWrong" placeholder="错误" class="radio-select"size="small">
                    <Option v-for="item in libList" :value="item._id" :key="item">{{ item.name }}</Option>
                  </Select>
                  <Select v-model="modifyFixedThrow" placeholder="异常" class="radio-select" size="small">
                    <Option v-for="item in throwList" :value="item.value" :key="item">{{ item.label }}</Option>
                  </Select>
                  <Select v-model="modifyFixedBranch" placeholder="分支" class="radio-select" size="small">
                    <Option v-for="item in ModelList" :value="item._id" :key="item">{{ item.name }}</Option>
                  </Select>
                </div>
              </div>
              <Button type="primary" size="small" style="margin: 0" @click.native="submitFixData()">提交</Button>
            </div>
          </Poptip>
        </div>
      </li>
      <!--<li>
        <span>分页数</span>
        <div class="cus-list-right">
          <span class="cus-show-value">{{pageNo || '无分页'}}</span>
          <Poptip placement="right" width="300">
            <a href="javascript:void(0)">修改</a>
            <div class="cus-tooltip" slot="content">
              <p class="cus-tooltip-text">指定分页类型的接口返回的页面个数</p>
              <div class="cus-tooltip-oneline">
                <Input-number :min="0" placeholder="分页数目" size="small" v-model="modifyPageNo"></Input-number>
                <Button type="primary" size="small" style="margin: 0" @click.native="submitItem({'pageNo': modifyPageNo})">提交</Button>
              </div>
            </div>
          </Poptip>
        </div>
      </li>-->
      <li>
        <span>API描述</span>
        <span class="cus-description" :title="description">
          {{description}}
        </span>
      </li>
    </ul>
  </Card>
</template>
<script>
import mixin from '@/mixin/action-api.js'
import { editApiBase, getLib, getApiModel, setApiStatus } from '@/api/api.js'
export default {
  name: 'api-card',
  mixins: [mixin],
  data () {
    return {
      topBarItems: [
        {name: '编辑', type: 'edit', action: 'btnEdit'},
        {name: '删除', type: 'android-remove-circle', action: 'btnDelete'},
        {name: '查看详情', type: 'eye', action: 'btnView'},
      ],
      methodList: [
        {value: 'GET', label: 'GET'},
        {value: 'POST', label: 'POST'},
        {value: 'PUT', label: 'PUT'},
        {value: 'DELETE', label: 'DELETE'},
        {value: 'PATCH', label: 'PATCH'},
      ],
      libList: [],
      ModelList: [],
      throwList: [
        {value: '304', label: '304'},
        {value: '400', label: '400'},
        {value: '404', label: '404'},
        {value: '502', label: '502'},
      ],
      modifyPort: 8080,
      modifyDelay: 0,
      modifyPageNo: 0,
      modifyFixedOutput: '',
      modifyPathEqual: '',
      modifyPath: '',
      modifyFixedType: '',
      modifyFixedWrong: '',
      modifyFixedBranch: '',
      modifyFixedThrow: '',
      modifyUrl: '',
      modifyMethod: '',
      modifyKeys: ['path', 'delay', 'port', 'pageNo', 'pathEqual', 'url', 'method'],
    }
  },
  props: {
    name: {
      type: String,
    },
    id: {
      type: String,
    },
    method: {
      type: String,
    },
    project: {
      type: String,
    },
    url: {
      type: String,
    },
    path: {
      type: String,
    },
    pathEqual: {
      type: String,
    },
    delay: {
      type: Number,
      default: 0,
    },
    fixedOutput: {
      type: Object,
    },
    description: {
      type: String,
    },
    pageNo: {
      type: String,
    },
    fromSearch: {
      type: Boolean,
    },
  },
  watch: {
    'port': function () {
      this.setModifyData()
    },
    'id': function () {
      this.setModifyData()
    },
  },
  computed: {
    proxyText: function () {
      var type = ['本地', '服务器', '混合']
      return type[this.proxyType] || '未知'
    },
    fixedText: function () {
      var type = ['错误', '异常', '分支']
      var ctype = (this.fixedOutput && this.fixedOutput.type !== undefined) ? type[this.fixedOutput.type] : 0
      return ctype ? (ctype + ' ->' + this.fixedOutput.name) : '未设置'
    },
  },
  methods: {
    submitItem (item) {
      item.id = this.id
      editApiBase(item).then(this.afterEdit)
    },
    submitFixData () {
      let type = this.modifyFixedType
      let param = {
        type,
        project: this.project,
        api: this.id,
      }
      param.id = type === '1' ? this.modifyFixedWrong : type === '3' ? this.modifyFixedBranch : undefined
      param.data = type === '2' ? {code: ~~this.modifyFixedThrow} : undefined
      setApiStatus(param).then(this.afterEdit)
    },
    setGData () {
      this.apiInfo.id = this.id
      this.apiInfo.project = this.project
    },
    setModifyData () {
      this.modifyKeys.forEach(key => {
        let mKey = 'modify' + key[0].toUpperCase() + key.slice(1)
        if (this[key] !== undefined) this[mKey] = this[key]
      })
    },
    getSelection () {
      this.getModelList()
      this.getLibList()
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
    getModelList () {
      let param = {
        pageSize: 1000,
        pageNo: 0,
        baseid: this.id,
      }
      getApiModel(param).then(res => {
        if (!res.code) {
          this.ModelList = res.data.list
        }
      })
    },
  },
  mounted () {
    this.setGData()
    this.setModifyData()
  }
}
</script>

<style>
.cus-dw-icon {
  margin-right: 5px!important;
}
.cus-list-db li {
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
.cus-description {
  position: relative;
  max-width: 224px;
  word-break: break-all;
  height: 60px;
  line-height: 20px;
  overflow: hidden;
}
.cus-card-tbar-btn {
  margin-left: 10px;
}
.cus-radio-group {
  display: flex;
  width: 100%;
}
.cus-radio-group .selection-list{
  display: flex;
  flex-direction: column;
}
.cus-radio-group .radio-select{
  display: block;
  margin: 3px 0;
  margin-left: 20px;
}
</style>
