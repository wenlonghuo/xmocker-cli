<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">

      <div class="api-basic-left">
        <div>
          <Form-item v-for="item in simpleItem" :prop="item.key" :label="item.label" :key="item.label">
            <Input v-model="formValidate[item.key]" :placeholder="'请输入' + item.label" v-if="!item.type"/>

            <Select v-model="formValidate[item.key]" style="width:100px" v-if="item.type === 'select'">
              <Option v-for="mItem in methodList" :value="mItem.value" :key="mItem.value">{{ mItem.label }}</Option>
            </Select>

            <Input
              v-model="formValidate[item.key]"
              type="textarea"
              v-if="item.type === 'textarea'"
              :autosize="{minRows: 2,maxRows: 5}"
              :placeholder="'请输入' + item.label"
              class="cus-textarea"
            />
          </Form-item>
        </div>
        <div>

          <section class="cus-form-json-editor">
            <jsonEditor v-if="formValidate.data" v-model="formValidate.data" title="mock数据">
              <div slot="tips">
                <h3>mock数据</h3>
                <ul>
                  <li>类型： Object</li>
                  <li>默认： {}</li>
                  <li>说明： 要输出的mock数据，对象格式</li>
                </ul>
              </div>
            </jsonEditor>
            <Button type="text" class="cus-form-json-editor-add" size="small" v-else @click.native="addBaseData('data')">添加 mock数据</Button>
          </section>

          <section class="cus-form-json-editor">
            <jsonEditor v-if="formValidate.inputParam" v-model="formValidate.inputParam" title="输入参数模板">
              <div slot="tips">
                <h3>输入参数模板</h3>
                <ul>
                <li>类型： Object</li>
                <li>默认: {}</li>
                <li>示例<pre style="font-size: 12px;"><code lang="javascript">{
  "type": "object",
  "properties": {
  "func": {
    "type": "string",
    "required": true
  },
  "token": {
    "type": "string"
  },
  "params": {
    "type": "object"
  }
}</code></pre>
                </li>
                <li>说明： 校验输入参数的模板，规则是json-gate类型，具体可见<a href="https://github.com/oferei/json-gate">https://github.com/oferei/json-gate</a>。<blockquote>
                <p>注意：本项目对json-gate进行了改写，当输入参数为String类型，而定义的类型为其他，会执行<code>JSON.parse</code>命令尝试转换。</p>
                </blockquote>
                </li>
                </ul>
              </div>
            </jsonEditor>
            <Button type="text" class="cus-form-json-editor-add" size="small" v-else @click.native="addBaseData('inputParam')">添加 输入参数模板</Button>
          </section>

          <section class="cus-form-json-editor">
            <jsonEditor v-if="formValidate.outputParam" v-model="formValidate.outputParam" title="输出参数模板">
              <div slot="tips">
                <h3>输出参数模板</h3>
                <ul>
                <li>类型： Object</li>
                <li>默认： {}</li>
                <li>说明： 与输入参数类似。本参数尚未使用，后续用于生成文档。</li>
                </ul>
              </div>
            </jsonEditor>
            <Button type="text" class="cus-form-json-editor-add" size="small" v-else @click.native="addBaseData('outputParam')">添加 输出参数模板</Button>
          </section>

          <section class="cus-form-json-editor">
            <jsEditor v-if="formValidate.afterFunc" v-model="formValidate.afterFunc" title="输出处理函数">
              <div slot="tips">
                <h3>输出处理函数</h3>
                <ul>
                <li>类型： String</li>
                <li>默认： ''</li>
                <li>说明： 输出时执行的函数。实现方式与判断条件类型，但传入参数只有两个： params和data。params中URL传入的参数，data是填写的mock数据。返回结果为Object类型时，输入的是函数返回的结果</li>
                </ul>
              </div>
            </jsEditor>
            <Button type="text" class="cus-form-json-editor-add" size="small" v-else @click.native="addBaseData('afterFunc', ' ')">添加 输出处理函数</Button>
          </section>
        </div>

      </div>

      <div style="clear: both;"></div>
      <Form-item>
        <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
      </Form-item>

  </Form>
</template>
<script>
import jsonEditor from '../code-editor/json-editor.vue'
import jsEditor from '../code-editor/js-editor.vue'
export default {
  data () {
    return {
      formValidate: {
        name: '',
        method: 'GET',
        url: '/api',
        path: '',
        pathEqual: '',
        delay: 200,
        description: '',
        project: '',
        afterFunc: null,
        inputParam: null,
        outputParam: null,
        data: null,
      },
      methodList: [
        {value: 'GET', label: 'GET'},
        {value: 'POST', label: 'POST'},
        {value: 'PUT', label: 'PUT'},
        {value: 'DELETE', label: 'DELETE'},
        {value: 'PATCH', label: 'PATCH'},
      ],
      simpleItem: [
        {label: '名称', key: 'name'},
        {label: '方法', key: 'method', type: 'select'},
        {label: 'URL', key: 'url'},
        {label: '二级路径', key: 'path'},
        {label: '二级路径字段预期值', key: 'pathEqual'},
        {label: '延时设置', key: 'delay'},
        {label: '描述', key: 'description', type: 'textarea'},
      ],
      ruleValidate: {
        name: [{
          trigger: 'blur',
          message: '请填写项目名称',
          required: true,
        }],
        shortcut: [{
          message: '请填写项目简称',
          required: true,
        }],
        port: [{
          type: 'number',
          required: true,
        }],
      }
    }
  },
  computed: {
    projectList () {
      return this.$store.getters['project/selector']
    },
  },
  components: {
    jsonEditor,
    jsEditor,
  },
  props: {
    info: {
      type: Object
    }
  },
  watch: {
    info () {
      this.copyToObj(this.formValidate, this.info, [['id', '_id']])
    }
  },
  mounted () {
    let query = this.$route.query
    if (query.project) {
      this.formValidate.project = query.project
    }
    this.copyToObj(this.formValidate, this.info, [['id', '_id']])
    window.addEventListener('keydown', this.saveListener)
  },
  unmounted () {
    window.removeEventListener('keydown', this.saveListener)
  },
  methods: {
    saveListener (e) {
      if (e.key === 's' && e.metaKey) {
        this.handleSubmit('formValidate')
        e.preventDefault()
      }
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$emit('submit', this.formValidate)
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },
    addBaseData (type, defaultValue) {
      if (this.formValidate[type] !== undefined) {
        this.formValidate[type] = defaultValue || {}
      }
    },
  }
}
</script>

<style scoped>
.cus-textarea>textarea{
  resize: none;
}
.api-basic-left {
  min-width: 400px;
}
.api-basic-left>div:first-child {
  width: 250px;
  float: left;
  padding-right: 10px;
  border-right: 1px solid #efefef;
}
.api-basic-left>div:last-child {
  width: auto;
  overflow: hidden;
  padding-left: 10px;
}
.cus-form-json-editor {
  padding: 10px 0;
}
.cus-form-json-editor-add {
  margin-left: 60px;
}
</style>
