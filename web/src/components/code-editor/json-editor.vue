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
  props: {
    value: {
    },
    editorHeight: {
      type: String,
      default: '10',
    },
    minLine: {
      type: String,
      default: '10',
    },
  },
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
      var val = this.value
      if (typeof this.value === 'string') {
        try {
          val = JSON.parse(this.value)
        } catch (e) {
          val = this.value
        }
      }

      val = JSON.stringify(val, null, 2)
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
