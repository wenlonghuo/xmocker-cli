<template>
<div class="json-editor">
    <editorApi></editorApi>
</div>
</template>
<script>
import editorApi from '~components/editors/editor-api.vue'
export default {
  name: 'api-editor',
  data () {
    return {
      jsonData: '',
    }
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
