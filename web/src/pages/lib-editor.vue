<template>
<div class="json-editor">
    <editorLib class="lib-editor" @submit="submitItem" @delete="deleteItem" :info="info"></editorLib>
</div>
</template>
<script>
import editorLib from '~components/editors/editor-lib.vue'
import { getLibDetail, addLib, editLib, deleteLib } from '@/api/api.js'
export default {
  name: 'api-editor',
  data () {
    return {
      info: {},
    }
  },
  components: {
    editorLib,
  },
  watch: {

  },
  mounted () {
    let query = this.$route.query
    if (query.project) this.info = {project: query.project}
    if (query.id) {
      this.getLibDetail({id: query.id})
    }
  },
  methods: {
    getLibDetail (data) {
      return getLibDetail(data).then((res) => {
        if (!res.code) {
          if (res.data.result) this.info = res.data.result
        } else {
          this.$Message.error('API未找到！')
        }
      })
    },
    submitItem (data) {
      let func = data.id ? editLib : addLib
      func(data).then((data) => {
        if (!data.code) {
          this.$Message.success(data.data.tip)
          this.$router.replace({path: this.$route.fullPath, query: {id: data.data.result._id}})
        }
      })
    },
    deleteItem (data) {
      deleteLib(data).then((data) => {
        if (!data.code) {
          this.$router.go(-1)
        }
      })
    },
  },
}
</script>

<style scoped>
.lib-editor {
  max-width: 1024px;
  margin: 0 auto;
}
</style>

