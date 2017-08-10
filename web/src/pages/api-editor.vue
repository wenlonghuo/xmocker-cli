<template>
<div class="json-editor">
    <editorApi></editorApi>
</div>
</template>
<script>
import editorApi from '~components/editors/editor-api.vue'
import bread from '../mixin/bread'
export default {
  name: 'api-editor',
  data () {
    return {
      jsonData: '',
    }
  },
  mixins: [bread],
  breadList () {
    let option = [
      { name: '项目列表', menuName: '项目列表' },
      { name: '项目详情' },
      { name: '新增API' },
    ]
    if (this.$route.query.id) option[2].name = '编辑API'
    return option
  },
  components: {
    editorApi,
  },
  watch: {

  },
  mounted () {

  },
  methods: {

  },
}
</script>
