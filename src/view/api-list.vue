<template>
  <div>
    <md-card md-with-hover v-for="item in apiList">
      <md-card-header>
        <div class="md-title">{{item.name}}</div>
        <div class="md-subhead">{{item.method}}--{{item.keyword.join(',')}}</div>
      </md-card-header>
        {{item.description}}
      <md-card-content>
        
      </md-card-content>

      <md-card-actions>
        <md-button>删除</md-button>
        <md-button>编辑</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
  export default {
    name: 'api-list',
    data: function(){
      return {
        projList: [

        ],
        apiList: [],
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
        add: {
          method: 'POST',
          url: '/mock/addApiBase'
        },
        edit: {
          method: 'PUT',
          url: '/mock/editApiBase'
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
      this.getApiList();
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
        });
      },

      getApiList: function(){
        var param = {
          pageSize: 2000,
          pageNo: 0
        };
        return this.app.get(param).then(function(data){
          data = data.data;
          if (data.code) {
            this.alert(data.err);
            return;
          }
          // 设置到数据中
          this.apiList = data.data.list;
        });
      },


      alert: function(msg){
        alert(msg);
      }
    },
  }
</script>

<style>


</style>