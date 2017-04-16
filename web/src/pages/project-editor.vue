<template>
<Card>
  <p slot="title">
    {{title}}
  </p>
  <editorProject></editorProject>
</Card>
</template>
<script>
import editorProject from '../components/editors/editor-project.vue'
export default {
  name: 'projectEditor',
  data () {
    return {
    }
  },
  computed: {
    title () {
      return this.$route.query.id ? '项目编辑' : '项目新增'
    },
  },
  components: {
    editorProject,
  },
  watch: {

  },
  mounted () {

  },
  methods: {
  },
}
</script>
