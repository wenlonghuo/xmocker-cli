<template>
  <div>
    <md-table-card v-show="!showProj" class="m-project-card">
      <md-toolbar class="md-medium">
        <h1 class="md-title app-toolbar-title">项目列表</h1>

        <md-button class="md-icon-button" @click.native="dealProject($event, 'add')">
          <md-icon>add</md-icon>
        </md-button>
          
        <md-button class="md-icon-button  md-warn" @click.native="openDiag">
          <md-icon>clear</md-icon>
        </md-button>

        <md-button class="md-icon-button" @click.native="controlProjectStatus($event, 1)">
          <md-icon>play_arrow</md-icon>
        </md-button>

        <md-button class="md-icon-button md-warn" @click.native="controlProjectStatus($event, 0)">
          <md-icon>stop_arrow</md-icon>
        </md-button>

        <md-button class="md-icon-button" @click.native="buttonSearch">
          <md-icon>search</md-icon>
        </md-button>
      </md-toolbar>

      <md-table @select="selectTable" id="mytable">
        <md-table-header>
          <md-table-row>
            <md-table-head class="m-min-width">状态</md-table-head>
            <md-table-head>名称</md-table-head>
            <md-table-head md-tooltip="项目路径，请根据计算机上实际路径修改">项目路径</md-table-head>
            <md-table-head class="m-min-width" md-tooltip="请求的API端口">端口</md-table-head>
            <md-table-head class="m-min-width">&nbsp;管理</md-table-head>
          </md-table-row>
        </md-table-header>

        <md-table-body>
          <md-table-row v-for="(row, rowIndex) in list" :key="rowIndex" :md-item="row" :data-item="row._id" md-auto-select md-selection>
            <md-table-cell>
              <md-icon class="md-primary m-inline" v-if="row.status">lightbulb_outline</md-icon>
              <md-icon class="m-inline" v-else>lightbulb_outline</md-icon>
            </md-table-cell>
            <md-table-cell>
              <span>{{ row.name }}</span>
            </md-table-cell>
            <md-table-cell><span>{{ row.path }}</span></md-table-cell>
            <md-table-cell><span>{{ row.port }}</span>
            </md-table-cell>
            <md-table-cell>
              <md-button class="md-icon-button">
                <md-icon @click.native="buttonEdit" :data-id="row._id">edit</md-icon>
              </md-button>

            </md-table-cell>
          </md-table-row>
        </md-table-body>
      </md-table>


      <tb-pagination
        :md-size="pageInfo.pageSize"
        :md-total="pageInfo.total"
        :md-page="pageInfo.pageNo"
        md-label="每页条数"
        md-separator="of"
        :md-page-options="[10, 25, 50]"
        @pagination="getProject"
      ></tb-pagination>
    </md-table-card>

    <md-whiteframe md-elevation="10" v-if="showProj" class="app-project-show">
      <md-toolbar class="md-dense" md-theme="md-menu">
        <h1 class="md-title app-toolbar-title" style="flex:1;text-align: left;" v-html="proj.title"></h1>

        <md-button class="md-icon-button" @click.native="cancelVal('showProj')">
          取消
        </md-button>
      </md-toolbar>

      <div class="app-project-show-form">
         <md-input-container>
          <label>项目名称</label>
          <md-input type="text" v-model="proj.model.name"></md-input>
        </md-input-container>

        <md-input-container>
          <label>成员组成</label>
          <md-textarea v-model="proj.model.member"></md-textarea>
        </md-input-container>


        <md-input-container>
          <label>项目路径</label>
          <md-input v-model="proj.model.path"></md-input>
        </md-input-container>


        <md-input-container>
          <label>访问端口</label>
          <md-input v-model="proj.model.port"></md-input>
        </md-input-container>

        <md-input-container>
          <label>错误消息配置</label>
          <md-textarea v-model="proj.model.error"></md-textarea>
        </md-input-container>

        <md-input-container>
          <label>随机值重复次数</label>
          <md-input v-model="proj.model.repeatTime"></md-input>
        </md-input-container>

        <md-input-container>
          <label>代理</label>
          <md-textarea v-model="proj.model.proxyTable"></md-textarea>
        </md-input-container>

        <md-input-container>
          <label>常用url列表</label>
          <md-textarea v-model="proj.model.urls"></md-textarea>
        </md-input-container>

        <md-input-container>
          <label>静态资源路径</label>
          <md-textarea v-model="proj.model.staticPath"></md-textarea>
        </md-input-container>

        <md-input-container>
          <label>gulp配置</label>
          <md-textarea v-model="proj.model.gulp"></md-textarea>
        </md-input-container>


        <md-input-container>
          <label>webpack配置</label>
          <md-textarea v-model="proj.model.webpack"></md-textarea>
        </md-input-container>
      </div>
       
        <md-button class="md-primary" @click.native="submitProject">提交</md-button>     
    </md-whiteframe>


    <div class="app-input-search" v-show="showSearch">
      <md-input-container >
        <label>可输入项目名称或项目成员</label>
        <md-input placeholder="搜索" type="search" ></md-input>
      </md-input-container>
    </div>


    <md-dialog-alert
      :md-content="alertInfo.content"
      md-ok-text="我知道了"
      ref="alertInfo">
    </md-dialog-alert>

    <md-dialog-confirm
      :md-title="deleteInfo.title"
      :md-content-html="deleteInfo.contentHtml"
      :md-ok-text="'确定'"
      :md-cancel-text="'取消'"
      @close="deleteDiagClose"
      ref="deleteDiag">
    </md-dialog-confirm>
  </div>
