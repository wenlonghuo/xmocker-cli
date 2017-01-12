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
            <div class="md-subhead">{{item.method.toUpperCase()}} -- {{item.url}}</div>
          </md-card-header-text>
        </md-card-header>
          
        <md-card-content>
          {{item.description}}
        </md-card-content>

        <md-card-actions>
          <md-button @click="buttondeleteApi($event, item)">删除</md-button>
          <md-button @click="buttonEditApi($event, item._id)">编辑</md-button>
        </md-card-actions>
      </md-card>
    </div>
      
    <md-bottom-bar class="m-api-change-page">
      <md-bottom-bar-item md-icon="navigate_before"  @click="buttonNav($event, -1)">上一页</md-bottom-bar-item>
      <md-bottom-bar-item md-icon="navigate_next" md-active @click="buttonNav($event, 1)">下一页</md-bottom-bar-item>
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
          deleteId: ''
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
          this.selection.proj = this.projList[0]._id;
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
        this.pageInfo.pageNo = 0;
        this.getApiList();
      },

      buttondeleteApi: function(e, item){
        this.selection.deleteId = item._id;
        this.confirm.contentHtml = '是否删除api ' + item.name + ', id:' + item._id;
        this.$refs['confirmDiag'].open();
      },
      buttonEditApi: function(e, id){
        this.$router.push({name: 'api-add', params: {id: id}})
      },

       // 提示
      alert: function(msg) {
        this.$set(this.alertInfo, 'content', msg);
        // this.alertInfo.content = msg
        this.$refs['alertInfo'].open();
      },
     
      confirmClose: function(e){
        if(e == 'ok'){
          if(this.selection.deleteId)this.deleteModel(this.selection.deleteId);
        }
      },
      catchError: function(data) {
        this.alert('网络错误，请稍后重试');
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
  width: 300px;
  max-height: 300px; 
  margin: 20px;
  text-align: justify;
}
.m-api-card-list {
  width: 100%;
  display: block;
  text-align: center;
}
</style>