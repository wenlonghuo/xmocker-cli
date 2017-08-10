<template>
<Card>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
    <div style="text-align: right;padding: 10px;">
      <a href="javascript:void(0)" v-for="item in topBarItems" :key="item.action" style="margin-right: 10px;">
        <Icon :type="item.type" color="#9ea7b4" @click.native="btnAction(item.action)"></Icon>
      </a>
    </div>
    <Row>
      <Col span="12">
        <Form-item prop="name" label="名称">
          <Input v-model="formValidate.name" placeholder="请输入名称"></Input>
        </Form-item>
      </Col>
    </Row>

    <Row>
      <Col span="12">
        <Form-item class="cus-form-json-editor" label="判断条件">
          <jsEditor v-model="formValidate.condition" editorHeight="5" minLine="5"></jsEditor>
        </Form-item>
      </Col>
      <Col span="12">
        <Form-item class="cus-form-json-editor" label="输入过滤函数">
          <jsEditor v-model="formValidate.afterFunc" editorHeight="5" minLine="5"></jsEditor>
        </Form-item>
      </Col>
    </Row>

    <Row>
      <Col span="12">
        <Form-item class="cus-form-json-editor" label="输入参数模板">
          <jsonEditor v-model="formValidate.inputParam" editorHeight="5" minLine="5"></jsonEditor>
        </Form-item>
      </Col>
      <Col span="12">
        <Form-item class="cus-form-json-editor" label="输出参数模板">
          <jsonEditor v-model="formValidate.outputParam" editorHeight="5" minLine="5"></jsonEditor>
        </Form-item>
      </Col>
    </Row>

    <Row>
      <Col span="12">
        <Form-item class="cus-form-json-editor" label="mock数据">
          <jsonEditor v-model="formValidate.data" editorHeight="10" minLine="10"></jsonEditor>
        </Form-item>
      </Col>
    </Row>

    <Form-item>
      <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
    </Form-item>
  </Form>
    
</Card>
</template>
<script>
  import jsonEditor from '../code-editor/json-editor.vue'
  import jsEditor from '../code-editor/js-editor.vue'
  export default {
    data () {
      return {
        formValidate: {
          name: '主干',
          condition: '',
          afterFunc: '',
          inputParam: {},
          outputParam: {},
          data: {},
          baseid: '',
        },
        ruleValidate: {
          name: [{
            trigger: 'blur',
            message: '请填写项目名称',
            required: true,
          }],
        },
        topBarItems: [
          {name: '设为默认', type: 'bookmark', action: 'btnEdit'},
          {name: '删除', type: 'android-remove-circle', action: 'btnDelete'},
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
      jsEditor,
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
