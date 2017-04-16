<template>
  <js-editor v-model="jsonData"
    @blur="editorBlur" 
    type="json" 
    :prettyJson="true" 
    :editorHeight="editorHeight"
    :minLine="minLine"
    @error="toastError"
    id="m-prettyjson-editor"></js-editor>
</template>
<script>
import jsEditor from './js-editor.vue'
export default {
  name: 'json-editor',
  data () {
    return {
      jsonData: '',
    }
  },
  components: {
    jsEditor,
  },
  props: ['value', 'editorHeight', 'minLine'],
  watch: {
    value (newval) {
      this.setModelVal()
    },
  },
  mounted () {
    this.setModelVal()
  },
  methods: {
    setModelVal () {
      var val = JSON.stringify(this.value, null, 2)
      var editorObj
      try {
        editorObj = JSON.parse(this.jsonData)
        editorObj = JSON.stringify(editorObj)
      } catch (e) {
        editorObj = ''
      }
      if (val !== editorObj) this.jsonData = val
    },
    editorBlur (e) {
      try {
        var result = JSON.parse(this.jsonData)
      } catch (e) {
        console.log(e)
        return
      }
      this.$emit('input', result)
    },
    toastError (e) {
      this.$emit('error', e)
    },
  },
}
</script>
