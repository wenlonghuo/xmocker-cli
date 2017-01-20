<template>
  <div>
    <md-whiteframe md-elevation="1" class="app-project-show m-api-title">
      <div class="field-group">
         <h1 class="md-title app-toolbar-title">api列表</h1>

        <md-input-container class="m-choose-project">
          <label>切换项目</label>
          <md-select name="proj" id="proj" v-model="selection.proj" @change="buttonSelectProj">
            <md-option v-for="proj in projList" :value="proj._id">{{proj.name}}</md-option>
          </md-select>
        </md-input-container>
      </div>
       
         
    </md-whiteframe>
    <div class="m-api-card-list">
      <md-card md-with-hover v-for="item in apiList" class="m-api-list">
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">{{item.name}}</div>
            <div class="md-subhead">{{item.method.toUpperCase()}} --> {{item.url}}</div>
          </md-card-header-text>
        </md-card-header>
          
        <md-card-content>
          {{item.description}}
        </md-card-content>

        <md-card-actions>
          <md-button class="md-icon-button" @click="buttonCopyApi($event, item._id)">
            <md-icon>content_copy</md-icon>
          </md-button>
          <md-button class="md-icon-button" @click="buttondeleteApi($event, item)">
            <md-icon>delete</md-icon>
          </md-button>
          <md-button class="md-icon-button" @click="buttonEditApi($event, item._id)">
            <md-icon>mode_edit</md-icon>
          </md-button>
        </md-card-actions>
      </md-card>
    </div>
    <div class="m-api-move-module" v-if="show.copy">
      <md-whiteframe md-elevation="5" class="m-api-move-module-box">
        <h2>复制api到项目</h2>
        <div class="m-api-move-module-choose">

            <div class="m-api-move-api">
              <md-table-card>
                <md-table @select="selectApi">
                  <md-table-header>
                    <md-table-row>
                      <md-table-head>选择api</md-table-head>
                    </md-table-row>
                  </md-table-header>

                  <md-table-body>
                    <md-table-row v-for="(row, rowIndex) in apiList" :key="rowIndex" :md-item="row" md-auto-select md-selection>
                      <md-table-cell>
                        {{ row.name }}
                      </md-table-cell>
                    </md-table-row>
                  </md-table-body>
                </md-table>
              </md-table-card>
            </div>

            <div class="m-api-move-project">
              <md-table-card>
                <md-table @select="selectProj">
                  <md-table-header>
                    <md-table-row>
                      <md-table-head>选择项目</md-table-head>
                    </md-table-row>
                  </md-table-header>

                  <md-table-body>
                    <md-table-row v-for="(row, rowIndex) in projList" :key="rowIndex" :md-item="row" md-auto-select md-selection>
                      <md-table-cell>
                        {{ row.name }}
                      </md-table-cell>
                    </md-table-row>
                  </md-table-body>
                </md-table>
              </md-table-card>
            </div>
        </div>
        
      <md-button class="md-primary" @click="buttonCloseCopy">关闭</md-button>
      <md-button class="md-primary" @click="buttonSubmitCopy">提交</md-button>
      </md-whiteframe>
    </div>
      
    <md-bottom-bar class="m-api-change-page">
      <md-bottom-bar-item md-icon="navigate_before"  @click.native="buttonNav($event, -1)">上一页</md-bottom-bar-item>
      <md-bottom-bar-item md-icon="navigate_next" md-active @click.native="buttonNav($event, 1)">下一页</md-bottom-bar-item>
    </md-bottom-bar>

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
    name: 'api-list',
    data: function(){
      return {
        selection: {
          proj:'',
          deleteId: '',
          copyApi: [],
          copyProj: []
        },
        show: {
          copy: false,
        },
        projList: [

        ],
        apiList: [],
        pageInfo: {
          total: 0,
          pageNo: 0,
          pageSize: 20,
        },
        confirm: {
          title: '删除api',
          contentHtml: ' ',
          type: 'delete'
        },
        alertInfo: {
          content: ' ',
        },
      }
    },
    computed: {
      
    },
    mounted: function(){
      this.app = this.$resource('', {}, {
        get: {
          method: 'GET',
          url: '/mock/getApiBase'
        },
        delete: {
          method: 'DELETE',
          url: '/mock/deleteApiBase'
        },
        copyApi: {
          method: 'PUT',
          url: '/mock/copyApi'
        },
        getProj: {
          method: 'GET',
          url: '/mock/getAppProject'
        }
      });
      this.getProjectList()
    },
    methods:{
      getProjectList: function(){
        var param = {
          pageSize: 2000,
          pageNo: 0
        };
        return this.app.getProj(param).then(function(data){
          data = data.data;
          if (data.code) {
            this.alert(data.err);
            return;
          }
          // 设置到数据中
          this.projList = data.data.list;
          this.selection.proj = this.$route.params.id || this.projList[0]._id;
          if(this.selection.proj)this.getApiList();
        });
      },

      getApiList: function(){
        var param = {
          project: this.selection.proj,
          pageSize: this.pageInfo.pageSize,
          pageNo: this.pageInfo.pageNo
        };
        return this.app.get(param).then(function(data){
          data = data.data;
          if (data.code) {
            this.alert(data.err);
            return;
          }
          // 设置到数据中
          this.apiList = data.data.list;
          this.pageInfo.total = data.data.pagination.total;
        });
      },

      // 删除项目
      deleteModel: function(ids) {
        var param = {
          id: ids
        };
        return this.app.delete(param).then(function(data){
          data = data.data;
          this.alert(data.err || data.data.tip);
          this.getApiList()
        });
      },

      // 删除项目
      copyApi: function() {
        var from = [];
        for(var key in this.selection.copyApi){
          from.push(this.selection.copyApi[key]._id)
        }
        var to = [];
        for(var key in this.selection.copyProj){
          to.push(this.selection.copyProj[key]._id)
        }
        var param = {
          from: from.join(','),
          to: to.join(','),
        };
        return this.app.copyApi(param).then(function(data){
          data = data.data;
          this.alert(data.err || data.data.tip);
          this.getApiList()
        });
      },

      buttonNav: function(e, type){
        var pageInfo = this.pageInfo;
        pageInfo.pageNo += ~~type;
        if(pageInfo.pageNo < 0){
          pageInfo.pageNo = 0;
          return;
        }
        if(pageInfo.total > (pageInfo.pageNo * pageInfo.pageSize)){
          this.getApiList()
        }else {
          pageInfo.pageNo --;
        }
      },
      buttonSelectProj: function(){
        this.$router.replace({name: 'api-list', params: {id: this.selection.proj}})
        this.pageInfo.pageNo = 0;
        this.getApiList();
      },

      buttondeleteApi: function(e, item){
        this.selection.deleteId = item._id;
        this.confirm.title = '删除api'
        this.confirm.type = 'delete'
        this.confirm.contentHtml = '是否删除api ' + item.name + ', id:' + item._id;
        this.$refs['confirmDiag'].open();
      },
      buttonEditApi: function(e, id){
        this.$router.push({name: 'api-add', params: {id: id}})
      },

      buttonCopyApi: function(e, id){
        this.show.copy = true;
        console.log(id)
      },

      buttonSubmitCopy: function(e){
        this.confirm.title = '复制api'
        this.confirm.type = 'copy'
        this.confirm.contentHtml = '是否复制api到项目中';
        this.$refs['confirmDiag'].open();
      },

      buttonCloseCopy: function(){
        this.show.copy = false;
      },

       // 提示
      alert: function(msg) {
        this.$set(this.alertInfo, 'content', msg);
        // this.alertInfo.content = msg
        this.$refs['alertInfo'].open();
      },
     
      confirmClose: function(e){
        if(e == 'ok'){
          if(this.confirm.type === 'delete'){
            if(this.selection.deleteId)this.deleteModel(this.selection.deleteId);
          }else {
            this.copyApi();
          }
        }
      },
      catchError: function(data) {
        this.alert('网络错误，请稍后重试');
      },

      selectApi: function(e){
        this.selection.copyApi = e;
      },
      selectProj: function(e){
        this.selection.copyProj = e;
      }
    },
  }
</script>

<style>
.field-group {
  position: relative;
  width: 100%;
  min-height: 60px;
}
.m-choose-project {
  display: inline-block;
  width: 150px;
  position: absolute;
  right: 20px;
  bottom:0;
}
.m-api-change-page {
  position: absolute;
  width: 300px;
  min-width: 300px;
  margin: 0 -150px;
  left: 50%;
  bottom: 0;
  text-align: center;
  border-radius: 5px;
}
.m-api-title {
  width: 100%;
}
.m-api-list {
  display: inline-block;
  min-width: 350px;
  max-width: 500px;
  max-height: 400px; 
  overflow: hidden;
  margin: 20px;
  text-align: justify;
}
.m-api-card-list {
  width: 100%;
  display: block;
  text-align: center;
  padding-bottom: 60px;
}
.m-api-move-module {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 1);
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.m-api-move-module-box {
  display: inline-block;
}
.m-api-move-api, .m-api-move-project {
  width: 300px;
  height: 400px;
  overflow: auto;
  display: inline-block;
  margin: 20px 30px;
  text-align: justify;
  /*border: 1px solid #fefefe;*/
}
</style>