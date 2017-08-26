<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">

      <div class="api-basic-left">
        <div>
          <Form-item v-for="item in simpleItem" :prop="item.key" :label="item.label" :key="item.label">
            <Input v-model="formValidate[item.key]" :placeholder="'请输入' + item.label" v-if="!item.type"></Input>

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
            ></Input>
          </Form-item>
        </div>
        <div>

          <Form-item class="cus-form-json-editor" label="mock数据">
            <jsonEditor v-if="formValidate.data" v-model="formValidate.data" editorHeight="5" minLine="5"></jsonEditor>
            <Button type="ghost" size="small" v-else @click.native="addBaseData('data')">添加</Button>
          </Form-item>

          <Form-item class="cus-form-json-editor" label="输入参数模板">
            <jsonEditor v-if="formValidate.inputParam" v-model="formValidate.inputParam" editorHeight="5" minLine="5"></jsonEditor>
            <Button type="ghost" size="small" v-else @click.native="addBaseData('inputParam')">添加</Button>
          </Form-item>

          <Form-item class="cus-form-json-editor" label="输出参数模板">
            <jsonEditor v-if="formValidate.outputParam" v-model="formValidate.outputParam" editorHeight="5" minLine="5"></jsonEditor>
            <Button type="ghost" size="small" v-else @click.native="addBaseData('outputParam')">添加</Button>
          </Form-item>

          <Form-item class="cus-form-json-editor" label="输出处理函数">
            <jsEditor v-if="formValidate.afterFunc" v-model="formValidate.afterFunc" editorHeight="5" minLine="5"></jsEditor>
            <Button type="ghost" size="small" v-else @click.native="addBaseData('afterFunc', ' ')">添加</Button>
          </Form-item>
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
          method: 'POST',
          url: '/api',
          path: 'func',
          pathEqual: '',
          delay: 0,
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
    },
    methods: {
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

<style>
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
</style>
