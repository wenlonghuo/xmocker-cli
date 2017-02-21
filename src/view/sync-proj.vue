<template>
  <div>
    <div class="m-sync-proj-behind m-sync-list">
      <md-card md-with-hover v-for="item in projList.behind" class="m-sync-card">
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">{{item.client.name}}</div>
            <div class="md-subhead">{{item.client.port}} --> {{item.client.path}}</div>
          </md-card-header-text>
        </md-card-header>
          
        <md-card-content>
          本项目修改时间落后于服务端。项目成员有：{{item.client.member}}
        </md-card-content>

        <md-card-actions>
          <md-button class="md-icon-button" @click.native="buttonDownLoadBase($event, item.client)">
            <md-icon>file_download</md-icon>
          </md-button>
          <md-button class="md-icon-button" @click.native="buttonUpload($event, item.client)">
            <md-icon>file_upload</md-icon>
          </md-button>
          <md-button class="md-icon-button" @click.native="buttonEditApi($event, item.client)">
            <md-icon>folder_open</md-icon>
          </md-button>
        </md-card-actions>
      </md-card>
    </div>

    <div class="m-sync-proj-serverside m-sync-list">
      <md-card md-with-hover v-for="item in projList.serverSide" class="m-sync-card">
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">{{item.server.name}}</div>
            <div class="md-subhead">{{item.server.port}} --> {{item.server.path}}</div>
          </md-card-header-text>
        </md-card-header>
          
        <md-card-content>
          本项目仅存于服务端。项目成员有：{{item.server.member}}
        </md-card-content>

        <md-card-actions>
          <md-button class="md-icon-button" @click.native="buttonDownLoadAll($event, item.server)">
            <md-icon>file_download</md-icon>
          </md-button>
        </md-card-actions>
      </md-card>
    </div>

<!-- 领先-->
    <div class="m-sync-proj-ahead m-sync-list">
      <md-card md-with-hover v-for="item in projList.ahead" class="m-sync-card">
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">{{item.client.name}}</div>
            <div class="md-subhead">{{item.client.port}} --> {{item.client.path}}</div>
          </md-card-header-text>
        </md-card-header>
          
        <md-card-content>
          本项目修改时间领先于服务端。项目成员有：{{item.client.member}}
        </md-card-content>

        <md-card-actions>
          <md-button class="md-icon-button" @click.native="buttonDownLoadBase($event, item.client)">
            <md-icon>file_download</md-icon>
          </md-button>
          <md-button class="md-icon-button" @click.native="buttonUpload($event, item.client)">
            <md-icon>file_upload</md-icon>
          </md-button>
          <md-button class="md-icon-button" @click.native="buttonEditApi($event, item.client)">
            <md-icon>folder_open</md-icon>
          </md-button>
        </md-card-actions>
      </md-card>
    </div>

<!-- 客户端仅有-->
    <div class="m-sync-proj-client m-sync-list">
      <md-card md-with-hover v-for="item in projList.clientSide" class="m-sync-card">
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">{{item.client.name}}</div>
            <div class="md-subhead">{{item.client.port}} --> {{item.client.path}}</div>
          </md-card-header-text>
        </md-card-header>
          
        <md-card-content>
          本项目仅存于客户端。项目成员有：{{item.client.member}}
        </md-card-content>

        <md-card-actions>
          <md-button class="md-icon-button" @click.native="buttonDownLoadBase($event, item.client)">
            <md-icon>file_download</md-icon>
          </md-button>
        </md-card-actions>
      </md-card>
    </div>    

<!-- 未变化项目 -->
    <div class="m-sync-proj-unchanged m-sync-list">
      <md-card md-with-hover v-for="item in projList.unchanged" class="m-sync-card">
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">{{item.client.name}}</div>
            <div class="md-subhead">{{item.client.port}} --> {{item.client.path}}</div>
          </md-card-header-text>
        </md-card-header>
          
        <md-card-content>
          和服务器端相同。项目成员有：{{item.client.member}}
        </md-card-content>

        <md-card-actions>
          <md-button class="md-icon-button" @click.native="buttonDownLoadBase($event, item.client)">
            <md-icon>file_download</md-icon>
          </md-button>
          <md-button class="md-icon-button" @click.native="buttonUpload($event, item.client)">
            <md-icon>file_upload</md-icon>
          </md-button>
          <md-button class="md-icon-button" @click.native="buttonEditApi($event, item.client)">
            <md-icon>folder_open</md-icon>
          </md-button>
        </md-card-actions>
      </md-card>
    </div>   

