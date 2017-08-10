<template>
  <div class="search">
    <Input type="text" v-model="keyword" size="large" @on-enter="inputChange" @on-blur="inputChange" @on-change="delayChange" placeholder="请输入需要搜索的关键词">
      <Icon type="search" slot="prepend"></Icon>
    </Input>
    <section class="search-result" v-if="type==='project'">
      <header>
        <h2>项目搜索结果</h2>
      </header>
      <main class="search-card-list" @scroll="scrollEvt">
        <projectCard v-for="(item, index) in list" :key="index"
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
    <section class="search-result" v-if="type==='api'">
      <header>
        <h2>API搜索结果</h2>
      </header>
      <main class="search-card-list" @scroll="scrollEvt">
        <apiCard v-for="(item, index) in list" :key="index" 
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
      type: 'project',
      pageSize: 20,
      pageNo: 0,
      list: [],
    }
  },
  components: {
    apiCard,
    projectCard,
  },
  mounted () {
    this.keyword = this.$route.query.keyword
    this.type = this.$route.query.type
    this.getSearch()
  },
  methods: {
    scrollEvt (e) {
      let top = e.target.scrollTop + e.target.offsetHeight
      let height = e.target.scrollHeight
      if (height - top > 30) return
      if (this.isLoading) {
        if (this.debounceScroll) return
        clearTimeout(this.debounceScroll)
        this.debounceScroll = null
        this.debounceScroll = setTimeout(() => {
          this.getSearch()
        }, 300)
      } else {
        this.getSearch()
      }
    },
    getSearch () {
      if (this.finish) return
      this.isLoading = true
      search({
        keyword: this.keyword,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        type: this.type,
      }).then(res => {
        this.isLoading = false
        if (res.code) return
        this.pageNo++
        if (res.data.pagination.pageNo >= res.data.pagination.pageCnt) this.finish = true
        this.list.push(...res.data.list)
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
      this.finish = false
      this.pageNo = 0
      this.list.splice(0, this.list.length)
      this.$router.replace({ path: '/search/detail', query: { type: this.type, keyword: this.keyword } })
      if (!this.keyword) return
      this.lastKeyword = this.keyword
      this.getSearch()
    },
  },
}
</script>
<style scoped>
.search {
  height: 100%;
}

.search-result {
  margin-top: 30px;
  height: calc(100% - 66px)
}
.search-card-list {
  margin-top: 10px;
  height: calc(100% - 46px);
  overflow-y: auto;
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
