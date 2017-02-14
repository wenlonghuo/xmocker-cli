<template>
  <div>
    <div class="m-sync-api">
      <md-whiteframe md-elevation="5" class="m-sync-api-box">
        <h2>同步api : {{projName}}</h2>
        <div class="m-sync-api-module-choose">

            <div class="m-sync-api-behind" v-if="apiList.behind && apiList.behind.length">
              <md-table-card>
                <md-table @select="selectApi($event, 'behind')">
                  <md-table-header>
                    <md-table-row>
                      <md-table-head>滞后于服务端</md-table-head>
                    </md-table-row>
                  </md-table-header>

                  <md-table-body>
                    <md-table-row v-for="(row, rowIndex) in apiList.behind" :key="rowIndex" :md-item="row.client" md-auto-select md-selection>
                      <md-table-cell>
                        {{ row.client.base.name }}
                      </md-table-cell>
                    </md-table-row>
                  </md-table-body>
                </md-table>
              </md-table-card>
            </div>
<!-- server-->
            <div class="m-sync-api-server" v-if="apiList.serverSide && apiList.serverSide.length">
              <md-table-card>
                <md-table @select="selectApi($event, 'server')">
                  <md-table-header>
                    <md-table-row>
                      <md-table-head>服务端新增</md-table-head>
                    </md-table-row>
                  </md-table-header>

                  <md-table-body>
                    <md-table-row v-for="(row, rowIndex) in apiList.serverSide" :key="rowIndex" :md-item="row.server" md-auto-select md-selection>
                      <md-table-cell>
                        {{ row.server.base.name }}
                      </md-table-cell>
                    </md-table-row>
                  </md-table-body>
                </md-table>
              </md-table-card>
            </div>

<!-- ahead-->
            <div class="m-sync-api-ahead" v-if="apiList.ahead && apiList.ahead.length">
              <md-table-card>
                <md-table @select="selectApi($event, 'ahead')">
                  <md-table-header>
                    <md-table-row>
                      <md-table-head>领先于服务端</md-table-head>
                    </md-table-row>
                  </md-table-header>

                  <md-table-body>
                    <md-table-row v-for="(row, rowIndex) in apiList.ahead" :key="rowIndex" :md-item="row.client" md-auto-select md-selection>
                      <md-table-cell>
                        {{ row.client.base.name }}
                      </md-table-cell>
                    </md-table-row>
                  </md-table-body>
                </md-table>
              </md-table-card>
            </div>

<!-- client-->
            <div class="m-sync-api-client" v-if="apiList.clientSide && apiList.clientSide.length">
              <md-table-card>
                <md-table @select="selectApi($event, 'client')">
                  <md-table-header>
                    <md-table-row>
                      <md-table-head>客户端独有</md-table-head>
                    </md-table-row>
                  </md-table-header>

                  <md-table-body>
                    <md-table-row v-for="(row, rowIndex) in apiList.clientSide" :key="rowIndex" :md-item="row.client" md-auto-select md-selection>
                      <md-table-cell>
                        {{ row.client.base.name }}
                      </md-table-cell>
                    </md-table-row>
                  </md-table-body>
                </md-table>
              </md-table-card>
            </div>

<!-- unchanged-->
            <div class="m-sync-api-unchanged" v-if="apiList.unchanged && apiList.unchanged.length">
              <md-table-card>
                <md-table @select="selectApi($event, 'unchanged')">
                  <md-table-header>
                    <md-table-row>
                      <md-table-head>无变化</md-table-head>
                    </md-table-row>
                  </md-table-header>

                  <md-table-body>
                    <md-table-row v-for="(row, rowIndex) in apiList.unchanged" :key="rowIndex" :md-item="row.client" md-auto-select md-selection>
                      <md-table-cell>
                        {{ row.client.base.name }}
                      </md-table-cell>
                    </md-table-row>
                  </md-table-body>
                </md-table>
              </md-table-card>
            </div>


<!-- untaged-->
            <div class="m-sync-api-untaged" v-if="apiList.untaged && apiList.untaged.length">
              <md-table-card>
                <md-table @select="selectApi($event, 'untaged')">
                  <md-table-header>
                    <md-table-row>
                      <md-table-head>其他</md-table-head>
                    </md-table-row>
                  </md-table-header>

                  <md-table-body>
                    <md-table-row v-for="(row, rowIndex) in apiList.untaged" :key="rowIndex" :md-item="row.client" md-auto-select md-selection>
                      <md-table-cell>
                        {{ row.client.base.name }}
                      </md-table-cell>
                    </md-table-row>
                  </md-table-body>
                </md-table>
              </md-table-card>
            </div>

        </div>
        
      <md-button class="md-primary" @click="buttonUpload">上传选中api</md-button>
      <md-button class="md-primary" @click="buttonDownload">下载选中api</md-button>
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
    name: 'sync-api',
    data: function(){
      return {
        selection: {},

        apiList: {
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
      projName: function(){
        return this.$route.query.name
      }
    },
    mounted: function(){
      this.app = this.$resource('', {}, {
        getApi: {
          method: 'GET',
          url: '/mock/clientGetApiDiff'
        },
        downApi: {
          method: 'PUT',
          url: '/mock/clientDownLoadApi'
        },
      });
      this.getApiList()
    },
    methods:{
      getApiList: function(){
        let id = this.$route.params.id;
        var param = {
          id: id
        };
        return this.app.getApi(param).then(function(data){
          data = data.data;
          if (data.code) {
            this.alert(data.err);
            return;
          }
          // 设置到数据中
          this.apiList = data.data;
        });
      },

      // 下载api
      downloadApi: function() {
        let apis = this.selection.list;
        apis = apis.map(function(a){return a.base._uid}).join(',');
        let id = this.$route.params.id;
        var param = {
          ids: apis,
          project: id,
        };
        return this.app.downApi(param).then(function(data){
          data = data.data;
          this.alert(data.err || data.data.tips);
        });
      },

      selectApi: function(e, name){
        this.selection[name] = e;
      },

      buttonDownload: function(e){
        this.setList();
        this.confirm.title = '下载api'
        this.confirm.type = "download"
        this.confirm.contentHtml = '是否下载api ' + this.selection.list.map(function(a){return a.base.name + ', uid:' + a.base._uid}).join('<br/>');
        this.$refs['confirmDiag'].open();
      },

       buttonUpload: function(e){
        
      },

      setList: function(){
        var list = ['behind', 'server', 'ahead', 'unchanged', 'untaged'];
        var selection = this.selection;
        selection.list = [];
        list.forEach(function(tag){
          var data = selection[tag] || [];
          for(var index in data) {
            selection.list.push(data[index]);
          }
        })
      },
  

       // 提示
      alert: function(msg) {
        this.$set(this.alertInfo, 'content', msg);
        // this.alertInfo.content = msg
        this.$refs['alertInfo'].open();
      },
     
      confirmClose: function(e){
        if(e == 'ok'){
          if(this.confirm.type === 'download'){
            this.downloadApi();
          }else if(this.confirm.type === 'upload'){

          }
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

.m-sync-api {
  background: rgba(255, 255, 255, 1);
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.m-sync-api-box {
  display: inline-block;
}
.m-sync-api-behind, 
  .m-sync-api-server,
  .m-sync-api-ahead,
  .m-sync-api-client,
  .m-sync-api-unchanged,
  .m-sync-api-untaged {
  width: 300px;
  height: 400px;
  overflow: auto;
  display: inline-block;
  margin: 20px 30px;
  text-align: justify;
  /*border: 1px solid #fefefe;*/
}

</style>