<!-- 其他 -->
    <div class="m-sync-proj-untaged m-sync-list">
      <md-card md-with-hover v-for="item in projList.untaged" class="m-sync-card">
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">{{item.client.name}}</div>
            <div class="md-subhead">{{item.client.port}} --> {{item.client.path}}</div>
          </md-card-header-text>
        </md-card-header>
          
        <md-card-content>
          本项目信息未知。项目成员有：{{item.client.member}}
        </md-card-content>

        <md-card-actions>
          <md-button class="md-icon-button" @click.native="buttonDownLoadBase($event, item.client)">
            <md-icon>file_download</md-icon>
          </md-button>
          <md-button class="md-icon-button" @click.native="buttonUpload($event, item.client)">
            <md-icon>file_upload</md-icon>
          </md-button>
          <md-button class="md-icon-button" @click.native="buttonEditApi($event, item.client)">
            <md-icon>folder_open</md-icon>
          </md-button>
        </md-card-actions>
      </md-card>
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
  export default {
    name: 'sync-proj',
    data: function () {
      return {
        selection: {},
        show: {
          copy: false,
        },
        projList: [],
        apiList: [],
        pageInfo: {
          total: 0,
          pageNo: 0,
          pageSize: 20,
        },
        confirm: {
          title: '删除api',
          contentHtml: ' ',
          type: 'delete',
        },
        alertInfo: {
          content: ' ',
        },
      }
    },
    computed: {

    },
    mounted: function () {
      this.app = this.$resource('', {}, {
        get: {
          method: 'GET',
          url: '/mock/clientGetProjDiff',
        },
        downBase: {
          method: 'PUT',
          url: '/mock/clientDownLoadProjBase',
        },
        downAll: {
          method: 'PUT',
          url: '/mock/clientDownLoadProj',
        },
      })
      this.getProjectList()
    },
    methods: {
      getProjectList: function () {
        var param = {

        }
        return this.app.get(param).then(function (data) {
          data = data.data
          if (data.code) {
            this.alert(data.err)
            return
          }
          // 设置到数据中
          this.projList = data.data
        })
      },

      downLoadBase: function () {
        var param = {
          id: this.selection.client._uid,
        }
        return this.app.downBase(param).then(function (data) {
          data = data.data
          if (data.code) {
            this.alert(data.err)
            return
          }
          this.alert(data.data.tips)
        })
      },

      downLoadAll: function (e, server) {
        var param = {
          id: this.selection.client._uid,
        }
        return this.app.downAll(param).then(function (data) {
          data = data.data
          if (data.code) {
            this.alert(data.err)
            return
          }
          this.alert(data.data.tips)
        })
      },

      buttonUpload: function (e, clientInfo) {

      },

      buttonEditApi: function (e, clientInfo) {
        this.$router.push({name: 'sync-api', params: {id: clientInfo._uid}, query: {name: clientInfo.name}})
      },

      buttonDownLoadBase: function (e, client) {
        this.selection.client = client
        this.confirm.title = '下载项目基础信息'
        this.confirm.func = 'downLoadBase'
        this.confirm.contentHtml = '是否从服务端下载项目： ' + client.name + ', id:' + client._id
        this.$refs['confirmDiag'].open()
      },

      buttonDownLoadAll: function (e, client) {
        this.selection.client = client
        this.confirm.title = '下载服务器项目'
        this.confirm.func = 'downLoadAll'
        this.confirm.contentHtml = '是否从服务端下载项目： ' + client.name + ', id:' + client._id
        this.$refs['confirmDiag'].open()
      },

      buttonOpen: function (e) {

      },

       // 提示
      alert: function (msg) {
        this.$set(this.alertInfo, 'content', msg)
        // this.alertInfo.content = msg
        this.$refs['alertInfo'].open()
      },

      confirmClose: function (e) {
        if (e === 'ok') {
          if (this[this.confirm.func]) {
            this[this.confirm.func]()
          }
        }
      },
      catchError: function (data) {
        this.alert('网络错误，请稍后重试')
      },
    },
  }
</script>

<style>
.field-group {
  position: relative;
  width: 100%;
  min-height: 60px;
}

.m-sync-title {
  width: 100%;
}
.m-sync-card {
  display: inline-block;
  min-width: 350px;
  max-width: 500px;
  max-height: 400px; 
  overflow: hidden;
  margin: 20px;
  text-align: justify;
}
.m-sync-list {
  width: 100%;
  display: block;
  text-align: center;
  padding-bottom: 10px;
}

</style>