</template>

<script>
  import tbPagination from '../components/tab-pagination.vue'

  var errorMsg = JSON.stringify({code: -1, codeDesc: '${msg}', codeDescUser: '${msg}'}, null, 2)

  var jsonKeys = ['gulp', 'webpack', 'error', 'urls', 'proxyTable', 'staticPath']

  function projItem () {
    return {
      name: '',
      member: '',
      path: '',
      port: '',
      error: errorMsg,
      repeatTime: 2,
      proxyTable: '[]',
      staticPath: '[]',
      urls: '[]',
      gulp: '{}',
      webpack: '{}',
    }
  }

  export default {
    name: 'projectList',
    components: {
      tbPagination: tbPagination,
    },
    data: function () {
      return {
        showSearch: false,
        showProj: false,
        list: [

        ],
        selectedItem: [],
        proj: {
          type: 'add',
          title: '新增项目',
          model: {
            _id: '',
            ...projItem(),
          },
        },
        deleteInfo: {
          title: '删除项目',
          contentHtml: ' ',
        },
        alertInfo: {
          content: ' ',
        },
        pageInfo: {
          total: 0,
          pageNo: 1,
          pageSize: 10,
        },
      }
    },
    created: function () {
      this.app = this.$resource('', {}, {
        get: {
          method: 'GET',
          url: '/mock/getAppProject',
        },
        add: {
          method: 'POST',
          url: '/mock/addAppProject',
        },
        edit: {
          method: 'PUT',
          url: '/mock/editAppProject',
        },
        delete: {
          method: 'DELETE',
          url: '/mock/deleteAppProject',
        },
        start: {
          method: 'PUT',
          url: '/mock/startAppProject',
        },
        stop: {
          method: 'PUT',
          url: '/mock/stopAppProject',
        },
      })
    },
    mounted: function () {
      this.getProject()
    },
    methods: {
      // 服务器交互
      // 获取信息
      getProject: function (option) {
        if (option) {
          this.pageInfo.pageNo = option.page
          this.pageInfo.pageSize = option.size
        }
        var param = {
          pageSize: this.pageInfo.pageSize,
          pageNo: this.pageInfo.pageNo - 1,
        }

        return this.app.get(param).then(function (res) {
          var data = res.data
          if (data.code) {
            this.alert(data.err)
            return
          }
          // 设置到数据中
          this.dealModelResult(data.data.list)
          this.list = data.data.list
          this.pageInfo = {
            total: data.data.pagination.total,
            pageNo: data.data.pagination.pageNo + 1,
            pageSize: param.pageSize,
          }
        })
      },
      // 添加项目
      addProject: function () {
        var param = this.copyObj({}, this.proj.model)
        this.formatEachKey(param, this.formatJSONString, jsonKeys)
        if (this.alertKeys(param)) return
        return this.app.add(param)
      },
      // 编辑项目
      editProject: function () {
        var param = this.copyObj({}, this.proj.model)
        this.formatEachKey(param, this.formatJSONString, jsonKeys)
        if (this.alertKeys(param)) return
        param.error = param.error || undefined
        param.id = param._id
        return this.app.edit(param)
      },
      // 删除项目
      deleteProject: function (ids) {
        var param = {
          id: ids,
        }
        return this.app.delete(param)
      },
      startProject: function (ids) {
        var param = {
          id: ids,
        }
        return this.app.start(param)
      },
      stopProject: function (ids) {
        var param = {
          id: ids,
        }
        return this.app.stop(param)
      },

      // 提示
      alert: function (msg) {
        this.$set(this.alertInfo, 'content', msg)
        // this.alertInfo.content = msg
        this.$refs['alertInfo'].open()
      },
      alertKeys (param) {
        var names = []
        jsonKeys.forEach((key) => {
          if (!param[key]) names.push(key)
        })
        if (names.length) {
          this.alert(names.join(',') + '必须为对象或数组格式')
          return true
        }
      },
      selectTable: function (e) {

      },
      // 搜索按钮点击显示
      buttonSearch: function (e) {
        this.showSearch = true
      },
      closeDialog: function (ref) {
        this.$refs[ref].close()
      },
      // 删除弹窗
      openDiag: function (ref) {
        var inlineItems = this.getSelected()
        var itemArr = []

        if (!inlineItems.length) {
          this.alert('请至少选择一个项目')
          return
        }

        for (var i = 0; i < inlineItems.length; i++) {
          itemArr.push('&nbsp;' + (i + 1) + '. ' + inlineItems[i].name)
        }

        this.deleteInfo.contentHtml = '是否删除以下条目？<br/>' + itemArr.join('<br/>')
        this.$refs['deleteDiag'].open()
      },
      deleteDiagClose: function (e) {
        if (e === 'ok') {
          var ids = this.selectedItem.map(function (item) {
            return item._id
          })

          this.deleteProject(ids.join(',')).then(function (data) {
            data = data.data
            this.getProject()
            this.alert(data.err || data.data.tip)
          }).catch(this.catchError)
        }
      },
      controlProjectStatus: function (e, type) {
        var inlineItems = this.getSelected()
        var ids = inlineItems.map(function (item) {
          return item._id
        })
        var req
        if (type) {
          req = this.startProject(ids.join(','))
        } else {
          req = this.stopProject(ids.join(','))
        }
        req.then(function (data) {
          data = data.data
          this.getProject()
          this.alert(data.err || data.data.tip)
        }).catch(this.catchError)
      },
      // 编辑或新增操作
      dealProject: function (e, type) {
        if (type === 'add') {
          this.$set(this.proj, 'type', 'add')
          this.$set(this.proj, 'title', '新增项目')
          this.proj.model = projItem()
        } else if (type === 'edit') {
          this.$set(this.proj, 'type', 'edit')
          this.$set(this.proj, 'title', '编辑项目')
        }
        this.showProj = true
      },
      cancelVal: function (name) {
        this[name] = false
      },
      // 编辑或新增后提交
      submitProject: function (e) {
        var result
        if (this.proj.type === 'add') {
          result = this.addProject()
        } else if (this.proj.type === 'edit') {
          result = this.editProject()
        }
        if (result) {
          result.then(function (data) {
            data = data.data
            if (!data.code) {
              this.showProj = false
            }
            this.getProject()
            if (data.err) this.alert(data.err)
          }).catch(this.catchError)
        }
      },
      // 编辑按钮事件
      buttonEdit: function (e) {
        var id = e.target.getAttribute('data-id')
        if (!id) return
        let r = this.list.find(function (li) {
          return li._id === id
        })
        if (!r) return
        this.proj.model = r
        this.dealProject(e, 'edit')
      },
      catchError: function (data) {
        this.alert('网络错误，请稍后重试')
      },
      getSelected: function () {
        var query = document.querySelectorAll('#mytable table tbody tr.md-selected')
        var inlineItems = []
        var list = this.list
        for (var i = 0; i < query.length; i++) {
          var item = query[i]
          var _id = item.getAttribute('data-item') || ''
          var p = list.find(function (l) {
            return l._id === _id
          })
          if (p) {
            inlineItems.push(p)
          }
        }

        this.selectedItem = inlineItems
        return inlineItems
      },

      dealModelResult: function (models) {
        if (Object.prototype.toString.call(models) !== '[object Array]') {
          models = [models]
        }
        models.forEach((model) => {
          this.formatEachKey(model, this.prettyJSON, jsonKeys)
          model.error = model.error || errorMsg
        })
      },
      formatEachKey (obj, func, keys) {
        keys.forEach((key) => {
          obj[key] = func.call(this, obj[key])
        })
      },
    },
  }
</script>

<style>
  .app-toolbar {}
  
  .app-input-search {
    width: 40%;
    position: fixed;
    top: 64px;
    left: 30%;
    z-index: 1;
    background-color: white;
    padding: 0 30px;
    box-shadow: 0 3px 5px #666666;
    border-radius: 3px;
  }
  
  .app-project-show {
    margin: 20px auto;
    text-align: center;
    max-width: 1000px;
  }
  
  .app-project-show-form {
    padding: 0 40px;
    
  }
  .m-project-card {
    max-width: 1200px;
    margin: 0 auto;
  }
  .m-inline {
    margin: 0;
  }
  .md-table .md-table-cell.md-has-action .md-table-cell-container {
    justify-content: flex-start;
  }
  .m-min-width {
    width: 60px;
  }
</style>