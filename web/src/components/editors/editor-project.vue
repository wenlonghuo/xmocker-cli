<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
    <Row>
      <Col span="12">
        <Form-item prop="name" label="项目名称">
          <Input v-model="formValidate.name" placeholder="请输入项目名称"></Input>
        </Form-item>
      </Col>
      <Col span="12">
        <Form-item prop="shortcut" label="简称">
          <Input v-model="formValidate.shortcut" placeholder="请输入简称"></Input>
        </Form-item>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <Form-item prop="path" label="项目路径">
          <Input v-model="formValidate.path" placeholder="请输入路径"></Input>
        </Form-item>
      </Col>
      <Col span="12">
        <Form-item prop="port" label="端口">
          <Input-number :max="65536" :min="1" v-model="formValidate.port" placeholder="请输入端口号"></Input-number>
        </Form-item>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <Form-item label="父级项目" prop="parentId">
          <Select v-model="formValidate.parentId" placeholder="请选择父级项目">
            <Option value="">无</Option>
            <Option v-for="item in projectList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </Form-item>
      </Col>
      <Col span="12">
        <Form-item prop="proxyTo" label="404代理至">
          <Input v-model="formValidate.proxyTo" placeholder="请输入代理网址"></Input>
        </Form-item>
      </Col>
    </Row>
    <Form-item prop="injectHtml" label="html注入">
      <i-switch v-model="formValidate.injectHtml">
        <span slot="open">开</span>
        <span slot="close">关</span>
      </i-switch>
    </Form-item>
    <Row>
      <Col span="12">
        <Form-item class="cus-form-json-editor" label="静态资源">
          <jsonEditor v-model="formValidate.staticPath"></jsonEditor>
        </Form-item>
      </Col>
      <Col span="12">
        <Form-item class="cus-form-json-editor" label="代理">
          <jsonEditor v-model="formValidate.proxyTable"></jsonEditor>
        </Form-item>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <Form-item class="cus-form-json-editor" label="URL列表">
          <jsonEditor v-model="formValidate.urls"></jsonEditor>
        </Form-item>
      </Col>
      <Col span="12">
        <Form-item class="cus-form-json-editor" label="GULP">
          <jsonEditor v-model="formValidate.gulp"></jsonEditor>
        </Form-item>
      </Col>
    </Row>

    <Form-item>
      <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
    </Form-item>
  </Form>
</template>
<script>
  import jsonEditor from '../code-editor/json-editor.vue'
  import { addProject, editProject } from '../../api/api.js'

  export default {
    data () {
      return {
        formValidate: {
          name: '',
          shortcut: '',
          path: '',
          port: 8080,
          parentId: '',
          proxyTo: '',
          injectHtml: true,
          proxyTable: [],
          staticPath: [],
          urls: [],
          gulp: {},
        },
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
      jsonEditor
    },
    mounted () {
      this.checkProjectList().then(() => {
        if (this.$route.query.id) {
          let id = this.$route.query.id
          let proj = this.$store.state.project.list.find((p) => { return p._id === id })
          if (proj) {
            this.copyToObj(this.formValidate, proj)
            this.formValidate.id = proj._id
          } else {
            this.$Message.error('项目未找到！')
          }
        }
      })
    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.postProject(this.formValidate).then((data) => {
              if (!data.code) {
                this.$Message.success(data.message)
                this.freshProject()
              }
            })
          } else {
            this.$Message.error('表单验证失败!')
          }
        })
      },
      postProject () {
        let func = this.formValidate.id ? editProject : addProject
        return func.apply(this, arguments)
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
