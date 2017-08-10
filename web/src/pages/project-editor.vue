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
import bread from '../mixin/bread'
export default {
  name: 'projectEditor',
  data () {
    return {
    }
  },
  mixins: [bread],
  breadList () {
    let option = [
      { name: '项目列表', menuName: '项目列表' },
      { name: '新增项目' },
    ]
    if (this.$route.query.id) option[1].name = '编辑项目'
    if (this.$route.query.fromDetail) option.splice(1, 0, {name: '项目详情'})
    return option
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
