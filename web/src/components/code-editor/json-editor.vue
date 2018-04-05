<template>
  <js-editor
    v-model="editorValue"
    :title="title"
    type="json"
    :normalLine="normalLine"
    :focusLine="focusLine"
    @blur="editorBlur">
      <slot name="tips" slot="tips"></slot>
      <p slot="errMsg" v-html="errMsg" class="js-editor-err"></p>
    </js-editor>
</template>
<script>
import jsEditor from './js-editor.vue'
import formatter from '../../assets/js/formatJson.js'

const parserJSON = formatter.formatJson

export default {
  name: 'json-editor',
  data () {
    return {
      editorValue: '',
      dealedValue: '',
      errMsg: '',
      prettyJson: true
    }
  },
  components: {
    jsEditor,
  },
  props: {
    value: [String, Object, Array],
    title: String,
    type: {
      type: String,
      default: 'javascript',
    },
    normalLine: {
      type: String,
      default: '10'
    },
    focusLine: {
      type: String,
      default: '20'
    }
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
          this.$emit('input', val)
        } catch (e) {
          val = this.value
        }
      }

      val = typeof val === 'string' ? val : JSON.stringify(val, null, 2)
      var editorObj
      try {
        editorObj = JSON.parse(this.editorValue)
        editorObj = JSON.stringify(editorObj)
      } catch (e) {
        editorObj = ''
      }
      if (val !== editorObj) this.editorValue = val
    },
    editorBlur (e) {
      this.textChange()
      this.$emit('input', this.dealedValue)
      this.$emit('blur', this.dealedValue)
    },
    toastError (e) {
      this.$emit('error', e)
    },
    textChange (e) {
      this.dealedValue = this.editorValue

      this.replaceText()
      // 转换
      this.parseText()
    },
    replaceText () {
      // 删除字符
      if (this.regex) {
        try {
          var reg = new RegExp(this.regex, 'g')
          this.dealedValue = this.dealedValue.replace(reg, '')
        } catch (e) {
          this.errorDeal(e.message)
          console.warn(e)
        }
      }
    },
    prettyText () {
      this.textInfo = this.findLine(this.dealedValue)
      try {
        return parserJSON(this.dealedValue)
      } catch (e) {
        this.errorDeal(this.getError(this.dealedValue, e.message))
        console.warn(e)
      }
    },
    parseText () {
      this.textInfo = this.findLine(this.dealedValue)
      const value = this.parseLoose(this.dealedValue)
      if (value != null) this.successDeal(value)
    },
    parseLoose (msg) {
      try {
        var func = new Function('return ' + msg.replace(/^\n*/, ''))
        return func()
      } catch (e) {
        this.parseStrict(msg)
      }
    },
    parseStrict (msg) {
      try {
        return JSON.parse(msg)
      } catch (e) {
        this.errorDeal(this.getError(this.dealedValue, e.message))
        console.warn(e)
      }
    },
    successDeal (msg) {
      this.dealedValue = typeof msg !== 'string' ? JSON.stringify(msg, null, 2) : msg
      this.errMsg = ''
    },
    errorDeal (err) {
      this.errMsg = err
      this.$emit('error', err)
      if (this.prettyJson) {
        const value = this.prettyText()
        if (value != null) {
          this.dealedValue = value
          this.editorValue = this.dealedValue
        }
      }
    },
    getError (text, err) {
      if (!err) return
      var errPos = err.match(/\d*$/)
      if (!errPos) return
      var codePos = parseInt(errPos[0])

      var posArr = this.textInfo.pos
      var lineIndex = posArr.findIndex(p => p > codePos)

      if (lineIndex == null) return
      var str = ''
      var curLine = lineIndex - 1 >= 0 ? lineIndex - 1 : 0

      if (lineIndex - 2 >= 0) {
        str += text.slice(posArr[lineIndex - 2], posArr[lineIndex - 1])
      }

      if (curLine >= 0) {
        str += text.slice(posArr[curLine], codePos) + '<b class="editor-error-pos">' + text[codePos] + '</b>'
        str += text.slice(codePos + 1, posArr[lineIndex])
      }

      return err + '<br>line:' + (lineIndex + 1) + ' <br> position: ' + (codePos - posArr[curLine]) + '<pre>' + str + '</pre>'
    },
    findLine (text = '', option) {
      var reg = /\n/g
      var r = reg.exec(text)
      var result = {
        len: [],
        pos: [],
      }
      while (r) {
        result.pos.push(r.index)
        var lastIndex = result.pos.length - 2
        var str
        if (lastIndex >= 0) {
          str = text.slice(result.pos[lastIndex], r.index - 1)
        } else {
          str = text.slice(0, r.index)
        }
        result.len.push(this.byteLen(str))
        r = reg.exec(text)
      }
      result.len.push(this.byteLen(text.slice(result.pos[result.pos.length - 1], text.length - 1)))
      return result
    },
    byteLen (str) {
      if (str == null) return 0
      if (typeof str !== 'string') {
        str += ''
      }
      /* eslint-disable no-control-regex */
      return str.replace(/[^\x00-\xff]/g, '01').length
    },
  },
}
</script>
