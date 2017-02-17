<template>
  <div>
    <div class="m-api-list-speeddial">
      <md-button class="md-fab md-primary" @click.native="chooseProj">
        <md-icon>swap_horiz</md-icon>
        <md-tooltip md-direction="top">切换项目</md-tooltip>
      </md-button>
      <md-button class="md-fab md-primary" @click.native="showSearch">
        <md-icon>search</md-icon>
        <md-tooltip md-direction="top">搜索</md-tooltip>
      </md-button>
      <md-button class="md-fab md-primary" href="/#/apiAdd">
        <md-icon>add</md-icon>
        <md-tooltip md-direction="top">添加API</md-tooltip>
      </md-button>
      <md-button class="md-fab md-primary" @click.native="buttonNav($event, -1)">
        <md-icon>navigate_before</md-icon>
        <md-tooltip md-direction="top">上一页</md-tooltip>
      </md-button>
      <md-button class="md-fab md-primary" @click.native="buttonNav($event, 1)">
        <md-icon>navigate_next</md-icon>
        <md-tooltip md-direction="top">下一页</md-tooltip>
      </md-button>
    </div>

    <div class="m-api-list-search" v-if="show.search">
      <md-input-container>
        <md-icon class="md-warn">
          search
        </md-icon>
        <label>输入关键字进行搜索</label>
        <md-input type="search" v-model="selection.search" @change="inputSearch"></md-input>
      </md-input-container>
    </div>

    <div class="m-api-list-choose-proj" v-if="show.proj">
      <div class="m-api-list-choose-proj-box">
        <h3>切换项目</h3>
        <md-list @click.native="setSelectionVal">
          <md-list-item class="m-api-list-selection" href="javascript:;" v-for="proj in projList" :data-id="proj._id" :data-name="proj.name">
            <md-icon class="md-primary" v-show="selection.proj === proj._id">check</md-icon>
            <span>{{proj.name}}</span>
          </md-list-item>
        </md-list>
      </div>
    </div>

    <div class="m-api-card-list">
      <h1 class="md-title app-toolbar-title">API列表 -- {{selection.projName}}</h1>
      <md-card md-with-hover v-for="item in apiList" class="m-api-list">
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">{{item.name}}</div>
            <div class="md-subhead">{{item.method.toUpperCase()}} --> {{item.url}}</div>
          </md-card-header-text>
        </md-card-header>
        <md-card-area md-inset>

          <md-card-content>
            {{item.description}}
          </md-card-content>
        </md-card-area>
        <md-card-content class="m-api-card-list-buttons">
          <md-icon class="darkIcon">settings</md-icon>
          <md-button-toggle md-single class="md-button-group">
            <md-button @click.native="buttonSetApi($event, item._id, 'clear')">
              清除
              <md-tooltip md-direction="top">清除设置api的默认项，如错误、随机和固定值</md-tooltip>
            </md-button>
            <md-button @click.native="buttonSetApi($event, item._id, 'error')">
              错误
              <md-tooltip md-direction="top">设置api当前值为错误值</md-tooltip>
            </md-button>
            <md-button @click.native="buttonSetApi($event, item._id, 'random')">
              随机
              <md-tooltip md-direction="top">设置api当前值为随机值</md-tooltip>
            </md-button>
          </md-button-toggle>
        </md-card-content>

        <md-card-actions>
          
          <md-button class="md-icon-button" @click.native="buttonCopyApi($event, item._id)">
            <md-icon>content_copy</md-icon>
            <md-tooltip md-direction="top">复制到其他项目</md-tooltip>
          </md-button>
          <md-button class="md-icon-button" @click.native="buttondeleteApi($event, item)">
            <md-icon>delete</md-icon>
            <md-tooltip md-direction="top">删除</md-tooltip>
          </md-button>
          <md-button class="md-icon-button" @click.native="buttonEditApi($event, item._id)">
            <md-icon>mode_edit</md-icon>
            <md-tooltip md-direction="top">编辑</md-tooltip>
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
        
      <md-button class="md-primary" @click.native="buttonCloseCopy">关闭</md-button>
      <md-button class="md-primary" @click.native="buttonSubmitCopy">提交</md-button>
      </md-whiteframe>
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
    name: 'api-list',
    data: function(){
      return {
        selection: {
          proj:'',
          projName: '',
          deleteId: '',
          copyApi: [],
          copyProj: [],
          search: '',
        },
        show: {
          copy: false,
          proj: false,
          search: false,
        },
        projList: [

        ],
        apiList: [],
        pageInfo: {
          total: 0,
          pageNo: 0,
          pageSize: 10,
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
        search: {
          method: 'GET',
          url: '/mock/searchApiBase'
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
        },
        setApi: {
          method: 'PUT',
          url: '/mock/setApiStatus'
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
          var id = this.$route.params.id || window.localStorage.getItem('api-list-proj-id') || this.projList[0]._id
          this.selection.proj = id;
          var proj = this.projList.find(function(p){return p._id === id});
          if(proj)this.selection.projName = proj.name
          if(this.selection.proj)this.getApiList();
        });
      },

      getApiList: function(){
        var param = {
          project: this.selection.proj,
          pageSize: this.pageInfo.pageSize,
          pageNo: this.pageInfo.pageNo
        };
        var q =  this.$route.query || {};
        if (q.name) {
          param.name = q.name
        }
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

      searchApi: function(words){
        var param = {
          project: this.selection.proj,
          words: words,
          pageSize: 2000,
          pageNo: 0
        };
        if(!words) {
          this.getApiList()
          return;
        }
        return this.app.search(param).then(function(data){
          data = data.data;
          if (data.code) {
            this.alert(data.err);
            return;
          }
          // 设置到数据中
          this.apiList = data.data.list;
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

      buttonSetApi: function(e, id, type){
        this.app.setApi({type: type, id: id}).then(function (data) {
          data = data.data;
          if (data.code) {
            this.alert(data.err);
            return;
          }
        })
      },

      showSearch: function (e) {
        this.show.search = !this.show.search
      },

      inputSearch: function(e){
        this.searchApi(e)
      },
      chooseProj: function () {
        this.show.proj = true
      },

      setSelectionVal: function(e){
        var item = this.getParentNode(e.target, 'm-api-list-selection')
        var id = item.getAttribute('data-id')
        if(id) {
          this.selection.proj = id
          this.selection.projName = item.getAttribute('data-name')
          window.localStorage.setItem('api-list-proj-id', id)
          this.buttonSelectProj()
          this.show.proj = false
        }
      },

      getParentNode: function (node, cname) {
        var p = node
        var classname = p.className
        while(p && classname.indexOf(cname) < 0) {
          p = p.parentNode
          classname  = p.className || ''
        }
        return p
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
  position: absolute;
  width: 150px;
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
  padding: 10px 80px 10px 10px;

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

.m-api-list-speeddial {
  position: fixed;
  top: 50%;
  right: 10px;
  margin-top: -150px;
  width: 80px;
  height: 300px;
  z-index: 2;
}
.m-api-list-choose-proj {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
  background-color: white;
  display: flex;
  align-items: center;
}
.m-api-list-choose-proj-box {
 margin: 0 auto;
 display: inline-block;
 width: 300px;
 overflow-x: hidden;
 padding: 20px 20px;
 overflow-y: auto;
 border: 1px solid #efefef;
 background-color: white;
}
.m-api-list-search {
  position: fixed;
  top: 64px;
  left: 0;
  width: 100%;
  padding: 10px 50px;
  box-shadow: 0px 2px 5px 1px #aeaeae;
  background-color: white;
  z-index: 4;
}
.m-api-list-search .md-input-container {
  margin-bottom: 2px;
}

.m-api-card-list-buttons {
  display: flex;
}

.darkIcon {
  margin: 8px;
  color: rgba(0, 0, 0, .54) !important;
}
</style>