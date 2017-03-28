<template>
  <div>
    <div class="m-editor-json-area" name="aaa" :id="tid"></div>
  </div>
</template>

<script>
  var JSONEditor = require('jsoneditor/dist/jsoneditor.js')
  import 'jsoneditor/dist/jsoneditor.css'

  export default {
    name: 'json-editor',
    data: function () {
      return {

      }
    },
    computed: {
      tid: function () {
        return 'jsoneditor' + +new Date()
      },
    },
    mounted: function () {
      let ele = document.getElementById(this.tid)
      this.editor = new JSONEditor(ele, {modes: ['tree', 'text', 'form']})
      this.editor.setMode('tree')
      this.editor.setSchema({
        'title': 'Person',
        'type': 'object',
        'properties': {
          'firstName': {
            'type': 'string',
          },
          'lastName': {
            'type': 'string',
          },
          'age': {
            'description': 'Age in years',
            'type': 'integer',
            'minimum': 0,
          },
        },
        'required': ['firstName', 'lastName'],
      })
      this.editor.set({a: 1, b: 3, c: 3, d: 4, e: 6, f: 7, g: 8, h: 0})
    },
    methods: {
    },
  }
</script>
<style>

</style>