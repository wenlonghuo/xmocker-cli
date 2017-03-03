<template>
  <div>
      
    <md-whiteframe md-elevation="10" class="app-project-show">
      <md-toolbar class="">
        <h1 class="md-title app-toolbar-title">api基础信息 —— {{formModel.apiBase.name}}</h1>
      </md-toolbar>

      <div class="app-project-show-form">
        <md-input-container>
          <label>所属项目</label>
          <md-select name="proj" id="proj" v-model="formModel.apiBase.project" @change="projSelect">
            <md-option v-for="proj in projList" :value="proj._id">{{proj.name}}</md-option>
          </md-select>
          <md-tooltip md-direction="bottom">选择项目后将为该项目添加API, 必选</md-tooltip>
        </md-input-container>

        <md-input-container v-for="form in apiBasicForm" v-if="form.model!='project'">
          <label>{{form.name}}</label>
          <md-input v-model="formModel.apiBase[form.model]"></md-input>
        </md-input-container>
      </div>
       
        <md-button class="md-primary" @click.native="buttonSubmit()">提交</md-button>     
    </md-whiteframe>

    <md-whiteframe v-for="(model, mIndex) in formModel.apiModel" md-elevation="10" class="app-project-show" :key="mIndex">
      <md-toolbar class="">
        <h1 class="md-title app-toolbar-title">api数据定义分支 —— {{model.name}}</h1>
        <span style="flex: 1"></span>
        <md-button class="md-icon-button m-api-add-btn-set" href="javascript:;" @click.native="setAsNow" :data-mIndex="mIndex">
            设为当前值
         </md-button>
         <md-button class="md-icon-button" :data-mIndex="mIndex" @click.native="deleteApiModel">
            删除
         </md-button>
      </md-toolbar>

      <div class="app-project-show-form">
        <md-input-container>
          <label>名称</label>
          <md-input v-model="model.name"></md-input>
          <md-tooltip md-direction="bottom">用于标识该数据的分支，作用不大</md-tooltip>
        </md-input-container>

        <md-input-container>
          <label>判断条件</label>
          <md-input v-model="model.condition"></md-input>
        </md-input-container>

        <md-input-container>
          <label>输入参数模板</label>
          <md-textarea v-model="model.inputParam"></md-textarea>
        </md-input-container>

        <md-input-container>
          <label>输出参数模板</label>
          <md-textarea v-model="model.outputParam"></md-textarea>
        </md-input-container>

        <md-input-container>
          <label>Mock 数据</label>
          <md-textarea v-model="model.data"></md-textarea>
        </md-input-container>

      </div>
       
      <md-button class="md-primary" @click.native="buttonSubmit($event, mIndex)">提交</md-button>     
    </md-whiteframe>
    <div class="m-api-add-button">
      <md-button class="md-accent m-api-add-new" @click.native="buttonAddNew">新建分支</md-button>     
    </div>


    <md-dialog-alert
      :md-content="alertInfo.content"
      md-ok-text="我知道了"
      ref="alertInfo">
    </md-dialog-alert>

    <md-dialog-confirm
      :md-title="confirm.title"
      :md-content-html="confirm.contentHtml"
      :md-ok-text="'确定'"
      :md-cancel-text="'取消'"
      @close="confirmClose"
      ref="confirmDiag">
    </md-dialog-confirm>
  </div>
</template>

