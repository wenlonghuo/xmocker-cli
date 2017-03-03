<template>
  <div>
   
    <md-whiteframe md-elevation="10" class="app-project-show">
      <md-toolbar class="">
        <h1 class="md-title app-toolbar-title">基础信息管理</h1>
      </md-toolbar>

      <div class="app-project-show-form">
        <md-input-container>
          <label>远程地址</label>
          <md-input v-model="model.remoteAddress"></md-input>
        </md-input-container>

        <md-input-container>
          <label>远程登录用户名</label>
          <md-input v-model="model.remoteName"></md-input>
        </md-input-container>

        <md-input-container>
          <label>远程登录密码</label>
          <md-input v-model="model.remotePassword"></md-input>
        </md-input-container>

        <md-input-container>
          <label>系统管理端口</label>
          <md-input v-model="model.managePort"></md-input>
        </md-input-container>

        <md-input-container>
          <label>默认项目</label>
          <md-select name="proj" id="proj" v-model="model.defaultProject">
            <md-option v-for="proj in projList" :value="proj._id">{{proj.name}}</md-option>
          </md-select>
        </md-input-container>
      </div>
       
      <md-button class="md-primary" @click.native="buttonSubmit($event)">提交</md-button>     
    </md-whiteframe>


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
        model: {
          remoteAddress: '',
          remoteName: '',
          remotePassword: '',
          managePort: '',
          defaultProject: '',
        },
        projList: [],
      }
    },
    created: function () {
      this.app = this.$resource('', {}, {
        getProj: {
          method: 'GET',
          url: '/mock/getAppProject',
        },
        getAppBase: {
          method: 'GET',
          url: '/mock/getAppBase',
        },
        editBase: {
          method: 'PUT',
          url: '/mock/editAppBase',
        },
      })
    },
    mounted: function () {
      this.getProjectList().then(function () {
        this.getAppInfo()
      })
      document.onkeydown = (e) => {
        if (e.ctrlKey && e.keyCode === 83) {
          this.buttonSubmit()
          return false
        }
      }
    },
    destroyed () {
      document.onkeydown = null
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
        })
      },
      // 获取信息
      getAppInfo: function (option) {
        return this.app.getAppBase().then(function (r) {
          var data = r.data
          if (data.code) {
            this.alert(data.err)
            return
          }
          if (data.data.result) {
            this.copyObj(this.model, data.data.result)
          }
        })
      },
      submitAppBase: function () {
        var param = this.model
        let req = this.app.editBase(param)
        req.then((res) => {
          var data = res.data
          if (data.code) {
            this.alert(data.err)
            return
          }
          data = data.data

          this.copyObj(this.model, data.result)
          if (data.tip) this.alert(data.tip)
        })
        return req
      },

      //
      buttonSubmit: function (e, mIndex) {
        this.confirm.contentHtml = '是否提交app基础信息？'
        this.confirm.title = '提交api基础信息'
        this.$refs['confirmDiag'].open()
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
          this.submitAppBase()
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
  .m-api-add-button {
    width: 100%;
    text-align: center;
    display: flex
  }
  .m-api-add-new{
    margin: 0 auto;
  }
</style>