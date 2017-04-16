<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
    <Form-item v-for="item in simpleItem" :prop="item.key" :label="item.label" :key="item.label">
      <Input v-model="formValidate[item.key]" :placeholder="'请输入' + item.label" v-if="!item.type"></Input>
      <Select v-model="formValidate[item.key]" style="width:200px" v-if="item.type === 'select'">
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

    <Form-item>
      <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
    </Form-item>
  </Form>
</template>
<script>
  export default {
    data () {
      return {
        formValidate: {
          name: '',
          method: 'GET',
          url: '',
          path: '',
          pathEqual: '',
          delay: 0,
          description: '',
          project: '',
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
    }
  }
</script>

<style>
.cus-textarea>textarea{
  resize: none;
}
</style>