<script>
  import tbPagination from '../components/tab-pagination.vue'

  export default {
    name: 'projectList',
    components: {
      tbPagination: tbPagination,
    },
    data: function () {
      return {
        selection: {
          proj: '',
          deleteId: '',
        },
        confirm: {
          title: '删除项目',
          contentHtml: ' ',
          type: 'delete',
        },
        alertInfo: {
          content: ' ',
        },
        pageInfo: {
          total: 0,
          pageNo: 1,
          pageSize: 5,
        },

        formModel: {
          apiBase: {
            _id: '',
            name: '',
            url: '/api',
            project: '',
            method: 'post',
            path: 'func',
            keywords: '',
            description: '',
          },
          apiModel: [{
            _id: '',
            name: '主干',
            condition: '',
            inputParam: '{}',
            outputParam: '{}',
            data: '{}',
          }],
          currentIndex: 0,
          type: 'base',
        },
        apiBasicForm: [
          {name: 'api名称，必填，是用于识别访问的api地址，如 appointmentNotice', model: 'name'},
          {name: 'url，实际请求的url地址，必填，如 /api', model: 'url'},
          {name: '所属项目id', model: 'project'},
          {name: '请求方法，必填，可选POST, GET, DELETE, PUT', model: 'method'},
          {name: 'api识别路径，==""时，请设置api名称==url，其他情况从上传的参数获取，如post参数为：{func: "sss"}，api名称==sss且url相同时返回该api', model: 'path'},
          {name: '关键词', model: 'keywords'},
          {name: 'api具体描述，必填', model: 'description'},

        ],
        projList: [],
      }
    },
    created: function () {
      this.app = this.$resource('', {}, {
        getProj: {
          method: 'GET',
          url: '/mock/getAppProject',
        },
        getApiDetail: {
          method: 'GET',
          url: '/mock/getApiDetail',
        },
        getModel: {
          method: 'GET',
          url: '/mock/getApiModel',
        },
        addBase: {
          method: 'POST',
          url: '/mock/addApiBase',
        },
        addModel: {
          method: 'POST',
          url: '/mock/addApiModel',
        },
        editBase: {
          method: 'PUT',
          url: '/mock/editApiBase',
        },
        editModel: {
          method: 'PUT',
          url: '/mock/editApiModel',
        },
        deleteBase: {
          method: 'DELETE',
          url: '/mock/deleteApiBase',
        },
        deleteModel: {
          method: 'DELETE',
          url: '/mock/deleteApiModel',
        },
        setApi: {
          method: 'PUT',
          url: '/mock/setApiStatus',
        },
      })
    },
    mounted: function () {
      this.getProjectList().then(function () {
        this.getApiInfo()
      })
    },
    methods: {
      // 服务器交互
      getProjectList: function () {
        var param = {
          pageSize: 2000,
          pageNo: 0,
        }
        return this.app.getProj(param).then(function (data) {
          data = data.data
          if (data.code) {
            this.alert(data.err)
            return
          }
          // 设置到数据中
          this.projList = data.data.list
          let last = window.localStorage.getItem('api-select-proj')
          if (last && data.data.list.find((p) => { return p._id === last })) {
            this.formModel.apiBase.project = last
          }
        })
      },
      projSelect: function (e) {
        window.localStorage.setItem('api-select-proj', e)
      },
      // 获取信息
      getApiInfo: function (option) {
        var id = this.$route.params.id
        if (!id) return
        var param = {id: id}
        return this.app.getApiDetail(param).then(function (r) {
          var data = r.data
          if (data.code) {
            this.alert(data.err)
            return
          }
          if (data.data.base && data.data.base[0]) {
            this.dealModelResult(data.data.model)
            this.formModel.apiBase = data.data.base[0]
            this.formModel.apiModel = data.data.model || []
          }
        })
      },
      submitApiBase: function () {
        var param = this.formModel.apiBase
        let req
        param.id = this.formModel.apiBase._id
        if (!param._id) {
          req = this.app.addBase(param)
        } else {
          req = this.app.editBase(param)
        }
        req.then((res) => {
          var data = res.data
          if (data.code) {
            this.alert(data.err)
            return
          }
          data = data.data

          this.formModel.apiBase = this.copyObj(this.formModel.apiBase, data.result)
          if (data.tip) this.alert(data.tip)
        })
        return req
      },
      submitApiModel: function (index) {
        var param = this.formModel.apiModel[index]
        if (!param) return
        param.baseid = this.formModel.apiBase._id
        param.id = param._id

        param.inputParam = this.formatJSONString(param.inputParam)
        param.outputParam = this.formatJSONString(param.outputParam)
        param.data = this.formatJSONString(param.data)
        let req
        if (!param._id) {
          req = this.app.addModel(param)
        } else {
          req = this.app.editModel(param)
        }
        req.then((res) => {
          var data = res.data
          if (data.code) {
            this.alert(data.err)
            return
          }
          data = data.data
          this.dealModelResult(data.result)
          this.formModel.apiModel[index] = this.copyObj(this.formModel.apiModel[index], data.result)
          if (data.tip) this.alert(data.tip)
        })
        return req
      },
      // 删除项目
      deleteModel: function () {
        var deleteItem = this.formModel.apiModel[this.formModel.currentIndex]

        var param = {
          id: deleteItem._id,
        }
        return this.app.deleteModel(param).then(function (data) {
          data = data.data
          this.alert(data.err || data.data.tip)
          if (!data.code) this.formModel.apiModel.splice(this.formModel.currentIndex, 1)
        })
      },

      deleteApiModel: function (e) {
        var mIndex = e.target.getAttribute('data-mIndex')
        if (mIndex == null) return
        this.formModel.currentIndex = mIndex
        if (!this.formModel.apiModel[mIndex]._id) {
          this.alert('该条目尚未录入系统')
          return
        }
        this.formModel.type = 'delete'
        this.confirm.contentHtml = '是否删除api分支？'
        this.confirm.title = '删除api分支'
        this.confirm.type = 'delete'

        this.$refs['confirmDiag'].open()
      },

      setAsNow: function (e) {
        var mIndex = e.target.getAttribute('data-mIndex')
        if (mIndex == null) return

        var item = this.formModel.apiModel[mIndex]
        if (!item) return

        var data = item.data
        if (!data) return
        try {
          data = JSON.parse(data)
          data = data[0]
        } catch (e) {
          return
        }

        this.app.setApi({id: this.formModel.apiBase._id, type: 'fixed', data: data}).then(function (data) {
          data = data.data
          this.alert(data.err || data.data.tip)
        })
      },

      //
      buttonSubmit: function (e, mIndex) {
        this.confirm.type = 'operation'
        this.confirm.type = 'modify'
        if (mIndex != null) {
          this.formModel.type = 'model'
          this.formModel.currentIndex = mIndex
          this.confirm.contentHtml = '是否提交api分支？'
          this.confirm.title = '提交api分支'
        } else {
          this.formModel.type = 'base'
          this.confirm.contentHtml = '是否提交api基础信息？'
          this.confirm.title = '提交api基础信息'
        }
        this.$refs['confirmDiag'].open()
      },
      buttonAddNew: function () {
        this.formModel.apiModel.push({
          _id: '',
          name: '',
          condition: '',
          inputParam: '',
          outputParam: '',
          data: '',
        })
      },
      // 提示
      alert: function (msg) {
        this.$set(this.alertInfo, 'content', msg)
        // this.alertInfo.content = msg
        this.$refs['alertInfo'].open()
      },

      closeDialog: function (ref) {
        this.$refs[ref].close()
      },

      confirmClose: function (e) {
        if (e === 'ok') {
          if (this.confirm.type === 'delete') {
            this.deleteModel()
          } else {
            var type = this.formModel.type
            var index = this.formModel.currentIndex
            if (type === 'base') {
              this.submitApiBase()
            } else if (type === 'model') {
              this.submitApiModel(index)
            }
          }
        }
      },
      catchError: function (data) {
        this.alert('网络错误，请稍后重试')
      },
      copyObj: function (to, from) {
        for (var f in from) {
          to[f] = typeof f === 'object' ? this.copyObj(to[f] || {}, from[f]) : from[f]
        }
        return to
      },
      formatJSONString: function (str) {
        var obj
        try {
          obj = new Function('return ' + str + '')()
        } catch (e) {
          console.log(e)
          return
        }
        return JSON.stringify(obj)
      },
      prettyJSON: function (obj) {
        return JSON.stringify(obj, null, 4)
      },
      dealModelResult: function (models) {
        if (Object.prototype.toString.call(models) !== '[object Array]') {
          models = [models]
        }
        models.forEach((model) => {
          model.inputParam = this.prettyJSON(model.inputParam)
          model.outputParam = this.prettyJSON(model.outputParam)
          model.data = this.prettyJSON(model.data)
        })
      },
    },
  }
</script>

<style>
  .app-toolbar {}
  
  .app-input-search {
    position: fixed;
    top: 64px;
    left: 30%;
    padding: 0 30px;
    width: 40%;
    background-color: white;
    z-index: 1;
    box-shadow: 0 3px 5px #666666;
    border-radius: 3px;
  }
  
  .app-project-show {
    margin: 20px auto;
    max-width: 1000px;
    text-align: center;
  }
  
  .app-project-show-form {
    padding: 0 40px;
    
  }
  .m-project-card {
    max-width: 1200px;
    margin: 0 auto;
  }
  .m-api-add-button {
    display: flex;
    width: 100%;
    text-align: center;
  }
  .m-api-add-new{
    margin: 0 auto;
  }
  .md-button.m-api-add-btn-set {
    width: 100px;
  }
</style>