<template>
  <Card class="api-card-simple" :bordered="false">
    <h3 :title="name">{{name}}</h3>
    <Icon class="cus-close-icon" type="md-close-circle" color="DarkGray" @click.native="btnAction('btnDelete')"></Icon>
    <ul class="cus-list-db">
      <li>
        <span class="cus-small url-type" :class="method">{{method}}</span>
        <span class="cus-small">{{url}}</span>
      </li>
      <li>
        <span class="cus-small">
          介绍
        </span>
        <span class="cus-small cus-description" :title="description">
          {{description}}
        </span>
      </li>

      <li>
        <span class="cus-small">
          修改
        </span>
        <span class="cus-small">
          {{timer(mt)}}
        </span>
      </li>
      <li style="margin-top: 10px;">
          <ButtonGroup>
            <Button type="text" size="small" @click.native="shareApi">上传</Button>
            <Button type="text" size="small" @click.native="getSelection">固定</Button>
            <Button type="text" size="small" @click.native="btnAction('btnEdit')">编辑</Button>

          </ButtonGroup>
      </li>
    </ul>
  </Card>
</template>
<script>
import mixin from '@/mixin/action-api.js'
import { editApiBase, setApiStatus } from '@/api/api.js'
export default {
  name: 'api-card',
  mixins: [mixin],
  data () {
    return {
      methodList: [
        {value: 'GET', label: 'GET'},
        {value: 'POST', label: 'POST'},
        {value: 'PUT', label: 'PUT'},
        {value: 'DELETE', label: 'DELETE'},
        {value: 'PATCH', label: 'PATCH'},
      ],
      libList: [],
      ModelList: [],
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
    mt: {
      type: Number,
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
      type: [Number, String],
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
    getSelection () {
      this.$emit('setFix', {id: this.id})
    },
    shareApi () {
      this.$emit('shareApi', this.id)
    },
  },
  mounted () {
    this.setGData()
  }
}
</script>

<style scoped>
.api-card-simple .cus-list-db {
  margin-top: 8px;
}
.api-card-simple .cus-list-db>li {
  display: block;
}
.api-card-simple .cus-list-db>li>span {
  display: inline-block;
  vertical-align: middle;
}
.api-card-simple .cus-list-db>li>span:first-child {
  margin-right: 1em;
  width: 3em;
}
.api-card-simple .cus-list-db>li>span:last-child {
  width: calc(100% - 5em)
}
.api-card-simple .cus-list-db .url-type{
  color: LightSeaGreen;
}
.api-card-simple .cus-list-db .url-type.POST{
  color: DeepSkyBlue;
}
.api-card-simple .cus-list-db .url-type.PUT{
  color: DarkOrchid;
}
.api-card-simple .cus-list-db .url-type.DELETE{
  color: FireBrick;
}

.api-card-simple .cus-description {
  font-size: 12px;
  position: relative;
  word-break: break-all;
  height: 20px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.api-card-simple .cus-small {
  font-size: 12px;
}

.api-card-simple {
  height: 160px;
  width: 350px;
  background-color:AliceBlue;
}
.api-card-simple h3{
  position: relative;
  white-space: nowrap;
  height: 20px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cus-close-icon {
  position: absolute;
  right: 14px;
  top: 18px;
  cursor: pointer;
}
</style>
