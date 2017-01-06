<template>
  <div>
      <md-toolbar class="md-medium">
        <h1 class="md-title app-toolbar-title">项目列表</h1>

        <md-button class="md-icon-button" @click="dealProject($event, 'add')">
          <md-icon>add</md-icon>
        </md-button>
          
        <md-button class="md-icon-button  md-warn" @click="openDiag">
          <md-icon>clear</md-icon>
        </md-button>

        <md-button class="md-icon-button" @click="">
          <md-icon>play_arrow</md-icon>
        </md-button>

        <md-button class="md-icon-button md-warn" @click="">
          <md-icon>stop_arrow</md-icon>
        </md-button>

        <md-button class="md-icon-button" @click="buttonSearch">
          <md-icon>search</md-icon>
        </md-button>
      </md-toolbar>
    <md-whiteframe md-elevation="10" v-if="showProj" class="app-project-show">
      

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

  export default {
    name: 'projectList',
    components: {
      tbPagination: tbPagination
    },
    data: function() {
      return {
        showSearch: false,
        showProj: false,
        list: [

        ],
        selectedItem: [],
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
            webpack: {
              path: ''
            },
          }
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
          pageSize: 5,
        },
      };
    },
    created: function() {
      this.app = this.$resource('', {}, {
        get: {
          method: 'GET',
          url: '/mock/getAppProject'
        },
        add: {
          method: 'POST',
          url: '/mock/addAppProject'
        },
        edit: {
          method: 'PUT',
          url: '/mock/editAppProject'
        },
        delete: {
          method: 'DELETE',
          url: '/mock/deleteAppProject'
        },
      });
    },
    mounted: function() {
      this.getProject();
    },
    methods: {
      // 服务器交互
      // 获取信息
      getProject: function(option) {
        if (option) {
          console.log(option);
          this.pageInfo.pageNo = option.page;
          this.pageInfo.pageSize = option.size;
        }
        var param = {
          pageSize: this.pageInfo.pageSize,
          pageNo: this.pageInfo.pageNo - 1
        };

        return this.app.get(param).then(function(res) {
          var data = res.data;
          if (data.code) {
            this.alert(data.err);
            return;
          }
          // 设置到数据中
          this.list = data.data.list;
          this.pageInfo = {
            total: data.data.pagination.total,
            pageNo: data.data.pagination.pageNo + 1,
            pageSize: param.pageSize
          };
        });
      },
      // 添加项目
      addProject: function() {
        var model = this.proj.model;
        var param = {
          name: model.name,
          member: model.member.split(','),
          path: model.path,
          port: model.port,
          gulp: {
            path: model.gulp.path
          },
          webpack: {
            path: model.webpack.path
          }
        };

        return this.app.add(param);
      },
      // 编辑项目
      editProject: function() {
        var model = this.proj.model;
        var param = {
          id: model._id,
          name: model.name,
          member: model.member.split(','),
          path: model.path,
          port: model.port,
          gulp: {
            path: model.gulp.path
          },
          webpack: {
            path: model.webpack.path
          }
        };
        return this.app.edit(param);
      },
      // 删除项目
      deleteProject: function(ids) {
        var param = {
          id: ids
        };
        return this.app.delete(param);
      },
      // 提示
      alert: function(msg) {
        this.$set(this.alertInfo, 'content', msg);
        // this.alertInfo.content = msg
        this.$refs['alertInfo'].open();
      },
      
      selectTable: function(e) {
        
      },
      // 搜索按钮点击显示
      buttonSearch: function(e) {
        this.showSearch = true;
      },
      closeDialog: function(ref) {
        this.$refs[ref].close();
      },
      // 删除弹窗
      openDiag: function(ref) {
        var query = document.querySelectorAll('#mytable table tbody tr.md-selected');
        var inlineItems = [], itemArr = [];
        var list = this.list;
        query.forEach(function(item) {
          var _id = item.getAttribute('data-item') || '';
          var p = list.find(function(l) {
              return l._id === _id
            });
          if (p) {
            inlineItems.push(p)
          }
        });

        if (!inlineItems.length) {
          this.alert('请至少选择一个项目');
          return;
        }

        this.selectedItem = inlineItems;

        for (var i = 0; i < inlineItems.length; i++) {
          itemArr.push('&nbsp;' + (i + 1) + '. ' + inlineItems[i].name);
        }

        this.deleteInfo.contentHtml = "是否删除以下条目？<br/>" + itemArr.join('<br/>');
        this.$refs['deleteDiag'].open();
      },
      deleteDiagClose: function(e) {
        if (e === 'ok') {
          var ids = this.selectedItem.map(function(item) {
            return item._id
          });

          this.deleteProject(ids.join(',')).then(function(data) {
            data = data.data;
            this.getProject();
            this.alert(data.err || data.data.tip);
          }).catch(this.catchError);
        }
      },
      // 编辑或新增操作
      dealProject: function(e, type) {
        if (type === 'add') {
          this.$set(this.proj, 'type', 'add');
          this.$set(this.proj, 'title', '新增项目');
          this.proj.model = {
            id: '',
            name: '',
            member: '',
            path: '',
            port: '',
            gulp: {
              path: '',
            },
            webpack: {
              path: '',
            },
          };

        } else if (type === 'edit') {
          this.$set(this.proj, 'type', 'edit');
          this.$set(this.proj, 'title', '编辑项目');
        }
        this.showProj = true;
      },
      cancelVal: function(name) {
        this[name] = false;
      },
      // 编辑或新增后提交
      submitProject: function(e) {
        var result;
        if (this.proj.type === 'add') {
          result = this.addProject();
        } else if (this.proj.type === 'edit') {
          result = this.editProject();
        }
        result.then(function(data) {
          data = data.data;
          if (!data.code) {
            this.showProj = false;
          }
          this.getProject();
          if (data.err) this.alert(data.err);
        }).catch(this.catchError);
      },
      // 编辑按钮事件
      buttonEdit: function(e) {
        var id = e.target.getAttribute('data-id');
        if (!id) return;
        let r = this.list.find(function(li) {
          return li._id === id;
        });
        if (!r) return;
        this.proj.model = r;
        this.dealProject(e, 'edit')
      },
      catchError: function(data) {
        this.alert('网络错误，请稍后重试');
      }
    }
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
</style>