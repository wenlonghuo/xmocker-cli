<template>
<Card class="baseconfig-card">
  <editorConfig @submit="handleSubmit" @upgrade="handleUpgrade" :info="info"></editorConfig>
</Card>
</template>
<script>
import { setBase, getBase, upgrade } from '@/api/api.js'
import editorConfig from '~components/editors/editor-base.vue'
export default {
  name: 'config-editor',
  data () {
    return {
      info: {},
    }
  },
  computed: {
    projectList () {
      return this.$store.getters['project/selector']
    },
  },
  components: {
    editorConfig,
  },
  watch: {
  },
  created () {
    this.getAppBase()
  },
  methods: {
    getAppBase () {
      return getBase({}).then((res) => {
        if (!res.code) {
          this.info = res.data.result || {}
        }
      })
    },
    handleSubmit (item) {
      return setBase(item).then((data) => {
        if (!data.code) {
          this.$Message.success(data.data.tip)
        }
      })
    },
    handleUpgrade () {
      return upgrade({}).then((data) => {
        if (!data.code) {
          this.$Message.success(data.data.tip)
        }
      })
    },
  }
}
</script>

<style scoped>
.baseconfig-card {
  width: 600px;
  margin: 0 auto;
}
</style>
