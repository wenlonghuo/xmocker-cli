<template>
  <div class="js-editor" :class="{'fullScreen': status === 'full'}" @keyup.esc="exitFullScreen"  @click="exitClickFullScreen">
    <section class="js-editor-body">
      <section class="js-editor-header-normal" v-if="status !== 'full'">
        <h4>{{ title }}</h4>
        <Icon class="js-editor-icon" type="arrow-expand" size="20" @click.native="setFullScreen" v-if="status !== 'full'"></Icon>
      </section>
      <section class="js-editor-header-full" v-else>
        <h2>{{ title }}编辑</h2>
        <h3 style="margin: 10px 0;">说明：</h3>
        <slot name="tips" class="js-editor-tooltip" />
        <h3 style="margin: 10px 0;">状态：</h3>
        <slot name="errMsg" />
      </section>
      <MonacoEditor class="js-editor-container" ref="editor" :style="editorSize" :language="type" v-model="editorValue" @blur="editorBlur" @focus="editorFocus" />
      <section class="js-editor-errMsg-c" v-if="status !== 'full'">
        <slot name="errMsg" />
      </section>
    </section>
  </div>
</template>

<script>
import MonacoEditor from 'vue-monaco'

export default {
  name: 'js-editor',
  data () {
    return {
      editorValue: '',
      status: 'normal',
      resize: 0
    }
  },
  props: {
    value: String,
    title: String,
    type: {
      type: String,
      default: 'javascript',
    },
    normalLine: {
      type: String,
      default: '12'
    },
    focusLine: {
      type: String,
      default: '20'
    }
  },
  components: {
    MonacoEditor,
  },
  computed: {
    editorSize () {
      const unit = 22
      let height = document.documentElement.clientHeight * 0.94 - 20
      let width = document.documentElement.clientWidth * 0.9 - 250 - 20
      const status = this.status
      if (status === 'normal' || status === 'focus') {
        height = status === 'normal' ? this.normalLine * unit : this.focusLine * unit
        const el = this.$el
        if (el) {
          width = el.getBoundingClientRect().width - 2
        }
      }
      const style = {
        height: height + 'px',
        width: width + 'px',
        opacity: this.resize > -1 ? 1 : 0
      }
      if (this.editor) {
        this.editor.layout({
          width,
          height,
        })
      }
      return style
    }
  },
  watch: {
    'value': function (newval) {
      this.setEditorValue()
    },
  },
  created () {
    this.resizeFunc = () => {
      this.resize++
    }
  },
  mounted () {
    this.editor = this.$refs.editor.getMonaco()
    this.setEditorValue()
    window.addEventListener('resize', this.resizeFunc)
  },
  destroyed () {
    window.removeEventListener('resize', this.resizeFunc)
  },
  methods: {
    setFullScreen () {
      this.status = 'full'
    },
    exitFullScreen () {
      this.status = 'normal'
    },
    exitClickFullScreen (e) {
      if (~e.target.className.split(' ').indexOf('js-editor') && this.status === 'full') {
        this.exitFullScreen()
      }
    },
    setEditorValue () {
      clearTimeout(this.timeHd)
      if (!this.editor) {
        this.editor = this.$refs.editor.getMonaco()
        this.timeHd = setTimeout(() => {
          this.setEditorValue()
        }, 0)
        return
      }
      if (this.editorValue !== this.value) {
        this.editorValue = this.value
      }
      this.resize++
    },
    editorBlur (...args) {
      if (this.status !== 'full') {
        this.status = 'normal'
      }
      this.$emit('input', this.editorValue)
      this.$emit('blur', ...args)
    },
    editorFocus (...args) {
      if (this.status !== 'full') {
        this.status = 'focus'
      }
      this.$emit('focus', ...args)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.js-editor {
  position: relative;
  line-height: 1.5;
}
.js-editor.fullScreen {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items center;
  .js-editor-header-full {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 250px;
    padding: 20px;
    background-color: #fff;
    border-right: 1px solid #efefef;
    overflow auto;
  }
  .js-editor-body {
    width: 90%;
    height: 94%;
    border-radius: 2px;
    padding: 10px;
    overflow hidden
    position relative
    background-color: #fff;
    .js-editor-container {
      margin-left: 250px;
    }
  }
  .js-editor-tooltip {
    min-height: 200px;
  }
}

.js-editor-header-normal {
  position: relative;
  height: 34px;
  h4 {
    margin-left: 60px;
    margin-right: 40px;
    border-bottom: 1px solid #efefef;
  }
  .js-editor-icon {
    position: absolute;
    right 20px
    top 5px
  }
}
.js-editor-errMsg-c {
  padding-left: 60px;
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
