<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
    <Form-item v-for="item in simpleItem" :prop="item.key" :label="item.label" :key="item.label">
      <Input v-model="formValidate[item.key]" :placeholder="'请输入' + item.label" v-if="!item.type"/>
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
      />
    </Form-item>

    <Form-item>
      <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
      <Button type="primary" @click="handleUpgrade()">导入以前版本的数据库</Button>
    </Form-item>
  </Form>
</template>
<script>
export default {
  data () {
    return {
      formValidate: {
        remoteAddress: '',
        managePort: 6001,
      },
      simpleItem: [
        {label: '服务器地址', key: 'remoteAddress'},
        {label: '修改程序端口', key: 'managePort'},
      ],
      ruleValidate: {

      }
    }
  },
  computed: {
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
    handleUpgrade (name) {
      this.$emit('upgrade')
    },
  }
}
</script>

<style>
.cus-textarea>textarea{
  resize: none;
}
</style>
