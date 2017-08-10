<template>
  <div class="search">
    <Input type="text" v-model="keyword" size="large" @on-enter="inputChange" @on-blur="inputChange" @on-change="delayChange" placeholder="请输入需要搜索的关键词">
      <Icon type="search" slot="prepend"></Icon>
    </Input>
    <section class="search-result" v-if="project.total">
      <header>
        <h2>项目搜索结果</h2>
        <a @click="getMore('project')">
          <Icon type="grid"></Icon>
          查看全部
        </a>
      </header>
      <main class="search-card-list">
        <projectCard v-for="(item, index) in project.list" :key="index"
          :name="item.name"
          :status="item.status"
          :shortcut="item.shortcut"
          :id="item._id"
          :path="item.path"
          :port="item.port"
          :proxyType="item.proxyType"
          :urlList="item.urls"
          :parentName="item.parentName"
          :parentId="item.parentId"
          :gulp="item.gulp"
          :staticPath="item.staticPath"
          :proxyTable="item.proxyTable"
          :fromSearch="true"
        ></projectCard>
        <div v-for="i in [1,2,3,4,5,6,7,8,9, 10]" :key="i" style="height: 0;margin: 0;"></div>
      </main>
    </section>
    <section class="search-result" v-if="api.total">
      <header>
        <h2>API搜索结果</h2>
        <a @click="getMore('api')">
          <Icon type="grid"></Icon>
          查看全部
        </a>
      </header>
      <main class="search-card-list">
        <apiCard v-for="(item, index) in api.list" :key="index" 
          :name="item.name"
          :id="item._id"
          :method="item.method"
          :project="item.project"
          :url="item.url"
          :path="item.path"
          :pathEqual="item.pathEqual"
          :delay="item.delay"
          :fixedOutput="item.fixedOutput"
          :description="item.description"
          :pageNo="item.pageNo"
          :fromSearch="true"
        ></apiCard>
        <div v-for="i in [1,2,3,4,5,6,7,8,9, 10]" :key="i" style="height: 0;margin: 0;"></div>
      </main>
    </section>
    <!-- <section class="search-result" v-if="lib.total">
      <header>
        <h2>库搜索结果</h2>
      </header>
      <main class="search-card-list">
        <projectCard v-for="(item, index) in lib.list" :key="index" :info="item"></projectCard>
      </main>
    </section> -->
  </div>
</template>
<script>
import apiCard from '../components/card/api-card.vue'
import projectCard from '../components/card/project-card.vue'
import { search } from '@/api/api.js'
export default {
  name: 'search',
  data () {
    return {
      keyword: '',
      pageSize: 6,
      project: {
        list: [],
        total: 0,
      },
      api: {
        list: [],
        total: 0,
      },
      lib: {
        list: [],
        total: 0,
      },
    }
  },
  components: {
    apiCard,
    projectCard,
  },
  mounted () {
    this.keyword = this.$route.query.keyword || ''
    this.getMaxNumber()
    this.inputChange()
  },
  methods: {
    getSearch () {
      search({
        keyword: this.keyword,
        pageNo: 0,
        pageSize: this.pageSize,
      }).then(res => {
        if (res.code) return
        this.setList(this.project, res.data.project)
        this.setList(this.api, res.data.api)
        this.setList(this.lib, res.data.lib)
      })
    },
    delayChange () {
      clearTimeout(this.delayHandle)
      this.delayHandle = setTimeout(() => {
        this.inputChange()
      }, 200)
    },
    inputChange () {
      clearTimeout(this.delayHandle)
      if (this.lastKeyword === this.keyword) return
      this.$router.replace({path: '/search', query: {keyword: this.keyword}})
      if (!this.keyword) return
      this.lastKeyword = this.keyword
      this.getSearch()
    },
    setList (info, data) {
      info.total = data.total
      info.list.splice(0, info.list.length)
      if (data.list) {
        info.list.push(...data.list)
      }
    },
    getMaxNumber () {
      let box = document.querySelector('.search')
      let rect = box.getBoundingClientRect()
      let num = Math.floor((rect.width - 20) / 316)
      this.pageSize = num * 2
    },
    getMore (type) {
      this.$router.push({path: '/search/detail', query: {type, keyword: this.keyword}})
    },
  },
}
</script>
<style scoped>
.search-result {
  margin-top: 30px;
}
.search-card-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  overflow-x: hidden;
}
.search-card-list div {
  flex-basis: 300px;
  flex-grow: 1;
  margin: 8px;
}
.search-result header {
  display: flex;
  justify-content: space-between;
}
.search-result header a {
  font-size: 14px;
  margin-right: 10px;
}
</style>
