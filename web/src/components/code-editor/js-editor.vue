<template>
  <div class="js-editor" :class="{'fullScreen': isFull}" @keyup.esc="exitFullScreen">
    <div class="js-editor-bar">
      <Icon type="arrow-shrink" size="16" @click.native="exitFullScreen" v-if="isFull"></Icon>
      <Icon type="arrow-expand" size="16" @click.native="setFullScreen" v-if="!isFull"></Icon>
    </div>
    <code-editor class="raw-editor" v-model="editorValue" @blur="btnChange" :editorHeight="eHeight" :minLine="minLine" :focus="needFocus"></code-editor>
    <div v-html="errMsg" v-if="errMsg" class="js-editor-err"></div>
  </div>
</template>

<script>
import codeEditor from './code-editor.vue'
import formatter from '../../assets/js/formatJson.js'

var parserJSON = formatter.formatJson

export default {
  name: 'js-editor',
  data () {
    return {
      textInfo: {
        len: [],
        pos: [],
      },
      errMsg: '',
      editorValue: '',
      dealedValue: '',
      isFull: false,
      storageName: 'prettyjson-config',
      eHeight: '',
      needFocus: 0,
    }
  },
  props: {
    value: {
      type: String,
    },
    type: {
      type: String,
      default: 'javascript',
    },
    regex: {
      type: String,
      default: '\\n\\s*@[^\\n]*',
    },
    tabSize: {
      type: Number,
      default: 2,
    },
    editorHeight: {
      type: String,
      default: '10'
    },
    minLine: {
      type: String,
      default: '10'
    },
    theme: {
      type: String,
      default: 'dracula',
    },
    prettyJson: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    codeEditor: codeEditor,
  },
  watch: {
    'value': function (newval) {
      if (this.editorValue !== newval) {
        this.editorValue = newval
      }
    },
    'regex': function () {
      this.btnChange()
    },
    'tabSize': function () {
      this.btnChange()
    },
    'prettyJson': function () {
      // if (this.prettyJson) this.prettyText()
    },
  },
  mounted () {
    this.editorValue = this.value
    this.eHeight = this.editorHeight
  },
  methods: {
    setFullScreen () {
      this.isFull = true
      this.tempHeight = this.eHeight
      this.eHeight = '100%'
      this.needFocus = +new Date()
    },
    exitFullScreen () {
      this.isFull = false
      this.eHeight = this.tempHeight
    },
    btnChange (e) {
      this.textChange()
      this.$emit('input', this.dealedValue)
      this.$emit('blur', this.dealedValue)
    },
    textChange (e) {
      this.dealedValue = this.editorValue

      if (this.type !== 'json') {
        return
      }

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
          throw e
        }
      }
    },
    prettyText () {
      this.textInfo = this.findLine(this.dealedValue)
      try {
        return parserJSON(this.dealedValue)
      } catch (e) {
        this.errorDeal(this.getError(this.dealedValue, e.message))
        throw e
      }
    },
    parseText () {
      this.textInfo = this.findLine(this.dealedValue)
      this.successDeal(this.parseLoose(this.dealedValue))
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
        throw e
      }
    },
    successDeal (msg) {
      this.dealedValue = JSON.stringify(msg, null, ~~this.tabSize)
      this.errMsg = ''
      if (this.prettyJson) {
        this.dealedValue = this.prettyText()
        this.editorValue = this.dealedValue
      }
    },
    errorDeal (err) {
      this.errMsg = err
      this.$emit('error', err)
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
    findLine (text, option) {
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
      return str.replace(/[^\x00-\xff]/g, '01').length
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="stylus">
.js-editor {
  position: relative;
}
.js-editor.fullScreen {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  height: 100%;
  width: 100%;
  background: #fff;
}
.js-editor.fullScreen .raw-editor {
  width: calc(100% - 300px);
  border-right: 1px solid #efefef;
}
.js-editor.fullScreen .js-editor-err {
  position: fixed;
  top: 50px;
  right: 0;
  width: 300px;
}

.js-editor {
  border: 1px solid #efefef;
}
.js-editor-bar {
  position: absolute;
  top:0;
  right: 0;
  line-height: 1.25;
  z-index: 10;
}
.js-editor-bar i {
  cursor: pointer;
  padding: 5px 8px;
}
.js-editor.fullScreen .js-editor-bar i {
  padding: 15px;
  font-size: 24px!important;
}
.js-editor-err {
  line-height: 1.25;
  padding: 5px 10px;
}


.js-editor ::-webkit-scrollbar {  
  width: 4px; 
}

/*定义滚动条轨道 内阴影+圆角*/  
.js-editor ::-webkit-scrollbar-track {  
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);  
  border-radius: 10px;
}

/*定义滑块 内阴影+圆角*/  
.js-editor ::-webkit-scrollbar-thumb {  
  border-radius: 10px;  
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
}
.editor-error-pos {
  color: red;
}
</style>
