<template>
<Card>
  <p slot="title">
    模板信息管理
  </p>
  <template slot="extra">
      <a href="javascript:void(0)" v-for="item in topBarItems" :key="item.action" style="margin-right: 10px;">
        <Icon :type="item.type" color="#9ea7b4" @click.native="btnAction(item.action)"></Icon>
      </a>
  </template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
    <Form-item prop="name" label="名称">
      <Input v-model="formValidate.name" placeholder="请输入名称"></Input>
    </Form-item>
    <Form-item prop="type" label="类型">
      <Select v-model="formValidate.type" style="width:100px">
        <Option v-for="mItem in typeList" :value="mItem.value" :key="mItem.value">{{ mItem.label }}</Option>
      </Select>
    </Form-item>
    <Form-item prop="description" label="说明">
      <Input v-model="formValidate.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入说明"></Input>
    </Form-item>

    <Form-item class="cus-form-json-editor" label="模板">
      <jsonEditor v-model="formValidate.model" editorHeight="15" minLine="15"></jsonEditor>
    </Form-item>

    <Form-item>
      <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
    </Form-item>
  </Form>
    
</Card>
</template>
<script>
  import jsonEditor from '../code-editor/json-editor.vue'
  export default {
    data () {
      return {
        formValidate: {
          name: '',
          type: 'NORMAL',
          description: '',
          model: {},
        },
        typeList: [
          {value: 'ERROR', label: '错误'},
          {value: 'SCHEMA', label: '参数模板'},
          {value: 'NORMAL', label: '普通数据'},
        ],
        ruleValidate: {
          name: [{
            trigger: 'blur',
            message: '请填写项目名称',
            required: true,
          }],
        },
        topBarItems: [
          // {name: '设为默认', type: 'bookmark', action: 'btnEdit'},
          // {name: '删除', type: 'android-remove-circle', action: 'btnDelete'},
        ],
      }
    },
    props: {
      info: {
        type: Object
      }
    },
    computed: {

    },
    components: {
      jsonEditor,
    },
    watch: {
      info () {
        this.copyToObj(this.formValidate, this.info, [['id', '_id']])
      }
    },
    mounted () {
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
      btnDelete () {
        this.$Modal.confirm({
          title: '是否删除该API？',
          content: '<p>删除后将相关的分支均会删除且无法恢复</p>',
          onOk: () => {
            this.$emit('delete', {id: this.info._id})
          },
        })
      },
    }
  }
</script>

<style scoped>
.cus-form-json-editor {
  width: 100%;
}
.cus-form-json-editor>span {
  flex-basis: 80px;
}
</style>
