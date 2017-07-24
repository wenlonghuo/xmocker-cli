<template>
    <div class="codearea" :data-id="tid"></div>
</template>

<script>
import Vue from 'vue'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/fold/foldgutter.css'
// 主题
import 'codemirror/theme/midnight.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/theme/duotone-light.css'
import 'codemirror/theme/icecoder.css'
import 'codemirror/theme/material.css'
import 'codemirror/theme/panda-syntax.css'
import 'codemirror/theme/yeti.css'

var CodeMirror = require('codemirror/lib/codemirror.js')
require('codemirror/addon/edit/closebrackets.js')

require('codemirror/addon/fold/foldcode.js')
require('codemirror/addon/fold/foldgutter.js')
require('codemirror/addon/fold/brace-fold.js')
require('codemirror/addon/fold/indent-fold.js')

// // 自动高亮
// require('codemirror/addon/scroll/annotatescrollbar.js')
// require('codemirror/addon/search/matchesonscrollbar.js')
// require('codemirror/addon/search/searchcursor.js')
// require('codemirror/addon/search/match-highlighter.js')

require('codemirror/mode/javascript/javascript.js')

let editorOption = {
  mode: {name: 'javascript', json: true},
  lineNumbers: true,
  lineWrapping: true,
  foldGutter: true,
  theme: 'default',
  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true},
}

export default {
  name: 'code-editor',
  data () {
    return {
      Eoption: {
        ...editorOption,
      },
      tid: '',
    }
  },
  props: {
    value: {
      type: String,
    },
    option: {
      type: Object,
    },
    theme: {
      type: String,
    },
    minLine: {
      type: String,
      default: '10'
    },
    editorHeight: {
      type: String,
      default: '10'
    },
    focus: {
      type: Number,
    },
  },
  computed: {
    eHeight () {
      var eHeight = this.editorHeight
      if (!eHeight) {
        eHeight = '100%'
      } else {
        if (Number(eHeight)) {
          eHeight = (1.5 * eHeight + 1) + 'em'
        }
      }
      return eHeight
    },
  },
  created: function () {

  },
  watch: {
    'value': function (val) {
      this.setModelValue(val)
    },
    'editorHeight': function (val) {
      this.setEditorSize(this.eHeight)
    },
    'option': function (val) {
      if (!this.editor) return
      this.editor.setOption(val)
    },
    'theme': function (val) {
      if (!this.editor) return
      if (val) this.editor.setOption('theme', val)
    },
    'focus': function () {
      this.editor.focus()
    },
  },
  mounted () {
    this.tid = 'm-json-editor-' + +new Date() + this._uid
    Vue.nextTick(() => {
      var ele = document.querySelector('[data-id=' + this.tid + '')
      Object.assign(this.Eoption, this.option)
      this.editor = CodeMirror(ele, this.Eoption)
      this.editor.on('change', (e) => {
        this.$emit('input', e.getValue())
      })

      this.setEditorSize(this.eHeight)
      this.editor.on('blur', (e) => {
        this.$emit('blur', e.getValue())
      })
      this.setModelValue(this.value)
    })
  },
  methods: {
    setModelValue: function (val) {
      if (!this.editor) return
      val = val || ''
      if (this.editor.getValue() === val) return
      var char = this.editor.doc.getCursor()
      var lineNo = this.getValLine(val)
      var eLineNum = ~~this.minLine - lineNo - 1
      var emptyLine = this.gLine(eLineNum > 0 ? eLineNum : 0)
      this.editor.doc.setValue(val + emptyLine)
      this.editor.doc.setCursor(char)
    },
    setEditorSize (height) {
      if (!height || !this.editor) return
      this.editor.setSize('100%', height)
    },
    gLine (no) {
      var str = '\n'
      return str.repeat(~~no)
    },
    getValLine (str) {
      str = str || ''
      return (str.match(/\n/g) || []).length
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.codearea {
  width: 100%;
  height: 100%;
  min-height: 40px;
  text-align: justify;
  line-height: 1.5;
}
</style>
<style>
.cm-matchhighlight {background-color: lightgreen}
</style>
