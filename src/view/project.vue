<template>
  <div>
    <md-table-card v-show="!showProj">
      <md-toolbar class="md-medium">
        <h1 class="md-title app-toolbar-title">项目列表</h1>

        <md-button class="md-icon-button" @click="dealProject($event, 'add')">
          <md-icon>add</md-icon>
        </md-button>
          
         <md-button class="md-icon-button  md-warn" @click="openDiag">
          <md-icon>clear</md-icon>
        </md-button>


        <md-button class="md-icon-button" @click="buttonSearch">
          <md-icon>search</md-icon>
        </md-button>
      </md-toolbar>

      <md-table @select="selectTable">
        <md-table-header>
          <md-table-row>
            <md-table-head>名称</md-table-head>
            <md-table-head md-tooltip="项目路径，请根据计算机上实际路径修改">项目路径</md-table-head>
            <md-table-head md-tooltip="请求的API端口">端口</md-table-head>
            <md-table-head>&nbsp;管理</md-table-head>
          </md-table-row>
        </md-table-header>

        <md-table-body>
          <md-table-row v-for="(row, rowIndex) in list" :key="rowIndex" :md-item="row" md-auto-select md-selection>
            <md-table-cell>{{ row.name }}</md-table-cell>
            <md-table-cell>{{ row.path }}</md-table-cell>
            <md-table-cell>{{ row.port }}</md-table-cell>
            <md-table-cell>
              <md-button class="md-icon-button" @click="buttonEdit" :data-id="row._id">
                <md-icon>edit</md-icon>
              </md-button>
            </md-table-cell>
          </md-table-row>
        </md-table-body>
      </md-table>


      <md-table-pagination
        md-size="5"
        md-total="10"
        md-page="1"
        md-label="Rows"
        md-separator="of"
        :md-page-options="[5, 10, 25, 50]"
        @pagination="onPagination">
      </md-table-pagination>
    </md-table-card>

    <md-whiteframe md-elevation="10" v-if="showProj" class="app-project-show">
      <md-toolbar class="md-dense" md-theme="md-menu">
        <h1 class="md-title app-toolbar-title" style="flex:1;text-align: left;" v-html="proj.title"></h1>

        <md-button class="md-icon-button" @click="cancelVal('showProj')">
          取消
        </md-button>
      </md-toolbar>

      <div class="app-project-show-form">
         <md-input-container>
          <label>项目名称</label>
          <md-input v-model="proj.model.name"></md-input>
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
          <label>gulp路径</label>
          <md-input v-model="proj.model.gulp.path"></md-input>
        </md-input-container>


        <md-input-container>
          <label>webpack路径</label>
          <md-input v-model="proj.model.webpack.path"></md-input>
        </md-input-container>
      </div>
       
        <md-button class="md-primary" @click="submitProject">提交</md-button>     
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
  export default {
    name: 'projectList',
    data: function(){
      return {
        list: [
          {name: 'ss', path: 'sss', port: 80},
          {name: 'ss', path: 'sss', port: 22}
        ],
        showSearch: false,
        deleteInfo: {
          title: '删除项目',
          contentHtml: ' ',
        },
        selectedItem: [],
        alertInfo: {
          content: ' ',
        },
        proj: {
          type: "add",
          title: "新增项目",
          model: {
            _id: '',
            name: '',
            member: '',
            path: '',
            port: '',
            gulp: {
              path: ''
            },
            webpack:  {
              path: ''
            },
          }
        },
        showProj: false,
      };
    },

    mounted: function(){
      this.getProject();
    },
    methods: {
      // 服务器交互
      getProject: function(){
        var param = {};
        return this.$http.get('/mock/getAppProject', param).then(function(res){
          var data = res.data;
          if(data.code){
            this.alert(data.err);
            return;
          }
          this.list = data.data.list;
        });
      },

      editProject: function(){
        var model = this.proj.model;
        var param = {
          id: model._id,
          name: model.name,
          member: model.member.split(','),
          path: model.path,
          port: model.port,
          gulp: {path: model.gulpPath},
          webpack: {path: model.webpack}
        };
        return this.$http.put('/mock/editAppProject', param);
      },

      addProject: function(){
        var model = this.proj.model;
        var param = {
          name: model.name,
          member: model.member.split(','),
          path: model.path,
          port: model.port,
          gulp: {path: model.gulpPath},
          webpack: {path: model.webpack}
        };

        return this.$http.post('/mock/addAppProject', param);
      },

      deleteProject: function(){
        var param = {};
        return this.$http.delete('/mock/deleteAppProject', param);
      },

      alert: function(msg){
        this.alertInfo.content = msg
        this.$refs['alertInfo'].open();
      },

      onPagination: function(e){
        console.log(e);
      },
      selectTable: function(e){
        this.showSearch = false;
        this.selectedItem = e;
      },
      buttonSearch: function(e){
        this.showSearch = true;
      },
      openDiag: function(ref){
        var items = this.selectedItem, itemArr = [];
        var keys = Object.keys(items);
        
        if(!keys.length){
          this.$refs['alertInfo'].open();
          return;
        }

        for(var i=0; i<keys.length; i++){
          itemArr.push('&nbsp;' + (i+1) + '. ' +items[keys[i]].name);
        }
        
        this.deleteInfo.contentHtml = "是否删除以下条目？<br/>" + itemArr.join('<br/>');
        this.$refs['deleteDiag'].open();
      },
      closeDialog: function(ref){
        this.$refs[ref].close();
      },
      deleteDiagClose: function(e){
        console.log(e);
      },

      dealProject: function(e, type){
        if(type ==='add'){
          this.proj.type === 'add';
          this.proj.title === '新增项目';
          this.proj.model = {
            id: '',
            name: '',
            member: '',
            path: '',
            port: '',
            gulp: {
              path: '',
            },
            webpack:  {
              path: '',
            },
          };

        }else if(type === 'edit'){
          this.proj.type === 'edit';
          this.proj.title === '编辑项目';
        }
        this.showProj = true;
      },
      cancelVal: function(name){
        this[name] = false;
      },
      submitProject: function(e){
        this.addProject();
      },

      buttonEdit: function(e){
        var id = e.target.getAttribute('data-id');
        if(!id)return;
        let r = this.list.find(function(li){
          return li._id === id;
        });
        if(!r)return;
        this.proj.model = r;
        this.dealProject(e, 'edit')
      },
    }
  }
</script>

<style>
  .app-toolbar {
    
  }
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
    margin: 20px 40px;
    text-align: center;
  }

  .app-project-show-form {
    padding: 0 40px;
  }
</style>