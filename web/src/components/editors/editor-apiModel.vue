<template>
<Card>
  <div class="editor-api-model-top">
    <div>
      <span v-if="shrink">分支：{{formValidate.name}}</span>
    </div>
    <div>
      <i-switch v-model="shrink" size="large" class="editor-api-model-switch">
        <span slot="open">展开</span>
        <span slot="close">收起</span>
      </i-switch>
      <a href="javascript:void(0)" v-for="item in topBarItems" :key="item.action" style="margin-right: 10px;">
        <Icon :type="item.type" color="#9ea7b4" size="large" @click.native="btnAction(item.action)"></Icon>
      </a>
    </div>
  </div>
  <template v-if="!shrink">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
      <Form-item prop="name" label="名称">
        <Input v-model="formValidate.name" placeholder="请输入名称"/>
      </Form-item>

      <div class="cus-form-json-editor">
        <jsEditor v-model="formValidate.condition" title="判断条件">
          <div slot="tips">
            <h3>判断条件</h3>
            <ul>
  <li>类型： String</li>
  <li>默认： ''</li>
  <li>示例：</li>
  </ul>
  <pre><code class="lang-javascript">paramsKey.<span class="hljs-keyword">type</span> <span class="hljs-type">== </span><span class="hljs-number">0</span>

  或者
  paramsKey = JSON.parse(paramsKey)
  <span class="hljs-keyword">return</span> paramsKey.<span class="hljs-keyword">type</span> <span class="hljs-type">== </span><span class="hljs-number">0</span>

  </code></pre>
  <ul>
  <li><p>说明： 根据输入参数进行判断，返回值为真类型时，认为当前条件符合，不在继续查找；返回假类型数据时认为条件不符合；未填写时，认为当前分支为默认分支，在遍历其他分支未找到时，认为本分支为目标分支。实际上填写的内容是处于一个function之内的内容，没有<code>return</code> 关键字则自动添加<code>return</code>。所有url中:id形式的参数，从url传过来的search，body中传过来的对象，合在一起形成的对象，将各key传入到入参中。调用为。：</p>
  <pre><code class="lang-javascript"><span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-params">(<span class="hljs-rest_arg">...params</span>)</span></span>
  </code></pre>
  </li>
  <li><p>调用时<code>this</code>指向 koa中的<code>ctx</code>。</p>
  </li>
  </ul>
          </div>
        </jsEditor>
      </div>
      <div class="cus-form-json-editor">
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
      </div>

      <div class="cus-form-json-editor">
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
      </div>

      <div class="cus-form-json-editor">
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
      </div>

      <div class="cus-form-json-editor">
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
      </div>

      <Form-item>
        <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
      </Form-item>
    </Form>
  </template>
</Card>
</template>
<script>
import jsonEditor from '../code-editor/json-editor.vue'
import jsEditor from '../code-editor/js-editor.vue'
export default {
  data () {
    return {
      shrink: true,
      formValidate: {
        name: '主干',
        condition: '',
        afterFunc: null,
        inputParam: null,
        outputParam: null,
        data: null,
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
        {name: '设为默认', type: 'md-checkmark', action: 'btnEdit'},
        {name: '删除', type: 'md-remove-circle', action: 'btnDelete'},
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
          this.$emit('delete', this.info)
        },
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
.editor-api-model-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
}
.cus-form-json-editor {
  width: 100%;
}
.cus-form-json-editor>span {
  flex-basis: 80px;
}
.cus-form-json-editor-add {
  margin-left: 60px;
}
.editor-api-model-switch {
  margin-right: 10px;
}
</style>
